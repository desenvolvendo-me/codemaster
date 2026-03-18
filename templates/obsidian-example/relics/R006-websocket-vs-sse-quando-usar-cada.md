---
id: "R006"
type: "relic"
title: "WebSocket vs SSE — quando usar cada um"
date: "2026-03-18"
milestone: 2
tags: ["codemaster","relic","real-time"]
dimension: "architecture"
source_quest: "Q006"
---

# Relic: WebSocket vs SSE — quando usar cada um

## Descoberta

Server-Sent Events (SSE) é suficiente para 80% dos casos de "real-time".
WebSocket só é necessário quando o cliente precisa enviar dados ao servidor
(chat, jogos, collaborative editing).

## Por que importa

Muitos devs assumem que "real-time" = WebSocket. Isso leva a over-engineering
com Socket.io (40KB no bundle, gerenciamento de conexão complexo) quando SSE
nativo do browser resolveria com zero dependências.

## Tabela de decisão

| Preciso de... | Use |
|---------------|-----|
| Notificações push | SSE |
| Dashboard ao vivo | SSE |
| Feed de atividade | SSE |
| Chat bidirecional | WebSocket |
| Collaborative editing | WebSocket |
| Streaming de arquivos | WebSocket |

## Implementação mínima de SSE

```js
// Servidor (Node.js)
app.get('/events', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  })
  const send = (data) => res.write(`data: ${JSON.stringify(data)}\n\n`)
  // SSE reconecta automaticamente se a conexão cair
})

// Cliente (browser nativo, zero dependências)
const source = new EventSource('/events')
source.onmessage = (e) => console.log(JSON.parse(e.data))
```

## Contexto de aplicação

Válido para qualquer stack web. SSE é suportado nativamente em todos os
browsers modernos. Para mobile (React Native), SSE funciona via polyfill.

## Score desta Relic
- Arquitetura: 7.5

## Fonte
[[Q006-implementar-websockets]]
