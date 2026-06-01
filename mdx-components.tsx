import type { MDXComponents } from 'mdx/types'

export const components: MDXComponents = {
  h1: ({ children }) => <h1 className="text-2xl font-bold text-stone-50 mt-10 mb-4">{children}</h1>,
  h2: ({ children }) => <h2 className="text-xl font-bold text-stone-100 mt-8 mb-3">{children}</h2>,
  h3: ({ children }) => <h3 className="text-lg font-semibold text-stone-100 mt-6 mb-2">{children}</h3>,
  p: ({ children }) => <p className="text-stone-300 leading-relaxed my-4">{children}</p>,
  a: ({ children, href }) => <a href={href} className="text-amber-500 hover:text-amber-400 underline underline-offset-2">{children}</a>,
  ul: ({ children }) => <ul className="list-disc pl-6 my-4 text-stone-300 space-y-1.5">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-6 my-4 text-stone-300 space-y-1.5">{children}</ol>,
  code: ({ children }) => <code className="font-mono text-sm bg-stone-900 text-amber-300 rounded px-1.5 py-0.5">{children}</code>,
  pre: ({ children }) => <pre className="font-mono text-sm bg-stone-950 border border-stone-800 rounded-lg p-4 my-5 overflow-x-auto">{children}</pre>,
  blockquote: ({ children }) => <blockquote className="border-l-2 border-amber-700 pl-4 my-5 text-stone-400 italic">{children}</blockquote>,
}
