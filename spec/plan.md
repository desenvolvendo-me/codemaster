```markdown
# CodeMaster — Resumo para continuar no Claude Code

## O que é
Pacote npm `codemaster` — agente mentor de engenharia local-first com vocabulário RPG.
O dev instala com `npm install -g codemaster`, roda `codemaster setup` e passa a usar
`@codemaster` dentro do Claude Code / Cursor sem sair do editor.

---

## Estado atual do projeto
- Código completo em `/home/claude/codemaster/` (1.486 linhas, 14 arquivos)
- Pronto para `npm publish` — falta apenas testar e ajustar bugs
- Arquivo para download: `codemaster.tar.gz`

---

## Estrutura de arquivos

```
codemaster/
├── bin/codemaster.js
├── package.json               (type: module, bin: codemaster)
├── README.md
└── src/
    ├── index.js               (router dos 4 comandos + help)
    ├── commands/
    │   ├── setup.js           (onboarding 5 etapas)
    │   ├── quest.js           (inicia missão)
    │   ├── relic.js           (registra descoberta)
    │   ├── victory.js         (finaliza missão)
    │   └── legend.js          (dashboard de progresso)
    └── workspace/
        ├── config.js          (~/.codemaster/config.json e active-quest.json)
        ├── init.js            (cria pastas e .md no Vault)
        ├── inject.js          (gera CLAUDE.md / .cursor/rules / codex)
        └── templates.js       (gera os 6 arquivos .md do agente)
```

---

## Os 4 comandos (vocabulário RPG)

| Comando | Ação |
|---|---|
| `quest "nome"` | Inicia missão — 3 perguntas de reflexão inicial |
| `relic "texto"` | Registra descoberta — detecta se é reutilizável e salva em /relics/ |
| `victory` | Finaliza missão — 5 perguntas + análise nas 3 dimensões + gera insight |
| `legend` | Dashboard — progresso com barra ██░░░ nas 3 dimensões |

---

## Vault do Obsidian (gerado no setup)

```
~/CodeMaster/
├── quests/       (uma nota por demanda)
├── relics/       (descobertas reutilizáveis)
├── victories/    (reflexões finais + insights)
├── legend/PROGRESS.md
├── knowledge/
└── .codemaster/
    ├── AGENT.md      (instruções do agente — lido pelo Claude Code)
    ├── IDENTITY.md   (perfil do dev)
    ├── SOUL.md       (tom e personalidade)
    └── TOOLS.md      (caminhos e capacidades)
```

---

## Integração com agentes de coding

O `inject.js` gera um `CLAUDE.md` com **4 subagentes** descritos:
- `QuestMaster` → responde `@codemaster quest`
- `RelicKeeper` → responde `@codemaster relic`
- `VictoryHerald` → responde `@codemaster victory`
- `LegendKeeper` → responde `@codemaster legend`

O Claude Code lê o CLAUDE.md automaticamente e sabe o que fazer.
Também gera `.cursor/rules` para Cursor e `codex-instructions.md` para Codex CLI.

---

## Setup — 5 etapas do onboarding

1. Identidade do herói (nome, cargo, stack, objetivo)
2. Atributos — nível 1–5 em: Negócio / Arquitetura / Orquestração IA
3. Obsidian — detecta instalação, se não tem abre obsidian.md, configura Vault
4. GitHub — abre github.com/new, salva URL do repo privado
5. Integração — detecta Claude/Codex/Cursor instalados, injeta instruções

---

## Decisões técnicas tomadas

- **ESM puro** (`"type": "module"` no package.json) — Node 18+
- **Sem MCP por agora** — integração via CLAUDE.md é suficiente para v0.1
- **Análise heurística local** — victory.js analisa keywords das respostas sem chamar API
- **relic inteligente** — detecta automaticamente se é decisão arquitetural/padrão e salva em /relics/
- **Estado da quest ativa** em `~/.codemaster/active-quest.json`

---

## Próximos passos sugeridos

1. `npm install` + `node bin/codemaster.js setup` para testar localmente
2. Corrigir eventual bug no `start.js` (referência a `require('os')` — deve ser `import`)
3. Adicionar `postinstall` script no package.json para rodar setup automaticamente
4. Testar o CLAUDE.md gerado dentro de uma sessão real do Claude Code
5. `npm publish` com conta npm criada

---

## Contexto do criador

Marco Castro — Senior Rails Developer / Tech Lead, Imovai (1.2M properties/day).
Projeto pessoal de mentoria para devs. Linguagem: português brasileiro.
Ele quer publicar no npm e usar pessoalmente + distribuir para outros devs.
```