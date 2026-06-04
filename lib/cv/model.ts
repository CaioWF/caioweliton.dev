import type { Locale } from '@/lib/i18n/locales'
import { site } from '@/data/site'
import { experience } from '@/data/experience'
import { skills } from '@/data/skills'
import { SITE_URL } from '@/lib/seo/site-url'
import { education } from '@/data/education'
import { languages } from '@/data/languages'
import { awards } from '@/data/awards'

export type CvModel = {
  name: string
  role: string
  email: string
  location: string
  website: string
  github: string
  experience: { role: string; company: string; period: string; bullets: string[] }[]
  skills: { label: string; items: string[] }[]
  summary: string
  education: { degree: string; school: string; period: string; note?: string }[]
  languages: { name: string; level: string }[]
  awards: string[]
}

export function buildCvModel(locale: Locale): CvModel {
  return {
    name: site.name,
    role: site.role[locale],
    email: site.email,
    location: site.location[locale],
    website: SITE_URL,
    github: site.socials.github,
    experience: experience.map((j) => ({
      role: j.role[locale],
      company: j.company,
      period: j.period[locale],
      bullets: j.bullets[locale],
    })),
    skills: skills.map((c) => ({ label: c.label[locale], items: c.items.map((i) => i[locale]) })),
    summary: site.summary[locale],
    education: education.map((e) => ({ degree: e.degree[locale], school: e.school, period: e.period, note: e.note?.[locale] })),
    languages: languages.map((l) => ({ name: l.name[locale], level: l.level[locale] })),
    awards: awards.map((a) => a[locale]),
  }
}

export function cvFileName(locale: Locale): string {
  return `cv-caio-weliton-${locale}.pdf`
}
