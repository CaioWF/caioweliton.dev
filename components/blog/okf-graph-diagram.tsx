import type { Locale } from '@/lib/i18n/locales'

// A small knowledge graph. Nodes are concepts (each a .md page with a type:).
// Edges are relative markdown links — directional: source references target.
// adr and glossary are the shared knowledge everything else points back to.
type Node = { key: string; top: number; left: number }
// Planar layout (no edge crossings): a rectangle adr–spec–glossary–rubric, plan
// above bridging the adr/spec edge, decision hanging below glossary.
const NODES: Node[] = [
  { key: 'adr', top: 30, left: 30 }, // 0 — hub (upper-left of the rectangle)
  { key: 'spec', top: 30, left: 70 }, // 1 — upper-right
  { key: 'rubric', top: 62, left: 30 }, // 2 — lower-left
  { key: 'plan', top: 10, left: 50 }, // 3 — source, above the adr/spec edge
  { key: 'glossary', top: 62, left: 70 }, // 4 — hub, lower-right
  { key: 'decision', top: 88, left: 70 }, // 5 — leaf below glossary
]

// [source, target]: the source page links to (references) the target page.
const EDGES: [number, number][] = [
  [1, 0], // spec → adr        (a spec follows an architecture decision)
  [3, 0], // plan → adr        (a plan honors the decisions)
  [3, 1], // plan → spec       (a plan implements its spec)
  [2, 0], // rubric → adr      (a rubric's durable choice is recorded as an ADR)
  [2, 4], // rubric → glossary (a rubric leans on domain terms)
  [5, 4], // decision → glossary (a decision references domain terms)
  [1, 4], // spec → glossary   (a spec uses glossary terms)
]

// Trim an edge so it starts/ends at the node's rim, not its center, leaving room
// for the arrowhead to sit just outside the referenced node.
function trim(a: Node, b: Node, padA = 5, padB = 9) {
  const dx = b.left - a.left
  const dy = b.top - a.top
  const len = Math.hypot(dx, dy) || 1
  const ux = dx / len
  const uy = dy / len
  return { x1: a.left + ux * padA, y1: a.top + uy * padA, x2: b.left - ux * padB, y2: b.top - uy * padB }
}

const copy = {
  pt: {
    frame: 'OPEN KNOWLEDGE FORMAT',
    frameSub: 'documentação vira grafo de contexto',
    nodes: { adr: 'ADR', spec: 'SPEC', rubric: 'RUBRICA', decision: 'DECISÃO', glossary: 'GLOSSÁRIO', plan: 'PLANO' },
    node: 'conceito',
    nodeSub: 'uma página .md com campo type:',
    edge: 'link',
    edgeSub: 'link markdown; a seta aponta a página referenciada',
  },
  en: {
    frame: 'OPEN KNOWLEDGE FORMAT',
    frameSub: 'docs become a context graph',
    nodes: { adr: 'ADR', spec: 'SPEC', rubric: 'RUBRIC', decision: 'DECISION', glossary: 'GLOSSARY', plan: 'PLAN' },
    node: 'concept',
    nodeSub: 'a .md page with a type: field',
    edge: 'link',
    edgeSub: 'markdown link; the arrow points to the referenced page',
  },
} satisfies Record<Locale, Record<string, unknown>>

export function OkfGraphDiagram({ locale = 'pt' }: { locale?: Locale }) {
  const t = copy[locale] ?? copy.pt
  const nodeLabels = t.nodes as Record<string, string>

  return (
    <figure className="my-8 not-prose">
      <div className="relative rounded-2xl border border-accent/30 bg-surface/30 px-6 py-6">
        {/* label inside the figure, at the top, transparent background */}
        <div className="mb-4 flex flex-wrap items-baseline gap-2">
          <span className="font-mono text-xs uppercase tracking-widest text-accent">{t.frame as string}</span>
          <span className="font-mono text-[10px] text-faint">{t.frameSub as string}</span>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-[440px]">
          {/* edges: directional markdown links, arrow on the referenced end, all pulsing in phase */}
          <svg className="absolute inset-0 h-full w-full text-accent" viewBox="0 0 100 100" fill="none" aria-hidden>
            <defs>
              <marker id="okf-arrow" markerUnits="userSpaceOnUse" markerWidth="4" markerHeight="4" refX="3.2" refY="2" orient="auto">
                <path d="M0,0 L4,2 L0,4 z" fill="currentColor" />
              </marker>
            </defs>
            {EDGES.map(([a, b], i) => {
              // the GLOSSÁRIO label is the widest pill; a horizontal arrow into it
              // hides behind it, so trim that target a bit more.
              const padB = NODES[b].key === 'glossary' ? 14 : 9
              const e = trim(NODES[a], NODES[b], 5, padB)
              return (
                <line
                  key={`edge-${i}`}
                  className="okf-pulse"
                  x1={e.x1}
                  y1={e.y1}
                  x2={e.x2}
                  y2={e.y2}
                  stroke="currentColor"
                  strokeWidth={0.6}
                  strokeLinecap="round"
                  markerEnd="url(#okf-arrow)"
                />
              )
            })}
          </svg>

          {/* concept nodes */}
          {NODES.map((n, i) => (
            <div
              key={n.key}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ top: `${n.top}%`, left: `${n.left}%` }}
            >
              <div
                className="harness-float flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1.5 font-mono text-[10px] tracking-wide text-foreground whitespace-nowrap"
                style={{ animationDelay: `${i * 0.35}s` }}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
                {nodeLabels[n.key]}
              </div>
            </div>
          ))}
        </div>

        {/* legend */}
        <div className="mt-3 flex flex-col gap-1.5 font-mono text-[11px] text-faint">
          <span className="flex items-center gap-2">
            <span className="flex h-3 w-4 shrink-0 items-center justify-center rounded-[3px] border border-border bg-surface">
              <span className="h-1 w-1 rounded-full bg-accent" aria-hidden />
            </span>
            <span><span className="text-accent">{t.node as string}</span> {t.nodeSub as string}</span>
          </span>
          <span className="flex items-center gap-2">
            <svg className="h-2.5 w-4 shrink-0 text-accent" viewBox="0 0 16 10" aria-hidden>
              <line x1="1" y1="5" x2="11" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M11,2 L15,5 L11,8 z" fill="currentColor" />
            </svg>
            <span><span className="text-accent">{t.edge as string}</span> {t.edgeSub as string}</span>
          </span>
        </div>
      </div>
    </figure>
  )
}
