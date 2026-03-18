import { describe, it, expect } from 'vitest'
import { DIFFICULTY_MONSTERS, getDifficultyByValue, getDifficultyByName, formatDifficultyDelta } from './difficulty.js'

describe('DIFFICULTY_MONSTERS', () => {
  it('should have 5 levels', () => {
    expect(Object.keys(DIFFICULTY_MONSTERS)).toHaveLength(5)
  })

  it('should have correct monster names', () => {
    expect(DIFFICULTY_MONSTERS[1].name).toBe('goblin')
    expect(DIFFICULTY_MONSTERS[2].name).toBe('orc')
    expect(DIFFICULTY_MONSTERS[3].name).toBe('troll')
    expect(DIFFICULTY_MONSTERS[4].name).toBe('dragon')
    expect(DIFFICULTY_MONSTERS[5].name).toBe('lich')
  })
})

describe('getDifficultyByValue', () => {
  it('should return monster for valid value', () => {
    const result = getDifficultyByValue(4)
    expect(result.name).toBe('dragon')
    expect(result.emoji).toBe('🐉')
  })

  it('should return null for invalid value', () => {
    expect(getDifficultyByValue(0)).toBeNull()
    expect(getDifficultyByValue(6)).toBeNull()
    expect(getDifficultyByValue(null)).toBeNull()
  })
})

describe('getDifficultyByName', () => {
  it('should return monster with value for valid name', () => {
    const result = getDifficultyByName('dragon')
    expect(result.value).toBe(4)
    expect(result.name).toBe('dragon')
  })

  it('should be case-insensitive', () => {
    const result = getDifficultyByName('GOBLIN')
    expect(result.value).toBe(1)
  })

  it('should return null for invalid name', () => {
    expect(getDifficultyByName('unicorn')).toBeNull()
  })
})

describe('formatDifficultyDelta', () => {
  it('should format positive delta (underestimated)', () => {
    const result = formatDifficultyDelta(3, 5)
    expect(result).toContain('🪨→💀')
    expect(result).toContain('(+2)')
  })

  it('should format negative delta (overestimated)', () => {
    const result = formatDifficultyDelta(4, 2)
    expect(result).toContain('🐉→⚔️')
    expect(result).toContain('(-2)')
  })

  it('should format zero delta (precise)', () => {
    const result = formatDifficultyDelta(3, 3)
    expect(result).toContain('🪨→🪨')
    expect(result).toContain('(0)')
  })

  it('should return empty string for invalid values', () => {
    expect(formatDifficultyDelta(0, 3)).toBe('')
    expect(formatDifficultyDelta(3, 6)).toBe('')
  })
})
