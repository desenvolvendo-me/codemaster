---
stepsCompleted: ["step-01-init", "step-02-discovery", "step-02b-vision", "step-02c-executive-summary", "step-03-success", "step-04-journeys", "step-05-domain", "step-06-innovation", "step-07-project-type"]
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

---

## Product Scope

### MVP — Minimum Viable Product

**Ciclo completo dos 5 momentos:**
- `/codemaster:quest` — reflexão inicial + criação de nota Obsidian + `active-quest.json`
- `/codemaster:relic` — captura de descoberta na quest ativa + arquivo em `/relics/` se arquitetural
- `/codemaster:victory` — 5 perguntas de reflexão + avaliação por tendências nas 3 dimensões + atualização do PROGRESS.md
- `/codemaster:legend` — exibição do histórico de evolução por milestone
- `/codemaster:knowledge` — leitura do vault + extração de gaps + orientação do próximo nível

**Setup e integração:**
- `codemaster setup` interativo (identidade, nível, foco, Obsidian, injeção nos agentes)
- Injeção no Claude Code: `~/.claude/CLAUDE.md` + 5 slash commands
- Injeção no Codex: `~/.codex/instructions.md`
- Sugestão proativa: instrução no `CLAUDE.md`/`instructions.md` para o agente sugerir quest (comportamento do agente, não lógica CLI)
- Obsidian: estrutura de pastas por milestones + frontmatter para Dataview

**Milestones automáticos:** avanço a cada 5 victories + criação de `milestone-X-summary.md`

### Growth Features (Post-MVP)

- Versão web simples para visualização de evolução individual e de time
- Dashboard para CTO/tech lead com relatório de produtividade por dimensão
- Knowledge com sugestão de recursos específicos (artigos, projetos práticos) baseados nos gaps
- Canvas automático do Obsidian com mapa visual da jornada

### Vision (Future)

- Marketplace de métodos: outros mentores publicam seus próprios "20 anos" no formato CodeMaster
- Sincronização de vault para visibilidade de time sem perder o modelo local-first
- Portfólio de conhecimento navegável por empresa — mapa real de especialização do time
- Geração de relatório comparativo: "o dev do Milestone 1 vs. o dev de hoje"

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
| `/codemaster:relic [descoberta]` | Slash command (agente) | Lê `active-quest.json`; registra na quest ativa; arquiva em `/relics/` se arquitetural |
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
