---
id: "R006"
type: "relic"
title: "WebSocket vs SSE — árvore de decisão arquitetural"
date: "2026-03-18"
milestone: 2
tags: ["codemaster","relic","architecture"]
dimension: "architecture"
source_quest: "Q006"
---

# Relic: WebSocket vs SSE — árvore de decisão arquitetural

## Descoberta

SSE (Server-Sent Events) resolve 80% dos casos de "real-time". WebSocket só é
necessário quando o cliente precisa enviar dados ao servidor (chat, collaborative
editing). A maioria dos devs assume "real-time = WebSocket" desnecessariamente.

## Por que importa

Escolher WebSocket quando SSE basta adiciona 40KB de bundle (Socket.io),
gerenciamento de conexão complexo, e reconexão manual. SSE é nativo do browser,
zero dependências, reconexão automática.

## Árvore de decisão

```
O cliente precisa ENVIAR dados ao servidor?
├── NÃO → SSE
│   ├── Notificações push
│   ├── Dashboard ao vivo
│   └── Feed de atividade
└── SIM → WebSocket
    ├── Chat bidirecional
    ├── Collaborative editing
    └── Streaming de arquivos
```

## Implementação mínima de SSE

```js
// Servidor — 5 linhas
app.get('/events', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  })
  const send = (data) => res.write(`data: ${JSON.stringify(data)}\n\n`)
})

// Cliente — 2 linhas, zero dependências
const source = new EventSource('/events')
source.onmessage = (e) => console.log(JSON.parse(e.data))
```

## Score desta Relic
- Arquitetura: 7.5

## Fonte
[[Q006-notificacoes-tempo-real]]
