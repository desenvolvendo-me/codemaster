---
initiative: IN002
domain: claude-code
status: active
inputDocuments: ["_bmad-output/planning-artifacts/epics.md"]
---

# Epics — IN002 Claude Code

## Epic 1: Fundação — Dev instala e está pronto para usar (Story IN002: 1.3)

Dev pode instalar o CodeMaster, completar o onboarding guiado, configurar seu perfil e ter os 5 momentos disponíveis nos agentes de IA (Claude Code e Codex) prontos para uso.

**FRs cobertos por esta iniciativa:** FR6, FR8, FR40, FR41, FR45, FR46, FR47, FR48, FR49

### Story 1.3: Sistema injeta CodeMaster no Claude Code e cria skills reutilizáveis

Como developer (Ricardo),
quero os 5 momentos do CodeMaster disponíveis no Claude Code imediatamente após o setup — como skills do projeto (`.agents/skills/`) e com sugestão proativa no CLAUDE.md —
para que eu use /codemaster:quest, :relic, :victory, :legend e :knowledge sem configuração manual e sem duplicação de lógica por ferramenta.

**Acceptance Criteria:**

**Dado** que `~/.claude/` existe (Claude Code instalado)
**Quando** setup conclui
**Então** agentes são copiados para `~/.codemaster/agents/` (quest, relic, victory, legend, knowledge)
**E** `~/.claude/commands/codemaster/` é criado com 5 thin wrappers que carregam de `~/.codemaster/agents/`
**E** `~/.claude/CLAUDE.md` recebe o bloco CodeMaster com instrução de sugestão proativa

**Dado** que developer usa `/codemaster:quest` no Claude Code
**Quando** o wrapper é carregado
**Então** Claude Code lê e segue `~/.codemaster/agents/quest.md` com a lógica completa do momento

**Dado** que setup executa novamente (reinstalação)
**Quando** `~/.codemaster/agents/`, `~/.claude/commands/codemaster/` e bloco no CLAUDE.md já existem
**Então** tudo é sobrescrito sem duplicar (idempotente)

**Dado** que `~/.claude/` não existe
**Quando** setup chega na etapa de injeção no Claude Code
**Então** etapa é pulada com mensagem informando dev que Claude Code não foi detectado

**Dado** que Codex está instalado
**Quando** setup conclui
**Então** bloco em `~/.codex/instructions.md` instrui Codex a carregar `~/.codemaster/agents/{momento}.md`
**E** Codex usa os mesmos agentes globais que Claude Code — sem arquivos duplicados

---

## Epic 2: Ciclo de Aprendizado — Dev completa quest → relic → victory

Dev pode iniciar uma missão, capturar descobertas durante a execução e encerrar com reflexão estruturada — gerando tendências por dimensão e memória persistida no Obsidian Vault.

**FRs cobertos:** FR10, FR11, FR12, FR14, FR15, FR16, FR19, FR20, FR21, FR22, FR23, FR44

### Story 2.1: Dev inicia Quest com reflexão guiada e nota criada no Obsidian

Como developer (Ricardo),
quero usar /codemaster:quest para iniciar uma missão com perguntas de reflexão,
para que eu pense conscientemente nas dimensões de negócio, arquitetura e IA antes de codar.

**Acceptance Criteria:**

**Dado** que dev está no Claude Code com slash commands instalados
**Quando** dev usa `/codemaster:quest "Implementar autenticação JWT"`
**Então** agente faz a pergunta âncora: "Descreva o problema ou tarefa em uma frase — o que você vai resolver?"
**E** agente usa a âncora para gerar 3 perguntas contextuais (uma por dimensão: Negócio, Arquitetura, IA) — mesma essência, forma adaptada ao contexto
**E** quando dev responde de forma genérica ou muito curta, agente pede um nível a mais de detalhe sem entregar a resposta

**Quando** todas as perguntas são respondidas
**Então** nota `Q{id}-{slug}.md` é criada em `vault/quests/` com frontmatter YAML (id, type: quest, title, date, milestone, tags, relics: [])
**E** `active-quest.json` é escrito com `{id, title, slug, notePath, startedAt, milestone}`

**Dado** que `active-quest.json` já existe
**Quando** dev tenta iniciar outra Quest
**Então** agente notifica que há uma Quest ativa e pergunta se dev quer abandoná-la ou continuar a atual

### Story 2.2: Dev registra Relic durante Quest ativa

Como developer (Ricardo),
quero usar /codemaster:relic para capturar descobertas importantes durante uma quest,
para que insights arquiteturais, negociais e de orquestração de IA sejam preservados e organizados.

**Acceptance Criteria:**

**Dado** que uma Quest está ativa (active-quest.json existe)
**Quando** dev usa `/codemaster:relic "descoberta sobre stateless sessions"`
**Então** agente lê active-quest.json para contextualizar
**E** agente pede ao dev que classifique a descoberta: arquitetural, negocial ou orquestração de IA
**E** Relic é appendada na nota da quest ativa com timestamp e dimensão identificada
**E** frontmatter da nota da quest tem o array `relics[]` atualizado com o ID da relic

**Quando** dev indica que a descoberta é relevante além da quest atual
**Então** Relic também é arquivada como `R{id}-{slug}.md` em `vault/relics/`

**Dado** que nenhuma Quest está ativa
**Quando** dev usa `/codemaster:relic`
**Então** agente notifica que não há quest ativa e sugere iniciar uma com /codemaster:quest

### Story 2.3: Dev encerra Quest com Victory e reflexão avaliada

Como developer (Ricardo),
quero usar /codemaster:victory para encerrar uma quest com reflexão estruturada,
para que meu aprendizado seja avaliado nas 3 dimensões e persistido no histórico de evolução.

**Acceptance Criteria:**

**Dado** que uma Quest está ativa
**Quando** dev usa `/codemaster:victory`
**Então** agente lê active-quest.json e commits recentes via `git log --oneline HEAD~20` (skip gracioso se não for repo git)
**E** agente apresenta 5 perguntas contextuais cobrindo: impacto de negócio, decisão arquitetural, orquestração de IA, novo aprendizado e reflexão crítica
**E** commits são usados para enriquecer o contexto das perguntas quando disponíveis
**E** quando dev responde sem conectar à decisão de negócio ou arquitetura, agente pede um nível a mais de profundidade sem concluir pelo dev

**Quando** todas as respostas são dadas
**Então** agente analisa as 5 respostas holisticamente e atribui score 0.0–10.0 para cada dimensão
**E** tendência é calculada: ↑ se ≥7.0, → se 4.0–6.9, ↓ se <4.0 por dimensão
**E** seção `## Victory` é appendada na nota da quest com respostas, scores e timestamp
**E** PROGRESS.md é atualizado com `[[Q{id}-{slug}]]` wikilink e scores (N:↑8.0 A:→5.5 IA:→6.0)
**E** `active-quest.json` é deletado após Victory concluída

**Dado** que nenhuma Quest está ativa
**Quando** dev usa `/codemaster:victory`
**Então** agente notifica que não há quest ativa e orienta a iniciar uma

---

## Epic 3: Evolução Visível — Dev vê seu progresso e gaps

Dev pode visualizar o histórico completo de evolução nas 3 dimensões (Legend) e solicitar diagnóstico dos conhecimentos que faltam para o próximo nível (Knowledge) — transformando dados acumulados em direção.

**FRs cobertos:** FR33, FR34, FR35, FR36, FR37, FR38, FR39

### Story 3.1: Dev visualiza histórico de evolução via Legend

Como developer (Ricardo),
quero usar /codemaster:legend para ver meu histórico completo de evolução,
para que eu reconheça meu crescimento nas 3 dimensões e saiba onde focar a seguir.

**Acceptance Criteria:**

**Dado** que PROGRESS.md e vault existem com ao menos uma victory
**Quando** dev usa `/codemaster:legend`
**Então** agente lê PROGRESS.md e notas das quests
**E** exibe tendências atuais por dimensão (Negócio, Arquitetura, IA) com indicadores ↑→↓
**E** exibe victories agrupadas por milestone com `[[wikilinks]]` para cada quest
**E** destaca os scores da última victory
**E** exibe a relic de maior score do milestone atual
**E** sugere a dimensão de menor tendência como foco para o próximo milestone

**Dado** que nenhuma victory existe ainda
**Quando** dev usa `/codemaster:legend`
**Então** agente exibe mensagem encorajadora e orienta dev a iniciar a primeira quest

### Story 3.2: Dev solicita diagnóstico de gaps via Knowledge

Como developer (Ricardo),
quero usar /codemaster:knowledge para obter um diagnóstico do que estou deixando de aprender,
para que eu saiba exatamente o que estudar para atingir o próximo nível profissional.

**Acceptance Criteria:**

**Dado** que vault tem ao menos 3 victories
**Quando** dev usa `/codemaster:knowledge`
**Então** agente informa dev que a análise do vault está em andamento (especialmente para vaults grandes)
**E** agente lê todas as notas de quest, seções de victory e relics do vault
**E** extrai padrões e gaps por dimensão

**Quando** análise conclui
**Então** KNOWLEDGE-MAP.md é criado ou atualizado com: gaps listados por dimensão (Negócio/Arquitetura/IA), status (Para Estudar / Estudado / Praticado), score médio e `[[wikilinks]]` para as quests de origem
**E** agente apresenta os 3 gaps prioritários para o próximo nível com justificativa baseada nos dados

**Dado** que vault tem menos de 3 victories
**Quando** dev usa `/codemaster:knowledge`
**Então** agente explica que mais victories são necessárias para análise significativa e exibe estado parcial disponível
