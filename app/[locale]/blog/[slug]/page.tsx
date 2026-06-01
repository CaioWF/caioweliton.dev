import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MDXRemote, type MDXRemoteOptions } from 'next-mdx-remote-client/rsc'
import { isLocale, locales, type Locale } from '@/lib/i18n/locales'
import { getAllPosts, getPostSlugs, getPostSource } from '@/lib/blog/posts'
import { buildMetadata } from '@/lib/seo/metadata'
import { buildBlogPostingJsonLd } from '@/lib/seo/blog-jsonld'
import { JsonLd } from '@/components/json-ld'
import { components } from '@/mdx-components'

export const dynamicParams = false

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = []
  for (const locale of locales) {
    for (const slug of await getPostSlugs(locale)) {
      params.push({ locale, slug })
    }
  }
  return params
}

async function getMeta(locale: Locale, slug: string) {
  const posts = await getAllPosts(locale)
  return posts.find((p) => p.slug === slug)
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params
  const l = isLocale(locale) ? (locale as Locale) : 'pt'
  const meta = await getMeta(l, slug)
  if (!meta) return {}
  return buildMetadata({ locale: l, path: `/blog/${slug}`, title: `${meta.title} — Caio Weliton`, description: meta.description })
}

function MdxError({ error }: { error: Error }) {
  return <p className="text-red-400 font-mono text-sm">Erro ao renderizar: {error.message}</p>
}

export default async function PostPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()
  const l = locale as Locale

  const meta = await getMeta(l, slug)
  const source = await getPostSource(l, slug)
  if (!meta || !source) notFound()

  const options: MDXRemoteOptions = { parseFrontmatter: true }

  return (
    <article className="px-6 py-20 max-w-2xl">
      <JsonLd data={buildBlogPostingJsonLd(meta, l)} />
      <p className="font-mono text-xs text-stone-600 mb-2">{meta.date} · {meta.readingMinutes} min</p>
      <div className="flex gap-1.5 mb-8 font-mono text-[10px]">
        {meta.tags.map((t) => <span key={t} className="text-amber-300 bg-amber-950/30 rounded px-2 py-0.5">{t}</span>)}
      </div>
      <MDXRemote source={source} options={options} components={components} onError={MdxError} />
      <div className="mt-12 pt-6 border-t border-stone-900">
        <a href={`/${l}/blog`} className="font-mono text-xs text-amber-500 hover:text-amber-400">← {l === 'pt' ? 'voltar' : 'back'}</a>
      </div>
    </article>
  )
}
