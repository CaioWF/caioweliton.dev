import matter from 'gray-matter'
import readingTime from 'reading-time'
import type { PostMeta } from './types'

export function parsePostMeta(raw: string, slug: string): PostMeta {
  const { data, content } = matter(raw)
  const date = data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date)
  return {
    slug,
    title: String(data.title ?? ''),
    date,
    description: String(data.description ?? ''),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    readingMinutes: Math.max(1, Math.ceil(readingTime(content).minutes)),
  }
}
