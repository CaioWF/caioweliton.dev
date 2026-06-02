import type { Locale } from '@/lib/i18n/locales'
import { skills } from '@/data/skills'
import { SectionHeading } from '@/components/sections/section-heading'
import { Reveal } from '@/components/reveal'

export function Skills({ locale }: { locale: Locale }) {
  return (
    <section id="skills" className="px-6 py-20">
      <Reveal>
        <SectionHeading index="05" label="Skills" title={locale === 'pt' ? 'O que uso' : 'What I use'} />
        <div className="grid md:grid-cols-2 gap-5">
          {skills.map((cat) => (
            <div key={cat.label.en} className="rounded-lg border border-border bg-surface p-6">
              <div className="flex items-center gap-2.5 mb-5">
                <span className="text-accent">{cat.icon}</span>
                <h3 className="font-mono text-sm font-semibold text-foreground">{cat.label[locale]}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {cat.items.map((s) => (
                  <span key={s} className="font-mono text-xs text-accent border border-accent/30 bg-accent/10 rounded px-3 py-1">{s}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  )
}
