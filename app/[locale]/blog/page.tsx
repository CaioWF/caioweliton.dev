import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLocale, type Locale } from '@/lib/i18n/locales'
import { getAllPosts } from '@/lib/blog/posts'
import { buildMetadata } from '@/lib/seo/metadata'
import { PostList } from '@/components/blog/post-list'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const l = isLocale(locale) ? (locale as Locale) : 'pt'
  return buildMetadata({
    locale: l, path: '/blog',
    title: 'Blog — Caio Weliton',
    description: l === 'pt'
      ? 'Artigos sobre Node.js, AWS, arquitetura e liderança técnica.'
      : 'Articles about Node.js, AWS, architecture and technical leadership.',
  })
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const l = locale as Locale
  const posts = await getAllPosts(l)

  return (
    <section className="px-6 py-20 max-w-5xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-8">
        {l === 'pt' ? 'Artigos' : 'Articles'}
      </h1>
      <PostList locale={l} posts={posts} />
    </section>
  )
}
