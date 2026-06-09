import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { isLocale, locales, type Locale } from '@/lib/i18n/locales'
import { getAllPosts, getPostSlugs } from '@/lib/blog/posts'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Caio Weliton — Blog'

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = []
  for (const locale of locales) {
    for (const slug of await getPostSlugs(locale)) params.push({ locale, slug })
  }
  return params
}

const fontsDir = join(process.cwd(), 'lib/og/fonts')

export default async function OgImage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  const l: Locale = isLocale(locale) ? (locale as Locale) : 'pt'
  const post = (await getAllPosts(l)).find((p) => p.slug === slug)
  const title = post?.title ?? 'Caio Weliton'
  const tags = post?.tags?.slice(0, 3) ?? []

  const [fraunces, jetBrainsMono] = await Promise.all([
    readFile(join(fontsDir, 'fraunces-400.woff')),
    readFile(join(fontsDir, 'jetbrains-mono-400.woff')),
  ])

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
          justifyContent: 'space-between', padding: 72, background: '#0a0a0f',
        }}
      >
        <div style={{ color: '#34d399', fontSize: 26, fontFamily: 'JetBrains Mono' }}>~/caio/blog $ cat</div>

        <div style={{ display: 'flex', color: '#f5f5f7', fontSize: 68, lineHeight: 1.15, fontFamily: 'Fraunces' }}>{title}</div>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 12 }}>
            {tags.map((t) => (
              <div
                key={t}
                style={{
                  color: '#34d399', fontSize: 22, fontFamily: 'JetBrains Mono',
                  border: '1px solid rgba(52,211,153,0.4)', background: 'rgba(52,211,153,0.1)',
                  borderRadius: 8, padding: '6px 16px',
                }}
              >
                {t}
              </div>
            ))}
          </div>
          <div style={{ color: '#a1a1aa', fontSize: 24, fontFamily: 'JetBrains Mono' }}>Caio Weliton · caioweliton.dev</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Fraunces', data: fraunces, weight: 400, style: 'normal' },
        { name: 'JetBrains Mono', data: jetBrainsMono, weight: 400, style: 'normal' },
      ],
    },
  )
}
