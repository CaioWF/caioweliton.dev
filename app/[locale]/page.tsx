import { getDictionary } from '@/lib/i18n/dictionaries'
import { isLocale, type Locale } from '@/lib/i18n/locales'
import { notFound } from 'next/navigation'
import { Hero } from '@/components/sections/hero'
import { About } from '@/components/sections/about'
import { Experience } from '@/components/sections/experience'
import { Projects } from '@/components/sections/projects'
import { Skills } from '@/components/sections/skills'
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
      <Hero locale={l} dict={dict} />
      <About locale={l} />
      <Experience locale={l} />
      <Projects locale={l} />
      <Skills locale={l} />
      <Contact locale={l} />
    </>
  )
}
