import { Document, Page, View, Text, StyleSheet, renderToBuffer } from '@react-pdf/renderer'
import type { Locale } from '@/lib/i18n/locales'
import type { CvModel } from './model'

const stripProtocol = (url: string) => url.replace(/^https?:\/\//, '')

const LABELS = {
  pt: { experience: 'Experiência', skills: 'Competências', education: 'Formação', languages: 'Idiomas', awards: 'Certificações & Prêmios' },
  en: { experience: 'Experience', skills: 'Skills', education: 'Education', languages: 'Languages', awards: 'Certifications & Awards' },
} as const

const s = StyleSheet.create({
  page: { paddingVertical: 44, paddingHorizontal: 50, fontSize: 10, color: '#292524', fontFamily: 'Helvetica', lineHeight: 1.45 },
  name: { fontSize: 24, fontFamily: 'Helvetica-Bold', color: '#1c1917', lineHeight: 1.2 },
  role: { fontSize: 11.5, fontFamily: 'Helvetica-Bold', color: '#b45309', marginTop: 2, lineHeight: 1.3 },
  contactRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 7, fontSize: 9, color: '#57534e' },
  contactItem: { marginRight: 6 },
  contactSep: { marginRight: 6, color: '#a8a29e' },
  accent: { height: 2, width: 46, backgroundColor: '#d97706', marginTop: 12 },
  summary: { marginTop: 12, fontSize: 9.5, color: '#44403c', lineHeight: 1.5 },
  section: { marginTop: 18 },
  h2: { fontSize: 9.5, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 1.5, color: '#78716c', borderBottomWidth: 0.75, borderBottomColor: '#e7e5e4', paddingBottom: 4, marginBottom: 10 },
  job: { marginBottom: 12 },
  jobHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 3 },
  jobRole: { fontSize: 10.5, fontFamily: 'Helvetica-Bold', color: '#1c1917' },
  jobCompany: { fontFamily: 'Helvetica', color: '#b45309' },
  period: { fontSize: 9, color: '#78716c' },
  bullet: { flexDirection: 'row', marginBottom: 2.5, paddingRight: 6 },
  bulletDot: { width: 11, color: '#d97706' },
  bulletText: { flex: 1, color: '#44403c' },
  skill: { flexDirection: 'row', marginBottom: 5 },
  skillLabel: { width: 96, fontFamily: 'Helvetica-Bold', color: '#1c1917' },
  skillItems: { flex: 1, color: '#57534e' },
  eduRow: { marginBottom: 8 },
  eduHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  eduDegree: { fontFamily: 'Helvetica-Bold', color: '#1c1917' },
  eduSchool: { fontSize: 9.5, color: '#57534e' },
  eduNote: { fontSize: 9, color: '#b45309' },
  langRow: { flexDirection: 'row', marginBottom: 3 },
  langName: { width: 96, fontFamily: 'Helvetica-Bold', color: '#1c1917' },
  langLevel: { flex: 1, color: '#57534e' },
  award: { flexDirection: 'row', marginBottom: 2.5, paddingRight: 6 },
  awardDot: { width: 11, color: '#d97706' },
  awardText: { flex: 1, color: '#44403c' },
})

function CvDocument({ model, locale }: { model: CvModel; locale: Locale }) {
  const contacts = [model.email, model.location, stripProtocol(model.website), stripProtocol(model.github)]
  const t = LABELS[locale]

  return (
    <Document title={`CV — ${model.name}`} author={model.name}>
      <Page size="A4" style={s.page}>
        <Text style={s.name}>{model.name}</Text>
        <Text style={s.role}>{model.role}</Text>
        <View style={s.contactRow}>
          {contacts.map((c, i) => (
            <View key={c} style={{ flexDirection: 'row' }}>
              <Text style={s.contactItem}>{c}</Text>
              {i < contacts.length - 1 && <Text style={s.contactSep}>·</Text>}
            </View>
          ))}
        </View>
        <View style={s.accent} />
        <Text style={s.summary}>{model.summary}</Text>

        <View style={s.section}>
          <Text style={s.h2}>{t.experience}</Text>
          {model.experience.map((j, i) => (
            <View key={i} style={s.job} wrap={false}>
              <View style={s.jobHeader}>
                <Text style={s.jobRole}>{j.role} <Text style={s.jobCompany}>· {j.company}</Text></Text>
                <Text style={s.period}>{j.period}</Text>
              </View>
              {j.bullets.map((b, k) => (
                <View key={k} style={s.bullet}>
                  <Text style={s.bulletDot}>•</Text>
                  <Text style={s.bulletText}>{b}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        <View style={s.section}>
          <Text style={s.h2}>{t.skills}</Text>
          {model.skills.map((c, i) => (
            <View key={i} style={s.skill}>
              <Text style={s.skillLabel}>{c.label}</Text>
              <Text style={s.skillItems}>{c.items.join('  ·  ')}</Text>
            </View>
          ))}
        </View>

        <View style={s.section}>
          <Text style={s.h2}>{t.education}</Text>
          {model.education.map((e, i) => (
            <View key={i} style={s.eduRow} wrap={false}>
              <View style={s.eduHeader}>
                <Text style={s.eduDegree}>{e.degree}</Text>
                <Text style={s.period}>{e.period}</Text>
              </View>
              <Text style={s.eduSchool}>{e.school}{e.note ? '' : ''}</Text>
              {e.note && <Text style={s.eduNote}>{e.note}</Text>}
            </View>
          ))}
        </View>

        <View style={s.section}>
          <Text style={s.h2}>{t.languages}</Text>
          {model.languages.map((l, i) => (
            <View key={i} style={s.langRow}>
              <Text style={s.langName}>{l.name}</Text>
              <Text style={s.langLevel}>{l.level}</Text>
            </View>
          ))}
        </View>

        <View style={s.section}>
          <Text style={s.h2}>{t.awards}</Text>
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
