import { readFile, writeFile, unlink } from 'fs/promises'
import { join } from 'path'
import { homedir } from 'os'

const STATE_FILE = join(homedir(), '.codemaster', 'active-quest.json')

export async function readActiveQuest() {
  try {
    return JSON.parse(await readFile(STATE_FILE, 'utf8'))
  } catch {
    return null
  }
}

export async function writeActiveQuest(data) {
  await writeFile(STATE_FILE, JSON.stringify(data, null, 2), 'utf8')
}

export async function clearActiveQuest() {
  try { await unlink(STATE_FILE) } catch {}
}
