import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { join } from 'path'
import { tmpdir } from 'os'
import { mkdir, writeFile, readFile, rm } from 'fs/promises'
import { generateKnowledge } from './knowledge.js'
import { generateFrontmatter } from '../utils/frontmatter.js'

const TEST_VAULT = join(tmpdir(), 'codemaster-knowledge-test')

function makeVictoryNote({ id, title, date, milestone, business, architecture, ai_orchestration }) {
  const fm = generateFrontmatter({
    id, type: 'victory', title, date, milestone,
    tags: ['codemaster', 'quest'], relics: [],
    business: String(business), architecture: String(architecture), ai_orchestration: String(ai_orchestration)
  })
  return `${fm}\n# ${title}\n`
}

async function writeVictory(fileName, fields) {
  await writeFile(join(TEST_VAULT, 'quests', fileName), makeVictoryNote(fields), 'utf8')
}

describe('generateKnowledge', () => {
  beforeEach(async () => {
    await mkdir(join(TEST_VAULT, 'quests'), { recursive: true })
    await writeFile(join(TEST_VAULT, 'KNOWLEDGE-MAP.md'), '# KNOWLEDGE-MAP\n', 'utf8')
  })

  afterEach(async () => {
    await rm(TEST_VAULT, { recursive: true, force: true })
  })

  it('should return insufficient:true when fewer than 3 victories', async () => {
    await writeVictory('Q001-a.md', { id: 'Q001', title: 'A', date: '2026-01-01', milestone: 1, business: 7.0, architecture: 6.0, ai_orchestration: 5.0 })
    await writeVictory('Q002-b.md', { id: 'Q002', title: 'B', date: '2026-01-15', milestone: 1, business: 8.0, architecture: 7.0, ai_orchestration: 6.0 })
    const result = await generateKnowledge(TEST_VAULT)
    expect(result.insufficient).toBe(true)
    expect(result.count).toBe(2)
  })

  it('should return insufficient:false when 3 or more victories', async () => {
    await writeVictory('Q001-a.md', { id: 'Q001', title: 'A', date: '2026-01-01', milestone: 1, business: 7.0, architecture: 6.0, ai_orchestration: 5.0 })
    await writeVictory('Q002-b.md', { id: 'Q002', title: 'B', date: '2026-01-15', milestone: 1, business: 8.0, architecture: 7.0, ai_orchestration: 6.0 })
    await writeVictory('Q003-c.md', { id: 'Q003', title: 'C', date: '2026-02-01', milestone: 1, business: 6.0, architecture: 5.0, ai_orchestration: 7.0 })
    const result = await generateKnowledge(TEST_VAULT)
    expect(result.insufficient).toBe(false)
  })

  it('should ignore non-victory quest notes', async () => {
    const fm = generateFrontmatter({ id: 'Q001', type: 'quest', title: 'Active', date: '2026-01-01', milestone: 1, tags: [], relics: [] })
    await writeFile(join(TEST_VAULT, 'quests', 'Q001-active.md'), `${fm}\n# Active\n`, 'utf8')
    const result = await generateKnowledge(TEST_VAULT)
    expect(result.insufficient).toBe(true)
    expect(result.count).toBe(0)
  })

  it('should calculate correct dimension averages', async () => {
    await writeVictory('Q001-a.md', { id: 'Q001', title: 'A', date: '2026-01-01', milestone: 1, business: 9.0, architecture: 3.0, ai_orchestration: 6.0 })
    await writeVictory('Q002-b.md', { id: 'Q002', title: 'B', date: '2026-01-15', milestone: 1, business: 7.0, architecture: 5.0, ai_orchestration: 4.0 })
    await writeVictory('Q003-c.md', { id: 'Q003', title: 'C', date: '2026-02-01', milestone: 1, business: 8.0, architecture: 4.0, ai_orchestration: 5.0 })
    const result = await generateKnowledge(TEST_VAULT)
    // architecture avg = (3+5+4)/3 = 4.0 → maior gap
    const archGap = result.gaps.find(g => g.dimension === 'architecture')
    expect(archGap).toBeDefined()
    expect(archGap.averageScore).toBe('4.0')
  })

  it('should return gaps sorted by lowest average score', async () => {
    await writeVictory('Q001-a.md', { id: 'Q001', title: 'A', date: '2026-01-01', milestone: 1, business: 9.0, architecture: 3.0, ai_orchestration: 5.0 })
    await writeVictory('Q002-b.md', { id: 'Q002', title: 'B', date: '2026-01-15', milestone: 1, business: 8.0, architecture: 4.0, ai_orchestration: 6.0 })
    await writeVictory('Q003-c.md', { id: 'Q003', title: 'C', date: '2026-02-01', milestone: 1, business: 7.0, architecture: 2.0, ai_orchestration: 7.0 })
    const result = await generateKnowledge(TEST_VAULT)
    // architecture avg = 3.0, ai_orchestration = 6.0, business = 8.0
    expect(result.gaps[0].dimension).toBe('architecture')
  })

  it('should write KNOWLEDGE-MAP.md with correct format', async () => {
    await writeVictory('Q001-a.md', { id: 'Q001', title: 'A', date: '2026-01-01', milestone: 1, business: 9.0, architecture: 3.0, ai_orchestration: 5.0 })
    await writeVictory('Q002-b.md', { id: 'Q002', title: 'B', date: '2026-01-15', milestone: 1, business: 8.0, architecture: 4.0, ai_orchestration: 6.0 })
    await writeVictory('Q003-c.md', { id: 'Q003', title: 'C', date: '2026-02-01', milestone: 1, business: 7.0, architecture: 2.0, ai_orchestration: 7.0 })
    await generateKnowledge(TEST_VAULT)
    const content = await readFile(join(TEST_VAULT, 'KNOWLEDGE-MAP.md'), 'utf8')
    expect(content).toContain('# KNOWLEDGE-MAP')
    expect(content).toContain('## Lacunas por Dimensão')
    expect(content).toContain('### Negócio')
    expect(content).toContain('### Arquitetura')
    expect(content).toContain('### IA')
    expect(content).toContain('## Próximo Milestone — Foco recomendado')
    expect(content).toContain('Prioridade 1:')
    expect(content).toContain('Prioridade 2:')
  })

  it('should include wikilink sources for low-scoring quests', async () => {
    await writeVictory('Q001-a.md', { id: 'Q001', title: 'A', date: '2026-01-01', milestone: 1, business: 9.0, architecture: 2.0, ai_orchestration: 6.0 })
    await writeVictory('Q002-b.md', { id: 'Q002', title: 'B', date: '2026-01-15', milestone: 1, business: 8.0, architecture: 3.0, ai_orchestration: 5.0 })
    await writeVictory('Q003-c.md', { id: 'Q003', title: 'C', date: '2026-02-01', milestone: 1, business: 7.0, architecture: 4.0, ai_orchestration: 7.0 })
    await generateKnowledge(TEST_VAULT)
    const content = await readFile(join(TEST_VAULT, 'KNOWLEDGE-MAP.md'), 'utf8')
    expect(content).toContain('[[Q001-a]]')
    expect(content).toContain('[[Q002-b]]')
  })

  it('should return knowledgeMapPath in result', async () => {
    await writeVictory('Q001-a.md', { id: 'Q001', title: 'A', date: '2026-01-01', milestone: 1, business: 9.0, architecture: 3.0, ai_orchestration: 5.0 })
    await writeVictory('Q002-b.md', { id: 'Q002', title: 'B', date: '2026-01-15', milestone: 1, business: 8.0, architecture: 4.0, ai_orchestration: 6.0 })
    await writeVictory('Q003-c.md', { id: 'Q003', title: 'C', date: '2026-02-01', milestone: 1, business: 7.0, architecture: 2.0, ai_orchestration: 7.0 })
    const result = await generateKnowledge(TEST_VAULT)
    expect(result.knowledgeMapPath).toBe('KNOWLEDGE-MAP.md')
  })
})
