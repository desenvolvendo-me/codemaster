# Story 4.3: Sistema gera trilha progressiva de estudo sequenciada

Status: ready-for-dev

## Story

As a dev consultando o Knowledge Map,
I want uma trilha de estudo sequenciada com prioridades claras,
so that eu saiba exatamente qual gap estudar primeiro e tenha evolução lógica e gradativa.

## Acceptance Criteria

1. **Trilha de Estudo no KNOWLEDGE-MAP** — seção dedicada lista os 3 próximos gaps em ordem de estudo com justificativa
2. **Priorização inteligente** — ordem considera: frequência nas quests + dimensão de menor score + depth compatível com nível
3. **Depth incompatível nunca aparece** — gaps com depth além do nível do dev não entram na trilha
4. **Promoção automática** — ao completar checklist de um K{id}, próximo gap é promovido como prioridade 1
5. **K{id} completado muda status** — checklist completo → status "Praticado"
6. **Agente knowledge atualizado** — instruções para gerar trilha com justificativa
7. **Templates atualizados** — KNOWLEDGE-MAP de exemplo mostra trilha com 3 próximos gaps
8. **Testes passando** — todos existentes + novos para trilha e promoção

## Tasks / Subtasks

- [ ] Task 1: Implementar algoritmo de priorização (AC: #1, #2, #3)
  - [ ] Calcular score de prioridade para cada K{id} com status "Para Estudar"
  - [ ] Fatores: frequência em source_quests (peso 3) + dimensão de menor score médio (peso 2) + depth compatível (peso 1)
  - [ ] Excluir K{id} com depth incompatível com nível do dev
  - [ ] Selecionar top 3 como trilha recomendada

- [ ] Task 2: Gerar seção Trilha de Estudo no KNOWLEDGE-MAP (AC: #1)
  - [ ] Adicionar seção `## Trilha de Estudo` após as dimensões
  - [ ] Cada entrada: `1. [[K{id}-{slug}]] — {justificativa curta}`
  - [ ] Justificativa baseada nos fatores de priorização (ex: "Apareceu em 3 quests, dimensão mais fraca")

- [ ] Task 3: Implementar detecção de checklist completo (AC: #4, #5)
  - [ ] Ao rodar `generateKnowledge`, ler cada K{id} e verificar checkboxes
  - [ ] Se todos marcados `[x]` (conceito + leitura + prática) → status "Praticado"
  - [ ] Recalcular trilha excluindo K{id} praticados
  - [ ] Próximo gap na lista assume prioridade 1

- [ ] Task 4: Atualizar agente knowledge.md (AC: #6)
  - [ ] Instruir agente a gerar trilha com justificativa clara
  - [ ] Instruir agente a destacar promoções ("Você completou K{id}! Próximo: K{id2}")
  - [ ] Instruir agente a explicar por que cada gap foi priorizado

- [ ] Task 5: Atualizar templates de exemplo (AC: #7)
  - [ ] KNOWLEDGE-MAP.md com seção Trilha de Estudo com 3 entradas
  - [ ] Exemplo de K{id} com checklist parcialmente completo
  - [ ] Exemplo de K{id} com status "Praticado"

- [ ] Task 6: Testes (AC: #8)
  - [ ] Testar algoritmo de priorização (frequência + dimensão + depth)
  - [ ] Testar que depth incompatível é excluído da trilha
  - [ ] Testar que checklist completo muda status para "Praticado"
  - [ ] Testar promoção automática (próximo gap assume prioridade 1)
  - [ ] Testar que K{id} Demonstrado/Praticado não aparecem na trilha
  - [ ] Garantir todos os testes existentes passando

## Dev Notes

### Pré-requisitos

- IN001 Story 4.3: cria knowledge/, formato K{id}, KNOWLEDGE-MAP como índice
- Story 4.1: base curada, origin, depth, filtragem por nível
- Story 4.2: marcação de Demonstrado, expansão orgânica

### Arquivos a modificar

| Arquivo | Mudança |
|---------|---------|
| `src/moments/knowledge.js` | Algoritmo de priorização + detecção de checklist + trilha |
| `src/moments/knowledge.test.js` | Testes de priorização, promoção, checklist |
| `_codemaster/agents/knowledge.md` | Instruções para trilha com justificativa |
| `templates/obsidian-example/KNOWLEDGE-MAP.md` | Seção Trilha de Estudo |
| `templates/obsidian-example/knowledge/` | Exemplos com checklist parcial e Praticado |

### Algoritmo de priorização

```
Para cada K{id} com status "Para Estudar":
  score = 0

  // Fator 1: Frequência nas quests (peso 3)
  score += source_quests.length * 3

  // Fator 2: Dimensão mais fraca (peso 2)
  if (K{id}.dimension === dimensão_menor_score_médio) score += 2

  // Fator 3: Depth compatível (filtro obrigatório)
  if (K{id}.depth não compatível com nível) → excluir

  // Depth mais básico primeiro (peso 1)
  if (K{id}.depth === "básico") score += 1

Ordenar por score DESC → top 3 = trilha
```

### Formato da Trilha no KNOWLEDGE-MAP

```markdown
## Trilha de Estudo

> Baseada nas suas {n} victories e nível {nível}

1. [[K003-ia-gera-dev-calibra]] — Apareceu em 3 quests, sua dimensão IA está 2.3 pontos abaixo da média
2. [[K001-metricas-produto-funil]] — Dimensão negócio é sua mais fraca (score 4.2)
3. [[K008-prompt-engineering-basico]] — Fundamento essencial para orquestração IA
```

### Detecção de checklist

```
Ler conteúdo do K{id}
Contar linhas com "- [x]" na seção "Checklist de Estudo"
Se 3/3 marcados → status = "Praticado"
Se 1-2/3 marcados → status = "Estudado" (parcial)
Se 0/3 marcados → manter status atual
```

### References

- [Source: src/moments/knowledge.js] — implementação atual
- [Source: src/services/vault.js] — CRUD de notas
- [Dependency: IN001 Story 4.3] — estrutura knowledge/
- [Dependency: Story 4.1] — base curada, origin, depth
- [Dependency: Story 4.2] — marcação, expansão orgânica

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
