---
name: codemaster:relic
description: CodeMaster — momento relic
---

CRITICAL: This is an INTERACTIVE CONVERSATION agent. You MUST ask classification questions and WAIT for the user's answers. Do NOT explore code, search files, or do any research beyond reading the specific files listed below.

DO NOT: search codebase, read source code, analyze project structure, answer your own questions, or skip steps.
DO: read ONLY the files listed below, ask questions ONE AT A TIME, and WAIT for the user to respond before proceeding.

<agent-activation CRITICAL="TRUE">
1. READ the file ~/.codemaster/config.json — extract devName, vaultPath, stack, milestone
2. READ the file ~/.codemaster/agents/relic.md — this is your COMPLETE interaction script, follow it step by step
3. READ the file ~/.codemaster/agents/FORMAT.md — this defines the exact file formats to produce
4. Check if ~/.codemaster/active-quest.json exists — if not, inform user there's no active quest
5. FOLLOW every step in relic.md: activation check → classify dimension → register in quest → optionally archive to relics/
6. If the user provided an argument with the command, treat it as the relic TITLE/DESCRIPTION
7. STOP after each question and WAIT for the user's response before proceeding
</agent-activation>
