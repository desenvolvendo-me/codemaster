# Story 4.1: Sistema detecta milestone e cria summary automaticamente

Status: ready-for-dev

## Story

Como developer (Ricardo),
quero que o sistema detecte minha 5ª victory automaticamente e crie um resumo do milestone,
para que meu progresso seja marcado e preservado como artefato histórico.

## Acceptance Criteria

1. **Dado** que dev completa uma victory que é a 5ª do milestone atual
   **Quando** fluxo de Victory finaliza
   **Então** sistema detecta conclusão do milestone
   **E** `M{id}-summary.md` é criado no vault com: título, intervalo de datas, wikilinks para as 5 quests do período, médias de score por dimensão, relic de maior score do período e padrões emergentes identificados pelo agente
   **E** `PROGRESS.md` é atualizado para marcar Milestone {n} como completo e abre o Milestone {n+1}
   **E** agente parabeniza dev pela conclusão do milestone com destaque para a dimensão de maior evolução

## Tasks / Subtasks

- [ ] Criar `src/services/milestone.js` com funções de detecção e criação de summary (AC: 1)
  - [ ] `detectMilestone(vaultPath)` — verifica se 5ª victory foi atingida
    - [ ] Contar victories na pasta `quests/` com `type: victory` no frontmatter
    - [ ] Retornar `{ isComplete: boolean, milestoneId: number, victories: [] }`
  - [ ] `createMilestoneSummary(vaultPath, milestoneData)` — cria `M{id}-summary.md`
    - [ ] Calcular médias de score por dimensão a partir das victories
    - [ ] Identificar relic de maior score do período
    - [ ] Gerar conteúdo com wikilinks para as 5 quests
    - [ ] Escrever arquivo via `vault.js` (NÃO diretamente via fs)
  - [ ] `updateProgressForMilestone(vaultPath, milestoneId)` — atualiza `PROGRESS.md`
    - [ ] Marcar Milestone {n} como completo
    - [ ] Abrir seção Milestone {n+1}
- [ ] Criar `src/services/milestone.test.js` com testes das funções de detecção
- [ ] Integrar `detectMilestone()` no fluxo de Victory (chamado ao final do momento `victory`)

## Dev Notes

### Fronteira de acesso único — REGRA CRÍTICA

`src/services/milestone.js` NÃO acessa o vault diretamente — SEMPRE usa `src/services/vault.js`.
A leitura de frontmatter usa `src/utils/frontmatter.js`.

### Schema do `M{id}-summary.md`

```markdown
---
id: M01
type: milestone
title: Milestone 1 — Fundação
date_start: 2026-03-01
date_end: 2026-03-17
milestone: 1
tags: [codemaster, milestone]
---

# Milestone 1 — Fundação

## Período
2026-03-01 a 2026-03-17

## Quests do Período
- [[Q001-quest-um]]
- [[Q002-quest-dois]]
- [[Q003-quest-tres]]
- [[Q004-quest-quatro]]
- [[Q005-quest-cinco]]

## Médias por Dimensão
- Negócio: 6.2
- Arquitetura: 7.8
- IA / Orquestração: 5.5

## Relic de Maior Score
[[R003-relic-destaque]] — Arquitetura: 9.0

## Padrões Emergentes
_Gerado pelo agente com base nas reflexões do período_
```

### `PROGRESS.md` — atualização ao fechar milestone

Antes (milestone em andamento):
```markdown
## Milestone 1 — 5/5 victories
- [[Q001-...]] | N:↑8.0 A:↑8.5 IA:→5.0
```

Depois (milestone fechado + novo aberto):
```markdown
## Milestone 1 ✓ — [[M01-summary]]
- [[Q001-...]] | N:↑8.0 A:↑8.5 IA:→5.0
...

## Milestone 2 — 0/5 victories
```

### `detectMilestone()` — lógica de contagem

```js
export async function detectMilestone(vaultPath) {
  const notes = await listNotes(vaultPath, 'quests')
  const victories = []

  for (const note of notes) {
    const content = await readNote(vaultPath, 'quests', note)
    const fm = parseFrontmatter(content)
    if (fm.type === 'victory') victories.push({ ...fm, fileName: note })
  }

  const currentMilestone = Math.max(...victories.map(v => v.milestone ?? 1), 1)
  const currentVictories = victories.filter(v => v.milestone === currentMilestone)

  return {
    isComplete: currentVictories.length >= 5,
    milestoneId: currentMilestone,
    victories: currentVictories
  }
}
```

### `src/utils/frontmatter.js` — parsing de frontmatter

```js
export function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]+?)\n---/)
  if (!match) return {}
  // Parsear YAML manualmente ou usar biblioteca leve
  // Para MVP: regex simples para campos key: value
  const lines = match[1].split('\n')
  return Object.fromEntries(
    lines.map(l => l.split(': ')).filter(p => p.length === 2).map(([k, v]) => [k.trim(), v.trim()])
  )
}

export function generateFrontmatter(fields) {
  const lines = Object.entries(fields).map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
  return `---\n${lines.join('\n')}\n---\n`
}
```

### Dimensão de maior evolução — cálculo

```js
function findBestDimension(victories) {
  const dims = ['business', 'architecture', 'ai_orchestration']
  const avgs = dims.map(d => ({
    dimension: d,
    avg: victories.reduce((sum, v) => sum + (Number(v[d]) || 0), 0) / victories.length
  }))
  return avgs.sort((a, b) => b.avg - a.avg)[0]
}
```

### Output para o agente — parabenização

```js
import { printEpic } from '../utils/output.js'

printEpic(
  `🏆 Milestone ${milestoneId} Completo!`,
  `Sua maior evolução foi em ${bestDimension.dimension} (média: ${bestDimension.avg.toFixed(1)})\nResumo salvo em M${String(milestoneId).padStart(2,'0')}-summary.md`
)
```

### Testes prioritários

```js
describe('milestone', () => {
  it('should detect 5th victory correctly', ...)
  it('should NOT detect milestone with 4 victories', ...)
  it('should calculate correct dimension averages', ...)
  it('should identify highest scoring relic', ...)
})
```

### Project Structure Notes

- `milestone.js` está em `src/services/` — tem IO mas usa `vault.js` como proxy
- `milestone.js` importa `vault.js` para ler/escrever notas
- `milestone.js` importa `utils/frontmatter.js` para parsing
- `milestone.js` NÃO importa `fs/promises` diretamente

### References

- FR29, FR30: [prd.md](../../planning-artifacts/IN001-cli/prd.md)
- Schema milestone: [architecture.md](../../planning-artifacts/IN001-cli/architecture.md)
- Story completa: [epics.md](../../planning-artifacts/IN001-cli/epics.md#Story-4.1)
- Continua em: [4-2-sistema-consolida-aprendizado-e-orienta-proximos-estudos.md](./4-2-sistema-consolida-aprendizado-e-orienta-proximos-estudos.md)

## Dev Agent Record

### Agent Model Used

_a preencher_

### Debug Log References

### Completion Notes List

### File List
