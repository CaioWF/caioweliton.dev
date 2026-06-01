export function SectionHeading({ index, label, title }: { index: string; label: string; title: string }) {
  return (
    <div className="mb-10">
      <p className="font-mono text-xs tracking-[0.2em] text-amber-600 mb-2">
        № {index} — {label.toUpperCase()}
      </p>
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-stone-50">{title}</h2>
    </div>
  )
}
