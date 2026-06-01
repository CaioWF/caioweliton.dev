import { describe, test, expect } from 'vitest'
import { buildAlternates } from './metadata'

describe('buildAlternates', () => {
  test('canonical aponta para o locale atual', () => {
    const alt = buildAlternates('pt', '/')
    expect(alt.canonical).toBe('https://caioweliton.dev/pt')
  })
  test('languages inclui pt e en com o mesmo path', () => {
    const alt = buildAlternates('en', '/blog')
    expect(alt.languages).toEqual({
      pt: 'https://caioweliton.dev/pt/blog',
      en: 'https://caioweliton.dev/en/blog',
    })
  })
})
