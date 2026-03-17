# Obsidian Example — Milestone Completo

Este diretório contém um exemplo completo do que o CodeMaster produz após
um milestone de 5 quests. Leia na ordem abaixo para entender o sistema.

---

## Como ler os exemplos

### 1. Comece pela Quest

Abra `quests/Q001-exemplo-quest.md`

Observe:
- **Frontmatter** com `id`, `type`, `title`, `date`, `milestone`, `tags`, `relics` — gerado automaticamente pelo `/codemaster:quest`
- **Pergunta Âncora** — ponto de partida da reflexão inicial
- **Reflexões por Dimensão** — suas respostas às 3 perguntas por dimensão (Negócio, Arquitetura, IA)
- **Seção Victory** — adicionada pelo `/codemaster:victory` ao encerrar a quest, com scores por dimensão

### 2. Veja a Relic arquivada

Abra `relics/R001-vulnerabilidade-algorithm-none-em-jwt.md`

Observe:
- Relic gerada durante a quest e arquivada por ser reutilizável além do contexto da quest
- Frontmatter com `dimension` classificado
- Wikilink de origem para a quest

### 3. Veja o Milestone Summary

Abra `M01-summary.md`

Gerado automaticamente ao completar a 5ª Victory do milestone. Contém:
- Wikilinks para as 5 quests do período com scores resumidos
- Médias por dimensão
- Padrão emergente identificado pelo agente
- Foco recomendado para o próximo milestone

### 4. Veja o Knowledge Map

Abra `KNOWLEDGE-MAP.md`

Gerado/atualizado pelo `/codemaster:knowledge`. Contém:
- Gaps organizados por dimensão (Negócio / Arquitetura / IA)
- Status de cada gap: `Para Estudar`, `Estudado` ou `Praticado`
- Wikilinks para as quests de origem de cada gap
- Foco recomendado para o próximo milestone

---

## O ciclo completo

```
/codemaster:quest "título"
    ↓ cria quests/Q{id}-{slug}.md
    ↓ cria active-quest.json

/codemaster:relic "descoberta"
    ↓ appenda na quest ativa
    ↓ (opcional) arquiva em relics/R{id}-{slug}.md

/codemaster:victory
    ↓ encerra a quest com reflexão
    ↓ atualiza PROGRESS.md
    ↓ remove active-quest.json
    ↓ (5ª victory) gera M{id}-summary.md

/codemaster:legend
    ↓ lê PROGRESS.md e victories
    ↓ exibe progresso e tendências

/codemaster:knowledge
    ↓ analisa todas as victories
    ↓ atualiza KNOWLEDGE-MAP.md
    ↓ apresenta gaps prioritários
```

---

## Vault gerado pelo setup

O `codemaster setup` inicializa a estrutura abaixo no seu Obsidian Vault:

```
seu-vault/
├── quests/          ← notas de quest e victory
├── relics/          ← relics arquivadas (reutilizáveis)
├── PROGRESS.md      ← histórico de victories por milestone
└── KNOWLEDGE-MAP.md ← mapa de gaps atualizado pelo /knowledge
```

Após o primeiro milestone completo, o sistema cria também:

```
seu-vault/
└── M01-summary.md   ← summary do milestone (gerado automaticamente)
```
