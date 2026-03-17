# Story 1.5: Sistema inicializa e valida Obsidian Vault

Status: ready-for-dev

## Story

Como developer (Ricardo),
quero meu Obsidian vault inicializado com a estrutura CodeMaster durante o setup,
para que quests, relics e victories tenham um lugar imediatamente após a instalação.

## Acceptance Criteria

1. **Dado** que vault_path foi configurado no setup
   **Quando** setup valida e inicializa o vault
   **Então** subdiretórios `quests/` e `relics/` existem dentro do vault_path
   **E** `PROGRESS.md` é criado se não existir, com estrutura inicial (seções Dimensões Atuais + Milestone 1)
   **E** `KNOWLEDGE-MAP.md` esqueleto é criado se não existir (com seções para Negócio, Arquitetura, IA)

2. **Dado** que vault_path não existe ou não é acessível
   **Quando** setup tenta inicializar o vault
   **Então** erro é exibido com mensagem clara e dev é orientado a reinserir um path válido

3. **Dado** que estrutura do vault já existe
   **Quando** setup executa novamente
   **Então** arquivos e notas existentes não são sobrescritos (idempotente)

## Tasks / Subtasks

- [ ] Criar `src/services/vault.js` com as funções de vault (AC: 1, 2, 3)
  - [ ] `initVault(vaultPath)` — inicializa estrutura do vault
    - [ ] Validar se `vaultPath` existe e é acessível (`fs.access`)
    - [ ] Criar `quests/` e `relics/` com `mkdir({ recursive: true })` (idempotente)
    - [ ] Criar `PROGRESS.md` APENAS se não existir (idempotente)
    - [ ] Criar `KNOWLEDGE-MAP.md` APENAS se não existir (idempotente)
  - [ ] `createNote(vaultPath, type, id, slug, content)` — cria arquivo no vault
  - [ ] `readNote(vaultPath, type, fileName)` — lê arquivo do vault
  - [ ] `updateNote(vaultPath, type, fileName, content)` — sobrescreve arquivo
  - [ ] `listNotes(vaultPath, type)` — lista arquivos de um tipo
- [ ] Criar `src/services/vault.test.js` com testes de `initVault` (idempotência, erro de path)
- [ ] Integrar `initVault()` no fluxo de `setup.js` (story 1.2 já prevê essa chamada)

## Dev Notes

### Fronteira de acesso único — REGRA CRÍTICA

O Obsidian Vault (paths, arquivos, subdiretórios) SOMENTE pode ser acessado por `src/services/vault.js`.
Nenhum outro módulo usa `fs/promises` para ler/escrever no vault diretamente.

### `initVault()` — implementação de referência

```js
import { mkdir, writeFile, access } from 'fs/promises'
import { join } from 'path'

export async function initVault(vaultPath) {
  // Validar acesso
  try {
    await access(vaultPath)
  } catch {
    throw { code: 'VAULT_NOT_FOUND', message: `Vault não encontrado: ${vaultPath}`, path: vaultPath }
  }

  // Criar estrutura (idempotente com recursive: true)
  await mkdir(join(vaultPath, 'quests'), { recursive: true })
  await mkdir(join(vaultPath, 'relics'), { recursive: true })

  // PROGRESS.md — apenas se não existir
  const progressPath = join(vaultPath, 'PROGRESS.md')
  try {
    await access(progressPath)
    // já existe — não sobrescrever
  } catch {
    await writeFile(progressPath, PROGRESS_INITIAL_TEMPLATE, 'utf8')
  }

  // KNOWLEDGE-MAP.md — apenas se não existir
  const kmPath = join(vaultPath, 'KNOWLEDGE-MAP.md')
  try {
    await access(kmPath)
  } catch {
    await writeFile(kmPath, KNOWLEDGE_MAP_TEMPLATE, 'utf8')
  }
}
```

### Conteúdo do `PROGRESS.md` inicial

```markdown
# PROGRESS

## Dimensões Atuais
- Negócio: → 0 | Arquitetura: → 0 | IA: → 0

## Milestone 1 — 0/5 victories
```

### Conteúdo do `KNOWLEDGE-MAP.md` inicial

```markdown
# KNOWLEDGE MAP

## Negócio
<!-- gaps identificados em quests: tema, status (Para Estudar / Estudado / Praticado) -->

## Arquitetura
<!-- gaps identificados em quests -->

## IA / Orquestração
<!-- gaps identificados em quests -->
```

### Nomenclatura de artefatos Obsidian

```
quests/Q001-slug-da-quest.md
relics/R001-slug-do-relic.md
M01-summary.md (na raiz do vault)
```

### Frontmatter padrão Obsidian

```yaml
---
id: Q001
type: quest       # quest | relic | victory | milestone
title: Implementar autenticação JWT
date: 2026-03-17  # ISO 8601 — nunca timestamp Unix
milestone: 1
tags: [codemaster, quest]
relics: []
---
```

### Tratamento de erros — dois tipos

1. **Erro de usuário** (vault_path inválido): lançar objeto estruturado para o setup re-perguntar
   ```js
   throw { code: 'VAULT_NOT_FOUND', message: '...', path: vaultPath }
   ```

2. **Erro de IO inesperado** (permissão negada): `throw new Error(message)` — capturado pelo handler

### Testes de idempotência (AC: 3)

```js
describe('vault', () => {
  it('should not overwrite existing PROGRESS.md', async () => {
    // Criar vault com PROGRESS.md já existente
    // Chamar initVault() novamente
    // Verificar que conteúdo não foi alterado
  })

  it('should throw VAULT_NOT_FOUND for invalid path', async () => {
    await expect(initVault('/caminho/invalido')).rejects.toMatchObject({
      code: 'VAULT_NOT_FOUND'
    })
  })
})
```

### NFR2 — Operações de vault < 3 segundos

`fs/promises` em filesystem local: sem preocupações. Não adicionar delays artificiais.
`mkdir({ recursive: true })` é suficiente — sem verificações de existência redundantes.

### Project Structure Notes

- `vault.js` usa `fs/promises` e `path` (Node built-ins) — zero dependências externas
- `vault.js` não usa `console.log()` diretamente — retorna valores e lança erros
- `setup.js` chama `initVault()` e captura erros para re-perguntar o vault_path ao dev

### References

- Frontmatter Obsidian: [architecture.md](../../planning-artifacts/IN001-cli/architecture.md#Frontmatter)
- PROGRESS.md schema: [architecture.md](../../planning-artifacts/IN001-cli/architecture.md#PROGRESS.md)
- FR43, FR45, FR46: [prd.md](../../planning-artifacts/IN001-cli/prd.md)
- NFR2: [prd.md](../../planning-artifacts/IN001-cli/prd.md#NFR2)
- Story completa: [epics.md](../../planning-artifacts/IN001-cli/epics.md#Story-1.5)
- Depende de: [1-1-inicializar-projeto-com-stack-selecionada.md](./1-1-inicializar-projeto-com-stack-selecionada.md)
- Integrada em: [1-2-dev-executa-codemaster-setup-e-completa-onboarding.md](./1-2-dev-executa-codemaster-setup-e-completa-onboarding.md)

## Dev Agent Record

### Agent Model Used

_a preencher_

### Debug Log References

### Completion Notes List

### File List
