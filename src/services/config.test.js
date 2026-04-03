import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { join } from 'path'
import { rm, mkdir, readFile } from 'fs/promises'

const TEST_DIR = '/tmp/codemaster-test-config'

// Mock os.homedir to use test directory
vi.mock('os', () => ({
  homedir: () => TEST_DIR,
}))

// Import AFTER mock setup
const { readConfig, writeConfig } = await import('./config.js')

describe('config', () => {
  beforeEach(async () => {
    try { await rm(TEST_DIR, { recursive: true }) } catch {}
  })

  afterEach(async () => {
    try { await rm(TEST_DIR, { recursive: true }) } catch {}
  })

  describe('readConfig', () => {
    it('should return {} when config file does not exist', async () => {
      const result = await readConfig()
      expect(result).toEqual({})
    })

    it('should return parsed config when file exists', async () => {
      const testData = { hero: { name: 'Ricardo' }, vault: '/test/vault' }
      await writeConfig(testData)
      const result = await readConfig()
      expect(result).toEqual(testData)
    })
  })

  describe('writeConfig', () => {
    it('should create config directory if it does not exist', async () => {
      await writeConfig({ hero: { name: 'Test' } })
      const content = await readFile(join(TEST_DIR, '.codemaster', 'config.json'), 'utf8')
      expect(content).toBeTruthy()
    })

    it('should write valid JSON with 2-space indentation', async () => {
      const data = { hero: { name: 'Ricardo' } }
      await writeConfig(data)
      const content = await readFile(join(TEST_DIR, '.codemaster', 'config.json'), 'utf8')
      expect(content).toBe(JSON.stringify(data, null, 2))
    })

    it('should overwrite existing config', async () => {
      await writeConfig({ hero: { name: 'Old' } })
      await writeConfig({ hero: { name: 'New' } })
      const result = await readConfig()
      expect(result.hero.name).toBe('New')
    })

    it('should persist debug state without breaking existing schema', async () => {
      const data = {
        hero: { name: 'Ricardo' },
        vault: '/test/vault',
        debug: {
          enabled: true,
          setup_reused: true,
          enabled_at: '2026-03-24T00:00:00.000Z',
        },
      }

      await writeConfig(data)
      const result = await readConfig()

      expect(result).toEqual(data)
      expect(result.hero.name).toBe('Ricardo')
      expect(result.debug.enabled).toBe(true)
    })
  })
})
