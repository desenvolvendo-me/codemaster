---
title: Lição 1
description: Fundamentos de LLMs, agents, skills, contexto e workflow prático com IA.
---

# Visão geral

A primeira aula apresenta o novo paradigma de desenvolvimento com IA: o diferencial não é "pedir código", e sim explicar com clareza o problema, o contexto e o resultado esperado.

## Objetivos da aula

- Entender a diferença entre `LLM`, `agent` e `skill`.
- Mostrar por que contexto negocial e arquitetural mudam a qualidade do output.
- Introduzir os modos `Ask`, `Plan`, `Edit` e `Test`.
- Conectar `XP + AI`, `BMAD` e o papel do `New Engineer`.

## Mudança de paradigma

- Programadores substituíveis são os que não sabem explicar claramente o que precisa ser feito.
- IA sem método gera retrabalho; IA com método acelera a entrega.
- A experiência humana continua sendo necessária para decidir produto, qualidade e arquitetura.

## LLMs, agents e skills

### LLMs

- Modelos de linguagem ampliam raciocínio, geração de texto e leitura de código.
- O foco não é chat, e sim execução assistida por contexto.

### Agents

- Um agent não apenas responde: ele planeja, usa ferramentas, altera arquivos e testa.
- O humano define o objetivo; o agent executa o trabalho operacional.

### Skills

- Skills estendem o agent com processos e instruções especializadas.
- No contexto do treinamento, BMAD e CodeMaster são exemplos de camadas que ensinam o agent a operar em papéis específicos.

## Contexto é a base

### Contexto negocial

- Explica o problema real, as regras de negócio e a intenção do produto.
- Sem isso, o código pode estar tecnicamente certo e funcionalmente errado.

### Contexto arquitetural

- Explica stack, convenções, estruturas existentes e restrições técnicas.
- Sem isso, o agent tende a reinventar soluções e aumentar inconsistência.

## Modos de uso

- `Ask`: entender antes de agir.
- `Plan`: definir a estratégia antes de editar.
- `Edit`: implementar com intenção clara.
- `Test`: validar comportamento, regressão e fechamento do ciclo.

## Workflow e XP

- O ciclo recomendado é `Ask -> Plan -> Edit -> Test`.
- `XP` é a metodologia que melhor conversa com agents por causa de ciclos curtos, feedback rápido, refatoração e integração contínua.
- O `New Engineer` atua com visão de `PO + QA + TL`, enquanto o agent assume a execução mais mecânica.

## Drive Development

### Métodos

- `TDD`: qualidade técnica guiada por testes.
- `BDD`: comportamento descrito em linguagem de negócio.
- `DDD`: domínio como centro da arquitetura.
- `SDD`: especificação como contrato para implementação e validação.

### Ferramentas

- `Speckit` e `Kiro` ajudam a estruturar especificação e rastreabilidade.
- `BMAD` organiza agents por função.
- `AIOX` aparece como modelo operacional para escalar execução com IA.

## Workflow prático

- O stack apresentado combina `ChatGPT`, `Codex`, `XP` e `BMAD`.
- O BMAD é apresentado como um time completo de agents com PM, arquiteto, dev e QA.
- O humano continua como orquestrador, navigator e responsável final pela qualidade.

## Fontes citadas na aula

- [Live citada na apresentação](https://www.youtube.com/live/G_8uG1Ot0yo)
- [37 dias de imersão em vibe coding](https://akitaonrails.com/2026/03/05/37-dias-de-imers%C3%A3o-em-vibe-coding-conclus%C3%A3o-quanto-a-modelos-de-neg%C3%B3cio/)

## Material original

- [Abrir slides originais](../raw/lesson-1.html)
- [Abrir transcrição bruta](../raw/lesson-1.txt)
