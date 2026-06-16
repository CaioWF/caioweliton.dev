import path from 'node:path'
import { Document, Page, View, Text, Link, StyleSheet, Font, renderToBuffer } from '@react-pdf/renderer'
import type { Locale } from '@/lib/i18n/locales'
import { parseEmphasis } from '@/lib/text/emphasis'
import type { CvModel } from './model'

// Fonte embutida (IBM Plex Sans). Continua texto vetorial selecionável -> ATS lê normal.
// Resolvido em runtime a partir do cwd; o tracing do standalone copia para ./lib/cv/fonts.
const FONT_DIR = path.join(process.cwd(), 'lib', 'cv', 'fonts')
Font.register({
  family: 'IBM Plex Sans',
  fonts: [
    { src: path.join(FONT_DIR, 'IBMPlexSans-Regular.ttf'), fontWeight: 400 },
    { src: path.join(FONT_DIR, 'IBMPlexSans-Medium.ttf'), fontWeight: 500 },
    { src: path.join(FONT_DIR, 'IBMPlexSans-SemiBold.ttf'), fontWeight: 600 },
    { src: path.join(FONT_DIR, 'IBMPlexSans-Bold.ttf'), fontWeight: 700 },
  ],
})

// Não quebrar palavras com hífen no meio (legibilidade + ATS).
Font.registerHyphenationCallback((word) => [word])

const stripProtocol = (url: string) => url.replace(/^https?:\/\//, '')

const LABELS = {
  pt: { experience: 'Experiência', skills: 'Competências', education: 'Formação', languages: 'Idiomas', awards: 'Certificações & Prêmios' },
  en: { experience: 'Experience', skills: 'Skills', education: 'Education', languages: 'Languages', awards: 'Certifications & Awards' },
} as const

// Paleta neutra profissional + um único acento navy (headers + títulos de cargo).
const INK = '#111827'
const BODY = '#374151'
const MUTED = '#6b7280'
const RULE = '#d1d5db'
const ACCENT = '#1e40af'

const s = StyleSheet.create({
  page: { paddingVertical: 44, paddingHorizontal: 50, fontSize: 10, color: BODY, fontFamily: 'IBM Plex Sans', lineHeight: 1.45 },
  name: { fontSize: 22, fontWeight: 700, color: INK, lineHeight: 1.2 },
  role: { fontSize: 11, fontWeight: 500, color: '#4b5563', marginTop: 2, lineHeight: 1.3 },
  headline: { fontSize: 9, color: MUTED, marginTop: 3 },
  contactRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 6, fontSize: 9, color: MUTED },
  contactItem: { marginRight: 6, color: MUTED, textDecoration: 'none' },
  contactSep: { marginRight: 6, color: '#9ca3af' },
  headerRule: { borderBottomWidth: 0.75, borderBottomColor: RULE, marginTop: 12 },
  summary: { marginTop: 12, fontSize: 9.5, color: BODY, lineHeight: 1.5 },
  section: { marginTop: 16 },
  h2row: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: ACCENT, paddingBottom: 3, marginBottom: 9 },
  h2mark: { width: 3, height: 10, backgroundColor: ACCENT, borderRadius: 1, marginRight: 6 },
  h2: { fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, color: ACCENT },
  job: { marginBottom: 12 },
  company: { fontSize: 10.5, fontWeight: 700, color: INK },
  roleEntry: { marginTop: 5, paddingLeft: 10, borderLeftWidth: 1, borderLeftColor: '#e5e7eb' },
  roleTitle: { fontSize: 9.5, fontWeight: 600, color: ACCENT },
  jobHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 3 },
  period: { fontSize: 9, color: MUTED },
  bullet: { flexDirection: 'row', marginBottom: 2.5, paddingRight: 6 },
  bulletDot: { width: 10, color: MUTED },
  bulletText: { flex: 1, color: BODY },
  bulletStrong: { fontWeight: 600, color: INK },
  skill: { flexDirection: 'row', marginBottom: 4 },
  skillLabel: { width: 124, paddingRight: 8, fontWeight: 700, color: INK },
  skillItems: { flex: 1, color: BODY, lineHeight: 1.4 },
  eduRow: { marginBottom: 8 },
  eduHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  eduDegree: { fontWeight: 700, color: INK },
  eduSchool: { fontSize: 9.5, color: '#4b5563' },
  eduNote: { fontSize: 9, color: MUTED },
  langRow: { flexDirection: 'row', marginBottom: 3 },
  langName: { width: 124, paddingRight: 8, fontWeight: 700, color: INK },
  langLevel: { flex: 1, color: BODY },
  award: { flexDirection: 'row', marginBottom: 2.5, paddingRight: 6 },
  awardDot: { width: 10, color: MUTED },
  awardText: { flex: 1, color: BODY },
})

function SectionHeader({ children }: { children: string }) {
  return (
    <View style={s.h2row}>
      <View style={s.h2mark} />
      <Text style={s.h2}>{children}</Text>
    </View>
  )
}

function Bullet({ text }: { text: string }) {
  return (
    <View style={s.bullet}>
      <Text style={s.bulletDot}>•</Text>
      <Text style={s.bulletText}>
        {parseEmphasis(text).map((seg, i) =>
          seg.bold ? <Text key={i} style={s.bulletStrong}>{seg.text}</Text> : seg.text,
        )}
      </Text>
    </View>
  )
}

function CvDocument({ model, locale }: { model: CvModel; locale: Locale }) {
  const contacts = [
    { text: model.email, href: `mailto:${model.email}` },
    { text: model.location },
    { text: stripProtocol(model.website), href: model.website },
    { text: stripProtocol(model.github), href: model.github },
  ]
  const t = LABELS[locale]

  return (
    <Document title={`CV — ${model.name}`} author={model.name}>
      <Page size="A4" style={s.page}>
        <Text style={s.name}>{model.name}</Text>
        <Text style={s.role}>{model.role}</Text>
        <Text style={s.headline}>{model.headline}</Text>
        <View style={s.contactRow}>
          {contacts.map((c, i) => (
            <View key={c.text} style={{ flexDirection: 'row' }}>
              {c.href ? (
                <Link src={c.href} style={s.contactItem}>{c.text}</Link>
              ) : (
                <Text style={s.contactItem}>{c.text}</Text>
              )}
              {i < contacts.length - 1 && <Text style={s.contactSep}>·</Text>}
            </View>
          ))}
        </View>
        <View style={s.headerRule} />
        <Text style={s.summary}>{model.summary}</Text>

        <View style={s.section}>
          <SectionHeader>{t.experience}</SectionHeader>
          {model.experience.map((j, i) => (
            <View key={i} style={s.job}>
              <View style={s.jobHeader}>
                <Text style={s.company}>{j.company}</Text>
                <Text style={s.period}>{j.period}</Text>
              </View>
              {j.roles.map((r, ri) => (
                <View key={ri} wrap={false} style={s.roleEntry}>
                  <View style={s.jobHeader}>
                    <Text style={s.roleTitle}>{r.role}</Text>
                    <Text style={s.period}>{r.period}</Text>
                  </View>
                  {r.bullets.map((b, k) => (
                    <Bullet key={k} text={b} />
                  ))}
                </View>
              ))}
            </View>
          ))}
        </View>

        <View style={s.section}>
          <SectionHeader>{t.skills}</SectionHeader>
          {model.skills.map((c, i) => (
            <View key={i} style={s.skill} wrap={false}>
              <Text style={s.skillLabel}>{c.label}</Text>
              <Text style={s.skillItems}>{c.items.join(' · ')}</Text>
            </View>
          ))}
        </View>

        <View style={s.section}>
          <SectionHeader>{t.education}</SectionHeader>
          {model.education.map((e, i) => (
            <View key={i} style={s.eduRow} wrap={false}>
              <View style={s.eduHeader}>
                <Text style={s.eduDegree}>{e.degree}</Text>
                <Text style={s.period}>{e.period}</Text>
              </View>
              <Text style={s.eduSchool}>{e.school}</Text>
              {e.note && <Text style={s.eduNote}>{e.note}</Text>}
            </View>
          ))}
        </View>

        <View style={s.section}>
          <SectionHeader>{t.languages}</SectionHeader>
          {model.languages.map((l, i) => (
            <View key={i} style={s.langRow}>
              <Text style={s.langName}>{l.name}</Text>
              <Text style={s.langLevel}>{l.level}</Text>
            </View>
          ))}
        </View>

        <View style={s.section}>
          <SectionHeader>{t.awards}</SectionHeader>
          {model.awards.map((a, i) => (
            <View key={i} style={s.award}>
              <Text style={s.awardDot}>•</Text>
              <Text style={s.awardText}>{a}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  )
}

export function renderCv(model: CvModel, locale: Locale): Promise<Buffer> {
  return renderToBuffer(<CvDocument model={model} locale={locale} />)
}
