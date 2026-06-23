import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { site } from '@/data/site'
import { isLocale, type Locale } from '@/lib/i18n/locales'
import { getDictionary } from '@/lib/i18n/dictionaries'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Caio Weliton — Senior Software Engineer'

const fontsDir = join(process.cwd(), 'lib/og/fonts')

export default async function OgImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const l: Locale = isLocale(locale) ? (locale as Locale) : 'pt'
  const dict = await getDictionary(l)

  const [fraunces, jetBrainsMono, avatar] = await Promise.all([
    readFile(join(fontsDir, 'fraunces-400.woff')),
    readFile(join(fontsDir, 'jetbrains-mono-400.woff')),
    readFile(join(process.cwd(), 'public/profile.png')),
  ])
  const avatarSrc = `data:image/png;base64,${avatar.toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
          justifyContent: 'space-between', padding: 72, background: '#0a0a0f',
        }}
      >
        <div style={{ color: '#34d399', fontSize: 26, fontFamily: 'JetBrains Mono' }}>~/caio $ whoami</div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            <img
              src={avatarSrc}
              width={132}
              height={175}
              alt=""
              style={{ borderRadius: 12, objectFit: 'cover', objectPosition: '50% 20%', border: '2px solid rgba(52,211,153,0.5)' }}
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', color: '#f5f5f7', fontSize: 64, lineHeight: 1, fontFamily: 'Fraunces' }}>{site.name}</div>
              <div style={{ color: '#a1a1aa', fontSize: 28, marginTop: 10, fontFamily: 'JetBrains Mono' }}>{site.role[l]}</div>
            </div>
          </div>

          <div style={{ display: 'flex', color: '#e5e7eb', fontSize: 38, lineHeight: 1.25, marginTop: 36, fontFamily: 'Fraunces' }}>
            {dict.hero.tagline}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 12 }}>
            {['Node.js', 'NestJS', 'AWS'].map((t) => (
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
          <div style={{ color: '#a1a1aa', fontSize: 24, fontFamily: 'JetBrains Mono' }}>caioweliton.dev</div>
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
