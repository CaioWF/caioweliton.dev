# Spec — Portfolio "Warm Workshop" (caioweliton.dev)

> Design doc gerado via `superpowers:brainstorming`. Formato: `spec-plan-format-8`.
> Data: 2026-06-01.

---

## 1. Entendimento

Reconstruir o site pessoal `caioweliton.dev` (hoje um CV estático em template Xiaoying Riley, em inglês, sem dados estruturados). Objetivo: virar um **hub de personal brand** — currículo + portfólio de projetos + blog técnico — otimizado para descoberta e com design autoral (não cara de "cuspido por IA").

Dois objetivos explícitos do dono:
- **Ser encontrado** (SEO/discoverabilidade — incluindo a realidade de como RH busca).
- **Design artesanal** — fugir do template dev-dark-neon-monospace genérico.

Assumções confirmadas no brainstorming: bilíngue PT/EN; deploy futuro em Coolify (Docker, não Vercel); blog em MDX no repositório; publicação ~1x/mês.

---

## 2. Investigação

- **Site atual (`https://www.caioweliton.dev`)** — analisado via fetch. Estrutura: header com foto/nome/contato → Career Summary → Work Experience → Skills grid → Education → Awards → Languages → Interests. Template "Xiaoying Riley" (atribuição no rodapé). Em inglês. Sem JSON-LD, OG fraco, seções internas não rankeiam.
- **Conteúdo reaproveitável extraído:** nome (Caio Queiroz / "Caio Weliton" como brand), título (Senior Software Engineer), 5 anos exp; experiências (Compass UOL 2022–atual Senior/SWE; Casa Magalhães 2020–2022 Junior/Intern); stack (Node.js, TypeScript, AWS [Lambda, API Gateway, SQS, CloudWatch, S3, EC2, RDS, Cognito, ECS, EKS], Docker, React, Vue, Redis, Datadog, New Relic); educação (Eng. Software UFC 2017–2020 Magna Cum Laude; pós Liderança Técnica FCTECH 2024–); awards (Hackathon winner, Ignite Node.js, Leadership Pathway); idiomas (PT nativo, EN intermediário); social (GitHub @caiowf, LinkedIn @caio-weliton, Medium @devDependencies); email contato.caioweliton@gmail.com; tel +55 (88) 99621-2524; Ceará/BR.
- **Repositório de código:** inexistente — projeto novo, scaffold do zero. Sem padrões pré-existentes a seguir além das preferências globais do dono (CLAUDE.md).

---

## 3. Mudanças propostas

Projeto novo em `/home/eunaocaio/caioweliton.dev`. **Next.js 16** (App Router, Turbopack default, React 19 + React Compiler) + TypeScript + Tailwind CSS v4. Estrutura proposta (caminhos relativos à raiz):

**App / rotas**
- `app/layout.tsx` — root layout: providers de tema (dark/light) e i18n (PT/EN), metadata base, fontes, `<html lang>` dinâmico.
- `app/[locale]/page.tsx` — landing (scroll único): monta Hero, About, Experience, Projects, Skills, Contact.
- `app/[locale]/blog/page.tsx` — lista de posts com filtro por tag.
- `app/[locale]/blog/[slug]/page.tsx` — post individual (render MDX). `generateStaticParams` + `generateMetadata` por post.
- `app/[locale]/now/page.tsx` — página Now (conteúdo MDX ou data file).
- `app/[locale]/uses/page.tsx` — página Uses (data file).
- `app/sitemap.ts`, `app/robots.ts` — gerados (substitui next-sitemap; nativo do App Router).
- `app/api/og/route.tsx` (ou `opengraph-image.tsx` por rota) — geração de OG image via `next/og` `ImageResponse`.
- `app/[locale]/cv/route.ts` — gera o CV em PDF via `@react-pdf/renderer`, lendo `data/*.ts`; layout ATS-friendly próprio. Um por idioma.
- `proxy.ts` — (Next 16 substitui `middleware.ts` por `proxy.ts`) detecta `Accept-Language` na rota raiz, redireciona para `/pt` ou `/en` (fallback PT).

**Seções (componentes)** em `components/sections/`
- `Hero.tsx` — direção "Warm Workshop": foto, headline conversacional ("Oi, eu sou o Caio."), bloco terminal `~/caio $` (motif de caráter, cursor piscando), grid de metadados editorial (LOCAL/EXP/STATUS/CV), numeração `№ 00`.
- `About.tsx` — bio, foto, stats com counter on-scroll, tags de interesse.
- `Experience.tsx` — timeline/tabs por empresa, bullets, stack por cargo, botão download CV (PDF).
- `Projects.tsx` — grid com filtro por stack, card destaque 2-col, hover sutil.
- `Skills.tsx` — 4 categorias (Back-end, Cloud/DevOps, Front-end, Liderança), tags (sem barras de %).
- `BlogPreview.tsx` — 3 posts recentes na landing.
- `Contact.tsx` — CTA mailto, links sociais, footer.

**Dados** em `data/`
- `experience.ts`, `projects.ts`, `skills.ts`, `uses.ts` — arrays tipados, bilíngues (campos `{ pt, en }` onde houver texto). Fonte única de verdade, fácil de manter.
- `projects.ts` — cada item: `title`, `type: 'pessoal' | 'profissional'`, `description: {pt, en}`, `stack: string[]`, `github?`, `live?`, `highlight?: boolean`. v1 com 3-4 placeholders.

**Conteúdo** em `content/`
- `content/blog/*.mdx` — posts com frontmatter (`title`, `date`, `tags`, `description`, `lang`).
- `content/now.*.mdx` — Now por idioma.

**i18n** em `i18n/`
- `dictionaries/pt.json`, `dictionaries/en.json` — strings de UI. Toggle PT/EN no nav; rota com prefixo `[locale]`.

**SEO / infra**
- `lib/seo.ts` — helpers de metadata + JSON-LD (`Person` no layout, `BlogPosting` por post), canonical, `hreflang` (alternates PT/EN).
- `lib/mdx.ts` — leitura/parse de MDX, cálculo de reading-time.
- CV PDF gerado on-demand pela rota `app/[locale]/cv/route.ts` (`@react-pdf/renderer`) — não há PDF estático em `public/`.
- `Dockerfile` + `next.config.ts` com `output: 'standalone'` — build para Coolify.
- `.gitignore`, `README.md`.

**Design tokens** em `app/globals.css` (Tailwind v4 `@theme`)
- Paleta **Terracotta & Stone**: `--bg #1c1917`, `--bg-elev #0c0a09`, acento `--accent #d97706`, `--accent-deep #c2410c`, highlight `--highlight #fed7aa`, status-ok `#86efac`, texto `#fafaf9 / #a8a29e / #57534e`. Versão light por inversão (creme/tinta).

---

## 4. Decisões de design

- **Direção visual "Warm Workshop"** (fusão escolhida): base warm dark + organização editorial (numeração de seções, fios, grid de metadados, hierarquia tipográfica) + motif de terminal refinado (mono só no bloco `~/caio $` e em labels, não em tudo). Descartado: dark+neon+roxo-gradiente — é o template mais gerado-por-IA que existe e briga com o objetivo artesanal.
- **Paleta Terracotta & Stone.** Descartadas Oxblood, Forest, Ink&Ochre por preferência do dono. Acento só em detalhe/CTA; nunca em corpo de texto.
- **Navegação híbrida.** Landing scroll (Hero/About/Experience/Projects/Skills/Contact) + rotas próprias (`/blog`, `/blog/[slug]`, `/now`, `/uses`). Razão: home rankeia para o nome; blog/now/uses são as superfícies de SEO indexáveis individualmente.
- **Bilíngue com `hreflang`.** Prefixo de rota `[locale]`. RH-BR busca PT, remoto-internacional busca EN. `hreflang` evita penalização por conteúdo duplicado.
- **Blog em MDX no repo** (não Medium, não CMS headless). Publicação 1x/mês não justifica CMS. Se cross-postar, **canonical aponta para caioweliton.dev** (o Medium vira cópia aos olhos do Google).
- **Skills sem barra de %.** "90% Node.js" é arbitrário e datado; tags são honestas.
- **Contato via `mailto`, sem formulário.** Zero backend/spam. Resend fica como evolução opcional.
- **`next/og` para OG images + `app/sitemap.ts`/`robots.ts` nativos** em vez de `next-sitemap` — menos dependência, roda no Coolify.
- **Framer Motion com parcimônia.** Animar entrada de seções e micro-interações, não tudo. Core Web Vitals é fator de ranking; `prefers-reduced-motion` respeitado. React Compiler (Next 16) reduz necessidade de memoização manual.
- **Next.js 16 (greenfield).** As breaking changes da v16 (Turbopack default, `proxy.ts`, caching explícito `use cache`) são risco de *migração* — não se aplicam a projeto novo. Ganhos: Turbopack estável, React 19 + React Compiler, Cache Components. Versão LTS, production-ready (16.2.4, abr/2026).

### Decisões confirmadas com o dono

- **Nome de marca: "Caio Weliton"** (= domínio, = handles). Padroniza h1, `<title>`, JSON-LD, OG.
- **Projetos: uma seção única, cards etiquetados por tipo** (`pessoal` / `profissional`). Pessoal → GitHub + live + stack; Profissional → impacto/papel, sem repo, descrição que respeita NDA (sem cliente/dado interno). Filtro ganha `todos / pessoais / profissionais` além do filtro por stack. Conteúdo entra depois (sessão dedicada); plano cria 3-4 **placeholders** estruturados.
- **Foto: placeholder "CW"** (círculo gradiente terracota) na v1, mas componente pronto pra foto real (`next/image`, espera `public/caio.jpg`, fallback automático pras iniciais). Trocar = só adicionar o arquivo.
- **Rota raiz: middleware detecta `Accept-Language`, fallback PT.** Redirect não atrapalha indexação (sitemap + hreflang alcançam `/pt` e `/en`).
- **CV PDF: `@react-pdf/renderer`** (texto real ATS, sem Chromium na imagem Docker). Rota lê o mesmo `data/*.ts` → conteúdo sincroniza automático. Nuance: o *visual* do PDF é template próprio (layout ATS limpo), separado da pele do site — proposital. Puppeteer descartado (pesa a imagem, ATS ignora visual).
- **Repositório: repo novo `caioweliton.dev`, público**, no GitHub do dono (`CaioWF`). Diretório local `/home/eunaocaio/caioweliton.dev`. O repo antigo (`CaioWF/my-professional-profile`) será arquivado pelo dono após o novo entrar no ar — não mexer nele. Criação do remoto (`gh repo create`) só sob comando explícito (ação externa).

---

## 5. Pontos de decisão

Todos resolvidos no brainstorming (ver §4 → "Decisões confirmadas com o dono"). **Nenhum aberto.**

---

## 6. Ordem de implementação

1. **Scaffold + tokens** — Next.js 15 + TS + Tailwind v4; `globals.css` com paleta Terracotta; fontes; tema dark/light; `output: standalone` + Dockerfile. *(base, bloqueia tudo)*
2. **i18n** — estrutura `[locale]`, dicionários PT/EN, toggle, `hreflang`. *(bloqueia páginas)*
3. **Camada de dados** — `data/*.ts` tipados e bilíngues com o conteúdo extraído. *(paralelo a 4)*
4. **SEO core** — `lib/seo.ts` (metadata, JSON-LD Person, canonical, alternates), `sitemap.ts`, `robots.ts`, OG image. *(paralelo a 3)*
5. **Landing** — Hero → About → Experience → Projects → Skills → Contact (consomem `data/`). *(depende de 1,2,3)*
6. **Blog** — `lib/mdx.ts`, lista, `[slug]`, `BlogPosting` JSON-LD, reading-time, 1 post seed. *(depende de 1,2)*
7. **Now + Uses** — páginas + `data/uses.ts` + `content/now`. *(depende de 1,2)*
8. **CV PDF** — gerar/colocar PDFs ATS-friendly + wire do botão download. *(depende de 3)*
9. **Polish** — animações Framer (parcimônia), `prefers-reduced-motion`, responsivo/mobile, Lighthouse/CWV, alt texts. *(depende de 5,6,7)*

---

## 7. Como validar

- **Build/lint:** `next build` limpo (inclui checagem de tipos), `eslint` sem erros.
- **SEO:** validar JSON-LD no Rich Results Test; `sitemap.xml` e `robots.txt` servidos; `hreflang` presente nos `<head>` PT/EN; canonical correto; OG image renderiza no preview (LinkedIn Post Inspector).
- **Performance:** Lighthouse mobile ≥ 90 em Performance/SEO/Best Practices/Accessibility; CWV (LCP/CLS/INP) verdes.
- **Acessibilidade:** contraste WCAG AA na paleta; navegação por teclado; `prefers-reduced-motion` desliga animações.
- **i18n:** toggle PT/EN troca conteúdo e `lang`; rota raiz redireciona conforme `Accept-Language`.
- **Funcional:** filtros de projeto/blog funcionam; download do CV baixa o PDF certo por idioma; mailto abre; tabs de experiência trocam.
- **Docker/Coolify:** `docker build` gera imagem standalone; container sobe e serve localmente antes do deploy.

---

## 8. Fora de escopo

- Deploy efetivo no Coolify (dono faz "posteriormente"). Entregamos Dockerfile pronto.
- Formulário de contato com backend (Resend) — evolução futura; v1 usa mailto.
- CMS headless / editor visual de blog — MDX no repo basta para 1x/mês.
- Migração automática dos posts existentes do Medium — manual, post a post, se/quando o dono quiser.
- Analytics (Plausible/GA) — não pedido; pode entrar depois.
- Comentários no blog, newsletter, RSS feed — não pedidos (RSS pode ser adição barata futura).
- Dark/light como decisão de produto: implementamos toggle, mas não exploramos variações de tema além do par Terracotta dark/light.
