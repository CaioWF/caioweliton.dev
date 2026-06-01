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
    slug: 'placeholder-1',
    title: 'Projeto Destaque',
    type: 'pessoal',
    description: {
      pt: 'Descrição do projeto: o que resolve e impacto. (placeholder — preencher)',
      en: 'Project description: what it solves and impact. (placeholder — fill in)',
    },
    stack: ['Node.js', 'TypeScript', 'AWS'],
    github: 'https://github.com/caiowf',
    highlight: true,
  },
  {
    slug: 'placeholder-2',
    title: 'Projeto 2',
    type: 'profissional',
    description: {
      pt: 'Trabalho profissional descrito por impacto/papel, sem expor cliente. (placeholder)',
      en: 'Professional work described by impact/role, no client exposure. (placeholder)',
    },
    stack: ['Node.js', 'AWS', 'Redis'],
  },
  {
    slug: 'placeholder-3',
    title: 'Projeto 3',
    type: 'pessoal',
    description: {
      pt: 'Outro projeto pessoal. (placeholder — preencher)',
      en: 'Another personal project. (placeholder — fill in)',
    },
    stack: ['React', 'TypeScript'],
    github: 'https://github.com/caiowf',
  },
]
