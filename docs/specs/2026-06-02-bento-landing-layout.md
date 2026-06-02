# Bento Landing Layout — Design Spec

> Reorganiza a disposição da landing (`/[locale]`) numa composição **bento** (tiles modulares de tamanhos variados), mantendo o sistema visual "Terminal Editorial Dark". Conteúdo/copy real fica para a fase seguinte; aqui é só estrutura/layout.

Data: 2026-06-02 · Origem: `superpowers:brainstorming` (visual companion)

---

## 1. Entendimento

Após o redesign visual, o dono quer "refazer a disposição das seções, algo mais agradável visualmente". Escolheu (entre Editorial / Bento / Vertical) a direção **Bento/modular**: hero full-width no topo, seguido de um grid de tiles em tamanhos assimétricos. Esta fase troca **layout/composição**, reaproveitando a copy atual como placeholder. Tiles extras confirmados: stack/skills, stats, /now snippet, links/sociais. Hero permanece **full-width** (não vira tile).

Premissa: lógica interativa existente (tabs de experiência, filtro de projetos) é preservada; só muda o invólucro visual. Anchors do nav (`#about`, `#experience`, `#projects`, `#blog`, `#contact`) precisam continuar funcionando.

## 2. Investigação

Lido:

- `app/[locale]/page.tsx` — compõe a landing: `Hero → About → Experience → Projects → Skills → BlogPreview → Contact`, cada um full-bleed.
- `components/sections/section-heading.tsx` — padrão `№ {index} — LABEL` (mono) + `<h2 font-display>`. Usado por about/experience/projects/skills/blog-preview. Após o bento, deixa de ser usado na landing (tiles terão header próprio mais compacto) → candidato a remoção.
- `components/sections/about.tsx` — copy `pt/en` inline (3 parágrafos) + `TAGS`. Server component.
- `components/sections/experience.tsx` — **client** (`useState` tabs por empresa), lê `data/experience`.
- `components/sections/projects.tsx` — **client** (`useState` filtro tipo), lê `data/projects` + `filterProjects`; cards em `grid md:grid-cols-3`, `highlight` ocupa 2 colunas.
- `components/sections/skills.tsx` — lê `data/skills` (4 categorias com `icon`, `label{pt,en}`, `items[]`); cards `bg-surface`.
- `components/sections/blog-preview.tsx` — lê `getAllPosts` (3 recentes) + link "ver todos"; tem `id="blog"`.
- `components/sections/contact.tsx` — CTA centralizado + sociais + links now/uses/blog + ©. **Glow âmbar hardcoded** (`rgba(217,119,6,…)`) — resíduo da paleta antiga, precisa virar `var(--accent)`.
- `data/site.ts` (yearsExperience, location, email, socials, summary), `data/now.ts` (working/studying/reading/offwork + updated).

Convenções: tokens semânticos, `<Reveal>` nas seções, `bg-surface` p/ cards, mono p/ labels, `font-display` p/ títulos.

## 3. Mudanças propostas

**Criar `components/bento/tile.tsx`** — primitivo de tile. Contrato: `Tile({ label?, title?, href?, id?, span?, featured?, children })` → `<section>`/`<div>` com `bg-surface`, `border border-border`, `rounded-xl`, padding consistente; header opcional com label mono `// {label}` (+ `title` serif `font-display` se houver); `featured` realça borda (`border-accent/40`); `span` aplica classes de grid (ex. col/row span); `id` p/ anchor; se `href`, o tile inteiro é link com hover. Wrap em `<Reveal>`. Mantém legibilidade sobre a constelação (surface opaco).

**Criar `components/sections/stats.tsx`** (tile novo) — lê `data/site`: anos de experiência, localização, link do CV (`/${locale}/cv`). Server component. Tile compacto.

**Criar `components/sections/now-snippet.tsx`** (tile novo) — lê `data/now` (resumo do `working[locale]`) + link p/ `/${locale}/now`. Server component.

**Criar `components/sections/links.tsx`** (tile novo) — lê `site.socials` (GitHub/LinkedIn/Medium). Server component.

**Modificar `components/sections/about.tsx`** — renderizar como `Tile` (label `// sobre`, `id="about"`), conteúdo: parágrafos + TAGS. Remover `SectionHeading` full.

**Modificar `components/sections/experience.tsx`** — envolver em `Tile` (`// experiência`, `id="experience"`, full-width/`span` largo). Preserva tabs/`useState`/dados.

**Modificar `components/sections/projects.tsx`** — `Tile` (`// projetos`, `id="projects"`). Layout bento interno: 1 card destaque (`highlight`) maior + demais menores. Mantém filtro `useState` (compacto). Preserva `filterProjects`.

**Modificar `components/sections/skills.tsx`** — `Tile` (`// stack`), categorias em chips compactos. Pode ocupar largura média no grid.

**Modificar `components/sections/blog-preview.tsx`** — `Tile` (`// escritos recentes`, `id="blog"`), lista de posts + "ver todos". Mantém `getAllPosts` e retorno `null` se 0 posts (cuidado: se null, o anchor `#blog` some — ver §5).

**Modificar `components/sections/contact.tsx`** — manter como banda full-width (não-tile) de fechamento; **trocar glow âmbar por `var(--accent)`**; manter CTA, sociais, links, ©.

**Modificar `app/[locale]/page.tsx`** — nova composição:
1. `<Hero/>` full-width (inalterado nesta fase).
2. `<section>` container `max-w-5xl mx-auto px-6` com grid bento (gap consistente, `grid-cols-1 md:grid-cols-6` ou similar; tiles usam `span`):
   - Banda 1: About (largo, ex. col-span-4) + Stats (col-span-2)
   - Banda 2: Skills/Stack + NowSnippet + Links (3 tiles, ~col-span-2 cada)
   - Banda 3: Experience (full, col-span-6)
   - Banda 4: Projects (full, col-span-6; bento interno destaque+menores)
   - Banda 5: BlogPreview (largo)
3. `<Contact/>` full-width.

**Remover `components/sections/section-heading.tsx`** se ficar sem uso após o refactor (confirmar via grep na implementação).

## 4. Decisões de design (fechadas)

- **Direção Bento** (sobre Editorial e Vertical) — escolha do dono via wireframe + comparação lado a lado.
- **Hero full-width** no topo (não tile) — mais impacto; bento começa abaixo.
- **Tiles extras:** stack, stats, /now snippet, links — todos confirmados.
- **Primitivo `Tile` único** reutilizável em vez de estilizar cada seção à mão — DRY, consistência, header mono+serif padronizado.
- **Assimetria proposital** nos spans (tiles de tamanhos diferentes) p/ fugir do "bento template" genérico.
- **Tiles `bg-surface` opacos** garantem leitura sobre a constelação/grão; os vãos do grid deixam o fundo animado aparecer.
- **Contact segue banda full-width** (não tile) — fechamento forte, e já tinha glow próprio (agora corrigido p/ acento).

## 5. Pontos de decisão (abertos)

- **Skills completo vs "stack" resumido:** o tile pode mostrar as 4 categorias (mais alto) ou só um resumo de chips (mais compacto, condizente com bento). Recomendo **resumido** no tile da landing; categorias completas podem viver numa página futura. Confirma?
- **BlogPreview = null sem posts:** hoje retorna `null` se 0 posts, o que sumiria o anchor `#blog`. Há 1 seed por locale, então não dispara agora. Recomendo manter o comportamento (tile some se vazio) — aceitável. Ok?
- **Grão sobre tiles:** a camada `.grain` é `fixed` sobre tudo (inclusive tiles). Mantém leve (~4%); se incomodar sobre surface, reduzir. Recomendo manter. Ok?

## 6. Ordem de implementação

1. **`Tile` primitivo** (base de tudo). Depois dele, o resto.
2. **Tiles novos** (Stats, NowSnippet, Links) — paralelizáveis entre si; dependem de 1.
3. **Refactor das seções** (about, experience, projects, skills, blog-preview) p/ usar `Tile` — dependem de 1; paralelizáveis entre si.
4. **Contact** — fix glow + manter layout (independente; pode ir junto de 3).
5. **`page.tsx`** — nova composição do grid bento (depende de 1-4).
6. **Limpeza:** remover `SectionHeading` se sem uso; varredura visual; validação.

## 7. Como validar

- `npm run build` (Turbopack) verde; `npm run lint` limpo; `npm test` → 43 testes seguem passando (lógica intocada).
- Visual: grid bento responsivo (1 coluna no mobile, multi-coluna no desktop); tiles legíveis sobre a constelação nos dois temas; anchors do nav (`#about/#experience/#projects/#blog/#contact`) rolam pro tile certo.
- Experiência (tabs) e projetos (filtro) seguem funcionais.
- Contact glow usa acento (sem âmbar); contraste AA.
- Sem regressão de SEO/rotas/i18n/CV.

## 8. Fora de escopo

- **Copy/conteúdo real** (hero headline de cargo + gradiente, tagline "3 da manhã", projetos reais, foto, blog, textos das seções) — **próxima fase**. Aqui usa-se a copy atual como placeholder.
- Páginas `/now`, `/uses`, `/blog`, `/blog/[slug]` — layout inalterado (só a landing muda).
- Hero: estrutura mantida; redesenho de copy/headline fica p/ fase de conteúdo.
- Publicação (push/remoto) — aguarda OK.
- Mudanças em dados, dictionaries, CV, lógica de SEO.
