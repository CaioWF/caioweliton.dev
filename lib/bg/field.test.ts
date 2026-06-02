import { describe, it, expect } from 'vitest'
import { connectionOpacity, hexToRgb } from './field'

describe('connectionOpacity', () => {
  it('é 0 quando distância >= máximo', () => {
    expect(connectionOpacity(100, 100)).toBe(0)
    expect(connectionOpacity(150, 100)).toBe(0)
  })
  it('é 1 quando distância <= 0', () => {
    expect(connectionOpacity(0, 100)).toBe(1)
    expect(connectionOpacity(-5, 100)).toBe(1)
  })
  it('decai linearmente no meio', () => {
    expect(connectionOpacity(50, 100)).toBeCloseTo(0.5)
    expect(connectionOpacity(25, 100)).toBeCloseTo(0.75)
  })
})

describe('hexToRgb', () => {
  it('converte hex de 6 dígitos', () => {
    expect(hexToRgb('#34d399')).toEqual({ r: 52, g: 211, b: 153 })
    expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 })
  })
  it('aceita hex sem #', () => {
    expect(hexToRgb('22d3ee')).toEqual({ r: 34, g: 211, b: 238 })
  })
  it('faz trim de espaços', () => {
    expect(hexToRgb('  #ffffff  ')).toEqual({ r: 255, g: 255, b: 255 })
  })
  it('cai p/ fallback em hex inválido', () => {
    expect(hexToRgb('xyz')).toEqual({ r: 52, g: 211, b: 153 })
  })
})
