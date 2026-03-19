# Story 3.1: Sistema exibe convite da comunidade após 3ª Victory

Status: ready-for-dev

## Story

Como developer (Ricardo),
quero receber um convite para a comunidade CodeMaster após minha 3ª victory,
para que eu possa me conectar com outros devs na mesma jornada e sentir que faço parte de algo maior.

## Acceptance Criteria

1. **Dado** que dev acabou de completar exatamente sua 3ª victory total
   **Quando** fluxo de Victory finaliza
   **Então** agente exibe mensagem de convite após confirmação da victory: "Você completou sua 3ª Victory. Quer fazer parte da comunidade CodeMaster e conectar com outros devs na mesma jornada?"
   **E** mensagem informa claramente: "Seus dados não serão tornados públicos e serão usados apenas para comunicação da comunidade CodeMaster"
   **E** dev pode escolher: participar agora ou pular para depois

2. **Dado** que dev já fez opt-in ou recusou explicitamente em sessão anterior
   **Quando** victories seguintes completam
   **Então** convite não é exibido novamente

## Tasks / Subtasks

- [ ] Criar `src/services/community.js` — função `shouldShowCommunityInvite(config)` (AC: 1, 2)
  - [ ] Verificar se `config.community.opted_in === true` → retornar `false` (AC: 2)
  - [ ] Verificar se `config.community.declined === true` → retornar `false` (AC: 2)
  - [ ] Contar victories totais via `countTotalVictories(vaultPath)` → mostrar apenas na 3ª exata
- [ ] Adicionar `countTotalVictories(vaultPath)` em `src/services/vault.js` ou `milestone.js`
  - [ ] Listar todos os arquivos em `quests/` e nas pastas `milestone-*/quests/`
  - [ ] Contar arquivos com `type: victory` no frontmatter
- [ ] Implementar fluxo de exibição do convite no momento de Victory
  - [ ] Exibir mensagem de convite após victory salva (AC: 1)
  - [ ] Usar `@inquirer/prompts` `confirm` para pergunta de participação (AC: 1)
  - [ ] Se aceitar: chamar fluxo de opt-in da story 5.2 (AC: 1)
  - [ ] Se pular: atualizar `config.community.declined = true` via `writeConfig()` (AC: 2)
- [ ] Criar `src/services/community.test.js` com testes de `shouldShowCommunityInvite`

## Dev Notes

### Regra de exibição — uma única vez

O convite SOMENTE é exibido quando:
1. Victory count total === 3 (exatamente — não "maior que 3")
2. `config.community.opted_in` é `false` ou `undefined`
3. `config.community.declined` é `false` ou `undefined`

```js
export function shouldShowCommunityInvite(config, victoryCount) {
  if (config.community?.opted_in === true) return false
  if (config.community?.declined === true) return false
  return victoryCount === 3
}
```

### Contagem de victories — deve ser cumulativa

Victories migradas para `milestone-01/quests/`, `milestone-02/quests/` etc. TAMBÉM contam.
A contagem deve varrer TODAS as pastas, não apenas `quests/` raiz.

```js
export async function countTotalVictories(vaultPath) {
  let count = 0

  // quests/ raiz
  const rootVictories = await listNotes(vaultPath, 'quests')
  for (const file of rootVictories) {
    const content = await readNote(vaultPath, 'quests', file)
    const fm = parseFrontmatter(content)
    if (fm.type === 'victory') count++
  }

  // milestone-*/quests/
  // Usar glob ou listdir para encontrar pastas milestone-*
  // ...

  return count
}
```

### Mensagem exata do convite (AC: 1)

```
🎉 Você completou sua 3ª Victory!

Quer fazer parte da comunidade CodeMaster e conectar com
outros devs na mesma jornada?

ℹ️  Seus dados não serão tornados públicos e serão usados
    apenas para comunicação da comunidade CodeMaster.
```

### Interação com `@inquirer/prompts`

```js
import { confirm } from '@inquirer/prompts'

const joinNow = await confirm({
  message: 'Participar da comunidade agora?',
  default: false
})

if (joinNow) {
  await communityOptIn(config)  // story 5.2
} else {
  config.community = { ...config.community, declined: true }
  await writeConfig(config)
}
```

### NFR5 — Consentimento explícito obrigatório

NUNCA exibir o convite automaticamente sem o trigger da 3ª victory.
NUNCA coletar email/phone sem aceite explícito do `confirm`.
O `default: false` no confirm é intencional.

### NFR9 — Sistema offline

Esta story NÃO faz chamadas de rede — apenas lógica de contagem e exibição.
A chamada HTTP acontece apenas na story 5.2 se dev aceitar.

### Config schema — campo `declined`

O schema em `architecture.md` não inclui `declined` explicitamente, mas é necessário para AC 2.
Adicionar ao schema de community:
```json
"community": {
  "opted_in": false,
  "declined": false,
  "email": null,
  "phone": null
}
```

### Testes

```js
describe('community', () => {
  it('should show invite on exactly 3rd victory', () => {
    expect(shouldShowCommunityInvite({}, 3)).toBe(true)
  })
  it('should NOT show on 4th victory', () => {
    expect(shouldShowCommunityInvite({}, 4)).toBe(false)
  })
  it('should NOT show if already opted_in', () => {
    expect(shouldShowCommunityInvite({ community: { opted_in: true } }, 3)).toBe(false)
  })
  it('should NOT show if declined', () => {
    expect(shouldShowCommunityInvite({ community: { declined: true } }, 3)).toBe(false)
  })
})
```

### Project Structure Notes

- `community.js` está em `src/services/` — centraliza toda lógica de comunidade
- `shouldShowCommunityInvite()` é pure function — exportar separado para facilitar teste
- O fluxo de Victory (IN002/IN003) é responsável por chamar esta função — esta story apenas implementa a lógica de CLI

### References

- FR25: [prd.md](../../planning-artifacts/IN001-cli/prd.md#FR25)
- NFR5, NFR9: [prd.md](../../planning-artifacts/IN001-cli/prd.md)
- Continua em: [5-2-dev-realiza-opt-in-e-dados-sao-registrados-na-api.md](./5-2-dev-realiza-opt-in-e-dados-sao-registrados-na-api.md)
- Story completa: [epics.md](../../planning-artifacts/IN001-cli/epics.md#Story-5.1)

## Dev Agent Record

### Agent Model Used

_a preencher_

### Debug Log References

### Completion Notes List

### File List
