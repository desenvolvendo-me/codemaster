import { rename, mkdir, copyFile, unlink } from 'fs/promises'
import { join } from 'path'
import { listNotes, readNote, createNote, updateNote } from './vault.js'
import { parseFrontmatter, generateFrontmatter } from '../utils/frontmatter.js'

// ── Constants ──────────────────────────────────────────────────────────────────

const STUDY_RECOMMENDATIONS = {
  business: 'métricas de produto, estratégias de pricing, customer segmentation',
  architecture: 'event-driven patterns, CQRS, clean architecture',
  ai_orchestration: 'RAG pipelines, prompt engineering avançado, agentes autônomos',
}

const DIM_SECTION = {
  business: '## Negócio',
  architecture: '## Arquitetura',
  ai_orchestration: '## IA / Orquestração',
}

// ── Safe rename (EXDEV fallback) ───────────────────────────────────────────────

async function safeRename(src, dest) {
  try {
    await rename(src, dest)
  } catch (err) {
    if (err.code === 'EXDEV') {
      await copyFile(src, dest)
      await unlink(src)
    } else throw err
  }
}

// ── detectMilestone ────────────────────────────────────────────────────────────

export async function detectMilestone(vaultPath) {
  const notes = await listNotes(vaultPath, 'victories')
  const victories = []

  for (const note of notes) {
    const content = await readNote(vaultPath, 'victories', note)
    const fm = parseFrontmatter(content)
    if (fm.type === 'victory') victories.push({ ...fm, fileName: note })
  }

  const milestoneNums = victories.map(v => Number(v.milestone) || 1)
  const currentMilestone = milestoneNums.length > 0 ? Math.max(...milestoneNums) : 1
  const currentVictories = victories.filter(v => (Number(v.milestone) || 1) === currentMilestone)

  return {
    isComplete: currentVictories.length >= 5,
    milestoneId: currentMilestone,
    victories: currentVictories
  }
}

// ── createMilestoneSummary ─────────────────────────────────────────────────────

export async function createMilestoneSummary(vaultPath, milestoneData) {
  const { milestoneId, victories } = milestoneData
  const id = String(milestoneId).padStart(2, '0')

  const dates = victories.map(v => v.date).filter(Boolean).sort()
  const dateStart = dates[0] ?? new Date().toISOString().split('T')[0]
  const dateEnd = dates[dates.length - 1] ?? dateStart

  const dims = ['business', 'architecture', 'ai_orchestration']
  const avgs = {}
  for (const d of dims) {
    const sum = victories.reduce((acc, v) => acc + (Number(v[d]) || 0), 0)
    avgs[d] = victories.length > 0 ? (sum / victories.length).toFixed(1) : '0.0'
  }

  const bestDim = dims
    .map(d => ({ d, avg: Number(avgs[d]) }))
    .sort((a, b) => b.avg - a.avg)[0].d

  const questLinks = victories
    .map(v => `- [[${v.fileName.replace('.md', '')}]]`)
    .join('\n')

  const dimNames = {
    business: 'Negócio',
    architecture: 'Arquitetura',
    ai_orchestration: 'IA / Orquestração'
  }

  const frontmatter = generateFrontmatter({
    id: `M${id}`,
    type: 'milestone',
    title: `Milestone ${milestoneId} — Concluído`,
    date_start: dateStart,
    date_end: dateEnd,
    milestone: milestoneId,
    tags: ['codemaster', 'milestone']
  })

  const content = `${frontmatter}
# Milestone ${milestoneId} — Concluído

## Período
${dateStart} a ${dateEnd}

## Quests do Período
${questLinks}

## Médias por Dimensão
- Negócio: ${avgs.business}
- Arquitetura: ${avgs.architecture}
- IA / Orquestração: ${avgs.ai_orchestration}

## Dimensão de Maior Evolução
${dimNames[bestDim]} (média: ${avgs[bestDim]})

## Padrões Emergentes
_Gerado pelo agente com base nas reflexões do período_
`

  await createNote(vaultPath, '', `M${id}`, 'summary', content)
}

// ── updateProgressForMilestone ────────────────────────────────────────────────

export async function updateProgressForMilestone(vaultPath, milestoneId) {
  const id = String(milestoneId).padStart(2, '0')
  let content = await readNote(vaultPath, '', 'PROGRESS.md')

  // Mark current milestone complete
  content = content.replace(
    new RegExp(`## Milestone ${milestoneId} — \\d+/5 victories`),
    `## Milestone ${milestoneId} ✓ — [[M${id}-summary]]`
  )

  // Append next milestone section if not already present
  const nextId = milestoneId + 1
  if (!content.includes(`## Milestone ${nextId}`)) {
    content = content.trimEnd() + `\n\n## Milestone ${nextId} — 0/5 victories\n`
  }

  await updateNote(vaultPath, '', 'PROGRESS.md', content)
}

// ── identifyGaps ───────────────────────────────────────────────────────────────

export function identifyGaps(victories) {
  if (!victories.length) return []
  const dims = ['business', 'architecture', 'ai_orchestration']
  const dimScores = {}
  for (const d of dims) {
    const sum = victories.reduce((acc, v) => acc + (Number(v[d]) || 0), 0)
    dimScores[d] = sum / victories.length
  }
  return Object.entries(dimScores)
    .sort((a, b) => a[1] - b[1])
    .slice(0, 3)
    .map(([dimension, averageScore]) => ({ dimension, averageScore, recommendation: STUDY_RECOMMENDATIONS[dimension] }))
}

// ── reorganizeVault ────────────────────────────────────────────────────────────

export async function reorganizeVault(vaultPath, milestoneId) {
  const id = String(milestoneId).padStart(2, '0')
  const historyBase = join(vaultPath, `milestone-${id}`)
  await mkdir(join(historyBase, 'quests'), { recursive: true })
  await mkdir(join(historyBase, 'victories'), { recursive: true })
  await mkdir(join(historyBase, 'relics'), { recursive: true })

  for (const type of ['quests', 'victories', 'relics']) {
    const files = await listNotes(vaultPath, type)
    for (const file of files) {
      const content = await readNote(vaultPath, type, file)
      const fm = parseFrontmatter(content)
      if (Number(fm.milestone) === milestoneId) {
        await safeRename(
          join(vaultPath, type, file),
          join(historyBase, type, file)
        )
      }
    }
  }

  // Move M{id}-summary.md to history
  const summaryFile = `M${id}-summary.md`
  try {
    await safeRename(join(vaultPath, summaryFile), join(historyBase, summaryFile))
  } catch {
    // graceful — file may not exist yet
  }
}

// ── updateKnowledgeMap ────────────────────────────────────────────────────────

export async function updateKnowledgeMap(vaultPath, gaps) {
  let content = await readNote(vaultPath, '', 'KNOWLEDGE-MAP.md')

  for (const gap of gaps) {
    const sectionHeader = DIM_SECTION[gap.dimension]
    if (!sectionHeader) continue
    const entry = `- ${gap.topic} | ${gap.dimension} | Para Estudar`
    // Insert entry after the section header
    content = content.replace(sectionHeader, `${sectionHeader}\n${entry}`)
  }

  await updateNote(vaultPath, '', 'KNOWLEDGE-MAP.md', content)
}
