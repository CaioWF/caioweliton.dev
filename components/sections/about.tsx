import type { Locale } from '@/lib/i18n/locales'
import { Tile } from '@/components/bento/tile'
import { yearsOfExperience } from '@/data/site'

const TAGS: { pt: string; en: string }[] = [
  { pt: 'Clean Architecture', en: 'Clean Architecture' },
  { pt: 'AWS', en: 'AWS' },
  { pt: 'Alta Concorrência', en: 'High Concurrency' },
  { pt: 'Microsserviços', en: 'Microservices' },
  { pt: 'Liderança Técnica', en: 'Technical Leadership' },
]

export function About({ locale }: { locale: Locale }) {
  const years = yearsOfExperience()
  const copy = {
    pt: [
      `Engenheiro de software de Quixadá, Ceará. Sênior na Compass UOL, com ${years}+ anos construindo back-ends em Node.js, TypeScript e AWS, de APIs e microsserviços a sistemas distribuídos de alta concorrência.`,
      'Meus últimos projetos foram modernizações de legado: reescrever sistemas críticos em stacks novas sem perder o que já rodava. No último, mantive a integridade do estoque durante picos de alta concorrência, sem vender o que não existia.',
      'Fiz pós em liderança técnica (Full Cycle): código é metade do trabalho, a outra metade é fazer o time crescer junto. Gosto de aprender a stack que o problema pedir (agora estou começando em Go) e uso IA no fluxo de dev (Claude Code, MCP, agentic workflows) pra entregar mais rápido sem abrir mão de qualidade.',
      'Fora do terminal: cozinha, caminhada e games.',
    ],
    en: [
      `Software engineer from Quixadá, Ceará. Senior at Compass UOL, with ${years}+ years building back-ends in Node.js, TypeScript and AWS, from APIs and microservices to distributed high-concurrency systems.`,
      'My latest projects were legacy modernizations: rewriting critical systems on new stacks without losing what already ran. On the last one, I kept stock integrity through high-concurrency spikes, with no overselling.',
      'I did a postgrad in technical leadership (Full Cycle): code is half the job, the other half is helping the team grow. I pick up whatever stack the problem calls for (right now I am starting with Go) and I use AI in my dev workflow (Claude Code, MCP, agentic workflows) to ship faster without giving up quality.',
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
