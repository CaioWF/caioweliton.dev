export type Education = {
  degree: { pt: string; en: string }
  school: string
  period: string
  note?: { pt: string; en: string }
}

export const education: Education[] = [
  {
    degree: { pt: 'Pós-graduação em Liderança Técnica', en: 'Postgrad in Technical Leadership' },
    school: 'Full Cycle',
    period: '2024 - 2025',
  },
  {
    degree: { pt: 'Bacharelado em Engenharia de Software', en: 'BSc in Software Engineering' },
    school: 'Universidade Federal do Ceará (UFC)',
    period: '2017 - 2020',
    note: { pt: 'Magna Cum Laude', en: 'Magna Cum Laude' },
  },
]
