---
initiative: IN001
domain: cli
status: active
inputDocuments: ["_bmad-output/planning-artifacts/epics.md"]
---

# Epics — IN001 CLI

## Epic 1: Fundação — Dev instala e está pronto para usar (Stories: 1.1, 1.2, 1.3)

Dev pode instalar o CodeMaster, completar o onboarding guiado, configurar seu perfil e ter os 5 momentos disponíveis nos agentes de IA (Claude Code e Codex) prontos para uso.

**FRs cobertos por esta iniciativa:** FR1, FR2, FR3, FR4, FR5, FR9, FR43, FR45, FR46

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

### Story 1.3: Sistema inicializa e valida Obsidian Vault

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

---

## Epic 2: Progressão por Milestone — Dev avança e consolida aprendizado

Ao completar a 5ª Victory, o sistema detecta o milestone, consolida o aprendizado, organiza o histórico e orienta o dev sobre os gaps a estudar — encerrando um ciclo e abrindo o próximo.

**FRs cobertos:** FR29, FR30, FR31, FR32

### Story 2.1: Sistema detecta milestone e cria summary automaticamente

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

### Story 2.2: Sistema consolida aprendizado e orienta próximos estudos

Como developer (Ricardo),
quero que meu vault seja organizado em pastas de histórico por milestone e meu knowledge map atualizado,
para que meu aprendizado seja consolidado e eu tenha direção clara de estudo para o próximo ciclo.

**Acceptance Criteria:**

**Dado** que milestone summary foi criado (Story 2.1)
**Quando** consolidação do milestone executa
**Então** arquivos de quest, relic e victory do milestone concluído são movidos para `vault/milestone-{id}/` como histórico
**E** KNOWLEDGE-MAP.md é atualizado com gaps identificados durante o período do milestone
**E** pastas `quests/` e `relics/` na raiz ficam limpas para o próximo milestone
**E** agente apresenta os 3 gaps mais críticos do milestone com sugestões concretas de estudo para cada um
**E** agente orienta sobre o foco recomendado para o próximo milestone com base na dimensão de menor tendência

---

## Epic 3: Comunidade — Dev se conecta e se compromete

Na 3ª Victory, dev recebe convite para a comunidade CodeMaster. O opt-in com email e telefone registra o membro na API externa — transformando o custo de tokens em pertencimento.

**FRs cobertos:** FR25, FR26, FR27, FR28

### Story 3.1: Sistema exibe convite da comunidade após 3ª Victory

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

### Story 3.2: Dev realiza opt-in e dados são registrados na API

Como developer (Ricardo),
quero fornecer meu email e telefone para participar da comunidade,
para que eu seja registrado como membro e tenha acesso ao canal de comunicação da comunidade CodeMaster.

**Acceptance Criteria:**

**Dado** que dev escolheu participar da comunidade (Story 3.1)
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

---

## Epic 4: Documentação e Exemplos — Dev entende o resultado esperado

Dev pode explorar exemplos completos de uso (ciclo quest→relic→victory e milestone completo), acessando o README e o helper de exemplos para entender claramente o que o sistema produz.

**FRs cobertos:** FR47, FR48, FR49

### Story 4.1: Exemplo de milestone completo disponível nos templates

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

### Story 4.2: README e helper de exemplos documentam o sistema

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

### Story 4.3: Knowledge Map com pasta dedicada e checklist de estudo

Como dev usando CodeMaster,
quero que cada gap identificado no Knowledge Map tenha um arquivo dedicado com checklist de estudo, links de leitura e exemplo prático,
para que eu possa acompanhar meu progresso de aprendizado de forma estruturada e saber exatamente o que estudar em cada dimensão.

