// @vitest-environment node
import { test, expect } from 'vitest'
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs'
import { buildCvModel } from './model'
import { renderCv } from './cv-document'

async function extractText(buf: Buffer): Promise<string> {
  const doc = await getDocument({
    data: new Uint8Array(buf),
    useSystemFonts: false,
  }).promise
  let out = ''
  for (let p = 1; p <= doc.numPages; p++) {
    const page = await doc.getPage(p)
    const content = await page.getTextContent()
    out += content.items.map((i: any) => i.str).join(' ') + '\n'
  }
  return out
}

async function extract(locale: 'pt' | 'en'): Promise<string> {
  return extractText(await renderCv(buildCvModel(locale), locale))
}

test('CV pt: ligadura, contato, ordem, grafia e keywords', async () => {
  const text = await extract('pt')

  // 1. Fonte não corrompe ligaduras fi/fl
  expect(text).not.toMatch(/Defni|confgura|identifca|certifca|perfl|\bflas\b|efcien|especifca/i)

  // 2. Grafia: "microsserviços" (ss), nunca "microserviços"
  expect(text).toMatch(/microsserviços/i)
  expect(text).not.toMatch(/microserviços/i)

  // 3. Contato no topo: nome, email e telefone
  const head = text.slice(0, 700)
  expect(head).toContain('Caio Weliton')
  expect(head).toContain('contato.caioweliton@gmail.com')
  expect(head).toContain('99621-2524')

  // 4. Ordem: Competências antes de Experiência; Projetos presente
  const iSkills = text.indexOf('COMPETÊNCIAS')
  const iExp = text.indexOf('EXPERIÊNCIA')
  expect(iSkills).toBeGreaterThanOrEqual(0)
  expect(iExp).toBeGreaterThan(iSkills)
  expect(text).toContain('PROJETOS')

  // 5. Métricas e keywords obrigatórias
  for (const kw of ['1M+', 'Black Friday', 'EKS', 'Pagar.me', 'Pix', 'LGPD', 'Vimeo', 'Mercado Pago', 'iBolão', 'Keel']) {
    expect(text, `keyword ausente: ${kw}`).toContain(kw)
  }
}, 45000)

test('CV: usa fonte padrão-14 (sem embedding), evita bug de ligadura ToUnicode do react-pdf', async () => {
  const buf = await renderCv(buildCvModel('pt'), 'pt')
  // react-pdf corrompe o ToUnicode de ligaduras fi/fl em QUALQUER fonte EMBUTIDA (IBM Plex,
  // Roboto etc.) -> o ATS lê "Defni/flas/fcam". Fonte padrão (Helvetica) não embute (sem
  // /FontFile) e extrai limpo. Este é o guard real; a checagem via pdfjs acima é leniente.
  expect(buf.includes('/FontFile'), 'fonte embutida reintroduz o bug de ligadura fi/fl').toBe(false)
  expect(buf.includes('Helvetica')).toBe(true)
}, 45000)

test('CV en: renderiza sem erro e mantém keywords', async () => {
  const text = await extract('en')
  expect(text).toContain('Caio Weliton')
  expect(text).toContain('Black Friday')
  expect(text).toContain('Keel')
}, 45000)
