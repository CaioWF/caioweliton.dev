import type { Locale } from '@/lib/i18n/locales'
import { education } from '@/data/education'
import { Tile } from '@/components/bento/tile'

export function Education({ locale }: { locale: Locale }) {
  return (
    <Tile label={locale === 'pt' ? 'formação' : 'education'} className="md:col-span-2">
      <ul className="space-y-3">
        {education.map((e) => (
          <li key={e.school}>
            <p className="text-sm text-foreground leading-snug">{e.degree[locale]}</p>
            <p className="font-mono text-[10px] text-faint mt-0.5">{e.school} · {e.period}</p>
            {e.note && (
              <span className="mt-1 inline-block font-mono text-[10px] text-accent bg-accent/10 border border-accent/20 rounded px-2 py-0.5">{e.note[locale]}</span>
            )}
          </li>
        ))}
      </ul>
    </Tile>
  )
}
