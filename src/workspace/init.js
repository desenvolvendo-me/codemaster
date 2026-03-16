// src/workspace/init.js
import fs from 'fs-extra'
import path from 'path'
import {
  generateAgentMd,
  generateIdentityMd,
  generateSoulMd,
  generateToolsMd,
  generateProgressMd,
  generateBootstrapLog,
  generateVaultReadme,
} from './templates.js'

export async function initWorkspace(config) {
  const vault = config.vault

  // ── Pastas do Vault ──────────────────────────────────────────────────────
  const dirs = [
    path.join(vault, '.codemaster'),   // arquivos internos do agente
    path.join(vault, 'quests'),        // uma nota por demanda
    path.join(vault, 'relics'),        // relíquias avulsas (discoveries)
    path.join(vault, 'victories'),     // reflexões finais + insights
    path.join(vault, 'legend'),        // progresso e evolução
    path.join(vault, 'knowledge'),     // aprendizados consolidados
  ]
  for (const d of dirs) await fs.ensureDir(d)

  // ── Arquivos .md do agente ───────────────────────────────────────────────
  const agentDir = path.join(vault, '.codemaster')
  await fs.writeFile(path.join(agentDir, 'AGENT.md'),    generateAgentMd(config))
  await fs.writeFile(path.join(agentDir, 'IDENTITY.md'), generateIdentityMd(config))
  await fs.writeFile(path.join(agentDir, 'SOUL.md'),     generateSoulMd(config))
  await fs.writeFile(path.join(agentDir, 'TOOLS.md'),    generateToolsMd(config))
  await fs.writeFile(path.join(agentDir, 'BOOTSTRAP.md'),generateBootstrapLog(config))

  // ── Progresso inicial ────────────────────────────────────────────────────
  await fs.writeFile(
    path.join(vault, 'legend', 'PROGRESS.md'),
    generateProgressMd(config)
  )

  // ── README do vault ──────────────────────────────────────────────────────
  await fs.writeFile(path.join(vault, 'README.md'), generateVaultReadme(config))

  // ── .gitignore ───────────────────────────────────────────────────────────
  await fs.writeFile(path.join(vault, '.gitignore'), [
    '# CodeMaster — não versionar estado local',
    '.codemaster/active-quest.json',
    '',
  ].join('\n'))

  // ── .obsidian/app.json mínimo para abrir como vault ─────────────────────
  await fs.ensureDir(path.join(vault, '.obsidian'))
  await fs.writeJson(path.join(vault, '.obsidian', 'app.json'), {}, { spaces: 2 })
}
