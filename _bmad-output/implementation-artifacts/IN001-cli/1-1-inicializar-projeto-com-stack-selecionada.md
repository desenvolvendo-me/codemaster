# Story 1.1: Inicializar Projeto com Stack Selecionada

Status: review

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

- [x] Criar `package.json` com configuração correta (AC: 1, 2)
  - [x] `"name": "codemaster"`, `"version": "0.1.0"`, `"type": "module"`
  - [x] `"bin": {"codemaster": "./bin/codemaster.js"}`
  - [x] Scripts: `start`, `test`, `test:watch`, `link`
  - [x] Dependencies: `commander`, `@inquirer/prompts`, `chalk`
  - [x] DevDependencies: `vitest`
- [x] Criar estrutura de diretórios (AC: 4)
  - [x] `bin/`
  - [x] `src/commands/`
  - [x] `src/moments/`
  - [x] `src/services/`
  - [x] `src/utils/`
  - [x] `templates/claude-commands/`
  - [x] `templates/obsidian-example/`
- [x] Criar `bin/codemaster.js` — entry point com shebang (AC: 1, 3)
  - [x] `#!/usr/bin/env node` na primeira linha
  - [x] Import de `src/index.js`
- [x] Criar `src/index.js` — registra commander com comando `setup` e fallback (AC: 1)
- [x] Criar `.gitignore` com `node_modules/`, `.env`, `~/.codemaster/`
- [x] Criar `.npmignore` excluindo `tests/`, `templates/obsidian-example/`, `_bmad-output/`
- [x] Executar `npm install` e verificar que dependências estão instaladas corretamente (AC: 2)
- [x] Verificar que `npm link` funciona e `codemaster` está disponível no PATH (AC: 3)

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

claude-sonnet-4-6

### Debug Log References

### Completion Notes List

- Projeto já estava em v0.2.1 com código funcional; a story alinhou ao spec da arquitetura
- `package.json`: adicionado `commander`, `@inquirer/prompts`, `vitest`; adicionados scripts `test`, `test:watch`, `link`; adicionado `templates/` à lista de `files`
- `bin/codemaster.js`: simplificado para `import '../src/index.js'` (commander faz o parse)
- `src/index.js`: substituído parser customizado por `commander`; todos os 5 comandos registrados; bridge mantém compatibilidade com funções existentes
- `.gitignore`: adicionado `.env`
- `.npmignore`: atualizado com `_bmad-output/`, `_bmad/`, `.claude/`, `.agents/`, `spec/`, `docs/`, `*.test.js`
- Diretórios criados: `src/services/`, `src/utils/`, `src/moments/`, `templates/claude-commands/`, `templates/obsidian-example/`
- `src/workspace/` mantida pois ainda é referenciada pelos comandos existentes (migração para `src/services/` ocorre nas stories 1.2 e 1.5)
- Nota: nome do pacote mantido como `@marcodotcastro/codemaster` (spec da arquitetura) em vez de `codemaster` simples (divergência na story)

### File List

- package.json
- package-lock.json
- bin/codemaster.js
- src/index.js
- src/moments/.gitkeep
- src/services/ (diretório)
- src/utils/ (diretório)
- templates/claude-commands/.gitkeep
- templates/obsidian-example/ (diretório)
- .gitignore
- .npmignore
