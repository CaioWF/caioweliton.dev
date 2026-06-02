import { describe, test, expect } from 'vitest'
import sitemap from './sitemap'

describe('sitemap', () => {
  test('inclui a home de cada locale', async () => {
    const urls = (await sitemap()).map((e) => e.url)
    expect(urls).toContain('https://caioweliton.dev/pt')
    expect(urls).toContain('https://caioweliton.dev/en')
  })
  test('inclui posts do blog', async () => {
    const urls = (await sitemap()).map((e) => e.url)
    expect(urls.some((u) => u.includes('/blog/'))).toBe(true)
  })
  test('inclui /now e /uses', async () => {
    const urls = (await sitemap()).map((e) => e.url)
    expect(urls).toContain('https://caioweliton.dev/pt/now')
    expect(urls).toContain('https://caioweliton.dev/pt/uses')
  })
})
