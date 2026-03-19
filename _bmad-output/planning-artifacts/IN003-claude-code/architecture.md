---
initiative: IN003
domain: claude-code
status: active
inputDocuments: ["_bmad-output/planning-artifacts/architecture.md"]
---

# Architecture — IN003 Claude Code

## Stack & Decisões

**Claude Code — Slash Commands como thin wrappers:**
- Wrappers em `~/.claude/commands/codemaster/` carregam os agentes de `~/.codemaster/agents/` (instalados pela IN002)
- Nenhuma lógica de negócio nos wrappers — apenas ativação do agente
- Bloco injetado no `~/.claude/CLAUDE.md` habilita sugestão proativa

| Componente | Localização | Responsável |
|---|---|---|
| Wrappers Claude Code | `~/.claude/commands/codemaster/{momento}.md` | Thin wrappers — carregam de `~/.codemaster/agents/` |
| CLAUDE.md injection | `~/.claude/CLAUDE.md` | Append idempotente pelo injector |

**Formato dos thin wrappers em `~/.claude/commands/codemaster/`:**

```markdown
---
name: codemaster-{momento}
description: {descrição}
---

<agent-activation CRITICAL="TRUE">
1. LOAD the FULL agent file from ~/.codemaster/agents/{momento}.md
2. READ its entire contents — this contains the complete persona, flow, and instructions
3. FOLLOW every step in the <activation> section precisely
4. BEGIN the interaction flow
</agent-activation>
```

**Regra:** wrapper nunca contém lógica de negócio. Toda a lógica vive em `~/.codemaster/agents/` (IN002).

**Identificação do bloco injetado:**
```
<!-- CodeMaster v{version} — início das instruções do agente mentor -->
...conteúdo injetado...
<!-- CodeMaster v{version} — fim -->
```

**Lógica de idempotência do injector:**
1. Regex busca o comentário de identificação no arquivo destino
2. Se encontrar → substitui o bloco inteiro (reconfiguração)
3. Se não encontrar → append ao final (primeira instalação)
4. Nunca toca conteúdo fora do bloco identificado

```js
const BLOCK_START = /<!-- CodeMaster v[\d.]+ — início/
const BLOCK_END = /<!-- CodeMaster v[\d.]+ — fim -->/
// Se encontrar → substitui bloco. Se não → append.
```

**Sugestão proativa (hipótese a validar):**
- Implementada como instrução no bloco injetado no `CLAUDE.md`
- O agente sugere `/codemaster:quest` quando detecta início de tarefa sem Quest ativa
- Estratégia de validação: implementar na semana 1, testar com 2–3 cenários reais
  - Se funcionar consistentemente → MVP inclui como feature
  - Se inconsistente → MVP remove a promessa; comportamento proativo vira "pode acontecer" sem ser requisito

## Estrutura de Arquivos

```
templates/
├── claude-command.md               # template de wrapper — parametrizado com {momento}
└── claude-injection.md             # bloco injetado no ~/.claude/CLAUDE.md

src/services/
└── injector.js                     # injectToClaude — idempotente via regex
```

**Destino após setup:**
```
~/.claude/
├── CLAUDE.md                       # recebe bloco CodeMaster ao final (sugestão proativa)
└── commands/
    └── codemaster/                 # thin wrappers gerados pelo setup
        ├── quest.md                # carrega ~/.codemaster/agents/quest.md
        ├── relic.md
        ├── victory.md
        ├── legend.md
        └── knowledge.md
```

## Padrões de Implementação

**Injeção idempotente — regex obrigatório:**
```js
const BLOCK_START = /<!-- CodeMaster v[\d.]+ — início/
const BLOCK_END = /<!-- CodeMaster v[\d.]+ — fim -->/
// Se encontrar → substitui bloco. Se não → append.
```

**Fronteira de acesso único:**

| Recurso | Único módulo autorizado |
|---|---|
| `~/.claude/CLAUDE.md` e `~/.claude/commands/codemaster/` | `services/injector.js` |

**Mapeamento de requisitos → estrutura:**

| FR | Localização primária | Dependências |
|---|---|---|
| FR6, FR8, FR40, FR41, FR46, FR47 | `services/injector.js` + `templates/claude-*` | config |
