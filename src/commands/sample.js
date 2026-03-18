// src/commands/sample.js
import { select, confirm } from '@inquirer/prompts'
import { readFile, writeFile, mkdir } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import chalk from 'chalk'
import { readConfig } from '../services/config.js'

const __dirname_esm = dirname(fileURLToPath(import.meta.url))
const EXAMPLES_DIR  = join(__dirname_esm, '../../templates/obsidian-example')

const blank = () => console.log('')

const SAMPLES = {
  'quest-ativa': {
    label: 'Quest em andamento — quest ativa com relic registrada',
    files: [
      { src: join('quests', 'Q006-implementar-websockets.md'), dest: join('quests', 'Q006-implementar-websockets.md') },
      { src: join('relics', 'R006-websocket-vs-sse-quando-usar-cada.md'), dest: join('relics', 'R006-websocket-vs-sse-quando-usar-cada.md') },
    ],
    hint: 'Quest criada pelo /codemaster:quest · Relic registrada pelo /codemaster:relic · Ainda sem victory',
  },
  'quest-finalizada': {
    label: 'Quest finalizada — quest com victory e relic',
    files: [
      { src: join('quests', 'Q007-implementar-cache-redis.md'), dest: join('quests', 'Q007-implementar-cache-redis.md') },
      { src: join('victories', 'Q007-implementar-cache-redis.md'), dest: join('victories', 'Q007-implementar-cache-redis.md') },
      { src: join('relics', 'R007-cache-invalidation-patterns-ttl-vs-event.md'), dest: join('relics', 'R007-cache-invalidation-patterns-ttl-vs-event.md') },
    ],
    hint: 'Quest finalizada pelo /codemaster:victory · Victory em victories/ · Quest e victory linkadas bidirecionalmente',
  },
  milestone: {
    label: 'Milestone completo — 5 quests arquivadas em M01/ + summary + PROGRESS',
    files: [
      // 5 quests em M01/
      { src: join('quests', 'M01', 'Q001-exemplo-quest.md'), dest: join('quests', 'M01', 'Q001-exemplo-quest.md') },
      { src: join('quests', 'M01', 'Q002-refatoracao-service-layer.md'), dest: join('quests', 'M01', 'Q002-refatoracao-service-layer.md') },
      { src: join('quests', 'M01', 'Q003-integracao-api-externa.md'), dest: join('quests', 'M01', 'Q003-integracao-api-externa.md') },
      { src: join('quests', 'M01', 'Q004-testes-unitarios-coverage-80.md'), dest: join('quests', 'M01', 'Q004-testes-unitarios-coverage-80.md') },
      { src: join('quests', 'M01', 'Q005-deploy-automatizado-ci-cd.md'), dest: join('quests', 'M01', 'Q005-deploy-automatizado-ci-cd.md') },
      // 5 victories em M01/
      { src: join('victories', 'M01', 'Q001-exemplo-quest.md'), dest: join('victories', 'M01', 'Q001-exemplo-quest.md') },
      { src: join('victories', 'M01', 'Q002-refatoracao-service-layer.md'), dest: join('victories', 'M01', 'Q002-refatoracao-service-layer.md') },
      { src: join('victories', 'M01', 'Q003-integracao-api-externa.md'), dest: join('victories', 'M01', 'Q003-integracao-api-externa.md') },
      { src: join('victories', 'M01', 'Q004-testes-unitarios-coverage-80.md'), dest: join('victories', 'M01', 'Q004-testes-unitarios-coverage-80.md') },
      { src: join('victories', 'M01', 'Q005-deploy-automatizado-ci-cd.md'), dest: join('victories', 'M01', 'Q005-deploy-automatizado-ci-cd.md') },
      // 5 relics em M01/
      { src: join('relics', 'M01', 'R001-vulnerabilidade-algorithm-none-em-jwt.md'), dest: join('relics', 'M01', 'R001-vulnerabilidade-algorithm-none-em-jwt.md') },
      { src: join('relics', 'M01', 'R002-service-layer-funcoes-puras-vs-classes.md'), dest: join('relics', 'M01', 'R002-service-layer-funcoes-puras-vs-classes.md') },
      { src: join('relics', 'M01', 'R003-circuit-breaker-half-open-state.md'), dest: join('relics', 'M01', 'R003-circuit-breaker-half-open-state.md') },
      { src: join('relics', 'M01', 'R004-test-doubles-stub-mock-spy-fake.md'), dest: join('relics', 'M01', 'R004-test-doubles-stub-mock-spy-fake.md') },
      { src: join('relics', 'M01', 'R005-github-actions-cache-estrategia.md'), dest: join('relics', 'M01', 'R005-github-actions-cache-estrategia.md') },
      // quest finalizada do milestone 2 em andamento
      { src: join('quests', 'Q007-implementar-cache-redis.md'), dest: join('quests', 'Q007-implementar-cache-redis.md') },
      { src: join('victories', 'Q007-implementar-cache-redis.md'), dest: join('victories', 'Q007-implementar-cache-redis.md') },
      { src: join('relics', 'R007-cache-invalidation-patterns-ttl-vs-event.md'), dest: join('relics', 'R007-cache-invalidation-patterns-ttl-vs-event.md') },
      // quest em andamento do milestone 2
      { src: join('quests', 'Q006-implementar-websockets.md'), dest: join('quests', 'Q006-implementar-websockets.md') },
      { src: join('relics', 'R006-websocket-vs-sse-quando-usar-cada.md'), dest: join('relics', 'R006-websocket-vs-sse-quando-usar-cada.md') },
      // milestone summary + PROGRESS + KNOWLEDGE-MAP
      { src: 'M01-summary.md', dest: 'M01-summary.md' },
      { src: 'PROGRESS.md', dest: 'PROGRESS.md' },
      { src: 'KNOWLEDGE-MAP.md', dest: 'KNOWLEDGE-MAP.md' },
    ],
    hint: 'M01/ contém milestone arquivado · Q006 ativa · Q007 finalizada · PROGRESS com histórico completo',
  },
}

async function copyToVault(vaultPath, files) {
  const created = []
  for (const { src, dest } of files) {
    const srcPath  = join(EXAMPLES_DIR, src)
    const destPath = join(vaultPath, dest)
    await mkdir(dirname(destPath), { recursive: true })
    const content = await readFile(srcPath, 'utf8')
    await writeFile(destPath, content, 'utf8')
    created.push(destPath)
  }
  return created
}

export async function sample() {
  blank()
  console.log('  ' + chalk.bold.yellow('⚔  CodeMaster') + chalk.dim(' — Exemplos de output real'))
  blank()
  console.log('  ' + chalk.dim('Escolha um exemplo para criá-lo no seu Obsidian Vault.'))
  blank()

  const config    = await readConfig()
  const vaultPath = config.obsidian?.vault_path ?? config.vault ?? null

  if (!vaultPath) {
    console.log('  ' + chalk.red('Vault não configurado.') + chalk.dim(' Execute ') + chalk.cyan('codemaster setup') + chalk.dim(' primeiro.'))
    blank()
    return
  }

  const choice = await select({
    message: 'Qual exemplo você quer criar no vault?',
    choices: Object.entries(SAMPLES).map(([value, s]) => ({ name: s.label, value })),
  })

  const sample = SAMPLES[choice]

  blank()
  console.log('  ' + chalk.dim('Vault: ') + chalk.cyan(vaultPath))
  console.log('  ' + chalk.dim('Arquivos que serão criados:'))
  for (const { dest } of sample.files) {
    console.log('  ' + chalk.dim('  • ') + chalk.white(dest))
  }
  blank()

  const ok = await confirm({ message: 'Criar os arquivos de exemplo no vault?', default: true })
  if (!ok) {
    console.log('  ' + chalk.dim('Cancelado.'))
    blank()
    return
  }

  const created = await copyToVault(vaultPath, sample.files)

  blank()
  console.log('  ' + chalk.green('✓  Arquivos criados com sucesso!'))
  blank()
  for (const path of created) {
    console.log('  ' + chalk.dim('  ✓ ') + chalk.cyan(path))
  }
  blank()
  console.log('  ' + chalk.dim(sample.hint))
  blank()
  console.log('  ' + chalk.dim('Abra o Obsidian para ver os arquivos de exemplo.'))
  blank()
}
