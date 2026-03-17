# Story 1.3: Sistema injeta CodeMaster no Claude Code

Status: ready-for-dev

## Story

Como developer (Ricardo),
quero os slash commands do CodeMaster disponíveis no Claude Code imediatamente após o setup,
para que possa usar /codemaster:quest, :relic, :victory, :legend e :knowledge sem configuração manual.

## Acceptance Criteria

1. **Dado** que `~/.claude/` existe (Claude Code instalado)
   **Quando** setup conclui a etapa de injeção no Claude Code
   **Então** diretório `~/.claude/commands/codemaster/` é criado
   **E** quest.md, relic.md, victory.md, legend.md e knowledge.md são copiados para esse diretório
   **E** `~/.claude/CLAUDE.md` recebe o bloco CodeMaster ao final, identificado por `<!-- CodeMaster v{version} — início -->`
   **E** o bloco inclui instrução de sugestão proativa

2. **Dado** que o bloco CodeMaster já existe no CLAUDE.md
   **Quando** setup executa novamente
   **Então** bloco existente é substituído, não duplicado (idempotente)

3. **Dado** que `~/.claude/` não existe
   **Quando** setup chega na etapa de injeção no Claude Code
   **Então** etapa é pulada com mensagem informando dev que Claude Code não foi detectado

## Tasks / Subtasks

- [ ] Criar `src/services/injector.js` com `injectToClaude(config)` (FR6, FR8, NFR8)
  - [ ] Verificar se `~/.claude/` existe via `fs.access` — skip gracioso retornando `{ skipped: true }` se não
  - [ ] Criar `~/.claude/commands/codemaster/` com `mkdir({ recursive: true })`
  - [ ] Copiar os 5 arquivos de `templates/claude-commands/` para `~/.claude/commands/codemaster/` via `copyFile`
  - [ ] Ler `~/.claude/CLAUDE.md` (criar vazio se não existir)
  - [ ] Detectar bloco existente: regex `BLOCK_START = /<!-- CodeMaster v[\d.]+ — início/`
  - [ ] Se encontrar bloco: substituir tudo entre BLOCK_START e BLOCK_END (idempotente)
  - [ ] Se não encontrar: append do bloco ao final do arquivo
  - [ ] Retornar `{ skipped: false, claudeMdPath, commandsDir }`
- [ ] Criar `templates/claude-injection.md` — bloco a ser injetado no CLAUDE.md
  - [ ] Contém instruções de sugestão proativa e contexto dos 5 momentos
  - [ ] Parametrizado com `{devName}`, `{vaultPath}`, `{version}`, `{stack}`
- [ ] Criar `templates/claude-commands/quest.md` (stub — conteúdo completo na story 2.1)
- [ ] Criar `templates/claude-commands/relic.md` (stub)
- [ ] Criar `templates/claude-commands/victory.md` (stub)
- [ ] Criar `templates/claude-commands/legend.md` (stub)
- [ ] Criar `templates/claude-commands/knowledge.md` (stub)
- [ ] Criar `src/services/injector.test.js` com testes de idempotência e skip
- [ ] Integrar `injectToClaude()` em `src/commands/setup.js` — substituir chamada a `injectAgentInstructions()`

## Dev Notes

### Fronteira de acesso único — REGRA CRÍTICA

`~/.claude/CLAUDE.md` e `~/.claude/commands/codemaster/` SOMENTE podem ser acessados por `src/services/injector.js`.
O `src/workspace/inject.js` existente usa lógica ANTIGA — o injector.js substitui sua função de Claude Code.

### `injectToClaude()` — implementação de referência

```js
import { access, mkdir, copyFile, readFile, writeFile } from 'fs/promises'
import { join, dirname } from 'path'
import { homedir } from 'os'
import { fileURLToPath } from 'url'

const BLOCK_START = /<!-- CodeMaster v[\d.]+ — início das instruções do agente mentor -->/
const BLOCK_END_PATTERN = /<!-- CodeMaster v[\d.]+ — fim -->/

const CLAUDE_DIR = join(homedir(), '.claude')
const COMMANDS_DIR = join(CLAUDE_DIR, 'commands', 'codemaster')
const CLAUDE_MD = join(CLAUDE_DIR, 'CLAUDE.md')

// Templates dir: resolve relative to this file
const __dirname = dirname(fileURLToPath(import.meta.url))
const TEMPLATES_DIR = join(__dirname, '../../templates/claude-commands')

export async function injectToClaude(config) {
  // AC3: skip se Claude Code não instalado
  try { await access(CLAUDE_DIR) }
  catch { return { skipped: true, reason: 'Claude Code não detectado (~/.claude/ não existe)' } }

  // Criar diretório de comandos
  await mkdir(COMMANDS_DIR, { recursive: true })

  // Copiar 5 templates
  const commands = ['quest.md', 'relic.md', 'victory.md', 'legend.md', 'knowledge.md']
  for (const cmd of commands) {
    await copyFile(join(TEMPLATES_DIR, cmd), join(COMMANDS_DIR, cmd))
  }

  // Ler CLAUDE.md atual
  let claudeContent = ''
  try { claudeContent = await readFile(CLAUDE_MD, 'utf8') }
  catch { /* não existe — começar vazio */ }

  // Gerar bloco de injeção
  const version = config.version ?? '1.0.0'
  const devName = config.hero?.name ?? config.dev?.name ?? 'dev'
  const vaultPath = config.obsidian?.vault_path ?? config.vault ?? ''
  const stack = (config.hero?.stack ?? config.dev?.stack ?? []).slice(0, 3).join(', ')

  const blockStart = `<!-- CodeMaster v${version} — início das instruções do agente mentor -->`
  const blockEnd = `<!-- CodeMaster v${version} — fim -->`
  const injectionBlock = buildInjectionBlock(blockStart, blockEnd, { devName, vaultPath, stack })

  // Idempotência: substituir ou append
  if (BLOCK_START.test(claudeContent)) {
    // Substituir bloco existente
    claudeContent = claudeContent.replace(
      /<!-- CodeMaster v[\d.]+ — início das instruções do agente mentor -->[\s\S]*?<!-- CodeMaster v[\d.]+ — fim -->/,
      injectionBlock
    )
  } else {
    claudeContent = claudeContent.trimEnd() + '\n\n' + injectionBlock + '\n'
  }

  await writeFile(CLAUDE_MD, claudeContent, 'utf8')
  return { skipped: false, claudeMdPath: CLAUDE_MD, commandsDir: COMMANDS_DIR }
}
```

### `buildInjectionBlock()` — conteúdo do bloco CLAUDE.md

```js
function buildInjectionBlock(blockStart, blockEnd, { devName, vaultPath, stack }) {
  return `${blockStart}

# CodeMaster — AI Engineer Evolution Agent

Dev: **${devName}** | Stack: ${stack} | Vault: \`${vaultPath}\`

## Sugestão Proativa
Quando ${devName} iniciar uma tarefa de desenvolvimento sem uma Quest ativa, sugira: "Quer iniciar uma Quest para registrar seu aprendizado? Use \`/codemaster:quest \"nome da tarefa\"\`"

## Os 5 Momentos
- **/codemaster:quest** — Inicia missão com reflexão guiada (âncora + 3 perguntas por dimensão)
- **/codemaster:relic** — Registra descoberta durante quest ativa
- **/codemaster:victory** — Encerra missão com reflexão avaliada (5 perguntas + score por dimensão)
- **/codemaster:legend** — Visualiza histórico de evolução
- **/codemaster:knowledge** — Diagnóstico de gaps e mapa de conhecimento

${blockEnd}`
}
```

### Testes prioritários

```js
describe('injector', () => {
  it('should skip when ~/.claude does not exist', ...)
  it('should create commands dir and copy 5 files', ...)
  it('should inject block when CLAUDE.md does not have one', ...)
  it('should REPLACE existing block (idempotente)', ...)
  it('should NOT touch content outside the block', ...)
})
```

### Integração em setup.js

Substituir em `src/commands/setup.js`:
```js
// ANTES (injector antigo):
// await initWorkspace(vaultPath)
// await injectAgentInstructions(config, selectedAgents)

// DEPOIS (novo injector):
import { injectToClaude } from '../services/injector.js'
// ...no fluxo do setup, após writeConfig:
if (agents.includes('claude_code')) {
  const result = await injectToClaude(savedConfig)
  if (result.skipped) {
    printSection('Claude Code', result.reason)
  } else {
    printSuccess(`Claude Code: slash commands instalados em ${result.commandsDir}`)
  }
}
```

### Localização dos templates em runtime

O `injector.js` resolve o path dos templates via `import.meta.url` (ESM):
```js
import { fileURLToPath } from 'url'
const __dirname = dirname(fileURLToPath(import.meta.url))
const TEMPLATES_DIR = join(__dirname, '../../templates/claude-commands')
```

### NFR8 — nunca sobrescrever conteúdo fora do bloco

O regex de substituição usa `[\s\S]*?` (lazy) para capturar APENAS entre os delimitadores.
Conteúdo antes do bloco e após o bloco é preservado integralmente.

### References

- FR6, FR8: prd.md
- NFR8: prd.md
- Injeção idempotente: architecture.md
- Depende de: templates criados nas stories 2.1–3.2
- Integrado em: 1-2-dev-executa-codemaster-setup-e-completa-onboarding.md

## Dev Agent Record

### Agent Model Used

_a preencher_

### Debug Log References

### Completion Notes List

### File List
