// CLI local do CV (roda via `tsx`). NÃO exposto na web — a rota pública serve só o default.
//
//   pnpm cv                       -> PDF default (pt)
//   pnpm cv --locale=en           -> PDF default (en)
//   pnpm cv --format=gupy         -> texto puro pra colar na Gupy
//   pnpm cv --tailored            -> PDF da variante por vaga (data/cv-tailored.local.ts)
//   pnpm cv --tailored --format=gupy
//
// A variante (cv-tailored.local.ts) é montada por vaga pelo Claude Code a partir da JD,
// é gitignored e descartável. Saída vai pra cv-out/ (gitignored).
import { writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { CvModel } from '../lib/cv/model'
import { buildCvModel, cvFileName } from '../lib/cv/model'
import { renderCv } from '../lib/cv/cv-document'
import { renderCvText } from '../lib/cv/render-gupy'
import { isLocale, type Locale } from '../lib/i18n/locales'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const args = process.argv.slice(2)
const has = (n: string) => args.includes(`--${n}`)
const opt = (n: string, d: string) => {
  const a = args.find((x) => x.startsWith(`--${n}=`))
  return a ? a.slice(n.length + 3) : d
}

const raw = opt('locale', 'pt')
const locale: Locale = isLocale(raw) ? raw : 'pt'
const format = opt('format', 'pdf')
const tailored = has('tailored')

async function loadModel(): Promise<CvModel> {
  if (!tailored) return buildCvModel(locale)
  try {
    // Caminho em variável: o arquivo é opcional/gitignored, então o tsc não deve
    // resolvê-lo estaticamente (a resolução acontece em runtime, via tsx).
    const tailoredPath = '../data/cv-tailored.local.ts'
    const mod = await import(tailoredPath)
    const model = mod.cvTailored ?? mod.default
    if (!model) throw new Error('exporte `cvTailored: CvModel`')
    return model as CvModel
  } catch (e) {
    console.error('[cv] --tailored: falta data/cv-tailored.local.ts (gitignored).')
    console.error('     Esse arquivo é montado por vaga: cole a descrição da vaga pro Claude Code gerar.')
    console.error('     Detalhe:', (e as Error).message)
    process.exit(1)
  }
}

async function main() {
  const model = await loadModel()
  const outDir = join(root, 'cv-out')
  mkdirSync(outDir, { recursive: true })

  if (format === 'gupy') {
    const name = opt('out', `${tailored ? 'cv-tailored' : 'cv'}-${locale}.gupy.txt`)
    const path = join(outDir, name)
    writeFileSync(path, renderCvText(model))
    console.log('[cv] Gupy (texto) ->', path)
  } else {
    const buf = await renderCv(model, locale)
    const name = opt('out', tailored ? `cv-tailored-${locale}.pdf` : cvFileName(locale))
    const path = join(outDir, name)
    writeFileSync(path, buf)
    console.log('[cv] PDF ->', path)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
