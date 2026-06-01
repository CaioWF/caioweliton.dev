import { describe, test, expect } from 'vitest'
import { getLocale } from './get-locale'

describe('getLocale', () => {
  test('retorna pt quando Accept-Language prefere português', () => {
    expect(getLocale('pt-BR,pt;q=0.9,en;q=0.8')).toBe('pt')
  })
  test('retorna en quando Accept-Language prefere inglês', () => {
    expect(getLocale('en-US,en;q=0.9')).toBe('en')
  })
  test('respeita o peso q (maior vence)', () => {
    expect(getLocale('en;q=0.3,pt;q=0.9')).toBe('pt')
  })
  test('faz fallback para pt quando header é nulo ou vazio', () => {
    expect(getLocale(null)).toBe('pt')
    expect(getLocale('')).toBe('pt')
  })
  test('faz fallback para pt quando nenhum locale suportado aparece', () => {
    expect(getLocale('fr-FR,de;q=0.8')).toBe('pt')
  })
  test('casa locale por prefixo de região (pt-PT -> pt)', () => {
    expect(getLocale('pt-PT')).toBe('pt')
  })
})
