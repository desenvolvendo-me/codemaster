---
id: "Q003"
type: "victory"
title: "Integrar API de pagamento com retry e circuit breaker"
date: "2026-03-09"
milestone: 1
tags: ["codemaster","quest"]
relics: ["R003"]
victory: "Q003-integracao-api-externa"
business: "7.0"
architecture: "6.5"
ai_orchestration: "6.5"
---

# Quest: Integrar API de pagamento com retry e circuit breaker

## Pergunta Âncora

Como integrar uma API externa (gateway de pagamento) de forma resiliente,
garantindo que falhas temporárias não afetem a experiência do usuário?

## Reflexões por Dimensão

### Negócio
- **Por que esse problema existe?** Sem tratamento de falhas, qualquer instabilidade
  do gateway causa erro 500 para o usuário no momento mais crítico: o pagamento.
- **Qual o impacto de fazer errado?** Perda direta de receita. Cada transação
  falhada sem retry é um cliente que pode não voltar.
- **O que aprendi sobre o domínio?** Gateways de pagamento têm SLA de 99.9%, mas
  aqueles 0.1% acontecem nos piores momentos (Black Friday, picos de tráfego).

### Arquitetura
- **Qual padrão de design foi aplicado?** Retry com exponential backoff + circuit
  breaker para evitar cascade failure quando o gateway está fora.
- **O que poderia ter sido feito diferente?** Poderia usar uma fila (SQS/Bull) para
  processar pagamentos assincronamente, mas o UX exigia resposta síncrona.
- **Quais trade-offs foram feitos?** Latência aumenta com retries (até 3x o tempo
  normal) vs confiabilidade. Definimos timeout máximo de 10s para o usuário.

### IA / Orquestração
- **Como a IA me ajudou nessa quest?** Claude gerou a implementação do circuit
  breaker e sugeriu os thresholds iniciais (5 falhas em 60s para abrir o circuito).
- **O que a IA errou ou eu precisei corrigir?** Os thresholds sugeridos eram muito
  agressivos — ajustei para 3 falhas em 30s após testar com carga real.
- **O que eu sei hoje que não sabia antes?** Circuit breaker precisa de um estado
  "half-open" para testar recuperação gradual sem sobrecarregar o serviço.

## Notas de Desenvolvimento

```js
// services/payment-gateway.js
const RETRY_CONFIG = { retries: 3, factor: 2, minTimeout: 500 }
const CIRCUIT_CONFIG = { threshold: 3, timeout: 30000 }
```

## Relic desta Quest
- [[R003-circuit-breaker-half-open-state]] — padrão essencial para resiliência

## Victory
[[Q003-integracao-api-externa]]
