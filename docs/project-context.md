---
project_name: codemaster
user_name: Code Master
date: 2026-03-18
---

# Project Context for AI Agents

_Regras e convenções que agentes AI devem seguir ao implementar código neste projeto._

---

## Technology Stack & Versions

- **Runtime:** Node.js 18+
- **Tipo de módulo:** ESM (`"type": "module"`)
- **Framework CLI:** Commander.js
- **Prompts:** @inquirer/prompts
- **Estilização terminal:** Chalk
- **Testes:** Vitest
- **Linguagem:** JavaScript (sem TypeScript)

## Organização de Artefatos de Implementação

### Stories organizadas por Epic

Stories ficam dentro de subpastas por epic no diretório de implementation artifacts:

```
_bmad-output/implementation-artifacts/IN001-cli/
├── sprint-status.yaml
├── epic-1/
│   ├── 1-1-inicializar-projeto-com-stack-selecionada.md
│   ├── 1-2-dev-executa-codemaster-setup-e-completa-onboarding.md
│   └── 1-5-sistema-inicializa-e-valida-obsidian-vault.md
├── epic-4/
│   ├── 4-1-sistema-detecta-milestone-e-cria-summary-automaticamente.md
│   └── 4-2-sistema-consolida-aprendizado-e-orienta-proximos-estudos.md
├── epic-5/
│   └── ...
├── epic-6/
│   └── ...
└── epic-7/
    └── ...
```

**Convenção:**
- Pasta: `epic-{n}/` (ex: `epic-1/`, `epic-7/`)
- Arquivo: `{epic}-{story}-{slug}.md` (ex: `7-1-mapa-base-curado.md`)
- `sprint-status.yaml` fica na raiz da initiative, fora das pastas de epic
- `story_location` no sprint-status usa pattern `epic-{n}/` para localizar stories

### Ao criar novas stories

1. Identificar o epic da story
2. Criar ou usar a pasta `epic-{n}/` correspondente
3. Nomear o arquivo seguindo o padrão `{epic}-{story}-{slug}.md`
4. Atualizar `sprint-status.yaml` com a nova entry

## Critical Implementation Rules

### Padrão de testes

- Testes ficam no mesmo diretório do arquivo testado: `foo.js` → `foo.test.js`
- Usar `vi.mock()` para mocks de módulos
- Red-green-refactor: escrever teste falhando primeiro

### Frontmatter

- Usar `generateFrontmatter()` de `src/utils/frontmatter.js`
- Strings são sempre quoted via `JSON.stringify`
- Scores são strings: `business: "7.5"` (não número)
- Arrays: `source_quests: ["Q001","Q003"]`

### Vault Structure

```
vault/
├── quests/          # Quests ativas + M{id}/ para arquivadas
├── victories/       # Victory files + M{id}/ para arquivadas
├── relics/          # Relics + M{id}/ para arquivadas
├── milestones/      # M{id}-summary.md
├── knowledge/       # K{id} files (permanentes, cross-milestone)
├── PROGRESS.md
└── KNOWLEDGE-MAP.md
```

- Wikilinks do Obsidian resolvem por nome de arquivo, não caminho
- K{id} em `knowledge/` nunca são movidos para M{id}/ (são cross-milestone)
- Arquivos de milestone completado vão para subpastas `M{id}/` dentro de quests/, victories/, relics/
