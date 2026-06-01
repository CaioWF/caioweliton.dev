import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { Locale } from '@/lib/i18n/locales'
import type { PostMeta } from './types'
import { parsePostMeta } from './parse'

const BLOG_DIR = join(process.cwd(), 'content', 'blog')

export async function getPostSlugs(locale: Locale): Promise<string[]> {
  try {
    const files = await readdir(join(BLOG_DIR, locale))
    return files.filter((f) => f.endsWith('.mdx')).map((f) => f.replace(/\.mdx$/, ''))
  } catch {
    return []
  }
}

export async function getAllPosts(locale: Locale): Promise<PostMeta[]> {
  const slugs = await getPostSlugs(locale)
  const metas = await Promise.all(
    slugs.map(async (slug) => {
      const raw = await readFile(join(BLOG_DIR, locale, `${slug}.mdx`), 'utf8')
      return parsePostMeta(raw, slug)
    }),
  )
  return metas.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export async function getPostSource(locale: Locale, slug: string): Promise<string | null> {
  try {
    return await readFile(join(BLOG_DIR, locale, `${slug}.mdx`), 'utf8')
  } catch {
    return null
  }
}
