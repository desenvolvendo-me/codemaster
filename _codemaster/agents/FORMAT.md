# CodeMaster — Formatos de Saída Esperados

Este arquivo é a fonte única de verdade para o formato de todos os arquivos
gerados pelo CodeMaster. Todo agente DEVE seguir estes formatos exatamente.

Para exemplos reais e completos de cada tipo, leia os arquivos em:
`~/.codemaster/examples/` (cópia local) ou `templates/obsidian-example/` (pacote npm).

---

## REGRA CRÍTICA — Frontmatter

O frontmatter é gerado pela função `generateFrontmatter` que usa `JSON.stringify` em todos os valores.

**Isso significa:**
- Strings ficam com aspas: `id: "Q001"` — NÃO `id: Q001`
- Números ficam sem aspas: `milestone: 1` — NÃO `milestone: "1"`
- Arrays ficam com aspas internas: `tags: ["codemaster","quest"]` — NÃO `tags: [codemaster, quest]`
- Scores de victory são strings (resultado de `.toFixed(1)`): `business: "7.5"` — NÃO `business: 7.5`

---

## 1. Nota de Quest — `quests/Q{id}-{slug}.md`

Criada pelo `/codemaster:quest`. Arquivo vivo: atualizado por relic e victory.

### Frontmatter inicial (type: quest)

```
---
id: "Q001"
type: "quest"
title: "Título da quest"
date: "YYYY-MM-DD"
milestone: 1
tags: ["codemaster","quest"]
relics: []
---
```

### Estrutura do corpo

```markdown
# {título da quest}

## Pergunta Âncora

{resposta do dev à pergunta âncora — o que vai resolver}

## Reflexões por Dimensão

### Negócio
- **Por que esse problema existe?** {resposta}
- **Qual o impacto de fazer errado?** {resposta}
- **O que aprendi sobre o domínio?** {resposta}

### Arquitetura
- **Qual padrão de design foi aplicado?** {resposta}
- **O que poderia ter sido feito diferente?** {resposta}
- **Quais trade-offs foram feitos?** {resposta}

### IA / Orquestração
- **Como a IA me ajudou nessa quest?** {resposta}
- **O que a IA errou ou eu precisei corrigir?** {resposta}
- **O que eu sei hoje que não sabia antes?** {resposta}

## Notas de Desenvolvimento

{notas livres do dev durante a quest}
```

### Frontmatter após Victory (type: victory)

Campos adicionados/atualizados pelo `/codemaster:victory`:

```
---
id: "Q001"
type: "victory"
title: "Título da quest"
date: "YYYY-MM-DD"
milestone: 1
tags: ["codemaster","quest"]
relics: ["R001","R002"]
victory: "Q001-slug"
business: "7.5"
architecture: "8.5"
ai_orchestration: "6.0"
---
```

### Seção Victory (adicionada ao corpo da quest)

Apenas um link para o arquivo de victory — as reflexões ficam em `victories/`:

```markdown
## Victory
[[Q001-slug]]
```

---

## 2. Arquivo de Victory — `victories/Q{id}-{slug}.md`

Criado pelo `/codemaster:victory`. Arquivo dedicado às reflexões e scores.
Mesmo nome de arquivo que a quest (`Q001-slug.md`), pasta diferente (`victories/`).

### Frontmatter

```
---
id: "Q001"
type: "victory"
title: "Título da quest"
date: "YYYY-MM-DD"
tags: ["codemaster","victory"]
quest: "Q001-slug"
business: "7.5"
architecture: "8.5"
ai_orchestration: "6.0"
---
```

### Estrutura do corpo

```markdown
# Victory: Q001-{slug}

## Quest
[[Q001-{slug}]]

## Respostas de Reflexão
**impacto_negocio:** {resposta do dev}
**decisao_arquitetural:** {resposta do dev}
**orquestracao_ia:** {resposta do dev}
**novo_aprendizado:** {resposta do dev}
**reflexao_critica:** {resposta do dev}

## Análise por Dimensão
- Negócio: {↑→↓} {score}
- Arquitetura: {↑→↓} {score}
- IA / Orquestração: {↑→↓} {score}
```

---

## 3. Nota de Relic — `relics/R{id}-{slug}.md`

Criada pelo `/codemaster:relic` quando arquivada para uso futuro.

### Frontmatter

```
---
id: "R001"
type: "relic"
title: "Título da descoberta"
date: "YYYY-MM-DD"
milestone: 1
tags: ["codemaster","relic"]
dimension: "architecture"
source_quest: "Q001"
---
```

`dimension` aceita: `"architecture"` | `"business"` | `"ai_orchestration"`

### Estrutura do corpo

```markdown
# Relic: {título da descoberta}

## Descoberta

{descrição clara e objetiva do que foi descoberto}

## Por que importa

{contexto: por que isso é relevante, qual risco ou oportunidade representa}

## Como prevenir / Como aplicar

{código de exemplo, padrão ou prática — concreto e reutilizável}

## Score desta Relic
- {Arquitetura|Negócio|IA}: {score}

## Fonte
[[{id}-{slug da quest de origem}]]
```

---

## 4. Entrada no PROGRESS.md (atualizada pelo Victory)

```markdown
## Milestone {n} — {x}/5 victories

- [[Q{id}-{slug}]] | N:{↑→↓}{score} A:{↑→↓}{score} IA:{↑→↓}{score}
```

Exemplo real:
```markdown
## Milestone 1 — 1/5 victories

- [[Q001-exemplo-quest]] | N:↑7.5 A:↑8.5 IA:→6.0
```

---

## 5. Milestone Summary — `milestones/M{id}-summary.md`

Gerado automaticamente na 5ª victory do milestone. Salvo na pasta `milestones/`.

### Frontmatter

```
---
id: "M01"
type: "milestone"
title: "Milestone 1 — {subtítulo}"
date_start: "YYYY-MM-DD"
date_end: "YYYY-MM-DD"
milestone: 1
tags: ["codemaster","milestone"]
---
```

### Estrutura do corpo

```markdown
# Milestone {n} — {subtítulo}

## Período
{data_start} a {data_end}

## Quests do Período
- [[Q001-{slug}]] | N:{↑→↓}{score} A:{↑→↓}{score} IA:{↑→↓}{score}
- [[Q002-{slug}]] | ...
- [[Q003-{slug}]] | ...
- [[Q004-{slug}]] | ...
- [[Q005-{slug}]] | ...

## Médias por Dimensão
- Negócio: {↑→↓} {média}
- Arquitetura: {↑→↓} {média}
- IA / Orquestração: {↑→↓} {média}

## Relic de Maior Score
[[R{id}-{slug}]] — {dimensão}: {score}

## Padrões Emergentes
1. {padrão identificado — baseado nas respostas das victories}
2. {padrão identificado}
3. {padrão identificado}
4. {padrão identificado}

## Próximo Milestone — Foco Recomendado
Dimensão com menor tendência: **{dimensão}** (média {score} → meta: acima de {meta})

{sugestão concreta baseada nos dados}
```

---

## 6. KNOWLEDGE-MAP.md (atualizado pelo /knowledge)

```markdown
# KNOWLEDGE MAP

## Negócio
- {gap} | Negócio | {Para Estudar|Estudado|Praticado} | [[Q{id}-{slug}]]

## Arquitetura
- {gap} | Arquitetura | {Para Estudar|Estudado|Praticado} | [[Q{id}-{slug}]]

## IA / Orquestração
- {gap} | IA | {Para Estudar|Estudado|Praticado} | [[Q{id}-{slug}]]

## Próximo Milestone — Foco recomendado
- Prioridade 1: {dimensão} ({score médio}) — {descrição do gap}
- Prioridade 2: {dimensão} ({score médio}) — {descrição do gap}
```

---

## 7. Organização por Milestone — arquivamento em `M{id}/`

Quando um milestone é finalizado (5ª victory), os arquivos das 5 quests devem
ser organizados em subpastas `M{id}/` dentro de cada diretório:

```
vault/
├── quests/
│   ├── M01/                    ← milestone 1 arquivado
│   │   ├── Q001-slug.md
│   │   ├── Q002-slug.md
│   │   ├── Q003-slug.md
│   │   ├── Q004-slug.md
│   │   └── Q005-slug.md
│   ├── Q006-slug.md            ← quest em andamento (milestone 2)
│   └── Q007-slug.md            ← quest finalizada (milestone 2)
├── victories/
│   ├── M01/
│   │   ├── Q001-slug.md
│   │   └── ...
│   └── Q007-slug.md
├── relics/
│   ├── M01/
│   │   ├── R001-slug.md
│   │   └── ...
│   ├── R006-slug.md
│   └── R007-slug.md
├── milestones/
│   └── M01-summary.md
├── PROGRESS.md
└── KNOWLEDGE-MAP.md
```

### Regras de arquivamento

1. Mover os 5 arquivos de quest do milestone para `quests/M{id}/`
2. Mover os 5 arquivos de victory para `victories/M{id}/`
3. Mover as relics associadas (via `source_quest`) para `relics/M{id}/`
4. Wikilinks continuam funcionando (Obsidian resolve por nome, não por caminho)
5. PROGRESS.md e M{id}-summary.md ficam na raiz do vault

### Quando executar

O arquivamento acontece como parte do `/codemaster:victory` ao completar a
5ª victory do milestone, junto com a criação do M{id}-summary.md.

---

## Regras de Score e Tendência

| Score | Tendência | Significado |
|---|---|---|
| ≥ 7.0 | ↑ | Forte — dimensão em evolução |
| 4.0–6.9 | → | Estável — dimensão em progresso |
| < 4.0 | ↓ | Atenção — dimensão que precisa de foco |

**Anti-inflação:** se uma dimensão não foi mencionada nas respostas de reflexão, score máximo = 4.0

---

## Referência de Exemplos Reais

Quest em andamento (type: quest):
`~/.codemaster/examples/quests/Q006-notificacoes-tempo-real.md`

Quest finalizada (type: victory, com link para victory):
`~/.codemaster/examples/quests/Q007-dashboard-gerencial-cache.md`

Victory (reflexões e scores):
`~/.codemaster/examples/victories/Q007-dashboard-gerencial-cache.md`

Relics por dimensão:
- Negócio: `~/.codemaster/examples/relics/R007-latencia-percebida-metrica-negocio.md`
- Arquitetura: `~/.codemaster/examples/relics/R006-websocket-vs-sse-decisao-arquitetural.md`
- IA: `~/.codemaster/examples/relics/M01/R003-ia-calibracao-thresholds-resiliencia.md`

Milestone arquivado em M01/:
`~/.codemaster/examples/quests/M01/`
`~/.codemaster/examples/victories/M01/`
`~/.codemaster/examples/relics/M01/`

Milestone summary:
`~/.codemaster/examples/milestones/M01-summary.md`

PROGRESS.md com M1 completo + M2 em andamento:
`~/.codemaster/examples/PROGRESS.md`

Knowledge map:
`~/.codemaster/examples/KNOWLEDGE-MAP.md`
