export type UsesItem = { name: string; note: { pt: string; en: string } }
export type UsesCategory = { label: { pt: string; en: string }; items: UsesItem[] }

export const uses: UsesCategory[] = [
  {
    label: { pt: 'Editor & Terminal', en: 'Editor & Terminal' },
    items: [
      { name: 'VS Code', note: { pt: 'editor principal', en: 'main editor' } },
      { name: 'Zsh', note: { pt: 'shell', en: 'shell' } },
    ],
  },
  {
    label: { pt: 'Ferramentas', en: 'Tools' },
    items: [
      { name: 'Insomnia', note: { pt: 'cliente REST', en: 'REST client' } },
      { name: 'TablePlus', note: { pt: 'banco de dados', en: 'database' } },
      { name: 'Docker', note: { pt: 'containers', en: 'containers' } },
    ],
  },
  {
    label: { pt: 'Hardware', en: 'Hardware' },
    items: [
      { name: '— preencher —', note: { pt: 'máquina principal', en: 'main machine' } },
    ],
  },
]
