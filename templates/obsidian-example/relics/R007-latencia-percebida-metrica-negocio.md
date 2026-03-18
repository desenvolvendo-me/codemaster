---
id: "R007"
type: "relic"
title: "Latência percebida como métrica de negócio"
date: "2026-03-19"
milestone: 2
tags: ["codemaster","relic","negocio"]
dimension: "business"
source_quest: "Q007"
---

# Relic: Latência percebida como métrica de negócio

## Descoberta

Reduzir latência do dashboard de 3.2s para 180ms aumentou adoção diária de
35% para 72% em 2 semanas — sem nenhuma feature nova. Performance é feature.
O VP de Produto citou como "melhor melhoria do trimestre".

## Por que importa

Latência não é métrica técnica — é métrica de negócio. Uma ferramenta lenta
é uma ferramenta ignorada. Decisões passam a ser por "feeling" ao invés de
dados. A diferença entre 3s e 200ms é a diferença entre "vou olhar depois"
e "sempre aberto na primeira aba".

## Thresholds de percepção

```
< 100ms  → instantâneo (usuário não percebe)
100-300ms → rápido (percebe mas não incomoda)
300ms-1s → aceitável (percebe, começa a incomodar)
1s-3s    → lento (usuário perde foco, considera alternativa)
> 3s     → inaceitável (usuário abandona ou busca workaround)
```

## Impacto medido neste projeto

| Métrica | Antes (3.2s) | Depois (180ms) |
|---------|-------------|---------------|
| Adoção diária | 35% | 72% |
| Decisões por dados | baixa | alta |
| Tickets "dados desatualizados" | 8/mês | 1/mês |

## Regra prática

Se uma ferramenta interna tem baixa adoção, meça a latência antes de
adicionar features. Muitas vezes o problema não é falta de funcionalidade —
é lentidão que desencoraja o uso.

## Score desta Relic
- Negócio: 8.0

## Fonte
[[Q007-dashboard-gerencial-cache]]
