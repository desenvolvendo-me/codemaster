---
id: "R007"
type: "relic"
title: "Cache invalidation — TTL vs event-driven vs hybrid"
date: "2026-03-19"
milestone: 2
tags: ["codemaster","relic","performance"]
dimension: "architecture"
source_quest: "Q007"
---

# Relic: Cache invalidation — TTL vs event-driven vs hybrid

## Descoberta

Cache invalidation tem 3 estratégias com trade-offs claros. Não é "o problema
mais difícil da computação" quando você aceita compromissos explícitos.

## Por que importa

A maioria dos devs ou não cacheia (perdendo performance) ou cacheia sem
estratégia de invalidação (servindo dados incorretos). Entender as 3
estratégias permite escolher conscientemente.

## As 3 estratégias

```
TTL (Time-To-Live)
├── Como: dado expira após X segundos
├── Prós: simples, zero código de invalidação
├── Contras: serve dados stale até expirar
└── Use quando: domínio tolera atraso (dashboard, relatórios)

Event-Driven
├── Como: write invalida o cache via evento
├── Prós: sempre consistente
├── Contras: complexo, todos os write paths devem emitir eventos
└── Use quando: dados críticos (saldo, estoque)

Hybrid (TTL + Event)
├── Como: TTL como safety net + event para invalidação proativa
├── Prós: consistência + resiliência (se evento falhar, TTL limpa)
├── Contras: mais código, 2 mecanismos para manter
└── Use quando: produção real com SLA de consistência
```

## Padrão recomendado para MVP

```js
// Cache-aside com TTL — 80% dos casos
async function cached(key, fetchFn, ttl = 300) {
  const hit = await redis.get(key)
  if (hit) return JSON.parse(hit)
  const data = await fetchFn()
  await redis.setex(key, ttl, JSON.stringify(data))
  return data
}

// Invalidação manual para casos críticos
async function invalidate(key) {
  await redis.del(key)
}
```

## Contexto de aplicação

Aplicável a qualquer stack com Redis, Memcached, ou cache in-memory.
Em Ruby, gems como `kredis` e `solid_cache` implementam padrões similares.

## Score desta Relic
- Arquitetura: 8.0

## Fonte
[[Q007-implementar-cache-redis]]
