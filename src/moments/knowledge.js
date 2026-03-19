import { listNotes, readNote, updateNote } from '../services/vault.js'
import { parseFrontmatter } from '../utils/frontmatter.js'

const DIM_NAMES = { business: 'Negócio', architecture: 'Arquitetura', ai_orchestration: 'IA' }
const DIMS = ['business', 'architecture', 'ai_orchestration']

function stripQuotes(val) {
  if (typeof val !== 'string') return val
  return val.replace(/^"|"$/g, '')
}

export async function generateKnowledge(vaultPath) {
  const victoryFiles = await listNotes(vaultPath, 'victories')
  const victories = []

  for (const file of victoryFiles) {
    try {
      const content = await readNote(vaultPath, 'victories', file)
      const fm = parseFrontmatter(content)
      if (stripQuotes(fm.type) !== 'victory') continue
      victories.push({
        id: stripQuotes(fm.id ?? ''),
        business: parseFloat(stripQuotes(fm.business ?? '0')),
        architecture: parseFloat(stripQuotes(fm.architecture ?? '0')),
        ai_orchestration: parseFloat(stripQuotes(fm.ai_orchestration ?? '0')),
        fileName: file
      })
    } catch { /* skip */ }
  }

  if (victories.length < 3) {
    return { insufficient: true, count: victories.length, victories }
  }

  // Calcular médias por dimensão
  const dimScores = {}
  for (const d of DIMS) {
    const scores = victories.map(v => v[d])
    dimScores[d] = scores.reduce((a, b) => a + b, 0) / scores.length
  }

  // Top 3 gaps (menor score = maior gap)
  const gaps = Object.entries(dimScores)
    .sort((a, b) => a[1] - b[1])
    .slice(0, 3)
    .map(([dim, score]) => ({
      dimension: dim,
      averageScore: score.toFixed(1),
      sources: victories
        .filter(v => v[dim] < 5.0)
        .map(v => `[[${v.fileName.replace('.md', '')}]]`)
        .slice(0, 3)
    }))

  // Gerar KNOWLEDGE-MAP.md
  const sections = DIMS.map(d => {
    const gap = gaps.find(g => g.dimension === d)
    const entry = gap
      ? `- [ ] Gap em ${DIM_NAMES[d]} | Score médio: ${gap.averageScore} | Fonte: ${gap.sources.join(', ') || 'N/A'}`
      : `- [ ] Nenhum gap crítico identificado`
    return `### ${DIM_NAMES[d]}\n${entry}`
  }).join('\n\n')

  const top2 = gaps.slice(0, 2)
  const km = `# KNOWLEDGE-MAP\n\n## Lacunas por Dimensão\n\n${sections}\n\n## Próximo Milestone — Foco recomendado\n- Prioridade 1: ${DIM_NAMES[top2[0]?.dimension] ?? '-'} (${top2[0]?.averageScore ?? 'N/A'})\n- Prioridade 2: ${DIM_NAMES[top2[1]?.dimension] ?? '-'} (${top2[1]?.averageScore ?? 'N/A'})\n`

  await updateNote(vaultPath, '', 'KNOWLEDGE-MAP.md', km)

  return { insufficient: false, gaps, knowledgeMapPath: 'KNOWLEDGE-MAP.md' }
}
