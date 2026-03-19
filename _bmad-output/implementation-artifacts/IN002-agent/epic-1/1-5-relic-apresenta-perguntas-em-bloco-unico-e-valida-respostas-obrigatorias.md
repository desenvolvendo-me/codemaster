# Story 1.5: Relic apresenta perguntas em bloco único e valida respostas obrigatórias

Status: ready-for-dev

## Story

Como developer (Marco Castro),
quero que o /codemaster:relic apresente todas as perguntas de classificação de uma vez e valide se respondi cada uma,
para que o registro da relic fique tão fluido quanto a quest sem perder consistência dos dados.

## Acceptance Criteria

1. **Dado** que uma Quest está ativa
   **Quando** dev usa `/codemaster:relic "descoberta sobre stateless sessions"`
   **Então** agente lê `active-quest.json` para contextualizar a quest atual
   **E** apresenta em uma única mensagem as 2 perguntas obrigatórias da relic
   **E** pede explicitamente que o dev responda ambas juntas, numeradas

2. **Dado** que o dev responde apenas uma das perguntas, responde fora do formato ou deixa a intenção ambígua
   **Quando** o agente valida a mensagem recebida
   **Então** agente não registra a relic
   **E** informa objetivamente quais respostas estão faltando ou inválidas
   **E** pede apenas a complementação necessária antes de prosseguir

3. **Quando** as 2 respostas obrigatórias estão completas e válidas
   **Então** a relic é registrada normalmente na nota da quest com timestamp e dimensão
   **E** o frontmatter da quest é atualizado com o ID em `relics[]`
   **E** se o dev indicou valor futuro a relic também é arquivada em `vault/relics/`

4. **Dado** que nenhuma Quest está ativa
   **Quando** dev usa `/codemaster:relic`
   **Então** agente mantém o comportamento atual de avisar que não há quest ativa e sugerir `/codemaster:quest`

## Tasks / Subtasks

- [ ] Atualizar `_codemaster/agents/relic.md` para fluxo em bloco único (AC: 1, 2, 4)
  - [ ] Reescrever o Passo 2 e o Passo 3 para serem apresentados juntos em uma única mensagem
  - [ ] Instruir explicitamente o agente a pedir respostas numeradas `1.` e `2.`
  - [ ] Definir regra de validação: não registrar enquanto dimensão ou intenção de arquivamento estiver ausente/ambígua
  - [ ] Definir resposta de correção curta apontando exatamente o item pendente
- [ ] Ajustar a lógica operacional que consome as respostas da relic sem mudar schema persistido (AC: 2, 3)
  - [ ] Garantir parsing de dimensão aceitando número e texto equivalente (`1`/`arquitetural`, `2`/`negocial`, `3`/`IA`)
  - [ ] Garantir parsing da decisão de arquivamento aceitando equivalentes simples (`sim`/`não`, `s`/`n`, `tem valor futuro`/`apenas nesta quest`)
  - [ ] Manter `addRelic()` e estrutura de arquivos compatíveis com o formato atual
- [ ] Criar/atualizar testes cobrindo respostas incompletas e registro só após validação (AC: 2, 3)
  - [ ] Caso feliz: 2 respostas presentes em uma única mensagem
  - [ ] Caso pendente: só dimensão respondida
  - [ ] Caso pendente: só decisão de arquivamento respondida
  - [ ] Caso ambíguo: resposta sem permitir inferir dimensão ou arquivamento

## Dev Notes

- O padrão de UX de referência é `_codemaster/agents/quest.md`, que já apresenta múltiplas perguntas de uma vez e só avança após respostas suficientes.
- A mudança é de orquestração conversacional; não há necessidade de alterar frontmatter, IDs, pastas ou formato da nota da relic.
- O arquivo principal de prompt é `_codemaster/agents/relic.md`. Se houver wrappers ou templates específicos para slash command, eles devem refletir o mesmo contrato de validação para não divergir do agente principal.

### Project Structure Notes

- Agentes compartilhados ficam em `_codemaster/agents/`.
- Persistência do momento Relic permanece no domínio de `src/moments/` e serviços de vault/state já existentes.
- Não introduzir novo schema em `active-quest.json`, notas de quest ou notas de relic.

### References

- [Source: _codemaster/agents/quest.md#Passo 3 — 3 perguntas contextuais] — padrão de perguntas em bloco único
- [Source: _codemaster/agents/relic.md#Fluxo de Relic] — fluxo atual com perguntas separadas
- [Source: _bmad-output/planning-artifacts/IN002-agent/epics.md#Story 1.2: Dev registra Relic durante Quest ativa] — comportamento funcional base da relic
- [Source: _bmad-output/implementation-artifacts/IN002-agent/epic-1/1-2-dev-registra-relic-durante-quest-ativa.md] — contexto técnico da implementação anterior

## Dev Agent Record

### Agent Model Used

_a preencher_

### Debug Log References

### Completion Notes List

### File List
