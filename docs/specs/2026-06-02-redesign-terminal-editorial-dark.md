# Redesign — "Terminal Editorial Dark"

> Spec de redesign visual do caioweliton.dev. Substitui a direção "Warm Workshop" (terracotta/stone) por uma identidade dark editorial com acentos terminal e background reativo ao mouse. Conteúdo, rotas, i18n, SEO, blog e CV permanecem intactos.

Data: 2026-06-02 · Origem: `superpowers:brainstorming` (visual companion)

---

## 1. Entendimento

O dono não gostou do design atual ("Warm Workshop") em paleta, tipografia, layout e vibe geral, e pediu sugestões. Após brainstorm visual, a direção escolhida é **"Terminal Editorial Dark"**: base dark moderna (direção C), título serifado (direção A) e detalhes de terminal (direção B). É um **reskin** — a arquitetura de conteúdo, rotas e dados não muda. Prioridades originais seguem valendo: ser achável por RH (SEO/blog) e **não parecer template cuspido por IA** (craft artesanal).

Premissa: dark é o tema primário (`defaultTheme="dark"` já vigente); light continua existindo via toggle e precisa ficar coerente na nova paleta.

## 2. Investigação

Arquivos lidos e o que foi extraído:

- `app/globals.css` — tokens semânticos em `:root` (light) / `.dark` (dark) expostos via `@theme inline`; `@custom-variant dark`; regras de dual-theme p/ shiki (`[data-theme]`). **Consequência-chave:** componentes consomem tokens (`bg-background`, `text-accent`, `text-muted`…), então trocar os valores das CSS vars **propaga a nova paleta automaticamente** sem editar cada seção.
- `app/layout.tsx` — fontes via `next/font/google`: `Geist` (`--font-geist-sans`) e `Geist_Mono` (`--font-geist-mono`); `ThemeProvider attribute="class" defaultTheme="dark" enableSystem`; `suppressHydrationWarning`.
- `components/sections/hero.tsx` — já tem glow radial (amber hardcoded em rgba), bloco terminal `~/caio $ whoami`, índice `№ 00`, `dl` de metadados. Usa tokens + `font-mono`.
- `components/sections/section-heading.tsx` — padrão `№ {index} — LABEL` em mono + `<h2>` bold. Reusado por todas as seções.
- `components/nav.tsx` — links já corrigidos p/ âncoras `/${locale}#x`; logo `caio.`; toggles tema/locale.

Convenções a seguir: tokens semânticos (não cores fixas), `next/font` p/ fontes, `font-mono`/`font-sans` utilities, componentes de seção wrapped em `<Reveal>`.

## 3. Mudanças propostas

**`app/globals.css`** — reescrever valores dos tokens p/ nova paleta (dark primária + light coerente); adicionar var `--font-display`; mapear `--font-display` em `@theme inline`; adicionar utility `.text-gradient` (acento esmeralda→ciano via `background-clip:text`), var(s) de gradiente reutilizáveis e a classe da camada de **grão** (`feTurbulence` em data-URI, overlay). Manter estrutura dual-theme do shiki.
  - Dark: bg `#0a0a0f`, surface `#14141b`, foreground `#f5f5f7`, muted `#a1a1aa`, faint `#52525b`, border `#27272a`, accent `#34d399`, accent-strong `#22d3ee`, ok `#34d399`.
  - Light: bg `#fafafa`, surface `#f4f4f5`, foreground `#18181b`, muted `#52525b`, faint `#a1a1aa`, border `#e4e4e7`, accent `#0d9488`, accent-strong `#0891b2`, ok `#0d9488`.

**`app/layout.tsx`** — adicionar `Fraunces` (`--font-display`) e `JetBrains_Mono` (substitui `Geist_Mono` em `--font-geist-mono`, mantendo o nome da var p/ não quebrar consumidores); manter `Geist` no corpo. Incluir as novas vars no `className` do `<html>`. Montar `<InteractiveBackground />` (novo) e a camada de grão atrás do conteúdo.

**`components/interactive-bg.tsx`** (novo, client) — background reativo ao mouse, `position:fixed` atrás do conteúdo (`-z-10`, `pointer-events-none`). Efeito: **constelação sutil** — partículas flutuando devagar em canvas, linhas finas conectando partículas próximas entre si e linhas (mais visíveis) ligando partículas perto do cursor. Tom contido: baixa densidade, baixa opacidade, movimento lento (ver §4). Usa `requestAnimationFrame`; pausa quando a aba está oculta; **desliga sob `prefers-reduced-motion`**; cores derivadas do acento (esmeralda/ciano); não interfere em foco/contraste/leitura.

**`components/sections/section-heading.tsx`** — aplicar `font-display` no `<h2>`; manter o label mono.

**`components/sections/hero.tsx`** — `font-display` no `<h1>`; aplicar `.text-gradient` no trecho de destaque; trocar o rgba amber hardcoded do glow pela cor de acento nova; manter bloco terminal e `dl`.

**`components/nav.tsx`** — refinar p/ estética terminal `[ sobre ]` em mono (ajuste visual; hrefs e i18n inalterados).

**Demais `components/sections/*`** — sem edição estrutural; herdam a paleta via tokens. Ajustes pontuais de `font-display` em títulos só se necessário após preview.

## 4. Decisões de design (fechadas)

- **Direção:** Terminal Editorial Dark (fusão C base + A serif + B terminal). Dark primário, light secundário coerente.
- **Display = Fraunces** (serif variável). Escolhida sobre Instrument Serif (elegante porém peso único) e Newsreader (mais conservadora) por personalidade + escalabilidade.
- **Mono = JetBrains Mono** sobre Geist Mono — caráter terminal mais forte. Mantém a var `--font-geist-mono` p/ evitar refactor de consumidores.
- **Acento = esmeralda→ciano** (`#34d399→#22d3ee`). Escolhido sobre violeta→azul (clichê SaaS/IA), âmbar→rosa e fúcsia→índigo. Harmoniza com o verde de terminal/status já existente.
- **Anti-template:** serif display + mono terminal + gradiente contido (glows radiais, sem fundo arco-íris, sem glass/blur exagerado) + grão/assimetria.
- **Background = constelação sutil** (escolhido sobre grid+spotlight e mesh gradient via demo ao vivo). "Sutil" = baixa densidade de partículas, opacidade baixa, deriva lenta; realce só perto do cursor. Evita poluir leitura.
- **Grão ~4%** — ruído sutil via SVG `feTurbulence` em overlay (`mix-blend-mode:overlay`, opacidade ~0.04), estático, custo ~zero. Escolhido sobre 0% (chapado) e ~9% (poluído).
- **Reaproveitar tokens semânticos** em vez de reescrever cada componente — minimiza diff e risco.

## 5. Pontos de decisão (abertos)

Nenhum aberto. Todos resolvidos:
- **Corpo = Geist Sans:** ✅ confirmado (mantida).
- **Background = constelação sutil:** ✅ confirmado.
- **Grão/textura ~4%:** ✅ confirmado (ruído sutil via SVG `feTurbulence`, `mix-blend-mode:overlay`).

## 6. Ordem de implementação

1. **Tokens + fontes** (base): reescrever `globals.css` (paleta, `--font-display`, `.text-gradient`) + `app/layout.tsx` (Fraunces, JetBrains Mono). Dependência de tudo abaixo.
2. **Aplicar display/gradiente** em `section-heading.tsx` e `hero.tsx` (depende de 1). Paralelizável entre si.
3. **Nav terminal** (depende de 1). Paralelo a 2.
4. **InteractiveBackground** (depende de 1 p/ cor de acento; independente de 2-3). Montar em layout.
5. **Varredura visual** das demais seções no preview; ajustes pontuais de título/contraste (depende de 1-4).
6. **Validação** (ver §7).

## 7. Como validar

- `npm run build` (Turbopack) verde; `npm run lint` limpo; `vitest` 36 testes seguem passando (lógica intocada).
- Visual: dark e light coerentes (toggle), contraste WCAG AA em texto/acento (checar accent sobre bg nos dois temas).
- Headings em Fraunces; labels/prompt em JetBrains Mono; acento esmeralda→ciano no hero.
- Background reage ao mouse; **desliga** sob `prefers-reduced-motion`; sem regressão de performance perceptível (rAF/throttle) nem bloqueio de cliques.
- Sem regressão de SEO (metadata/JSON-LD/sitemap inalterados) nem de rotas/i18n/CV.

## 8. Fora de escopo

- **Conteúdo real** (projetos, uses, blog, foto) — sessão separada já planejada. Inclui repensar a tagline "back-ends que não quebram às 3 da manhã" (genérica).
- Publicação (`git push`, `gh repo create`, arquivar repo antigo) — aguarda OK explícito.
- Mudanças em dados, dictionaries, blog/MDX, CV PDF, rotas, i18n, lógica de SEO.
- Refino fino do efeito de background além do contrato (decidido em §5/implementação).
- Lighthouse/CWV automatizado (sem Chrome no sandbox) — passo manual do dono.
