import { existsSync } from "node:fs"
import { serve } from "@hono/node-server"
import { serveStatic } from "@hono/node-server/serve-static"
import { Hono } from "hono"
import { api } from "./api"
import { closeDb } from "./db"

const app = new Hono().route("/", api)
app.all("/api", (c) => c.json({ message: "Endpoint not found." }, 404))
app.all("/api/*", (c) => c.json({ message: "Endpoint not found." }, 404))

if (process.argv.includes("--static")) {
  if (!existsSync("./dist/index.html")) throw new Error("Run npm run build before starting the app.")
  app.use("/assets/*", serveStatic({ root: "./dist" }))
  app.get("/assets/*", (c) => c.notFound())
  app.get("*", serveStatic({ path: "./dist/index.html" }))
}

const port = Number(process.env.API_PORT ?? 4311)
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("API_PORT must be between 1 and 65535.")
const server = serve({ fetch: app.fetch, port, hostname: process.env.HOST ?? "127.0.0.1" }, ({ address, port }) => {
  console.log(`Workspace server listening at http://${address}:${port}`)
})

function shutdown() {
  server.close(() => void closeDb().catch((error) => {
    console.error(error)
    process.exitCode = 1
  }))
}
process.once("SIGINT", shutdown)
process.once("SIGTERM", shutdown)
