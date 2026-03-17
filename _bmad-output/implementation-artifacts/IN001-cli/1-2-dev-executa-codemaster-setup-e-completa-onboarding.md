# Story 1.2: Dev executa codemaster setup e completa onboarding

Status: ready-for-dev

## Story

Como developer (Ricardo),
quero executar `codemaster setup` e ser guiado pelo método CodeMaster,
para que eu entenda o sistema e tenha meu perfil configurado.

## Acceptance Criteria

1. **Dado** que CodeMaster está instalado globalmente ou via npm link
   **Quando** dev executa `codemaster setup`
   **Então** wizard inicia apresentando brevemente os 5 momentos e as 3 dimensões antes de coletar configurações
   **E** wizard coleta: nome de herói, nível (junior/pleno/senior), stack, anos de experiência, auto-avaliação nas 3 dimensões (1–5), foco de evolução, vault_path e agentes instalados
   **E** informação sobre a comunidade é exibida com opção de inscrever agora ou pular
   **E** cada etapa exibe confirmação da ação executada
   **E** `~/.codemaster/config.json` é criado com todos os valores configurados

2. **Dado** que `config.json` já existe
   **Quando** dev executa `codemaster setup` novamente
   **Então** wizard pré-preenche com os valores existentes (modo de reconfiguração)
   **E** dados do vault do Obsidian não são afetados

## Tasks / Subtasks

- [ ] Criar `src/commands/setup.js` — função `setup()` exportada (AC: 1, 2)
  - [ ] Ler config existente via `readConfig()` antes de iniciar wizard (AC: 2)
  - [ ] Exibir apresentação dos 5 momentos e 3 dimensões via `printEpic()` (AC: 1)
  - [ ] Wizard passo 1: coletar nome de herói (default: valor existente) (AC: 1)
  - [ ] Wizard passo 2: coletar nível — select entre `junior`, `pleno`, `senior` (AC: 1)
  - [ ] Wizard passo 3: coletar stack (array de strings, ex: `['JavaScript', 'Ruby']`) (AC: 1)
  - [ ] Wizard passo 4: coletar anos de experiência (number) (AC: 1)
  - [ ] Wizard passo 5: auto-avaliação dimensão negócio 1–5 (AC: 1)
  - [ ] Wizard passo 6: auto-avaliação dimensão arquitetura 1–5 (AC: 1)
  - [ ] Wizard passo 7: auto-avaliação dimensão IA/orquestração 1–5 (AC: 1)
  - [ ] Wizard passo 8: foco de evolução — select entre `business`, `architecture`, `ai_orchestration` (AC: 1)
  - [ ] Wizard passo 9: vault_path — input com validação de existência (AC: 1)
  - [ ] Wizard passo 10: agentes instalados — checkbox `claude_code`, `codex` (AC: 1)
  - [ ] Wizard passo 11: convite comunidade — exibir info e perguntar se inscreve agora ou pula (AC: 1)
  - [ ] Chamar `writeConfig()` com dados coletados (AC: 1)
  - [ ] Chamar `initVault()` de `services/vault.js` (AC: 1, integração com story 1.5)
  - [ ] Exibir confirmação de cada etapa via `printSuccess()` (AC: 1)
- [ ] Criar `src/services/config.js` — `readConfig()` e `writeConfig()` (AC: 1, 2)
  - [ ] `readConfig()`: lê `~/.codemaster/config.json`, retorna `{}` se não existir
  - [ ] `writeConfig(data)`: cria `~/.codemaster/` se não existir, escreve JSON com indent 2
- [ ] Criar `src/utils/output.js` — funções de output formatado
  - [ ] `printSuccess(message)` — chalk verde
  - [ ] `printError(message)` — chalk vermelho
  - [ ] `printEpic(title, body)` — chalk bold/cyan para apresentações
  - [ ] `printSection(title, content)` — chalk para seções
- [ ] Criar `src/commands/setup.test.js` com testes unitários da lógica de config
- [ ] Criar `src/services/config.test.js` — testar readConfig/writeConfig
- [ ] Criar `src/utils/output.test.js` — testar funções puras de formatação

## Dev Notes

### Fronteira de acesso único — REGRA CRÍTICA

`~/.codemaster/config.json` SOMENTE pode ser lido/escrito por `src/services/config.js`.
Nenhum outro módulo acessa o filesystem de config diretamente.

### Schema exato do `config.json`

```json
{
  "hero": {
    "name": "string",
    "role": "junior|pleno|senior",
    "stack": ["string"],
    "experience_years": "number"
  },
  "dimensions": {
    "business": 3,
    "architecture": 3,
    "ai_orchestration": 3
  },
  "focus": ["business|architecture|ai_orchestration"],
  "obsidian": {
    "vault_path": "/caminho/absoluto/para/vault"
  },
  "agents": {
    "claude_code": true,
    "codex": false
  },
  "community": {
    "opted_in": false,
    "email": null,
    "phone": null
  }
}
```

### `src/services/config.js` — implementação de referência

```js
import { readFile, writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { homedir } from 'os'

const CONFIG_DIR = join(homedir(), '.codemaster')
const CONFIG_FILE = join(CONFIG_DIR, 'config.json')

export async function readConfig() {
  try {
    const raw = await readFile(CONFIG_FILE, 'utf8')
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

export async function writeConfig(data) {
  await mkdir(CONFIG_DIR, { recursive: true })
  await writeFile(CONFIG_FILE, JSON.stringify(data, null, 2), 'utf8')
}
```

### `@inquirer/prompts` — API ESM moderna

```js
import { input, select, confirm, checkbox } from '@inquirer/prompts'

// Input com default
const name = await input({ message: 'Seu nome de herói:', default: existingName })

// Select
const role = await select({
  message: 'Seu nível:',
  choices: [
    { name: 'Junior', value: 'junior' },
    { name: 'Pleno', value: 'pleno' },
    { name: 'Senior', value: 'senior' }
  ],
  default: existingRole
})

// Score 1–5
const businessScore = await select({
  message: 'Auto-avaliação Negócio (1–5):',
  choices: [1, 2, 3, 4, 5].map(n => ({ name: String(n), value: n })),
  default: existingScore
})
```

### Tratamento de erros no setup

- Erro de usuário (ex: vault_path inválido): re-perguntar com mensagem amigável — **NÃO** quebrar wizard
- Erro de filesystem: `throw new Error(message)` capturado no command handler com `printError()`
- Formato obrigatório:
```js
// Em setup.js — command handler
export async function setup() {
  try {
    // ... wizard
  } catch (err) {
    printError(`Erro no setup: ${err.message}`)
    process.exit(1)
  }
}
```

### Modo de reconfiguração (AC: 2)

```js
const existing = await readConfig()  // {} se não existe
// Passar como default em cada prompt:
const name = await input({ message: 'Nome de herói:', default: existing.hero?.name ?? '' })
```
O vault **NÃO** é re-inicializado se já existir (idempotência — tratada em story 1.5).

### Convite da comunidade no setup vs. Victory

No setup: apenas informar sobre a comunidade e oferecer inscrição antecipada (FR4).
O fluxo completo de opt-in com email/phone é da story 5.2 (após 3ª Victory).
Se dev aceitar no setup: executar `registerMember()` de `services/community.js` (story 5.2).
Se pular: `config.community = { opted_in: false, email: null, phone: null }`.

### NFR1 — Setup em menos de 5 minutos

Apresentação dos 5 momentos deve ser concisa (máx 10 linhas). Não exibir tutoriais longos.

### Project Structure Notes

- `setup.js` importa de `services/config.js`, `services/vault.js`, `utils/output.js`
- `setup.js` NÃO importa diretamente de `fs/promises` — delega para services
- Testes de `setup.js` testam apenas lógica de montagem do objeto config — não chamadas de IO

### References

- Schema config.json: [architecture.md](../../planning-artifacts/IN001-cli/architecture.md#Config-Schema)
- FR1–FR5, FR9: [prd.md](../../planning-artifacts/IN001-cli/prd.md)
- NFR1: [prd.md](../../planning-artifacts/IN001-cli/prd.md#NFR1)
- Story completa: [epics.md](../../planning-artifacts/IN001-cli/epics.md#Story-1.2)
- Story anterior (fundação): [1-1-inicializar-projeto-com-stack-selecionada.md](./1-1-inicializar-projeto-com-stack-selecionada.md)

## Dev Agent Record

### Agent Model Used

_a preencher_

### Debug Log References

### Completion Notes List

### File List
