---
title: Lição 2
description: XP na era dos agents, ciclo padrão, fluxos de trabalho e definition of done.
---

# Visão geral

A segunda aula aprofunda o uso de `Extreme Programming` como base operacional para trabalhar com agents e mostra quando usar fluxo rápido ou fluxo completo com BMAD.

## Processos de desenvolvimento

### Waterfall

<img src="../raw/lesson-2/waterflow.png" alt="Diagrama do Waterfall" />

- Vantagem: previsibilidade, documentação e sequência clara.
- Limite: reage mal a mudança e posterga feedback.

### RUP

<img src="../raw/lesson-2/rup.png" alt="Diagrama do RUP" />

- Vantagem: processo iterativo e orientado a risco.
- Limite: tende a ser pesado, burocrático e caro para times enxutos.

### Kanban

<img src="../raw/lesson-2/kanban.png" alt="Board Kanban" />

- Vantagem: fluxo contínuo, visual e com baixo overhead.
- Limite: exige maturidade para priorização e previsibilidade.

### Scrum

<img src="../raw/lesson-2/scrum.png" alt="Ciclo do Scrum" />

- Vantagem: ciclos curtos, papéis claros e revisões frequentes.
- Limite: cerimônias e estimativas podem virar peso operacional.

### Extreme Programming

<img src="../raw/lesson-2/extreme-programming.png" alt="Diagrama do Extreme Programming" />

- Vantagem: qualidade contínua, TDD, pair programming, refatoração e integração constante.
- Limite: depende de disciplina do time, mas agents ajudam justamente a sustentar essa disciplina.

## Os 5 valores do XP com agents

- `Comunicação`: qualidade do output acompanha a qualidade do contexto.
- `Simplicidade`: entregar a menor solução que resolve o problema agora.
- `Feedback`: testar cedo e frequentemente.
- `Coragem`: iterar rápido, refatorar e descartar abordagem ruim sem apego.
- `Respeito`: revisar criticamente o que o agent produziu.

## As 12 práticas como hábito diário

- O conteúdo reinterpreta as práticas do XP para o cenário com agents.
- O destaque operacional é o `pair programming reimaginado`: humano como navigator, agent como driver.
- A mensagem central é que o agent acelera a prática, mas não substitui julgamento.

## O ciclo padrão

- `Story -> Ask -> Spec -> Dev -> Test -> Review`
- Esse loop deve acontecer várias vezes ao dia, sempre com feedback curto.
- Pular `Ask` e `Test` é tratado como origem comum de retrabalho.

## BMAD dentro do ciclo

### Fases

- `Analysis`
- `Planning`
- `Solutioning`
- `Implementation`

### Papel no fluxo

- O BMAD entra quando a demanda exige mais alinhamento, rastreabilidade e separação de papéis.
- Para mudanças grandes, o fluxo completo passa por PRD, UX, arquitetura, épicos, histórias, sprint planning, desenvolvimento e review.

## Quando usar qual fluxo

- `Edit direto`: bug simples ou ajuste muito localizado.
- `Quick Spec -> Quick Dev`: bugs complexos e melhorias médias.
- `BMAD completo`: feature nova, mudança ampla ou alto risco.

### Critérios de escolha

- Clareza do problema
- Risco
- Blast radius
- Reversibilidade
- Necessidade de alinhamento entre negócio, UX e arquitetura

## Definition of Done

Um item só está realmente concluído quando passa por estes quatro critérios:

- Testes passando
- Code review humano
- Contexto e arquitetura preservados
- PR limpo, versionado e com CI verde

## Material original

- [Abrir slides originais](../raw/lesson-2.html)
