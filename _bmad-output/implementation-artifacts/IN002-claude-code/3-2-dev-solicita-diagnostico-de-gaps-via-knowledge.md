# Story 3.2: Dev solicita diagnóstico de gaps via Knowledge

Status: ready-for-dev

## Story

Como developer (Ricardo),
quero usar /codemaster:knowledge para obter um diagnóstico do que estou deixando de aprender,
para que eu saiba exatamente o que estudar para atingir o próximo nível profissional.

## Acceptance Criteria

1. **Dado** que vault tem ao menos 3 victories
   **Quando** dev usa `/codemaster:knowledge`
   **Então** agente informa dev que a análise está em andamento
   **E** agente lê todas as notas de quest com `type: victory`, relics e KNOWLEDGE-MAP.md atual
   **E** extrai padrões e gaps por dimensão com base nos scores

2. **Quando** análise conclui
   **Então** KNOWLEDGE-MAP.md é criado ou atualizado com: gaps listados por dimensão, status (Para Estudar / Estudado / Praticado), score médio e [[wikilinks]] para quests de origem
   **E** agente apresenta os 3 gaps prioritários com justificativa baseada nos dados

3. **Dado** que vault tem menos de 3 victories
   **Quando** dev usa `/codemaster:knowledge`
   **Então** agente explica que mais victories são necessárias e exibe estado parcial disponível

## Tasks / Subtasks

- [ ] Criar `src/moments/knowledge.js` com `generateKnowledge(vaultPath)` (AC: 1, 2, 3)
  - [ ] Coletar todas as victories: `listNotes(vaultPath, 'quests')` + filtrar `type: victory`
  - [ ] Se < 3 victories: retornar `{ insufficient: true, count: n, victories: [] }`
  - [ ] Calcular score médio por dimensão em todas as victories
  - [ ] Identificar top 3 gaps (dimensões com menor score médio)
  - [ ] Ler KNOWLEDGE-MAP.md atual via `readNote(vaultPath, '', 'KNOWLEDGE-MAP.md')` (gracioso se não existir)
  - [ ] Gerar/atualizar KNOWLEDGE-MAP.md com nova análise via `updateNote`
  - [ ] Retornar `{ insufficient: false, gaps: [...], knowledgeMapPath: 'KNOWLEDGE-MAP.md' }`
- [ ] Criar `src/moments/knowledge.test.js`
- [ ] Criar `templates/claude-commands/knowledge.md` — slash command completo (AC: 1, 2, 3)

## Dev Notes

### KNOWLEDGE-MAP.md — schema fixo (architecture.md)

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

### `generateKnowledge()` — implementação de referência

```js
import { listNotes, readNote, updateNote } from '../services/vault.js'
import { parseFrontmatter } from '../utils/frontmatter.js'

export async function generateKnowledge(vaultPath) {
  const questFiles = await listNotes(vaultPath, 'quests')
  const victories = []

  for (const file of questFiles) {
    const content = await readNote(vaultPath, 'quests', file)
    const fm = parseFrontmatter(content)
    if (fm.type === 'victory') {
      victories.push({ ...fm, fileName: file })
    }
  }

  if (victories.length < 3) {
    return { insufficient: true, count: victories.length, victories }
  }

  // Calcular médias por dimensão
  const dims = ['business', 'architecture', 'ai_orchestration']
  const dimScores = {}
  for (const d of dims) {
    const scores = victories.map(v => Number(v[d]) || 0)
    dimScores[d] = scores.reduce((a, b) => a + b, 0) / scores.length
  }

  // Top 3 gaps (menor score = maior gap)
  const gaps = Object.entries(dimScores)
    .sort((a, b) => a[1] - b[1])
    .slice(0, 3)
    .map(([dim, score]) => ({
      dimension: dim,
      averageScore: score.toFixed(1),
      sources: victories
        .filter(v => Number(v[dim]) < 5.0)
        .map(v => `[[${v.fileName.replace('.md','')}]]`)
        .slice(0, 3)
    }))

  // Gerar KNOWLEDGE-MAP.md
  const dimNames = { business: 'Negócio', architecture: 'Arquitetura', ai_orchestration: 'IA' }
  const sections = dims.map(d => {
    const gap = gaps.find(g => g.dimension === d)
    const entry = gap
      ? `- [ ] Gap em ${dimNames[d]} | Score médio: ${gap.averageScore} | Fonte: ${gap.sources.join(', ')}`
      : `- [ ] Nenhum gap crítico identificado`
    return `### ${dimNames[d]}\n${entry}`
  }).join('\n\n')

  const top2 = gaps.slice(0, 2)
  const km = `# KNOWLEDGE-MAP\n\n## Lacunas por Dimensão\n\n${sections}\n\n## Próximo Milestone — Foco recomendado\n- Prioridade 1: ${dimNames[top2[0]?.dimension] ?? '-'} (${top2[0]?.averageScore ?? 'N/A'})\n- Prioridade 2: ${dimNames[top2[1]?.dimension] ?? '-'} (${top2[1]?.averageScore ?? 'N/A'})\n`

  await updateNote(vaultPath, '', 'KNOWLEDGE-MAP.md', km)

  return { insufficient: false, gaps, knowledgeMapPath: 'KNOWLEDGE-MAP.md' }
}
```

### NFR4 — aviso de processamento

Para vaults grandes, o agente deve informar ANTES de processar:
```
Analisando seu vault... (isso pode levar alguns segundos para vaults com muitas notas)
```

### `templates/claude-commands/knowledge.md`

```markdown
Gerar diagnóstico de gaps e mapa de conhecimento do vault.

## Fluxo obrigatório

**Passo 1 — Aviso de processamento:**
Informe ao dev: "Analisando seu vault... (pode levar alguns segundos)"

**Passo 2 — Coletar victories:**
Liste todas as notas em `vault/quests/` com `type: victory` no frontmatter.

**Passo 3 — Verificar quantidade mínima:**
Se menos de 3 victories:
"Você tem {n} victory(ies) até agora. Para uma análise significativa, recomendo pelo menos 3.
Estado atual: {listar victories existentes com scores}
Continue sua jornada! Próxima quest: `/codemaster:quest \"sua próxima missão\"`"
PARE aqui se < 3 victories.

**Passo 4 — Análise holística:**
Analise as victories coletadas. Para cada dimensão, calcule:
- Score médio
- Quais quests contribuíram para scores baixos
- Padrões recorrentes nas reflexões

**Passo 5 — Atualizar KNOWLEDGE-MAP.md:**
Crie ou atualize `vault/KNOWLEDGE-MAP.md` com o schema padrão:
- Gaps por dimensão com scores médios e fontes [[wikilinks]]
- Seção de foco recomendado para o próximo milestone

**Passo 6 — Apresentar top 3 gaps:**
"📚 Diagnóstico de Gaps — {n} victories analisadas

🎯 Top 3 Prioridades para o Próximo Nível:
1. **{dimensão}** (score médio: {x.x}) — {recomendação concreta de estudo}
2. **{dimensão}** (score médio: {x.x}) — {recomendação concreta de estudo}
3. **{dimensão}** (score médio: {x.x}) — {recomendação concreta de estudo}

KNOWLEDGE-MAP.md atualizado em: `vault/KNOWLEDGE-MAP.md`"
```

### Testes prioritários

```js
describe('generateKnowledge', () => {
  it('should return insufficient:true when fewer than 3 victories', ...)
  it('should calculate correct dimension averages', ...)
  it('should return top 3 gaps sorted by lowest score', ...)
  it('should write KNOWLEDGE-MAP.md with correct format', ...)
  it('should include wikilink sources for low-scoring quests', ...)
})
```

### References

- FR36, FR37, FR38, FR39: prd.md
- NFR4: prd.md (aviso de processamento)
- KNOWLEDGE-MAP schema: architecture.md
- Depende de: 2.3 (victory notes com scores), 3.1 (vault data patterns)

## Dev Agent Record

### Agent Model Used

_a preencher_

### Debug Log References

### Completion Notes List

### File List
