export type Language = { name: { pt: string; en: string }; level: { pt: string; en: string } }

export const languages: Language[] = [
  { name: { pt: 'Português', en: 'Portuguese' }, level: { pt: 'Nativo', en: 'Native' } },
  {
    name: { pt: 'Inglês', en: 'English' },
    level: {
      pt: 'Leitura e escrita técnica fluentes; conversação em desenvolvimento',
      en: 'Fluent technical reading and writing; conversational skills developing',
    },
  },
]
