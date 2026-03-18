---
id: "R001"
type: "relic"
title: "Vulnerabilidade algorithm: none em JWT"
date: "2026-03-02"
milestone: 1
tags: ["codemaster","relic","security"]
dimension: "architecture"
source_quest: "Q001"
---

# Relic: Vulnerabilidade algorithm: none em JWT

## Descoberta

Ao implementar autenticação JWT, descobri que algumas bibliotecas aceitam
tokens assinados com `algorithm: none` — o que permite a qualquer pessoa
forjar um token válido sem conhecer a chave secreta.

## Por que importa

Esse é um vetor de ataque real, documentado no OWASP como JWT vulnerability.
A maioria dos tutoriais online não menciona esse risco. Tokens forjados com
`alg: none` passam na verificação de bibliotecas que não validam o algoritmo.

## Como prevenir

```js
// ERRADO — aceita qualquer algoritmo incluindo "none"
jwt.verify(token, SECRET)

// CORRETO — especifica algoritmos aceitos explicitamente
jwt.verify(token, SECRET, { algorithms: ['HS256'] })
// O parâmetro `algorithms` é OBRIGATÓRIO para segurança real
```

## Contexto de aplicação

Válido para qualquer biblioteca JWT em qualquer linguagem. Em Node.js,
as bibliotecas `jsonwebtoken` e `jose` suportam essa configuração.
Em Ruby, use a gem `jwt` com: `JWT.decode(token, secret, true, algorithms: ['HS256'])`.

## Score desta Relic
- Arquitetura: 9.0

## Fonte
[[Q001-exemplo-quest]]
