# Fase 4 — Now / Uses / CV PDF Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development (recommended) ou superpowers:executing-plans. Steps usam checkbox (`- [ ]`).
>
> **⚠️ Commits:** Por preferência do dono (CLAUDE.md), **NÃO commitar por task nem por ciclo TDD.** Subagentes só implementam, testam e reportam. Commit único no fim da fase, com aprovação. **Sem push.**

**Goal:** Páginas `/now` e `/uses` (bilíngues, data-driven) e o CV em PDF gerado on-demand a partir dos dados do site, ATS-friendly — fazendo o link "baixar CV" do Hero (já existente) funcionar.

**Architecture:** Sobre Fases 1-3. `/now` e `/uses` consomem `data/now.ts` e `data/uses.ts` (Server Components, sem interação). CV PDF: `@react-pdf/renderer` num route handler `app/[locale]/cv/route.ts` (runtime Node, `serverExternalPackages`). Lógica pura (montar o modelo do CV a partir de `site`/`experience`/`skills`, nome do arquivo) isolada em `lib/cv/model.ts` — testável; o JSX do PDF fica em `lib/cv/cv-document.tsx` (route.ts não pode ter JSX).

**Tech Stack:** Next.js 16, `@react-pdf/renderer`, Vitest.

---

## Convenções herdadas (Fases 1-3)

- `Locale`/`locales`/`isLocale` em `@/lib/i18n/locales`; `site` em `@/data/site`; `experience` em `@/data/experience`; `skills` em `@/data/skills`.
- `buildMetadata` em `@/lib/seo/metadata`; `SectionHeading` em `@/components/sections/section-heading`.
- Paleta `stone-*` + `amber-600`; `font-mono` p/ labels. Páginas: `params: Promise<{...}>` + `await`.
- Hero (Fase 2) já tem link `<a href={\`/${locale}/cv\`}>baixar CV ↓</a>` — esta fase faz a rota existir.

---

## File Structure

| Arquivo | Responsabilidade |
|---------|------------------|
| `data/now.ts` | Conteúdo da página Now (bilíngue) |
| `data/uses.ts` | Categorias/itens de setup (bilíngue) |
| `app/[locale]/now/page.tsx` | Página Now |
| `app/[locale]/uses/page.tsx` | Página Uses |
| `lib/cv/model.ts` | `buildCvModel(locale)` + `cvFileName(locale)` (puros) |
| `lib/cv/cv-document.tsx` | Componente `@react-pdf` + `renderCv(model)` |
| `app/[locale]/cv/route.ts` | Route handler que devolve o PDF |
| `next.config.ts` | (modifica) `serverExternalPackages: ['@react-pdf/renderer']` |
| `components/sections/contact.tsx` | (modifica) links now/uses no rodapé |
| `app/sitemap.ts` | (modifica) inclui `/now` e `/uses` |

---

## Task 1: Dados Now + Uses

**Files:**
- Create: `data/now.ts`
- Create: `data/uses.ts`

- [ ] **Step 1: `data/now.ts`**

```typescript
export const now = {
  updated: '2026-06', // yyyy-mm — atualizar manualmente
  working: {
    pt: 'Senior SWE na Compass UOL — foco em otimização de infra AWS e arquitetura de microserviços para clientes enterprise.',
    en: 'Senior SWE at Compass UOL — focused on AWS infra optimization and microservices architecture for enterprise clients.',
  },
  studying: {
    pt: ['AWS Solutions Architect Professional', 'Clean Architecture', 'AI aplicada a workflows de dev', 'Pós em Liderança Técnica (FCTECH)'],
    en: ['AWS Solutions Architect Professional', 'Clean Architecture', 'AI applied to dev workflows', 'Postgrad in Technical Leadership (FCTECH)'],
  },
  reading: { pt: 'Staff Engineer — Will Larson', en: 'Staff Engineer — Will Larson' },
  offwork: { pt: 'Cozinhando, caminhando e zerando algum jogo.', en: 'Cooking, walking and finishing some game.' },
} as const
```

- [ ] **Step 2: `data/uses.ts`**

```typescript
export type UsesItem = { name: string; note: { pt: string; en: string } }
export type UsesCategory = { label: { pt: string; en: string }; items: UsesItem[] }

export const uses: UsesCategory[] = [
  {
    label: { pt: 'Editor & Terminal', en: 'Editor & Terminal' },
    items: [
      { name: 'VS Code', note: { pt: 'editor principal', en: 'main editor' } },
      { name: 'Zsh', note: { pt: 'shell', en: 'shell' } },
    ],
  },
  {
    label: { pt: 'Ferramentas', en: 'Tools' },
    items: [
      { name: 'Insomnia', note: { pt: 'cliente REST', en: 'REST client' } },
      { name: 'TablePlus', note: { pt: 'banco de dados', en: 'database' } },
      { name: 'Docker', note: { pt: 'containers', en: 'containers' } },
    ],
  },
  {
    label: { pt: 'Hardware', en: 'Hardware' },
    items: [
      { name: '— preencher —', note: { pt: 'máquina principal', en: 'main machine' } },
    ],
  },
]
```
> Placeholders em Hardware; dono completa depois (mesma lógica dos projetos).

Sem teste (dados estáticos; consumidos pelas páginas).

---

## Task 2: Páginas /now e /uses

**Files:**
- Create: `app/[locale]/now/page.tsx`
- Create: `app/[locale]/uses/page.tsx`

- [ ] **Step 1: `/now`**

```tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLocale, type Locale } from '@/lib/i18n/locales'
import { buildMetadata } from '@/lib/seo/metadata'
import { now } from '@/data/now'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const l = isLocale(locale) ? (locale as Locale) : 'pt'
  return buildMetadata({
    locale: l, path: '/now',
    title: 'Now — Caio Weliton',
    description: l === 'pt' ? 'O que estou fazendo agora.' : 'What I am doing now.',
  })
}

export default async function NowPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const l = locale as Locale

  const Block = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="mb-8">
      <h2 className="font-mono text-xs tracking-[0.15em] text-amber-600 mb-2">▹ {label}</h2>
      <div className="text-stone-300 leading-relaxed">{children}</div>
    </div>
  )

  return (
    <section className="px-6 py-20 max-w-2xl">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-stone-50 mb-1">Now</h1>
      <p className="font-mono text-xs text-stone-600 mb-10">
        {l === 'pt' ? 'Atualizado em' : 'Updated'} {now.updated}
      </p>
      <Block label={l === 'pt' ? 'TRABALHANDO' : 'WORKING'}>{now.working[l]}</Block>
      <Block label={l === 'pt' ? 'ESTUDANDO' : 'STUDYING'}>
        <ul className="space-y-1.5">
          {now.studying[l].map((item) => (
            <li key={item} className="flex gap-2"><span className="text-stone-600">→</span>{item}</li>
          ))}
        </ul>
      </Block>
      <Block label={l === 'pt' ? 'LENDO' : 'READING'}>{now.reading[l]}</Block>
      <Block label={l === 'pt' ? 'FORA DO TRABALHO' : 'OFF WORK'}>{now.offwork[l]}</Block>
      <p className="mt-10 text-stone-700 text-xs italic">
        {l === 'pt' ? 'Inspirado no nownownow.com do Derek Sivers.' : 'Inspired by Derek Sivers nownownow.com.'}
      </p>
    </section>
  )
}
```

- [ ] **Step 2: `/uses`**

```tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLocale, type Locale } from '@/lib/i18n/locales'
import { buildMetadata } from '@/lib/seo/metadata'
import { uses } from '@/data/uses'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const l = isLocale(locale) ? (locale as Locale) : 'pt'
  return buildMetadata({
    locale: l, path: '/uses',
    title: 'Uses — Caio Weliton',
    description: l === 'pt' ? 'Hardware, software e setup que uso.' : 'Hardware, software and setup I use.',
  })
}

export default async function UsesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const l = locale as Locale

  return (
    <section className="px-6 py-20 max-w-2xl">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-stone-50 mb-1">Uses</h1>
      <p className="font-mono text-xs text-stone-600 mb-10">
        {l === 'pt' ? 'Ferramentas e setup do dia a dia' : 'Daily tools and setup'}
      </p>
      <div className="space-y-8">
        {uses.map((cat) => (
          <div key={cat.label.en}>
            <h2 className="font-mono text-xs tracking-[0.15em] text-amber-600 mb-3">▹ {cat.label[l].toUpperCase()}</h2>
            <div className="space-y-1.5">
              {cat.items.map((it) => (
                <div key={it.name} className="flex justify-between text-sm">
                  <span className="text-stone-200">{it.name}</span>
                  <span className="text-stone-600">{it.note[l]}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
```

---

## Task 3: Modelo do CV (TDD)

**Files:**
- Create: `lib/cv/model.ts`
- Test: `lib/cv/model.test.ts`

- [ ] **Step 1: Teste (falha)**

`lib/cv/model.test.ts`:
```typescript
import { describe, test, expect } from 'vitest'
import { buildCvModel, cvFileName } from './model'

describe('buildCvModel', () => {
  test('monta o CV em EN com dados do site/experiência/skills', () => {
    const cv = buildCvModel('en')
    expect(cv.name).toBe('Caio Weliton')
    expect(cv.role).toBe('Senior Software Engineer')
    expect(cv.email).toBe('contato.caioweliton@gmail.com')
    expect(cv.experience[0].company).toBe('Compass UOL')
    expect(cv.experience[0].role).toBe('Senior Software Developer')
    expect(cv.experience[0].bullets.length).toBeGreaterThan(0)
    expect(cv.skills.length).toBeGreaterThanOrEqual(4)
  })
  test('localiza para PT', () => {
    const cv = buildCvModel('pt')
    expect(cv.role).toBe('Engenheiro de Software Sênior')
    expect(cv.experience[0].role).toBe('Desenvolvedor de Software Sênior')
  })
})

describe('cvFileName', () => {
  test('inclui locale', () => {
    expect(cvFileName('pt')).toBe('cv-caio-weliton-pt.pdf')
    expect(cvFileName('en')).toBe('cv-caio-weliton-en.pdf')
  })
})
```

- [ ] **Step 2: Rodar e verificar que falha**

Run: `npm test -- cv/model`
Expected: FAIL.

- [ ] **Step 3: Implementar**

`lib/cv/model.ts`:
```typescript
import type { Locale } from '@/lib/i18n/locales'
import { site } from '@/data/site'
import { experience } from '@/data/experience'
import { skills } from '@/data/skills'

export type CvModel = {
  name: string
  role: string
  email: string
  location: string
  experience: { role: string; company: string; period: string; bullets: string[] }[]
  skills: { label: string; items: string[] }[]
}

export function buildCvModel(locale: Locale): CvModel {
  return {
    name: site.name,
    role: site.role[locale],
    email: site.email,
    location: site.location[locale],
    experience: experience.map((j) => ({
      role: j.role[locale],
      company: j.company,
      period: j.period[locale],
      bullets: j.bullets[locale],
    })),
    skills: skills.map((c) => ({ label: c.label[locale], items: c.items })),
  }
}

export function cvFileName(locale: Locale): string {
  return `cv-caio-weliton-${locale}.pdf`
}
```

- [ ] **Step 4: Rodar e verificar que passa**

Run: `npm test -- cv/model`
Expected: 3 passed.

---

## Task 4: Documento PDF (@react-pdf) + config

**Files:**
- Create: `lib/cv/cv-document.tsx`
- Modify: `next.config.ts`

- [ ] **Step 1: Instalar dep**

Run: `npm i @react-pdf/renderer`

- [ ] **Step 2: `serverExternalPackages` no `next.config.ts`**

Preservar `output: 'standalone'`; adicionar:
```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  serverExternalPackages: ['@react-pdf/renderer'],
}

export default nextConfig
```
> Obrigatório: sem isso o Next tenta bundlar o `@react-pdf/renderer` no client e quebra.

- [ ] **Step 3: Documento + render helper (JSX fica AQUI, não no route.ts)**

`lib/cv/cv-document.tsx`:
```tsx
import { Document, Page, View, Text, StyleSheet, renderToBuffer } from '@react-pdf/renderer'
import type { CvModel } from './model'

const s = StyleSheet.create({
  page: { padding: 40, fontSize: 10, color: '#1c1917', fontFamily: 'Helvetica', lineHeight: 1.4 },
  name: { fontSize: 22, fontFamily: 'Helvetica-Bold' },
  role: { fontSize: 12, color: '#b45309', marginBottom: 2 },
  contact: { fontSize: 9, color: '#57534e', marginBottom: 16 },
  rule: { borderBottomWidth: 1, borderBottomColor: '#d6d3d1', marginVertical: 10 },
  h2: { fontSize: 11, fontFamily: 'Helvetica-Bold', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1, color: '#78716c' },
  jobRole: { fontSize: 11, fontFamily: 'Helvetica-Bold' },
  jobMeta: { fontSize: 9, color: '#78716c', marginBottom: 4 },
  bullet: { flexDirection: 'row', marginBottom: 2 },
  bulletDot: { width: 10, color: '#b45309' },
  bulletText: { flex: 1 },
  skillRow: { flexDirection: 'row', marginBottom: 3 },
  skillLabel: { width: 110, fontFamily: 'Helvetica-Bold' },
  skillItems: { flex: 1, color: '#44403c' },
  block: { marginBottom: 12 },
})

function CvDocument({ model }: { model: CvModel }) {
  return (
    <Document title={`CV — ${model.name}`} author={model.name}>
      <Page size="A4" style={s.page}>
        <Text style={s.name}>{model.name}</Text>
        <Text style={s.role}>{model.role}</Text>
        <Text style={s.contact}>{model.email} · {model.location}</Text>
        <View style={s.rule} />

        <Text style={s.h2}>Experience</Text>
        {model.experience.map((j, i) => (
          <View key={i} style={s.block}>
            <Text style={s.jobRole}>{j.role} — {j.company}</Text>
            <Text style={s.jobMeta}>{j.period}</Text>
            {j.bullets.map((b, k) => (
              <View key={k} style={s.bullet}>
                <Text style={s.bulletDot}>▹</Text>
                <Text style={s.bulletText}>{b}</Text>
              </View>
            ))}
          </View>
        ))}

        <View style={s.rule} />
        <Text style={s.h2}>Skills</Text>
        {model.skills.map((c, i) => (
          <View key={i} style={s.skillRow}>
            <Text style={s.skillLabel}>{c.label}</Text>
            <Text style={s.skillItems}>{c.items.join(' · ')}</Text>
          </View>
        ))}
      </Page>
    </Document>
  )
}

export function renderCv(model: CvModel): Promise<Buffer> {
  return renderToBuffer(<CvDocument model={model} />)
}
```
> Layout ATS-friendly: 1 coluna, texto real, seções padrão Experience/Skills, fonte Helvetica nativa do PDF (sem fonte custom = sem download/registro).

- [ ] **Step 4: Verificação de compilação**

Run: `npx tsc --noEmit`
Expected: sem erro de tipos no documento.

---

## Task 5: Route handler do CV

**Files:**
- Create: `app/[locale]/cv/route.ts`

- [ ] **Step 1: Implementar a rota (SEM JSX — só chama `renderCv`)**

```typescript
import { isLocale, locales, type Locale } from '@/lib/i18n/locales'
import { buildCvModel, cvFileName } from '@/lib/cv/model'
import { renderCv } from '@/lib/cv/cv-document'

export const runtime = 'nodejs'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function GET(_req: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const l: Locale = isLocale(locale) ? (locale as Locale) : 'pt'

  const buffer = await renderCv(buildCvModel(l))

  return new Response(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${cvFileName(l)}"`,
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
```
> `runtime = 'nodejs'` (react-pdf precisa de Node, não Edge). `generateStaticParams` permite pré-render por locale. JSX vive em `cv-document.tsx`; o route só orquestra.

- [ ] **Step 2: Build + verificação**

Run: `npm run build`
Expected: build conclui (Turbopack). Rota `/[locale]/cv` aparece no output.
Run (background) `npm run dev`:
```bash
curl -s -o /tmp/cv.pdf -w "%{content_type} %{size_download}\n" localhost:3000/pt/cv
file /tmp/cv.pdf
```
Expected: `application/pdf` com tamanho > 0; `file` reporta "PDF document". Encerrar dev.
> ⚠️ Se `renderToBuffer` falhar em runtime (issue conhecido react-pdf + Next em algumas versões), reportar **BLOCKED** com o erro exato — NÃO inventar workaround. Alternativas (pré-gerar no build / lib diferente) serão decididas pelo controlador.

---

## Task 6: Links de navegação + sitemap

**Files:**
- Modify: `components/sections/contact.tsx`
- Modify: `app/sitemap.ts`
- Modify: `app/sitemap.test.ts`

- [ ] **Step 1: Links now/uses no rodapé da Contact**

Em `components/sections/contact.tsx`, dentro do `<div className="relative">`, logo antes do `<p>© ...`, adicionar:
```tsx
        <div className="mt-10 flex justify-center gap-6 font-mono text-[11px] text-stone-600">
          <a href={`/${locale}/now`} className="hover:text-amber-500">now</a>
          <a href={`/${locale}/uses`} className="hover:text-amber-500">uses</a>
          <a href={`/${locale}/blog`} className="hover:text-amber-500">blog</a>
        </div>
```

- [ ] **Step 2: Teste do sitemap (falha)**

Adicionar a `app/sitemap.test.ts`:
```typescript
  test('inclui /now e /uses', async () => {
    const urls = (await sitemap()).map((e) => e.url)
    expect(urls).toContain('https://caioweliton.dev/pt/now')
    expect(urls).toContain('https://caioweliton.dev/pt/uses')
  })
```

- [ ] **Step 3: Rodar e verificar que falha**

Run: `npm test -- sitemap`
Expected: FAIL.

- [ ] **Step 4: Incluir now/uses no sitemap**

Em `app/sitemap.ts`, dentro do loop de `locales`, após a entrada de `/blog`, adicionar:
```typescript
    entries.push({ url: `${SITE_URL}/${locale}/now`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 })
    entries.push({ url: `${SITE_URL}/${locale}/uses`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 })
```

- [ ] **Step 5: Rodar e verificar que passa**

Run: `npm test -- sitemap`
Expected: passa (home + blog + posts + now + uses).

---

## Task 7: Verificação final + commit da fase

- [ ] **Step 1: Gate completo**

Run: `npm run lint && npm test && npm run build`
Expected: lint limpo; testes (32 da Fase 3 + cv/model 3 + sitemap +1 = **~36**); build com rotas `/now`, `/uses`, `/cv` por locale.

- [ ] **Step 2: Validação manual**

`npm run dev`: `/pt/now` e `/pt/uses` (e `/en/...`); no Hero clicar "baixar CV" → baixa/abre PDF; `curl` confirma `application/pdf`; rodapé da Contact com links now/uses/blog; `/sitemap.xml` com now/uses. Encerrar dev.

- [ ] **Step 3: Propor commit ao dono (NÃO executar sem aprovação)**

```bash
git add -A
git commit -m "feat: now/uses + CV PDF — paginas /now e /uses, CV via @react-pdf, links e sitemap"
```
**Aguardar aprovação. Sem push.**

---

## Self-Review (cobertura vs spec)

- **/now (data-driven)** → Tasks 1, 2 ✓
- **/uses (data category+items)** → Tasks 1, 2 ✓
- **CV PDF `@react-pdf` lendo data/*, ATS-friendly, conteúdo sincronizado** → Tasks 3, 4, 5 ✓
- **Link "baixar CV" do Hero funcional** → Task 5 (a rota passa a existir) ✓
- **now/uses no sitemap + links de navegação** → Task 6 ✓

Fora do escopo (Fase 5): animações Framer, light-mode visual, syntax highlight, counters animados, `<html lang>` dinâmico, Lighthouse/CWV, foto real, refino tipográfico, fontes custom no PDF.

## Notas de consistência de tipos

- `CvModel` em `lib/cv/model.ts`; `buildCvModel(locale) → CvModel` e `cvFileName(locale) → string` (puros, testados).
- `renderCv(model) → Promise<Buffer>` em `lib/cv/cv-document.tsx` (todo o JSX do PDF vive aqui; `route.ts` não tem JSX).
- `now` (objeto) em `data/now.ts`; `UsesCategory`/`UsesItem` + `uses` em `data/uses.ts`.
- `route.ts`: `runtime='nodejs'`, `generateStaticParams` por locale; devolve `Response` com `application/pdf`.
- `next.config.ts`: `serverExternalPackages: ['@react-pdf/renderer']` (obrigatório).
- `app/sitemap.ts` (async, da Fase 3) ganha entradas `/now` e `/uses`.
