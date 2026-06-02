export function SkipLink({ label }: { label: string }) {
  return (
    <a
      href="#content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded focus:bg-accent focus:px-4 focus:py-2 focus:text-white focus:font-mono focus:text-xs"
    >
      {label}
    </a>
  )
}
