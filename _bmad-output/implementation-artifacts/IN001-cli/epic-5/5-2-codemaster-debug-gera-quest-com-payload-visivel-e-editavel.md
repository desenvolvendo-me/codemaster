# Story 5.2: codemaster:debug gera quest com payload visivel e editavel

Status: review

## Story

Como developer testando o fluxo real do CodeMaster,
quero iniciar `codemaster:debug` gerando primeiro uma `quest` com payload visivel e editavel,
para que eu valide a entrada enviada ao agente antes de criar o artefato no vault.

## Acceptance Criteria

1. **Dado** que o modo debug esta habilitado
   **Quando** dev executa `codemaster:debug`
   **Então** o fluxo inicia obrigatoriamente pela geracao de `quest`
   **E** o sistema exibe as perguntas e respostas que serao enviadas ao agente
   **E** dev pode editar manualmente esse payload antes da aprovacao
   **E** apos aprovacao a `quest` e gerada e registrada de forma compativel com o fluxo normal

## Tasks / Subtasks

- [x] Task 1: Registrar o novo comando `codemaster:debug` no canal correto de agente/skill (AC: 1)
  - [x] Atualizar a injecao de agentes/skills para expor `codemaster:debug` somente dentro dos agentes
  - [x] Garantir que o fluxo falhe com mensagem clara quando o modo debug nao estiver habilitado no config
  - [x] Manter isolamento para que `quest`, `relic`, `victory` e `setup` continuem funcionando como hoje

- [x] Task 2: Criar handler do fluxo debug focado na etapa de quest (AC: 1)
  - [x] Criar `src/commands/debug.js` como orquestrador inicial do fluxo
  - [x] Ler o config existente e validar o estado persistido pela story `5.1`
  - [x] Encadear apenas a etapa de `quest` nesta story, deixando `relic(s)` e `victory` para stories seguintes

- [x] Task 3: Definir e exibir o payload de quest antes do envio (AC: 1)
  - [x] Estruturar um payload minimo contendo nome da missao, perguntas previstas e respostas previstas
  - [x] Exibir esse payload em formato humano-legivel no terminal antes da aprovacao
  - [x] Garantir que o payload reflita o conteudo que sera efetivamente usado para gerar a `quest`

- [x] Task 4: Permitir edicao manual do payload antes da execucao (AC: 1)
  - [x] Permitir ao operador ajustar o titulo da missao
  - [x] Permitir ao operador ajustar perguntas e respostas previstas antes da aprovacao
  - [x] Confirmar explicitamente o envio/execucao apos a revisao

- [x] Task 5: Gerar a quest usando a infraestrutura real existente (AC: 1)
  - [x] Reutilizar `createQuest()` de `src/moments/quest.js` em vez de duplicar logica de criacao de nota
  - [x] Garantir que `active-quest.json` continue sendo escrito pelo caminho atual em `src/services/state.js`
  - [x] Garantir que a nota criada em `quests/` mantenha formato compativel com o fluxo normal

- [x] Task 6: Cobertura de testes para o comando debug e a etapa de quest (AC: 1)
  - [x] Criar `src/commands/debug.test.js`
  - [x] Testar erro quando debug nao estiver habilitado no config
  - [x] Testar exibicao de payload antes da aprovacao
  - [x] Testar caminho de aprovacao e criacao de `quest` via infraestrutura real
  - [x] Confirmar que o schema de `active-quest.json` nao e quebrado

## Dev Notes

### Escopo desta story

Esta story cobre somente:
- entrada do comando `codemaster:debug`
- validacao do estado debug habilitado
- etapa inicial de `quest`
- exibicao e edicao do payload antes da execucao

Nao cobre ainda:
- geracao de `relics`
- geracao de `victory`
- visao encadeada completa do fluxo
- variabilidade entre execucoes como regra isolada de qualidade

Esses pontos pertencem as stories `5.3`, `5.4` e `5.5`.

### Reuso obrigatorio

Nao reinventar fluxo de quest.

Infraestrutura real ja existente:
- `src/moments/quest.js` expõe `createQuest(title, vaultPath, milestone = 1, plannedDifficulty = null)`
- `createQuest()` ja:
  - cria nota em `quests/`
  - gera frontmatter
  - grava `active-quest.json`
  - retorna `{ id, notePath }`

Esta story deve orquestrar o payload e a aprovacao antes da chamada, nao reimplementar criacao de nota.

### Arquivos principais a revisar

| Arquivo | Papel nesta story |
|---|---|
| `src/commands/debug.js` | handler reutilizavel da etapa de quest do fluxo debug |
| `src/services/injector.js` | injecao do skill/agente `codemaster:debug` |
| `_codemaster/skills/codemaster-debug/SKILL.md` | ativacao da skill debug nos agentes |
| `_codemaster/agents/debug.md` | roteiro interativo do fluxo debug |
| `src/moments/quest.js` | reuso da criacao real de quest |
| `src/moments/quest.test.js` | referencia do contrato atual da quest |
| `src/services/config.js` | leitura do estado debug |
| `src/services/state.js` | contrato atual do `active-quest.json` |

### Contrato atual que nao pode quebrar

`createQuest()` hoje escreve `active-quest.json` com:

```json
{
  "id": "Q001",
  "title": "Minha quest",
  "slug": "minha-quest",
  "notePath": "quests/Q001-minha-quest.md",
  "startedAt": "2026-03-19T12:00:00.000Z",
  "milestone": 1
}
```

Se houver `plannedDifficulty`, o campo `plannedDifficulty` tambem e persistido.

Nao alterar esse contrato nesta story.

### Payload de quest proposto

O PRD exige que perguntas e respostas sejam exibidas antes do envio ao agente. Como o fluxo atual de `createQuest()` nao recebe perguntas/respostas, esta story deve introduzir um payload operacional do debug que seja mostrado e editado no terminal antes da criacao da quest.

Formato minimo sugerido:

```js
{
  missionTitle: 'Implementar validacao de webhook',
  questions: [
    'Qual o objetivo principal da missao?',
    'Qual risco tecnico voce quer observar?',
    'Que criterio faria voce considerar esse teste bem-sucedido?'
  ],
  answers: [
    'Validar o fluxo real de entrada e persistencia',
    'Persistencia incorreta do estado',
    'Geracao da nota com active-quest consistente'
  ]
}
```

Regras:
- o payload e exibido integralmente antes da aprovacao
- o operador pode editar os campos
- o titulo final aprovado alimenta `createQuest()`
- perguntas e respostas aprovadas devem ficar disponiveis para as stories seguintes do fluxo debug, mesmo que nesta story ainda nao sejam persistidas em artefato proprio

### Consideracao tecnica importante

Hoje existe `src/commands/quest.js`, mas ele atende ao slash command do agente e nao ao fluxo debug do CLI.

Evitar:
- acoplar a story a prompts do slash command
- mexer em `src/moments/quest.js` sem necessidade
- duplicar regras de slug, frontmatter ou escrita de `active-quest.json`

### Testes esperados

- `debug` falha com mensagem clara se `config.debug.enabled !== true`
- `debug` mostra payload antes de continuar
- operador pode confirmar apos editar payload
- `createQuest()` e chamado com o titulo final aprovado
- nota e `active-quest.json` continuam com formato compativel com os testes atuais de `quest`

### References

- PRD atualizado: [prd.md](../../planning-artifacts/IN001-cli/prd.md)
- Epic 5 / Story 5.2: [epics.md](../../planning-artifacts/IN001-cli/epics.md#story-52-codemasterdebug-gera-quest-com-payload-visivel-e-editavel)
- Story anterior: [5-1-setup-debug-reaproveita-respostas-anteriores-e-habilita-modo-interno.md](./5-1-setup-debug-reaproveita-respostas-anteriores-e-habilita-modo-interno.md)
- Quest implementation: [src/moments/quest.js](/home/marcodotcastro/RubymineProjects/codemaster/src/moments/quest.js)
- Quest tests: [src/moments/quest.test.js](/home/marcodotcastro/RubymineProjects/codemaster/src/moments/quest.test.js)
- CLI entrypoint: [src/index.js](/home/marcodotcastro/RubymineProjects/codemaster/src/index.js)
- Config service: [src/services/config.js](/home/marcodotcastro/RubymineProjects/codemaster/src/services/config.js)
- Active quest state: [src/services/state.js](/home/marcodotcastro/RubymineProjects/codemaster/src/services/state.js)

## Dev Agent Record

### Agent Model Used

gpt-5

### Debug Log References

- `npm test -- src/commands/debug.test.js src/commands/setup.test.js src/moments/quest.test.js src/services/config.test.js`
- `npm test`

### Completion Notes List

- `src/index.js` nao expoe `debug` como subcomando do terminal; a correcao arquitetural foi mover `codemaster:debug` para o canal correto de agente/skill.
- `src/commands/debug.js` permanece como handler reutilizavel da etapa de quest, validando `config.debug.enabled === true`, exibindo payload legivel, permitindo edicao campo a campo e exigindo confirmacao explicita antes da criacao.
- O payload aprovado e persistido em `config.debug.quest_payload`, deixando `missionTitle`, `questions` e `answers` disponiveis para as stories `5.3+`.
- A criacao da quest continua delegada a `createQuest()` em `src/moments/quest.js`; o contrato de `active-quest.json` nao foi alterado.
- `src/services/injector.js`, `templates/claude-injection.md` e `templates/codex-injection.md` agora injetam `codemaster:debug` como skill/agente, sem abrir um comando `codemaster debug` no terminal.
- Validacoes da correcao: `node bin/codemaster.js debug` agora retorna `unknown command 'debug'`, e os testes focados seguem verdes.

### File List

- src/commands/debug.js
- src/commands/debug.test.js
- src/services/injector.js
- src/services/injector.test.js
- templates/claude-injection.md
- templates/codex-injection.md
- _codemaster/skills/codemaster-debug/SKILL.md
- _codemaster/agents/debug.md

### Change Log

- 2026-03-24: adiciona etapa de quest do fluxo `codemaster:debug` com payload visivel/editavel, persistencia do payload aprovado e injecao do skill/agente debug sem expor subcomando no terminal.
