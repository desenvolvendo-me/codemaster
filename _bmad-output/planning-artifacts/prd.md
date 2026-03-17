---
stepsCompleted: ["step-01-init", "step-02-discovery", "step-02b-vision", "step-02c-executive-summary", "step-03-success", "step-04-journeys", "step-05-domain", "step-06-innovation", "step-07-project-type", "step-08-scoping", "step-09-functional", "step-10-nonfunctional", "step-11-polish"]
classification:
  projectType: "developer_tool + cli_tool"
  domain: "edtech"
  complexity: "medium"
  projectContext: "greenfield"
inputDocuments: ["_bmad-output/planning-artifacts/product-brief-codemaster-2026-03-16.md"]
workflowType: 'prd'
---

# Product Requirements Document - codemaster

**Author:** Code Master
**Date:** 2026-03-16

## Executive Summary

O CodeMaster é um agente mentor instalado globalmente (`npm install -g @marcodotcastro/codemaster`) que transforma cada demanda de desenvolvimento em aprendizado estruturado e consciente. O sistema opera dentro dos agentes de IA que o dev já usa (Claude Code, Codex) e acompanha o trabalho em 5 momentos — Quest, Relic, Victory, Legend e Knowledge — guiando a evolução profissional nas 3 dimensões que definem o dev completo: pensamento de negócio, decisões arquiteturais e orquestração estratégica de IA.

**Usuário primário:** Devs em transição (júnior/iniciante) que usam ou querem usar agentes de coding e precisam evoluir com intenção — não por acidente.
**Usuário secundário:** CTOs e tech leads que precisam que seus times adotem IA com qualidade e consigam gerar valor real ao negócio.

**Problema central:** A aceleração dos agentes de coding está eliminando a necessidade de devs operacionais. O mercado já não contrata quem não usa IA — e o próximo corte será quem usa IA mas não sabe o que está fazendo. Devs júniors aprendem todos os dias sem saber o que estão aprendendo, sem direção e sem evidência de evolução. O resultado: anos de experiência acumulada sem crescimento estruturado, e janela de adaptação fechando.

**Proposta central:** Em 6 meses de uso consistente, o dev sai do trabalho operacional e passa a gerar valor real ao negócio do cliente — não porque aprendeu mais código, mas porque aprendeu a pensar como um profissional que orquestra IA com estratégia. O CodeMaster codifica 20 anos de experiência prática + 3 anos de programação com IA em perguntas que nenhuma outra ferramenta faz no momento certo.

### What Makes This Special

**Método proprietário no momento da execução:** O CodeMaster não é um curso, não é um template e não é uma ferramenta de gerenciamento de tarefas. É um método destilado de 20 anos de experiência codificado em agente — presente exatamente quando o dev está trabalhando, fazendo as perguntas certas antes, durante e depois de cada demanda.

**Adoção pelo próprio agente:** O `CLAUDE.md` injetado pelo setup inclui instrução para o agente sugerir proativamente o `/codemaster:quest` quando o dev inicia uma tarefa sem usá-lo. O hábito não depende de força de vontade — é criado pelo próprio sistema.

**O sistema é a métrica:** Victories, tendências por dimensão e o histórico de perguntas e respostas constroem evidência longitudinal de evolução. O dev não precisa acreditar que está aprendendo — ele vê.

**Urgência de mercado:** Não funciona há 3 anos porque os agentes de coding não eram suficientemente capazes. Hoje, a aceleração já chegou — e quem não se adaptar ficará desempregado. O CodeMaster é a resposta a essa janela de adaptação.

## Project Classification

- **Tipo:** Developer Tool + CLI Tool (pacote npm com comandos globais e injeção em agentes de IA)
- **Domínio:** EdTech (evolução profissional de desenvolvedores via aprendizado pelo trabalho)
- **Complexidade:** Média (lógica de avaliação por tendências, injeção em agentes, Obsidian integration)
- **Contexto:** Greenfield (POC funcional para Claude Code — produto empacotável a construir)

## Success Criteria

### User Success

| Critério | Definição | Target |
|---|---|---|
| **Ativação** | Dev conclui a primeira Victory após instalação | >70% dos novos usuários na primeira semana |
| **Retenção semanal** | Dev completa ao menos 1 Victory por semana | >60% dos usuários ativos |
| **Cadência de aprendizado** | Victories por semana por usuário | ≥4 victories/semana |
| **Evolução detectável** | Qualidade das respostas no Victory melhora entre Milestone 1 e Milestone 3 | Melhora perceptível em ≥70% dos usuários com 3+ milestones |
| **Transformação de nível** | Dev júnior atinge perfil de foco pleno | Em até 6 milestones (~30 victories) |

**Momento de sucesso do usuário:** Dev abre o Legend após o primeiro milestone e reconhece a própria evolução nas 3 dimensões — não como dado abstrato, mas como evidência do que viveu.

### Business Success

| Horizonte | Meta | Indicador |
|---|---|---|
| **3 meses** | 10 devs de empresas com uso ativo | ≥1 Victory/semana por usuário |
| **6 meses** | 1 case completo júnior → pleno documentado | Dev com 6+ milestones concluídos |
| **12 meses** | Versão web lançada com primeiras empresas | ≥1 empresa adotando como processo interno |

### Technical Success

| Requisito | Critério |
|---|---|
| **Instalação** | `codemaster setup` completo em <5 minutos |
| **Injeção Claude Code** | Slash commands disponíveis imediatamente após setup |
| **Injeção Codex** | Instruções ativas no `~/.codex/instructions.md` após setup |
| **Sugestão proativa** | Agente sugere `/codemaster:quest` quando dev inicia tarefa sem usá-lo (comportamento injetado no CLAUDE.md — sem lógica no CLI) |
| **Persistência de sessão** | `active-quest.json` lido corretamente entre sessões separadas |
| **Obsidian** | Estrutura de pastas e frontmatter compatível com Dataview sem configuração manual |

### Measurable Outcomes

- **Taxa de ativação:** % de instalações que resultam em 1ª Victory concluída → target >70%
- **Retenção D7:** % de usuários que voltam na semana seguinte à instalação → target >60%
- **Victories/semana:** média por usuário ativo → target ≥4
- **Milestone completion:** % de usuários que chegam ao Milestone 1 (5 victories) → target >50%

## User Journeys

### Jornada 1 — Ricardo: O Caminho do Herói (Happy Path)

**Abertura — Onde encontramos Ricardo:**
Ricardo tem 2 anos estudando programação. Acabou de entrar no primeiro emprego como dev júnior. Usa Claude Code para escrever código mas tem uma inquietação constante: "O código está certo? Estou aprendendo ou só copiando?"

Num domingo à tarde, assiste um vídeo no YouTube — "Como evoluir de júnior para pleno em 6 meses com IA" — e vê o CodeMaster sendo demonstrado. O que chama atenção não é a ferramenta, é a frase: *"Você não precisa entender cada linha de código. Você precisa entender o negócio, a arquitetura e como orquestrar a IA."* É a primeira vez que alguém nomeia o que ele sente.

**Ação crescente — Primeiros passos:**
Ricardo instala em 4 minutos. O setup pergunta seu nível, sua stack, seus focos de evolução. Pela primeira vez, ele para e pensa sobre onde está e para onde quer ir — não sobre o próximo bug. O Obsidian é configurado automaticamente. O Claude Code recebe as instruções.

Na segunda-feira de manhã, abre o Claude Code para uma tarefa. Antes de começar a digitar, o agente pergunta: *"Você quer iniciar uma quest antes de começar?"* Ricardo escreve `/codemaster:quest "Implementar autenticação JWT"`. Três perguntas chegam — simples, mas diferentes de qualquer coisa que ele já fez: *"Qual o impacto disso para o usuário final?"*. Ele para. Pensa. Responde.

**Clímax — O momento de virada:**
Ao terminar a tarefa, `/codemaster:victory`. Cinco perguntas de reflexão. Uma delas: *"Qual decisão técnica você tomou que beneficiou o negócio?"* Ricardo percebe que escolheu JWT porque o sistema precisava ser stateless — e isso era uma decisão arquitetural, não só código. O agente avalia: Arquitetura ↑. Negócio →. IA →.

É a primeira vez que Ricardo vê sua evolução como dado — não como sensação.

**Resolução — Nova realidade:**
Ao completar o Milestone 1 (5 victories), o Legend exibe o resumo. Ricardo vê a tendência crescente em Arquitetura. O Knowledge aponta o gap real: *"Você precisa aprofundar orquestração de IA — suas respostas ainda focam em 'como usar' e não em 'por que essa abordagem'"*. Ele tem um plano. Ele tem evidência. Ele tem direção.

**Requisitos revelados:** setup interativo, injeção nos agentes, sugestão proativa, ciclo quest→relic→victory, avaliação por tendências, legend com milestone summary, knowledge com diagnóstico de gaps.

---

### Jornada 2 — Ricardo: Risco de Abandono (Edge Case — Token Consumption)

**Abertura — A ameaça real:**
Ricardo usa o CodeMaster por 3 dias. Na quinta-feira percebe que seu uso de tokens no Claude Code aumentou — as perguntas de reflexão adicionam contexto a cada sessão. Ele hesita. *"Isso vai custar mais? Quero continuar?"*

**O momento crítico:**
Ao completar uma Victory, o agente exibe uma mensagem de reconhecimento e convite:

*"Você completou sua 3ª Victory. Quer fazer parte da comunidade CodeMaster e conectar com outros devs na mesma jornada? Ao participar, você recebe acesso a conteúdo exclusivo e relatórios do seu progresso."*

Ricardo informa email e telefone. O sistema envia os dados para a API da comunidade. A partir desse momento, Ricardo não é mais um usuário isolado — é parte de algo maior. O custo de tokens passa a ser justificado pelo valor percebido da comunidade e da evolução visível.

**Resolução:**
Ricardo continua. A comunidade se torna fator de retenção independente do custo. E o CodeMaster ganhou canal direto de comunicação com seu usuário.

**Requisitos revelados:** opt-in de comunidade pós-Victory (email + telefone), integração com API externa para registro de membros, mensagem de convite contextual dentro do fluxo de Victory.

---

### Jornada 3 — Lucas: Adoção no Time (Secondary User)

**Abertura — A pressão de Lucas:**
Lucas é CTO de uma startup de 8 pessoas. A diretoria cobra adoção de IA — *"todo mundo tem que usar, tem que ser mais rápido"*. Mas Lucas vê o risco: IA sendo usada para gerar código que ninguém entende, decisões arquiteturais tomadas pelo modelo sem revisão, devs júniors mais rápidos mas mais frágeis.

**Descoberta:**
Um dev do time comenta em stand-up: *"Instalei o CodeMaster no fim de semana, está sendo muito útil."* Lucas pede pra ver. O dev abre o Legend e mostra as tendências. Lucas vê evidência de como um dev está pensando — não só o que está entregando.

**Ação:**
Lucas assiste o mesmo vídeo no YouTube. Manda o link para o time. Dois dias depois, propõe que todos instalem. Não há resistência — o time vê como benefício próprio, não como monitoramento.

**Clímax:**
Três semanas depois, Lucas percebe: os pull requests chegam com mais contexto. Os comentários de código têm justificativas. Devs perguntam sobre impacto de negócio antes de começar. Ele não precisou de relatório — o comportamento mudou.

**Resolução:**
Na reunião de revisão com a diretoria, Lucas apresenta: *"Nosso dev júnior tomou uma decisão arquitetural correta sem supervisão — e consegue explicar o porquê."* A adoção de IA virou qualidade, não só velocidade.

**Requisitos revelados:** legend legível por terceiros, victories com contexto de decisão documentado, fluxo que funciona sem configuração corporativa adicional.

---

### Journey Requirements Summary

| Capacidade | Origem |
|---|---|
| Setup interativo <5min com injeção nos agentes | Jornada 1 — ativação de Ricardo |
| Sugestão proativa pelo agente | Jornada 1 — fluxo natural sem fricção |
| Ciclo completo dos 5 momentos | Jornada 1 — evolução visível |
| Avaliação por tendências com milestone summary | Jornada 1 — evidência longitudinal |
| Knowledge com diagnóstico de gaps | Jornada 1 — direção do próximo passo |
| Opt-in de comunidade pós-Victory (email + telefone → API) | Jornada 2 — recuperação do risco de abandono |
| Mensagem contextual de convite dentro do Victory | Jornada 2 — trigger no momento certo |
| Legend legível e comunicável | Jornada 3 — visibilidade para o time |
| Victories com contexto de decisão documentado | Jornada 3 — qualidade percebida pelo time |

## Domain-Specific Requirements

### Compliance & Privacidade de Dados (LGPD)

- A coleta de email e telefone para a comunidade é **opt-in explícito** — o agente pergunta ao usuário se tem interesse antes de qualquer coleta
- O convite deve informar claramente: *"Seus dados não serão tornados públicos e serão usados apenas para comunicação da comunidade CodeMaster"*
- Não há dados de menores de idade como público-alvo — requisitos de COPPA/FERPA não se aplicam
- Não há sistema LMS, credencial educacional ou currículo regulamentado — domínio acadêmico formal não se aplica

### Arquitetura Local-First (Privacidade por Design)

- Todo o histórico de aprendizado (quests, victories, relics, PROGRESS.md) reside exclusivamente no Obsidian Vault local do usuário — zero dependência de nuvem para o ciclo de aprendizado
- `~/.codemaster/active-quest.json` e `~/.codemaster/config.json` armazenam dados em texto plano no filesystem local — sem criptografia necessária dado o modelo de ameaça (arquivo local, acesso físico)
- A única transmissão de dados externos ocorre no opt-in da comunidade (email + telefone → API externa)

### Segurança de Integração com Agentes

- A injeção no `~/.claude/CLAUDE.md` e `~/.codex/instructions.md` deve ser feita **sempre ao final do arquivo existente**, nunca sobrescrevendo conteúdo anterior
- O bloco injetado deve conter um comentário de identificação:
  ```
  <!-- CodeMaster v{version} — instruções do agente mentor. Não remova manualmente. -->
  ```
- O `codemaster setup` deve detectar se uma injeção prévia existe antes de injetar novamente (idempotência)
- Na reconfiguração, o bloco anterior deve ser substituído pelo novo, não duplicado

### Integration Requirements

- **API da Comunidade:** endpoint externo para registro de membros (email + telefone) — a ser definido; deve suportar HTTPS e retornar confirmação de cadastro
- **Obsidian Vault:** path configurável no setup; sem API — interação via filesystem direto
- **Claude Code:** integração via filesystem (`~/.claude/CLAUDE.md` + `~/.claude/commands/codemaster/`)
- **Codex CLI:** integração via filesystem (`~/.codex/instructions.md`)

## Innovation & Novel Patterns

### Detected Innovation Areas

**1. Método-como-Software (Method-as-Software)**
O CodeMaster cria uma categoria de produto inexistente: um método de mentoria humana destilado em instruções de agente de IA. Não é um curso, não é uma ferramenta, não é um assistente — é um paradigma de aprendizado que vive dentro da ferramenta que o dev já usa. O IP é o método; o software é o veículo.

**2. Agente como Coach Proativo (AI-as-Coach Pattern)**
A injeção no `CLAUDE.md` transforma o comportamento do agente de IA de reativo para proativo em relação ao aprendizado. O Claude Code, que normalmente só responde a comandos, passa a sugerir reflexão quando detecta início de tarefa sem Quest ativa. Isso não existe em nenhum sistema de learning-by-doing atual — a IA vira guardião do método, não apenas executor de código.

**3. Aprendizado pelo Trabalho Real com Memória Longitudinal**
A combinação de: (a) reflexão no momento da execução + (b) avaliação por tendências + (c) diagnóstico de gaps baseado em histórico acumulado cria um loop de aprendizado que não depende de conteúdo externo. O dev aprende pelo trabalho que já faria — sem contexto switching. Isso é diferente de toda solução de upskilling existente.

**4. CLI como Orquestrador de Transformação Profissional**
Um pacote npm instalado globalmente como veículo de transformação de carreira — não de automação de tarefas. O CLI não faz código; faz o dev pensar diferente sobre o código que a IA faz por ele.

### Market Context & Competitive Landscape

| Categoria | Exemplos | Gap |
|---|---|---|
| Plataformas de cursos | Udemy, Coursera, Alura | Desconectados do trabalho real; sem memória do dev; aprendizado passivo |
| Ferramentas de notas/PKM | Obsidian, Notion | Gerenciam informação; não orientam aprendizado; sem reflexão guiada |
| Mentoria humana | Mentores, coaches | Presença limitada; não acompanham execução diária; custo alto |
| Ferramentas de produtividade com IA | GitHub Copilot, Cursor | Aceleram execução; não desenvolvem o dev; zero reflexão |
| Gamificação de aprendizado | Duolingo for devs, CodeWars | Gamificam exercícios isolados; não o trabalho real |

**Vazio competitivo:** Nenhuma solução combina presença no momento da execução + método proprietário + memória longitudinal + avaliação por dimensões. O CodeMaster não tem concorrente direto — seu concorrente mais próximo é a ausência de qualquer sistema.

### Validation Approach

| Hipótese | Validação | Sinal positivo |
|---|---|---|
| O agente proativo cria o hábito | Medir % de Quests iniciadas por sugestão do agente vs. comando direto | >50% das Quests iniciadas por sugestão do agente em D30 |
| As perguntas de reflexão geram aprendizado real | Comparar qualidade das respostas do Victory entre Milestone 1 e Milestone 3 | Melhora perceptível em ≥70% dos usuários |
| Dev muda de mindset (operacional → valor) | Entrevista qualitativa após Milestone 2 | Dev descreve decisões em termos de negócio, não só técnicos |
| Método de 20 anos é transferível via agente | 1 dev júnior chegando ao perfil pleno | Case documentado em ≤6 meses |

### Risk Mitigation

| Risco | Probabilidade | Mitigação |
|---|---|---|
| Custo de tokens afasta adoção | Alta | Opt-in de comunidade cria valor que justifica o custo; perguntas devem ser concisas e diretas |
| Dev responde reflexões superficialmente | Média | Perguntas são abertas mas direcionadas; o próprio histórico revela padrão de respostas rasas no Knowledge |
| Injeção no CLAUDE.md causa conflito | Baixa | Idempotência no setup + append ao final + comentário de identificação |
| Método não se transfere para todos os perfis | Média | Foco inicial em devs júniors/intermediários; validar antes de expandir para sêniors |

## Developer Tool + CLI Tool Specific Requirements

### Project-Type Overview

O CodeMaster é um pacote npm de instalação global que entrega um método de mentoria via CLI interativo. Não automatiza tarefas — facilita reflexão humana. Cada comando inicia uma conversa guiada pelo agente de IA; o CLI é o orquestrador que prepara o contexto e persiste o resultado.

### Technical Architecture Considerations

| Componente | Decisão | Justificativa |
|---|---|---|
| **Runtime** | Node.js 18+ / ESM puro | Compatibilidade com ecosistema atual; módulos nativos sem transpilação |
| **Distribuição** | `npm install -g @marcodotcastro/codemaster` | Instalação global única; disponível em qualquer diretório |
| **Entry point** | `bin/codemaster.js` → `src/index.js` → `src/commands/` | Separação clara entre CLI e lógica de domínio |
| **Persistência** | Filesystem local (`~/.codemaster/`, Obsidian Vault) | Local-first; zero dependência de nuvem para o ciclo principal |
| **Análise/IA** | Feita pelo agente (Claude/Codex) via prompts injetados | Sem chamadas de API externas no CLI; toda inteligência delegada ao agente |

### Installation Methods

- `npm install -g @marcodotcastro/codemaster` — instalação principal
- `codemaster setup` — configuração interativa pós-instalação (obrigatória)
- `codemaster setup` novamente — reconfiguração com valores pré-preenchidos
- Publicação: `npm publish --access public`

### Command Structure

| Comando | Tipo | Interação |
|---|---|---|
| `codemaster setup` | CLI interativo | Prompts sequenciais; detecta e preserva configuração existente |
| `/codemaster:quest [título]` | Slash command (agente) | Agente conduz 3 perguntas de reflexão; cria nota Obsidian; escreve `active-quest.json` |
| `/codemaster:relic [descoberta]` | Slash command (agente) | Lê `active-quest.json`; classifica a descoberta como arquitetural, negocial ou orquestração de IA; arquiva em `/relics/` quando relevante além da quest |
| `/codemaster:victory` | Slash command (agente) | Agente conduz 5 perguntas; avalia tendências; atualiza PROGRESS.md; opt-in comunidade |
| `/codemaster:legend` | Slash command (agente) | Lê PROGRESS.md e vault; exibe resumo de evolução por milestone |
| `/codemaster:knowledge` | Slash command (agente) | Lê vault completo; extrai gaps; orienta próximo nível |

**Todos os comandos são 100% interativos** — sem flags de saída não-interativa, sem uso em pipelines CI/CD.

### Config Schema

```json
// ~/.codemaster/config.json
{
  "hero": {
    "name": "string",
    "role": "junior|pleno|senior",
    "stack": ["string"],
    "experience_years": "number"
  },
  "dimensions": {
    "business": 1-5,
    "architecture": 1-5,
    "ai_orchestration": 1-5
  },
  "focus": ["business"|"architecture"|"ai_orchestration"],
  "obsidian": {
    "vault_path": "string"
  },
  "agents": {
    "claude_code": boolean,
    "codex": boolean
  },
  "community": {
    "opted_in": boolean,
    "email": "string|null",
    "phone": "string|null"
  }
}
```

### Language Matrix

- Perguntas de reflexão são **independentes da linguagem/stack** — o foco é arquitetura, negócio e orquestração de IA, não sintaxe
- A stack coletada no setup serve como contexto para o agente personalizar exemplos e referências, não para alterar o método
- Suporte universal: qualquer linguagem/stack que o dev use com Claude Code ou Codex

### Documentation & Examples

- **README.md** no repositório com instalação, configuração e referência de comandos
- **Helper de exemplos:** comando ou script que gera exemplos contextualizados de uso — demonstrando uma quest + relic + victory completos com respostas de exemplo
- **Instruções injetadas:** o bloco no `CLAUDE.md` e `instructions.md` documenta o método diretamente no contexto do agente — é a documentação viva do sistema

### Implementation Considerations

- **Idempotência do setup:** detectar bloco CodeMaster existente antes de injetar; substituir em reconfiguração, nunca duplicar
- **Leitura de `active-quest.json`:** todo comando deve ler o arquivo no início para contextualizar a sessão — se ausente, deve orientar o dev a criar uma Quest primeiro
- **Milestone automático:** ao registrar a 5ª Victory, criar `milestone-X-summary.md` e reorganizar pastas no Obsidian
- **Opt-in comunidade:** trigger na 3ª Victory; não bloquear o fluxo se recusado; registrar `opted_in: false` no config

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach:** Problem-solving MVP — entregar o ciclo completo de aprendizado (5 momentos) para validar que o método funciona em uso real antes de qualquer escala ou feature adicional.

**Recurso:** 1 desenvolvedor (solo) | **Timeline:** 2 semanas

**Premissa central:** O método vale mais que qualquer feature. Se as perguntas certas no momento certo não geram reflexão real, nada mais importa.

### MVP Feature Set (Phase 1) — 2 semanas

**Core User Journeys Suportadas:**
- Jornada 1 (Ricardo — Happy Path): ciclo completo quest → relic → victory → legend → knowledge
- Jornada 2 (Ricardo — Token Risk): opt-in de comunidade na 3ª Victory

**Must-Have Capabilities:**

| Capacidade | Prioridade | Observação |
|---|---|---|
| `codemaster setup` interativo | 🔴 Crítico | Sem setup, nada funciona |
| Injeção no Claude Code (CLAUDE.md + slash commands) | 🔴 Crítico | Canal principal de uso |
| `/codemaster:quest` | 🔴 Crítico | Entrada do ciclo |
| `/codemaster:relic` | 🔴 Crítico | Captura de valor durante execução |
| `/codemaster:victory` | 🔴 Crítico | Fechamento do ciclo + avaliação |
| `/codemaster:legend` | 🔴 Crítico | Evidência de evolução — momento "uau" |
| `/codemaster:knowledge` | 🔴 Crítico | Diagnóstico de gaps — direção |
| Obsidian: estrutura de pastas + frontmatter | 🔴 Crítico | Memória do sistema |
| Milestone automático (a cada 5 victories) | 🟡 Importante | Pode ser manual na v1 se necessário |
| Opt-in comunidade (email + telefone → API) | 🟡 Importante | Mecanismo de retenção do edge case |
| Injeção no Codex | 🟡 Importante | Pode vir em v1.1 se timeline apertar |
| **Sugestão proativa pelo agente** | ⚠️ **Hipótese** | Validar na 1ª semana; se não funcionar confiavelmente, remover do MVP e documentar como "comportamento esperado, não garantido" |

**Decisão crítica sobre sugestão proativa:**
Dado que é uma hipótese com 2 semanas de prazo, a estratégia é:
1. Implementar a instrução no CLAUDE.md na primeira semana
2. Testar com 2-3 cenários reais
3. Se funcionar consistentemente → MVP inclui como feature
4. Se inconsistente → MVP remove a promessa; comportamento proativo vira "pode acontecer" sem ser requisito

### Post-MVP Features

**Phase 2 — Growth (pós-validação do método):**
- Injeção no Codex (se não entrar no MVP)
- Versão web simples para visualização de evolução individual
- Dashboard para CTO/tech lead
- Knowledge com sugestão de recursos específicos (artigos, projetos)
- Canvas automático do Obsidian

**Phase 3 — Expansion:**
- Marketplace de métodos (outros mentores publicam seus "20 anos")
- Sincronização de vault para visibilidade de time
- Portfólio de conhecimento navegável por empresa
- Relatório comparativo: "dev do Milestone 1 vs. hoje"

### Risk Mitigation Strategy

**Risco Técnico — Sugestão proativa não funciona confiavelmente:**
- Mitigação: testar na semana 1; fallback é remover do escopo do MVP sem impacto no ciclo principal
- O ciclo funciona sem sugestão proativa — depende da disciplina do dev nesse cenário

**Risco de Mercado — Dev não lembra de usar:**
- Mitigação MVP: instrução no CLAUDE.md cria contexto para o agente sugerir
- Mitigação v2: opt-in de comunidade cria comprometimento social e canal de lembrete

**Risco de Recurso — Solo dev em 2 semanas:**
- Contingência: se Codex não ficar pronto, lançar com Claude Code only e iterar
- Prioridade absoluta: setup + ciclo dos 5 momentos + Obsidian funcionando end-to-end

## Functional Requirements

### Setup & Onboarding

- **FR1:** Dev pode instalar o CodeMaster globalmente via npm em qualquer sistema com Node.js 18+
- **FR2:** Dev pode executar o setup como um **onboarding guiado** que apresenta de forma resumida o método CodeMaster (os 5 momentos, as 3 dimensões e o objetivo) antes de coletar configurações
- **FR3:** Dev pode configurar identidade, nível inicial nas 3 dimensões, foco de evolução, path do Obsidian Vault e agentes instalados durante o setup
- **FR4:** Sistema pode informar sobre a comunidade CodeMaster durante o setup com opção de se inscrever imediatamente ou pular para inscrição posterior
- **FR5:** Dev pode reconfigurar o sistema com valores pré-preenchidos da configuração anterior
- **FR6:** Sistema pode detectar se Claude Code está instalado e injetar instruções no CLAUDE.md
- **FR7:** Sistema pode detectar se Codex está instalado e injetar comandos como **skills** no Codex
- **FR8:** Sistema pode detectar injeção prévia e substituí-la sem duplicar conteúdo
- **FR9:** Dev pode visualizar confirmação de cada etapa do setup com o resultado da ação executada

### Gestão de Quest (Missão Ativa)

- **FR10:** Dev pode iniciar uma Quest com título, ativando 3 perguntas de reflexão inicial guiadas pelo agente
- **FR11:** Durante a Quest, quando o dev responde uma das 3 perguntas de reflexão inicial de forma rasa (ex: resposta genérica ou muito curta), o agente pode pedir um nível a mais de detalhe sobre aquele contexto específico — sem entregar a resposta pelo dev
- **FR12:** Sistema pode criar nota estruturada no Obsidian Vault com contexto da Quest e respostas do dev
- **FR13:** Sistema pode registrar a Quest ativa em `~/.codemaster/active-quest.json` com título, path da nota e timestamp
- **FR14:** Dev pode registrar uma descoberta (Relic) durante uma Quest ativa, classificando-a como arquitetural, negocial ou orquestração de IA
- **FR15:** Sistema pode arquivar a Relic na nota da Quest ativa com timestamp e dimensão identificada
- **FR16:** Sistema pode arquivar a Relic também em `/relics/` quando for relevante além da quest atual
- **FR17:** Sistema pode ler a Quest ativa ao início de qualquer comando para contextualizar a sessão
- **FR18:** Sistema pode orientar o dev a criar uma Quest quando nenhuma está ativa e um comando dependente é chamado

### Ciclo de Victory (Encerramento)

- **FR19:** Dev pode encerrar uma Quest ativa via Victory, ativando 5 perguntas de reflexão final guiadas pelo agente
- **FR20:** Durante o Victory, quando o dev responde uma das 5 perguntas de reflexão final de forma rasa (ex: sem conectar a decisão ao impacto de negócio ou arquitetura), o agente pode pedir um nível a mais de profundidade — sem interpretar ou concluir pelo dev
- **FR21:** Sistema pode avaliar as respostas do Victory e atribuir tendências (↑ → ↓) para cada uma das 3 dimensões
- **FR22:** Sistema pode registrar a Victory com respostas, tendências e timestamp na nota da Quest
- **FR23:** Sistema pode atualizar o PROGRESS.md com a nova Victory e tendências acumuladas
- **FR24:** Sistema pode limpar o `active-quest.json` após Victory concluída
- **FR25:** Sistema pode detectar a 3ª Victory do usuário e exibir convite para opt-in na comunidade
- **FR26:** Dev pode optar por participar da comunidade informando email e telefone durante o fluxo de Victory
- **FR27:** Sistema pode enviar email e telefone para API externa de registro da comunidade com confirmação
- **FR28:** Sistema pode registrar o resultado do opt-in no config sem bloquear o fluxo se recusado

### Milestone & Progressão

- **FR29:** Sistema pode detectar a conclusão da 5ª Victory de um milestone e avançar automaticamente para o próximo
- **FR30:** Sistema pode criar `milestone-X-summary.md` com resumo de evolução, padrões emergentes nas 3 dimensões e maior relíquia do período
- **FR31:** Sistema pode **consolidar o aprendizado ao final de cada milestone** — organizando arquivos de Quest, Relic e Victory em subpastas de histórico (`milestone-X/`) e atualizando o KNOWLEDGE-MAP.md com os gaps identificados no período
- **FR32:** Agente pode **orientar o dev a estudar os gaps encontrados** ao encerrar um milestone, com base nas tendências e relíquias do período

### Legend (Histórico de Evolução)

- **FR33:** Dev pode visualizar o histórico completo de evolução — missões, relíquias, vitórias e tendências por dimensão
- **FR34:** Sistema pode exibir tendências acumuladas nas 3 dimensões com destaque para a última vitória e milestones concluídos
- **FR35:** Sistema pode exibir a maior relíquia do período e sugerir o foco para o próximo milestone

### Knowledge (Diagnóstico de Gaps)

- **FR36:** Dev pode solicitar diagnóstico de gaps baseado no histórico acumulado do vault
- **FR37:** Sistema pode ler quests, victories e relics do vault para extrair padrões de aprendizado por dimensão
- **FR38:** Sistema pode gerar ou atualizar o **KNOWLEDGE-MAP.md** — o documento mais importante do sistema — de forma clara, simples e navegável, com status por área (Para Estudar / Estudado / Praticado) e prioridade baseada em gaps reais
- **FR39:** Sistema pode gerar orientação sobre os conhecimentos que faltam para o próximo nível com base no KNOWLEDGE-MAP.md atualizado

### Integração com Agentes de IA

- **FR40:** Agente de IA (Claude Code) pode sugerir proativamente o uso do quest quando o dev inicia uma tarefa sem Quest ativa *(hipótese — a validar na semana 1)*
- **FR41:** Dev pode usar os 5 slash commands do CodeMaster em qualquer projeto aberto no Claude Code após o setup
- **FR42:** Dev pode usar os 5 momentos do CodeMaster como **skills no Codex** após o setup

### Persistência & Estrutura de Dados

- **FR43:** Sistema pode criar e manter estrutura de pastas por milestones no Obsidian Vault
- **FR44:** Sistema pode gerar frontmatter estruturado em todos os arquivos de Quest e Victory para consultas Dataview
- **FR45:** Sistema pode manter `config.json` atualizado com todas as preferências e estado do dev
- **FR46:** Sistema pode detectar e validar o path do Obsidian Vault durante o setup e em cada operação

### Documentação & Onboarding

- **FR47:** Dev pode acessar exemplos de uso via helper que demonstra um ciclo completo (quest + relic + victory) com respostas de exemplo
- **FR48:** Dev pode visualizar **exemplo dos arquivos gerados ao final de um milestone completo** — incluindo estrutura de pastas, notas de quest/victory/relic, milestone-summary e KNOWLEDGE-MAP.md — para entender claramente o resultado esperado do sistema
- **FR49:** Dev pode consultar referência de comandos e configuração via README do pacote

## Non-Functional Requirements

### Performance

- **NFR1:** O `codemaster setup` deve ser concluído em menos de 5 minutos do início ao fim em condições normais de filesystem
- **NFR2:** Operações de leitura e escrita no Obsidian Vault (criar nota, atualizar PROGRESS.md, arquivar Relic) devem ser concluídas em menos de 3 segundos em filesystems locais padrão
- **NFR3:** Leitura do `active-quest.json` no início de cada comando deve ser imperceptível (<100ms) para não interromper o fluxo do agente
- **NFR4:** O comando `/codemaster:knowledge` pode levar mais de 3 segundos quando o vault é grande — o agente deve informar ao dev que o processamento está em andamento

### Security

- **NFR5:** A coleta de email e telefone para opt-in da comunidade deve ocorrer somente após consentimento explícito do dev — nunca automaticamente
- **NFR6:** O envio de dados para a API da comunidade deve usar HTTPS obrigatoriamente — requisições HTTP simples devem ser rejeitadas
- **NFR7:** O `config.json` e `active-quest.json` armazenam dados em texto plano no filesystem local do usuário — o sistema não deve armazenar credenciais, tokens ou dados sensíveis nesses arquivos
- **NFR8:** A injeção no `CLAUDE.md` e `instructions.md` deve ser append-only com identificação clara do bloco — o sistema nunca deve sobrescrever conteúdo preexistente do usuário fora do bloco CodeMaster identificado
- **NFR9:** O sistema não deve fazer chamadas de rede além do opt-in da comunidade — o ciclo de aprendizado deve funcionar 100% offline

### Integration

- **NFR10:** A integração com o Obsidian Vault deve funcionar via filesystem puro — sem dependência de plugins, APIs ou processos do Obsidian em execução
- **NFR11:** A integração com Claude Code deve funcionar com qualquer versão que suporte o formato de slash commands em `~/.claude/commands/`
- **NFR12:** A integração com Codex deve funcionar via skills no formato suportado pela versão atual do Codex CLI
- **NFR13:** A API da comunidade deve retornar resposta em menos de 10 segundos — timeout deve ser tratado graciosamente sem falhar o fluxo de Victory
- **NFR14:** O sistema deve funcionar nos principais sistemas operacionais onde Node.js 18+ é suportado (macOS, Linux, Windows com WSL)
