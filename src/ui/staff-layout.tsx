"use client"

import * as React from "react"
import { ChevronRight } from "lucide-react"

import { cx, present } from "./staff-cx"

/**
 * The five page templates share these pieces:
 * List: PageHeader → Toolbar → DataTable.  Record: Breadcrumbs → EntityHeader → tabs → RecordBody (main + AttributeList).
 * Form: Breadcrumbs → PageHeader → FormSection… → SaveBar.  Settings: PageHeader → SettingsSection of SettingsRow.
 * Workspace: PageHeader → a grid of Panels.
 */

/** The page's frame: padding and max width. `wide` for lists and records, default for forms and settings. */
export function Page({ className, width = "wide", ...props }: React.ComponentProps<"div"> & { width?: "wide" | "narrow" | "full" }) {
  return <div className={cx("mx-auto flex w-full flex-col gap-4 px-4 pt-3 pb-10 md:px-6", width === "narrow" ? "max-w-3xl" : width === "wide" ? "max-w-[1400px]" : "", className)} {...props} />
}

export function PageHeader({ title, description, meta, actions, className }: { title: React.ReactNode; description?: React.ReactNode; meta?: React.ReactNode; actions?: React.ReactNode; className?: string }) {
  return (
    <header className={cx("flex flex-wrap items-start justify-between gap-x-4 gap-y-2", className)}>
      <div className="flex min-w-0 flex-col gap-0.5">
        <div className="flex items-baseline gap-2">
          <h1 className="text-title font-semibold">{title}</h1>
          {meta && <span className="text-body text-muted num">{meta}</span>}
        </div>
        {description && <p className="max-w-2xl text-body text-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  )
}

export type Crumb = { label: React.ReactNode; render?: React.ReactElement }

/** Where a page sits. Each crumb with `render` (a router Link, without children) is a link. */
export function Breadcrumbs({ items, end, className }: { items: Crumb[]; end?: React.ReactNode; className?: string }) {
  return (
    <div className={cx("flex h-7 items-center justify-between gap-3", className)}>
      <nav aria-label="Breadcrumb" className="min-w-0">
        <ol className="flex min-w-0 items-center gap-1 text-body text-muted">
          {items.map((c, i) => {
            const last = i === items.length - 1
            return (
              <li key={i} className={cx("flex min-w-0 items-center gap-1", last && "text-fg")}>
                {c.render && !last ? React.cloneElement(c.render as React.ReactElement<{ className?: string; children?: React.ReactNode }>, { className: "truncate hover:text-fg", children: c.label }) : <span className="truncate" aria-current={last ? "page" : undefined}>{c.label}</span>}
                {!last && <ChevronRight className="size-3.5 shrink-0 text-faint" aria-hidden />}
              </li>
            )
          })}
        </ol>
      </nav>
      {end && <div className="flex shrink-0 items-center gap-1">{end}</div>}
    </div>
  )
}

/** A record's header: identity on the left (avatar, name, status, ids), actions on the right. */
export function EntityHeader({ leading, title, status, meta, actions, className }: { leading?: React.ReactNode; title: React.ReactNode; status?: React.ReactNode; meta?: React.ReactNode; actions?: React.ReactNode; className?: string }) {
  return (
    <header className={cx("flex flex-wrap items-start justify-between gap-x-4 gap-y-3", className)}>
      <div className="flex min-w-0 items-start gap-3">
        {leading}
        <div className="flex min-w-0 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-display font-semibold">{title}</h1>
            {status}
          </div>
          {meta && <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-body text-muted">{meta}</div>}
        </div>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  )
}

/** A record's body: the main column and, on wide screens, the attribute rail on the right. */
export function RecordBody({ main, aside, className }: { main: React.ReactNode; aside?: React.ReactNode; className?: string }) {
  return (
    <div className={cx("grid items-start gap-6", aside ? "lg:grid-cols-[minmax(0,1fr)_320px]" : "", className)}>
      <div className="flex min-w-0 flex-col gap-6">{main}</div>
      {aside && <aside className="flex min-w-0 flex-col gap-5 lg:sticky lg:top-3">{aside}</aside>}
    </div>
  )
}

/** A titled group of content. No box: a heading and, below, the content. */
export function Section({ title, description, actions, children, className, flush }: { title?: React.ReactNode; description?: React.ReactNode; actions?: React.ReactNode; children?: React.ReactNode; className?: string; flush?: boolean }) {
  return (
    <section className={cx("flex min-w-0 flex-col gap-2", className)}>
      {(title || actions) && (
        <div className="flex min-h-7 flex-wrap items-center justify-between gap-x-3 gap-y-2">
          {/* basis-48: below ~12rem of room the actions wrap under the title instead of squeezing it */}
          <div className="flex min-w-0 flex-1 basis-48 flex-col">
            {title && <h2 className="text-heading font-semibold">{title}</h2>}
            {description && <p className="text-label text-muted">{description}</p>}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </div>
      )}
      {flush ? children : children}
    </section>
  )
}

/** A bordered surface for a table or a block of content inside a Section. */
export function Panel({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cx("min-w-0 overflow-hidden rounded-card border border-border bg-surface", className)} {...props} />
}

/** Label/value pairs. `inline` lays them out as rows (record rail); otherwise a grid of cells. */
export function AttributeList({ title, items, className, actions }: { title?: React.ReactNode; actions?: React.ReactNode; items: ({ label: React.ReactNode; value: React.ReactNode; mono?: boolean } | false | null | undefined | "")[]; className?: string }) {
  return (
    <div className={cx("flex flex-col gap-1", className)}>
      {(title || actions) && (
        <div className="flex h-7 items-center justify-between">
          <h3 className="text-label font-semibold text-muted">{title}</h3>
          {actions}
        </div>
      )}
      <dl className="flex flex-col">
        {items.filter(present).map((it, i) => (
          <div key={i} className="grid grid-cols-[128px_minmax(0,1fr)] gap-3 py-1.5">
            <dt className="text-body text-muted">{it.label}</dt>
            <dd className={cx("min-w-0 text-body break-words", it.mono && "font-mono text-label leading-5")}>{it.value ?? <span className="text-faint">—</span>}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

/** Empty value placeholder for attribute lists and cells. */
export function Empty({ children = "—" }: { children?: React.ReactNode }) {
  return <span className="text-faint">{children}</span>
}

/** Key figures in a row: balance, next charge, plan. */
export function StatGrid({ items, className }: { items: ({ label: React.ReactNode; value: React.ReactNode; hint?: React.ReactNode; tone?: "danger" | "success" } | false | null | undefined)[]; className?: string }) {
  const shown = items.filter(present)
  return (
    <div className={cx("grid grid-cols-1 overflow-hidden rounded-card border border-border bg-surface sm:grid-cols-2", shown.length >= 4 ? "lg:grid-cols-4" : shown.length === 3 ? "lg:grid-cols-3" : "", className)}>
      {shown.map((s, i) => (
        <div key={i} className="flex min-w-0 flex-col gap-0.5 border-divider px-4 py-3 not-last:border-b sm:not-last:border-r sm:[&:nth-child(2n)]:border-r-0 lg:not-last:border-b-0 lg:[&:nth-child(2n)]:border-r lg:last:!border-r-0">
          <span className="text-label text-muted">{s.label}</span>
          <span className={cx("text-title font-semibold num", s.tone === "danger" && "text-danger-fg", s.tone === "success" && "text-success-fg")}>{s.value}</span>
          {s.hint && <span className="truncate text-label text-muted">{s.hint}</span>}
        </div>
      ))}
    </div>
  )
}

/** The bar above a table: search and filters on the left, view actions on the right. */
export function Toolbar({ children, end, className }: { children?: React.ReactNode; end?: React.ReactNode; className?: string }) {
  return (
    <div className={cx("flex flex-wrap items-center justify-between gap-2", className)}>
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">{children}</div>
      {end && <div className="flex items-center gap-2">{end}</div>}
    </div>
  )
}

/** A form's group: heading and one-line description on the left, the fields on the right. */
export function FormSection({ title, description, children, className }: { title: React.ReactNode; description?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={cx("grid gap-x-8 gap-y-3 border-b border-divider py-6 first:pt-2 last:border-b-0 md:grid-cols-[220px_minmax(0,1fr)]", className)}>
      <div className="flex flex-col gap-0.5">
        <h2 className="text-heading font-semibold">{title}</h2>
        {description && <p className="text-label text-muted">{description}</p>}
      </div>
      <div className="flex min-w-0 flex-col gap-4">{children}</div>
    </section>
  )
}

/** Settings: a titled group of rows. */
export function SettingsSection({ title, description, actions, footer, children, className }: { title: React.ReactNode; description?: React.ReactNode; actions?: React.ReactNode; footer?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={cx("flex flex-col gap-2", className)}>
      <div className="flex items-end justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-heading font-semibold">{title}</h2>
          {description && <p className="text-label text-muted">{description}</p>}
        </div>
        {actions}
      </div>
      <div className="divide-y divide-divider rounded-card border border-border bg-surface">
        {children}
        {footer && <div className="flex flex-wrap items-center justify-end gap-2 rounded-b-card bg-subtle px-4 py-2.5">{footer}</div>}
      </div>
    </section>
  )
}

/** Fields inside a SettingsSection (a form rather than rows). */
export function SettingsBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cx("flex flex-col gap-4 p-4", className)}>{children}</div>
}

/** One setting: what it is on the left, its control on the right. `stack` puts the control below (wide inputs). */
export function SettingsRow({ label, description, children, stack, htmlFor }: { label: React.ReactNode; description?: React.ReactNode; children?: React.ReactNode; stack?: boolean; htmlFor?: string }) {
  return (
    <div className={cx("flex gap-x-6 gap-y-2 px-4 py-3", stack ? "flex-col" : "flex-col sm:flex-row sm:items-center sm:justify-between")}>
      <div className="flex min-w-0 flex-col gap-0.5">
        {htmlFor ? (
          <label htmlFor={htmlFor} className="text-body font-medium">
            {label}
          </label>
        ) : (
          <span className="text-body font-medium">{label}</span>
        )}
        {description && <span className="text-label text-muted">{description}</span>}
      </div>
      {children && <div className={cx("flex shrink-0 items-center gap-2", stack ? "" : "sm:max-w-[50%] sm:justify-end")}>{children}</div>}
    </div>
  )
}

/** Sticky bar at the bottom of a form: what's pending on the left, cancel and save on the right. */
export function SaveBar({ children, status, className }: { children: React.ReactNode; status?: React.ReactNode; className?: string }) {
  return (
    <div className={cx("sticky bottom-0 z-10 -mx-4 mt-2 flex items-center justify-between gap-3 border-t border-divider bg-bg/95 px-4 py-3 backdrop-blur md:-mx-6 md:px-6", className)}>
      <div className="min-w-0 text-label text-muted">{status}</div>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  )
}

/** Destructive actions at the bottom of a record or settings page. */
export function DangerZone({ title, children }: { title: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-heading font-semibold text-danger-fg">{title}</h2>
      <div className="divide-y divide-divider rounded-card border border-danger-bg bg-surface">{children}</div>
    </section>
  )
}
