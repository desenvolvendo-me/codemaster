---
id: "Q007"
type: "victory"
title: "Implementar cache com Redis para consultas frequentes"
date: "2026-03-20"
milestone: 2
tags: ["codemaster","quest"]
relics: ["R007"]
victory: "Q007-implementar-cache-redis"
business: "7.0"
architecture: "8.0"
ai_orchestration: "6.5"
---

# Quest: Implementar cache com Redis para consultas frequentes

## Pergunta Âncora

Como implementar cache para reduzir latência das consultas mais frequentes
sem criar problemas de dados stale ou inconsistência?

## Reflexões por Dimensão

### Negócio
- **Por que esse problema existe?** A página de dashboard carrega em 3.2s
  por causa de 4 queries agregadas. Produto pediu <1s. 90% dos acessos vêem
  os mesmos dados (atualizam a cada 5min).
- **Qual o impacto de fazer errado?** Cache inconsistente é pior que sem cache.
  Usuário vê dados errados, toma decisão errada, perde confiança no sistema.
- **O que aprendi sobre o domínio?** Dados do dashboard podem ter até 5 minutos
  de atraso sem impacto no negócio. Dados de transação precisam ser real-time.

### Arquitetura
- **Qual padrão de design foi aplicado?** Cache-aside pattern com TTL de 5min.
  Write-through apenas para invalidação (ao invés de atualizar o cache no write).
- **O que poderia ter sido feito diferente?** Read-through seria mais elegante
  mas requer uma camada extra de abstração. Cache-aside é explícito e simples.
- **Quais trade-offs foram feitos?** Latência do primeiro acesso (cold cache)
  vs simplicidade. Aceitável porque o TTL curto minimiza cold misses.

### IA / Orquestração
- **Como a IA me ajudou nessa quest?** Claude explicou os 4 padrões de cache
  (aside, through, behind, refresh-ahead) com diagrama de sequência para cada.
  Ajudou a escolher cache-aside com critérios objetivos.
- **O que a IA errou ou eu precisei corrigir?** Sugeriu cache sem TTL com
  invalidação manual — frágil demais para a quantidade de write paths.
- **O que eu sei hoje que não sabia antes?** Cache invalidation patterns têm
  trade-offs claros: TTL é simples mas pode servir dados stale; event-driven
  é consistente mas complexo; hybrid (TTL + event) é o ideal para produção.

## Notas de Desenvolvimento

```js
// services/cache.js
import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL)
const DEFAULT_TTL = 300 // 5 minutos

export async function cached(key, fetchFn, ttl = DEFAULT_TTL) {
  const hit = await redis.get(key)
  if (hit) return JSON.parse(hit)
  const data = await fetchFn()
  await redis.setex(key, ttl, JSON.stringify(data))
  return data
}
```

## Relic desta Quest
- [[R007-cache-invalidation-patterns-ttl-vs-event]] — quando usar TTL vs event-driven

## Victory
[[Q007-implementar-cache-redis]]
