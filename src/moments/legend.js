import { readNote, listNotes } from '../services/vault.js'
import { parseFrontmatter } from '../utils/frontmatter.js'
import { calcTrend } from './victory.js'

export async function getLegend(vaultPath) {
  const victoryFiles = await listNotes(vaultPath, 'victories')
  const relicFiles = await listNotes(vaultPath, 'relics')

  // Coletar victories a partir da pasta dedicada
  const victories = []
  for (const fileName of victoryFiles) {
    try {
      const content = await readNote(vaultPath, 'victories', fileName)
      const fm = parseFrontmatter(content)
      const type = fm.type?.replace(/^"|"$/g, '')
      if (type !== 'victory') continue

      const id = fm.id?.replace(/^"|"$/g, '') ?? ''
      const title = fm.title?.replace(/^"|"$/g, '') ?? ''
      const date = fm.date?.replace(/^"|"$/g, '') ?? ''
      const milestone = Number(fm.milestone?.replace?.(/^"|"$/g, '') ?? fm.milestone ?? 1)
      const scores = {
        business: parseFloat(fm.business?.replace?.(/^"|"$/g, '') ?? '0'),
        architecture: parseFloat(fm.architecture?.replace?.(/^"|"$/g, '') ?? '0'),
        ai_orchestration: parseFloat(fm.ai_orchestration?.replace?.(/^"|"$/g, '') ?? '0')
      }
      victories.push({ id, title, fileName, scores, date, milestone })
    } catch { /* skip */ }
  }

  // Coletar relic de destaque (a mais recente)
  let bestRelic = null
  if (relicFiles.length > 0) {
    try {
      const fileName = relicFiles[relicFiles.length - 1]
      const content = await readNote(vaultPath, 'relics', fileName)
      const fm = parseFrontmatter(content)
      bestRelic = {
        id: fm.id?.replace(/^"|"$/g, '') ?? '',
        title: fm.title?.replace(/^"|"$/g, '') ?? '',
        dimension: fm.dimension?.replace(/^"|"$/g, '') ?? ''
      }
    } catch { /* skip */ }
  }

  if (victories.length === 0) {
    return { milestones: [], currentDimensions: null, lastVictory: null, bestRelic, suggestedFocus: null }
  }

  // Agrupar por milestone
  const milestoneMap = {}
  for (const v of victories) {
    if (!milestoneMap[v.milestone]) milestoneMap[v.milestone] = []
    milestoneMap[v.milestone].push(v)
  }

  const milestones = Object.entries(milestoneMap)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([id, mvictories]) => {
      const avg = (key) => mvictories.reduce((s, v) => s + v.scores[key], 0) / mvictories.length
      return {
        id: Number(id),
        victories: mvictories,
        averages: {
          business: avg('business'),
          architecture: avg('architecture'),
          ai_orchestration: avg('ai_orchestration')
        }
      }
    })

  // Dimensões do milestone atual (último)
  const currentMilestone = milestones[milestones.length - 1]
  const currentDimensions = {
    business: calcTrend(currentMilestone.averages.business),
    architecture: calcTrend(currentMilestone.averages.architecture),
    ai_orchestration: calcTrend(currentMilestone.averages.ai_orchestration)
  }

  // Última victory (maior date)
  const lastVictory = victories.reduce((latest, v) => v.date > latest.date ? v : latest)

  // Dimensão com menor score médio no milestone atual
  const avgs = currentMilestone.averages
  const suggestedFocus = Object.entries(avgs).reduce((min, [k, v]) => v < avgs[min] ? k : min, 'business')

  return { milestones, currentDimensions, lastVictory, bestRelic, suggestedFocus }
}
