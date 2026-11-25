import { closeDb, migrateDb } from "./db"

try {
  await migrateDb()
  console.log("Database migrations applied.")
} finally {
  await closeDb()
}
