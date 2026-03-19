# Story 1.6: Victory apresenta reflexões em bloco único e só scoreia após respostas completas

Status: ready-for-dev

## Story

Como developer (Marco Castro),
quero que o /codemaster:victory apresente todas as perguntas de reflexão de uma vez e confirme que respondi todas,
para que o encerramento da quest siga o mesmo padrão da quest e evite scoring com contexto incompleto.

## Acceptance Criteria

1. **Dado** que uma Quest está ativa
   **Quando** dev usa `/codemaster:victory`
   **Então** agente lê `active-quest.json` e commits recentes quando disponíveis
   **E** apresenta em uma única mensagem as 5 perguntas de reflexão contextualizadas
   **E** pede explicitamente que o dev responda todas juntas, numeradas

2. **Dado** que o dev deixa uma ou mais respostas ausentes, rasas ou desconectadas do contexto real da quest
   **Quando** o agente valida a resposta recebida
   **Então** agente não executa scoring nem registra a victory
   **E** aponta exatamente quais respostas precisam ser complementadas
   **E** pede apenas o complemento necessário antes de continuar

3. **Quando** as 5 respostas obrigatórias estão completas e suficientemente úteis
   **Então** agente executa o scoring holístico por dimensão
   **E** calcula tendências normalmente
   **E** só então segue para a pergunta de dificuldade real, quando houver `plannedDifficulty`
   **E** registra quest, victory, `PROGRESS.md` e limpeza do `active-quest.json` sem alterar o schema persistido

4. **Dado** que nenhuma Quest está ativa
   **Quando** dev usa `/codemaster:victory`
   **Então** agente mantém o comportamento atual de avisar que não há quest ativa e orientar o início de uma nova quest

## Tasks / Subtasks

- [ ] Atualizar `_codemaster/agents/victory.md` para coletar as 5 reflexões em bloco único (AC: 1, 2, 4)
  - [ ] Reescrever o Passo 2 para apresentar as 5 perguntas em uma única mensagem
  - [ ] Instruir o agente a solicitar respostas numeradas `1.` a `5.`
  - [ ] Manter contextualização por commits e pela quest antes de formular o bloco
  - [ ] Preservar a pergunta de dificuldade real como passo posterior ao bloco de reflexões
- [ ] Definir validação explícita antes do scoring (AC: 2, 3)
  - [ ] Bloquear scoring se qualquer uma das 5 respostas estiver ausente
  - [ ] Bloquear scoring se resposta estiver rasa demais para sustentar análise
  - [ ] Fazer reprompt curto listando exatamente os itens faltantes ou fracos
  - [ ] Permitir complementar parcialmente sem reiniciar todo o fluxo
- [ ] Ajustar a lógica operacional do momento Victory mantendo compatibilidade (AC: 3)
  - [ ] Garantir que `closeVictory()` continue recebendo o mesmo conjunto final de reflexões esperado hoje
  - [ ] Garantir que tendência, atualização da quest, arquivo de victory, `PROGRESS.md` e limpeza do estado não mudem de schema
  - [ ] Garantir que o passo de `actualDifficulty` continue opcional para quests antigas
- [ ] Criar/atualizar testes cobrindo o novo contrato conversacional (AC: 1, 2, 3)
  - [ ] Caso feliz: 5 respostas entregues em uma única mensagem
  - [ ] Caso pendente: uma ou mais respostas ausentes
  - [ ] Caso raso: resposta curta sem evidência suficiente para scoring
  - [ ] Caso compatível: quest sem `plannedDifficulty`

## Dev Notes

- O comportamento de referência é `_codemaster/agents/quest.md`, que já faz coleta em lote e valida suficiência antes de avançar.
- A mudança precisa ficar restrita ao fluxo conversacional e à validação pré-scoring. O formato dos artefatos persistidos pela victory deve permanecer o mesmo.
- `_codemaster/agents/victory.md` hoje instrui perguntas sequenciais; isso deve ser alinhado ao padrão da quest sem perder a leitura opcional de commits e a etapa posterior de dificuldade real.

### Project Structure Notes

- Agente principal: `_codemaster/agents/victory.md`.
- Persistência e scoring: `src/moments/victory.js` e serviços de vault/state já existentes.
- Não mudar nomes de campos nem estrutura de `PROGRESS.md`, frontmatter da quest/victory ou `active-quest.json`.

### References

- [Source: _codemaster/agents/quest.md#Passo 3 — 3 perguntas contextuais] — padrão de perguntas em bloco único
- [Source: _codemaster/agents/victory.md#Passo 2 — 5 perguntas de reflexão] — fluxo atual sequencial
- [Source: _codemaster/agents/victory.md#Passo 3 — Dificuldade real] — passo que deve permanecer após as reflexões
- [Source: _bmad-output/planning-artifacts/IN002-agent/epics.md#Story 1.3: Dev encerra Quest com Victory e reflexão avaliada] — comportamento funcional base da victory
- [Source: _bmad-output/implementation-artifacts/IN002-agent/epic-1/1-3-dev-encerra-quest-com-victory-e-reflexao-avaliada.md] — contexto técnico da implementação anterior
- [Source: _bmad-output/implementation-artifacts/IN002-agent/epic-1/1-4-nivel-dificuldade-quest-com-comparacao-victory.md] — dependência do passo de dificuldade real após as reflexões

## Dev Agent Record

### Agent Model Used

_a preencher_

### Debug Log References

### Completion Notes List

### File List
