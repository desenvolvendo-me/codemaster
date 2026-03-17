---
initiative: IN002
domain: claude-code
status: active
inputDocuments: ["_bmad-output/planning-artifacts/prd.md"]
---

# PRD — IN002 Claude Code

## Contexto

O CodeMaster é uma ferramenta **global** (instalada via `npm install -g`). O domínio Claude Code compreende os 5 momentos expostos como slash commands em `~/.claude/commands/codemaster/`, o bloco injetado no `~/.claude/CLAUDE.md` que habilita a sugestão proativa, e a lógica de interação nos agentes instalados globalmente em `~/.codemaster/agents/`. Os comandos são thin wrappers que carregam de `~/.codemaster/agents/` — fonte única de verdade compartilhada entre todas as ferramentas de IA. É o canal principal de uso do CodeMaster pelo dev.

## Functional Requirements

- **FR6:** Sistema pode detectar se Claude Code está instalado e injetar instruções no CLAUDE.md
- **FR8:** Sistema pode detectar injeção prévia e substituí-la sem duplicar conteúdo
- **FR10:** Dev pode iniciar uma Quest com título, ativando 3 perguntas de reflexão inicial guiadas pelo agente
- **FR11:** Durante a Quest, quando o dev responde uma das 3 perguntas de reflexão inicial de forma rasa (ex: resposta genérica ou muito curta), o agente pode pedir um nível a mais de detalhe sobre aquele contexto específico — sem entregar a resposta pelo dev
- **FR12:** Sistema pode criar nota estruturada no Obsidian Vault com contexto da Quest e respostas do dev
- **FR14:** Dev pode registrar uma descoberta (Relic) durante uma Quest ativa, classificando-a como arquitetural, negocial ou orquestração de IA
- **FR15:** Sistema pode arquivar a Relic na nota da Quest ativa com timestamp e dimensão identificada
- **FR16:** Sistema pode arquivar a Relic também em `/relics/` quando for relevante além da quest atual
- **FR19:** Dev pode encerrar uma Quest ativa via Victory, ativando 5 perguntas de reflexão final guiadas pelo agente
- **FR20:** Durante o Victory, quando o dev responde uma das 5 perguntas de reflexão final de forma rasa (ex: sem conectar a decisão ao impacto de negócio ou arquitetura), o agente pode pedir um nível a mais de profundidade — sem interpretar ou concluir pelo dev
- **FR21:** Sistema pode avaliar as respostas do Victory e atribuir tendências (↑ → ↓) para cada uma das 3 dimensões
- **FR22:** Sistema pode registrar a Victory com respostas, tendências e timestamp na nota da Quest
- **FR23:** Sistema pode atualizar o PROGRESS.md com a nova Victory e tendências acumuladas
- **FR33:** Dev pode visualizar o histórico completo de evolução — missões, relíquias, vitórias e tendências por dimensão
- **FR34:** Sistema pode exibir tendências acumuladas nas 3 dimensões com destaque para a última vitória e milestones concluídos
- **FR35:** Sistema pode exibir a maior relíquia do período e sugerir o foco para o próximo milestone
- **FR36:** Dev pode solicitar diagnóstico de gaps baseado no histórico acumulado do vault
- **FR37:** Sistema pode ler quests, victories e relics do vault para extrair padrões de aprendizado por dimensão
- **FR38:** Sistema pode gerar ou atualizar o **KNOWLEDGE-MAP.md** — o documento mais importante do sistema — de forma clara, simples e navegável, com status por área (Para Estudar / Estudado / Praticado) e prioridade baseada em gaps reais
- **FR39:** Sistema pode gerar orientação sobre os conhecimentos que faltam para o próximo nível com base no KNOWLEDGE-MAP.md atualizado
- **FR40:** Agente de IA (Claude Code) pode sugerir proativamente o uso do quest quando o dev inicia uma tarefa sem Quest ativa *(hipótese — a validar na semana 1)*
- **FR41:** Dev pode usar os 5 momentos do CodeMaster em qualquer projeto aberto no Claude Code após o setup

### Camada de agentes compartilhados (sem duplicação por ferramenta)

- **FR45:** Sistema mantém os templates de agente em `_codemaster/agents/{momento}.md` (versionados no pacote npm) e os copia para `~/.codemaster/agents/` durante o setup — path global estável e independente do local de instalação do npm
- **FR46:** Setup gera `~/.claude/commands/codemaster/{momento}.md` como thin wrappers que apenas ativam `~/.codemaster/agents/{momento}.md` — sem lógica de negócio nos wrappers
- **FR47:** Setup é idempotente para `~/.codemaster/agents/` e `~/.claude/commands/codemaster/`: sobrescreve na reinstalação, nunca duplica
- **FR48:** Bloco injetado em `~/.codex/instructions.md` instrui Codex a carregar de `~/.codemaster/agents/{momento}.md` — reutilizando os mesmos agentes globais sem duplicação
- **FR49:** Adicionar suporte a nova ferramenta de IA requer apenas gerar thin wrappers no formato da ferramenta apontando para `~/.codemaster/agents/` — nenhum agente precisa ser duplicado

## Non-Functional Requirements

- **NFR2:** Operações de leitura e escrita no Obsidian Vault (criar nota, atualizar PROGRESS.md, arquivar Relic) devem ser concluídas em menos de 3 segundos em filesystems locais padrão
- **NFR3:** Leitura do `active-quest.json` no início de cada comando deve ser imperceptível (<100ms) para não interromper o fluxo do agente
- **NFR4:** O comando `/codemaster:knowledge` pode levar mais de 3 segundos quando o vault é grande — o agente deve informar ao dev que o processamento está em andamento
- **NFR8:** A injeção no `CLAUDE.md` e `instructions.md` deve ser append-only com identificação clara do bloco — o sistema nunca deve sobrescrever conteúdo preexistente do usuário fora do bloco CodeMaster identificado
- **NFR10:** A integração com o Obsidian Vault deve funcionar via filesystem puro — sem dependência de plugins, APIs ou processos do Obsidian em execução
- **NFR11:** A integração com Claude Code deve funcionar com qualquer versão que suporte o formato de slash commands em `~/.claude/commands/`
- **NFR-S1:** Wrappers em `~/.claude/commands/codemaster/` devem ter no máximo ~15 linhas — nenhuma lógica de negócio, apenas ativação do agente em `~/.codemaster/agents/`
- **NFR-S2:** `~/.codemaster/agents/{momento}.md` é autocontido — não referencia qual ferramenta o invoca
