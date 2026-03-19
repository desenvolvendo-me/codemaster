---
initiative: IN003
domain: claude-code
status: active
inputDocuments: ["_bmad-output/planning-artifacts/epics.md"]
---

# Epics — IN003 Claude Code

## Epic 1: Fundação — Sistema injeta CodeMaster no Claude Code

Dev pode ter os 5 momentos do CodeMaster disponíveis no Claude Code como slash commands após o setup, com sugestão proativa habilitada.

**FRs cobertos:** FR6, FR8, FR40, FR41, FR46, FR47

### Story 1.1: Sistema injeta CodeMaster no Claude Code e cria skills reutilizáveis

Como developer (Ricardo),
quero os 5 momentos do CodeMaster disponíveis no Claude Code imediatamente após o setup — como slash commands em `~/.claude/commands/codemaster/` e com sugestão proativa no CLAUDE.md —
para que eu use /codemaster:quest, :relic, :victory, :legend e :knowledge sem configuração manual e sem duplicação de lógica por ferramenta.

**Acceptance Criteria:**

**Dado** que `~/.claude/` existe (Claude Code instalado)
**Quando** setup conclui
**Então** `~/.claude/commands/codemaster/` é criado com 5 thin wrappers que carregam de `~/.codemaster/agents/`
**E** `~/.claude/CLAUDE.md` recebe o bloco CodeMaster com instrução de sugestão proativa

**Dado** que developer usa `/codemaster:quest` no Claude Code
**Quando** o wrapper é carregado
**Então** Claude Code lê e segue `~/.codemaster/agents/quest.md` com a lógica completa do momento

**Dado** que setup executa novamente (reinstalação)
**Quando** `~/.claude/commands/codemaster/` e bloco no CLAUDE.md já existem
**Então** tudo é sobrescrito sem duplicar (idempotente)

**Dado** que `~/.claude/` não existe
**Quando** setup chega na etapa de injeção no Claude Code
**Então** etapa é pulada com mensagem informando dev que Claude Code não foi detectado
