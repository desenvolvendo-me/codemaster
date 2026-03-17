import { listNotes, readNote, updateNote, createNote } from '../services/vault.js'
import { parseFrontmatter, generateFrontmatter } from '../utils/frontmatter.js'
import { slugify } from '../utils/slugify.js'

// Substitui apenas a linha `relics:` no bloco frontmatter existente (evita double-escaping)
function updateRelicsInFrontmatter(content, relics) {
  return content.replace(/^(relics: ).+$/m, `$1${JSON.stringify(relics)}`)
}

export async function addRelic(discovery, dimension, vaultPath, questFileName, archiveToRelics = false) {
  // Ler frontmatter da quest para extrair relics existentes
  const questContent = await readNote(vaultPath, 'quests', questFileName)
  const fm = parseFrontmatter(questContent)

  let relics = []
  try { relics = JSON.parse(fm.relics ?? '[]') } catch { relics = [] }

  // ID baseado no maior valor entre relics no vault e relics na quest
  const archivedCount = (await listNotes(vaultPath, 'relics')).length
  const questCount = relics.length
  const relicId = `R${String(Math.max(archivedCount, questCount) + 1).padStart(3, '0')}`
  const slug = slugify(discovery)

  const now = new Date()
  const timestamp = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

  relics.push(relicId)
  const relicEntry = `\n## Relic ${relicId} — ${timestamp}\n**Dimensão:** ${dimension}\n**Descoberta:** ${discovery}\n`
  const newContent = updateRelicsInFrontmatter(questContent, relics) + relicEntry

  await updateNote(vaultPath, 'quests', questFileName, newContent)

  if (archiveToRelics) {
    const date = new Date().toISOString().split('T')[0]
    const relicFm = generateFrontmatter({
      id: relicId, type: 'relic', title: discovery,
      date, dimension, tags: ['codemaster', 'relic']
    })
    await createNote(vaultPath, 'relics', relicId, slug, relicFm + `\n# ${discovery}\n`)
  }

  return { relicId, archived: archiveToRelics }
}
