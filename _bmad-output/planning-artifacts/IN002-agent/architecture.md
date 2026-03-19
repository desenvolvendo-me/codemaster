---
initiative: IN002
domain: agent
status: active
inputDocuments: ["_bmad-output/planning-artifacts/architecture.md"]
---

# Architecture — IN002 Agent (Core)

## Stack & Decisões

**Modelo de Interação Agent-First:**
O CodeMaster é uma ferramenta **global** (instalada via `npm install -g`). Os 5 momentos vivem 90% dentro dos agentes como comandos nativos das ferramentas de IA. O código em `src/moments/` contém lógica de suporte que pode ser invocada via bash pelos agentes.

**Arquitetura global de agentes — sem duplicação por ferramenta:**

O setup instala os agentes em `~/.codemaster/agents/` (path global estável). Cada ferramenta de IA (Claude Code, Codex, futuras) recebe thin wrappers que apenas carregam desse diretório central. Para suportar uma nova ferramenta, basta criar wrappers que referenciam `~/.codemaster/agents/` — sem duplicar lógica.

| Componente | Localização | Responsável |
|---|---|---|
| Templates fonte (no pacote npm) | `_codemaster/agents/{momento}.md` | Versionado com o pacote |
| Agentes instalados globalmente | `~/.codemaster/agents/{momento}.md` | Copiados pelo setup |

**Regra:** Agentes em `~/.codemaster/agents/` são autocontidos — não referenciam qual ferramenta os invoca. A lógica dos 5 momentos, avaliação e scoring vive inteiramente aqui.

**Algoritmo de Scoring por Dimensão (0.0–10):**
- Cada Victory produz 3 scores: `negocio`, `arquitetura`, `ia`
- O agente analisa **todas as 5 respostas holisticamente** para cada dimensão — cada resposta contribui para todas as dimensões com pesos diferentes
- Instrução no prompt: *"Analise o conjunto das respostas. Para cada dimensão, atribua uma nota de 0.0 a 10.0 considerando profundidade, conexão com o contexto real e capacidade de articular o raciocínio."*
- Tendência resultante: **↑** se score ≥ 7.0 | **→** se 4.0–6.9 | **↓** se < 4.0
- Score acumulado no PROGRESS.md = média das victories do milestone atual

**Scoring por Sub-aspecto (3 dimensões × 5 sub-aspectos = 15 competências):**

| Arquitetura | Negócio | Orquestração IA |
|---|---|---|
| Domínio | Valor de Negócio | Mindset Agentic |
| Estrutura | Experiência do Cliente | Gestão de Contexto |
| Integração | Funcionamento do Sistema | Gestão de Tokens |
| Infraestrutura | Métricas e Dados | Prompt Engineering |
| Qualidade | Priorização e Trade-offs | Avaliação de Output |

- Sub-aspectos são avaliados **indiretamente** — as perguntas nunca direcionam a resposta certa
- O agente identifica sinais de maturidade nas respostas e registra no Victory
- KNOWLEDGE-MAP.md inclui seções por sub-aspecto com status e gaps

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
#### Valor de Negócio
- [ ] {tópico} | Score médio: X.X | Fonte: [[Q{id}]], [[Q{id}]]
#### Experiência do Cliente
- [ ] {tópico} | Score médio: X.X | Fonte: [[Q{id}]]
#### Funcionamento do Sistema
- [ ] {tópico} | Score médio: X.X | Fonte: [[Q{id}]]
#### Métricas e Dados
- [ ] {tópico} | Score médio: X.X | Fonte: [[Q{id}]]
#### Priorização e Trade-offs
- [ ] {tópico} | Score médio: X.X | Fonte: [[Q{id}]]

### Arquitetura
#### Domínio
- [ ] {tópico} | Score médio: X.X | Fonte: [[Q{id}]]
#### Estrutura
- [ ] {tópico} | Score médio: X.X | Fonte: [[Q{id}]]
#### Integração
- [ ] {tópico} | Score médio: X.X | Fonte: [[Q{id}]]
#### Infraestrutura
- [ ] {tópico} | Score médio: X.X | Fonte: [[Q{id}]]
#### Qualidade
- [ ] {tópico} | Score médio: X.X | Fonte: [[Q{id}]]

### IA / Orquestração
#### Mindset Agentic
- [ ] {tópico} | Score médio: X.X | Fonte: [[Q{id}]]
#### Gestão de Contexto
- [ ] {tópico} | Score médio: X.X | Fonte: [[Q{id}]]
#### Gestão de Tokens
- [ ] {tópico} | Score médio: X.X | Fonte: [[Q{id}]]
#### Prompt Engineering
- [ ] {tópico} | Score médio: X.X | Fonte: [[Q{id}]]
#### Avaliação de Output
- [ ] {tópico} | Score médio: X.X | Fonte: [[Q{id}]]

## Maturidade Agêntica
- Nível atual: {Vibe Coder | Assistido | Agêntico}
- Tendência: {melhorando | estável | regredindo}
- Padrões: ...
- Recomendação: ...

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

src/moments/                        # lógica de suporte invocável via bash pelos agentes
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
```

## Padrões de Implementação

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
| FR45, FR49 Agent Layer | `_codemaster/agents/` | config |
| FR50–FR76 Avaliação Sub-aspectos | `_codemaster/agents/victory.md` + `moments/victory.js` | vault, state |
