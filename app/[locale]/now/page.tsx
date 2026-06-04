import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLocale, type Locale } from '@/lib/i18n/locales'
import { buildMetadata } from '@/lib/seo/metadata'
import { now } from '@/data/now'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const l = isLocale(locale) ? (locale as Locale) : 'pt'
  return buildMetadata({
    locale: l, path: '/now',
    title: 'Now — Caio Weliton',
    description: l === 'pt' ? 'O que estou fazendo agora.' : 'What I am doing now.',
  })
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="font-mono text-xs tracking-[0.15em] text-accent mb-2">▹ {label}</h2>
      <div className="text-muted leading-relaxed">{children}</div>
    </div>
  )
}

export default async function NowPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const l = locale as Locale

  return (
    <section className="px-6 py-20 max-w-2xl">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-1">Now</h1>
      <p className="font-mono text-xs text-faint mb-10">
        {l === 'pt' ? 'Atualizado em' : 'Updated'} {now.updated}
      </p>
      <Block label={l === 'pt' ? 'TRABALHANDO' : 'WORKING'}>{now.working[l]}</Block>
      <Block label={l === 'pt' ? 'ESTUDANDO' : 'STUDYING'}>
        <ul className="space-y-1.5">
          {now.studying[l].map((item) => (
            <li key={item} className="flex gap-2"><span className="text-faint">→</span>{item}</li>
          ))}
        </ul>
      </Block>
      {/* <Block label={l === 'pt' ? 'LENDO' : 'READING'}>{now.reading[l]}</Block> */}
      <Block label={l === 'pt' ? 'FORA DO TRABALHO' : 'OFF WORK'}>{now.offwork[l]}</Block>
      <p className="mt-10 text-faint text-xs italic">
        {l === 'pt' ? 'Inspirado no nownownow.com do Derek Sivers.' : 'Inspired by Derek Sivers nownownow.com.'}
      </p>
    </section>
  )
}
