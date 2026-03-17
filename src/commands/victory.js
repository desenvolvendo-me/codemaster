// src/commands/victory.js
import inquirer from 'inquirer'
import chalk from 'chalk'
import fs from 'fs-extra'
import path from 'path'
import { getConfig, getActiveQuest, clearActiveQuest } from '../workspace/config.js'
import { createNote, listNotes } from '../services/vault.js'
import { generateFrontmatter } from '../utils/frontmatter.js'
import { detectMilestone, createMilestoneSummary, updateProgressForMilestone, reorganizeVault, updateKnowledgeMap, identifyGaps } from '../services/milestone.js'
import { printEpic } from '../utils/output.js'

function dateStr() { return new Date().toISOString().split('T')[0] }
function toSlug(str) {
  return str.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 50)
}

// ─── Análise heurística ───────────────────────────────────────────────────────
function analyze(reflection) {
  const text = Object.values(reflection).join(' ').toLowerCase()

  const score = (keywords) => keywords.filter(k => text.includes(k)).length

  const bizWords  = ['negócio','valor','cliente','receita','usuário','produto','prioridade','impacto','stakeholder','roi','entrega','funcionalidade','feature']
  const archWords = ['arquitetura','padrão','separação','responsabilidade','escalabilidade','performance','banco','serviço','api','estrutura','design','refactor','módulo','camada','acoplamento']
  const aiWords   = ['ia','llm','prompt','agente','gpt','claude','copilot','modelo','openai','automação','ai','cursor','codex','cursor']

  const bScore = score(bizWords)
  const aScore = score(archWords)
  const iScore = score(aiWords)

  return {
    business: {
      trend: bScore >= 3 ? '↑' : bScore >= 1 ? '→' : '↓',
      note: bScore >= 3
        ? 'Ótima articulação de impacto de negócio nesta missão.'
        : bScore >= 1
          ? 'Considerou negócio em partes da reflexão — continue aprofundando.'
          : 'Oportunidade: conecte mais suas decisões ao valor que entrega para o negócio.',
    },
    architecture: {
      trend: aScore >= 3 ? '↑' : aScore >= 1 ? '→' : '↓',
      note: aScore >= 3
        ? 'Decisões técnicas bem contextualizadas e justificadas.'
        : aScore >= 1
          ? 'Raciocínio arquitetural presente — detalhe mais nas próximas missões.'
          : 'Oportunidade: documente melhor o raciocínio por trás das escolhas técnicas.',
    },
    ai_orchestration: {
      trend: iScore >= 2 ? '↑' : iScore >= 1 ? '→' : '↓',
      note: iScore >= 2
        ? 'IA foi utilizada de forma estratégica nesta missão.'
        : iScore >= 1
          ? 'IA mencionada — explore mais como ela pode acelerar seu trabalho.'
          : 'Reflexão: alguma parte desta missão poderia ter sido acelerada com IA?',
    },
  }
}

// ─── Gerar arquivo de vitória ─────────────────────────────────────────────────
function generateVictoryMd(quest, reflection, analysis, config) {
  return `# 🏆 Vitória — ${quest.name}

> **Missão encerrada em:** ${new Date().toLocaleString('pt-BR')}
> **Dev:** ${config.dev.name}
> **Arquivo da missão:** [[quests/${path.basename(quest.file, '.md')}]]

---

## Reflexão Final

| Pergunta | Resposta |
|---|---|
| O que deu certo | ${reflection.wentWell} |
| O que faria diferente | ${reflection.different} |
| Maior obstáculo | ${reflection.hardest} |
| Habilidade mais exercida | ${reflection.skill} |
| Relíquia que carrego | ${reflection.relic} |

---

## Análise do CodeMaster

### 🏢 Negócio — ${analysis.business.trend}
${analysis.business.note}

### 🏗️ Arquitetura — ${analysis.architecture.trend}
${analysis.architecture.note}

### 🤖 Orquestração de IA — ${analysis.ai_orchestration.trend}
${analysis.ai_orchestration.note}

---

## A Relíquia desta Vitória

> *"${reflection.relic}"*

---

#victory #quest #${toSlug(quest.name)}
`
}

// ─── Atualizar PROGRESS.md ────────────────────────────────────────────────────
async function updateProgress(config, quest, analysis) {
  const progressFile = path.join(config.vault, 'legend', 'PROGRESS.md')
  if (!await fs.pathExists(progressFile)) return

  const entry = `
### ${dateStr()} — ${quest.name}

| Dimensão | Tendência | Observação |
|---|---|---|
| 🏢 Negócio | ${analysis.business.trend} | ${analysis.business.note} |
| 🏗️ Arquitetura | ${analysis.architecture.trend} | ${analysis.architecture.note} |
| 🤖 Orquestração IA | ${analysis.ai_orchestration.trend} | ${analysis.ai_orchestration.note} |

`
  let content = await fs.readFile(progressFile, 'utf-8')
  const marker = '> *(o CodeMaster registra aqui após cada `@codemaster victory`)*'
  content = content.replace(marker, marker + '\n' + entry)
  await fs.writeFile(progressFile, content)
}

// ─── Atualizar status da quest ────────────────────────────────────────────────
async function closeQuest(questFile, questName) {
  if (!await fs.pathExists(questFile)) return
  let content = await fs.readFile(questFile, 'utf-8')
  content = content
    .replace('**Status:** Em andamento', '**Status:** ✅ Vitória')
    .replace('#em-andamento', '#vitória')
  await fs.writeFile(questFile, content)
}

// ─── Comando principal ────────────────────────────────────────────────────────
export async function victory() {
  const config = await getConfig()
  const active = await getActiveQuest()

  if (!active) {
    console.log(chalk.yellow('\n  ⚠  Nenhuma missão ativa para encerrar.'))
    console.log(chalk.dim('  Inicie uma com: codemaster quest "nome"\n'))
    return
  }

  console.log(`\n  ${chalk.bold.yellow('🏆 CodeMaster')} ${chalk.dim('— declarando vitória')}\n`)
  console.log(chalk.bold.white(`  Missão: ${active.name}`))
  console.log(chalk.dim(`  Iniciada em: ${new Date(active.startedAt).toLocaleString('pt-BR')}\n`))
  console.log(chalk.dim('  O oráculo conduz a reflexão final. Cinco perguntas:\n'))

  const reflection = await inquirer.prompt([
    {
      type: 'input', name: 'wentWell',
      message: chalk.white('  1. O que deu certo nesta missão?'),
    },
    {
      type: 'input', name: 'different',
      message: chalk.white('  2. O que faria diferente se começasse do zero?'),
    },
    {
      type: 'input', name: 'hardest',
      message: chalk.white('  3. Qual foi o maior obstáculo enfrentado?'),
    },
    {
      type: 'input', name: 'skill',
      message: chalk.white('  4. Qual habilidade você mais exerceu ou desenvolveu?'),
    },
    {
      type: 'input', name: 'relic',
      message: chalk.white('  5. Qual relíquia de conhecimento você carrega desta missão?'),
    },
  ])

  const analysis = analyze(reflection)

  // Criar arquivo de vitória
  const victoryFile = path.join(
    config.vault, 'victories',
    `${dateStr()}-${toSlug(active.name)}-victory.md`
  )
  await fs.outputFile(victoryFile, generateVictoryMd(active, reflection, analysis, config))

  // Fechar a quest
  await closeQuest(active.file, active.name)

  // Atualizar progresso
  await updateProgress(config, active, analysis)

  // Limpar quest ativa
  await clearActiveQuest()

  // ── Milestone tracking ────────────────────────────────────────────────────
  const vaultPath = config.vault || config.obsidian?.vault_path
  if (vaultPath) {
    try {
      const { milestoneId, victories: currentVictories } = await detectMilestone(vaultPath)
      const victoryNumber = currentVictories.length + 1
      const victoryId = `V${String(victoryNumber).padStart(3, '0')}`

      const trendToScore = { '↑': 3, '→': 2, '↓': 1 }
      const fm = generateFrontmatter({
        id: victoryId,
        type: 'victory',
        title: active.name,
        date: dateStr(),
        milestone: milestoneId,
        business: trendToScore[analysis.business.trend] ?? 2,
        architecture: trendToScore[analysis.architecture.trend] ?? 2,
        ai_orchestration: trendToScore[analysis.ai_orchestration.trend] ?? 2,
      })
      await createNote(vaultPath, 'quests', victoryId, toSlug(active.name), fm + `\n# ${active.name}\n`)

      const milestoneStatus = await detectMilestone(vaultPath)
      if (milestoneStatus.isComplete) {
        const mNum = milestoneStatus.milestoneId
        const mId = String(mNum).padStart(2, '0')

        await createMilestoneSummary(vaultPath, milestoneStatus)
        await updateProgressForMilestone(vaultPath, mNum)

        const gaps = identifyGaps(milestoneStatus.victories)
        await reorganizeVault(vaultPath, mNum)
        await updateKnowledgeMap(vaultPath, gaps)

        const gapLines = gaps
          .map((g, i) => `${i + 1}. ${g.dimension} (média: ${g.averageScore.toFixed(1)}) — Estude: ${g.recommendation}`)
          .join('\n')
        printEpic(
          `Milestone ${mNum} Completo!`,
          `Arquivos arquivados em: vault/milestone-${mId}/\n\n3 Gaps Críticos para Estudar:\n${gapLines}\n\nFoco Recomendado para Milestone ${mNum + 1}: ${gaps[0]?.dimension ?? 'equilibrado'}`
        )
      }
    } catch {
      // Milestone tracking é não-crítico — nunca quebra o fluxo de victory
    }
  }

  // Output épico
  console.log(`\n  ${chalk.bold.yellow('🏆 VITÓRIA!')} ${chalk.white(active.name)}`)
  console.log(chalk.dim('  ─────────────────────────────────────────'))
  console.log(`  🏢 Negócio      ${analysis.business.trend}  ${chalk.dim(analysis.business.note)}`)
  console.log(`  🏗️  Arquitetura  ${analysis.architecture.trend}  ${chalk.dim(analysis.architecture.note)}`)
  console.log(`  🤖 Orq. IA      ${analysis.ai_orchestration.trend}  ${chalk.dim(analysis.ai_orchestration.note)}`)
  console.log(chalk.dim('  ─────────────────────────────────────────'))
  console.log(`\n  ${chalk.italic.dim('"' + reflection.relic + '"')}\n`)
  console.log(chalk.dim(`  Vitória salva em: ${victoryFile}`))
  console.log(chalk.dim('  Abra o Obsidian para visualizar sua lenda.\n'))
}
