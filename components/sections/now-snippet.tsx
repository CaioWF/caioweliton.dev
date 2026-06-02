import type { Locale } from '@/lib/i18n/locales'
import { now } from '@/data/now'
import { Tile } from '@/components/bento/tile'

export function NowSnippet({ locale }: { locale: Locale }) {
  return (
    <Tile label="now" href={`/${locale}/now`} className="md:col-span-2">
      <p className="text-sm text-muted leading-relaxed line-clamp-4">{now.working[locale]}</p>
      <span className="mt-3 inline-block font-mono text-xs text-accent group-hover:text-accent-strong">
        {locale === 'pt' ? 'ver now' : 'see now'} →
      </span>
    </Tile>
  )
}
