import type { CvModel } from './model'

// Remove marcadores de ênfase (**bold**) — a Gupy lê texto puro.
const strip = (s: string) => s.replace(/\*\*/g, '')

/**
 * CvModel -> texto puro pronto pra colar nos campos da Gupy (Resumo, Experiência,
 * Habilidades). A Gupy (Gaia) ordena candidatos lendo esses campos digitados, não só
 * o PDF anexado — por isso a saída em texto é separada do render em PDF.
 */
export function renderCvText(cv: CvModel): string {
  const L: string[] = []
  L.push(cv.name)
  L.push(cv.role)
  L.push([cv.email, cv.phone, cv.location, cv.website, cv.github, cv.linkedin].join(' | '))

  L.push('', 'RESUMO', strip(cv.summary))

  L.push('', 'EXPERIÊNCIA')
  for (const j of cv.experience) {
    L.push(`${j.company} (${j.period})`)
    for (const r of j.roles) {
      L.push(`  ${r.role} (${r.period})`)
      for (const b of r.bullets) L.push(`  - ${strip(b)}`)
    }
    L.push('')
  }

  L.push('COMPETÊNCIAS')
  for (const c of cv.skills) L.push(`${c.label}: ${c.items.join(', ')}`)

  L.push('', 'FORMAÇÃO')
  for (const e of cv.education) L.push(`${e.degree} - ${e.school} (${e.period})${e.note ? ` - ${e.note}` : ''}`)

  L.push('', 'IDIOMAS')
  for (const l of cv.languages) L.push(`${l.name}: ${l.level}`)

  L.push('', 'CERTIFICAÇÕES & PRÊMIOS')
  for (const a of cv.awards) L.push(`- ${a}`)

  if (cv.projects.length) {
    L.push('', 'PROJETOS')
    for (const p of cv.projects) {
      L.push(`${p.name}${p.link ? ` (${p.link})` : ''}`)
      L.push(strip(p.description))
      L.push(p.stack.join(', '), '')
    }
  }

  return L.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n'
}
