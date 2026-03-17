// src/index.js
import { Command } from 'commander'
import { setup }   from './commands/setup.js'
import { guide }   from './commands/guide.js'
import { sample }  from './commands/sample.js'
import { quest }   from './commands/quest.js'
import { relic }   from './commands/relic.js'
import { victory } from './commands/victory.js'
import { legend }  from './commands/legend.js'

const program = new Command()

program
  .name('codemaster')
  .description([
    'AI Engineer Evolution Agent — mentor de engenharia local-first.',
    '',
    'Os 5 momentos (quest, relic, victory, legend, knowledge) funcionam',
    'dentro do seu agente de IA via slash commands:',
    '  /codemaster:quest   /codemaster:relic   /codemaster:victory',
    '  /codemaster:legend  /codemaster:knowledge',
    '',
    'Use "codemaster setup" para instalar os comandos no seu agente.',
  ].join('\n'))
  .version('0.2.1')

program
  .command('setup')
  .description('Instala e configura o CodeMaster nos agentes de IA (Claude Code, Codex…)')
  .action(() => setup())

program
  .command('guide')
  .description('Explica o método CodeMaster com o fluxo completo dos 5 momentos')
  .action(() => guide())

program
  .command('sample')
  .description('Visualiza exemplos reais de output: quest encerrada, milestone e knowledge map')
  .action(() => sample())

program
  .command('quest [name...]')
  .description('[uso interno] Suporte ao slash command /codemaster:quest no agente')
  .action((name) => quest(name))

program
  .command('relic [note...]')
  .description('[uso interno] Suporte ao slash command /codemaster:relic no agente')
  .action((note) => relic(note))

program
  .command('victory')
  .description('[uso interno] Suporte ao slash command /codemaster:victory no agente')
  .action(() => victory([]))

program
  .command('legend')
  .description('[uso interno] Suporte ao slash command /codemaster:legend no agente')
  .action(() => legend([]))

program.parse()
