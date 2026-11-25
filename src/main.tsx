import { useState } from "react"
import { createRoot } from "react-dom/client"
import { QueryClient, QueryClientProvider, queryOptions, useSuspenseQuery } from "@tanstack/react-query"
import { createRootRoute, createRoute, createRouter, Outlet, RouterProvider, useRouterState } from "@tanstack/react-router"
import { Folder, LayoutGrid, Settings } from "lucide-react"
import { hc } from "hono/client"
import type { AppType } from "../server/api"
import { buttonClass } from "./ui/staff-button"
import { Callout, Spinner } from "./ui/staff-display"
import { Page, PageHeader } from "./ui/staff-layout"
import { ProjectList } from "./ui/staff-list-page"
import { ProjectRecord } from "./ui/staff-record-page"
import { ProjectForm } from "./ui/staff-form-page"
import type { ProjectDraft } from "./ui/staff-project"
import { WorkspaceSettings } from "./ui/staff-settings-page"
import { WorkspacePage } from "./ui/staff-workspace-page"
import { StaffShell } from "./ui/staff-shell"
import { useStaffTheme } from "./ui/staff-theme"
import "./index.css"

const client = hc<AppType>(window.location.origin)
const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 30_000, retry: false } } })
const listHref = "/projects"
const createHref = "/projects/new"
const recordHref = (id: string) => `/projects/${id}`
const editHref = (id: string) => `${recordHref(id)}/edit`

const projectList = queryOptions({
  queryKey: ["projects", "list"],
  queryFn: async () => {
    const response = await client.api.projects.$get()
    if (!response.ok) throw new Error("Projects could not be loaded.")
    return response.json()
  },
})

const projectDetail = (id: string) => queryOptions({
  queryKey: ["projects", id],
  queryFn: async () => {
    const response = await client.api.projects[":id"].$get({ param: { id } })
    if (response.status === 400 || response.status === 404) return null
    if (response.status !== 200) throw new Error("The project could not be loaded.")
    return response.json()
  },
})

async function saveProject(draft: ProjectDraft, id?: string) {
  const response = id
    ? await client.api.projects[":id"].$patch({ param: { id }, json: draft })
    : await client.api.projects.$post({ json: draft })
  if (response.status !== 200 && response.status !== 201) {
    throw new Error(response.status === 404 ? "The project no longer exists." : "The project could not be saved.")
  }
  const project = await response.json()
  queryClient.setQueryData(projectDetail(project.id).queryKey, project)
  await queryClient.invalidateQueries({ queryKey: projectList.queryKey })
  await router.navigate({ to: "/projects/$id", params: { id: project.id } })
}

function MissingProject() {
  return <Page><PageHeader title="Project not found" actions={<a className={buttonClass()} href={listHref}>All projects</a>} /></Page>
}

function Loading() {
  return <Page><Spinner label="Loading projects" /></Page>
}

const root = createRootRoute({
  component: Shell,
  pendingComponent: Loading,
  errorComponent: () => <Page><Callout tone="danger" title="Could not load this page">Check that the API and database are running, then <a href={window.location.pathname} className="underline">retry</a>.</Callout></Page>,
  notFoundComponent: () => <Page><PageHeader title="Page not found" actions={<a className={buttonClass()} href="/">Workspace</a>} /></Page>,
})

function Shell() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const [compact, setCompactState] = useState(() => {
    try {
      return window.localStorage.getItem("workspace-sidebar") === "compact"
    } catch {
      return false
    }
  })
  function setCompact(value: boolean) {
    setCompactState(value)
    try {
      window.localStorage.setItem("workspace-sidebar", value ? "compact" : "expanded")
    } catch {
      // Keep the current setting when storage is unavailable.
    }
  }
  const [theme, setTheme] = useStaffTheme()
  const settingsActive = pathname === "/settings"
  const projectsActive = pathname === listHref || pathname.startsWith(`${listHref}/`)
  return (
    <StaffShell pageKey={pathname} compact={compact} onCompactChange={setCompact}
      context={settingsActive ? "Settings" : projectsActive ? "Projects" : "Workspace"}
      brand={(collapsed) => <><span className="grid size-6 shrink-0 place-items-center rounded-control bg-accent text-accent-on"><LayoutGrid className="size-4" aria-hidden /></span>{!collapsed && "Project Workspace"}</>}
      groups={[{ label: "Workspace", links: [
        { label: "Overview", href: "/", icon: <LayoutGrid aria-hidden />, active: pathname === "/" },
        { label: "Projects", href: listHref, icon: <Folder aria-hidden />, active: projectsActive },
        { label: "Settings", href: "/settings", icon: <Settings aria-hidden />, active: settingsActive },
      ] }]}>
      {settingsActive ? <WorkspaceSettings theme={theme} onThemeChange={setTheme} compact={compact} onCompactChange={setCompact} /> : <Outlet />}
    </StaffShell>
  )
}

const home = createRoute({
  getParentRoute: () => root, path: "/",
  loader: () => queryClient.ensureQueryData(projectList),
  component: () => <WorkspacePage projects={useSuspenseQuery(projectList).data} listHref={listHref} recordHref={recordHref} />,
})

const list = createRoute({
  getParentRoute: () => root, path: "/projects",
  loader: () => queryClient.ensureQueryData(projectList),
  component: () => <ProjectList projects={useSuspenseQuery(projectList).data} createHref={createHref} recordHref={recordHref} />,
})

const create = createRoute({
  getParentRoute: () => root, path: "/projects/new",
  component: () => <ProjectForm listHref={listHref} onSave={saveProject} />,
})

const record = createRoute({
  getParentRoute: () => root, path: "/projects/$id",
  loader: ({ params }) => queryClient.ensureQueryData(projectDetail(params.id)),
  component: RecordRoute,
})

function RecordRoute() {
  const { id } = record.useParams()
  const { data } = useSuspenseQuery(projectDetail(id))
  if (!data) return <MissingProject />
  return <ProjectRecord key={id} project={data} listHref={listHref} editHref={editHref(id)} onDelete={async () => {
    const response = await client.api.projects[":id"].$delete({ param: { id } })
    if (response.status !== 204 && response.status !== 404) throw new Error("The project could not be deleted.")
    await queryClient.invalidateQueries({ queryKey: projectList.queryKey })
    await router.navigate({ to: "/projects" })
    queryClient.removeQueries({ queryKey: projectDetail(id).queryKey })
  }} />
}

const edit = createRoute({
  getParentRoute: () => root, path: "/projects/$id/edit",
  loader: ({ params }) => queryClient.ensureQueryData(projectDetail(params.id)),
  component: EditRoute,
})

function EditRoute() {
  const { id } = edit.useParams()
  const { data } = useSuspenseQuery(projectDetail(id))
  return data ? <ProjectForm key={id} initial={data} listHref={listHref} cancelHref={recordHref(id)} onSave={(draft) => saveProject(draft, id)} /> : <MissingProject />
}

const settings = createRoute({ getParentRoute: () => root, path: "/settings" })
const router = createRouter({ routeTree: root.addChildren([home, list, create, record, edit, settings]), defaultPendingMs: 100 })

declare module "@tanstack/react-router" {
  interface Register { router: typeof router }
}

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}><RouterProvider router={router} /></QueryClientProvider>,
)
