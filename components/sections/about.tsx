import type { Locale } from '@/lib/i18n/locales'
import { Tile } from '@/components/bento/tile'

const TAGS: { pt: string; en: string }[] = [
  { pt: 'Clean Architecture', en: 'Clean Architecture' },
  { pt: 'AWS', en: 'AWS' },
  { pt: 'Alta Concorrência', en: 'High Concurrency' },
  { pt: 'Microserviços', en: 'Microservices' },
  { pt: 'Liderança Técnica', en: 'Technical Leadership' },
]

export function About({ locale }: { locale: Locale }) {
  const copy = {
    pt: [
      'Engenheiro de software de Quixadá, Ceará. Sênior na Compass UOL, com 5+ anos construindo back-ends em Node.js, TypeScript e AWS, de APIs e microserviços a sistemas de alta concorrência.',
      'Meus últimos projetos foram modernizações de legado: reescrever sistemas críticos em stacks novas sem perder o que já rodava. No último, mantive a integridade do estoque durante picos de 20 mil requisições em 15 minutos, sem vender o que não existia.',
      'Fiz pós em liderança técnica (Full Cycle): código é metade do trabalho, a outra metade é fazer o time crescer junto. Gosto de aprender stack nova quando o problema pede. Agora estou começando em Go.',
      'Fora do terminal: cozinha, caminhada e games.',
    ],
    en: [
      'Software engineer from Quixadá, Ceará. Senior at Compass UOL, with 5+ years building back-ends in Node.js, TypeScript and AWS, from APIs and microservices to high-concurrency systems.',
      'My latest projects were legacy modernizations: rewriting critical systems on new stacks without losing what already ran. On the last one, I kept stock integrity through bursts of 20k requests in 15 minutes, with no overselling.',
      'I did a postgrad in technical leadership (Full Cycle): code is half the job, the other half is helping the team grow. I like picking up a new stack when the problem calls for it. Right now I am starting with Go.',
      'Away from the terminal: cooking, walking and games.',
    ],
  }[locale]

  return (
    <Tile id="about" label={locale === 'pt' ? 'sobre' : 'about'} className="md:col-span-4">
      <div className="space-y-4 text-muted leading-relaxed">
        {copy.map((p, i) => <p key={i}>{p}</p>)}
      </div>
      <div className="mt-6 flex flex-wrap gap-1.5">
        {TAGS.map((t) => (
          <span key={t.en} className="font-mono text-[10px] text-accent bg-accent/10 border border-accent/20 rounded px-2 py-0.5">{t[locale]}</span>
        ))}
      </div>
    </Tile>
  )
}
