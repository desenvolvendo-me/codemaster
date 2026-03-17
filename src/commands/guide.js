// src/commands/guide.js
import chalk from 'chalk'

const blank = () => console.log('')
const dim   = (s) => chalk.dim(s)
const bold  = (s) => chalk.bold(s)
const cyan  = (s) => chalk.cyan(s)
const green = (s) => chalk.green(s)
const yellow = (s) => chalk.yellow(s)
const white  = (s) => chalk.white(s)

function box(lines, width = 62) {
  const top    = '  ╔' + '═'.repeat(width) + '╗'
  const bottom = '  ╚' + '═'.repeat(width) + '╝'
  const sep    = '  ╠' + '═'.repeat(width) + '╣'
  const row    = (s) => {
    const pad = width - 2 - s.length
    return '  ║ ' + s + ' '.repeat(Math.max(0, pad)) + ' ║'
  }
  const blank  = () => row('')
  return { top, bottom, sep, row, blank }
}

export function guide() {
  blank()
  console.log('  ' + chalk.bold.yellow('⚔  CodeMaster') + chalk.dim(' — AI Engineer Evolution Agent'))
  blank()
  console.log('  ' + dim('Transforma cada demanda de desenvolvimento em aprendizado estruturado.'))
  console.log('  ' + dim('5 momentos · 3 dimensões · 100% local'))
  blank()

  const { top, bottom, sep, row, blank: bk } = box()

  // ── Ciclo de uma missão ─────────────────────────────────────────
  console.log(chalk.dim(top))
  console.log(chalk.dim(row(bold('  CICLO DE UMA MISSÃO'))))
  console.log(chalk.dim(sep))
  console.log(chalk.dim(bk()))
  console.log(chalk.dim(row('  ' + cyan('1') + '  ' + white('/codemaster:quest "nome da tarefa"'))))
  console.log(chalk.dim(row('     → Pergunta âncora + 3 reflexões (Negócio · Arq · IA)')))
  console.log(chalk.dim(row('     → Cria ' + green('quests/Q001-slug.md') + ' no Obsidian Vault')))
  console.log(chalk.dim(row('     → Registra ' + green('active-quest.json') + ' como missão ativa')))
  console.log(chalk.dim(bk()))
  console.log(chalk.dim(row('                         ↓')))
  console.log(chalk.dim(bk()))
  console.log(chalk.dim(row('  ' + cyan('2') + '  ' + white('/codemaster:relic "descoberta"') + dim('  ← repetível'))))
  console.log(chalk.dim(row('     → Classifica dimensão e registra na quest ativa')))
  console.log(chalk.dim(row('     → Opcionalmente arquiva em ' + green('relics/') + ' se reutilizável')))
  console.log(chalk.dim(bk()))
  console.log(chalk.dim(row('                         ↓')))
  console.log(chalk.dim(bk()))
  console.log(chalk.dim(row('  ' + cyan('3') + '  ' + white('/codemaster:victory'))))
  console.log(chalk.dim(row('     → 5 perguntas de reflexão contextual')))
  console.log(chalk.dim(row('     → Scores 0–10 por dimensão  ↑ ≥7   → 4–6   ↓ <4')))
  console.log(chalk.dim(row('     → Atualiza ' + green('PROGRESS.md') + ' e encerra missão')))
  console.log(chalk.dim(bk()))
  console.log(chalk.dim(sep))
  console.log(chalk.dim(row(bold('  A QUALQUER MOMENTO'))))
  console.log(chalk.dim(sep))
  console.log(chalk.dim(bk()))
  console.log(chalk.dim(row('  ' + cyan('4') + '  ' + white('/codemaster:legend') + '    → Histórico de evolução e tendências')))
  console.log(chalk.dim(row('  ' + cyan('5') + '  ' + white('/codemaster:knowledge') + ' → Diagnóstico de gaps de aprendizado')))
  console.log(chalk.dim(bk()))
  console.log(chalk.dim(sep))
  console.log(chalk.dim(row(bold('  A CADA 5 VICTORIES — milestone completo'))))
  console.log(chalk.dim(sep))
  console.log(chalk.dim(bk()))
  console.log(chalk.dim(row('  → ' + green('M01-summary.md') + ' criado automaticamente no vault')))
  console.log(chalk.dim(row('     Médias por dimensão · padrões emergentes · foco recomendado')))
  console.log(chalk.dim(row('  → ' + green('KNOWLEDGE-MAP.md') + ' atualizado pelo /knowledge')))
  console.log(chalk.dim(bk()))
  console.log(chalk.dim(bottom))

  blank()

  // ── As 3 dimensões ─────────────────────────────────────────────
  console.log('  ' + chalk.bold.white('As 3 Dimensões de Evolução'))
  blank()
  console.log('  ' + chalk.cyan('Negócio') + dim('        — entender e gerar valor real para o produto'))
  console.log('  ' + chalk.cyan('Arquitetura') + dim('    — decisões técnicas com clareza e trade-offs'))
  console.log('  ' + chalk.cyan('Orquestração IA') + dim(' — usar agentes e LLMs de forma estratégica'))
  blank()

  // ── Vault criado no Obsidian ────────────────────────────────────
  console.log('  ' + chalk.bold.white('Estrutura criada no Obsidian Vault'))
  blank()
  console.log('  ' + dim('seu-vault/'))
  console.log('  ' + dim('├── quests/          ← notas de quest e victory'))
  console.log('  ' + dim('├── relics/          ← descobertas arquivadas'))
  console.log('  ' + dim('├── PROGRESS.md      ← histórico de victories'))
  console.log('  ' + dim('├── KNOWLEDGE-MAP.md ← mapa de gaps'))
  console.log('  ' + dim('└── M01-summary.md   ← gerado na 5ª victory'))
  blank()

  // ── Próximos passos ─────────────────────────────────────────────
  console.log('  ' + chalk.bold.white('Primeiros passos'))
  blank()
  console.log('  ' + chalk.dim('1.') + ' ' + chalk.cyan('codemaster setup') + chalk.dim(' — instala e configura tudo (< 5 min)'))
  console.log('  ' + chalk.dim('2.') + ' Abra o Claude Code dentro do seu projeto')
  console.log('  ' + chalk.dim('3.') + ' Use ' + chalk.cyan('/codemaster:quest "nome da tarefa"') + chalk.dim(' para iniciar'))
  blank()
  console.log('  ' + chalk.dim('Para ver exemplos de output real, use: ') + chalk.cyan('codemaster sample'))
  blank()
}
