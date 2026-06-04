export type Job = {
  company: string
  role: { pt: string; en: string }
  period: { pt: string; en: string }
  bullets: { pt: string[]; en: string[] }
  stack: string[]
}

export const experience: Job[] = [
  {
    company: 'Compass UOL',
    role: { pt: 'Desenvolvedor de Software (Pleno → Sênior)', en: 'Software Developer (Mid → Senior)' },
    period: { pt: 'jan 2022 - atual (Sênior desde set 2022)', en: 'Jan 2022 - Present (Senior since Sep 2022)' },
    bullets: {
      pt: [
        'Arquitetura de APIs RESTful e microserviços dockerizados com Node.js + TypeScript.',
        'Modernização de sistemas legados para alta concorrência: até 20 mil requisições em 15 min com integridade de estoque sob acessos concorrentes (sem overselling).',
        'Soluções cloud-native em AWS (Lambda, ECS/EKS, SQS, S3, RDS) e cache com Redis.',
        'Mentoria de devs júnior/pleno: code review, pair programming e trilhas de crescimento.',
      ],
      en: [
        'RESTful API and dockerized microservices architecture with Node.js + TypeScript.',
        'Legacy modernization for high concurrency: up to 20k requests in 15 min with stock integrity under concurrent access (no overselling).',
        'Cloud-native solutions on AWS (Lambda, ECS/EKS, SQS, S3, RDS) and Redis caching.',
        'Mentoring junior/mid devs: code review, pair programming and growth tracks.',
      ],
    },
    stack: ['Node.js', 'MySQL', 'NestJS', 'AWS', 'Git', 'Docker', 'Amazon CloudWatch', 'Amazon ECS', 'Jest', 'Amazon Cognito', 'Amazon S3', 'Lambda', 'EventBridge', 'SQS', 'RDS', 'API Gateway', 'Location Service'],
  },
  {
    company: 'Grupo Casa Magalhães',
    role: { pt: 'Desenvolvedor de Software (Estágio → Júnior)', en: 'Software Developer (Intern → Junior)' },
    period: { pt: 'mar 2020 - jan 2022', en: 'Mar 2020 - Jan 2022' },
    bullets: {
      pt: [
        'Desenvolvimento full-stack com Node.js e Vue.js.',
        'Serviços REST integrados à AWS (Lambda, API Gateway, S3, DynamoDB).',
        'Documentação, testes e colaboração cross-functional ao longo do ciclo.',
      ],
      en: [
        'Full-stack development with Node.js and Vue.js.',
        'REST services integrated with AWS (Lambda, API Gateway, S3, DynamoDB).',
        'Documentation, testing and cross-functional collaboration across the lifecycle.',
      ],
    },
    stack: ['Node.js', 'Amazon S3', 'AWS Lambda', 'Vue.js', 'Amazon SQS', 'AWS CloudFormation', 'Amazon Cognito', 'Jest', 'SES'],
  },
]
