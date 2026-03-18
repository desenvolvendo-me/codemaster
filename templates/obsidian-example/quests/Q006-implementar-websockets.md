---
id: "Q006"
type: "quest"
title: "Implementar comunicação real-time com WebSockets"
date: "2026-03-18"
milestone: 2
tags: ["codemaster","quest"]
relics: ["R006"]
---

# Quest: Implementar comunicação real-time com WebSockets

## Pergunta Âncora

Como implementar comunicação bidirecional em tempo real entre cliente e
servidor, decidindo entre WebSockets e Server-Sent Events para o caso de
notificações e chat?

## Reflexões por Dimensão

### Negócio
- **Por que esse problema existe?** Usuários reclamam que precisam recarregar
  a página para ver novas notificações. Chat interno entre usuários do sistema
  foi solicitado pelo produto há 2 sprints.
- **Qual o impacto de fazer errado?** Polling desperdiça recursos do servidor
  e dá UX ruim. WebSocket mal implementado gera memory leaks e conexões órfãs.
- **O que aprendi sobre o domínio?** A feature de chat tem prioridade maior
  que o dashboard real-time. Chat precisa de bidirecional, notificações não.

### Arquitetura
- **Qual padrão de design foi aplicado?** Ainda decidindo entre WebSocket puro
  (ws) e Socket.io. Socket.io tem fallback automático mas adiciona 40KB no bundle.
- **O que poderia ter sido feito diferente?** (em andamento)
- **Quais trade-offs foram feitos?** (em andamento)

### IA / Orquestração
- **Como a IA me ajudou nessa quest?** Claude comparou WebSocket vs SSE com
  tabela de trade-offs e sugeriu usar SSE para notificações (unidirecional) e
  WebSocket apenas para o chat (bidirecional).
- **O que a IA errou ou eu precisei corrigir?** (em andamento)
- **O que eu sei hoje que não sabia antes?** SSE é suficiente para 80% dos
  casos de "real-time" — só precisa de WebSocket quando o cliente envia dados.

## Notas de Desenvolvimento

Comparação de trade-offs em andamento:

| Critério | WebSocket | SSE |
|----------|-----------|-----|
| Direção | Bidirecional | Server → Client |
| Protocolo | ws:// | HTTP |
| Reconexão | Manual | Automática |
| Bundle size | ~40KB (socket.io) | 0 (nativo) |
| Use case | Chat | Notificações |

## Relic desta Quest
- [[R006-websocket-vs-sse-quando-usar-cada]] — tabela de decisão WS vs SSE
