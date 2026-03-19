# Story 5.3: codemaster:debug gera uma ou mais relics com payload visivel e editavel

Status: ready-for-dev

## Story

Como developer validando cenarios intermediarios do fluxo,
quero decidir se gero `relics` e quantas gero, sempre revisando o payload antes de cada envio,
para que eu exercite diferentes caminhos do processo sem perder controle sobre o conteudo enviado ao agente.

## Acceptance Criteria

1. **Dado** que a etapa de `quest` foi concluida no fluxo debug
   **Quando** o sistema avanca para a fase intermediaria
   **Então** ele pergunta explicitamente se dev deseja gerar `relics`
   **E** dev pode optar por nenhuma, uma ou multiplas `relics`

2. **Dado** que dev escolheu gerar uma `relic`
   **Quando** cada `relic` e preparada
   **Então** o sistema exibe o payload correspondente antes do envio ao agente
   **E** dev pode editar manualmente perguntas e respostas antes de aprovar
   **E** cada `relic` aprovada e salva no vault em formato valido

## Tasks / Subtasks

- [ ] Task 1: Estender `codemaster:debug` para a fase intermediaria de `relics` (AC: 1, 2)
  - [ ] Atualizar `src/commands/debug.js` para perguntar explicitamente se o operador deseja gerar `relics`
  - [ ] Permitir que o operador escolha nenhuma, uma ou multiplas `relics`
  - [ ] Encadear cada `relic` como subetapa aprovada individualmente

- [ ] Task 2: Definir o payload operacional de cada `relic` (AC: 2)
  - [ ] Estruturar payload minimo com dimensao, descoberta prevista, perguntas auxiliares e respostas previstas
  - [ ] Exibir o payload integralmente no terminal antes da aprovacao
  - [ ] Garantir que o payload exibido seja o mesmo efetivamente usado para gerar a `relic`

- [ ] Task 3: Permitir edicao manual do payload de `relic` antes da execucao (AC: 2)
  - [ ] Permitir ajuste do texto da descoberta
  - [ ] Permitir ajuste da dimensao selecionada
  - [ ] Permitir ajuste das perguntas e respostas previstas antes da aprovacao

- [ ] Task 4: Reutilizar a infraestrutura real de `relic` sem duplicar logica (AC: 2)
  - [ ] Reutilizar `addRelic()` de `src/moments/relic.js` como motor principal da persistencia
  - [ ] Resolver corretamente o `questFileName` a partir da quest ativa criada no fluxo anterior
  - [ ] Decidir, documentar e implementar o criterio de `archiveToRelics` para o modo debug

- [ ] Task 5: Garantir consistencia entre quest ativa e multiplas `relics` (AC: 1, 2)
  - [ ] Validar que a `quest` ativa existe antes de iniciar a geracao de `relics`
  - [ ] Garantir acumulacao correta de IDs `R001`, `R002`, ... no frontmatter e no arquivo da quest
  - [ ] Garantir que multiplas `relics` no mesmo fluxo nao corrompam a nota nem o array `relics`

- [ ] Task 6: Cobertura de testes para a fase de `relics` no fluxo debug (AC: 1, 2)
  - [ ] Criar ou atualizar `src/commands/debug.test.js` para cobrir a bifurcacao "gerar ou nao gerar relics"
  - [ ] Cobrir uma execucao com zero `relics`
  - [ ] Cobrir uma execucao com uma `relic`
  - [ ] Cobrir uma execucao com multiplas `relics`
  - [ ] Garantir que os testes existentes de `src/moments/relic.test.js` continuem validos

## Dev Notes

### Escopo desta story

Esta story cobre apenas a fase intermediaria do fluxo debug:
- perguntar se o operador deseja gerar `relics`
- permitir zero, uma ou multiplas `relics`
- exibir/editar payload antes de cada envio
- persistir as `relics` na infraestrutura real

Nao cobre ainda:
- etapa final de `victory`
- visao encadeada completa entre todas as etapas
- variabilidade entre execucoes como comportamento transversal

Esses pontos pertencem as stories `5.4` e `5.5`.

### Reuso obrigatorio

Motor real ja existente:
- `src/moments/relic.js` expõe `addRelic(discovery, dimension, vaultPath, questFileName, archiveToRelics = false)`

`addRelic()` ja:
- le a nota da quest
- atualiza frontmatter com `relics`
- adiciona secao `## Relic Rxxx`
- opcionalmente cria arquivo em `relics/`

O fluxo debug deve reutilizar isso.

### Divergencia importante no codigo atual

Hoje existem dois caminhos de `relic`:
- `src/commands/relic.js` usa infraestrutura legado em `src/workspace/config.js`
- `src/moments/relic.js` usa `services/vault.js`, `parseFrontmatter()` e `generateFrontmatter()`

Para o fluxo debug desta story, a referencia correta e `src/moments/relic.js`, porque:
- o PRD/arquitetura atual apontam para a infraestrutura de vault e estado da iniciativa
- `addRelic()` tem contrato testado e mais compativel com o formato atual das notas

Nao reimplementar o fluxo legado de `src/commands/relic.js` dentro do debug.

### Payload de `relic` proposto

Formato minimo sugerido:

```js
{
  dimension: 'Arquitetural',
  discovery: 'Separar validacao de estado debug da logica de setup normal',
  questions: [
    'Qual descoberta vale registrar nesta etapa?',
    'Em qual dimensao esta descoberta se encaixa?',
    'Por que esta descoberta importa para o teste?'
  ],
  answers: [
    'A flag de debug nao pode contaminar o fluxo normal',
    'Arquitetural',
    'Porque afeta persistencia e previsibilidade do setup'
  ]
}
```

Regras:
- o payload e exibido integralmente antes da aprovacao
- o operador pode editar os campos
- `dimension` e `discovery` aprovados alimentam `addRelic()`
- perguntas e respostas aprovadas ficam disponiveis para a visao encadeada posterior, mesmo que esta story ainda nao as persista em artefato proprio

### Quest ativa e nome do arquivo

`addRelic()` recebe `questFileName`, nao apenas `active-quest.json`.

O fluxo debug deve resolver corretamente esse nome a partir do estado ativo:
- `active-quest.json` atual guarda `notePath`, ex: `quests/Q001-minha-quest.md`
- extrair o basename do `notePath` e passar para `addRelic()`

Nao alterar o contrato atual de `active-quest.json` nesta story.

### Decisao sobre `archiveToRelics`

Esta story precisa tomar uma decisao pragmatica:
- ou toda `relic` do debug arquiva tambem em `relics/`
- ou o debug permite configurar isso por heuristica/confirmacao

Recomendacao:
- manter o criterio simples e previsivel no MVP
- documentar claramente a regra escolhida no codigo e nos testes

### Testes esperados

- se o operador escolher nao gerar `relics`, o fluxo segue sem erro
- se escolher gerar `1`, a `relic` e persistida corretamente
- se escolher gerar `n`, os IDs e a quest sao atualizados corretamente
- payload e mostrado antes de cada `relic`
- o operador pode editar antes da aprovacao
- regressao zero nos testes de `addRelic()`

### References

- PRD atualizado: [prd.md](../../planning-artifacts/IN001-cli/prd.md)
- Epic 5 / Story 5.3: [epics.md](../../planning-artifacts/IN001-cli/epics.md#story-53-codemasterdebug-gera-uma-ou-mais-relics-com-payload-visivel-e-editavel)
- Story anterior: [5-2-codemaster-debug-gera-quest-com-payload-visivel-e-editavel.md](./5-2-codemaster-debug-gera-quest-com-payload-visivel-e-editavel.md)
- Relic engine real: [src/moments/relic.js](/home/marcodotcastro/RubymineProjects/codemaster/src/moments/relic.js)
- Relic tests: [src/moments/relic.test.js](/home/marcodotcastro/RubymineProjects/codemaster/src/moments/relic.test.js)
- Legacy relic command: [src/commands/relic.js](/home/marcodotcastro/RubymineProjects/codemaster/src/commands/relic.js)
- Active quest state: [src/services/state.js](/home/marcodotcastro/RubymineProjects/codemaster/src/services/state.js)

## Dev Agent Record

### Agent Model Used

gpt-5

### Debug Log References

### Completion Notes List

### File List

- src/commands/debug.js
- src/commands/debug.test.js
- src/moments/relic.js
- src/moments/relic.test.js
- src/services/state.js
