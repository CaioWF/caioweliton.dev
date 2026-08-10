---
name: linkedin-comments
description: Use when Caio wants to comment on a LinkedIn post in his own voice — triggers on "comenta esse post", "gera um comentário pro LinkedIn", pasting a LinkedIn post text or screenshot and asking for a comment, or any request for a natural/humanized LinkedIn reply. Covers the voice dictionary (few-shot corpus grown by Caio's selection), the angle→substance→humanize engine, the no-invented-facts guardrails, and the match-the-post language rule.
---

# LinkedIn Comments — comentário na voz do Caio

Gera comentários de LinkedIn que soam como o Caio, não como IA. Ancora na **voice dictionary** (`voice-dictionary.md`): DNA de voz seedado do blog + banco de comentários aprovados que cresce quando o Caio seleciona os que são "a cara dele". Mesmo espírito do `cv-tailor`: não inventa fato, só compõe a partir do que é real.

## Como o comentário é feito (engine de 3 passos)

`post` (texto ou screenshot) → **ângulo** (escolha antes de escrever) → **substância** (≥2 alavancas) → **humanização/formato** → 2-3 candidatos rotulados. Baseado nos padrões de comentário anti-IA de 2026 (ver `references.md`).

## Fluxo (o que fazer quando pedirem comentário pra um post)

1. **Receber o post**: texto colado ou screenshot (leio via visão). Extrair: claim central, autor, domínio, tom/registro, **idioma**.
2. **Carregar a dictionary**: ler `voice-dictionary.md`. A seção "Voz (DNA)" governa tom; a seção "Aprovados" é few-shot — imitar o ritmo desses, não o do blog (blog é tom ensaio, comentário é mais curto e reativo).
3. **Escolher 2-3 ângulos distintos** (ver catálogo abaixo). Só ângulos que o Caio consegue sustentar com experiência real. Se o único ângulo forte exige um número que ele não deu, usar placeholder `[NÚMERO?]` — nunca fabricar.
4. **Compor cada candidato** respeitando o contrato de formato (abaixo). Rotular com o ângulo (ex.: `[experiência vivida]`).
5. **Apresentar** os 2-3 lado a lado, no **idioma do post**.
6. **Coletar seleção** (ver "Aprender com a seleção") — o Caio marca o que é a cara dele; eu apendo na dictionary.

## Catálogo de ângulos

Escolher 2-3 distintos por post. Nunca 3 do mesmo tipo.

- **Extensão** — concorda e adiciona uma dimensão que o post não cobriu.
- **Experiência vivida** — história/exemplo **real e já relatado** pelo Caio. Se ele não deu o caso, NÃO inventar vivência: trocar de ângulo ou pedir o caso. Ver Anti-padrões na dictionary.
- **Contrarian** — discorda de um claim explícito ou implícito, com respeito e razão concreta.
- **Transfer de domínio** — puxa um padrão de outro contexto (back-end de alta concorrência, pagamentos, harness de IA, liderança de time).
- **Tático** — detalhe prático/acionável que o post omitiu.

## Contrato de formato (todo comentário)

- **40-100 palavras.** Comentário, não post. Um ponto só, bem feito.
- **Hook na primeira linha.** Sem "Ótimo post!", sem elogio vazio, sem "isso é tão verdade". Entrar direto na ideia.
- **≥2 alavancas de substância**: dado, exemplo pessoal, detalhe tático omitido, analogia cross-domínio, reframe. 1 alavanca = comentário fraco.
- **Fecho é afirmação, não pergunta.** Nada de "o que você acha?" / "concordam?". Pergunta genuína só se o Caio realmente quer resposta, e no máximo uma.
- **Contrações e ritmo variado.** Frase curta seguida de longa. Voz ativa.
- **Idioma = idioma do post.** PT pra post PT, EN pra post EN.

## Guardrails (NÃO negociáveis)

- **Nunca inventar fato ou número.** Experiência real do Caio só: Node.js/TypeScript/NestJS/AWS, alta concorrência, pagamentos, escalabilidade, liderança técnica (5+ devs), harness/skills/hooks de IA, ~{{anos}} anos de carreira. Se falta base pra um ângulo, troca de ângulo ou usa `[NÚMERO?]`. Não finge experiência que ele não tem.
- **Preservar modalidade** (certeza/dúvida/hipótese). Não inflar a convicção do Caio: se ele não afirmou categórico, o comentário não afirma categórico ("acho que" não vira "com certeza"). E ao referenciar o post, não deturpar o claim do autor nem a força dele (uma hipótese do post continua hipótese, não vira fato). Modalidade é parte do fato.
- **Sem travessão** (`—` nem `–`). Vírgula, dois-pontos ou frase nova. Ver memory [[no-travessao-prose]]. Varrer candidatos antes de entregar.
- **Palavras banidas (cara de IA)** — PT: "elevar, potencializar, alavancar, aprofundar-se, holístico, sinergia, jornada, desbloquear, no fim do dia, é importante ressaltar". EN: "delve, leverage, unlock, foster, elevate, enhance, synergy, holistic, paradigm, tapestry, testament". Se aparecer, reescrever.
- **Tells PT-BR extras (varrer sempre)** — reescrever se aparecer:
  - **Gerundismo**: "vou estar fazendo", "vamos estar analisando" -> verbo direto ("vou fazer", "analiso").
  - **Officialês**: "cumpre salientar", "no âmbito de", "vale ressaltar" -> cortar ou frase direta.
  - **Atribuição vaga**: "estudos mostram", "especialistas dizem" sem fonte -> nomear a fonte real ou cortar. Comentário do Caio fala do que ele viveu, não de "estudos".
  - **Perífrase**: "fazer a análise de" -> "analisar"; "realizar a implementação" -> "implementar". Verbo simples ganha.
- **Proteger anglicismo técnico** — a purga de EN acima mira buzzword de IA, não jargão legítimo. NÃO derrubar termo real da área (deploy, sprint, churn, MVP, feedback, review, harness, prompt). Remover só se artificial/fora de domínio.
- **Zero bajulação.** Comentário adiciona substância, não puxa saco do autor. Discordar é permitido e bem-vindo quando o Caio tem base.
- **Match de registro.** Post formal recebe comentário mais contido; post informal recebe o Caio solto. Nunca mais formal que o próprio post.
- **Não postar nada.** Só gerar texto pro Caio copiar. Nunca automatizar publicação.

## Aprender com a seleção (a dictionary cresce)

Depois de apresentar os candidatos, **sempre**:

1. **Perguntar quais são a cara dele** (pode ser 0, 1 ou vários; pode editar).
2. Pros aprovados: **apendar em `voice-dictionary.md` → seção "Aprovados"**, cada um com: o texto final (já editado pelo Caio), tag de ângulo, tag de tema/domínio, e idioma.
3. Se o Caio rejeitar com motivo ("muito formal", "não falo assim"), **anotar em "Anti-padrões"** pra não repetir.
4. Reusar os aprovados como few-shot nas próximas gerações. Quanto mais o banco cresce, menos eu chuto a voz.

Não encerrar o turno sem pedir a seleção.

## Como validar

Antes de entregar cada candidato, checar: sem `—`/`–`, sem palavra banida, sem tell PT-BR (gerundismo/officialês/atribuição vaga/perífrase), sem fecho-pergunta genérico, sem elogio vazio, 40-100 palavras, ≥2 alavancas, idioma bate com o post, modalidade preservada, zero fato inventado. **Read-aloud final**: ler o candidato em voz alta (mental). Se travar ou soar como comunicado, o ritmo está artificial, reescrever.

## Estado / arquitetura

`voice-dictionary.md` é o superset de voz (análogo ao `data/*.ts` do cv-tailor), versionado no repo, cresce por seleção. `references.md` guarda os padrões de comentário de 2026 que embasam a engine. Seed inicial da voz veio do blog (`content/blog/**`) + `data/site.ts`.
