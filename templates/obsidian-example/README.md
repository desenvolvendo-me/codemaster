# Obsidian Example — Ciclo Completo do CodeMaster

Este diretório contém um exemplo completo do que o CodeMaster produz:
um milestone arquivado, uma quest finalizada e uma quest em andamento.

---

## Estrutura

```
templates/obsidian-example/
├── quests/
│   ├── M01/                                    ← milestone 1 arquivado
│   │   ├── Q001-exemplo-quest.md
│   │   ├── Q002-refatoracao-service-layer.md
│   │   ├── Q003-integracao-api-externa.md
│   │   ├── Q004-testes-unitarios-coverage-80.md
│   │   └── Q005-deploy-automatizado-ci-cd.md
│   ├── Q006-implementar-websockets.md          ← quest em andamento
│   └── Q007-implementar-cache-redis.md         ← quest finalizada
├── victories/
│   ├── M01/
│   │   ├── Q001-exemplo-quest.md
│   │   ├── Q002-refatoracao-service-layer.md
│   │   ├── Q003-integracao-api-externa.md
│   │   ├── Q004-testes-unitarios-coverage-80.md
│   │   └── Q005-deploy-automatizado-ci-cd.md
│   └── Q007-implementar-cache-redis.md         ← victory da Q007
├── relics/
│   ├── M01/
│   │   ├── R001-vulnerabilidade-algorithm-none-em-jwt.md
│   │   ├── R002-service-layer-funcoes-puras-vs-classes.md
│   │   ├── R003-circuit-breaker-half-open-state.md
│   │   ├── R004-test-doubles-stub-mock-spy-fake.md
│   │   └── R005-github-actions-cache-estrategia.md
│   ├── R006-websocket-vs-sse-quando-usar-cada.md   ← relic da Q006
│   └── R007-cache-invalidation-patterns-ttl-vs-event.md
├── PROGRESS.md       ← M1 completo + M2 em andamento
├── M01-summary.md    ← summary do milestone 1
├── KNOWLEDGE-MAP.md  ← mapa de gaps
└── README.md         ← este arquivo
```

---

## Como ler os exemplos

### 1. Quest em andamento — `Q006`

Abra `quests/Q006-implementar-websockets.md`

- `type: "quest"` — sem campos de victory
- Reflexões parciais com "(em andamento)" onde ainda não completou
- Relic já registrada: `relics/R006-websocket-vs-sse-quando-usar-cada.md`

### 2. Quest finalizada — `Q007`

Abra `quests/Q007-implementar-cache-redis.md`

- `type: "victory"` + campos de scores no frontmatter
- `victory: "Q007-implementar-cache-redis"` — link para o arquivo de victory
- `## Victory\n[[Q007-implementar-cache-redis]]` — link no corpo
- Victory: `victories/Q007-implementar-cache-redis.md` — reflexões completas
- Relic: `relics/R007-cache-invalidation-patterns-ttl-vs-event.md`

### 3. Milestone arquivado — `M01/`

Quando a 5ª victory completa um milestone:
- Arquivos movidos para `quests/M01/`, `victories/M01/`, `relics/M01/`
- Wikilinks continuam funcionando (Obsidian resolve por nome)
- `M01-summary.md` criado com médias, padrões e recomendações
- `PROGRESS.md` mostra M1 ✓ e M2 em andamento

---

## O ciclo completo

```
/codemaster:quest "título"
    ↓ cria quests/Q{id}-{slug}.md

/codemaster:relic "descoberta"
    ↓ registra na quest ativa
    ↓ (opcional) arquiva em relics/R{id}-{slug}.md

/codemaster:victory
    ↓ cria victories/Q{id}-{slug}.md
    ↓ atualiza quest com link + scores
    ↓ atualiza PROGRESS.md
    ↓ (5ª victory) gera M{id}-summary.md
    ↓ (5ª victory) arquiva em M{id}/

/codemaster:legend
    ↓ exibe progresso e tendências

/codemaster:knowledge
    ↓ atualiza KNOWLEDGE-MAP.md
```
