# Story 7.1: Mapa base curado com conhecimentos do dev agentic

Status: ready-for-dev

## Story

As a dev iniciando no CodeMaster,
I want que o vault já venha com um mapa de conhecimentos essenciais do dev agentic,
so that eu saiba desde o dia 1 o que preciso aprender e tenha visão completa do caminho.

## Acceptance Criteria

1. **Base curada instalada no setup** — `initVault` copia arquivos K{id} curados para `knowledge/` com status "Para Estudar"
2. **Origin distingue base de quest** — cada K{id} curado tem `origin: "base"` no frontmatter
3. **3 dimensões cobertas** — ao menos 3 K{id} por dimensão (negócio, arquitetura, IA), totalizando 9+ conhecimentos base
4. **Depth por profundidade** — cada K{id} tem `depth: "básico" | "intermediário" | "avançado"` no frontmatter
5. **Filtragem por nível do dev** — KNOWLEDGE-MAP.md lista apenas K{id} compatíveis com o nível configurado (junior=básico, pleno=básico+intermediário, senior=todos)
6. **Reconfiguração expande mapa** — ao mudar de nível, K{id} antes filtrados aparecem no próximo `/codemaster:knowledge`
7. **Idempotência** — `initVault` não sobrescreve K{id} existentes (dev pode ter editado checklist)
8. **Templates atualizados** — `templates/obsidian-example/knowledge/` inclui exemplos de K{id} base com `origin: "base"` e `depth`
9. **Testes passando** — todos existentes + novos para filtragem por nível e instalação da base

## Tasks / Subtasks

- [ ] Task 1: Definir a lista curada de conhecimentos do dev agentic (AC: #3, #4)
  - [ ] Definir 3+ K{id} para dimensão negócio (ex: métricas de produto, ROI de features, discovery vs delivery)
  - [ ] Definir 3+ K{id} para dimensão arquitetura (ex: service layer, design patterns, API design)
  - [ ] Definir 3+ K{id} para dimensão IA (ex: prompt engineering, agent orchestration, LLM evaluation)
  - [ ] Classificar cada K{id} com depth (básico/intermediário/avançado)
  - [ ] Preencher conteúdo: conceito, checklist, leitura recomendada, exemplo prático

- [ ] Task 2: Criar templates da base curada (AC: #8)
  - [ ] Criar arquivos K{id} em `templates/knowledge-base/` (separado dos examples)
  - [ ] Cada arquivo com frontmatter: id, type, title, dimension, depth, status, origin, tags
  - [ ] Cada arquivo com corpo: Conceito, Checklist de Estudo, Leitura Recomendada, Exemplo Prático

- [ ] Task 3: Atualizar `initVault` para instalar base curada (AC: #1, #2, #7)
  - [ ] Copiar arquivos de `templates/knowledge-base/` para `vault/knowledge/` durante setup
  - [ ] Não sobrescrever K{id} existentes (verificar com `access()`)
  - [ ] Atualizar teste de `initVault` para verificar cópia da base

- [ ] Task 4: Atualizar `generateKnowledge` para filtrar por nível (AC: #5, #6)
  - [ ] Ler `config.json` para obter nível do dev
  - [ ] Filtrar K{id} por depth no mapeamento: junior→["básico"], pleno→["básico","intermediário"], senior→["básico","intermediário","avançado"]
  - [ ] KNOWLEDGE-MAP.md lista apenas K{id} compatíveis com o nível
  - [ ] K{id} filtrados continuam existindo no vault (apenas não aparecem no índice)

- [ ] Task 5: Atualizar FORMAT.md e agente knowledge.md (AC: #2, #4)
  - [ ] Documentar campos `origin` e `depth` no frontmatter do K{id}
  - [ ] Documentar regra de filtragem por nível no agente

- [ ] Task 6: Atualizar templates de exemplo (AC: #8)
  - [ ] Atualizar `templates/obsidian-example/knowledge/` com exemplos que têm `origin: "base"` e `depth`
  - [ ] Atualizar KNOWLEDGE-MAP.md de exemplo refletindo filtragem

- [ ] Task 7: Testes (AC: #9)
  - [ ] Testar que `initVault` copia base curada para `knowledge/`
  - [ ] Testar que base não sobrescreve K{id} existentes
  - [ ] Testar filtragem por nível (junior, pleno, senior)
  - [ ] Testar que mudança de nível expande o mapa
  - [ ] Garantir todos os testes existentes passando

## Dev Notes

### Pré-requisito

Story 6-3 deve estar implementada primeiro — ela cria a pasta `knowledge/`, o formato K{id} e o KNOWLEDGE-MAP.md como índice.

### Arquivos a modificar

| Arquivo | Mudança |
|---------|---------|
| `src/services/vault.js` | `initVault` copia base curada para `knowledge/` |
| `src/services/vault.test.js` | Testes de cópia e idempotência |
| `src/moments/knowledge.js` | Filtrar K{id} por `depth` baseado no nível do dev |
| `src/moments/knowledge.test.js` | Testes de filtragem por nível |
| `_codemaster/agents/knowledge.md` | Documentar regra de filtragem |
| `_codemaster/agents/FORMAT.md` | Campos `origin` e `depth` |
| `templates/knowledge-base/` | Arquivos K{id} da base curada (NOVA PASTA) |
| `templates/obsidian-example/knowledge/` | Exemplos atualizados |

### Frontmatter do K{id} base (extensão do formato 6-3)

```markdown
---
id: "K001"
type: "knowledge"
title: "Métricas de produto e funil de conversão"
dimension: "business"
depth: "básico"
status: "Para Estudar"
origin: "base"
date: "2026-03-18"
tags: ["codemaster","knowledge","negocio"]
---
```

### Mapeamento nível → depth

| Nível | Depths visíveis |
|-------|----------------|
| junior | básico |
| pleno | básico, intermediário |
| senior | básico, intermediário, avançado |

### Padrão de uso existente

- `generateFrontmatter()` de `src/utils/frontmatter.js`
- `createNote(vaultPath, type, id, slug, content)` de `src/services/vault.js`
- `listNotes(vaultPath, 'knowledge')` — listar K{id} existentes
- `readNote(vaultPath, 'knowledge', fileName)` — ler frontmatter para verificar depth
- `parseFrontmatter(content)` de `src/utils/frontmatter.js` — extrair campos

### Quantidade estimada de K{id} base

- Negócio: 4 (2 básico, 1 intermediário, 1 avançado)
- Arquitetura: 4 (2 básico, 1 intermediário, 1 avançado)
- IA: 4 (2 básico, 1 intermediário, 1 avançado)
- Total: ~12 K{id} base

### References

- [Source: src/moments/knowledge.js] — implementação atual de generateKnowledge
- [Source: src/services/vault.js] — initVault e funções de CRUD
- [Source: _codemaster/agents/FORMAT.md] — formato atual do K{id}
- [Dependency: Story 6-3] — cria knowledge/ e formato K{id}

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
