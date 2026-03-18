---
id: "Q004"
type: "victory"
title: "Testes automatizados para regras de precificação"
date: "2026-03-12"
milestone: 1
tags: ["codemaster","quest"]
relics: ["R004"]
victory: "Q004-testes-regras-precificacao"
business: "5.5"
architecture: "8.0"
ai_orchestration: "7.0"
---

# Quest: Testes automatizados para regras de precificação

## Pergunta Âncora

Como criar uma suíte de testes que cubra os edge cases de cálculo de preço
(desconto + promoção + frete grátis) e impeça que os mesmos 3 tipos de bug
cheguem a produção sprint após sprint?

## Reflexões por Dimensão

### Negócio
- **Por que esse problema existe?** Coverage de 23%, e as regras mais críticas
  (preço, elegibilidade) eram justamente as sem testes. 3 bugs de cálculo em
  4 sprints. Custo: R$15k em hotfixes + estornos + suporte.
- **Qual o impacto de fazer errado?** Cada bug de preço gera estorno, ticket,
  hotfix emergencial e context switching do dev. O custo de prevenir com teste
  é 10-25x menor que remediar em produção.
- **O que aprendi sobre o domínio?** O time testava manualmente, mas não
  cobria combinações complexas (promoção expirada + tier Gold + frete grátis
  acima de R$200). Edge cases são os que mais escapam.

### Arquitetura
- **Qual padrão de design foi aplicado?** AAA rigoroso (Arrange-Act-Assert),
  banco real para fluxos críticos (pagamento, elegibilidade), mocks apenas
  para APIs externas.
- **O que poderia ter sido feito diferente?** Property-based testing para
  regras de cálculo. Ficou como melhoria futura.
- **Quais trade-offs foram feitos?** Banco real é mais lento (2s vs 200ms),
  mas a confiança é incomparável. Mocks do trimestre passado deixaram um bug
  de migração passar.

### IA / Orquestração
- **Como a IA me ajudou nessa quest?** Claude gerou 70% dos testes a partir
  do código existente e identificou 2 edge cases que eu não pensei (divisão
  por zero em desconto, tier undefined).
- **O que a IA errou ou eu precisei corrigir?** Gerou testes que mockavam
  implementação interna — testava chamadas, não resultados. Frágil.
- **O que eu sei hoje que não sabia antes?** Test doubles são 4 tipos
  (stub, mock, spy, fake). Usar o tipo errado gera testes frágeis.

## Notas de Desenvolvimento

Coverage: 23% → 82%. Últimas 2 sprints sem regressão em precificação.

```js
describe('PricingService', () => {
  it('should apply gold discount of 15%', () => {
    expect(calculateDiscount(100, 'gold')).toBe(15)
  })
  it('should return 0 for unknown tier', () => {
    expect(calculateDiscount(100, 'unknown')).toBe(0)
  })
})
```

## Relic desta Quest
- [[R004-custo-bugs-producao-vs-qualidade]] — quanto custa não testar

## Victory
[[Q004-testes-regras-precificacao]]
