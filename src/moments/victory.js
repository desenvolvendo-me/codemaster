import { readNote, updateNote } from '../services/vault.js'
import { clearActiveQuest } from '../services/state.js'

export function calcTrend(score) {
  if (score >= 7.0) return '↑'
  if (score >= 4.0) return '→'
  return '↓'
}

// Atualiza ou insere campos no bloco frontmatter sem re-serializar os valores existentes
function updateFrontmatterFields(content, fields) {
  let result = content
  for (const [key, value] of Object.entries(fields)) {
    const jsonVal = JSON.stringify(value)
    if (new RegExp(`^${key}: `, 'm').test(result)) {
      result = result.replace(new RegExp(`^(${key}: ).+$`, 'm'), `$1${jsonVal}`)
    } else {
      result = result.replace(/^---$/m, `${key}: ${jsonVal}\n---`)
    }
  }
  return result
}

export async function closeVictory(questFileName, scores, reflections, vaultPath) {
  const { business, architecture, ai_orchestration } = scores
  const trends = {
    business: calcTrend(business),
    architecture: calcTrend(architecture),
    ai_orchestration: calcTrend(ai_orchestration)
  }

  const questContent = await readNote(vaultPath, 'quests', questFileName)
  const date = new Date().toISOString().split('T')[0]

  const victorySection = `
## Victory — ${new Date().toISOString()}

### Respostas de Reflexão
${Object.entries(reflections).map(([k, v]) => `**${k}:** ${v}`).join('\n')}

### Análise por Dimensão
- Negócio: ${trends.business} ${business.toFixed(1)}
- Arquitetura: ${trends.architecture} ${architecture.toFixed(1)}
- IA / Orquestração: ${trends.ai_orchestration} ${ai_orchestration.toFixed(1)}
`

  const newContent = updateFrontmatterFields(questContent, {
    type: 'victory',
    date,
    business: business.toFixed(1),
    architecture: architecture.toFixed(1),
    ai_orchestration: ai_orchestration.toFixed(1)
  }) + victorySection

  await updateNote(vaultPath, 'quests', questFileName, newContent)

  // Atualizar PROGRESS.md
  const slug = questFileName.replace('.md', '')
  const progressLine = `- [[${slug}]] | N:${trends.business}${business.toFixed(1)} A:${trends.architecture}${architecture.toFixed(1)} IA:${trends.ai_orchestration}${ai_orchestration.toFixed(1)}`

  let progress = await readNote(vaultPath, '', 'PROGRESS.md')
  progress = progress.replace(
    /## Milestone (\d+) — (\d+)\/5 victories/,
    (_, mId, count) => `## Milestone ${mId} — ${Number(count) + 1}/5 victories`
  )
  progress = progress.replace(
    /(## Milestone \d+ — \d+\/5 victories\n)/,
    `$1${progressLine}\n`
  )
  await updateNote(vaultPath, '', 'PROGRESS.md', progress)

  await clearActiveQuest()

  return { scores, trends }
}
