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
