import { describe, test, expect } from 'vitest'
import sitemap from './sitemap'

describe('sitemap', () => {
  test('inclui a home de cada locale', async () => {
    const urls = (await sitemap()).map((e) => e.url)
    expect(urls).toContain('https://caioweliton.dev/pt')
    expect(urls).toContain('https://caioweliton.dev/en')
  })
  test('inclui a listagem do blog', async () => {
    const urls = (await sitemap()).map((e) => e.url)
    expect(urls).toContain('https://caioweliton.dev/pt/blog')
  })
  test('inclui /now e /uses', async () => {
    const urls = (await sitemap()).map((e) => e.url)
    expect(urls).toContain('https://caioweliton.dev/pt/now')
    expect(urls).toContain('https://caioweliton.dev/pt/uses')
  })
})
