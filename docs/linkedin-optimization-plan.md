# Plano de otimização do LinkedIn — ESTADO FINAL

> Iniciado 2026-06-05, finalizado 2026-06-06. Base: pesquisa de visibilidade em busca
> de recrutador (2026) + auditoria do PDF do perfil + conteúdo do repo (`data/*.ts`).
>
> Perfil: **PT = principal, EN = secundário** (bilíngue).
> Conteúdo gerado sem travessão (preferência do usuário).
> Todos os 10 itens cobertos. Pendências listadas no fim.

## Princípios da pesquisa (base das decisões)
- Headline + cargo atual = ~60% do peso de ranqueamento (match exato de keyword).
- Recrutador usa booleana puxando termos de vagas; precisa do termo literal no perfil.
- Atividade sobe o perfil até em busca passiva.
- Skills com endossos ranqueiam ~30% acima.
- "Open to Work" recruiter-only vira filtro do lado do Recruiter.

---

## Itens (estado final)

### ✅ 1. Descrições de experiência (EN + PT prontos)
4 cargos preenchidos com bullets + "Competências do cargo" (campo de skills do cargo,
NÃO na descrição). Métrica âncora (20k req/15min, sem overselling) só no cargo Sênior.
Stack literal repetida em cada cargo para alimentar booleana. Texto final em EN e PT-BR.

### ✅ 2. Summary / Sobre (EN + PT)
Estrutura: quem é (keyword no topo) + destaques com número + linha de adaptabilidade
+ bloco IA + linha Stack + assinatura pessoal + CTA suavizado.
- Frase de efeito ("conhecimento é poder") mantida, movida para o FIM como assinatura
  (não desperdiça a zona de ranking do topo).
- Linha de adaptabilidade final escolhida: "Domino essa stack, mas trato ferramenta como
  meio, não fim. Aprendo o que o problema exigir." / EN: "I master this stack, but I treat
  tools as means, not ends. I learn whatever the problem demands."
- CTA suavizado (usuário empregado): "Sempre aberto a trocar ideia sobre arquitetura,
  back-end e projetos com desafio técnico de verdade." (sem "aberto a oportunidades").
- 5 skills fixadas no Sobre: Node.js · TypeScript · NestJS · Amazon Web Services · Microsserviços.

### ✅ 3. Headline (EN + PT)
PT: `Engenheiro de Software Sênior | Desenvolvedor Back-end Node.js · TypeScript · NestJS | AWS · Docker | Alta concorrência e Clean Architecture`
EN: `Senior Software Engineer | Back-end Developer Node.js · TypeScript · NestJS | AWS · Docker | High-concurrency systems & Clean Architecture`
- Removido "Passion for knowledge" e empresa redundante. NestJS promovido sobre Vue.js.
- Termos duplos (Engineer/Developer + EN/PT) para cobrir mais buscas.

### ✅ 4. Skills (27, ordenadas; não dá pra fixar, só ordenar)
Lista única (compartilhada entre idiomas). Removidas duplicatas PT/EN, umbrella vagos,
soft skills genéricas, PNL, AWS long-tail, CSS/HTML/GitHub. Java e react-native removidos
(não quer vaga mobile/Java). MongoDB mantido. Ordem final (visibilidade = ordem):
```
Node.js · TypeScript · NestJS · Amazon Web Services · Microsserviços · Clean Architecture ·
Docker · REST APIs · PostgreSQL · Redis · AWS Lambda · Amazon ECS · CI/CD · Git · Jest ·
JavaScript · Express.js · MySQL · SQL · MongoDB · Prisma · Arquitetura de Software ·
React.js · Vue.js · Liderança Técnica · Prompt Engineering · APIs de LLM
```
- Endossar com prioridade as 5 primeiras (LinkedIn reordena por endossos).
- Fazer skill assessment (badge) ao menos de Node.js.

### ✅ 5. Open to Work (recruiter-only) — CONFIRMADO ATIVO
Já estava em "Apenas recrutadores", sem anel verde. Configurado via bloco "Buscando emprego".
Cargos (limite 5, mix PT/EN):
```
Senior Software Engineer · Engenheiro de Software Sênior · Backend Engineer ·
Desenvolvedor Back-end Sênior · Tech Lead
```
Local: Remoto + Brasil. Tipo: tempo integral (+ PJ se aceita). Início: flexível.

### ✅ 6. Em destaque (parcial — 2 agora, 2 depois)
Agora:
```
1. iBolão          → https://ibolao.cqlabs.com.br
2. caioweliton.dev → https://caioweliton.dev
```
Campos Título + Descrição sobrescritos (não usar auto-pull). GitHub REMOVIDO daqui (foi pro
Contato). Links de site legado (/pt-br e EN) removidos.

### ✅ 7. Informações de contato
```
1. caioweliton.dev   → Portfólio
2. github.com/caiowf → GitHub
```
Medium NÃO incluído (perfil parado/desatualizado). Email já existente.
URL do perfil já personalizada: linkedin.com/in/caio-weliton.

### ✅ 8. Formação + honras
- Magna Cum Laude: JÁ EXISTE no campo de nota da UFC ("Agraciado com o título Magna Cum
  Laude..."). Nada a fazer.
- UFC escolhida para o card de intro (peso > Full Cycle para vaga de engenharia).
- Hackathon: adicionar em "Adicionar seção do perfil" → dropdown "Adicional" →
  "Adicionar honras e prêmios". (Pendente: nome/ano do evento.)

### ✅ 9. Perfil bilíngue (PT principal + EN secundário)
Por idioma (preencher nos dois): headline, Sobre, cargos/descrições, nome do curso.
Compartilhado (uma vez): skills, Em destaque, honras, certs, publicações, foto, contato.
Conteúdo EN consolidado já gerado (headline/Sobre/bullets dos itens 1-3).

### ✅ 10. Rotina de atividade
Cadência: 1 post/semana + 2-3 comentários/semana + 1 repost comentado/quinzena.
Fontes de conteúdo: história 20k req, aprendizados AWS/NestJS, bastidor iBolão, IA no fluxo,
reescrita dos artigos Medium como posts nativos. Formato 2026: texto nativo > link externo
(link no 1º comentário), gancho na 1ª linha, 3-5 hashtags, termina com pergunta.

---

## Pendências (fazer quando der)
- [ ] **Em destaque:** adicionar 2 artigos (1 backend + 1 IA) QUANDO o portfólio novo subir.
      Apontar para `caioweliton.dev/blog` (não Medium, que está parado).
- [ ] **Honra hackathon:** preencher nome do evento + ano.
- [ ] **Deploy do portfólio novo:** a raiz `caioweliton.dev` ainda redireciona pro site
      legado EN. Trocar pelo build Next 16. URL no LinkedIn não muda (atualiza sozinho).
- [ ] **Skill assessment** de Node.js (badge verificado).
- [ ] **Endossos** nas 5 skills do topo (pedir a colegas Compass).
- [ ] **Migrar escrita** do Medium para o blog próprio (`caioweliton.dev/blog`).

## Decisões registradas
- "overselling" mantido em inglês no texto PT (termo técnico padrão).
- Bloco IA mantido no Sobre (diferencial), mas Claude Code/Cursor/MCP fora da lista de skills.
- Front (React/Vue) mantido nas skills mesmo sendo secundário.
- Cluster IA (Prompt Engineering, APIs de LLM) incluído nas skills.

## Fontes da pesquisa
- The Interview Guys — LinkedIn Keywords 2026
- CareerBldr — LinkedIn Profile Optimization Guide 2026
- Gabriel Devs — LinkedIn para Devs (2026)
- bestjobsearchapps — Recruiter Visibility 8 Steps 2026
- LinkedIn Help — Open to Work / Profile in another language / Honras e prêmios (PT)
