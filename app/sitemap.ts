import type { MetadataRoute } from 'next'
import { locales } from '@/lib/i18n/locales'
import { SITE_URL } from '@/lib/seo/site-url'
import { getAllPosts } from '@/lib/blog/posts'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = []
  for (const locale of locales) {
    entries.push({ url: `${SITE_URL}/${locale}`, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 })
    entries.push({ url: `${SITE_URL}/${locale}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 })
    entries.push({ url: `${SITE_URL}/${locale}/now`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 })
    entries.push({ url: `${SITE_URL}/${locale}/uses`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 })
    for (const post of await getAllPosts(locale)) {
      if (post.externalUrl) continue // posts externos não têm página no nosso domínio
      entries.push({ url: `${SITE_URL}/${locale}/blog/${post.slug}`, lastModified: new Date(post.date), changeFrequency: 'monthly', priority: 0.6 })
    }
  }
  return entries
}
