import type { Locale } from '@/lib/i18n/locales'
import type { Dictionary } from '@/lib/i18n/dictionaries'
import Link from 'next/link'
import { Avatar } from '@/components/avatar'
import { Tile } from '@/components/bento/tile'

export function Hero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <Tile featured label={locale === 'pt' ? 'início' : 'start'} className="md:col-span-6">
      <div>
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
          <div className="text-foreground">{locale === 'pt' ? '5+ anos · Senior SWE · cloud · alta concorrência' : '5+ years · Senior SWE · cloud · high concurrency'}</div>
          <div className="mt-3 flex flex-wrap gap-3">
            <Link href={`/${locale}#projects`} className="rounded-md bg-accent px-4 py-2 font-semibold text-white hover:bg-accent-strong transition-colors">$ {dict.hero.ctaProjects} →</Link>
            <a href={`/${locale}/cv`} download className="rounded-md border border-border px-4 py-2 text-foreground hover:border-accent transition-colors">$ {dict.hero.ctaCv} ↓</a>
          </div>
        </div>
      </div>
    </Tile>
  )
}
