---
id: "R005"
type: "relic"
title: "GitHub Actions — estratégia de cache que reduz CI de 4min para 90s"
date: "2026-03-15"
milestone: 1
tags: ["codemaster","relic","devops"]
dimension: "architecture"
source_quest: "Q005"
---

# Relic: GitHub Actions — estratégia de cache que reduz CI de 4min para 90s

## Descoberta

O maior gargalo do CI no GitHub Actions é o `npm install`. Cachear
`node_modules` baseado no hash do `package-lock.json` reduz o tempo de
instalação de 2min30s para ~5s.

## Por que importa

CI lento desencoraja commits pequenos e frequentes. Quando o pipeline demora
4 minutos, o dev abre outra tarefa e perde contexto. Com 90s, o feedback é
quase imediato e o fluxo de trabalho não quebra.

## Como configurar corretamente

```yaml
# ✅ CORRETO — usa setup-node com cache nativo
- uses: actions/setup-node@v4
  with:
    node-version: 20
    cache: npm  # cacheia baseado em package-lock.json automaticamente
- run: npm ci   # install limpo a partir do lockfile

# ❌ ERRADO — cache manual com path errado
- uses: actions/cache@v4
  with:
    path: ~/.npm           # cacheia o registry local, não node_modules
    key: ${{ hashFiles('package.json') }}  # deveria ser package-lock.json
```

## Armadilhas comuns

1. **`package.json` vs `package-lock.json`**: O hash deve ser do lockfile,
   não do package.json. O package.json muda menos e causa cache stale.
2. **`npm install` vs `npm ci`**: Em CI sempre use `npm ci` — é determinístico,
   mais rápido, e não modifica o lockfile.
3. **Cachear `~/.npm` vs `node_modules`**: O `actions/setup-node` com `cache: npm`
   faz o correto automaticamente. Não configure manualmente.

## Contexto de aplicação

Válido para qualquer projeto Node.js com GitHub Actions. Para monorepos,
considere `actions/cache` com paths customizados por workspace.

## Score desta Relic
- Arquitetura: 7.0

## Fonte
[[Q005-deploy-automatizado-ci-cd]]
