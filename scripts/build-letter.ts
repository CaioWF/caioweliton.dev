// CLI local de carta de apresentação (roda via `tsx`). NÃO exposto na web.
//
//   tsx scripts/build-letter.ts <arquivo.txt> [--out=carta.pdf]
//
// Lê um .txt (parágrafos separados por linha em branco), renderiza um PDF simples e limpo
// com a mesma fonte Helvetica do CV (padrão-14, não embutida) para extração ATS limpa.
// Saída em cv-out/ (gitignored).
//
// Se o primeiro bloco começar com "# ", vira cabeçalho: a linha do "# " é o nome (destaque)
// e as linhas seguintes do bloco são cargo + contato, com filete abaixo.
// Layout segue prática corrente de carta digital: margem ~1in, corpo 11pt, entrelinha 1.5,
// texto alinhado à esquerda (justificado abre rios de espaço, piora legibilidade e parsing ATS).
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs'
import { join, dirname, resolve, basename } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Document, Page, Text, View, StyleSheet, Font, renderToBuffer, type DocumentProps } from '@react-pdf/renderer'
import React from 'react'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const args = process.argv.slice(2)
const opt = (n: string, d: string) => {
  const a = args.find((x) => x.startsWith(`--${n}=`))
  return a ? a.slice(n.length + 3) : d
}
const input = args.find((a) => !a.startsWith('--'))
if (!input) {
  console.error('[carta] uso: tsx scripts/build-letter.ts <arquivo.txt> [--out=nome.pdf]')
  process.exit(1)
}

const FONT_FAMILY = 'Helvetica'
Font.registerHyphenationCallback((word) => [word])

const INK = '#111827'
const BODY = '#374151'
const MUTED = '#6b7280'
const RULE = '#d1d5db'

const s = StyleSheet.create({
  page: { paddingVertical: 64, paddingHorizontal: 72, fontSize: 11, color: BODY, fontFamily: FONT_FAMILY, lineHeight: 1.5 },
  header: { marginBottom: 22, paddingBottom: 12, borderBottomWidth: 0.75, borderBottomColor: RULE },
  name: { fontSize: 16, color: INK, letterSpacing: 0.2, marginBottom: 5 },
  headerLine: { fontSize: 9.5, color: MUTED, lineHeight: 1.45 },
  para: { marginBottom: 11, textAlign: 'left' },
})

const raw = readFileSync(resolve(input), 'utf8').replace(/\r\n/g, '\n').trim()
// Blocos separados por linha em branco. Newlines internas viram quebra de linha (assinatura).
const blocks = raw.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)

// Cabeçalho opcional: primeiro bloco iniciado por "# " -> nome + linhas de cargo/contato.
let header: { name: string; lines: string[] } | null = null
if (blocks[0]?.startsWith('# ')) {
  const [first, ...rest] = blocks.shift()!.split('\n')
  header = { name: first.slice(2).trim(), lines: rest.map((l) => l.trim()).filter(Boolean) }
}

const doc = React.createElement(
  Document,
  null,
  React.createElement(
    Page,
    { size: 'A4', style: s.page },
    ...(header
      ? [
          React.createElement(
            View,
            { key: 'header', style: s.header },
            React.createElement(Text, { style: s.name }, header.name),
            ...header.lines.map((l, i) => React.createElement(Text, { key: i, style: s.headerLine }, l)),
          ),
        ]
      : []),
    ...blocks.map((p, i) => React.createElement(Text, { key: i, style: s.para }, p)),
  ),
)

async function main() {
  const buf = await renderToBuffer(doc as React.ReactElement<DocumentProps>)
  const outDir = join(root, 'cv-out')
  mkdirSync(outDir, { recursive: true })
  const name = opt('out', basename(input!).replace(/\.txt$/, '') + '.pdf')
  const path = join(outDir, name)
  writeFileSync(path, buf)
  console.log('[carta] PDF ->', path)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
