export type SkillCategory = {
  label: { pt: string; en: string }
  icon: string
  items: string[]
}

export const skills: SkillCategory[] = [
  {
    label: { pt: 'Back-end', en: 'Back-end' },
    icon: '⚙',
    items: ['Node.js', 'TypeScript', 'NestJS', 'Microserviços', 'REST APIs', 'Redis', 'SQL'],
  },
  {
    label: { pt: 'Cloud & DevOps', en: 'Cloud & DevOps' },
    icon: '☁',
    items: ['AWS Lambda', 'ECS/EKS', 'SQS', 'S3', 'API Gateway', 'Docker', 'CI/CD', 'Datadog'],
  },
  {
    label: { pt: 'Front-end', en: 'Front-end' },
    icon: '▢',
    items: ['React', 'Next.js', 'Vue.js', 'Tailwind', 'HTML/CSS'],
  },
  {
    label: { pt: 'Liderança & Processo', en: 'Leadership & Process' },
    icon: '◇',
    items: ['Mentoring', 'Code Review', 'Clean Architecture', 'Agile', 'AI/NLP'],
  },
]
