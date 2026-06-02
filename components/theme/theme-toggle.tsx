'use client'

import { useSyncExternalStore } from 'react'
import { useTheme } from 'next-themes'

const emptySubscribe = () => () => {}

// Hidratação-safe: false no SSR e no primeiro render do cliente (bate com o
// servidor), true após montar. Evita setState-in-effect (lint-clean).
function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  )
}

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useMounted()

  if (!mounted) return <span className="w-5 text-faint" aria-hidden />

  const isDark = resolvedTheme === 'dark'
  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Ativar tema claro' : 'Ativar tema escuro'}
      className="font-mono text-xs text-muted hover:text-accent transition-colors"
    >
      {isDark ? 'light' : 'dark'}
    </button>
  )
}
