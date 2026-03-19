import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { join } from 'path'
import { tmpdir } from 'os'
import { mkdir, writeFile, rm } from 'fs/promises'
import { getLegend } from './legend.js'
import { generateFrontmatter } from '../utils/frontmatter.js'

const TEST_VAULT = join(tmpdir(), 'codemaster-legend-test')

function makeVictoryNote({ id, title, date, milestone, business, architecture, ai_orchestration }) {
  const fm = generateFrontmatter({
    id, type: 'victory', title, date, milestone,
    tags: ['codemaster', 'quest'], relics: [],
    business: String(business), architecture: String(architecture), ai_orchestration: String(ai_orchestration)
  })
  return `${fm}\n# ${title}\n\n## Victory — ${date}T10:00:00.000Z\n`
}

function makeRelicNote({ id, title, dimension }) {
  const fm = generateFrontmatter({ id, type: 'relic', title, date: '2026-01-01', dimension, tags: ['codemaster', 'relic'] })
  return `${fm}\n# ${title}\n`
}

describe('getLegend', () => {
  beforeEach(async () => {
    await mkdir(join(TEST_VAULT, 'quests'), { recursive: true })
    await mkdir(join(TEST_VAULT, 'victories'), { recursive: true })
    await mkdir(join(TEST_VAULT, 'relics'), { recursive: true })
  })

  afterEach(async () => {
    await rm(TEST_VAULT, { recursive: true, force: true })
  })

  it('should return empty milestones when no victories exist', async () => {
    const result = await getLegend(TEST_VAULT)
    expect(result.milestones).toHaveLength(0)
    expect(result.lastVictory).toBeNull()
    expect(result.suggestedFocus).toBeNull()
    expect(result.currentDimensions).toBeNull()
  })

  it('should ignore quest notes (non-victory)', async () => {
    const fm = generateFrontmatter({ id: 'Q001', type: 'quest', title: 'Active', date: '2026-01-01', milestone: 1, tags: [], relics: [] })
    await writeFile(join(TEST_VAULT, 'quests', 'Q001-active.md'), `${fm}\n# Active\n`, 'utf8')
    const result = await getLegend(TEST_VAULT)
    expect(result.milestones).toHaveLength(0)
  })

  it('should group victories by milestone', async () => {
    await writeFile(join(TEST_VAULT, 'victories', 'V001-first.md'),
      makeVictoryNote({ id: 'Q001', title: 'First', date: '2026-01-01', milestone: 1, business: 8.0, architecture: 7.0, ai_orchestration: 6.0 }), 'utf8')
    await writeFile(join(TEST_VAULT, 'victories', 'V002-second.md'),
      makeVictoryNote({ id: 'Q002', title: 'Second', date: '2026-01-15', milestone: 1, business: 9.0, architecture: 8.0, ai_orchestration: 7.0 }), 'utf8')
    await writeFile(join(TEST_VAULT, 'victories', 'V003-third.md'),
      makeVictoryNote({ id: 'Q003', title: 'Third', date: '2026-02-01', milestone: 2, business: 5.0, architecture: 6.0, ai_orchestration: 8.0 }), 'utf8')
    const result = await getLegend(TEST_VAULT)
    expect(result.milestones).toHaveLength(2)
    expect(result.milestones[0].victories).toHaveLength(2)
    expect(result.milestones[1].victories).toHaveLength(1)
  })

  it('should calculate dimension averages per milestone', async () => {
    await writeFile(join(TEST_VAULT, 'victories', 'V001-a.md'),
      makeVictoryNote({ id: 'Q001', title: 'A', date: '2026-01-01', milestone: 1, business: 8.0, architecture: 6.0, ai_orchestration: 4.0 }), 'utf8')
    await writeFile(join(TEST_VAULT, 'victories', 'V002-b.md'),
      makeVictoryNote({ id: 'Q002', title: 'B', date: '2026-01-15', milestone: 1, business: 6.0, architecture: 4.0, ai_orchestration: 8.0 }), 'utf8')
    const result = await getLegend(TEST_VAULT)
    const avgs = result.milestones[0].averages
    expect(avgs.business).toBe(7.0)
    expect(avgs.architecture).toBe(5.0)
    expect(avgs.ai_orchestration).toBe(6.0)
  })

  it('should identify last victory by date', async () => {
    await writeFile(join(TEST_VAULT, 'victories', 'V001-old.md'),
      makeVictoryNote({ id: 'Q001', title: 'Old', date: '2026-01-01', milestone: 1, business: 5.0, architecture: 5.0, ai_orchestration: 5.0 }), 'utf8')
    await writeFile(join(TEST_VAULT, 'victories', 'V002-new.md'),
      makeVictoryNote({ id: 'Q002', title: 'New', date: '2026-03-17', milestone: 1, business: 8.0, architecture: 8.0, ai_orchestration: 8.0 }), 'utf8')
    const result = await getLegend(TEST_VAULT)
    expect(result.lastVictory.id).toBe('Q002')
    expect(result.lastVictory.date).toBe('2026-03-17')
  })

  it('should suggest focus as lowest scoring dimension', async () => {
    await writeFile(join(TEST_VAULT, 'victories', 'V001-q.md'),
      makeVictoryNote({ id: 'Q001', title: 'Q', date: '2026-01-01', milestone: 1, business: 8.0, architecture: 3.0, ai_orchestration: 6.0 }), 'utf8')
    const result = await getLegend(TEST_VAULT)
    expect(result.suggestedFocus).toBe('architecture')
  })

  it('should return currentDimensions trends based on milestone averages', async () => {
    await writeFile(join(TEST_VAULT, 'victories', 'V001-q.md'),
      makeVictoryNote({ id: 'Q001', title: 'Q', date: '2026-01-01', milestone: 1, business: 8.0, architecture: 5.0, ai_orchestration: 3.0 }), 'utf8')
    const result = await getLegend(TEST_VAULT)
    expect(result.currentDimensions.business).toBe('↑')
    expect(result.currentDimensions.architecture).toBe('→')
    expect(result.currentDimensions.ai_orchestration).toBe('↓')
  })

  it('should return bestRelic when relics exist', async () => {
    await writeFile(join(TEST_VAULT, 'victories', 'V001-q.md'),
      makeVictoryNote({ id: 'Q001', title: 'Q', date: '2026-01-01', milestone: 1, business: 7.0, architecture: 7.0, ai_orchestration: 7.0 }), 'utf8')
    await writeFile(join(TEST_VAULT, 'relics', 'R001-jwt.md'),
      makeRelicNote({ id: 'R001', title: 'JWT é stateless', dimension: 'Arquitetural' }), 'utf8')
    const result = await getLegend(TEST_VAULT)
    expect(result.bestRelic).not.toBeNull()
    expect(result.bestRelic.id).toBe('R001')
    expect(result.bestRelic.dimension).toBe('Arquitetural')
  })

  it('should return bestRelic null when no relics exist', async () => {
    await writeFile(join(TEST_VAULT, 'victories', 'V001-q.md'),
      makeVictoryNote({ id: 'Q001', title: 'Q', date: '2026-01-01', milestone: 1, business: 7.0, architecture: 7.0, ai_orchestration: 7.0 }), 'utf8')
    const result = await getLegend(TEST_VAULT)
    expect(result.bestRelic).toBeNull()
  })
})
