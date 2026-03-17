import { describe, it, expect } from 'vitest'
import { parseFrontmatter, generateFrontmatter } from './frontmatter.js'

describe('parseFrontmatter', () => {
  it('should parse key: value frontmatter', () => {
    const content = `---
id: Q001
type: victory
milestone: 1
---

# Content`
    const fm = parseFrontmatter(content)
    expect(fm.id).toBe('Q001')
    expect(fm.type).toBe('victory')
    expect(fm.milestone).toBe('1')
  })

  it('should return empty object when no frontmatter', () => {
    const content = '# Just content\nNo frontmatter here'
    expect(parseFrontmatter(content)).toEqual({})
  })

  it('should return empty object for empty frontmatter block', () => {
    const content = `---
---
# Content`
    expect(parseFrontmatter(content)).toEqual({})
  })

  it('should handle quoted values', () => {
    const content = `---
title: "My Quest Title"
---`
    const fm = parseFrontmatter(content)
    expect(fm.title).toBe('"My Quest Title"')
  })

  it('should parse numeric string fields', () => {
    const content = `---
business: 3
architecture: 2
ai_orchestration: 1
---`
    const fm = parseFrontmatter(content)
    expect(Number(fm.business)).toBe(3)
    expect(Number(fm.architecture)).toBe(2)
    expect(Number(fm.ai_orchestration)).toBe(1)
  })
})

describe('generateFrontmatter', () => {
  it('should generate frontmatter block', () => {
    const result = generateFrontmatter({ id: 'M01', type: 'milestone', milestone: 1 })
    expect(result).toContain('---')
    expect(result).toContain('id: "M01"')
    expect(result).toContain('type: "milestone"')
    expect(result).toContain('milestone: 1')
  })

  it('should start and end with ---', () => {
    const result = generateFrontmatter({ id: 'Q001' })
    expect(result.startsWith('---\n')).toBe(true)
    expect(result.includes('\n---\n')).toBe(true)
  })

  it('should handle boolean values', () => {
    const result = generateFrontmatter({ complete: true })
    expect(result).toContain('complete: true')
  })
})
