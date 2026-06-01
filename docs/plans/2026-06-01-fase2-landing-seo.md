# Fase 2 — Landing + SEO Core Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) ou superpowers:executing-plans para implementar task-a-task. Steps usam checkbox (`- [ ]`).
>
> **⚠️ Commits:** Por preferência do dono (CLAUDE.md), **NÃO commitar por task nem por ciclo TDD.** Subagentes apenas implementam, testam e reportam. Commit único no fim da fase, com aprovação. **Sem push.**

**Goal:** Entregar a landing page completa de `caioweliton.dev` na pele "Warm Workshop" (6 seções: Hero, About, Experience, Projects, Skills, Contact), alimentada por uma camada de dados bilíngue tipada, com SEO core (JSON-LD Person, canonical, hreflang, sitemap, robots, OG image).

**Architecture:** Sobre a Foundation (Fase 1). Dados em `data/*.ts` (fonte única, campos `{pt,en}`). Seções como componentes em `components/sections/`, compostas em `app/[locale]/page.tsx` (Server Components; client só onde há interação — tabs de Experience, filtro de Projects). SEO via helpers puros em `lib/seo/` (testáveis) + `generateMetadata`, `app/sitemap.ts`, `app/robots.ts`, `app/[locale]/opengraph-image.tsx`.

**Tech Stack:** Next.js 16, TypeScript, Tailwind v4, Vitest + Testing Library, `next/og`.

---

## Convenções herdadas da Fase 1

- `Locale = 'pt' | 'en'`, `locales`, `defaultLocale`, `isLocale` em `@/lib/i18n/locales`.
- `getDictionary(locale)` + tipo `Dictionary` em `@/lib/i18n/dictionaries`.
- Páginas recebem `params: Promise<{ locale: string }>` e fazem `await params`.
- Paleta: utilitárias `stone-*` (neutros), `amber-600`/`amber-500` (acento), tokens `brand-*` disponíveis. Fundo `bg-stone-950`, texto `text-stone-100`/`text-stone-400`.
- Mono para labels/terminal: `font-mono`.

---

## File Structure

| Arquivo | Responsabilidade |
|---------|------------------|
| `data/site.ts` | Config global: nome, URL base, email, redes sociais, status |
| `data/experience.ts` | Array de cargos (bilíngue) |
| `data/projects.ts` | Array de projetos com `type` (bilíngue), 3-4 placeholders |
| `data/skills.ts` | Categorias de skills + tags |
| `lib/projects/filter.ts` | Função pura `filterProjects` (por tipo e stack) |
| `lib/seo/site-url.ts` | Resolve URL base canônica |
| `lib/seo/metadata.ts` | `buildMetadata({ locale, path, title, description })` com canonical + hreflang |
| `lib/seo/person-jsonld.ts` | `buildPersonJsonLd()` → objeto schema.org Person |
| `components/sections/section-heading.tsx` | Cabeçalho editorial reusável (`№ NN — LABEL` + título) |
| `components/sections/hero.tsx` | Hero (terminal motif, metadata grid, avatar) |
| `components/sections/about.tsx` | About (bio, stats, tags) |
| `components/sections/experience.tsx` | Experience (tabs por empresa — client) |
| `components/sections/projects.tsx` | Projects (grid + filtro — client) |
| `components/sections/skills.tsx` | Skills (4 categorias) |
| `components/sections/contact.tsx` | Contact (mailto, redes, footer) |
| `components/avatar.tsx` | Avatar com fallback de iniciais (pronto p/ foto real) |
| `components/json-ld.tsx` | Renderiza `<script type="application/ld+json">` |
| `app/[locale]/page.tsx` | Compõe as 6 seções + JSON-LD (modifica) |
| `app/[locale]/layout.tsx` | Adiciona `generateMetadata` (modifica) |
| `app/sitemap.ts` | Sitemap (ambos locales) |
| `app/robots.ts` | robots.txt |
| `app/[locale]/opengraph-image.tsx` | OG image via `next/og` |

---

## Task 1: Config do site (`data/site.ts`)

**Files:**
- Create: `data/site.ts`

- [ ] **Step 1: Criar a config**

```typescript
export const site = {
  name: 'Caio Weliton',
  role: { pt: 'Engenheiro de Software Sênior', en: 'Senior Software Engineer' },
  email: 'contato.caioweliton@gmail.com',
  location: { pt: 'Ceará, Brasil', en: 'Ceará, Brazil' },
  yearsExperience: 5,
  available: true,
  socials: {
    github: 'https://github.com/caiowf',
    linkedin: 'https://www.linkedin.com/in/caio-weliton',
    medium: 'https://medium.com/@devDependencies',
  },
} as const
```

Sem teste (config estática). Usado por SEO e seções.

---

## Task 2: Filtro de projetos (TDD) + dados

**Files:**
- Create: `data/projects.ts`
- Create: `lib/projects/filter.ts`
- Test: `lib/projects/filter.test.ts`

- [ ] **Step 1: Criar `data/projects.ts` (placeholders estruturados)**

```typescript
export type ProjectType = 'pessoal' | 'profissional'

export type Project = {
  slug: string
  title: string
  type: ProjectType
  description: { pt: string; en: string }
  stack: string[]
  github?: string
  live?: string
  highlight?: boolean
}

export const projects: Project[] = [
  {
    slug: 'placeholder-1',
    title: 'Projeto Destaque',
    type: 'pessoal',
    description: {
      pt: 'Descrição do projeto: o que resolve e impacto. (placeholder — preencher)',
      en: 'Project description: what it solves and impact. (placeholder — fill in)',
    },
    stack: ['Node.js', 'TypeScript', 'AWS'],
    github: 'https://github.com/caiowf',
    highlight: true,
  },
  {
    slug: 'placeholder-2',
    title: 'Projeto 2',
    type: 'profissional',
    description: {
      pt: 'Trabalho profissional descrito por impacto/papel, sem expor cliente. (placeholder)',
      en: 'Professional work described by impact/role, no client exposure. (placeholder)',
    },
    stack: ['Node.js', 'AWS', 'Redis'],
  },
  {
    slug: 'placeholder-3',
    title: 'Projeto 3',
    type: 'pessoal',
    description: {
      pt: 'Outro projeto pessoal. (placeholder — preencher)',
      en: 'Another personal project. (placeholder — fill in)',
    },
    stack: ['React', 'TypeScript'],
    github: 'https://github.com/caiowf',
  },
]
```

- [ ] **Step 2: Escrever o teste que falha**

`lib/projects/filter.test.ts`:
```typescript
import { describe, test, expect } from 'vitest'
import { filterProjects } from './filter'
import type { Project } from '@/data/projects'

const sample: Project[] = [
  { slug: 'a', title: 'A', type: 'pessoal', description: { pt: '', en: '' }, stack: ['Node.js', 'AWS'] },
  { slug: 'b', title: 'B', type: 'profissional', description: { pt: '', en: '' }, stack: ['React'] },
  { slug: 'c', title: 'C', type: 'pessoal', description: { pt: '', en: '' }, stack: ['AWS', 'Redis'] },
]

describe('filterProjects', () => {
  test('sem filtros retorna todos', () => {
    expect(filterProjects(sample, {})).toHaveLength(3)
  })
  test('filtra por tipo', () => {
    expect(filterProjects(sample, { type: 'pessoal' }).map((p) => p.slug)).toEqual(['a', 'c'])
  })
  test('filtra por stack (case-insensitive)', () => {
    expect(filterProjects(sample, { stack: 'aws' }).map((p) => p.slug)).toEqual(['a', 'c'])
  })
  test('combina tipo + stack', () => {
    expect(filterProjects(sample, { type: 'pessoal', stack: 'redis' }).map((p) => p.slug)).toEqual(['c'])
  })
})
```

- [ ] **Step 3: Rodar e verificar que falha**

Run: `npm test -- filter`
Expected: FAIL — módulo não encontrado.

- [ ] **Step 4: Implementar**

`lib/projects/filter.ts`:
```typescript
import type { Project, ProjectType } from '@/data/projects'

export type ProjectFilter = { type?: ProjectType; stack?: string }

export function filterProjects(projects: Project[], filter: ProjectFilter): Project[] {
  return projects.filter((p) => {
    if (filter.type && p.type !== filter.type) return false
    if (filter.stack) {
      const needle = filter.stack.toLowerCase()
      if (!p.stack.some((s) => s.toLowerCase() === needle)) return false
    }
    return true
  })
}
```

- [ ] **Step 5: Rodar e verificar que passa**

Run: `npm test -- filter`
Expected: 4 passed.

---

## Task 3: Dados de experiência e skills

**Files:**
- Create: `data/experience.ts`
- Create: `data/skills.ts`

- [ ] **Step 1: Criar `data/experience.ts`**

```typescript
export type Job = {
  company: string
  role: { pt: string; en: string }
  period: { pt: string; en: string }
  bullets: { pt: string[]; en: string[] }
  stack: string[]
}

export const experience: Job[] = [
  {
    company: 'Compass UOL',
    role: { pt: 'Desenvolvedor de Software Sênior', en: 'Senior Software Developer' },
    period: { pt: '2022 — atual', en: '2022 — present' },
    bullets: {
      pt: [
        'Arquitetura de APIs RESTful e microserviços com Node.js + TypeScript.',
        'Otimização de infra AWS (Lambda, SQS, ECS/EKS, CloudWatch) — custo e latência.',
        'Mentoring de devs júnior/pleno: code review, pair programming, trilhas.',
        'Hackathon winner com solução em AWS.',
      ],
      en: [
        'RESTful API and microservices architecture with Node.js + TypeScript.',
        'AWS infra optimization (Lambda, SQS, ECS/EKS, CloudWatch) — cost and latency.',
        'Mentoring junior/mid devs: code review, pair programming, growth tracks.',
        'Hackathon winner with an AWS solution.',
      ],
    },
    stack: ['Node.js', 'TypeScript', 'AWS', 'Docker', 'Redis', 'Datadog'],
  },
  {
    company: 'Casa Magalhães',
    role: { pt: 'Desenvolvedor de Software (Júnior → Pleno)', en: 'Software Developer (Junior → Mid)' },
    period: { pt: '2020 — 2022', en: '2020 — 2022' },
    bullets: {
      pt: [
        'Desenvolvimento full-stack com integração AWS.',
        'Aplicações back-end conteinerizadas (Docker), soluções cloud-native.',
      ],
      en: [
        'Full-stack development with AWS integration.',
        'Dockerized back-end apps, cloud-native solutions.',
      ],
    },
    stack: ['Node.js', 'JavaScript', 'AWS', 'Docker'],
  },
]
```

- [ ] **Step 2: Criar `data/skills.ts`**

```typescript
export type SkillCategory = {
  label: { pt: string; en: string }
  icon: string
  items: string[]
}

export const skills: SkillCategory[] = [
  {
    label: { pt: 'Back-end', en: 'Back-end' },
    icon: '⚙',
    items: ['Node.js', 'TypeScript', 'NestJS', 'Microserviços', 'REST APIs', 'Redis', 'SQL'],
  },
  {
    label: { pt: 'Cloud & DevOps', en: 'Cloud & DevOps' },
    icon: '☁',
    items: ['AWS Lambda', 'ECS/EKS', 'SQS', 'S3', 'API Gateway', 'Docker', 'CI/CD', 'Datadog'],
  },
  {
    label: { pt: 'Front-end', en: 'Front-end' },
    icon: '▢',
    items: ['React', 'Next.js', 'Vue.js', 'Tailwind', 'HTML/CSS'],
  },
  {
    label: { pt: 'Liderança & Processo', en: 'Leadership & Process' },
    icon: '◇',
    items: ['Mentoring', 'Code Review', 'Clean Architecture', 'Agile', 'AI/NLP'],
  },
]
```

Sem teste (dados estáticos; consumidos pelas seções).

---

## Task 4: Componentes base (SectionHeading, Avatar, JsonLd)

**Files:**
- Create: `components/sections/section-heading.tsx`
- Create: `components/avatar.tsx`
- Create: `components/json-ld.tsx`

- [ ] **Step 1: SectionHeading (editorial)**

```tsx
export function SectionHeading({ index, label, title }: { index: string; label: string; title: string }) {
  return (
    <div className="mb-10">
      <p className="font-mono text-xs tracking-[0.2em] text-amber-600 mb-2">
        № {index} — {label.toUpperCase()}
      </p>
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-stone-50">{title}</h2>
    </div>
  )
}
```

- [ ] **Step 2: Avatar (fallback de iniciais, pronto p/ foto real)**

Sem foto ainda — renderiza iniciais em gradiente terracota. Comentário marca onde plugar `next/image` quando `public/caio.jpg` existir.

```tsx
export function Avatar({ size = 88 }: { size?: number }) {
  // Quando houver foto real, trocar este bloco por:
  // <Image src="/caio.jpg" alt="Caio Weliton" width={size} height={size}
  //   className="rounded-full object-cover border border-stone-700" />
  return (
    <div
      aria-label="Caio Weliton"
      role="img"
      style={{ width: size, height: size }}
      className="rounded-full bg-gradient-to-br from-amber-600 to-orange-700 border border-stone-700 flex items-center justify-center text-white font-bold"
    >
      <span style={{ fontSize: size / 2.8 }}>CW</span>
    </div>
  )
}
```

- [ ] **Step 3: JsonLd**

```tsx
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
```

---

## Task 5: Hero

**Files:**
- Create: `components/sections/hero.tsx`

- [ ] **Step 1: Implementar Hero (Server Component)**

```tsx
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
```

> Nota: `/${locale}/cv` ainda não existe (rota é da Fase 4). O link fica pronto; até lá retorna 404. Aceitável.

---

## Task 6: About

**Files:**
- Create: `components/sections/about.tsx`

- [ ] **Step 1: Implementar About**

```tsx
import type { Locale } from '@/lib/i18n/locales'
import { SectionHeading } from '@/components/sections/section-heading'

const TAGS = ['Clean Architecture', 'AWS', 'AI/NLP', 'Liderança Técnica', 'Microserviços']

export function About({ locale }: { locale: Locale }) {
  const copy = {
    pt: [
      'Engenheiro de software do Ceará com foco em back-end, arquitetura e cloud. Trabalho com Node.js, TypeScript e AWS há 5 anos — da internship a sênior, sempre na mesma direção: sistemas que escalam sem dor de cabeça.',
      'Atualmente estudo Clean Architecture, AWS avançado e AI aplicada a dev. Faço pós em liderança técnica porque código é só metade do trabalho.',
      'Fora do terminal: cozinha, caminhada e games.',
    ],
    en: [
      'Software engineer from Ceará, Brazil, focused on back-end, architecture and cloud. Five years with Node.js, TypeScript and AWS — from intern to senior, always the same direction: systems that scale without headaches.',
      'Currently studying Clean Architecture, advanced AWS and AI applied to dev. Pursuing a postgrad in technical leadership because code is only half the job.',
      'Away from the terminal: cooking, walking and games.',
    ],
  }[locale]

  return (
    <section id="about" className="px-6 py-20">
      <SectionHeading index="01" label={locale === 'pt' ? 'Sobre' : 'About'} title={locale === 'pt' ? 'Quem sou eu' : 'Who I am'} />
      <div className="max-w-2xl space-y-4 text-stone-400 leading-relaxed">
        {copy.map((p, i) => <p key={i}>{p}</p>)}
      </div>
      <div className="mt-7 flex flex-wrap gap-2">
        {TAGS.map((t) => (
          <span key={t} className="font-mono text-xs text-amber-300 border border-amber-900/50 bg-amber-950/30 rounded px-3 py-1">{t}</span>
        ))}
      </div>
    </section>
  )
}
```

---

## Task 7: Experience (tabs — client) + teste

**Files:**
- Create: `components/sections/experience.tsx`
- Test: `components/sections/experience.test.tsx`

- [ ] **Step 1: Escrever o teste que falha**

```tsx
import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Experience } from './experience'

describe('Experience', () => {
  test('mostra o primeiro cargo por padrão', () => {
    render(<Experience locale="pt" />)
    expect(screen.getByText(/Desenvolvedor de Software Sênior/)).toBeInTheDocument()
  })

  test('clicar em outra empresa troca o conteúdo', async () => {
    const user = userEvent.setup()
    render(<Experience locale="pt" />)
    await user.click(screen.getByRole('tab', { name: /Casa Magalhães/ }))
    expect(screen.getByText(/Júnior → Pleno/)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Rodar e verificar que falha**

Run: `npm test -- experience`
Expected: FAIL — módulo não encontrado.

- [ ] **Step 3: Implementar (client component)**

```tsx
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
```

- [ ] **Step 4: Rodar e verificar que passa**

Run: `npm test -- experience`
Expected: 2 passed.

---

## Task 8: Projects (grid + filtro — client) + teste

**Files:**
- Create: `components/sections/projects.tsx`
- Test: `components/sections/projects.test.tsx`

- [ ] **Step 1: Escrever o teste que falha**

```tsx
import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Projects } from './projects'

describe('Projects', () => {
  test('mostra todos os projetos por padrão', () => {
    render(<Projects locale="pt" />)
    expect(screen.getByText('Projeto Destaque')).toBeInTheDocument()
    expect(screen.getByText('Projeto 2')).toBeInTheDocument()
  })

  test('filtrar por "profissional" esconde os pessoais', async () => {
    const user = userEvent.setup()
    render(<Projects locale="pt" />)
    await user.click(screen.getByRole('button', { name: /profissionais/i }))
    expect(screen.queryByText('Projeto Destaque')).not.toBeInTheDocument()
    expect(screen.getByText('Projeto 2')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Rodar e verificar que falha**

Run: `npm test -- projects`
Expected: FAIL — módulo não encontrado.

- [ ] **Step 3: Implementar (client component, usa `filterProjects`)**

```tsx
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
```

- [ ] **Step 4: Rodar e verificar que passa**

Run: `npm test -- projects`
Expected: 2 passed.

---

## Task 9: Skills + Contact

**Files:**
- Create: `components/sections/skills.tsx`
- Create: `components/sections/contact.tsx`

- [ ] **Step 1: Skills**

```tsx
import type { Locale } from '@/lib/i18n/locales'
import { skills } from '@/data/skills'
import { SectionHeading } from '@/components/sections/section-heading'

export function Skills({ locale }: { locale: Locale }) {
  return (
    <section id="skills" className="px-6 py-20">
      <SectionHeading index="05" label="Skills" title={locale === 'pt' ? 'O que uso' : 'What I use'} />
      <div className="grid md:grid-cols-2 gap-5">
        {skills.map((cat) => (
          <div key={cat.label.en} className="rounded-lg border border-stone-800 bg-stone-900/60 p-6">
            <div className="flex items-center gap-2.5 mb-5">
              <span className="text-amber-600">{cat.icon}</span>
              <h3 className="font-mono text-sm font-semibold text-stone-100">{cat.label[locale]}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {cat.items.map((s) => (
                <span key={s} className="font-mono text-xs text-amber-300 border border-amber-900/50 bg-amber-950/30 rounded px-3 py-1">{s}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Contact**

```tsx
import type { Locale } from '@/lib/i18n/locales'
import { site } from '@/data/site'

export function Contact({ locale }: { locale: Locale }) {
  return (
    <section id="contact" className="relative overflow-hidden px-6 py-28 text-center">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-72 w-[32rem] max-w-full rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(217,119,6,0.08) 0%, transparent 70%)' }} />
      </div>
      <div className="relative">
        <p className="font-mono text-xs tracking-[0.2em] text-amber-600 mb-4">№ 09 — {locale === 'pt' ? 'CONTATO' : 'CONTACT'}</p>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-stone-50 mb-4">
          {locale === 'pt' ? 'Vamos conversar?' : "Let's talk?"}
        </h2>
        <p className="max-w-md mx-auto text-stone-400 mb-9 leading-relaxed">
          {locale === 'pt'
            ? 'Aberto a oportunidades, colaborações e conversas sobre arquitetura e liderança técnica.'
            : 'Open to opportunities, collaborations and conversations about architecture and technical leadership.'}
        </p>
        <a href={`mailto:${site.email}`}
          className="inline-block font-mono text-sm bg-amber-600 hover:bg-amber-500 text-white rounded-md px-9 py-3.5 transition-colors mb-10">
          {site.email} →
        </a>
        <div className="flex justify-center gap-8 font-mono text-xs text-stone-500">
          <a href={site.socials.github} target="_blank" rel="noreferrer" className="hover:text-amber-500">GitHub</a>
          <a href={site.socials.linkedin} target="_blank" rel="noreferrer" className="hover:text-amber-500">LinkedIn</a>
          <a href={site.socials.medium} target="_blank" rel="noreferrer" className="hover:text-amber-500">Medium</a>
        </div>
        <p className="mt-14 pt-6 border-t border-stone-900 font-mono text-[10px] text-stone-700">
          © {new Date().getFullYear()} Caio Weliton
        </p>
      </div>
    </section>
  )
}
```

> Nota: `new Date().getFullYear()` em Server Component é avaliado no servidor (build/request) — sem mismatch de hidratação (não é Client Component).

---

## Task 10: SEO core (TDD nos builders puros)

**Files:**
- Create: `lib/seo/site-url.ts`
- Create: `lib/seo/metadata.ts`
- Create: `lib/seo/person-jsonld.ts`
- Test: `lib/seo/metadata.test.ts`
- Test: `lib/seo/person-jsonld.test.ts`

- [ ] **Step 1: site-url**

```typescript
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://caioweliton.dev').replace(/\/$/, '')
```

- [ ] **Step 2: Teste de metadata (falha)**

`lib/seo/metadata.test.ts`:
```typescript
import { describe, test, expect } from 'vitest'
import { buildAlternates } from './metadata'

describe('buildAlternates', () => {
  test('canonical aponta para o locale atual', () => {
    const alt = buildAlternates('pt', '/')
    expect(alt.canonical).toBe('https://caioweliton.dev/pt')
  })
  test('languages inclui pt e en com o mesmo path', () => {
    const alt = buildAlternates('en', '/blog')
    expect(alt.languages).toEqual({
      pt: 'https://caioweliton.dev/pt/blog',
      en: 'https://caioweliton.dev/en/blog',
    })
  })
})
```

- [ ] **Step 3: Rodar e verificar que falha**

Run: `npm test -- seo/metadata`
Expected: FAIL.

- [ ] **Step 4: Implementar metadata**

`lib/seo/metadata.ts`:
```typescript
import type { Metadata } from 'next'
import { locales, type Locale } from '@/lib/i18n/locales'
import { SITE_URL } from './site-url'

export function buildAlternates(locale: Locale, path: string) {
  const clean = path === '/' ? '' : path
  const languages = Object.fromEntries(
    locales.map((l) => [l, `${SITE_URL}/${l}${clean}`]),
  ) as Record<Locale, string>
  return { canonical: `${SITE_URL}/${locale}${clean}`, languages }
}

export function buildMetadata(opts: {
  locale: Locale
  path: string
  title: string
  description: string
}): Metadata {
  const { locale, path, title, description } = opts
  return {
    title,
    description,
    alternates: buildAlternates(locale, path),
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}${path === '/' ? '' : path}`,
      siteName: 'Caio Weliton',
      locale: locale === 'pt' ? 'pt_BR' : 'en_US',
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title, description },
  }
}
```

- [ ] **Step 5: Teste de Person JSON-LD (falha)**

`lib/seo/person-jsonld.test.ts`:
```typescript
import { describe, test, expect } from 'vitest'
import { buildPersonJsonLd } from './person-jsonld'

describe('buildPersonJsonLd', () => {
  test('gera schema.org Person com nome e sameAs', () => {
    const ld = buildPersonJsonLd()
    expect(ld['@type']).toBe('Person')
    expect(ld.name).toBe('Caio Weliton')
    expect(Array.isArray(ld.sameAs)).toBe(true)
    expect((ld.sameAs as string[]).length).toBeGreaterThanOrEqual(3)
    expect(ld.url).toBe('https://caioweliton.dev')
  })
})
```

- [ ] **Step 6: Rodar e verificar que falha**

Run: `npm test -- person-jsonld`
Expected: FAIL.

- [ ] **Step 7: Implementar Person JSON-LD**

`lib/seo/person-jsonld.ts`:
```typescript
import { site } from '@/data/site'
import { SITE_URL } from './site-url'

export function buildPersonJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: site.name,
    url: SITE_URL,
    email: `mailto:${site.email}`,
    jobTitle: site.role.en,
    sameAs: [site.socials.github, site.socials.linkedin, site.socials.medium],
  }
}
```

- [ ] **Step 8: Rodar e verificar que passa**

Run: `npm test -- seo`
Expected: metadata 2 + person-jsonld 1 = 3 passed.

---

## Task 11: Montar a landing + metadata + JSON-LD

**Files:**
- Modify: `app/[locale]/page.tsx`
- Modify: `app/[locale]/layout.tsx`

- [ ] **Step 1: Compor a página**

`app/[locale]/page.tsx`:
```tsx
import { getDictionary } from '@/lib/i18n/dictionaries'
import { isLocale, type Locale } from '@/lib/i18n/locales'
import { notFound } from 'next/navigation'
import { Hero } from '@/components/sections/hero'
import { About } from '@/components/sections/about'
import { Experience } from '@/components/sections/experience'
import { Projects } from '@/components/sections/projects'
import { Skills } from '@/components/sections/skills'
import { Contact } from '@/components/sections/contact'
import { JsonLd } from '@/components/json-ld'
import { buildPersonJsonLd } from '@/lib/seo/person-jsonld'

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const l = locale as Locale
  const dict = await getDictionary(l)

  return (
    <>
      <JsonLd data={buildPersonJsonLd()} />
      <Hero locale={l} dict={dict} />
      <About locale={l} />
      <Experience locale={l} />
      <Projects locale={l} />
      <Skills locale={l} />
      <Contact locale={l} />
    </>
  )
}
```

- [ ] **Step 2: Adicionar `generateMetadata` ao layout por locale**

Em `app/[locale]/layout.tsx`, adicionar (mantendo o resto):
```tsx
import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo/metadata'
import { site } from '@/data/site'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const l = isLocale(locale) ? (locale as Locale) : 'pt'
  return buildMetadata({
    locale: l,
    path: '/',
    title: `${site.name} — ${site.role[l]}`,
    description: l === 'pt'
      ? 'Engenheiro de software sênior. Node.js, TypeScript e AWS. Arquitetura, microserviços e liderança técnica.'
      : 'Senior software engineer. Node.js, TypeScript and AWS. Architecture, microservices and technical leadership.',
  })
}
```
(`isLocale`, `Locale` já são importados no arquivo.)

- [ ] **Step 3: Build + verificação visual**

Run: `npm run build` → sem erro.
Run (background): `npm run dev`, abrir `/pt` e `/en`, conferir as 6 seções renderizando na pele Terracotta; trocar idioma e ver conteúdo mudar. Conferir `<script type="application/ld+json">` no HTML (view-source). Encerrar dev.

---

## Task 12: Sitemap + robots + OG image

**Files:**
- Create: `app/sitemap.ts`
- Create: `app/robots.ts`
- Create: `app/[locale]/opengraph-image.tsx`
- Test: `app/sitemap.test.ts`

- [ ] **Step 1: Teste do sitemap (falha)**

`app/sitemap.test.ts`:
```typescript
import { describe, test, expect } from 'vitest'
import sitemap from './sitemap'

describe('sitemap', () => {
  test('inclui a home de cada locale', () => {
    const urls = sitemap().map((e) => e.url)
    expect(urls).toContain('https://caioweliton.dev/pt')
    expect(urls).toContain('https://caioweliton.dev/en')
  })
})
```

- [ ] **Step 2: Rodar e verificar que falha**

Run: `npm test -- sitemap`
Expected: FAIL.

- [ ] **Step 3: Implementar sitemap**

`app/sitemap.ts`:
```typescript
import type { MetadataRoute } from 'next'
import { locales } from '@/lib/i18n/locales'
import { SITE_URL } from '@/lib/seo/site-url'

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.map((locale) => ({
    url: `${SITE_URL}/${locale}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 1,
  }))
}
```

- [ ] **Step 4: Rodar e verificar que passa**

Run: `npm test -- sitemap`
Expected: 1 passed.

- [ ] **Step 5: robots**

`app/robots.ts`:
```typescript
import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo/site-url'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
```

- [ ] **Step 6: OG image**

`app/[locale]/opengraph-image.tsx`:
```tsx
import { ImageResponse } from 'next/og'
import { site } from '@/data/site'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Caio Weliton — Senior Software Engineer'

export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
          justifyContent: 'center', padding: 80, background: '#1c1917',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ color: '#d97706', fontSize: 28, fontFamily: 'monospace', marginBottom: 16 }}>~/caio $ whoami</div>
        <div style={{ color: '#fafaf9', fontSize: 80, fontWeight: 700, lineHeight: 1 }}>{site.name}</div>
        <div style={{ color: '#a8a29e', fontSize: 36, marginTop: 16 }}>{site.role.en}</div>
        <div style={{ display: 'flex', gap: 16, marginTop: 40 }}>
          {['Node.js', 'AWS', 'TypeScript'].map((t) => (
            <div key={t} style={{ color: '#fed7aa', fontSize: 24, fontFamily: 'monospace', border: '1px solid #44403c', borderRadius: 8, padding: '8px 20px' }}>{t}</div>
          ))}
        </div>
      </div>
    ),
    size,
  )
}
```

- [ ] **Step 7: Build final**

Run: `npm run build`
Expected: build inclui `/sitemap.xml`, `/robots.txt`, e a OG image por locale. Sem erro.

---

## Task 13: Verificação final + commit da fase

- [ ] **Step 1: Gate completo**

Run: `npm run lint && npm test && npm run build`
Expected: lint limpo; testes (Fase 1: 11 + filter 4 + experience 2 + projects 2 + seo 3 + sitemap 1 = **23**); build ok.

- [ ] **Step 2: Validação manual**

`npm run dev`, conferir `/pt` e `/en`: 6 seções, tabs de Experience trocam, filtro de Projects funciona, JSON-LD presente, `/sitemap.xml` e `/robots.txt` servidos, `/pt/opengraph-image` rende imagem. Encerrar dev.

- [ ] **Step 3: Propor commit ao dono (NÃO executar sem aprovação)**

Apresentar diff e propor:
```bash
git add -A
git commit -m "feat: landing + SEO core — 6 seções Warm Workshop, JSON-LD Person, sitemap/robots, OG"
```
**Aguardar aprovação. Sem push.**

---

## Self-Review (cobertura vs spec)

- **data/*.ts bilíngue** → Tasks 1, 2, 3 ✓
- **Hero/About/Experience/Projects/Skills/Contact (Warm Workshop)** → Tasks 5–9, 11 ✓
- **Filtro de projetos (tipo + stack), cards etiquetados** → Task 2, 8 ✓
- **Avatar com fallback pronto p/ foto** → Task 4 ✓
- **JSON-LD Person** → Tasks 4, 10, 11 ✓
- **Metadata canonical + hreflang (alternates.languages)** → Tasks 10, 11 ✓
- **OG image** → Task 12 ✓
- **sitemap + robots** → Task 12 ✓

Fora do escopo (próximas fases): BlogPreview na landing + blog completo (Fase 3); Now/Uses + CV PDF (Fase 4); animações Framer, light-mode visual, `<html lang>` dinâmico, counters animados, Lighthouse/CWV, alt real da foto (Fase 5).

## Notas de consistência de tipos

- `Project` / `ProjectType` definidos em `data/projects.ts`; `filterProjects(projects, { type?, stack? })` em `lib/projects/filter.ts`.
- `Job` em `data/experience.ts`; `SkillCategory` em `data/skills.ts`.
- `buildAlternates(locale, path)` → `{ canonical, languages: Record<Locale,string> }`; `buildMetadata(...)` → `Metadata`.
- `buildPersonJsonLd()` → objeto; renderizado por `<JsonLd data={...} />`.
- Seções recebem `locale: Locale`; Hero também recebe `dict: Dictionary`.
- Conteúdo textual longo das seções (About/Contact) é inline por locale; strings curtas reutilizáveis vêm do dicionário (`dict.hero.*`). Decisão: textos longos no componente evitam inchar o JSON do dicionário nesta fase.
