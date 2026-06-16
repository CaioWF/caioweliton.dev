export type EmphasisSegment = { text: string; bold: boolean }

// Divide uma string em segmentos, marcando como bold o que estiver entre **...**.
// Usado por CV (PDF) e pela seção de experiência do site, pra que o marcador
// nunca apareça literal no texto renderizado.
export function parseEmphasis(input: string): EmphasisSegment[] {
  const parts = input.split(/\*\*(.+?)\*\*/g)
  const segments: EmphasisSegment[] = []
  parts.forEach((part, i) => {
    if (part === '') return
    segments.push({ text: part, bold: i % 2 === 1 })
  })
  return segments
}
