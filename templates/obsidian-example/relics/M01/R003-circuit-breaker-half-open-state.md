---
id: "R003"
type: "relic"
title: "Circuit breaker — o estado half-open é o mais importante"
date: "2026-03-08"
milestone: 1
tags: ["codemaster","relic","resilience"]
dimension: "architecture"
source_quest: "Q003"
---

# Relic: Circuit breaker — o estado half-open é o mais importante

## Descoberta

Circuit breaker tem 3 estados, não 2. O estado `half-open` é o que permite
recuperação automática — sem ele, o circuito aberto nunca fecha e o serviço
fica permanentemente degradado.

## Por que importa

Muitas implementações de circuit breaker ignoram o half-open e ficam presas
entre "tudo funciona" (closed) e "nada funciona" (open). O half-open é o
mecanismo de auto-cura que torna o padrão realmente útil.

## Os 3 estados

```
CLOSED (normal) ──── falhas atingem threshold ──── OPEN (bloqueado)
   ↑                                                     │
   │                                              timeout expira
   │                                                     │
   └──── sucesso no teste ──── HALF-OPEN (testando) ─────┘
                               permite 1 request por vez
                               se falha → volta para OPEN
                               se sucesso → volta para CLOSED
```

## Thresholds recomendados (calibrar com load test)

| Parâmetro | Valor inicial | Ajustar baseado em |
|-----------|--------------|-------------------|
| Threshold | 3 falhas | Volume de requests |
| Timeout | 30s | Tempo de recovery do serviço |
| Half-open requests | 1 | Capacidade do serviço degradado |

## Contexto de aplicação

Essencial para qualquer integração com serviços externos: APIs de pagamento,
serviços de email, microsserviços internos. Em Node.js, bibliotecas como
`opossum` implementam o padrão completo.

## Score desta Relic
- Arquitetura: 8.0

## Fonte
[[Q003-integracao-api-externa]]
