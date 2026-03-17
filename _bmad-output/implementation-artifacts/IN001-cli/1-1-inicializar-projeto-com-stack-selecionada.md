# Story 1.1: Inicializar Projeto com Stack Selecionada

Status: ready-for-dev

## Story

Como developer implementando o CodeMaster,
quero o projeto inicializado com a stack correta e estrutura de diretórios,
para que todas as histórias seguintes tenham uma fundação consistente e executável.

## Acceptance Criteria

1. **Dado** que Node.js 18+ está instalado
   **Quando** developer executa `npm install -g codemaster`
   **Então** pacote é instalado globalmente e comando `codemaster` fica disponível em qualquer diretório

2. **Dado** que o projeto está sendo desenvolvido localmente
   **Quando** developer executa `npm install` no diretório do projeto
   **Então** `commander`, `@inquirer/prompts` e `chalk` são instalados; `vitest` como devDependency
   **E** `package.json` tem `"type": "module"`, `"name": "codemaster"`, `"bin": {"codemaster": "./bin/codemaster.js"}` e scripts `start`, `test`, `test:watch`, `link`

3. **Dado** que o projeto está inicializado localmente
   **Quando** developer executa `npm link`
   **Então** comando `codemaster` resolve para o projeto local para desenvolvimento

4. Estrutura de diretórios existe: `bin/`, `src/commands/`, `src/moments/`, `src/services/`, `src/utils/`, `templates/claude-commands/`, `templates/obsidian-example/`

## Tasks / Subtasks

- [ ] Criar `package.json` com configuração correta (AC: 1, 2)
  - [ ] `"name": "codemaster"`, `"version": "0.1.0"`, `"type": "module"`
  - [ ] `"bin": {"codemaster": "./bin/codemaster.js"}`
  - [ ] Scripts: `start`, `test`, `test:watch`, `link`
  - [ ] Dependencies: `commander`, `@inquirer/prompts`, `chalk`
  - [ ] DevDependencies: `vitest`
- [ ] Criar estrutura de diretórios (AC: 4)
  - [ ] `bin/`
  - [ ] `src/commands/`
  - [ ] `src/moments/`
  - [ ] `src/services/`
  - [ ] `src/utils/`
  - [ ] `templates/claude-commands/`
  - [ ] `templates/obsidian-example/`
- [ ] Criar `bin/codemaster.js` — entry point com shebang (AC: 1, 3)
  - [ ] `#!/usr/bin/env node` na primeira linha
  - [ ] Import de `src/index.js`
- [ ] Criar `src/index.js` — registra commander com comando `setup` e fallback (AC: 1)
- [ ] Criar `.gitignore` com `node_modules/`, `.env`, `~/.codemaster/`
- [ ] Criar `.npmignore` excluindo `tests/`, `templates/obsidian-example/`, `_bmad-output/`
- [ ] Executar `npm install` e verificar que dependências estão instaladas corretamente (AC: 2)
- [ ] Verificar que `npm link` funciona e `codemaster` está disponível no PATH (AC: 3)

## Dev Notes

### Stack obrigatória (sem desvios)

- **Runtime:** JavaScript ESM puro — `"type": "module"` no `package.json`. **Zero TypeScript, zero build step, zero transpilação.**
- **CLI Parsing:** `commander.js` — entry point em `bin/codemaster.js`
- **Node.js:** 18+ obrigatório (ESM nativo)
- Nunca usar `require()` — usar apenas `import`/`export` ESM

### Entry point crítico

`bin/codemaster.js` deve ter exatamente:
```js
#!/usr/bin/env node
import '../src/index.js'
```
O shebang `#!/usr/bin/env node` DEVE ser a primeira linha — sem espaço antes, sem BOM.

### `src/index.js` — padrão commander

```js
// 1. Node.js built-ins primeiro
// 2. Dependências externas
import { Command } from 'commander'
// 3. Módulos internos
import { setup } from './commands/setup.js'

const program = new Command()

program
  .name('codemaster')
  .description('AI Engineer Evolution Agent')
  .version('0.1.0')

program
  .command('setup')
  .description('Configura o CodeMaster e inicializa o vault')
  .action(setup)

program.parse()
```

### Convenções de código (obrigatórias em TODO o projeto)

| Elemento | Padrão |
|---|---|
| Arquivos de código | `kebab-case.js` (ex: `active-quest.js`) |
| Arquivos de teste | `nome-do-modulo.test.js` co-locado no mesmo diretório |
| Funções/variáveis JS | `camelCase` |
| Constantes de módulo | `UPPER_SNAKE_CASE` |
| Parâmetros JSON | `snake_case` |

### Ordem de imports (obrigatória)

```js
// 1. Node.js built-ins
import { readFile, writeFile } from 'fs/promises'
import { join, resolve } from 'path'

// 2. Dependências externas
import { input, select } from '@inquirer/prompts'
import chalk from 'chalk'

// 3. Módulos internos (relativos)
import { readConfig } from '../services/config.js'
```

### Exports — named exports SEMPRE

```js
// CORRETO
export function setup() { ... }
export { readConfig, writeConfig }

// ERRADO — nunca usar
export default function setup() { ... }
```

### `.npmignore` — arquivos a excluir do pacote

```
tests/
_bmad-output/
.claude/
*.test.js
```
**IMPORTANTE:** `templates/obsidian-example/` NÃO deve ser listado no `.npmignore` — os exemplos devem ser incluídos no pacote npm (FR48).

### Fronteira de camadas (regra arquitetural)

```
CLI entry (bin/)
    ↓
Commander (src/index.js)
    ↓
Commands (src/commands/)       ← wizard setup
    ↓
Services (src/services/)       ← IO: filesystem, HTTP, git
    ↓
Utils (src/utils/)             ← funções puras: sem IO, sem estado
```
`utils/` não importa nada interno. Camadas superiores dependem de inferiores — NUNCA o contrário.

### Anti-padrões a evitar (bloqueantes)

- `import config from '../../config.json'` — import direto de JSON
- `console.log()` dentro de `src/services/` (usar `utils/output.js`)
- `export default` em qualquer módulo
- `.then(() => {})` — usar sempre `async/await`
- Paths de vault hardcodados fora de `vault.js`

### Project Structure Notes

- `src/moments/` é criado aqui mas os arquivos pertencem à IN002 (Claude Code) — criar pasta vazia com `.gitkeep`
- `templates/claude-commands/` idem — pertence à IN002
- Esta story cria a FUNDAÇÃO — as stories subsequentes dependem desta estrutura

### Testes

- Nesta story não há lógica de domínio para testar — apenas estrutura e configuração
- Verificar: `node bin/codemaster.js --version` retorna `0.1.0`
- Verificar: `node bin/codemaster.js --help` lista o comando `setup`

### References

- Stack e estrutura de arquivos: [architecture.md](../../planning-artifacts/IN001-cli/architecture.md)
- Requisitos FR1: [prd.md](../../planning-artifacts/IN001-cli/prd.md#FR1)
- Story completa: [epics.md](../../planning-artifacts/IN001-cli/epics.md#Story-1.1)

## Dev Agent Record

### Agent Model Used

_a preencher_

### Debug Log References

### Completion Notes List

### File List
