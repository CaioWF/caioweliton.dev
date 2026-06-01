# Fase 1 — Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **⚠️ Commits:** Por preferência do dono (CLAUDE.md), **NÃO commitar por task nem por ciclo TDD.** Subagentes apenas implementam, testam e reportam — nunca commitam. Há uma única task de commit no fim da fase, que aguarda aprovação do dono. **Sem push.**

**Goal:** Scaffold bilíngue (PT/EN) de um app Next.js 16 com tema Terracotta (dark/light), roteamento por locale via `proxy.ts`, e build Docker standalone — pronto pra receber as seções da Fase 2.

**Architecture:** Next.js 16 App Router (Turbopack default, React 19 + React Compiler). i18n caseiro de baixo custo: segmento dinâmico `[locale]`, dicionários JSON, função pura `getLocale` parseando `Accept-Language`, redirect em `proxy.ts`. Tailwind v4 com tokens de cor/fonte via `@theme`. Tema dark/light via `next-themes`. Testes em Vitest + Testing Library.

**Tech Stack:** Next.js 16, TypeScript, Tailwind CSS v4, next-themes, Vitest, @testing-library/react, jsdom, Docker.

---

## File Structure

| Arquivo | Responsabilidade |
|---------|------------------|
| `app/globals.css` | `@import "tailwindcss"` + `@theme` com paleta Terracotta + fontes |
| `app/layout.tsx` | Root layout mínimo (`<html suppressHydrationWarning>`, ThemeProvider) |
| `app/[locale]/layout.tsx` | Layout por locale: `lang`, dicionário, Nav |
| `app/[locale]/page.tsx` | Landing stub (placeholder até Fase 2) |
| `lib/i18n/locales.ts` | Constantes: `locales`, `defaultLocale`, tipo `Locale` |
| `lib/i18n/get-locale.ts` | Função pura `getLocale(acceptLanguage)` |
| `lib/i18n/dictionaries.ts` | `getDictionary(locale)` carregando JSON |
| `lib/i18n/dictionaries/pt.json` | Strings UI PT |
| `lib/i18n/dictionaries/en.json` | Strings UI EN |
| `proxy.ts` | Redirect de rota sem locale → `/{locale}` (Next 16) |
| `components/theme/theme-provider.tsx` | Wrapper `next-themes` |
| `components/theme/theme-toggle.tsx` | Botão dark/light |
| `components/i18n/locale-toggle.tsx` | Toggle PT/EN preservando o path |
| `components/nav.tsx` | Nav com marca + toggles |
| `next.config.ts` | `output: 'standalone'` |
| `Dockerfile`, `.dockerignore` | Build de imagem standalone |
| `vitest.config.ts`, `vitest.setup.ts` | Config de testes |
| `README.md` | Setup e comandos |

---

## Task 0: Scaffold do projeto

**Files:**
- Create: árvore inteira via `create-next-app`

- [ ] **Step 1: Rodar create-next-app em diretório vazio**

O diretório `/home/eunaocaio/caioweliton.dev` já contém `docs/`. Scaffold no diretório atual (`.`):

Run:
```bash
cd /home/eunaocaio/caioweliton.dev && npx create-next-app@latest . \
  --ts --eslint --app --tailwind --no-src-dir \
  --import-alias "@/*" --use-npm --turbopack --yes
```
Expected: cria `app/`, `package.json`, `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `app/globals.css`. Convive com `docs/` já existente. Se `create-next-app` reclamar de diretório não-vazio por causa de `docs/`, mover `docs/` temporariamente para fora, scaffoldar, e devolver depois.

- [ ] **Step 2: Verificar versão do Next**

Run: `npx next --version`
Expected: `Next.js v16.x` (≥ 16.2). Se vier 15.x, abortar e `npm i next@^16 react@latest react-dom@latest`.

- [ ] **Step 3: Build inicial limpo**

Run: `npm run build`
Expected: build conclui sem erro (com a home padrão do create-next-app).

- [ ] **Step 4: Instalar dependências da fase**

Run:
```bash
npm i next-themes
npm i -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```
Expected: instalado sem erro de peer deps. `next-themes` é dependência justificada (tema dark/light com persistência + sem flash, padrão de mercado; reimplementar à mão é pior). Vitest/Testing Library são dev-only para o TDD.

---

## Task 1: Config de testes (Vitest)

**Files:**
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Modify: `package.json` (script `test`)

- [ ] **Step 1: Criar `vitest.config.ts`**

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
  resolve: {
    alias: { '@': resolve(__dirname, '.') },
  },
})
```

- [ ] **Step 2: Criar `vitest.setup.ts`**

```typescript
import '@testing-library/jest-dom/vitest'
```

- [ ] **Step 3: Adicionar scripts ao `package.json`**

No bloco `"scripts"`, adicionar:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 4: Smoke test do runner**

Criar `lib/i18n/__smoke__.test.ts` temporário:
```typescript
import { test, expect } from 'vitest'
test('runner works', () => { expect(1 + 1).toBe(2) })
```
Run: `npm test`
Expected: 1 passed. Depois deletar `lib/i18n/__smoke__.test.ts`.

---

## Task 2: Constantes de locale

**Files:**
- Create: `lib/i18n/locales.ts`

- [ ] **Step 1: Criar as constantes**

```typescript
export const locales = ['pt', 'en'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'pt'

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}
```

Sem teste dedicado (constantes triviais); `isLocale` é exercitado nas tasks seguintes.

---

## Task 3: Função pura `getLocale` (TDD)

**Files:**
- Create: `lib/i18n/get-locale.ts`
- Test: `lib/i18n/get-locale.test.ts`

- [ ] **Step 1: Escrever o teste que falha**

```typescript
import { describe, test, expect } from 'vitest'
import { getLocale } from './get-locale'

describe('getLocale', () => {
  test('retorna pt quando Accept-Language prefere português', () => {
    expect(getLocale('pt-BR,pt;q=0.9,en;q=0.8')).toBe('pt')
  })

  test('retorna en quando Accept-Language prefere inglês', () => {
    expect(getLocale('en-US,en;q=0.9')).toBe('en')
  })

  test('respeita o peso q (maior vence)', () => {
    expect(getLocale('en;q=0.3,pt;q=0.9')).toBe('pt')
  })

  test('faz fallback para pt quando header é nulo ou vazio', () => {
    expect(getLocale(null)).toBe('pt')
    expect(getLocale('')).toBe('pt')
  })

  test('faz fallback para pt quando nenhum locale suportado aparece', () => {
    expect(getLocale('fr-FR,de;q=0.8')).toBe('pt')
  })

  test('casa locale por prefixo de região (pt-PT -> pt)', () => {
    expect(getLocale('pt-PT')).toBe('pt')
  })
})
```

- [ ] **Step 2: Rodar e verificar que falha**

Run: `npm test -- get-locale`
Expected: FAIL — `getLocale is not a function` / módulo não encontrado.

- [ ] **Step 3: Implementar o mínimo**

```typescript
import { defaultLocale, isLocale, type Locale } from './locales'

export function getLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return defaultLocale

  const ranked = acceptLanguage
    .split(',')
    .map((part) => {
      const [tag, ...params] = part.trim().split(';')
      const qParam = params.find((p) => p.trim().startsWith('q='))
      const q = qParam ? Number.parseFloat(qParam.split('=')[1]) : 1
      return { tag: tag.trim().toLowerCase(), q: Number.isNaN(q) ? 0 : q }
    })
    .filter((entry) => entry.tag.length > 0)
    .sort((a, b) => b.q - a.q)

  for (const { tag } of ranked) {
    const base = tag.split('-')[0]
    if (isLocale(base)) return base
  }

  return defaultLocale
}

export type { Locale }
```

- [ ] **Step 4: Rodar e verificar que passa**

Run: `npm test -- get-locale`
Expected: 6 passed.

---

## Task 4: Dicionários + loader (TDD)

**Files:**
- Create: `lib/i18n/dictionaries/pt.json`
- Create: `lib/i18n/dictionaries/en.json`
- Create: `lib/i18n/dictionaries.ts`
- Test: `lib/i18n/dictionaries.test.ts`

- [ ] **Step 1: Criar `pt.json`**

```json
{
  "nav": {
    "about": "sobre",
    "experience": "experiência",
    "projects": "projetos",
    "blog": "blog",
    "contact": "contato"
  },
  "hero": {
    "greeting": "Oi, eu sou o Caio.",
    "tagline": "Engenheiro de software sênior. Construo back-ends que não quebram às 3 da manhã.",
    "ctaProjects": "ver projetos",
    "ctaCv": "baixar CV",
    "statusAvailable": "disponível p/ conversa"
  }
}
```

- [ ] **Step 2: Criar `en.json` (mesmas chaves)**

```json
{
  "nav": {
    "about": "about",
    "experience": "experience",
    "projects": "projects",
    "blog": "blog",
    "contact": "contact"
  },
  "hero": {
    "greeting": "Hi, I'm Caio.",
    "tagline": "Senior software engineer. I build back-ends that don't break at 3 a.m.",
    "ctaProjects": "see projects",
    "ctaCv": "download CV",
    "statusAvailable": "open to chat"
  }
}
```

- [ ] **Step 3: Escrever o teste que falha**

```typescript
import { describe, test, expect } from 'vitest'
import { getDictionary } from './dictionaries'

describe('getDictionary', () => {
  test('carrega o dicionário PT', async () => {
    const dict = await getDictionary('pt')
    expect(dict.nav.about).toBe('sobre')
    expect(dict.hero.greeting).toBe('Oi, eu sou o Caio.')
  })

  test('carrega o dicionário EN', async () => {
    const dict = await getDictionary('en')
    expect(dict.nav.about).toBe('about')
    expect(dict.hero.greeting).toBe("Hi, I'm Caio.")
  })

  test('PT e EN têm exatamente as mesmas chaves de nav', async () => {
    const pt = await getDictionary('pt')
    const en = await getDictionary('en')
    expect(Object.keys(pt.nav).sort()).toEqual(Object.keys(en.nav).sort())
  })
})
```

- [ ] **Step 4: Rodar e verificar que falha**

Run: `npm test -- dictionaries`
Expected: FAIL — módulo `./dictionaries` não encontrado.

- [ ] **Step 5: Implementar o loader**

```typescript
import type { Locale } from './locales'
import pt from './dictionaries/pt.json'
import en from './dictionaries/en.json'

export type Dictionary = typeof pt

const dictionaries: Record<Locale, Dictionary> = { pt, en }

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]
}
```

Garantir `resolveJsonModule: true` no `tsconfig.json` (create-next-app já habilita; conferir).

- [ ] **Step 6: Rodar e verificar que passa**

Run: `npm test -- dictionaries`
Expected: 3 passed.

---

## Task 5: `proxy.ts` — redirect por locale

**Files:**
- Create: `proxy.ts` (raiz do projeto)

- [ ] **Step 1: Implementar o proxy**

Next 16 usa `proxy.ts` (substitui `middleware.ts`). Redireciona paths sem prefixo de locale para o locale detectado via `Accept-Language`.

```typescript
import { NextResponse, type NextRequest } from 'next/server'
import { locales } from '@/lib/i18n/locales'
import { getLocale } from '@/lib/i18n/get-locale'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const pathnameHasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  )
  if (pathnameHasLocale) return

  const locale = getLocale(request.headers.get('accept-language'))
  request.nextUrl.pathname = `/${locale}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  // Pula assets internos, arquivos estáticos e rotas de API
  matcher: ['/((?!_next|api|.*\\..*).*)'],
}
```

- [ ] **Step 2: Verificação manual (na Task 10/Validação)**

`curl -I localhost:3000/` deve retornar 307/308 para `/pt` (ou `/en` conforme header). Validado na Task 10.

---

## Task 6: Theme provider + root layout

**Files:**
- Create: `components/theme/theme-provider.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Criar o ThemeProvider**

```tsx
'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import type { ComponentProps } from 'react'

export function ThemeProvider({ children, ...props }: ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
```

- [ ] **Step 2: Reescrever `app/layout.tsx` como root mínimo**

O `lang` definitivo fica no layout por locale (Task 7). Root só injeta o ThemeProvider e estilos globais.

```tsx
import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/theme/theme-provider'

export const metadata: Metadata = {
  title: 'Caio Weliton',
  description: 'Senior Software Engineer',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

---

## Task 7: Layout por locale + toggles + Nav

**Files:**
- Create: `components/theme/theme-toggle.tsx`
- Create: `components/i18n/locale-toggle.tsx`
- Create: `components/nav.tsx`
- Create: `app/[locale]/layout.tsx`
- Create: `app/[locale]/page.tsx`
- Delete: `app/page.tsx` (home padrão do create-next-app)
- Test: `components/i18n/locale-toggle.test.tsx`

- [ ] **Step 1: ThemeToggle**

```tsx
'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) return <span className="w-5 text-stone-500" aria-hidden />

  const isDark = resolvedTheme === 'dark'
  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Ativar tema claro' : 'Ativar tema escuro'}
      className="font-mono text-xs text-stone-400 hover:text-amber-500 transition-colors"
    >
      {isDark ? 'light' : 'dark'}
    </button>
  )
}
```

- [ ] **Step 2: Escrever o teste do LocaleToggle (TDD)**

O toggle troca o prefixo de locale do path atual preservando o resto.

```tsx
import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LocaleToggle } from './locale-toggle'

const push = vi.fn()
vi.mock('next/navigation', () => ({
  usePathname: () => '/pt/blog/meu-post',
  useRouter: () => ({ push }),
}))

describe('LocaleToggle', () => {
  beforeEach(() => push.mockClear())

  test('mostra os dois idiomas', () => {
    render(<LocaleToggle currentLocale="pt" />)
    expect(screen.getByText('PT')).toBeInTheDocument()
    expect(screen.getByText('EN')).toBeInTheDocument()
  })

  test('clicar em EN troca o prefixo do path preservando o resto', async () => {
    const user = userEvent.setup()
    render(<LocaleToggle currentLocale="pt" />)
    await user.click(screen.getByText('EN'))
    expect(push).toHaveBeenCalledWith('/en/blog/meu-post')
  })
})
```

- [ ] **Step 3: Rodar e verificar que falha**

Run: `npm test -- locale-toggle`
Expected: FAIL — módulo `./locale-toggle` não encontrado.

- [ ] **Step 4: Implementar o LocaleToggle**

```tsx
'use client'

import { usePathname, useRouter } from 'next/navigation'
import { locales, type Locale } from '@/lib/i18n/locales'

export function LocaleToggle({ currentLocale }: { currentLocale: Locale }) {
  const pathname = usePathname()
  const router = useRouter()

  function switchTo(locale: Locale) {
    const segments = pathname.split('/')
    segments[1] = locale // segments[0] é '' (path começa com '/')
    router.push(segments.join('/'))
  }

  return (
    <span className="font-mono text-xs">
      {locales.map((locale, i) => (
        <span key={locale}>
          {i > 0 && <span className="text-stone-600"> / </span>}
          <button
            type="button"
            onClick={() => switchTo(locale)}
            aria-current={locale === currentLocale}
            className={
              locale === currentLocale
                ? 'text-stone-100'
                : 'text-stone-500 hover:text-amber-500 transition-colors'
            }
          >
            {locale.toUpperCase()}
          </button>
        </span>
      ))}
    </span>
  )
}
```

- [ ] **Step 5: Rodar e verificar que passa**

Run: `npm test -- locale-toggle`
Expected: 2 passed.

- [ ] **Step 6: Nav**

```tsx
import Link from 'next/link'
import type { Locale } from '@/lib/i18n/locales'
import type { Dictionary } from '@/lib/i18n/dictionaries'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { LocaleToggle } from '@/components/i18n/locale-toggle'

export function Nav({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-stone-800">
      <Link href={`/${locale}`} className="text-stone-100 font-bold tracking-tight">
        caio<span className="text-amber-600">.</span>
      </Link>
      <div className="hidden md:flex gap-6 text-sm text-stone-400">
        <a href="#about">{dict.nav.about}</a>
        <a href="#experience">{dict.nav.experience}</a>
        <a href="#projects">{dict.nav.projects}</a>
        <Link href={`/${locale}/blog`}>{dict.nav.blog}</Link>
        <a href="#contact" className="text-amber-600">{dict.nav.contact}</a>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <LocaleToggle currentLocale={locale} />
      </div>
    </nav>
  )
}
```

- [ ] **Step 7: Layout por locale**

```tsx
import { notFound } from 'next/navigation'
import { locales, isLocale, type Locale } from '@/lib/i18n/locales'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { Nav } from '@/components/nav'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const dict = await getDictionary(locale as Locale)

  return (
    <div lang={locale} className="min-h-screen bg-stone-950 text-stone-100">
      <Nav locale={locale as Locale} dict={dict} />
      <main>{children}</main>
    </div>
  )
}
```

> Nota: o `lang` do `<html>` real é melhor setado no root layout, mas como o locale só é conhecido no segmento `[locale]`, aplicamos `lang` no container. Migrar para `<html lang>` dinâmico na Fase 5 (Polish) se necessário. Aceitável para Foundation.

- [ ] **Step 8: Landing stub**

`app/[locale]/page.tsx`:
```tsx
import { getDictionary } from '@/lib/i18n/dictionaries'
import { isLocale, type Locale } from '@/lib/i18n/locales'
import { notFound } from 'next/navigation'

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const dict = await getDictionary(locale as Locale)

  return (
    <section className="px-6 py-24">
      <p className="font-mono text-xs tracking-[0.2em] text-amber-600 mb-5">№ 00 — INÍCIO</p>
      <h1 className="text-4xl font-bold tracking-tight text-stone-50">{dict.hero.greeting}</h1>
      <p className="mt-3 max-w-lg text-stone-400">{dict.hero.tagline}</p>
    </section>
  )
}
```

- [ ] **Step 9: Deletar a home padrão**

Run: `rm app/page.tsx`
Expected: removido. (Sobra `app/[locale]/page.tsx` como rota de conteúdo.)

---

## Task 8: Tema Terracotta (Tailwind v4 tokens)

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Reescrever `globals.css` com tokens Terracotta**

Tailwind v4: `@import "tailwindcss"` + `@theme`. Cores `stone`/`amber` do default já batem com a direção; adicionamos tokens semânticos de marca.

```css
@import "tailwindcss";

@theme {
  /* Paleta Terracotta & Stone — tokens de marca */
  --color-brand-bg: #1c1917;        /* fundo principal (dark) */
  --color-brand-elev: #0c0a09;      /* superfícies elevadas (terminal) */
  --color-brand-accent: #d97706;    /* âmbar/terracota — assinatura */
  --color-brand-accent-deep: #c2410c;
  --color-brand-highlight: #fed7aa; /* destaque quente */
  --color-brand-ok: #86efac;        /* status "disponível" */

  --font-sans: "Helvetica Neue", Arial, system-ui, sans-serif;
  --font-mono: ui-monospace, "SF Mono", Menlo, monospace;
}

:root { color-scheme: dark; }
.light { color-scheme: light; }
```

> Nota: o stub usa utilitárias `bg-stone-950`, `text-stone-100`, `text-amber-600` (default Tailwind) que já entregam a vibe Terracotta. Os tokens `brand-*` ficam disponíveis como `bg-brand-bg`, `text-brand-accent` etc. para a Fase 2. Refino completo de light-mode na Fase 5.

- [ ] **Step 2: Build pra validar o CSS**

Run: `npm run build`
Expected: build sem erro de CSS/Tailwind.

---

## Task 9: Docker standalone

**Files:**
- Modify: `next.config.ts`
- Create: `Dockerfile`
- Create: `.dockerignore`

- [ ] **Step 1: Habilitar standalone no `next.config.ts`**

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
}

export default nextConfig
```

- [ ] **Step 2: Criar `.dockerignore`**

```
node_modules
.next
.git
docs
npm-debug.log
Dockerfile
.dockerignore
*.md
```

- [ ] **Step 3: Criar `Dockerfile` (multi-stage)**

```dockerfile
# syntax=docker/dockerfile:1
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
CMD ["node", "server.js"]
```

- [ ] **Step 4: Build da imagem**

Run: `docker build -t caioweliton-dev .`
Expected: imagem construída sem erro. (Se Docker não estiver disponível no ambiente, marcar pendente e validar no deploy — não bloqueia a fase.)

---

## Task 10: README + verificação final + commit da fase

**Files:**
- Create: `README.md`

- [ ] **Step 1: Criar `README.md`**

````markdown
# caioweliton.dev

Site pessoal / portfólio de Caio Weliton. Next.js 16 (App Router), bilíngue PT/EN, tema Terracotta dark/light.

## Dev

```bash
npm install
npm run dev      # http://localhost:3000 (redireciona para /pt ou /en)
npm test         # Vitest
npm run build    # build de produção (standalone)
```

## Docker

```bash
docker build -t caioweliton-dev .
docker run -p 3000:3000 caioweliton-dev
```

## Estrutura

- `app/[locale]/` — rotas por idioma
- `lib/i18n/` — locales, dicionários, detecção de idioma
- `components/` — Nav, toggles de tema/idioma
- `proxy.ts` — redirect por `Accept-Language`
- `docs/specs/`, `docs/plans/` — design e planos
````

- [ ] **Step 2: Lint + testes + build (gate completo)**

Run:
```bash
npm run lint && npm test && npm run build
```
Expected: lint limpo, todos os testes passam (get-locale 6, dictionaries 3, locale-toggle 2), build conclui.

- [ ] **Step 3: Subir o dev e validar o redirect manualmente**

Run (background): `npm run dev`
Então:
```bash
curl -sI localhost:3000/ | grep -i location
curl -sI -H "Accept-Language: en-US,en;q=0.9" localhost:3000/ | grep -i location
```
Expected: primeiro → `location: /pt` (fallback); segundo → `location: /en`. Encerrar o dev depois.

- [ ] **Step 4: Propor commit da fase ao dono (NÃO executar sem aprovação)**

Apresentar o diff completo da Fase 1 e propor:
```bash
git init
git add -A
git commit -m "feat: foundation — Next 16 scaffold, i18n PT/EN, tema Terracotta, Docker standalone"
```
**Aguardar aprovação explícita. Sem push.** (CLAUDE.md: commit no fim da feature, com aprovação.)

---

## Self-Review (cobertura vs spec)

- **Scaffold Next 16 + TS + Tailwind v4** → Task 0, 8 ✓
- **i18n PT/EN** → Tasks 2–5, 7 ✓ (hreflang/alternates completo entra na Fase 2 com o SEO core — Foundation entrega roteamento + dicionários + detecção)
- **Tema dark/light** → Tasks 6, 7, 8 ✓
- **proxy.ts Accept-Language** → Tasks 3, 5 ✓
- **Docker standalone** → Task 9 ✓
- **Paleta Terracotta** → Task 8 ✓
- **Nav + toggles** → Task 7 ✓

Fora do escopo desta fase (vão pras seguintes): seções de conteúdo, `data/*.ts`, JSON-LD/OG/sitemap, blog MDX, now/uses, CV PDF, animações Framer, refino de light-mode e `<html lang>` dinâmico no root.

## Notas de consistência de tipos

- `Locale` = `'pt' | 'en'` definido em `lib/i18n/locales.ts`; reusado em get-locale, dictionaries, proxy, componentes.
- `Dictionary` = `typeof pt` (de `dictionaries.ts`); consumido por Nav e páginas.
- `getLocale(acceptLanguage: string | null): Locale` — assinatura única usada em proxy.ts.
- `getDictionary(locale: Locale): Promise<Dictionary>` — assinatura única.
