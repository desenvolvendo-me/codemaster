# Obsidian Example — Milestone Completo

Este diretório contém um exemplo completo do que o CodeMaster produz após
um milestone de 5 quests. Leia na ordem abaixo para entender o sistema.

---

## Como ler os exemplos

### 1. Comece pela Quest

Abra `quests/Q001-exemplo-quest.md`

Observe:
- **Frontmatter** com `id`, `type`, `title`, `date`, `milestone`, `tags`, `relics`, `victory` — gerado pelo `/codemaster:quest` e atualizado pelo `/codemaster:victory`
- **Pergunta Âncora** — ponto de partida da reflexão inicial
- **Reflexões por Dimensão** — respostas às 3 perguntas por dimensão (Negócio, Arquitetura, IA)
- **`## Victory`** — link para o arquivo de victory em `victories/`

### 2. Veja a Victory

Abra `victories/Q001-exemplo-quest.md`

Observe:
- Mesmo nome de arquivo que a quest, pasta diferente (`victories/`)
- **Link bidirecional**: quest → victory e victory → quest via `[[wikilink]]`
- Reflexões completas com as 5 perguntas respondidas
- Scores por dimensão com trends (↑ → ↓)

### 3. Veja a Relic arquivada

Abra `relics/R001-vulnerabilidade-algorithm-none-em-jwt.md`

Observe:
- Relic gerada durante a quest e arquivada por ser reutilizável além do contexto
- Frontmatter com `dimension` e `source_quest` classificados
- Wikilink de origem para a quest

### 4. Veja o PROGRESS.md

Abra `PROGRESS.md`

Observe:
- As 5 quests linkadas com scores resumidos
- Milestone 1 completo (5/5 victories)
- Dimensões atuais com médias calculadas

### 5. Veja o Milestone Summary

Abra `M01-summary.md`

Gerado automaticamente ao completar a 5ª Victory do milestone. Contém:
- Wikilinks para as 5 quests do período com scores
- Médias por dimensão
- Padrão emergente identificado pelo agente
- Foco recomendado para o próximo milestone

### 6. Veja o Knowledge Map

Abra `KNOWLEDGE-MAP.md`

Gerado/atualizado pelo `/codemaster:knowledge`. Contém:
- Gaps organizados por dimensão (Negócio / Arquitetura / IA)
- Status de cada gap: `Para Estudar`, `Estudado` ou `Praticado`
- Wikilinks para as quests de origem de cada gap
- Foco recomendado para o próximo milestone

---

## Arquivos deste exemplo

```
templates/obsidian-example/
├── quests/
│   ├── Q001-exemplo-quest.md               ← auth JWT
│   ├── Q002-refatoracao-service-layer.md    ← service layer
│   ├── Q003-integracao-api-externa.md       ← API + circuit breaker
│   ├── Q004-testes-unitarios-coverage-80.md ← testes + coverage
│   └── Q005-deploy-automatizado-ci-cd.md    ← CI/CD
├── victories/
│   ├── Q001-exemplo-quest.md               ← reflexão Q001
│   ├── Q002-refatoracao-service-layer.md    ← reflexão Q002
│   ├── Q003-integracao-api-externa.md       ← reflexão Q003
│   ├── Q004-testes-unitarios-coverage-80.md ← reflexão Q004
│   └── Q005-deploy-automatizado-ci-cd.md    ← reflexão Q005
├── relics/
│   ├── R001-vulnerabilidade-algorithm-none-em-jwt.md
│   ├── R002-service-layer-funcoes-puras-vs-classes.md
│   ├── R003-circuit-breaker-half-open-state.md
│   ├── R004-test-doubles-stub-mock-spy-fake.md
│   └── R005-github-actions-cache-estrategia.md
├── PROGRESS.md       ← histórico de victories por milestone
├── M01-summary.md    ← summary do milestone 1
├── KNOWLEDGE-MAP.md  ← mapa de gaps
└── README.md         ← este arquivo
```

---

## O ciclo completo

```
/codemaster:quest "título"
    ↓ cria quests/Q{id}-{slug}.md
    ↓ cria active-quest.json

/codemaster:relic "descoberta"
    ↓ appenda na quest ativa
    ↓ (opcional) arquiva em relics/R{id}-{slug}.md

/codemaster:victory
    ↓ cria victories/Q{id}-{slug}.md com reflexões
    ↓ atualiza quest com link para victory
    ↓ atualiza PROGRESS.md
    ↓ remove active-quest.json
    ↓ (5ª victory) gera M{id}-summary.md

/codemaster:legend
    ↓ lê PROGRESS.md e victories
    ↓ exibe progresso e tendências

/codemaster:knowledge
    ↓ analisa todas as victories
    ↓ atualiza KNOWLEDGE-MAP.md
    ↓ apresenta gaps prioritários
```
