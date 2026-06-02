# Fase 5 — Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development (recommended) ou superpowers:executing-plans. Steps usam checkbox (`- [ ]`).
>
> **⚠️ Commits:** Por preferência do dono (CLAUDE.md), **NÃO commitar por task nem por ciclo TDD.** Subagentes só implementam, testam e reportam. Commit único no fim da fase, com aprovação. **Sem push.**

**Goal:** Acabamento do site: tema claro/escuro real (tokens semânticos), animações de entrada (Framer Motion, respeitando reduced-motion), syntax highlighting no blog, acessibilidade (skip-link, focus-visible, aria, `<html lang>` correto) e Core Web Vitals verificados.

**Architecture:** Sobre Fases 1-4. Cores migram de utilitárias fixas (`stone-*`/`amber-*`) para **tokens semânticos** (`background`/`foreground`/`accent`/...) definidos como CSS vars em `:root` (light) e `.dark` (dark), expostos ao Tailwind v4 via `@theme inline`. next-themes (já instalado) alterna a classe. Animações via um wrapper `Reveal` (Framer Motion `whileInView`). Syntax highlight via `rehype-pretty-code` + `shiki` nas opções do MDXRemote.

**Tech Stack:** Next.js 16, Tailwind v4, next-themes, framer-motion, rehype-pretty-code + shiki, Vitest.

---

## File Structure

| Arquivo | Mudança |
|---------|---------|
| `app/globals.css` | tokens semânticos light/dark + `@custom-variant dark` |
| ~18 componentes/páginas | trocar classes fixas por semânticas (mapa abaixo) |
| `components/reveal.tsx` | wrapper de animação (Framer, reduced-motion) |
| `components/i18n/html-lang.tsx` | client: seta `document.documentElement.lang` |
| `components/skip-link.tsx` | link "pular para conteúdo" |
| `app/[locale]/layout.tsx` | inclui SkipLink + HtmlLang; `<main id="content">` |
| `app/[locale]/blog/[slug]/page.tsx` | rehype-pretty-code nas options do MDXRemote |

---

## Task 1: Tokens semânticos light/dark

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Reescrever `globals.css`**

Preservar o `@import "tailwindcss"` e as vars de fonte Geist do scaffold. Adicionar variante dark por classe + tokens semânticos:

```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

@theme inline {
  --color-background: var(--background);
  --color-surface: var(--surface);
  --color-foreground: var(--foreground);
  --color-muted: var(--muted);
  --color-faint: var(--faint);
  --color-border: var(--border);
  --color-accent: var(--accent);
  --color-accent-strong: var(--accent-strong);
  --color-highlight: var(--highlight);
  --color-ok: var(--ok);
}

:root {
  /* Light — papel creme / tinta */
  --background: #faf7f0;
  --surface: #f1ece1;
  --foreground: #1c1917;
  --muted: #57534e;
  --faint: #8a8178;
  --border: #e4ddcf;
  --accent: #b45309;
  --accent-strong: #9a3412;
  --highlight: #92400e;
  --ok: #15803d;
  color-scheme: light;
}

.dark {
  --background: #1c1917;
  --surface: #0c0a09;
  --foreground: #fafaf9;
  --muted: #a8a29e;
  --faint: #57534e;
  --border: #292524;
  --accent: #d97706;
  --accent-strong: #c2410c;
  --highlight: #fed7aa;
  --ok: #86efac;
  color-scheme: dark;
}

body { background: var(--background); color: var(--foreground); }
```

- [ ] **Step 2: Build pra validar o CSS**

Run: `npm run build`
Expected: sem erro de Tailwind/CSS. (Componentes ainda usam classes antigas — convertidos na Task 2.)

---

## Task 2: Converter componentes para tokens semânticos

**Files (modify):** `components/nav.tsx`, `components/theme/theme-toggle.tsx`, `components/i18n/locale-toggle.tsx`, `components/sections/section-heading.tsx`, `components/sections/hero.tsx`, `components/sections/about.tsx`, `components/sections/experience.tsx`, `components/sections/projects.tsx`, `components/sections/skills.tsx`, `components/sections/contact.tsx`, `components/sections/blog-preview.tsx`, `components/blog/post-list.tsx`, `app/[locale]/layout.tsx`, `app/[locale]/page.tsx`, `app/[locale]/blog/page.tsx`, `app/[locale]/blog/[slug]/page.tsx`, `app/[locale]/now/page.tsx`, `app/[locale]/uses/page.tsx`, `mdx-components.tsx`

- [ ] **Step 1: Aplicar o mapa de substituição (consistente em todos os arquivos)**

| Classe antiga | Nova |
|---------------|------|
| `bg-stone-950` | `bg-background` |
| `bg-stone-900/60`, `bg-stone-900` | `bg-surface` |
| `bg-stone-950/80` | `bg-surface` |
| `text-stone-50`, `text-stone-100`, `text-stone-200` | `text-foreground` |
| `text-stone-300`, `text-stone-400` | `text-muted` |
| `text-stone-500`, `text-stone-600`, `text-stone-700` | `text-faint` |
| `border-stone-800`, `border-stone-900` | `border-border` |
| `text-amber-600`, `text-amber-500`, `text-amber-400`, `text-amber-700` | `text-accent` |
| `bg-amber-600`, `hover:bg-amber-500` | `bg-accent`, `hover:bg-accent-strong` |
| `text-amber-300`, `text-amber-300/80` | `text-accent` |
| `bg-amber-950/30`, `bg-amber-950/20` | `bg-accent/10` |
| `border-amber-900/50` | `border-accent/30` |
| `text-green-300` | `text-ok` |
| `from-amber-600 to-orange-700` (Avatar) | manter (gradiente decorativo) |
| glows `rgba(217,119,6,...)` inline | manter |

Regras:
- Botões com fundo de acento (`bg-accent`): texto fica `text-white` (mantém legível em ambos temas, pois o acento é escuro o bastante).
- O `caio.` da Nav: o `.` usa `text-accent`.
- Hover de links secundários: `hover:text-accent`.
- Cursor do terminal `▋` e `$`: `text-accent`.
- Ler cada arquivo antes de editar; aplicar só as classes presentes.

- [ ] **Step 2: Build + verificação visual dos dois temas**

Run: `npm run build` → sem erro.
Run (bg) `npm run dev`: abrir `/pt`, alternar tema (toggle) → fundo/texto/acento mudam coerentes (dark warm ↔ light creme); conferir Hero, cards de projeto, blog, now, uses, contato em ambos. Conferir contraste do texto sobre fundo. Encerrar dev.

---

## Task 3: `<html lang>` dinâmico + a11y base

**Files:**
- Create: `components/i18n/html-lang.tsx`
- Create: `components/skip-link.tsx`
- Modify: `app/[locale]/layout.tsx`
- Modify: `app/globals.css` (focus-visible)

- [ ] **Step 1: HtmlLang (client effect)**

O root `<html>` não tem acesso ao locale; um client component seta o atributo após montar.

`components/i18n/html-lang.tsx`:
```tsx
'use client'

import { useEffect } from 'react'
import type { Locale } from '@/lib/i18n/locales'

export function HtmlLang({ locale }: { locale: Locale }) {
  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])
  return null
}
```

- [ ] **Step 2: SkipLink**

`components/skip-link.tsx`:
```tsx
export function SkipLink({ label }: { label: string }) {
  return (
    <a
      href="#content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded focus:bg-accent focus:px-4 focus:py-2 focus:text-white focus:font-mono focus:text-xs"
    >
      {label}
    </a>
  )
}
```

- [ ] **Step 3: Wire no layout por locale**

Em `app/[locale]/layout.tsx`: importar `HtmlLang` e `SkipLink`; no topo do container, antes da `Nav`, adicionar `<SkipLink label={locale === 'pt' ? 'Pular para o conteúdo' : 'Skip to content'} />` e `<HtmlLang locale={l} />`; trocar `<main>` por `<main id="content" tabIndex={-1}>`. (Ler o arquivo antes; `l` é o locale tipado.)

- [ ] **Step 4: focus-visible global**

Em `app/globals.css`, adicionar:
```css
:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
```

- [ ] **Step 5: Build + verificação**

Run: `npm run build`. Dev: Tab a partir do topo mostra o skip-link; foco visível nos links/botões; `document.documentElement.lang` reflete o locale (DevTools). Encerrar dev.

---

## Task 4: Animações (Framer Motion)

**Files:**
- Create: `components/reveal.tsx`
- Modify: seções da landing (Hero/About/Experience/Projects/Skills/BlogPreview/Contact)

- [ ] **Step 1: Instalar**

Run: `npm i framer-motion`

- [ ] **Step 2: Reveal (respeita prefers-reduced-motion)**

`components/reveal.tsx`:
```tsx
'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

export function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const reduce = useReducedMotion()
  if (reduce) return <>{children}</>
  return (
    <motion.div
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

- [ ] **Step 3: Aplicar nas seções**

Cada seção da landing é Server Component; `Reveal` é client (ok importar e usar dentro). Envolver o conteúdo interno de cada `<section>` com `<Reveal>` (não a section inteira, p/ preservar `id` de âncora). Ex. em `about.tsx`:
```tsx
<section id="about" className="px-6 py-20">
  <Reveal>
    {/* SectionHeading + conteúdo existentes */}
  </Reveal>
</section>
```
Aplicar em Hero (conteúdo abaixo da nav), About, Experience, Projects, Skills, BlogPreview, Contact. Importar `Reveal` em cada. Ler cada arquivo antes.

> Nota: `<Reveal>` adiciona um `<div>` por fora do grid interno — conferir que grids (Experience/Projects) seguem ok.

- [ ] **Step 4: Build + verificação**

Run: `npm run build`. Dev: seções fazem fade+slide ao entrar no viewport; com `prefers-reduced-motion: reduce` (DevTools → Rendering → Emulate) não animam. Encerrar dev.

---

## Task 5: Syntax highlighting no blog

**Files:**
- Modify: `app/[locale]/blog/[slug]/page.tsx`
- Modify: `app/globals.css` (estilos do code block)
- Modify: post seed (garantir um code block)

- [ ] **Step 1: Instalar**

Run: `npm i -D rehype-pretty-code shiki`

- [ ] **Step 2: Plugar no MDXRemote**

Em `app/[locale]/blog/[slug]/page.tsx`, adicionar rehype plugin nas options (manter `parseFrontmatter`, `components`, `onError`):
```tsx
import rehypePrettyCode from 'rehype-pretty-code'
// ...
  const options: MDXRemoteOptions = {
    parseFrontmatter: true,
    mdxOptions: {
      rehypePlugins: [
        [rehypePrettyCode, { theme: { dark: 'github-dark', light: 'github-light' }, keepBackground: false }],
      ],
    },
  }
```

- [ ] **Step 3: Estilos do bloco**

Em `app/globals.css`, adicionar:
```css
pre[data-theme], code[data-theme] { background: var(--surface); }
pre code { display: grid; }
.dark [data-theme='light'] { display: none; }
:root:not(.dark) [data-theme='dark'] { display: none; }
```

- [ ] **Step 4: Garantir code block no post seed**

No post PT (`content/blog/pt/estruturando-microservicos-node.mdx`), adicionar um bloco de código se não houver, ex:
````
```ts
export async function handler(event: SQSEvent) {
  for (const record of event.Records) {
    await process(JSON.parse(record.body))
  }
}
```
````
Build + dev: abrir o post, ver código colorido; alternar tema e ver o highlight acompanhar. Encerrar dev.

---

## Task 6: Core Web Vitals / Lighthouse

- [ ] **Step 1: Build + start**

Run: `npm run build && npm run start` (servir produção).

- [ ] **Step 2: Lighthouse**

`npx lighthouse http://localhost:3000/pt --only-categories=performance,accessibility,seo,best-practices --quiet --chrome-flags="--headless"` (ou DevTools). Alvo ≥ 90 nas 4 categorias; LCP/CLS/INP verdes.

- [ ] **Step 3: Correções pontuais (só o que o relatório acusar)**

- Contraste a11y → ajustar `--muted`/`--faint` em `globals.css`.
- CLS → `Reveal` usa opacity/transform (sem shift); ok.
- Fonte Geist via next/font já faz `display: swap`.
Reportar os scores finais.

---

## Task 7: Verificação final + commit da fase

- [ ] **Step 1: Gate completo**

Run: `npm run lint && npm test && npm run build`
Expected: lint 0 erros; 36 testes passam (fase visual — nenhum teste quebra); build OK.

- [ ] **Step 2: Validação manual final**

Tema claro/escuro coerente em todas as páginas; animações on-scroll (e off com reduced-motion); skip-link + foco visível; `<html lang>` certo; code block colorido no blog; Lighthouse ≥ 90.

- [ ] **Step 3: Propor commit ao dono (NÃO executar sem aprovação)**

```bash
git add -A
git commit -m "feat: polish — light/dark theme, animacoes, syntax highlight, a11y, CWV"
```
**Aguardar aprovação. Sem push.**

---

## Self-Review (cobertura vs decisões)

- **Light-mode completo (tokens semânticos)** → Tasks 1, 2 ✓
- **Animações Framer + reduced-motion** → Task 4 ✓
- **Syntax highlight no blog** → Task 5 ✓
- **A11y (skip-link, focus-visible, aria nos toggles) + `<html lang>` dinâmico** → Task 3 ✓
- **Core Web Vitals / Lighthouse** → Task 6 ✓

Fora de escopo: foto real (placeholder pronto — dono adiciona `public/caio.jpg` e troca o Avatar); RSS feed; paginação do blog; e2e Playwright — backlog.

## Notas

- **Risco da Task 2** (conversão de cores): mecânica mas ampla (~18 arquivos). Aplicar o mapa exatamente; conferir os dois temas no build. Se algo ficar ilegível no light, ajustar o token em `globals.css` (não hardcodar cor no componente).
- `<html lang>` via client effect é pragmático (root layout não recebe params no App Router). hreflang + lang do container cobrem SEO; o effect corrige o atributo real do `<html>` para leitores de tela.
- Shiki: tema dual dark/light alternado por CSS conforme a classe do tema.
