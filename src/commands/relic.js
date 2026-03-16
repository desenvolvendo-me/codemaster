// src/commands/relic.js
import chalk from 'chalk'
import fs from 'fs-extra'
import path from 'path'
import { getConfig, getActiveQuest } from '../workspace/config.js'

function timeStr() {
  return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

function dateStr() { return new Date().toISOString().split('T')[0] }

function toSlug(str) {
  return str.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 40)
}

// Heurística: é uma relíquia reutilizável?
// (decisão arquitetural, padrão, aprendizado técnico)
function isReusable(text) {
  const keywords = [
    'decidi', 'optei', 'escolhi', 'padrão', 'arquitetura',
    'descobri', 'aprendi', 'importante', 'cuidado', 'atenção',
    'nunca', 'sempre', 'regra', 'motivo', 'porque', 'pois',
    'solução', 'problema', 'erro', 'bug', 'fix',
  ]
  const lower = text.toLowerCase()
  return keywords.some(k => lower.includes(k))
}

export async function relic(args) {
  const text = args.join(' ').trim()
  if (!text) {
    console.log(chalk.red('\n  Descreva a relíquia encontrada:\n'))
    console.log(chalk.dim('  codemaster relic "Optei por Redis — TTL de 5min atende o SLA"\n'))
    return
  }

  const config = await getConfig()
  const active = await getActiveQuest()

  if (!active) {
    console.log(chalk.yellow('\n  ⚠  Nenhuma missão ativa.'))
    console.log(chalk.dim('  Inicie uma com: codemaster quest "nome"\n'))

    // Mesmo sem quest ativa, salva como relíquia avulsa
    const relicFile = path.join(
      config.vault, 'relics',
      `${dateStr()}-avulsa-${toSlug(text.slice(0, 30))}.md`
    )
    await fs.outputFile(relicFile, `# 🔮 Relíquia Avulsa\n\n> ${new Date().toLocaleString('pt-BR')}\n\n${text}\n\n#relic #avulsa\n`)
    console.log(chalk.dim(`  Salva como relíquia avulsa: ${relicFile}\n`))
    return
  }

  // Adicionar à quest ativa
  const entry = `\n**[${timeStr()}]** ${text}\n`
  let content = await fs.readFile(active.file, 'utf-8')

  const marker = '> *(registradas com `@codemaster relic` durante a missão)*'
  if (content.includes(marker)) {
    content = content.replace(marker, marker + '\n' + entry)
  } else {
    content += entry
  }
  await fs.writeFile(active.file, content)

  // Se parece ser reutilizável, salvar também em /relics
  if (isReusable(text)) {
    const relicFile = path.join(
      config.vault, 'relics',
      `${dateStr()}-${toSlug(text.slice(0, 30))}.md`
    )
    await fs.outputFile(relicFile, `# 🔮 ${text.slice(0, 60)}${text.length > 60 ? '…' : ''}

> **Missão:** ${active.name}
> **Data:** ${new Date().toLocaleString('pt-BR')}

${text}

---

#relic #${toSlug(active.name)}
`)
    console.log(`\n  ${chalk.green('✓')} Relíquia registrada na missão e arquivada em ${chalk.dim('relics/')}`)
  } else {
    console.log(`\n  ${chalk.green('✓')} ${chalk.bold('🔮 Relíquia registrada')} em ${chalk.italic(active.name)}`)
  }

  console.log(chalk.dim(`  [${timeStr()}] ${text.slice(0, 70)}${text.length > 70 ? '…' : ''}\n`))
}
