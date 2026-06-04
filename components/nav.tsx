import Link from 'next/link'
import type { Locale } from '@/lib/i18n/locales'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { LocaleToggle } from '@/components/i18n/locale-toggle'

export function Nav({ locale }: { locale: Locale }) {
  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-border">
      <Link href={`/${locale}`} className="font-mono text-sm font-semibold tracking-tight text-foreground">
        caioweliton<span className="text-accent">.dev</span>
      </Link>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <LocaleToggle currentLocale={locale} />
      </div>
    </nav>
  )
}
