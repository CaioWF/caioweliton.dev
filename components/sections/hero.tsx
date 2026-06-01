import type { Locale } from '@/lib/i18n/locales'
import type { Dictionary } from '@/lib/i18n/dictionaries'
import { site } from '@/data/site'
import { Avatar } from '@/components/avatar'

export function Hero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="relative overflow-hidden px-6 py-20 md:py-28">
      <div className="pointer-events-none absolute -top-20 -right-20 h-80 w-80 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(217,119,6,0.08) 0%, transparent 70%)' }} />
      <p className="font-mono text-xs tracking-[0.2em] text-amber-600 mb-5">№ 00 — {locale === 'pt' ? 'INÍCIO' : 'START'}</p>
      <div className="flex flex-col md:flex-row md:items-start gap-8">
        <Avatar />
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-stone-50">{dict.hero.greeting}</h1>
          <p className="mt-3 max-w-xl text-stone-400 leading-relaxed">{dict.hero.tagline}</p>
        </div>
      </div>

      <div className="mt-8 h-px bg-stone-800" />

      <div className="mt-8 flex flex-col md:flex-row gap-8 md:items-center">
        <div className="font-mono text-xs leading-7 rounded-lg border border-stone-800 bg-stone-950/80 p-4 max-w-sm">
          <div className="text-stone-600">~/caio <span className="text-amber-600">$</span> whoami</div>
          <div className="text-stone-400">{locale === 'pt' ? 'arquitetura · microserviços · mentoring' : 'architecture · microservices · mentoring'}</div>
          <div className="text-stone-600">~/caio <span className="text-amber-600">$</span> <span className="text-stone-100">{dict.hero.ctaProjects.replace(/ /g, '_')}</span><span className="text-amber-600">▋</span></div>
        </div>
        <dl className="grid grid-cols-2 gap-x-8 gap-y-4 text-xs">
          <div><dt className="font-mono text-amber-600 mb-1">{locale === 'pt' ? 'LOCAL' : 'LOCATION'}</dt><dd className="text-stone-200">{site.location[locale]}</dd></div>
          <div><dt className="font-mono text-amber-600 mb-1">EXP</dt><dd className="text-stone-200">{site.yearsExperience}+ {locale === 'pt' ? 'anos' : 'years'}</dd></div>
          <div><dt className="font-mono text-amber-600 mb-1">STATUS</dt><dd className="text-green-300">{dict.hero.statusAvailable}</dd></div>
          <div><dt className="font-mono text-amber-600 mb-1">CV</dt><dd><a href={`/${locale}/cv`} className="text-stone-200 border-b border-stone-700 hover:border-amber-600">{dict.hero.ctaCv} ↓</a></dd></div>
        </dl>
      </div>
    </section>
  )
}
