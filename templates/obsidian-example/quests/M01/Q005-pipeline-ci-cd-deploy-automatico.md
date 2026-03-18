---
id: "Q005"
type: "victory"
title: "Pipeline CI/CD com deploy automático"
date: "2026-03-16"
milestone: 1
tags: ["codemaster","quest"]
relics: ["R005"]
victory: "Q005-pipeline-ci-cd-deploy-automatico"
business: "8.0"
architecture: "8.5"
ai_orchestration: "6.5"
---

# Quest: Pipeline CI/CD com deploy automático

## Pergunta Âncora

Como montar um pipeline que rode lint, testes e deploy automaticamente a cada
push na main, eliminando o deploy manual que depende de 1 pessoa e acontece
só 1x/semana?

## Reflexões por Dimensão

### Negócio
- **Por que esse problema existe?** Deploy manual demora 40min, depende do
  "guardião do deploy", e só acontece às terças. Features aprovadas levam até
  7 dias para chegar ao usuário. Concorrente lançou feature similar 3 semanas
  antes — a feature estava pronta, presa na fila de deploy.
- **Qual o impacto de fazer errado?** Pipeline frágil que falha silenciosamente
  ou que demora 15min desencoraja uso. Time volta para deploy manual.
- **O que aprendi sobre o domínio?** O gargalo de entrega não era
  desenvolvimento, era deployment. O time produzia rápido, mas o pipeline
  manual criava fila artificial.

### Arquitetura
- **Qual padrão de design foi aplicado?** 4 stages sequenciais (lint → test →
  build → deploy). Cada stage é gate — falha bloqueia o deploy. Rolling update
  com rollback automático via health check.
- **O que poderia ter sido feito diferente?** Blue-green deployment. Mais
  seguro mas requer infra duplicada que não temos budget.
- **Quais trade-offs foram feitos?** Rolling update aceita breve inconsistência
  entre versões durante deploy vs simplicidade operacional.

### IA / Orquestração
- **Como a IA me ajudou nessa quest?** Claude gerou o workflow completo do
  GitHub Actions com cache strategy em ~10min. Economizou 2h de docs.
- **O que a IA errou ou eu precisei corrigir?** hashFiles('package.json')
  em vez de hashFiles('package-lock.json') — causa cache stale silencioso.
- **O que eu sei hoje que não sabia antes?** Cache de node_modules no GitHub
  Actions reduz CI de 4min para 90s. O segredo é cachear baseado no lockfile.

## Notas de Desenvolvimento

Deploy: 1x/semana (terças) → múltiplos/dia. Qualquer dev pode deployar.

```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci && npm test && npm run build && npm run deploy
```

## Relic desta Quest
- [[R005-ia-acelerador-pipeline-ci-cd]] — IA como acelerador de DevOps

## Victory
[[Q005-pipeline-ci-cd-deploy-automatico]]
