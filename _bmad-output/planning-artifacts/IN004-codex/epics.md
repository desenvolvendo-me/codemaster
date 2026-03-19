---
initiative: IN004
domain: codex
status: active
inputDocuments: ["_bmad-output/planning-artifacts/epics.md"]
---

# Epics — IN004 Codex

## Epic 1: Fundação — Sistema injeta CodeMaster no Codex

Dev pode ter os 5 momentos do CodeMaster disponíveis como skills no Codex CLI após o setup.

**FRs cobertos:** FR7, FR8, FR42, FR48

### Story 1.1: Sistema injeta CodeMaster no Codex

Como developer,
quero os momentos do CodeMaster disponíveis como skills no Codex após o setup,
para que possa usar os 5 momentos diretamente no Codex CLI.

**Acceptance Criteria:**

**Dado** que `~/.codex/` existe (Codex instalado)
**Quando** setup conclui a etapa de injeção no Codex
**Então** bloco de skills CodeMaster é appendado em `~/.codex/instructions.md`
**E** bloco é identificado por `<!-- CodeMaster v{version} — início -->`

**Dado** que o bloco CodeMaster já existe em instructions.md
**Quando** setup executa novamente
**Então** bloco existente é substituído, não duplicado (idempotente)

**Dado** que `~/.codex/` não existe
**Quando** setup chega na etapa de injeção no Codex
**Então** etapa é pulada com mensagem informando dev que Codex não foi detectado
