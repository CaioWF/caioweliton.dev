export function Avatar({ size = 88 }: { size?: number }) {
  // Quando houver foto real, trocar este bloco por next/image apontando p/ /caio.jpg
  return (
    <div
      aria-label="Caio Weliton"
      role="img"
      style={{ width: size, height: size }}
      className="rounded-full bg-gradient-to-br from-amber-600 to-orange-700 border border-stone-700 flex items-center justify-center text-white font-bold"
    >
      <span style={{ fontSize: size / 2.8 }}>CW</span>
    </div>
  )
}
