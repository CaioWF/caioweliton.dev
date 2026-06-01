import { describe, test, expect } from 'vitest'
import { filterProjects } from './filter'
import type { Project } from '@/data/projects'

const sample: Project[] = [
  { slug: 'a', title: 'A', type: 'pessoal', description: { pt: '', en: '' }, stack: ['Node.js', 'AWS'] },
  { slug: 'b', title: 'B', type: 'profissional', description: { pt: '', en: '' }, stack: ['React'] },
  { slug: 'c', title: 'C', type: 'pessoal', description: { pt: '', en: '' }, stack: ['AWS', 'Redis'] },
]

describe('filterProjects', () => {
  test('sem filtros retorna todos', () => {
    expect(filterProjects(sample, {})).toHaveLength(3)
  })
  test('filtra por tipo', () => {
    expect(filterProjects(sample, { type: 'pessoal' }).map((p) => p.slug)).toEqual(['a', 'c'])
  })
  test('filtra por stack (case-insensitive)', () => {
    expect(filterProjects(sample, { stack: 'aws' }).map((p) => p.slug)).toEqual(['a', 'c'])
  })
  test('combina tipo + stack', () => {
    expect(filterProjects(sample, { type: 'pessoal', stack: 'redis' }).map((p) => p.slug)).toEqual(['c'])
  })
})
