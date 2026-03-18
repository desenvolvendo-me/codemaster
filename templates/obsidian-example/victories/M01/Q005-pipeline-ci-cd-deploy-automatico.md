---
id: "Q005"
type: "victory"
title: "Pipeline CI/CD com deploy automático"
date: "2026-03-16"
tags: ["codemaster","victory"]
quest: "Q005-pipeline-ci-cd-deploy-automatico"
business: "8.0"
architecture: "8.5"
ai_orchestration: "6.5"
---

# Victory: Q005-pipeline-ci-cd-deploy-automatico

## Quest
[[Q005-pipeline-ci-cd-deploy-automatico]]

## Respostas de Reflexão
**impacto_negocio:** Deploy: 1x/semana → múltiplos/dia. Features chegam em horas, não semanas. O case do concorrente ficou como lição — não era velocidade de dev, era velocidade de entrega.
**decisao_arquitetural:** Pipeline 4 stages (lint→test→build→deploy) com rolling update. Cada stage é gate automático. Rollback via health check. Simples, sem blue-green (requer infra duplicada).
**orquestracao_ia:** Claude gerou workflow completo do GitHub Actions com cache strategy em ~10min. Economizou 2h de docs. Erro do hashFiles (package.json vs lockfile) era sutil — sem review teria causado cache stale silencioso.
**novo_aprendizado:** Gargalo de entrega raramente é desenvolvimento — é deployment. CI/CD no dia 1 custa 2h. Não configurar custa semanas de atraso acumulado.
**reflexao_critica:** Deveria ter configurado CI no dia 1, não após 3 meses. Todos os bugs que passaram teriam sido pegos se testes rodassem em cada push.

## Análise por Dimensão
- Negócio: ↑ 8.0
- Arquitetura: ↑ 8.5
- IA / Orquestração: → 6.5
