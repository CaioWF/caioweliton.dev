# Redesign "Terminal Editorial Dark" — Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) ou superpowers:executing-plans para implementar task-by-task. Steps usam checkbox (`- [ ]`).
>
> **Commits:** NÃO commitar por tarefa. Subagentes só implementam/testam/reportam. Commit único no fim, com aprovação do dono (pref global).

**Goal:** Trocar a identidade visual do site para "Terminal Editorial Dark" (dark editorial + serif Fraunces + acento esmeralda→ciano + constelação reativa + grão), sem tocar em conteúdo, rotas, i18n, SEO, blog ou CV.

**Architecture:** Reskin orientado a tokens. A maior parte da paleta propaga via CSS vars semânticas (`globals.css`) — componentes já consomem `bg-background`/`text-accent`/etc. Fontes via `next/font/google`. Background é um componente client de canvas montado no layout, com helpers puros isolados em `lib/bg/`.

**Tech Stack:** Next 16 (App Router, Turbopack), Tailwind v4 (`@theme inline`), next-themes, next/font (Fraunces, JetBrains Mono, Geist), canvas 2D, Vitest.

---

## 1. Entendimento

Implementar a spec `docs/specs/2026-06-02-redesign-terminal-editorial-dark.md` (aprovada). É um redesign visual (reskin): nova paleta dark-primária, serif display, mono terminal, acento esmeralda→ciano, background de constelação sutil reativo ao mouse e camada de grão ~4%. Conteúdo e lógica permanecem intactos; validação é build/lint/testes existentes verdes + verificação visual.

## 2. Investigação

Lido nesta fase (além do que a spec já registrou):

- `package.json` — scripts: `dev`=`next dev`, `build`=`next build`, `lint`=`eslint`, `test`=`vitest run`. Sem dep nova necessária (canvas é nativo; fontes via `next/font/google` já disponível).
- `app/globals.css` — tokens em `:root`/`.dark` via `@theme inline`; `@custom-variant dark`; regras shiki dual-theme. Trocar valores propaga paleta.
- `app/layout.tsx` — `Geist`+`Geist_Mono` via `next/font/google`; `ThemeProvider defaultTheme="dark"`; `suppressHydrationWarning`; vars no `<html className>`.
- `components/sections/hero.tsx` — glow amber hardcoded (rgba), bloco terminal, `<h1>`.
- `components/sections/section-heading.tsx` — `<h2>` reusado por todas as seções.
- `components/nav.tsx` — links já em âncora; mono nos labels.

Convenções seguidas: tokens semânticos, `next/font`, `<Reveal>` nas seções, helpers puros testáveis em `lib/`.

## 3. Mudanças propostas (mapa de arquivos)

| Arquivo | Ação | Responsabilidade |
|---|---|---|
| `app/globals.css` | Modificar | Nova paleta (dark+light), `--font-display`, `.text-gradient`, classe `.grain`, manter shiki dual-theme |
| `app/layout.tsx` | Modificar | Add Fraunces + JetBrains Mono; manter Geist; montar `<InteractiveBackground/>` + `<div class="grain"/>` |
| `lib/bg/field.ts` | Criar | Helpers puros: `connectionOpacity`, `hexToRgb` |
| `lib/bg/field.test.ts` | Criar | Testes dos helpers (TDD) |
| `components/interactive-bg.tsx` | Criar | Canvas client: constelação sutil, reduced-motion off, pausa em aba oculta, cor derivada de `--accent` |
| `components/sections/section-heading.tsx` | Modificar | `font-display` no `<h2>` |
| `components/sections/hero.tsx` | Modificar | `font-display` no `<h1>`, `.text-gradient` no destaque, glow usa acento novo |
| `components/nav.tsx` | Modificar | Estética terminal `[ label ]` nos links (visual; hrefs inalterados) |

## 4. Decisões de design

Herdadas da spec (fechadas): direção Terminal Editorial Dark; Fraunces/JetBrains Mono/Geist; acento esmeralda→ciano; constelação sutil; grão ~4%; reaproveitar tokens. Adições de implementação:

- **Helpers puros isolados em `lib/bg/field.ts`** — torna a matemática do canvas testável (TDD) sem depender de DOM/canvas. O componente fica fino, só orquestra.
- **Cor do background derivada de `--accent`** em runtime (via `getComputedStyle` + `hexToRgb`), re-lida quando a classe `.dark` muda (MutationObserver) — mantém coerência ao alternar tema sem hardcode.
- **Var de fonte mono mantém nome `--font-geist-mono`** alimentada por JetBrains Mono — evita refactor dos consumidores e do `@theme inline`.

## 5. Pontos de decisão

Nenhum aberto. Todos resolvidos na spec (§5).

## 6. Ordem de implementação (tarefas)

Dependência: Task 1 → (2,3) → 4 → (5,6) → 7 → 8. Tasks 5 e 6 paralelizáveis; 3 independe de 2.

---

### Task 1: Paleta, fonte-display, gradiente e grão em `globals.css`

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Reescrever `globals.css`**

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
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
  --font-display: var(--font-fraunces);
}

/* Light (secundário, coerente) */
:root {
  --background: #fafafa;
  --surface: #f4f4f5;
  --foreground: #18181b;
  --muted: #52525b;
  --faint: #a1a1aa;
  --border: #e4e4e7;
  --accent: #0d9488;
  --accent-strong: #0891b2;
  --highlight: #0f766e;
  --ok: #0d9488;
  color-scheme: light;
}

/* Dark (primário) */
.dark {
  --background: #0a0a0f;
  --surface: #14141b;
  --foreground: #f5f5f7;
  --muted: #a1a1aa;
  --faint: #52525b;
  --border: #27272a;
  --accent: #34d399;
  --accent-strong: #22d3ee;
  --highlight: #a7f3d0;
  --ok: #34d399;
  color-scheme: dark;
}

body { background: var(--background); color: var(--foreground); }

:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

/* Acento em gradiente p/ texto de destaque */
.text-gradient {
  background: linear-gradient(90deg, var(--accent), var(--accent-strong));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* Camada de grão ~4% — ruído estático via SVG feTurbulence */
.grain {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0.04;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

/* shiki dual-theme (inalterado) */
pre[data-theme], code[data-theme] { background: var(--surface); }
pre code { display: grid; }
.dark [data-theme='light'] { display: none; }
:root:not(.dark) [data-theme='dark'] { display: none; }
```

- [ ] **Step 2: Verificar build + lint**

Run: `npm run build && npm run lint`
Expected: build OK (Turbopack), lint sem erros.

---

### Task 2: Fontes e montagem do background em `layout.tsx`

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Reescrever `layout.tsx`**

```tsx
import type { Metadata } from 'next'
import { Geist, JetBrains_Mono, Fraunces } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme/theme-provider'
import { InteractiveBackground } from '@/components/interactive-bg'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

// JetBrains Mono alimenta a var --font-geist-mono (nome mantido p/ não quebrar @theme/consumidores)
const jetbrainsMono = JetBrains_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
  style: ['normal', 'italic'],
})

export const metadata: Metadata = {
  title: 'Caio Weliton',
  description: 'Senior Software Engineer',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      suppressHydrationWarning
      className={`${geistSans.variable} ${jetbrainsMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <InteractiveBackground />
          <div className="grain" aria-hidden />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Verificar build**

Run: `npm run build`
Expected: erro de módulo não encontrado `@/components/interactive-bg` (criado na Task 4) — esperado até Task 4. Em ordem estrita, fazer Task 3+4 antes de rodar build aqui. Ao final de Task 4, build OK.

---

### Task 3: Helpers puros do background (TDD)

**Files:**
- Create: `lib/bg/field.ts`
- Test: `lib/bg/field.test.ts`

- [ ] **Step 1: Escrever os testes que falham**

```ts
import { describe, it, expect } from 'vitest'
import { connectionOpacity, hexToRgb } from './field'

describe('connectionOpacity', () => {
  it('é 0 quando distância >= máximo', () => {
    expect(connectionOpacity(100, 100)).toBe(0)
    expect(connectionOpacity(150, 100)).toBe(0)
  })
  it('é 1 quando distância <= 0', () => {
    expect(connectionOpacity(0, 100)).toBe(1)
    expect(connectionOpacity(-5, 100)).toBe(1)
  })
  it('decai linearmente no meio', () => {
    expect(connectionOpacity(50, 100)).toBeCloseTo(0.5)
    expect(connectionOpacity(25, 100)).toBeCloseTo(0.75)
  })
})

describe('hexToRgb', () => {
  it('converte hex de 6 dígitos', () => {
    expect(hexToRgb('#34d399')).toEqual({ r: 52, g: 211, b: 153 })
    expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 })
  })
  it('aceita hex sem #', () => {
    expect(hexToRgb('22d3ee')).toEqual({ r: 34, g: 211, b: 238 })
  })
  it('faz trim de espaços', () => {
    expect(hexToRgb('  #ffffff  ')).toEqual({ r: 255, g: 255, b: 255 })
  })
  it('cai p/ fallback em hex inválido', () => {
    expect(hexToRgb('xyz')).toEqual({ r: 52, g: 211, b: 153 })
  })
})
```

- [ ] **Step 2: Rodar p/ confirmar falha**

Run: `npm test -- lib/bg/field.test.ts`
Expected: FAIL (módulo `./field` não existe).

- [ ] **Step 3: Implementar `lib/bg/field.ts`**

```ts
export interface Rgb {
  r: number
  g: number
  b: number
}

const FALLBACK: Rgb = { r: 52, g: 211, b: 153 } // esmeralda

/** Opacidade de uma linha entre dois pontos: 1 perto, 0 ao atingir maxDistance. */
export function connectionOpacity(distance: number, maxDistance: number): number {
  if (distance >= maxDistance) return 0
  if (distance <= 0) return 1
  return 1 - distance / maxDistance
}

/** Converte "#rrggbb" (ou "rrggbb") em {r,g,b}. Fallback esmeralda se inválido. */
export function hexToRgb(hex: string): Rgb {
  const h = hex.trim().replace(/^#/, '')
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return FALLBACK
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  }
}
```

- [ ] **Step 4: Rodar p/ confirmar passa**

Run: `npm test -- lib/bg/field.test.ts`
Expected: PASS (todos).

---

### Task 4: Componente `InteractiveBackground`

**Files:**
- Create: `components/interactive-bg.tsx`

- [ ] **Step 1: Implementar o componente**

```tsx
'use client'

import { useEffect, useRef } from 'react'
import { connectionOpacity, hexToRgb, type Rgb } from '@/lib/bg/field'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
}

const LINK_DISTANCE = 130 // px entre partículas que conectam
const CURSOR_DISTANCE = 170 // px de alcance do cursor
const DENSITY = 14000 // 1 partícula a cada N px² (baixa densidade = sutil)
const MAX_PARTICLES = 90

function readAccent(): Rgb {
  if (typeof window === 'undefined') return { r: 52, g: 211, b: 153 }
  const v = getComputedStyle(document.documentElement).getPropertyValue('--accent')
  return hexToRgb(v || '#34d399')
}

export function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return // respeita reduced-motion: sem animação

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let width = 0
    let height = 0
    let particles: Particle[] = []
    let accent = readAccent()
    let raf = 0
    const mouse = { x: -9999, y: -9999 }

    function resize() {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const target = Math.min(MAX_PARTICLES, Math.floor((width * height) / DENSITY))
      particles = Array.from({ length: target }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
      }))
    }

    function rgba(c: Rgb, a: number) {
      return `rgba(${c.r},${c.g},${c.b},${a})`
    }

    function frame() {
      ctx.clearRect(0, 0, width, height)
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > width) p.vx *= -1
        if (p.y < 0 || p.y > height) p.vy *= -1
      }
      // linhas entre partículas próximas
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i]
          const b = particles[j]
          const d = Math.hypot(a.x - b.x, a.y - b.y)
          const o = connectionOpacity(d, LINK_DISTANCE)
          if (o > 0) {
            ctx.strokeStyle = rgba(accent, o * 0.15)
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
        // linha p/ o cursor (mais visível)
        const dm = Math.hypot(particles[i].x - mouse.x, particles[i].y - mouse.y)
        const om = connectionOpacity(dm, CURSOR_DISTANCE)
        if (om > 0) {
          ctx.strokeStyle = rgba(accent, om * 0.4)
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(particles[i].x, particles[i].y)
          ctx.lineTo(mouse.x, mouse.y)
          ctx.stroke()
        }
      }
      // pontos
      for (const p of particles) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, 1.4, 0, Math.PI * 2)
        ctx.fillStyle = rgba(accent, 0.5)
        ctx.fill()
      }
      raf = requestAnimationFrame(frame)
    }

    function onMove(e: MouseEvent) {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }
    function onLeave() {
      mouse.x = -9999
      mouse.y = -9999
    }
    function onVisibility() {
      if (document.hidden) {
        cancelAnimationFrame(raf)
      } else {
        raf = requestAnimationFrame(frame)
      }
    }
    const observer = new MutationObserver(() => {
      accent = readAccent()
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseleave', onLeave)
    document.addEventListener('visibilitychange', onVisibility)
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10"
    />
  )
}
```

- [ ] **Step 2: Verificar build + lint + testes**

Run: `npm run build && npm run lint && npm test`
Expected: build OK, lint limpo, 38 testes passam (36 antigos + 2 novos de field).

- [ ] **Step 3: Verificação visual**

Run: `npm run dev`
Observar: fundo dark com pontos sutis flutuando; mover o mouse forma linhas até o cursor; alternar tema mantém coerência de cor; em SO com "reduzir movimento" ligado, o canvas fica vazio (sem animação).

---

### Task 5: `font-display` em headings + gradiente no hero

**Files:**
- Modify: `components/sections/section-heading.tsx`
- Modify: `components/sections/hero.tsx`

- [ ] **Step 1: `section-heading.tsx` — aplicar `font-display` no `<h2>`**

```tsx
export function SectionHeading({ index, label, title }: { index: string; label: string; title: string }) {
  return (
    <div className="mb-10">
      <p className="font-mono text-xs tracking-[0.2em] text-accent mb-2">
        № {index} — {label.toUpperCase()}
      </p>
      <h2 className="font-display text-3xl md:text-4xl tracking-tight text-foreground">{title}</h2>
    </div>
  )
}
```

- [ ] **Step 2: `hero.tsx` — `font-display` no `<h1>`, gradiente no destaque, glow novo**

Substituir o glow hardcoded e o `<h1>`:

```tsx
      <div className="pointer-events-none absolute -top-20 -right-20 h-80 w-80 rounded-full"
        style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)', opacity: 0.10 }} />
```

```tsx
          <h1 className="font-display text-4xl md:text-5xl tracking-tight text-foreground">{dict.hero.greeting}</h1>
```

(O restante do hero — bloco terminal, `dl` — permanece. Se `dict.hero.greeting` tiver um trecho a destacar com `.text-gradient`, aplicar via `<span className="text-gradient">` no texto correspondente; sem alterar dados/dicionário nesta fase.)

- [ ] **Step 3: Verificar build + lint**

Run: `npm run build && npm run lint`
Expected: OK. Visual: títulos em Fraunces; glow agora esmeralda.

---

### Task 6: Nav com estética terminal

**Files:**
- Modify: `components/nav.tsx`

- [ ] **Step 1: Aplicar estilo `[ label ]` mono aos links de seção**

Trocar o bloco de links (hrefs/i18n inalterados, só classe + envoltório visual):

```tsx
      <div className="hidden md:flex gap-5 font-mono text-xs text-muted">
        <Link href={`/${locale}#about`} className="hover:text-accent transition-colors">[ {dict.nav.about.toLowerCase()} ]</Link>
        <Link href={`/${locale}#experience`} className="hover:text-accent transition-colors">[ {dict.nav.experience.toLowerCase()} ]</Link>
        <Link href={`/${locale}#projects`} className="hover:text-accent transition-colors">[ {dict.nav.projects.toLowerCase()} ]</Link>
        <Link href={`/${locale}#blog`} className="hover:text-accent transition-colors">[ {dict.nav.blog.toLowerCase()} ]</Link>
        <Link href={`/${locale}#contact`} className="text-accent">[ {dict.nav.contact.toLowerCase()} ]</Link>
      </div>
```

> Nota: o dono pediu menus com primeira letra maiúscula. O estilo terminal `[ sobre ]` usa minúsculas por convenção de terminal. **Confirmar com o dono na revisão visual** se prefere `[ sobre ]` (terminal) ou `[ Sobre ]` (mantendo capitalização). Default deste plano: minúsculo terminal — fácil reverter trocando `.toLowerCase()` por `dict.nav.x` direto.

- [ ] **Step 2: Verificar build + lint**

Run: `npm run build && npm run lint`
Expected: OK.

---

### Task 7: Varredura visual + validação final

**Files:** nenhuma criação; ajustes pontuais conforme observação.

- [ ] **Step 1: Rodar dev e varrer todas as seções**

Run: `npm run dev`
Checar em dark e light (toggle): hero, about, experience, projects, skills, blog-preview, contact, /blog, /blog/[slug], /now, /uses. Verificar contraste do acento sobre bg (WCAG AA), legibilidade sobre o grão/constelação, títulos em Fraunces, labels/prompt em JetBrains Mono.

- [ ] **Step 2: Ajustes pontuais**

Se algum título de seção precisar de `font-display` adicional ou algum texto de baixo contraste, ajustar a classe naquele componente (sem mudar estrutura/conteúdo). Documentar no relatório o que mudou.

- [ ] **Step 3: Suite completa**

Run: `npm run build && npm run lint && npm test`
Expected: build Turbopack OK, lint limpo, 38 testes verdes.

---

### Task 8: Commit (aguardar aprovação do dono)

- [ ] **Step 1: Propor o commit ao dono e aguardar OK** (não rodar sem aprovação)

Mensagem sugerida:

```
feat: redesign visual "Terminal Editorial Dark"

Nova paleta dark-primária (esmeralda→ciano), Fraunces (display) +
JetBrains Mono (terminal), background de constelação reativo ao mouse
(respeita reduced-motion) e grão ~4%. Conteúdo, rotas, i18n, SEO e CV
inalterados.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
```

- [ ] **Step 2: Após OK, commitar** os arquivos das Tasks 1-7.

## 7. Como validar

- `npm run build` (Turbopack) verde; `npm run lint` limpo; `npm test` → 38 testes (36 antigos + 2 de `lib/bg/field`).
- Visual dark+light coerentes via toggle; contraste AA; Fraunces nos títulos; JetBrains Mono nos labels/prompt; acento esmeralda→ciano no hero.
- Constelação reage ao mouse; **desliga** sob `prefers-reduced-motion`; pausa com aba oculta; sem bloquear cliques (`pointer-events-none`, `-z-10`).
- Grão sutil visível de perto, não polui leitura.
- Sem regressão de SEO/rotas/i18n/CV (não tocados).

## 8. Fora de escopo

- Conteúdo real (projetos, uses, blog, foto) e a nova tagline — sessão separada.
- Publicação (push, repo remoto, arquivar repo antigo) — aguarda OK.
- Mudanças em dados, dictionaries, blog/MDX, CV PDF, rotas, i18n, lógica SEO.
- Lighthouse/CWV automatizado (sem Chrome no sandbox) — passo manual do dono.
- Decisão final capitalização vs estilo terminal do nav — confirmar na revisão (Task 6).
