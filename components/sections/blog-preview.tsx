import Link from 'next/link'
import type { Locale } from '@/lib/i18n/locales'
import { getAllPosts } from '@/lib/blog/posts'
import { Tile } from '@/components/bento/tile'

export async function BlogPreview({ locale }: { locale: Locale }) {
  const posts = (await getAllPosts(locale)).slice(0, 3)
  if (posts.length === 0) return null

  return (
    <Tile id="blog" label="blog" className="md:col-span-6">
      <div className="flex flex-col">
        {posts.map((p) => {
          const cls = 'group flex items-center justify-between py-4 border-b border-border hover:border-muted transition-colors'
          const inner = (
            <>
              <div>
                <div className="text-foreground font-medium group-hover:text-accent transition-colors">{p.title}</div>
                <div className="font-mono text-[10px] text-faint mt-1">{p.tags[0]} · {p.externalUrl ? `${p.source ?? 'externo'} ↗` : `${p.readingMinutes} min`}</div>
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
      <Link href={`/${locale}/blog`} className="inline-block mt-6 font-mono text-xs text-accent hover:text-accent-strong">
        {locale === 'pt' ? 'ver todos os posts' : 'see all posts'} →
      </Link>
    </Tile>
  )
}
