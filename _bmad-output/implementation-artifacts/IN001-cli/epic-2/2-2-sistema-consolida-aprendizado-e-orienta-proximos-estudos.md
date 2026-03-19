# Story 2.2: Sistema consolida aprendizado e orienta próximos estudos

Status: review

## Story

Como developer (Ricardo),
quero que meu vault seja organizado em pastas de histórico por milestone e meu knowledge map atualizado,
para que meu aprendizado seja consolidado e eu tenha direção clara de estudo para o próximo ciclo.

## Acceptance Criteria

1. **Dado** que milestone summary foi criado (Story 2.1)
   **Quando** consolidação do milestone executa
   **Então** arquivos de quest, relic e victory do milestone concluído são movidos para `vault/milestone-{id}/` como histórico
   **E** `KNOWLEDGE-MAP.md` é atualizado com gaps identificados durante o período do milestone
   **E** pastas `quests/` e `relics/` na raiz ficam limpas para o próximo milestone
   **E** agente apresenta os 3 gaps mais críticos do milestone com sugestões concretas de estudo para cada um
   **E** agente orienta sobre o foco recomendado para o próximo milestone com base na dimensão de menor tendência

## Tasks / Subtasks

- [x] Adicionar `reorganizeVault(vaultPath, milestoneId, victories)` em `src/services/milestone.js` (AC: 1)
  - [x] Criar pasta `vault/milestone-{id}/` com `mkdir({ recursive: true })`
  - [x] Mover arquivos de quests do milestone para `milestone-{id}/quests/`
  - [x] Mover arquivos de relics linkados para `milestone-{id}/relics/`
  - [x] Mover `M{id}-summary.md` para `milestone-{id}/`
  - [x] Verificar que `quests/` e `relics/` raiz ficaram limpas
- [x] Adicionar `updateKnowledgeMap(vaultPath, gaps)` em `src/services/milestone.js` (AC: 1)
  - [x] Ler `KNOWLEDGE-MAP.md` atual
  - [x] Adicionar gaps identificados em cada seção (Negócio, Arquitetura, IA)
  - [x] Escrever de volta via `vault.js` (nunca fs direto)
- [x] Adicionar `identifyGaps(victories)` — pure function em `src/utils/` (AC: 1)
  - [x] Analisar dimensões de menor score nas victories
  - [x] Retornar array de gaps ordenados por criticidade
- [x] Integrar consolidação no fluxo após `createMilestoneSummary()` (story 4.1)
- [x] Criar testes de `reorganizeVault` e `updateKnowledgeMap`
- [x] Exibir output de orientação via `printEpic()` com 3 gaps + foco recomendado (AC: 1)

## Dev Notes

### Sequência de execução (CRÍTICO — ordem obrigatória)

```
1. detectMilestone()        → story 4.1
2. createMilestoneSummary() → story 4.1
3. updateProgressForMilestone() → story 4.1
4. reorganizeVault()        → esta story
5. updateKnowledgeMap()     → esta story
6. printGuidance()          → esta story
```

### `reorganizeVault()` — implementação de referência

```js
import { rename, mkdir } from 'fs/promises'
import { join } from 'path'
import { listNotes, readNote } from './vault.js'
import { parseFrontmatter } from '../utils/frontmatter.js'

export async function reorganizeVault(vaultPath, milestoneId) {
  const historyBase = join(vaultPath, `milestone-${String(milestoneId).padStart(2, '0')}`)
  await mkdir(join(historyBase, 'quests'), { recursive: true })
  await mkdir(join(historyBase, 'relics'), { recursive: true })

  // Mover quests e victories do milestone
  const questFiles = await listNotes(vaultPath, 'quests')
  for (const file of questFiles) {
    const content = await readNote(vaultPath, 'quests', file)
    const fm = parseFrontmatter(content)
    if (Number(fm.milestone) === milestoneId) {
      await rename(
        join(vaultPath, 'quests', file),
        join(historyBase, 'quests', file)
      )
    }
  }

  // Mover relics do milestone
  const relicFiles = await listNotes(vaultPath, 'relics')
  for (const file of relicFiles) {
    const content = await readNote(vaultPath, 'relics', file)
    const fm = parseFrontmatter(content)
    if (Number(fm.milestone) === milestoneId) {
      await rename(
        join(vaultPath, 'relics', file),
        join(historyBase, 'relics', file)
      )
    }
  }

  // Mover M{id}-summary.md
  const summaryFile = `M${String(milestoneId).padStart(2, '0')}-summary.md`
  try {
    await rename(
      join(vaultPath, summaryFile),
      join(historyBase, summaryFile)
    )
  } catch {
    // arquivo pode não existir — graceful
  }
}
```

### `updateKnowledgeMap()` — estratégia de append

NÃO substituir o KNOWLEDGE-MAP.md inteiro — APENAS adicionar novas entradas:

```js
export async function updateKnowledgeMap(vaultPath, gaps) {
  const content = await readNote(vaultPath, '', 'KNOWLEDGE-MAP.md')
  const newEntries = gaps.map(g =>
    `- ${g.topic} | ${g.dimension} | Para Estudar | [[${g.sourceQuest}]]`
  ).join('\n')

  // Adicionar na seção correta de cada dimensão
  const updated = appendToSection(content, gaps)
  await updateNote(vaultPath, '', 'KNOWLEDGE-MAP.md', updated)
}
```

### `KNOWLEDGE-MAP.md` — formato de entrada

```markdown
## Negócio
- Pricing strategy | Negócio | Para Estudar | [[Q003-precificacao]]
- Customer segmentation | Negócio | Estudado | [[Q001-segmentos]]

## Arquitetura
- Event-driven patterns | Arquitetura | Para Estudar | [[Q004-eventos]]

## IA / Orquestração
- RAG pipelines | IA | Para Estudar | [[Q002-rag]]
```

### `identifyGaps()` — pure function (sem IO)

```js
export function identifyGaps(victories) {
  // Analisar scores por dimensão em todas as victories
  // Retornar dimensões com médias mais baixas como prioritárias
  const dimScores = {
    business: avg(victories.map(v => Number(v.business) || 0)),
    architecture: avg(victories.map(v => Number(v.architecture) || 0)),
    ai_orchestration: avg(victories.map(v => Number(v.ai_orchestration) || 0))
  }

  return Object.entries(dimScores)
    .sort((a, b) => a[1] - b[1])
    .slice(0, 3)
    .map(([dim, score]) => ({
      dimension: dim,
      averageScore: score,
      recommendation: STUDY_RECOMMENDATIONS[dim]
    }))
}
```

### Output de orientação — formato

```
🎓 Consolidação do Milestone 1 Completa!

📦 Arquivos arquivados em: vault/milestone-01/

📚 3 Gaps Críticos para Estudar:
1. IA / Orquestração (média: 4.2) — Estude: RAG pipelines, prompt engineering avançado
2. Negócio (média: 5.1) — Estude: métricas de produto, estratégias de pricing
3. Arquitetura (média: 6.0) — Estude: event-driven patterns, CQRS

🎯 Foco Recomendado para Milestone 2: IA / Orquestração
```

### Cuidados com `fs.rename()` cross-device

Em alguns sistemas, `rename()` falha se origem e destino são de partições diferentes.
Fallback: `copyFile()` + `unlink()` se `rename()` falhar com `EXDEV`.

```js
try {
  await rename(src, dest)
} catch (err) {
  if (err.code === 'EXDEV') {
    await copyFile(src, dest)
    await unlink(src)
  } else throw err
}
```

### Project Structure Notes

- Toda lógica de moving/reorganização em `milestone.js`
- `identifyGaps()` como pure function pode ficar em `src/utils/gaps.js` ou dentro de `milestone.js`
- `KNOWLEDGE-MAP.md` fica na RAIZ do vault — não em `quests/` ou `relics/`
- Wikilinks no KNOWLEDGE-MAP não mudam quando arquivos são movidos para `milestone-01/` — Obsidian resolve pelo nome do arquivo

### References

- FR31, FR32: [prd.md](../../planning-artifacts/IN001-cli/prd.md)
- Story anterior (milestone detection): [4-1-sistema-detecta-milestone-e-cria-summary-automaticamente.md](./4-1-sistema-detecta-milestone-e-cria-summary-automaticamente.md)
- Story completa: [epics.md](../../planning-artifacts/IN001-cli/epics.md#Story-4.2)

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

### Completion Notes List

- `identifyGaps(victories)`: pure function em `milestone.js`; retorna top-3 dimensões com menor score médio, ordenadas do menor ao maior; inclui recomendação de estudo por dimensão; retorna `[]` se victories vazio
- `reorganizeVault(vaultPath, milestoneId)`: usa `rename` + fallback `EXDEV` (copyFile+unlink); cria `milestone-{id}/quests/` e `milestone-{id}/relics/`; move apenas arquivos com `milestone: N` no frontmatter; tenta mover `M{id}-summary.md` graciosamente (try/catch)
- `updateKnowledgeMap(vaultPath, gaps)`: lê KNOWLEDGE-MAP.md via `readNote`; injeta entrada após o `## SectionHeader` correspondente; escreve via `updateNote` — nunca fs direto
- Integração em `victory.js` sequência: createMilestoneSummary → updateProgressForMilestone → identifyGaps → reorganizeVault → updateKnowledgeMap → printEpic (orientação)
- Testes adicionados em `milestone.test.js` com `vi.mock('fs/promises')` para isolar rename/mkdir; 16 novos testes (identifyGaps: 5, reorganizeVault: 6, updateKnowledgeMap: 5)
- Total acumulado: 68/68 testes passando

### File List

- src/services/milestone.js (modificado — 3 funções adicionadas)
- src/services/milestone.test.js (modificado — 16 testes adicionados)
- src/commands/victory.js (modificado — integração consolidação)
