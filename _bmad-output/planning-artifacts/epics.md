---
stepsCompleted: ["step-01-validate-prerequisites", "step-02-design-epics", "step-03-create-stories"]
inputDocuments: [
  "_bmad-output/planning-artifacts/prd.md",
  "_bmad-output/planning-artifacts/architecture.md"
]
---

# codemaster - Epic Breakdown

## Overview

Este documento fornece o breakdown completo de épicos e histórias do CodeMaster, decompondo os requisitos do PRD e da Arquitetura em histórias implementáveis.

## Requirements Inventory

### Functional Requirements

FR1: Dev pode instalar o CodeMaster globalmente via npm em qualquer sistema com Node.js 18+
FR2: Dev pode executar o setup como um onboarding guiado que apresenta de forma resumida o método CodeMaster (os 5 momentos, as 3 dimensões e o objetivo) antes de coletar configurações
FR3: Dev pode configurar identidade, nível inicial nas 3 dimensões, foco de evolução, path do Obsidian Vault e agentes instalados durante o setup
FR4: Sistema pode informar sobre a comunidade CodeMaster durante o setup com opção de se inscrever imediatamente ou pular para inscrição posterior
FR5: Dev pode reconfigurar o sistema com valores pré-preenchidos da configuração anterior
FR6: Sistema pode detectar se Claude Code está instalado e injetar instruções no CLAUDE.md
FR7: Sistema pode detectar se Codex está instalado e injetar comandos como skills no Codex
FR8: Sistema pode detectar injeção prévia e substituí-la sem duplicar conteúdo
FR9: Dev pode visualizar confirmação de cada etapa do setup com o resultado da ação executada
FR10: Dev pode iniciar uma Quest com título, ativando 3 perguntas de reflexão inicial guiadas pelo agente
FR11: Durante a Quest, quando o dev responde uma das 3 perguntas de reflexão inicial de forma rasa, o agente pode pedir um nível a mais de detalhe sobre aquele contexto específico — sem entregar a resposta pelo dev
FR12: Sistema pode criar nota estruturada no Obsidian Vault com contexto da Quest e respostas do dev
FR13: Sistema pode registrar a Quest ativa em ~/.codemaster/active-quest.json com título, path da nota e timestamp
FR14: Dev pode registrar uma descoberta (Relic) durante uma Quest ativa, classificando-a como arquitetural, negocial ou orquestração de IA
FR15: Sistema pode arquivar a Relic na nota da Quest ativa com timestamp e dimensão identificada
FR16: Sistema pode arquivar a Relic também em /relics/ quando for relevante além da quest atual
FR17: Sistema pode ler a Quest ativa ao início de qualquer comando para contextualizar a sessão
FR18: Sistema pode orientar o dev a criar uma Quest quando nenhuma está ativa e um comando dependente é chamado
FR19: Dev pode encerrar uma Quest ativa via Victory, ativando 5 perguntas de reflexão final guiadas pelo agente
FR20: Durante o Victory, quando o dev responde uma das 5 perguntas de reflexão final de forma rasa, o agente pode pedir um nível a mais de profundidade — sem interpretar ou concluir pelo dev
FR21: Sistema pode avaliar as respostas do Victory e atribuir tendências (↑ → ↓) para cada uma das 3 dimensões
FR22: Sistema pode registrar a Victory com respostas, tendências e timestamp na nota da Quest
FR23: Sistema pode atualizar o PROGRESS.md com a nova Victory e tendências acumuladas
FR24: Sistema pode limpar o active-quest.json após Victory concluída
FR25: Sistema pode detectar a 3ª Victory do usuário e exibir convite para opt-in na comunidade
FR26: Dev pode optar por participar da comunidade informando email e telefone durante o fluxo de Victory
FR27: Sistema pode enviar email e telefone para API externa de registro da comunidade com confirmação
FR28: Sistema pode registrar o resultado do opt-in no config sem bloquear o fluxo se recusado
FR29: Sistema pode detectar a conclusão da 5ª Victory de um milestone e avançar automaticamente para o próximo
FR30: Sistema pode criar milestone-X-summary.md com resumo de evolução, padrões emergentes nas 3 dimensões e maior relíquia do período
FR31: Sistema pode consolidar o aprendizado ao final de cada milestone — organizando arquivos em subpastas de histórico (milestone-X/) e atualizando o KNOWLEDGE-MAP.md com os gaps identificados no período
FR32: Agente pode orientar o dev a estudar os gaps encontrados ao encerrar um milestone, com base nas tendências e relíquias do período
FR33: Dev pode visualizar o histórico completo de evolução — missões, relíquias, vitórias e tendências por dimensão
FR34: Sistema pode exibir tendências acumuladas nas 3 dimensões com destaque para a última vitória e milestones concluídos
FR35: Sistema pode exibir a maior relíquia do período e sugerir o foco para o próximo milestone
FR36: Dev pode solicitar diagnóstico de gaps baseado no histórico acumulado do vault
FR37: Sistema pode ler quests, victories e relics do vault para extrair padrões de aprendizado por dimensão
FR38: Sistema pode gerar ou atualizar o KNOWLEDGE-MAP.md de forma clara, simples e navegável, com status por área e prioridade baseada em gaps reais
FR39: Sistema pode gerar orientação sobre os conhecimentos que faltam para o próximo nível com base no KNOWLEDGE-MAP.md atualizado
FR40: Agente de IA (Claude Code) pode sugerir proativamente o uso do quest quando o dev inicia uma tarefa sem Quest ativa (hipótese — a validar na semana 1)
FR41: Dev pode usar os 5 slash commands do CodeMaster em qualquer projeto aberto no Claude Code após o setup
FR42: Dev pode usar os 5 momentos do CodeMaster como skills no Codex após o setup
FR43: Sistema pode criar e manter estrutura de pastas por milestones no Obsidian Vault
FR44: Sistema pode gerar frontmatter estruturado em todos os arquivos de Quest e Victory para consultas Dataview
FR45: Sistema pode manter config.json atualizado com todas as preferências e estado do dev
FR46: Sistema pode detectar e validar o path do Obsidian Vault durante o setup e em cada operação
FR47: Dev pode acessar exemplos de uso via helper que demonstra um ciclo completo (quest + relic + victory) com respostas de exemplo
FR48: Dev pode visualizar exemplo dos arquivos gerados ao final de um milestone completo — incluindo estrutura de pastas, notas de quest/victory/relic, milestone-summary e KNOWLEDGE-MAP.md
FR49: Dev pode consultar referência de comandos e configuração via README do pacote

### NonFunctional Requirements

NFR1: O codemaster setup deve ser concluído em menos de 5 minutos do início ao fim em condições normais de filesystem
NFR2: Operações de leitura e escrita no Obsidian Vault devem ser concluídas em menos de 3 segundos em filesystems locais padrão
NFR3: Leitura do active-quest.json no início de cada comando deve ser imperceptível (<100ms) para não interromper o fluxo do agente
NFR4: O comando /codemaster:knowledge pode levar mais de 3 segundos quando o vault é grande — o agente deve informar ao dev que o processamento está em andamento
NFR5: A coleta de email e telefone para opt-in da comunidade deve ocorrer somente após consentimento explícito do dev — nunca automaticamente
NFR6: O envio de dados para a API da comunidade deve usar HTTPS obrigatoriamente — requisições HTTP simples devem ser rejeitadas
NFR7: O config.json e active-quest.json armazenam dados em texto plano — o sistema não deve armazenar credenciais, tokens ou dados sensíveis nesses arquivos
NFR8: A injeção no CLAUDE.md e instructions.md deve ser append-only com identificação clara do bloco — o sistema nunca deve sobrescrever conteúdo preexistente do usuário fora do bloco CodeMaster identificado
NFR9: O sistema não deve fazer chamadas de rede além do opt-in da comunidade — o ciclo de aprendizado deve funcionar 100% offline
NFR10: A integração com o Obsidian Vault deve funcionar via filesystem puro — sem dependência de plugins, APIs ou processos do Obsidian em execução
NFR11: A integração com Claude Code deve funcionar com qualquer versão que suporte o formato de slash commands em ~/.claude/commands/
NFR12: A integração com Codex deve funcionar via skills no formato suportado pela versão atual do Codex CLI
NFR13: A API da comunidade deve retornar resposta em menos de 10 segundos — timeout deve ser tratado graciosamente sem falhar o fluxo de Victory
NFR14: O sistema deve funcionar nos principais sistemas operacionais onde Node.js 18+ é suportado (macOS, Linux, Windows com WSL)

### Additional Requirements

- **Starter template:** Inicializar projeto com commander.js + @inquirer/prompts + chalk + vitest — Node.js 18+ ESM puro, sem build step. Primeira história de implementação.
- **Modelo agent-first:** Os 5 momentos (Quest, Relic, Victory, Legend, Knowledge) são slash commands que vivem dentro dos agentes. `codemaster setup` é o único comando CLI real. src/moments/ contém lógica de suporte invocável via bash a partir dos templates.
- **Nomenclatura com tracking codes:** Q{id}-{slug}.md, R{id}-{slug}.md, M{id}-summary.md — sem data no nome, data no conteúdo/frontmatter.
- **PROGRESS.md enxuto com wikilinks Obsidian:** formato com scores por dimensão (N:↑8.0 A:→5.0 IA:→6.0) e [[wikilinks]] para cada quest.
- **Injeção idempotente via regex:** bloco delimitado por `<!-- CodeMaster v{version} — início -->` / `<!-- CodeMaster v{version} — fim -->`. Substituir se existente, append se novo.
- **Fronteiras de acesso único:** config.json via services/config.js, vault via services/vault.js, active-quest.json via services/state.js, injeção via services/injector.js, HTTP via services/community.js, git via services/git.js.
- **KNOWLEDGE-MAP.md:** schema fixo com seções por dimensão (Negócio, Arquitetura, IA), status (Para Estudar / Estudado / Praticado) e wikilinks para quests de origem.
- **Scoring Victory:** scores 0.0–10 por dimensão, análise holística das 5 respostas, tendência ↑ se ≥7.0 / → se 4.0–6.9 / ↓ se <4.0.
- **Git integration:** getRecentCommits via child_process.execSync com graceful fallback (return null se não for repo git).
- **Exemplo de milestone completo:** templates/obsidian-example/ com Q001, R001, M01-summary.md e KNOWLEDGE-MAP.md para onboarding.

### UX Design Requirements

N/A — Decisões de UX (fluxos de interação, perguntas dos momentos, formato de output) foram incorporadas diretamente no Architecture Document, seção "Interaction Design (UX no CLI)".

### FR Coverage Map

FR1: Epic 1 — Instalação global via npm
FR2: Epic 1 — Onboarding guiado com apresentação do método
FR3: Epic 1 — Configuração de identidade, dimensões, vault, agentes
FR4: Epic 1 — Informar sobre comunidade no setup
FR5: Epic 1 — Reconfiguração com valores pré-preenchidos
FR6: Epic 1 — Detectar Claude Code + injetar CLAUDE.md
FR7: Epic 1 — Detectar Codex + injetar skills
FR8: Epic 1 — Idempotência na injeção
FR9: Epic 1 — Confirmação de cada etapa do setup
FR10: Epic 2 — Iniciar Quest com pergunta âncora + 3 perguntas dinâmicas
FR11: Epic 2 — Aprofundar resposta rasa no Quest
FR12: Epic 2 — Criar nota estruturada no Obsidian Vault
FR13: Epic 2 — Registrar active-quest.json
FR14: Epic 2 — Registrar Relic com classificação por dimensão
FR15: Epic 2 — Arquivar Relic na nota da Quest
FR16: Epic 2 — Arquivar Relic em /relics/ quando relevante
FR17: Epic 2 — Ler Quest ativa no início de cada comando
FR18: Epic 2 — Orientar quando nenhuma Quest está ativa
FR19: Epic 2 — Iniciar Victory com 5 perguntas contextualizadas
FR20: Epic 2 — Aprofundar resposta rasa no Victory
FR21: Epic 2 — Avaliar respostas → tendências por dimensão (scoring 0–10)
FR22: Epic 2 — Registrar Victory na nota da Quest
FR23: Epic 2 — Atualizar PROGRESS.md com wikilinks e scores
FR24: Epic 2 — Limpar active-quest.json após Victory
FR25: Epic 5 — Detectar 3ª Victory e exibir convite da comunidade
FR26: Epic 5 — Opt-in com email e telefone
FR27: Epic 5 — Enviar para API externa via HTTPS
FR28: Epic 5 — Registrar resultado sem bloquear fluxo
FR29: Epic 4 — Detectar 5ª Victory e avançar milestone
FR30: Epic 4 — Criar milestone-X-summary.md
FR31: Epic 4 — Consolidar aprendizado — subpastas + KNOWLEDGE-MAP.md
FR32: Epic 4 — Orientar dev a estudar gaps ao encerrar milestone
FR33: Epic 3 — Legend — histórico de evolução completo
FR34: Epic 3 — Tendências acumuladas com destaque por milestone
FR35: Epic 3 — Maior relíquia + sugestão para próximo milestone
FR36: Epic 3 — Knowledge — solicitar diagnóstico de gaps
FR37: Epic 3 — Ler vault para extrair padrões por dimensão
FR38: Epic 3 — Gerar/atualizar KNOWLEDGE-MAP.md
FR39: Epic 3 — Orientação sobre conhecimentos faltantes
FR40: Epic 1 — Sugestão proativa no CLAUDE.md (hipótese)
FR41: Epic 1 — 5 slash commands disponíveis no Claude Code após setup
FR42: Epic 1 — 5 momentos disponíveis como skills no Codex após setup
FR43: Epic 1 — Criar estrutura de pastas por milestones no vault
FR44: Epic 2 — Gerar frontmatter estruturado para Dataview
FR45: Epic 1 — Manter config.json atualizado
FR46: Epic 1 — Detectar e validar path do Obsidian Vault
FR47: Epic 6 — Helper de exemplos — ciclo completo demonstrado
FR48: Epic 6 — Exemplo de milestone completo nos templates
FR49: Epic 6 — README com referência de comandos

## Epic List

### Epic 1: Fundação — Dev instala e está pronto para usar
Dev pode instalar o CodeMaster, completar o onboarding guiado, configurar seu perfil e ter os 5 momentos disponíveis nos agentes de IA (Claude Code e Codex) prontos para uso.
**FRs cobertos:** FR1, FR2, FR3, FR4, FR5, FR6, FR7, FR8, FR9, FR40, FR41, FR42, FR43, FR45, FR46

### Epic 2: Ciclo de Aprendizado — Dev completa quest → relic → victory
Dev pode iniciar uma missão, capturar descobertas durante a execução e encerrar com reflexão estruturada — gerando tendências por dimensão e memória persistida no Obsidian Vault.
**FRs cobertos:** FR10, FR11, FR12, FR13, FR14, FR15, FR16, FR17, FR18, FR19, FR20, FR21, FR22, FR23, FR24, FR44

### Epic 3: Evolução Visível — Dev vê seu progresso e gaps
Dev pode visualizar o histórico completo de evolução nas 3 dimensões (Legend) e solicitar diagnóstico dos conhecimentos que faltam para o próximo nível (Knowledge) — transformando dados acumulados em direção.
**FRs cobertos:** FR33, FR34, FR35, FR36, FR37, FR38, FR39

### Epic 4: Progressão por Milestone — Dev avança e consolida aprendizado
Ao completar a 5ª Victory, o sistema detecta o milestone, consolida o aprendizado, organiza o histórico e orienta o dev sobre os gaps a estudar — encerrando um ciclo e abrindo o próximo.
**FRs cobertos:** FR29, FR30, FR31, FR32

### Epic 5: Comunidade — Dev se conecta e se compromete
Na 3ª Victory, dev recebe convite para a comunidade CodeMaster. O opt-in com email e telefone registra o membro na API externa — transformando o custo de tokens em pertencimento.
**FRs cobertos:** FR25, FR26, FR27, FR28

### Epic 6: Documentação e Exemplos — Dev entende o resultado esperado
Dev pode explorar exemplos completos de uso (ciclo quest→relic→victory e milestone completo), acessando o README e o helper de exemplos para entender claramente o que o sistema produz.
**FRs cobertos:** FR47, FR48, FR49

## Epic 1: Fundação — Dev instala e está pronto para usar

Dev pode instalar o CodeMaster, completar o onboarding guiado, configurar seu perfil e ter os 5 momentos disponíveis nos agentes de IA (Claude Code e Codex) prontos para uso.

### Story 1.1: Inicializar Projeto com Stack Selecionada

Como developer implementando o CodeMaster,
quero o projeto inicializado com a stack correta e estrutura de diretórios,
para que todas as histórias seguintes tenham uma fundação consistente e executável.

**Acceptance Criteria:**

**Dado** que Node.js 18+ está instalado
**Quando** developer executa `npm install -g codemaster`
**Então** pacote é instalado globalmente e comando `codemaster` fica disponível em qualquer diretório

**Dado** que o projeto está sendo desenvolvido localmente
**Quando** developer executa `npm install` no diretório do projeto
**Então** commander, @inquirer/prompts e chalk são instalados; vitest como devDependency
**E** package.json tem `"type": "module"`, `"name": "codemaster"`, `"bin": {"codemaster": "./bin/codemaster.js"}` e scripts `start`, `test`, `test:watch`, `link`

**Dado** que o projeto está inicializado localmente
**Quando** developer executa `npm link`
**Então** comando `codemaster` resolve para o projeto local para desenvolvimento

**E** estrutura de diretórios existe: `bin/`, `src/commands/`, `src/moments/`, `src/services/`, `src/utils/`, `templates/claude-commands/`, `templates/obsidian-example/`

### Story 1.2: Dev executa codemaster setup e completa onboarding

Como developer (Ricardo),
quero executar `codemaster setup` e ser guiado pelo método CodeMaster,
para que eu entenda o sistema e tenha meu perfil configurado.

**Acceptance Criteria:**

**Dado** que CodeMaster está instalado globalmente ou via npm link
**Quando** dev executa `codemaster setup`
**Então** wizard inicia apresentando brevemente os 5 momentos e as 3 dimensões antes de coletar configurações
**E** wizard coleta: nome de herói, nível (junior/pleno/senior), stack, anos de experiência, auto-avaliação nas 3 dimensões (1–5), foco de evolução, vault_path e agentes instalados
**E** informação sobre a comunidade é exibida com opção de inscrever agora ou pular
**E** cada etapa exibe confirmação da ação executada
**E** `~/.codemaster/config.json` é criado com todos os valores configurados

**Dado** que `config.json` já existe
**Quando** dev executa `codemaster setup` novamente
**Então** wizard pré-preenche com os valores existentes (modo de reconfiguração)
**E** dados do vault do Obsidian não são afetados

### Story 1.3: Sistema injeta CodeMaster no Claude Code

Como developer (Ricardo),
quero os slash commands do CodeMaster disponíveis no Claude Code imediatamente após o setup,
para que possa usar /codemaster:quest, :relic, :victory, :legend e :knowledge sem configuração manual.

**Acceptance Criteria:**

**Dado** que `~/.claude/` existe (Claude Code instalado)
**Quando** setup conclui a etapa de injeção no Claude Code
**Então** diretório `~/.claude/commands/codemaster/` é criado
**E** quest.md, relic.md, victory.md, legend.md e knowledge.md são copiados para esse diretório
**E** `~/.claude/CLAUDE.md` recebe o bloco CodeMaster ao final, identificado por `<!-- CodeMaster v{version} — início -->`
**E** o bloco inclui instrução de sugestão proativa (hipótese)

**Dado** que o bloco CodeMaster já existe no CLAUDE.md
**Quando** setup executa novamente
**Então** bloco existente é substituído, não duplicado (idempotente)

**Dado** que `~/.claude/` não existe
**Quando** setup chega na etapa de injeção no Claude Code
**Então** etapa é pulada com mensagem informando dev que Claude Code não foi detectado

### Story 1.4: Sistema injeta CodeMaster no Codex

Como developer,
quero os momentos do CodeMaster disponíveis como skills no Codex após o setup,
para que possa usar os 5 momentos diretamente no Codex CLI.

**Acceptance Criteria:**

**Dado** que `~/.codex/` existe (Codex instalado)
**Quando** setup conclui a etapa de injeção no Codex
**Então** bloco de skills CodeMaster é appendado em `~/.codex/instructions.md`
**E** bloco é identificado por `<!-- CodeMaster v{version} — início -->`

**Dado** que o bloco CodeMaster já existe em instructions.md
**Quando** setup executa novamente
**Então** bloco existente é substituído, não duplicado (idempotente)

**Dado** que `~/.codex/` não existe
**Quando** setup chega na etapa de injeção no Codex
**Então** etapa é pulada com mensagem informando dev que Codex não foi detectado

### Story 1.5: Sistema inicializa e valida Obsidian Vault

Como developer (Ricardo),
quero meu Obsidian vault inicializado com a estrutura CodeMaster durante o setup,
para que quests, relics e victories tenham um lugar imediatamente após a instalação.

**Acceptance Criteria:**

**Dado** que vault_path foi configurado no setup
**Quando** setup valida e inicializa o vault
**Então** subdiretórios `quests/` e `relics/` existem dentro do vault_path
**E** PROGRESS.md é criado se não existir, com estrutura inicial (seções Dimensões Atuais + Milestone 1)
**E** KNOWLEDGE-MAP.md esqueleto é criado se não existir (com seções para Negócio, Arquitetura, IA)

**Dado** que vault_path não existe ou não é acessível
**Quando** setup tenta inicializar o vault
**Então** erro é exibido com mensagem clara e dev é orientado a reinserir um path válido

**Dado** que estrutura do vault já existe
**Quando** setup executa novamente
**Então** arquivos e notas existentes não são sobrescritos (idempotente)

## Epic 2: Ciclo de Aprendizado — Dev completa quest → relic → victory

Dev pode iniciar uma missão, capturar descobertas durante a execução e encerrar com reflexão estruturada — gerando tendências por dimensão e memória persistida no Obsidian Vault.

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

## Epic 3: Evolução Visível — Dev vê seu progresso e gaps

Dev pode visualizar o histórico completo de evolução nas 3 dimensões (Legend) e solicitar diagnóstico dos conhecimentos que faltam para o próximo nível (Knowledge) — transformando dados acumulados em direção.

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

## Epic 4: Progressão por Milestone — Dev avança e consolida aprendizado

Ao completar a 5ª Victory, o sistema detecta o milestone, consolida o aprendizado, organiza o histórico e orienta o dev sobre os gaps a estudar — encerrando um ciclo e abrindo o próximo.

### Story 4.1: Sistema detecta milestone e cria summary automaticamente

Como developer (Ricardo),
quero que o sistema detecte minha 5ª victory automaticamente e crie um resumo do milestone,
para que meu progresso seja marcado e preservado como artefato histórico.

**Acceptance Criteria:**

**Dado** que dev completa uma victory que é a 5ª do milestone atual
**Quando** fluxo de Victory finaliza
**Então** sistema detecta conclusão do milestone
**E** `M{id}-summary.md` é criado no vault com: título, intervalo de datas, wikilinks para as 5 quests do período, médias de score por dimensão, relic de maior score do período e padrões emergentes identificados pelo agente
**E** PROGRESS.md é atualizado para marcar Milestone {n} como completo e abre o Milestone {n+1}
**E** agente parabeniza dev pela conclusão do milestone com destaque para a dimensão de maior evolução

### Story 4.2: Sistema consolida aprendizado e orienta próximos estudos

Como developer (Ricardo),
quero que meu vault seja organizado em pastas de histórico por milestone e meu knowledge map atualizado,
para que meu aprendizado seja consolidado e eu tenha direção clara de estudo para o próximo ciclo.

**Acceptance Criteria:**

**Dado** que milestone summary foi criado (Story 4.1)
**Quando** consolidação do milestone executa
**Então** arquivos de quest, relic e victory do milestone concluído são movidos para `vault/milestone-{id}/` como histórico
**E** KNOWLEDGE-MAP.md é atualizado com gaps identificados durante o período do milestone
**E** pastas `quests/` e `relics/` na raiz ficam limpas para o próximo milestone
**E** agente apresenta os 3 gaps mais críticos do milestone com sugestões concretas de estudo para cada um
**E** agente orienta sobre o foco recomendado para o próximo milestone com base na dimensão de menor tendência

## Epic 5: Comunidade — Dev se conecta e se compromete

Na 3ª Victory, dev recebe convite para a comunidade CodeMaster. O opt-in com email e telefone registra o membro na API externa — transformando o custo de tokens em pertencimento.

### Story 5.1: Sistema exibe convite da comunidade após 3ª Victory

Como developer (Ricardo),
quero receber um convite para a comunidade CodeMaster após minha 3ª victory,
para que eu possa me conectar com outros devs na mesma jornada e sentir que faço parte de algo maior.

**Acceptance Criteria:**

**Dado** que dev acabou de completar exatamente sua 3ª victory total
**Quando** fluxo de Victory finaliza
**Então** agente exibe mensagem de convite após confirmação da victory: "Você completou sua 3ª Victory. Quer fazer parte da comunidade CodeMaster e conectar com outros devs na mesma jornada?"
**E** mensagem informa claramente: "Seus dados não serão tornados públicos e serão usados apenas para comunicação da comunidade CodeMaster"
**E** dev pode escolher: participar agora ou pular para depois

**Dado** que dev já fez opt-in ou recusou explicitamente em sessão anterior
**Quando** victories seguintes completam
**Então** convite não é exibido novamente

### Story 5.2: Dev realiza opt-in e dados são registrados na API

Como developer (Ricardo),
quero fornecer meu email e telefone para participar da comunidade,
para que eu seja registrado como membro e tenha acesso ao canal de comunicação da comunidade CodeMaster.

**Acceptance Criteria:**

**Dado** que dev escolheu participar da comunidade (Story 5.1)
**Quando** dev fornece email e telefone válidos
**Então** dados são enviados via HTTPS POST para a API da comunidade com payload `{email, phone, heroName, stack, version}`
**E** requisição tem timeout de 10 segundos
**E** em caso de sucesso: `config.json` é atualizado com `community: {opted_in: true, email, phone}`
**E** agente confirma o registro com mensagem de boas-vindas à comunidade

**Dado** que a requisição expira ou falha por erro de rede
**Quando** timeout ou erro ocorre
**Então** fluxo de Victory continua sem bloqueio (victory já foi salva)
**E** `config.json` é atualizado com `community: {opted_in: false, community_error: true}`
**E** dev é informado que o registro falhou mas pode tentar novamente depois

**Dado** que dev escolhe pular o opt-in
**Quando** dev recusa o convite
**Então** `config.json` é atualizado com `community: {opted_in: false}`
**E** fluxo continua normalmente sem bloqueio

## Epic 6: Documentação e Exemplos — Dev entende o resultado esperado

Dev pode explorar exemplos completos de uso (ciclo quest→relic→victory e milestone completo), acessando o README e o helper de exemplos para entender claramente o que o sistema produz.

### Story 6.1: Exemplo de milestone completo disponível nos templates

Como developer fazendo onboarding com o CodeMaster,
quero ver um exemplo completo do que o sistema produz após um milestone,
para que eu entenda claramente o resultado esperado antes de começar a usar.

**Acceptance Criteria:**

**Dado** que developer acessa `templates/obsidian-example/`
**Quando** examina os arquivos de exemplo
**Então** diretório contém:
- `quests/Q001-exemplo-quest.md` — com frontmatter correto, pergunta âncora, 3 reflexões por dimensão e seção `## Victory` com scores
- `relics/R001-exemplo-relic.md` — com frontmatter, dimensão classificada e conteúdo realista
- `M01-summary.md` — com wikilinks para as quests, médias de score e padrões emergentes
- `KNOWLEDGE-MAP.md` — com schema completo: gaps por dimensão, status (Para Estudar/Estudado/Praticado) e wikilinks de origem

**E** todos os arquivos usam o frontmatter correto (id, type, title, date, milestone, tags)
**E** os exemplos são incluídos no pacote npm (não listados no `.npmignore`)

### Story 6.2: README e helper de exemplos documentam o sistema

Como developer (Ricardo),
quero um README claro e acesso a exemplos de uso,
para que eu entenda rapidamente como instalar, configurar e usar todos os momentos do CodeMaster.

**Acceptance Criteria:**

**Dado** que developer acessa o pacote npm ou repositório
**Quando** lê o README.md
**Então** README contém: comando de instalação (`npm install -g codemaster`), uso do `codemaster setup`, descrição dos 5 slash commands com exemplos de uso, referência do schema do `config.json` e link para `templates/obsidian-example/`

**Dado** que developer quer ver uma demonstração do ciclo completo
**Quando** acessa o helper de exemplos (documentado no README)
**Então** walkthrough de quest → relic → victory está disponível com respostas de exemplo realistas que demonstram qualidade de reflexão nas 3 dimensões
