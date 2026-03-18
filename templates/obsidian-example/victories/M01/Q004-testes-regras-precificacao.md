---
id: "Q004"
type: "victory"
title: "Testes automatizados para regras de precificação"
date: "2026-03-12"
tags: ["codemaster","victory"]
quest: "Q004-testes-regras-precificacao"
business: "5.5"
architecture: "8.0"
ai_orchestration: "7.0"
---

# Victory: Q004-testes-regras-precificacao

## Quest
[[Q004-testes-regras-precificacao]]

## Respostas de Reflexão
**impacto_negocio:** Coverage: 23% → 82%. Os 3 bugs recorrentes em cálculo de preço cobertos. Últimas 2 sprints sem regressão. Time ganhou confiança para deployar — acabou a regra não escrita de "sexta sem deploy".
**decisao_arquitetural:** Banco real para integração dos fluxos críticos, mocks só para APIs externas. 2s vs 200ms de execução, mas confiança incomparável. Mocks do trimestre passado deixaram bug de migração passar.
**orquestracao_ia:** Claude gerou 70% dos testes e encontrou 2 edge cases (divisão por zero, tier undefined). Qualidade excelente para edge cases. Porém gerou testes que mockavam implementação interna — precisei reescrever para testar comportamento.
**novo_aprendizado:** Custo de bug em produção é 10-25x o custo de prevenir com teste. R$15k em hotfixes teriam financiado 1 sprint inteiro de testes.
**reflexao_critica:** Comecei testando métodos privados — acopla teste à implementação. Deveria ter focado em comportamento público desde o início.

## Análise por Dimensão
- Negócio: → 5.5
- Arquitetura: ↑ 8.0
- IA / Orquestração: ↑ 7.0
