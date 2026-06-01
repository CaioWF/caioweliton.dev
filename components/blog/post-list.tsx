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
          className={`font-mono text-xs rounded px-3 py-1 transition-colors ${tag === null ? 'bg-amber-600 text-white' : 'border border-stone-800 text-stone-500 hover:text-stone-300'}`}>
          {locale === 'pt' ? 'todos' : 'all'}
        </button>
        {tags.map((t) => (
          <button key={t} onClick={() => setTag(t)}
            className={`font-mono text-xs rounded px-3 py-1 transition-colors ${tag === t ? 'bg-amber-600 text-white' : 'border border-stone-800 text-stone-500 hover:text-stone-300'}`}>
            {t}
          </button>
        ))}
      </div>
      <div className="flex flex-col">
        {shown.map((p) => (
          <Link key={p.slug} href={`/${locale}/blog/${p.slug}`}
            className="group flex items-center justify-between py-4 border-b border-stone-900 hover:border-stone-700 transition-colors">
            <div>
              <div className="text-stone-100 font-medium group-hover:text-amber-400 transition-colors">{p.title}</div>
              <div className="flex gap-1.5 items-center mt-1 font-mono text-[10px] text-stone-600">
                {p.tags[0] && <span className="text-amber-700">{p.tags[0]}</span>}
                <span>·</span>
                <span>{p.readingMinutes} min</span>
              </div>
            </div>
            <span className="font-mono text-xs text-stone-600 shrink-0 ml-4">{p.date}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
