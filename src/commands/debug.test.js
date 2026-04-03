import { describe, it, expect, beforeEach, vi } from 'vitest'

const promptMocks = vi.hoisted(() => ({
  input: vi.fn(),
  confirm: vi.fn(),
}))

const configMocks = vi.hoisted(() => ({
  readConfig: vi.fn(),
  writeConfig: vi.fn(),
}))

const questMocks = vi.hoisted(() => ({
  createQuest: vi.fn(),
}))

const relicMocks = vi.hoisted(() => ({
  addRelic: vi.fn(),
}))

const victoryMocks = vi.hoisted(() => ({
  closeVictory: vi.fn(),
}))

const stateMocks = vi.hoisted(() => ({
  readActiveQuest: vi.fn(),
}))

const outputMocks = vi.hoisted(() => ({
  printSuccess: vi.fn(),
  printError: vi.fn(),
  printSection: vi.fn(),
}))

vi.mock('@inquirer/prompts', () => promptMocks)
vi.mock('../services/config.js', () => configMocks)
vi.mock('../moments/quest.js', () => questMocks)
vi.mock('../moments/relic.js', () => relicMocks)
vi.mock('../moments/victory.js', () => victoryMocks)
vi.mock('../services/state.js', () => stateMocks)
vi.mock('../utils/output.js', () => outputMocks)

const {
  debug,
  buildDefaultQuestPayload,
  updateQuestPayload,
  buildDefaultRelicPayload,
  updateRelicPayload,
  buildDefaultVictoryPayload,
  updateVictoryPayload,
} = await import('./debug.js')

describe('debug command', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    stateMocks.readActiveQuest.mockResolvedValue({
      id: 'Q001',
      title: 'Quest ativa',
      notePath: 'quests/Q001-quest-ativa.md',
    })
    victoryMocks.closeVictory.mockResolvedValue({
      scores: { business: 7.0, architecture: 8.0, ai_orchestration: 6.0 },
      trends: { business: '↑', architecture: '↑', ai_orchestration: '→' },
    })
  })

  it('fails with clear error when debug mode is not enabled', async () => {
    configMocks.readConfig.mockResolvedValue({ debug: { enabled: false } })

    await expect(debug()).rejects.toThrow('Modo debug não está habilitado')
    expect(outputMocks.printError).toHaveBeenCalledWith('Modo debug não está habilitado. Execute `codemaster setup -debug` primeiro.')
  })

  it('shows payload before approval and creates quest with approved title', async () => {
    configMocks.readConfig.mockResolvedValue({
      debug: { enabled: true },
      obsidian: { vault_path: '/tmp/vault' },
    })
    promptMocks.confirm
      .mockResolvedValueOnce(false)
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(false)
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(true)
    promptMocks.input
      .mockResolvedValueOnce('Missão ajustada')
      .mockResolvedValueOnce('Pergunta 1 ajustada')
      .mockResolvedValueOnce('Pergunta 2 ajustada')
      .mockResolvedValueOnce('Pergunta 3 ajustada')
      .mockResolvedValueOnce('Resposta 1 ajustada')
      .mockResolvedValueOnce('Resposta 2 ajustada')
      .mockResolvedValueOnce('Resposta 3 ajustada')
    questMocks.createQuest.mockResolvedValue({ id: 'Q001', notePath: 'quests/Q001-missao-ajustada.md' })

    const result = await debug()

    expect(outputMocks.printSection).toHaveBeenCalledTimes(5)
    expect(outputMocks.printSection).toHaveBeenNthCalledWith(
      1,
      'Payload de Quest (pré-aprovação)',
      expect.stringContaining('Melhorar a ativação de usuários no onboarding')
    )
    expect(outputMocks.printSection).toHaveBeenNthCalledWith(
      2,
      'Payload de Quest (aprovado)',
      expect.stringContaining('Missão ajustada')
    )
    expect(outputMocks.printSection).toHaveBeenNthCalledWith(
      3,
      'Payload de Victory (pré-aprovação)',
      expect.stringContaining('Impacto de negócio')
    )
    expect(configMocks.writeConfig).toHaveBeenCalledWith(expect.objectContaining({
      debug: expect.objectContaining({
        enabled: true,
        quest_payload: expect.objectContaining({
          missionTitle: 'Missão ajustada',
          questions: ['Pergunta 1 ajustada', 'Pergunta 2 ajustada', 'Pergunta 3 ajustada'],
          answers: ['Resposta 1 ajustada', 'Resposta 2 ajustada', 'Resposta 3 ajustada'],
        }),
      }),
    }))
    expect(questMocks.createQuest).toHaveBeenCalledWith('Missão ajustada', '/tmp/vault', 1)
    expect(result).toEqual({
      quest: { id: 'Q001', notePath: 'quests/Q001-missao-ajustada.md' },
      relics: [],
      victory: {
        scores: { business: 7.0, architecture: 8.0, ai_orchestration: 6.0 },
        trends: { business: '↑', architecture: '↑', ai_orchestration: '→' },
      },
    })
  })

  it('keeps active quest contract untouched by delegating to createQuest', async () => {
    configMocks.readConfig.mockResolvedValue({
      debug: { enabled: true },
      obsidian: { vault_path: '/tmp/vault' },
    })
    promptMocks.confirm
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(false)
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(true)
    questMocks.createQuest.mockResolvedValue({
      id: 'Q001',
      notePath: 'quests/Q001-implementar-validacao-de-webhook.md',
    })

    await debug()

    expect(questMocks.createQuest).toHaveBeenCalledWith('Melhorar a ativação de usuários no onboarding', '/tmp/vault', 1)
  })

  it('allows following the flow without generating relics', async () => {
    configMocks.readConfig.mockResolvedValue({
      debug: { enabled: true },
      obsidian: { vault_path: '/tmp/vault' },
    })
    promptMocks.confirm
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(false)
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(true)
    questMocks.createQuest.mockResolvedValue({
      id: 'Q001',
      notePath: 'quests/Q001-quest-ativa.md',
    })

    const result = await debug()

    expect(relicMocks.addRelic).not.toHaveBeenCalled()
    expect(result).toEqual(expect.objectContaining({
      quest: { id: 'Q001', notePath: 'quests/Q001-quest-ativa.md' },
      relics: [],
      victory: {
        scores: { business: 7.0, architecture: 8.0, ai_orchestration: 6.0 },
        trends: { business: '↑', architecture: '↑', ai_orchestration: '→' },
      },
    }))
  })

  it('creates one relic after showing and approving the payload', async () => {
    configMocks.readConfig.mockResolvedValue({
      debug: { enabled: true },
      obsidian: { vault_path: '/tmp/vault' },
    })
    promptMocks.confirm
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(true)
    promptMocks.input.mockResolvedValueOnce('1')
    questMocks.createQuest.mockResolvedValue({
      id: 'Q001',
      notePath: 'quests/Q001-quest-ativa.md',
    })
    relicMocks.addRelic.mockResolvedValue({
      relicId: 'R001',
      archived: true,
    })

    const result = await debug()

    expect(outputMocks.printSection).toHaveBeenCalledWith(
      'Payload de Relic 1 (pré-aprovação)',
      expect.stringContaining('Negocial')
    )
    expect(relicMocks.addRelic).toHaveBeenCalledWith(
      'Mapear com clareza o benefício principal logo no início do onboarding',
      'Negocial',
      '/tmp/vault',
      'Q001-quest-ativa.md',
      true
    )
    expect(result.relics).toEqual([{ relicId: 'R001', archived: true }])
    expect(result.victory).toEqual({
      scores: { business: 7.0, architecture: 8.0, ai_orchestration: 6.0 },
      trends: { business: '↑', architecture: '↑', ai_orchestration: '→' },
    })
  })

  it('creates multiple relics with independent approvals', async () => {
    configMocks.readConfig.mockResolvedValue({
      debug: { enabled: true },
      obsidian: { vault_path: '/tmp/vault' },
    })
    promptMocks.confirm
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(true)
    promptMocks.input.mockResolvedValueOnce('2')
    questMocks.createQuest.mockResolvedValue({
      id: 'Q001',
      notePath: 'quests/Q001-quest-ativa.md',
    })
    relicMocks.addRelic
      .mockResolvedValueOnce({ relicId: 'R001', archived: true })
      .mockResolvedValueOnce({ relicId: 'R002', archived: true })

    const result = await debug()

    expect(relicMocks.addRelic).toHaveBeenNthCalledWith(
      1,
      'Mapear com clareza o benefício principal logo no início do onboarding',
      'Negocial',
      '/tmp/vault',
      'Q001-quest-ativa.md',
      true
    )
    expect(relicMocks.addRelic).toHaveBeenNthCalledWith(
      2,
      'Separar melhor os estados de progresso para evitar abandono silencioso no fluxo',
      'Arquitetural',
      '/tmp/vault',
      'Q001-quest-ativa.md',
      true
    )
    expect(result.relics).toEqual([
      { relicId: 'R001', archived: true },
      { relicId: 'R002', archived: true },
    ])
  })

  it('prepares victory as the final step, allows approval and closes the quest with a final summary', async () => {
    configMocks.readConfig.mockResolvedValue({
      debug: { enabled: true },
      obsidian: { vault_path: '/tmp/vault' },
    })
    promptMocks.confirm
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(false)
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(true)
    questMocks.createQuest.mockResolvedValue({
      id: 'Q001',
      notePath: 'quests/Q001-quest-ativa.md',
    })

    const result = await debug()

    expect(outputMocks.printSection).toHaveBeenCalledWith(
      'Payload de Victory (pré-aprovação)',
      expect.stringContaining('Impacto de negócio')
    )
    expect(victoryMocks.closeVictory).toHaveBeenCalledWith(
      'Q001-quest-ativa.md',
      { business: 7.0, architecture: 8.0, ai_orchestration: 6.0 },
      {
        'Impacto de negócio': 'O fluxo de teste ficou mais rápido para validar uma melhoria real sem repetir todo o contexto manualmente.',
        'Decisão arquitetural': 'Separar o estado de debug do fluxo normal deixou o comportamento mais previsível e mais fácil de inspecionar.',
        'Uso de IA': 'Usei a IA para estruturar payloads mais claros, revisar entradas e verificar se a saída final seguia o fluxo esperado.',
        'Novo aprendizado': 'A observabilidade do payload antes de cada etapa reduz muito o tempo para localizar onde o comportamento começou a divergir.',
        'Faria diferente': 'Eu consolidaria mais cedo os fluxos antigos e novos para reduzir manutenção paralela e pontos de inconsistência.',
      },
      '/tmp/vault'
    )
    expect(outputMocks.printSection).toHaveBeenCalledWith(
      'Resumo Final do Fluxo Debug',
      expect.stringContaining('Q001-quest-ativa.md')
    )
    expect(result.victory).toEqual({
      scores: { business: 7.0, architecture: 8.0, ai_orchestration: 6.0 },
      trends: { business: '↑', architecture: '↑', ai_orchestration: '→' },
    })
  })

  it('fails clearly when the active quest is inconsistent before closing victory', async () => {
    configMocks.readConfig.mockResolvedValue({
      debug: { enabled: true },
      obsidian: { vault_path: '/tmp/vault' },
    })
    promptMocks.confirm
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(false)
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(true)
    questMocks.createQuest.mockResolvedValue({
      id: 'Q001',
      notePath: 'quests/Q001-quest-ativa.md',
    })
    stateMocks.readActiveQuest.mockResolvedValueOnce(null)

    await expect(debug()).rejects.toThrow('Quest ativa inconsistente ao fechar victory')
    expect(victoryMocks.closeVictory).not.toHaveBeenCalled()
  })
})

describe('quest debug payload helpers', () => {
  it('builds the default quest payload', () => {
    expect(buildDefaultQuestPayload()).toEqual({
      missionTitle: 'Melhorar a ativação de usuários no onboarding',
      questions: [
        'Qual resultado de negócio essa melhoria precisa destravar no onboarding?',
        'Qual ponto da experiência atual mais atrasa ou desmotiva novos usuários?',
        'Que evidência mostraria que essa mudança realmente melhorou a ativação?',
      ],
      answers: [
        'O objetivo é fazer com que mais usuários cheguem ao primeiro valor percebido sem abandonar o fluxo inicial, reduzindo atrito logo nos primeiros minutos de uso.',
        'Hoje a experiência parece longa e pouco guiada, então quero observar onde o usuário perde contexto, hesita na próxima ação e deixa de concluir a etapa principal.',
        'Vou considerar o teste bem-sucedido se o fluxo ficar mais claro, se a proposta de valor aparecer mais cedo e se o caminho até a primeira ação útil parecer mais direto e confiável.',
      ],
    })
  })

  it('updates title, questions and answers preserving structure', () => {
    const payload = buildDefaultQuestPayload()
    const updated = updateQuestPayload(payload, {
      missionTitle: 'Nova missão',
      questions: ['Q1', 'Q2', 'Q3'],
      answers: ['A1', 'A2', 'A3'],
    })

    expect(updated).toEqual({
      missionTitle: 'Nova missão',
      questions: ['Q1', 'Q2', 'Q3'],
      answers: ['A1', 'A2', 'A3'],
    })
    expect(payload.missionTitle).toBe('Melhorar a ativação de usuários no onboarding')
  })
})

describe('relic debug payload helpers', () => {
  it('builds default payloads for multiple relics', () => {
    expect(buildDefaultRelicPayload(0)).toEqual({
      dimension: 'Negocial',
      discovery: 'Mapear com clareza o benefício principal logo no início do onboarding',
      questions: [
        'Qual descoberta desta etapa vale registrar como aprendizado?',
        'Em qual dimensão essa descoberta se encaixa melhor?',
        'Por que essa descoberta ajuda a validar o fluxo em teste?',
      ],
      answers: [
        'A principal descoberta é que o usuário precisa entender o ganho prático da jornada logo no começo para não perder interesse.',
        'Essa descoberta é principalmente negocial porque influencia percepção de valor e motivação para continuar.',
        'Isso importa porque mostra se o fluxo está conectando a experiência inicial com um benefício real e perceptível.',
      ],
    })
    expect(buildDefaultRelicPayload(1)).toEqual({
      dimension: 'Arquitetural',
      discovery: 'Separar melhor os estados de progresso para evitar abandono silencioso no fluxo',
      questions: [
        'Qual descoberta desta etapa vale registrar como aprendizado?',
        'Em qual dimensão essa descoberta se encaixa melhor?',
        'Por que essa descoberta ajuda a validar o fluxo em teste?',
      ],
      answers: [
        'A descoberta aqui é que o fluxo precisa tornar cada etapa visível para reduzir confusão e facilitar recuperação quando houver interrupção.',
        'Ela se encaixa na dimensão arquitetural porque afeta a forma como o estado da jornada é estruturado e comunicado ao longo do processo.',
        'Isso ajuda no teste porque evidencia se a implementação sustenta continuidade, previsibilidade e clareza em múltiplas etapas.',
      ],
    })
  })

  it('updates relic payload preserving structure', () => {
    const payload = buildDefaultRelicPayload(0)
    const updated = updateRelicPayload(payload, {
      dimension: 'Arquitetural',
      discovery: 'Nova descoberta',
      questions: ['Q1', 'Q2', 'Q3'],
      answers: ['A1', 'A2', 'A3'],
    })

    expect(updated).toEqual({
      dimension: 'Arquitetural',
      discovery: 'Nova descoberta',
      questions: ['Q1', 'Q2', 'Q3'],
      answers: ['A1', 'A2', 'A3'],
    })
    expect(payload.dimension).toBe('Negocial')
  })
})

describe('victory debug payload helpers', () => {
  it('builds the default victory payload', () => {
    expect(buildDefaultVictoryPayload()).toEqual({
      reflections: {
        'Impacto de negócio': 'O fluxo de teste ficou mais rápido para validar uma melhoria real sem repetir todo o contexto manualmente.',
        'Decisão arquitetural': 'Separar o estado de debug do fluxo normal deixou o comportamento mais previsível e mais fácil de inspecionar.',
        'Uso de IA': 'Usei a IA para estruturar payloads mais claros, revisar entradas e verificar se a saída final seguia o fluxo esperado.',
        'Novo aprendizado': 'A observabilidade do payload antes de cada etapa reduz muito o tempo para localizar onde o comportamento começou a divergir.',
        'Faria diferente': 'Eu consolidaria mais cedo os fluxos antigos e novos para reduzir manutenção paralela e pontos de inconsistência.',
      },
      scores: {
        business: 7.0,
        architecture: 8.0,
        ai_orchestration: 6.0,
      },
    })
  })

  it('updates victory payload preserving structure', () => {
    const payload = buildDefaultVictoryPayload()
    const updated = updateVictoryPayload(payload, {
      reflections: {
        'Impacto de negócio': 'Nova reflexão',
        'Decisão arquitetural': 'Reflexão 2',
        'Uso de IA': 'Reflexão 3',
        'Novo aprendizado': 'Reflexão 4',
        'Faria diferente': 'Reflexão 5',
      },
      scores: {
        business: 8.0,
        architecture: 7.0,
        ai_orchestration: 9.0,
      },
    })

    expect(updated).toEqual({
      reflections: {
        'Impacto de negócio': 'Nova reflexão',
        'Decisão arquitetural': 'Reflexão 2',
        'Uso de IA': 'Reflexão 3',
        'Novo aprendizado': 'Reflexão 4',
        'Faria diferente': 'Reflexão 5',
      },
      scores: {
        business: 8.0,
        architecture: 7.0,
        ai_orchestration: 9.0,
      },
    })
    expect(payload.scores.business).toBe(7.0)
  })
})
