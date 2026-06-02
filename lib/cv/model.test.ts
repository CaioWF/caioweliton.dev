import { describe, test, expect } from 'vitest'
import { buildCvModel, cvFileName } from './model'

describe('buildCvModel', () => {
  test('monta o CV em EN com dados do site/experiência/skills', () => {
    const cv = buildCvModel('en')
    expect(cv.name).toBe('Caio Weliton')
    expect(cv.role).toBe('Senior Software Engineer')
    expect(cv.email).toBe('contato.caioweliton@gmail.com')
    expect(cv.experience[0].company).toBe('Compass UOL')
    expect(cv.experience[0].role).toBe('Senior Software Developer')
    expect(cv.experience[0].bullets.length).toBeGreaterThan(0)
    expect(cv.skills.length).toBeGreaterThanOrEqual(4)
    expect(cv.website).toContain('caioweliton.dev')
    expect(cv.github).toContain('github.com')
    expect(cv.summary.length).toBeGreaterThan(0)
    expect(cv.education.some((e) => e.school.includes('UFC'))).toBe(true)
    expect(cv.languages.map((l) => l.name)).toContain('Portuguese')
    expect(cv.awards.length).toBeGreaterThanOrEqual(3)
  })
  test('localiza para PT', () => {
    const cv = buildCvModel('pt')
    expect(cv.role).toBe('Engenheiro de Software Sênior')
    expect(cv.experience[0].role).toBe('Desenvolvedor de Software Sênior')
  })
})

describe('cvFileName', () => {
  test('inclui locale', () => {
    expect(cvFileName('pt')).toBe('cv-caio-weliton-pt.pdf')
    expect(cvFileName('en')).toBe('cv-caio-weliton-en.pdf')
  })
})
