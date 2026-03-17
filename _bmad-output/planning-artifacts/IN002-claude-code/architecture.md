---
initiative: IN002
domain: claude-code
status: active
inputDocuments: ["_bmad-output/planning-artifacts/architecture.md"]
---

# Architecture — IN002 Claude Code

## Stack & Decisões

**Modelo de Interação Agent-First:**
O CodeMaster é uma ferramenta **global** (instalada via `npm install -g`). Os 5 momentos vivem 90% dentro dos agentes como comandos nativos — slash commands no Claude Code (`/codemaster:quest`). O código em `src/moments/` contém lógica de suporte que pode ser invocada via bash pelos agentes.

**Arquitetura global de agentes — sem duplicação por ferramenta:**

O setup instala os agentes em `~/.codemaster/agents/` (path global estável). Cada ferramenta de IA recebe thin wrappers que apenas carregam desse diretório central. Para suportar uma nova ferramenta, basta criar wrappers que referenciam `~/.codemaster/agents/` — sem duplicar lógica.

| Componente | Localização | Responsável |
|---|---|---|
| Templates fonte (no pacote npm) | `_codemaster/agents/{momento}.md` | Versionado com o pacote |
| Agentes instalados globalmente | `~/.codemaster/agents/{momento}.md` | Copiados pelo setup |
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

**Regra:** wrapper nunca contém lógica de negócio. Toda a lógica vive em `~/.codemaster/agents/`.

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

**Algoritmo de Scoring por Dimensão (0.0–10):**
- Cada Victory produz 3 scores: `negocio`, `arquitetura`, `ia`
- O agente analisa **todas as 5 respostas holisticamente** para cada dimensão — cada resposta contribui para todas as dimensões com pesos diferentes
- Instrução no prompt: *"Analise o conjunto das respostas. Para cada dimensão, atribua uma nota de 0.0 a 10.0 considerando profundidade, conexão com o contexto real e capacidade de articular o raciocínio."*
- Tendência resultante: **↑** se score ≥ 7.0 | **→** se 4.0–6.9 | **↓** se < 4.0
- Score acumulado no PROGRESS.md = média das victories do milestone atual

**Fluxo do Quest — Pergunta âncora + 3 perguntas contextualizadas:**
1. **Âncora:** *"Descreva o problema ou tarefa em uma frase — o que você vai resolver?"*
2. O agente usa a âncora para gerar variações contextuais das 3 perguntas de dimensão (negócio, arquitetura, IA) — mesma essência, forma adaptada ao contexto
3. Exemplo com tarefa "Implementar autenticação JWT":
   - Negócio: *"Como a autenticação com JWT vai impactar a experiência do usuário final nesse sistema?"*
   - Arquitetura: *"Quais decisões técnicas você antecipa para garantir que a autenticação seja segura e escalável?"*
   - IA: *"Como você vai usar a IA nessa implementação — o que você orquestra versus o que delega?"*

**Fluxo do Victory — Leitura de commits + 5 perguntas contextualizadas:**
- O CLI executa `git log --oneline HEAD~20 2>/dev/null` antes de gerar o prompt
- Commits injetados como contexto no slash command para personalizar perguntas
- Graceful skip se não estiver em repo git (perguntas baseadas na âncora da quest)
- As 5 perguntas cobrem: impacto de negócio, decisão arquitetural, orquestração de IA, aprendizado novo, reflexão crítica — sempre contextualizadas

**KNOWLEDGE-MAP.md (schema fixo):**
```markdown
# KNOWLEDGE-MAP

## Lacunas por Dimensão

### Negócio
- [ ] {tópico} | Score médio: X.X | Fonte: [[Q{id}]], [[Q{id}]]

### Arquitetura
- [ ] {tópico} | Score médio: X.X | Fonte: [[Q{id}]]

### IA
- [ ] {tópico} | Score médio: X.X | Fonte: [[Q{id}]]

## Próximo Milestone — Foco recomendado
- Prioridade 1: {tópico com menor score}
- Prioridade 2: {tópico com segunda menor score}
```

## Estrutura de Arquivos

```
_codemaster/
└── agents/                         # templates fonte (versionados no pacote npm)
    ├── quest.md                    # lógica completa do momento Quest
    ├── relic.md                    # lógica completa do momento Relic
    ├── victory.md                  # lógica completa do momento Victory
    ├── legend.md                   # lógica completa do momento Legend
    └── knowledge.md                # lógica completa do momento Knowledge

templates/
├── claude-command.md               # template de wrapper — parametrizado com {momento}
├── claude-injection.md             # bloco injetado no ~/.claude/CLAUDE.md
└── codex-injection.md              # bloco injetado no ~/.codex/instructions.md

src/moments/                        # lógica de suporte invocável via bash pelos templates
    ├── quest.js                    # FR10–FR13: fluxo Quest (âncora + 3 perguntas dinâmicas)
    ├── quest.test.js
    ├── relic.js                    # FR14–FR16: fluxo Relic (classificação + arquivo)
    ├── relic.test.js
    ├── victory.js                  # FR19–FR28: fluxo Victory (commits + 5 perguntas + score)
    ├── victory.test.js
    ├── legend.js                   # FR33–FR35: exibe PROGRESS.md formatado
    ├── legend.test.js
    ├── knowledge.js                # FR36–FR39: lê vault + gera KNOWLEDGE-MAP.md
    └── knowledge.test.js

services/
└── injector.js                     # injectToClaude, injectToCodex — idempotente via regex
```

**Destino após setup:**
```
~/.codemaster/
└── agents/                         # agentes instalados globalmente (copiados de _codemaster/agents/)
    ├── quest.md
    ├── relic.md
    ├── victory.md
    ├── legend.md
    └── knowledge.md

~/.claude/
├── CLAUDE.md                       # recebe bloco CodeMaster ao final (sugestão proativa)
└── commands/
    └── codemaster/                 # thin wrappers gerados pelo setup
        ├── quest.md                # carrega ~/.codemaster/agents/quest.md
        ├── relic.md
        ├── victory.md
        ├── legend.md
        └── knowledge.md

~/.codex/
└── instructions.md                 # recebe bloco que referencia ~/.codemaster/agents/
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
| `~/.codemaster/agents/` | `services/injector.js` |
| `~/.claude/CLAUDE.md` e `~/.claude/commands/codemaster/` | `services/injector.js` |
| `~/.codex/instructions.md` | `services/injector.js` |

**Sugestão proativa (hipótese a validar):**
- Implementada como instrução no bloco injetado no `CLAUDE.md`
- O agente sugere `/codemaster:quest` quando detecta início de tarefa sem Quest ativa
- Estratégia de validação: implementar na semana 1, testar com 2–3 cenários reais
  - Se funcionar consistentemente → MVP inclui como feature
  - Se inconsistente → MVP remove a promessa; comportamento proativo vira "pode acontecer" sem ser requisito

**Formato de data em arquivos:** ISO 8601
- No frontmatter: `date: 2026-03-16`
- No active-quest.json: `startedAt: "2026-03-16T10:00:00Z"`

**Formato de saída do agente:**
- Todo output para o usuário dos momentos passa por `src/utils/output.js`
- `src/moments/` orquestra fluxo e output — `src/services/` são silenciosos

**Mapeamento de requisitos → estrutura:**

| FR Group | Localização primária | Dependências |
|---|---|---|
| FR10–FR13 Quest | `moments/quest.js` | state, vault, frontmatter, slugify, output |
| FR14–FR16 Relic | `moments/relic.js` | state, vault, output |
| FR19–FR28 Victory | `moments/victory.js` | state, vault, milestone, community, git, output |
| FR33–FR35 Legend | `moments/legend.js` | vault, state, output |
| FR36–FR39 Knowledge | `moments/knowledge.js` | vault, output |
| FR40–FR41, FR45–FR49 Agent Integration | `services/injector.js` + `_codemaster/agents/` + `templates/` | config |
