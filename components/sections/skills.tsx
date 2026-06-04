import type { Locale } from '@/lib/i18n/locales'
import { skills } from '@/data/skills'
import { Tile } from '@/components/bento/tile'

export function Skills({ locale }: { locale: Locale }) {
  return (
    <Tile label="stack" className="md:col-span-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-4">
        {skills.map((cat) => (
          <div key={cat.label.en}>
            <p className="font-mono text-[10px] text-faint mb-1">{cat.icon} {cat.label[locale]}</p>
            <div className="flex flex-wrap gap-1.5">
              {cat.items.map((s) => (
                <span key={s.en} className="font-mono text-[10px] text-accent bg-accent/10 border border-accent/20 rounded px-2 py-0.5">{s[locale]}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Tile>
  )
}
