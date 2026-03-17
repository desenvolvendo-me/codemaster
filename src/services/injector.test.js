import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { join } from 'path'
import { tmpdir } from 'os'
import { mkdir, writeFile, readFile, rm } from 'fs/promises'

// ─── Mocks ────────────────────────────────────────────────────────────────────
let testHome

vi.mock('os', async (importOriginal) => {
  const actual = await importOriginal()
  return { ...actual, homedir: () => testHome }
})

async function setupHome(structure = {}) {
  testHome = join(tmpdir(), `codemaster-test-${Date.now()}-${Math.random().toString(36).slice(2)}`)
  await mkdir(testHome, { recursive: true })

  if (structure.claude) {
    await mkdir(join(testHome, '.claude'), { recursive: true })
    if (structure.claudeMd) {
      await writeFile(join(testHome, '.claude', 'CLAUDE.md'), structure.claudeMd, 'utf8')
    }
  }
  if (structure.codex) {
    await mkdir(join(testHome, '.codex'), { recursive: true })
    if (structure.codexMd) {
      await writeFile(join(testHome, '.codex', 'instructions.md'), structure.codexMd, 'utf8')
    }
  }
  return testHome
}

async function cleanup() {
  if (testHome) await rm(testHome, { recursive: true, force: true })
}

const baseConfig = {
  version: '1.0.0',
  hero: { name: 'Ricardo', stack: ['JavaScript', 'Ruby'] },
  obsidian: { vault_path: '/vault' },
}

// ─── injectToClaude ───────────────────────────────────────────────────────────
describe('injectToClaude', () => {
  beforeEach(() => { vi.resetModules() })
  afterEach(cleanup)

  it('should skip when ~/.claude does not exist', async () => {
    await setupHome({})
    const { injectToClaude } = await import('./injector.js')
    const result = await injectToClaude({ ...baseConfig, projectDir: testHome })
    expect(result.skipped).toBe(true)
    expect(result.reason).toMatch(/Claude Code não detectado/)
  })

  it('should copy agents to ~/.codemaster/agents/', async () => {
    await setupHome({ claude: true })
    const { injectToClaude } = await import('./injector.js')
    const result = await injectToClaude({ ...baseConfig, projectDir: testHome })
    expect(result.skipped).toBe(false)
    // verifica que agentsDir foi retornado
    expect(result.agentsDir).toContain('.codemaster/agents')
    // verifica que os 5 agentes existem
    const { access } = await import('fs/promises')
    for (const name of ['quest', 'relic', 'victory', 'legend', 'knowledge']) {
      await expect(access(join(result.agentsDir, `${name}.md`))).resolves.toBeUndefined()
    }
  })

  it('should create 5 SKILL.md files in ~/.claude/skills/codemaster-*/', async () => {
    await setupHome({ claude: true })
    const { injectToClaude } = await import('./injector.js')
    const result = await injectToClaude({ ...baseConfig })
    const { readFile } = await import('fs/promises')
    expect(result.skillsDir).toContain('.claude/skills')
    for (const name of ['quest', 'relic', 'victory', 'legend', 'knowledge']) {
      const content = await readFile(join(result.skillsDir, `codemaster-${name}`, 'SKILL.md'), 'utf8')
      expect(content).toContain(`codemaster:${name}`)
      expect(content).toContain(`~/.codemaster/agents/${name}.md`)
    }
  })

  it('should inject block when CLAUDE.md does not exist', async () => {
    await setupHome({ claude: true })
    const { injectToClaude } = await import('./injector.js')
    await injectToClaude({ ...baseConfig, projectDir: testHome })
    const content = await readFile(join(testHome, '.claude', 'CLAUDE.md'), 'utf8')
    expect(content).toContain('CodeMaster')
    expect(content).toContain('início das instruções do agente mentor')
    expect(content).toContain('fim -->')
  })

  it('should REPLACE existing block (idempotente) — not duplicate', async () => {
    const existingBlock = `<!-- CodeMaster v0.9.0 — início das instruções do agente mentor -->
# CodeMaster antigo
<!-- CodeMaster v0.9.0 — fim -->`
    await setupHome({ claude: true, claudeMd: `# Meu CLAUDE.md\n\n${existingBlock}\n` })
    const { injectToClaude } = await import('./injector.js')
    await injectToClaude({ ...baseConfig, projectDir: testHome })
    const content = await readFile(join(testHome, '.claude', 'CLAUDE.md'), 'utf8')
    // só um bloco CodeMaster
    const matches = content.match(/CodeMaster.*início das instruções/g)
    expect(matches).toHaveLength(1)
    // conteúdo antes do bloco preservado
    expect(content).toContain('# Meu CLAUDE.md')
  })

  it('should NOT touch content outside the block', async () => {
    const before = '# Minhas regras\nNunca usar console.log'
    const after  = '\n\n# Regras extras\nSempre usar ESM'
    const existing = `${before}\n\n<!-- CodeMaster v0.5.0 — início das instruções do agente mentor -->\nold\n<!-- CodeMaster v0.5.0 — fim -->${after}`
    await setupHome({ claude: true, claudeMd: existing })
    const { injectToClaude } = await import('./injector.js')
    await injectToClaude({ ...baseConfig, projectDir: testHome })
    const content = await readFile(join(testHome, '.claude', 'CLAUDE.md'), 'utf8')
    expect(content).toContain(before)
    expect(content).toContain('Regras extras')
  })
})

// ─── injectToCodex ────────────────────────────────────────────────────────────
describe('injectToCodex', () => {
  beforeEach(() => { vi.resetModules() })
  afterEach(cleanup)

  it('should skip when ~/.codex does not exist', async () => {
    await setupHome({})
    const { injectToCodex } = await import('./injector.js')
    const result = await injectToCodex(baseConfig)
    expect(result.skipped).toBe(true)
  })

  it('should inject block in ~/.codex/instructions.md', async () => {
    await setupHome({ codex: true })
    const { injectToCodex } = await import('./injector.js')
    const result = await injectToCodex(baseConfig)
    expect(result.skipped).toBe(false)
    const content = await readFile(join(testHome, '.codex', 'instructions.md'), 'utf8')
    expect(content).toContain('~/.codemaster/agents/quest.md')
    expect(content).toContain('~/.codemaster/agents/victory.md')
  })

  it('should replace existing codex block (idempotente)', async () => {
    const existing = `Minhas instruções\n\n<!-- CodeMaster v0.1.0 — início das instruções do agente mentor -->\nold codex\n<!-- CodeMaster v0.1.0 — fim -->`
    await setupHome({ codex: true, codexMd: existing })
    const { injectToCodex } = await import('./injector.js')
    await injectToCodex(baseConfig)
    const content = await readFile(join(testHome, '.codex', 'instructions.md'), 'utf8')
    const matches = content.match(/CodeMaster.*início das instruções/g)
    expect(matches).toHaveLength(1)
    expect(content).toContain('Minhas instruções')
  })
})
