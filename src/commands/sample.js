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
      { src: join('quests', 'Q006-notificacoes-tempo-real.md'), dest: join('quests', 'Q006-notificacoes-tempo-real.md') },
      { src: join('relics', 'R006-websocket-vs-sse-decisao-arquitetural.md'), dest: join('relics', 'R006-websocket-vs-sse-decisao-arquitetural.md') },
    ],
    hint: 'Quest criada pelo /codemaster:quest · Relic registrada pelo /codemaster:relic · Ainda sem victory',
  },
  'quest-finalizada': {
    label: 'Quest finalizada — quest com victory e relic',
    files: [
      { src: join('quests', 'Q007-dashboard-gerencial-cache.md'), dest: join('quests', 'Q007-dashboard-gerencial-cache.md') },
      { src: join('victories', 'Q007-dashboard-gerencial-cache.md'), dest: join('victories', 'Q007-dashboard-gerencial-cache.md') },
      { src: join('relics', 'R007-latencia-percebida-metrica-negocio.md'), dest: join('relics', 'R007-latencia-percebida-metrica-negocio.md') },
    ],
    hint: 'Quest finalizada pelo /codemaster:victory · Victory em victories/ · Quest e victory linkadas bidirecionalmente',
  },
  milestone: {
    label: 'Milestone completo — 5 quests arquivadas em M01/ + summary + PROGRESS',
    files: [
      // 5 quests em M01/
      { src: join('quests', 'M01', 'Q001-autenticacao-segura-checkout.md'), dest: join('quests', 'M01', 'Q001-autenticacao-segura-checkout.md') },
      { src: join('quests', 'M01', 'Q002-motor-descontos-fidelidade.md'), dest: join('quests', 'M01', 'Q002-motor-descontos-fidelidade.md') },
      { src: join('quests', 'M01', 'Q003-pagamento-resiliente-a-falhas.md'), dest: join('quests', 'M01', 'Q003-pagamento-resiliente-a-falhas.md') },
      { src: join('quests', 'M01', 'Q004-testes-regras-precificacao.md'), dest: join('quests', 'M01', 'Q004-testes-regras-precificacao.md') },
      { src: join('quests', 'M01', 'Q005-pipeline-ci-cd-deploy-automatico.md'), dest: join('quests', 'M01', 'Q005-pipeline-ci-cd-deploy-automatico.md') },
      // 5 victories em M01/
      { src: join('victories', 'M01', 'Q001-autenticacao-segura-checkout.md'), dest: join('victories', 'M01', 'Q001-autenticacao-segura-checkout.md') },
      { src: join('victories', 'M01', 'Q002-motor-descontos-fidelidade.md'), dest: join('victories', 'M01', 'Q002-motor-descontos-fidelidade.md') },
      { src: join('victories', 'M01', 'Q003-pagamento-resiliente-a-falhas.md'), dest: join('victories', 'M01', 'Q003-pagamento-resiliente-a-falhas.md') },
      { src: join('victories', 'M01', 'Q004-testes-regras-precificacao.md'), dest: join('victories', 'M01', 'Q004-testes-regras-precificacao.md') },
      { src: join('victories', 'M01', 'Q005-pipeline-ci-cd-deploy-automatico.md'), dest: join('victories', 'M01', 'Q005-pipeline-ci-cd-deploy-automatico.md') },
      // 5 relics em M01/ (2 business, 2 ai_orchestration, 1 architecture)
      { src: join('relics', 'M01', 'R001-taxa-abandono-metrica-saude-produto.md'), dest: join('relics', 'M01', 'R001-taxa-abandono-metrica-saude-produto.md') },
      { src: join('relics', 'M01', 'R002-service-layer-funcoes-puras-vs-classes.md'), dest: join('relics', 'M01', 'R002-service-layer-funcoes-puras-vs-classes.md') },
      { src: join('relics', 'M01', 'R003-ia-calibracao-thresholds-resiliencia.md'), dest: join('relics', 'M01', 'R003-ia-calibracao-thresholds-resiliencia.md') },
      { src: join('relics', 'M01', 'R004-custo-bugs-producao-vs-qualidade.md'), dest: join('relics', 'M01', 'R004-custo-bugs-producao-vs-qualidade.md') },
      { src: join('relics', 'M01', 'R005-ia-acelerador-pipeline-ci-cd.md'), dest: join('relics', 'M01', 'R005-ia-acelerador-pipeline-ci-cd.md') },
      // quest finalizada do milestone 2
      { src: join('quests', 'Q007-dashboard-gerencial-cache.md'), dest: join('quests', 'Q007-dashboard-gerencial-cache.md') },
      { src: join('victories', 'Q007-dashboard-gerencial-cache.md'), dest: join('victories', 'Q007-dashboard-gerencial-cache.md') },
      { src: join('relics', 'R007-latencia-percebida-metrica-negocio.md'), dest: join('relics', 'R007-latencia-percebida-metrica-negocio.md') },
      // quest em andamento do milestone 2
      { src: join('quests', 'Q006-notificacoes-tempo-real.md'), dest: join('quests', 'Q006-notificacoes-tempo-real.md') },
      { src: join('relics', 'R006-websocket-vs-sse-decisao-arquitetural.md'), dest: join('relics', 'R006-websocket-vs-sse-decisao-arquitetural.md') },
      // milestone summary + PROGRESS + KNOWLEDGE-MAP
      { src: join('milestones', 'M01-summary.md'), dest: join('milestones', 'M01-summary.md') },
      { src: 'PROGRESS.md', dest: 'PROGRESS.md' },
      { src: 'KNOWLEDGE-MAP.md', dest: 'KNOWLEDGE-MAP.md' },
    ],
    hint: 'M01/ arquivado · Q006 ativa · Q007 finalizada · Relics: 2 negócio + 2 IA + 1 arquitetura',
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
