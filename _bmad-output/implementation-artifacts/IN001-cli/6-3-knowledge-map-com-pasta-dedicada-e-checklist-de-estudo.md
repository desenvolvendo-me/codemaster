# Story 6.3: Knowledge Map com pasta dedicada e checklist de estudo

Status: ready-for-dev

## Story

As a dev usando CodeMaster,
I want que cada gap identificado no Knowledge Map tenha um arquivo dedicado com checklist de estudo, links de leitura e exemplo prático,
so that eu possa acompanhar meu progresso de aprendizado de forma estruturada e saber exatamente o que estudar em cada dimensão.

## Acceptance Criteria

1. **Pasta `knowledge/` criada no vault** — `initVault` cria `knowledge/` junto com quests/, relics/, victories/, milestones/
2. **Arquivo individual por conhecimento** — formato `K{id}-{slug}.md` (ex: `K001-circuit-breaker.md`) com frontmatter padronizado
3. **Checklist de estudo em cada arquivo** — seção com checkboxes para: conceito estudado, conteúdo lido, exemplo praticado
4. **Links de leitura sugeridos** — seção com placeholder para o agente preencher com referências
5. **Exemplo prático** — seção com placeholder para código/padrão de aplicação
6. **KNOWLEDGE-MAP.md vira índice** — linka via wikilinks para os arquivos individuais em `knowledge/`
7. **Agente knowledge atualizado** — ao rodar `/codemaster:knowledge`, cria os arquivos K{id} e atualiza KNOWLEDGE-MAP.md como índice
8. **FORMAT.md atualizado** — seção 6 documenta o novo formato do arquivo K{id} e o novo formato de índice do KNOWLEDGE-MAP.md
9. **Exemplos no sample** — `templates/obsidian-example/knowledge/` com 3+ arquivos K{id} de exemplo cobrindo as 3 dimensões
10. **Testes passando** — todos os testes existentes + novos para `knowledge/` e `initVault`

## Tasks / Subtasks

- [ ] Task 1: Atualizar `initVault` para criar `knowledge/` (AC: #1)
  - [ ] Adicionar `mkdir(join(vaultPath, 'knowledge'))` em `src/services/vault.js`
  - [ ] Atualizar teste em `vault.test.js` para verificar `knowledge/`

- [ ] Task 2: Definir formato do arquivo K{id} (AC: #2, #3, #4, #5)
  - [ ] Definir frontmatter: `id`, `type: "knowledge"`, `title`, `dimension`, `status`, `source_quests`, `date`, `tags`
  - [ ] Definir corpo com seções: Conceito, Checklist de Estudo, Leitura Recomendada, Exemplo Prático, Fontes
  - [ ] Documentar em FORMAT.md seção 6 (substituir formato antigo)

- [ ] Task 3: Atualizar `generateKnowledge` em `knowledge.js` (AC: #7)
  - [ ] Criar arquivos `knowledge/K{id}-{slug}.md` para cada gap identificado
  - [ ] Gerar ID sequencial (K001, K002...) baseado nos arquivos existentes em `knowledge/`
  - [ ] Preencher frontmatter com dimension, status ("Para Estudar"), source_quests
  - [ ] NÃO recriar arquivo se já existir (verificar por `source_quest` + `dimension` + `title` similar)
  - [ ] Retornar lista de arquivos criados no resultado

- [ ] Task 4: KNOWLEDGE-MAP.md como índice (AC: #6)
  - [ ] Alterar `generateKnowledge` para gerar KNOWLEDGE-MAP.md como índice
  - [ ] Cada entrada: `- [[K{id}-{slug}]] | {dimension} | {status} | {score}`
  - [ ] Manter seções por dimensão (Negócio, Arquitetura, IA)
  - [ ] Manter seção "Próximo Milestone — Foco recomendado"

- [ ] Task 5: Atualizar agente knowledge.md (AC: #7)
  - [ ] Instruir agente a criar arquivos K{id} com checklist, links e exemplo
  - [ ] Agente deve preencher: conceito (baseado nas reflexões), links de leitura reais, exemplo prático real
  - [ ] Agente atualiza KNOWLEDGE-MAP.md como índice linkando os K{id}

- [ ] Task 6: Criar exemplos em templates/ (AC: #9)
  - [ ] `knowledge/K001-segmentacao-metricas-funil.md` (dimension: business)
  - [ ] `knowledge/K002-circuit-breaker-half-open.md` (dimension: architecture)
  - [ ] `knowledge/K003-ia-gera-dev-calibra.md` (dimension: ai_orchestration)
  - [ ] Atualizar KNOWLEDGE-MAP.md de exemplo para ser índice com wikilinks
  - [ ] Atualizar `sample.js` para incluir `knowledge/` no milestone

- [ ] Task 7: Atualizar injector e copiar examples (AC: #9)
  - [ ] Adicionar `knowledge` ao array de subdirs em `copyExamples()`
  - [ ] Verificar que `copyDirRecursive` copia corretamente

- [ ] Task 8: Atualizar testes de knowledge (AC: #10)
  - [ ] Testar que `generateKnowledge` cria arquivos K{id} em `knowledge/`
  - [ ] Testar formato do frontmatter dos arquivos K{id}
  - [ ] Testar que KNOWLEDGE-MAP.md contém wikilinks para K{id}
  - [ ] Testar idempotência (não recriar K{id} existente)
  - [ ] Garantir 134+ testes passando

## Dev Notes

### Arquivos a modificar

| Arquivo | Mudança |
|---------|---------|
| `src/services/vault.js` | Adicionar `knowledge/` ao `initVault` |
| `src/services/vault.test.js` | Testar `knowledge/` |
| `src/moments/knowledge.js` | Criar K{id} files + KNOWLEDGE-MAP como índice |
| `src/moments/knowledge.test.js` | Testes para novos arquivos |
| `_codemaster/agents/knowledge.md` | Instruções para preencher K{id} com conteúdo real |
| `_codemaster/agents/FORMAT.md` | Seção 6 com formato K{id} + índice |
| `src/services/injector.js` | Adicionar `knowledge` ao array de subdirs |
| `src/commands/sample.js` | Incluir `knowledge/` no milestone sample |
| `templates/obsidian-example/knowledge/` | 3 arquivos K{id} de exemplo |
| `templates/obsidian-example/KNOWLEDGE-MAP.md` | Transformar em índice |

### Formato do arquivo K{id} (proposto)

```markdown
---
id: "K001"
type: "knowledge"
title: "Segmentação de métricas para encontrar causa raiz"
dimension: "business"
status: "Para Estudar"
source_quests: ["Q001"]
date: "2026-03-20"
tags: ["codemaster","knowledge","negocio"]
---

# K001: Segmentação de métricas para encontrar causa raiz

## Conceito
{descrição do conhecimento — preenchido pelo agente baseado nas reflexões}

## Checklist de Estudo
- [ ] Conceito compreendido
- [ ] Conteúdo de leitura consumido
- [ ] Exemplo prático realizado

## Leitura Recomendada
- {link ou referência sugerida pelo agente}
- {link ou referência sugerida pelo agente}

## Exemplo Prático
{código ou padrão de aplicação — preenchido pelo agente}

## Fontes
- [[Q001-autenticacao-segura-checkout]]
```

### Padrão de uso existente

- `generateFrontmatter()` de `src/utils/frontmatter.js` — usar para frontmatter dos K{id}
- `createNote(vaultPath, type, id, slug, content)` de `src/services/vault.js` — criar arquivos
- `listNotes(vaultPath, 'knowledge')` — listar K{id} existentes para evitar duplicatas
- `readNote(vaultPath, 'knowledge', fileName)` — ler K{id} para verificar duplicatas

### Regra de idempotência

Ao rodar `/codemaster:knowledge` múltiplas vezes:
- Gaps já existentes como K{id} NÃO são recriados
- Novos gaps (de novas victories) CRIAM novos K{id}
- KNOWLEDGE-MAP.md é SEMPRE regenerado como índice completo
- Status dos K{id} existentes é preservado (dev pode marcar "Estudado"/"Praticado")

### Regras de frontmatter

Seguir `generateFrontmatter` com `JSON.stringify`:
- Strings: `id: "K001"`, `dimension: "business"`, `status: "Para Estudar"`
- Arrays: `source_quests: ["Q001","Q003"]`
- Scores como strings: `business: "7.5"`

### Project Structure Notes

- Pasta `knowledge/` fica na raiz do vault, junto com `quests/`, `relics/`, `victories/`, `milestones/`
- No milestone arquivado, K{id} NÃO são movidos para M{id}/ — conhecimentos são permanentes e cross-milestone
- Wikilinks do Obsidian resolvem por nome, não caminho — links funcionam sem path completo

### References

- [Source: src/moments/knowledge.js] — implementação atual de generateKnowledge
- [Source: src/services/vault.js] — initVault e funções de CRUD
- [Source: _codemaster/agents/FORMAT.md#seção-6] — formato atual do KNOWLEDGE-MAP
- [Source: _codemaster/agents/knowledge.md] — agente knowledge atual
- [Source: templates/obsidian-example/KNOWLEDGE-MAP.md] — exemplo atual

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
