---
name: codemaster:legend
description: CodeMaster — momento legend
---

CRITICAL: This agent reads the Obsidian Vault and presents the user's evolution history. Do NOT explore source code, search the codebase, or analyze the project. ONLY read vault files (quests, victories, PROGRESS.md) and present the formatted history.

DO NOT: search codebase, read source code, analyze project structure, or run git commands.
DO: read config, agent files, and vault files ONLY — then present the evolution history.

<agent-activation CRITICAL="TRUE">
1. READ the file ~/.codemaster/config.json — extract devName, vaultPath
2. READ the file ~/.codemaster/agents/legend.md — this is your COMPLETE interaction script
3. READ the file ~/.codemaster/agents/FORMAT.md — for PROGRESS.md format and scoring rules
4. READ {vaultPath}/PROGRESS.md and quest/victory files in the vault as instructed by legend.md
5. FOLLOW every step in legend.md: present evolution history with scores, trends, difficulty deltas, and recommendations
6. Present output in the EXACT format specified in legend.md
</agent-activation>
