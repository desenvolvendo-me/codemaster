---
initiative: IN002
domain: agent
status: active
inputDocuments: ["_bmad-output/planning-artifacts/prd.md"]
---

# PRD — IN002 Agent (Core)

## Contexto

O domínio Agent compreende o **núcleo do CodeMaster** — a lógica dos 5 momentos de reflexão (Quest, Relic, Victory, Legend, Knowledge), o sistema de avaliação nas 3 dimensões × 5 sub-aspectos, a detecção de maturidade agêntica e toda a mecânica de aprendizado que é **compartilhada entre todas as ferramentas de IA**. Os agentes vivem em `~/.codemaster/agents/{momento}.md` como arquivos autocontidos — a fonte única de verdade que as integrações (Claude Code, Codex, futuras) consomem via thin wrappers. Este é o cérebro do CodeMaster.

## Functional Requirements

### Ciclo de Aprendizado — Quest, Relic, Victory

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

### Evolução Visível — Legend, Knowledge

- **FR33:** Dev pode visualizar o histórico completo de evolução — missões, relíquias, vitórias e tendências por dimensão
- **FR34:** Sistema pode exibir tendências acumuladas nas 3 dimensões com destaque para a última vitória e milestones concluídos
- **FR35:** Sistema pode exibir a maior relíquia do período e sugerir o foco para o próximo milestone
- **FR36:** Dev pode solicitar diagnóstico de gaps baseado no histórico acumulado do vault
- **FR37:** Sistema pode ler quests, victories e relics do vault para extrair padrões de aprendizado por dimensão
- **FR38:** Sistema pode gerar ou atualizar o **KNOWLEDGE-MAP.md** — o documento mais importante do sistema — com checklist de status por sub-aspecto (15 itens nas 3 dimensões), agrupamento por dimensão, status por área (Para Estudar / Estudado / Praticado) e ordenação por prioridade baseada em gaps reais
- **FR39:** Sistema pode gerar orientação sobre os conhecimentos que faltam para o próximo nível com base no KNOWLEDGE-MAP.md atualizado

### Avaliação de Arquitetura — Sub-aspectos

- **FR68:** As perguntas de reflexão do Quest e Victory devem ser formuladas para extrair **indiretamente** evidências de compreensão arquitetural (ex: "Como você organizou a solução?" em vez de "Qual pattern você usou?") — o agente nunca direciona a resposta certa
- **FR69:** Sistema pode avaliar na dimensão Arquitetura considerando 5 sub-aspectos: **Domínio** (regras de negócio no código — onde vivem, como são separadas da infraestrutura), **Estrutura** (organização do código — patterns, camadas, separação de responsabilidades, naming, convenções), **Integração** (comunicação entre sistemas — APIs, mensageria, eventos, contratos, dependências externas), **Infraestrutura** (onde e como o sistema roda — deploy, CI/CD, containers, cloud, observabilidade) e **Qualidade** (práticas de confiabilidade — testes, code review, linting, cobertura, tech debt, refactoring)
- **FR70:** Sistema pode identificar nas respostas do dev sinais de maturidade em domínio — como capacidade de distinguir lógica de domínio de lógica de infraestrutura, e saber onde uma regra de negócio deve ser implementada
- **FR71:** Sistema pode identificar nas respostas do dev sinais de maturidade em estrutura — como aplicação consciente de patterns, organização em camadas claras, naming que auto-documenta e respeito às convenções do projeto
- **FR72:** Sistema pode identificar nas respostas do dev sinais de maturidade em integração — como projetar integrações resilientes, entender contratos de API e lidar com falhas de comunicação entre serviços
- **FR73:** Sistema pode identificar nas respostas do dev sinais de maturidade em infraestrutura — como configurar pipelines, entender logs e métricas de infra, e debugar problemas de ambiente
- **FR74:** Sistema pode identificar nas respostas do dev sinais de maturidade em qualidade — como escrever testes que validam comportamento (não implementação), identificar tech debt e fazer refactoring com segurança
- **FR75:** Sistema pode registrar os sub-aspectos de arquitetura (domínio, estrutura, integração, infraestrutura, qualidade) como parte da tendência da dimensão Arquitetura no Victory e no PROGRESS.md
- **FR76:** Sistema pode incluir no KNOWLEDGE-MAP.md uma seção específica para os sub-aspectos de Arquitetura com status e gaps identificados a partir do histórico de quests e victories

### Avaliação de Negócio — Sub-aspectos

- **FR57:** As perguntas de reflexão do Quest e Victory devem ser formuladas para extrair **indiretamente** evidências de compreensão de negócio (ex: "O que muda para quem usa o sistema depois dessa entrega?" em vez de "Qual o valor de negócio?") — o agente nunca direciona a resposta certa
- **FR58:** Sistema pode avaliar na dimensão Negócio considerando 5 sub-aspectos: **Valor de Negócio** (entendimento do impacto no negócio do cliente), **Experiência do Cliente** (consciência da jornada e fricções do usuário final), **Funcionamento do Sistema** (conhecimento dos comportamentos e funcionalidades do sistema, não do código), **Métricas e Dados** (capacidade de medir impacto e tomar decisões baseadas em dados) e **Priorização e Trade-offs** (capacidade de negociar escopo e fazer cortes conscientes)
- **FR59:** Sistema pode identificar nas respostas do dev sinais de maturidade em valor de negócio — como capacidade de conectar a tarefa técnica ao problema que ela resolve para o cliente, e entendimento de impacto em receita, retenção ou crescimento
- **FR60:** Sistema pode identificar nas respostas do dev sinais de maturidade em experiência do cliente — como consciência de fluxos do usuário, pontos de fricção, e impacto da decisão técnica na percepção de quem usa o produto
- **FR61:** Sistema pode identificar nas respostas do dev sinais de maturidade em funcionamento do sistema — como capacidade de descrever comportamentos e funcionalidades sem recorrer ao código, e avaliar impacto, esforço e viabilidade de mudanças com base no conhecimento do sistema como um todo
- **FR64:** Sistema pode identificar nas respostas do dev sinais de maturidade em métricas e dados — como capacidade de questionar como medir o sucesso de uma entrega, sugerir KPIs relevantes e usar dados existentes para justificar decisões
- **FR65:** Sistema pode identificar nas respostas do dev sinais de maturidade em priorização e trade-offs — como capacidade de propor cortes conscientes sem comprometer o valor central, entender MVP e custo de oportunidade
- **FR62:** Sistema pode registrar os sub-aspectos de negócio (valor de negócio, experiência do cliente, funcionamento do sistema, métricas e dados, priorização e trade-offs) como parte da tendência da dimensão Negócio no Victory e no PROGRESS.md
- **FR63:** Sistema pode incluir no KNOWLEDGE-MAP.md uma seção específica para os sub-aspectos de Negócio com status e gaps identificados a partir do histórico de quests e victories

### Avaliação de Orquestração de IA — Sub-aspectos

- **FR50:** As perguntas de reflexão do Quest e Victory devem ser formuladas para extrair **indiretamente** evidências de gestão de contexto (ex: "Como você preparou o terreno antes de começar?" em vez de "Você usou BMAD?") — o agente nunca pergunta diretamente sobre ferramentas específicas
- **FR51:** As perguntas de reflexão devem ser formuladas para extrair **indiretamente** evidências de gestão de tokens (ex: "O que você delegou e como decidiu o nível de autonomia?" em vez de "Qual modelo você usou?") — a escolha consciente de modelo por complexidade é uma competência de orquestração
- **FR52:** Sistema pode avaliar na dimensão Orquestração de IA considerando 5 sub-aspectos: **Mindset Agentic** (paradigma de agentes), **Gestão de Contexto** (estruturação de informação para o modelo), **Gestão de Tokens** (escolha de modelo adequado à complexidade), **Prompt Engineering** (comunicação eficaz com IA — instruções claras, exemplos, constraints) e **Avaliação de Output** (análise crítica do que a IA gera — identificar erros, alucinações, código inseguro)
- **FR53:** Sistema pode identificar nas respostas do dev sinais de maturidade em gestão de contexto — como uso de ferramentas de estruturação (BMAD, specs, PRDs), preparação de contexto antes da interação, e manutenção de documentação consumível por agentes
- **FR54:** Sistema pode identificar nas respostas do dev sinais de maturidade em gestão de tokens — como escolha consciente entre modelos de diferentes capacidades baseada na complexidade real da tarefa, referenciando a taxonomia documentada no Product Brief (Opus/Very High=Max, Sonnet/High/MiniMax=Alto, Haiku/Medium/GLM=Médio, Slow=Baixo)
- **FR66:** Sistema pode identificar nas respostas do dev sinais de maturidade em prompt engineering — como estruturação de instruções claras com contexto, exemplos e restrições, e ajuste da comunicação conforme tipo de tarefa e modelo
- **FR67:** Sistema pode identificar nas respostas do dev sinais de maturidade em avaliação de output — como revisão crítica de código gerado, identificação de alucinações e padrões inseguros, e capacidade de pedir correções direcionadas em vez de aceitar cegamente
- **FR55:** Sistema pode registrar os sub-aspectos de orquestração (mindset agentic, gestão de contexto, gestão de tokens, prompt engineering, avaliação de output) como parte da tendência da dimensão Orquestração de IA no Victory e no PROGRESS.md
- **FR56:** Sistema pode incluir no KNOWLEDGE-MAP.md uma seção específica para os sub-aspectos de Orquestração de IA (mindset agentic, gestão de contexto, gestão de tokens, prompt engineering, avaliação de output) com status e gaps identificados a partir do histórico de quests e victories

### Camada de agentes compartilhados (sem duplicação por ferramenta)

- **FR45:** Sistema mantém os templates de agente em `_codemaster/agents/{momento}.md` (versionados no pacote npm) e os copia para `~/.codemaster/agents/` durante o setup — path global estável e independente do local de instalação do npm
- **FR49:** Adicionar suporte a nova ferramenta de IA requer apenas gerar thin wrappers no formato da ferramenta apontando para `~/.codemaster/agents/` — nenhum agente precisa ser duplicado

## Non-Functional Requirements

- **NFR2:** Operações de leitura e escrita no Obsidian Vault (criar nota, atualizar PROGRESS.md, arquivar Relic) devem ser concluídas em menos de 3 segundos em filesystems locais padrão
- **NFR3:** Leitura do `active-quest.json` no início de cada comando deve ser imperceptível (<100ms) para não interromper o fluxo do agente
- **NFR4:** O comando `/codemaster:knowledge` pode levar mais de 3 segundos quando o vault é grande — o agente deve informar ao dev que o processamento está em andamento
- **NFR10:** A integração com o Obsidian Vault deve funcionar via filesystem puro — sem dependência de plugins, APIs ou processos do Obsidian em execução
- **NFR-S2:** `~/.codemaster/agents/{momento}.md` é autocontido — não referencia qual ferramenta o invoca
