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

// Texto quebrado POR PÁGINA (o extractText acima achata tudo numa string só).
async function extractPages(buf: Buffer): Promise<string[][]> {
  const doc = await getDocument({ data: new Uint8Array(buf), useSystemFonts: false }).promise
  const pages: string[][] = []
  for (let p = 1; p <= doc.numPages; p++) {
    const content = await (await doc.getPage(p)).getTextContent()
    pages.push(content.items.map((i: any) => i.str).filter((t: string) => t.trim().length > 0))
  }
  return pages
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

// ATS lint (inspirado em resume-ats-beater): buzzword vazio fora, densidade de métrica preservada.
// Roda no superset default (a variante por vaga é gitignored). Guarda REGRESSÃO: impede que uma
// reescrita reintroduza jargão oco ou apague todos os números de impacto.

// Buzzwords ocos rejeitados por ATS/recrutador. Stems em minúsculo, casados no texto sem acento.
const BUZZWORDS = [
  'proativ', 'dinamic', 'resilien', 'apaixonad', 'entusiast',
  'visionari', 'guru', 'ninja', 'rockstar', 'workaholic',
  'antenad', 'mao na massa', 'orientado a resultados',
]

// Tokens de impacto quantificado (métrica real, não data).
const METRIC = /\d+\s*%|\d+\s*x\b|r\$\s?[\d.,]+|us\$\s?[\d.,]+|\d+\s*m\+|\d+\+\s*(devs|atletas|usuarios|clientes|projetos|times)/gi

function deaccent(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '')
}

test('CV lint: sem buzzword vazio (ATS)', async () => {
  const text = deaccent((await extract('pt')).toLowerCase())
  for (const b of BUZZWORDS) {
    expect(text, `buzzword oco presente: "${b}"`).not.toContain(deaccent(b))
  }
}, 45000)

test('CV lint: densidade de métrica não regride (impacto quantificado)', async () => {
  const text = deaccent(await extract('pt'))
  const hits = text.match(METRIC) ?? []
  // Piso do superset atual: "1M+" e "5+ devs". Impede reescrita que apague os números de impacto.
  expect(hits.length, `poucos marcadores de métrica: ${hits.join(', ') || 'nenhum'}`).toBeGreaterThanOrEqual(2)
}, 45000)

test('CV: usa fonte padrão-14 (sem embedding), evita bug de ligadura ToUnicode do react-pdf', async () => {
  const buf = await renderCv(buildCvModel('pt'), 'pt')
  // react-pdf corrompe o ToUnicode de ligaduras fi/fl em QUALQUER fonte EMBUTIDA (IBM Plex,
  // Roboto etc.) -> o ATS lê "Defni/flas/fcam". Fonte padrão (Helvetica) não embute (sem
  // /FontFile) e extrai limpo. Este é o guard real; a checagem via pdfjs acima é leniente.
  expect(buf.includes('/FontFile'), 'fonte embutida reintroduz o bug de ligadura fi/fl').toBe(false)
  expect(buf.includes('Helvetica')).toBe(true)
}, 45000)

// Regressão: o header de seção não pode fechar a página sozinho, com o conteúdo dele
// caindo só na página seguinte. Acontecia quando o minPresenceAhead do header era menor
// que o espaço exigido pelo primeiro bloco da seção (header pedia 48, jobHeader pedia 64).
test('CV: nenhum header de seção fica órfão no fim da página', async () => {
  const pages = await extractPages(await renderCv(buildCvModel('pt'), 'pt'))
  const HEADERS = ['COMPETÊNCIAS', 'EXPERIÊNCIA', 'FORMAÇÃO', 'IDIOMAS', 'CERTIFICAÇÕES & PRÊMIOS', 'PROJETOS']

  for (const [i, items] of pages.entries()) {
    const last = items.at(-1) ?? ''
    expect(
      HEADERS.some((h) => last.toUpperCase().includes(h)),
      `header "${last}" órfão no rodapé da página ${i + 1}`,
    ).toBe(false)
  }
}, 45000)

test('CV en: renderiza sem erro e mantém keywords', async () => {
  const text = await extract('en')
  expect(text).toContain('Caio Weliton')
  expect(text).toContain('Black Friday')
  expect(text).toContain('Keel')
}, 45000)
