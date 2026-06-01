import { notFound } from 'next/navigation'
import { locales, isLocale, type Locale } from '@/lib/i18n/locales'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { Nav } from '@/components/nav'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
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
  const dict = await getDictionary(locale as Locale)

  return (
    <div lang={locale} className="min-h-screen bg-stone-950 text-stone-100">
      <Nav locale={locale as Locale} dict={dict} />
      <main>{children}</main>
    </div>
  )
}
