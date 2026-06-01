'use client'

import { useState } from 'react'
import type { Locale } from '@/lib/i18n/locales'
import { experience } from '@/data/experience'
import { SectionHeading } from '@/components/sections/section-heading'

export function Experience({ locale }: { locale: Locale }) {
  const [active, setActive] = useState(0)
  const job = experience[active]

  return (
    <section id="experience" className="px-6 py-20">
      <SectionHeading index="03" label={locale === 'pt' ? 'Experiência' : 'Experience'} title={locale === 'pt' ? 'Onde trabalhei' : 'Where I worked'} />
      <div className="grid md:grid-cols-[200px_1fr] gap-6">
        <div role="tablist" aria-label="empresas" className="flex md:flex-col border-l border-stone-800 font-mono">
          {experience.map((j, i) => (
            <button
              key={j.company}
              role="tab"
              aria-selected={i === active}
              onClick={() => setActive(i)}
              className={`text-left px-5 py-3 -ml-px border-l-2 transition-colors ${i === active ? 'border-amber-600 text-amber-300 bg-amber-950/20' : 'border-transparent text-stone-500 hover:text-stone-300'}`}
            >
              <span className="block text-xs">{j.company}</span>
              <span className="block text-[10px] text-stone-600">{j.period[locale]}</span>
            </button>
          ))}
        </div>
        <div className="md:pl-6">
          <h3 className="text-lg font-semibold text-stone-100">
            {job.role[locale]} <span className="text-amber-600 font-normal">@ {job.company}</span>
          </h3>
          <p className="font-mono text-xs text-stone-600 mt-1 mb-5">{job.period[locale]}</p>
          <ul className="space-y-2.5">
            {job.bullets[locale].map((b, i) => (
              <li key={i} className="flex gap-2.5 text-sm text-stone-400 leading-relaxed">
                <span className="text-amber-600 shrink-0">▹</span>{b}
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap gap-1.5">
            {job.stack.map((s) => (
              <span key={s} className="font-mono text-[10px] text-amber-300 bg-amber-950/30 rounded px-2 py-0.5">{s}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
