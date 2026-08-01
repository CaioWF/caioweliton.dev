import type { Locale } from '@/lib/i18n/locales'

// the same file, before and after a forced refresh of the scaffolder.
// two owners in one file: the generator owns the body and rewrites it from
// scratch; the project owns the marker block and it survives untouched.
// no version numbers and no file sizes on purpose: the point is ownership,
// not how much changed.
const copy = {
  pt: {
    title: 'DOIS DONOS, UM ARQUIVO',
    sub: 'o que o upgrade reescreve e o que ele preserva',
    before: 'antes',
    after: 'depois do upgrade',
    file: 'CLAUDE.md',
    bodyBefore: 'corpo do template',
    bodyAfter: 'reescrito do zero',
    blockOpen: 'BEGIN:keel:environment',
    blockClose: 'END',
    line1: 'pnpm dev',
    line2: 'seed antes do teste',
    carry: 'carregado de volta',
    legendBlock: 'bloco do projeto: o que a sessão aprendeu, preservado no upgrade',
    legendBody: 'corpo do gerador: nunca foi conhecimento do projeto, então é regerado',
    alt: 'O mesmo arquivo CLAUDE.md em dois momentos. Antes do upgrade ele tem o corpo escrito pelo template e, abaixo, um bloco marcado com o que o projeto aprendeu: o comando pnpm dev e a nota de rodar o seed antes do teste. Depois do upgrade o corpo aparece reescrito do zero, enquanto o bloco marcado é carregado de volta idêntico.',
  },
  en: {
    title: 'TWO OWNERS, ONE FILE',
    sub: 'what the upgrade rewrites and what it keeps',
    before: 'before',
    after: 'after the upgrade',
    file: 'CLAUDE.md',
    bodyBefore: 'template body',
    bodyAfter: 'rewritten from scratch',
    blockOpen: 'BEGIN:keel:environment',
    blockClose: 'END',
    line1: 'pnpm dev',
    line2: 'seed before the tests',
    carry: 'carried back',
    legendBlock: 'project block: what the session learned, preserved across the upgrade',
    legendBody: 'generator body: never was project knowledge, so it gets regenerated',
    alt: 'The same CLAUDE.md file at two moments. Before the upgrade it holds the body written by the template and, below it, a marker block with what the project learned: the pnpm dev command and a note about seeding before the tests. After the upgrade the body appears rewritten from scratch, while the marker block is carried back identical.',
  },
} satisfies Record<Locale, Record<string, string>>

const CARD_Y = 8
const CARD_H = 40
const LEFT_X = 2
const RIGHT_X = 55
const CARD_W = 43

function Card({
  x,
  label,
  bodyNote,
  bodyDashed,
  t,
}: {
  x: number
  label: string
  bodyNote: string
  bodyDashed: boolean
  t: Record<string, string>
}) {
  return (
    <g>
      <text x={x} y={CARD_Y - 2.4} fontSize={2.6} fill="var(--faint)" letterSpacing={0.3}>
        {label}
      </text>
      <rect
        x={x}
        y={CARD_Y}
        width={CARD_W}
        height={CARD_H}
        rx={2}
        fill="var(--surface)"
        fillOpacity={0.3}
        stroke="var(--border)"
        strokeWidth={0.4}
      />
      <text x={x + 3} y={CARD_Y + 5} fontSize={2.8} fill="var(--foreground)">
        {t.file}
      </text>

      {/* generator body: three recessive rules, redrawn on every refresh */}
      {[0, 1, 2].map((i) => (
        <line
          key={i}
          x1={x + 3}
          y1={CARD_Y + 9.5 + i * 3}
          x2={x + CARD_W - (i === 2 ? 12 : 3)}
          y2={CARD_Y + 9.5 + i * 3}
          stroke="var(--border)"
          strokeWidth={0.7}
          strokeLinecap="round"
          strokeDasharray={bodyDashed ? '1.4 1.2' : undefined}
        />
      ))}
      <text x={x + 3} y={CARD_Y + 21.5} fontSize={2.1} fill="var(--muted)">
        {bodyNote}
      </text>

      {/* the project's block */}
      <rect
        x={x + 2}
        y={CARD_Y + 24}
        width={CARD_W - 4}
        height={13}
        rx={1.2}
        fill="var(--accent)"
        fillOpacity={0.1}
        stroke="var(--accent)"
        strokeOpacity={0.45}
        strokeWidth={0.4}
      />
      <text x={x + 4} y={CARD_Y + 27.6} fontSize={1.9} fill="var(--accent)">
        {t.blockOpen}
      </text>
      <text x={x + 4} y={CARD_Y + 31.2} fontSize={2.3} fill="var(--foreground)">
        {t.line1}
      </text>
      <text x={x + 4} y={CARD_Y + 34.4} fontSize={2.3} fill="var(--foreground)">
        {t.line2}
      </text>
      <text x={x + CARD_W - 4} y={CARD_Y + 27.6} fontSize={1.9} fill="var(--accent)" textAnchor="end">
        {t.blockClose}
      </text>
    </g>
  )
}

export function BlockUpgradeDiagram({ locale = 'pt' }: { locale?: Locale }) {
  const t = copy[locale] ?? copy.pt

  return (
    <figure className="my-8 not-prose">
      <div className="relative rounded-2xl border border-accent/30 bg-surface/30 px-6 pb-6 pt-9">
        <div className="absolute -top-3 left-6 flex items-center gap-2 bg-background px-2">
          <span className="font-mono text-xs uppercase tracking-widest text-accent">{t.title}</span>
          <span className="font-mono text-[10px] text-faint">{t.sub}</span>
        </div>

        <div className="mx-auto w-full max-w-[520px]">
          <svg
            viewBox="0 0 100 58"
            className="w-full"
            fill="none"
            style={{ fontFamily: 'var(--font-mono, ui-monospace, monospace)' }}
            role="img"
            aria-label={t.alt}
          >
            <Card x={LEFT_X} label={t.before} bodyNote={t.bodyBefore} bodyDashed={false} t={t} />
            <Card x={RIGHT_X} label={t.after} bodyNote={t.bodyAfter} bodyDashed t={t} />

            {/* the block travels across the refresh, identical */}
            <line
              x1={LEFT_X + CARD_W + 1}
              y1={CARD_Y + 30}
              x2={RIGHT_X - 2.4}
              y2={CARD_Y + 30}
              stroke="var(--accent)"
              strokeWidth={0.5}
              strokeDasharray="1.8 1.4"
              strokeLinecap="round"
            />
            <path
              d={`M ${RIGHT_X - 3.6} ${CARD_Y + 28.8} L ${RIGHT_X - 1.6} ${CARD_Y + 30} L ${RIGHT_X - 3.6} ${CARD_Y + 31.2}`}
              stroke="var(--accent)"
              strokeWidth={0.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <text
              x={(LEFT_X + CARD_W + RIGHT_X) / 2}
              y={CARD_Y + 46.5}
              textAnchor="middle"
              fontSize={2.4}
              fill="var(--accent)"
            >
              {t.carry}
            </text>
          </svg>
        </div>

        <div className="mt-3 flex flex-col gap-1.5 font-mono text-[11px] text-faint">
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-3.5 shrink-0 rounded-[2px] border border-accent/40 bg-accent/10" aria-hidden />
            <span>{t.legendBlock}</span>
          </span>
          <span className="flex items-center gap-2">
            <span className="h-0 w-4 shrink-0 self-center border-t border-dashed border-border" aria-hidden />
            <span>{t.legendBody}</span>
          </span>
        </div>
      </div>
    </figure>
  )
}
