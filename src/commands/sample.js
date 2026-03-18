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
  quest: {
    label: 'Quest encerrada com Victory — notas, reflexões e scores por dimensão',
    files: [
      { src: join('quests', 'Q001-exemplo-quest.md'), dest: join('quests', 'Q001-exemplo-quest.md') },
      { src: join('victories', 'Q001-exemplo-quest.md'), dest: join('victories', 'Q001-exemplo-quest.md') },
      { src: join('relics', 'R001-vulnerabilidade-algorithm-none-em-jwt.md'), dest: join('relics', 'R001-vulnerabilidade-algorithm-none-em-jwt.md') },
      { src: 'PROGRESS.md', dest: 'PROGRESS.md' },
    ],
    hint: 'Quest criada pelo /codemaster:quest · Victory em victories/ pelo /codemaster:victory · Ambas linkadas entre si',
  },
  milestone: {
    label: 'Milestone completo — 5 quests, 5 victories, 5 relics, summary e PROGRESS',
    files: [
      // 5 quests
      { src: join('quests', 'Q001-exemplo-quest.md'), dest: join('quests', 'Q001-exemplo-quest.md') },
      { src: join('quests', 'Q002-refatoracao-service-layer.md'), dest: join('quests', 'Q002-refatoracao-service-layer.md') },
      { src: join('quests', 'Q003-integracao-api-externa.md'), dest: join('quests', 'Q003-integracao-api-externa.md') },
      { src: join('quests', 'Q004-testes-unitarios-coverage-80.md'), dest: join('quests', 'Q004-testes-unitarios-coverage-80.md') },
      { src: join('quests', 'Q005-deploy-automatizado-ci-cd.md'), dest: join('quests', 'Q005-deploy-automatizado-ci-cd.md') },
      // 5 victories
      { src: join('victories', 'Q001-exemplo-quest.md'), dest: join('victories', 'Q001-exemplo-quest.md') },
      { src: join('victories', 'Q002-refatoracao-service-layer.md'), dest: join('victories', 'Q002-refatoracao-service-layer.md') },
      { src: join('victories', 'Q003-integracao-api-externa.md'), dest: join('victories', 'Q003-integracao-api-externa.md') },
      { src: join('victories', 'Q004-testes-unitarios-coverage-80.md'), dest: join('victories', 'Q004-testes-unitarios-coverage-80.md') },
      { src: join('victories', 'Q005-deploy-automatizado-ci-cd.md'), dest: join('victories', 'Q005-deploy-automatizado-ci-cd.md') },
      // 5 relics
      { src: join('relics', 'R001-vulnerabilidade-algorithm-none-em-jwt.md'), dest: join('relics', 'R001-vulnerabilidade-algorithm-none-em-jwt.md') },
      { src: join('relics', 'R002-service-layer-funcoes-puras-vs-classes.md'), dest: join('relics', 'R002-service-layer-funcoes-puras-vs-classes.md') },
      { src: join('relics', 'R003-circuit-breaker-half-open-state.md'), dest: join('relics', 'R003-circuit-breaker-half-open-state.md') },
      { src: join('relics', 'R004-test-doubles-stub-mock-spy-fake.md'), dest: join('relics', 'R004-test-doubles-stub-mock-spy-fake.md') },
      { src: join('relics', 'R005-github-actions-cache-estrategia.md'), dest: join('relics', 'R005-github-actions-cache-estrategia.md') },
      // milestone summary + PROGRESS
      { src: 'M01-summary.md', dest: 'M01-summary.md' },
      { src: 'PROGRESS.md', dest: 'PROGRESS.md' },
      { src: 'KNOWLEDGE-MAP.md', dest: 'KNOWLEDGE-MAP.md' },
    ],
    hint: '5 quests · 5 victories · 5 relics · M01-summary · PROGRESS · KNOWLEDGE-MAP — o ciclo completo de 1 milestone',
  },
  knowledge: {
    label: 'Knowledge Map — mapa de gaps gerado pelo /knowledge',
    files: [
      { src: 'KNOWLEDGE-MAP.md', dest: 'KNOWLEDGE-MAP.md' },
    ],
    hint: 'Criado/atualizado pelo /codemaster:knowledge após 3+ victories',
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
