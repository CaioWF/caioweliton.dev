import type { Locale } from '@/lib/i18n/locales'
import { SectionHeading } from '@/components/sections/section-heading'

const TAGS = ['Clean Architecture', 'AWS', 'AI/NLP', 'Liderança Técnica', 'Microserviços']

export function About({ locale }: { locale: Locale }) {
  const copy = {
    pt: [
      'Engenheiro de software do Ceará com foco em back-end, arquitetura e cloud. Trabalho com Node.js, TypeScript e AWS há 5 anos — da internship a sênior, sempre na mesma direção: sistemas que escalam sem dor de cabeça.',
      'Atualmente estudo Clean Architecture, AWS avançado e AI aplicada a dev. Faço pós em liderança técnica porque código é só metade do trabalho.',
      'Fora do terminal: cozinha, caminhada e games.',
    ],
    en: [
      'Software engineer from Ceará, Brazil, focused on back-end, architecture and cloud. Five years with Node.js, TypeScript and AWS — from intern to senior, always the same direction: systems that scale without headaches.',
      'Currently studying Clean Architecture, advanced AWS and AI applied to dev. Pursuing a postgrad in technical leadership because code is only half the job.',
      'Away from the terminal: cooking, walking and games.',
    ],
  }[locale]

  return (
    <section id="about" className="px-6 py-20">
      <SectionHeading index="01" label={locale === 'pt' ? 'Sobre' : 'About'} title={locale === 'pt' ? 'Quem sou eu' : 'Who I am'} />
      <div className="max-w-2xl space-y-4 text-stone-400 leading-relaxed">
        {copy.map((p, i) => <p key={i}>{p}</p>)}
      </div>
      <div className="mt-7 flex flex-wrap gap-2">
        {TAGS.map((t) => (
          <span key={t} className="font-mono text-xs text-amber-300 border border-amber-900/50 bg-amber-950/30 rounded px-3 py-1">{t}</span>
        ))}
      </div>
    </section>
  )
}
