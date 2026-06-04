import type { Locale } from '@/lib/i18n/locales'
import { uses } from '@/data/uses'
import { Tile } from '@/components/bento/tile'

export function Uses({ locale }: { locale: Locale }) {
  return (
    <Tile label="uses" href={`/${locale}/uses`} className="md:col-span-2">
      <div className="space-y-3">
        {uses.map((cat) => (
          <div key={cat.label.en}>
            <p className="font-mono text-[10px] text-faint mb-1">{cat.label[locale]}</p>
            <ul className="space-y-0.5">
              {cat.items.map((it) => (
                <li key={it.name} className="text-sm text-muted">{it.name}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <span className="mt-3 inline-block font-mono text-xs text-accent group-hover:text-accent-strong">
        {locale === 'pt' ? 'ver uses' : 'see uses'} →
      </span>
    </Tile>
  )
}
