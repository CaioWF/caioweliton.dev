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
      <div className="hidden md:flex gap-6 text-sm text-muted">
        <a href="#about">{dict.nav.about}</a>
        <a href="#experience">{dict.nav.experience}</a>
        <a href="#projects">{dict.nav.projects}</a>
        <Link href={`/${locale}/blog`}>{dict.nav.blog}</Link>
        <a href="#contact" className="text-accent">{dict.nav.contact}</a>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <LocaleToggle currentLocale={locale} />
      </div>
    </nav>
  )
}
