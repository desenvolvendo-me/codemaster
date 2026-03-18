import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { join } from 'path'
import { tmpdir } from 'os'
import { mkdir, writeFile, readFile, rm } from 'fs/promises'
import { generateFrontmatter } from '../utils/frontmatter.js'

// ─── Mocks ────────────────────────────────────────────────────────────────────
let testHome

vi.mock('os', async (importOriginal) => {
  const actual = await importOriginal()
  return { ...actual, homedir: () => testHome }
})

const TEST_VAULT = join(tmpdir(), 'codemaster-victory-test')
const QUEST_FILENAME = 'Q001-test-quest.md'

const PROGRESS_INITIAL = `# PROGRESS

## Dimensões Atuais
- Negócio: → 0 | Arquitetura: → 0 | IA: → 0

## Milestone 1 — 0/5 victories
`

function makeQuestContent() {
  const fm = generateFrontmatter({
    id: 'Q001', type: 'quest', title: 'Test Quest',
    date: '2026-01-01', milestone: 1,
    tags: ['codemaster', 'quest'], relics: []
  })
  return `${fm}\n# Test Quest\n\n## Reflexão Inicial\nConteúdo da reflexão.\n`
}

const SCORES = { business: 8.0, architecture: 5.5, ai_orchestration: 6.0 }
const REFLECTIONS = {
  'Impacto de negócio': 'Melhorou a experiência do usuário.',
  'Decisão arquitetural': 'Escolhi JWT stateless.',
  'Uso de IA': 'Usei o agente para gerar testes.',
  'Novo aprendizado': 'Aprendi sobre refresh tokens.',
  'Faria diferente': 'Separaria a lógica de autenticação antes.'
}

// ─── calcTrend ────────────────────────────────────────────────────────────────
describe('calcTrend', () => {
  beforeEach(async () => {
    vi.resetModules()
    testHome = join(tmpdir(), `codemaster-test-home-${Date.now()}`)
    await mkdir(join(testHome, '.codemaster'), { recursive: true })
  })

  it('should return ↑ for score >= 7.0', async () => {
    const { calcTrend } = await import('./victory.js')
    expect(calcTrend(7.0)).toBe('↑')
    expect(calcTrend(9.5)).toBe('↑')
    expect(calcTrend(10.0)).toBe('↑')
  })

  it('should return → for score 4.0–6.9', async () => {
    const { calcTrend } = await import('./victory.js')
    expect(calcTrend(4.0)).toBe('→')
    expect(calcTrend(5.5)).toBe('→')
    expect(calcTrend(6.9)).toBe('→')
  })

  it('should return ↓ for score < 4.0', async () => {
    const { calcTrend } = await import('./victory.js')
    expect(calcTrend(3.9)).toBe('↓')
    expect(calcTrend(0.0)).toBe('↓')
  })
})

// ─── closeVictory ─────────────────────────────────────────────────────────────
describe('closeVictory', () => {
  beforeEach(async () => {
    vi.resetModules()
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`
    testHome = join(tmpdir(), `codemaster-test-home-${id}`)
    await mkdir(join(testHome, '.codemaster'), { recursive: true })
    await mkdir(join(TEST_VAULT, 'quests'), { recursive: true })
    await mkdir(join(TEST_VAULT, 'victories'), { recursive: true })
    await writeFile(join(TEST_VAULT, 'quests', QUEST_FILENAME), makeQuestContent(), 'utf8')
    await writeFile(join(TEST_VAULT, 'PROGRESS.md'), PROGRESS_INITIAL, 'utf8')
    await writeFile(join(testHome, '.codemaster', 'active-quest.json'), JSON.stringify({ id: 'Q001' }), 'utf8')
  })

  afterEach(async () => {
    await rm(TEST_VAULT, { recursive: true, force: true })
    if (testHome) await rm(testHome, { recursive: true, force: true })
  })

  it('should create victory file in victories/ folder', async () => {
    const { closeVictory } = await import('./victory.js')
    await closeVictory(QUEST_FILENAME, SCORES, REFLECTIONS, TEST_VAULT)
    const content = await readFile(join(TEST_VAULT, 'victories', QUEST_FILENAME), 'utf8')
    expect(content).toContain('# Victory: Q001-test-quest')
    expect(content).toContain('## Respostas de Reflexão')
    expect(content).toContain('## Análise por Dimensão')
    expect(content).toContain('Negócio: ↑ 8.0')
    expect(content).toContain('Arquitetura: → 5.5')
    expect(content).toContain('IA / Orquestração: → 6.0')
  })

  it('should link victory file back to quest', async () => {
    const { closeVictory } = await import('./victory.js')
    await closeVictory(QUEST_FILENAME, SCORES, REFLECTIONS, TEST_VAULT)
    const content = await readFile(join(TEST_VAULT, 'victories', QUEST_FILENAME), 'utf8')
    expect(content).toContain('[[Q001-test-quest]]')
  })

  it('should add victory link section to quest', async () => {
    const { closeVictory } = await import('./victory.js')
    await closeVictory(QUEST_FILENAME, SCORES, REFLECTIONS, TEST_VAULT)
    const content = await readFile(join(TEST_VAULT, 'quests', QUEST_FILENAME), 'utf8')
    expect(content).toContain('## Victory')
    expect(content).toContain('[[Q001-test-quest]]')
  })

  it('should update quest frontmatter type to victory', async () => {
    const { closeVictory } = await import('./victory.js')
    await closeVictory(QUEST_FILENAME, SCORES, REFLECTIONS, TEST_VAULT)
    const content = await readFile(join(TEST_VAULT, 'quests', QUEST_FILENAME), 'utf8')
    expect(content).toContain('type: "victory"')
    expect(content).not.toContain('type: "quest"')
  })

  it('should add victory ref field to quest frontmatter', async () => {
    const { closeVictory } = await import('./victory.js')
    await closeVictory(QUEST_FILENAME, SCORES, REFLECTIONS, TEST_VAULT)
    const content = await readFile(join(TEST_VAULT, 'quests', QUEST_FILENAME), 'utf8')
    expect(content).toContain('victory: "Q001-test-quest"')
  })

  it('should add score fields to quest frontmatter', async () => {
    const { closeVictory } = await import('./victory.js')
    await closeVictory(QUEST_FILENAME, SCORES, REFLECTIONS, TEST_VAULT)
    const content = await readFile(join(TEST_VAULT, 'quests', QUEST_FILENAME), 'utf8')
    expect(content).toContain('business: "8.0"')
    expect(content).toContain('architecture: "5.5"')
    expect(content).toContain('ai_orchestration: "6.0"')
  })

  it('should update PROGRESS.md with wikilink and scores', async () => {
    const { closeVictory } = await import('./victory.js')
    await closeVictory(QUEST_FILENAME, SCORES, REFLECTIONS, TEST_VAULT)
    const progress = await readFile(join(TEST_VAULT, 'PROGRESS.md'), 'utf8')
    expect(progress).toContain('[[Q001-test-quest]]')
    expect(progress).toContain('N:↑8.0')
    expect(progress).toContain('A:→5.5')
    expect(progress).toContain('IA:→6.0')
  })

  it('should increment milestone victory counter', async () => {
    const { closeVictory } = await import('./victory.js')
    await closeVictory(QUEST_FILENAME, SCORES, REFLECTIONS, TEST_VAULT)
    const progress = await readFile(join(TEST_VAULT, 'PROGRESS.md'), 'utf8')
    expect(progress).toContain('Milestone 1 — 1/5 victories')
  })

  it('should delete active-quest.json', async () => {
    const { closeVictory } = await import('./victory.js')
    await closeVictory(QUEST_FILENAME, SCORES, REFLECTIONS, TEST_VAULT)
    const { readActiveQuest } = await import('../services/state.js')
    const state = await readActiveQuest()
    expect(state).toBeNull()
  })

  it('should return correct trends for each score range', async () => {
    const { closeVictory } = await import('./victory.js')
    const result = await closeVictory(QUEST_FILENAME, SCORES, REFLECTIONS, TEST_VAULT)
    expect(result.trends.business).toBe('↑')
    expect(result.trends.architecture).toBe('→')
    expect(result.trends.ai_orchestration).toBe('→')
  })

  it('should return scores in result', async () => {
    const { closeVictory } = await import('./victory.js')
    const result = await closeVictory(QUEST_FILENAME, SCORES, REFLECTIONS, TEST_VAULT)
    expect(result.scores).toEqual(SCORES)
  })

  it('should preserve existing quest content outside frontmatter', async () => {
    const { closeVictory } = await import('./victory.js')
    await closeVictory(QUEST_FILENAME, SCORES, REFLECTIONS, TEST_VAULT)
    const content = await readFile(join(TEST_VAULT, 'quests', QUEST_FILENAME), 'utf8')
    expect(content).toContain('## Reflexão Inicial')
    expect(content).toContain('# Test Quest')
  })
})
