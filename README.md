# jns ui PostgreSQL Template

A Vite + React workspace with TanStack Router and Query, a typed Hono API, Zod request validation, and Drizzle with node-postgres. The template includes its own UI source from [jns ui](https://jnslol.github.io/ui/).

On GitHub, select **Use this template** to create your own repository, then clone it locally.

Requires Node.js 24 or newer and PostgreSQL. Copy `.env.example` to `.env` and set `DATABASE_URL` to a dedicated database. The bundled Compose service is optional. If using its example connection string, start the service with `docker compose up -d db` and wait for PostgreSQL to accept connections.

```sh
npm ci
npm run db:migrate
npm run db:seed
npm run dev
```

Open http://127.0.0.1:4310. The API listens on port 4311. Vite proxies `/api` so the browser uses one origin. Seeding is optional and can be rerun; it skips existing sample IDs.

```sh
npm run check
npm run build
npm start
```

The built app and API are served together at http://127.0.0.1:4311. Run `npm run db:generate -- --name your_change` after changing `server/schema.ts`, then apply the new migration before deploying.

The sample API has no authentication or roles. Keep it on loopback for demos. Before serving actual users, add authentication and authorization, set deployment credentials outside the repo, and use TLS to reach remote infrastructure. The example Compose credentials are for local development.
