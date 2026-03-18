---
id: "Q005"
type: "victory"
title: "Configurar pipeline CI/CD com deploy automatizado"
date: "2026-03-16"
tags: ["codemaster","victory"]
quest: "Q005-deploy-automatizado-ci-cd"
business: "8.0"
architecture: "8.5"
ai_orchestration: "6.5"
---

# Victory: Q005-deploy-automatizado-ci-cd

## Quest
[[Q005-deploy-automatizado-ci-cd]]

## Respostas de Reflexão
**impacto_negocio:** Deploy passou de 1x/semana (terças) para múltiplos por dia. Features chegam ao usuário em horas, não semanas. Time-to-market é nosso maior diferencial agora.
**decisao_arquitetural:** Pipeline em 4 stages sequenciais (lint→test→build→deploy) com rolling update. Cada stage funciona como gate — falha em qualquer uma bloqueia o deploy. Simples e confiável.
**orquestracao_ia:** Claude gerou o workflow completo do GitHub Actions incluindo cache strategy. Economizou 2h de pesquisa na documentação. O erro do hashFiles foi fácil de corrigir.
**novo_aprendizado:** Cache de node_modules no GitHub Actions reduz CI de 4min para 90s. O segredo é cachear baseado no hash do package-lock.json, não do package.json.
**reflexao_critica:** Deveria ter configurado CI no início do projeto, não após 3 meses. Todos os bugs que passaram para produção teriam sido pegos se os testes rodassem automaticamente.

## Análise por Dimensão
- Negócio: ↑ 8.0
- Arquitetura: ↑ 8.5
- IA / Orquestração: → 6.5
