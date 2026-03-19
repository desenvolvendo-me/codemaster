# Story 5.2: Victory marca conhecimentos demonstrados e quest expande o mapa

Status: ready-for-dev

## Story

As a dev completando quests no CodeMaster,
I want que o sistema reconheça conhecimentos que eu já demonstro e descubra novos gaps no meu contexto real,
so that o mapa reflita minha evolução real e cresça com minha jornada.

## Acceptance Criteria

1. **Victory marca K{id} como Demonstrado** — ao fechar victory com score >= 7.0 em uma dimensão, K{id} da base curada naquela dimensão (com depth compatível) têm status atualizado
2. **Parabenização** — agente destaca conhecimento desbloqueado ao dev
3. **Quest cria gaps novos** — reflexões que revelam gap fora da base curada criam novo K{id} com `origin: "quest"`
4. **Depth atribuído pelo agente** — gaps novos recebem depth baseado na complexidade do conceito
5. **Source quests atualizado** — K{id} existente ganha nova quest de origem se relevante
6. **Idempotência** — gap equivalente não é recriado, apenas enriquecido
7. **Agente knowledge atualizado** — instruções para marcar demonstrado e expandir mapa
8. **Testes passando** — todos existentes + novos para marcação e expansão

## Tasks / Subtasks

- [ ] Task 1: Implementar marcação de K{id} Demonstrado (AC: #1, #2)
  - [ ] Em `generateKnowledge`, após análise de victories, cruzar scores com K{id} existentes
  - [ ] Se score >= 7.0 em dimensão, buscar K{id} com mesma dimensão e depth compatível com nível do dev
  - [ ] Atualizar frontmatter: `status: "Demonstrado"`, adicionar `demonstrated_at: "{date}"`
  - [ ] Retornar lista de K{id} recém-desbloqueados no resultado

- [ ] Task 2: Implementar expansão orgânica do mapa (AC: #3, #4, #5)
  - [ ] Em `generateKnowledge`, identificar gaps das reflexões que não existem na base
  - [ ] Para cada gap novo, criar K{id} com `origin: "quest"` e `source_quests` preenchido
  - [ ] Gerar ID sequencial baseado nos K{id} existentes (continuar numeração após base)
  - [ ] Atribuir depth baseado na complexidade (padrão: compatível com nível do dev)

- [ ] Task 3: Implementar idempotência de gaps (AC: #6)
  - [ ] Antes de criar K{id}, verificar se gap equivalente já existe (comparar por dimension + título similar)
  - [ ] Se existir, atualizar `source_quests` com nova quest de origem
  - [ ] Preservar status e checklist do K{id} existente (dev pode ter marcado itens)

- [ ] Task 4: Atualizar agente knowledge.md (AC: #7)
  - [ ] Instruir agente a verificar K{id} existentes antes de criar novos
  - [ ] Instruir agente a marcar K{id} como Demonstrado com base nos scores
  - [ ] Instruir agente a parabenizar dev pelo desbloqueio
  - [ ] Instruir agente a criar novos K{id} com conteúdo real (conceito, links, exemplo)

- [ ] Task 5: Atualizar FORMAT.md (AC: #1, #3)
  - [ ] Documentar campo `demonstrated_at` no frontmatter
  - [ ] Documentar valor `"Demonstrado"` para campo status
  - [ ] Documentar campo `origin: "quest"` para gaps orgânicos

- [ ] Task 6: Testes (AC: #8)
  - [ ] Testar que victory com score >= 7.0 marca K{id} como Demonstrado
  - [ ] Testar que victory com score < 7.0 não marca
  - [ ] Testar que gaps novos criam K{id} com origin "quest"
  - [ ] Testar idempotência (gap equivalente não é recriado)
  - [ ] Testar que source_quests é atualizado em K{id} existente
  - [ ] Garantir todos os testes existentes passando

## Dev Notes

### Pré-requisitos

- Story 4-3: cria knowledge/, formato K{id}, KNOWLEDGE-MAP como índice
- Story 5-1: instala base curada, adiciona campos origin e depth, filtragem por nível

### Arquivos a modificar

| Arquivo | Mudança |
|---------|---------|
| `src/moments/knowledge.js` | Lógica de marcação + expansão orgânica |
| `src/moments/knowledge.test.js` | Testes de marcação e expansão |
| `_codemaster/agents/knowledge.md` | Instruções para marcar e expandir |
| `_codemaster/agents/FORMAT.md` | Campos `demonstrated_at`, status "Demonstrado" |

### Lógica de marcação

```
Para cada dimensão com score >= 7.0 na victory:
  1. Listar K{id} com mesma dimensão e depth compatível
  2. Para cada K{id} com status "Para Estudar":
     - Atualizar status → "Demonstrado"
     - Adicionar demonstrated_at → data atual
  3. Retornar lista de K{id} desbloqueados
```

### Lógica de expansão

```
Para cada gap identificado nas reflexões:
  1. Buscar K{id} existentes por dimensão + título similar
  2. Se encontrar → atualizar source_quests
  3. Se não encontrar → criar novo K{id} com:
     - origin: "quest"
     - source_quests: ["{questFileName}"]
     - depth: atribuído pelo agente
     - status: "Para Estudar"
```

### Frontmatter estendido

```markdown
---
id: "K013"
type: "knowledge"
title: "WebSocket vs SSE para real-time"
dimension: "architecture"
depth: "intermediário"
status: "Para Estudar"
origin: "quest"
source_quests: ["Q006-notificacoes-tempo-real"]
date: "2026-03-20"
tags: ["codemaster","knowledge","arquitetura"]
---
```

### Status possíveis do K{id}

| Status | Significado |
|--------|-------------|
| Para Estudar | Gap identificado, dev ainda não estudou |
| Demonstrado | Dev demonstrou domínio via victory (score >= 7.0) |
| Estudado | Dev marcou manualmente no checklist (conceito + leitura) |
| Praticado | Dev completou todo o checklist (conceito + leitura + prática) |

### References

- [Source: src/moments/knowledge.js] — implementação atual
- [Source: src/services/vault.js] — CRUD de notas
- [Dependency: Story 4-3] — estrutura knowledge/
- [Dependency: Story 5-1] — base curada, origin, depth

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
