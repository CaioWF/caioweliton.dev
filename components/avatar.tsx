import Image from 'next/image'

export function Avatar({ width = 104, height = 138 }: { width?: number; height?: number }) {
  return (
    <Image
      src="/profile.png"
      alt="Caio Weliton"
      width={width}
      height={height}
      priority
      className="shrink-0 rounded-xl border border-border object-cover"
      style={{ width, height, objectPosition: '50% 20%' }}
    />
  )
}
