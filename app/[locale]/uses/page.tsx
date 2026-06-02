import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLocale, type Locale } from '@/lib/i18n/locales'
import { buildMetadata } from '@/lib/seo/metadata'
import { uses } from '@/data/uses'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const l = isLocale(locale) ? (locale as Locale) : 'pt'
  return buildMetadata({
    locale: l, path: '/uses',
    title: 'Uses — Caio Weliton',
    description: l === 'pt' ? 'Hardware, software e setup que uso.' : 'Hardware, software and setup I use.',
  })
}

export default async function UsesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const l = locale as Locale

  return (
    <section className="px-6 py-20 max-w-2xl">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-stone-50 mb-1">Uses</h1>
      <p className="font-mono text-xs text-stone-600 mb-10">
        {l === 'pt' ? 'Ferramentas e setup do dia a dia' : 'Daily tools and setup'}
      </p>
      <div className="space-y-8">
        {uses.map((cat) => (
          <div key={cat.label.en}>
            <h2 className="font-mono text-xs tracking-[0.15em] text-amber-600 mb-3">▹ {cat.label[l].toUpperCase()}</h2>
            <div className="space-y-1.5">
              {cat.items.map((it) => (
                <div key={it.name} className="flex justify-between text-sm">
                  <span className="text-stone-200">{it.name}</span>
                  <span className="text-stone-600">{it.note[l]}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
