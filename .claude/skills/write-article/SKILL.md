---
name: write-article
description: Use when Caio wants to write a blog article in his own voice, in PT-BR or EN — triggers on "escreve um post sobre X", "vamos escrever o artigo", "rascunha esse texto pro blog", "me dá opções de escrita pra esse post", "faz a versão em inglês", or any request to author/edit content in content/blog/**. Covers angle selection, the essay format contract, the analogy and humor budget, the anti-slop pass for both languages (anti-slop.md), the fact-verification guardrail, and the mdx frontmatter contract.
---

# write-article — post de blog na voz do Caio

Escreve posts pro blog em **PT-BR e EN** (`content/blog/pt/*.mdx` e `content/blog/en/*.mdx`) que soam como o Caio, não como IA. A voz é a mesma da skill `linkedin-comments`, o formato não: comentário é curto e reativo, post é ensaio em primeira pessoa com tese própria.

Os dois idiomas são saída de primeira classe. O blog pareia posts por slug, então PT sem par EN é trabalho pela metade.

**Fonte de voz**: `../linkedin-comments/voice-dictionary.md` → seção "Voz (DNA)" e seção "Anti-padrões". Ler antes de escrever. Não duplicar aqui; aquele arquivo é o único dono da voz.

## Pipeline

`tema` → **ângulo/tese** → **verificação de fatos** → **esqueleto** → **rascunho PT** → **avaliação de diagrama** → **passe anti-slop** → **checklist** → **versão EN** → **passe anti-slop EN** → **checklist**.

Não pular a verificação de fatos. É onde essa skill mais falha (ver Guardrails).

### 1. Ângulo e tese

Antes de escrever qualquer parágrafo, escrever uma frase: *qual é a tese?* Se ela não couber numa frase afirmativa e discutível, não tem post ainda, tem assunto.

Quando o Caio pedir opções, apresentar 2-3 ângulos distintos, cada um com: tese em uma frase, beats (3-6), material real disponível pra sustentar, risco do formato. Recomendar um e dizer por quê. Não escrever o post antes de ele escolher.

Ângulos que funcionam no blog dele:
- **Conceito com exemplo próprio** — abstrai o princípio, usa o projeto dele como caso. O projeto é ilustração, não protagonista.
- **A coisa que eu construí e que falhou** — arco narrativo: construí, não pegou, por quê, o fix estava em outro lugar.
- **Reframe de categoria** — "isso que você chama de X é na verdade Y, e a diferença muda o que você faz".

### 2. Verificação de fatos (obrigatória)

Todo fato do post precisa de origem verificável antes de entrar no rascunho:

- **Número, data, contagem** (quantos artefatos, quantos commits, quanto tempo): conferir no repo, no `git log`, na design-note. Nunca estimar de cabeça.
- **Decisão técnica e o motivo dela**: ler a design-note / o código. O motivo real costuma ser mais interessante que o motivo plausível, e é o único que sobrevive a um leitor que foi checar.
- **Preferência ou hábito do Caio**: conferir na memória do projeto e no corpus (`content/blog/**`), nunca inferir. Se um post afirma "eu faço X", ou existe evidência, ou pergunta pro Caio, ou corta a frase.
- **Citação de terceiro**: fonte nomeada e link. Sem "estudos mostram".

Se falta base, o rascunho leva `[VERIFICAR: ...]` no lugar. Nunca preencher com algo verossímil.

### 3. Esqueleto

**Antes de montar, ler `exemplars.md`** e pegar o exemplar mais próximo do ângulo escolhido. Ele traz os movimentos nomeados (M1 a M9) com o trecho real que os ilustra. Reusar movimento, nunca frase.

Os movimentos que sustentam um post do blog:

- **Abertura concreta com reversão** (M1): uma coisa que o Caio fez, virada do avesso no parágrafo seguinte. Nunca definição, nunca "no mundo cada vez mais".
- **Dobradiça "e isso não é sobre X"** (M2), entre o 3º e o 5º parágrafo: promove o caso particular a princípio geral. Sem ela o texto fica preso no assunto de superfície.
- **Corpo como kit de ferramentas** (M3): seções H2 com nome imperativo em paralelo, forma `faça X, não Y`. O H2 carrega a tese da seção sozinho. Nunca H2 que promete relevância ("O custo que ninguém mede") em vez de entregar conteúdo ("Quem paga o guardrail").
- **Ponte de generalização** (M4) fechando toda seção que usou o projeto como caso: traduzir o princípio pro mundo do leitor com exemplos que ele reconhece. **É o movimento que tira o projeto do centro. Sem ele o post vira changelog.**
- **Lista de reconhecimento** (M5): fragmentos curtos com artefatos que o leitor tem no próprio repo (`--no-verify`, `[skip ci]`, `# noqa`). Específico o bastante pra doer.
- **Um número medido por seção** (M6), seco e seguido de fragmento. Sem adjetivo no número.
- **Reframe no lugar de sermão** (M8): `a leitura preguiçosa é X. A leitura útil é Y.`
- **Micro-headers em negrito** dentro da seção quando tem enumeração conceitual.
- **Fecho em três peças** (M9): callback pro post anterior quando houver linha de continuidade, frase-resumo levada a sério (sem piada), e bookend que resolve a imagem da abertura. Link do repo se o post usou o projeto como exemplo.

### 4. Contrato de formato

- **1200-1800 palavras** em PT. Post curto é aceitável se a tese é curta.
- **H1 igual ao `title` do frontmatter.**
- **Primeira pessoa**, voz ativa, contrações naturais, verbo simples (`é`, `tem`, `faz`).
- **Ritmo variado**: frase longa seguida de frase curta e seca.
- **Código inline** com crase pra comando/flag/arquivo (`--no-verify`, `rm -rf`, `content/blog/pt`).
- **Componentes MDX**: os que já existem entram à vontade. Componente novo só como diagrama do post, seguindo a seção 6.
- **Sem travessão** (`—`, `–`) em lugar nenhum, nos dois idiomas, inclusive frontmatter. Vírgula, dois-pontos ou frase nova. Varrer antes de fechar.

### 5. Orçamento de analogia e piada

Os dois são temperos com dose. Estourar a dose é o jeito mais rápido de o texto virar LinkedIn.

**Analogia**: uma por conceito difícil, e só pra conceito que o leitor não pega de primeira. Regra da analogia boa:
- Concreta e cotidiana (catraca de portaria, livro de reclamações de restaurante), não abstrata ("é como uma sinfonia").
- **Desenvolvida, não empilhada.** Uma analogia bem esticada vale mais que três de passagem. Se um conceito já tem analogia, reusar o mesmo mundo pro conceito irmão (a portaria vira o porteiro com álbum de ladrões) em vez de abrir um mundo novo.
- Mapeamento explícito: dizer qual parte da analogia corresponde a qual parte do conceito.
- Máximo 2-3 por post.
- Na versão EN, checar se a analogia atravessa a cultura. Catraca de portaria funciona; referência a algo só brasileiro precisa de troca, não de tradução.

**Piada**: 2-3 no post inteiro, nunca mais. Onde entra:
- No **fim de parágrafo**, como respiro depois de um ponto denso. Nunca no meio de uma explicação.
- **Seca e curta**, uma frase. Se precisa de setup, não é pra esse texto.
- **Autodepreciativa ou sobre a situação**, nunca sobre pessoa ou empresa.
- **Nunca na abertura da tese** nem na frase-resumo do fecho: esses dois lugares precisam ser levados a sério.
- Piada boa nasce de um detalhe real do caso ("se eu cobrasse por artefato, aquele typo teria sido o item mais caro do backlog"), não de um trocadilho.

### 6. Diagrama (avaliar sempre, fazer só quando paga)

Todo post passa por essa avaliação, com o rascunho PT já pronto. A maioria não precisa de figura. Quando precisa, é porque tem uma coisa que a prosa explica mal.

**Vale diagrama quando** o post tem relação espacial (o que está dentro de quê, o que vem antes do quê), antes/depois, dois eixos que se cruzam, um ciclo, ou um trecho que o Caio leu e achou complexo. **Não vale quando** a figura só repetiria uma lista que o texto já dá, ou quando ela precisaria de número que o post não mediu. Figura não inventa dado: o mesmo guardrail da seção 2 vale pro desenho.

**Antes de propor, ler os anteriores.** `components/blog/*-diagram.tsx` é o corpus, um por post denso:

| Componente | Post | Forma |
|---|---|---|
| `harness-diagram.tsx` | não é a IA, é o harness | camadas em volta do modelo |
| `okf-graph-diagram.tsx` | OKF | grafo de nós ligados, animado |
| `loop-diagram.tsx` | loop engineering | ciclo com estados acendendo em sequência |
| `floor-cost-diagram.tsx` | toda regra tem dois custos | duas linhas e a cunha entre elas |

Reusar a linguagem visual (moldura com rótulo na borda, mono em caixa alta, traço fino, cor só como reforço), nunca o desenho.

**Propor 2-3 caminhos e esperar a escolha do Caio.** Cada caminho com: o que a figura mostra, a forma, e qual parágrafo ela alivia. Não implementar antes da escolha.

**Posição no texto.** A figura entra logo depois do parágrafo que ela resolve, nunca antes (aí ela vira enigma) nem no fim da seção (aí o leitor já se virou sem ela). Se o post tem um trecho que o Caio marcou como complexo, a posição default é ali.

**Mais de uma figura é permitido**, e a regra é uma por conceito, não uma por seção. Duas figuras só se sustentam quando mostram relações diferentes (um antes/depois e um fluxo de decisão, por exemplo) e vivem em seções separadas. Duas que mostram a mesma relação com desenho diferente: fica a melhor. Duas na mesma seção: nunca, o leitor perde o fio. Na prática o teto é dois num post de 1500 palavras, porque figura demais transforma ensaio em slide.

**Contrato técnico**, derivado dos quatro existentes:

- arquivo `components/blog/<nome>-diagram.tsx`, export nomeado `<Nome>Diagram`;
- registrar em `mdx-components.tsx`: import no topo e entrada no objeto `components`, senão a tag não resolve;
- prop `{ locale?: Locale }` com default `'pt'`, e a cópia num objeto `copy` de chaves `pt`/`en`, fechado com `satisfies Record<Locale, ...>`;
- SVG inline com `viewBox`, sem dependência externa, sem imagem binária, sem texto essencial fora do SVG;
- cor por token do tema (`var(--accent)`, `var(--muted)`, `var(--border)`, `var(--foreground)`, `var(--faint)`, `var(--surface)`), nunca hex fixo, pra funcionar em light e dark;
- raiz `<figure className="my-8 not-prose">`;
- `role="img"` e `aria-label` com a descrição completa da figura, texto que mora no objeto de cópia junto com o resto;
- legenda em texto sempre que a identidade de um traço depender de cor ou de estilo de linha;
- animação, quando houver, por classe CSS com `animationDelay` inline (ver `loop-diagram.tsx`), nunca por JS;
- comentário no topo do arquivo dizendo o que o esquema afirma e o que ele deliberadamente não afirma (ver `floor-cost-diagram.tsx`);
- chamada no MDX: `<NomeDiagram locale="pt" />` no arquivo PT e `locale="en"` no par EN, na mesma posição relativa dos dois.

### 7. Passe anti-slop

Ler `anti-slop.md` e varrer o rascunho contra a tabela do idioma que está sendo escrito. Reescrever tudo que casar.

Os que mais aparecem em texto técnico PT: vocabulário inflado, paralelismo negativo, regra de três em todo parágrafo, transição mecânica encadeada, decalque do inglês, conclusão sinalizada, ciclagem de sinônimos.

Os que mais aparecem em EN: `delve/leverage/unlock/foster`, `not just X, but Y`, `it's worth noting`, `in today's landscape`, tricolon em todo parágrafo, Title Case em H2+.

**Preservar estrangeirismo técnico legítimo** (deploy, lint, commit, bypass, gate, hook, harness, churn, MVP). Traduzir esses à força é tell de IA, não o contrário.

### 8. Versão EN

A versão EN é **reescrita, não tradução**. Traduzir frase a frase produz texto que soa vertido, que é o próprio tell.

- Mesmo slug, mesmo `date`, mesma estrutura de seções. `title` e `description` reescritos, não traduzidos.
- A voz EN dele é a mesma pessoa: primeira pessoa, direta, anti-hype, exemplo real no lugar de teoria. Menos coloquialismo que o PT, porque o equivalente direto de "na real" soa forçado em inglês.
- Trocar idiomatismo por idiomatismo, nunca por tradução literal.
- Rodar o passe anti-slop EN e o checklist inteiro de novo. A versão EN não herda a aprovação da PT.

## Frontmatter e arquivo

```yaml
---
title: 'Título do post'
date: 'YYYY-MM-DD'
description: 'Uma a três frases. É o que aparece na listagem e no SEO. Sem travessão.'
tags: ['Engenharia', 'IA', 'Agentes']
---
```

- Vocabulário de tags existente: `IA`, `Agentes`, `Engenharia`, `Carreira`. Não criar tag nova sem perguntar.
- Arquivo: `content/blog/pt/<slug>.mdx` e `content/blog/en/<mesmo-slug>.mdx`. Slug em kebab-case, sem stopword desnecessária, e o mesmo nos dois idiomas.
- Descoberta é por varredura de diretório (`lib/blog/posts.ts`), então basta criar o arquivo.

## Guardrails (NÃO negociáveis)

- **Zero fato inventado.** Número, data, motivo técnico, preferência do Caio: verificado ou `[VERIFICAR]`. O modo de falha real dessa skill é escrever uma anedota plausível sobre o Caio e só descobrir depois que era falsa. Uma anedota boa e falsa é pior que nenhuma anedota.
- **Preservar modalidade.** Hipótese continua hipótese. Não inflar convicção ("acho que" não vira "com certeza").
- **Não publicar nada.** Escrever o arquivo é o limite. Commit, push e deploy são decisão do Caio.
- **Sem travessão.** Ver memória [[no-travessao-prose]].
- **Não terceirizar julgamento.** Se o post afirma algo sobre uma decisão técnica, o motivo tem que ser o motivo real da design-note, não uma racionalização bonita.

## Checklist final

Rodar por arquivo, PT e EN separadamente:

1. `grep -c '—' <arquivo>` retorna 0.
2. Nenhum `[VERIFICAR]` sobrou.
3. Tese cabe numa frase e aparece nos primeiros 5 parágrafos.
4. Passe anti-slop feito, tabela inteira do idioma.
5. Analogias ≤3, cada uma desenvolvida e mapeada. Piadas ≤3, nenhuma na abertura da tese nem na frase-resumo.
6. Todo número e toda afirmação sobre o Caio tem origem citável.
7. Frontmatter completo, `date` no formato certo, tags do vocabulário existente, slug igual nos dois idiomas.
7b. Diagrama avaliado. Se entrou: registrado em `mdx-components.tsx`, cor por token do tema, `aria-label` preenchido, e a tag na mesma posição no PT e no EN.
8. **Read-aloud**: ler o texto em voz alta (mental). Onde travar, o ritmo está artificial. Reescrever.
9. Se o `keel` estiver disponível, rodar `core/claude/hooks/slop-guard.mjs` no arquivo. As regras dele são em inglês: vale como rede de verdade na versão EN, e quase nada na PT. O item 4 é o que sustenta o PT.

## Estado / arquitetura

`anti-slop.md` guarda os padrões de texto-de-IA nos dois idiomas. A tabela PT-BR é derivada da skill [humanizar](https://github.com/fabricioctelles/skills/tree/main/skills/humanizar) de Fabrício Telles; a EN é o subconjunto estrutural que o `slop-guard` do keel implementa. Fica aqui como referência e não como skill separada porque o valor dela é ser um passe dentro de um fluxo de autoria; `linkedin-comments` e `cv-tailor` podem apontar pra esse mesmo arquivo em vez de duplicar as listas.

`exemplars.md` é o banco few-shot de estrutura: posts que o Caio aprovou, com os movimentos deles nomeados (M1-M9) e o trecho real que ilustra cada um, mais os movimentos que ele rejeitou e por quê. É o que faz a skill produzir texto parecido com o que já deu certo em vez de texto que só obedece a uma lista de regras. Cresce por apêndice: post aprovado vira entrada, trecho rejeitado com motivo vira anti-padrão.

Divisão entre os três arquivos: `exemplars.md` diz **como o texto se move**, `anti-slop.md` diz **o que não escrever**, `../linkedin-comments/voice-dictionary.md` diz **quem está falando**. A voz tem uma fonte só; se o Caio corrigir voz durante um post, a correção vai pra lá, em "Anti-padrões", não pra cá.
