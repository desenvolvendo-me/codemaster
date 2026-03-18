---
id: "Q005"
type: "victory"
title: "Configurar pipeline CI/CD com deploy automatizado"
date: "2026-03-16"
milestone: 1
tags: ["codemaster","quest"]
relics: ["R005"]
victory: "Q005-deploy-automatizado-ci-cd"
business: "8.0"
architecture: "8.5"
ai_orchestration: "6.5"
---

# Quest: Configurar pipeline CI/CD com deploy automatizado

## Pergunta Âncora

Como montar um pipeline que dê confiança para fazer deploy a qualquer momento,
sem depender de processos manuais ou de uma pessoa específica?

## Reflexões por Dimensão

### Negócio
- **Por que esse problema existe?** Deploys manuais demoravam 40min, dependiam
  de 1 pessoa e aconteciam só às terças. Features ficavam semanas paradas.
- **Qual o impacto de fazer errado?** Deploy quebrado em produção sem rollback
  automático pode causar downtime de horas.
- **O que aprendi sobre o domínio?** Time-to-market é um diferencial competitivo
  direto. Reduzir ciclo de deploy de 7 dias para 30 min tem impacto real em receita.

### Arquitetura
- **Qual padrão de design foi aplicado?** Pipeline em 4 stages: lint → test →
  build → deploy. Cada stage só executa se a anterior passar.
- **O que poderia ter sido feito diferente?** Blue-green deployment em vez de
  rolling update — mais seguro mas requer infraestrutura duplicada.
- **Quais trade-offs foram feitos?** Rolling update aceita breve inconsistência
  entre versões durante o deploy vs simplicidade de operação.

### IA / Orquestração
- **Como a IA me ajudou nessa quest?** Claude gerou o workflow completo do
  GitHub Actions e explicou cada step, incluindo cache de node_modules.
- **O que a IA errou ou eu precisei corrigir?** A config de cache usava
  hashFiles incorreto — cacheava o lockfile errado (package-lock vs yarn.lock).
- **O que eu sei hoje que não sabia antes?** GitHub Actions reutiliza runners,
  então cache de dependências reduz o tempo de CI de 4min para 90s.

## Notas de Desenvolvimento

```yaml
# .github/workflows/deploy.yml
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
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm test
      - run: npm run build
      - run: npm run deploy
```

## Relic desta Quest
- [[R005-github-actions-cache-estrategia]] — otimização de cache que reduziu CI de 4min para 90s

## Victory
[[Q005-deploy-automatizado-ci-cd]]
