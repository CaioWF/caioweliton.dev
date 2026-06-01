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
    role: { pt: 'Desenvolvedor de Software Sênior', en: 'Senior Software Developer' },
    period: { pt: '2022 — atual', en: '2022 — present' },
    bullets: {
      pt: [
        'Arquitetura de APIs RESTful e microserviços com Node.js + TypeScript.',
        'Otimização de infra AWS (Lambda, SQS, ECS/EKS, CloudWatch) — custo e latência.',
        'Mentoring de devs júnior/pleno: code review, pair programming, trilhas.',
        'Hackathon winner com solução em AWS.',
      ],
      en: [
        'RESTful API and microservices architecture with Node.js + TypeScript.',
        'AWS infra optimization (Lambda, SQS, ECS/EKS, CloudWatch) — cost and latency.',
        'Mentoring junior/mid devs: code review, pair programming, growth tracks.',
        'Hackathon winner with an AWS solution.',
      ],
    },
    stack: ['Node.js', 'TypeScript', 'AWS', 'Docker', 'Redis', 'Datadog'],
  },
  {
    company: 'Casa Magalhães',
    role: { pt: 'Desenvolvedor de Software (Júnior → Pleno)', en: 'Software Developer (Junior → Mid)' },
    period: { pt: '2020 — 2022', en: '2020 — 2022' },
    bullets: {
      pt: [
        'Desenvolvimento full-stack com integração AWS.',
        'Aplicações back-end conteinerizadas (Docker), soluções cloud-native.',
      ],
      en: [
        'Full-stack development with AWS integration.',
        'Dockerized back-end apps, cloud-native solutions.',
      ],
    },
    stack: ['Node.js', 'JavaScript', 'AWS', 'Docker'],
  },
]
