export function Avatar({ size = 72 }: { size?: number }) {
  // Quando houver foto real, trocar este bloco por next/image apontando p/ /caio.jpg
  return (
    <div
      aria-label="Caio Weliton"
      role="img"
      style={{ width: size, height: size }}
      className="shrink-0 rounded-xl border border-border bg-background flex items-center justify-center text-accent font-display"
    >
      <span style={{ fontSize: size / 2.6 }}>CW</span>
    </div>
  )
}
