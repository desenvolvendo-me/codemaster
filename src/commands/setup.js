// src/commands/setup.js
import { input, select, confirm, checkbox, Separator } from '@inquirer/prompts'
import chalk from 'chalk'
import { execSync } from 'child_process'
import { resolve } from 'path'
import { homedir } from 'os'
import { readConfig, writeConfig } from '../services/config.js'
import { initVault } from '../services/vault.js'
import { printSuccess, printError, printEpic, printSection } from '../utils/output.js'
import { injectToClaude, injectToCodex } from '../services/injector.js'
import { initWorkspace } from '../workspace/init.js'

// ─── Pure function: montagem do config — testável ─────────────────────────────
export function buildConfig({ heroName, heroRole, stack,
  businessScore, archScore, aiScore, focusDimensions,
  vaultPath, agents, githubRepo }) {
  return {
    // Novo schema (para novas features)
    hero: {
      name: heroName,
      role: heroRole,
      stack,
    },
    dimensions: {
      business: businessScore,
      architecture: archScore,
      ai_orchestration: aiScore,
    },
    focus: focusDimensions,
    obsidian: { vault_path: vaultPath },
    agents: {
      claude_code: agents.includes('claude_code'),
      codex: agents.includes('codex'),
    },
    community: { opted_in: false, declined: false, email: null, phone: null },
    // Backward compat para commands existentes (quest, relic, victory, legend)
    dev: {
      name: heroName,
      role: heroRole,
      experience: heroRole,
      stack,
      focus: focusDimensions,
    },
    levels: {
      business: businessScore,
      architecture: archScore,
      ai_orchestration: aiScore,
    },
    vault: vaultPath,
    github: githubRepo || null,
    setupAt: new Date().toISOString(),
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const blank = () => console.log('')

function checkCommand(cmd) {
  try { execSync(`which ${cmd}`, { stdio: 'ignore' }); return true }
  catch { return false }
}

// ─── Setup principal ──────────────────────────────────────────────────────────
export async function setup() {
  try {
    // ── Carregar config existente para pré-preenchimento ───────────────────
    const existing = await readConfig()
    const isReconfigure = !!existing.hero?.name || !!existing.dev?.name

    if (isReconfigure) {
      const heroName = existing.hero?.name || existing.dev?.name
      blank()
      console.log('  ' + chalk.dim(`→`) + ' ' + `Configurado como: ${chalk.bold(heroName)}`)
      blank()
      const alterar = await confirm({
        message: chalk.yellow('Alterar configurações?'),
        default: false,
      })
      if (!alterar) {
        console.log('  ' + chalk.dim('→') + ' Setup cancelado.')
        blank()
        return
      }
    }

    // ── Apresentação dos 5 momentos e 3 dimensões (NFR1: concisa) ──────────
    blank()
    console.log(chalk.bold.yellow('  ⚔  CodeMaster') + chalk.dim(' — AI Engineer Evolution Agent'))
    blank()

    printEpic('Os 5 Momentos da Jornada', [
      '  /quest    → Inicia uma nova missão de desenvolvimento',
      '  /relic    → Registra uma descoberta ou decisão importante',
      '  /victory  → Encerra a missão com reflexão nas 3 dimensões',
      '  /legend   → Consulta seu progresso e histórico',
      '  /knowledge→ Mapeia seus gaps de aprendizado',
    ].join('\n'))

    printEpic('As 3 Dimensões que você vai evoluir', [
      '  Negócio         — entender e gerar valor real',
      '  Arquitetura      — tomar decisões técnicas com clareza',
      '  Orquestração IA  — usar agentes de forma estratégica',
    ].join('\n'))

    const comecar = await confirm({
      message: chalk.white('Pronto para forjar sua identidade de herói?'),
      default: true,
    })
    if (!comecar) {
      console.log('  ' + chalk.dim('→') + ' Até a próxima aventura.')
      blank()
      return
    }

    // ─────────────────────────────────────────────────────────────────────
    // PASSO 1 — Nome de herói
    // ─────────────────────────────────────────────────────────────────────
    blank()
    console.log(chalk.bold.white('  [1/9] Identidade'))
    blank()

    const heroName = await input({
      message: 'Como você se chama, herói?',
      default: existing.hero?.name || existing.dev?.name || '',
      validate: v => v.trim().length > 0 || 'Informe seu nome',
    })

    // ─────────────────────────────────────────────────────────────────────
    // PASSO 2 — Nível (seniority)
    // ─────────────────────────────────────────────────────────────────────
    const heroRole = await select({
      message: 'Qual é seu nível?',
      choices: [
        { name: 'Junior  — < 2 anos de experiência', value: 'junior' },
        { name: 'Pleno   — 2 a 5 anos',              value: 'pleno'  },
        { name: 'Senior  — > 5 anos',                value: 'senior' },
      ],
      default: existing.hero?.role || existing.dev?.experience || 'pleno',
    })

    // ─────────────────────────────────────────────────────────────────────
    // PASSO 3 — Stack
    // ─────────────────────────────────────────────────────────────────────
    const FIXED_STACKS = ['JavaScript', 'TypeScript', 'Python', 'Ruby', 'Java', 'C#', 'Go', 'Rust', 'PHP', 'C / C++']
    const existingStack = existing.hero?.stack || existing.dev?.stack || []
    const existingFixed = existingStack.filter(s => FIXED_STACKS.includes(s))
    const existingCustom = existingStack.filter(s => !FIXED_STACKS.includes(s)).join(', ')

    const selectedStack = await checkbox({
      message: 'Quais linguagens você usa? (stack principal)',
      choices: [
        ...FIXED_STACKS.map(s => ({ name: s, value: s, checked: existingFixed.includes(s) })),
        new Separator(),
        { name: 'Outra', value: '__other__', checked: existingCustom.length > 0 },
      ],
    })

    let stack = selectedStack.filter(s => s !== '__other__')
    if (selectedStack.includes('__other__')) {
      const other = await input({
        message: 'Qual outra linguagem?',
        default: existingCustom || '',
      })
      if (other.trim()) stack = [...stack, ...other.split(',').map(s => s.trim()).filter(Boolean)]
    }

    // ─────────────────────────────────────────────────────────────────────
    // PASSO 4–6 — Auto-avaliação nas 3 dimensões
    // ─────────────────────────────────────────────────────────────────────
    blank()
    console.log(chalk.bold.white('  [2/9] Atributos — auto-avaliação nas 3 dimensões (1–5)'))
    console.log(chalk.dim('  Seja honesto — este é seu baseline, não um julgamento.'))
    blank()

    const businessScore = await select({
      message: 'Negócio — entendimento de valor de negócio:',
      choices: [
        { name: '1 — Executo tarefas, raramente penso em impacto',         value: 1 },
        { name: '2 — Entendo o impacto quando alguém me explica',          value: 2 },
        { name: '3 — Consigo avaliar impacto sozinho na maioria dos casos', value: 3 },
        { name: '4 — Proponho soluções considerando ROI e priorização',    value: 4 },
        { name: '5 — Influencio decisões estratégicas de produto',         value: 5 },
      ],
      default: existing.dimensions?.business ?? existing.levels?.business ?? 2,
    })

    const archScore = await select({
      message: 'Arquitetura — nível de decisões técnicas:',
      choices: [
        { name: '1 — Sigo padrões estabelecidos, pouca tomada de decisão', value: 1 },
        { name: '2 — Começo a questionar e propor abordagens alternativas', value: 2 },
        { name: '3 — Tomo decisões arquiteturais com justificativa clara',  value: 3 },
        { name: '4 — Projeto sistemas com foco em escalabilidade',          value: 4 },
        { name: '5 — Defino padrões de arquitetura para o time',            value: 5 },
      ],
      default: existing.dimensions?.architecture ?? existing.levels?.architecture ?? 2,
    })

    const aiScore = await select({
      message: 'Orquestração IA — como você usa LLMs e agentes:',
      choices: [
        { name: '1 — Uso chat ocasionalmente para tirar dúvidas',              value: 1 },
        { name: '2 — Uso IA para geração de código e explicações',             value: 2 },
        { name: '3 — Tenho workflow definido com agentes (Claude, Codex…)',    value: 3 },
        { name: '4 — Crio prompts avançados, uso RAG, ferramentas customizadas', value: 4 },
        { name: '5 — Projeto e orquestro sistemas multi-agente',               value: 5 },
      ],
      default: existing.dimensions?.ai_orchestration ?? existing.levels?.ai_orchestration ?? 1,
    })

    // ─────────────────────────────────────────────────────────────────────
    // PASSO 8 — Foco de evolução
    // ─────────────────────────────────────────────────────────────────────
    const existingFocus = existing.focus || existing.dev?.focus || []
    const focusDimensions = await checkbox({
      message: 'Em quais dimensões quer focar nas próximas 10 missões?',
      choices: [
        { name: 'Negócio',          value: 'business',         checked: existingFocus.includes('business')         },
        { name: 'Arquitetura',      value: 'architecture',     checked: existingFocus.includes('architecture')     },
        { name: 'Orquestração IA',  value: 'ai_orchestration', checked: existingFocus.includes('ai_orchestration') },
      ],
    })

    // ─────────────────────────────────────────────────────────────────────
    // PASSO 9 — Vault path
    // ─────────────────────────────────────────────────────────────────────
    blank()
    console.log(chalk.bold.white('  [3/9] O Grimório — Obsidian'))
    console.log(chalk.dim('  Onde suas missões, relíquias e vitórias serão registradas.'))
    blank()

    const defaultVault = existing.obsidian?.vault_path || existing.vault ||
      resolve(homedir(), 'CodeMaster')

    let vaultPath = ''
    while (true) {
      const raw = await input({
        message: 'Caminho do Vault (pasta do Obsidian):',
        default: defaultVault,
      })
      vaultPath = resolve(raw.replace(/^~/, homedir()))
      break  // initVault fará a validação real (story 1.5)
    }

    // ─────────────────────────────────────────────────────────────────────
    // GitHub (funcionalidade existente — preservada)
    // ─────────────────────────────────────────────────────────────────────
    blank()
    console.log(chalk.bold.white('  [4/9] GitHub — versione sua lenda'))
    blank()

    const openGH = await confirm({
      message: 'Abrir GitHub para criar repositório privado do vault?',
      default: false,
    })

    let githubRepo = existing.github || ''
    if (openGH) {
      const { default: open } = await import('open')
      await open('https://github.com/new')
      printSuccess('GitHub aberto. Crie como privado e nomeie "codemaster-vault".')
      blank()
    }

    githubRepo = await input({
      message: 'URL do repositório (deixe em branco para configurar depois):',
      default: existing.github || '',
    })

    // ─────────────────────────────────────────────────────────────────────
    // PASSO 10 — Agentes
    // ─────────────────────────────────────────────────────────────────────
    blank()
    console.log(chalk.bold.white('  [5/9] Agentes de Coding'))
    blank()

    const detectedAgents = []
    if (checkCommand('claude'))  detectedAgents.push('claude_code')
    if (checkCommand('codex'))   detectedAgents.push('codex')

    const existingAgents = existing.agents
      ? (Array.isArray(existing.agents)
          ? existing.agents
          : Object.keys(existing.agents).filter(k => existing.agents[k]))
      : []

    const agents = await checkbox({
      message: 'Quais agentes integrar com o CodeMaster?',
      choices: [
        {
          name: 'Claude Code  — ~/.claude/CLAUDE.md + commands',
          value: 'claude_code',
          checked: existingAgents.includes('claude_code') || detectedAgents.includes('claude_code'),
        },
        {
          name: 'Codex CLI    — ~/.codex/instructions.md',
          value: 'codex',
          checked: existingAgents.includes('codex') || detectedAgents.includes('codex'),
        },
      ],
    })

    // ─────────────────────────────────────────────────────────────────────
    // PASSO 11 — Comunidade
    // ─────────────────────────────────────────────────────────────────────
    blank()
    console.log(chalk.bold.white('  [6/9] Comunidade CodeMaster'))
    blank()
    console.log('  ' + chalk.dim('Conecte com outros devs na mesma jornada de evolução.'))
    console.log('  ' + chalk.dim('Seus dados não serão tornados públicos.'))
    blank()

    const joinCommunity = await confirm({
      message: 'Quer se conectar à comunidade agora?',
      default: false,
    })

    // ─────────────────────────────────────────────────────────────────────
    // GRAVAR TUDO
    // ─────────────────────────────────────────────────────────────────────
    blank()
    console.log('  ' + chalk.dim('→') + ' Forjando seu perfil e o Vault...')

    const config = buildConfig({
      heroName, heroRole, stack,
      businessScore, archScore, aiScore,
      focusDimensions, vaultPath, agents, githubRepo,
    })

    if (joinCommunity) {
      config.community.opted_in = false  // opt-in completo via story 5.2
      // comunidade simplificada no setup — full flow via /victory
    }

    await writeConfig(config)
    printSuccess('Perfil salvo em ~/.codemaster/config.json')

    // Inicializar vault (story 1.5 implementa completamente)
    await initVault(vaultPath)

    // Inicializar workspace (estrutura legada do vault)
    await initWorkspace(config)
    printSuccess('Vault inicializado em: ' + chalk.cyan(vaultPath))

    // Injetar agentes nos coding agents selecionados
    if (agents.includes('claude_code')) {
      const projectDir = process.cwd()
      console.log('  ' + chalk.dim('→') + ` Instalando skills em: ${chalk.cyan(projectDir)}`)
      const result = await injectToClaude({ ...config, projectDir })
      if (result.skipped) {
        printSection('Claude Code', result.reason)
      } else {
        printSuccess(`Claude Code: skills instaladas em ${chalk.dim(result.skillsDir)}`)
        printSuccess(`Agentes globais: ${chalk.dim(result.agentsDir)}`)
        blank()
        console.log('  ' + chalk.dim('⚠  As skills funcionam no projeto onde o setup foi rodado.'))
        console.log('  ' + chalk.dim('   Para outros projetos, rode ') + chalk.cyan('codemaster setup') + chalk.dim(' dentro deles.'))
      }
    }

    if (agents.includes('codex')) {
      const result = await injectToCodex(config)
      if (result.skipped) {
        printSection('Codex', result.reason)
      } else {
        printSuccess(`Codex: instruções injetadas em ${chalk.dim(result.codexMdPath)}`)
      }
    }

    // ─────────────────────────────────────────────────────────────────────
    // RESULTADO FINAL
    // ─────────────────────────────────────────────────────────────────────
    blank()
    console.log(chalk.bold.yellow(`  ⚔  A lenda de ${heroName} começa agora!`))
    blank()
    console.log(chalk.dim('  Próximos passos:'))
    console.log(chalk.dim('  1. Abra o Obsidian → "Open folder as vault" → selecione: ') + chalk.cyan(vaultPath))
    console.log(chalk.dim('  2. Abra o Claude Code ') + chalk.bold('dentro deste projeto') + chalk.dim(' (onde o setup foi rodado)'))
    console.log(chalk.dim('  3. Inicie sua primeira missão com: ') + chalk.cyan('/codemaster:quest "Nome da missão"'))
    console.log(chalk.dim('  4. Para novos projetos: ') + chalk.cyan('cd seu-projeto && codemaster setup'))
    blank()

  } catch (err) {
    printError(`Erro no setup: ${err.message}`)
    process.exit(1)
  }
}
