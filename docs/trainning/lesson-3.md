---
title: Lição 3
description: BMAD + XP no fluxo diário, demonstração guiada e desafio semanal orientado por evidências.
---

# Visão geral

A terceira aula consolida como combinar `BMAD` e `XP`: BMAD organiza decisões ponta a ponta, enquanto XP governa a execução diária em ciclos curtos.

## Objetivo da aula

- Entender quando usar `Quick Flow` e quando subir para `BMAD completo`.
- Reforçar `Ask -> Spec -> Dev -> Test -> Review` como ciclo operacional.
- Fechar tarefas com `definition of done` baseada em evidência técnica.
- Preparar a prática da turma e o desafio semanal.

## Fundamentos operacionais

### BMAD e XP juntos

- `BMAD`: organiza contexto, planejamento, solução e execução.
- `XP`: entra principalmente na fase de implementação, com feedback curto.
- Regra prática: velocidade sem `teste + review` aumenta retrabalho.

### As 4 fases do BMAD

- `Analysis`: problema, público e hipótese.
- `Planning`: PRD enxuto, UX principal e escopo inicial.
- `Solutioning`: arquitetura mínima, histórias priorizadas e riscos técnicos.
- `Implementation`: dev por história, testes, review e release funcional.

## Escolha de fluxo

### Quick Flow

- Bugs pequenos e localizados.
- Melhorias com impacto conhecido e baixo risco.

### BMAD completo

- Feature nova com múltiplos módulos.
- Mudança com maior risco técnico ou de negócio.

## Definition of Done operacional

- Testes passando.
- Review humano no diff final.
- Decisões e evidências registradas.
- PR limpo, escopo controlado e pronto para CI.

## Demonstração guiada

### Ask de entrada

- Definir problema real e comportamento esperado.
- Delimitar onde pode e onde não pode mexer.
- Amarrar critérios de aceite antes da implementação.

### Quick Spec mínima e suficiente

- Story alvo clara.
- Riscos explícitos.
- Estratégia de validação definida.

### Gate de qualidade até o merge

- Nenhum `done` sem teste e revisão.
- Evidência de validação anexada no fluxo.
- Contexto preservado para os próximos ciclos.

## Prática dos alunos

- Execução em dupla com sequência obrigatória do fluxo.
- Entrega mínima com critérios de aceite e evidências.
- Debrief focado em gargalos e ajustes operacionais imediatos.

## Desafio semanal

### Missão

- Construir um projeto pequeno ou médio em 7 dias.
- Aplicar BMAD de ponta a ponta com rastreabilidade.
- Entregar pelo menos uma release funcional.

### Regras obrigatórias

- Passar pelas 4 fases do BMAD.
- Aplicar `Ask -> Spec -> Dev -> Test -> Review` por história.
- Não marcar `done` sem testes e revisão.
- Registrar evidências durante toda a semana.

### Pacote mínimo de entrega

- Histórias executadas com status claro.
- Evidências de testes e revisões.
- Documentação curta de decisões técnicas.

## Material original

- [Abrir slides originais](../raw/lesson-3.html)
- [Abrir transcrição bruta](../raw/lesson-3.txt)
