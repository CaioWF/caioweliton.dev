---
name: cv-tailor
description: Use when creating or tailoring Caio's CV/résumé for a specific job posting (JD) in this repo — triggers on "cria um CV pra essa vaga", "tailor my CV", "gera currículo pra essa vaga", pasting a job description and asking for a CV, or any request to produce a per-job variant of the CV. Covers the react-pdf pipeline, the CvModel contract, the no-invented-facts guardrails, and the `pnpm cv --tailored` build.
---

# CV Tailor — variante por vaga

Gera um CV sob medida pra uma vaga a partir do **superset de fatos** em `data/*.ts`, sem inventar nada. Só reordena/enfatiza.

## Pipeline (como o CV é feito)

`data/*.ts` (superset de fatos) → `lib/cv/model.ts` (`buildCvModel(locale)` → `CvModel`) → `lib/cv/cv-document.tsx` (`renderCv`, react-pdf) → `scripts/build-cv.ts` (CLI `pnpm cv`). Rota pública `app/[locale]/cv/route.ts` serve só o **default**; variantes por vaga são locais e descartáveis.

## Fluxo (o que fazer quando pedirem CV pra vaga X)

1. **Ler o superset**: `data/experience.ts`, `data/skills.ts`, `data/projects.ts`, `data/site.ts`, `data/education.ts`, `data/languages.ts`, `data/awards.ts`. É a única fonte de fatos.
2. **Ler o contrato** `CvModel` em `lib/cv/model.ts` (campos: name, role, headline, email, location, website, github, linkedin, experience[], skills[], summary, education[], languages[], awards[], phone, projects[] — todos strings planas, não i18n).
3. **Extrair sinais da JD**: stack exigida, técnicas (DDD/TDD/design patterns/clean arch/OOP), domínio (e-commerce/pagamentos/etc.), soft (protagonismo/pragmatismo/OKRs), idioma.
4. **Compor** `data/cv-tailored.local.ts` (gitignored, descartável) exportando `cvTailored: CvModel` **e** `default`. Padrão: `const base = buildCvModel('pt')`, espalhar `...base`, sobrescrever só summary/headline/skills/experience/projects. Reusar `base` pra name/email/education/languages/awards/phone.
5. **Render**: `pnpm cv --tailored` (PT PDF). Flags: `--locale=en`, `--format=text` (CV em texto puro, p/ formulário que não aceita PDF). Saída em `cv-out/` (gitignored).
6. **Copiar SEMPRE pro Downloads do Windows** (`/mnt/c/Users/conta/Downloads/`), com nome por vaga: `cv-caio-weliton-<slug-vaga>.pdf`. Não é opcional — todo CV gerado vai pro Downloads.
7. **Saída obrigatória** (ver seção abaixo) — nunca pular.

## Saída obrigatória (SEMPRE, ao final de todo CV gerado)

Depois de renderizar o PDF default (PT) **e copiá-lo pro Downloads** (passo 6), **sempre**, sem exceção:

1. **Linha de fit** — 1 linha só: aderência do superset à JD (ex.: "Fit forte: full-stack + IA/agentic; gaps: Python, GraphQL"). Ancora o resto.
2. **Resumo do que mudou vs CV padrão** — lista curta e concreta: role/headline, summary, ordem/corte de skills, reordenação/reescrita de bullets, projetos selecionados. Deixar explícito que foi só ênfase/seleção (zero fato novo).
3. **Mapa de requisitos eliminatórios** — tabela JD × status × evidência. Uma linha por requisito **obrigatório** da vaga (não os diferenciais). Status: `tem` / `parcial` / `gap`. Evidência = fato do superset que cobre, ou "omitido (não fabricado)" no gap. Deixa o candidato ver de relance o que pode barrar antes de aplicar.

   | Requisito (JD) | Status | Evidência no superset |
   |---|---|---|
   | Node.js | tem | Compass/Casa, superset |
   | GraphQL | gap | omitido (não fabricado) |

4. **Perguntar se precisa das demais features** — **Gupy** (texto "Apresente-se!" + as 3 habilidades, ver seção abaixo) e **inglês** (`--locale=en`). A cópia pro Downloads NÃO é pergunta: já foi feita automaticamente. Não gerar gupy/en por conta própria; só sob pedido/confirmação.

Não encerrar o turno sem esses quatro itens.

## "Gupy" = etapa Apresente-se! (é ISSO que o Caio quer quando pede "gupy")

**"Gera a parte do gupy" NÃO é CV em texto puro.** É a etapa opcional do formulário da Gupy, que tem exatamente dois campos:

1. **"Apresente-se!"** — textarea livre, limite **1500 caracteres**, prompt do formulário: "Fale sobre você e sua trajetória profissional, contando como pode ajudar a empresa no desafio descrito na vaga."
2. **"Quais são as suas habilidades mais valiosas para esta vaga?"** — **até 3** chips, escolhidos **entre os já cadastrados no perfil dele**, não livres.

Entregar os dois, sempre, no chat (não em arquivo). O texto puro do CV é outra coisa: `pnpm cv --format=text`, só sob pedido específico.

### Regras do texto

- **Sem travessões** (nada de `—` nem `–`). Usar vírgula, "e", dois-pontos ou frase nova.
- **Linguagem human-like / conversacional**, primeira pessoa. Nada de tom robótico ou bullet-speak. Soar como o Caio falando, não como CV.
- **Honesto sobre gaps**: se falta algo que a vaga pede, transformar em curiosidade/vontade de aprender, nunca fingir experiência.
- **Fatos reais só** (mesmos guardrails do CV). Puxar da vaga o desafio central e conectar à trajetória.
- Respeitar o limite (contar caracteres e informar a contagem; alvo ~1200-1400).

### Chips cadastrados no perfil (fonte pra escolher as 3)

Node.js · TypeScript · NestJS · AWS · Microsserviços · Sistemas Distribuídos · Clean Architecture · Docker · API REST · PostgreSQL · Redis · Lambda · ECS · SQS · CI/CD · Git · Jest · JavaScript · Express.js · MySQL · MongoDB · Prisma (ORM) · Arquitetura de Software · Liderança Técnica · Mentoria · Revisão de Código · React · Engenharia de Prompt · Inteligência Artificial Generativa · Assistentes de IA

Escolher as 3 que batem nos requisitos inegociáveis/título da vaga, justificar em uma linha cada e oferecer swap. Se a vaga pedir algo fora dessa lista, dizer que não há chip pra isso em vez de forçar um parecido.

## Guardrails (NÃO negociáveis)

- **Nunca inventar fato.** Datas, cargos, empresas, números (1M+ atletas, 5+ devs), stack — imutáveis por vaga. Só muda **seleção e ênfase**. Se a vaga pede algo que Caio não tem, omite — não fabrica.
- **Fonte = Helvetica (padrão-14, NÃO embutida).** Fonte embutida corrompe o ToUnicode de ligaduras fi/fl no react-pdf → ATS lê "Defni/flas". Helvetica extrai limpo. **Não voltar pra fonte embutida.**
- **Só ASCII/WinAnsi.** Usar `->` não `→`. Evitar glifos fora do WinAnsi (quebram na extração ATS).
- **Grafia**: "microsserviços" (não "microserviços").
- **Reordenar por relevância à JD**: categorias e bullets mais aderentes primeiro. Cortar categorias-ruído (ex.: IA numa vaga backend pura).
- **Telefone** vem de `CV_PHONE` em `model.ts` (fora de `data/site.ts`, que é client-bundled). Não duplicar.
- **Bullet = verbo de ação + impacto.** Abrir com verbo forte (Reescrevi, Integrei, Escalei, Defini, Automatizei, Migrei, Reduzi, Aumentei, Liderei, Orquestrei). Priorizar resultado mensurável; keyword da JD entra natural no meio, não empilhada.
- **Sem buzzword oco**: nada de "proativo, dinâmico, resiliente, apaixonado, entusiasta, visionário, mão na massa, ninja, rockstar, orientado a resultados (sem número)". O lint (`cv-render.test.ts`) barra os principais.
- **Métrica preservada**: não apagar os números de impacto (1M+, 5+ devs) numa reescrita. O lint exige piso ≥2 marcadores.

## Verificar

Gate portável: `pnpm test` cobre `lib/cv/cv-render.test.ts` (ligadura/contato/ordem/grafia/keywords + guard "sem /FontFile" + lint ATS: sem buzzword vazio e densidade de métrica ≥2). Rodar se mexer no render ou no superset; pra variante local só, `pnpm cv --tailored` já valida que compila e renderiza. Nota: o lint roda no superset **default** (a variante por vaga é gitignored), então guarda regressão da fonte de fatos, não da variante.

## Estado / decisões

Ver memory `cv-ats-optimization.md` (decisões de arquitetura: um repo só, sem motor de profiles/tags, variante montada on-demand pelo agente).
