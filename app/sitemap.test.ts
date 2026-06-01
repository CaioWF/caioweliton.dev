import { describe, test, expect } from 'vitest'
import sitemap from './sitemap'

describe('sitemap', () => {
  test('inclui a home de cada locale', () => {
    const urls = sitemap().map((e) => e.url)
    expect(urls).toContain('https://caioweliton.dev/pt')
    expect(urls).toContain('https://caioweliton.dev/en')
  })
})
