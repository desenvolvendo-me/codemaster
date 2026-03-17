---
initiative: IN003
domain: codex
status: active
inputDocuments: ["_bmad-output/planning-artifacts/prd.md"]
---

# PRD — IN003 Codex

## Contexto

O domínio Codex compreende a integração do CodeMaster com o Codex CLI. Durante o setup, o sistema detecta se o Codex está instalado e injeta as instruções dos 5 momentos como skills em `~/.codex/instructions.md`. A injeção é idempotente — detecta bloco existente e substitui sem duplicar. Esta iniciativa é classificada como importante no MVP (pode vir em v1.1 se timeline apertar), mas o mecanismo de injeção é o mesmo usado pela IN002 Claude Code.

## Functional Requirements

- **FR7:** Sistema pode detectar se Codex está instalado e injetar comandos como **skills** no Codex
- **FR8:** Sistema pode detectar injeção prévia e substituí-la sem duplicar conteúdo
- **FR42:** Dev pode usar os 5 momentos do CodeMaster como **skills no Codex** após o setup

## Non-Functional Requirements

- **NFR8:** A injeção no `CLAUDE.md` e `instructions.md` deve ser append-only com identificação clara do bloco — o sistema nunca deve sobrescrever conteúdo preexistente do usuário fora do bloco CodeMaster identificado
- **NFR12:** A integração com Codex deve funcionar via skills no formato suportado pela versão atual do Codex CLI
