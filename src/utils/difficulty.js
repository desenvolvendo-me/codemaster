export const DIFFICULTY_MONSTERS = {
  1: { name: 'goblin', emoji: '🐀', label: 'Goblin — Tarefa trivial' },
  2: { name: 'orc', emoji: '⚔️', label: 'Orc — Tarefa simples' },
  3: { name: 'troll', emoji: '🪨', label: 'Troll — Tarefa média' },
  4: { name: 'dragon', emoji: '🐉', label: 'Dragon — Tarefa difícil' },
  5: { name: 'lich', emoji: '💀', label: 'Lich — Tarefa épica' },
}

export function getDifficultyByValue(value) {
  return DIFFICULTY_MONSTERS[value] || null
}

export function getDifficultyByName(name) {
  const entry = Object.entries(DIFFICULTY_MONSTERS).find(
    ([, m]) => m.name === name.toLowerCase()
  )
  return entry ? { value: Number(entry[0]), ...entry[1] } : null
}

export function formatDifficultyDelta(planned, actual) {
  const delta = actual - planned
  const plannedMonster = DIFFICULTY_MONSTERS[planned]
  const actualMonster = DIFFICULTY_MONSTERS[actual]
  if (!plannedMonster || !actualMonster) return ''
  const sign = delta > 0 ? '+' : delta < 0 ? '' : ''
  return `${plannedMonster.emoji}→${actualMonster.emoji} (${sign}${delta})`
}
