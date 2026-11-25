import { drizzle } from "drizzle-orm/node-postgres"
import { migrate } from "drizzle-orm/node-postgres/migrator"
import { Pool } from "pg"

const connectionString = process.env.DATABASE_URL
if (!connectionString) throw new Error("Set DATABASE_URL in .env or in the process environment.")
const pool = new Pool({ connectionString })
export const db = drizzle(pool)
export const closeDb = () => pool.end()
export const migrateDb = () => migrate(db, { migrationsFolder: "./drizzle" })
