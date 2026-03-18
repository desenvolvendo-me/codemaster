---
id: "R003"
type: "relic"
title: "IA gera código, dev calibra para o contexto"
date: "2026-03-08"
milestone: 1
tags: ["codemaster","relic","ia"]
dimension: "ai_orchestration"
source_quest: "Q003"
---

# Relic: IA gera código, dev calibra para o contexto

## Descoberta

IA gera implementação funcional de circuit breaker rapidamente, mas calibra
thresholds para cenários genéricos. Os valores sugeridos (5 falhas/60s)
estavam errados para nosso volume — precisei de load test para acertar (3/30s).

## Por que importa

Thresholds de resiliência dependem do contexto: volume de requests, SLA do
serviço externo, tolerância do usuário. IA não tem acesso a esses dados.

## Padrão: IA gera, dev calibra

```
PEDIR para a IA:
  ✅ "Implemente circuit breaker com 3 estados"
  ✅ "Explique quando usar cada estado"
  ✅ "Gere o código do half-open"

NÃO CONFIAR para:
  ❌ Threshold de falhas → medir com load test
  ❌ Timeout de recovery → observar serviço real
  ❌ Volume do half-open → calibrar com dados reais
```

## Valores que precisei corrigir

| Parâmetro | Sugestão IA | Após load test |
|-----------|------------|----------------|
| Threshold | 5 falhas | 3 falhas |
| Window | 60s | 30s |
| Recovery | 120s | 30s |
| Half-open | 3 requests | 1 request |

## Score desta Relic
- IA / Orquestração: 7.0

## Fonte
[[Q003-pagamento-resiliente-a-falhas]]
