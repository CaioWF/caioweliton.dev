export type PostMeta = {
  slug: string
  title: string
  date: string // ISO yyyy-mm-dd
  description: string
  tags: string[]
  readingMinutes?: number
  externalUrl?: string // se presente, post mora fora (ex: Medium) e abre em nova aba
  source?: string // rótulo da origem externa, ex: 'Medium'
}
