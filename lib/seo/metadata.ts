import type { Metadata } from 'next'
import { locales, type Locale } from '@/lib/i18n/locales'
import { SITE_URL } from './site-url'

export function buildAlternates(locale: Locale, path: string) {
  const clean = path === '/' ? '' : path
  const languages = Object.fromEntries(
    locales.map((l) => [l, `${SITE_URL}/${l}${clean}`]),
  ) as Record<Locale, string>
  return { canonical: `${SITE_URL}/${locale}${clean}`, languages }
}

export function buildMetadata(opts: {
  locale: Locale
  path: string
  title: string
  description: string
}): Metadata {
  const { locale, path, title, description } = opts
  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: buildAlternates(locale, path),
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}${path === '/' ? '' : path}`,
      siteName: 'Caio Weliton',
      locale: locale === 'pt' ? 'pt_BR' : 'en_US',
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title, description },
  }
}
