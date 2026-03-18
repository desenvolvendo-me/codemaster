import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { join } from 'path'
import { tmpdir } from 'os'
import { mkdir, readFile, rm } from 'fs/promises'

// ─── Mocks ────────────────────────────────────────────────────────────────────
let testHome
let testVault

vi.mock('os', async (importOriginal) => {
  const actual = await importOriginal()
  return { ...actual, homedir: () => testHome }
})

async function setup() {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`
  testHome = join(tmpdir(), `codemaster-test-home-${id}`)
  testVault = join(tmpdir(), `codemaster-test-vault-${id}`)
  await mkdir(join(testHome, '.codemaster'), { recursive: true })
  await mkdir(join(testVault, 'quests'), { recursive: true })
}

async function cleanup() {
  if (testHome) await rm(testHome, { recursive: true, force: true })
  if (testVault) await rm(testVault, { recursive: true, force: true })
}

// ─── state ────────────────────────────────────────────────────────────────────
describe('state', () => {
  beforeEach(async () => { vi.resetModules(); await setup() })
  afterEach(cleanup)

  it('readActiveQuest returns null when file does not exist', async () => {
    const { readActiveQuest } = await import('../services/state.js')
    const result = await readActiveQuest()
    expect(result).toBeNull()
  })

  it('writeActiveQuest and readActiveQuest round-trip', async () => {
    const { writeActiveQuest, readActiveQuest } = await import('../services/state.js')
    const data = { id: 'Q001', title: 'Test Quest', slug: 'test-quest', notePath: 'quests/Q001-test-quest.md', startedAt: '2026-01-01T00:00:00.000Z', milestone: 1 }
    await writeActiveQuest(data)
    const result = await readActiveQuest()
    expect(result).toEqual(data)
  })

  it('clearActiveQuest deletes the file', async () => {
    const { writeActiveQuest, readActiveQuest, clearActiveQuest } = await import('../services/state.js')
    await writeActiveQuest({ id: 'Q001', title: 'Test' })
    await clearActiveQuest()
    const result = await readActiveQuest()
    expect(result).toBeNull()
  })

  it('clearActiveQuest does not throw when file does not exist', async () => {
    const { clearActiveQuest } = await import('../services/state.js')
    await expect(clearActiveQuest()).resolves.toBeUndefined()
  })
})

// ─── createQuest ──────────────────────────────────────────────────────────────
describe('createQuest', () => {
  beforeEach(async () => { vi.resetModules(); await setup() })
  afterEach(cleanup)

  it('should generate next sequential ID (Q001 when empty)', async () => {
    const { createQuest } = await import('./quest.js')
    const result = await createQuest('Implementar autenticação JWT', testVault)
    expect(result.id).toBe('Q001')
  })

  it('should generate Q002 when one quest already exists', async () => {
    await mkdir(join(testVault, 'quests'), { recursive: true })
    // cria um arquivo existente manualmente
    const { writeFile } = await import('fs/promises')
    await writeFile(join(testVault, 'quests', 'Q001-existing.md'), '', 'utf8')
    const { createQuest } = await import('./quest.js')
    const result = await createQuest('Segunda quest', testVault)
    expect(result.id).toBe('Q002')
  })

  it('should create note file with correct frontmatter', async () => {
    const { createQuest } = await import('./quest.js')
    await createQuest('Implementar autenticação JWT', testVault)
    const content = await readFile(join(testVault, 'quests', 'Q001-implementar-autenticacao-jwt.md'), 'utf8')
    expect(content).toContain('id: "Q001"')
    expect(content).toContain('type: "quest"')
    expect(content).toContain('title: "Implementar autenticação JWT"')
    expect(content).toContain('"codemaster"')
    expect(content).toContain('## Reflexão Inicial')
  })

  it('should return { id, notePath }', async () => {
    const { createQuest } = await import('./quest.js')
    const result = await createQuest('Minha quest', testVault)
    expect(result).toHaveProperty('id')
    expect(result).toHaveProperty('notePath')
    expect(result.notePath).toMatch(/^quests\/Q001-.+\.md$/)
  })

  it('should write active-quest.json with correct fields', async () => {
    const { createQuest } = await import('./quest.js')
    const result = await createQuest('Minha quest', testVault, 2)
    const raw = await readFile(join(testHome, '.codemaster', 'active-quest.json'), 'utf8')
    const state = JSON.parse(raw)
    expect(state.id).toBe(result.id)
    expect(state.title).toBe('Minha quest')
    expect(state.milestone).toBe(2)
    expect(state).toHaveProperty('startedAt')
    expect(state).toHaveProperty('slug')
    expect(state.notePath).toBe(result.notePath)
  })

  it('should use milestone 1 as default', async () => {
    const { createQuest } = await import('./quest.js')
    await createQuest('Quest sem milestone', testVault)
    const raw = await readFile(join(testHome, '.codemaster', 'active-quest.json'), 'utf8')
    const state = JSON.parse(raw)
    expect(state.milestone).toBe(1)
  })

  it('should slugify title with accents', async () => {
    const { createQuest } = await import('./quest.js')
    const result = await createQuest('Implementar autenticação', testVault)
    expect(result.notePath).toContain('implementar-autenticacao')
  })

  it('should include plannedDifficulty in active-quest.json when provided', async () => {
    const { createQuest } = await import('./quest.js')
    await createQuest('Quest com dificuldade', testVault, 1, 4)
    const raw = await readFile(join(testHome, '.codemaster', 'active-quest.json'), 'utf8')
    const state = JSON.parse(raw)
    expect(state.plannedDifficulty).toBe(4)
  })

  it('should not include plannedDifficulty in active-quest.json when not provided', async () => {
    const { createQuest } = await import('./quest.js')
    await createQuest('Quest sem dificuldade', testVault)
    const raw = await readFile(join(testHome, '.codemaster', 'active-quest.json'), 'utf8')
    const state = JSON.parse(raw)
    expect(state).not.toHaveProperty('plannedDifficulty')
  })

  it('should include planned_difficulty and planned_difficulty_value in frontmatter', async () => {
    const { createQuest } = await import('./quest.js')
    await createQuest('Quest dragon', testVault, 1, 4)
    const content = await readFile(join(testVault, 'quests', 'Q001-quest-dragon.md'), 'utf8')
    expect(content).toContain('planned_difficulty: "dragon"')
    expect(content).toContain('planned_difficulty_value: 4')
  })

  it('should not include difficulty fields in frontmatter when not provided', async () => {
    const { createQuest } = await import('./quest.js')
    await createQuest('Quest normal', testVault)
    const content = await readFile(join(testVault, 'quests', 'Q001-quest-normal.md'), 'utf8')
    expect(content).not.toContain('planned_difficulty')
  })
})

// ─── slugify ──────────────────────────────────────────────────────────────────
describe('slugify', () => {
  it('should lowercase and remove accents', async () => {
    const { slugify } = await import('../utils/slugify.js')
    expect(slugify('Implementar Autenticação JWT')).toBe('implementar-autenticacao-jwt')
  })

  it('should replace special characters with dashes', async () => {
    const { slugify } = await import('../utils/slugify.js')
    expect(slugify('Hello World!')).toBe('hello-world')
  })

  it('should trim leading and trailing dashes', async () => {
    const { slugify } = await import('../utils/slugify.js')
    expect(slugify('  hello  ')).toBe('hello')
  })

  it('should limit to 50 characters', async () => {
    const { slugify } = await import('../utils/slugify.js')
    const long = 'a'.repeat(60)
    expect(slugify(long).length).toBeLessThanOrEqual(50)
  })
})
