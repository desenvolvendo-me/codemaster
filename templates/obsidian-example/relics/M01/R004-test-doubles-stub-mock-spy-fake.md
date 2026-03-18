---
id: "R004"
type: "relic"
title: "Test doubles — stub, mock, spy e fake"
date: "2026-03-11"
milestone: 1
tags: ["codemaster","relic","testing"]
dimension: "architecture"
source_quest: "Q004"
---

# Relic: Test doubles — stub, mock, spy e fake

## Descoberta

"Mock" não é sinônimo de "qualquer coisa falsa no teste". Existem 4 tipos
de test doubles, cada um com propósito específico. Usar o tipo errado leva
a testes frágeis que quebram quando a implementação muda.

## Por que importa

Testes que verificam chamadas internas (mocks) são frágeis. Testes que
verificam resultado (stubs/fakes) são resilientes. Escolher o tipo certo
é a diferença entre uma suite que ajuda e uma que atrapalha.

## Os 4 tipos

```js
// STUB — retorna valor fixo, não verifica chamada
const getUser = vi.fn().mockReturnValue({ id: 1, name: 'Marco' })

// MOCK — verifica que foi chamado corretamente
const sendEmail = vi.fn()
await registerUser(data)
expect(sendEmail).toHaveBeenCalledWith('marco@email.com', 'Bem-vindo!')

// SPY — observa chamada real sem alterar comportamento
const spy = vi.spyOn(console, 'log')
doSomething()
expect(spy).toHaveBeenCalled()
spy.mockRestore()

// FAKE — implementação simplificada mas funcional
class InMemoryUserRepo {
  #users = new Map()
  async save(user) { this.#users.set(user.id, user) }
  async findById(id) { return this.#users.get(id) ?? null }
}
```

## Quando usar cada um

| Tipo | Use quando | Evite quando |
|------|-----------|-------------|
| Stub | Precisa controlar input de dependência | Quer verificar interações |
| Mock | Quer garantir que efeito colateral aconteceu | Testa lógica pura |
| Spy | Quer observar sem alterar | Precisa controlar retorno |
| Fake | Dependência é complexa (DB, API) | Implementação real é rápida |

## Contexto de aplicação

Aplicável a qualquer linguagem/framework de teste. Em Vitest/Jest, `vi.fn()`
cria stubs e mocks. `vi.spyOn()` cria spies. Fakes são classes manuais.

## Score desta Relic
- Arquitetura: 8.5

## Fonte
[[Q004-testes-unitarios-coverage-80]]
