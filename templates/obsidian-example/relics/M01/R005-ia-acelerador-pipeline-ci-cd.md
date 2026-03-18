---
id: "R005"
type: "relic"
title: "IA como acelerador de pipeline CI/CD"
date: "2026-03-15"
milestone: 1
tags: ["codemaster","relic","ia"]
dimension: "ai_orchestration"
source_quest: "Q005"
---

# Relic: IA como acelerador de pipeline CI/CD

## Descoberta

Claude gerou workflow completo de GitHub Actions (4 stages + cache strategy)
em ~10 minutos. Economizou 2h de leitura de documentação. Porém introduziu
um bug sutil: hashFiles('package.json') ao invés de hashFiles('package-lock.json').

## Por que importa

IA é excelente para gerar boilerplate de DevOps — configs repetitivas que
seguem padrões bem documentados. Mas erros sutis em configs (como hash do
arquivo errado) são silenciosos e difíceis de detectar sem review cuidadoso.

## Padrão: IA para boilerplate, review para detalhes

```
IA funciona bem para:
  ✅ Gerar workflow/pipeline completo
  ✅ Estruturar stages e dependências
  ✅ Sugerir otimizações (cache, paralelismo)

Precisa de review humano:
  ⚠️ Paths de cache (qual arquivo é fonte de verdade?)
  ⚠️ Secrets e variáveis de ambiente
  ⚠️ Condições de deploy (qual branch? qual tag?)
  ⚠️ Permissões de runner/container
```

## O erro que quase passou

```yaml
# ❌ Sugestão da IA — cacheia baseado em package.json
cache: ${{ hashFiles('package.json') }}
# package.json muda raramente → cache stale silencioso

# ✅ Correto — cacheia baseado no lockfile
cache: ${{ hashFiles('package-lock.json') }}
# lockfile muda a cada npm install → cache atualizado
```

## Score desta Relic
- IA / Orquestração: 7.5

## Fonte
[[Q005-pipeline-ci-cd-deploy-automatico]]
