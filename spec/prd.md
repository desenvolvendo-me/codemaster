# CodeMaster — Resumo da Ideia e Solução

## O Problema

Desenvolvedores acumulam anos de experiência mas raramente transformam
essa experiência em aprendizado estruturado. Decisões arquiteturais se
perdem, erros se repetem, aprendizados não são registrados e a evolução
profissional acontece de forma inconsciente — sem direção, sem mapa.

---

## A Ideia

Criar um agente mentor que vive dentro dos agentes de coding que o dev
já usa (Claude Code, Cursor, Codex) e acompanha cada demanda do início
ao fim — fazendo as perguntas certas no momento certo, sem tirar o dev
do fluxo de trabalho.

A metáfora é RPG medieval: cada demanda é uma **missão (quest)**, cada
descoberta é uma **relíquia (relic)**, cada entrega é uma **vitória
(victory)**. O histórico completo da jornada fica no **Obsidian**,
versionado no GitHub.

---

## A Solução — CodeMaster

Pacote npm instalado globalmente na máquina do dev.

```bash
npm install -g codemaster
codemaster setup
```

### Como funciona no dia a dia

O dev nunca sai do editor. Tudo via `@codemaster`:

```
@codemaster quest "Implementar cache Redis"
→ agente faz 3 perguntas de reflexão antes de começar
→ cria nota no Obsidian com o contexto

@codemaster relic "Optei por TTL de 5min — SLA exige atualização frequente"
→ registra a descoberta na missão ativa
→ se for decisão arquitetural, arquiva também em /relics/

@codemaster victory
→ agente conduz 5 perguntas de reflexão final
→ gera insight nas 3 dimensões
→ atualiza o histórico de evolução

@codemaster legend
→ exibe o progresso — missões, relíquias, vitórias
→ barra visual de nível nas 3 dimensões
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

---

## O que fica no Obsidian

Toda a inteligência do agente vive em arquivos Markdown locais:

```
~/CodeMaster/
├── quests/       → uma nota por demanda (contexto + relíquias + reflexão)
├── relics/       → descobertas reutilizáveis arquivadas
├── victories/    → reflexões finais + insights gerados
├── legend/       → evolução nas 3 dimensões ao longo do tempo
└── .codemaster/  → instruções internas do agente
    ├── AGENT.md      (comportamento do agente)
    ├── IDENTITY.md   (perfil do dev)
    ├── SOUL.md       (tom e personalidade)
    └── TOOLS.md      (capacidades e caminhos)
```

O dev visualiza tudo no Obsidian com formatação rica e pode commitar
para um repositório GitHub privado com o plugin Obsidian Git.

---

## Integração com Agentes de Coding

O setup injeta instruções nos agentes instalados:

| Agente | Como integra |
|---|---|
| Claude Code | `CLAUDE.md` com 4 subagentes descritos |
| Cursor | `.cursor/rules` com as mesmas instruções |
| Codex CLI | `~/.codemaster/codex-instructions.md` via `--instructions` |

O `CLAUDE.md` define 4 subagentes nomeados:

- **QuestMaster** → responde `@codemaster quest`
- **RelicKeeper** → responde `@codemaster relic`
- **VictoryHerald** → responde `@codemaster victory`
- **LegendKeeper** → responde `@codemaster legend`

---

## Setup — O que acontece no `npm install -g codemaster`

O setup interativo guia o dev em 5 etapas:

1. **Identidade do Herói** — nome, cargo, stack, objetivo profissional
2. **Atributos** — nível 1–5 em cada uma das 3 dimensões (baseline)
3. **Grimório (Obsidian)** — detecta instalação, configura o Vault local
4. **Oráculo (GitHub)** — abre github.com/new, salva URL do repo privado
5. **Aliança** — detecta agentes instalados, injeta as instruções

---

## Princípios da Solução

| Princípio | Como se aplica |
|---|---|
| **Baixa fricção** | Dev responde perguntas curtas, agente estrutura tudo |
| **Dentro do editor** | `@codemaster` sem sair do Claude Code / Cursor |
| **Local-first** | Tudo em Markdown na máquina, zero dependência de nuvem |
| **Progressivo** | Com 5+ missões o agente identifica padrões; com 100+ cria mapa real |
| **RPG como linguagem** | Quest / Relic / Victory / Legend — vocabulary que engaja |

---

## Arquitetura Técnica

- **Runtime:** Node.js 18+ / ESM puro
- **CLI:** `bin/codemaster.js` → `src/index.js` → `src/commands/`
- **Estado da missão ativa:** `~/.codemaster/active-quest.json`
- **Configuração:** `~/.codemaster/config.json`
- **Análise:** heurística local por keywords (sem chamar API externa na v0.1)
- **Publicação:** `npm publish` — qualquer dev instala com `npm install -g codemaster`

---

## Visão de Longo Prazo

Com o histórico acumulado, o sistema consegue:

- Identificar **padrões de erro** que se repetem entre missões
- Mapear **áreas de especialização** emergentes
- Sugerir **próximos estudos** baseados em gaps reais observados
- Criar um **portfólio de conhecimento** navegável no Obsidian

A diferença de todas as outras ferramentas:

> A maioria gerencia tarefas. O CodeMaster desenvolve engenheiros.