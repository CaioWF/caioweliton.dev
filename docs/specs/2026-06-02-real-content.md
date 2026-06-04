# Conteúdo Real — Design Spec

> Substitui placeholders e copy provisória por conteúdo real, a partir das fontes de verdade do dono (PDF do LinkedIn, site antigo, GitHub `@caiowf`, docs do iBolão). Só texto/dados — layout e sistema visual já prontos. Foto e blog ficam para depois.

Data: 2026-06-02 · Origem: `superpowers:brainstorming`

---

## 1. Entendimento

O dono pediu para focar em **conteúdo textual** real agora (foto e blog por último). Levantei as fontes de verdade e vou preencher hero/about/experiência/projetos/skills/now/uses + dados de CV (educação/idiomas/prêmios), adicionar uma seção de **Publicações** (3 papers acadêmicos), e ajustar `site.ts`. Tom da tagline = "impacto/prova" (escolhido). Projetos = iBolão (pessoal, destaque) + 2 cases profissionais NDA-safe.

## 2. Investigação

Fontes:
- **PDF LinkedIn** (`Profile (1).pdf`) — headline, summary, experiência com datas exatas, formação, certs, idiomas (EN = **Professional Working**), top skills, localização **Quixadá, Ceará**, 3 **publicações**.
- **Site antigo** (caioweliton.dev) — bullets de experiência, stack detalhada AWS, prêmios.
- **GitHub `@caiowf`** — repos majoritariamente bootcamp; sem carro-chefe → não usar como destaque.
- **`ibolao-docs/RESUMO_PROJETO.md`** — iBolão: SaaS bolão Copa 2026, NestJS+Prisma+Postgres / React+Vite+TS, Clerk, InfinitePay (Pix), Resend, cron ranking, LGPD, CI. Live `ibolao.cqlabs.com.br`.
- **Data files atuais** lidos: `site.ts`, `now.ts`, `skills.ts`, `projects.ts`, `education.ts`, `languages.ts`, `awards.ts`, `uses.ts`, dictionaries, `about.tsx`.

Convenção: copy bilíngue `{pt,en}` em `data/*` e dictionaries; tiles consomem data; PT é fonte, EN espelhado.

## 3. Mudanças propostas

### `lib/i18n/dictionaries/{pt,en}.json` — hero.tagline
- PT: "Modernizo sistemas legados e construo back-ends que aguentam carga real — Node.js, AWS e Clean Architecture."
- EN: "I modernize legacy systems and build back-ends that handle real load — Node.js, AWS and Clean Architecture."
- (greeting/ctas/status inalterados.)

### `data/site.ts`
- `location`: PT "Quixadá, Ceará" · EN "Quixadá, Ceará, Brazil".
- `yearsExperience`: **5** (renderiza "5+"). [resolvido §5]
- `summary` (usado no CV): PT "Engenheiro de software sênior com 5+ anos em back-end, cloud e arquitetura. Node.js, TypeScript e AWS; foco em sistemas de alta concorrência, modernização de legado e liderança técnica." · EN espelhado.
- `role` mantém "Engenheiro de Software Sênior" / "Senior Software Engineer".

### `components/sections/about.tsx` — copy (3 parágrafos)
- PT:
  1. "Engenheiro de software de Quixadá, Ceará. Sênior na Compass UOL, com 5+ anos construindo back-ends em Node.js, TypeScript e AWS — de APIs e microserviços a sistemas de alta concorrência."
  2. "Meus últimos projetos foram modernizações de legado: reescrever sistemas críticos em stacks novas sem perder o que já rodava. No último, garanti integridade de estoque sob 20 mil requisições em 15 minutos."
  3. "Pós em liderança técnica (Full Cycle) porque código é metade do trabalho — a outra é fazer o time crescer junto. Fora do terminal: cozinha, caminhada e games."
- EN espelhado.
- `TAGS` agora **bilíngue** `{pt,en}[]`: Clean Architecture / Clean Architecture · AWS / AWS · Alta Concorrência / High Concurrency · Microserviços / Microservices · Liderança Técnica / Technical Leadership. (about.tsx passa a selecionar `tag[locale]`.)

### `data/experience.ts`
Dois empregadores, com progressão e datas exatas:
- **Compass UOL** — role PT "Desenvolvedor de Software Sênior" / EN "Senior Software Developer"; period "jan 2022 — presente" / "Jan 2022 — Present"; bullets: APIs REST e microserviços dockerizados; AWS cloud-native (Lambda, ECS/EKS, SQS, S3, RDS); modernização de legado para alta concorrência (20k+ req/15min, integridade de estoque concorrente); cache com Redis; mentoria de devs juniores. stack: Node.js, TypeScript, NestJS, AWS, Docker, Redis, Datadog.
- **Grupo Casa Magalhães** — role PT "Desenvolvedor de Software Júnior" / EN "Junior Software Developer"; period "mar 2020 — jan 2022" / "Mar 2020 — Jan 2022"; bullets: full-stack Node.js + Vue.js; serviços REST integrados a AWS; documentação e testes; colaboração cross-functional. stack: Node.js, Vue.js, AWS (Lambda, DynamoDB, API Gateway, S3), SQL.

### `data/projects.ts` — 3 reais
1. **iBolão** — slug `ibolao`, type `pessoal`, `highlight: true`, live `https://ibolao.cqlabs.com.br`. desc PT "SaaS de bolão da Copa 2026: cria bolão em segundos, convite por link, ranking ao vivo e upgrade via Pix. Auth, e-mails transacionais e LGPD completos." stack `['NestJS','Prisma','PostgreSQL','React','TypeScript','Clerk']`. (sem github — privado.)
2. **Plataforma de alta concorrência** — slug `high-concurrency-platform`, type `profissional`, `highlight: true`. desc PT "Modernização de sistema legado para suportar 20 mil requisições em 15 minutos, com ~2 mil operações de estoque concorrentes — sem overselling e respeitando limites." stack `['NestJS','Node.js','React','AWS','PostgreSQL']`. (sem link.)
3. **Plataforma de EAD** — slug `ead-platform`, type `profissional`. desc PT "Reescrita de plataforma de ensino a distância: gestão de cursos e portal do aluno com aulas e provas, migrada para stack moderna Node/NestJS + React." stack `['NestJS','Node.js','React','TypeScript']`. (sem link.)
- EN espelhado em todas.

### `data/skills.ts` — alinhar às top skills
Manter 4 categorias, refinar:
- Back-end: Node.js, TypeScript, NestJS, Microserviços, REST APIs, Redis, SQL
- Cloud & Plataforma: AWS (Lambda, ECS/EKS, SQS, S3, RDS, Cognito), Docker, CI/CD, DevOps/SRE, Datadog
- Arquitetura & Dados: Clean Architecture, Design de Soluções, Modelagem de BD, Prisma, PostgreSQL
- Liderança & Processo: Mentoring, Code Review, Liderança Técnica, Agile, AI aplicada a dev

### `data/now.ts` — atualizar
`updated` "2026-06". working: PT "Senior SWE na Compass UOL — modernização de sistemas legados e back-ends de alta concorrência. Tocando o iBolão (SaaS de bolão da Copa) no estúdio CQ Labs." studying: AWS Solutions Architect, Clean Architecture, AI aplicada a dev. reading/offwork: manter.

### `data/languages.ts` — corrigir EN
Inglês level: PT "Profissional" / EN "Professional Working". (era "Intermediário".)

### `data/awards.ts` — completar certs
Lista: Magna Cum Laude — UFC; AWS Partner: Technical Accreditation; AWS Partner: Cloud Economics Accreditation; Leadership Pathway; Lifelong Learning; Ignite Node.js (Rocketseat); Hackathon Winner — solução AWS.

### `data/education.ts` — ajustar provider
Full Cycle (era "FCTECH"): "Full Cycle" como `school`; período "2024 — 2025"; Pós Liderança Técnica. UFC inalterado.

### `data/publications.ts` (novo) + `components/sections/publications.tsx` (novo tile) + montar em `page.tsx`
- `data/publications.ts`: array de `{ title: string; venue?: string; url?: string }` com os 3 papers:
  1. "Mineração de Texto: Uma Análise de Sentimentos em Comentários de Notícias no Facebook"
  2. "Uma Proposta de Utilização de Aplicações Serverless no Contexto de eHealth"
  3. "Sistemas colaborativos, definições e características"
- Tile `Publications` (label `// publicações` / `// publications`, título "Publicações"/"Publications"), lista os títulos. Entra no grid bento (col-span largo; posição a definir — provavelmente perto de educação/após blog).

### `data/uses.ts` — remover bloco Hardware
Remover a categoria "Hardware" (placeholder "— preencher —") por ora; manter Editor & Terminal + Ferramentas.

### CV PDF
`lib/cv/model.ts` já consome `site`, `education`, `languages`, `awards` — as mudanças de dados propagam ao PDF automaticamente. **Adicionar Publicações ao PDF:** incluir `publications` no `CvModel`/`buildCvModel`, renderizar nova seção em `lib/cv/cv-document.tsx` com título localizado em `LABELS` ("Publicações"/"Publications"). Posição: após Formação/Certificações.

## 4. Decisões de design (fechadas)

- **Tagline = "impacto/prova"** (modernização + carga real) — escolha do dono sobre posicionamento limpo e personalidade.
- **Projetos = iBolão + 2 cases profissionais**; GitHub bootcamp fora (enfraquece perfil sênior). Cases descritos NDA-safe, sem nome de cliente.
- **Publicações = tile próprio** (cred. acadêmica p/ RH) — escolha do dono.
- **Inglês = Professional Working** (corrige "intermediário", conforme LinkedIn).
- **2 empregadores na experiência** (progressão dentro de cada) em vez de 4 entradas — mais limpo nas tabs; o detalhe fino fica no LinkedIn.
- **iBolão sem link de GitHub** (repos privados); só live.

## 5. Pontos de decisão (abertos)

- ✅ **Métricas dos cases:** liberadas (dono revisa antes do commit).
- ✅ **Anos de experiência:** "5+" (yearsExperience=5).
- ✅ **Hardware do /uses:** bloco removido por ora.
- ✅ **Atribuição dos cases:** ambos na Compass. Cases ficam em Projetos sem nomear cliente (clientes da Compass — NDA); bullet da Compass cobre "modernização de legado p/ alta concorrência" genericamente. Casa Magalhães = full-stack geral.
- ✅ **TAGS do about:** bilíngues `{pt,en}[]`, traduzindo o que tem tradução.
- ✅ **Publicações no CV PDF:** incluídas (seção própria no PDF).

Nenhum ponto aberto restante.

## 6. Ordem de implementação

1. **Data files** (sem dependência de UI): `site.ts`, `experience.ts`, `projects.ts`, `skills.ts`, `now.ts`, `languages.ts`, `awards.ts`, `education.ts`, `publications.ts` (novo). Paralelizáveis.
2. **Dictionaries** (hero.tagline) + **about.tsx** copy.
3. **Publications tile** (`components/sections/publications.tsx`) + montar no grid `page.tsx`.
4. **Validação** (build/lint/testes + CV PDF abre certo).

## 7. Como validar

- `npm run build` verde; `npm run lint` limpo; `npm test` (43) seguem passando — checar se algum teste fixa valores antigos (ex: location, EN level) e atualizar junto.
- Visual: hero com nova tagline; about com bio real; projetos = iBolão+2 cases; tile de Publicações no grid; /now atualizado; nada de placeholder.
- CV PDF (`/pt/cv`, `/en/cv`) abre com summary/educação/idiomas/prêmios novos.
- Sem regressão de layout/SEO/i18n.

## 8. Fora de escopo

- **Foto real** (`public/caio.jpg` + trocar Avatar p/ next/image) — próxima rodada.
- **Posts de blog reais** — próxima rodada (o dono vai migrar conteúdo).
- **/uses Hardware** se o dono não passar agora (fica como pendência).
- Mudanças de layout/visual, rotas, lógica de SEO.
- Publicação (push/remoto) — aguarda OK.
