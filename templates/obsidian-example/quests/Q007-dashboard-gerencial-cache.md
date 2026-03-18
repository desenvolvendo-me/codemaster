---
id: "Q007"
type: "victory"
title: "Dashboard gerencial com cache inteligente"
date: "2026-03-20"
milestone: 2
tags: ["codemaster","quest"]
relics: ["R007"]
victory: "Q007-dashboard-gerencial-cache"
business: "7.0"
architecture: "8.0"
ai_orchestration: "6.5"
---

# Quest: Dashboard gerencial com cache inteligente

## Pergunta Âncora

Como garantir que o dashboard de gestão carregue em <1s com dados atualizados,
sabendo que 90% dos acessos consultam os mesmos dados (vendas do dia, ticket
médio, conversão, estoque crítico)?

## Reflexões por Dimensão

### Negócio
- **Por que esse problema existe?** Dashboard carrega em 3.2s por causa de
  4 queries agregadas recalculadas a cada acesso. Apenas 35% dos gestores
  usam diariamente (meta: 80%). Dashboard lento = decisões por "feeling".
- **Qual o impacto de fazer errado?** Cache inconsistente é pior que sem cache.
  Gestor vê dados errados e toma decisão errada.
- **O que aprendi sobre o domínio?** Dados gerenciais podem ter 5min de atraso
  sem impacto na decisão. Gestor precisa de tendência, não precisão ao segundo.

### Arquitetura
- **Qual padrão de design foi aplicado?** Cache-aside com Redis e TTL de 5min.
  Invalidação por expiração natural ao invés de event-driven.
- **O que poderia ter sido feito diferente?** Read-through transparente, mas
  cache-aside é explícito — o dev vê onde o cache está.
- **Quais trade-offs foram feitos?** Primeiro acesso lento (cold cache), mas
  TTL curto minimiza. Dados stale por até 5min aceitável para dados gerenciais.

### IA / Orquestração
- **Como a IA me ajudou nessa quest?** Claude explicou 4 padrões de cache
  (aside, through, behind, refresh-ahead) com trade-offs comparativos.
  Evitou over-engineering com read-through.
- **O que a IA errou ou eu precisei corrigir?** Sugeriu cache sem TTL com
  invalidação manual em todos os write paths — frágil para 12 endpoints.
- **O que eu sei hoje que não sabia antes?** Latência percebida impacta
  adoção de ferramentas internas. 3.2s→180ms mudou uso diário de 35% para 72%.

## Notas de Desenvolvimento

Dashboard: 3.2s → 180ms. Adoção diária: 35% → 72%.

```js
export async function cached(key, fetchFn, ttl = 300) {
  const hit = await redis.get(key)
  if (hit) return JSON.parse(hit)
  const data = await fetchFn()
  await redis.setex(key, ttl, JSON.stringify(data))
  return data
}
```

## Relic desta Quest
- [[R007-latencia-percebida-metrica-negocio]] — latência como métrica de negócio

## Victory
[[Q007-dashboard-gerencial-cache]]
