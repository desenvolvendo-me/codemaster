# Story 2.3: Dev encerra Quest com Victory e reflexão avaliada

Status: ready-for-dev

## Story

Como developer (Ricardo),
quero usar /codemaster:victory para encerrar uma quest com reflexão estruturada,
para que meu aprendizado seja avaliado nas 3 dimensões e persistido no histórico de evolução.

## Acceptance Criteria

1. **Dado** que uma Quest está ativa
   **Quando** dev usa `/codemaster:victory`
   **Então** agente lê active-quest.json e commits recentes via `git log --oneline HEAD~20` (skip gracioso se não for repo git)
   **E** agente apresenta 5 perguntas contextuais cobrindo: impacto de negócio, decisão arquitetural, orquestração de IA, novo aprendizado e reflexão crítica
   **E** quando dev responde sem conectar à decisão de negócio ou arquitetura, agente pede um nível a mais de profundidade

2. **Quando** todas as respostas são dadas
   **Então** agente analisa as 5 respostas holisticamente e atribui score 0.0–10.0 para cada dimensão
   **E** tendência é calculada: ↑ se ≥7.0, → se 4.0–6.9, ↓ se <4.0
   **E** seção `## Victory` é appendada na nota da quest com respostas, scores e timestamp
   **E** nota da quest salva em vault/quests/ tem frontmatter atualizado: `type: "victory"`, scores por dimensão, milestone
   **E** PROGRESS.md é atualizado com `[[Q{id}-{slug}]]` wikilink e scores (N:↑8.0 A:→5.5 IA:→6.0)
   **E** `active-quest.json` é deletado após Victory concluída

3. **Dado** que nenhuma Quest está ativa
   **Quando** dev usa `/codemaster:victory`
   **Então** agente notifica que não há quest ativa e orienta a iniciar uma

## Tasks / Subtasks

- [ ] Criar `src/moments/victory.js` com `closeVictory(questFileName, scores, reflections, vaultPath)` (AC: 1, 2)
  - [ ] Calcular tendência por dimensão: ↑/→/↓ baseado nos scores (0.0–10.0)
  - [ ] Append seção `## Victory` na nota da quest com respostas, scores e timestamp ISO
  - [ ] Atualizar frontmatter da nota: `type: "victory"`, scores `business/architecture/ai_orchestration`, `date`
  - [ ] Atualizar PROGRESS.md via `readNote`/`updateNote` de vault.js
    - [ ] Adicionar linha `- [[Q{id}-{slug}]] | N:{trend}{score} A:{trend}{score} IA:{trend}{score}`
    - [ ] Atualizar seção `Milestone {n} — {x}/5 victories` (incrementar contador)
  - [ ] Deletar active-quest.json via `clearActiveQuest()` de state.js
  - [ ] Retornar `{ scores, trends, updated: true }`
- [ ] Criar `src/moments/victory.test.js`
- [ ] Criar `templates/claude-commands/victory.md` — slash command completo (AC: 1, 2, 3)

## Dev Notes

### `closeVictory()` — implementação de referência

```js
import { readNote, updateNote } from '../services/vault.js'
import { parseFrontmatter, generateFrontmatter } from '../utils/frontmatter.js'
import { clearActiveQuest } from '../services/state.js'

function calcTrend(score) {
  if (score >= 7.0) return '↑'
  if (score >= 4.0) return '→'
  return '↓'
}

function replaceFrontmatter(content, newFields) {
  const match = content.match(/^---\n[\s\S]+?\n---\n/)
  const newFm = generateFrontmatter(newFields)
  if (!match) return newFm + content
  return newFm + content.slice(match[0].length)
}

export async function closeVictory(questFileName, scores, reflections, vaultPath) {
  const { business, architecture, ai_orchestration } = scores
  const trends = {
    business: calcTrend(business),
    architecture: calcTrend(architecture),
    ai_orchestration: calcTrend(ai_orchestration)
  }

  // Ler nota da quest
  const questContent = await readNote(vaultPath, 'quests', questFileName)
  const fm = parseFrontmatter(questContent)
  const date = new Date().toISOString().split('T')[0]

  // Seção Victory para append
  const victorySection = `
## Victory — ${new Date().toISOString()}

### Respostas de Reflexão
${Object.entries(reflections).map(([k, v]) => `**${k}:** ${v}`).join('\n')}

### Análise por Dimensão
- Negócio: ${trends.business} ${business.toFixed(1)}
- Arquitetura: ${trends.architecture} ${architecture.toFixed(1)}
- IA / Orquestração: ${trends.ai_orchestration} ${ai_orchestration.toFixed(1)}
`

  // Atualizar frontmatter: type→victory, scores
  const updatedFm = {
    ...fm,
    type: 'victory',
    date,
    business: business.toFixed(1),
    architecture: architecture.toFixed(1),
    ai_orchestration: ai_orchestration.toFixed(1)
  }
  const newContent = replaceFrontmatter(questContent, updatedFm) + victorySection
  await updateNote(vaultPath, 'quests', questFileName, newContent)

  // Atualizar PROGRESS.md
  const slug = questFileName.replace('.md', '')
  const questRef = slug.startsWith('Q') ? slug : fm.id + '-' + fm.title?.toLowerCase().replace(/\s+/g, '-')
  const progressLine = `- [[${slug}]] | N:${trends.business}${business.toFixed(1)} A:${trends.architecture}${architecture.toFixed(1)} IA:${trends.ai_orchestration}${ai_orchestration.toFixed(1)}`

  let progress = await readNote(vaultPath, '', 'PROGRESS.md')
  // Incrementar contador do milestone atual
  progress = progress.replace(
    /## Milestone (\d+) — (\d+)\/5 victories/,
    (_, mId, count) => `## Milestone ${mId} — ${Number(count) + 1}/5 victories`
  )
  // Adicionar linha após o header do milestone
  progress = progress.replace(
    /(## Milestone \d+ — \d+\/5 victories\n)/,
    `$1${progressLine}\n`
  )
  await updateNote(vaultPath, '', 'PROGRESS.md', progress)

  // Limpar quest ativa
  await clearActiveQuest()

  return { scores, trends }
}
```

### Scoring — lógica do agente (dentro do slash command)

O AGENTE (Claude) faz o scoring holístico após as 5 respostas. Instrução no template:

```
Analise o conjunto das 5 respostas. Para cada dimensão, atribua uma nota de 0.0 a 10.0:
- **Negócio:** profundidade na conexão com impacto de negócio, valor e usuário
- **Arquitetura:** qualidade das decisões técnicas, raciocínio e justificativa
- **IA/Orquestração:** uso estratégico da IA, o que orquestra vs. delega

Regra anti-inflação: se o dev não mencionou a dimensão, score máximo = 4.0.
Tendência: ↑ se ≥7.0 | → se 4.0–6.9 | ↓ se <4.0
```

### `templates/claude-commands/victory.md`

```markdown
Encerrar quest ativa com reflexão estruturada e avaliação por dimensões.

## Fluxo obrigatório

**Passo 1 — Verificar quest ativa:**
Leia `~/.codemaster/active-quest.json`. Se não existir: "Não há quest ativa. Inicie uma com `/codemaster:quest`."

**Passo 2 — Contexto:**
Leia a nota da quest ativa no vault.
Execute (silenciosamente): `git log --oneline HEAD~20 2>/dev/null` para obter commits recentes.
Use estes dados para personalizar as 5 perguntas.

**Passo 3 — 5 Perguntas de reflexão (UMA por vez, aguardando resposta):**
1. "Qual foi o impacto de negócio desta implementação? Como ela muda a experiência ou entrega valor?"
2. "Qual foi a decisão arquitetural mais importante que você tomou? Por quê essa escolha?"
3. "Como você usou IA nesta quest? O que orquestrou vs. o que delegou ao agente?"
4. "O que você aprendeu que não sabia antes de começar?"
5. "O que faria diferente se recomeçasse do zero?"

Se o dev responder com menos de 2 frases ou de forma muito genérica:
"Consegue aprofundar? Me conta um exemplo concreto de [ponto da resposta]"

**Passo 4 — Scoring holístico:**
Analise as 5 respostas juntas. Atribua score 0.0–10.0 para cada dimensão:
- Negócio: conexão com impacto real, usuário, valor
- Arquitetura: qualidade do raciocínio técnico e decisões
- IA/Orquestração: uso estratégico da IA

Regra anti-inflação: dimensão não mencionada → score máximo 4.0.
Tendência: ↑ se ≥7.0 | → se 4.0–6.9 | ↓ se <4.0

**Passo 5 — Registrar victory:**
Atualize a nota da quest com a seção Victory, mude o type para "victory", atualize PROGRESS.md e delete active-quest.json.

Exiba o resumo épico ao dev:
"🏆 **VITÓRIA!** Quest [título] encerrada.
Negócio: [trend][score] | Arquitetura: [trend][score] | IA: [trend][score]
[Comentário encorajador baseado na dimensão mais alta]"
```

### Testes prioritários

```js
describe('closeVictory', () => {
  it('should append Victory section to quest note', ...)
  it('should update quest frontmatter type to victory', ...)
  it('should update PROGRESS.md with wikilink and scores', ...)
  it('should increment milestone victory counter', ...)
  it('should delete active-quest.json', ...)
  it('should return correct trends for each score range', ...)
})
describe('calcTrend', () => {
  it('should return ↑ for score >= 7.0', ...)
  it('should return → for score 4.0-6.9', ...)
  it('should return ↓ for score < 4.0', ...)
})
```

### Relação com src/commands/victory.js existente

O `src/commands/victory.js` existente usa inquirer, fs-extra e esquema antigo.
`src/moments/victory.js` é uma NOVA implementação paralela — apenas para o fluxo do slash command Claude Code.
NÃO deletar o victory.js existente (backward compat para CLI direto).
A integração com milestone detection (story 4.1) já existe no victory.js antigo.

### References

- FR19–FR23: prd.md
- Scoring algorithm: architecture.md
- PROGRESS.md update format: architecture.md
- Depende de: 2.1 (state.js), 2.2 (vault note format), 4.1 (milestone detection já implementado)

## Dev Agent Record

### Agent Model Used

_a preencher_

### Debug Log References

### Completion Notes List

### File List
