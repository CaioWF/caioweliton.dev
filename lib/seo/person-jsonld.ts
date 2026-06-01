import { site } from '@/data/site'
import { SITE_URL } from './site-url'

export function buildPersonJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: site.name,
    url: SITE_URL,
    email: `mailto:${site.email}`,
    jobTitle: site.role.en,
    sameAs: [site.socials.github, site.socials.linkedin, site.socials.medium],
  }
}
