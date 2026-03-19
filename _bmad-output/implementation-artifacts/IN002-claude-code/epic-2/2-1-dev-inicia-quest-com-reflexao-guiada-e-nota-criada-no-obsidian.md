# Story 2.1: Dev inicia Quest com reflexão guiada e nota criada no Obsidian

Status: ready-for-dev

## Story

Como developer (Ricardo),
quero usar /codemaster:quest para iniciar uma missão com perguntas de reflexão,
para que eu pense conscientemente nas dimensões de negócio, arquitetura e IA antes de codar.

## Acceptance Criteria

1. **Dado** que dev está no Claude Code com slash commands instalados
   **Quando** dev usa `/codemaster:quest "Implementar autenticação JWT"`
   **Então** agente faz a pergunta âncora: "Descreva o problema ou tarefa em uma frase — o que você vai resolver?"
   **E** agente usa a âncora para gerar 3 perguntas contextuais (uma por dimensão: Negócio, Arquitetura, IA)
   **E** quando dev responde de forma genérica ou muito curta, agente pede um nível a mais de detalhe

2. **Quando** todas as perguntas são respondidas
   **Então** nota `Q{id}-{slug}.md` é criada em `vault/quests/` com frontmatter YAML
   **E** `active-quest.json` é escrito em `~/.codemaster/` com `{id, title, slug, notePath, startedAt, milestone}`

3. **Dado** que `active-quest.json` já existe
   **Quando** dev tenta iniciar outra Quest
   **Então** agente notifica que há uma Quest ativa e pergunta se dev quer abandoná-la ou continuar a atual

## Tasks / Subtasks

- [ ] Criar `src/services/state.js` — gerencia `~/.codemaster/active-quest.json` (AC: 1, 2, 3)
  - [ ] `readActiveQuest()` — lê active-quest.json, retorna `null` se não existir
  - [ ] `writeActiveQuest(data)` — escreve active-quest.json
  - [ ] `clearActiveQuest()` — deleta active-quest.json
- [ ] Criar `src/utils/slugify.js` — `slugify(str)` — pure function
  - [ ] Normaliza NFD, remove acentos, lowercase, substitui espaços/especiais por `-`, max 50 chars
- [ ] Criar `src/moments/quest.js` com `createQuest(title, vaultPath, milestone)` (AC: 1, 2)
  - [ ] Gerar next ID: contar notas em `quests/` via `listNotes()` + 1, padded `Q{003}`
  - [ ] Gerar slug via `slugify(title)`
  - [ ] Gerar frontmatter com `generateFrontmatter({ id, type: 'quest', title, date, milestone, tags, relics: [] })`
  - [ ] Criar nota via `createNote(vaultPath, 'quests', id, slug, content)` de `vault.js`
  - [ ] Escrever `active-quest.json` via `writeActiveQuest({ id, title, slug, notePath, startedAt, milestone })`
  - [ ] Retornar `{ id, notePath }`
- [ ] Criar `src/moments/quest.test.js`
- [ ] Criar `templates/claude-commands/quest.md` — slash command completo para o agente (AC: 1, 2, 3)
  - [ ] Pergunta âncora → 3 perguntas contextuais → criação da nota
  - [ ] Lógica de quest ativa (verificar active-quest.json antes de iniciar)

## Dev Notes

### Arquitetura de dois layers

1. **`templates/claude-commands/quest.md`** — instruções do AGENTE (Claude Code)
   - É o que o agente lê e executa como sistema de instrução
   - Inclui toda a lógica de interação (perguntas, contexto, como criar nota)
   - Pode referenciar bash commands para operações determinísticas

2. **`src/moments/quest.js`** — lógica de suporte testável (Node.js)
   - Gera IDs, cria nota no vault, escreve active-quest.json
   - Pode ser invocado via bash block no template ou via CLI

### `src/services/state.js` — implementação de referência

```js
import { readFile, writeFile, unlink } from 'fs/promises'
import { join } from 'path'
import { homedir } from 'os'

const STATE_FILE = join(homedir(), '.codemaster', 'active-quest.json')

export async function readActiveQuest() {
  try {
    return JSON.parse(await readFile(STATE_FILE, 'utf8'))
  } catch {
    return null
  }
}

export async function writeActiveQuest(data) {
  await writeFile(STATE_FILE, JSON.stringify(data, null, 2), 'utf8')
}

export async function clearActiveQuest() {
  try { await unlink(STATE_FILE) } catch {}
}
```

### `src/utils/slugify.js` — implementação

```js
export function slugify(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 50)
}
```

### `src/moments/quest.js` — implementação de referência

```js
import { listNotes, createNote } from '../services/vault.js'
import { generateFrontmatter } from '../utils/frontmatter.js'
import { writeActiveQuest } from '../services/state.js'
import { slugify } from '../utils/slugify.js'

export async function createQuest(title, vaultPath, milestone = 1) {
  // Gerar ID sequencial
  const existing = await listNotes(vaultPath, 'quests')
  const nextNum = existing.length + 1
  const id = `Q${String(nextNum).padStart(3, '0')}`
  const slug = slugify(title)

  const date = new Date().toISOString().split('T')[0]
  const frontmatter = generateFrontmatter({
    id,
    type: 'quest',
    title,
    date,
    milestone,
    tags: ['codemaster', 'quest'],
    relics: []
  })

  const content = `${frontmatter}
# ${title}

## Reflexão Inicial

## Notas de Desenvolvimento
`

  await createNote(vaultPath, 'quests', id, slug, content)
  const notePath = `quests/${id}-${slug}.md`

  await writeActiveQuest({
    id,
    title,
    slug,
    notePath,
    startedAt: new Date().toISOString(),
    milestone
  })

  return { id, notePath }
}
```

### `templates/claude-commands/quest.md` — conteúdo do slash command

```markdown
Iniciar nova missão de desenvolvimento no CodeMaster.

Tarefa recebida: **$ARGUMENTS**

## Fluxo obrigatório

**Passo 1 — Pergunta Âncora:**
Pergunte ao dev: "Descreva o problema ou tarefa em uma frase — o que você vai resolver?"
Aguarde a resposta antes de continuar.

**Passo 2 — 3 Perguntas Contextuais:**
Use a âncora para gerar variações contextuais das 3 perguntas por dimensão.
Faça UMA pergunta por vez, aguardando a resposta antes de continuar.

- **Negócio:** Como [tarefa específica] impactará [usuário/negócio]? Qual o valor esperado?
- **Arquitetura:** Quais decisões técnicas [tarefa específica] exige? O que você antecipa?
- **IA/Orquestração:** Como você usará IA em [tarefa específica]? O que você orquestra vs. delega?

Quando o dev responder de forma genérica ou muito curta (menos de 2 frases), peça mais detalhe:
"Consegue ser mais específico? O que na [contexto da resposta] você precisará resolver?"

**Passo 3 — Criar nota no vault:**
Após as 4 respostas (âncora + 3 dimensões), informe ao dev que você vai criar a nota da quest.
Use o comando bash abaixo para criar a nota e o estado ativo:

```bash
node -e "
const { createQuest } = await import('$(npm root -g)/@marcodotcastro/codemaster/src/moments/quest.js');
const result = await createQuest('$ARGUMENTS', process.env.CODEMASTER_VAULT || '$(cat ~/.codemaster/config.json | node -e \"process.stdin.resume();let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>console.log(JSON.parse(d).obsidian?.vault_path||JSON.parse(d).vault||''))\")', 1);
console.log(JSON.stringify(result));
" 2>/dev/null
```

Se bash não funcionar, oriente o dev a rodar: `codemaster quest "$ARGUMENTS"`

Confirme ao dev: "Quest **[id]** criada em `[notePath]`. Bora codar!"

**Verificação prévia — Quest ativa:**
Antes de fazer qualquer pergunta, verifique se existe `~/.codemaster/active-quest.json`.
Se existir, leia o conteúdo e pergunte: "Você já tem uma quest ativa: **[título]**. Quer abandoná-la e iniciar uma nova, ou continuar a atual?"
```

### Schema frontmatter da nota

```yaml
---
id: "Q001"
type: "quest"
title: "Implementar autenticação JWT"
date: "2026-03-17"
milestone: 1
tags: ["codemaster","quest"]
relics: []
---
```

### Schema active-quest.json

```json
{
  "id": "Q001",
  "title": "Implementar autenticação JWT",
  "slug": "implementar-autenticacao-jwt",
  "notePath": "quests/Q001-implementar-autenticacao-jwt.md",
  "startedAt": "2026-03-17T10:00:00.000Z",
  "milestone": 1
}
```

### Testes prioritários

```js
describe('createQuest', () => {
  it('should generate next sequential ID', ...)
  it('should create note with correct frontmatter', ...)
  it('should write active-quest.json', ...)
  it('should return { id, notePath }', ...)
})
describe('state', () => {
  it('readActiveQuest returns null when file does not exist', ...)
  it('writeActiveQuest and readActiveQuest round-trip', ...)
  it('clearActiveQuest deletes file', ...)
})
```

### Project Structure Notes

- `src/moments/` é uma NOVA pasta — não existe ainda no projeto
- `src/services/state.js` é novo (active-quest.json, separado de config.json)
- `src/utils/slugify.js` é novo — pure function, zero deps
- `src/moments/quest.js` importa de vault.js, frontmatter.js, state.js, slugify.js (todos novos ou existentes)
- NÃO importa de fs/promises diretamente — delega para services

### References

- FR10, FR11, FR12: prd.md
- NFR2, NFR3: prd.md
- Fluxo Quest com âncora: architecture.md
- Frontmatter schema: architecture.md
- Depende de: story 1.3 (slash commands instalados)
- Continuada em: 2-2-dev-registra-relic-durante-quest-ativa.md

## Dev Agent Record

### Agent Model Used

_a preencher_

### Debug Log References

### Completion Notes List

### File List
