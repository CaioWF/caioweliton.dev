# Exemplares — posts aprovados e os movimentos que eles usam

Banco few-shot da skill `write-article`. Mesma ideia da seção "Aprovados" do `../linkedin-comments/voice-dictionary.md`: em vez de descrever a voz no abstrato, apontar pra texto real que o Caio aprovou e nomear o que ali funcionou.

**Como usar**: antes de montar o esqueleto, ler o exemplar mais próximo do ângulo escolhido e reusar os movimentos. Nunca reusar frase: copiar de exemplar é plágio de si mesmo e o leitor percebe.

**Como cresce**: quando o Caio aprovar um post, apendar uma entrada com os movimentos que aquele texto usou. Quando ele rejeitar um trecho com motivo, anotar em "Movimentos que ele rejeitou".

---

## Exemplar 1 — "Toda regra tem dois custos (você só mede um)"

`content/blog/pt/toda-regra-tem-dois-custos.mdx` · 2026-07-26 · ângulo: conceito com exemplo próprio

Post-referência pro ângulo mais comum do blog: o Caio mexeu em três coisas do projeto dele, e o texto precisa falar do **princípio**, com o projeto entrando só como ilustração. Os movimentos abaixo são o que impediu o texto de virar changelog.

### M1. Abertura: decisão concreta com reversão

Não abre com definição nem com contexto. Abre com uma coisa que o autor fez, e vira do avesso no parágrafo seguinte.

> Semana passada escrevi um scanner de prosa. [...] E deixei de fora exatamente a regra que todo mundo teria escrito primeiro: o travessão.

A reversão é o motor: o leitor esperava a regra óbvia entrar, ela não entrou, e agora ele quer saber por quê.

### M2. A dobradiça: "e isso não é sobre X"

Depois da anedota, uma frase que promove o caso particular a princípio geral. Sem ela o texto fica preso no assunto de superfície.

> Ou seja: a regra mais óbvia da lista era a única capaz de quebrar a ferramenta inteira. E isso não é sobre travessão.

Fica entre o 3º e o 5º parágrafo. É a linha que transforma "post sobre meu scanner" em "post sobre desenhar regra".

### M3. Corpo como kit de ferramentas

O miolo é um conjunto de instrumentos com nomes imperativos em paralelo:

> `Instrumento 1: rode a regra contra o seu trabalho bom`
> `Instrumento 2: meça o piso, não o teto`
> `Instrumento 3: meça o alcance, não o susto`

A forma `faça X, não Y` faz o H2 carregar a tese da seção sozinho. Quem só passa o olho nos títulos ainda leva o argumento inteiro.

### M4. Ponte de generalização em cada seção

O movimento que tira o projeto do centro. Toda seção que usa o projeto como caso fecha traduzindo o princípio pro mundo do leitor, com exemplos que ele reconhece:

> Você já viu essa falha em outros lugares sem chamar por esse nome. A regra de lint que proíbe um idioma legítimo da linguagem e enche o código de comentário de exceção. A política de segurança que bloqueia o caminho normal de trabalho e faz todo mundo aprender o caminho anormal. [...] O sintoma é sempre o mesmo: gente boa fazendo trabalho bom sendo interrompida.

Sem essa ponte, quem não usa o projeto abandona o texto. **É o movimento mais importante do exemplar.**

### M5. Lista de reconhecimento

Fragmentos curtos, artefatos que o leitor tem no próprio repo. Substitui parágrafo explicativo por reconhecimento imediato.

> `--no-verify`. `[skip ci]`. O canal de alerta que a equipe inteira silenciou. A aprovação que virou carimbo, onde a pessoa clica em "approve" antes de abrir o diff. O `# noqa` que alguém colou no topo do arquivo em 2023 e que hoje ninguém tem coragem de tirar.

Cada item precisa ser específico o bastante pra doer. "Processos burocráticos" não serve; `[skip ci]` serve.

### M6. Um número medido, seguido de fragmento

Toda seção carrega pelo menos um concreto verificável: número, comando, nome de arquivo. O número vem seco, sem adjetivo.

> Deu seis artefatos e duas aprovações. Uma palavra.

O fragmento depois do número (`Uma palavra.`) é o que dá o impacto. Adjetivo no lugar dele estragaria ("um número absurdo").

### M7. Uma analogia, desenvolvida, reusada no conceito irmão

Um mundo só (portaria) servindo dois conceitos:

- **catraca** → quem paga o guardrail é o morador, não o invasor.
- **porteiro com álbum de ladrões vs. lista de moradores** → deny-list precisa prever o futuro, allow-list não.

Reusar o mundo é melhor que abrir um novo, porque o leitor já pagou o custo de entrar nele. A terceira analogia do post (livro de reclamações do restaurante) só aparece porque é outro tipo de erro, e é a última.

### M8. Reframe no lugar de sermão

Onde o texto poderia moralizar, ele reinterpreta:

> Quando você vê a equipe contornando um guardrail, a leitura preguiçosa é indisciplina. A leitura útil é que o segundo custo ficou maior que o benefício, e alguém mediu por você, na marra.

Padrão: `a leitura preguiçosa é X. A leitura útil é Y.` Funciona porque respeita o leitor em vez de repreendê-lo.

### M9. Fecho com callback e bookend

Três peças no fim, nessa ordem:

1. **Callback ao post anterior**, quando existe linha de continuidade: *"No texto anterior eu disse que a gente devia projetar a parada antes de projetar o trabalho. Esse aqui é o irmão mais chato da mesma ideia."*
2. **Frase-resumo**, levada a sério, sem piada: *"meça o custo antes de escrever a regra."*
3. **Bookend**: a última linha resolve a imagem da abertura. O post abre no travessão e fecha nele: *"E esse texto não tem um travessão sequer. Nenhuma regra me obrigou, eu só não gosto deles."*

### Dosagem que esse post usou

- ~1650 palavras, 8 seções H2.
- 3 analogias, duas delas no mesmo mundo.
- 2 piadas, ambas no fim de parágrafo, nenhuma na abertura da tese nem na frase-resumo.
- 0 travessões.
- 3 números verificáveis, todos conferidos no repo antes de entrar no rascunho.

---

## Movimentos que ele rejeitou

Anotar aqui quando o Caio recusar um trecho com motivo.

### H2 que promete relevância em vez de entregar conteúdo
`O custo que ninguém mede` foi rejeitado como "frase típica de IA". Trocado por `Quem paga o guardrail`, que é a pergunta que a seção responde. Regra: o H2 diz o conteúdo, não anuncia importância.

### Palavra-conceito que o leitor não desempacota
`meça o raio, não o susto` foi rejeitado: "raio" sozinho não fecha em PT, lê-se como relâmpago antes de blast radius. Trocado por `alcance`, que é o verbo que o próprio parágrafo já usava. Regra: se o conceito emprestado do inglês não tem substantivo natural em PT, usar o verbo que o texto já usa.

### Anedota plausível sobre o Caio, não verificada
Rascunho inicial abria com "eu uso travessão desde antes dos LLMs", inferido em vez de checado. A memória `no-travessao-prose` e o corpus (0 travessões em 9 posts) diziam o oposto. A anedota real, tirada da design-note do projeto, era melhor. Regra: fato sobre o Caio se verifica, nunca se infere. Ver Guardrails no `SKILL.md`.
