---
id: "Q006"
type: "quest"
title: "Notificações em tempo real"
date: "2026-03-18"
milestone: 2
tags: ["codemaster","quest"]
relics: ["R006"]
---

# Quest: Notificações em tempo real

## Pergunta Âncora

Como entregar notificações ao usuário no momento em que acontecem (aprovação
de pedido, mensagem do suporte) sem depender de polling que atrasa até 30s
e sobrecarrega o servidor?

## Reflexões por Dimensão

### Negócio
- **Por que esse problema existe?** 40% dos usuários veem notificações com
  24h+ de atraso. Notificação de aprovação de pedido entregue em 5s gera ação
  imediata — a mesma notificação 24h depois é ignorada.
- **Qual o impacto de fazer errado?** Usuários perdem atualizações críticas.
  "Não vi a notificação" é o top 3 motivo de ticket no suporte.
- **O que aprendi sobre o domínio?** Notificações têm janela de relevância.
  Chat precisa ser bidirecional, notificações não.

### Arquitetura
- **Qual padrão de design foi aplicado?** Ainda decidindo entre WebSocket
  puro (ws) e Socket.io. SSE pode resolver notificações sem bidirecional.
- **O que poderia ter sido feito diferente?** (em andamento)
- **Quais trade-offs foram feitos?** (em andamento)

### IA / Orquestração
- **Como a IA me ajudou nessa quest?** Claude comparou WebSocket vs SSE com
  critérios objetivos e sugeriu SSE para notificações (unidirecional) e
  WebSocket apenas para chat (bidirecional).
- **O que a IA errou ou eu precisei corrigir?** (em andamento)
- **O que eu sei hoje que não sabia antes?** SSE é suficiente para 80% dos
  casos de "real-time". Só precisa WebSocket quando o cliente envia dados.

## Notas de Desenvolvimento

| Critério | WebSocket | SSE |
|----------|-----------|-----|
| Direção | Bidirecional | Server → Client |
| Reconexão | Manual | Automática |
| Bundle size | ~40KB (socket.io) | 0 (nativo) |
| Use case | Chat | Notificações |

## Relic desta Quest
- [[R006-websocket-vs-sse-decisao-arquitetural]] — árvore de decisão WS vs SSE
