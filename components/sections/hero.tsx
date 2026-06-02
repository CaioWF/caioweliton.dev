import type { Locale } from '@/lib/i18n/locales'
import type { Dictionary } from '@/lib/i18n/dictionaries'
import { site } from '@/data/site'
import { Avatar } from '@/components/avatar'
import { Tile } from '@/components/bento/tile'

export function Hero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <Tile featured label={locale === 'pt' ? 'início' : 'start'} className="md:col-span-6">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-16 -right-16 h-72 w-72 rounded-full"
          style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)', opacity: 0.06 }} />
        <div className="flex flex-col md:flex-row md:items-start gap-8">
          <Avatar />
          <div className="flex-1">
            <h1 className="font-display text-4xl md:text-5xl tracking-tight text-foreground">
              {dict.hero.greeting.split('Caio')[0]}
              <span className="text-gradient">Caio</span>
              {dict.hero.greeting.split('Caio').slice(1).join('Caio')}
            </h1>
            <p className="mt-3 max-w-xl text-muted leading-relaxed">{dict.hero.tagline}</p>
          </div>
        </div>

        <div className="mt-8 font-mono text-xs leading-7">
          <div className="text-faint">~/caio <span className="text-accent">$</span> whoami</div>
          <div className="text-muted">{locale === 'pt' ? 'arquitetura · microserviços · mentoring' : 'architecture · microservices · mentoring'}</div>
          <div className="text-faint">~/caio <span className="text-accent">$</span> <span className="text-foreground">{dict.hero.ctaProjects.replace(/ /g, '_')}</span><span className="text-accent">▋</span></div>

          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[11px]">
            <span><span className="text-faint">{locale === 'pt' ? 'local' : 'location'}</span> <span className="text-foreground">{site.location[locale]}</span></span>
            <span><span className="text-faint">exp</span> <span className="text-foreground">{site.yearsExperience}+ {locale === 'pt' ? 'anos' : 'years'}</span></span>
            <span><span className="text-faint">status</span> <span className="text-ok">{dict.hero.statusAvailable}</span></span>
            <span><a href={`/${locale}/cv`} className="text-accent hover:text-accent-strong">{dict.hero.ctaCv} ↓</a></span>
          </div>
        </div>
      </div>
    </Tile>
  )
}
