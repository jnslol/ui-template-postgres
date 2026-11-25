import { pgEnum, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core"
import { projectStatuses } from "../src/ui/staff-project"

export const projectStatus = pgEnum("project_status", projectStatuses)

export const projects = pgTable("projects", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 100 }).notNull(),
  owner: varchar({ length: 100 }).notNull(),
  status: projectStatus().notNull(),
  notes: text().notNull().default(""),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
})
