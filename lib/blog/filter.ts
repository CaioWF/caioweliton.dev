import type { PostMeta } from './types'

export function filterByTag(posts: PostMeta[], tag: string | null): PostMeta[] {
  if (!tag) return posts
  return posts.filter((p) => p.tags.includes(tag))
}

export function allTags(posts: PostMeta[]): string[] {
  return Array.from(new Set(posts.flatMap((p) => p.tags))).sort()
}
