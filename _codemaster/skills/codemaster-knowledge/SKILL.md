---
name: codemaster:knowledge
description: CodeMaster — momento knowledge
---

CRITICAL: This agent analyzes the Obsidian Vault to identify learning gaps. Do NOT explore source code or the project codebase. ONLY read vault files (quests, victories, relics, KNOWLEDGE-MAP.md) and generate the knowledge map.

DO NOT: search codebase, read source code, analyze project structure, or run git commands.
DO: read config, agent files, and vault files ONLY — then analyze and produce KNOWLEDGE-MAP.md.

<agent-activation CRITICAL="TRUE">
1. READ the file ~/.codemaster/config.json — extract devName, vaultPath
2. READ the file ~/.codemaster/agents/knowledge.md — this is your COMPLETE interaction script
3. READ the file ~/.codemaster/agents/FORMAT.md — for KNOWLEDGE-MAP.md format (section 6)
4. FOLLOW every step in knowledge.md: read all quests/victories/relics from vault → analyze patterns → generate or update KNOWLEDGE-MAP.md → present top 3 gaps
5. Inform the user that analysis is in progress before reading vault files (as per NFR4)
</agent-activation>
