---
id: "Q003"
type: "victory"
title: "Pagamento resiliente a falhas"
date: "2026-03-09"
milestone: 1
tags: ["codemaster","quest"]
relics: ["R003"]
victory: "Q003-pagamento-resiliente-a-falhas"
business: "7.0"
architecture: "6.5"
ai_orchestration: "6.5"
---

# Quest: Pagamento resiliente a falhas

## Pergunta Âncora

Como garantir que falhas temporárias do gateway de pagamento (timeout, 503)
sejam recuperadas automaticamente sem que o cliente veja "erro no processamento"
e desista da compra?

## Reflexões por Dimensão

### Negócio
- **Por que esse problema existe?** O gateway tem SLA de 99.9%, mas entre
  19h-22h o tempo de resposta triplica. Sem retry, o cliente vê erro genérico
  e desiste — ~2% das transações perdidas, ~R$8k/mês.
- **Qual o impacto de fazer errado?** Falhas transientes são recuperáveis com
  retry simples. Sem tratamento, cada falha vira uma venda perdida. Em Black
  Friday o impacto seria 10x.
- **O que aprendi sobre o domínio?** 90% das falhas de pagamento são transientes
  (timeout, 503). Uma transação que falha na 1ª tentativa geralmente funciona
  na 2ª ou 3ª.

### Arquitetura
- **Qual padrão de design foi aplicado?** Retry com exponential backoff +
  circuit breaker com 3 estados (closed/open/half-open). O circuit breaker
  evita cascade failure quando o gateway está degradado.
- **O que poderia ter sido feito diferente?** Fila assíncrona (SQS/Bull) com
  retry ilimitado. Descartada porque o UX exige confirmação síncrona.
- **Quais trade-offs foram feitos?** Latência aumenta com retries (até 10s)
  vs confiabilidade. 10s com feedback é melhor que falha instantânea sem
  explicação.

### IA / Orquestração
- **Como a IA me ajudou nessa quest?** Claude gerou o circuit breaker com
  half-open state — a parte mais complexa que eu não dominava.
- **O que a IA errou ou eu precisei corrigir?** Thresholds calibrados para
  volume 10x maior que o nosso. Ajustei de 5/60s para 3/30s após load test.
- **O que eu sei hoje que não sabia antes?** O half-open é o estado mais
  importante do circuit breaker — sem ele o circuito nunca fecha sozinho.

## Notas de Desenvolvimento

```js
const RETRY_CONFIG = { retries: 3, factor: 2, minTimeout: 500 }
const CIRCUIT_CONFIG = { threshold: 3, timeout: 30000 }
```

## Relic desta Quest
- [[R003-ia-calibracao-thresholds-resiliencia]] — IA gera código, dev calibra

## Victory
[[Q003-pagamento-resiliente-a-falhas]]
