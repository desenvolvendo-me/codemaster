import { readNote, updateNote, createNote } from '../services/vault.js'
import { generateFrontmatter, parseFrontmatter } from '../utils/frontmatter.js'
import { clearActiveQuest } from '../services/state.js'
import { getDifficultyByValue, formatDifficultyDelta } from '../utils/difficulty.js'

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

function stripQuotes(value) {
  return typeof value === 'string' ? value.replace(/^"|"$/g, '') : value
}

const REFLECTION_QUESTIONS = {
  impacto_negocio: 'Qual foi o impacto real para quem usa o sistema — o que mudou concretamente?',
  'Impacto de negócio': 'Qual foi o impacto real para quem usa o sistema — o que mudou concretamente?',
  decisao_arquitetural: 'Qual foi a principal decisão técnica que você tomou e por quê escolheu esse caminho?',
  'Decisão arquitetural': 'Qual foi a principal decisão técnica que você tomou e por quê escolheu esse caminho?',
  orquestracao_ia: 'Como você usou IA nessa missão — o que orquestrou, o que delegou, o que aprendeu sobre esse uso?',
  'Uso de IA': 'Como você usou IA nessa missão — o que orquestrou, o que delegou, o que aprendeu sobre esse uso?',
  novo_aprendizado: 'O que você sabe agora que não sabia quando começou essa quest?',
  'Novo aprendizado': 'O que você sabe agora que não sabia quando começou essa quest?',
  reflexao_critica: 'Se você pudesse refazer essa missão, o que faria diferente?',
  'Faria diferente': 'Se você pudesse refazer essa missão, o que faria diferente?',
}

function formatReflectionSection(reflections) {
  return Object.entries(reflections)
    .map(([key, answer], index) => {
      const question = REFLECTION_QUESTIONS[key] ?? key
      return `### ${index + 1}. ${question}\n${answer}`
    })
    .join('\n\n')
}

function buildVictoryNote(victoryId, questSlug, questTitle, milestone, scores, trends, reflections, date, difficulty = {}) {
  const { business, architecture, ai_orchestration } = scores
  const fields = {
    id: victoryId,
    type: 'victory',
    title: `Victory — ${questTitle}`,
    date,
    milestone,
    tags: ['codemaster', 'victory'],
    quest: questSlug,
    business: business.toFixed(1),
    architecture: architecture.toFixed(1),
    ai_orchestration: ai_orchestration.toFixed(1),
  }

  if (difficulty.actual != null) {
    const monster = getDifficultyByValue(difficulty.actual)
    if (monster) {
      fields.actual_difficulty = monster.name
      fields.actual_difficulty_value = difficulty.actual
    }
    if (difficulty.planned != null) {
      fields.difficulty_delta = difficulty.actual - difficulty.planned
    }
  }

  const fm = generateFrontmatter(fields)
  return `${fm}
# Victory: ${questTitle}

## Quest
[[quests/${questSlug}|${questSlug}]]

## Respostas de Reflexão
${formatReflectionSection(reflections)}

## Análise por Dimensão
- Negócio: ${trends.business} ${business.toFixed(1)}
- Arquitetura: ${trends.architecture} ${architecture.toFixed(1)}
- IA / Orquestração: ${trends.ai_orchestration} ${ai_orchestration.toFixed(1)}
`
}

export async function closeVictory(questFileName, scores, reflections, vaultPath, difficulty = {}) {
  const { business, architecture, ai_orchestration } = scores
  const trends = {
    business: calcTrend(business),
    architecture: calcTrend(architecture),
    ai_orchestration: calcTrend(ai_orchestration)
  }

  const questContent = await readNote(vaultPath, 'quests', questFileName)
  const date = new Date().toISOString().split('T')[0]
  const questSlug = questFileName.replace('.md', '')
  const questFrontmatter = parseFrontmatter(questContent)
  const milestone = Number(stripQuotes(questFrontmatter.milestone ?? 1)) || 1

  // Extrair título da quest
  const titleMatch = questContent.match(/^# (.+)$/m)
  const questTitle = titleMatch ? titleMatch[1].replace(/^Quest: /, '') : questSlug

  // Extrair id e slug para createNote
  const dashIdx = questSlug.indexOf('-')
  const questId = questSlug.slice(0, dashIdx)
  const slug = questSlug.slice(dashIdx + 1)
  const victoryId = `V${questId.replace(/^Q/i, '')}`
  const victorySlug = `${victoryId}-${slug}`

  // 1. Criar arquivo de victory em victories/
  const victoryNote = buildVictoryNote(victoryId, questSlug, questTitle, milestone, scores, trends, reflections, date, difficulty)
  await createNote(vaultPath, 'victories', victoryId, slug, victoryNote)

  // 2. Atualizar quest: frontmatter + link para a victory
  const questFields = {
    type: 'quest',
    victory: victorySlug,
    business: business.toFixed(1),
    architecture: architecture.toFixed(1),
    ai_orchestration: ai_orchestration.toFixed(1)
  }

  if (difficulty.actual != null) {
    const actualMonster = getDifficultyByValue(difficulty.actual)
    if (actualMonster) {
      questFields.actual_difficulty = actualMonster.name
      questFields.actual_difficulty_value = difficulty.actual
    }
  }

  const newQuestContent = updateFrontmatterFields(questContent, questFields) + `\n## Victory\n[[victories/${victorySlug}|${victorySlug}]]\n`

  await updateNote(vaultPath, 'quests', questFileName, newQuestContent)

  // 3. Atualizar PROGRESS.md
  let progressLine = `- [[quests/${questSlug}|${questSlug}]] | N:${trends.business}${business.toFixed(1)} A:${trends.architecture}${architecture.toFixed(1)} IA:${trends.ai_orchestration}${ai_orchestration.toFixed(1)}\n  victory: [[victories/${victorySlug}|${victorySlug}]]`

  if (difficulty.planned != null && difficulty.actual != null) {
    const deltaStr = formatDifficultyDelta(difficulty.planned, difficulty.actual)
    if (deltaStr) {
      progressLine += ` | ${deltaStr}`
    }
  }

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
