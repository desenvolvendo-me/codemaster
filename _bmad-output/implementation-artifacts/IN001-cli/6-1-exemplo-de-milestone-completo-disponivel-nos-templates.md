# Story 6.1: Exemplo de milestone completo disponível nos templates

Status: review

## Story

Como developer fazendo onboarding com o CodeMaster,
quero ver um exemplo completo do que o sistema produz após um milestone,
para que eu entenda claramente o resultado esperado antes de começar a usar.

## Acceptance Criteria

1. **Dado** que developer acessa `templates/obsidian-example/`
   **Quando** examina os arquivos de exemplo
   **Então** diretório contém:
   - `quests/Q001-exemplo-quest.md` — com frontmatter correto, pergunta âncora, 3 reflexões por dimensão e seção `## Victory` com scores
   - `relics/R001-exemplo-relic.md` — com frontmatter, dimensão classificada e conteúdo realista
   - `M01-summary.md` — com wikilinks para as quests, médias de score e padrões emergentes
   - `KNOWLEDGE-MAP.md` — com schema completo: gaps por dimensão, status (Para Estudar/Estudado/Praticado) e wikilinks de origem

2. Todos os arquivos usam o frontmatter correto (id, type, title, date, milestone, tags)

3. Os exemplos são incluídos no pacote npm (não listados no `.npmignore`)

## Tasks / Subtasks

- [x] Criar `templates/obsidian-example/quests/Q001-exemplo-quest.md` (AC: 1, 2)
  - [x] Frontmatter completo: id, type, title, date, milestone, tags, relics
  - [x] Seção de pergunta âncora da quest
  - [x] 3 reflexões por dimensão (Negócio, Arquitetura, IA)
  - [x] Seção `## Victory` com scores realistas
- [x] Criar `templates/obsidian-example/relics/R001-exemplo-relic.md` (AC: 1, 2)
  - [x] Frontmatter completo: id, type, title, date, milestone, tags, dimension
  - [x] Conteúdo realista com descoberta técnica relevante
- [x] Criar `templates/obsidian-example/M01-summary.md` (AC: 1, 2)
  - [x] Frontmatter de milestone
  - [x] Wikilinks para quests do período
  - [x] Médias de score por dimensão
  - [x] Seção de padrões emergentes
- [x] Criar `templates/obsidian-example/KNOWLEDGE-MAP.md` (AC: 1, 2)
  - [x] Schema completo com 3 seções (Negócio, Arquitetura, IA)
  - [x] Entradas com status variado (Para Estudar / Estudado / Praticado)
  - [x] Wikilinks de origem
- [x] Criar `templates/obsidian-example/README.md` — guia de leitura do exemplo (AC: 1)
- [x] Verificar que `.npmignore` NÃO lista `templates/obsidian-example/` (AC: 3)

## Dev Notes

### ATENÇÃO: `.npmignore` — NÃO excluir este diretório

`templates/obsidian-example/` DEVE ser incluído no pacote npm (FR48).
Verificar que `.npmignore` criado na story 1.1 não exclui este diretório.
Se excluir por padrão com `templates/`, corrigir para excluir apenas `templates/claude-commands/`.

### `Q001-exemplo-quest.md` — conteúdo completo

```markdown
---
id: Q001
type: quest
title: Implementar autenticação JWT em API Node.js
date: 2026-03-01
milestone: 1
tags: [codemaster, quest]
relics: [R001]
---

# Quest: Implementar autenticação JWT em API Node.js

## Pergunta Âncora
Como posso implementar autenticação segura com JWT sem criar vulnerabilidades
de segurança comuns como tokens sem expiração ou armazenamento inseguro?

## Reflexões por Dimensão

### Negócio
- **Por que esse problema existe?** Precisamos proteger dados dos usuários e
  garantir que apenas usuários autenticados acessem recursos privados.
- **Qual o impacto de fazer errado?** Vazamento de dados, perda de confiança,
  possíveis implicações legais (LGPD).
- **O que aprendi sobre o domínio?** Autenticação sem estado (stateless) com
  JWT é preferível para APIs que precisam escalar horizontalmente.

### Arquitetura
- **Qual padrão de design foi aplicado?** Middleware de autenticação intercep-
  tando requests antes dos controllers — separação clara de responsabilidades.
- **O que poderia ter sido feito diferente?** Poderia usar sessions no servidor,
  mas isso adiciona estado e complexidade de escalabilidade.
- **Quais trade-offs foram feitos?** JWT stateless = impossível invalidar token
  antes de expirar. Solução: refresh tokens + blacklist em Redis.

### IA / Orquestração
- **Como a IA me ajudou nessa quest?** Claude sugeriu o padrão de middleware
  separado e alertou sobre o risco de não validar o algoritmo do token (algo: none).
- **O que a IA errou ou eu precisei corrigir?** A primeira implementação não
  incluía tratamento para token expirado — tive que adicionar manualmente.
- **O que eu sei hoje que não sabia antes?** A importância de validar o campo
  `algorithm` no JWT para evitar o ataque de "none algorithm".

## Victory

**Data de conclusão:** 2026-03-03

### Scores por Dimensão
- Negócio: 7.5
- Arquitetura: 8.5
- IA / Orquestração: 6.0

### O que foi entregue
Implementação completa de autenticação JWT com middleware Express, refresh
tokens, blacklist em memória (para MVP) e testes unitários para os handlers.

### Relics desta Quest
- [[R001-algoritmo-none-jwt]] — bug crítico evitado graças à IA
```

### `R001-exemplo-relic.md` — conteúdo completo

```markdown
---
id: R001
type: relic
title: Vulnerabilidade "algorithm: none" em JWT
date: 2026-03-02
milestone: 1
tags: [codemaster, relic, security]
dimension: architecture
source_quest: Q001
---

# Relic: Vulnerabilidade "algorithm: none" em JWT

## Descoberta

Ao implementar autenticação JWT, descobri que algumas bibliotecas aceitam
tokens assinados com `algorithm: none` — o que permite a qualquer pessoa
forjar um token válido sem conhecer a chave secreta.

## Por que importa

Esse é um vetor de ataque real, documentado no OWASP como JWT vulnerability.
A maioria dos tutoriais online não menciona esse risco.

## Como prevenir

```js
jwt.verify(token, SECRET, { algorithms: ['HS256'] })
// O segundo parâmetro algorithms é OBRIGATÓRIO
```

## Score desta Relic
- Arquitetura: 9.0

## Fonte
[[Q001-autenticacao-jwt]]
```

### `M01-summary.md` — conteúdo completo

```markdown
---
id: M01
type: milestone
title: Milestone 1 — Fundação e Primeiros Sistemas
date_start: 2026-03-01
date_end: 2026-03-17
milestone: 1
tags: [codemaster, milestone]
---

# Milestone 1 — Fundação e Primeiros Sistemas

## Período
2026-03-01 a 2026-03-17

## Quests do Período
- [[Q001-autenticacao-jwt]]
- [[Q002-refatoracao-service-layer]]
- [[Q003-integracao-api-externa]]
- [[Q004-testes-unitarios-coverage-80]]
- [[Q005-deploy-automatizado-ci-cd]]

## Médias por Dimensão
- Negócio: 6.8
- Arquitetura: 8.1
- IA / Orquestração: 5.4

## Relic de Maior Score
[[R001-algoritmo-none-jwt]] — Arquitetura: 9.0

## Padrões Emergentes
1. Forte inclinação para soluções técnicas elegantes (Arquitetura alta)
2. Tendência a subestimar o impacto de negócio das decisões técnicas
3. Ainda exploratório com IA — potencial grande de melhoria
4. Boa capacidade de aprender com erros e documentar descobertas
```

### `KNOWLEDGE-MAP.md` — schema completo

```markdown
# KNOWLEDGE MAP

## Negócio
- Métricas de produto (DAU, churn, LTV) | Negócio | Para Estudar | [[Q002-refatoracao-service-layer]]
- Impacto financeiro de decisões técnicas | Negócio | Para Estudar | [[Q003-integracao-api-externa]]
- Customer segmentation | Negócio | Estudado | [[Q001-autenticacao-jwt]]

## Arquitetura
- Vulnerabilidade "algorithm: none" em JWT | Arquitetura | Praticado | [[Q001-autenticacao-jwt]]
- Event-driven architecture | Arquitetura | Para Estudar | [[Q004-testes-unitarios]]
- CQRS pattern | Arquitetura | Para Estudar | [[Q005-deploy-ci-cd]]
- Service layer separation | Arquitetura | Praticado | [[Q002-refatoracao-service-layer]]

## IA / Orquestração
- RAG pipelines | IA | Para Estudar | [[Q003-integracao-api-externa]]
- Prompt engineering para code review | IA | Estudado | [[Q001-autenticacao-jwt]]
- Multi-agent orchestration | IA | Para Estudar | [[Q005-deploy-ci-cd]]
```

### Project Structure Notes

- Estes são arquivos ESTÁTICOS de exemplo — sem lógica de código
- Conteúdo deve ser realista o suficiente para comunicar o sistema ao dev onboarding
- `templates/obsidian-example/README.md` deve orientar como ler os exemplos na ordem correta

### References

- FR47, FR48: [prd.md](../../planning-artifacts/IN001-cli/prd.md)
- Frontmatter schema: [architecture.md](../../planning-artifacts/IN001-cli/architecture.md#Frontmatter)
- KNOWLEDGE-MAP schema: [architecture.md](../../planning-artifacts/IN001-cli/architecture.md#PROGRESS.md)
- Story completa: [epics.md](../../planning-artifacts/IN001-cli/epics.md#Story-6.1)

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

Nenhum bloqueio — story é exclusivamente de arquivos estáticos de exemplo.

### Completion Notes List

- Criados 5 arquivos estáticos em `templates/obsidian-example/`
- Frontmatter das quests usa o formato exato gerado por `generateFrontmatter` (JSON.stringify, incluindo aspas em strings e arrays)
- Quest de exemplo inclui estado final `type: "victory"` com todos os campos inseridos pelo `closeVictory` (business, architecture, ai_orchestration)
- `.npmignore` verificado: não exclui `templates/obsidian-example/` — AC #3 satisfeito
- 131 testes passando, sem regressões

### File List

- templates/obsidian-example/quests/Q001-exemplo-quest.md (novo)
- templates/obsidian-example/relics/R001-vulnerabilidade-algorithm-none-em-jwt.md (novo)
- templates/obsidian-example/M01-summary.md (novo)
- templates/obsidian-example/KNOWLEDGE-MAP.md (novo)
- templates/obsidian-example/README.md (novo)
