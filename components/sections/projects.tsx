'use client'

import { useState } from 'react'
import type { Locale } from '@/lib/i18n/locales'
import { projects, type ProjectType } from '@/data/projects'
import { filterProjects } from '@/lib/projects/filter'
import { SectionHeading } from '@/components/sections/section-heading'

type TypeFilter = ProjectType | 'todos'

export function Projects({ locale }: { locale: Locale }) {
  const [type, setType] = useState<TypeFilter>('todos')
  const shown = filterProjects(projects, type === 'todos' ? {} : { type })

  const filters: { key: TypeFilter; label: { pt: string; en: string } }[] = [
    { key: 'todos', label: { pt: 'todos', en: 'all' } },
    { key: 'pessoal', label: { pt: 'pessoais', en: 'personal' } },
    { key: 'profissional', label: { pt: 'profissionais', en: 'professional' } },
  ]

  return (
    <section id="projects" className="px-6 py-20">
      <SectionHeading index="04" label={locale === 'pt' ? 'Projetos' : 'Projects'} title={locale === 'pt' ? 'O que construí' : 'What I built'} />
      <div className="flex gap-2 mb-8 flex-wrap">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setType(f.key)}
            className={`font-mono text-xs rounded px-4 py-1.5 transition-colors ${type === f.key ? 'bg-amber-600 text-white' : 'border border-stone-800 text-stone-500 hover:text-stone-300'}`}
          >
            {f.label[locale]}
          </button>
        ))}
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {shown.map((p) => (
          <article key={p.slug} className={`rounded-lg border border-stone-800 bg-stone-900/60 p-5 hover:border-amber-700/50 transition-colors ${p.highlight ? 'md:col-span-2' : ''}`}>
            <div className="flex justify-between items-start mb-3">
              <span className="text-amber-600 text-xl">⬡</span>
              <div className="flex gap-3 font-mono text-[10px] text-stone-500">
                <span className="uppercase text-amber-700">{p.type}</span>
                {p.github && <a href={p.github} target="_blank" rel="noreferrer" className="hover:text-stone-300">GitHub ↗</a>}
                {p.live && <a href={p.live} target="_blank" rel="noreferrer" className="hover:text-stone-300">Live ↗</a>}
              </div>
            </div>
            <h3 className="text-stone-100 font-semibold mb-2">{p.title}</h3>
            <p className="text-sm text-stone-500 leading-relaxed mb-3">{p.description[locale]}</p>
            <div className="flex gap-2 flex-wrap font-mono text-[10px] text-amber-300/80">
              {p.stack.map((s) => <span key={s}>{s}</span>)}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
