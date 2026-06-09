import type { MDXComponents } from 'mdx/types'

export const components: MDXComponents = {
  h1: ({ children }) => <h1 className="text-2xl font-bold text-foreground mt-10 mb-4">{children}</h1>,
  h2: ({ children }) => <h2 className="text-xl font-bold text-foreground mt-8 mb-3">{children}</h2>,
  h3: ({ children }) => <h3 className="text-lg font-semibold text-foreground mt-6 mb-2">{children}</h3>,
  p: ({ children }) => <p className="text-muted leading-relaxed my-4">{children}</p>,
  a: ({ children, href }) => <a href={href} className="text-accent hover:text-accent-strong underline underline-offset-2">{children}</a>,
  ul: ({ children }) => <ul className="list-disc pl-6 my-4 text-muted space-y-1.5">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-6 my-4 text-muted space-y-1.5">{children}</ol>,
  code: ({ children, className, ...props }) =>
    'data-language' in props ? (
      // bloco (rehype-pretty-code): pre cuida de fundo/borda/scroll
      <code className={`${className ?? ''} font-mono text-accent`} {...props}>{children}</code>
    ) : (
      // inline
      <code className="font-mono text-sm bg-surface text-accent rounded px-1.5 py-0.5">{children}</code>
    ),
  pre: ({ children }) => <pre className="font-mono text-sm bg-background border border-border rounded-lg p-4 my-5 overflow-x-auto">{children}</pre>,
  blockquote: ({ children }) => <blockquote className="border-l-2 border-accent pl-4 my-5 text-muted italic">{children}</blockquote>,
}
