import { describe, test, expect } from 'vitest'
import { buildPersonJsonLd } from './person-jsonld'

describe('buildPersonJsonLd', () => {
  test('gera schema.org Person com nome e sameAs', () => {
    const ld = buildPersonJsonLd()
    expect(ld['@type']).toBe('Person')
    expect(ld.name).toBe('Caio Weliton')
    expect(Array.isArray(ld.sameAs)).toBe(true)
    expect((ld.sameAs as string[]).length).toBeGreaterThanOrEqual(3)
    expect(ld.url).toBe('https://caioweliton.dev')
  })
})
