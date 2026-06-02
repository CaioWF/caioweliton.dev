import { site } from '@/data/site'
import { Tile } from '@/components/bento/tile'

export function Links() {
  const links = [
    { label: 'GitHub', href: site.socials.github },
    { label: 'LinkedIn', href: site.socials.linkedin },
    { label: 'Medium', href: site.socials.medium },
  ]
  return (
    <Tile label="links" className="md:col-span-2">
      <ul className="space-y-2 font-mono text-sm">
        {links.map((l) => (
          <li key={l.label}>
            <a href={l.href} target="_blank" rel="noreferrer" className="text-muted hover:text-accent transition-colors">
              {l.label} ↗
            </a>
          </li>
        ))}
      </ul>
    </Tile>
  )
}
