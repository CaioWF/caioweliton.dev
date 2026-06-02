import Link from 'next/link'
import type { Locale } from '@/lib/i18n/locales'
import { getAllPosts } from '@/lib/blog/posts'
import { SectionHeading } from '@/components/sections/section-heading'
import { Reveal } from '@/components/reveal'

export async function BlogPreview({ locale }: { locale: Locale }) {
  const posts = (await getAllPosts(locale)).slice(0, 3)
  if (posts.length === 0) return null

  return (
    <section id="blog" className="px-6 py-20">
      <Reveal>
        <SectionHeading index="06" label="Blog" title={locale === 'pt' ? 'Escritos recentes' : 'Recent writing'} />
        <div className="flex flex-col">
          {posts.map((p) => (
            <Link key={p.slug} href={`/${locale}/blog/${p.slug}`}
              className="group flex items-center justify-between py-4 border-b border-border hover:border-muted transition-colors">
              <div>
                <div className="text-foreground font-medium group-hover:text-accent transition-colors">{p.title}</div>
                <div className="font-mono text-[10px] text-faint mt-1">{p.tags[0]} · {p.readingMinutes} min</div>
              </div>
              <span className="font-mono text-xs text-faint shrink-0 ml-4">{p.date}</span>
            </Link>
          ))}
        </div>
        <Link href={`/${locale}/blog`} className="inline-block mt-6 font-mono text-xs text-accent hover:text-accent-strong">
          {locale === 'pt' ? 'ver todos os posts' : 'see all posts'} →
        </Link>
      </Reveal>
    </section>
  )
}
