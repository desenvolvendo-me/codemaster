# Story 5.2: Dev realiza opt-in e dados são registrados na API

Status: ready-for-dev

## Story

Como developer (Ricardo),
quero fornecer meu email e telefone para participar da comunidade,
para que eu seja registrado como membro e tenha acesso ao canal de comunicação da comunidade CodeMaster.

## Acceptance Criteria

1. **Dado** que dev escolheu participar da comunidade (Story 5.1)
   **Quando** dev fornece email e telefone válidos
   **Então** dados são enviados via HTTPS POST para a API da comunidade com payload `{email, phone, heroName, stack, version}`
   **E** requisição tem timeout de 10 segundos
   **E** em caso de sucesso: `config.json` é atualizado com `community: {opted_in: true, email, phone}`
   **E** agente confirma o registro com mensagem de boas-vindas à comunidade

2. **Dado** que a requisição expira ou falha por erro de rede
   **Quando** timeout ou erro ocorre
   **Então** fluxo de Victory continua sem bloqueio (victory já foi salva)
   **E** `config.json` é atualizado com `community: {opted_in: false, community_error: true}`
   **E** dev é informado que o registro falhou mas pode tentar novamente depois

3. **Dado** que dev escolhe pular o opt-in
   **Quando** dev recusa o convite
   **Então** `config.json` é atualizado com `community: {opted_in: false}`
   **E** fluxo continua normalmente sem bloqueio

## Tasks / Subtasks

- [ ] Adicionar `registerMember(config, email, phone)` em `src/services/community.js` (AC: 1, 2)
  - [ ] Coletar email via `input()` com validação de formato
  - [ ] Coletar phone via `input()` com validação básica
  - [ ] Montar payload: `{ email, phone, heroName, stack, version }`
  - [ ] Fazer POST HTTPS com timeout de 10s via `fetch()` nativo (Node 18+)
  - [ ] Em sucesso: atualizar config com `opted_in: true, email, phone`
  - [ ] Em timeout/erro: atualizar config com `opted_in: false, community_error: true`
  - [ ] Exibir mensagem de boas-vindas ou erro conforme resultado (AC: 1, 2)
- [ ] Garantir que Victory NÃO bloqueia em caso de erro de rede (AC: 2)
- [ ] Criar testes de `registerMember` com mock de fetch (sucesso, timeout, erro)
- [ ] Validar que URL da API usa HTTPS — rejeitar HTTP (AC: 1, NFR6)

## Dev Notes

### `fetch()` nativo — Node 18+ (zero dependências)

Node 18+ tem `fetch` nativo — **NÃO instalar `node-fetch`, `axios` ou similar**.

```js
const controller = new AbortController()
const timeoutId = setTimeout(() => controller.abort(), 10_000)  // 10s

try {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: controller.signal
  })
  clearTimeout(timeoutId)

  if (response.ok) {
    // sucesso
  } else {
    throw new Error(`API retornou ${response.status}`)
  }
} catch (err) {
  clearTimeout(timeoutId)
  if (err.name === 'AbortError') {
    // timeout — graceful
  }
  // registrar erro no config — NÃO re-throw
}
```

### HTTPS obrigatório — NFR6

```js
const API_URL = 'https://api.codemaster.community/members'  // HTTPS obrigatório

// Validação defensiva
if (!API_URL.startsWith('https://')) {
  throw new Error('API URL deve usar HTTPS')
}
```

### Payload exato da API

```json
{
  "email": "dev@exemplo.com",
  "phone": "+5511999999999",
  "heroName": "Ricardo",
  "stack": ["JavaScript", "Ruby"],
  "version": "0.1.0"
}
```

`version` vem do `package.json` — usar `import { version } from '../../package.json' assert { type: 'json' }` ou ler via `readFile`.

### Tratamento de erros — NÃO bloquear Victory

```js
export async function registerMember(config) {
  const email = await input({ message: 'Seu email:' })
  const phone = await input({ message: 'Seu telefone (com DDD):' })

  try {
    await postToApi({ email, phone, heroName: config.hero.name, stack: config.hero.stack, version })
    config.community = { opted_in: true, email, phone }
    printSuccess('🎉 Bem-vindo à comunidade CodeMaster!')
  } catch (err) {
    config.community = { opted_in: false, email: null, phone: null, community_error: true }
    printError('Registro na comunidade falhou. Você pode tentar novamente depois.')
    // NÃO re-throw — victory continua
  }

  await writeConfig(config)
}
```

### Validação de email e telefone

Validação leve no cliente — não bloquear por formato:
```js
// Email: deve conter @ e .
const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)

// Phone: deve ter pelo menos 8 dígitos
const isValidPhone = (p) => /\d{8,}/.test(p.replace(/\D/g, ''))
```

### Config schema com `community_error`

Atualizar schema em `services/config.js`:
```json
"community": {
  "opted_in": false,
  "declined": false,
  "email": null,
  "phone": null,
  "community_error": false
}
```

### Fluxo completo de comunidade (5.1 → 5.2)

```
Victory finalizada
    ↓
shouldShowCommunityInvite(config, victoryCount) === true?
    ↓ sim
Exibir convite (story 5.1)
    ↓
confirm('Participar agora?')
    ↓ sim          ↓ não
registerMember()  config.community.declined = true
    ↓
writeConfig()
    ↓
Victory continua normalmente
```

### NFR13 — Timeout de 10 segundos

Timeout DEVE ser tratado graciosamente — victory já foi salva ANTES do opt-in.
Nunca deixar promise pendente após timeout — usar `AbortController`.

### Testes com mock de fetch

```js
import { vi } from 'vitest'

it('should handle API timeout gracefully', async () => {
  vi.stubGlobal('fetch', () => new Promise((_, reject) => {
    setTimeout(() => reject(new DOMException('', 'AbortError')), 100)
  }))
  // Verificar que config é atualizado com community_error: true
  // Verificar que função retorna sem throw
})
```

### Project Structure Notes

- `community.js` é o ÚNICO módulo com chamadas HTTP — regra de fronteira única
- `community.js` importa `config.js` para writeConfig
- `community.js` importa `utils/output.js` para feedback ao dev
- `community.js` NÃO importa de `vault.js` (sem IO de vault nesta story)

### References

- FR26, FR27, FR28: [prd.md](../../planning-artifacts/IN001-cli/prd.md)
- NFR5, NFR6, NFR9, NFR13: [prd.md](../../planning-artifacts/IN001-cli/prd.md)
- API da Comunidade: [architecture.md](../../planning-artifacts/IN001-cli/architecture.md#API-da-Comunidade)
- Depende de: [5-1-sistema-exibe-convite-da-comunidade-apos-3a-victory.md](./5-1-sistema-exibe-convite-da-comunidade-apos-3a-victory.md)
- Story completa: [epics.md](../../planning-artifacts/IN001-cli/epics.md#Story-5.2)

## Dev Agent Record

### Agent Model Used

_a preencher_

### Debug Log References

### Completion Notes List

### File List
