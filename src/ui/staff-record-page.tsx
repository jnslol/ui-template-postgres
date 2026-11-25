"use client"

import { useState } from "react"
import { FolderKanban, Pencil, Trash2 } from "lucide-react"
import { Button, buttonClass } from "./staff-button"
import { Badge } from "./staff-display"
import { AttributeList, Breadcrumbs, EntityHeader, Page, Panel, RecordBody, Section } from "./staff-layout"
import { ConfirmDialog } from "./staff-overlay"
import { statuses, type Project } from "./staff-project"

export function ProjectRecord({
  project, listHref, editHref, onDelete,
}: {
  project: Project
  listHref: string
  editHref: string
  onDelete?: () => Promise<void>
}) {
  const [confirm, setConfirm] = useState(false)
  const status = statuses[project.status]

  return (
    <Page>
      <Breadcrumbs items={[{ label: "Projects", render: <a href={listHref} /> }, { label: project.name }]} />
      <EntityHeader
        leading={<div className="grid size-11 shrink-0 place-items-center rounded-card border border-border bg-surface text-muted"><FolderKanban aria-hidden className="size-5" /></div>}
        title={<span className="break-all">{project.name}</span>}
        meta={project.owner}
        status={<Badge dot tone={status.tone}>{status.label}</Badge>}
        actions={<>
          <a className={buttonClass()} href={editHref}><Pencil aria-hidden /> Edit project</a>
          {onDelete && <Button variant="danger-soft" onClick={() => setConfirm(true)}><Trash2 /> Delete</Button>}
        </>}
      />
      <RecordBody
        main={<Section title="Notes"><Panel className="px-4 py-3"><p className="wrap-anywhere whitespace-pre-wrap">{project.notes || "No notes yet."}</p></Panel></Section>}
        aside={<Panel className="px-4 py-3">
          <AttributeList title="Project details" items={[
            { label: "Project ID", value: project.id, mono: true },
            { label: "Owner", value: project.owner },
            { label: "Status", value: status.label },
          ]} />
        </Panel>}
      />
      {onDelete && <ConfirmDialog open={confirm} onOpenChange={setConfirm} title="Delete project?"
        description={`“${project.name}” will be removed permanently.`} confirmLabel="Delete project" cancelLabel="Cancel"
        variant="danger" onConfirm={onDelete} />}
    </Page>
  )
}
