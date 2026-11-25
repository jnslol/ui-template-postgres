"use client"

import * as React from "react"
import { Tabs as BaseTabs } from "@base-ui/react/tabs"
import { Toast as BaseToast } from "@base-ui/react/toast"
import { Loader2, X } from "lucide-react"

import { buttonClass } from "./staff-button"
import { cx } from "./staff-cx"

export type Tone = "success" | "warning" | "danger" | "info" | "neutral" | "accent"

const toneClass: Record<Tone, string> = {
  success: "bg-success-bg text-success-fg",
  warning: "bg-warning-bg text-warning-fg",
  danger: "bg-danger-bg text-danger-fg",
  info: "bg-info-bg text-info-fg",
  neutral: "bg-hover text-muted",
  accent: "bg-accent-subtle text-accent-fg",
}
const dotClass: Record<Tone, string> = {
  success: "bg-success-dot",
  warning: "bg-warning-dot",
  danger: "bg-danger-dot",
  info: "bg-info-dot",
  neutral: "bg-faint",
  accent: "bg-accent",
}

/** A state or a tag. With `dot`, a colored dot before the label (color is never the only signal). */
export function Badge({ tone = "neutral", dot, className, children, ...props }: React.ComponentProps<"span"> & { tone?: Tone; dot?: boolean }) {
  return (
    <span className={cx("inline-flex h-5 shrink-0 items-center gap-1.5 rounded-badge px-1.5 text-label font-medium whitespace-nowrap", toneClass[tone], className)} {...props}>
      {dot && <span className={cx("size-1.5 rounded-full", dotClass[tone])} aria-hidden />}
      {children}
    </span>
  )
}

/** A plain outlined tag: plan, zone, customer number. */
export function Tag({ className, mono, ...props }: React.ComponentProps<"span"> & { mono?: boolean }) {
  return <span className={cx("inline-flex h-5 items-center rounded-badge border border-border bg-surface px-1.5 text-label whitespace-nowrap text-muted", mono && "font-mono", className)} {...props} />
}

export function StatusDot({ tone = "neutral", className, label }: { tone?: Tone; className?: string; label?: string }) {
  return <span role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true} className={cx("inline-block size-2 shrink-0 rounded-full", dotClass[tone], className)} />
}

export function Spinner({ className, label }: { className?: string; label?: string }) {
  return <Loader2 role="status" aria-label={label} className={cx("size-4 animate-spin text-muted", className)} />
}

export function Skeleton({ className }: { className?: string }) {
  return <div data-slot="skeleton" className={cx("animate-pulse rounded-control bg-hover", className)} aria-hidden />
}

export function EmptyState({ icon, title, description, action, className }: { icon?: React.ReactNode; title: React.ReactNode; description?: React.ReactNode; action?: React.ReactNode; className?: string }) {
  return (
    <div className={cx("flex flex-col items-center justify-center gap-2 px-6 py-12 text-center", className)}>
      {icon && <div className="mb-1 flex size-9 items-center justify-center rounded-card border border-border bg-subtle text-muted [&_svg]:size-4">{icon}</div>}
      <p className="text-heading font-medium">{title}</p>
      {description && <p className="max-w-sm text-body text-muted">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}

export function Avatar({ name, className }: { name: string; className?: string }) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("")
  return <span className={cx("inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-accent-subtle text-micro font-semibold text-accent-fg", className)} aria-hidden>{initials}</span>
}

// ---- Tabs ----

export type TabItem<V extends string> = { value: V; label: React.ReactNode; count?: React.ReactNode; disabled?: boolean }

const tabClass =
  "relative inline-flex h-9 items-center gap-1.5 px-0.5 text-body font-medium text-muted outline-none transition-colors hover:text-fg data-[active]:text-fg aria-[current=page]:text-fg focus-visible:outline-2 focus-visible:outline-focus after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:rounded-full after:bg-transparent data-[active]:after:bg-fg aria-[current=page]:after:bg-fg"

export function TabCount({ children }: { children: React.ReactNode }) {
  return <span className="rounded-badge bg-hover px-1 text-micro font-medium text-muted num">{children}</span>
}

/** Tabs over content kept in this component (record pages pass `value` from the URL). */
export function Tabs<V extends string>({ items, value, onValueChange, children, className }: { items: TabItem<V>[]; value: V; onValueChange: (value: V) => void; children?: React.ReactNode; className?: string }) {
  return (
    <BaseTabs.Root value={value} onValueChange={(v) => onValueChange(v as V)} className={className}>
      <BaseTabs.List className="flex items-center gap-5 overflow-x-auto border-b border-divider">
        {items.map((t) => (
          <BaseTabs.Tab key={t.value} value={t.value} disabled={t.disabled} className={tabClass}>
            {t.label}
            {t.count != null && <TabCount>{t.count}</TabCount>}
          </BaseTabs.Tab>
        ))}
      </BaseTabs.List>
      {children}
    </BaseTabs.Root>
  )
}

/** A tab bar made of links (routes): each item renders the given element with the tab's classes. */
export function LinkTabs({ children, className }: { children: React.ReactNode; className?: string }) {
  return <nav className={cx("flex items-center gap-5 overflow-x-auto border-b border-divider", className)}>{children}</nav>
}
export const linkTabClass = tabClass

// ---- Table ----

export function Table({ className, ...props }: React.ComponentProps<"table">) {
  return <table className={cx("w-full border-separate border-spacing-0 text-body", className)} {...props} />
}
export function Th({ className, align, ...props }: React.ComponentProps<"th"> & { align?: "left" | "right" | "center" }) {
  return (
    <th
      className={cx(
        "sticky top-0 z-[1] h-8 border-b border-divider bg-subtle px-3 text-label font-medium whitespace-nowrap text-muted first:pl-4 last:pr-4",
        align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left",
        className,
      )}
      {...props}
    />
  )
}
export function Td({ className, align, ...props }: React.ComponentProps<"td"> & { align?: "left" | "right" | "center" }) {
  return <td className={cx("h-row border-b border-divider px-3 align-middle first:pl-4 last:pr-4", align === "right" ? "text-right num" : align === "center" ? "text-center" : "", className)} {...props} />
}
export function Tr({ className, interactive, selected, ...props }: React.ComponentProps<"tr"> & { interactive?: boolean; selected?: boolean }) {
  return <tr data-interactive={interactive || undefined} className={cx(interactive && "cursor-pointer hover:bg-subtle", selected && "bg-accent-subtle hover:bg-accent-subtle", className)} {...props} />
}

// ---- Meter ----

/** A value on a scale with thresholds, e.g. fiber Rx power: good ≥ -25, warn -25…-27, critical < -27. */
export function Meter({ value, min, max, warn, critical, higherIsBetter = true, label, valueText, className }: { value: number | null; min: number; max: number; warn: number; critical: number; higherIsBetter?: boolean; label?: React.ReactNode; valueText?: React.ReactNode; className?: string }) {
  const pct = value == null ? 0 : Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100))
  const tone: Tone = value == null ? "neutral" : higherIsBetter ? (value >= warn ? "success" : value >= critical ? "warning" : "danger") : value <= warn ? "success" : value <= critical ? "warning" : "danger"
  const at = (v: number) => `${((v - min) / (max - min)) * 100}%`
  return (
    <div className={cx("flex flex-col gap-1.5", className)}>
      {(label || valueText) && (
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-label text-muted">{label}</span>
          <span className={cx("text-body font-medium num", tone === "danger" ? "text-danger-fg" : tone === "warning" ? "text-warning-fg" : "text-fg")}>{valueText}</span>
        </div>
      )}
      <div className="relative h-1.5 rounded-full bg-hover" role="meter" aria-valuenow={value ?? undefined} aria-valuemin={min} aria-valuemax={max}>
        <div className={cx("absolute inset-y-0 left-0 rounded-full", dotClass[tone])} style={{ width: `${pct}%` }} />
        <span className="absolute -top-0.5 h-2.5 w-px bg-strong" style={{ left: at(warn) }} />
        <span className="absolute -top-0.5 h-2.5 w-px bg-strong" style={{ left: at(critical) }} />
      </div>
    </div>
  )
}

// ---- Toasts ----

export const toastManager = BaseToast.createToastManager()

/** Shows a toast. `action` adds a button (Undo). */
export function toast(title: React.ReactNode, options: { description?: React.ReactNode; tone?: "success" | "danger" | "neutral"; action?: { label: string; onClick: () => void }; timeout?: number } = {}) {
  return toastManager.add({
    title,
    description: options.description,
    type: options.tone ?? "neutral",
    timeout: options.timeout ?? (options.action ? 8000 : 4000),
    actionProps: options.action ? { children: options.action.label, onClick: options.action.onClick } : undefined,
  })
}

export function ToastProvider({ children, closeLabel = "Close" }: { children: React.ReactNode; closeLabel?: string }) {
  return (
    <BaseToast.Provider toastManager={toastManager}>
      {children}
      <BaseToast.Portal>
        <BaseToast.Viewport className="fixed right-4 bottom-4 z-[60] flex w-[340px] max-w-[calc(100vw-2rem)] flex-col gap-2 outline-none">
          <ToastList closeLabel={closeLabel} />
        </BaseToast.Viewport>
      </BaseToast.Portal>
    </BaseToast.Provider>
  )
}

function ToastList({ closeLabel }: { closeLabel: string }) {
  const { toasts } = BaseToast.useToastManager()
  return toasts.map((t) => (
    <BaseToast.Root
      key={t.id}
      toast={t}
      className="flex items-start gap-2.5 rounded-card border border-border bg-surface p-3 shadow-popover transition-[opacity,transform] duration-150 data-[starting-style]:translate-y-2 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0"
    >
      <span className={cx("mt-1.5 size-2 shrink-0 rounded-full", t.type === "success" ? "bg-success-dot" : t.type === "danger" ? "bg-danger-dot" : "bg-faint")} aria-hidden />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <BaseToast.Title className="text-body font-medium" />
        <BaseToast.Description className="text-label text-muted" />
      </div>
      <BaseToast.Action className={buttonClass({ variant: "secondary", size: "xs" })} />
      <BaseToast.Close className={buttonClass({ variant: "ghost", size: "xs", icon: true })} aria-label={closeLabel}>
        <X />
      </BaseToast.Close>
    </BaseToast.Root>
  ))
}

// ---- Callout ----

const calloutTone: Record<Tone, string> = {
  success: "border-success-bg bg-success-bg/40 [&>svg]:text-success-fg",
  warning: "border-warning-bg bg-warning-bg/40 [&>svg]:text-warning-fg",
  danger: "border-danger-bg bg-danger-bg/40 [&>svg]:text-danger-fg",
  info: "border-info-bg bg-info-bg/40 [&>svg]:text-info-fg",
  neutral: "border-border bg-subtle [&>svg]:text-muted",
  accent: "border-accent-subtle bg-accent-faint [&>svg]:text-accent",
}

/** A message inside the page: why service is cut, a pending request, a warning. Icon, title, body and an action. */
export function Callout({ tone = "neutral", icon, title, children, action, className }: { tone?: Tone; icon?: React.ReactNode; title?: React.ReactNode; children?: React.ReactNode; action?: React.ReactNode; className?: string }) {
  return (
    <div role={tone === "danger" ? "alert" : undefined} className={cx("flex items-start gap-3 rounded-card border px-4 py-3 [&>svg]:mt-0.5 [&>svg]:size-4 [&>svg]:shrink-0", calloutTone[tone], className)}>
      {icon}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {title && <p className="font-medium">{title}</p>}
        {children && <div className={title ? "text-body text-muted" : "text-body"}>{children}</div>}
      </div>
      {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
    </div>
  )
}
