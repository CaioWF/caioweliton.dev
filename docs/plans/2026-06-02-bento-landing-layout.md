# Bento Landing Layout — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) ou superpowers:executing-plans para implementar task-by-task. Steps usam checkbox (`- [ ]`).
>
> **Commits:** NÃO commitar por tarefa. Subagentes só implementam/testam/reportam. Commit único no fim, com aprovação do dono (pref global).

**Goal:** Reorganizar a landing (`/[locale]`) numa composição bento de tiles modulares, preservando conteúdo, lógica (tabs/filtro), rotas, i18n e SEO.

**Architecture:** Um primitivo `Tile` reutilizável (card `bg-surface` com header mono+serif) compõe um grid bento em `page.tsx`. Seções existentes passam a renderizar dentro de `Tile`; 3 tiles novos (Stats, NowSnippet, Links) são criados a partir de `data/*`. Hero e Contact seguem full-width.

**Tech Stack:** Next 16 (App Router), Tailwind v4, framer-motion (Reveal), TypeScript, Vitest.

---

## 1. Entendimento

Implementar a spec `docs/specs/2026-06-02-bento-landing-layout.md` (aprovada; §5 resolvido: skills resumido, blog mantém null-se-vazio, grão mantido). Troca só o layout da landing; copy é placeholder (fase de conteúdo é a próxima). Validação = build/lint/43 testes verdes + visual.

## 2. Investigação

- `components/reveal.tsx` — `Reveal({ children, delay })`, `motion.div` (ou fragment em reduced-motion). **Não aceita `className`** → precisa estender p/ o grid-span cair no item do grid (Task 1).
- `app/[locale]/page.tsx` — composição atual full-bleed.
- `components/sections/*` — about (server, copy inline+TAGS), experience (client, tabs), projects (client, filtro + `filterProjects`, highlight=col-span-2), skills (server, 4 categorias), blog-preview (async server, `getAllPosts`, `id="blog"`, null se vazio), contact (CTA + **glow âmbar hardcoded** a corrigir).
- `data/site.ts` — `{ name, role{pt,en}, summary{pt,en}, email, location{pt,en}, yearsExperience:5, available, socials{github,linkedin,medium} }`.
- `data/now.ts` — `{ updated, working{pt,en}, studying{pt,en}[], reading{pt,en}, offwork{pt,en} }`.
- `data/skills.ts` — `SkillCategory[] = { label{pt,en}, icon, items[] }`.

## 3. Mudanças propostas (mapa de arquivos)

| Arquivo | Ação | Responsabilidade |
|---|---|---|
| `components/reveal.tsx` | Modificar | Aceitar `className` (e envolver em `div` no caminho reduced-motion) |
| `components/bento/tile.tsx` | Criar | Primitivo de tile (card surface, header mono+serif, span via className, featured, href, id) |
| `components/sections/stats.tsx` | Criar | Tile: anos/local/CV (de `data/site`) |
| `components/sections/now-snippet.tsx` | Criar | Tile-link: resumo `now.working` → `/now` |
| `components/sections/links.tsx` | Criar | Tile: GitHub/LinkedIn/Medium (de `site.socials`) |
| `components/sections/about.tsx` | Modificar | Renderizar como `Tile` (`id=about`, col-span-4) |
| `components/sections/skills.tsx` | Modificar | `Tile` resumido (chips por categoria), col-span-2 |
| `components/sections/experience.tsx` | Modificar | `Tile` (`id=experience`, col-span-6), mantém tabs |
| `components/sections/projects.tsx` | Modificar | `Tile` (`id=projects`, col-span-6), mantém filtro; cards internos sem `bg-surface` |
| `components/sections/blog-preview.tsx` | Modificar | `Tile` (`id=blog`, col-span-6), mantém null-se-vazio |
| `components/sections/contact.tsx` | Modificar | Glow âmbar → `var(--accent)` |
| `app/[locale]/page.tsx` | Modificar | Composição bento (grid 6 colunas) |
| `components/sections/section-heading.tsx` | Remover | Se sem uso após refactor (confirmar via grep) |

## 4. Decisões de design

Herdadas da spec. Implementação:
- **`Reveal` ganha `className`** e passa a renderizar `<div className>` também no caminho reduced-motion (antes era fragment) — necessário p/ o span do grid. Risco baixo: adiciona um `div` extra nas seções em reduced-motion; layout inalterado na prática.
- **Tile é a fronteira**: cada seção vira "miolo" dentro de `Tile`, que padroniza card/superfície/header/anchor/reveal. DRY.
- **Cards internos de Projects sem `bg-surface`** (só borda) p/ não empilhar surface sobre surface (o Tile já é surface).

## 5. Pontos de decisão

Nenhum aberto (spec §5 resolvido).

## 6. Ordem de implementação (tarefas)

Dep: Task 1 → (2,3,4,5) → 6 → 7 → 8.

---

### Task 1: `Reveal` com className + primitivo `Tile`

**Files:**
- Modify: `components/reveal.tsx`
- Create: `components/bento/tile.tsx`

- [ ] **Step 1: Estender `components/reveal.tsx`**

```tsx
'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
```

- [ ] **Step 2: Criar `components/bento/tile.tsx`**

```tsx
import Link from 'next/link'
import { Reveal } from '@/components/reveal'

export function Tile({
  label,
  title,
  href,
  id,
  className,
  featured,
  children,
}: {
  label?: string
  title?: string
  href?: string
  id?: string
  className?: string
  featured?: boolean
  children?: React.ReactNode
}) {
  const card = `flex h-full flex-col rounded-xl border bg-surface p-6 transition-colors ${
    featured ? 'border-accent/40' : 'border-border'
  } ${href ? 'hover:border-accent/40' : ''}`

  const head = (
    <>
      {label && (
        <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-accent mb-3">// {label}</p>
      )}
      {title && (
        <h2 className="font-display text-xl md:text-2xl tracking-tight text-foreground mb-4">{title}</h2>
      )}
    </>
  )

  return (
    <Reveal className={className}>
      {href ? (
        <Link id={id} href={href} className={`group ${card}`}>
          {head}
          {children}
        </Link>
      ) : (
        <section id={id} className={card}>
          {head}
          {children}
        </section>
      )}
    </Reveal>
  )
}
```

- [ ] **Step 3: Verificar build + lint**

Run: `npm run build && npm run lint`
Expected: OK (Tile ainda não usado; Reveal compatível com chamadas existentes).

---

### Task 2: Tiles novos — Stats, NowSnippet, Links

**Files:**
- Create: `components/sections/stats.tsx`
- Create: `components/sections/now-snippet.tsx`
- Create: `components/sections/links.tsx`

- [ ] **Step 1: `components/sections/stats.tsx`**

```tsx
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
```

- [ ] **Step 2: `components/sections/now-snippet.tsx`**

```tsx
import type { Locale } from '@/lib/i18n/locales'
import { now } from '@/data/now'
import { Tile } from '@/components/bento/tile'

export function NowSnippet({ locale }: { locale: Locale }) {
  return (
    <Tile label="/now" href={`/${locale}/now`} className="md:col-span-2">
      <p className="text-sm text-muted leading-relaxed line-clamp-4">{now.working[locale]}</p>
      <span className="mt-3 inline-block font-mono text-xs text-accent group-hover:text-accent-strong">
        {locale === 'pt' ? 'ver now' : 'see now'} →
      </span>
    </Tile>
  )
}
```

- [ ] **Step 3: `components/sections/links.tsx`**

```tsx
import { site } from '@/data/site'
import { Tile } from '@/components/bento/tile'

export function Links() {
  const links = [
    { label: 'GitHub', href: site.socials.github },
    { label: 'LinkedIn', href: site.socials.linkedin },
    { label: 'Medium', href: site.socials.medium },
  ]
  return (
    <Tile label="links" className="md:col-span-2">
      <ul className="space-y-2 font-mono text-sm">
        {links.map((l) => (
          <li key={l.label}>
            <a href={l.href} target="_blank" rel="noreferrer" className="text-muted hover:text-accent transition-colors">
              {l.label} ↗
            </a>
          </li>
        ))}
      </ul>
    </Tile>
  )
}
```

- [ ] **Step 4: Verificar build + lint**

Run: `npm run build && npm run lint`
Expected: OK.

---

### Task 3: Refactor About + Skills (server) p/ Tile

**Files:**
- Modify: `components/sections/about.tsx`
- Modify: `components/sections/skills.tsx`

- [ ] **Step 1: Reescrever `components/sections/about.tsx`**

```tsx
import type { Locale } from '@/lib/i18n/locales'
import { Tile } from '@/components/bento/tile'

const TAGS = ['Clean Architecture', 'AWS', 'AI/NLP', 'Liderança Técnica', 'Microserviços']

export function About({ locale }: { locale: Locale }) {
  const copy = {
    pt: [
      'Engenheiro de software do Ceará com foco em back-end, arquitetura e cloud. Trabalho com Node.js, TypeScript e AWS há 5 anos — da internship a sênior, sempre na mesma direção: sistemas que escalam sem dor de cabeça.',
      'Atualmente estudo Clean Architecture, AWS avançado e AI aplicada a dev. Fiz uma pós em liderança técnica porque código é só metade do trabalho.',
      'Fora do terminal: cozinha, caminhada e games.',
    ],
    en: [
      'Software engineer from Ceará, Brazil, focused on back-end, architecture and cloud. Five years with Node.js, TypeScript and AWS — from intern to senior, always the same direction: systems that scale without headaches.',
      'Currently studying Clean Architecture, advanced AWS and AI applied to dev. Completed a postgrad in technical leadership because code is only half the job.',
      'Away from the terminal: cooking, walking and games.',
    ],
  }[locale]

  return (
    <Tile id="about" label="sobre" title={locale === 'pt' ? 'Quem sou eu' : 'Who I am'} className="md:col-span-4">
      <div className="space-y-4 text-muted leading-relaxed">
        {copy.map((p, i) => <p key={i}>{p}</p>)}
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        {TAGS.map((t) => (
          <span key={t} className="font-mono text-xs text-accent border border-accent/30 bg-accent/10 rounded px-3 py-1">{t}</span>
        ))}
      </div>
    </Tile>
  )
}
```

- [ ] **Step 2: Reescrever `components/sections/skills.tsx`**

```tsx
import type { Locale } from '@/lib/i18n/locales'
import { skills } from '@/data/skills'
import { Tile } from '@/components/bento/tile'

export function Skills({ locale }: { locale: Locale }) {
  return (
    <Tile label="stack" title={locale === 'pt' ? 'Ferramentas' : 'Tools'} className="md:col-span-2">
      <div className="space-y-3">
        {skills.map((cat) => (
          <div key={cat.label.en}>
            <p className="font-mono text-[10px] text-faint mb-1">{cat.icon} {cat.label[locale]}</p>
            <div className="flex flex-wrap gap-1.5">
              {cat.items.map((s) => (
                <span key={s} className="font-mono text-[10px] text-accent bg-accent/10 rounded px-2 py-0.5">{s}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Tile>
  )
}
```

- [ ] **Step 3: Verificar build + lint**

Run: `npm run build && npm run lint`
Expected: OK.

---

### Task 4: Refactor Experience + Projects (client) p/ Tile

**Files:**
- Modify: `components/sections/experience.tsx`
- Modify: `components/sections/projects.tsx`

- [ ] **Step 1: Reescrever `components/sections/experience.tsx`**

```tsx
'use client'

import { useState } from 'react'
import type { Locale } from '@/lib/i18n/locales'
import { experience } from '@/data/experience'
import { Tile } from '@/components/bento/tile'

export function Experience({ locale }: { locale: Locale }) {
  const [active, setActive] = useState(0)
  const job = experience[active]

  return (
    <Tile id="experience" label="experiência" title={locale === 'pt' ? 'Onde trabalhei' : 'Where I worked'} className="md:col-span-6">
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
              <span key={s} className="font-mono text-[10px] text-accent bg-accent/10 rounded px-2 py-0.5">{s}</span>
            ))}
          </div>
        </div>
      </div>
    </Tile>
  )
}
```

- [ ] **Step 2: Reescrever `components/sections/projects.tsx`**

```tsx
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
            <div className="flex gap-2 flex-wrap font-mono text-[10px] text-accent">
              {p.stack.map((s) => <span key={s}>{s}</span>)}
            </div>
          </article>
        ))}
      </div>
    </Tile>
  )
}
```

- [ ] **Step 3: Verificar build + lint**

Run: `npm run build && npm run lint`
Expected: OK. Tabs e filtro continuam funcionais.

---

### Task 5: Refactor BlogPreview p/ Tile + fix glow do Contact

**Files:**
- Modify: `components/sections/blog-preview.tsx`
- Modify: `components/sections/contact.tsx`

- [ ] **Step 1: Reescrever `components/sections/blog-preview.tsx`**

```tsx
import Link from 'next/link'
import type { Locale } from '@/lib/i18n/locales'
import { getAllPosts } from '@/lib/blog/posts'
import { Tile } from '@/components/bento/tile'

export async function BlogPreview({ locale }: { locale: Locale }) {
  const posts = (await getAllPosts(locale)).slice(0, 3)
  if (posts.length === 0) return null

  return (
    <Tile id="blog" label="escritos recentes" title="Blog" className="md:col-span-6">
      <div className="flex flex-col">
        {posts.map((p) => (
          <Link key={p.slug} href={`/${locale}/blog/${p.slug}`}
            className="group flex items-center justify-between py-4 border-b border-border hover:border-muted transition-colors">
            <div>
              <div className="text-foreground font-medium group-hover:text-accent transition-colors">{p.title}</div>
              <div className="font-mono text-[10px] text-faint mt-1">{p.tags[0]} · {p.readingMinutes} min</div>
            </div>
            <span className="font-mono text-xs text-faint shrink-0 ml-4">{p.date}</span>
          </Link>
        ))}
      </div>
      <Link href={`/${locale}/blog`} className="inline-block mt-6 font-mono text-xs text-accent hover:text-accent-strong">
        {locale === 'pt' ? 'ver todos os posts' : 'see all posts'} →
      </Link>
    </Tile>
  )
}
```

- [ ] **Step 2: `components/sections/contact.tsx` — trocar glow âmbar por acento**

Find:

```tsx
        <div className="h-72 w-[32rem] max-w-full rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(217,119,6,0.08) 0%, transparent 70%)' }} />
```

Replace with:

```tsx
        <div className="h-72 w-[32rem] max-w-full rounded-full"
          style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)', opacity: 0.08 }} />
```

(Resto do Contact inalterado.)

- [ ] **Step 3: Verificar build + lint**

Run: `npm run build && npm run lint`
Expected: OK.

---

### Task 6: Composição bento em `page.tsx`

**Files:**
- Modify: `app/[locale]/page.tsx`

- [ ] **Step 1: Reescrever `app/[locale]/page.tsx`**

```tsx
import { getDictionary } from '@/lib/i18n/dictionaries'
import { isLocale, type Locale } from '@/lib/i18n/locales'
import { notFound } from 'next/navigation'
import { Hero } from '@/components/sections/hero'
import { About } from '@/components/sections/about'
import { Stats } from '@/components/sections/stats'
import { Skills } from '@/components/sections/skills'
import { NowSnippet } from '@/components/sections/now-snippet'
import { Links } from '@/components/sections/links'
import { Experience } from '@/components/sections/experience'
import { Projects } from '@/components/sections/projects'
import { BlogPreview } from '@/components/sections/blog-preview'
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
      <div className="mx-auto max-w-5xl px-6 py-10 grid grid-cols-1 md:grid-cols-6 gap-4">
        <About locale={l} />
        <Stats locale={l} />
        <Skills locale={l} />
        <NowSnippet locale={l} />
        <Links />
        <Experience locale={l} />
        <Projects locale={l} />
        <BlogPreview locale={l} />
      </div>
      <Contact locale={l} />
    </>
  )
}
```

- [ ] **Step 2: Verificar build + lint + testes**

Run: `npm run build && npm run lint && npm test`
Expected: build OK, lint limpo, 43 testes verdes.

- [ ] **Step 3: Verificação visual**

Run: `npm run dev` (porta 3000)
Observar: grid bento (1 coluna mobile, 6 colunas desktop); banda1 About(4)+Stats(2); banda2 Skills+Now+Links (2+2+2); Experience full; Projects full; Blog full; Contact full. Anchors do nav rolam pro tile certo. Tabs/filtro funcionam. Constelação aparece nos vãos.

---

### Task 7: Limpeza + validação final

**Files:**
- Delete (se sem uso): `components/sections/section-heading.tsx`

- [ ] **Step 1: Confirmar que `SectionHeading` ficou sem uso**

Run: `grep -rn "SectionHeading\|section-heading" components app --include="*.tsx"`
Expected: nenhum import restante (todos os consumidores foram refatorados). Se aparecer só a própria definição, prosseguir.

- [ ] **Step 2: Remover o arquivo (se confirmado sem uso)**

Run: `git rm components/sections/section-heading.tsx`
(Se ainda houver consumidor inesperado, NÃO remover — reportar como concern.)

- [ ] **Step 3: Suite completa**

Run: `npm run build && npm run lint && npm test`
Expected: build Turbopack OK, lint limpo, 43 testes verdes.

---

### Task 8: Commit (aguardar aprovação do dono)

- [ ] **Step 1: Propor commit ao dono e aguardar OK** (não rodar sem aprovação)

Mensagem sugerida:

```
feat: landing em layout bento

Reorganiza a landing em grid de tiles modulares (primitivo Tile),
com tiles novos de stats, /now e links; seções existentes (about,
skills, experiência, projetos, blog) viram tiles preservando tabs e
filtro. Hero e contato seguem full-width; glow do contato corrigido
p/ a cor de acento. Conteúdo, rotas, i18n, SEO e CV inalterados.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
```

- [ ] **Step 2: Após OK, commitar** os arquivos das Tasks 1-7.

## 7. Como validar

- `npm run build` (Turbopack) verde; `npm run lint` limpo; `npm test` → 43 testes.
- Grid bento responsivo; anchors `#about/#experience/#projects/#blog/#contact` corretos; tabs/filtro funcionais; legibilidade sobre constelação/grão nos 2 temas; contato sem âmbar.
- Sem regressão de SEO/rotas/i18n/CV.

## 8. Fora de escopo

- Copy/conteúdo real (hero headline+gradiente, tagline, projetos, foto, blog) — próxima fase.
- Páginas /now, /uses, /blog — layout inalterado.
- Publicação (push/remoto) — aguarda OK.
- Mudanças em dados, dictionaries, CV, lógica SEO.
