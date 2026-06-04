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
        {site.available && (
          <div>
            <dt className="text-faint text-[10px] uppercase tracking-wider">Status</dt>
            <dd className="text-ok"><span className="mr-1">●</span>{locale === 'pt' ? 'Disponível' : 'Available'}</dd>
          </div>
        )}
        <div>
          <dt className="text-faint text-[10px] uppercase tracking-wider">CV</dt>
          <dd><a href={`/${locale}/cv`} download className="text-accent hover:text-accent-strong">{locale === 'pt' ? 'Baixar' : 'Download'} ↓</a></dd>
        </div>
      </dl>
      <div className="mt-4 pt-4 border-t border-border flex flex-col gap-1.5 font-mono text-sm">
        <a href={site.socials.github} target="_blank" rel="noreferrer" className="text-muted hover:text-accent transition-colors">GitHub ↗</a>
        <a href={site.socials.linkedin} target="_blank" rel="noreferrer" className="text-muted hover:text-accent transition-colors">LinkedIn ↗</a>
        <a href={site.socials.medium} target="_blank" rel="noreferrer" className="text-muted hover:text-accent transition-colors">Medium ↗</a>
      </div>
    </Tile>
  )
}
