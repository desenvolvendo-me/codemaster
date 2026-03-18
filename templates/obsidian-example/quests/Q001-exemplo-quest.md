---
id: "Q001"
type: "victory"
title: "Implementar autenticação JWT em API Node.js"
date: "2026-03-03"
milestone: 1
tags: ["codemaster","quest"]
relics: ["R001"]
victory: "Q001-exemplo-quest"
business: "7.5"
architecture: "8.5"
ai_orchestration: "6.0"
---

# Quest: Implementar autenticação JWT em API Node.js

## Pergunta Âncora

Como posso implementar autenticação segura com JWT sem criar vulnerabilidades
de segurança comuns como tokens sem expiração ou armazenamento inseguro?

## Reflexões por Dimensão

### Negócio
- **Por que esse problema existe?** Precisamos proteger dados dos usuários e
  garantir que apenas usuários autenticados acessem recursos privados.
- **Qual o impacto de fazer errado?** Vazamento de dados, perda de confiança,
  possíveis implicações legais (LGPD).
- **O que aprendi sobre o domínio?** Autenticação sem estado (stateless) com
  JWT é preferível para APIs que precisam escalar horizontalmente.

### Arquitetura
- **Qual padrão de design foi aplicado?** Middleware de autenticação intercep-
  tando requests antes dos controllers — separação clara de responsabilidades.
- **O que poderia ter sido feito diferente?** Poderia usar sessions no servidor,
  mas isso adiciona estado e complexidade de escalabilidade.
- **Quais trade-offs foram feitos?** JWT stateless = impossível invalidar token
  antes de expirar. Solução: refresh tokens + blacklist em Redis.

### IA / Orquestração
- **Como a IA me ajudou nessa quest?** Claude sugeriu o padrão de middleware
  separado e alertou sobre o risco de não validar o algoritmo do token (algo: none).
- **O que a IA errou ou eu precisei corrigir?** A primeira implementação não
  incluía tratamento para token expirado — tive que adicionar manualmente.
- **O que eu sei hoje que não sabia antes?** A importância de validar o campo
  `algorithm` no JWT para evitar o ataque de "none algorithm".

## Notas de Desenvolvimento

Biblioteca utilizada: `jsonwebtoken` (npm). Estrutura do middleware:

```js
// middleware/auth.js
import jwt from 'jsonwebtoken'

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
- [[R001-vulnerabilidade-algorithm-none-em-jwt]] — bug crítico evitado graças à IA

## Victory
[[Q001-exemplo-quest]]
