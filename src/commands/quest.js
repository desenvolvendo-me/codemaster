// src/commands/quest.js
import inquirer from 'inquirer'
import chalk from 'chalk'
import fs from 'fs-extra'
import path from 'path'
import { getConfig, saveActiveQuest, getActiveQuest } from '../workspace/config.js'

function toSlug(str) {
  return str.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 50)
}

function dateStr() { return new Date().toISOString().split('T')[0] }
function timeStr()  { return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) }

export async function quest(args) {
  const config = await getConfig()
  const questName = args.join(' ').trim()

  if (!questName) {
    console.log(chalk.red('\n  Dê um nome à sua missão:\n'))
    console.log(chalk.dim('  codemaster quest "Nome da missão"\n'))
    return
  }

  // Verificar se já há missão ativa
  const active = await getActiveQuest()
  if (active) {
    console.log(chalk.yellow(`\n  ⚠  Missão ativa: "${active.name}"`))
    const { replace } = await inquirer.prompt([{
      type: 'confirm', name: 'replace',
      message: chalk.white('  Abandonar a missão atual e iniciar esta?'),
      default: false,
    }])
    if (!replace) {
      console.log(chalk.dim('\n  Finalize a missão atual com: codemaster victory\n'))
      return
    }
  }

  console.log(`\n  ${chalk.bold.yellow('⚔  CodeMaster')} ${chalk.dim('— nova missão')}\n`)
  console.log(chalk.dim('  Antes de partir, três perguntas do oráculo:\n'))

  const reflection = await inquirer.prompt([
    {
      type: 'input', name: 'objective',
      message: chalk.white('  Qual é o objetivo principal desta missão?'),
    },
    {
      type: 'input', name: 'businessImpact',
      message: chalk.white('  Qual impacto de negócio você espera ao concluir?'),
    },
    {
      type: 'input', name: 'uncertainty',
      message: chalk.white('  Há algo que te preocupa ou ainda não sabe como resolver?'),
      default: 'Nenhuma incerteza por agora',
    },
  ])

  // Criar arquivo da quest
  const fileName = `${dateStr()}-${toSlug(questName)}.md`
  const filePath  = path.join(config.vault, 'quests', fileName)

  const content = `# ⚔ ${questName}

> **Iniciada em:** ${new Date().toLocaleString('pt-BR')}
> **Status:** Em andamento

---

## Pergunta do Oráculo

**Objetivo principal:** ${reflection.objective}

**Impacto de negócio:** ${reflection.businessImpact}

**Incertezas iniciais:** ${reflection.uncertainty}

---

## Relíquias Coletadas

> *(registradas com \`@codemaster relic\` durante a missão)*

---

## Reflexão Final

> *(preenchida ao executar \`@codemaster victory\`)*

---

#quest #em-andamento
`

  await fs.outputFile(filePath, content)

  // Salvar estado da quest ativa
  await saveActiveQuest({
    name:      questName,
    file:      filePath,
    slug:      toSlug(questName),
    startedAt: new Date().toISOString(),
  })

  console.log(`\n  ${chalk.green('✓')} Missão iniciada: ${chalk.bold.yellow(questName)}`)
  console.log(chalk.dim(`  Arquivo: ${filePath}\n`))
  console.log(
    '  ' + chalk.dim('Registre descobertas com ') + chalk.cyan('@codemaster relic "observação"') + '\n' +
    '  ' + chalk.dim('Finalize com ') + chalk.cyan('@codemaster victory') + '\n'
  )
}
