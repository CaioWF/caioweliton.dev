'use client'

import { useEffect, useRef } from 'react'
import { connectionOpacity, hexToRgb, type Rgb } from '@/lib/bg/field'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
}

const LINK_DISTANCE = 130 // px entre partículas que conectam
const CURSOR_DISTANCE = 170 // px de alcance do cursor
const DENSITY = 14000 // 1 partícula a cada N px² (baixa densidade = sutil)
const MAX_PARTICLES = 90

function readAccent(): Rgb {
  if (typeof window === 'undefined') return { r: 52, g: 211, b: 153 }
  const v = getComputedStyle(document.documentElement).getPropertyValue('--accent')
  return hexToRgb(v || '#34d399')
}

export function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const maybeEl = canvasRef.current
    if (!maybeEl) return
    const el: HTMLCanvasElement = maybeEl
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return // respeita reduced-motion: sem animação

    const ctx2d = el.getContext('2d')
    if (!ctx2d) return
    const ctx: CanvasRenderingContext2D = ctx2d

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let width = 0
    let height = 0
    let particles: Particle[] = []
    let accent = readAccent()
    let raf = 0
    const mouse = { x: -9999, y: -9999 }

    function resize() {
      width = window.innerWidth
      height = window.innerHeight
      el.width = width * dpr
      el.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const target = Math.min(MAX_PARTICLES, Math.floor((width * height) / DENSITY))
      particles = Array.from({ length: target }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
      }))
    }

    function rgba(c: Rgb, a: number) {
      return `rgba(${c.r},${c.g},${c.b},${a})`
    }

    function frame() {
      ctx.clearRect(0, 0, width, height)
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > width) p.vx *= -1
        if (p.y < 0 || p.y > height) p.vy *= -1
      }
      // linhas entre partículas próximas
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i]
          const b = particles[j]
          const d = Math.hypot(a.x - b.x, a.y - b.y)
          const o = connectionOpacity(d, LINK_DISTANCE)
          if (o > 0) {
            ctx.strokeStyle = rgba(accent, o * 0.15)
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
        // linha p/ o cursor (mais visível)
        const dm = Math.hypot(particles[i].x - mouse.x, particles[i].y - mouse.y)
        const om = connectionOpacity(dm, CURSOR_DISTANCE)
        if (om > 0) {
          ctx.strokeStyle = rgba(accent, om * 0.4)
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(particles[i].x, particles[i].y)
          ctx.lineTo(mouse.x, mouse.y)
          ctx.stroke()
        }
      }
      // pontos
      for (const p of particles) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, 1.4, 0, Math.PI * 2)
        ctx.fillStyle = rgba(accent, 0.5)
        ctx.fill()
      }
      raf = requestAnimationFrame(frame)
    }

    function onMove(e: MouseEvent) {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }
    function onLeave() {
      mouse.x = -9999
      mouse.y = -9999
    }
    function onVisibility() {
      if (document.hidden) {
        cancelAnimationFrame(raf)
      } else {
        raf = requestAnimationFrame(frame)
      }
    }
    const observer = new MutationObserver(() => {
      accent = readAccent()
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseleave', onLeave)
    document.addEventListener('visibilitychange', onVisibility)
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
    />
  )
}
