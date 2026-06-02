import type { Locale } from '@/lib/i18n/locales'
import { site } from '@/data/site'
import { Tile } from '@/components/bento/tile'

export function Contact({ locale }: { locale: Locale }) {
  return (
    <Tile id="contact" featured label="contato" className="md:col-span-6">
      <div className="relative overflow-hidden text-center py-8">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-72 w-[32rem] max-w-full rounded-full"
            style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)', opacity: 0.08 }} />
        </div>
        <div className="relative">
          <h2 className="font-display text-3xl md:text-4xl tracking-tight text-foreground mb-4">
            {locale === 'pt' ? 'Vamos conversar?' : "Let's talk?"}
          </h2>
          <p className="max-w-md mx-auto text-muted mb-9 leading-relaxed">
            {locale === 'pt'
              ? 'Aberto a oportunidades, colaborações e conversas sobre arquitetura e liderança técnica.'
              : 'Open to opportunities, collaborations and conversations about architecture and technical leadership.'}
          </p>
          <a href={`mailto:${site.email}`}
            className="inline-block font-mono text-sm bg-accent hover:bg-accent-strong text-white rounded-md px-9 py-3.5 transition-colors mb-10">
            {site.email} →
          </a>
          <div className="flex justify-center gap-8 font-mono text-xs text-faint">
            <a href={site.socials.github} target="_blank" rel="noreferrer" className="hover:text-accent">GitHub</a>
            <a href={site.socials.linkedin} target="_blank" rel="noreferrer" className="hover:text-accent">LinkedIn</a>
            <a href={site.socials.medium} target="_blank" rel="noreferrer" className="hover:text-accent">Medium</a>
          </div>
          <div className="mt-10 flex justify-center gap-6 font-mono text-[11px] text-faint">
            <a href={`/${locale}/now`} className="hover:text-accent">now</a>
            <a href={`/${locale}/uses`} className="hover:text-accent">uses</a>
            <a href={`/${locale}/blog`} className="hover:text-accent">blog</a>
          </div>
          <p className="mt-14 pt-6 border-t border-border font-mono text-[10px] text-faint">
            © {new Date().getFullYear()} Caio Weliton
          </p>
        </div>
      </div>
    </Tile>
  )
}
