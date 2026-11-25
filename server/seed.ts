import { sampleProjects } from "../src/demo-data"
import { closeDb, db } from "./db"
import { projects } from "./schema"

try {
  await db.insert(projects).values(sampleProjects).onConflictDoNothing({ target: projects.id })
  console.log("Sample projects ready.")
} finally {
  await closeDb()
}
