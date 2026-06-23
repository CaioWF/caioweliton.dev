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
      pt: 'SaaS de bolão da Copa 2026: cria bolão em segundos, convite por link, ranking ao vivo e upgrade premium. Auth, e-mails transacionais e LGPD completos.',
      en: 'World Cup 2026 betting-pool SaaS: create a pool in seconds, invite by link, live ranking and premium upgrades. Full auth, transactional emails and LGPD compliance.',
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
      pt: 'Modernização de sistema legado para sustentar picos de alta concorrência, com milhares de operações de estoque simultâneas, sem overselling e respeitando limites.',
      en: 'Legacy modernization to sustain high-concurrency spikes with thousands of concurrent inventory operations, no overselling, stock limits enforced.',
    },
    stack: ['NestJS', 'Node.js', 'React', 'AWS', 'MariaDB'],
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
  {
    slug: 'support-board-integration',
    title: 'Integração atendimento × board',
    type: 'profissional',
    description: {
      pt: 'Integração serverless entre uma plataforma de atendimento ao cliente e um quadro de gestão de trabalho. Uma Lambda sincronizava chamados e tarefas entre os dois sistemas, e um dashboard cruzava esses dados para dar uma visão única da operação.',
      en: 'Serverless integration between a customer-service platform and a work-management board. A Lambda synced tickets and tasks across both systems, and a dashboard cross-referenced the data into a single view of the operation.',
    },
    stack: ['Node.js', 'AWS Lambda', 'API Gateway', 'JavaScript', 'HTML/CSS'],
  },
  {
    slug: 'multi-tenant-backoffice',
    title: 'Suíte multi-tenant de retaguarda',
    type: 'profissional',
    description: {
      pt: 'Aplicação multi-tenant que orquestrava vários sistemas de retaguarda sob um único modelo de tenant. Cobria do cadastro de produtos à gestão fiscal e ao financeiro, com cada cliente isolado e governado pelo seu próprio tenant.',
      en: 'Multi-tenant application orchestrating several back-office systems under a single tenant model. It spanned from product registration to tax management and finance, with each client isolated and governed by its own tenant.',
    },
    stack: ['Node.js', 'Vue.js', 'AWS Lambda', 'Amazon SQS', 'Amazon Cognito', 'AWS CloudFormation'],
  },
]
