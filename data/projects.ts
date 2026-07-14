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
      pt: 'SaaS de bolão da Copa 2026: cria bolão em segundos, convite por link, ranking ao vivo e upgrade premium via Mercado Pago. Autenticação (Clerk), e-mails transacionais e privacy by design: dados de pagamento ficam no gateway, não na aplicação (LGPD).',
      en: 'World Cup 2026 betting-pool SaaS: create a pool in seconds, invite by link, live ranking and premium upgrade via Mercado Pago. Auth (Clerk), transactional emails and privacy by design: payment data stays in the gateway, not the application (LGPD).',
    },
    stack: ['NestJS', 'Prisma', 'PostgreSQL', 'React', 'TypeScript', 'Clerk', 'Mercado Pago'],
    live: 'https://ibolao.cqlabs.com.br',
    highlight: true,
  },
  {
    slug: 'keel',
    title: 'Keel',
    type: 'pessoal',
    description: {
      pt: 'Scaffolder de desenvolvimento spec-driven (SDD) zero-dependência: instala em qualquer projeto o fluxo completo spec -> plano -> gates -> review via templates, skills e hooks/gates mecânicos (phase-gate default-deny, pre-commit, doc-gate) que impõem a disciplina a agentes de IA (Claude Code, Codex, Cursor, Copilot).',
      en: 'Zero-dependency spec-driven development (SDD) scaffolder: drops the full spec -> plan -> gates -> review flow into any project via templates, skills and mechanical hooks/gates (default-deny phase gate, pre-commit, doc gate) that enforce discipline on AI coding agents (Claude Code, Codex, Cursor, Copilot).',
    },
    stack: ['Spec-Driven Development', 'Agentic Workflows', 'Claude Code'],
    github: 'https://github.com/CaioWF/keel',
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
