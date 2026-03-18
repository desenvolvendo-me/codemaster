---
id: "Q001"
type: "victory"
title: "Autenticação segura no checkout"
date: "2026-03-03"
milestone: 1
tags: ["codemaster","quest"]
relics: ["R001"]
victory: "Q001-autenticacao-segura-checkout"
business: "7.5"
architecture: "8.5"
ai_orchestration: "6.0"
---

# Quest: Autenticação segura no checkout

## Pergunta Âncora

Como proteger as rotas de pagamento com autenticação stateless que escale
horizontalmente e não adicione fricção ao fluxo de compra?

## Reflexões por Dimensão

### Negócio
- **Por que esse problema existe?** 34% dos usuários abandonam o carrinho na
  etapa de pagamento. Parte é fricção, parte é timeout sem feedback. O checkout
  precisa ser seguro E rápido — cada segundo a mais custa ~R$12k/mês em vendas.
- **Qual o impacto de fazer errado?** Rotas desprotegidas expõem dados de
  pagamento. Auth lenta adiciona latência ao checkout. Ambos custam caro —
  um em segurança/compliance, outro em conversão.
- **O que aprendi sobre o domínio?** Abandono de carrinho é sintoma, não causa.
  Segmentar por etapa do funil (formulário vs submit vs erro) revela a causa
  real — neste caso, 60% era timeout do gateway, não UX.

### Arquitetura
- **Qual padrão de design foi aplicado?** Middleware JWT stateless com
  validação de algoritmo explícita. Separação de auth e business logic
  permite reusar o middleware em outros serviços.
- **O que poderia ter sido feito diferente?** Sessions server-side, mas
  adiciona estado e impede escalabilidade horizontal sem shared store.
- **Quais trade-offs foram feitos?** JWT stateless não permite revogar token
  antes do expiry. Mitigado com refresh tokens curtos (15min) + blacklist Redis.

### IA / Orquestração
- **Como a IA me ajudou nessa quest?** Claude analisou logs de erro do
  checkout e identificou que 60% dos abandonos eram timeout, não dados
  inválidos. Mudou completamente a prioridade da solução.
- **O que a IA errou ou eu precisei corrigir?** Sugeriu validar JWT no
  frontend — desnecessário e inseguro. Validação de token é server-side only.
- **O que eu sei hoje que não sabia antes?** A vulnerabilidade `algorithm: none`
  em JWT permite forjar tokens. Sempre especificar algoritmos aceitos.

## Notas de Desenvolvimento

```js
export function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Token ausente' })
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] })
    next()
  } catch (err) {
    res.status(401).json({ error: 'Token inválido ou expirado' })
  }
}
```

## Relic desta Quest
- [[R001-taxa-abandono-metrica-saude-produto]] — abandonos são sintoma, não causa

## Victory
[[Q001-autenticacao-segura-checkout]]
