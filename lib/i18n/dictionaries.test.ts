import { describe, test, expect } from 'vitest'
import { getDictionary } from './dictionaries'

describe('getDictionary', () => {
  test('carrega o dicionário PT', async () => {
    const dict = await getDictionary('pt')
    expect(dict.nav.about).toBe('Sobre')
    expect(dict.hero.greeting).toBe('Oi, eu sou o Caio.')
  })
  test('carrega o dicionário EN', async () => {
    const dict = await getDictionary('en')
    expect(dict.nav.about).toBe('About')
    expect(dict.hero.greeting).toBe("Hi, I'm Caio.")
  })
  test('PT e EN têm exatamente as mesmas chaves de nav', async () => {
    const pt = await getDictionary('pt')
    const en = await getDictionary('en')
    expect(Object.keys(pt.nav).sort()).toEqual(Object.keys(en.nav).sort())
  })
})
