import { listNotes, createNote } from '../services/vault.js'
import { generateFrontmatter } from '../utils/frontmatter.js'
import { writeActiveQuest } from '../services/state.js'
import { slugify } from '../utils/slugify.js'
import { getDifficultyByValue } from '../utils/difficulty.js'

export async function createQuest(title, vaultPath, milestone = 1, plannedDifficulty = null) {
  const existing = await listNotes(vaultPath, 'quests')
  const nextNum = existing.length + 1
  const id = `Q${String(nextNum).padStart(3, '0')}`
  const slug = slugify(title)

  const date = new Date().toISOString().split('T')[0]
  const fields = {
    id,
    type: 'quest',
    title,
    date,
    milestone,
    tags: ['codemaster', 'quest'],
    relics: []
  }

  const monster = getDifficultyByValue(plannedDifficulty)
  if (monster) {
    fields.planned_difficulty = monster.name
    fields.planned_difficulty_value = plannedDifficulty
  }

  const frontmatter = generateFrontmatter(fields)

  const content = `${frontmatter}
# ${title}

## Reflexão Inicial

## Notas de Desenvolvimento
`

  await createNote(vaultPath, 'quests', id, slug, content)
  const notePath = `quests/${id}-${slug}.md`

  const stateData = {
    id,
    title,
    slug,
    notePath,
    startedAt: new Date().toISOString(),
    milestone
  }

  if (plannedDifficulty) {
    stateData.plannedDifficulty = plannedDifficulty
  }

  await writeActiveQuest(stateData)

  return { id, notePath }
}
