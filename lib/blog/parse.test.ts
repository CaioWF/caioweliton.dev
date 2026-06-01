import { describe, test, expect } from 'vitest'
import { parsePostMeta } from './parse'

const raw = `---
title: Meu Post
date: 2026-05-20
description: Um resumo
tags: [Node.js, AWS]
---

# Olá

Conteúdo com algumas palavras para o cálculo de tempo de leitura.
`

describe('parsePostMeta', () => {
  test('extrai frontmatter + slug', () => {
    const meta = parsePostMeta(raw, 'meu-post')
    expect(meta.slug).toBe('meu-post')
    expect(meta.title).toBe('Meu Post')
    expect(meta.date).toBe('2026-05-20')
    expect(meta.description).toBe('Um resumo')
    expect(meta.tags).toEqual(['Node.js', 'AWS'])
  })
  test('calcula readingMinutes >= 1', () => {
    const meta = parsePostMeta(raw, 'meu-post')
    expect(meta.readingMinutes).toBeGreaterThanOrEqual(1)
  })
})
