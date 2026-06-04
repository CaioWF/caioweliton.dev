import { isLocale, locales, type Locale } from '@/lib/i18n/locales'
import { buildCvModel, cvFileName } from '@/lib/cv/model'
import { renderCv } from '@/lib/cv/cv-document'

export const runtime = 'nodejs'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function GET(_req: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const l: Locale = isLocale(locale) ? (locale as Locale) : 'pt'

  const buffer = await renderCv(buildCvModel(l), l)

  return new Response(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${cvFileName(l)}"`,
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
