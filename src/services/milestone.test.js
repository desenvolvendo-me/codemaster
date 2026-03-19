import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('./vault.js', () => ({
  listNotes: vi.fn(),
  readNote: vi.fn(),
  updateNote: vi.fn(),
  createNote: vi.fn(),
}))

vi.mock('fs/promises', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    rename: vi.fn().mockResolvedValue(undefined),
    mkdir: vi.fn().mockResolvedValue(undefined),
    copyFile: vi.fn().mockResolvedValue(undefined),
    unlink: vi.fn().mockResolvedValue(undefined),
  }
})

import * as vault from './vault.js'
import * as fsp from 'fs/promises'
import {
  detectMilestone,
  createMilestoneSummary,
  updateProgressForMilestone,
  reorganizeVault,
  updateKnowledgeMap,
  identifyGaps,
} from './milestone.js'

// ── Helper ─────────────────────────────────────────────────────────────────────

function makeVictoryNote(id, milestone = 1, b = 2, a = 2, ai = 2, date = '2026-03-01') {
  return `---
id: ${id}
type: victory
title: Quest ${id}
date: ${date}
milestone: ${milestone}
business: ${b}
architecture: ${a}
ai_orchestration: ${ai}
---

# Quest ${id}
`
}

function makeQuestNote(id) {
  return `---
id: ${id}
type: quest
title: Quest ${id}
date: 2026-03-01
milestone: 1
---
`
}

// ── detectMilestone ────────────────────────────────────────────────────────────

describe('detectMilestone', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should return isComplete: false with 4 victories', async () => {
    const files = ['V001.md', 'V002.md', 'V003.md', 'V004.md', 'quest.md']
    vault.listNotes.mockImplementation((_, type) => Promise.resolve(type === 'victories' ? files : []))
    vault.readNote.mockImplementation((_, __, file) => {
      if (file === 'quest.md') return Promise.resolve(makeQuestNote('Q001'))
      return Promise.resolve(makeVictoryNote(file.replace('.md', '')))
    })

    const result = await detectMilestone('/vault')
    expect(result.isComplete).toBe(false)
    expect(result.victories).toHaveLength(4)
  })

  it('should return isComplete: true with exactly 5 victories', async () => {
    const files = ['V001.md', 'V002.md', 'V003.md', 'V004.md', 'V005.md']
    vault.listNotes.mockImplementation((_, type) => Promise.resolve(type === 'victories' ? files : []))
    vault.readNote.mockImplementation((_, __, file) =>
      Promise.resolve(makeVictoryNote(file.replace('.md', '')))
    )

    const result = await detectMilestone('/vault')
    expect(result.isComplete).toBe(true)
    expect(result.victories).toHaveLength(5)
  })

  it('should return isComplete: true with more than 5 victories', async () => {
    const files = ['V001.md', 'V002.md', 'V003.md', 'V004.md', 'V005.md', 'V006.md']
    vault.listNotes.mockImplementation((_, type) => Promise.resolve(type === 'victories' ? files : []))
    vault.readNote.mockImplementation((_, __, file) =>
      Promise.resolve(makeVictoryNote(file.replace('.md', '')))
    )

    const result = await detectMilestone('/vault')
    expect(result.isComplete).toBe(true)
  })

  it('should return isComplete: false when vault is empty', async () => {
    vault.listNotes.mockResolvedValue([])

    const result = await detectMilestone('/vault')
    expect(result.isComplete).toBe(false)
    expect(result.victories).toHaveLength(0)
    expect(result.milestoneId).toBe(1)
  })

  it('should count only victories from the current (highest) milestone', async () => {
    vault.listNotes.mockImplementation((_, type) => Promise.resolve(type === 'victories' ? ['V001.md', 'V002.md', 'V003.md', 'V004.md', 'V005.md', 'V006.md'] : []))
    vault.readNote.mockImplementation((_, __, file) => {
      const idx = parseInt(file.replace('V', '').replace('.md', ''))
      const milestone = idx <= 5 ? 1 : 2
      return Promise.resolve(makeVictoryNote(file.replace('.md', ''), milestone))
    })

    const result = await detectMilestone('/vault')
    expect(result.milestoneId).toBe(2)
    expect(result.victories).toHaveLength(1)
    expect(result.isComplete).toBe(false)
  })

  it('should include fileName in each victory', async () => {
    vault.listNotes.mockImplementation((_, type) => Promise.resolve(type === 'victories' ? ['V001.md'] : []))
    vault.readNote.mockResolvedValue(makeVictoryNote('V001'))

    const result = await detectMilestone('/vault')
    expect(result.victories[0].fileName).toBe('V001.md')
  })
})

// ── createMilestoneSummary ─────────────────────────────────────────────────────

describe('createMilestoneSummary', () => {
  beforeEach(() => vi.clearAllMocks())

  const makeData = (milestoneId = 1) => ({
    milestoneId,
    victories: [
      { id: 'V001', title: 'Quest 1', date: '2026-03-01', milestone: '1', business: '3', architecture: '2', ai_orchestration: '1', fileName: 'V001-quest-1.md' },
      { id: 'V002', title: 'Quest 2', date: '2026-03-05', milestone: '1', business: '2', architecture: '3', ai_orchestration: '2', fileName: 'V002-quest-2.md' },
      { id: 'V003', title: 'Quest 3', date: '2026-03-10', milestone: '1', business: '1', architecture: '3', ai_orchestration: '3', fileName: 'V003-quest-3.md' },
      { id: 'V004', title: 'Quest 4', date: '2026-03-12', milestone: '1', business: '2', architecture: '2', ai_orchestration: '2', fileName: 'V004-quest-4.md' },
      { id: 'V005', title: 'Quest 5', date: '2026-03-17', milestone: '1', business: '3', architecture: '3', ai_orchestration: '3', fileName: 'V005-quest-5.md' },
    ]
  })

  it('should call createNote with correct milestone ID', async () => {
    vault.createNote.mockResolvedValue(undefined)
    await createMilestoneSummary('/vault', makeData(1))
    expect(vault.createNote).toHaveBeenCalledWith(
      '/vault', '', 'M01', 'summary', expect.any(String)
    )
  })

  it('should include wikilinks to quest files in the summary', async () => {
    vault.createNote.mockResolvedValue(undefined)
    await createMilestoneSummary('/vault', makeData())
    const content = vault.createNote.mock.calls[0][4]
    expect(content).toContain('[[V001-quest-1]]')
    expect(content).toContain('[[V005-quest-5]]')
  })

  it('should include dimension averages in the summary', async () => {
    vault.createNote.mockResolvedValue(undefined)
    await createMilestoneSummary('/vault', makeData())
    const content = vault.createNote.mock.calls[0][4]
    expect(content).toContain('Negócio')
    expect(content).toContain('Arquitetura')
    expect(content).toContain('IA')
  })

  it('should include frontmatter in the summary', async () => {
    vault.createNote.mockResolvedValue(undefined)
    await createMilestoneSummary('/vault', makeData(1))
    const content = vault.createNote.mock.calls[0][4]
    expect(content.startsWith('---')).toBe(true)
    expect(content).toContain('type: "milestone"')
    expect(content).toContain('milestone: 1')
  })

  it('should pad milestone ID to 2 digits', async () => {
    vault.createNote.mockResolvedValue(undefined)
    await createMilestoneSummary('/vault', makeData(2))
    expect(vault.createNote).toHaveBeenCalledWith('/vault', '', 'M02', 'summary', expect.any(String))
  })
})

// ── updateProgressForMilestone ────────────────────────────────────────────────

describe('updateProgressForMilestone', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should mark milestone as complete and open next in PROGRESS.md', async () => {
    const progress = `# PROGRESS\n\n## Dimensões Atuais\n- Negócio: → 0 | Arquitetura: → 0 | IA: → 0\n\n## Milestone 1 — 3/5 victories\n`
    vault.readNote.mockResolvedValue(progress)
    vault.updateNote.mockResolvedValue(undefined)

    await updateProgressForMilestone('/vault', 1)

    const updated = vault.updateNote.mock.calls[0][3]
    expect(updated).toContain('## Milestone 1 ✓ — [[M01-summary]]')
    expect(updated).toContain('## Milestone 2 — 0/5 victories')
  })

  it('should read PROGRESS.md from vault root (type empty)', async () => {
    vault.readNote.mockResolvedValue('# PROGRESS\n\n## Milestone 1 — 5/5 victories\n')
    vault.updateNote.mockResolvedValue(undefined)

    await updateProgressForMilestone('/vault', 1)

    expect(vault.readNote).toHaveBeenCalledWith('/vault', '', 'PROGRESS.md')
  })

  it('should write updated PROGRESS.md to vault root', async () => {
    vault.readNote.mockResolvedValue('# PROGRESS\n\n## Milestone 1 — 5/5 victories\n')
    vault.updateNote.mockResolvedValue(undefined)

    await updateProgressForMilestone('/vault', 1)

    expect(vault.updateNote).toHaveBeenCalledWith('/vault', '', 'PROGRESS.md', expect.any(String))
  })
})

// ── identifyGaps ───────────────────────────────────────────────────────────────

describe('identifyGaps', () => {
  const victories = [
    { business: '3', architecture: '1', ai_orchestration: '2' },
    { business: '3', architecture: '2', ai_orchestration: '1' },
    { business: '2', architecture: '1', ai_orchestration: '2' },
  ]

  it('should return array sorted by lowest average score first', () => {
    const gaps = identifyGaps(victories)
    expect(gaps[0].dimension).toBe('architecture')
    expect(gaps[0].averageScore).toBeCloseTo(1.33, 1)
  })

  it('should return at most 3 gaps', () => {
    const gaps = identifyGaps(victories)
    expect(gaps.length).toBeLessThanOrEqual(3)
  })

  it('should include a recommendation for each gap', () => {
    const gaps = identifyGaps(victories)
    for (const gap of gaps) {
      expect(gap.recommendation).toBeTruthy()
    }
  })

  it('should include dimension name in each gap', () => {
    const gaps = identifyGaps(victories)
    const dims = gaps.map(g => g.dimension)
    expect(dims).toContain('architecture')
    expect(dims).toContain('ai_orchestration')
    expect(dims).toContain('business')
  })

  it('should return empty array when victories is empty', () => {
    const gaps = identifyGaps([])
    expect(gaps).toEqual([])
  })
})

// ── reorganizeVault ────────────────────────────────────────────────────────────

describe('reorganizeVault', () => {
  beforeEach(() => vi.clearAllMocks())

  const makeNote = (milestone) => `---\nid: V001\ntype: victory\nmilestone: ${milestone}\n---\n`

  it('should create milestone-01/quests and milestone-01/relics directories', async () => {
    vault.listNotes.mockResolvedValue([])

    await reorganizeVault('/vault', 1)

    expect(fsp.mkdir).toHaveBeenCalledWith(expect.stringContaining('milestone-01'), expect.any(Object))
  })

  it('should pad milestone folder to 2 digits', async () => {
    vault.listNotes.mockResolvedValue([])

    await reorganizeVault('/vault', 2)

    expect(fsp.mkdir).toHaveBeenCalledWith(expect.stringContaining('milestone-02'), expect.any(Object))
  })

  it('should move quest files belonging to the milestone', async () => {
    vault.listNotes.mockImplementation((_, type) =>
      type === 'quests' ? Promise.resolve(['V001-quest.md']) : Promise.resolve([])
    )
    vault.readNote.mockResolvedValue(makeNote(1))

    await reorganizeVault('/vault', 1)

    expect(fsp.rename).toHaveBeenCalledWith(
      expect.stringContaining('quests/V001-quest.md'),
      expect.stringContaining('milestone-01/quests/V001-quest.md')
    )
  })

  it('should NOT move quest files from a different milestone', async () => {
    vault.listNotes.mockImplementation((_, type) =>
      type === 'quests' ? Promise.resolve(['V001-quest.md']) : Promise.resolve([])
    )
    vault.readNote.mockResolvedValue(makeNote(2)) // milestone 2, not 1

    await reorganizeVault('/vault', 1)

    expect(fsp.rename).not.toHaveBeenCalledWith(
      expect.stringContaining('V001-quest.md'),
      expect.stringContaining('milestone-01')
    )
  })

  it('should move relic files belonging to the milestone', async () => {
    vault.listNotes.mockImplementation((_, type) =>
      type === 'relics' ? Promise.resolve(['R001-relic.md']) : Promise.resolve([])
    )
    vault.readNote.mockResolvedValue(makeNote(1))

    await reorganizeVault('/vault', 1)

    expect(fsp.rename).toHaveBeenCalledWith(
      expect.stringContaining('relics/R001-relic.md'),
      expect.stringContaining('milestone-01/relics/R001-relic.md')
    )
  })

  it('should move victory files belonging to the milestone', async () => {
    vault.listNotes.mockImplementation((_, type) =>
      type === 'victories' ? Promise.resolve(['V001-quest.md']) : Promise.resolve([])
    )
    vault.readNote.mockResolvedValue(makeNote(1))

    await reorganizeVault('/vault', 1)

    expect(fsp.rename).toHaveBeenCalledWith(
      expect.stringContaining('victories/V001-quest.md'),
      expect.stringContaining('milestone-01/victories/V001-quest.md')
    )
  })

  it('should move M01-summary.md to milestone-01/', async () => {
    vault.listNotes.mockResolvedValue([])

    await reorganizeVault('/vault', 1)

    expect(fsp.rename).toHaveBeenCalledWith(
      expect.stringContaining('M01-summary.md'),
      expect.stringContaining('milestone-01/M01-summary.md')
    )
  })
})

// ── updateKnowledgeMap ─────────────────────────────────────────────────────────

describe('updateKnowledgeMap', () => {
  beforeEach(() => vi.clearAllMocks())

  const baseKm = `# KNOWLEDGE MAP\n\n## Negócio\n<!-- gaps -->\n\n## Arquitetura\n<!-- gaps -->\n\n## IA / Orquestração\n<!-- gaps -->\n`

  it('should read KNOWLEDGE-MAP.md from vault root', async () => {
    vault.readNote.mockResolvedValue(baseKm)
    vault.updateNote.mockResolvedValue(undefined)
    await updateKnowledgeMap('/vault', [])
    expect(vault.readNote).toHaveBeenCalledWith('/vault', '', 'KNOWLEDGE-MAP.md')
  })

  it('should write updated content back to KNOWLEDGE-MAP.md', async () => {
    vault.readNote.mockResolvedValue(baseKm)
    vault.updateNote.mockResolvedValue(undefined)
    await updateKnowledgeMap('/vault', [])
    expect(vault.updateNote).toHaveBeenCalledWith('/vault', '', 'KNOWLEDGE-MAP.md', expect.any(String))
  })

  it('should append business gap to Negócio section', async () => {
    vault.readNote.mockResolvedValue(baseKm)
    vault.updateNote.mockResolvedValue(undefined)
    const gaps = [{ dimension: 'business', topic: 'pricing strategy', recommendation: 'estude X', averageScore: 1.5 }]
    await updateKnowledgeMap('/vault', gaps)
    const updated = vault.updateNote.mock.calls[0][3]
    expect(updated).toContain('pricing strategy')
    expect(updated).toContain('Negócio')
  })

  it('should append architecture gap to Arquitetura section', async () => {
    vault.readNote.mockResolvedValue(baseKm)
    vault.updateNote.mockResolvedValue(undefined)
    const gaps = [{ dimension: 'architecture', topic: 'CQRS', recommendation: 'estude Y', averageScore: 1.2 }]
    await updateKnowledgeMap('/vault', gaps)
    const updated = vault.updateNote.mock.calls[0][3]
    expect(updated).toContain('CQRS')
  })

  it('should append ai gap to IA / Orquestração section', async () => {
    vault.readNote.mockResolvedValue(baseKm)
    vault.updateNote.mockResolvedValue(undefined)
    const gaps = [{ dimension: 'ai_orchestration', topic: 'RAG pipelines', recommendation: 'estude Z', averageScore: 1.0 }]
    await updateKnowledgeMap('/vault', gaps)
    const updated = vault.updateNote.mock.calls[0][3]
    expect(updated).toContain('RAG pipelines')
  })
})
