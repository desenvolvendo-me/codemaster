// src/commands/setup.js
import inquirer from 'inquirer'
import chalk from 'chalk'
import ora from 'ora'
import boxen from 'boxen'
import { execSync } from 'child_process'
import open from 'open'
import path from 'path'
import os from 'os'
import fs from 'fs-extra'
import { saveConfig, isConfigured, getConfig } from '../workspace/config.js'
import { initWorkspace } from '../workspace/init.js'
import { injectAgentInstructions } from '../workspace/inject.js'

// ─── helpers ──────────────────────────────────────────────────────────────────
const blank = () => console.log('')
const hr    = () => console.log(chalk.dim('  ' + '─'.repeat(56)))
const ok    = t  => console.log('  ' + chalk.green('✓') + '  ' + t)
const warn  = t  => console.log('  ' + chalk.yellow('⚠') + '  ' + t)
const info  = t  => console.log('  ' + chalk.dim('→') + ' ' + t)

function step(n, total, title) {
  blank()
  console.log(
    chalk.dim(`  [${n}/${total}]`) + ' ' + chalk.bold.yellow('⚔  ') + chalk.bold.white(title)
  )
  hr()
  blank()
}

async function checkCommand(cmd) {
  try { execSync(`which ${cmd}`, { stdio: 'ignore' }); return true }
  catch { return false }
}

async function isObsidianInstalled() {
  if (process.platform === 'darwin')
    return fs.pathExists('/Applications/Obsidian.app')
  if (process.platform === 'win32')
    return fs.pathExists('C:\\Program Files\\Obsidian\\Obsidian.exe')
  return checkCommand('obsidian')
}

async function isGitInstalled() {
  return checkCommand('git')
}

// ─── Setup principal ──────────────────────────────────────────────────────────
export async function setup() {

  // Já configurado? Carregar valores existentes como defaults
  let existing = null
  if (await isConfigured()) {
    blank()
    existing = await getConfig()
    info(`Configurado como: ${chalk.bold(existing.dev.name)} — ${existing.dev.role}`)
    blank()
    const { rerun } = await inquirer.prompt([{
      type: 'confirm',
      name: 'rerun',
      message: chalk.yellow('  Alterar configurações?'),
      default: false,
    }])
    if (!rerun) { info('Setup cancelado.'); blank(); return }
  }

  // ── Boas-vindas ────────────────────────────────────────────────────────────
  blank()
  console.log(boxen(
    chalk.bold.yellow('⚔  CodeMaster') +
    chalk.dim('\nAI Engineer Evolution Agent') +
    chalk.dim('\nForjando seu destino'),
    { padding: 1, margin: { left: 2 }, borderStyle: 'double', borderColor: 'yellow' }
  ))
  blank()
  info('Sou o CodeMaster — seu mentor de AI Engineer.')
  info('Vou te fazer algumas perguntas para forjar sua identidade de herói.')
  info('Todas as suas missões, relíquias e vitórias ficarão no Obsidian, na sua máquina, versionadas no GitHub.')
  blank()

  const { go } = await inquirer.prompt([{
    type: 'confirm', name: 'go',
    message: chalk.white('  Pronto para começar a jornada?'),
    default: true,
  }])
  if (!go) { info('Até a próxima aventura.'); blank(); return }

  // ══════════════════════════════════════════════════════════════════════════
  // ETAPA 1 — Identidade do Herói
  // ══════════════════════════════════════════════════════════════════════════
  step(1, 5, 'A Identidade do Herói')

  const FIXED_STACKS = ['JavaScript','Python','TypeScript','Java','C#','PHP','C / C++','Ruby','Go','Rust']
  const existingStack = existing?.dev?.stack || []
  // separa stacks fixas das customizadas
  const existingFixed  = existingStack.filter(s => FIXED_STACKS.includes(s))
  const existingCustom = existingStack.filter(s => !FIXED_STACKS.includes(s)).join(', ')

  const identity = await inquirer.prompt([
    {
      type: 'input', name: 'name',
      message: chalk.white('  Como você se chama, herói?'),
      default: existing?.dev?.name,
      validate: v => v.trim().length > 0 || 'Informe seu nome',
    },
    {
      type: 'list', name: 'role',
      message: chalk.white('  Qual é sua classe? (cargo atual)'),
      default: existing?.dev?.role,
      choices: ['Full Stack','Backend','Frontend','Mobile','DevOps'],
    },
    {
      type: 'list', name: 'experience',
      message: chalk.white('  Quantas batalhas você já travou?'),
      default: existing?.dev?.experience,
      choices: [
        { name: 'Iniciante',     value: 'junior-0' },
        { name: 'Junior',        value: 'junior'   },
        { name: 'Pleno',         value: 'mid'      },
        { name: 'Sênior',        value: 'senior'   },
        { name: 'Líder Técnico', value: 'staff'    },
      ],
    },
    {
      type: 'checkbox', name: 'stack',
      message: chalk.white('  Quais armas você domina? (stack principal)'),
      choices: [
        ...FIXED_STACKS.map(s => ({ name: s, value: s, checked: existingFixed.includes(s) })),
        new inquirer.Separator(),
        { name: 'Outra (informar abaixo)', value: '__other__', checked: existingCustom.length > 0 },
      ],
    },
    {
      type: 'input', name: 'stackOther',
      message: chalk.white('  Qual outra linguagem?'),
      default: existingCustom || undefined,
      when: (answers) => answers.stack.includes('__other__'),
    },
  ])

  blank()
  const { agentic } = await inquirer.prompt([{
    type: 'confirm', name: 'agentic',
    message: chalk.white('  Você quer se tornar um Programador Agêntico?'),
    default: true,
  }])
  if (!agentic) {
    blank()
    info('O CodeMaster é feito para quem quer dominar a era dos agentes.')
    info('Quando estiver pronto, volte. A jornada te espera.')
    blank()
    return
  }

  // ══════════════════════════════════════════════════════════════════════════
  // ETAPA 2 — Nível nas 3 dimensões
  // ══════════════════════════════════════════════════════════════════════════
  step(2, 5, 'Os Atributos do Herói')

  info('Estas são as 3 dimensões que o CodeMaster vai acompanhar.')
  info('Seja honesto — este é seu baseline, não um julgamento.')
  blank()

  const existingFocus = existing?.dev?.focus || []

  const levels = await inquirer.prompt([
    {
      type: 'list', name: 'business',
      message: chalk.white('  Negócio — seu nível de entendimento de valor de negócio:'),
      default: existing?.levels?.business != null ? existing.levels.business - 1 : undefined,
      choices: [
        { name: '1 — Executo tarefas, raramente penso em impacto de negócio',    value: 1 },
        { name: '2 — Entendo o impacto quando alguém me explica',                value: 2 },
        { name: '3 — Consigo avaliar impacto sozinho na maioria das demandas',   value: 3 },
        { name: '4 — Proponho soluções considerando ROI e priorização',          value: 4 },
        { name: '5 — Influencio decisões estratégicas de produto/engenharia',    value: 5 },
      ],
    },
    {
      type: 'list', name: 'architecture',
      message: chalk.white('  Arquitetura — seu nível de decisões técnicas:'),
      default: existing?.levels?.architecture != null ? existing.levels.architecture - 1 : undefined,
      choices: [
        { name: '1 — Sigo padrões já estabelecidos, pouca tomada de decisão',    value: 1 },
        { name: '2 — Começo a questionar e propor abordagens alternativas',      value: 2 },
        { name: '3 — Tomo decisões arquiteturais com justificativa clara',       value: 3 },
        { name: '4 — Projeto sistemas com foco em escalabilidade e tradeoffs',   value: 4 },
        { name: '5 — Defino padrões de arquitetura para o time/empresa',         value: 5 },
      ],
    },
    {
      type: 'list', name: 'ai_orchestration',
      message: chalk.white('  Orquestração de IA — como você usa LLMs e agentes:'),
      default: existing?.levels?.ai_orchestration != null ? existing.levels.ai_orchestration - 1 : undefined,
      choices: [
        { name: '1 — Uso chat ocasionalmente para tirar dúvidas',                value: 1 },
        { name: '2 — Uso IA para geração de código e explicações',               value: 2 },
        { name: '3 — Tenho workflow definido com agentes (Claude Code, Codex…)', value: 3 },
        { name: '4 — Crio prompts avançados, uso RAG, ferramentas customizadas', value: 4 },
        { name: '5 — Projeto e orquestro sistemas multi-agente',                 value: 5 },
      ],
    },
    {
      type: 'checkbox', name: 'focus',
      message: chalk.white('  Em quais dimensões quer focar nas próximas 10 demandas?'),
      choices: [
        { name: 'Negócio',         value: 'business',         checked: existingFocus.includes('business')         },
        { name: 'Arquitetura',     value: 'architecture',     checked: existingFocus.includes('architecture')     },
        { name: 'Orquestração IA', value: 'ai_orchestration', checked: existingFocus.includes('ai_orchestration') },
      ],
    },
  ])

  // ══════════════════════════════════════════════════════════════════════════
  // ETAPA 3 — Obsidian (o Grimório)
  // ══════════════════════════════════════════════════════════════════════════
  step(3, 5, 'O Grimório — Obsidian')

  info('O Obsidian é onde sua jornada será registrada.')
  info('Todas as missões, relíquias e vitórias ficam lá, em Markdown, na sua máquina.')
  blank()

  const hasObsidian = await isObsidianInstalled()

  if (hasObsidian) {
    ok('Obsidian detectado na sua máquina.')
  } else {
    warn('Obsidian não encontrado.')
    blank()
    info('Vou abrir o site para download. É gratuito e leva 1 minuto para instalar.')
    blank()

    const { doInstall } = await inquirer.prompt([{
      type: 'confirm', name: 'doInstall',
      message: chalk.white('  Abrir obsidian.md para download?'),
      default: true,
    }])

    if (doInstall) {
      const spin = ora('  Abrindo obsidian.md...').start()
      await open('https://obsidian.md/download')
      spin.succeed('Página aberta no navegador.')
      blank()
      await inquirer.prompt([{
        type: 'confirm', name: 'done',
        message: chalk.white('  Pressione Enter quando terminar a instalação do Obsidian.'),
        default: true,
      }])
    }
  }

  // Caminho do Vault
  blank()
  info('Agora escolha onde o Vault (sua base de conhecimento) vai ficar.')
  blank()

  const defaultVault = existing?.vault || path.join(os.homedir(), 'CodeMaster')
  const { vaultPath } = await inquirer.prompt([{
    type: 'input', name: 'vaultPath',
    message: chalk.white('  Caminho do Vault:'),
    default: defaultVault,
  }])
  const vault = path.resolve(vaultPath.replace(/^~/, os.homedir()))

  // ══════════════════════════════════════════════════════════════════════════
  // ETAPA 4 — GitHub (o Oráculo Eterno)
  // ══════════════════════════════════════════════════════════════════════════
  step(4, 5, 'O Oráculo Eterno — GitHub')

  info('Recomendo versionar o Vault com GitHub para nunca perder sua lenda.')
  info('Passos:')
  info('  1. Crie um repositório PRIVADO no GitHub (ex: codemaster-vault)')
  info('  2. Instale o plugin "Obsidian Git" dentro do Obsidian')
  info('  3. Conecte ao repositório — ele vai commitar automaticamente')
  blank()

  const hasGit = await isGitInstalled()
  if (!hasGit) {
    warn('Git não encontrado. Instale em https://git-scm.com antes de configurar o GitHub.')
  }

  const { openGH } = await inquirer.prompt([{
    type: 'confirm', name: 'openGH',
    message: chalk.white('  Abrir GitHub para criar o repositório agora?'),
    default: true,
  }])

  if (openGH) {
    await open('https://github.com/new')
    ok('GitHub aberto. Crie como privado e nomeie "codemaster-vault".')
    blank()
  }

  const { githubRepo } = await inquirer.prompt([{
    type: 'input', name: 'githubRepo',
    message: chalk.white('  URL do repositório (pode deixar em branco e configurar depois):'),
    default: existing?.github || '',
  }])

  // ══════════════════════════════════════════════════════════════════════════
  // ETAPA 5 — Integração com agentes de coding
  // ══════════════════════════════════════════════════════════════════════════
  step(5, 5, 'Forjando a Aliança — Agentes de Coding')

  info('O CodeMaster vai injetar as instruções globalmente nos seus agentes.')
  info('Skills, subagentes e comandos ficam disponíveis em qualquer projeto.')
  blank()

  // Detectar o que está instalado
  const detected = []
  if (await checkCommand('claude'))  detected.push('Claude Code')
  if (await checkCommand('codex'))   detected.push('Codex CLI')
  if (await checkCommand('cursor'))  detected.push('Cursor')
  if (detected.length > 0) {
    ok(`Detectados: ${detected.join(', ')}`)
    blank()
  }

  const { selectedAgents } = await inquirer.prompt([{
    type: 'checkbox', name: 'selectedAgents',
    message: chalk.white('  Quais agentes você quer integrar com o CodeMaster?'),
    choices: [
      { name: 'Claude Code  — ~/.claude/CLAUDE.md + commands', value: 'claude_code', checked: existing?.agents?.includes('claude_code') ?? detected.includes('Claude Code') },
      { name: 'Codex        — ~/.codex/instructions.md',        value: 'codex',       checked: existing?.agents?.includes('codex')       ?? detected.includes('Codex CLI')   },
    ],
  }])

  // ══════════════════════════════════════════════════════════════════════════
  // GRAVAR TUDO
  // ══════════════════════════════════════════════════════════════════════════
  blank()
  const spinner = ora('  ⚔  Forjando o Vault e as instruções do agente...').start()

  const config = {
    version: '0.2.0',
    dev: {
      name:       identity.name,
      role:       identity.role,
      experience: identity.experience,
      stack:      [...identity.stack.filter(s => s !== '__other__'), identity.stackOther].filter(Boolean),
      focus:      levels.focus,
    },
    levels: {
      business:         levels.business,
      architecture:     levels.architecture,
      ai_orchestration: levels.ai_orchestration,
    },
    vault,
    github:  githubRepo || null,
    agents:  selectedAgents,
    setupAt: new Date().toISOString(),
  }

  await saveConfig(config)
  await initWorkspace(config)

  const injected = await injectAgentInstructions(config, selectedAgents)
  spinner.succeed('Vault criado e instruções injetadas.')

  // ── Relatório de integrações ──────────────────────────────────────────────
  if (injected.length > 0) {
    blank()
    for (const r of injected) {
      ok(`${r.agent}: ${chalk.dim(r.file)}`)
      if (r.hint) info(r.hint)
    }
  }

  // ── Resultado final ────────────────────────────────────────────────────────
  blank()
  console.log(boxen(
    chalk.bold.yellow(`  ⚔  A lenda de ${identity.name} começa agora!\n\n`) +
    chalk.white('  Seu Vault está em:\n') +
    chalk.cyan(`  ${vault}\n\n`) +
    chalk.dim('  Próximos passos:\n\n') +
    chalk.yellow('  1. ') + chalk.white('Abra o Obsidian → "Open folder as vault" → selecione o Vault acima\n') +
    chalk.yellow('  2. ') + chalk.white('Instale o plugin "Obsidian Git" e conecte ao GitHub\n') +
    chalk.yellow('  3. ') + chalk.white('Inicie sua primeira missão:\n') +
    chalk.cyan('     @codemaster quest "Nome da missão"') +
    chalk.dim('\n     (dentro do Claude Code / Cursor)'),
    { padding: 1, margin: { left: 2 }, borderStyle: 'double', borderColor: 'yellow' }
  ))
  blank()
}
