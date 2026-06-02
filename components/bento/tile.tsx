import Link from 'next/link'
import { Reveal } from '@/components/reveal'

export function Tile({
  label,
  title,
  href,
  id,
  className,
  featured,
  children,
}: {
  label?: string
  title?: string
  href?: string
  id?: string
  className?: string
  featured?: boolean
  children?: React.ReactNode
}) {
  const card = `flex h-full flex-col rounded-xl border bg-surface p-6 transition-colors ${
    featured ? 'border-accent/40' : 'border-border'
  } ${href ? 'hover:border-accent/40' : ''}`

  const head = (
    <>
      {label && (
        <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-accent mb-3">{'// '}{label}</p>
      )}
      {title && (
        <h2 className="font-display text-xl md:text-2xl tracking-tight text-foreground mb-4">{title}</h2>
      )}
    </>
  )

  return (
    <Reveal className={className}>
      {href ? (
        <Link id={id} href={href} className={`group ${card}`}>
          {head}
          {children}
        </Link>
      ) : (
        <section id={id} className={card}>
          {head}
          {children}
        </section>
      )}
    </Reveal>
  )
}
