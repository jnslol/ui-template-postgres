"use client"

import { useState, type FormEvent } from "react"
import { Button, buttonClass } from "./staff-button"
import { Callout } from "./staff-display"
import { Field, Input, Textarea } from "./staff-form"
import { Breadcrumbs, FormSection, Page, PageHeader, SaveBar } from "./staff-layout"
import { statusOptions, type ProjectDraft } from "./staff-project"
import { Select } from "./staff-select"

const emptyDraft: ProjectDraft = { name: "", owner: "", status: "planning", notes: "" }

export function ProjectForm({
  initial, listHref, cancelHref = listHref, onSave,
}: {
  initial?: ProjectDraft
  listHref: string
  cancelHref?: string
  onSave: (draft: ProjectDraft) => Promise<void>
}) {
  const [draft, setDraft] = useState(initial ?? emptyDraft)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const title = initial ? "Edit project" : "New project"

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (saving) return
    setError("")
    const { name, owner, status, notes } = draft
    const payload = { name: name.trim(), owner: owner.trim(), status, notes }
    if (!payload.name || !payload.owner) {
      setError("Enter a project name and an owner.")
      return
    }
    setSaving(true)
    try {
      await onSave(payload)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The project could not be saved.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Page width="narrow">
      <Breadcrumbs items={[{ label: "Projects", render: <a href={listHref} /> }, { label: title }]} />
      <PageHeader title={title} description="Set the project’s name, owner, and status." />
      <form onSubmit={submit} className="flex flex-col gap-4">
        {error && <Callout tone="danger">{error}</Callout>}
        <FormSection title="Project details">
          <Field label="Project name" name="name"><Input required maxLength={100} value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></Field>
          <Field label="Owner" name="owner"><Input required maxLength={100} value={draft.owner} onChange={(e) => setDraft({ ...draft, owner: e.target.value })} /></Field>
          <div className="flex flex-col gap-1.5"><label htmlFor="project-status" className="text-label font-medium">Status</label>
            <Select id="project-status" aria-label="Status" options={statusOptions} value={draft.status} onValueChange={(status) => setDraft({ ...draft, status })} />
          </div>
        </FormSection>
        <FormSection title="Notes" description="Record any context the team should know.">
          <Field label="Project notes" name="notes">
            <Textarea rows={4} maxLength={2000} value={draft.notes} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} />
          </Field>
        </FormSection>
        <SaveBar status={saving ? "Saving…" : undefined}>
          <a className={buttonClass({ variant: "ghost" })} href={cancelHref}>Cancel</a>
          <Button variant="primary" type="submit" loading={saving}>Save project</Button>
        </SaveBar>
      </form>
    </Page>
  )
}
