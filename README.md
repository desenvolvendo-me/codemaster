# CodeMaster — AI Engineer Evolution Agent

> Transforme cada demanda de desenvolvimento em aprendizado estruturado.

CodeMaster é um agente instalado localmente que acompanha seu desenvolvimento
e transforma cada tarefa em crescimento mensurável nas 3 dimensões que definem
um engenheiro completo: **Negócio**, **Arquitetura** e **Orquestração de IA**.

Tudo roda 100% offline. Seus dados ficam no **Obsidian**, na sua máquina.

---

## Instalação

```bash
npm install -g codemaster
```

**Requisitos:** Node.js 18+ · Obsidian · Claude Code ou Codex CLI
---
## Configuração

```bash
codemaster setup    # instala e configura (< 5 min)
codemaster guide    # explica o método com fluxo completo
codemaster sample   # mostra exemplos reais de output
```

O wizard interativo (< 5 minutos) irá:

1. Criar seu perfil de herói — nome, nível, stack, auto-avaliação nas 3 dimensões
2. Configurar o Vault do Obsidian — onde quests, relics e victories serão salvas
3. Conectar ao GitHub — repositório privado opcional para backup do vault
4. Integrar com seus agentes de coding — Claude Code e/ou Codex CLI

Para reconfigurar ou reinstalar as integrações:

```bash
codemaster setup
```

---

## Os 5 Momentos

| Momento | Slash Command | Quando usar |
|---|---|---|
| Quest | `/codemaster:quest` | Ao iniciar uma nova tarefa de desenvolvimento |
| Relic | `/codemaster:relic` | Ao fazer uma descoberta importante durante a quest |
| Victory | `/codemaster:victory` | Ao concluir a quest com reflexão estruturada |
| Legend | `/codemaster:legend` | Para visualizar seu histórico e evolução |
| Knowledge | `/codemaster:knowledge` | Para mapear seus gaps de aprendizado |
| Guide | `/codemaster:guide` | Onboarding completo com fluxo e exemplos |

---

## Onboarding

**No terminal** — antes de começar:

```bash
codemaster guide    # explica o método com fluxo completo (ASCII)
codemaster sample   # mostra exemplos reais de output (quest, milestone, knowledge map)
```

**No Claude Code / Codex** — a qualquer momento:

```
/codemaster:guide
```

Apresenta o ciclo completo dos 5 momentos, as 3 dimensões de evolução,
a estrutura do vault e ponteiros para os exemplos reais.

---

## Slash Commands

### `/codemaster:quest "nome da missão"`

Inicia uma nova missão de desenvolvimento. O agente faz uma pergunta âncora
e depois 3 perguntas contextuais — uma por dimensão (Negócio, Arquitetura, IA)
— para que você pense conscientemente antes de codar.

```
/codemaster:quest "Implementar cache Redis no serviço de produtos"
```

Cria `quests/Q{id}-{slug}.md` no vault e registra a quest como ativa.

---

### `/codemaster:relic "descoberta"`

Registra uma descoberta ou decisão importante durante uma quest ativa.
O agente classifica a dimensão e adiciona a relic na nota da quest.

```
/codemaster:relic "TTL de 5min causa inconsistência quando produto é editado"
```

Opcionalmente arquiva a relic em `relics/` se for relevante além da quest atual.

---

### `/codemaster:victory`

Encerra a quest ativa com reflexão estruturada. O agente lê os commits recentes,
faz 5 perguntas cobrindo impacto de negócio, decisão arquitetural e uso de IA,
e atribui scores de 0–10 por dimensão.

```
/codemaster:victory
```

Atualiza a nota da quest com a seção Victory, registra no `PROGRESS.md`
e remove a quest ativa.

---

### `/codemaster:legend`

Exibe seu histórico completo de evolução. Lê as victories do vault e apresenta:
tendências por dimensão (↑→↓), victories agrupadas por milestone, a relic de
maior score e a dimensão com maior potencial de foco.

```
/codemaster:legend
```

---

### `/codemaster:knowledge`

Analisa todas as victories do vault (mínimo 3) e gera um diagnóstico de gaps.
Atualiza `KNOWLEDGE-MAP.md` com lacunas por dimensão, status de cada gap
(Para Estudar / Estudado / Praticado) e os 3 gaps prioritários para o próximo nível.

```
/codemaster:knowledge
```

---

## Estrutura do Vault

Após o setup, seu vault Obsidian terá:

```
seu-vault/
├── quests/          ← notas de quest e victory (uma por missão)
├── relics/          ← descobertas arquivadas e reutilizáveis
├── PROGRESS.md      ← histórico de victories por milestone
└── KNOWLEDGE-MAP.md ← mapa de gaps atualizado pelo /knowledge
```

Após o primeiro milestone completo (5ª Victory):

```
seu-vault/
└── M01-summary.md   ← summary automático do milestone
```

---

## Schema do config.json

Após o setup, `~/.codemaster/config.json` conterá:

```json
{
  "hero": {
    "name": "Ricardo",
    "role": "senior",
    "stack": ["JavaScript", "Ruby"]
  },
  "dimensions": {
    "business": 3,
    "architecture": 4,
    "ai_orchestration": 2
  },
  "focus": ["business", "ai_orchestration"],
  "obsidian": {
    "vault_path": "/Users/ricardo/Documents/CodeMaster"
  },
  "agents": {
    "claude_code": true,
    "codex": false
  },
  "github": "https://github.com/ricardo/codemaster-vault"
}
```

---

## Exemplos

Veja [`templates/obsidian-example/`](templates/obsidian-example/) para um exemplo
completo de output real do sistema após um milestone, incluindo:

- `quests/Q001-exemplo-quest.md` — quest completa com reflexões e Victory com scores
- `relics/R001-vulnerabilidade-algorithm-none-em-jwt.md` — relic arquitetural realista
- `M01-summary.md` — summary de milestone com wikilinks e padrões emergentes
- `KNOWLEDGE-MAP.md` — mapa de gaps com status e wikilinks de origem

Leia o [`templates/obsidian-example/README.md`](templates/obsidian-example/README.md)
para um walkthrough do ciclo completo quest → relic → victory.

---

## As 3 Dimensões de Evolução

| Dimensão | O que avalia |
|---|---|
| **Negócio** | Entendimento de valor, impacto de decisões, comunicação com stakeholders |
| **Arquitetura** | Qualidade das decisões técnicas, trade-offs, escalabilidade |
| **Orquestração de IA** | Uso estratégico de LLMs, agentes e automação no workflow |

Cada Victory gera scores de 0–10 por dimensão. Ao longo dos milestones,
as tendências revelam onde você está evoluindo e onde focar a seguir.

---

## Compatibilidade

- **macOS e Linux** — suporte completo
- **Windows** — recomendado via WSL 2
- **Funciona 100% offline** — nenhum dado enviado para servidores externos
- **Setup em menos de 5 minutos**

---

## Documentação Local

O projeto inclui um site de documentação em `docs/` publicado com Astro + Starlight pela pasta `website/`.

**Pré-requisito:** Node.js `22.12+` para rodar o site de documentação.

Da raiz do repositório:

```bash
npm run docs:dev
```

Sobe a documentação localmente em modo de desenvolvimento.

```bash
npm run docs:build
```

Gera o site estático em `build/site/`.

```bash
npm run docs:preview
```

Abre uma prévia local da versão já buildada.

Os scripts `docs:*` tentam usar Node 22 automaticamente via `nvm` quando necessário.

---

## License

MIT
