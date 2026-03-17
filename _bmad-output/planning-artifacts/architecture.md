---
stepsCompleted: [1, 2, 3, 4, 5, 6]
inputDocuments: ["_bmad-output/planning-artifacts/prd.md", "_bmad-output/planning-artifacts/product-brief-codemaster-2026-03-16.md"]
workflowType: 'architecture'
project_name: 'codemaster'
user_name: 'Code Master'
date: '2026-03-16'
---

# Architecture Decision Document

_Este documento é construído colaborativamente passo a passo. Seções são adicionadas conforme avançamos nas decisões arquiteturais juntos._

## Análise de Contexto do Projeto

### Visão Geral dos Requisitos

**Requisitos Funcionais (49 FRs em 8 áreas):**

| Área | FRs | Implicação Arquitetural |
|---|---|---|
| Setup & Onboarding | FR1–FR9 | Wizard CLI interativo + injeção idempotente em agentes |
| Gestão de Quest | FR10–FR18 | Leitura/escrita de active-quest.json + criação de nota Obsidian |
| Ciclo de Victory | FR19–FR28 | Avaliação por tendências + milestone detection + opt-in de comunidade |
| Milestone & Progressão | FR29–FR32 | Máquina de estados + reorganização de pastas + atualização de KNOWLEDGE-MAP.md |
| Legend | FR33–FR35 | Leitura do PROGRESS.md + formatação de output para agente |
| Knowledge | FR36–FR39 | Leitura completa do vault + geração/atualização do KNOWLEDGE-MAP.md |
| Integração com Agentes | FR40–FR42 | Injeção em CLAUDE.md + slash commands + Codex skills |
| Persistência & Docs | FR43–FR49 | Geração de frontmatter + estrutura de pastas + exemplos de milestone |

**Requisitos Não-Funcionais que moldam a arquitetura:**

- **Performance:** setup <5min, vault ops <3s, active-quest.json <100ms (NFR1–NFR4)
- **Segurança:** opt-in explícito, HTTPS obrigatório, append-only na injeção, sem credenciais em config (NFR5–NFR9)
- **Integração:** filesystem-only para Obsidian, compatibilidade com formatos de comando Claude/Codex, timeout gracioso na API da comunidade (NFR10–NFR14)

**Escala & Complexidade:**

- Domínio primário: CLI Tool + Agent Integration
- Complexidade: Média (sem servidor, mas com estado distribuído e integrações em agentes)
- Componentes arquiteturais estimados: 6 (CLI core, command handlers, agent injector, vault manager, state manager, community client)

### Restrições Técnicas & Dependências

- **Runtime:** Node.js 18+ / ESM puro — sem transpilação, sem CommonJS
- **Distribuição:** npm global — `bin/codemaster` acessível em qualquer diretório
- **Persistência:** Filesystem exclusivo — `~/.codemaster/` (estado) + Obsidian Vault (memória de aprendizado)
- **Rede:** Zero chamadas externas exceto opt-in de comunidade (HTTPS → API externa)
- **Agentes:** Claude Code e Codex via filesystem — sem SDKs, sem APIs de agente
- **Solo dev, MVP em 2 semanas:** arquitetura deve priorizar simplicidade e entregabilidade

### Concerns Transversais Identificados

1. **State Management:** `active-quest.json` é lido no início de todo comando — lógica de validação/fallback centralizada
2. **Idempotência de Injeção:** setup detecta bloco CodeMaster existente em CLAUDE.md/instructions.md antes de qualquer escrita
3. **Geração de Frontmatter:** todo arquivo de Quest/Victory precisa de frontmatter estruturado para Dataview — responsabilidade única e reutilizável
4. **Milestone Tracking:** contagem de victories no PROGRESS.md deve ser detectável de forma confiável para trigger de milestone
5. **Interaction Design (UX no CLI):** fluxos de conversa do agente (3 perguntas Quest, 5 perguntas Victory, wizard de setup, output de Legend/Knowledge) — capturado nas decisões de arquitetura, não em doc UX separado

## Starter Template Evaluation

### Domínio Tecnológico Primário

CLI Tool — Node.js 18+ / ESM puro, sem transpilação, instalação global via npm.

### Starters Considerados

| Opção | Decisão |
|---|---|
| oclif (Heroku) | Descartado — framework completo demais para 1 comando real; overhead desnecessário |
| yargs + inquirer | Descartado — complexidade acima do escopo |
| commander.js + @inquirer/prompts | ✅ Selecionado — leve, ESM-nativo, mantido ativamente |
| Custom minimal | Descartado — reinventar arg parsing sem ganho real |

### Stack Selecionada: commander.js + @inquirer/prompts

**Rationale:** O CodeMaster tem 1 comando CLI real (`codemaster setup`). Os demais 5 momentos são slash commands injetados como arquivos no agente — não são comandos CLI. Commander.js resolve o parsing com mínimo de código. Inquirer v9+ é ESM-nativo e entrega o wizard interativo. Chalk formata outputs. Tudo funciona com Node.js 18+ sem build step.

**Inicialização do projeto:**

```bash
mkdir codemaster && cd codemaster
npm init -y
npm install commander @inquirer/prompts chalk
npm install --save-dev vitest
```

**Decisões Arquiteturais Fornecidas pela Stack:**

**Linguagem & Runtime:**
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

**Estrutura de Projeto:**

```
bin/
  codemaster.js          # entry point + shebang
src/
  commands/
    setup.js             # codemaster setup (wizard interativo)
  moments/
    quest.js             # lógica do momento Quest
    relic.js             # lógica do momento Relic
    victory.js           # lógica do momento Victory
    legend.js            # lógica do momento Legend
    knowledge.js         # lógica do momento Knowledge
  services/
    vault.js             # leitura/escrita no Obsidian Vault
    state.js             # active-quest.json
    injector.js          # injeção em CLAUDE.md e Codex
    milestone.js         # detecção e progressão de milestone
    community.js         # opt-in API externa
  utils/
    frontmatter.js       # geração de frontmatter estruturado
    output.js            # formatação de outputs com chalk
package.json
README.md
```

**Nota:** A inicialização do projeto com essa stack deve ser a primeira história de implementação.

## Decisões Arquiteturais Centrais

### Análise de Prioridade de Decisões

**Decisões Críticas (bloqueiam implementação):**
- Convenção de nomenclatura de arquivos com tracking codes e wikilinks Obsidian
- Estrutura do PROGRESS.md com scores por dimensão
- Algoritmo de scoring 0.0–10 com análise holística
- Formato de slash commands para Claude Code e Codex skills
- Lógica de injeção idempotente em CLAUDE.md e instructions.md

**Decisões Importantes (moldam a arquitetura):**
- Leitura de commits git para contextualização do Victory
- Pergunta âncora no Quest + perguntas dinâmicas por contexto
- Estrutura de links Obsidian entre artefatos

**Decisões Adiadas (pós-MVP):**
- CI/CD automatizado
- API da comunidade (endpoint a definir)
- Canvas automático do Obsidian

### Arquitetura de Dados

**Convenção de Nomenclatura (sem data no nome, tracking code obrigatório):**

| Artefato | Formato | Exemplo | Link Obsidian |
|---|---|---|---|
| Quest | `Q{id}-{slug}.md` | `Q001-autenticacao-jwt.md` | `[[Q001-autenticacao-jwt]]` |
| Relic | `R{id}-{slug}.md` | `R001-stateless-session.md` | `[[R001-stateless-session]]` |
| Milestone summary | `M{id}-summary.md` | `M01-summary.md` | `[[M01-summary]]` |
| Victory | Seção final da nota da Quest | — | âncora interna `#victory` |

**Estrutura de Links Obsidian:**
- Quest linka suas relics no frontmatter e no corpo: `[[R001-stateless-session]]`
- Quest inclui seção `## Victory` ao ser encerrada (mesmo arquivo)
- PROGRESS.md linka todas as quests: `[[Q001-autenticacao-jwt]]`
- Milestone summary linka todas as quests do período
- Data registrada no frontmatter e no corpo dos arquivos — não no nome

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

### Interaction Design (UX no CLI)

**Fluxo do Quest — Pergunta âncora + 3 perguntas contextualizadas:**

1. **Âncora:** *"Descreva o problema ou tarefa em uma frase — o que você vai resolver?"*
2. O agente usa a âncora para gerar variações contextuais das 3 perguntas de dimensão (negócio, arquitetura, IA) — mesma essência, forma adaptada ao contexto
3. Exemplo com tarefa "Implementar autenticação JWT":
   - Negócio: *"Como a autenticação com JWT vai impactar a experiência do usuário final nesse sistema?"*
   - Arquitetura: *"Quais decisões técnicas você antecipa para garantir que a autenticação seja segura e escalável?"*
   - IA: *"Como você vai usar a IA nessa implementação — o que você orquestra versus o que delega?"*

**Fluxo do Victory — Leitura de commits + 5 perguntas contextualizadas:**

- O CLI executa `git log --oneline HEAD~20 2>/dev/null` antes de gerar o prompt
- Commits injetados como contexto no slash command para personalizar perguntas
- Graceful skip se não estiver em repo git (perguntas baseadas na âncora da quest)
- As 5 perguntas cobrem: impacto de negócio, decisão arquitetural, orquestração de IA, aprendizado novo, reflexão crítica — sempre contextualizadas

**Algoritmo de Scoring por Dimensão (0.0–10):**

- Cada Victory produz 3 scores: `negocio`, `arquitetura`, `ia`
- O agente analisa **todas as 5 respostas holisticamente** para cada dimensão — cada resposta contribui para todas as dimensões com pesos diferentes
- Instrução no prompt: *"Analise o conjunto das respostas. Para cada dimensão, atribua uma nota de 0.0 a 10.0 considerando profundidade, conexão com o contexto real e capacidade de articular o raciocínio."*
- Tendência resultante: **↑** se score ≥ 7.0 | **→** se 4.0–6.9 | **↓** se < 4.0
- Score acumulado no PROGRESS.md = média das victories do milestone atual

### Integração com Agentes de IA

**Claude Code — Slash Commands:**

| Componente | Localização | Formato |
|---|---|---|
| Comandos | `~/.claude/commands/codemaster/` | Um arquivo `.md` por momento |
| Nomes | `quest.md`, `relic.md`, `victory.md`, `legend.md`, `knowledge.md` | — |
| CLAUDE.md injection | Append ao final do arquivo existente | Bloco delimitado por comentário |

**Identificação do bloco injetado:**
```
<!-- CodeMaster v{version} — início das instruções do agente mentor -->
...conteúdo injetado...
<!-- CodeMaster v{version} — fim -->
```

**Codex — Skills:**
- Instrução de cada momento appendada em `~/.codex/instructions.md`
- Mesmo bloco identificador para idempotência

**Lógica de idempotência do injector:**
1. Regex busca o comentário de identificação no arquivo destino
2. Se encontrar → substitui o bloco inteiro (reconfiguração)
3. Se não encontrar → append ao final (primeira instalação)
4. Nunca toca conteúdo fora do bloco identificado

### Infraestrutura & Distribuição

| Decisão | Escolha | Rationale |
|---|---|---|
| Publicação npm | `npm publish --access public` | Escopo `@marcodotcastro`, global |
| Versionamento | Semver — `0.1.0` MVP, `1.0.0` pós-validação | Clareza sobre estabilidade |
| CI/CD | Nenhum no MVP — publicação manual | Solo dev, 2 semanas, overhead desnecessário |
| `.npmignore` | Exclui `tests/`, `_bmad-output/`, `.claude/` | Pacote enxuto |

### API da Comunidade

| Decisão | Escolha |
|---|---|
| Método | `POST` com payload `{ email, phone, heroName, stack, version }` |
| Timeout | 10 segundos — timeout gracioso |
| Falha de rede | Registra `community.error` no config, não bloqueia fluxo de Victory |
| Segurança | HTTPS obrigatório — requisições HTTP rejeitadas no cliente |

### Análise de Impacto das Decisões

**Sequência de implementação recomendada:**
1. Setup + config.json + injeção em agentes (base de tudo)
2. State manager (active-quest.json) + vault manager (fs operations)
3. Frontmatter generator + output formatter
4. Quest + Relic (entrada do ciclo)
5. Victory + scoring algorithm + milestone detection
6. Legend + Knowledge + KNOWLEDGE-MAP.md
7. Community opt-in (último — não bloqueia ciclo)

**Dependências entre componentes:**
- `state.js` é dependência de todos os `moments/`
- `vault.js` é dependência de `state.js`, `moments/`, e `milestone.js`
- `frontmatter.js` é dependência de `vault.js`
- `milestone.js` é acionado por `victory.js`
- `community.js` é acionado por `victory.js` (3ª victory)

## Padrões de Implementação & Regras de Consistência

### Pontos de Conflito Identificados

10 áreas onde agentes de IA poderiam fazer escolhas diferentes sem padrão definido.

### Padrões de Nomenclatura

**Arquivos e diretórios:**
- Todos os arquivos de código: `kebab-case.js` (ex: `active-quest.js`, `vault-manager.js`)
- Arquivos de teste: `nome-do-modulo.test.js` co-locado no mesmo diretório
- Artefatos do Obsidian: `Q{id}-{slug}.md`, `R{id}-{slug}.md`, `M{id}-summary.md`

**Código JavaScript:**
- Funções e variáveis: `camelCase` (ex: `readActiveQuest`, `vaultPath`)
- Constantes de módulo: `UPPER_SNAKE_CASE` (ex: `CODEMASTER_BLOCK_START`)
- Parâmetros de config JSON: `snake_case` (ex: `vault_path`, `opted_in`) — consistente com o schema do PRD

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

### Padrões de Estrutura

**Testes:**
- Co-locados com o módulo: `src/services/vault.test.js` ao lado de `src/services/vault.js`
- Nomear testes: `describe('vault', () => { it('should create quest note', ...) })`
- Apenas lógica de domínio pura tem teste — sem testar interações com agente

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

**Exports:** sempre named exports — sem `export default`
```js
// ✅ correto
export async function createQuestNote(quest) { ... }

// ❌ evitar
export default function createQuestNote(quest) { ... }
```

### Padrões de Formato

**Padrão async:** sempre `async/await` — sem `.then()/.catch()` chains
```js
// ✅ correto
const config = await readConfig()

// ❌ evitar
readConfig().then(config => ...)
```

**Formato de data em arquivos:** ISO 8601
- No frontmatter: `date: 2026-03-16`
- No active-quest.json: `startedAt: "2026-03-16T10:00:00Z"`

### Padrões de Comunicação & Output

**Todo output para o usuário passa por `src/utils/output.js`:**
```js
// ✅ correto — output centralizado
import { printSuccess, printError, printEpic } from '../utils/output.js'
printSuccess('Quest criada: [[Q001-autenticacao-jwt]]')

// ❌ evitar — console.log direto em services
console.log('Quest criada')
```

**Services não fazem output** — apenas retornam dados ou lançam erros. Output é responsabilidade de `moments/` e `commands/`.

### Padrões de Processo

**Tratamento de erros — dois padrões distintos:**

1. **Erros de usuário** (config ausente, quest não ativa): `throw new Error(message)` capturado no command handler com mensagem amigável via `printError()`
2. **Erros de integração** (vault inacessível, API timeout): `throw` com objeto estruturado `{ code: 'VAULT_NOT_FOUND', message, path }`

```js
// Command handler — captura e formata para o usuário
try {
  await createQuest(title)
} catch (err) {
  printError(err.message)
  process.exit(1)
}
```

**Acesso ao config.json — sempre via `src/services/config.js`:**
```js
// ✅ correto
import { readConfig, writeConfig } from '../services/config.js'

// ❌ evitar — leitura direta em outros módulos
const config = JSON.parse(await readFile('~/.codemaster/config.json'))
```

**Acesso ao Obsidian Vault — sempre via `src/services/vault.js`:**
- Nunca construir paths do vault fora de `vault.js`
- `vault.js` é o único módulo que conhece `config.obsidian.vault_path`

**Geração de IDs de tracking — via `src/services/state.js`:**
```js
const id = await getNextId('quest')   // retorna "Q001", "Q002"...
const relicId = await getNextId('relic')  // retorna "R001"...
```

**Execução de git — sempre com graceful fallback:**
```js
import { execSync } from 'child_process'

export function getRecentCommits(limit = 20) {
  try {
    return execSync(`git log --oneline -${limit}`, { encoding: 'utf8' })
  } catch {
    return null  // não está em repo git — silencioso
  }
}
```

**Injeção idempotente — regex obrigatório:**
```js
const BLOCK_START = /<!-- CodeMaster v[\d.]+ — início/
const BLOCK_END = /<!-- CodeMaster v[\d.]+ — fim -->/
// Se encontrar → substitui bloco. Se não → append.
```

### Regras de Enforcement

**Todo agente de IA DEVE:**
- Usar named exports em todos os módulos
- Usar async/await (nunca .then/.catch)
- Passar todo output pelo `output.js` — services são silenciosos
- Acessar config apenas via `config.js`
- Acessar vault apenas via `vault.js`
- Tratar ausência de git silenciosamente (return null)
- Gerar IDs via `state.js` — nunca gerar localmente

**Anti-padrões a evitar:**
- `import config from '../../config.json'` — import direto do JSON
- `console.log()` dentro de `src/services/`
- `export default` em qualquer módulo
- `.then(() => {})` em qualquer arquivo
- Paths de vault hardcodados fora de `vault.js`

## Estrutura do Projeto & Fronteiras

### Estrutura Completa de Diretórios

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
│   ├── moments/
│   │   ├── quest.js                    # FR10–FR13: fluxo Quest (âncora + 3 perguntas dinâmicas)
│   │   ├── quest.test.js
│   │   ├── relic.js                    # FR14–FR16: fluxo Relic (classificação + arquivo)
│   │   ├── relic.test.js
│   │   ├── victory.js                  # FR19–FR28: fluxo Victory (commits + 5 perguntas + score)
│   │   ├── victory.test.js
│   │   ├── legend.js                   # FR33–FR35: exibe PROGRESS.md formatado
│   │   ├── legend.test.js
│   │   ├── knowledge.js                # FR36–FR39: lê vault + gera KNOWLEDGE-MAP.md
│   │   └── knowledge.test.js
│   ├── services/
│   │   ├── config.js                   # readConfig, writeConfig — única porta para config.json
│   │   ├── config.test.js
│   │   ├── state.js                    # readActiveQuest, writeActiveQuest, clearActiveQuest, getNextId
│   │   ├── state.test.js
│   │   ├── vault.js                    # createNote, readNote, updateNote, listNotes — única porta para vault
│   │   ├── vault.test.js
│   │   ├── injector.js                 # injectToClaude, injectToCodex — idempotente via regex
│   │   ├── injector.test.js
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
├── templates/
│   ├── claude-commands/                # copiados para ~/.claude/commands/codemaster/ no setup
│   │   ├── quest.md                    # slash command /codemaster:quest
│   │   ├── relic.md                    # slash command /codemaster:relic
│   │   ├── victory.md                  # slash command /codemaster:victory
│   │   ├── legend.md                   # slash command /codemaster:legend
│   │   └── knowledge.md               # slash command /codemaster:knowledge
│   ├── claude-injection.md             # bloco injetado no ~/.claude/CLAUDE.md
│   ├── codex-injection.md              # bloco injetado no ~/.codex/instructions.md
│   └── obsidian-example/               # FR48: exemplo completo de milestone para onboarding
│       ├── README.md
│       ├── quests/
│       │   └── Q001-exemplo-quest.md
│       ├── relics/
│       │   └── R001-exemplo-relic.md
│       ├── M01-summary.md
│       └── KNOWLEDGE-MAP.md
```

### Fronteiras Arquiteturais

**Fronteiras de serviço — regra de acesso único:**

| Recurso | Único módulo autorizado | Motivo |
|---|---|---|
| `~/.codemaster/config.json` | `services/config.js` | Centraliza schema e defaults |
| `~/.codemaster/active-quest.json` | `services/state.js` | Controle de IDs + validação de estado |
| Obsidian Vault (paths, arquivos) | `services/vault.js` | Único ponto que conhece `vault_path` |
| `~/.claude/CLAUDE.md` e `~/.codex/instructions.md` | `services/injector.js` | Idempotência e identificação do bloco |
| HTTP externo (API comunidade) | `services/community.js` | Isolamento de IO de rede |
| `git log` e subprocessos | `services/git.js` | Graceful fallback centralizado |
| stdout / stderr | `utils/output.js` | Services são silenciosos |

**Fronteiras de camada:**

```
CLI entry (bin/)
    ↓
Commander (src/index.js)
    ↓
Moments (src/moments/)        ← orquestração do fluxo + output
    ↓
Services (src/services/)      ← IO: filesystem, HTTP, git
    ↓
Utils (src/utils/)            ← funções puras: sem IO, sem estado
```

Regra de dependência: camadas superiores dependem de inferiores — nunca o contrário. `utils/` não importa nada interno.

### Mapeamento de Requisitos → Estrutura

| FR Group | Localização primária | Dependências |
|---|---|---|
| FR1–FR9 Setup & Onboarding | `commands/setup.js` | config, state, vault, injector, output |
| FR10–FR13 Quest | `moments/quest.js` | state, vault, frontmatter, slugify, output |
| FR14–FR16 Relic | `moments/relic.js` | state, vault, output |
| FR17–FR18 Active Quest | `services/state.js` | config (para vault_path fallback) |
| FR19–FR28 Victory | `moments/victory.js` | state, vault, milestone, community, git, output |
| FR29–FR32 Milestone | `services/milestone.js` | vault, state, frontmatter, output |
| FR33–FR35 Legend | `moments/legend.js` | vault, state, output |
| FR36–FR39 Knowledge | `moments/knowledge.js` | vault, output |
| FR40–FR42 Agent Integration | `services/injector.js` + `templates/` | config |
| FR43–FR46 Persistência | `services/vault.js` + `services/state.js` | config, frontmatter |
| FR47–FR49 Docs & Exemplos | `templates/obsidian-example/` + README | — |

### Pontos de Integração

**Integrações externas:**

| Sistema | Módulo | Protocolo | Fallback |
|---|---|---|---|
| Obsidian Vault | `vault.js` | filesystem (`fs/promises`) | erro com mensagem clara |
| Claude Code | `injector.js` | filesystem (`~/.claude/`) | skip se não instalado |
| Codex CLI | `injector.js` | filesystem (`~/.codex/`) | skip se não instalado |
| Git | `git.js` | `child_process.execSync` | return null silencioso |
| API Comunidade | `community.js` | HTTPS POST | timeout 10s, non-blocking |

**Fluxo de dados principal (ciclo completo):**

```
setup → config.json + CLAUDE.md injection + slash commands
  ↓
quest → active-quest.json + vault/quests/Q{id}-{slug}.md
  ↓
relic → vault/quests/Q{id}-{slug}.md (append) + vault/relics/R{id}-{slug}.md
  ↓
victory → vault/quests/Q{id}-{slug}.md (append #victory)
        + PROGRESS.md (atualiza scores + wikilink)
        + active-quest.json (clear)
        → milestone.js (se 5ª victory)
        → community.js (se 3ª victory total)
  ↓
legend → lê PROGRESS.md → output formatado
  ↓
knowledge → lê vault/* → gera/atualiza KNOWLEDGE-MAP.md → output formatado
```

### Estrutura de Desenvolvimento

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

Desenvolvimento local: `npm link` instala o pacote globalmente a partir do diretório local. Distribuição: `npm publish --access public` após testes manuais end-to-end.
