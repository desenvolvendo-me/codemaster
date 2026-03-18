---
id: "Q002"
type: "victory"
title: "Refatorar controllers extraindo service layer"
date: "2026-03-06"
milestone: 1
tags: ["codemaster","quest"]
relics: ["R002"]
victory: "Q002-refatoracao-service-layer"
business: "6.0"
architecture: "7.5"
ai_orchestration: "5.0"
---

# Quest: Refatorar controllers extraindo service layer

## Pergunta Âncora

Como separar lógica de negócio dos controllers sem over-engineering, mantendo
testabilidade e clareza para o time?

## Reflexões por Dimensão

### Negócio
- **Por que esse problema existe?** Controllers misturavam validação, lógica de
  negócio e formatação de resposta. Novos devs demoravam para entender o fluxo.
- **Qual o impacto de fazer errado?** Bugs difíceis de rastrear, código duplicado
  entre controllers, impossibilidade de reusar lógica em jobs/workers.
- **O que aprendi sobre o domínio?** A regra de "desconto progressivo" estava
  escondida em 3 controllers diferentes com implementações ligeiramente distintas.

### Arquitetura
- **Qual padrão de design foi aplicado?** Service layer puro — classes sem estado
  que recebem dependências via parâmetro. Sem framework de DI, apenas funções.
- **O que poderia ter sido feito diferente?** Poderia ter usado um container de DI
  como `awilix`, mas adicionaria complexidade desnecessária para o tamanho do projeto.
- **Quais trade-offs foram feitos?** Mais arquivos no projeto vs clareza e testabilidade.
  O ganho em testes unitários justificou a separação.

### IA / Orquestração
- **Como a IA me ajudou nessa quest?** Claude identificou os 3 pontos de duplicação
  de regra de desconto e sugeriu a extração para `PricingService`.
- **O que a IA errou ou eu precisei corrigir?** Sugeriu injeção de dependência com
  classe abstrata — complexidade desnecessária para Node.js.
- **O que eu sei hoje que não sabia antes?** Service layer não precisa ser uma classe.
  Funções puras com parâmetros explícitos são mais idiomáticas em JavaScript.

## Notas de Desenvolvimento

Padrão adotado — service como função pura:

```js
// services/pricing.js
export function calculateDiscount(orderTotal, customerTier) {
  const tiers = { bronze: 0.05, silver: 0.10, gold: 0.15 }
  const rate = tiers[customerTier] ?? 0
  return orderTotal * rate
}
```

## Relic desta Quest
- [[R002-service-layer-funcoes-puras-vs-classes]] — insight sobre quando usar classes vs funções

## Victory
[[Q002-refatoracao-service-layer]]
