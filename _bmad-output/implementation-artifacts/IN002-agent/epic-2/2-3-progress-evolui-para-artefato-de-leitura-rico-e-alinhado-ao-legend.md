# Story 2.3: PROGRESS evolui para artefato de leitura rico e alinhado ao Legend

Status: ready-for-dev

## Story

Como developer (Marco Castro),
quero que o `PROGRESS.md` seja um artefato mais rico e legível, com estrutura narrativa compatível com o Legend,
para que eu possa consultar meu histórico diretamente no vault sem depender de um formato bruto e técnico demais.

## Acceptance Criteria

1. **Dado** que uma new victory é registrada
   **Quando** o sistema atualiza o `PROGRESS.md`
   **Então** o arquivo preserva uma estrutura rica de leitura, com cabeçalho, contexto de dimensões atuais e agrupamento por milestone
   **E** cada entrada do milestone mostra claramente a quest
   **E** a victory correspondente aparece como subitem da quest, não perdida na mesma linha nem omitida

2. **Dado** que existem links para quest e victory
   **Quando** o sistema renderiza a entrada no `PROGRESS.md`
   **Então** os links usam o nome do arquivo como label
   **E** seguem caminhos explícitos para `quests/` e `victories/`
   **E** continuam compatíveis com a navegação no Obsidian

3. **Dado** que o sistema precisa mostrar scores, tendência e delta de dificuldade
   **Quando** uma entrada é adicionada ao milestone atual
   **Então** essas informações continuam presentes
   **E** ficam organizadas em um layout legível para humanos
   **E** a evolução do documento não quebra o consumo posterior pelo `legend` e por futuras leituras automatizadas

4. **Dado** que já existem vaults com `PROGRESS.md` no formato simples atual
   **Quando** a nova versão do sistema encontrar esses arquivos
   **Então** a atualização ocorre de forma compatível ou com migração controlada
   **E** o histórico existente não é perdido
   **E** o resultado final converge para o formato rico definido para o produto

## Tasks / Subtasks

- [ ] Definir formato-alvo do `PROGRESS.md` como contrato explícito do produto (AC: 1, 2, 3, 4)
  - [ ] Atualizar `_codemaster/agents/FORMAT.md` com o novo schema textual do `PROGRESS.md`
  - [ ] Alinhar `_codemaster/agents/legend.md` para consumir e exibir o mesmo modelo conceitual
  - [ ] Documentar a relação entre linha principal da quest e subitem da victory
- [ ] Atualizar geração de `PROGRESS.md` no fluxo de victory (AC: 1, 2, 3)
  - [ ] Ajustar `src/moments/victory.js` para escrever o layout rico
  - [ ] Preservar scores, tendências e delta de dificuldade
  - [ ] Garantir links explícitos para `quests/` e `victories/` com label igual ao nome do arquivo
  - [ ] Garantir que a entry continue agrupada sob `## Milestone {n} — {x}/5 victories`
- [ ] Garantir compatibilidade com leitura posterior do histórico (AC: 3, 4)
  - [ ] Revisar `src/moments/legend.js` para não depender de parsing frágil do formato antigo
  - [ ] Revisar qualquer leitura derivada que assuma estrutura minimalista
  - [ ] Manter consistência entre `PROGRESS.md`, notas de quest e notas de victory
- [ ] Cobrir migração/compatibilidade e testes (AC: 4)
  - [ ] Adicionar testes para `PROGRESS.md` legado sendo enriquecido
  - [ ] Adicionar testes para novas entradas com quest + subitem de victory
  - [ ] Adicionar testes para presença de links com label igual ao nome do arquivo

## Dev Notes

- Hoje existe um descompasso entre o `PROGRESS.md` mínimo gerado pelo fluxo de `victory` e a expectativa de um artefato mais “Legend-like” no vault.
- Esta story deve resolver o descompasso no artefato fonte, não apenas na apresentação do comando `/codemaster:legend`.
- O objetivo não é duplicar o `Legend`, mas tornar o `PROGRESS.md` uma base humana e estável de consulta.

### Project Structure Notes

- Geração de progresso atual: `src/moments/victory.js`.
- Consumo e exibição histórica: `src/moments/legend.js`.
- Contrato documental: `_codemaster/agents/FORMAT.md` e `_codemaster/agents/legend.md`.
- A solução deve respeitar o vault existente e evitar migração destrutiva.

### References

- [Source: _bmad-output/planning-artifacts/IN002-agent/epics.md#Story 2.1: Dev visualiza histórico de evolução via Legend] — contexto do consumidor principal do progresso
- [Source: _codemaster/agents/legend.md#Com victories] — formato esperado de leitura da lenda
- [Source: _codemaster/agents/FORMAT.md#4. Entrada no PROGRESS.md (atualizada pelo Victory)] — contrato atual simplificado do `PROGRESS.md`
- [Source: _bmad-output/implementation-artifacts/IN002-agent/epic-1/1-3-dev-encerra-quest-com-victory-e-reflexao-avaliada.md] — origem da atualização básica do `PROGRESS.md`
- [Source: _bmad-output/implementation-artifacts/IN002-agent/epic-1/1-4-nivel-dificuldade-quest-com-comparacao-victory.md] — delta de dificuldade já incorporado ao histórico

## Dev Agent Record

### Agent Model Used

_a preencher_

### Debug Log References

### Completion Notes List

### File List
