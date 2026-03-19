---
initiative: IN004
domain: codex
status: active
inputDocuments: ["_bmad-output/planning-artifacts/prd.md"]
---

# PRD — IN004 Codex

## Contexto

O domínio Codex compreende a **integração do CodeMaster com o Codex CLI**. Durante o setup, o sistema detecta se o Codex está instalado e injeta as instruções dos 5 momentos como skills em `~/.codex/instructions.md`. A injeção é idempotente — detecta bloco existente e substitui sem duplicar. Os skills apontam para os agentes compartilhados de `~/.codemaster/agents/` (IN002) — sem duplicação de lógica.

## Functional Requirements

- **FR7:** Sistema pode detectar se Codex está instalado e injetar comandos como **skills** no Codex
- **FR8:** Sistema pode detectar injeção prévia e substituí-la sem duplicar conteúdo
- **FR42:** Dev pode usar os 5 momentos do CodeMaster como **skills no Codex** após o setup
- **FR48:** Bloco injetado em `~/.codex/instructions.md` instrui Codex a carregar de `~/.codemaster/agents/{momento}.md` — reutilizando os mesmos agentes globais sem duplicação

## Non-Functional Requirements

- **NFR8:** A injeção no `instructions.md` deve ser append-only com identificação clara do bloco — o sistema nunca deve sobrescrever conteúdo preexistente do usuário fora do bloco CodeMaster identificado
- **NFR12:** A integração com Codex deve funcionar via skills no formato suportado pela versão atual do Codex CLI
