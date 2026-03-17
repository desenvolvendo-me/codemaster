// src/commands/sample.js
import { select } from '@inquirer/prompts'
import { readFile } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import chalk from 'chalk'

const __dirname_esm = dirname(fileURLToPath(import.meta.url))
const EXAMPLES_DIR  = join(__dirname_esm, '../../templates/obsidian-example')

const blank = () => console.log('')

function printFileHeader(label, path) {
  blank()
  console.log(
    '  ' + chalk.bold.cyan('⚔  ' + label) +
    chalk.dim('  ←  ' + path)
  )
  console.log('  ' + chalk.dim('─'.repeat(60)))
  blank()
}

function printContent(raw) {
  for (const line of raw.split('\n')) {
    if (line.startsWith('# '))      console.log('  ' + chalk.bold.white(line))
    else if (line.startsWith('## ')) console.log('  ' + chalk.bold.cyan(line))
    else if (line.startsWith('### '))console.log('  ' + chalk.cyan(line))
    else if (line.startsWith('---')) console.log('  ' + chalk.dim(line))
    else if (line.startsWith('- **'))console.log('  ' + chalk.yellow(line))
    else if (line.startsWith('- [')) console.log('  ' + chalk.white(line))
    else if (line.startsWith('- '))  console.log('  ' + chalk.dim(line))
    else if (line.startsWith('```')) console.log('  ' + chalk.dim(line))
    else if (line.match(/^[a-z_]+: /)) console.log('  ' + chalk.dim(line)) // frontmatter
    else                             console.log('  ' + line)
  }
}

async function showQuestVictory() {
  const questPath = join(EXAMPLES_DIR, 'quests', 'Q001-exemplo-quest.md')
  const raw = await readFile(questPath, 'utf8')

  printFileHeader('Resultado de uma missão encerrada', 'quests/Q001-exemplo-quest.md')
  printContent(raw)
  blank()
  console.log('  ' + chalk.dim('Este arquivo é criado pelo ') + chalk.cyan('/codemaster:quest') + chalk.dim(' e atualizado pelo ') + chalk.cyan('/codemaster:victory'))
  blank()
}

async function showMilestoneSummary() {
  const summaryPath = join(EXAMPLES_DIR, 'M01-summary.md')
  const raw = await readFile(summaryPath, 'utf8')

  printFileHeader('Resultado de um milestone completo (5ª victory)', 'M01-summary.md')
  printContent(raw)
  blank()
  console.log('  ' + chalk.dim('Este arquivo é gerado automaticamente ao encerrar a 5ª victory do milestone.'))
  blank()
}

async function showKnowledgeMap() {
  const kmPath = join(EXAMPLES_DIR, 'KNOWLEDGE-MAP.md')
  const raw = await readFile(kmPath, 'utf8')

  printFileHeader('Knowledge Map gerado pelo /knowledge', 'KNOWLEDGE-MAP.md')
  printContent(raw)
  blank()
  console.log('  ' + chalk.dim('Este arquivo é criado/atualizado pelo ') + chalk.cyan('/codemaster:knowledge') + chalk.dim(' após 3+ victories.'))
  blank()
}

export async function sample() {
  blank()
  console.log('  ' + chalk.bold.yellow('⚔  CodeMaster') + chalk.dim(' — Exemplos de output real'))
  blank()
  console.log('  ' + chalk.dim('Veja o que o sistema produz em cada etapa da jornada.'))
  blank()

  const choice = await select({
    message: 'O que você quer visualizar?',
    choices: [
      {
        name: 'Quest encerrada com Victory — notas, reflexões e scores por dimensão',
        value: 'quest',
      },
      {
        name: 'Milestone completo — summary automático após 5 victories',
        value: 'milestone',
      },
      {
        name: 'Knowledge Map — mapa de gaps gerado pelo /knowledge',
        value: 'knowledge',
      },
    ],
  })

  if (choice === 'quest')     await showQuestVictory()
  if (choice === 'milestone') await showMilestoneSummary()
  if (choice === 'knowledge') await showKnowledgeMap()
}
