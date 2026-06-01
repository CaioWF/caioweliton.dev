import { ImageResponse } from 'next/og'
import { site } from '@/data/site'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Caio Weliton — Senior Software Engineer'

export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
          justifyContent: 'center', padding: 80, background: '#1c1917',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ color: '#d97706', fontSize: 28, fontFamily: 'monospace', marginBottom: 16 }}>~/caio $ whoami</div>
        <div style={{ color: '#fafaf9', fontSize: 80, fontWeight: 700, lineHeight: 1 }}>{site.name}</div>
        <div style={{ color: '#a8a29e', fontSize: 36, marginTop: 16 }}>{site.role.en}</div>
        <div style={{ display: 'flex', gap: 16, marginTop: 40 }}>
          {['Node.js', 'AWS', 'TypeScript'].map((t) => (
            <div key={t} style={{ color: '#fed7aa', fontSize: 24, fontFamily: 'monospace', border: '1px solid #44403c', borderRadius: 8, padding: '8px 20px' }}>{t}</div>
          ))}
        </div>
      </div>
    ),
    size,
  )
}
