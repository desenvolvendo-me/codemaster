// src/services/injector.js
import { access, mkdir, copyFile, readFile, writeFile } from 'fs/promises'
import { join, dirname } from 'path'
import { homedir } from 'os'
import { fileURLToPath } from 'url'

// ─── Paths ────────────────────────────────────────────────────────────────────
const HOME = homedir()
const CLAUDE_DIR        = join(HOME, '.claude')
const CLAUDE_MD         = join(CLAUDE_DIR, 'CLAUDE.md')
const CODEX_DIR         = join(HOME, '.codex')
const CODEX_MD          = join(CODEX_DIR, 'instructions.md')
const CODEMASTER_AGENTS = join(HOME, '.codemaster', 'agents')

const __dirname_esm = dirname(fileURLToPath(import.meta.url))
const PACKAGE_AGENTS_DIR = join(__dirname_esm, '../../_codemaster/agents')
const PACKAGE_SKILLS_DIR = join(__dirname_esm, '../../.agents/skills')

const AGENT_NAMES = ['quest', 'relic', 'victory', 'legend', 'knowledge']

// ─── Regex de idempotência ────────────────────────────────────────────────────
const BLOCK_REGEX = /<!-- CodeMaster v[\d.]+ — início das instruções do agente mentor -->[\s\S]*?<!-- CodeMaster v[\d.]+ — fim -->/

function blockStart(version) {
  return `<!-- CodeMaster v${version} — início das instruções do agente mentor -->`
}
function blockEnd(version) {
  return `<!-- CodeMaster v${version} — fim -->`
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
async function exists(path) {
  try { await access(path); return true } catch { return false }
}

function buildClaudeBlock(version, { devName, vaultPath, stack }) {
  return `${blockStart(version)}

# CodeMaster — AI Engineer Evolution Agent

Dev: **${devName}** | Stack: ${stack} | Vault: \`${vaultPath}\`

## Sugestão Proativa
Quando ${devName} iniciar uma tarefa de desenvolvimento sem uma Quest ativa, sugira: "Quer iniciar uma Quest para registrar seu aprendizado? Use \`/codemaster:quest "nome da tarefa"\`"

## Os 5 Momentos
- **/codemaster:quest**    — Inicia missão com reflexão guiada
- **/codemaster:relic**    — Registra descoberta durante quest ativa
- **/codemaster:victory**  — Encerra missão com reflexão avaliada e scoring
- **/codemaster:legend**   — Visualiza histórico de evolução
- **/codemaster:knowledge**— Diagnóstico de gaps e mapa de conhecimento

${blockEnd(version)}`
}

function buildCodexBlock(version) {
  return `${blockStart(version)}

# CodeMaster — Instruções para Codex

Para cada momento invocado, carregue e siga o agente correspondente:

- Quest:    ~/.codemaster/agents/quest.md
- Relic:    ~/.codemaster/agents/relic.md
- Victory:  ~/.codemaster/agents/victory.md
- Legend:   ~/.codemaster/agents/legend.md
- Knowledge:~/.codemaster/agents/knowledge.md

Siga integralmente o fluxo descrito em cada arquivo.

${blockEnd(version)}`
}

function injectBlock(existing, block) {
  if (BLOCK_REGEX.test(existing)) {
    return existing.replace(BLOCK_REGEX, block)
  }
  return existing.trimEnd() + '\n\n' + block + '\n'
}

// ─── injectToClaude ───────────────────────────────────────────────────────────
export async function injectToClaude(config) {
  if (!await exists(CLAUDE_DIR)) {
    return { skipped: true, reason: 'Claude Code não detectado (~/.claude/ não existe)' }
  }

  // Copiar agentes para ~/.codemaster/agents/
  await mkdir(CODEMASTER_AGENTS, { recursive: true })
  for (const name of AGENT_NAMES) {
    await copyFile(
      join(PACKAGE_AGENTS_DIR, `${name}.md`),
      join(CODEMASTER_AGENTS, `${name}.md`)
    )
  }

  // Copiar skills para o projeto destino (projectDir ou package)
  const projectDir = config.projectDir ?? process.cwd()
  const skillsDir = join(projectDir, '.claude', 'skills')
  for (const name of AGENT_NAMES) {
    const destDir = join(skillsDir, `codemaster-${name}`)
    await mkdir(destDir, { recursive: true })
    await copyFile(
      join(PACKAGE_SKILLS_DIR, `codemaster-${name}`, 'SKILL.md'),
      join(destDir, 'SKILL.md')
    )
  }

  // Injetar bloco no CLAUDE.md
  const version   = config.version ?? '1.0.0'
  const devName   = config.hero?.name ?? config.dev?.name ?? 'dev'
  const vaultPath = config.obsidian?.vault_path ?? config.vault ?? ''
  const stack     = (config.hero?.stack ?? config.dev?.stack ?? []).slice(0, 3).join(', ')

  let claudeContent = ''
  try { claudeContent = await readFile(CLAUDE_MD, 'utf8') } catch { /* cria novo */ }

  const block = buildClaudeBlock(version, { devName, vaultPath, stack })
  await writeFile(CLAUDE_MD, injectBlock(claudeContent, block), 'utf8')

  return { skipped: false, claudeMdPath: CLAUDE_MD, skillsDir, agentsDir: CODEMASTER_AGENTS }
}

// ─── injectToCodex ────────────────────────────────────────────────────────────
export async function injectToCodex(config) {
  if (!await exists(CODEX_DIR)) {
    return { skipped: true, reason: 'Codex não detectado (~/.codex/ não existe)' }
  }

  const version = config.version ?? '1.0.0'
  let codexContent = ''
  try { codexContent = await readFile(CODEX_MD, 'utf8') } catch { /* cria novo */ }

  const block = buildCodexBlock(version)
  await writeFile(CODEX_MD, injectBlock(codexContent, block), 'utf8')

  return { skipped: false, codexMdPath: CODEX_MD }
}
