import type { Locale } from '@/lib/i18n/locales'
import type { PostMeta } from '@/lib/blog/types'
import { site } from '@/data/site'
import { SITE_URL } from './site-url'

export function buildBlogPostingJsonLd(meta: PostMeta, locale: Locale): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: meta.title,
    description: meta.description,
    datePublished: meta.date,
    dateModified: meta.date,
    keywords: meta.tags.join(', '),
    url: `${SITE_URL}/${locale}/blog/${meta.slug}`,
    author: { '@type': 'Person', name: site.name, url: SITE_URL },
  }
}
