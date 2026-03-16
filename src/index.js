// src/index.js
import { setup }   from './commands/setup.js'
import { quest }   from './commands/quest.js'
import { relic }   from './commands/relic.js'
import { victory } from './commands/victory.js'
import { legend }  from './commands/legend.js'
import chalk from 'chalk'

const COMMANDS = {
  setup,
  quest,
  relic,
  victory,
  legend,
}

export async function run(args) {
  const cmd = args[0]

  if (!cmd || cmd === '--help' || cmd === '-h') {
    printHelp()
    return
  }

  const fn = COMMANDS[cmd]
  if (!fn) {
    console.error(chalk.red(`\n  Comando desconhecido: "${cmd}"\n`))
    printHelp()
    process.exit(1)
  }

  try {
    await fn(args.slice(1))
  } catch (err) {
    console.error(chalk.red('\n  ⚔  Erro: ' + err.message))
    process.exit(1)
  }
}

function printHelp() {
  console.log(`
  ${chalk.bold.yellow('⚔  CodeMaster')} ${chalk.dim('— AI Engineer Evolution Agent')}

  ${chalk.dim('Comandos:')}

    ${chalk.cyan('codemaster setup')}              Instalação e configuração inicial
    ${chalk.cyan('codemaster quest')}  ${chalk.dim('"nome"')}       Inicia uma nova missão (demanda)
    ${chalk.cyan('codemaster relic')}  ${chalk.dim('"descoberta"')}  Registra uma relíquia no caminho
    ${chalk.cyan('codemaster victory')}             Finaliza a missão com reflexão épica
    ${chalk.cyan('codemaster legend')}              Consulta sua lenda — progresso e histórico

  ${chalk.dim('Exemplos:')}

    ${chalk.dim('codemaster quest "Implementar cache Redis"')}
    ${chalk.dim('codemaster relic "Optei por TTL de 5min — SLA exige atualização frequente"')}
    ${chalk.dim('codemaster victory')}

  ${chalk.dim('Dentro do Claude Code / Cursor:')}

    ${chalk.dim('@codemaster quest "Implementar cache Redis"')}
    ${chalk.dim('@codemaster relic "Decisão importante aqui"')}
    ${chalk.dim('@codemaster victory')}
  `)
}
