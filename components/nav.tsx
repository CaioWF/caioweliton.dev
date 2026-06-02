import Link from 'next/link'
import type { Locale } from '@/lib/i18n/locales'
import type { Dictionary } from '@/lib/i18n/dictionaries'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { LocaleToggle } from '@/components/i18n/locale-toggle'

export function Nav({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-border">
      <Link href={`/${locale}`} className="text-foreground font-bold tracking-tight">
        caio<span className="text-accent">.</span>
      </Link>
      <div className="hidden md:flex gap-5 font-mono text-xs text-muted">
        <Link href={`/${locale}#about`} className="hover:text-accent transition-colors">[ {dict.nav.about} ]</Link>
        <Link href={`/${locale}#experience`} className="hover:text-accent transition-colors">[ {dict.nav.experience} ]</Link>
        <Link href={`/${locale}#projects`} className="hover:text-accent transition-colors">[ {dict.nav.projects} ]</Link>
        <Link href={`/${locale}#blog`} className="hover:text-accent transition-colors">[ {dict.nav.blog} ]</Link>
        <Link href={`/${locale}#contact`} className="text-accent">[ {dict.nav.contact} ]</Link>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <LocaleToggle currentLocale={locale} />
      </div>
    </nav>
  )
}
