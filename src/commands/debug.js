import { confirm, input } from '@inquirer/prompts'
import chalk from 'chalk'
import { createQuest } from '../moments/quest.js'
import { addRelic } from '../moments/relic.js'
import { closeVictory } from '../moments/victory.js'
import { readConfig, writeConfig } from '../services/config.js'
import { readActiveQuest } from '../services/state.js'
import { printError, printSection, printSuccess } from '../utils/output.js'

export function buildDefaultQuestPayload() {
  return {
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
  }
}

export function updateQuestPayload(payload, updates) {
  return {
    missionTitle: updates.missionTitle ?? payload.missionTitle,
    questions: updates.questions ?? payload.questions,
    answers: updates.answers ?? payload.answers,
  }
}

export function buildDefaultRelicPayload(index = 0) {
  const defaults = [
    {
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
    },
    {
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
    },
  ]

  return defaults[index] ?? defaults[defaults.length - 1]
}

export function updateRelicPayload(payload, updates) {
  return {
    dimension: updates.dimension ?? payload.dimension,
    discovery: updates.discovery ?? payload.discovery,
    questions: updates.questions ?? payload.questions,
    answers: updates.answers ?? payload.answers,
  }
}

export function buildDefaultVictoryPayload() {
  return {
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
  }
}

export function updateVictoryPayload(payload, updates) {
  return {
    reflections: updates.reflections ?? payload.reflections,
    scores: updates.scores ?? payload.scores,
  }
}

function serializePayload(payload) {
  return JSON.stringify(payload, null, 2)
}

function getVaultPath(config) {
  return config.obsidian?.vault_path || config.vault
}

async function editQuestPayload(payload) {
  const missionTitle = await input({
    message: 'Título final da missão:',
    default: payload.missionTitle,
    validate: (value) => value.trim().length > 0 || 'Informe um título para a missão',
  })

  const questions = []
  for (const [index, question] of payload.questions.entries()) {
    questions.push(await input({
      message: `Pergunta ${index + 1}:`,
      default: question,
      validate: (value) => value.trim().length > 0 || 'Informe a pergunta',
    }))
  }

  const answers = []
  for (const [index, answer] of payload.answers.entries()) {
    answers.push(await input({
      message: `Resposta ${index + 1}:`,
      default: answer,
      validate: (value) => value.trim().length > 0 || 'Informe a resposta',
    }))
  }

  return updateQuestPayload(payload, {
    missionTitle,
    questions,
    answers,
  })
}

async function editRelicPayload(payload) {
  const dimension = await input({
    message: 'Dimensão final da relic:',
    default: payload.dimension,
    validate: (value) => value.trim().length > 0 || 'Informe a dimensão',
  })

  const discovery = await input({
    message: 'Texto final da descoberta:',
    default: payload.discovery,
    validate: (value) => value.trim().length > 0 || 'Informe a descoberta',
  })

  const questions = []
  for (const [index, question] of payload.questions.entries()) {
    questions.push(await input({
      message: `Pergunta da relic ${index + 1}:`,
      default: question,
      validate: (value) => value.trim().length > 0 || 'Informe a pergunta',
    }))
  }

  const answers = []
  for (const [index, answer] of payload.answers.entries()) {
    answers.push(await input({
      message: `Resposta da relic ${index + 1}:`,
      default: answer,
      validate: (value) => value.trim().length > 0 || 'Informe a resposta',
    }))
  }

  return updateRelicPayload(payload, {
    dimension,
    discovery,
    questions,
    answers,
  })
}

async function editVictoryPayload(payload) {
  const reflections = {}
  for (const [key, value] of Object.entries(payload.reflections)) {
    reflections[key] = await input({
      message: `${key}:`,
      default: value,
      validate: (answer) => answer.trim().length > 0 || 'Informe a reflexão',
    })
  }

  const business = Number(await input({
    message: 'Score de negócio:',
    default: String(payload.scores.business),
    validate: (value) => Number.isFinite(Number(value)) || 'Informe um número válido',
  }))

  const architecture = Number(await input({
    message: 'Score de arquitetura:',
    default: String(payload.scores.architecture),
    validate: (value) => Number.isFinite(Number(value)) || 'Informe um número válido',
  }))

  const aiOrchestration = Number(await input({
    message: 'Score de IA / orquestração:',
    default: String(payload.scores.ai_orchestration),
    validate: (value) => Number.isFinite(Number(value)) || 'Informe um número válido',
  }))

  return updateVictoryPayload(payload, {
    reflections,
    scores: {
      business,
      architecture,
      ai_orchestration: aiOrchestration,
    },
  })
}

function getQuestFileName(activeQuest) {
  return activeQuest?.notePath?.split('/').pop() ?? null
}

function buildDebugSummary({ quest, relics, victory, questPayload, relicPayloads, victoryPayload }) {
  const lines = [
    `Quest: ${quest.notePath}`,
    `Payload quest aprovado: ${questPayload.missionTitle}`,
  ]

  if (relics.length === 0) {
    lines.push('Relics: nenhuma gerada')
  } else {
    relics.forEach((relic, index) => {
      const payload = relicPayloads[index]
      lines.push(`Relic ${index + 1}: ${relic.relicId} | ${payload.dimension} | ${payload.discovery}`)
    })
  }

  lines.push(`Victory: N:${victory.scores.business.toFixed(1)} A:${victory.scores.architecture.toFixed(1)} IA:${victory.scores.ai_orchestration.toFixed(1)}`)
  lines.push(`Payload victory aprovado: ${victoryPayload.reflections['Impacto de negócio']}`)

  return lines.join('\n')
}

export async function debug() {
  const config = await readConfig()

  if (config.debug?.enabled !== true) {
    const message = 'Modo debug não está habilitado. Execute `codemaster setup -debug` primeiro.'
    printError(message)
    throw new Error('Modo debug não está habilitado')
  }

  const vaultPath = getVaultPath(config)
  if (!vaultPath) {
    const message = 'Vault não configurado. Execute `codemaster setup` antes do fluxo debug.'
    printError(message)
    throw new Error('Vault não configurado')
  }

  let payload = buildDefaultQuestPayload()
  printSection('Payload de Quest (pré-aprovação)', serializePayload(payload))

  const payloadApprovedAsIs = await confirm({
    message: 'Usar esse payload sem editar?',
    default: false,
  })

  if (!payloadApprovedAsIs) {
    payload = await editQuestPayload(payload)
  }

  printSection('Payload de Quest (aprovado)', serializePayload(payload))

  const confirmed = await confirm({
    message: 'Confirmar criação da quest com esse payload?',
    default: true,
  })

  if (!confirmed) {
    printSection('Fluxo debug', 'Operação cancelada antes da criação da quest.')
    return null
  }

  const nextConfig = {
    ...config,
    debug: {
      ...config.debug,
      quest_payload: payload,
    },
  }
  await writeConfig(nextConfig)

  const quest = await createQuest(payload.missionTitle, vaultPath, 1)

  printSuccess(`Quest criada em modo debug: ${chalk.cyan(quest.id)} → ${chalk.dim(quest.notePath)}`)

  const relics = []
  const approvedRelicPayloads = []
  const shouldGenerateRelics = await confirm({
    message: 'Deseja gerar relics neste fluxo debug?',
    default: false,
  })

  if (shouldGenerateRelics) {
    const totalRelicsRaw = await input({
      message: 'Quantas relics deseja gerar?',
      default: '1',
      validate: (value) => {
        const parsed = Number(value)
        return Number.isInteger(parsed) && parsed >= 1 ? true : 'Informe um número inteiro maior ou igual a 1'
      },
    })

    const totalRelics = Number(totalRelicsRaw)
    const activeQuest = await readActiveQuest()
    const questFileName = getQuestFileName(activeQuest)

    if (!questFileName) {
      printError('Quest ativa não encontrada para anexar relics do fluxo debug.')
      throw new Error('Quest ativa não encontrada')
    }

    for (let index = 0; index < totalRelics; index += 1) {
      let relicPayload = buildDefaultRelicPayload(index)
      printSection(`Payload de Relic ${index + 1} (pré-aprovação)`, serializePayload(relicPayload))

      const approveAsIs = await confirm({
        message: `Usar a relic ${index + 1} como está?`,
        default: true,
      })

      if (!approveAsIs) {
        relicPayload = await editRelicPayload(relicPayload)
      }

      printSection(`Payload de Relic ${index + 1} (aprovado)`, serializePayload(relicPayload))

      const confirmRelic = await confirm({
        message: `Confirmar criação da relic ${index + 1}?`,
        default: true,
      })

      if (!confirmRelic) {
        continue
      }

      const relicResult = await addRelic(
        relicPayload.discovery,
        relicPayload.dimension,
        vaultPath,
        questFileName,
        true
      )

      relics.push(relicResult)

      approvedRelicPayloads.push(relicPayload)

      await writeConfig({
        ...nextConfig,
        debug: {
          ...nextConfig.debug,
          quest_payload: payload,
          relic_payloads: approvedRelicPayloads,
        },
      })

      printSuccess(`Relic criada em modo debug: ${chalk.cyan(relicResult.relicId)}`)
    }
  }

  const activeQuestBeforeVictory = await readActiveQuest()
  const questFileName = getQuestFileName(activeQuestBeforeVictory)

  if (!questFileName) {
    printError('Quest ativa inconsistente ao fechar victory.')
    throw new Error('Quest ativa inconsistente ao fechar victory')
  }

  let victoryPayload = buildDefaultVictoryPayload()
  printSection('Payload de Victory (pré-aprovação)', serializePayload(victoryPayload))

  const approveVictoryAsIs = await confirm({
    message: 'Usar a victory como está?',
    default: true,
  })

  if (!approveVictoryAsIs) {
    victoryPayload = await editVictoryPayload(victoryPayload)
  }

  printSection('Payload de Victory (aprovado)', serializePayload(victoryPayload))

  const confirmVictory = await confirm({
    message: 'Confirmar criação da victory final?',
    default: true,
  })

  if (!confirmVictory) {
    printSection('Fluxo debug', 'Operação cancelada antes da criação da victory.')
    return { quest, relics, victory: null }
  }

  const victory = await closeVictory(
    questFileName,
    victoryPayload.scores,
    victoryPayload.reflections,
    vaultPath
  )

  await writeConfig({
    ...nextConfig,
    debug: {
      ...nextConfig.debug,
      quest_payload: payload,
      relic_payloads: approvedRelicPayloads,
      victory_payload: victoryPayload,
    },
  })

  printSection('Resumo Final do Fluxo Debug', buildDebugSummary({
    quest,
    relics,
    victory,
    questPayload: payload,
    relicPayloads: approvedRelicPayloads,
    victoryPayload,
  }))

  return { quest, relics, victory }
}
