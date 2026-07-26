# Anti-slop — padrões de texto gerado por IA

Referência do passe anti-slop da skill `write-article`. Duas tabelas: PT-BR e EN. Varrer a tabela do idioma que está sendo escrito, inteira, antes de fechar o arquivo.

**Regra de leitura**: nenhum item aqui é proibição absoluta. Um sinal isolado não condena o texto. O que denuncia IA é a *densidade*: três ou mais destes padrões no mesmo texto. Quando bater, reescrever.

**Preservação obrigatória**: reescrever forma, nunca fato. Número, data, fonte, exemplo, relação de causa, modalidade (hipótese continua hipótese) e código ficam intactos. Se a reescrita mudaria um fato, a reescrita está errada.

---

## PT-BR

Derivado da skill [humanizar](https://github.com/fabricioctelles/skills/tree/main/skills/humanizar) de Fabrício Telles.

### Vocabulário

**Gatilhos**: crucial, fundamental, cenário, panorama, no âmbito de, no bojo de, outrossim, destarte, em última análise, inegável, indubitavelmente, exponencialmente, disruptivo, paradigma, holístico, sinergia, alavancar, robusto, escalável, ecossistema (abstrato), jornada (figurativo), mergulhar em, desbloquear, desvendar insights, rica tapeçaria, um testemunho de, serve como um lembrete, navegar complexidades, ponta de lança, sem fricção, multifacetado, catalisador, orquestrar, potencializar, elevar.

- ❌ É fundamental destacar que o ecossistema de startups passa por um momento crucial.
- ✅ O mercado de startups está amadurecendo.

### Evitação de verbo simples

**Gatilhos**: configura-se como, constitui, representa, figura como, desponta como, consolida-se como, atua como, encontra-se, dispõe de, faz-se necessário.

IA evita `é`, `tem` e `faz` como se fossem palavras proibidas.

- ❌ O Nubank configura-se como a maior fintech da região.
- ✅ O Nubank é a maior fintech da região.

### Paralelismo negativo

**Gatilhos**: não é apenas X, mas também Y; não se trata apenas de X, trata-se de Y; mais do que X, é Y; vai muito além de X; transcende o simples X.

Infla importância criando uma dicotomia falsa.

- ❌ Produto não é apenas funcionalidade, é sobretudo resolver problema.
- ✅ Produto envolve funcionalidade e resolução de problema real.

> Nota: a variante curta e seca ("Loop sem métrica não é engenharia, é fé") faz parte da voz do Caio e é permitida. O que se corta é a versão inflada com "apenas/meramente/sobretudo", e o uso repetido: no máximo uma por post.

### Regra de três abusiva

**Gatilho**: tríade rítmica em parágrafo após parágrafo (clareza, concisão e coerência; planejar, executar e medir).

Texto natural varia a quantidade de itens conforme o conteúdo.

- ❌ Cultura baseada em transparência, colaboração e inovação. Buscamos agilidade, qualidade e impacto.
- ✅ Transparência e colaboração orientam a cultura. Buscamos agilidade sem abrir mão da qualidade.

### Ciclagem de sinônimos

**Gatilho**: o mesmo referente virando "a ferramenta" → "a solução" → "a plataforma" → "o sistema" → "o produto".

Confunde o leitor sobre se é a mesma coisa. Escolher um nome e repetir.

### Ressalva burocrática

**Gatilhos**: vale ressaltar que, cumpre salientar, é importante destacar, convém mencionar.

Quase sempre deletável sem perda.

- ❌ Vale ressaltar que a taxa cresceu.
- ✅ A taxa cresceu.

### Transição mecânica encadeada

**Gatilhos**: além disso, nesse sentido, diante disso, em contrapartida, por conseguinte, dessa forma, usados em frases consecutivas.

Uma ou outra é normal. Três seguidas é esteira.

- ❌ O mercado cresceu. Além disso, a competição aumentou. Nesse sentido, as margens caíram.
- ✅ O mercado cresceu e a competição aumentou. As margens caíram junto.

### Decalque do inglês

**Gatilhos e trocas**: endereçar → resolver/tratar; no final do dia → no fim das contas/na prática; performar → funcionar/rodar; correr um experimento → rodar; levantar uma questão → trazer/mencionar; em termos de → sobre/quanto a; estar no lugar → existir/estar pronto; baseado em (sem sujeito) → com base em.

Brasileiro usa o jargão inglês cru ou a expressão portuguesa. Nunca a tradução literal.

### Purismo artificial

**Gatilhos**: retroalimentação (feedback), implantação (deploy), rotatividade de clientes (churn), programa malicioso (malware).

Traduzir termo técnico consolidado é tell de IA, não sinal de bom português. Preservar o estrangeirismo que a área usa de verdade.

### Gerundismo

**Gatilhos**: vou estar enviando, vamos estar analisando, vai estar recebendo.

- ❌ Vou estar enviando o relatório.
- ✅ Vou enviar o relatório.

### Officialês e formalidade deslocada

**Gatilhos**: venho por meio deste, no que tange a, tendo em vista que, o referido, em face do exposto, solicito a gentileza, apresento-lhe, permite-nos.

Registro de ofício em texto que devia ser conversa.

### Abertura genérica (estilo redação de vestibular)

**Gatilhos**: em um mundo cada vez mais, no cenário atual, é inegável que, desde os primórdios.

Abrir com o concreto: anedota, número ou cena.

### Pergunta retórica auto-respondida

**Gatilho**: "O resultado? [substantivo]." / "A resposta? [afirmação]." / "O segredo? [revelação]."

Uma vez é recurso. Em todo parágrafo é tique de post de LinkedIn.

### Faixa falsa

**Gatilhos**: de X a Y; desde X até Y; abrangendo de X a Y.

Os extremos escolhidos não são opostos de verdade, são dois exemplos quaisquer.

- ❌ Participantes variaram de estagiários a executivos, de startups a multinacionais.
- ✅ Participaram estagiários, executivos, gente de startup e de empresa grande.

### Anáfora abusiva

**Gatilho**: três ou mais frases seguidas com o mesmo início ("Precisamos...", "É preciso...", "Cada vez mais...").

### Metáfora morta por saturação

**Gatilho**: a mesma palavra-imagem repetida três ou mais vezes (ecossistema, jornada, cenário, paisagem).

A metáfora perde força e vira ruído. Ver também o orçamento de analogia no `SKILL.md`.

### Diluição de ponto único

**Gatilhos**: de fato, em outras palavras, isso significa que, ou seja, reformulando a mesma ideia três vezes.

Se o parágrafo seguinte só reformula o anterior, deletar um dos dois.

### Conclusão sinalizada

**Gatilhos**: em conclusão, em suma, para finalizar, concluindo, em síntese.

O leitor sabe que acabou porque o texto acabou.

### "Apesar dos desafios"

**Gatilhos**: apesar dos desafios, embora existam preocupações, mesmo com limitações.

Reconhece uma objeção e descarta sem enfrentar. Ou a objeção é real e merece um parágrafo, ou sai.

### Listicle disfarçado de prosa

**Gatilhos**: o primeiro aspecto, o segundo ponto, o terceiro elemento.

Se é lista, usar lista. Se é argumento, dar fluxo.

### Resumo fractal

**Gatilhos**: nesta seção veremos, como vimos anteriormente, antes de prosseguir, recapitulando.

Meta-comentário em cada nível do texto. Cortar e ir direto ao conteúdo.

### Voz passiva analítica

**Gatilho**: foi implementado pela equipe, foi identificado que, foi realizado por.

- ❌ O relatório foi finalizado pela equipe.
- ✅ A equipe finalizou o relatório.

### Atribuição vaga

**Gatilhos**: estudos mostram, especialistas dizem, pesquisas indicam, é sabido que.

Nomear a fonte com link, ou cortar a frase. O Caio fala do que ele viveu.

---

## EN

Subconjunto estrutural equivalente, alinhado com o que o `slop-guard.mjs` do keel implementa e com a enumeração "Signs of AI writing" da Wikipedia.

### Vocabulary

**Triggers**: delve, leverage (verb), unlock, foster, elevate, enhance, seamless, robust, holistic, synergy, paradigm, tapestry, testament, landscape (figurative), journey (figurative), navigate complexities, game-changer, cutting-edge, realm, embark.

- ❌ Let's delve into how to leverage this robust solution.
- ✅ Here is how the tool works and when it pays off.

### Negative parallelism

**Triggers**: not just X, but Y; it's not merely X, it's Y; more than X, it's Y; goes far beyond X.

### Throat-clearing

**Triggers**: it's worth noting that, it's important to remember, needless to say, in today's fast-paced world, in the ever-evolving landscape of.

Usually deletable with zero loss.

### Rule of three

**Trigger**: `X, Y, and Z` tricolon in paragraph after paragraph.

### Significance claiming

**Triggers**: stands as a testament to, plays a vital role in, serves as a reminder, underscores the importance of, marks a pivotal moment.

The text asserts that something matters instead of showing it.

### Formulaic conclusion

**Triggers**: in conclusion, to sum up, in summary, ultimately, at the end of the day.

### Vague attribution

**Triggers**: studies show, experts say, research suggests, it is widely believed.

### Formatting tells

- Decorative emoji as section markers (⚠ ℹ ✔ ✖ as real signposts are fine).
- Title Case in H2 and below. An H1 document title in Title Case is ordinary.
- Bold scattered on every other phrase without hierarchy.

### Translated-from-PT tells

Frases que denunciam que o texto EN nasceu em português:

- `Realize` no sentido de "realizar/executar" (EN: *carry out*, *run*).
- `Actually` no sentido de "atualmente" (EN: *currently*).
- `Pretend` no sentido de "pretender" (EN: *intend*).
- Sujeito omitido em frase que precisa dele em inglês.
- Sentença longuíssima com vírgulas empilhadas onde EN pediria ponto final.
