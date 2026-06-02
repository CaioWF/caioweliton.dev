export interface Rgb {
  r: number
  g: number
  b: number
}

const FALLBACK: Rgb = { r: 52, g: 211, b: 153 } // esmeralda

/** Opacidade de uma linha entre dois pontos: 1 perto, 0 ao atingir maxDistance. */
export function connectionOpacity(distance: number, maxDistance: number): number {
  if (distance >= maxDistance) return 0
  if (distance <= 0) return 1
  return 1 - distance / maxDistance
}

/** Converte "#rrggbb" (ou "rrggbb") em {r,g,b}. Fallback esmeralda se inválido. */
export function hexToRgb(hex: string): Rgb {
  const h = hex.trim().replace(/^#/, '')
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return FALLBACK
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  }
}
