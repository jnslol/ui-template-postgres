"use client"

import { useState } from "react"
import { FolderOpen, Plus, Search } from "lucide-react"
import { Button, buttonClass } from "./staff-button"
import { Avatar, Badge, EmptyState, Table, Td, Th, Tr } from "./staff-display"
import { AffixInput } from "./staff-form"
import { Page, PageHeader, Panel, Toolbar } from "./staff-layout"
import { Select } from "./staff-select"
import { statuses, statusOptions, type Project, type ProjectStatus } from "./staff-project"

export function ProjectList({
  projects, createHref, recordHref,
}: {
  projects: Project[]
  createHref: string
  recordHref: (id: string) => string
}) {
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<ProjectStatus | "all">("all")
  const term = search.trim().toLowerCase()
  const filtered = projects.filter((project) =>
    (status === "all" || project.status === status) &&
    [project.name, project.owner].some((value) => value.toLowerCase().includes(term)),
  )
  const newProject = <a className={buttonClass({ variant: "primary" })} href={createHref}><Plus aria-hidden /> New project</a>

  return (
    <Page>
      <PageHeader title="Projects" description="Browse and manage the projects in your workspace." actions={newProject} />
      <Toolbar end={<span className="text-label text-muted" role="status">{filtered.length} of {projects.length} projects</span>}>
        <AffixInput size="sm" className="w-56 max-w-full [&_svg]:size-4" prefix={<Search aria-hidden />} type="search"
          aria-label="Search projects" placeholder="Search projects…" value={search} onChange={(event) => setSearch(event.target.value)} />
        <Select size="sm" className="w-36 max-w-full" aria-label="Filter by status" value={status} onValueChange={setStatus} options={[{ value: "all", label: "All statuses" }, ...statusOptions]} />
      </Toolbar>
      <Panel>
        {filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <caption className="sr-only">Projects</caption>
              <thead><tr><Th scope="col">Project</Th><Th scope="col">Owner</Th><Th scope="col">Status</Th></tr></thead>
              <tbody>
                {filtered.map((project) => (
                  <Tr key={project.id} className="last:[&>td]:border-b-0 hover:bg-subtle">
                    <Td><a href={recordHref(project.id)} className="font-medium text-accent-fg hover:underline">{project.name}</a></Td>
                    <Td><span className="flex items-center gap-2"><Avatar name={project.owner} />{project.owner}</span></Td>
                    <Td><Badge dot tone={statuses[project.status].tone}>{statuses[project.status].label}</Badge></Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          </div>
        ) : (
          <EmptyState icon={<FolderOpen aria-hidden />} title={projects.length ? "No matching projects" : "No projects yet"}
            description={projects.length ? "Try another search or clear the status filter." : "Create a project to start tracking work."}
            action={projects.length ? <Button onClick={() => { setSearch(""); setStatus("all") }}>Clear filters</Button> : newProject} />
        )}
      </Panel>
    </Page>
  )
}
