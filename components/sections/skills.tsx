import type { Locale } from '@/lib/i18n/locales'
import { skills } from '@/data/skills'
import { Tile } from '@/components/bento/tile'

export function Skills({ locale }: { locale: Locale }) {
  return (
    <Tile label="stack" title={locale === 'pt' ? 'Ferramentas' : 'Tools'} className="md:col-span-2">
      <div className="space-y-3">
        {skills.map((cat) => (
          <div key={cat.label.en}>
            <p className="font-mono text-[10px] text-faint mb-1">{cat.icon} {cat.label[locale]}</p>
            <div className="flex flex-wrap gap-1.5">
              {cat.items.map((s) => (
                <span key={s} className="font-mono text-[10px] text-accent bg-accent/10 border border-accent/20 rounded px-2 py-0.5">{s}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Tile>
  )
}
