---
title: Aula Bônus
description: Brownfield to TEA com foco em rastreabilidade por story, disciplina de execução e qualidade em CI.
---

# Visão geral

A aula bônus apresenta o fluxo `Brownfield to TEA`, com foco em aumentar qualidade e previsibilidade em projetos existentes por meio de rastreabilidade e execução disciplinada.

## Contexto e objetivo

- Melhorar qualidade das entregas sem perder velocidade operacional.
- Usar o código real como fonte de verdade para reduzir ambiguidade.
- Estruturar um processo repetível para `TD -> TA -> RV -> TR`.

## Reflexão de mercado

- O cenário de IA muda rápido e altera papéis tradicionais.
- O foco de avaliação sai do detalhe sintático e sobe para qualidade de resultado.
- Revisão precisa observar evidências, riscos e comportamento entregue.

<img src="../raw/lesson-bonus-1/uncle-bob-pr.png" alt="Referência de discussão sobre revisão de código orientada por métricas em contexto de IA" />

## QA, PO e TL como responsabilidade integrada

- A operação exige visão conjunta de produto, qualidade e técnica.
- Revisão orientada por artefatos reduz subjetividade no code review.
- Fluxos guiados evitam decisões isoladas e retrabalho acumulado.

## CT e CST

### CT

- Use quando spec estiver ausente, fraca ou desatualizada.
- O código vira base principal para derivar a story operacional.

### CST

- Use quando houver conflito entre documentação e implementação.
- Reconciliar baseline antes de iniciar o ciclo TEA.

## Pronto para iniciar TD?

- Story alvo com objetivo e fora de escopo claros.
- Fronteira de código congelada para a rodada.
- Fontes de verdade listadas (código, spec e docs).
- Riscos P0/P1 priorizados.
- Saída da rodada definida: `done` ou `blocked`.

## Regras que evitam retrabalho

- Código atual como fonte única de verdade.
- Uma execução por etapa do TEA, sem atalhos.
- Sem iniciar TD sem story congelada.
- Pós-TR global somente com confirmação explícita.

## O que toda execução deve entregar

- Marcadores de início e fim do ciclo.
- Cenário escolhido com justificativa curta.
- Story alvo e recorte de código.
- Status de `TD`, `TA`, `RV` e `TR`.
- Artefatos alterados, riscos abertos e próximo passo.

## Operação diária e testes

### Tagueamento de testes

- Organiza cobertura por iniciativa e épico.
- Permite paralelismo no CI com melhor rastreabilidade.
- Facilita leitura de resultado por contexto de negócio.

<img src="../raw/lesson-bonus-1/ci.png" alt="Fluxo do GitHub Actions no CI" />
<img src="../raw/lesson-bonus-1/ins.png" alt="Testes de arquivos específicos do negócio" />
<img src="../raw/lesson-bonus-1/model.png" alt="Testes de arquivos gerais do sistema" />
<img src="../raw/lesson-bonus-1/simplecov.png" alt="Resultado final consolidado da cobertura dos testes" />

### Gates por risco

- `PR Gate` até 8 minutos, priorizando cenários P0.
- `Merge Gate` até 20 minutos, cobrindo P0 e P1.
- `Nightly` para suíte ampla e tendência de flakiness.

## Material original

- [Abrir slides originais](../raw/lesson-bonus-1.html)
- [Abrir transcrição bruta](../raw/lesson-bonus-1.txt)
