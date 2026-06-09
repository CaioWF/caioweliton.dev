'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Locale } from '@/lib/i18n/locales'
import type { PostMeta } from '@/lib/blog/types'
import { filterByTag, allTags } from '@/lib/blog/filter'

function Chips({ tags }: { tags: string[] }) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {tags.map((t) => (
        <span key={t} className="font-mono text-[10px] text-accent bg-accent/10 border border-accent/20 rounded px-2 py-0.5">{t}</span>
      ))}
    </div>
  )
}

function PostCard({ p, locale, featured = false }: { p: PostMeta; locale: Locale; featured?: boolean }) {
  const cls = `group relative flex h-full flex-col overflow-hidden rounded-xl border bg-surface p-6 transition-colors hover:border-accent/40 ${featured ? 'border-accent/40' : 'border-border'}`
  const label = featured ? (locale === 'pt' ? 'destaque' : 'featured') : 'post'
  const meta = p.externalUrl ? `${p.source ?? 'externo'} ↗` : `${p.readingMinutes} min`
  const inner = (
    <>
      <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-accent mb-3">{'// '}{label}</p>
      <h2 className={`font-display text-foreground group-hover:text-accent transition-colors mb-2 ${featured ? 'text-2xl md:text-3xl' : 'text-xl'}`}>{p.title}</h2>
      {p.description && (
        <p className={`text-muted leading-relaxed mb-4 ${featured ? 'max-w-2xl' : 'text-sm line-clamp-2'}`}>{p.description}</p>
      )}
      <div className="mt-auto flex items-center justify-between gap-3">
        <Chips tags={featured ? p.tags : p.tags.slice(0, 2)} />
        <span className="font-mono text-[10px] text-faint shrink-0">{meta} · {p.date}</span>
      </div>
    </>
  )
  return p.externalUrl ? (
    <a href={p.externalUrl} target="_blank" rel="noreferrer" className={cls}>{inner}</a>
  ) : (
    <Link href={`/${locale}/blog/${p.slug}`} className={cls}>{inner}</Link>
  )
}

export function PostList({ locale, posts }: { locale: Locale; posts: PostMeta[] }) {
  const [tag, setTag] = useState<string | null>(null)
  const tags = allTags(posts)
  const shown = filterByTag(posts, tag)
  const [featured, ...rest] = shown

  return (
    <div>
      <div className="flex gap-2 flex-wrap mb-8">
        <button onClick={() => setTag(null)}
          className={`font-mono text-xs rounded px-3 py-1 transition-colors ${tag === null ? 'bg-accent text-white' : 'border border-border text-faint hover:text-muted'}`}>
          {locale === 'pt' ? 'todos' : 'all'}
        </button>
        {tags.map((t) => (
          <button key={t} onClick={() => setTag(t)}
            className={`font-mono text-xs rounded px-3 py-1 transition-colors ${tag === t ? 'bg-accent text-white' : 'border border-border text-faint hover:text-muted'}`}>
            {t}
          </button>
        ))}
      </div>

      {featured && <PostCard p={featured} locale={locale} featured />}

      {rest.length > 0 && (
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          {rest.map((p) => (
            <PostCard key={p.slug} p={p} locale={locale} />
          ))}
        </div>
      )}
    </div>
  )
}
