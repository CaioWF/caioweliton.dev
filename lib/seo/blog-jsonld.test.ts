import { describe, test, expect } from 'vitest'
import { buildBlogPostingJsonLd } from './blog-jsonld'
import type { PostMeta } from '@/lib/blog/types'

const meta: PostMeta = {
  slug: 'meu-post', title: 'Meu Post', date: '2026-05-20',
  description: 'resumo', tags: ['Node.js'], readingMinutes: 4,
}

describe('buildBlogPostingJsonLd', () => {
  test('gera BlogPosting com url canônica do locale', () => {
    const ld = buildBlogPostingJsonLd(meta, 'pt')
    expect(ld['@type']).toBe('BlogPosting')
    expect(ld.headline).toBe('Meu Post')
    expect(ld.datePublished).toBe('2026-05-20')
    expect(ld.url).toBe('https://caioweliton.dev/pt/blog/meu-post')
    expect((ld.author as { name: string }).name).toBe('Caio Weliton')
  })
})
