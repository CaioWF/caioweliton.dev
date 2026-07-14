export const site = {
  name: 'Caio Weliton',
  role: { pt: 'Engenheiro de Software Sênior', en: 'Senior Software Engineer' },
  headline: {
    pt: 'Back-ends de alta concorrência · Node.js · TypeScript · AWS · Liderança técnica',
    en: 'High-concurrency back-ends · Node.js · TypeScript · AWS · Technical leadership',
  },
  summary: {
    pt: 'Engenheiro de software sênior com {{years}}+ anos em back-end, cloud e arquitetura. Node.js, TypeScript, NestJS e AWS, com foco em sistemas de alta concorrência, pagamentos, escalabilidade e liderança técnica.',
    en: 'Senior software engineer with {{years}}+ years in back-end, cloud and architecture. Node.js, TypeScript, NestJS and AWS, focused on high-concurrency systems, payments, scalability and technical leadership.',
  },
  email: 'contato.caioweliton@gmail.com',
  location: { pt: 'Quixadá, Ceará', en: 'Quixadá, Ceará, Brazil' },
  // Início de carreira (estágio) — anos de experiência são CALCULADOS, nunca hardcoded.
  careerStart: '2020-03',
  available: true,
  socials: {
    github: 'https://github.com/caiowf',
    linkedin: 'https://www.linkedin.com/in/caio-weliton',
    medium: 'https://medium.com/@devDependencies',
  },
} as const

// Anos completos desde careerStart. Fonte única para o site (Stats) e o CV.
export function yearsOfExperience(from: string = site.careerStart): number {
  const [y, m] = from.split('-').map(Number)
  const now = new Date()
  const months = (now.getFullYear() - y) * 12 + (now.getMonth() + 1 - m)
  return Math.floor(months / 12)
}
