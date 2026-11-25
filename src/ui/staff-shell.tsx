"use client"

import * as React from "react"
import { Dialog } from "@base-ui/react/dialog"
import { Menu, PanelLeft, X } from "lucide-react"
import { buttonClass } from "./staff-button"
import { cx } from "./staff-cx"

export type SidebarLink = {
  label: string
  icon: React.ReactNode
  href: string
  active?: boolean
}

export type SidebarGroup = { label: string; links: SidebarLink[] }

export function StaffSidebar({
  brand, groups, footer, compact = false, onNavigate,
}: {
  brand: React.ReactNode
  groups: SidebarGroup[]
  footer?: React.ReactNode
  compact?: boolean
  onNavigate?: () => void
}) {
  return (
    <nav aria-label="Main navigation" className="flex h-full flex-col gap-4 overflow-y-auto bg-subtle px-2 py-3">
      <div className={cx("flex h-8 shrink-0 items-center gap-2 font-semibold", compact ? "justify-center" : "px-2")}>
        {brand}
      </div>
      {groups.map((group) => (
        <div key={group.label} className="flex flex-col gap-px" role="group" aria-label={group.label}>
          {!compact && <div aria-hidden className="px-2 pb-1 text-micro font-medium tracking-wide text-muted">{group.label}</div>}
          {group.links.map(({ label, icon, href, active }) => (
            <a
              key={href}
              href={href}
              title={compact ? label : undefined}
              aria-label={compact ? label : undefined}
              aria-current={active ? "page" : undefined}
              onClick={(event) => {
                if (event.button === 0 && !event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey) onNavigate?.()
              }}
              className={cx(
                "flex h-[30px] items-center gap-2.5 rounded-control px-2 text-body font-medium text-sidebar-fg hover:bg-hover aria-[current=page]:bg-active aria-[current=page]:text-fg [&>svg]:size-4 [&>svg]:shrink-0",
                compact && "justify-center",
              )}
            >
              {icon}
              {!compact && <span className="truncate">{label}</span>}
            </a>
          ))}
        </div>
      ))}
      {footer && !compact && <div className="mt-auto border-t border-divider px-2 pt-3">{footer}</div>}
    </nav>
  )
}

export function StaffShell({
  brand, groups, footer, context, actions, children, compact = false, onCompactChange, pageKey,
}: {
  brand: (compact: boolean) => React.ReactNode
  groups: SidebarGroup[]
  footer?: React.ReactNode
  context: React.ReactNode
  actions?: React.ReactNode
  children: React.ReactNode
  compact?: boolean
  onCompactChange?: (compact: boolean) => void
  pageKey?: string
}) {
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const main = React.useRef<HTMLElement>(null)
  const sidebarId = React.useId()

  React.useEffect(() => { main.current?.scrollTo(0, 0) }, [pageKey])
  React.useEffect(() => {
    const desktop = window.matchMedia("(min-width: 64rem)")
    function closeOnDesktop() {
      if (desktop.matches) setMobileOpen(false)
    }
    desktop.addEventListener("change", closeOnDesktop)
    return () => desktop.removeEventListener("change", closeOnDesktop)
  }, [])

  return (
    <div className={cx("grid h-dvh min-h-0 bg-bg", compact ? "lg:grid-cols-[52px_minmax(0,1fr)]" : "lg:grid-cols-[232px_minmax(0,1fr)]")}>
      <aside id={sidebarId} className="hidden min-h-0 border-r border-divider lg:block">
        <StaffSidebar brand={brand(compact)} groups={groups} footer={footer} compact={compact} />
      </aside>
      <div className="flex min-h-0 min-w-0 flex-col">
        <header className="flex h-12 shrink-0 items-center gap-2 border-b border-divider bg-surface px-3 md:px-4">
          <button type="button" onClick={() => main.current?.focus()} className="sr-only focus:not-sr-only">Skip to content</button>
          {onCompactChange && (
            <button type="button" className={cx(buttonClass({ variant: "ghost", icon: true }), "hidden lg:inline-flex")}
              aria-label={compact ? "Expand sidebar" : "Collapse sidebar"} aria-controls={sidebarId}
              aria-expanded={!compact} onClick={() => onCompactChange(!compact)}>
              <PanelLeft aria-hidden />
            </button>
          )}
          <Dialog.Root open={mobileOpen} onOpenChange={setMobileOpen}>
            <Dialog.Trigger className={cx(buttonClass({ variant: "ghost", icon: true }), "lg:hidden")} aria-label="Open navigation">
              <Menu aria-hidden />
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Backdrop className="fixed inset-0 z-50 bg-overlay" />
              <Dialog.Popup className="fixed inset-y-0 left-0 z-50 flex w-sidebar max-w-[85vw] flex-col border-r border-divider bg-subtle shadow-dialog outline-none">
                <div className="flex items-center justify-between border-b border-divider px-3 py-2">
                  <Dialog.Title className="font-semibold">Navigation</Dialog.Title>
                  <Dialog.Close className={buttonClass({ variant: "ghost", icon: true })} aria-label="Close navigation"><X aria-hidden /></Dialog.Close>
                </div>
                <div className="min-h-0 flex-1">
                  <StaffSidebar brand={brand(false)} groups={groups} footer={footer} onNavigate={() => setMobileOpen(false)} />
                </div>
              </Dialog.Popup>
            </Dialog.Portal>
          </Dialog.Root>
          <div className="min-w-0 flex-1 truncate font-medium">{context}</div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </header>
        <main ref={main} tabIndex={-1} className="min-h-0 flex-1 overflow-auto outline-none">{children}</main>
      </div>
    </div>
  )
}
