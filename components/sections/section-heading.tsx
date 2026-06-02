export function SectionHeading({ index, label, title }: { index: string; label: string; title: string }) {
  return (
    <div className="mb-10">
      <p className="font-mono text-xs tracking-[0.2em] text-accent mb-2">
        № {index} — {label.toUpperCase()}
      </p>
      <h2 className="font-display text-3xl md:text-4xl tracking-tight text-foreground">{title}</h2>
    </div>
  )
}
