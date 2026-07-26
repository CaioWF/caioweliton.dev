import type { Locale } from '@/lib/i18n/locales'

// the process floor: a schematic, not a plot.
// flat line = what the process charges (constant, whatever the change size).
// dashed line = what the change would deserve. the wedge between them is where
// the process costs more than the change is worth, which is where bypass is born.
// no numeric ticks on purpose: only one real measurement exists (the typo), and
// inventing points would dress a claim up as data.
const copy = {
  pt: {
    title: 'O PISO DO PROCESSO',
    sub: 'o custo é constante; a mudança, não',
    // kept short on purpose: the full names live in the legend, and a longer
    // label here runs into the dashed line around x=67.
    process: 'processo',
    proportional: 'proporcional',
    zone: 'zona de bypass',
    markLabel: 'typo: 1 palavra',
    markSub: '6 artefatos, 2 aprovações',
    axisX: 'tamanho da mudança',
    axisY: 'custo',
    x: ['typo', '1 linha', 'bugfix', 'feature'],
    legendProcess: 'custo do processo: o mesmo pra 1 palavra ou pra 400 linhas',
    legendProportional: 'custo proporcional: o que a mudança merecia',
    legendZone: 'na cunha, o processo custa mais do que a mudança vale. É ali que nasce o bypass',
    alt: 'Esquema comparando duas linhas: o custo do processo, constante em qualquer tamanho de mudança, e o custo proporcional, que cresce com a mudança. A área entre as duas, do lado das mudanças pequenas, é a zona de bypass. Um typo de uma palavra, no extremo pequeno, custou seis artefatos e duas aprovações.',
  },
  en: {
    title: 'THE PROCESS FLOOR',
    sub: 'the cost is flat; the change is not',
    process: 'process',
    proportional: 'proportional',
    zone: 'bypass zone',
    markLabel: 'typo: one word',
    markSub: '6 artifacts, 2 approvals',
    axisX: 'size of the change',
    axisY: 'cost',
    x: ['typo', '1 line', 'bugfix', 'feature'],
    legendProcess: 'process cost: the same for one word or four hundred lines',
    legendProportional: 'proportional cost: what the change deserved',
    legendZone: 'inside the wedge the process costs more than the change is worth. That is where bypass is born',
    alt: 'A schematic comparing two lines: process cost, flat across every change size, and proportional cost, which grows with the change. The area between them, on the small-change side, is the bypass zone. A one-word typo at the small end cost six artifacts and two approvals.',
  },
} satisfies Record<Locale, Record<string, string | string[]>>

// plot frame in viewBox units
const X0 = 15
const X1 = 93
const YTOP = 9
const YBASE = 47
const YFLAT = 18 // the process line
const YDIAG0 = 46 // proportional cost at the smallest change
const YDIAG1 = 10 // proportional cost at the largest change
// where the dashed line finally catches up with the flat one
const XCROSS = X0 + ((YDIAG0 - YFLAT) / (YDIAG0 - YDIAG1)) * (X1 - X0)

export function FloorCostDiagram({ locale = 'pt' }: { locale?: Locale }) {
  const t = copy[locale] ?? copy.pt
  const xLabels = t.x as string[]

  return (
    <figure className="my-8 not-prose">
      <div className="relative rounded-2xl border border-accent/30 bg-surface/30 px-6 pb-6 pt-9">
        {/* label sits on the border */}
        <div className="absolute -top-3 left-6 flex items-center gap-2 bg-background px-2">
          <span className="font-mono text-xs uppercase tracking-widest text-accent">{t.title as string}</span>
          <span className="font-mono text-[10px] text-faint">{t.sub as string}</span>
        </div>

        <div className="mx-auto w-full max-w-[460px]">
          <svg
            viewBox="0 0 100 62"
            className="w-full text-accent"
            fill="none"
            style={{ fontFamily: 'var(--font-mono, ui-monospace, monospace)' }}
            role="img"
            aria-label={t.alt as string}
          >
            {/* the wedge: flat line on top, proportional line as the hypotenuse */}
            <path
              d={`M ${X0} ${YFLAT} L ${XCROSS} ${YFLAT} L ${X0} ${YDIAG0} Z`}
              fill="var(--accent)"
              fillOpacity={0.1}
            />

            {/* axes, deliberately recessive. no ticks: this is a schematic, not a plot */}
            <line x1={X0} y1={YTOP} x2={X0} y2={YBASE} stroke="var(--border)" strokeWidth={0.4} />
            <line x1={X0} y1={YBASE} x2={X1} y2={YBASE} stroke="var(--border)" strokeWidth={0.4} />
            <path d={`M ${X1 - 1.6} ${YBASE - 1.3} L ${X1} ${YBASE} L ${X1 - 1.6} ${YBASE + 1.3}`} stroke="var(--border)" strokeWidth={0.4} strokeLinecap="round" strokeLinejoin="round" />
            <path d={`M ${X0 - 1.3} ${YTOP + 1.6} L ${X0} ${YTOP} L ${X0 + 1.3} ${YTOP + 1.6}`} stroke="var(--border)" strokeWidth={0.4} strokeLinecap="round" strokeLinejoin="round" />

            {/* proportional cost: dashed + thinner + muted. a reference line, not a rival series */}
            <line
              x1={X0}
              y1={YDIAG0}
              x2={X1}
              y2={YDIAG1}
              stroke="var(--muted)"
              strokeWidth={0.55}
              strokeDasharray="2 1.6"
              strokeLinecap="round"
            />
            <text x={X1} y={YDIAG1 - 2.2} textAnchor="end" fontSize={2.6} fill="var(--muted)">
              {t.proportional as string}
            </text>

            {/* process cost: solid, accent, thicker. the subject of the chart */}
            <line x1={X0} y1={YFLAT} x2={X1} y2={YFLAT} stroke="var(--accent)" strokeWidth={0.9} strokeLinecap="round" />
            <text x={X1} y={YFLAT + 3.6} textAnchor="end" fontSize={2.6} fill="var(--accent)">
              {t.process as string}
            </text>

            {/* the wedge label */}
            <text x={X0 + 5} y={31} textAnchor="start" fontSize={2.7} fill="var(--foreground)" letterSpacing={0.2}>
              {t.zone as string}
            </text>

            {/* the one real measurement in the whole figure */}
            <circle cx={X0 + 3} cy={YFLAT} r={1.1} fill="var(--accent)" stroke="var(--surface)" strokeWidth={0.5} />
            <line x1={X0 + 3} y1={YFLAT - 1.6} x2={X0 + 3} y2={YFLAT - 5} stroke="var(--accent)" strokeOpacity={0.5} strokeWidth={0.35} />
            <text x={X0 + 4.6} y={YFLAT - 5.4} textAnchor="start" fontSize={2.5} fill="var(--foreground)">
              {t.markLabel as string}
            </text>
            <text x={X0 + 4.6} y={YFLAT - 2.4} textAnchor="start" fontSize={2.3} fill="var(--faint)">
              {t.markSub as string}
            </text>

            {/* ordinal x labels: no quantities claimed */}
            {xLabels.map((label, i) => (
              <text
                key={label}
                x={X0 + 2 + (i * (X1 - X0 - 6)) / (xLabels.length - 1)}
                y={YBASE + 4.4}
                textAnchor={i === 0 ? 'start' : i === xLabels.length - 1 ? 'end' : 'middle'}
                fontSize={2.4}
                fill="var(--faint)"
              >
                {label}
              </text>
            ))}
            <text x={X1} y={YBASE + 8.6} textAnchor="end" fontSize={2.4} fill="var(--faint)" letterSpacing={0.2}>
              {t.axisX as string}
            </text>
            <text
              transform={`translate(${X0 - 3.2} ${(YTOP + YBASE) / 2}) rotate(-90)`}
              textAnchor="middle"
              fontSize={2.4}
              fill="var(--faint)"
              letterSpacing={0.2}
            >
              {t.axisY as string}
            </text>
          </svg>
        </div>

        {/* legend: identity never rides on color alone */}
        <div className="mt-3 flex flex-col gap-1.5 font-mono text-[11px] text-faint">
          <span className="flex items-center gap-2">
            <span className="h-0.5 w-4 shrink-0 rounded-full bg-accent" aria-hidden />
            <span>{t.legendProcess as string}</span>
          </span>
          <span className="flex items-center gap-2">
            <span className="h-0 w-4 shrink-0 self-center border-t border-dashed border-muted" aria-hidden />
            <span>{t.legendProportional as string}</span>
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-3.5 shrink-0 rounded-[2px] border border-accent/40 bg-accent/10" aria-hidden />
            <span>{t.legendZone as string}</span>
          </span>
        </div>
      </div>
    </figure>
  )
}
