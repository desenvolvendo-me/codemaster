# Story 2.4: Nível de Dificuldade na Quest com Comparação na Victory

Status: review

## Story

Como developer (Marco Castro),
quero definir o nível de dificuldade ao iniciar uma Quest e também ao encerrá-la na Victory,
para que eu possa comparar minha percepção de dificuldade no planejamento versus na execução — revelando padrões de subestimação ou superestimação que me ajudem a evoluir como engenheiro.

## Contexto de Negócio

A comparação entre dificuldade planejada e dificuldade real é um indicador poderoso de maturidade técnica. Devs iniciantes tendem a subestimar tarefas complexas e superestimar tarefas simples. Ao rastrear esse delta ao longo do tempo, o CodeMaster gera mais um eixo de evolução visível — e o uso de monstros de RPG medieval torna o processo lúdico e memorável.

## Níveis de Dificuldade — Escala de Monstros

| Nível | Monstro | Valor | Descrição |
|-------|---------|-------|-----------|
| 1 | 🐀 **Goblin** | 1 | Tarefa trivial — solução clara, sem incerteza |
| 2 | ⚔️ **Orc** | 2 | Tarefa simples — caminho conhecido, esforço moderado |
| 3 | 🪨 **Troll** | 3 | Tarefa média — exige decisões técnicas, alguma incerteza |
| 4 | 🐉 **Dragon** | 4 | Tarefa difícil — múltiplas decisões, risco técnico |
| 5 | 💀 **Lich** | 5 | Tarefa épica — território desconhecido, alta complexidade |

## Acceptance Criteria

### AC1: Seleção de dificuldade na Quest

**Dado** que o dev está iniciando uma Quest via `/codemaster:quest`
**Quando** o agente faz a pergunta âncora ("Descreva o problema ou tarefa em uma frase")
**E** o dev responde
**Então** antes das 3 perguntas de dimensão, o agente apresenta a escala de monstros e pergunta: "Qual o nível de dificuldade que você estima para essa missão?"
**E** o dev escolhe um dos 5 níveis (Goblin, Orc, Troll, Dragon, Lich)
**E** o nível é registrado no `active-quest.json` como `plannedDifficulty`
**E** o nível é registrado no frontmatter da nota da quest como `planned_difficulty`

### AC2: Seleção de dificuldade na Victory

**Dado** que o dev está encerrando uma Quest via `/codemaster:victory`
**Quando** o agente conclui as 5 perguntas de reflexão
**Então** antes do scoring, o agente relembra o nível planejado (ex: "Você estimou essa quest como 🐉 Dragon") e pergunta: "Agora que concluiu, qual foi a dificuldade real?"
**E** o dev escolhe um dos 5 níveis
**E** o nível é registrado no frontmatter da nota da quest como `actual_difficulty`
**E** o nível é registrado no arquivo de victory como `actual_difficulty`

### AC3: Delta de dificuldade visível

**Dado** que o dev acabou de escolher a dificuldade real na Victory
**Quando** o agente apresenta o resultado do scoring
**Então** o agente exibe a comparação: `Planejado: 🐉 Dragon (4) → Real: 💀 Lich (5) | Delta: +1 (subestimou)`
**E** se delta > 0: agente comenta que o dev subestimou a complexidade
**E** se delta < 0: agente comenta que o dev superestimou a complexidade
**E** se delta = 0: agente comenta que a estimativa foi precisa

### AC4: Persistência no PROGRESS.md

**Dado** que a Victory foi concluída com dificuldade planejada e real
**Quando** o PROGRESS.md é atualizado
**Então** a entrada da victory inclui o delta: `[[Q{id}-{slug}]] | N:↑8.0 A:→5.5 IA:→6.0 | 🐉→💀 (+1)`

### AC5: Retrocompatibilidade

**Dado** que existem quests anteriores sem campo de dificuldade
**Quando** o sistema lê essas quests
**Então** funciona normalmente — campos `planned_difficulty` e `actual_difficulty` são opcionais
**E** o Legend exibe "—" quando não há dados de dificuldade para uma quest

## Tasks / Subtasks

- [x] Task 1: Atualizar agente quest.md (AC: #1)
  - [x] 1.1 Adicionar apresentação da escala de monstros após pergunta âncora
  - [x] 1.2 Adicionar pergunta de seleção de dificuldade planejada
  - [x] 1.3 Instruir agente a registrar `plannedDifficulty` no fluxo

- [x] Task 2: Atualizar `src/moments/quest.js` (AC: #1)
  - [x] 2.1 Adicionar campo `plannedDifficulty` ao `active-quest.json` (valor numérico 1-5)
  - [x] 2.2 Adicionar campo `planned_difficulty` ao frontmatter da nota da quest (nome do monstro: "goblin"|"orc"|"troll"|"dragon"|"lich")
  - [x] 2.3 Garantir que `planned_difficulty_value` (numérico) também vai ao frontmatter para queries Dataview

- [x] Task 3: Atualizar agente victory.md (AC: #2, #3)
  - [x] 3.1 Após as 5 perguntas, ler `plannedDifficulty` do `active-quest.json`
  - [x] 3.2 Apresentar o monstro planejado e perguntar a dificuldade real
  - [x] 3.3 Calcular e exibir delta com comentário contextual
  - [x] 3.4 Instruir agente a registrar `actual_difficulty` no fluxo

- [x] Task 4: Atualizar `src/moments/victory.js` (AC: #2, #3, #4)
  - [x] 4.1 Adicionar `actual_difficulty` e `actual_difficulty_value` ao frontmatter da quest
  - [x] 4.2 Adicionar `actual_difficulty` ao frontmatter do victory
  - [x] 4.3 Incluir delta na entrada do PROGRESS.md com emoji do monstro

- [x] Task 5: Atualizar agente legend.md (AC: #5)
  - [x] 5.1 Exibir coluna de dificuldade (planejada→real) nas victories listadas
  - [x] 5.2 Tratar quests sem dados de dificuldade graciosamente (exibir "—")

## Dev Notes

### Arquivos a modificar

| Arquivo | Tipo de mudança |
|---------|----------------|
| `_codemaster/agents/quest.md` | Adicionar fluxo de seleção de monstro após âncora |
| `_codemaster/agents/victory.md` | Adicionar comparação de dificuldade após reflexões |
| `_codemaster/agents/legend.md` | Exibir delta de dificuldade no histórico |
| `src/moments/quest.js` | Adicionar `plannedDifficulty` ao state e frontmatter |
| `src/moments/victory.js` | Adicionar `actual_difficulty`, delta ao PROGRESS.md |

### Constante de mapeamento (usar em quest.js e victory.js)

```js
const DIFFICULTY_MONSTERS = {
  1: { name: 'goblin', emoji: '🐀', label: 'Goblin — Tarefa trivial' },
  2: { name: 'orc', emoji: '⚔️', label: 'Orc — Tarefa simples' },
  3: { name: 'troll', emoji: '🪨', label: 'Troll — Tarefa média' },
  4: { name: 'dragon', emoji: '🐉', label: 'Dragon — Tarefa difícil' },
  5: { name: 'lich', emoji: '💀', label: 'Lich — Tarefa épica' },
};
```

**Localização sugerida:** `src/utils/difficulty.js` — módulo compartilhado entre quest.js e victory.js.

### Schema de dados atualizado

**active-quest.json** (campo adicionado):
```json
{
  "id": "Q001",
  "title": "Quest Title",
  "slug": "quest-title-slug",
  "notePath": "quests/Q001-quest-title-slug.md",
  "startedAt": "2026-03-17T10:00:00Z",
  "milestone": 1,
  "plannedDifficulty": 4
}
```

**Frontmatter da quest** (campos adicionados):
```yaml
---
id: "Q001"
type: "quest"
title: "Quest Title"
date: "2026-03-17"
milestone: 1
tags: ["codemaster","quest"]
relics: []
planned_difficulty: "dragon"
planned_difficulty_value: 4
---
```

**Frontmatter da quest após victory** (campos adicionados):
```yaml
---
planned_difficulty: "dragon"
planned_difficulty_value: 4
actual_difficulty: "lich"
actual_difficulty_value: 5
---
```

**Frontmatter do victory** (campo adicionado):
```yaml
---
actual_difficulty: "lich"
actual_difficulty_value: 5
difficulty_delta: 1
---
```

**PROGRESS.md** (formato atualizado):
```markdown
- [[Q001-slug]] | N:↑8.0 A:→5.5 IA:→6.0 | 🐉→💀 (+1)
```

### Padrões do projeto a seguir

- **Frontmatter:** usar `JSON.stringify()` para todos os valores (padrão existente em `src/utils/frontmatter.js`)
- **Scores como string:** `"7.5"` e não `7.5` no frontmatter (padrão existente)
- **Dificuldade como string no frontmatter:** `"dragon"` — e `planned_difficulty_value` como número para Dataview
- **Output:** todo output via `src/utils/output.js` (padrão existente)
- **State:** persistência via `src/services/state.js` (padrão existente)
- **Slugify:** usar `src/utils/slugify.js` existente

### Retrocompatibilidade

- Campos `planned_difficulty` e `actual_difficulty` são **opcionais** em todo o sistema
- Quest antigas sem esses campos funcionam normalmente
- Legend exibe "—" quando dados de dificuldade não existem
- PROGRESS.md mantém formato anterior para entradas sem dificuldade

### Project Structure Notes

- Alinhado com a estrutura existente em `src/moments/` e `src/utils/`
- Novo módulo `src/utils/difficulty.js` segue o padrão de utilidades existentes (`output.js`, `frontmatter.js`, `slugify.js`)
- Nenhum conflito com estrutura existente

### References

- [Source: _bmad-output/planning-artifacts/IN002-claude-code/architecture.md#Stack & Decisões] — Algoritmo de scoring, fluxo Quest e Victory
- [Source: _bmad-output/planning-artifacts/IN002-claude-code/epics.md#Story 2.1] — Fluxo de criação de quest com reflexão guiada
- [Source: _bmad-output/planning-artifacts/IN002-claude-code/epics.md#Story 2.3] — Fluxo de victory com scoring por dimensão
- [Source: _bmad-output/planning-artifacts/IN002-claude-code/prd.md#FR10-FR12] — Requisitos de quest e nota no Obsidian
- [Source: _bmad-output/planning-artifacts/IN002-claude-code/prd.md#FR19-FR23] — Requisitos de victory e PROGRESS.md

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

### Completion Notes List

- Criado `src/utils/difficulty.js` com constantes DIFFICULTY_MONSTERS e funções utilitárias (getDifficultyByValue, getDifficultyByName, formatDifficultyDelta)
- Atualizado `src/moments/quest.js` — `createQuest()` aceita `plannedDifficulty` (4º param opcional), persiste no frontmatter e active-quest.json
- Atualizado `src/moments/victory.js` — `closeVictory()` aceita `difficulty` (5º param opcional com {planned, actual}), persiste actual_difficulty no frontmatter de quest e victory, inclui delta no PROGRESS.md
- Atualizado `_codemaster/agents/quest.md` — novo Passo 2 (escala de monstros) entre âncora e perguntas de dimensão
- Atualizado `_codemaster/agents/victory.md` — novo Passo 3 (dificuldade real) entre reflexões e scoring
- Atualizado `_codemaster/agents/legend.md` — coluna de dificuldade nas victories com fallback "—"
- 11 testes novos em difficulty.test.js, 4 testes novos em quest.test.js, 7 testes novos em victory.test.js
- Suíte completa: 156 testes, 0 falhas, 0 regressões

### File List

- `src/utils/difficulty.js` (novo)
- `src/utils/difficulty.test.js` (novo)
- `src/moments/quest.js` (modificado)
- `src/moments/quest.test.js` (modificado)
- `src/moments/victory.js` (modificado)
- `src/moments/victory.test.js` (modificado)
- `_codemaster/agents/quest.md` (modificado)
- `_codemaster/agents/victory.md` (modificado)
- `_codemaster/agents/legend.md` (modificado)
