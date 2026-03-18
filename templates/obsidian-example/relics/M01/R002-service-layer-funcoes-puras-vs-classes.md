---
id: "R002"
type: "relic"
title: "Service layer — funções puras vs classes com DI"
date: "2026-03-05"
milestone: 1
tags: ["codemaster","relic","architecture"]
dimension: "architecture"
source_quest: "Q002"
---

# Relic: Service layer — funções puras vs classes com DI

## Descoberta

Em projetos JavaScript de médio porte, service layer implementado com funções
puras exportadas de um módulo é mais idiomático e testável do que classes com
injeção de dependência via constructor.

## Por que importa

Muitos tutoriais e frameworks (especialmente vindos do mundo Java/C#) incentivam
DI com classes abstratas em JavaScript. Isso adiciona complexidade sem ganho
proporcional em projetos com menos de ~50 services.

## Quando usar cada abordagem

```js
// ✅ FUNÇÕES PURAS — ideal para projetos pequenos/médios
// services/pricing.js
export function calculateDiscount(total, tier) {
  const rates = { bronze: 0.05, silver: 0.10, gold: 0.15 }
  return total * (rates[tier] ?? 0)
}

// Teste direto, sem setup:
expect(calculateDiscount(100, 'gold')).toBe(15)

// ⚠️ CLASSES COM DI — justificável quando:
// - Precisa trocar implementação em runtime (ex: payment gateway)
// - Tem estado que precisa ser gerenciado (ex: connection pool)
// - Projeto tem 50+ services e precisa de container
```

## Contexto de aplicação

A decisão depende do tamanho do projeto e da equipe. Para startups e MVPs,
funções puras reduzem boilerplate e aceleram desenvolvimento. Para sistemas
enterprise com múltiplos times, DI com container pode valer a complexidade.

## Score desta Relic
- Arquitetura: 7.5

## Fonte
[[Q002-refatoracao-service-layer]]
