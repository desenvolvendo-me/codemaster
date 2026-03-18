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

Em projetos JavaScript de médio porte, service layer com funções puras
exportadas é mais idiomático e testável do que classes com injeção de
dependência via constructor.

## Por que importa

Tutoriais vindos do mundo Java/C# incentivam DI com classes abstratas.
Em JavaScript, isso adiciona complexidade sem ganho proporcional em
projetos com menos de ~50 services.

## Quando usar cada abordagem

```js
// ✅ FUNÇÕES PURAS — ideal para < 50 services
export function calculateDiscount(total, tier) {
  const rates = { bronze: 0.05, silver: 0.10, gold: 0.15 }
  return Math.round(total * (rates[tier] ?? 0) * 100) / 100
}
// Teste direto: expect(calculateDiscount(100, 'gold')).toBe(15)

// ⚠️ CLASSES COM DI — justificável quando:
// - Precisa trocar implementação em runtime (payment gateway)
// - Tem estado gerenciado (connection pool)
// - Projeto tem 50+ services
```

## Árvore de decisão

```
Quantos services o projeto tem?
├── < 20  → funções puras, imports diretos
├── 20-50 → funções puras, considere factory functions
└── > 50  → container de DI (awilix) pode valer
```

## Score desta Relic
- Arquitetura: 7.5

## Fonte
[[Q002-motor-descontos-fidelidade]]
