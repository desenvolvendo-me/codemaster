# Story 5.4: codemaster:debug gera victory e preserva visao encadeada do fluxo

Status: review

## Story

Como developer fazendo troubleshooting do CodeMaster,
quero concluir o fluxo debug com `victory` e enxergar a cadeia completa entre payloads e artefatos gerados,
para que eu diagnostique com mais facilidade onde o comportamento comecou a divergir do esperado.

## Acceptance Criteria

1. **Dado** que a etapa de `quest` e as `relics` opcionais ja foram tratadas
   **Quando** o fluxo debug chega ao encerramento
   **Então** o sistema prepara a `victory` como etapa final do processo
   **E** exibe o payload correspondente antes do envio ao agente
   **E** permite edicao manual antes da aprovacao
   **E** gera a `victory` em formato compativel com o fluxo normal

2. **Dado** que o fluxo debug foi executado
   **Quando** dev revisa o resultado
   **Então** consegue observar de forma encadeada as etapas de `quest`, `relic(s)` e `victory`
   **E** consegue relacionar cada payload exibido com os artefatos finais gerados no vault

## Tasks / Subtasks

- [x] Task 1: Estender `codemaster:debug` para a etapa final de `victory` (AC: 1, 2)
  - [x] Atualizar `src/commands/debug.js` para sempre encerrar o fluxo com `victory`
  - [x] Garantir que a etapa final so seja atingida apos `quest` e `relic(s)` opcionais
  - [x] Falhar com mensagem clara se a quest ativa estiver inconsistente ao chegar na etapa de encerramento

- [x] Task 2: Definir o payload operacional de `victory` e exibi-lo antes da execucao (AC: 1)
  - [x] Estruturar payload minimo com reflexoes previstas, scores ou sinais de avaliacao esperados e contexto acumulado do fluxo
  - [x] Exibir o payload integralmente no terminal antes da aprovacao
  - [x] Garantir que o payload exibido seja o mesmo efetivamente usado para a criacao da `victory`

- [x] Task 3: Permitir edicao manual do payload de `victory` (AC: 1)
  - [x] Permitir ajuste das perguntas/reflexoes previstas
  - [x] Permitir ajuste das respostas previstas antes da aprovacao
  - [x] Confirmar explicitamente a execucao final antes de persistir o encerramento

- [x] Task 4: Reutilizar a infraestrutura real de `victory` sem duplicar logica (AC: 1)
  - [x] Reutilizar `closeVictory()` de `src/moments/victory.js` como motor principal de persistencia
  - [x] Resolver corretamente `questFileName` a partir do estado ativo
  - [x] Garantir que a geracao de `victory`, atualizacao da quest, atualizacao de `PROGRESS.md` e limpeza de `active-quest.json` continuem pelo caminho testado

- [x] Task 5: Preservar visao encadeada do fluxo debug para troubleshooting (AC: 2)
  - [x] Manter em memoria ou estrutura de sessao o historico dos payloads aprovados de `quest`, `relic(s)` e `victory`
  - [x] Exibir ao final um resumo encadeado suficiente para relacionar entradas e artefatos finais
  - [x] Garantir que a visao final nao esconda o vinculo entre payload aprovado e arquivos criados/atualizados

- [x] Task 6: Cobertura de testes da etapa final do fluxo debug (AC: 1, 2)
  - [x] Atualizar `src/commands/debug.test.js` para cobrir a etapa final de `victory`
  - [x] Confirmar que `closeVictory()` e chamado com o contexto final aprovado
  - [x] Validar que a quest recebe link para `victory`, `PROGRESS.md` e atualizado e `active-quest.json` e limpo
  - [x] Validar que o resumo encadeado final referencia `quest`, `relic(s)` e `victory`

## Dev Notes

### Escopo desta story

Esta story cobre:
- etapa final de `victory` dentro do fluxo debug
- exibicao/edicao do payload final antes da execucao
- fechamento correto da quest ativa via infraestrutura real
- visao encadeada final para troubleshooting

Nao cobre ainda:
- regra transversal de variacao entre execucoes equivalentes

Esse ponto pertence a `5.5`.

### Reuso obrigatorio

Motor real ja existente:
- `src/moments/victory.js` expõe `closeVictory(questFileName, scores, reflections, vaultPath, difficulty = {})`

`closeVictory()` ja:
- cria a nota em `victories/`
- atualiza a quest com link para a victory
- atualiza `PROGRESS.md`
- limpa `active-quest.json`

O fluxo debug deve reutilizar isso.

### Divergencia importante no codigo atual

Hoje existem dois caminhos de `victory`:
- `src/commands/victory.js` usa infraestrutura legado em `src/workspace/config.js` e tem logica propria de analise/persistencia
- `src/moments/victory.js` usa `services/vault.js`, `services/state.js` e possui testes mais aderentes ao PRD/arquitetura recente

Para o fluxo debug desta story, a referencia correta e `src/moments/victory.js`.

Nao copiar a logica de `src/commands/victory.js` para dentro do debug.

### Payload de `victory` proposto

Formato minimo sugerido:

```js
{
  reflections: {
    'Impacto de negócio': 'O fluxo ficou mais rapido para validar comportamento real',
    'Decisão arquitetural': 'Separar estado debug do fluxo normal do setup',
    'Uso de IA': 'Usei a IA para estruturar o payload e revisar o resultado',
    'Novo aprendizado': 'A fonte de verdade do setup deve continuar em services/config.js',
    'Faria diferente': 'Unificaria os fluxos legados e novos mais cedo'
  },
  scores: {
    business: 7.0,
    architecture: 8.0,
    ai_orchestration: 6.0
  }
}
```

Regras:
- o payload e exibido integralmente antes da aprovacao
- o operador pode editar reflexoes e respostas
- a story deve decidir como os scores entram no fluxo debug: defaults plausiveis, payload editavel ou regras simples de derivacao
- o payload aprovado alimenta `closeVictory()`

### Quest ativa e nome do arquivo

`closeVictory()` recebe `questFileName`, nao o objeto inteiro da quest ativa.

O fluxo debug deve resolver corretamente:
- ler `notePath` de `active-quest.json`
- extrair o basename, ex: `Q001-minha-quest.md`
- passar esse valor para `closeVictory()`

Nao alterar o contrato atual de `active-quest.json` nesta story.

### Visao encadeada final

O acceptance criteria pede observabilidade do fluxo inteiro.

Para esta story, o minimo aceitavel e um resumo final que apresente:
- quest aprovada e arquivo gerado
- relics aprovadas e arquivos/atualizacoes correspondentes
- victory aprovada e arquivo gerado

Esse resumo pode ser textual no terminal, desde que seja suficiente para troubleshooting humano.

### Testes esperados

- `victory` e preparada como ultima etapa do fluxo debug
- payload final e mostrado antes da aprovacao
- operador pode editar antes de confirmar
- `closeVictory()` e chamado com argumentos corretos
- quest, `victories/`, `PROGRESS.md` e `active-quest.json` permanecem compativeis com os testes atuais
- o resumo final encadeado aparece com referencias a `quest`, `relic(s)` e `victory`

### References

- PRD atualizado: [prd.md](../../planning-artifacts/IN001-cli/prd.md)
- Epic 5 / Story 5.4: [epics.md](../../planning-artifacts/IN001-cli/epics.md#story-54-codemasterdebug-gera-victory-e-preserva-visao-encadeada-do-fluxo)
- Story anterior: [5-3-codemaster-debug-gera-uma-ou-mais-relics-com-payload-visivel-e-editavel.md](./5-3-codemaster-debug-gera-uma-ou-mais-relics-com-payload-visivel-e-editavel.md)
- Victory engine real: [src/moments/victory.js](/home/marcodotcastro/RubymineProjects/codemaster/src/moments/victory.js)
- Victory tests: [src/moments/victory.test.js](/home/marcodotcastro/RubymineProjects/codemaster/src/moments/victory.test.js)
- Legacy victory command: [src/commands/victory.js](/home/marcodotcastro/RubymineProjects/codemaster/src/commands/victory.js)
- Active quest state: [src/services/state.js](/home/marcodotcastro/RubymineProjects/codemaster/src/services/state.js)

## Dev Agent Record

### Agent Model Used

gpt-5

### Debug Log References

- `npm test -- src/commands/debug.test.js src/moments/victory.test.js`
- `npm test`

### Completion Notes List

- `src/commands/debug.js` agora sempre encerra o fluxo com `victory`, depois da `quest` e das `relics` opcionais, e falha explicitamente se a quest ativa estiver inconsistente nesse momento.
- O payload final de `victory` inclui reflexoes e scores plausiveis, e pode ser editado integralmente antes da confirmacao final.
- A persistencia continua delegada a `closeVictory()` em `src/moments/victory.js`, preservando o caminho testado de atualizacao da quest, escrita em `victories/`, atualizacao de `PROGRESS.md` e limpeza de `active-quest.json`.
- O fluxo debug agora exibe um resumo final encadeado que relaciona a `quest`, as `relics` geradas e a `victory` com os payloads aprovados, suficiente para troubleshooting humano.
- Suite completa validada sem regressao: `175` testes passando.

### File List

- src/commands/debug.js
- src/commands/debug.test.js

### Change Log

- 2026-03-24: adiciona etapa final de `victory` ao fluxo debug com payload visivel/editavel, fechamento via `closeVictory()` e resumo encadeado final para troubleshooting.
