'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Locale } from '@/lib/i18n/locales'
import type { PostMeta } from '@/lib/blog/types'
import { filterByTag, allTags } from '@/lib/blog/filter'

export function PostList({ locale, posts }: { locale: Locale; posts: PostMeta[] }) {
  const [tag, setTag] = useState<string | null>(null)
  const tags = allTags(posts)
  const shown = filterByTag(posts, tag)

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
      <div className="flex flex-col">
        {shown.map((p) => {
          const cls = 'group flex items-center justify-between py-4 border-b border-border hover:border-muted transition-colors'
          const inner = (
            <>
              <div>
                <div className="text-foreground font-medium group-hover:text-accent transition-colors">{p.title}</div>
                <div className="flex gap-1.5 items-center mt-1 font-mono text-[10px] text-faint">
                  {p.tags[0] && <span className="text-accent">{p.tags[0]}</span>}
                  {p.tags[0] && <span>·</span>}
                  {p.externalUrl ? <span>{p.source ?? 'externo'} ↗</span> : <span>{p.readingMinutes} min</span>}
                </div>
              </div>
              <span className="font-mono text-xs text-faint shrink-0 ml-4">{p.date}</span>
            </>
          )
          return p.externalUrl ? (
            <a key={p.externalUrl} href={p.externalUrl} target="_blank" rel="noreferrer" className={cls}>{inner}</a>
          ) : (
            <Link key={p.slug} href={`/${locale}/blog/${p.slug}`} className={cls}>{inner}</Link>
          )
        })}
      </div>
    </div>
  )
}
