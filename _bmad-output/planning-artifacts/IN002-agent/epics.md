---
initiative: IN002
domain: agent
status: active
inputDocuments: ["_bmad-output/planning-artifacts/epics.md"]
---

# Epics — IN002 Agent (Core)

## Epic 1: Ciclo de Aprendizado — Dev completa quest → relic → victory

Dev pode iniciar uma missão, capturar descobertas durante a execução e encerrar com reflexão estruturada — gerando tendências por dimensão e memória persistida no Obsidian Vault.

**FRs cobertos:** FR10, FR11, FR12, FR14, FR15, FR16, FR19, FR20, FR21, FR22, FR23, FR44

### Story 1.1: Dev inicia Quest com reflexão guiada e nota criada no Obsidian

Como developer (Ricardo),
quero usar /codemaster:quest para iniciar uma missão com perguntas de reflexão,
para que eu pense conscientemente nas dimensões de negócio, arquitetura e IA antes de codar.

**Acceptance Criteria:**

**Dado** que dev está em uma ferramenta de IA com o CodeMaster instalado
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

### Story 1.2: Dev registra Relic durante Quest ativa

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

### Story 1.3: Dev encerra Quest com Victory e reflexão avaliada

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

### Story 1.4: Dev define nível de dificuldade na Quest e compara na Victory

Como developer (Marco Castro),
quero definir o nível de dificuldade ao iniciar uma Quest e também ao encerrá-la na Victory,
para que eu possa comparar minha percepção de dificuldade no planejamento versus na execução — revelando padrões de subestimação ou superestimação.

**Escala de Monstros (5 níveis):**
| Nível | Monstro | Descrição |
|-------|---------|-----------|
| 1 | 🐀 Goblin | Tarefa trivial — solução clara, sem incerteza |
| 2 | ⚔️ Orc | Tarefa simples — caminho conhecido, esforço moderado |
| 3 | 🪨 Troll | Tarefa média — exige decisões técnicas, alguma incerteza |
| 4 | 🐉 Dragon | Tarefa difícil — múltiplas decisões, risco técnico |
| 5 | 💀 Lich | Tarefa épica — território desconhecido, alta complexidade |

**Acceptance Criteria:**

**Dado** que dev está iniciando uma Quest via `/codemaster:quest`
**Quando** o agente recebe a resposta da pergunta âncora
**Então** antes das 3 perguntas de dimensão, o agente apresenta a escala de monstros e pergunta a dificuldade estimada
**E** o nível é registrado no `active-quest.json` como `plannedDifficulty` e no frontmatter como `planned_difficulty`

**Dado** que dev está encerrando uma Quest via `/codemaster:victory`
**Quando** as 5 perguntas de reflexão são respondidas
**Então** o agente relembra o monstro planejado e pergunta a dificuldade real
**E** o agente exibe o delta com comentário: subestimou (+), superestimou (−) ou preciso (0)
**E** o nível real é registrado no frontmatter da quest e do victory como `actual_difficulty`

**Dado** que existem quests anteriores sem campo de dificuldade
**Quando** o sistema lê essas quests
**Então** funciona normalmente — campos de dificuldade são opcionais

---

## Epic 2: Evolução Visível — Dev vê seu progresso e gaps

Dev pode visualizar o histórico completo de evolução nas 3 dimensões (Legend) e solicitar diagnóstico dos conhecimentos que faltam para o próximo nível (Knowledge) — transformando dados acumulados em direção.

**FRs cobertos:** FR33, FR34, FR35, FR36, FR37, FR38, FR39, FR56, FR63, FR76

### Story 2.1: Dev visualiza histórico de evolução via Legend

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

### Story 2.2: Dev solicita diagnóstico de gaps via Knowledge

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
**Então** KNOWLEDGE-MAP.md é criado ou atualizado com: gaps listados por dimensão (Negócio/Arquitetura/IA) e por sub-aspecto (5 por dimensão), status (Para Estudar / Estudado / Praticado), score médio e `[[wikilinks]]` para as quests de origem
**E** agente apresenta os 3 gaps prioritários para o próximo nível com justificativa baseada nos dados

**Dado** que vault tem menos de 3 victories
**Quando** dev usa `/codemaster:knowledge`
**Então** agente explica que mais victories são necessárias para análise significativa e exibe estado parcial disponível

---

## Epic 3: Mentalidade Agêntica — Dev aprende a orquestrar IA, não ser assistido por ela

Dev é guiado pelo CodeMaster a desenvolver mentalidade de **programador agêntico** — aquele que orquestra IA com intenção, entende o que foi gerado, articula decisões e sabe quando delegar vs quando fazer manualmente. O oposto do "vibe coder" que aceita output de IA sem questionar e não consegue explicar o que seu próprio código faz.

**Conceito central:** As perguntas de reflexão (Quest e Victory) passam a detectar padrões de "vibe coding" e desafiar o dev a pensar mais profundamente sobre sua relação com IA — sem julgar, guiando com perguntas socráticas.

### Story 3.1: Agente detecta padrões de vibe coding nas reflexões e desafia o dev

Como developer (Marco Castro),
quero que o CodeMaster identifique quando minhas respostas de reflexão indicam comportamento de "vibe coder" (aceitei sem questionar, não entendi o que foi gerado, não sei explicar a decisão),
para que eu seja desafiado a pensar mais profundamente e desenvolva autonomia técnica real.

**Acceptance Criteria:**

**Dado** que o dev está respondendo as perguntas de reflexão (Quest ou Victory)
**Quando** a resposta contém indicadores de vibe coding:
- "a IA fez", "o Claude gerou", "deixei a IA decidir" sem explicar por quê concordou
- Respostas que descrevem resultado mas não processo de decisão
- Ausência de trade-offs ou alternativas consideradas
**Então** o agente faz uma pergunta socrática direcionada, como:
- "Interessante — mas por que você concordou com essa abordagem? Que alternativas considerou?"
- "Se a IA tivesse sugerido o oposto, como você avaliaria?"
- "Você conseguiria implementar isso sem a IA? O que falta no seu modelo mental?"
**E** o agente NÃO julga ou pune — apenas guia para reflexão mais profunda
**E** se o dev articular bem após o desafio, o agente reconhece: "Agora sim — essa é uma decisão de engenheiro, não de vibe coder."

**Dado** que o dev demonstra comportamento agêntico nas respostas (articulou decisão, considerou alternativas, sabe o que delegou e por quê)
**Quando** o agente analisa a resposta
**Então** o agente reconhece e reforça: "Isso é orquestração — você usou a IA como ferramenta, não como muleta."

### Story 3.2: Dimensão IA/Orquestração diferencia nível de agenticidade no scoring

Como developer (Marco Castro),
quero que o score de IA/Orquestração reflita meu nível de agenticidade — não apenas se usei IA, mas COMO usei,
para que minha evolução como programador agêntico seja rastreada ao longo do tempo.

**Acceptance Criteria:**

**Dado** que o agente está fazendo scoring na Victory
**Quando** analisa a dimensão IA/Orquestração
**Então** o score considera uma escala de maturidade agêntica:
- **Score 1-3 (↓ Vibe Coder):** "A IA fez X" sem explicar por quê aceitou, sem alternativas, sem modelo mental
- **Score 4-6 (→ Assistido):** Usou IA, sabe o que foi gerado, mas não articula trade-offs ou quando NÃO usar IA
- **Score 7-10 (↑ Agêntico):** Orquestrou IA com intenção, sabe o que delegou e por quê, articulou alternativas, sabe o que faria sem IA
**E** o agente exibe na análise: "IA: ↑ 8.0 (agêntico — orquestrou com intenção)" ou "IA: ↓ 3.0 (vibe coder — aceitou sem questionar)"
**E** o rótulo (vibe coder / assistido / agêntico) é persistido no frontmatter do victory como `agentic_level`

### Story 3.3: Quest inclui pergunta de intenção de orquestração antes de começar

Como developer (Marco Castro),
quero que ao iniciar uma Quest o agente pergunte minha intenção de orquestração — o que pretendo fazer manualmente vs delegar à IA,
para que na Victory eu possa comparar minha intenção inicial com o que realmente aconteceu e aprender com a diferença.

**Acceptance Criteria:**

**Dado** que o dev está iniciando uma Quest (após a pergunta de dificuldade, Passo 2)
**Quando** o agente chega na pergunta de IA/Orquestração (3ª pergunta do Passo 3)
**Então** a pergunta é expandida para incluir intenção de delegação:
- "Como você pretende usar IA nessa tarefa? O que vai orquestrar (delegar com supervisão) versus o que vai fazer manualmente? Por quê essa divisão?"
**E** a resposta é registrada no frontmatter da quest como `orchestration_intent`

**Dado** que o dev está encerrando via Victory
**Quando** o agente chega na pergunta de IA/Orquestração (pergunta 3)
**Então** o agente relembra a intenção original: "No início você disse: '{orchestration_intent}'. O que realmente aconteceu?"
**E** o delta entre intenção e realidade é registrado como insight na victory

### Story 3.4: Knowledge Map inclui análise de maturidade agêntica

Como developer (Marco Castro),
quero que o KNOWLEDGE-MAP.md inclua uma seção dedicada à minha evolução como programador agêntico,
para que eu visualize claramente se estou evoluindo de vibe coder para orquestrador de IA.

**Acceptance Criteria:**

**Dado** que o dev usa `/codemaster:knowledge` e tem ao menos 3 victories com dados de IA/Orquestração
**Quando** o agente gera o KNOWLEDGE-MAP.md
**Então** uma seção "## Maturidade Agêntica" é adicionada contendo:
- Nível atual (Vibe Coder / Assistido / Agêntico) baseado na média de IA dos últimos 5 victories
- Tendência (melhorando, estável, regredindo)
- Padrões detectados: "Você tende a delegar X sem questionar" ou "Você articula bem trade-offs em Y"
- Recomendação: próximo passo concreto para subir de nível
**E** wikilinks para as quests que fundamentam cada observação

**Dado** que o dev tem menos de 3 victories
**Quando** o agente gera o KNOWLEDGE-MAP.md
**Então** a seção "Maturidade Agêntica" aparece com: "Dados insuficientes — complete mais quests para análise"

---

## Epic 4: Inteligência do Knowledge — Map híbrido se adapta ao nível do dev

O Knowledge Map combina uma base curada de conhecimentos essenciais do dev agentic com expansão orgânica por quest. O sistema adapta profundidade ao nível do dev, nomeia gaps com terminologia técnica padrão da indústria e gera trilha progressiva de estudo — resolvendo o problema de devs iniciantes que não sabem o que não sabem.

**Pré-requisito:** IN001 Story 4.3 (estrutura knowledge/ e arquivos K{id})

**FRs cobertos:** FR36, FR37, FR38, FR39

### Story 4.1: Mapa base curado com conhecimentos do dev agentic

Como dev iniciando no CodeMaster,
quero que o vault já venha com um mapa de conhecimentos essenciais do dev agentic,
para que eu saiba desde o dia 1 o que preciso aprender e tenha visão completa do caminho.

**Acceptance Criteria:**

**Dado** que dev executa `codemaster setup` com vault configurado
**Quando** `initVault` cria a pasta `knowledge/`
**Então** arquivos K{id} da base curada são copiados para `knowledge/` com status "Para Estudar"
**E** cada K{id} tem `origin: "base"` no frontmatter para distinguir de gaps descobertos em quests
**E** K{id} base cobrem as 3 dimensões (negócio, arquitetura, IA) com ao menos 3 por dimensão
**E** cada K{id} tem campo `depth: "básico" | "intermediário" | "avançado"` no frontmatter

**Dado** que dev tem nível "junior" configurado no `config.json`
**Quando** KNOWLEDGE-MAP.md é gerado como índice
**Então** apenas K{id} com `depth: "básico"` são listados no índice
**E** K{id} intermediários e avançados existem no vault mas não aparecem no índice

**Dado** que dev tem nível "pleno" configurado
**Quando** KNOWLEDGE-MAP.md é gerado
**Então** K{id} com `depth: "básico"` e `"intermediário"` são listados

**Dado** que dev tem nível "senior" configurado
**Quando** KNOWLEDGE-MAP.md é gerado
**Então** todos os K{id} são listados independente do depth

**Dado** que dev muda de nível (reconfigura via setup)
**Quando** `/codemaster:knowledge` é executado novamente
**Então** novos K{id} que antes estavam filtrados aparecem no KNOWLEDGE-MAP.md

### Story 4.2: Victory marca conhecimentos demonstrados e quest expande o mapa

Como dev completando quests no CodeMaster,
quero que o sistema reconheça conhecimentos que eu já demonstro e descubra novos gaps no meu contexto real,
para que o mapa reflita minha evolução real e cresça com minha jornada.

**Acceptance Criteria:**

**Dado** que dev fecha uma victory com score >= 7.0 em uma dimensão
**Quando** `generateKnowledge` é executado
**Então** K{id} da base curada naquela dimensão com `depth` compatível ao nível do dev têm status atualizado para "Demonstrado"
**E** agente parabeniza pelo conhecimento desbloqueado

**Dado** que reflexões de uma quest revelam gap que não existe no mapa base
**Quando** `generateKnowledge` identifica gap novo
**Então** novo K{id} é criado com `origin: "quest"` e `source_quests` preenchido
**E** gap recebe `depth` atribuído pelo agente baseado na complexidade do conceito

**Dado** que gap já existe como K{id} (base ou quest)
**Quando** `generateKnowledge` encontra gap equivalente
**Então** K{id} existente NÃO é recriado (idempotência)
**E** `source_quests` é atualizado se houver nova quest de origem

### Story 4.3: Sistema gera trilha progressiva de estudo sequenciada

Como dev consultando o Knowledge Map,
quero uma trilha de estudo sequenciada com prioridades claras,
para que eu saiba exatamente qual gap estudar primeiro e tenha evolução lógica e gradativa.

**Acceptance Criteria:**

**Dado** que KNOWLEDGE-MAP.md é regenerado
**Quando** dev consulta o índice
**Então** gaps são organizados em ordem de estudo recomendada, não apenas agrupados por dimensão
**E** seção "Trilha de Estudo" lista os 3 próximos gaps em sequência com justificativa

**Dado** que dev tem gaps em múltiplas dimensões com scores variados
**Quando** priorização é calculada
**Então** prioridade considera: frequência que gap apareceu nas quests + dimensão de menor score médio + depth compatível com nível do dev
**E** gaps de depth incompatível com o nível nunca aparecem na trilha

**Dado** que dev marca checklist completo de um K{id} (conceito + leitura + prática)
**Quando** `/codemaster:knowledge` é executado novamente
**Então** próximo gap da trilha é promovido como prioridade 1
**E** K{id} completado muda status para "Praticado"
