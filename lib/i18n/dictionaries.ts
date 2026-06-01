import type { Locale } from './locales'
import pt from './dictionaries/pt.json'
import en from './dictionaries/en.json'

export type Dictionary = typeof pt

const dictionaries: Record<Locale, Dictionary> = { pt, en }

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]
}
