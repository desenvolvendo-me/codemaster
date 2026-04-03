import { describe, it, expect, beforeEach, vi } from 'vitest'
import { join } from 'path'

const promptMocks = vi.hoisted(() => ({
  input: vi.fn(),
  select: vi.fn(),
  confirm: vi.fn(),
  checkbox: vi.fn(),
  Separator: class Separator {},
}))

const configMocks = vi.hoisted(() => ({
  readConfig: vi.fn(),
  writeConfig: vi.fn(),
}))

const vaultMocks = vi.hoisted(() => ({
  initVault: vi.fn(),
}))

const injectorMocks = vi.hoisted(() => ({
  injectToClaude: vi.fn(),
  injectToCodex: vi.fn(),
}))

const workspaceMocks = vi.hoisted(() => ({
  initWorkspace: vi.fn(),
}))

const outputMocks = vi.hoisted(() => ({
  printSuccess: vi.fn(),
  printError: vi.fn(),
  printEpic: vi.fn(),
  printSection: vi.fn(),
}))

vi.mock('@inquirer/prompts', () => promptMocks)
vi.mock('../services/config.js', () => configMocks)
vi.mock('../services/vault.js', () => vaultMocks)
vi.mock('../services/injector.js', () => injectorMocks)
vi.mock('../workspace/init.js', () => workspaceMocks)
vi.mock('../utils/output.js', () => outputMocks)

const { buildConfig, setup, normalizeCliArgv } = await import('./setup.js')

describe('buildConfig', () => {
  const validInputs = {
    heroName: 'Ricardo',
    heroRole: 'pleno',
    stack: ['JavaScript', 'Ruby'],
    businessScore: 3,
    archScore: 4,
    aiScore: 2,
    focusDimensions: ['architecture', 'ai_orchestration'],
    vaultPath: '/home/ricardo/vault',
    agents: ['claude_code'],
  }

  it('should build config with new schema hero fields', () => {
    const config = buildConfig(validInputs)
    expect(config.hero.name).toBe('Ricardo')
    expect(config.hero.role).toBe('pleno')
    expect(config.hero.stack).toEqual(['JavaScript', 'Ruby'])
    expect(config.hero.experience_years).toBeUndefined()
  })

  it('should build config with dimensions scores', () => {
    const config = buildConfig(validInputs)
    expect(config.dimensions.business).toBe(3)
    expect(config.dimensions.architecture).toBe(4)
    expect(config.dimensions.ai_orchestration).toBe(2)
  })

  it('should build config with obsidian vault_path', () => {
    const config = buildConfig(validInputs)
    expect(config.obsidian.vault_path).toBe('/home/ricardo/vault')
  })

  it('should build config with agents as booleans', () => {
    const config = buildConfig(validInputs)
    expect(config.agents.claude_code).toBe(true)
    expect(config.agents.codex).toBe(false)
  })

  it('should build config with community defaults', () => {
    const config = buildConfig(validInputs)
    expect(config.community.opted_in).toBe(false)
    expect(config.community.email).toBe(null)
    expect(config.community.phone).toBe(null)
  })

  it('should include backward-compat dev and levels fields', () => {
    const config = buildConfig(validInputs)
    expect(config.dev.name).toBe('Ricardo')
    expect(config.levels.business).toBe(3)
    expect(config.vault).toBe('/home/ricardo/vault')
  })

  it('should include focus array', () => {
    const config = buildConfig(validInputs)
    expect(config.focus).toEqual(['architecture', 'ai_orchestration'])
  })
})

describe('normalizeCliArgv', () => {
  it('accepts exact -debug syntax for setup by normalizing to commander long option', () => {
    const argv = ['node', 'bin/codemaster.js', 'setup', '-debug']
    expect(normalizeCliArgv(argv)).toEqual(['node', 'bin/codemaster.js', 'setup', '--debug'])
  })

  it('does not change unrelated commands', () => {
    const argv = ['node', 'bin/codemaster.js', 'guide']
    expect(normalizeCliArgv(argv)).toEqual(argv)
  })
})

describe('setup debug mode', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    configMocks.readConfig.mockResolvedValue({
      hero: { name: 'Ricardo', role: 'pleno', stack: ['JavaScript'] },
      dimensions: { business: 3, architecture: 4, ai_orchestration: 2 },
      focus: ['architecture'],
      obsidian: { vault_path: '/tmp/codemaster-vault' },
      agents: { codex: true, claude_code: false },
      community: { opted_in: false, declined: false, email: null, phone: null },
      dev: { name: 'Ricardo', role: 'pleno', experience: 'pleno', stack: ['JavaScript'], focus: ['architecture'] },
      levels: { business: 3, architecture: 4, ai_orchestration: 2 },
      vault: '/tmp/codemaster-vault',
    })
    injectorMocks.injectToCodex.mockResolvedValue({ skipped: false, codexMdPath: join('/tmp/codemaster-vault', 'AGENTS.md') })
    injectorMocks.injectToClaude.mockResolvedValue({ skipped: true, reason: 'Claude ausente' })
    vaultMocks.initVault.mockResolvedValue()
    workspaceMocks.initWorkspace.mockResolvedValue()
  })

  it('reuses existing config and persists debug state without reopening onboarding', async () => {
    await setup({ debug: true })

    expect(promptMocks.confirm).not.toHaveBeenCalled()
    expect(promptMocks.input).not.toHaveBeenCalled()
    expect(promptMocks.select).not.toHaveBeenCalled()
    expect(promptMocks.checkbox).not.toHaveBeenCalled()

    expect(configMocks.writeConfig).toHaveBeenCalledTimes(1)
    expect(configMocks.writeConfig).toHaveBeenCalledWith(expect.objectContaining({
      hero: expect.objectContaining({ name: 'Ricardo' }),
      debug: expect.objectContaining({
        enabled: true,
        setup_reused: true,
        enabled_at: expect.any(String),
      }),
    }))

    expect(vaultMocks.initVault).toHaveBeenCalledWith('/tmp/codemaster-vault')
    expect(workspaceMocks.initWorkspace).toHaveBeenCalledWith(expect.objectContaining({
      debug: expect.objectContaining({ enabled: true }),
    }))
    expect(injectorMocks.injectToCodex).toHaveBeenCalled()
  })
})
