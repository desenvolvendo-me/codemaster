# Obsidian Example — Ciclo Completo do CodeMaster

Exemplo completo: 1 milestone arquivado, 1 quest finalizada e 1 quest ativa.

## Estrutura

```
templates/obsidian-example/
├── quests/
│   ├── M01/                                    ← milestone 1 arquivado
│   │   ├── Q001-autenticacao-segura-checkout.md
│   │   ├── Q002-motor-descontos-fidelidade.md
│   │   ├── Q003-pagamento-resiliente-a-falhas.md
│   │   ├── Q004-testes-regras-precificacao.md
│   │   └── Q005-pipeline-ci-cd-deploy-automatico.md
│   ├── Q006-notificacoes-tempo-real.md          ← quest ativa
│   └── Q007-dashboard-gerencial-cache.md        ← quest finalizada
├── victories/
│   ├── M01/
│   │   └── Q001...Q005
│   └── Q007-dashboard-gerencial-cache.md
├── relics/
│   ├── M01/
│   │   ├── R001 (negócio) · R004 (negócio)
│   │   ├── R002 (arquitetura)
│   │   └── R003 (IA) · R005 (IA)
│   ├── R006-websocket-vs-sse (arquitetura)
│   └── R007-latencia-percebida (negócio)
├── milestones/
│   └── M01-summary.md
├── PROGRESS.md
├── KNOWLEDGE-MAP.md
└── README.md
```

## O ciclo completo

```
/codemaster:quest "funcionalidade"
    ↓ cria quests/Q{id}-{slug}.md

/codemaster:relic "descoberta"
    ↓ registra na quest ativa (negócio, arquitetura ou IA)
    ↓ (opcional) arquiva em relics/R{id}-{slug}.md

/codemaster:victory
    ↓ cria victories/Q{id}-{slug}.md
    ↓ atualiza quest com link + scores
    ↓ atualiza PROGRESS.md
    ↓ (5ª victory) cria milestones/M{id}-summary.md
    ↓ (5ª victory) arquiva em M{id}/

/codemaster:legend
    ↓ exibe progresso e tendências

/codemaster:knowledge
    ↓ atualiza KNOWLEDGE-MAP.md
```
