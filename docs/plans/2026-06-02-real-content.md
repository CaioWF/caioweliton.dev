# Conteúdo Real — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) ou superpowers:executing-plans. Steps usam checkbox (`- [ ]`).
>
> **Commits:** NÃO commitar por tarefa. Subagentes só implementam/testam/reportam. Commit único no fim, com aprovação do dono. O dono vai revisar a copy antes do commit.

**Goal:** Substituir placeholders/copy provisória por conteúdo real (hero/about/experiência/projetos/skills/now/uses + dados de CV), adicionar seção de Publicações no site e no PDF.

**Architecture:** Quase tudo é edição de `data/*.ts` (consumidos por tiles e pelo CV) + dictionaries + about.tsx. Um data file novo (`publications.ts`), um tile novo (`Publications`) montado no grid, e a seção Publicações no CV PDF.

**Tech Stack:** Next 16, Tailwind v4, @react-pdf/renderer, TypeScript, Vitest.

---

## 1. Entendimento

Implementar a spec `docs/specs/2026-06-02-real-content.md` (aprovada; §5 resolvido). Só conteúdo textual/dados — layout pronto. Decisões: tagline impacto/prova; 5+ anos; Quixadá; EN Professional Working; projetos = iBolão (destaque) + 2 cases Compass NDA-safe; publicações tile + CV; TAGS bilíngues; Hardware fora; certs completos.

## 2. Investigação

- `data/experience.ts` — type `Job { company, role{pt,en}, period{pt,en}, bullets{pt,en}[], stack[] }`. 2 entradas.
- `data/projects.ts` — type `Project { slug, title, type:'pessoal'|'profissional', description{pt,en}, stack[], github?, live?, highlight? }`.
- `data/{site,now,skills,education,languages,awards,uses}.ts` — estruturas lidas (ver spec §2).
- `lib/cv/model.ts` — `CvModel` + `buildCvModel(locale)` mapeia site/experience/skills/education/languages/awards. Sem publications ainda.
- `lib/cv/cv-document.tsx` — `LABELS` por locale, seções Experiência/Competências/Formação/Idiomas/Certificações. Adicionar Publicações.
- `components/sections/about.tsx` — `TAGS` array PT-only inline; copy `{pt,en}` inline.
- `lib/i18n/dictionaries/{pt,en}.json` — `hero.tagline`.
- `app/[locale]/page.tsx` — grid bento; montar tile Publications.
- Testes (`npm test`): `dictionaries.test.ts` checa `nav.about` + `hero.greeting` (não tagline) → não quebra. Nenhum teste fixa site/languages/etc.

## 3. Mudanças propostas (mapa)

| Arquivo | Ação |
|---|---|
| `data/site.ts` | location Quixadá, yearsExperience 5, summary novo |
| `data/experience.ts` | bullets reais (Compass alta concorrência; Casa full-stack), períodos exatos |
| `data/projects.ts` | iBolão + 2 cases |
| `data/skills.ts` | refinar categorias/itens |
| `data/now.ts` | atualizar working/studying |
| `data/languages.ts` | EN → Professional Working |
| `data/awards.ts` | certs completos |
| `data/education.ts` | Full Cycle |
| `data/uses.ts` | remover Hardware |
| `data/publications.ts` | **novo** |
| `lib/i18n/dictionaries/{pt,en}.json` | hero.tagline |
| `components/sections/about.tsx` | copy + TAGS bilíngues |
| `components/sections/publications.tsx` | **novo** tile |
| `app/[locale]/page.tsx` | montar Publications |
| `lib/cv/model.ts` | + publications no CvModel |
| `lib/cv/cv-document.tsx` | + seção Publicações + LABELS |

## 4. Decisões de design

Herdadas da spec. Implementação:
- `data/publications.ts` com `{ title: string; venue?: string; url?: string }[]` — títulos de papers **não traduzidos** (PT), por isso `title` string única (não `{pt,en}`).
- Tile Publications usa o primitivo `Tile` existente; sem `id` de nav (não há item de menu p/ publicações).
- CV: publicações entram como lista simples após Certificações.

## 5. Pontos de decisão

Nenhum aberto (spec §5 todo resolvido). Dono revisa a copy renderizada antes do commit.

## 6. Ordem de implementação (tarefas)

Dep: T1-T5 paralelos (data) → T6 (about) → T7 (tile+page) → T8 (CV) → T9 validação → T10 commit.

---

### Task 1: `data/site.ts`, `languages.ts`, `awards.ts`, `education.ts`

**Files:** Modify os 4.

- [ ] **Step 1: `data/site.ts`** — trocar `location`, `yearsExperience`, `summary`:

```ts
export const site = {
  name: 'Caio Weliton',
  role: { pt: 'Engenheiro de Software Sênior', en: 'Senior Software Engineer' },
  summary: {
    pt: 'Engenheiro de software sênior com 5+ anos em back-end, cloud e arquitetura. Node.js, TypeScript e AWS, com foco em sistemas de alta concorrência, modernização de legado e liderança técnica.',
    en: 'Senior software engineer with 5+ years in back-end, cloud and architecture. Node.js, TypeScript and AWS, focused on high-concurrency systems, legacy modernization and technical leadership.',
  },
  email: 'contato.caioweliton@gmail.com',
  location: { pt: 'Quixadá, Ceará', en: 'Quixadá, Ceará, Brazil' },
  yearsExperience: 5,
  available: true,
  socials: {
    github: 'https://github.com/caiowf',
    linkedin: 'https://www.linkedin.com/in/caio-weliton',
    medium: 'https://medium.com/@devDependencies',
  },
} as const
```

- [ ] **Step 2: `data/languages.ts`** — Inglês para Profissional/Professional Working:

```ts
export type Language = { name: { pt: string; en: string }; level: { pt: string; en: string } }

export const languages: Language[] = [
  { name: { pt: 'Português', en: 'Portuguese' }, level: { pt: 'Nativo', en: 'Native' } },
  { name: { pt: 'Inglês', en: 'English' }, level: { pt: 'Profissional', en: 'Professional Working' } },
]
```

- [ ] **Step 3: `data/awards.ts`** — certs completos:

```ts
export type Award = { pt: string; en: string }

export const awards: Award[] = [
  { pt: 'Magna Cum Laude — UFC', en: 'Magna Cum Laude — UFC' },
  { pt: 'AWS Partner: Accreditation (Technical)', en: 'AWS Partner: Accreditation (Technical)' },
  { pt: 'AWS Partner: Cloud Economics Accreditation', en: 'AWS Partner: Cloud Economics Accreditation' },
  { pt: 'Leadership Pathway', en: 'Leadership Pathway' },
  { pt: 'Lifelong Learning', en: 'Lifelong Learning' },
  { pt: 'Ignite Node.js (Rocketseat)', en: 'Ignite Node.js (Rocketseat)' },
  { pt: 'Hackathon winner — solução em AWS', en: 'Hackathon winner — AWS solution' },
]
```

- [ ] **Step 4: `data/education.ts`** — provider Full Cycle:

```ts
export type Education = {
  degree: { pt: string; en: string }
  school: string
  period: string
  note?: { pt: string; en: string }
}

export const education: Education[] = [
  {
    degree: { pt: 'Pós-graduação em Liderança Técnica', en: 'Postgrad in Technical Leadership' },
    school: 'Full Cycle',
    period: '2024 — 2025',
  },
  {
    degree: { pt: 'Bacharelado em Engenharia de Software', en: 'BSc in Software Engineering' },
    school: 'Universidade Federal do Ceará (UFC)',
    period: '2017 — 2020',
    note: { pt: 'Magna Cum Laude', en: 'Magna Cum Laude' },
  },
]
```

- [ ] **Step 5: Verificar** — `npm run build && npm run lint`. OK.

---

### Task 2: `data/experience.ts`

**Files:** Modify `data/experience.ts`.

- [ ] **Step 1: Reescrever** com bullets reais e períodos exatos:

```ts
export type Job = {
  company: string
  role: { pt: string; en: string }
  period: { pt: string; en: string }
  bullets: { pt: string[]; en: string[] }
  stack: string[]
}

export const experience: Job[] = [
  {
    company: 'Compass UOL',
    role: { pt: 'Desenvolvedor de Software Sênior', en: 'Senior Software Developer' },
    period: { pt: 'jan 2022 — atual', en: 'Jan 2022 — Present' },
    bullets: {
      pt: [
        'Arquitetura de APIs RESTful e microserviços dockerizados com Node.js + TypeScript.',
        'Modernização de sistemas legados para alta concorrência — até 20 mil requisições em 15 min com integridade de estoque sob acessos concorrentes (sem overselling).',
        'Soluções cloud-native em AWS (Lambda, ECS/EKS, SQS, S3, RDS) e cache com Redis.',
        'Mentoria de devs júnior/pleno: code review, pair programming e trilhas de crescimento.',
      ],
      en: [
        'RESTful API and dockerized microservices architecture with Node.js + TypeScript.',
        'Legacy modernization for high concurrency — up to 20k requests in 15 min with stock integrity under concurrent access (no overselling).',
        'Cloud-native solutions on AWS (Lambda, ECS/EKS, SQS, S3, RDS) and Redis caching.',
        'Mentoring junior/mid devs: code review, pair programming and growth tracks.',
      ],
    },
    stack: ['Node.js', 'TypeScript', 'NestJS', 'AWS', 'Docker', 'Redis', 'Datadog'],
  },
  {
    company: 'Grupo Casa Magalhães',
    role: { pt: 'Desenvolvedor de Software (Estágio → Júnior)', en: 'Software Developer (Intern → Junior)' },
    period: { pt: 'mar 2020 — jan 2022', en: 'Mar 2020 — Jan 2022' },
    bullets: {
      pt: [
        'Desenvolvimento full-stack com Node.js e Vue.js.',
        'Serviços REST integrados à AWS (Lambda, API Gateway, S3, DynamoDB).',
        'Documentação, testes e colaboração cross-functional ao longo do ciclo.',
      ],
      en: [
        'Full-stack development with Node.js and Vue.js.',
        'REST services integrated with AWS (Lambda, API Gateway, S3, DynamoDB).',
        'Documentation, testing and cross-functional collaboration across the lifecycle.',
      ],
    },
    stack: ['Node.js', 'Vue.js', 'AWS', 'SQL'],
  },
]
```

- [ ] **Step 2: Verificar** — `npm run build && npm run lint`. OK.

---

### Task 3: `data/projects.ts`

**Files:** Modify `data/projects.ts`.

- [ ] **Step 1: Reescrever** os 3 projetos reais (mantendo o `type`/`Project`):

```ts
export type ProjectType = 'pessoal' | 'profissional'

export type Project = {
  slug: string
  title: string
  type: ProjectType
  description: { pt: string; en: string }
  stack: string[]
  github?: string
  live?: string
  highlight?: boolean
}

export const projects: Project[] = [
  {
    slug: 'ibolao',
    title: 'iBolão',
    type: 'pessoal',
    description: {
      pt: 'SaaS de bolão da Copa 2026: cria bolão em segundos, convite por link, ranking ao vivo e upgrade via Pix. Auth, e-mails transacionais e LGPD completos.',
      en: 'World Cup 2026 betting-pool SaaS: create a pool in seconds, invite by link, live ranking and Pix upgrades. Full auth, transactional emails and LGPD compliance.',
    },
    stack: ['NestJS', 'Prisma', 'PostgreSQL', 'React', 'TypeScript', 'Clerk'],
    live: 'https://ibolao.cqlabs.com.br',
    highlight: true,
  },
  {
    slug: 'high-concurrency-platform',
    title: 'Plataforma de alta concorrência',
    type: 'profissional',
    description: {
      pt: 'Modernização de sistema legado para suportar 20 mil requisições em 15 minutos, com ~2 mil operações de estoque concorrentes — sem overselling e respeitando limites.',
      en: 'Legacy modernization to handle 20k requests in 15 minutes with ~2k concurrent inventory operations — no overselling, stock limits enforced.',
    },
    stack: ['NestJS', 'Node.js', 'React', 'AWS', 'PostgreSQL'],
    highlight: true,
  },
  {
    slug: 'ead-platform',
    title: 'Plataforma de EAD',
    type: 'profissional',
    description: {
      pt: 'Reescrita de plataforma de ensino a distância: gestão de cursos e portal do aluno com aulas e provas, migrada para stack moderna Node/NestJS + React.',
      en: 'Rewrite of an e-learning platform: course management and student portal with lessons and exams, migrated to a modern Node/NestJS + React stack.',
    },
    stack: ['NestJS', 'Node.js', 'React', 'TypeScript'],
  },
]
```

- [ ] **Step 2: Verificar** — `npm run build && npm run lint`. OK. (Projects tem 2 highlights agora — ambos `md:col-span-2` no grid interno; ok.)

---

### Task 4: `data/skills.ts`, `data/now.ts`, `data/uses.ts`

**Files:** Modify os 3.

- [ ] **Step 1: `data/skills.ts`**:

```ts
export type SkillCategory = {
  label: { pt: string; en: string }
  icon: string
  items: string[]
}

export const skills: SkillCategory[] = [
  {
    label: { pt: 'Back-end', en: 'Back-end' },
    icon: '⚙',
    items: ['Node.js', 'TypeScript', 'NestJS', 'Microserviços', 'REST APIs', 'Redis', 'SQL'],
  },
  {
    label: { pt: 'Cloud & Plataforma', en: 'Cloud & Platform' },
    icon: '☁',
    items: ['AWS Lambda', 'ECS/EKS', 'SQS', 'S3', 'RDS', 'Docker', 'CI/CD', 'Datadog'],
  },
  {
    label: { pt: 'Arquitetura & Dados', en: 'Architecture & Data' },
    icon: '◆',
    items: ['Clean Architecture', 'Design de Soluções', 'Modelagem de BD', 'Prisma', 'PostgreSQL'],
  },
  {
    label: { pt: 'Liderança & Processo', en: 'Leadership & Process' },
    icon: '◇',
    items: ['Mentoring', 'Code Review', 'Liderança Técnica', 'Agile', 'AI aplicada a dev'],
  },
]
```

- [ ] **Step 2: `data/now.ts`**:

```ts
export const now = {
  updated: '2026-06',
  working: {
    pt: 'Senior SWE na Compass UOL — modernização de sistemas legados e back-ends de alta concorrência. Tocando o iBolão (SaaS de bolão da Copa) no estúdio CQ Labs.',
    en: 'Senior SWE at Compass UOL — legacy modernization and high-concurrency back-ends. Building iBolão (World Cup betting-pool SaaS) at CQ Labs studio.',
  },
  studying: {
    pt: ['AWS Solutions Architect Professional', 'Clean Architecture', 'AI aplicada a workflows de dev'],
    en: ['AWS Solutions Architect Professional', 'Clean Architecture', 'AI applied to dev workflows'],
  },
  reading: { pt: 'Staff Engineer — Will Larson', en: 'Staff Engineer — Will Larson' },
  offwork: { pt: 'Cozinhando, caminhando e zerando algum jogo.', en: 'Cooking, walking and finishing some game.' },
} as const
```

- [ ] **Step 3: `data/uses.ts`** — remover a categoria Hardware (manter Editor & Terminal + Ferramentas):

```ts
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
]
```

- [ ] **Step 4: Verificar** — `npm run build && npm run lint`. OK.

---

### Task 5: `data/publications.ts` (novo) + dictionaries hero.tagline

**Files:** Create `data/publications.ts`; Modify `lib/i18n/dictionaries/pt.json`, `en.json`.

- [ ] **Step 1: Criar `data/publications.ts`**:

```ts
export type Publication = { title: string; venue?: string; url?: string }

export const publications: Publication[] = [
  { title: 'Mineração de Texto: Uma Análise de Sentimentos em Comentários de Notícias no Facebook' },
  { title: 'Uma Proposta de Utilização de Aplicações Serverless no Contexto de eHealth' },
  { title: 'Sistemas colaborativos, definições e características' },
]
```

- [ ] **Step 2: `lib/i18n/dictionaries/pt.json`** — trocar `hero.tagline`:

```json
"tagline": "Modernizo sistemas legados e construo back-ends que aguentam carga real — Node.js, AWS e Clean Architecture.",
```

(Manter as demais chaves do hero intactas.)

- [ ] **Step 3: `lib/i18n/dictionaries/en.json`** — trocar `hero.tagline`:

```json
"tagline": "I modernize legacy systems and build back-ends that handle real load — Node.js, AWS and Clean Architecture.",
```

- [ ] **Step 4: Verificar** — `npm run build && npm run lint && npm test`. Build/lint ok; 43 testes verdes (tagline não é testada).

---

### Task 6: `components/sections/about.tsx` — copy + TAGS bilíngues

**Files:** Modify `components/sections/about.tsx`.

- [ ] **Step 1: Reescrever** (copy nova + TAGS `{pt,en}`):

```tsx
import type { Locale } from '@/lib/i18n/locales'
import { Tile } from '@/components/bento/tile'

const TAGS: { pt: string; en: string }[] = [
  { pt: 'Clean Architecture', en: 'Clean Architecture' },
  { pt: 'AWS', en: 'AWS' },
  { pt: 'Alta Concorrência', en: 'High Concurrency' },
  { pt: 'Microserviços', en: 'Microservices' },
  { pt: 'Liderança Técnica', en: 'Technical Leadership' },
]

export function About({ locale }: { locale: Locale }) {
  const copy = {
    pt: [
      'Engenheiro de software de Quixadá, Ceará. Sênior na Compass UOL, com 5+ anos construindo back-ends em Node.js, TypeScript e AWS — de APIs e microserviços a sistemas de alta concorrência.',
      'Meus últimos projetos foram modernizações de legado: reescrever sistemas críticos em stacks novas sem perder o que já rodava. No último, garanti integridade de estoque sob 20 mil requisições em 15 minutos.',
      'Pós em liderança técnica (Full Cycle) porque código é metade do trabalho — a outra é fazer o time crescer junto. Fora do terminal: cozinha, caminhada e games.',
    ],
    en: [
      'Software engineer from Quixadá, Ceará. Senior at Compass UOL, with 5+ years building back-ends in Node.js, TypeScript and AWS — from APIs and microservices to high-concurrency systems.',
      'My latest projects were legacy modernizations: rewriting critical systems on new stacks without losing what already ran. On the last one, I ensured stock integrity under 20k requests in 15 minutes.',
      'Postgrad in technical leadership (Full Cycle) because code is half the job — the other half is helping the team grow. Away from the terminal: cooking, walking and games.',
    ],
  }[locale]

  return (
    <Tile id="about" label="sobre" title={locale === 'pt' ? 'Quem sou eu' : 'Who I am'} className="md:col-span-4">
      <div className="space-y-4 text-muted leading-relaxed">
        {copy.map((p, i) => <p key={i}>{p}</p>)}
      </div>
      <div className="mt-6 flex flex-wrap gap-1.5">
        {TAGS.map((t) => (
          <span key={t.en} className="font-mono text-[10px] text-accent bg-accent/10 border border-accent/20 rounded px-2 py-0.5">{t[locale]}</span>
        ))}
      </div>
    </Tile>
  )
}
```

- [ ] **Step 2: Verificar** — `npm run build && npm run lint`. OK.

---

### Task 7: Tile `Publications` + montar no grid

**Files:** Create `components/sections/publications.tsx`; Modify `app/[locale]/page.tsx`.

- [ ] **Step 1: Criar `components/sections/publications.tsx`**:

```tsx
import type { Locale } from '@/lib/i18n/locales'
import { publications } from '@/data/publications'
import { Tile } from '@/components/bento/tile'

export function Publications({ locale }: { locale: Locale }) {
  if (publications.length === 0) return null
  return (
    <Tile label={locale === 'pt' ? 'publicações' : 'publications'} title={locale === 'pt' ? 'Publicações' : 'Publications'} className="md:col-span-6">
      <ul className="flex flex-col gap-3">
        {publications.map((p) => (
          <li key={p.title} className="flex gap-2.5 text-sm text-muted leading-relaxed">
            <span className="text-accent shrink-0">▹</span>
            <span>{p.url ? <a href={p.url} target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">{p.title}</a> : p.title}</span>
          </li>
        ))}
      </ul>
    </Tile>
  )
}
```

- [ ] **Step 2: `app/[locale]/page.tsx`** — importar e montar entre BlogPreview e Contact:

Adicionar import:
```tsx
import { Publications } from '@/components/sections/publications'
```

Inserir no grid após `<BlogPreview locale={l} />`:
```tsx
        <BlogPreview locale={l} />
        <Publications locale={l} />
        <Contact locale={l} />
```

- [ ] **Step 3: Verificar** — `npm run build && npm run lint`. OK. Tile de publicações aparece no grid.

---

### Task 8: Publicações no CV PDF

**Files:** Modify `lib/cv/model.ts`, `lib/cv/cv-document.tsx`.

- [ ] **Step 1: `lib/cv/model.ts`** — importar publications, add ao tipo e ao build:

Add import:
```ts
import { publications } from '@/data/publications'
```

No type `CvModel`, add campo:
```ts
  publications: string[]
```

No `buildCvModel` return, add:
```ts
    publications: publications.map((p) => p.title),
```

- [ ] **Step 2: `lib/cv/cv-document.tsx`** — add label + seção:

Em `LABELS`, add a chave em ambos locales:
```ts
  pt: { experience: 'Experiência', skills: 'Competências', education: 'Formação', languages: 'Idiomas', awards: 'Certificações & Prêmios', publications: 'Publicações' },
  en: { experience: 'Experience', skills: 'Skills', education: 'Education', languages: 'Languages', awards: 'Certifications & Awards', publications: 'Publications' },
```

Após o bloco `<View style={s.section}>` de awards (antes de fechar `</Page>`), add:
```tsx
        {model.publications.length > 0 && (
          <View style={s.section}>
            <Text style={s.h2}>{t.publications}</Text>
            {model.publications.map((p, i) => (
              <View key={i} style={s.award}>
                <Text style={s.awardDot}>•</Text>
                <Text style={s.awardText}>{p}</Text>
              </View>
            ))}
          </View>
        )}
```

- [ ] **Step 3: Verificar** — `npm run build && npm run lint`. OK. Abrir `/pt/cv` e `/en/cv` no dev: seção Publicações aparece após Certificações.

---

### Task 9: Validação final

- [ ] **Step 1:** `npm run build && npm run lint && npm test`
Expected: build Turbopack OK, lint limpo, 43 testes verdes.

- [ ] **Step 2:** `npm run dev` — varrer: hero (tagline nova), about (bio + tags bilíngues), projetos (iBolão destaque + 2 cases), skills/now atualizados, tile Publicações, /uses sem Hardware, CV PDF com Publicações. Sem placeholders.

---

### Task 10: Commit (aguardar aprovação do dono)

- [ ] **Step 1: Dono revisa a copy renderizada;** após OK, propor commit. Mensagem sugerida:

```
feat: conteúdo real (copy, dados e publicações)

Hero com tagline de impacto; about com bio real; experiência e skills
atualizados; projetos reais (iBolão + 2 cases de modernização);
/now atualizado; idiomas/certificações/educação corrigidos; nova seção
de Publicações no site e no CV PDF; localização Quixadá; /uses sem
hardware por ora. Layout/visual inalterados. Foto e blog ficam p/ depois.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
```

- [ ] **Step 2: Após OK, commitar** os arquivos das Tasks 1-8.

## 7. Como validar

- `npm run build` verde; `npm run lint` limpo; `npm test` → 43 testes.
- Visual: nenhum placeholder; hero/about/projetos/skills/now/publicações reais; /uses sem Hardware; CV PDF (`/pt/cv`, `/en/cv`) com summary/educação/idiomas/certs novos + Publicações.
- Sem regressão de layout/SEO/i18n/rotas.

## 8. Fora de escopo

- Foto real e posts de blog (próxima rodada).
- Recolorir o CV PDF para a paleta nova (segue âmbar) — fora desta fase.
- Publicação (push/remoto) — aguarda OK.
