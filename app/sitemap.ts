import type { MetadataRoute } from 'next'
import { locales } from '@/lib/i18n/locales'
import { SITE_URL } from '@/lib/seo/site-url'

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.map((locale) => ({
    url: `${SITE_URL}/${locale}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 1,
  }))
}
