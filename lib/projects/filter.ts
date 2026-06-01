import type { Project, ProjectType } from '@/data/projects'

export type ProjectFilter = { type?: ProjectType; stack?: string }

export function filterProjects(projects: Project[], filter: ProjectFilter): Project[] {
  return projects.filter((p) => {
    if (filter.type && p.type !== filter.type) return false
    if (filter.stack) {
      const needle = filter.stack.toLowerCase()
      if (!p.stack.some((s) => s.toLowerCase() === needle)) return false
    }
    return true
  })
}
