import { describe, test, expect } from 'vitest'
import { filterByTag, allTags } from './filter'
import type { PostMeta } from './types'

const posts: PostMeta[] = [
  { slug: 'a', title: 'A', date: '2026-05-01', description: '', tags: ['Node.js', 'AWS'], readingMinutes: 3 },
  { slug: 'b', title: 'B', date: '2026-04-01', description: '', tags: ['React'], readingMinutes: 2 },
  { slug: 'c', title: 'C', date: '2026-03-01', description: '', tags: ['AWS'], readingMinutes: 5 },
]

describe('filterByTag', () => {
  test('sem tag retorna todos', () => {
    expect(filterByTag(posts, null)).toHaveLength(3)
  })
  test('filtra por tag', () => {
    expect(filterByTag(posts, 'AWS').map((p) => p.slug)).toEqual(['a', 'c'])
  })
})

describe('allTags', () => {
  test('retorna tags únicas ordenadas', () => {
    expect(allTags(posts)).toEqual(['AWS', 'Node.js', 'React'])
  })
})
