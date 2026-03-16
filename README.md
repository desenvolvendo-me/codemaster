# ⚔ CodeMaster

> AI Engineer Evolution Agent — mentor de engenharia com alma de RPG medieval

CodeMaster é um agente instalado localmente que transforma cada demanda de desenvolvimento em aprendizado estruturado. Cada missão que você inicia, cada relíquia que coleta e cada vitória que conquista fica salva no **Obsidian**, na sua máquina, com backup automático no **GitHub**.

---

## Instalação

```bash
npm install -g codemaster
codemaster setup
```

O setup interativo vai:

1. **Forjar sua identidade de herói** — nome, cargo, stack, objetivo
2. **Medir seus atributos** — nível nas 3 dimensões (negócio, arquitetura, IA)
3. **Configurar o Grimório** — instalar Obsidian e criar seu Vault
4. **Conectar ao Oráculo** — criar repositório privado no GitHub
5. **Selar a aliança** — injetar instruções nos seus agentes de coding

---

## Uso diário

### Dentro do Claude Code / Cursor (recomendado)

```
@codemaster quest "Implementar cache Redis"
@codemaster relic "Optei por TTL de 5min — SLA exige atualização a cada ciclo"
@codemaster relic "Cuidado: invalidação de cache quando a propriedade é editada"
@codemaster victory
@codemaster legend
```

### No terminal

```bash
codemaster quest "Implementar cache Redis"
codemaster relic "Optei por TTL de 5min"
codemaster victory
codemaster legend
```

---

## Os 4 Comandos

| Comando | Ação |
|---|---|
| `quest "nome"` | Inicia uma missão. O agente faz 3 perguntas de reflexão antes de você começar. |
| `relic "texto"` | Registra uma descoberta importante no meio do caminho. |
| `victory` | Finaliza a missão com 5 perguntas de reflexão épica. Gera insight no Obsidian. |
| `legend` | Exibe sua lenda — progresso, vitórias e relíquias conquistadas. |

---

## As 3 Dimensões de Evolução

| Dimensão | O que avalia |
|---|---|
| 🏢 Negócio | Entendimento de valor, impacto de decisões, comunicação com stakeholders |
| 🏗️ Arquitetura | Qualidade das decisões técnicas, tradeoffs, escalabilidade |
| 🤖 Orquestração de IA | Uso estratégico de LLMs, agentes e automação |

---

## O que é criado no Obsidian

```
~/CodeMaster/
├── quests/          # Uma nota por missão (demanda)
├── relics/          # Descobertas e aprendizados reutilizáveis
├── victories/       # Reflexões finais + insights do agente
├── legend/          # Sua evolução nas 3 dimensões
│   └── PROGRESS.md
├── knowledge/       # Aprendizados consolidados
└── .codemaster/     # Configuração interna do agente
    ├── AGENT.md     # Instruções do agente (comportamento)
    ├── IDENTITY.md  # Seu perfil de herói
    ├── SOUL.md      # Tom e personalidade do agente
    └── TOOLS.md     # Capacidades e caminhos
```

---

## Integração com agentes de coding

### Claude Code
O setup cria `CLAUDE.md` com instruções dos subagentes. O Claude Code lê automaticamente e sabe o que fazer quando você digita `@codemaster`.

### Cursor
O setup cria `.cursor/rules` com as mesmas instruções.

### Codex CLI
```bash
codex --instructions ~/.codemaster/codex-instructions.md
```

---

## Backup com GitHub

Durante o setup, o CodeMaster abre o GitHub para criar um repositório privado. Depois:

1. Abra o Obsidian
2. Instale o plugin **Obsidian Git** (Settings → Community plugins)
3. Configure o repositório — ele commitará automaticamente

---

## Privacidade

Tudo roda 100% local. Nenhum dado é enviado para servidores externos.
O backup no GitHub fica no seu repositório privado, sob seu controle.

---

## Configuração

| Local | Conteúdo |
|---|---|
| `~/.codemaster/config.json` | Configuração do agente |
| `~/.codemaster/active-quest.json` | Estado da missão ativa |
| `~/CodeMaster/` | Vault do Obsidian (configurável no setup) |

---

## Publicar no npm

```bash
# Login no npm
npm login

# Publicar
npm publish

# Usuários instalam com:
npm install -g codemaster
```

---

## License

MIT
