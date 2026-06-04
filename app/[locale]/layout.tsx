import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { locales, isLocale, type Locale } from '@/lib/i18n/locales'
import { Nav } from '@/components/nav'
import { HtmlLang } from '@/components/i18n/html-lang'
import { SkipLink } from '@/components/skip-link'
import { buildMetadata } from '@/lib/seo/metadata'
import { site } from '@/data/site'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const l = isLocale(locale) ? (locale as Locale) : 'pt'
  return buildMetadata({
    locale: l,
    path: '/',
    title: `${site.name} — ${site.role[l]}`,
    description: l === 'pt'
      ? 'Engenheiro de software sênior. Node.js, TypeScript e AWS. Arquitetura, microserviços e liderança técnica.'
      : 'Senior software engineer. Node.js, TypeScript and AWS. Architecture, microservices and technical leadership.',
  })
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const l = locale as Locale

  return (
    <div lang={locale} className="min-h-screen text-foreground">
      <SkipLink label={l === 'pt' ? 'Pular para o conteúdo' : 'Skip to content'} />
      <HtmlLang locale={l} />
      <Nav locale={l} />
      <main id="content" tabIndex={-1}>{children}</main>
    </div>
  )
}
