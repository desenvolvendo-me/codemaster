// src/index.js
import { Command } from 'commander'
import { setup }   from './commands/setup.js'
import { quest }   from './commands/quest.js'
import { relic }   from './commands/relic.js'
import { victory } from './commands/victory.js'
import { legend }  from './commands/legend.js'

const program = new Command()

program
  .name('codemaster')
  .description('AI Engineer Evolution Agent — mentor de engenharia local-first com vocabulário RPG')
  .version('0.2.1')

program
  .command('setup')
  .description('Instalação e configuração inicial')
  .action(() => setup())

program
  .command('quest [name...]')
  .description('Inicia uma nova missão (demanda)')
  .action((name) => quest(name))

program
  .command('relic [note...]')
  .description('Registra uma relíquia no caminho')
  .action((note) => relic(note))

program
  .command('victory')
  .description('Finaliza a missão com reflexão épica')
  .action(() => victory([]))

program
  .command('legend')
  .description('Consulta sua lenda — progresso e histórico')
  .action(() => legend([]))

program.parse()
