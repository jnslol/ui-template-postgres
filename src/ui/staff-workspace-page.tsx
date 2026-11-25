import { ArrowRight, FolderKanban } from "lucide-react"
import { buttonClass } from "./staff-button"
import { Badge, EmptyState } from "./staff-display"
import { Page, PageHeader, Panel, Section, StatGrid } from "./staff-layout"
import { statuses, type Project } from "./staff-project"

export function WorkspacePage({
  projects, listHref, recordHref,
}: {
  projects: Project[]
  listHref: string
  recordHref: (id: string) => string
}) {
  return (
    <Page>
      <PageHeader title="Workspace" description="See project activity across your team."
        actions={<a className={buttonClass()} href={listHref}>All projects <ArrowRight aria-hidden /></a>} />
      <StatGrid items={[
        { label: "Projects", value: projects.length },
        { label: "Active", value: projects.filter((project) => project.status === "active").length },
        { label: "Planning", value: projects.filter((project) => project.status === "planning").length },
      ]} />
      <Section title="Recent projects">
        <Panel>
          {projects.length ? (
            <ul className="divide-y divide-divider">
              {projects.slice(0, 5).map((project) => (
                <li key={project.id}>
                  <a href={recordHref(project.id)} className="flex items-center gap-3 px-4 py-3 hover:bg-subtle">
                    <FolderKanban className="size-4 shrink-0 text-muted" aria-hidden />
                    <span className="min-w-0 flex-1 truncate font-medium">{project.name}</span>
                    <Badge dot tone={statuses[project.status].tone}>{statuses[project.status].label}</Badge>
                  </a>
                </li>
              ))}
            </ul>
          ) : <EmptyState title="No recent projects" description="New projects will appear here." />}
        </Panel>
      </Section>
    </Page>
  )
}
