import { mkdir, writeFile, readFile, access, readdir } from 'fs/promises'
import { join } from 'path'

// ── Templates ──────────────────────────────────────────────────────────────────

const PROGRESS_INITIAL_TEMPLATE = `# PROGRESS

## Dimensões Atuais
- Negócio: → 0 | Arquitetura: → 0 | IA: → 0

## Milestone 1 — 0/5 victories
`

const KNOWLEDGE_MAP_TEMPLATE = `# KNOWLEDGE MAP

## Negócio
<!-- gaps identificados em quests: tema, status (Para Estudar / Estudado / Praticado) -->

## Arquitetura
<!-- gaps identificados em quests -->

## IA / Orquestração
<!-- gaps identificados em quests -->
`

// ── initVault ──────────────────────────────────────────────────────────────────

export async function initVault(vaultPath) {
  // Validar acesso ao vault_path
  try {
    await access(vaultPath)
  } catch {
    throw { code: 'VAULT_NOT_FOUND', message: `Vault não encontrado: ${vaultPath}`, path: vaultPath }
  }

  // Criar subdiretórios (idempotente com recursive: true)
  await mkdir(join(vaultPath, 'quests'), { recursive: true })
  await mkdir(join(vaultPath, 'relics'), { recursive: true })

  // PROGRESS.md — apenas se não existir
  const progressPath = join(vaultPath, 'PROGRESS.md')
  try {
    await access(progressPath)
    // já existe — não sobrescrever
  } catch {
    await writeFile(progressPath, PROGRESS_INITIAL_TEMPLATE, 'utf8')
  }

  // KNOWLEDGE-MAP.md — apenas se não existir
  const kmPath = join(vaultPath, 'KNOWLEDGE-MAP.md')
  try {
    await access(kmPath)
    // já existe — não sobrescrever
  } catch {
    await writeFile(kmPath, KNOWLEDGE_MAP_TEMPLATE, 'utf8')
  }
}

// ── createNote ─────────────────────────────────────────────────────────────────

export async function createNote(vaultPath, type, id, slug, content) {
  const fileName = slug ? `${id}-${slug}.md` : `${id}.md`
  const dir = type ? join(vaultPath, type) : vaultPath
  await mkdir(dir, { recursive: true })
  await writeFile(join(dir, fileName), content, 'utf8')
}

// ── readNote ───────────────────────────────────────────────────────────────────

export async function readNote(vaultPath, type, fileName) {
  const dir = type ? join(vaultPath, type) : vaultPath
  return readFile(join(dir, fileName), 'utf8')
}

// ── updateNote ─────────────────────────────────────────────────────────────────

export async function updateNote(vaultPath, type, fileName, content) {
  const dir = type ? join(vaultPath, type) : vaultPath
  await writeFile(join(dir, fileName), content, 'utf8')
}

// ── listNotes ──────────────────────────────────────────────────────────────────

export async function listNotes(vaultPath, type) {
  const dir = type ? join(vaultPath, type) : vaultPath
  try {
    const files = await readdir(dir)
    return files.filter(f => f.endsWith('.md'))
  } catch {
    return []
  }
}
