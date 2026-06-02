import type { Metadata } from 'next'
import { Geist, JetBrains_Mono, Fraunces } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme/theme-provider'
import { InteractiveBackground } from '@/components/interactive-bg'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

// JetBrains Mono alimenta a var --font-geist-mono (nome mantido p/ não quebrar @theme/consumidores)
const jetbrainsMono = JetBrains_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
  style: ['normal', 'italic'],
})

export const metadata: Metadata = {
  title: 'Caio Weliton',
  description: 'Senior Software Engineer',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      suppressHydrationWarning
      className={`${geistSans.variable} ${jetbrainsMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <InteractiveBackground />
          <div className="grain" aria-hidden />
          <div className="relative z-10">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  )
}
