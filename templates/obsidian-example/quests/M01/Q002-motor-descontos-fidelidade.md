---
id: "Q002"
type: "victory"
title: "Motor de descontos por nível de fidelidade"
date: "2026-03-06"
milestone: 1
tags: ["codemaster","quest"]
relics: ["R002"]
victory: "Q002-motor-descontos-fidelidade"
business: "6.0"
architecture: "7.5"
ai_orchestration: "5.0"
---

# Quest: Motor de descontos por nível de fidelidade

## Pergunta Âncora

Como centralizar as regras de desconto (bronze 5%, silver 10%, gold 15%) em
uma única fonte de verdade, eliminando as 3 implementações divergentes que
causaram 23 tickets de clientes Gold com valores incorretos?

## Reflexões por Dimensão

### Negócio
- **Por que esse problema existe?** A regra de desconto estava em 3 controllers
  com variações sutis — o app arredondava para cima, a web para baixo. Clientes
  Gold perceberam e abriram tickets.
- **Qual o impacto de fazer errado?** 23 reclamações em 2 semanas. Risco de
  perda de confiança no programa de fidelidade e possível problema legal com
  propaganda enganosa.
- **O que aprendi sobre o domínio?** Regras de negócio duplicadas são dívida
  invisível. O custo dos 23 tickets + análise superou em 5x o custo de
  centralizar desde o início.

### Arquitetura
- **Qual padrão de design foi aplicado?** Service layer com funções puras.
  `calculateDiscount(total, tier)` é a única fonte de verdade para todos os
  canais (app, web, API).
- **O que poderia ter sido feito diferente?** Container de DI (awilix), mas
  adiciona complexidade sem ganho real para 12 controllers.
- **Quais trade-offs foram feitos?** Mais arquivos vs garantia de consistência.
  A testabilidade de funções puras justificou a separação.

### IA / Orquestração
- **Como a IA me ajudou nessa quest?** Claude fez grep nos 3 controllers e
  identificou as diferenças de arredondamento em 2 minutos — eu levaria 1h.
- **O que a IA errou ou eu precisei corrigir?** Sugeriu classes abstratas com
  herança — over-engineering para JavaScript.
- **O que eu sei hoje que não sabia antes?** Funções puras são mais idiomáticas
  que classes para service layer em Node.js. Composição > herança.

## Notas de Desenvolvimento

```js
export function calculateDiscount(orderTotal, customerTier) {
  const tiers = { bronze: 0.05, silver: 0.10, gold: 0.15 }
  const rate = tiers[customerTier] ?? 0
  return Math.round(orderTotal * rate * 100) / 100
}
```

## Relic desta Quest
- [[R002-service-layer-funcoes-puras-vs-classes]] — quando usar funções vs classes

## Victory
[[Q002-motor-descontos-fidelidade]]
