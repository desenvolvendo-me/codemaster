---
initiative: IN003
domain: codex
status: active
inputDocuments: ["_bmad-output/planning-artifacts/architecture.md"]
---

# Architecture — IN003 Codex

## Stack & Decisões

**Codex — Skills:**
- Bloco injetado em `~/.codex/instructions.md` instrui Codex a carregar `~/.codemaster/agents/{momento}.md` para cada momento invocado
- Reutiliza os mesmos agentes instalados globalmente em `~/.codemaster/agents/` — sem duplicação de lógica (mesmo diretório que Claude Code usa)
- Mesmo bloco identificador usado na IN002 Claude Code para idempotência
- Integração exclusivamente via filesystem — sem SDKs ou APIs do Codex

**Identificação do bloco injetado:**
```
<!-- CodeMaster v{version} — início das instruções do agente mentor -->
...conteúdo injetado...
<!-- CodeMaster v{version} — fim -->
```

**Lógica de idempotência (compartilhada com IN002):**
1. Regex busca o comentário de identificação no arquivo destino
2. Se encontrar → substitui o bloco inteiro (reconfiguração)
3. Se não encontrar → append ao final (primeira instalação)
4. Nunca toca conteúdo fora do bloco identificado

```js
const BLOCK_START = /<!-- CodeMaster v[\d.]+ — início/
const BLOCK_END = /<!-- CodeMaster v[\d.]+ — fim -->/
// Se encontrar → substitui bloco. Se não → append.
```

**Prioridade no MVP:**
- Classificada como 🟡 Importante — pode vir em v1.1 se timeline apertar
- Contingência: se Codex não ficar pronto, lançar com Claude Code only e iterar

## Estrutura de Arquivos

```
templates/
└── codex-injection.md              # bloco injetado no ~/.codex/instructions.md

src/services/
└── injector.js                     # injectToClaude, injectToCodex — idempotente via regex
                                    # módulo compartilhado com IN002
```

**Destino após setup:**
```
~/.codex/
└── instructions.md                 # recebe bloco CodeMaster ao final
```

## Padrões de Implementação

**Fronteira de acesso único:**

| Recurso | Único módulo autorizado |
|---|---|
| `~/.claude/CLAUDE.md` e `~/.codex/instructions.md` | `services/injector.js` |

**Fallback gracioso:**
- Se `~/.codex/` não existe: etapa é pulada com mensagem informando que Codex não foi detectado
- Não bloqueia o restante do setup

**Mapeamento de requisitos → estrutura:**

| FR | Localização primária | Dependências |
|---|---|---|
| FR7, FR8, FR42 | `services/injector.js` + `templates/codex-injection.md` | config |
