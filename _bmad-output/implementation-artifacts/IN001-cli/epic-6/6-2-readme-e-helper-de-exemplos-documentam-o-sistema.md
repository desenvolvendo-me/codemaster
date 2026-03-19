# Story 6.2: README e helper de exemplos documentam o sistema

Status: review

## Story

Como developer (Ricardo),
quero um README claro e acesso a exemplos de uso,
para que eu entenda rapidamente como instalar, configurar e usar todos os momentos do CodeMaster.

## Acceptance Criteria

1. **Dado** que developer acessa o pacote npm ou repositório
   **Quando** lê o `README.md`
   **Então** README contém: comando de instalação (`npm install -g codemaster`), uso do `codemaster setup`, descrição dos 5 slash commands com exemplos de uso, referência do schema do `config.json` e link para `templates/obsidian-example/`

2. **Dado** que developer quer ver uma demonstração do ciclo completo
   **Quando** acessa o helper de exemplos (documentado no README)
   **Então** walkthrough de quest → relic → victory está disponível com respostas de exemplo realistas que demonstram qualidade de reflexão nas 3 dimensões

## Tasks / Subtasks

- [x] Criar `README.md` na raiz do projeto (AC: 1)
  - [x] Seção: instalação (`npm install -g codemaster`)
  - [x] Seção: configuração (`codemaster setup` — o que pede, o que cria)
  - [x] Seção: os 5 momentos — quest, relic, victory, legend, knowledge
  - [x] Seção: slash commands com exemplos de uso nos agentes
  - [x] Seção: schema do `config.json` (campos principais)
  - [x] Seção: link e guia para `templates/obsidian-example/`
  - [x] Seção: NFRs relevantes (funciona offline, setup em < 5 min)
- [x] Criar `templates/obsidian-example/README.md` — guia de leitura do ciclo completo (AC: 2)
  - [x] Walkthrough: quest → relic → victory → milestone-summary
  - [x] Respostas de exemplo realistas nas 3 dimensões (via Q001-exemplo-quest.md)
  - [x] Explicação do que cada arquivo representa no sistema

## Dev Notes

### README.md — estrutura obrigatória (AC: 1)

O README DEVE conter todas as seções especificadas nos AC. Estrutura sugerida:

```markdown
# CodeMaster — AI Engineer Evolution Agent

> Transforme cada demanda de desenvolvimento em aprendizado estruturado.

## Instalação

npm install -g codemaster

## Configuração

codemaster setup

O wizard irá guiá-lo pelos 5 momentos do método CodeMaster...

## Os 5 Momentos

| Momento | Slash Command | Quando usar |
|---------|---------------|-------------|
| Quest   | /quest        | Ao iniciar uma nova tarefa |
| Relic   | /relic        | Ao fazer uma descoberta |
| Victory | /victory      | Ao concluir uma quest |
| Legend  | /legend       | Para ver seu progresso |
| Knowledge| /knowledge   | Para mapear seus gaps |

## Slash Commands

### /quest "Nome da quest"
[descrição + exemplo de uso]

...

## Configuração (config.json)

Após o setup, `~/.codemaster/config.json` conterá:
[schema simplificado]

## Exemplos

Veja `templates/obsidian-example/` para um exemplo completo de:
- Quest com reflexões nas 3 dimensões
- Relic com descoberta técnica
- Milestone summary após 5 victories

## Requisitos

- Node.js 18+
- Obsidian (para visualizar o vault)
- Claude Code ou Codex instalados
```

### `templates/obsidian-example/README.md` — walkthrough (AC: 2)

```markdown
# Exemplos CodeMaster — Ciclo Completo

Este diretório demonstra o output real do sistema após um milestone.

## Como ler estes exemplos

**1. Comece pela Quest** → `quests/Q001-exemplo-quest.md`
   - Veja como estruturar reflexões nas 3 dimensões
   - Qualidade das respostas = qualidade do seu aprendizado

**2. Veja o Relic** → `relics/R001-exemplo-relic.md`
   - Descoberta extraída da quest
   - Categorizada por dimensão e score

**3. Veja o Summary do Milestone** → `M01-summary.md`
   - Gerado automaticamente após a 5ª Victory
   - Consolida médias e padrões do período

**4. Veja o Knowledge Map** → `KNOWLEDGE-MAP.md`
   - Gaps identificados ao longo do milestone
   - Guia de estudo para o próximo ciclo

## Ciclo de uso típico

codemaster setup → /quest "Implementar auth" → ...desenvolve... → /relic "descoberta"
→ /victory → /legend → (a cada 5 victories) → milestone automático
```

### NFRs relevantes para o README

- **NFR1:** Setup < 5 minutos — mencionar no README
- **NFR9:** Funciona 100% offline — destaque importante para o dev
- **NFR14:** macOS, Linux, Windows com WSL

### Conteúdo técnico do README — o que incluir

1. Os 5 slash commands com descrição curta de quando usar
2. Schema do `config.json` de forma simplificada (não a versão técnica completa)
3. Onde fica o vault (`vault_path` configurado no setup)
4. Como reinstalar/reconfigurar (`codemaster setup` novamente)

### O que NÃO incluir no README

- Detalhes de implementação interna
- Instruções de contribuição (MVP solo)
- Changelog detalhado
- Referências aos arquivos `_bmad-output/` (são artefatos de desenvolvimento)

### Project Structure Notes

- `README.md` fica na **raiz** do projeto (`codemaster/README.md`)
- `templates/obsidian-example/README.md` fica dentro do diretório de exemplos
- Ambos são arquivos de documentação estática — sem lógica de código

### References

- FR47, FR48, FR49: [prd.md](../../planning-artifacts/IN001-cli/prd.md)
- NFR1, NFR9, NFR14: [prd.md](../../planning-artifacts/IN001-cli/prd.md)
- Exemplos de arquivos: [6-1-exemplo-de-milestone-completo-disponivel-nos-templates.md](./6-1-exemplo-de-milestone-completo-disponivel-nos-templates.md)
- Story completa: [epics.md](../../planning-artifacts/IN001-cli/epics.md#Story-6.2)

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

README.md existia mas com conteúdo desatualizado (sintaxe @codemaster, 4 comandos, vault structure incorreta, sem link para templates/). Reescrito para cumprir todos os ACs.
`templates/obsidian-example/README.md` já havia sido criado na story 6.1 — cobre integralmente o AC 2.

### Completion Notes List

- README.md reescrito na raiz do projeto com todas as seções do AC 1
- Slash commands atualizados para o formato correto `/codemaster:quest`
- Schema do config.json incluído como exemplo comentado
- Link para `templates/obsidian-example/` e seu README
- NFRs documentados: 100% offline, < 5 min, macOS/Linux/Windows WSL
- `templates/obsidian-example/README.md` validado — cobre AC 2 com walkthrough e referências realistas
- 131 testes passando, sem regressões

### File List

- README.md (atualizado)
- templates/obsidian-example/README.md (criado na story 6.1, validado aqui)
