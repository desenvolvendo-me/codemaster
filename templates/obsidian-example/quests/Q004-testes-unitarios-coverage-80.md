---
id: "Q004"
type: "victory"
title: "Alcançar 80% de coverage com testes unitários significativos"
date: "2026-03-12"
milestone: 1
tags: ["codemaster","quest"]
relics: ["R004"]
victory: "Q004-testes-unitarios-coverage-80"
business: "5.5"
architecture: "8.0"
ai_orchestration: "7.0"
---

# Quest: Alcançar 80% de coverage com testes unitários significativos

## Pergunta Âncora

Como escrever testes que realmente previnem regressões em vez de apenas
inflar a métrica de coverage?

## Reflexões por Dimensão

### Negócio
- **Por que esse problema existe?** O projeto tinha 23% de coverage e bugs
  recorrentes em produção. O time perdia confiança para fazer deploys.
- **Qual o impacto de fazer errado?** Testes ruins dão falsa segurança. Um
  coverage alto com assertions fracas é pior que não ter testes.
- **O que aprendi sobre o domínio?** As regras de negócio mais críticas
  (cálculo de preço, elegibilidade) eram justamente as sem testes.

### Arquitetura
- **Qual padrão de design foi aplicado?** AAA (Arrange-Act-Assert) rigoroso,
  testes isolados com mocks apenas nas fronteiras (DB, APIs externas).
- **O que poderia ter sido feito diferente?** Poderia ter usado property-based
  testing para regras de cálculo — ficou como melhoria futura.
- **Quais trade-offs foram feitos?** Testes de integração com banco real vs
  mocks. Escolhi banco real para os fluxos críticos, mocks para o resto.

### IA / Orquestração
- **Como a IA me ajudou nessa quest?** Claude gerou a base dos testes a partir
  do código existente e identificou edge cases que eu não tinha considerado.
- **O que a IA errou ou eu precisei corrigir?** Gerou testes que mockavam
  demais — testavam a implementação e não o comportamento.
- **O que eu sei hoje que não sabia antes?** Test doubles têm tipos distintos
  (stub, mock, spy, fake) e cada um serve para uma situação específica.

## Notas de Desenvolvimento

Estrutura de teste adotada:

```js
describe('PricingService', () => {
  it('should apply gold discount of 15%', () => {
    const result = calculateDiscount(100, 'gold')
    expect(result).toBe(15)
  })

  it('should return 0 for unknown tier', () => {
    const result = calculateDiscount(100, 'unknown')
    expect(result).toBe(0)
  })
})
```

## Relic desta Quest
- [[R004-test-doubles-stub-mock-spy-fake]] — quando usar cada tipo de test double

## Victory
[[Q004-testes-unitarios-coverage-80]]
