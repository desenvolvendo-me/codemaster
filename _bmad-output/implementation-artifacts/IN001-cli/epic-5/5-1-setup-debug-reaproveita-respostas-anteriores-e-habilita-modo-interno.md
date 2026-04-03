# Story 5.1: Setup debug reaproveita respostas anteriores e habilita modo interno

Status: review

## Story

Como developer validando o CodeMaster,
quero executar `codemaster setup -debug` reutilizando o contexto anterior do setup,
para que eu prepare rapidamente o ambiente de teste sem repetir todo o onboarding manualmente.

## Acceptance Criteria

1. **Dado** que `~/.codemaster/config.json` ja existe com respostas anteriores do setup
   **Quando** dev executa `codemaster setup -debug`
   **Então** o sistema reutiliza as ultimas respostas conhecidas das perguntas iniciais
   **E** o modo debug e habilitado sem criar uma configuracao paralela para o uso normal
   **E** o setup continua exibindo confirmacoes claras das acoes executadas

2. **Dado** que o modo debug foi habilitado
   **Quando** o setup termina com sucesso
   **Então** o sistema persiste estado interno suficiente para permitir o uso de `codemaster:debug`
   **E** o comportamento normal do produto permanece inalterado para quem nao ativar `-debug`

## Tasks / Subtasks

- [x] Task 1: Adicionar suporte ao argumento oculto de debug no entrypoint CLI (AC: 1, 2)
  - [x] Atualizar `src/index.js` para permitir `codemaster setup -debug` sem quebrar `codemaster setup`
  - [x] Decidir a estrategia de parsing mais segura com `commander.js` para aceitar exatamente `-debug`
  - [x] Garantir fallback compatível se `commander` exigir uma opcao adicional equivalente para implementacao interna

- [x] Task 2: Estender o fluxo de setup para reconhecer e propagar o modo debug (AC: 1, 2)
  - [x] Atualizar `src/commands/setup.js` para receber sinalizacao de debug no handler
  - [x] Reaproveitar respostas existentes do config sem reabrir o onboarding completo quando em modo debug
  - [x] Manter o comportamento atual de reconfiguracao para execucoes sem debug

- [x] Task 3: Persistir estado interno de debug no config existente (AC: 1, 2)
  - [x] Definir schema minimo para marcar debug habilitado dentro do `config.json` existente
  - [x] Garantir que a persistencia nao crie arquivo paralelo nem quebre compatibilidade com comandos atuais
  - [x] Documentar claramente o contrato esperado para a futura story `5.2` consumir esse estado

- [x] Task 4: Preservar compatibilidade com setup atual e inicializacao de workspace (AC: 1, 2)
  - [x] Garantir que `writeConfig(config)` continue salvando o schema atual com backward compatibility
  - [x] Garantir que `initVault(vaultPath)` e `initWorkspace(config)` continuem funcionando em execucoes com e sem debug
  - [x] Confirmar que o setup debug nao altera o comportamento normal de injecao em Claude/Codex quando nao solicitado

- [x] Task 5: Cobertura de testes para setup debug e persistencia (AC: 1, 2)
  - [x] Atualizar `src/commands/setup.test.js` para cobrir configuracao com debug habilitado
  - [x] Atualizar `src/services/config.test.js` para validar persistencia do estado debug sem regressao do schema atual
  - [x] Adicionar testes para confirmar que execucao normal continua sem sinalizacao de debug

## Dev Notes

### Contexto funcional relevante

- O PRD da `IN001` agora define:
  - `FR6`: `codemaster setup -debug` como modo oculto de testabilidade interna
  - `FR7`: reaproveitamento das ultimas respostas conhecidas do setup
  - `FR8`: persistencia de estado interno suficiente para habilitar `codemaster:debug`
  - `NFR8`: reutilizar `config.json` existente sem quebrar compatibilidade
  - `NFR10`: nao alterar o comportamento do fluxo normal para quem nao ativar `-debug`

### Arquivos principais a revisar

| Arquivo | Papel nesta story |
|---|---|
| `src/index.js` | entrypoint do CLI; registra `setup` via `commander` |
| `src/commands/setup.js` | fluxo atual do setup, reconfiguracao e escrita do config |
| `src/services/config.js` | porta oficial de leitura/escrita de `~/.codemaster/config.json` |
| `src/commands/setup.test.js` | testes da montagem de config |
| `src/services/config.test.js` | testes de persistencia do config |

### Guardrail critico: nao criar nova fonte de verdade

Existe duplicidade no projeto:
- `src/services/config.js`
- `src/workspace/config.js`

Para esta story, a fonte de verdade do setup continua sendo `src/services/config.js`, porque:
- o PRD/arquitetura define `services/config.js` como unica porta autorizada para `config.json`
- `setup.js` ja usa `readConfig()` e `writeConfig()` de `src/services/config.js`

Nao introduza um terceiro caminho de persistencia. Se houver necessidade de alinhamento com `src/workspace/config.js`, trate como compatibilidade tecnica, nao como nova autoridade de escrita.

### Estado de debug proposto

Esta story nao implementa ainda `codemaster:debug`. Ela apenas precisa deixar o estado pronto para a story seguinte.

Schema minimo sugerido dentro do `config.json` existente:

```json
{
  "debug": {
    "enabled": true,
    "setup_reused": true,
    "enabled_at": "2026-03-19T12:00:00.000Z"
  }
}
```

Regras:
- `debug` e opcional; ausencia significa modo normal
- nao mover campos existentes
- nao quebrar `hero`, `dimensions`, `focus`, `obsidian`, `agents`, `community`, `dev`, `levels`, `vault`

### Comportamento esperado do setup debug

- Se houver config existente, `setup -debug` deve reaproveitar o contexto anterior como base
- O fluxo pode ser encurtado, mas nao pode apagar comportamento necessario de inicializacao
- Confirmacoes no terminal devem continuar visiveis
- O resultado final deve deixar claro que o ambiente esta preparado para a proxima etapa (`codemaster:debug`)

### Risco tecnico principal

O maior risco aqui e o parsing do argumento `-debug` no `commander.js`, porque o formato pedido pelo produto nao e o padrao mais comum de opcao longa.

O dev deve:
- validar como o `commander` atual se comporta com esse formato
- escolher a implementacao que preserve a UX pedida
- evitar hacks que fragilizem outros comandos

### Regressao a evitar

- Nao quebrar `codemaster setup` sem debug
- Nao quebrar reconfiguracao com defaults existentes
- Nao quebrar `writeConfig()` nem alterar o contrato esperado pelos comandos atuais
- Nao alterar fluxos de vault, injector ou workspace fora do necessario para a story

### References

- PRD atualizado: [prd.md](../../planning-artifacts/IN001-cli/prd.md)
- Epic 5 / Story 5.1: [epics.md](../../planning-artifacts/IN001-cli/epics.md#story-51-setup-debug-reaproveita-respostas-anteriores-e-habilita-modo-interno)
- Story de setup original: [1-2-dev-executa-codemaster-setup-e-completa-onboarding.md](../epic-1/1-2-dev-executa-codemaster-setup-e-completa-onboarding.md)
- Arquitetura CLI: [architecture.md](../../planning-artifacts/IN001-cli/architecture.md)
- Entry point atual: [src/index.js](/home/marcodotcastro/RubymineProjects/codemaster/src/index.js)
- Setup atual: [src/commands/setup.js](/home/marcodotcastro/RubymineProjects/codemaster/src/commands/setup.js)
- Config service oficial: [src/services/config.js](/home/marcodotcastro/RubymineProjects/codemaster/src/services/config.js)
- Config auxiliar legado: [src/workspace/config.js](/home/marcodotcastro/RubymineProjects/codemaster/src/workspace/config.js)

## Dev Agent Record

### Agent Model Used

gpt-5

### Debug Log References

- `npm test -- src/commands/setup.test.js src/services/config.test.js`
- `npm test`

### Completion Notes List

- `src/index.js` normaliza `setup -debug` para `--debug` antes do parse e registra a opcao oculta via `commander`, preservando `codemaster setup` sem debug.
- `src/commands/setup.js` agora aceita `setup({ debug: true })`, reaproveita `config.json` existente sem reabrir onboarding e persiste `debug.enabled`, `debug.setup_reused` e `debug.enabled_at`.
- O contrato deixado para a story `5.2` e consumir `config.debug.enabled === true` como gate de habilitacao e `config.debug.setup_reused`/`config.debug.enabled_at` como contexto adicional de execucao.
- `src/services/config.js` continua como unica porta de escrita do `~/.codemaster/config.json`; nenhum arquivo paralelo foi criado.
- Suite completa validada sem regressao: `161` testes passando.

### File List

- src/index.js
- src/commands/setup.js
- src/commands/setup.test.js
- src/services/config.test.js

### Change Log

- 2026-03-24: adiciona modo oculto `setup -debug`, reaproveitamento de config existente, persistencia do estado interno de debug e cobertura de testes associada.
