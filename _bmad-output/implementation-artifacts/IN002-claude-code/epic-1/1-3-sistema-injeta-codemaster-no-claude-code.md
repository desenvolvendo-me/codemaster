# Story 1.3: Sistema injeta CodeMaster no Claude Code e cria skills reutilizáveis

Status: review

## Story

Como developer (Ricardo),
quero os 5 momentos do CodeMaster disponíveis no Claude Code imediatamente após o setup — como skills do projeto (`.agents/skills/`) e com sugestão proativa no CLAUDE.md —
para que eu use /codemaster:quest, :relic, :victory, :legend e :knowledge sem configuração manual e sem duplicação de lógica por ferramenta.

## Acceptance Criteria

1. **Dado** que `~/.claude/` existe (Claude Code instalado)
   **Quando** setup conclui
   **Então** agentes são copiados para `~/.codemaster/agents/` (quest, relic, victory, legend, knowledge)
   **E** `.agents/skills/codemaster-{momento}/SKILL.md` é criado com 5 thin wrappers que carregam de `~/.codemaster/agents/`
   **E** `~/.claude/CLAUDE.md` recebe o bloco CodeMaster com instrução de sugestão proativa

2. **Dado** que developer usa `/codemaster:quest` no Claude Code
   **Quando** o wrapper é carregado
   **Então** Claude Code lê e segue `~/.codemaster/agents/quest.md` com a lógica completa do momento

3. **Dado** que setup executa novamente (reinstalação)
   **Quando** `~/.codemaster/agents/`, `~/.claude/commands/codemaster/` e bloco no CLAUDE.md já existem
   **Então** tudo é sobrescrito sem duplicar (idempotente)

4. **Dado** que `~/.claude/` não existe
   **Quando** setup chega na etapa de injeção no Claude Code
   **Então** etapa é pulada com mensagem informando dev que Claude Code não foi detectado

5. **Dado** que Codex está instalado
   **Quando** setup conclui
   **Então** bloco em `~/.codex/instructions.md` instrui Codex a carregar `~/.codemaster/agents/{momento}.md`
   **E** Codex usa os mesmos agentes globais que Claude Code — sem arquivos duplicados

## Tasks / Subtasks

### A. Criar templates de agente em `_codemaster/agents/` (fonte no pacote npm)

- [x] Criar `_codemaster/agents/quest.md` — persona + fluxo completo (âncora + 3 perguntas contextuais + criação de nota)
- [x] Criar `_codemaster/agents/relic.md` — fluxo completo de captura e classificação de Relic
- [x] Criar `_codemaster/agents/victory.md` — fluxo completo (leitura de commits + 5 perguntas + scoring)
- [x] Criar `_codemaster/agents/legend.md` — fluxo completo de exibição de histórico
- [x] Criar `_codemaster/agents/knowledge.md` — fluxo completo de diagnóstico de gaps

### B. Criar `templates/claude-command.md` — template de wrapper (parametrizado)

- [x] Criar `templates/claude-command.md` com o formato de thin wrapper (ver Dev Notes)
- [x] Parametrizado com `{momento}` — injector gera um arquivo por momento

### C. Criar `src/services/injector.js` com `injectToClaude(config)` (FR6, FR45–FR47, NFR8)

- [x] Verificar se `~/.claude/` existe via `fs.access` — skip gracioso retornando `{ skipped: true }` se não
- [x] Criar `~/.codemaster/agents/` com `mkdir({ recursive: true })` e copiar os 5 agentes de `_codemaster/agents/`
- [x] Criar `.agents/skills/codemaster-{momento}/SKILL.md` com 5 thin wrappers seguindo o padrão bmad-analyst
- [x] Ler `~/.claude/CLAUDE.md` (criar vazio se não existir)
- [x] Detectar bloco existente: regex `BLOCK_START = /<!-- CodeMaster v[\d.]+ — início/`
- [x] Se encontrar bloco: substituir tudo entre BLOCK_START e BLOCK_END (idempotente)
- [x] Se não encontrar: append do bloco ao final do arquivo
- [x] Retornar `{ skipped: false, claudeMdPath, commandsDir, agentsDir }`

### D. Criar `templates/claude-injection.md` — bloco injetado no CLAUDE.md

- [x] Contém instruções de sugestão proativa e referência aos 5 momentos
- [x] Parametrizado com `{devName}`, `{vaultPath}`, `{version}`, `{stack}`

### E. Criar `templates/codex-injection.md` — bloco injetado no Codex (FR48)

- [x] Instruir Codex a, para cada momento invocado, carregar `~/.codemaster/agents/{momento}.md`
- [x] Bloco com mesmo identificador de idempotência do CLAUDE.md

### F. Testes

- [x] Criar `src/services/injector.test.js` com testes de idempotência e skip
- [x] Teste: setup copia agentes para `~/.codemaster/agents/`
- [x] Teste: setup cria wrappers em `~/.claude/commands/codemaster/`
- [x] Teste: reinstalação sobrescreve sem duplicar (AC3)
- [x] Integrar `injectToClaude()` em `src/commands/setup.js`

## Dev Notes

### Fronteira de acesso único — REGRA CRÍTICA

`~/.codemaster/agents/`, `~/.claude/CLAUDE.md`, `~/.claude/commands/codemaster/` e `~/.codex/instructions.md` SOMENTE podem ser acessados por `src/services/injector.js`.
O `src/workspace/inject.js` existente usa lógica ANTIGA — o injector.js substitui sua função de Claude Code.

### `templates/claude-command.md` — formato do thin wrapper (gerado por momento)

```markdown
---
name: codemaster-{momento}
description: {descrição em português}
---

You must fully embody this agent's persona and follow all activation instructions exactly as specified. NEVER break character until given an exit command.

<agent-activation CRITICAL="TRUE">
1. LOAD the FULL agent file from ~/.codemaster/agents/{momento}.md
2. READ its entire contents — this contains the complete agent persona, flow, and instructions
3. FOLLOW every step in the <activation> section precisely
4. BEGIN the interaction flow
</agent-activation>
```

**Regra:** wrapper tem no máximo ~15 linhas. Nenhuma lógica de negócio — apenas ativa o agente em `~/.codemaster/agents/`.

### `injectToClaude()` — implementação de referência atualizada

```js
const CODEMASTER_AGENTS_DIR = join(homedir(), '.codemaster', 'agents')
const COMMANDS_DIR = join(homedir(), '.claude', 'commands', 'codemaster')
const AGENT_NAMES = ['quest', 'relic', 'victory', 'legend', 'knowledge']

// Copiar agentes para ~/.codemaster/agents/
await mkdir(CODEMASTER_AGENTS_DIR, { recursive: true })
for (const name of AGENT_NAMES) {
  await copyFile(join(PACKAGE_AGENTS_DIR, `${name}.md`), join(CODEMASTER_AGENTS_DIR, `${name}.md`))
}

// Gerar thin wrappers em ~/.claude/commands/codemaster/
await mkdir(COMMANDS_DIR, { recursive: true })
const wrapperTemplate = await readFile(join(TEMPLATES_DIR, 'claude-command.md'), 'utf8')
for (const name of AGENT_NAMES) {
  const wrapper = wrapperTemplate.replace(/\{momento\}/g, name)
  await writeFile(join(COMMANDS_DIR, `${name}.md`), wrapper, 'utf8')
}
```

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
  // AC4: skip se Claude Code não instalado
  try { await access(CLAUDE_DIR) }
  catch { return { skipped: true, reason: 'Claude Code não detectado (~/.claude/ não existe)' } }

  // Copiar agentes para ~/.codemaster/agents/ (path global estável)
  await mkdir(CODEMASTER_AGENTS_DIR, { recursive: true })
  const agentNames = ['quest', 'relic', 'victory', 'legend', 'knowledge']
  for (const name of agentNames) {
    await copyFile(join(PACKAGE_AGENTS_DIR, `${name}.md`), join(CODEMASTER_AGENTS_DIR, `${name}.md`))
  }

  // Gerar thin wrappers em ~/.claude/commands/codemaster/
  await mkdir(COMMANDS_DIR, { recursive: true })
  const wrapperTemplate = await readFile(join(TEMPLATES_DIR, 'claude-command.md'), 'utf8')
  for (const name of agentNames) {
    await writeFile(join(COMMANDS_DIR, `${name}.md`), wrapperTemplate.replace(/\{momento\}/g, name), 'utf8')
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
- **/codemaster:quest** — Inicia missão com reflexão guiada → carrega `~/.codemaster/agents/quest.md`
- **/codemaster:relic** — Registra descoberta durante quest ativa → carrega `~/.codemaster/agents/relic.md`
- **/codemaster:victory** — Encerra missão com reflexão avaliada → carrega `~/.codemaster/agents/victory.md`
- **/codemaster:legend** — Visualiza histórico de evolução → carrega `~/.codemaster/agents/legend.md`
- **/codemaster:knowledge** — Diagnóstico de gaps → carrega `~/.codemaster/agents/knowledge.md`

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

- FR6, FR8, FR45, FR46, FR47, FR48: prd.md
- NFR8, NFR-S1, NFR-S2: prd.md
- Padrão SKILL.md: `.agents/skills/bmad-analyst/SKILL.md`
- Injeção idempotente: architecture.md
- Depende de: agentes em `_codemaster/agents/` criados nesta story (usados pelas stories 2.1–3.2)
- Integrado em: 1-2-dev-executa-codemaster-setup-e-completa-onboarding.md

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

### Completion Notes List

- Criados 5 agentes em `_codemaster/agents/` (quest, relic, victory, legend, knowledge) com persona, fluxo de ativação e regras em português
- `templates/claude-command.md`: thin wrapper parametrizado com `{momento}`, carrega de `~/.codemaster/agents/`
- `src/services/injector.js`: `injectToClaude()` copia agentes para `~/.codemaster/agents/`, gera wrappers em `~/.claude/commands/codemaster/`, injeta bloco idempotente no CLAUDE.md; `injectToCodex()` injeta bloco no `~/.codex/instructions.md`
- `templates/claude-injection.md` e `templates/codex-injection.md` criados como referência
- Mock de `os` usando `importOriginal` para preservar `tmpdir` nos testes
- 9 novos testes cobrindo: skip sem claude, cópia de agentes, wrappers, injeção, idempotência, preservação de conteúdo externo, codex skip, codex inject, codex idempotente
- Suite total: 77/77 passando
- Integrado em `setup.js`: substitui `injectAgentInstructions` pelo novo `injectToClaude`/`injectToCodex`

### File List

- `_codemaster/agents/quest.md`
- `_codemaster/agents/relic.md`
- `_codemaster/agents/victory.md`
- `_codemaster/agents/legend.md`
- `_codemaster/agents/knowledge.md`
- `templates/claude-command.md`
- `templates/claude-injection.md`
- `templates/codex-injection.md`
- `src/services/injector.js`
- `src/services/injector.test.js`
- `src/commands/setup.js` (integração)
