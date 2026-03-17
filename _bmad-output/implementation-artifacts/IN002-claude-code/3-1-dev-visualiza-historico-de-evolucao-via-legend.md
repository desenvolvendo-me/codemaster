# Story 3.1: Dev visualiza histórico de evolução via Legend

Status: ready-for-dev

## Story

Como developer (Ricardo),
quero usar /codemaster:legend para ver meu histórico completo de evolução,
para que eu reconheça meu crescimento nas 3 dimensões e saiba onde focar a seguir.

## Acceptance Criteria

1. **Dado** que PROGRESS.md e vault existem com ao menos uma victory
   **Quando** dev usa `/codemaster:legend`
   **Então** agente lê PROGRESS.md e notas das quests
   **E** exibe tendências atuais por dimensão com indicadores ↑→↓
   **E** exibe victories agrupadas por milestone com [[wikilinks]]
   **E** destaca os scores da última victory
   **E** exibe a relic de maior score do milestone atual
   **E** sugere a dimensão de menor tendência como foco para o próximo milestone

2. **Dado** que nenhuma victory existe ainda
   **Quando** dev usa `/codemaster:legend`
   **Então** agente exibe mensagem encorajadora e orienta dev a iniciar a primeira quest

## Tasks / Subtasks

- [ ] Criar `src/moments/legend.js` com `getLegend(vaultPath)` (AC: 1, 2)
  - [ ] Ler PROGRESS.md via `readNote(vaultPath, '', 'PROGRESS.md')`
  - [ ] Listar notas em `quests/` via `listNotes(vaultPath, 'quests')`
  - [ ] Para cada nota de quest com `type: victory`: coletar id, scores, date, fileName
  - [ ] Agrupar victories por milestone
  - [ ] Calcular médias de tendência por dimensão do milestone atual
  - [ ] Identificar última victory (maior date)
  - [ ] Identificar relic de maior score do período via `listNotes(vaultPath, 'relics')`
  - [ ] Retornar objeto estruturado `{ milestones, currentDimensions, lastVictory, bestRelic, suggestedFocus }`
- [ ] Criar `src/moments/legend.test.js`
- [ ] Criar `templates/claude-commands/legend.md` — slash command completo (AC: 1, 2)

## Dev Notes

### `getLegend()` — estrutura de retorno

```js
{
  milestones: [
    {
      id: 1,
      victories: [
        { id: 'Q001', title: '...', fileName: 'Q001-slug.md', scores: { business: 8.0, architecture: 7.5, ai_orchestration: 5.0 }, date: '2026-03-17' }
      ],
      averages: { business: 8.0, architecture: 7.5, ai_orchestration: 5.0 }
    }
  ],
  currentDimensions: { business: '↑', architecture: '↑', ai_orchestration: '→' },
  lastVictory: { id: 'Q001', scores: {...}, date: '2026-03-17' },
  bestRelic: { id: 'R001', title: '...', dimension: 'architecture' } | null,
  suggestedFocus: 'ai_orchestration' // dimensão com menor avg
}
```

### `templates/claude-commands/legend.md`

```markdown
Visualizar histórico completo de evolução do dev no CodeMaster.

## Fluxo obrigatório

**Passo 1 — Carregar dados:**
Leia o arquivo PROGRESS.md do vault.
Liste todas as notas em `vault/quests/` que tenham `type: victory` no frontmatter.

**Passo 2 — Verificar se há victories:**
Se não houver nenhuma nota com `type: victory`:
"Sua lenda ainda está sendo escrita! 📖 Você ainda não completou nenhuma quest.
Comece com `/codemaster:quest \"sua próxima missão\"` e escreva o primeiro capítulo."
PARE aqui.

**Passo 3 — Formatar e exibir:**
Organize as victories por milestone. Para cada milestone:
```
## Milestone {n} — {x}/5 victories
- [[Q{id}-{slug}]] — {date} | N:{trend}{score} A:{trend}{score} IA:{trend}{score}
```

Calcule médias do milestone atual e exiba:
```
📊 Dimensões Atuais (Milestone {n}):
- Negócio:      {trend} média {score}
- Arquitetura:  {trend} média {score}
- IA:           {trend} média {score}
```

Destaque a última victory:
```
🏆 Última Victory: [[Q{id}]] em {date}
N:{trend}{score} | A:{trend}{score} | IA:{trend}{score}
```

Se houver relics, leia as de `vault/relics/` e exiba a de maior dimensão:
```
💎 Relic Destaque: [[R{id}]] — {dimensão}
```

Finalize com o foco recomendado:
```
🎯 Foco recomendado: {dimensão com menor score} para o próximo milestone
```
```

### Testes prioritários

```js
describe('getLegend', () => {
  it('should return empty milestones when no victories exist', ...)
  it('should group victories by milestone', ...)
  it('should calculate dimension averages per milestone', ...)
  it('should identify last victory by date', ...)
  it('should suggest focus as lowest scoring dimension', ...)
})
```

### References

- FR33, FR34, FR35: prd.md
- Depende de: 2.3 (victory notes format, PROGRESS.md format)

## Dev Agent Record

### Agent Model Used

_a preencher_

### Debug Log References

### Completion Notes List

### File List
