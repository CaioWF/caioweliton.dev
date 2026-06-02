import type { Locale } from '@/lib/i18n/locales'
import type { Dictionary } from '@/lib/i18n/dictionaries'
import { site } from '@/data/site'
import { Avatar } from '@/components/avatar'
import { Reveal } from '@/components/reveal'

export function Hero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="relative overflow-hidden px-6 py-20 md:py-28">
      <div className="pointer-events-none absolute -top-20 -right-20 h-80 w-80 rounded-full"
        style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)', opacity: 0.06 }} />
      <Reveal>
      <p className="font-mono text-xs tracking-[0.2em] text-accent mb-5">№ 00 — {locale === 'pt' ? 'INÍCIO' : 'START'}</p>
      <div className="flex flex-col md:flex-row md:items-start gap-8">
        <Avatar />
        <div className="flex-1">
          <h1 className="font-display text-4xl md:text-5xl tracking-tight text-foreground">{dict.hero.greeting}</h1>
          <p className="mt-3 max-w-xl text-muted leading-relaxed">{dict.hero.tagline}</p>
        </div>
      </div>

      <div className="mt-8 h-px bg-border" />

      <div className="mt-8 flex flex-col md:flex-row gap-8 md:items-center">
        <div className="font-mono text-xs leading-7 rounded-lg border border-border bg-surface p-4 max-w-sm">
          <div className="text-faint">~/caio <span className="text-accent">$</span> whoami</div>
          <div className="text-muted">{locale === 'pt' ? 'arquitetura · microserviços · mentoring' : 'architecture · microservices · mentoring'}</div>
          <div className="text-faint">~/caio <span className="text-accent">$</span> <span className="text-foreground">{dict.hero.ctaProjects.replace(/ /g, '_')}</span><span className="text-accent">▋</span></div>
        </div>
        <dl className="grid grid-cols-2 gap-x-8 gap-y-4 text-xs">
          <div><dt className="font-mono text-accent mb-1">{locale === 'pt' ? 'LOCAL' : 'LOCATION'}</dt><dd className="text-foreground">{site.location[locale]}</dd></div>
          <div><dt className="font-mono text-accent mb-1">EXP</dt><dd className="text-foreground">{site.yearsExperience}+ {locale === 'pt' ? 'anos' : 'years'}</dd></div>
          <div><dt className="font-mono text-accent mb-1">STATUS</dt><dd className="text-ok">{dict.hero.statusAvailable}</dd></div>
          <div><dt className="font-mono text-accent mb-1">CV</dt><dd><a href={`/${locale}/cv`} className="text-foreground border-b border-border hover:border-accent">{dict.hero.ctaCv} ↓</a></dd></div>
        </dl>
      </div>
      </Reveal>
    </section>
  )
}
