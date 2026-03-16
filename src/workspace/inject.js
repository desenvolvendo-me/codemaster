// src/workspace/inject.js
// Injeta as instruções do CodeMaster nos agentes de coding instalados
import fs from 'fs-extra'
import path from 'path'
import os from 'os'

// ─── CLAUDE.md ────────────────────────────────────────────────────────────────
// Gerado no diretório HOME (global) e também no cwd se for projeto
export function generateClaudeMd(config) {
  const agentMd = path.join(config.vault, '.codemaster', 'AGENT.md')
  return `# CodeMaster — AI Engineer Evolution Agent

## O que é o CodeMaster

Você tem um agente mentor instalado chamado **CodeMaster**.
Ele transforma cada demanda de desenvolvimento em aprendizado estruturado,
salvando tudo no Obsidian Vault em \`${config.vault}\`.

## Subagentes disponíveis

Quando ${config.dev.name} usar \`@codemaster\`, ative o subagente correspondente:

### @codemaster quest "nome da missão"
**Subagente: QuestMaster**
Inicia uma nova missão. Faça 3 perguntas de reflexão inicial, registre as
respostas e crie o arquivo \`${config.vault}/quests/YYYY-MM-DD-slug.md\`.

### @codemaster relic "descoberta"
**Subagente: RelicKeeper**
Registra uma descoberta/observação importante. Adiciona no arquivo da quest
ativa com timestamp. Se for reutilizável, cria também em \`${config.vault}/relics/\`.

### @codemaster victory
**Subagente: VictoryHerald**
Finaliza a missão ativa. Faz 5 perguntas de reflexão final, analisa nas
3 dimensões (negócio, arquitetura, orquestração IA), gera insight em
\`${config.vault}/victories/\` e atualiza \`${config.vault}/legend/PROGRESS.md\`.

### @codemaster legend
**Subagente: LegendKeeper**
Lê \`${config.vault}/legend/PROGRESS.md\` e apresenta um resumo épico do
progresso de ${config.dev.name} com destaque para última vitória e próximo passo.

## Instruções completas do agente

Leia: \`${agentMd}\`

## Regras importantes

- Sempre responda em português brasileiro
- Ao criar/atualizar arquivos, confirme o caminho ao dev
- Tom: épico mas direto — um mestre de RPG sábio e técnico
- Nunca invente análises — baseie-se no que o dev respondeu
- Dev: ${config.dev.name} | Stack: ${config.dev.stack.slice(0,3).join(', ')}
`
}

// ─── .cursor/rules ────────────────────────────────────────────────────────────
export function generateCursorRules(config) {
  return generateClaudeMd(config)
}

// ─── Codex instructions file ──────────────────────────────────────────────────
export function generateCodexInstructions(config) {
  return generateClaudeMd(config)
}

// ─── Injetar em todos os agentes selecionados ─────────────────────────────────
export async function injectAgentInstructions(config, selectedAgents, targetDir) {
  const results = []

  if (selectedAgents.includes('claude_code')) {
    // Global (~/.codemaster/CLAUDE.md) + local se tiver projeto
    const globalPath = path.join(os.homedir(), '.codemaster', 'CLAUDE.md')
    await fs.outputFile(globalPath, generateClaudeMd(config))
    results.push({ agent: 'Claude Code', file: globalPath })

    if (targetDir && targetDir !== os.homedir()) {
      const localPath = path.join(targetDir, 'CLAUDE.md')
      await fs.outputFile(localPath, generateClaudeMd(config))
      results.push({ agent: 'Claude Code (local)', file: localPath })
    }
  }

  if (selectedAgents.includes('cursor')) {
    const cursorPath = path.join(targetDir || os.homedir(), '.cursor', 'rules')
    await fs.outputFile(cursorPath, generateCursorRules(config))
    results.push({ agent: 'Cursor', file: cursorPath })
  }

  if (selectedAgents.includes('codex')) {
    const codexPath = path.join(os.homedir(), '.codemaster', 'codex-instructions.md')
    await fs.outputFile(codexPath, generateCodexInstructions(config))
    results.push({ agent: 'Codex CLI', file: codexPath,
      hint: `Use com: codex --instructions ${codexPath}` })
  }

  return results
}
