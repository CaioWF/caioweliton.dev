import type { Locale } from '@/lib/i18n/locales'

// stages placed clockwise from the top, sitting on a ring around the model
const STAGES: { label: string; top: number; left: number }[] = [
  { label: 'BRAINSTORM', top: 10, left: 50 },
  { label: 'PRD', top: 25.1, left: 81.3 },
  { label: 'SPEC', top: 58.9, left: 89 },
  { label: 'PLAN', top: 86, left: 67.4 },
  { label: 'TASKS', top: 86, left: 32.6 },
  { label: 'IMPLEMENT', top: 58.9, left: 11 },
  { label: 'REVIEW', top: 25.1, left: 18.7 },
]

// gates sit on the ring between consecutive stages (no gate closes review -> brainstorm: the flow is linear, not a loop).
// delay (s) is negative so each gate's flash lands when the traveling beam reaches it in the 5s cycle.
const GATES: { top: number; left: number; delay: number }[] = [
  { top: 14.0, left: 67.4, delay: -5.01 },
  { top: 41.1, left: 89.0, delay: -4.22 },
  { top: 74.9, left: 81.3, delay: -3.44 },
  { top: 90.0, left: 50.0, delay: -2.65 },
  { top: 74.9, left: 18.7, delay: -1.86 },
  { top: 41.1, left: 11.0, delay: -1.08 },
]

const copy = {
  pt: {
    harness: 'O HARNESS',
    harnessSub: 'o entorno do modelo',
    model: 'MODELO DE IA',
    modelSub: 'capaz, mas indisciplinado',
    gate: 'portão',
    gateSub: 'negar por padrão, só abre quando a etapa anterior fecha',
    hooks: 'hook',
    hooksSub: 'regra aplicada por código, fora do modelo, em cada etapa',
  },
  en: {
    harness: 'THE HARNESS',
    harnessSub: 'everything around the model',
    model: 'AI MODEL',
    modelSub: 'capable but undisciplined',
    gate: 'gate',
    gateSub: 'default deny, opens only when the previous stage closes',
    hooks: 'hook',
    hooksSub: 'rule enforced by code, outside the model, on every stage',
  },
} satisfies Record<Locale, Record<string, string>>

export function HarnessDiagram({ locale = 'pt' }: { locale?: Locale }) {
  const t = copy[locale] ?? copy.pt

  return (
    <figure className="my-8 not-prose">
      {/* THE HARNESS is the frame: it wraps the model and the whole flow */}
      <div className="relative rounded-2xl border border-accent/30 bg-surface/30 px-6 pb-6 pt-9">
        {/* label sits on the border to read as the enclosing boundary */}
        <div className="absolute -top-3 left-6 flex items-center gap-2 bg-background px-2">
          <span className="font-mono text-xs uppercase tracking-widest text-accent">{t.harness}</span>
          <span className="font-mono text-[10px] text-faint">{t.harnessSub}</span>
        </div>

        {/* radial cluster: the SDD stages ring around the model */}
        <div className="relative mx-auto aspect-square w-full max-w-[440px]">
          {/* the path the stages sit on: an open arc from brainstorm to review, so it does not loop back */}
          <svg className="absolute inset-0 h-full w-full text-accent" viewBox="0 0 100 100" fill="none" aria-hidden>
            <path
              d="M 50 10 A 40 40 0 1 1 18.73 25.06"
              stroke="currentColor"
              strokeOpacity={0.25}
              strokeWidth={0.3}
              strokeDasharray="0.8 1.2"
            />
            {/* lit segment that travels brainstorm -> review, step by step */}
            <path
              className="harness-flow"
              d="M 50 10 A 40 40 0 1 1 18.73 25.06"
              pathLength={100}
              stroke="currentColor"
              strokeOpacity={0.9}
              strokeWidth={0.7}
              strokeDasharray="6 100"
              strokeLinecap="round"
            />
          </svg>

          {/* gates between consecutive stages */}
          {GATES.map((g, i) => (
            <span
              key={i}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ top: `${g.top}%`, left: `${g.left}%` }}
              aria-hidden
            >
              <span
                className="harness-gate block h-2.5 w-2.5 rotate-45 border border-accent bg-background"
                style={{ animationDelay: `${g.delay}s` }}
              />
            </span>
          ))}

          {/* model at the center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="relative h-20 w-20">
              <span
                className="absolute inset-0 rounded-full blur-2xl opacity-60"
                style={{ background: 'radial-gradient(circle, var(--accent), transparent 70%)' }}
                aria-hidden
              />
              <span
                className="absolute inset-2 rounded-full"
                style={{
                  background:
                    'radial-gradient(circle at 35% 30%, color-mix(in oklab, var(--accent) 35%, white), var(--accent) 70%)',
                }}
                aria-hidden
              />
            </div>
            <span className="mt-2 font-mono text-xs tracking-wide text-foreground">{t.model}</span>
            <span className="font-mono text-[10px] text-faint">{t.modelSub}</span>
          </div>

          {/* stages around the ring, each carrying a hook marker, floating softly */}
          {STAGES.map((s, i) => (
            <div
              key={s.label}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ top: `${s.top}%`, left: `${s.left}%` }}
            >
              <div
                className="harness-float relative rounded-md border border-border bg-surface px-2 py-1.5 font-mono text-[10px] tracking-wide text-foreground whitespace-nowrap"
                style={{ animationDelay: `${i * 0.35}s` }}
              >
                <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-accent" aria-hidden />
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* legend explains the repeated markers */}
        <div className="mt-3 flex flex-col gap-1.5 font-mono text-[11px] text-faint">
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 shrink-0 rotate-45 border border-accent bg-background" aria-hidden />
            <span><span className="text-accent">{t.gate}</span> {t.gateSub}</span>
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 shrink-0 rounded-full bg-accent" aria-hidden />
            <span><span className="text-accent">{t.hooks}</span> {t.hooksSub}</span>
          </span>
        </div>
      </div>
    </figure>
  )
}
