---
id: "R004"
type: "relic"
title: "Custo de bugs em produção — R$15k que poderiam ser R$0"
date: "2026-03-11"
milestone: 1
tags: ["codemaster","relic","negocio"]
dimension: "business"
source_quest: "Q004"
---

# Relic: Custo de bugs em produção vs investimento em qualidade

## Descoberta

3 bugs de cálculo de preço em 4 sprints custaram R$15k (hotfixes + estornos +
suporte + context switching). Prevenir com testes custaria ~R$3k. Custo de
um bug em produção é 10-25x maior que preveni-lo.

## Por que importa

"Não temos tempo para testes" é a justificativa mais cara da engenharia. O
custo de prevenção é visível (dev parado escrevendo teste). O custo do bug é
diluído em suporte, estornos, reputação e context switching.

## Anatomia do custo

```
Bug em produção (cálculo de preço errado):
├── Detecção (cliente reclama)         → 0-48h de atraso
├── Triagem (suporte)                  → 30min
├── Escalonamento (dev interrompido)   → 30min perdidos (context switch)
├── Investigação                       → 1-2h
├── Hotfix                             → 1-4h
├── Deploy emergencial                 → 30min
├── Comunicação (clientes afetados)    → 1h
├── Estornos                           → valor variável
└── TOTAL: 5-10h + estornos + reputação

Teste preventivo:
├── Escrever teste                     → 30min
├── CI roda em cada push               → 0min (automático)
└── TOTAL: 30min + R$0
```

## Regra prática

- Regra que envolve dinheiro → teste obrigatório
- Edge case raro → teste recomendado (são os que mais escapam)
- Código de infra/glue → cobertura opcional

## Score desta Relic
- Negócio: 9.0

## Fonte
[[Q004-testes-regras-precificacao]]
