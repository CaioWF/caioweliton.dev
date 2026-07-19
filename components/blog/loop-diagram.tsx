import type { Locale } from '@/lib/i18n/locales'

// a goal loop as a flowchart: act -> verify -> decide.
// the decision feeds back (no -> iterate) forming the loop, and taps out (yes -> stop) at the exit.
const copy = {
  pt: {
    title: 'O GOAL LOOP',
    sub: 'itera até o contrato fechar, e então para',
    agent: 'AGENTE',
    agentSub: 'age · edita, testa',
    checker: 'VERIFICADOR',
    checkerSub: 'contexto fresco',
    decide: 'objetivo?',
    no: 'não · itera',
    yes: 'sim',
    stop: 'PARA',
    stopSub: 'sucesso · teto · humano',
    beat: 'cada volta: age → verifica → decide',
    exit: 'sai só quando o contrato fecha (ou teto / humano)',
  },
  en: {
    title: 'THE GOAL LOOP',
    sub: 'iterates until the contract closes, then stops',
    agent: 'AGENT',
    agentSub: 'acts · edits, tests',
    checker: 'CHECKER',
    checkerSub: 'fresh context',
    decide: 'goal met?',
    no: 'no · iterate',
    yes: 'yes',
    stop: 'STOP',
    stopSub: 'success · cap · human',
    beat: 'each lap: act → verify → decide',
    exit: 'exits only when the contract closes (or cap / human)',
  },
} satisfies Record<Locale, Record<string, string>>

export function LoopDiagram({ locale = 'pt' }: { locale?: Locale }) {
  const t = copy[locale] ?? copy.pt

  return (
    <figure className="my-8 not-prose">
      <div className="relative rounded-2xl border border-accent/30 bg-surface/30 px-6 pb-6 pt-9">
        {/* label sits on the border */}
        <div className="absolute -top-3 left-6 flex items-center gap-2 bg-background px-2">
          <span className="font-mono text-xs uppercase tracking-widest text-accent">{t.title}</span>
          <span className="font-mono text-[10px] text-faint">{t.sub}</span>
        </div>

        <div className="mx-auto w-full max-w-[360px]">
          <svg
            viewBox="0 0 100 116"
            className="w-full text-accent"
            fill="none"
            style={{ fontFamily: 'var(--font-mono, ui-monospace, monospace)' }}
            aria-hidden
          >
            {/* the loop skeleton: down the center, then back up the left = the cycle */}
            <path
              d="M 50 13.5 L 50 72 L 12 72 L 12 13.5 L 50 13.5"
              stroke="currentColor"
              strokeOpacity={0.25}
              strokeWidth={0.4}
              strokeDasharray="0.9 1.3"
            />
            {/* the traveling beam: one lit segment circulates the loop */}
            <path
              className="loop-flow"
              d="M 50 13.5 L 50 72 L 12 72 L 12 13.5 L 50 13.5"
              pathLength={100}
              stroke="currentColor"
              strokeOpacity={0.9}
              strokeWidth={0.8}
              strokeDasharray="6 100"
              strokeLinecap="round"
            />

            {/* direction chevrons on the loop */}
            <path d="M 48.4 36.5 L 50 38.8 L 51.6 36.5" stroke="currentColor" strokeOpacity={0.55} strokeWidth={0.5} strokeLinecap="round" strokeLinejoin="round" />
            <path d="M 48.4 60 L 50 62.3 L 51.6 60" stroke="currentColor" strokeOpacity={0.55} strokeWidth={0.5} strokeLinecap="round" strokeLinejoin="round" />
            {/* return chevron pointing up the left edge */}
            <path d="M 10.4 42 L 12 39.7 L 13.6 42" stroke="currentColor" strokeOpacity={0.55} strokeWidth={0.5} strokeLinecap="round" strokeLinejoin="round" />

            {/* AGENT box */}
            <rect x={26} y={6} width={48} height={15} rx={2} fill="var(--surface)" stroke="var(--border)" strokeWidth={0.5} />
            <text x={50} y={12.4} textAnchor="middle" fontSize={3.4} fill="var(--foreground)" letterSpacing={0.3}>{t.agent}</text>
            <text x={50} y={17} textAnchor="middle" fontSize={2.5} fill="var(--faint)">{t.agentSub}</text>
            {/* lights up when the beam reaches it (top of the loop) */}
            <rect className="box-lit" style={{ animationDelay: '-0.60s' }} x={26} y={6} width={48} height={15} rx={2} fill="var(--accent)" fillOpacity={0.22} stroke="var(--accent)" strokeWidth={1.2} />

            {/* CHECKER box */}
            <rect x={26} y={40} width={48} height={15} rx={2} fill="var(--surface)" stroke="var(--border)" strokeWidth={0.5} />
            <text x={50} y={46.4} textAnchor="middle" fontSize={3.4} fill="var(--foreground)" letterSpacing={0.3}>{t.checker}</text>
            <text x={50} y={51} textAnchor="middle" fontSize={2.5} fill="var(--faint)">{t.checkerSub}</text>
            {/* lights up ~1.06s into the 6s cycle */}
            <rect className="box-lit" style={{ animationDelay: '0.46s' }} x={26} y={40} width={48} height={15} rx={2} fill="var(--accent)" fillOpacity={0.22} stroke="var(--accent)" strokeWidth={1.2} />

            {/* DECISION diamond */}
            <path d="M 50 64 L 62 72 L 50 80 L 38 72 Z" fill="var(--surface)" stroke="var(--accent)" strokeWidth={0.5} strokeOpacity={0.7} />
            <text x={50} y={73.2} textAnchor="middle" fontSize={2.7} fill="var(--foreground)">{t.decide}</text>
            {/* lights up ~1.82s into the 6s cycle */}
            <path className="box-lit" style={{ animationDelay: '1.22s' }} d="M 50 64 L 62 72 L 50 80 L 38 72 Z" fill="var(--accent)" fillOpacity={0.22} stroke="var(--accent)" strokeWidth={1.2} />

            {/* NO label on the return edge */}
            <text x={27} y={70.4} textAnchor="middle" fontSize={2.4} fill="var(--accent)">{t.no}</text>

            {/* YES branch: taps out of the diamond down to the exit */}
            <line x1={50} y1={80} x2={50} y2={94} stroke="currentColor" strokeOpacity={0.55} strokeWidth={0.5} />
            <path d="M 48.4 91.7 L 50 94 L 51.6 91.7" stroke="currentColor" strokeOpacity={0.55} strokeWidth={0.5} strokeLinecap="round" strokeLinejoin="round" />
            <text x={54.5} y={88.5} textAnchor="start" fontSize={2.4} fill="var(--accent)">{t.yes}</text>

            {/* STOP box: the exit */}
            <rect x={30} y={94} width={40} height={15} rx={2} fill="var(--accent)" fillOpacity={0.12} stroke="var(--accent)" strokeWidth={0.6} />
            <text x={50} y={100.4} textAnchor="middle" fontSize={3.4} fill="var(--accent)" letterSpacing={0.4}>{t.stop}</text>
            <text x={50} y={105} textAnchor="middle" fontSize={2.4} fill="var(--faint)">{t.stopSub}</text>
          </svg>
        </div>

        {/* legend */}
        <div className="mt-3 flex flex-col gap-1.5 font-mono text-[11px] text-faint">
          <span className="flex items-center gap-2">
            <span className="h-2 w-4 shrink-0 rounded-full bg-accent/80" aria-hidden />
            <span>{t.beat}</span>
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-3.5 shrink-0 rounded-[2px] border border-accent bg-accent/15" aria-hidden />
            <span>{t.exit}</span>
          </span>
        </div>
      </div>
    </figure>
  )
}
