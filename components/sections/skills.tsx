import type { Locale } from '@/lib/i18n/locales'
import { skills } from '@/data/skills'
import { SectionHeading } from '@/components/sections/section-heading'

export function Skills({ locale }: { locale: Locale }) {
  return (
    <section id="skills" className="px-6 py-20">
      <SectionHeading index="05" label="Skills" title={locale === 'pt' ? 'O que uso' : 'What I use'} />
      <div className="grid md:grid-cols-2 gap-5">
        {skills.map((cat) => (
          <div key={cat.label.en} className="rounded-lg border border-stone-800 bg-stone-900/60 p-6">
            <div className="flex items-center gap-2.5 mb-5">
              <span className="text-amber-600">{cat.icon}</span>
              <h3 className="font-mono text-sm font-semibold text-stone-100">{cat.label[locale]}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {cat.items.map((s) => (
                <span key={s} className="font-mono text-xs text-amber-300 border border-amber-900/50 bg-amber-950/30 rounded px-3 py-1">{s}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
