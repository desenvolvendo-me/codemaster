# Story 5.5: Conteudo debug varia entre execucoes sem perder previsibilidade

Status: ready-for-dev

## Story

Como developer repetindo testes internos,
quero que perguntas e respostas do modo debug variem entre execucoes equivalentes sem perder clareza,
para que eu evite cenarios artificiais repetitivos e ainda mantenha previsibilidade suficiente para validar o sistema.

## Acceptance Criteria

1. **Dado** que dev executa o fluxo debug em rodadas consecutivas equivalentes
   **Quando** o sistema gera perguntas e respostas para `quest`, `relic` ou `victory`
   **Então** o conteudo nao permanece literalmente identico entre execucoes consecutivas
   **E** continua legivel e plausivel como demanda realista
   **E** permanece adequado para revisao humana antes do envio

2. **Dado** que o conteudo variou entre execucoes
   **Quando** dev revisa o payload no terminal
   **Então** a variacao nao compromete a clareza do fluxo
   **E** nao remove a capacidade de editar manualmente antes da aprovacao

## Tasks / Subtasks

- [ ] Task 1: Centralizar a geracao variada do modo debug em utilitario proprio (AC: 1, 2)
  - [ ] Criar utilitario dedicado, por exemplo `src/utils/debug-payload.js`
  - [ ] Evitar espalhar variacao manual por `debug.js`, `quest`, `relic` e `victory`
  - [ ] Garantir que `quest`, `relic` e `victory` consumam uma estrategia comum de variacao

- [ ] Task 2: Definir pools controlados de missao, perguntas e respostas por etapa (AC: 1, 2)
  - [ ] Criar conjuntos plausiveis para `quest`
  - [ ] Criar conjuntos plausiveis para `relic`
  - [ ] Criar conjuntos plausiveis para `victory`
  - [ ] Garantir linguagem clara, realista e revisavel por humano

- [ ] Task 3: Implementar variacao controlada sem perder previsibilidade (AC: 1, 2)
  - [ ] Garantir que execucoes consecutivas equivalentes nao retornem payload literalmente identico
  - [ ] Evitar aleatoriedade caotica que gere conteudo confuso ou inconsistente
  - [ ] Preservar estrutura estavel suficiente para o operador entender rapidamente o caso gerado

- [ ] Task 4: Integrar a variacao aos fluxos ja criados do debug (AC: 1, 2)
  - [ ] Fazer `5.2` consumir o utilitario para payload de `quest`
  - [ ] Fazer `5.3` consumir o utilitario para payload de `relic`
  - [ ] Fazer `5.4` consumir o utilitario para payload de `victory`
  - [ ] Garantir que a exibicao e a edicao manual continuem funcionando igual

- [ ] Task 5: Cobertura de testes para variacao controlada (AC: 1, 2)
  - [ ] Criar `src/utils/debug-payload.test.js`
  - [ ] Testar que chamadas consecutivas equivalentes nao retornam payload literalmente identico
  - [ ] Testar que os payloads continuam contendo campos obrigatorios esperados por `quest`, `relic` e `victory`
  - [ ] Testar que a variacao nao remove clareza minima nem quebra o formato revisavel

## Dev Notes

### Escopo desta story

Esta story nao cria uma nova etapa do fluxo. Ela melhora transversalmente o que ja foi definido em:
- `5.2` payload de `quest`
- `5.3` payload de `relic`
- `5.4` payload de `victory`

O objetivo e evitar repeticao literal entre execucoes equivalentes mantendo clareza operacional.

### Principio de implementacao

Nao usar aleatoriedade solta espalhada pelo codigo.

Implementacao recomendada:
- criar um utilitario pequeno, puro e testavel
- fazer o comando debug consumir esse utilitario para montar payloads
- manter a persistencia real (`createQuest`, `addRelic`, `closeVictory`) separada da geracao variada de conteudo

### O que significa "variacao" aqui

Variacao suficiente:
- titulo de missao diferente mas plausivel
- formulacao de perguntas com pequenas alternancias
- respostas previstas com foco levemente diferente

Variacao insuficiente:
- trocar uma palavra cosmetica e manter o payload essencialmente igual

Variacao excessiva:
- mudar tanto a estrutura que o operador deixa de reconhecer rapidamente o caso
- gerar texto confuso, artificial ou irrelevante para o teste

### Estrategia sugerida

Em vez de confiar em `Math.random()` de forma opaca em todo lugar:
- usar pools de alternativas por etapa
- evitar repetir a mesma combinacao consecutivamente
- opcionalmente rastrear a ultima combinacao usada dentro do estado debug em memoria ou no config, se necessario para evitar repeticao imediata

Exemplo de abordagem:

```js
{
  quest: {
    missionTitles: [...],
    questionVariants: [...],
    answerVariants: [...]
  },
  relic: {
    dimensions: [...],
    discoveries: [...],
    questionVariants: [...]
  },
  victory: {
    reflectionVariants: [...],
    scoreProfiles: [...]
  }
}
```

### Guardrail importante

Nao contaminar:
- `src/moments/quest.js`
- `src/moments/relic.js`
- `src/moments/victory.js`

Esses modulos sao motores de persistencia e ja possuem contratos/testes proprios.

A variacao pertence ao layer de orquestracao do debug e ao utilitario novo.

### Compatibilidade com o MVP definido

O PRD explicitou que:
- a base estrutural pode permanecer fixa
- a variacao deve acontecer no conteudo textual
- o operador continua podendo editar manualmente antes da aprovacao

Portanto:
- manter forma estavel do payload
- variar o texto, nao o contrato

### Testes esperados

- duas geracoes consecutivas de payload `quest` equivalente nao saem identicas
- duas geracoes consecutivas de payload `relic` equivalente nao saem identicas
- duas geracoes consecutivas de payload `victory` equivalente nao saem identicas
- todos os payloads continuam contendo os campos obrigatorios
- a integracao com `debug.js` nao quebra a etapa de revisao/edicao manual

### References

- PRD atualizado: [prd.md](../../planning-artifacts/IN001-cli/prd.md)
- Epic 5 / Story 5.5: [epics.md](../../planning-artifacts/IN001-cli/epics.md#story-55-conteudo-debug-varia-entre-execucoes-sem-perder-previsibilidade)
- Story anterior: [5-4-codemaster-debug-gera-victory-e-preserva-visao-encadeada-do-fluxo.md](./5-4-codemaster-debug-gera-victory-e-preserva-visao-encadeada-do-fluxo.md)
- Difficulty utils existing pattern: [src/utils/difficulty.js](/home/marcodotcastro/RubymineProjects/codemaster/src/utils/difficulty.js)
- Quest engine: [src/moments/quest.js](/home/marcodotcastro/RubymineProjects/codemaster/src/moments/quest.js)
- Relic engine: [src/moments/relic.js](/home/marcodotcastro/RubymineProjects/codemaster/src/moments/relic.js)
- Victory engine: [src/moments/victory.js](/home/marcodotcastro/RubymineProjects/codemaster/src/moments/victory.js)

## Dev Agent Record

### Agent Model Used

gpt-5

### Debug Log References

### Completion Notes List

### File List

- src/commands/debug.js
- src/commands/debug.test.js
- src/utils/debug-payload.js
- src/utils/debug-payload.test.js
