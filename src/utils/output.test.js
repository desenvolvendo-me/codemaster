import { describe, it, expect, vi, beforeEach } from 'vitest'
import { printSuccess, printError, printEpic, printSection } from './output.js'

describe('output', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('printSuccess should call console.log with green checkmark', () => {
    printSuccess('Configurado com sucesso')
    expect(console.log).toHaveBeenCalled()
    const call = console.log.mock.calls[0][0]
    expect(call).toContain('Configurado com sucesso')
  })

  it('printError should call console.error', () => {
    printError('Algo deu errado')
    expect(console.error).toHaveBeenCalled()
    const call = console.error.mock.calls[0][0]
    expect(call).toContain('Algo deu errado')
  })

  it('printEpic should call console.log with title', () => {
    printEpic('Título Épico', 'Corpo do epic')
    expect(console.log).toHaveBeenCalled()
    const calls = console.log.mock.calls.flat().join(' ')
    expect(calls).toContain('Título Épico')
  })

  it('printSection should call console.log with section title', () => {
    printSection('Seção', 'Conteúdo')
    expect(console.log).toHaveBeenCalled()
    const calls = console.log.mock.calls.flat().join(' ')
    expect(calls).toContain('Seção')
  })
})
