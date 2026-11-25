export const projectStatuses = ["active", "planning", "paused"] as const
export type ProjectStatus = (typeof projectStatuses)[number]

export type ProjectDraft = { name: string; owner: string; status: ProjectStatus; notes: string }
export type Project = ProjectDraft & { id: string }

export const statuses = {
  active: { label: "Active", tone: "success" },
  planning: { label: "Planning", tone: "info" },
  paused: { label: "Paused", tone: "warning" },
} as const

export const statusOptions = projectStatuses.map((value) => ({ value, label: statuses[value].label }))
