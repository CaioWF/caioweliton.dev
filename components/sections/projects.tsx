'use client'

import { useState } from 'react'
import type { Locale } from '@/lib/i18n/locales'
import { projects, type ProjectType } from '@/data/projects'
import { filterProjects } from '@/lib/projects/filter'
import { Tile } from '@/components/bento/tile'

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
    <Tile id="projects" label="projetos" title={locale === 'pt' ? 'O que construí' : 'What I built'} className="md:col-span-6">
      <div className="flex gap-2 mb-6 flex-wrap">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setType(f.key)}
            className={`font-mono text-xs rounded px-4 py-1.5 transition-colors ${type === f.key ? 'bg-accent text-white' : 'border border-border text-faint hover:text-muted'}`}
          >
            {f.label[locale]}
          </button>
        ))}
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {shown.map((p) => (
          <article key={p.slug} className={`rounded-lg border border-border p-5 hover:border-accent/30 transition-colors ${p.highlight ? 'md:col-span-2' : ''}`}>
            <div className="flex justify-between items-start mb-3">
              <span className="text-accent text-xl">⬡</span>
              <div className="flex gap-3 font-mono text-[10px] text-faint">
                <span className="uppercase text-accent">{p.type}</span>
                {p.github && <a href={p.github} target="_blank" rel="noreferrer" className="hover:text-muted">GitHub ↗</a>}
                {p.live && <a href={p.live} target="_blank" rel="noreferrer" className="hover:text-muted">Live ↗</a>}
              </div>
            </div>
            <h3 className="text-foreground font-semibold mb-2">{p.title}</h3>
            <p className="text-sm text-faint leading-relaxed mb-3">{p.description[locale]}</p>
            <div className="flex gap-1.5 flex-wrap">
              {p.stack.map((s) => <span key={s} className="font-mono text-[10px] text-accent bg-accent/10 border border-accent/20 rounded px-2 py-0.5">{s}</span>)}
            </div>
          </article>
        ))}
      </div>
    </Tile>
  )
}
