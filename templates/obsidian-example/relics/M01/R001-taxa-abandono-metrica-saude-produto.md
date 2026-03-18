---
id: "R001"
type: "relic"
title: "Taxa de abandono é sintoma, não causa"
date: "2026-03-02"
milestone: 1
tags: ["codemaster","relic","produto"]
dimension: "business"
source_quest: "Q001"
---

# Relic: Taxa de abandono é sintoma, não causa

## Descoberta

A taxa de abandono de 34% parecia problema de UX do formulário. Na realidade,
60% dos abandonos eram timeout do gateway — o usuário via tela em branco e
desistia. Sem segmentar os dados, eu teria resolvido o problema errado.

## Por que importa

Métricas agregadas escondem a causa raiz. "Melhorar o formulário" resolveria
40% do problema. Segmentar por etapa do funil (formulário vs submit vs erro)
revelou que o maior causador era timeout, não UX.

## Framework de investigação

```
Métrica alta/baixa
├── 1. Segmentar por ETAPA
│   ├── Onde no funil? → formulário, submit, pós-erro
│   └── Qual etapa concentra mais ocorrências?
├── 2. Segmentar por TIPO
│   ├── Timeout (503/504) → infra/resiliência
│   ├── Dados inválidos (400) → UX/validação
│   └── Recusa (402) → feedback ao usuário
└── 3. Segmentar por HORÁRIO
    ├── Constante → sistêmico
    ├── Picos → carga
    └── Aleatório → intermitente
```

## Regra prática

Antes de implementar solução para "métrica X está ruim":
1. Segmentar (por etapa, tipo, horário)
2. Identificar causa dominante (>50% dos casos)
3. Resolver a dominante primeiro — máximo impacto, mínimo esforço

## Score desta Relic
- Negócio: 8.5

## Fonte
[[Q001-autenticacao-segura-checkout]]
