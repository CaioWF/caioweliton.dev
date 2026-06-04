export type UsesItem = { name: string; note: { pt: string; en: string } }
export type UsesCategory = { label: { pt: string; en: string }; items: UsesItem[] }

export const uses: UsesCategory[] = [
  {
    label: { pt: 'Editor & Terminal', en: 'Editor & Terminal' },
    items: [
      { name: 'VS Code', note: { pt: 'editor principal', en: 'main editor' } },
      { name: 'WSL2', note: { pt: 'ambiente de dev', en: 'dev environment' } },
      { name: 'Zsh', note: { pt: 'shell', en: 'shell' } },
      { name: 'Oh My Zsh', note: { pt: 'config do shell', en: 'shell config' } },
    ],
  },
  {
    label: { pt: 'Ferramentas', en: 'Tools' },
    items: [
      { name: 'Postman', note: { pt: 'cliente de API', en: 'API client' } },
      { name: 'DBeaver', note: { pt: 'banco de dados', en: 'database' } },
      { name: 'Docker', note: { pt: 'containers', en: 'containers' } },
      { name: 'nvm', note: { pt: 'versões de Node', en: 'Node versions' } },
      { name: 'Claude Code', note: { pt: 'par de IA no terminal', en: 'AI pair in the terminal' } },
    ],
  },
]
