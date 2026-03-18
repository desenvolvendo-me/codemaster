import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mkdir, writeFile, readFile, rm } from 'fs/promises'
import { join } from 'path'
import { initVault, createNote, readNote, updateNote, listNotes } from './vault.js'

const TEST_VAULT = '/tmp/codemaster-test-vault'

describe('vault', () => {
  beforeEach(async () => {
    try { await rm(TEST_VAULT, { recursive: true }) } catch {}
    await mkdir(TEST_VAULT, { recursive: true })
  })

  afterEach(async () => {
    try { await rm(TEST_VAULT, { recursive: true }) } catch {}
  })

  // ── initVault ───────────────────────────────────────────────────────────────

  describe('initVault', () => {
    it('should create quests/, relics/, victories/ and milestones/ directories', async () => {
      await initVault(TEST_VAULT)
      const { stat } = await import('fs/promises')
      await expect(stat(join(TEST_VAULT, 'quests'))).resolves.toBeTruthy()
      await expect(stat(join(TEST_VAULT, 'relics'))).resolves.toBeTruthy()
      await expect(stat(join(TEST_VAULT, 'victories'))).resolves.toBeTruthy()
      await expect(stat(join(TEST_VAULT, 'milestones'))).resolves.toBeTruthy()
    })

    it('should create PROGRESS.md when it does not exist', async () => {
      await initVault(TEST_VAULT)
      const content = await readFile(join(TEST_VAULT, 'PROGRESS.md'), 'utf8')
      expect(content).toContain('# PROGRESS')
      expect(content).toContain('Milestone 1')
      expect(content).toContain('Dimensões Atuais')
    })

    it('should create KNOWLEDGE-MAP.md when it does not exist', async () => {
      await initVault(TEST_VAULT)
      const content = await readFile(join(TEST_VAULT, 'KNOWLEDGE-MAP.md'), 'utf8')
      expect(content).toContain('# KNOWLEDGE MAP')
      expect(content).toContain('## Negócio')
      expect(content).toContain('## Arquitetura')
      expect(content).toContain('## IA / Orquestração')
    })

    it('should NOT overwrite existing PROGRESS.md (idempotente)', async () => {
      const customContent = '# MINHA PROGRESS CUSTOMIZADA\n\nConteúdo importante aqui.'
      await writeFile(join(TEST_VAULT, 'PROGRESS.md'), customContent, 'utf8')
      await initVault(TEST_VAULT)
      const after = await readFile(join(TEST_VAULT, 'PROGRESS.md'), 'utf8')
      expect(after).toBe(customContent)
    })

    it('should NOT overwrite existing KNOWLEDGE-MAP.md (idempotente)', async () => {
      const customContent = '# MEU KNOWLEDGE MAP\n\nGaps importantes aqui.'
      await writeFile(join(TEST_VAULT, 'KNOWLEDGE-MAP.md'), customContent, 'utf8')
      await initVault(TEST_VAULT)
      const after = await readFile(join(TEST_VAULT, 'KNOWLEDGE-MAP.md'), 'utf8')
      expect(after).toBe(customContent)
    })

    it('should be idempotent — second call does not fail', async () => {
      await initVault(TEST_VAULT)
      await expect(initVault(TEST_VAULT)).resolves.toBeUndefined()
    })

    it('should throw VAULT_NOT_FOUND for invalid path (AC: 2)', async () => {
      await expect(initVault('/caminho/que/nao/existe/abc123'))
        .rejects.toMatchObject({ code: 'VAULT_NOT_FOUND' })
    })

    it('should include vault path in VAULT_NOT_FOUND error', async () => {
      const fakePath = '/nao/existe/xyz'
      await expect(initVault(fakePath))
        .rejects.toMatchObject({ path: fakePath })
    })
  })

  // ── createNote ──────────────────────────────────────────────────────────────

  describe('createNote', () => {
    it('should create a note file in the correct type subdirectory', async () => {
      await mkdir(join(TEST_VAULT, 'quests'), { recursive: true })
      await createNote(TEST_VAULT, 'quests', 'Q001', 'minha-quest', '# Quest\nConteúdo')
      const content = await readFile(join(TEST_VAULT, 'quests', 'Q001-minha-quest.md'), 'utf8')
      expect(content).toContain('# Quest')
    })

    it('should create note in vault root when type is empty string', async () => {
      await createNote(TEST_VAULT, '', 'M01', 'summary', '# Milestone\nConteúdo')
      const content = await readFile(join(TEST_VAULT, 'M01-summary.md'), 'utf8')
      expect(content).toContain('# Milestone')
    })
  })

  // ── readNote ────────────────────────────────────────────────────────────────

  describe('readNote', () => {
    it('should read a note by filename', async () => {
      await mkdir(join(TEST_VAULT, 'relics'), { recursive: true })
      await writeFile(join(TEST_VAULT, 'relics', 'R001-relic.md'), '# Relic\nConteúdo', 'utf8')
      const content = await readNote(TEST_VAULT, 'relics', 'R001-relic.md')
      expect(content).toContain('# Relic')
    })
  })

  // ── updateNote ──────────────────────────────────────────────────────────────

  describe('updateNote', () => {
    it('should overwrite existing note', async () => {
      await mkdir(join(TEST_VAULT, 'quests'), { recursive: true })
      await writeFile(join(TEST_VAULT, 'quests', 'Q001-test.md'), 'original', 'utf8')
      await updateNote(TEST_VAULT, 'quests', 'Q001-test.md', 'atualizado')
      const content = await readFile(join(TEST_VAULT, 'quests', 'Q001-test.md'), 'utf8')
      expect(content).toBe('atualizado')
    })
  })

  // ── listNotes ───────────────────────────────────────────────────────────────

  describe('listNotes', () => {
    it('should list .md files in a type directory', async () => {
      const dir = join(TEST_VAULT, 'quests')
      await mkdir(dir, { recursive: true })
      await writeFile(join(dir, 'Q001-quest.md'), '', 'utf8')
      await writeFile(join(dir, 'Q002-quest.md'), '', 'utf8')
      await writeFile(join(dir, 'ignore.txt'), '', 'utf8')
      const files = await listNotes(TEST_VAULT, 'quests')
      expect(files).toHaveLength(2)
      expect(files).toContain('Q001-quest.md')
      expect(files).toContain('Q002-quest.md')
    })

    it('should return empty array when directory does not exist', async () => {
      const files = await listNotes(TEST_VAULT, 'quests')
      expect(files).toEqual([])
    })
  })
})
