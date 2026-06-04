export type SkillCategory = {
  label: { pt: string; en: string }
  icon: string
  items: { pt: string; en: string }[]
}

const same = (s: string) => ({ pt: s, en: s })

export const skills: SkillCategory[] = [
  {
    label: { pt: 'Back-end', en: 'Back-end' },
    icon: '⚙',
    items: [same('Node.js'), same('TypeScript'), same('NestJS'), same('REST APIs'), { pt: 'Microserviços', en: 'Microservices' }, same('Jest')],
  },
  {
    label: { pt: 'AWS', en: 'AWS' },
    icon: '☁',
    items: [same('Lambda'), same('ECS'), same('S3'), same('SQS'), same('RDS'), same('EventBridge'), same('API Gateway'), same('CloudWatch'), same('Cognito'), same('SES'), same('CloudFormation'), same('Location Service')],
  },
  {
    label: { pt: 'Dados', en: 'Data' },
    icon: '◆',
    items: [same('MySQL'), same('PostgreSQL'), same('Prisma'), same('Redis')],
  },
  {
    label: { pt: 'Front-end', en: 'Front-end' },
    icon: '◈',
    items: [same('React'), same('Vue.js')],
  },
  {
    label: { pt: 'DevOps', en: 'DevOps' },
    icon: '⎈',
    items: [same('Docker'), same('Git'), same('CI/CD')],
  },
  {
    label: { pt: 'Arquitetura & Liderança', en: 'Architecture & Leadership' },
    icon: '◇',
    items: [same('Clean Architecture'), { pt: 'Design de Soluções', en: 'Solution Design' }, { pt: 'Liderança Técnica', en: 'Technical Leadership' }, same('Code Review'), { pt: 'Mentoria', en: 'Mentoring' }, same('Agile')],
  },
  {
    label: { pt: 'IA', en: 'AI' },
    icon: '✦',
    items: [same('Claude Code'), same('Cursor'), same('Copilot'), same('Prompt Engineering'), same('LLM APIs'), same('MCP'), same('Agentic Workflows')],
  },
]
