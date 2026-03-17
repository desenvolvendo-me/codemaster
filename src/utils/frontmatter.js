// ── parseFrontmatter ───────────────────────────────────────────────────────────
// Parses YAML-lite frontmatter (key: value pairs only — MVP, not full YAML)

export function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]+?)\n---/)
  if (!match) return {}
  const lines = match[1].split('\n')
  return Object.fromEntries(
    lines
      .map(l => l.split(': '))
      .filter(p => p.length === 2)
      .map(([k, v]) => [k.trim(), v.trim()])
  )
}

// ── generateFrontmatter ────────────────────────────────────────────────────────

export function generateFrontmatter(fields) {
  const lines = Object.entries(fields).map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
  return `---\n${lines.join('\n')}\n---\n`
}
