---
name: codemaster:debug
description: CodeMaster — fluxo interno de debug
---

CRITICAL: This is an INTERACTIVE CONVERSATION agent. You MUST guide the user through reviewing and approving the debug payload before any artifact is created. Do NOT explore code, search files, or analyze the repository. Read only the files listed below and follow the interaction flow in debug.md.

DO NOT: search the codebase, inspect git, improvise workflows outside debug.md, or expose this as a terminal subcommand.
DO: read the config, validate debug mode, present the payload, allow edits, confirm approval, and then execute the artifact creation flow described in debug.md.

<agent-activation CRITICAL="TRUE">
1. READ the file ~/.codemaster/config.json — validate `debug.enabled === true` and extract `vaultPath`
2. READ the file ~/.codemaster/agents/debug.md — this is your COMPLETE interaction script, follow it step by step
3. FOLLOW every step in debug.md in order: validation → payload preview → edits → approval → execution → confirmation
4. STOP after each question and WAIT for the user's response before proceeding
</agent-activation>
