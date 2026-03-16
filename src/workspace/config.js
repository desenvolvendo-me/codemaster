// src/workspace/config.js
import fs from 'fs-extra'
import path from 'path'
import os from 'os'

export const CONFIG_DIR  = path.join(os.homedir(), '.codemaster')
export const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json')
export const STATE_FILE  = path.join(CONFIG_DIR, 'active-quest.json')

export async function saveConfig(config) {
  await fs.ensureDir(CONFIG_DIR)
  await fs.writeJson(CONFIG_FILE, config, { spaces: 2 })
}

export async function getConfig() {
  if (!await fs.pathExists(CONFIG_FILE)) {
    throw new Error('CodeMaster não está configurado. Execute: codemaster setup')
  }
  return fs.readJson(CONFIG_FILE)
}

export async function isConfigured() {
  return fs.pathExists(CONFIG_FILE)
}

export async function getActiveQuest() {
  if (!await fs.pathExists(STATE_FILE)) return null
  return fs.readJson(STATE_FILE)
}

export async function saveActiveQuest(data) {
  await fs.ensureDir(CONFIG_DIR)
  await fs.writeJson(STATE_FILE, data, { spaces: 2 })
}

export async function clearActiveQuest() {
  if (await fs.pathExists(STATE_FILE)) {
    await fs.remove(STATE_FILE)
  }
}
