---
initiative: IN003
domain: claude-code
status: active
inputDocuments: ["_bmad-output/planning-artifacts/prd.md"]
---

# PRD — IN003 Claude Code

## Contexto

O domínio Claude Code compreende a **integração do CodeMaster com o Claude Code**. Durante o setup, o sistema detecta se o Claude Code está instalado e gera thin wrappers em `~/.claude/commands/codemaster/` que ativam os agentes compartilhados de `~/.codemaster/agents/`. Também injeta no `~/.claude/CLAUDE.md` o bloco que habilita a sugestão proativa. Os wrappers não contêm lógica de negócio — apenas apontam para os agentes core (IN002). É o canal principal de uso do CodeMaster pelo dev.

## Functional Requirements

- **FR6:** Sistema pode detectar se Claude Code está instalado e injetar instruções no CLAUDE.md
- **FR8:** Sistema pode detectar injeção prévia e substituí-la sem duplicar conteúdo
- **FR40:** Agente de IA (Claude Code) pode sugerir proativamente o uso do quest quando o dev inicia uma tarefa sem Quest ativa *(hipótese — a validar na semana 1)*
- **FR41:** Dev pode usar os 5 momentos do CodeMaster em qualquer projeto aberto no Claude Code após o setup
- **FR46:** Setup gera `~/.claude/commands/codemaster/{momento}.md` como thin wrappers que apenas ativam `~/.codemaster/agents/{momento}.md` — sem lógica de negócio nos wrappers
- **FR47:** Setup é idempotente para `~/.claude/commands/codemaster/`: sobrescreve na reinstalação, nunca duplica

## Non-Functional Requirements

- **NFR8:** A injeção no `CLAUDE.md` deve ser append-only com identificação clara do bloco — o sistema nunca deve sobrescrever conteúdo preexistente do usuário fora do bloco CodeMaster identificado
- **NFR11:** A integração com Claude Code deve funcionar com qualquer versão que suporte o formato de slash commands em `~/.claude/commands/`
- **NFR-S1:** Wrappers em `~/.claude/commands/codemaster/` devem ter no máximo 15 linhas — nenhuma lógica de negócio, apenas ativação do agente em `~/.codemaster/agents/`
