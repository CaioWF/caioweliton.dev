import { Fragment } from 'react'
import { Document, Page, View, Text, Link, StyleSheet, Font, renderToBuffer } from '@react-pdf/renderer'
import type { Locale } from '@/lib/i18n/locales'
import { parseEmphasis } from '@/lib/text/emphasis'
import type { CvModel } from './model'

// Fonte: Helvetica (padrão-14 do PDF, NÃO embutida). O react-pdf tem um bug de ToUnicode que
// corrompe ligaduras fi/fl na CAMADA DE TEXTO de QUALQUER fonte embutida (testado: IBM Plex e
// Roboto extraem "Defni/flas/fcam"; Helvetica extrai "Defini/filas/ficam"). Como o ATS lê a
// camada de texto, fonte padrão é obrigatória para as keywords não corromperem.
const FONT_FAMILY = 'Helvetica'

// Não quebrar palavras com hífen no meio (legibilidade + ATS).
Font.registerHyphenationCallback((word) => [word])

const stripProtocol = (url: string) => url.replace(/^https?:\/\//, '')

const LABELS = {
  pt: { experience: 'Experiência', skills: 'Competências', education: 'Formação', languages: 'Idiomas', awards: 'Certificações & Prêmios', projects: 'Projetos' },
  en: { experience: 'Experience', skills: 'Skills', education: 'Education', languages: 'Languages', awards: 'Certifications & Awards', projects: 'Projects' },
} as const

// Paleta neutra profissional + um único acento navy (headers + títulos de cargo).
const INK = '#111827'
const BODY = '#374151'
const MUTED = '#6b7280'
const RULE = '#d1d5db'
const ACCENT = '#1e40af'

const s = StyleSheet.create({
  page: { paddingVertical: 44, paddingHorizontal: 50, fontSize: 10, color: BODY, fontFamily: FONT_FAMILY, lineHeight: 1.45 },
  name: { fontSize: 22, fontWeight: 700, color: INK, lineHeight: 1.2 },
  role: { fontSize: 11, fontWeight: 500, color: '#4b5563', marginTop: 2, lineHeight: 1.3 },
  headline: { fontSize: 9, color: MUTED, marginTop: 3 },
  contactRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 6, fontSize: 9, color: MUTED },
  contactItem: { marginRight: 6, color: MUTED, textDecoration: 'none' },
  contactSep: { marginRight: 6, color: '#9ca3af' },
  headerRule: { borderBottomWidth: 0.75, borderBottomColor: RULE, marginTop: 12 },
  summary: { marginTop: 12, fontSize: 9.5, color: BODY, lineHeight: 1.5 },
  // marginTop mora no header, não num View de seção: ver a nota do SectionHeader sobre
  // por que as seções não podem ser embrulhadas.
  h2row: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: ACCENT, paddingBottom: 3, marginTop: 16, marginBottom: 9 },
  h2mark: { width: 3, height: 10, backgroundColor: ACCENT, borderRadius: 1, marginRight: 6 },
  h2: { fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, color: ACCENT },
  jobSpacing: { marginTop: 12 },
  company: { fontSize: 10.5, fontWeight: 700, color: INK },
  roleEntry: { marginTop: 5, paddingLeft: 10, borderLeftWidth: 1, borderLeftColor: '#e5e7eb' },
  roleTitle: { fontSize: 9.5, fontWeight: 700, color: ACCENT },
  jobHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 3 },
  period: { fontSize: 9, color: MUTED },
  bullet: { flexDirection: 'row', marginBottom: 2.5, paddingRight: 6 },
  bulletDot: { width: 10, color: MUTED },
  bulletText: { flex: 1, color: BODY },
  bulletStrong: { fontWeight: 700, color: INK },
  // ATENÇÃO: lineHeight no react-pdf multiplica o fontSize DECLARADO NO MESMO style.
  // Sem fontSize aqui, ele usa o default de 18pt (não herda os 10 da página) e a linha
  // fica enorme. Sempre declarar fontSize junto de lineHeight.
  // Linha corrida ("Categoria: item, item"), não duas colunas: o texto usa a largura
  // inteira e a quebra continua sob o rótulo, o que rende mais conteúdo por página.
  skillLine: { marginBottom: 1.5, color: BODY, fontSize: 10, lineHeight: 1.3 },
  skillLabel: { fontWeight: 700, color: INK },
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
  project: { marginBottom: 8 },
  projectHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 1 },
  projectName: { fontSize: 10.5, fontWeight: 700, color: INK },
  projectLink: { fontSize: 9, color: ACCENT, textDecoration: 'none' },
  // Só a quebra de linha DENTRO da descrição fica apertada; o espaço entre projetos
  // (project.marginBottom) e o nome/stack seguem o padrão. fontSize obrigatório: ver
  // nota do lineHeight em `skill`.
  projectDesc: { color: BODY, marginBottom: 2, fontSize: 10, lineHeight: 1.3 },
  projectStack: { fontSize: 9, color: MUTED },
})

// NÃO embrulhar seção num <View>. O shouldBreak do @react-pdf/layout só quebra quando
// `breakingImprovesPresence = previousElements.length > 0`, e previousElements são os
// irmãos ANTERIORES DENTRO DO MESMO PAI. Header embrulhado = primeiro filho do View da
// seção = previousElements vazio = minPresenceAhead vira código morto, e o título fica
// órfão no rodapé com o conteúdo na página seguinte. Como filho direto da Page, o header
// tem irmãos antes dele e a regra passa a valer. Por isso o marginTop mora no h2row.
//
// minPresenceAhead do header cobre o PRIMEIRO BLOCO INTEIRO da seção, não um pedaço:
// se o header exigir menos espaço que o bloco seguinte, ele passa no próprio teste, o
// bloco não passa no dele, e o título fica sozinho de novo.
const AHEAD = {
  // jobHeader (~18pt) + o que ele próprio exige à frente (64pt: cargo + 1º bullet).
  experience: 84,
  // project wrap={false}: nome (~15) + descrição 2 linhas (~26) + stack (~12) + margem (8).
  projects: 64,
  // eduRow wrap={false}: grau (~15) + escola (~13) + nota (~12) + margem (8).
  education: 50,
  // Linha única (award, idioma, competência) + margem.
  line: 20,
} as const

function SectionHeader({ children, ahead }: { children: string; ahead: number }) {
  return (
    <View style={s.h2row} minPresenceAhead={ahead} wrap={false}>
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
    { text: model.phone, href: `tel:${model.phone.replace(/[^+\d]/g, '')}` },
    { text: model.location },
    { text: stripProtocol(model.website), href: model.website },
    { text: stripProtocol(model.github), href: model.github },
    { text: stripProtocol(model.linkedin).replace(/^www\./, ''), href: model.linkedin },
  ]
  const t = LABELS[locale]

  return (
    <Document title={`CV ${model.name}`} author={model.name}>
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

        <SectionHeader ahead={AHEAD.line}>{t.skills}</SectionHeader>
        {model.skills.map((c, i) => (
          <Text key={i} style={s.skillLine}>
            <Text style={s.skillLabel}>{c.label}: </Text>
            {c.items.join(', ')}
          </Text>
        ))}

        <SectionHeader ahead={AHEAD.experience}>{t.experience}</SectionHeader>
        {/* Empresa e cargos são filhos DIRETOS da Page, não aninhados num View de emprego:
            ver a nota do SectionHeader. Um bloco aninhado que começaria no meio da página
            é empurrado inteiro pra próxima, deixando um vão enorme. */}
        {model.experience.map((j, i) => (
          <Fragment key={j.company}>
            {/* minPresenceAhead: empresa não fica órfã (fica junto do cargo/1º bullet). */}
            <View style={[s.jobHeader, i > 0 ? s.jobSpacing : {}]} minPresenceAhead={64}>
              <Text style={s.company}>{j.company}</Text>
              <Text style={s.period}>{j.period}</Text>
            </View>
            {/* roleEntry SEM wrap={false}: bullets fluem entre páginas (enchem a página,
                evita vão). minPresenceAhead mantém título do cargo com o 1º bullet. */}
            {j.roles.map((r, ri) => (
              <View key={ri} style={s.roleEntry} minPresenceAhead={40}>
                <View style={s.jobHeader}>
                  <Text style={s.roleTitle}>{r.role}</Text>
                  <Text style={s.period}>{r.period}</Text>
                </View>
                {r.bullets.map((b, k) => (
                  <Bullet key={k} text={b} />
                ))}
              </View>
            ))}
          </Fragment>
        ))}

        <SectionHeader ahead={AHEAD.education}>{t.education}</SectionHeader>
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

        <SectionHeader ahead={AHEAD.line}>{t.awards}</SectionHeader>
        {model.awards.map((a, i) => (
          <View key={i} style={s.award}>
            <Text style={s.awardDot}>•</Text>
            <Text style={s.awardText}>{a}</Text>
          </View>
        ))}

        <SectionHeader ahead={AHEAD.line}>{t.languages}</SectionHeader>
        {model.languages.map((l, i) => (
          <View key={i} style={s.langRow}>
            <Text style={s.langName}>{l.name}</Text>
            <Text style={s.langLevel}>{l.level}</Text>
          </View>
        ))}

        {model.projects.length > 0 && (
          <>
            <SectionHeader ahead={AHEAD.projects}>{t.projects}</SectionHeader>
            {model.projects.map((p, i) => (
              <View key={i} style={s.project} wrap={false}>
                <View style={s.projectHeader}>
                  <Text style={s.projectName}>{p.name}</Text>
                  {p.link && <Link src={p.link} style={s.projectLink}>{stripProtocol(p.link)}</Link>}
                </View>
                <Text style={s.projectDesc}>
                  {parseEmphasis(p.description).map((seg, k) =>
                    seg.bold ? <Text key={k} style={s.bulletStrong}>{seg.text}</Text> : seg.text,
                  )}
                </Text>
                <Text style={s.projectStack}>{p.stack.join(', ')}</Text>
              </View>
            ))}
          </>
        )}
      </Page>
    </Document>
  )
}

export function renderCv(model: CvModel, locale: Locale): Promise<Buffer> {
  return renderToBuffer(<CvDocument model={model} locale={locale} />)
}
