---
initiative: IN002
domain: claude-code
status: active
inputDocuments: ["_bmad-output/planning-artifacts/architecture.md"]
---

# Architecture — IN002 Claude Code

## Stack & Decisões

**Modelo de Interação Agent-First:**
O CodeMaster tem pouquíssimos comandos CLI (essencialmente `codemaster setup`). Os 5 momentos (Quest, Relic, Victory, Legend, Knowledge) vivem 90% dentro dos agentes como comandos nativos — slash commands no Claude Code (`/codemaster:quest`). Os arquivos em `templates/claude-commands/` são os artefatos principais de interação. O código em `src/moments/` contém lógica de suporte (geração de IDs, escrita no vault, scoring, milestone detection) que pode ser invocada de dentro dos templates via bash quando necessário.

**Claude Code — Slash Commands:**

| Componente | Localização | Formato |
|---|---|---|
| Comandos | `~/.claude/commands/codemaster/` | Um arquivo `.md` por momento |
| Nomes | `quest.md`, `relic.md`, `victory.md`, `legend.md`, `knowledge.md` | — |
| CLAUDE.md injection | Append ao final do arquivo existente | Bloco delimitado por comentário |

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
templates/
└── claude-commands/                # copiados para ~/.claude/commands/codemaster/ no setup
    ├── quest.md                    # slash command /codemaster:quest
    ├── relic.md                    # slash command /codemaster:relic
    ├── victory.md                  # slash command /codemaster:victory
    ├── legend.md                   # slash command /codemaster:legend
    └── knowledge.md               # slash command /codemaster:knowledge

templates/
└── claude-injection.md             # bloco injetado no ~/.claude/CLAUDE.md

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
~/.claude/
├── CLAUDE.md                       # recebe bloco CodeMaster ao final
└── commands/
    └── codemaster/
        ├── quest.md
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
| `~/.claude/CLAUDE.md` e `~/.codex/instructions.md` | `services/injector.js` |

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
| FR40–FR41 Agent Integration | `services/injector.js` + `templates/claude-commands/` | config |
