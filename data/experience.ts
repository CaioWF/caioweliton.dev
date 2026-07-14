export type Role = {
  title: { pt: string; en: string }
  period: { pt: string; en: string }
  bullets: { pt: string[]; en: string[] }
}

export type Job = {
  company: string
  period: { pt: string; en: string }
  roles: Role[]
  stack: string[]
}

export const experience: Job[] = [
  {
    company: 'Compass UOL',
    period: { pt: 'jan 2022 - atual', en: 'Jan 2022 - Present' },
    roles: [
      {
        title: { pt: 'Desenvolvedor de Software Sênior', en: 'Senior Software Developer' },
        period: { pt: 'set 2022 - atual', en: 'Sep 2022 - Present' },
        bullets: {
          pt: [
            'Reescrevi o fluxo de vendas para sustentar **picos de Black Friday sem overselling** em uma base de **1M+ atletas**: tabela de estoque dedicada e bloqueio de linha (SELECT ... FOR UPDATE) para serializar a baixa de estoque sob alta concorrência.',
            'Integrei **pagamentos via Pagar.me** com **webhooks idempotentes**, eliminando cobranças e baixas de estoque duplicadas.',
            'Escalei a camada de leitura com **réplicas de banco e cache Redis** sobre **Kubernetes (EKS)**, sustentando grandes volumes de requisições em janelas curtas de tráfego e tratando dados pessoais em conformidade com a **LGPD**.',
            'Entreguei features na plataforma de **educação a distância**, incluindo **streaming de vídeo (Vimeo)** para aulas sob demanda.',
            'Defini a **arquitetura de microsserviços event-driven** (SQS, EventBridge) e os padrões de projeto **adotados por múltiplos times de produto**.',
            '**Mentoria técnica de 5+ devs** júnior e pleno: code review, pair programming e definição de trilhas de crescimento.',
          ],
          en: [
            'Rebuilt the checkout flow to sustain **Black Friday peaks without overselling** on a base of **1M+ athletes**: dedicated stock table and row locking (SELECT ... FOR UPDATE) to serialize stock decrements under high concurrency.',
            'Integrated **payments via Pagar.me** with **idempotent webhooks**, eliminating duplicate charges and stock decrements.',
            'Scaled the read layer with **database replicas and Redis caching** on **Kubernetes (EKS)**, sustaining large request volumes in short traffic windows while handling personal data in compliance with **LGPD**.',
            'Delivered features on the **distance-learning platform**, including **video streaming (Vimeo)** for on-demand classes.',
            'Defined the **event-driven microservice architecture** (SQS, EventBridge) and the design patterns **adopted across multiple product teams**.',
            '**Technical mentoring for 5+ junior/mid devs**: code review, pair programming and growth tracks.',
          ],
        },
      },
      {
        title: { pt: 'Desenvolvedor de Software Pleno', en: 'Mid Software Developer' },
        period: { pt: 'jan 2022 - set 2022', en: 'Jan 2022 - Sep 2022' },
        bullets: {
          pt: [
            'Implementação de **APIs RESTful e microsserviços dockerizados** em Node.js + TypeScript, cobertos por testes automatizados (Jest).',
            'Soluções **cloud-native em AWS** (Lambda, ECS, SQS, S3, RDS) integradas a cache em Redis.',
            '**Integrações assíncronas** via filas e mensageria (SQS) para desacoplar serviços.',
          ],
          en: [
            'Built **dockerized RESTful APIs and microservices** in Node.js + TypeScript, covered by automated tests (Jest).',
            '**Cloud-native solutions on AWS** (Lambda, ECS, SQS, S3, RDS) integrated with Redis caching.',
            '**Async integrations** via queues and messaging (SQS) to decouple services.',
          ],
        },
      },
    ],
    stack: ['Node.js', 'TypeScript', 'NestJS', 'AWS', 'Kubernetes', 'Amazon EKS', 'Amazon ECS', 'Lambda', 'SQS', 'EventBridge', 'RDS', 'Amazon S3', 'API Gateway', 'Amazon CloudWatch', 'Amazon Cognito', 'Redis', 'MariaDB', 'PostgreSQL', 'Pagar.me', 'Pix', 'Vimeo', 'Docker', 'Jest', 'Git', 'Location Service'],
  },
  {
    company: 'Grupo Casa Magalhães',
    period: { pt: 'mar 2020 - jan 2022', en: 'Mar 2020 - Jan 2022' },
    roles: [
      {
        title: { pt: 'Desenvolvedor de Software Júnior', en: 'Junior Software Developer' },
        period: { pt: 'jan 2021 - jan 2022', en: 'Jan 2021 - Jan 2022' },
        bullets: {
          pt: [
            'Desenvolvi um **orquestrador multitenant** para sincronização de PDVs e dados entre lojas do varejo.',
            'Desenvolvimento **full-stack** de features: back-end em Node.js e interfaces em Vue.js.',
            'Serviços **REST serverless na AWS** (Lambda, API Gateway, S3, DynamoDB).',
            'Provisionamento de **infraestrutura como código** com AWS CloudFormation.',
          ],
          en: [
            'Built a **multitenant orchestrator** for POS and cross-store data synchronization in retail.',
            '**Full-stack** feature development: Node.js back-end and Vue.js interfaces.',
            '**Serverless REST services on AWS** (Lambda, API Gateway, S3, DynamoDB).',
            '**Infrastructure as code** with AWS CloudFormation.',
          ],
        },
      },
      {
        title: { pt: 'Estágio em Desenvolvimento de Software', en: 'Software Development Intern' },
        period: { pt: 'mar 2020 - jan 2021', en: 'Mar 2020 - Jan 2021' },
        bullets: {
          pt: [
            'Documentação técnica, **testes automatizados** e colaboração cross-functional ao longo do ciclo de desenvolvimento.',
            'Primeiras entregas em **serviços REST**, com apoio de devs sêniores.',
          ],
          en: [
            'Technical documentation, **automated testing** and cross-functional collaboration across the development lifecycle.',
            'First deliveries on **REST services**, supported by senior devs.',
          ],
        },
      },
    ],
    stack: ['Node.js', 'Vue.js', 'AWS Lambda', 'API Gateway', 'Amazon S3', 'DynamoDB', 'Amazon SQS', 'AWS CloudFormation', 'Amazon Cognito', 'Multitenant', 'Jest', 'SES'],
  },
]
