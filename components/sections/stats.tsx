import type { Locale } from '@/lib/i18n/locales'
import { site } from '@/data/site'
import { Tile } from '@/components/bento/tile'

export function Stats({ locale }: { locale: Locale }) {
  return (
    <Tile label="stats" className="md:col-span-2">
      <dl className="space-y-3 font-mono text-sm">
        <div>
          <dt className="text-faint text-[10px] uppercase tracking-wider">{locale === 'pt' ? 'Experiência' : 'Experience'}</dt>
          <dd className="text-foreground">{site.yearsExperience}+ {locale === 'pt' ? 'anos' : 'years'}</dd>
        </div>
        <div>
          <dt className="text-faint text-[10px] uppercase tracking-wider">{locale === 'pt' ? 'Local' : 'Location'}</dt>
          <dd className="text-foreground">{site.location[locale]}</dd>
        </div>
        <div>
          <dt className="text-faint text-[10px] uppercase tracking-wider">CV</dt>
          <dd><a href={`/${locale}/cv`} className="text-accent hover:text-accent-strong">{locale === 'pt' ? 'baixar' : 'download'} ↓</a></dd>
        </div>
      </dl>
    </Tile>
  )
}
