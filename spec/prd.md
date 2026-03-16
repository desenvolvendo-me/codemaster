# CodeMaster — Resumo da Ideia e Solução

## O Problema

Desenvolvedores acumulam anos de experiência mas raramente transformam
essa experiência em aprendizado estruturado. Decisões arquiteturais se
perdem, erros se repetem, aprendizados não são registrados e a evolução
profissional acontece de forma inconsciente — sem direção, sem mapa.

Em especial, devs que querem se tornar **orquestradores de IA** não têm
referência de como evoluir de forma estruturada nas 3 dimensões que importam:
pensar em negócio, projetar arquiteturas e usar IA estrategicamente.

---

## A Ideia

Criar um agente mentor que vive dentro dos agentes de coding que o dev
já usa (Claude Code, Codex) e acompanha cada demanda do início ao fim —
fazendo as perguntas certas no momento certo, sem tirar o dev do fluxo
de trabalho.

A metáfora é RPG medieval: cada demanda é uma **missão (quest)**, cada
descoberta é uma **relíquia (relic)**, cada entrega é uma **vitória
(victory)**. O histórico completo da jornada fica no **Obsidian**,
versionado no GitHub.

---

## Público-Alvo

Devs que querem evoluir para **orquestradores de IA** — profissionais que
entendem o negócio, projetam arquiteturas robustas e usam IA de forma
estratégica e produtiva no desenvolvimento.

Perfil típico:
- Desenvolve sozinho ou em squad pequeno
- Já usa Claude Code e/ou Codex no dia a dia
- Quer estruturar o próprio aprendizado em vez de acumular experiência às cegas
- Usa ou quer usar Obsidian como segundo cérebro

---

## A Solução — CodeMaster

Pacote npm instalado globalmente na máquina do dev.

```bash
npm install -g @marcodotcastro/codemaster
codemaster setup
```

### Como funciona no dia a dia

O dev nunca sai do editor. Tudo via `/codemaster:`:

```
/codemaster:quest "Implementar cache Redis"
→ agente faz 3 perguntas de reflexão antes de começar
→ cria nota no Obsidian com o contexto
→ registra missão ativa em ~/.codemaster/active-quest.json

/codemaster:relic "Optei por TTL de 5min — SLA exige atualização frequente"
→ lê a missão ativa de ~/.codemaster/active-quest.json
→ registra a descoberta na quest ativa com timestamp
→ se for decisão arquitetural, arquiva também em /relics/

/codemaster:victory
→ lê a missão ativa para contextualizar
→ conduz 5 perguntas de reflexão final
→ gera análise nas 3 dimensões com tendências (↑ → ↓)
→ atualiza o histórico de evolução e limpa active-quest.json

/codemaster:legend
→ exibe o progresso — missões, relíquias, vitórias
→ tendências nas 3 dimensões por milestone

/codemaster:knowledge
→ lê automaticamente quests, victories e relics do vault
→ extrai e organiza aprendizados por dimensão
→ gera KNOWLEDGE-MAP.md com status: Para Estudar / Estudado / Praticado
```

---

## As 3 Dimensões de Evolução

O agente avalia cada missão em três eixos:

| Dimensão | O que observa |
|---|---|
| 🏢 Negócio | O dev articula impacto de negócio? Pensa além do técnico? |
| 🏗️ Arquitetura | As decisões técnicas são justificadas? Considera tradeoffs? |
| 🤖 Orquestração de IA | Usa IA de forma estratégica? Vai além do básico? |

Não usa notas absolutas — usa **tendências** (↑ crescendo / → estável / ↓ atenção).

### Como as tendências são determinadas

Ao encerrar uma victory, o VictoryHerald analisa as 5 respostas e atribui
uma tendência por dimensão com base nas seguintes regras:

- **↑ Crescendo** — dev demonstrou evolução clara em relação ao baseline ou última vitória (articulou impacto, justificou decisão, usou IA estrategicamente)
- **→ Estável** — dev manteve o mesmo nível, sem regressão nem salto evidente
- **↓ Atenção** — dev não abordou a dimensão, demonstrou dificuldade ou repetiu um erro conhecido

As tendências são registradas no `legend/PROGRESS.md` e nas notas de vitória.

---

## Memória Entre Sessões

O CodeMaster mantém contexto entre sessões via arquivo local:

### `~/.codemaster/active-quest.json`

```json
{
  "title": "Implementar cache Redis",
  "file": "/path/to/vault/quests/milestone-1/2026-01-10-cache-redis.md",
  "started": "2026-01-10T14:30:00Z",
  "milestone": 1
}
```

- Criado pelo agente ao executar `/codemaster:quest`
- Lido pelo agente ao executar `/codemaster:relic` e `/codemaster:victory`
- Limpo (deletado) após `/codemaster:victory` ser concluído
- O agente deve sempre ler este arquivo no início de cada comando para
  contextualizar a sessão atual

---

## Milestones — A Jornada Organizada

A cada **5 vitórias concluídas**, o sistema avança para um novo milestone.
O milestone organiza as pastas no Obsidian e serve como unidade de
progresso visível.

### O que acontece a cada milestone

Ao registrar a 5ª vitória do milestone, o VictoryHerald:

1. Cria `legend/milestone-X-summary.md` com resumo de evolução
2. Move os arquivos para a subpasta `milestone-X/` correspondente
3. Identifica padrões emergentes nas 3 dimensões
4. Destaca a maior relíquia do período
5. Sugere o foco para o próximo milestone

---

## O que fica no Obsidian

Toda a inteligência do agente vive em arquivos Markdown locais com
estrutura organizada por milestones:

```
~/CodeMaster/
├── quests/
│   ├── milestone-1/
│   │   ├── 2026-01-10-cache-redis.md
│   │   └── 2026-01-15-auth-jwt.md
│   └── milestone-2/
│       └── ...
├── relics/
│   └── 2026-01-15-ttl-sla-decisao.md
├── victories/
│   ├── milestone-1/
│   │   └── 2026-01-20-cache-redis-victory.md
│   └── milestone-2/
├── legend/
│   ├── PROGRESS.md
│   ├── milestone-1-summary.md
│   └── milestone-2-summary.md
├── knowledge/
│   └── KNOWLEDGE-MAP.md
└── .codemaster/
    ├── AGENT.md
    ├── IDENTITY.md
    ├── SOUL.md
    └── TOOLS.md
```

### Frontmatter para Dataview

Todos os arquivos de quest e victory incluem frontmatter estruturado
para permitir consultas dinâmicas no Obsidian:

```yaml
---
title: Implementar cache Redis
date: 2026-01-10
milestone: 1
status: victory
dimensions:
  business: "→"
  architecture: "↑"
  ai: "→"
tags: [quest, milestone-1, cache, redis]
---
```

### Recursos Obsidian utilizados

| Recurso | Como é usado |
|---|---|
| **Dataview** | Consultas por milestone, status, dimensão e tags |
| **Canvas** | Mapa visual da jornada por milestone (gerado pelo knowledge) |
| **Graph View** | Visualização de conexões entre quests, relics e victories |
| **Tags** | Organização por milestone, dimensão e stack |
| **Wikilinks** | Links entre quest ↔ relic ↔ victory relacionados |

### Exemplos de consultas Dataview

```dataview
TABLE date, dimensions.architecture AS Arquitetura
FROM "quests/milestone-1"
WHERE status = "victory"
SORT date ASC
```

```dataview
LIST
FROM "relics"
WHERE contains(tags, "arquitetura")
```

---

## Primeiros Passos (Onboarding)

Após `codemaster setup`, o dev recebe orientação direta de como começar:

1. Abra o Claude Code ou Codex no seu projeto atual
2. Use `/codemaster:quest "nome da próxima demanda que vai trabalhar"`
3. Responda as 3 perguntas de reflexão inicial
4. Trabalhe normalmente na demanda
5. Sempre que descobrir algo relevante: `/codemaster:relic "descoberta"`
6. Ao finalizar a demanda: `/codemaster:victory`

A primeira quest é o ponto de partida — não há configuração adicional.

---

## Integração com Agentes de Coding

O setup injeta instruções nos agentes instalados:

| Agente | O que é injetado |
|---|---|
| Claude Code | `~/.claude/CLAUDE.md` com instruções globais + 5 slash commands em `~/.claude/commands/codemaster/` |
| Codex CLI | `~/.codex/instructions.md` com as mesmas instruções globais |

### Slash commands no Claude Code

Disponíveis via `/codemaster:` em qualquer projeto:

| Comando | Função |
|---|---|
| `/codemaster:quest` | Iniciar nova missão |
| `/codemaster:relic` | Registrar descoberta |
| `/codemaster:victory` | Encerrar missão com reflexão |
| `/codemaster:legend` | Ver progresso da jornada |
| `/codemaster:knowledge` | Gerar mapa de conhecimento |

---

## Setup — O que acontece no `codemaster setup`

O setup interativo guia o dev em 5 etapas:

1. **Identidade do Herói** — nome, cargo (select), stack (top 10 linguagens), nível de experiência
2. **Atributos** — nível 1–5 em cada uma das 3 dimensões (baseline inicial)
3. **Foco** — quais dimensões priorizar nas próximas 10 demandas
4. **Grimório (Obsidian)** — detecta instalação, configura o caminho do Vault
5. **Aliança** — detecta Claude Code e Codex instalados, injeta as instruções

Na reconfiguração, todos os valores anteriores são pré-preenchidos.

---

## Princípios da Solução

| Princípio | Como se aplica |
|---|---|
| **Baixa fricção** | Dev responde perguntas curtas, agente estrutura tudo |
| **Dentro do editor** | `/codemaster:` sem sair do Claude Code / Codex |
| **Local-first** | Tudo em Markdown na máquina, zero dependência de nuvem |
| **Memória persistente** | `active-quest.json` mantém contexto entre sessões |
| **Progressivo** | Milestones a cada 5 vitórias; com 100+ missões cria mapa real de padrões |
| **RPG como linguagem** | Quest / Relic / Victory / Legend — vocabulário que engaja |

---

## Arquitetura Técnica

- **Runtime:** Node.js 18+ / ESM puro
- **CLI:** `bin/codemaster.js` → `src/index.js` → `src/commands/`
- **Missão ativa:** `~/.codemaster/active-quest.json`
- **Configuração:** `~/.codemaster/config.json`
- **Análise:** feita pelo agente de IA (Claude/Codex) com base nas respostas do dev — sem chamadas de API externas no CLI
- **Publicação:** `npm publish --access public` → `npm install -g @marcodotcastro/codemaster`

---

## Visão de Longo Prazo

Com o histórico acumulado por milestones, o sistema consegue:

- Identificar **padrões de erro** que se repetem entre missões
- Mapear **áreas de especialização** emergentes nas 3 dimensões
- Sugerir **próximos estudos** baseados em gaps reais observados
- Criar um **portfólio de conhecimento** navegável no Obsidian com Canvas e Dataview
- Gerar um **relatório de evolução** comparando o dev do milestone 1 com o atual

A diferença de todas as outras ferramentas:

> A maioria gerencia tarefas. O CodeMaster desenvolve engenheiros.
