'use client'

import { useState } from 'react'
import type { Locale } from '@/lib/i18n/locales'
import { experience } from '@/data/experience'
import { Tile } from '@/components/bento/tile'

export function Experience({ locale }: { locale: Locale }) {
  const [active, setActive] = useState(0)
  const job = experience[active]

  return (
    <Tile id="experience" label={locale === 'pt' ? 'experiência' : 'experience'} className="md:col-span-6">
      <div className="grid md:grid-cols-[200px_1fr] gap-6">
        <div role="tablist" aria-label="empresas" className="flex md:flex-col border-l border-border font-mono">
          {experience.map((j, i) => (
            <button
              key={j.company}
              role="tab"
              aria-selected={i === active}
              onClick={() => setActive(i)}
              className={`text-left px-5 py-3 -ml-px border-l-2 transition-colors ${i === active ? 'border-accent text-accent bg-accent/10' : 'border-transparent text-faint hover:text-muted'}`}
            >
              <span className="block text-xs">{j.company}</span>
              <span className="block text-[10px] text-faint">{j.period[locale]}</span>
            </button>
          ))}
        </div>
        <div className="md:pl-6">
          <h3 className="text-lg font-semibold text-foreground">
            {job.role[locale]} <span className="text-accent font-normal">@ {job.company}</span>
          </h3>
          <p className="font-mono text-xs text-faint mt-1 mb-5">{job.period[locale]}</p>
          <ul className="space-y-2.5">
            {job.bullets[locale].map((b, i) => (
              <li key={i} className="flex gap-2.5 text-sm text-muted leading-relaxed">
                <span className="text-accent shrink-0">▹</span>{b}
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap gap-1.5">
            {job.stack.map((s) => (
              <span key={s} className="font-mono text-[10px] text-accent bg-accent/10 border border-accent/20 rounded px-2 py-0.5">{s}</span>
            ))}
          </div>
        </div>
      </div>
    </Tile>
  )
}
