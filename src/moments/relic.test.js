import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { join } from 'path'
import { tmpdir } from 'os'
import { mkdir, writeFile, readFile, rm } from 'fs/promises'
import { addRelic } from './relic.js'
import { generateFrontmatter } from '../utils/frontmatter.js'

const TEST_VAULT = join(tmpdir(), 'codemaster-relic-test')

const QUEST_FILENAME = 'Q001-test-quest.md'

function makeQuestContent(relics = []) {
  const fm = generateFrontmatter({
    id: 'Q001', type: 'quest', title: 'Test Quest',
    date: '2026-01-01', milestone: 1,
    tags: ['codemaster', 'quest'], relics
  })
  return `${fm}\n# Test Quest\n\n## Reflexão Inicial\n`
}

describe('addRelic', () => {
  beforeEach(async () => {
    await mkdir(join(TEST_VAULT, 'quests'), { recursive: true })
    await mkdir(join(TEST_VAULT, 'relics'), { recursive: true })
    await writeFile(join(TEST_VAULT, 'quests', QUEST_FILENAME), makeQuestContent(), 'utf8')
  })

  afterEach(async () => {
    await rm(TEST_VAULT, { recursive: true, force: true })
  })

  it('should append relic section to quest note', async () => {
    await addRelic('Sessions devem ser stateless', 'Arquitetural', TEST_VAULT, QUEST_FILENAME)
    const content = await readFile(join(TEST_VAULT, 'quests', QUEST_FILENAME), 'utf8')
    expect(content).toContain('## Relic R001')
    expect(content).toContain('**Dimensão:** Arquitetural')
    expect(content).toContain('**Descoberta:** Sessions devem ser stateless')
  })

  it('should update relics array in quest frontmatter', async () => {
    await addRelic('Sessions devem ser stateless', 'Arquitetural', TEST_VAULT, QUEST_FILENAME)
    const content = await readFile(join(TEST_VAULT, 'quests', QUEST_FILENAME), 'utf8')
    expect(content).toContain('"R001"')
  })

  it('should accumulate multiple relics in frontmatter', async () => {
    await addRelic('Primeira descoberta', 'Negocial', TEST_VAULT, QUEST_FILENAME)
    await addRelic('Segunda descoberta', 'Arquitetural', TEST_VAULT, QUEST_FILENAME)
    const content = await readFile(join(TEST_VAULT, 'quests', QUEST_FILENAME), 'utf8')
    expect(content).toContain('"R001"')
    expect(content).toContain('"R002"')
  })

  it('should archive to relics/ when archiveToRelics is true', async () => {
    await addRelic('JWT é stateless', 'Arquitetural', TEST_VAULT, QUEST_FILENAME, true)
    const { access } = await import('fs/promises')
    await expect(access(join(TEST_VAULT, 'relics', 'R001-jwt-e-stateless.md'))).resolves.toBeUndefined()
  })

  it('should NOT archive to relics/ when archiveToRelics is false', async () => {
    await addRelic('Descobre algo', 'Negocial', TEST_VAULT, QUEST_FILENAME, false)
    const relics = await import('fs/promises').then(m => m.readdir(join(TEST_VAULT, 'relics')))
    expect(relics.filter(f => f.endsWith('.md'))).toHaveLength(0)
  })

  it('should generate correct relic ID based on existing count', async () => {
    await writeFile(join(TEST_VAULT, 'relics', 'R001-existing.md'), '', 'utf8')
    const result = await addRelic('Nova descoberta', 'Negocial', TEST_VAULT, QUEST_FILENAME, true)
    expect(result.relicId).toBe('R002')
  })

  it('should return { relicId, archived }', async () => {
    const result = await addRelic('Descoberta X', 'Orquestração de IA', TEST_VAULT, QUEST_FILENAME)
    expect(result).toHaveProperty('relicId', 'R001')
    expect(result).toHaveProperty('archived', false)
  })

  it('should return archived: true when archiveToRelics is true', async () => {
    const result = await addRelic('Descoberta Y', 'Negocial', TEST_VAULT, QUEST_FILENAME, true)
    expect(result.archived).toBe(true)
  })

  it('archived relic file should have correct frontmatter', async () => {
    await addRelic('JWT é stateless', 'Arquitetural', TEST_VAULT, QUEST_FILENAME, true)
    const content = await readFile(join(TEST_VAULT, 'relics', 'R001-jwt-e-stateless.md'), 'utf8')
    expect(content).toContain('id: "R001"')
    expect(content).toContain('type: "relic"')
    expect(content).toContain('dimension: "Arquitetural"')
  })

  it('should preserve quest content outside frontmatter', async () => {
    await addRelic('Algo descoberto', 'Arquitetural', TEST_VAULT, QUEST_FILENAME)
    const content = await readFile(join(TEST_VAULT, 'quests', QUEST_FILENAME), 'utf8')
    expect(content).toContain('## Reflexão Inicial')
    expect(content).toContain('# Test Quest')
  })
})
