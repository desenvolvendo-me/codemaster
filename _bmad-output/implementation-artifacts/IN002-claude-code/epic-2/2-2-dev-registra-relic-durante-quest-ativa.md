# Story 2.2: Dev registra Relic durante Quest ativa

Status: ready-for-dev

## Story

Como developer (Ricardo),
quero usar /codemaster:relic para capturar descobertas importantes durante uma quest,
para que insights arquiteturais, negociais e de orquestração de IA sejam preservados e organizados.

## Acceptance Criteria

1. **Dado** que uma Quest está ativa (active-quest.json existe)
   **Quando** dev usa `/codemaster:relic "descoberta sobre stateless sessions"`
   **Então** agente lê active-quest.json para contextualizar
   **E** agente pede ao dev que classifique a descoberta: arquitetural, negocial ou orquestração de IA
   **E** Relic é appendada na nota da quest ativa com timestamp e dimensão identificada
   **E** frontmatter da nota da quest tem o array `relics[]` atualizado com o ID da relic

2. **Quando** dev indica que a descoberta é relevante além da quest atual
   **Então** Relic também é arquivada como `R{id}-{slug}.md` em `vault/relics/`

3. **Dado** que nenhuma Quest está ativa
   **Quando** dev usa `/codemaster:relic`
   **Então** agente notifica que não há quest ativa e sugere iniciar uma com /codemaster:quest

## Tasks / Subtasks

- [ ] Criar `src/moments/relic.js` com `addRelic(discovery, dimension, vaultPath, questId, archiveToRelics)` (AC: 1, 2)
  - [ ] Gerar ID da relic: `R{padded-3-digit}` — contar relics em vault/relics/ + 1
  - [ ] Gerar slug da discovery via `slugify(discovery)`
  - [ ] Timestamp formatado: `HH:MM` (hora local)
  - [ ] Append na nota da quest ativa: `\n## Relic — {timestamp}\n**Dimensão:** {dimension}\n**Descoberta:** {discovery}\n`
  - [ ] Atualizar frontmatter da nota da quest: adicionar `R{id}` no array `relics[]`
  - [ ] Se `archiveToRelics === true`: criar `R{id}-{slug}.md` em `vault/relics/` com frontmatter completo
- [ ] Criar `src/moments/relic.test.js`
- [ ] Criar `templates/claude-commands/relic.md` — slash command completo (AC: 1, 2, 3)

## Dev Notes

### Frontmatter update da nota da quest

Para atualizar o array `relics[]` no frontmatter da nota existente:
1. Ler nota da quest via `readNote(vaultPath, 'quests', fileName)`
2. Parsear frontmatter via `parseFrontmatter(content)`
3. Adicionar `R{id}` no array `relics`
4. Regenerar frontmatter via `generateFrontmatter(updatedFields)`
5. Substituir o bloco frontmatter no conteúdo original
6. Reescrever via `updateNote()`

```js
// Substituição do bloco frontmatter no conteúdo
function replaceFrontmatter(content, newFields) {
  const match = content.match(/^---\n[\s\S]+?\n---\n/)
  if (!match) return generateFrontmatter(newFields) + content
  return generateFrontmatter(newFields) + content.slice(match[0].length)
}
```

### `addRelic()` — implementação de referência

```js
import { listNotes, readNote, updateNote, createNote } from '../services/vault.js'
import { parseFrontmatter, generateFrontmatter } from '../utils/frontmatter.js'
import { slugify } from '../utils/slugify.js'

export async function addRelic(discovery, dimension, vaultPath, questFileName, archiveToRelics = false) {
  // Gerar ID
  const existing = await listNotes(vaultPath, 'relics')
  const relicId = `R${String(existing.length + 1).padStart(3, '0')}`
  const slug = slugify(discovery)

  // Timestamp local HH:MM
  const now = new Date()
  const timestamp = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`

  // Append na nota da quest
  const questContent = await readNote(vaultPath, 'quests', questFileName)
  const fm = parseFrontmatter(questContent)
  const relics = Array.isArray(fm.relics) ? fm.relics : []
  relics.push(relicId)

  const relicEntry = `\n## Relic ${relicId} — ${timestamp}\n**Dimensão:** ${dimension}\n**Descoberta:** ${discovery}\n`
  const updatedFm = { ...fm, relics }
  const newContent = replaceFrontmatter(questContent, updatedFm) + relicEntry

  await updateNote(vaultPath, 'quests', questFileName, newContent)

  // Arquivar em relics/ se solicitado
  if (archiveToRelics) {
    const date = new Date().toISOString().split('T')[0]
    const relicFm = generateFrontmatter({
      id: relicId, type: 'relic', title: discovery,
      date, dimension, tags: ['codemaster', 'relic']
    })
    await createNote(vaultPath, 'relics', relicId, slug, relicFm + `\n# ${discovery}\n`)
  }

  return { relicId, archived: archiveToRelics }
}
```

**ATENCAO:** `parseFrontmatter()` atual retorna STRINGS para todos os valores, incluindo arrays.
Para `relics: []` gerado por `generateFrontmatter`, o valor armazenado é `"[]"` (string).
Ao parsear de volta, `fm.relics` será `"[]"` — use `JSON.parse()` para converter:

```js
let relics = []
try { relics = JSON.parse(fm.relics ?? '[]') } catch { relics = [] }
```

### `templates/claude-commands/relic.md`

```markdown
Registrar descoberta ou decisão importante durante quest ativa.

Descoberta: **$ARGUMENTS**

## Fluxo obrigatório

**Passo 1 — Verificar quest ativa:**
Verifique se `~/.codemaster/active-quest.json` existe.
Se NAO existir: "Não há quest ativa no momento. Inicie uma com `/codemaster:quest \"nome\"` antes de registrar relics."
PARE aqui se não houver quest ativa.

**Passo 2 — Classificar dimensão:**
Pergunte ao dev: "Em qual dimensão se encaixa melhor esta descoberta?
1. Arquitetural — decisão técnica, padrão, estrutura
2. Negocial — impacto de negócio, valor, prioridade
3. Orquestração de IA — uso de agentes, prompts, automação"

**Passo 3 — Arquivar além da quest?**
Se a descoberta parecer reutilizável em outros contextos, pergunte:
"Esta descoberta é relevante além desta quest? Devo arquivá-la também em `vault/relics/`? (s/n)"

**Passo 4 — Registrar:**
Registre a relic na nota da quest ativa e, se confirmado, arquive em relics/.
Confirme ao dev com o ID gerado: "Relic **R{id}** registrada!"
```

### Testes prioritários

```js
describe('addRelic', () => {
  it('should append relic section to quest note', ...)
  it('should update relics array in quest frontmatter', ...)
  it('should archive to relics/ when archiveToRelics is true', ...)
  it('should NOT archive to relics/ when archiveToRelics is false', ...)
  it('should generate correct relic ID based on existing count', ...)
})
```

### References

- FR14, FR15, FR16: prd.md
- Depende de: 2-1 (state.js, quest note format, vault.js)
- Continuada em: 2-3-dev-encerra-quest-com-victory-e-reflexao-avaliada.md

## Dev Agent Record

### Agent Model Used

_a preencher_

### Debug Log References

### Completion Notes List

### File List
