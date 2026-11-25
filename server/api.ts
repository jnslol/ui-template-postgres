import { desc, eq } from "drizzle-orm"
import { Hono } from "hono"
import { bodyLimit } from "hono/body-limit"
import { zValidator } from "@hono/zod-validator"
import { z } from "zod"
import { projectStatuses } from "../src/ui/staff-project"
import { db } from "./db"
import { projects } from "./schema"

const draft = z.strictObject({
  name: z.string().trim().min(1).max(100),
  owner: z.string().trim().min(1).max(100),
  status: z.enum(projectStatuses),
  notes: z.string().max(2000),
})
const routeId = z.object({ id: z.uuid() })
const columns = { id: projects.id, name: projects.name, owner: projects.owner, status: projects.status, notes: projects.notes }

export const api = new Hono()
  .basePath("/api")
  .use("/projects", bodyLimit({ maxSize: 16_384 }))
  .use("/projects/*", bodyLimit({ maxSize: 16_384 }))
  .get("/health", (c) => c.json({ ok: true }))
  .get("/projects", async (c) => c.json(
    await db.select(columns).from(projects).orderBy(desc(projects.createdAt), desc(projects.id)),
  ))
  .post("/projects", zValidator("json", draft), async (c) => {
    const [created] = await db.insert(projects).values(c.req.valid("json")).returning(columns)
    return c.json(created!, 201)
  })
  .get("/projects/:id", zValidator("param", routeId), async (c) => {
    const [project] = await db.select(columns).from(projects).where(eq(projects.id, c.req.valid("param").id))
    return project ? c.json(project, 200) : c.json({ message: "Project not found." }, 404)
  })
  .patch("/projects/:id", zValidator("param", routeId), zValidator("json", draft), async (c) => {
    const [updated] = await db.update(projects).set(c.req.valid("json")).where(eq(projects.id, c.req.valid("param").id)).returning(columns)
    return updated ? c.json(updated, 200) : c.json({ message: "Project not found." }, 404)
  })
  .delete("/projects/:id", zValidator("param", routeId), async (c) => {
    const [deleted] = await db.delete(projects).where(eq(projects.id, c.req.valid("param").id)).returning({ id: projects.id })
    return deleted ? c.body(null, 204) : c.json({ message: "Project not found." }, 404)
  })

export type AppType = typeof api
