import type { Locale } from '@/lib/i18n/locales'
import type { PostMeta } from '@/lib/blog/types'

// Posts que moram fora (Medium, blog antigo, etc). Aparecem na listagem misturados
// com os posts internos (MDX), mas abrem em nova aba via externalUrl.
// Preencher com: { slug, title, date 'yyyy-mm-dd', description, tags, externalUrl, source }
export const externalPosts: Record<Locale, PostMeta[]> = {
  pt: [
    {
      slug: 'servidor-web-node-typescript',
      title: 'Criando um servidor web simples com Node.js e TypeScript',
      date: '2023-05-19',
      description: 'Passo a passo pra subir um servidor web básico em Node.js com TypeScript, da configuração aos testes.',
      tags: ['Node.js', 'TypeScript'],
      externalUrl: 'https://medium.com/@devDependencies/criando-um-servidor-web-simples-usando-node-js-e-typescript-node-js-v18-bf03816e54b',
      source: 'Medium',
    },
    {
      slug: 'ia-no-desenvolvimento-de-software',
      title: 'A IA no desenvolvimento de software: quando a máquina escreve código',
      date: '2023-05-22',
      description: 'Como a IA generativa acelera o desenvolvimento e por que a expertise humana continua essencial.',
      tags: ['IA', 'Generative AI'],
      externalUrl: 'https://medium.com/@devDependencies/a-ia-no-desenvolvimento-de-software-quando-a-máquina-escreve-código-d8a349bcba5b',
      source: 'Medium',
    },
    {
      slug: 'testes-automatizados-backend-node',
      title: 'Testes automatizados no desenvolvimento backend com Node.js',
      date: '2023-05-26',
      description: 'Conceitos e estratégias de testes automatizados pra backends Node.js, com Jest e Supertest.',
      tags: ['Node.js', 'Testing'],
      externalUrl: 'https://medium.com/@devDependencies/testes-automatizados-no-desenvolvimento-backend-com-node-js-359de68bf8b9',
      source: 'Medium',
    },
    {
      slug: 'chat-tempo-real-node-socketio',
      title: 'Construindo um chat em tempo real com Node.js, Socket.io, React e TypeScript',
      date: '2023-06-02',
      description: 'Uma jornada construindo um chat em tempo real com Node.js, Socket.io, React e TypeScript.',
      tags: ['Node.js', 'Socket.io'],
      externalUrl: 'https://medium.com/@devDependencies/explorando-novas-dimensões-construindo-um-chat-em-tempo-real-com-node-js-9286a4856dd4',
      source: 'Medium',
    },
    {
      slug: 'usar-ia-generativa-da-melhor-forma',
      title: 'Como usar IA generativa da melhor forma',
      date: '2025-03-22',
      description: 'Guia prático pra extrair o melhor das ferramentas de IA generativa com bons prompts e uso responsável.',
      tags: ['IA Generativa', 'IA'],
      externalUrl: 'https://medium.com/@devDependencies/como-usar-ia-generativa-da-melhor-forma-f68fdbd5d8b2',
      source: 'Medium',
    },
  ],
  en: [],
}
