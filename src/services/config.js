import { readFile, writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { homedir } from 'os'

const CONFIG_DIR = join(homedir(), '.codemaster')
const CONFIG_FILE = join(CONFIG_DIR, 'config.json')

export async function readConfig() {
  try {
    const raw = await readFile(CONFIG_FILE, 'utf8')
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

export async function writeConfig(data) {
  await mkdir(CONFIG_DIR, { recursive: true })
  await writeFile(CONFIG_FILE, JSON.stringify(data, null, 2), 'utf8')
}
