import type { Locale } from '@/lib/i18n/locales'
import { site, yearsOfExperience } from '@/data/site'
import { experience } from '@/data/experience'
import { skills } from '@/data/skills'
import { SITE_URL } from '@/lib/seo/site-url'
import { education } from '@/data/education'
import { languages } from '@/data/languages'
import { awards } from '@/data/awards'
import { projects } from '@/data/projects'

// Telefone só no CV (fora de data/site.ts, que é bundlado no client público).
const CV_PHONE = '+55 88 99621-2524'

export type CvModel = {
  name: string
  role: string
  headline: string
  email: string
  location: string
  website: string
  github: string
  linkedin: string
  experience: {
    company: string
    period: string
    roles: { role: string; period: string; bullets: string[] }[]
  }[]
  skills: { label: string; items: string[] }[]
  summary: string
  education: { degree: string; school: string; period: string; note?: string }[]
  languages: { name: string; level: string }[]
  awards: string[]
  phone: string
  projects: { name: string; description: string; stack: string[]; link?: string }[]
}

export function buildCvModel(locale: Locale): CvModel {
  return {
    name: site.name,
    role: site.role[locale],
    headline: site.headline[locale],
    email: site.email,
    location: site.location[locale],
    website: SITE_URL,
    github: site.socials.github,
    linkedin: site.socials.linkedin,
    experience: experience.map((j) => ({
      company: j.company,
      period: j.period[locale],
      roles: j.roles.map((r) => ({
        role: r.title[locale],
        period: r.period[locale],
        bullets: r.bullets[locale],
      })),
    })),
    skills: skills.map((c) => ({ label: c.label[locale], items: c.items.map((i) => i[locale]) })),
    summary: site.summary[locale].replace('{{years}}', String(yearsOfExperience())),
    education: education.map((e) => ({ degree: e.degree[locale], school: e.school, period: e.period, note: e.note?.[locale] })),
    languages: languages.map((l) => ({ name: l.name[locale], level: l.level[locale] })),
    awards: awards.map((a) => a[locale]),
    phone: CV_PHONE,
    projects: projects
      .filter((p) => p.type === 'pessoal')
      .map((p) => ({ name: p.title, description: p.description[locale], stack: p.stack, link: p.live ?? p.github })),
  }
}

export function cvFileName(locale: Locale): string {
  return `cv-caio-weliton-${locale}.pdf`
}
