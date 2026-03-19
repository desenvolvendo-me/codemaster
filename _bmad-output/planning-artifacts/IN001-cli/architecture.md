---
initiative: IN001
domain: cli
status: active
inputDocuments: ["_bmad-output/planning-artifacts/architecture.md"]
---

# Architecture — IN001 CLI

## Stack & Decisões

**Runtime & Linguagem:**
- JavaScript ESM puro (`.js` com `"type": "module"` no package.json)
- Node.js 18+ — sem TypeScript, sem transpilação, sem build step
- Justificativa: solo dev, 2 semanas, ciclo de feedback máximo

**CLI Parsing:**
- `commander.js` — define `codemaster setup` e opções futuras
- Entry point: `bin/codemaster.js` com shebang `#!/usr/bin/env node`

**Prompts Interativos:**
- `@inquirer/prompts` — wizard de setup com select, input, confirm
- 100% ESM-compatível, API moderna com async/await

**Output & Formatação:**
- `chalk` — cores e formatação nos outputs de Legend, Victory e Knowledge
- `console.log` puro para mensagens simples — sem logger adicional

**Filesystem:**
- `fs/promises` (Node built-in) — zero dependência para leitura/escrita de vault e config
- `path` (Node built-in) — resolução de caminhos cross-platform

**Testes:**
- `vitest` — ESM-nativo, zero config, rápido para unit tests das funções de domínio

**Inicialização do projeto:**

```bash
mkdir codemaster && cd codemaster
npm init -y
npm install commander @inquirer/prompts chalk
npm install --save-dev vitest
```

**Distribuição:**
- `npm publish --access public` — escopo `@marcodotcastro`, global
- Versionamento: Semver — `0.1.0` MVP, `1.0.0` pós-validação
- CI/CD: Nenhum no MVP — publicação manual

**Scripts do package.json:**
```json
{
  "scripts": {
    "start": "node bin/codemaster.js",
    "test": "vitest run",
    "test:watch": "vitest",
    "link": "npm link"
  }
}
```

**Config Schema (`~/.codemaster/config.json`):**
```json
{
  "hero": {
    "name": "string",
    "role": "junior|pleno|senior",
    "stack": ["string"],
    "experience_years": "number"
  },
  "dimensions": {
    "business": "1-5",
    "architecture": "1-5",
    "ai_orchestration": "1-5"
  },
  "focus": ["business|architecture|ai_orchestration"],
  "obsidian": {
    "vault_path": "string"
  },
  "agents": {
    "claude_code": "boolean",
    "codex": "boolean"
  },
  "community": {
    "opted_in": "boolean",
    "email": "string|null",
    "phone": "string|null"
  }
}
```

**active-quest.json:**
```json
{
  "id": "Q001",
  "title": "Implementar autenticação JWT",
  "slug": "autenticacao-jwt",
  "notePath": "/path/to/vault/quests/Q001-autenticacao-jwt.md",
  "startedAt": "2026-03-16T10:00:00Z",
  "milestone": 1
}
```

**API da Comunidade:**

| Decisão | Escolha |
|---|---|
| Método | `POST` com payload `{ email, phone, heroName, stack, version }` |
| Timeout | 10 segundos — timeout gracioso |
| Falha de rede | Registra `community.error` no config, não bloqueia fluxo de Victory |
| Segurança | HTTPS obrigatório — requisições HTTP rejeitadas no cliente |

## Estrutura de Arquivos

```
codemaster/
├── README.md
├── package.json                        # "type": "module", bin, scripts
├── .npmignore                          # exclui tests/, templates/obsidian-example/, _bmad-output/
├── .gitignore
├── bin/
│   └── codemaster.js                  # entry point: #!/usr/bin/env node + import src/index.js
├── src/
│   ├── index.js                        # commander: registra setup + fallback
│   ├── commands/
│   │   ├── setup.js                    # FR1–FR9: wizard de onboarding interativo
│   │   └── setup.test.js
│   ├── services/
│   │   ├── config.js                   # readConfig, writeConfig — única porta para config.json
│   │   ├── config.test.js
│   │   ├── state.js                    # readActiveQuest, writeActiveQuest, clearActiveQuest, getNextId
│   │   ├── state.test.js
│   │   ├── vault.js                    # createNote, readNote, updateNote, listNotes — única porta para vault
│   │   ├── vault.test.js
│   │   ├── milestone.js                # detectMilestone, createMilestoneSummary, reorganizeVault
│   │   ├── milestone.test.js
│   │   ├── community.js                # registerMember — único módulo com chamada HTTP
│   │   ├── community.test.js
│   │   ├── git.js                      # getRecentCommits — graceful fallback se não for repo
│   │   └── git.test.js
│   └── utils/
│       ├── frontmatter.js              # generateFrontmatter — pure function, retorna YAML string
│       ├── frontmatter.test.js
│       ├── output.js                   # printSuccess, printError, printEpic, printSection
│       ├── output.test.js
│       ├── slugify.js                  # slugify — pure function: "Minha Quest" → "minha-quest"
│       └── slugify.test.js
└── templates/
    ├── claude-injection.md             # bloco injetado no ~/.claude/CLAUDE.md
    ├── codex-injection.md              # bloco injetado no ~/.codex/instructions.md
    └── obsidian-example/               # FR48: exemplo completo de milestone para onboarding
        ├── README.md
        ├── quests/
        │   └── Q001-exemplo-quest.md
        ├── relics/
        │   └── R001-exemplo-relic.md
        ├── M01-summary.md
        └── KNOWLEDGE-MAP.md
```

**Nota:** Os arquivos em `templates/claude-commands/` pertencem à IN003 (Claude Code). Os arquivos de `src/moments/` pertencem à IN002 (Agent Core) pois contêm lógica de suporte acionada pelos agentes compartilhados.

## Padrões de Implementação

**Nomenclatura de arquivos e diretórios:**
- Todos os arquivos de código: `kebab-case.js` (ex: `active-quest.js`, `vault-manager.js`)
- Arquivos de teste: `nome-do-modulo.test.js` co-locado no mesmo diretório
- Artefatos do Obsidian: `Q{id}-{slug}.md`, `R{id}-{slug}.md`, `M{id}-summary.md`

**Código JavaScript:**
- Funções e variáveis: `camelCase` (ex: `readActiveQuest`, `vaultPath`)
- Constantes de módulo: `UPPER_SNAKE_CASE` (ex: `CODEMASTER_BLOCK_START`)
- Parâmetros de config JSON: `snake_case` (ex: `vault_path`, `opted_in`)

**Campos de frontmatter Obsidian:**
```yaml
---
id: Q001
type: quest       # quest | relic | victory | milestone
title: string
date: YYYY-MM-DD  # ISO 8601 — nunca timestamp Unix
milestone: 1
tags: [codemaster, quest]
relics: []        # lista de IDs linkados
---
```

**PROGRESS.md (enxuto, orientado a links e scores):**
```markdown
# PROGRESS

## Dimensões Atuais
- Negócio: → 5.2 | Arquitetura: ↑ 8.1 | IA: → 6.0

## Milestone 1 — 3/5 victories
- [[Q001-autenticacao-jwt]] | N:↑8.0 A:↑8.5 IA:→5.0
- [[Q002-refatoracao-service]] | N:→5.5 A:↑7.8 IA:→6.2
- [[Q003-integracao-api]] | N:↑7.0 A:→6.0 IA:↑8.0
```

**Padrão async:** sempre `async/await` — sem `.then()/.catch()` chains.

**Exports:** sempre named exports — sem `export default`.

**Organização de imports (ordem obrigatória):**
```js
// 1. Node.js built-ins
import { readFile, writeFile } from 'fs/promises'
import { join, resolve } from 'path'

// 2. Dependências externas
import { input, select } from '@inquirer/prompts'
import chalk from 'chalk'

// 3. Módulos internos (relativos)
import { readConfig } from '../services/config.js'
import { formatOutput } from '../utils/output.js'
```

**Testes:**
- Co-locados com o módulo: `src/services/vault.test.js` ao lado de `src/services/vault.js`
- Nomear testes: `describe('vault', () => { it('should create quest note', ...) })`
- Apenas lógica de domínio pura tem teste — sem testar interações com agente

**Tratamento de erros:**
1. **Erros de usuário** (config ausente, quest não ativa): `throw new Error(message)` capturado no command handler com mensagem amigável via `printError()`
2. **Erros de integração** (vault inacessível, API timeout): `throw` com objeto estruturado `{ code: 'VAULT_NOT_FOUND', message, path }`

**Fronteiras de acesso único:**

| Recurso | Único módulo autorizado |
|---|---|
| `~/.codemaster/config.json` | `services/config.js` |
| `~/.codemaster/active-quest.json` | `services/state.js` |
| Obsidian Vault (paths, arquivos) | `services/vault.js` |
| HTTP externo (API comunidade) | `services/community.js` |
| `git log` e subprocessos | `services/git.js` |
| stdout / stderr | `utils/output.js` |

**Geração de IDs de tracking — via `src/services/state.js`:**
```js
const id = await getNextId('quest')   // retorna "Q001", "Q002"...
const relicId = await getNextId('relic')  // retorna "R001"...
```

**Execução de git — sempre com graceful fallback:**
```js
export function getRecentCommits(limit = 20) {
  try {
    return execSync(`git log --oneline -${limit}`, { encoding: 'utf8' })
  } catch {
    return null  // não está em repo git — silencioso
  }
}
```

**Anti-padrões a evitar:**
- `import config from '../../config.json'` — import direto do JSON
- `console.log()` dentro de `src/services/`
- `export default` em qualquer módulo
- `.then(() => {})` em qualquer arquivo
- Paths de vault hardcodados fora de `vault.js`

**Fronteiras de camada:**
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

Regra: camadas superiores dependem de inferiores — nunca o contrário. `utils/` não importa nada interno.
