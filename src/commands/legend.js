// src/commands/legend.js
import chalk from 'chalk'
import fs from 'fs-extra'
import path from 'path'
import boxen from 'boxen'
import { getConfig, getActiveQuest } from '../workspace/config.js'

export async function legend() {
  const config = await getConfig()
  const { dev, levels, vault } = config

  const active   = await getActiveQuest()
  const questDir = path.join(vault, 'quests')
  const vicDir   = path.join(vault, 'victories')
  const relicDir = path.join(vault, 'relics')

  const quests    = await fs.pathExists(questDir)  ? (await fs.readdir(questDir)).filter(f  => f.endsWith('.md')) : []
  const victories = await fs.pathExists(vicDir)    ? (await fs.readdir(vicDir)).filter(f    => f.endsWith('.md')) : []
  const relics    = await fs.pathExists(relicDir)  ? (await fs.readdir(relicDir)).filter(f  => f.endsWith('.md')) : []

  // Última vitória
  let lastVictory = null
  if (victories.length > 0) {
    const last = victories.sort().reverse()[0]
    const content = await fs.readFile(path.join(vicDir, last), 'utf-8')
    const match = content.match(/^# 🏆 Vitória — (.+)$/m)
    lastVictory = match ? match[1] : last.replace('.md', '')
  }

  console.log()
  console.log(boxen(
    chalk.bold.yellow(`  ⚔  A Lenda de ${dev.name}  `) + '\n' +
    chalk.dim(`  ${dev.role}\n`) +
    '\n' +
    chalk.dim('  ────────────────────────────────\n') +
    '\n' +
    chalk.dim('  📋 Missões iniciadas:  ') + chalk.white(String(quests.length).padStart(3)) + '\n' +
    chalk.dim('  🏆 Vitórias:           ') + chalk.yellow(String(victories.length).padStart(3)) + '\n' +
    chalk.dim('  🔮 Relíquias:          ') + chalk.cyan(String(relics.length).padStart(3)) + '\n' +
    '\n' +
    chalk.dim('  ────────────────────────────────\n') +
    '\n' +
    chalk.dim('  🏢 Negócio        ') + renderBar(config.levels.business)    + '\n' +
    chalk.dim('  🏗️  Arquitetura    ') + renderBar(config.levels.architecture)+ '\n' +
    chalk.dim('  🤖 Orq. de IA     ') + renderBar(config.levels.ai_orchestration) + '\n' +
    '\n' +
    (lastVictory
      ? chalk.dim('  Última vitória: ') + chalk.italic.white(lastVictory) + '\n'
      : chalk.dim('  Nenhuma vitória ainda — inicie sua primeira missão!\n')) +
    '\n' +
    (active
      ? chalk.yellow('  ⚡ Em missão: ') + chalk.white(active.name)
      : chalk.dim('  Nenhuma missão ativa.')),
    { padding: 1, margin: { left: 2 }, borderStyle: 'double', borderColor: 'yellow' }
  ))
  console.log()

  if (quests.length === 0) {
    console.log(chalk.dim('  Inicie sua primeira missão com: ') + chalk.cyan('codemaster quest "Nome"'))
    console.log()
  }

  console.log(chalk.dim('  Vault: ') + chalk.dim(vault))
  if (config.github) {
    console.log(chalk.dim('  GitHub: ') + chalk.dim(config.github))
  }
  console.log()
}

function renderBar(level) {
  const filled = '█'.repeat(level)
  const empty  = '░'.repeat(5 - level)
  return chalk.yellow(filled) + chalk.dim(empty) + chalk.dim(` ${level}/5`)
}
