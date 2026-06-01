'use client'

import { usePathname, useRouter } from 'next/navigation'
import { locales, type Locale } from '@/lib/i18n/locales'

export function LocaleToggle({ currentLocale }: { currentLocale: Locale }) {
  const pathname = usePathname()
  const router = useRouter()

  function switchTo(locale: Locale) {
    const segments = pathname.split('/')
    segments[1] = locale
    router.push(segments.join('/'))
  }

  return (
    <span className="font-mono text-xs">
      {locales.map((locale, i) => (
        <span key={locale}>
          {i > 0 && <span className="text-stone-600"> / </span>}
          <button
            type="button"
            onClick={() => switchTo(locale)}
            aria-current={locale === currentLocale}
            className={
              locale === currentLocale
                ? 'text-stone-100'
                : 'text-stone-500 hover:text-amber-500 transition-colors'
            }
          >
            {locale.toUpperCase()}
          </button>
        </span>
      ))}
    </span>
  )
}
