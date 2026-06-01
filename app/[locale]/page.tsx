import { getDictionary } from '@/lib/i18n/dictionaries'
import { isLocale, type Locale } from '@/lib/i18n/locales'
import { notFound } from 'next/navigation'

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const dict = await getDictionary(locale as Locale)

  return (
    <section className="px-6 py-24">
      <p className="font-mono text-xs tracking-[0.2em] text-amber-600 mb-5">№ 00 — INÍCIO</p>
      <h1 className="text-4xl font-bold tracking-tight text-stone-50">{dict.hero.greeting}</h1>
      <p className="mt-3 max-w-lg text-stone-400">{dict.hero.tagline}</p>
    </section>
  )
}
