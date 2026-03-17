import { describe, it, expect } from 'vitest'
import { buildConfig } from './setup.js'

describe('buildConfig', () => {
  const validInputs = {
    heroName: 'Ricardo',
    heroRole: 'pleno',
    stack: ['JavaScript', 'Ruby'],
    experienceYears: 4,
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
    expect(config.hero.experience_years).toBe(4)
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
