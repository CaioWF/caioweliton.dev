import type { Locale } from '@/lib/i18n/locales'
import { Tile } from '@/components/bento/tile'

const TAGS = ['Clean Architecture', 'AWS', 'AI/NLP', 'Liderança Técnica', 'Microserviços']

export function About({ locale }: { locale: Locale }) {
  const copy = {
    pt: [
      'Engenheiro de software do Ceará com foco em back-end, arquitetura e cloud. Trabalho com Node.js, TypeScript e AWS há 5 anos — da internship a sênior, sempre na mesma direção: sistemas que escalam sem dor de cabeça.',
      'Atualmente estudo Clean Architecture, AWS avançado e AI aplicada a dev. Fiz uma pós em liderança técnica porque código é só metade do trabalho.',
      'Fora do terminal: cozinha, caminhada e games.',
    ],
    en: [
      'Software engineer from Ceará, Brazil, focused on back-end, architecture and cloud. Five years with Node.js, TypeScript and AWS — from intern to senior, always the same direction: systems that scale without headaches.',
      'Currently studying Clean Architecture, advanced AWS and AI applied to dev. Completed a postgrad in technical leadership because code is only half the job.',
      'Away from the terminal: cooking, walking and games.',
    ],
  }[locale]

  return (
    <Tile id="about" label="sobre" title={locale === 'pt' ? 'Quem sou eu' : 'Who I am'} className="md:col-span-4">
      <div className="space-y-4 text-muted leading-relaxed">
        {copy.map((p, i) => <p key={i}>{p}</p>)}
      </div>
      <div className="mt-6 flex flex-wrap gap-1.5">
        {TAGS.map((t) => (
          <span key={t} className="font-mono text-[10px] text-accent bg-accent/10 border border-accent/20 rounded px-2 py-0.5">{t}</span>
        ))}
      </div>
    </Tile>
  )
}
