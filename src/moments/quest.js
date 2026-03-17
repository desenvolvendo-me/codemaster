import { listNotes, createNote } from '../services/vault.js'
import { generateFrontmatter } from '../utils/frontmatter.js'
import { writeActiveQuest } from '../services/state.js'
import { slugify } from '../utils/slugify.js'

export async function createQuest(title, vaultPath, milestone = 1) {
  const existing = await listNotes(vaultPath, 'quests')
  const nextNum = existing.length + 1
  const id = `Q${String(nextNum).padStart(3, '0')}`
  const slug = slugify(title)

  const date = new Date().toISOString().split('T')[0]
  const frontmatter = generateFrontmatter({
    id,
    type: 'quest',
    title,
    date,
    milestone,
    tags: ['codemaster', 'quest'],
    relics: []
  })

  const content = `${frontmatter}
# ${title}

## Reflexão Inicial

## Notas de Desenvolvimento
`

  await createNote(vaultPath, 'quests', id, slug, content)
  const notePath = `quests/${id}-${slug}.md`

  await writeActiveQuest({
    id,
    title,
    slug,
    notePath,
    startedAt: new Date().toISOString(),
    milestone
  })

  return { id, notePath }
}
