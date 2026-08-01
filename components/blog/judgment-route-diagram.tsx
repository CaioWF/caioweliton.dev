import type { Locale } from '@/lib/i18n/locales'

// the path a fact takes at the end of a session. the first gate is the one
// no script can hold: it needs someone who was there. everything after it is
// a lookup on when the fact is needed, which is why that half automates.
// the three destinations are the ones the skill actually writes to; no
// hypothetical fourth box.
const copy = {
  pt: {
    title: 'ONDE O SCRIPT COMEÇA',
    sub: 'primeiro o julgamento, depois o roteamento',
    fact: 'fato da sessão',
    judgeLine1: 'ainda vai ser verdade semana que vem,',
    judgeLine2: 'pra quem não estava aqui?',
    judgeTag: 'julgamento',
    routeLine: 'quando esse fato é necessário?',
    routeTag: 'mecânica',
    no: 'não',
    yes: 'sim',
    dropped: 'descartado',
    when1: 'antes da 1ª edição',
    when2: 'quando você esbarra',
    when3: 'no mapa da sessão',
    dest1: 'CLAUDE.md',
    dest2: 'docs/gotchas.md',
    dest3: 'frontmatter',
    legendJudge: 'julgamento: quem viveu a sessão responde, e nenhum padrão substitui',
    legendRoute: 'roteamento: regra fixa sobre quando o fato é necessário',
    alt: 'Fluxo de um fato descoberto na sessão. Ele passa primeiro por uma pergunta de julgamento: isso ainda vai ser verdade semana que vem, para quem não estava aqui? Se não, é descartado. Se sim, cai numa segunda pergunta, essa mecânica: quando esse fato é necessário? Daí saem três destinos. O que é necessário antes da primeira edição vai para o CLAUDE.md, o que é consultado quando você esbarra vai para docs barra gotchas ponto md, e o que só precisa aparecer no mapa da sessão vira frontmatter.',
  },
  en: {
    title: 'WHERE THE SCRIPT STARTS',
    sub: 'judgment first, routing after',
    fact: 'fact from the session',
    judgeLine1: 'will this still be true next week,',
    judgeLine2: 'for someone who was not here?',
    judgeTag: 'judgment',
    routeLine: 'when is this fact needed?',
    routeTag: 'mechanics',
    no: 'no',
    yes: 'yes',
    dropped: 'dropped',
    when1: 'before the first edit',
    when2: 'when you hit it',
    when3: 'in the session map',
    dest1: 'CLAUDE.md',
    dest2: 'docs/gotchas.md',
    dest3: 'frontmatter',
    legendJudge: 'judgment: answered by whoever lived the session, and no pattern replaces it',
    legendRoute: 'routing: a fixed rule about when the fact is needed',
    alt: 'The path of a fact found during a session. It first meets a judgment question: will this still be true next week, for someone who was not here? If not, it is dropped. If yes, it reaches a second question, this one mechanical: when is this fact needed? Three destinations follow. What is needed before the first edit goes to CLAUDE.md, what gets looked up when you hit it goes to docs slash gotchas dot md, and what only needs to show up in the session map becomes frontmatter.',
  },
} satisfies Record<Locale, Record<string, string>>

const CX = 50
const DESTS = [
  { x: 2, when: 'when1', dest: 'dest1' },
  { x: 35.5, when: 'when2', dest: 'dest2' },
  { x: 69, when: 'when3', dest: 'dest3' },
] as const
const DEST_W = 29

export function JudgmentRouteDiagram({ locale = 'pt' }: { locale?: Locale }) {
  const t = copy[locale] ?? copy.pt

  return (
    <figure className="my-8 not-prose">
      <div className="relative rounded-2xl border border-accent/30 bg-surface/30 px-6 pb-6 pt-9">
        <div className="absolute -top-3 left-6 flex items-center gap-2 bg-background px-2">
          <span className="font-mono text-xs uppercase tracking-widest text-accent">{t.title}</span>
          <span className="font-mono text-[10px] text-faint">{t.sub}</span>
        </div>

        <div className="mx-auto w-full max-w-[460px]">
          <svg
            viewBox="0 0 100 72"
            className="w-full"
            fill="none"
            style={{ fontFamily: 'var(--font-mono, ui-monospace, monospace)' }}
            role="img"
            aria-label={t.alt}
          >
            {/* the fact */}
            {/* width fits the longest label in either locale, mono at 0.6em/char */}
            <rect x={26} y={1} width={48} height={8} rx={4} stroke="var(--border)" strokeWidth={0.4} fill="var(--surface)" fillOpacity={0.3} />
            <text x={CX} y={6.2} textAnchor="middle" fontSize={2.8} fill="var(--foreground)">
              {t.fact}
            </text>
            <line x1={CX} y1={9} x2={CX} y2={15} stroke="var(--border)" strokeWidth={0.4} />

            {/* gate one: judgment. accent, because this is the half no script holds */}
            <rect x={16} y={15} width={68} height={13} rx={2} stroke="var(--accent)" strokeOpacity={0.55} strokeWidth={0.5} fill="var(--accent)" fillOpacity={0.08} />
            <text x={CX} y={20.4} textAnchor="middle" fontSize={2.7} fill="var(--foreground)">
              {t.judgeLine1}
            </text>
            <text x={CX} y={24.4} textAnchor="middle" fontSize={2.7} fill="var(--foreground)">
              {t.judgeLine2}
            </text>
            <text x={16} y={13} fontSize={2.3} fill="var(--accent)" letterSpacing={0.3}>
              {t.judgeTag}
            </text>

            {/* the no branch */}
            <path d="M 16 21.5 L 7 21.5 L 7 33" stroke="var(--border)" strokeWidth={0.4} fill="none" />
            <text x={8.4} y={19.8} fontSize={2.3} fill="var(--faint)">
              {t.no}
            </text>
            {/* centred on the elbow at a size that clears the viewBox on the left
                and the box on the right: PT "descartado" is the widest case */}
            <text x={7} y={36.4} textAnchor="middle" fontSize={2} fill="var(--faint)">
              {t.dropped}
            </text>

            {/* the yes branch */}
            <line x1={CX} y1={28} x2={CX} y2={35} stroke="var(--border)" strokeWidth={0.4} />
            <text x={CX + 2} y={32.6} fontSize={2.3} fill="var(--faint)">
              {t.yes}
            </text>

            {/* gate two: mechanics */}
            <rect x={16} y={35} width={68} height={10} rx={2} stroke="var(--border)" strokeWidth={0.5} fill="var(--surface)" fillOpacity={0.4} />
            <text x={CX} y={41.4} textAnchor="middle" fontSize={2.7} fill="var(--foreground)">
              {t.routeLine}
            </text>
            <text x={84} y={33} textAnchor="end" fontSize={2.3} fill="var(--muted)" letterSpacing={0.3}>
              {t.routeTag}
            </text>

            {/* fan out to the three destinations */}
            {DESTS.map(({ x, when, dest }) => {
              const cx = x + DEST_W / 2
              return (
                <g key={dest}>
                  <path
                    d={`M ${CX} 45 L ${CX} 51 L ${cx} 51 L ${cx} 55`}
                    stroke="var(--border)"
                    strokeWidth={0.4}
                    fill="none"
                  />
                  {/* the "when" label lives inside the card: outside it collided
                      with the connector, and the longest EN label ran past the edge */}
                  <rect
                    x={x}
                    y={55}
                    width={DEST_W}
                    height={13}
                    rx={1.5}
                    stroke="var(--accent)"
                    strokeOpacity={0.35}
                    strokeWidth={0.4}
                    fill="var(--surface)"
                    fillOpacity={0.35}
                  />
                  <text x={cx} y={59.4} textAnchor="middle" fontSize={2} fill="var(--faint)">
                    {t[when]}
                  </text>
                  <text x={cx} y={64.6} textAnchor="middle" fontSize={2.5} fill="var(--accent)">
                    {t[dest]}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        <div className="mt-3 flex flex-col gap-1.5 font-mono text-[11px] text-faint">
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-3.5 shrink-0 rounded-[2px] border border-accent/50 bg-accent/10" aria-hidden />
            <span>{t.legendJudge}</span>
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-3.5 shrink-0 rounded-[2px] border border-border bg-surface/40" aria-hidden />
            <span>{t.legendRoute}</span>
          </span>
        </div>
      </div>
    </figure>
  )
}
