import { getDictionary } from '@/lib/i18n/dictionaries'
import { isLocale, type Locale } from '@/lib/i18n/locales'
import { notFound } from 'next/navigation'
import { Hero } from '@/components/sections/hero'
import { About } from '@/components/sections/about'
import { Stats } from '@/components/sections/stats'
import { Skills } from '@/components/sections/skills'
import { NowSnippet } from '@/components/sections/now-snippet'
import { Links } from '@/components/sections/links'
import { Experience } from '@/components/sections/experience'
import { Projects } from '@/components/sections/projects'
import { BlogPreview } from '@/components/sections/blog-preview'
import { Contact } from '@/components/sections/contact'
import { JsonLd } from '@/components/json-ld'
import { buildPersonJsonLd } from '@/lib/seo/person-jsonld'

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const l = locale as Locale
  const dict = await getDictionary(l)

  return (
    <>
      <JsonLd data={buildPersonJsonLd()} />
      <div className="mx-auto max-w-5xl px-6 py-10 grid grid-cols-1 md:grid-cols-6 gap-4">
        <Hero locale={l} dict={dict} />
        <About locale={l} />
        <Stats locale={l} />
        <Skills locale={l} />
        <NowSnippet locale={l} />
        <Links />
        <Experience locale={l} />
        <Projects locale={l} />
        <BlogPreview locale={l} />
        <Contact locale={l} />
      </div>
    </>
  )
}
