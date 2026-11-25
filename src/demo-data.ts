import type { Project } from "./ui/staff-project"

export const sampleProjects: Project[] = [
  { id: "900bcbf4-94cb-4ad2-95ef-3655d8e1b602", name: "North Campus rollout", owner: "Maya Chen", status: "active", notes: "Phase one covers the main building. Coordinate site access with facilities before scheduling installation." },
  { id: "6099813b-dde9-491f-ab90-3e8394352d03", name: "Warehouse connectivity", owner: "Jordan Ellis", status: "planning", notes: "Confirm the coverage requirements with the warehouse team." },
  { id: "0d043523-bac8-44a1-a282-832ef105168d", name: "West district pilot", owner: "Sofia Rivera", status: "paused", notes: "Waiting on the revised delivery window." },
  { id: "cf171c26-edba-4022-9647-e932e643054a", name: "Branch network refresh", owner: "Maya Chen", status: "active", notes: "Review the rollout checklist with the support team." },
]
