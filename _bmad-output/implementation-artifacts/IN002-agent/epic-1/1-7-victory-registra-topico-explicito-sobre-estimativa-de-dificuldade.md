# Story 1.7: Victory registra tópico explícito sobre estimativa de dificuldade

Status: ready-for-dev

## Story

Como developer (Marco Castro),
quero que a /codemaster:victory inclua um tópico explícito sobre a estimativa de dificuldade da quest,
para que eu consiga revisar no histórico como estimei a missão, como ela aconteceu na prática e o que aprendi com esse delta.

## Acceptance Criteria

1. **Dado** que a quest possui `plannedDifficulty`
   **Quando** dev conclui a `/codemaster:victory`
   **Então** o arquivo de victory inclui uma seção dedicada à estimativa de dificuldade
   **E** essa seção mostra a dificuldade planejada, a dificuldade real e o delta entre elas
   **E** a apresentação usa a mesma escala de monstros já adotada no sistema

2. **Dado** que o agente já perguntou a dificuldade real ao final da reflexão
   **Quando** a victory é registrada
   **Então** o agente também registra um breve insight textual sobre a estimativa
   **E** o insight indica se houve subestimação, superestimação ou precisão
   **E** o texto fica dentro da seção dedicada à dificuldade, não apenas na mensagem final ao dev

3. **Dado** que a quest é antiga e não possui `plannedDifficulty`
   **Quando** a victory é registrada
   **Então** o sistema continua funcionando sem erro
   **E** a seção de estimativa de dificuldade é omitida graciosamente
   **E** o restante do fluxo da victory permanece inalterado

## Tasks / Subtasks

- [ ] Atualizar `src/moments/victory.js` para persistir a seção de estimativa no conteúdo da victory (AC: 1, 2, 3)
  - [ ] Incluir no payload final da victory os dados de dificuldade já calculados no fluxo atual: planejada, real e delta
  - [ ] Montar uma subseção explícita, por exemplo `### Estimativa de Dificuldade`, dentro do bloco `## Victory`
  - [ ] Registrar o resumo visual com monstros e o delta numérico
  - [ ] Registrar um insight textual curto: subestimou, superestimou ou estimativa precisa
  - [ ] Omitir a subseção quando `plannedDifficulty` não existir
- [ ] Ajustar `_codemaster/agents/victory.md` para alinhar expectativa do artefato gerado (AC: 1, 2)
  - [ ] Explicitar no passo de registro que a victory salva a seção de estimativa de dificuldade
  - [ ] Garantir consistência entre a mensagem exibida ao dev e o texto persistido no arquivo
- [ ] Criar/atualizar testes cobrindo a nova seção da victory (AC: 1, 2, 3)
  - [ ] Caso feliz com `plannedDifficulty` e `actualDifficulty`
  - [ ] Caso de subestimação com delta positivo
  - [ ] Caso de superestimação com delta negativo
  - [ ] Caso de precisão com delta zero
  - [ ] Caso compatível sem `plannedDifficulty`

## Dev Notes

- Esta story complementa a [1-4-nivel-dificuldade-quest-com-comparacao-victory.md](/home/marcodotcastro/RubymineProjects/codemaster/_bmad-output/implementation-artifacts/IN002-agent/epic-1/1-4-nivel-dificuldade-quest-com-comparacao-victory.md), que já definiu coleta e persistência dos campos de dificuldade.
- O objetivo aqui não é mudar o schema existente, mas melhorar o artefato textual da victory para tornar a análise da estimativa visível dentro da própria nota.
- A mudança deve preservar compatibilidade com quests antigas sem `plannedDifficulty`.

### Project Structure Notes

- Agente principal: `_codemaster/agents/victory.md`.
- Persistência da nota: `src/moments/victory.js`.
- Não alterar formato de `PROGRESS.md` nesta story, a menos que seja estritamente necessário para manter consistência textual.

### References

- [Source: _codemaster/agents/victory.md#Passo 3 — Dificuldade real] — coleta de dificuldade planejada e real no fluxo atual
- [Source: _bmad-output/implementation-artifacts/IN002-agent/epic-1/1-4-nivel-dificuldade-quest-com-comparacao-victory.md] — story base da funcionalidade de dificuldade
- [Source: _bmad-output/implementation-artifacts/IN002-agent/epic-1/1-6-victory-apresenta-reflexoes-em-bloco-unico-e-so-scoreia-apos-respostas-completas.md] — fluxo recente de victory que preserva o passo posterior de dificuldade

## Dev Agent Record

### Agent Model Used

_a preencher_

### Debug Log References

### Completion Notes List

### File List
