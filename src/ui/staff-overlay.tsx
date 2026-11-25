"use client"

import * as React from "react"
import { Dialog as BaseDialog } from "@base-ui/react/dialog"
import { AlertDialog as BaseAlertDialog } from "@base-ui/react/alert-dialog"
import { Menu as BaseMenu } from "@base-ui/react/menu"
import { Popover as BasePopover } from "@base-ui/react/popover"
import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip"
import { X } from "lucide-react"

import { Button, buttonClass, type ButtonVariant } from "./staff-button"
import { cx, present } from "./staff-cx"
import { itemClass, popupClass } from "./staff-select"

const backdrop = "fixed inset-0 z-50 bg-overlay transition-opacity duration-150 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0"
const dialogPopup =
  "fixed top-1/2 left-1/2 z-50 flex max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col rounded-dialog bg-surface text-fg shadow-dialog outline-none transition-[opacity,transform] duration-150 data-[starting-style]:opacity-0 data-[starting-style]:scale-[0.98] data-[ending-style]:opacity-0"

// sheet: the whole screen on a phone (a form to fill in the field), a regular dialog from md up.
const widths = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  sheet: "max-md:inset-0 max-md:h-dvh max-md:max-h-dvh max-md:w-full max-md:translate-x-0 max-md:translate-y-0 max-md:rounded-none md:max-w-lg",
}

/**
 * A modal for a short action (confirm, quick pay, add one contact). Records never open in one: they have pages.
 * Controlled: `open` + `onOpenChange`; or pass `trigger`.
 */
export function Dialog({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  footer,
  size = "md",
  closeLabel = "Close",
}: {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: React.ReactElement
  title: React.ReactNode
  description?: React.ReactNode
  children?: React.ReactNode
  footer?: React.ReactNode
  size?: keyof typeof widths
  closeLabel?: string
}) {
  return (
    <BaseDialog.Root open={open} onOpenChange={onOpenChange}>
      {trigger && <BaseDialog.Trigger render={trigger} />}
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className={backdrop} />
        <BaseDialog.Popup className={cx(dialogPopup, widths[size])}>
          <div className="flex items-start gap-3 px-5 pt-4 pb-3">
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <BaseDialog.Title className="text-heading font-semibold">{title}</BaseDialog.Title>
              {description && <BaseDialog.Description className="text-body text-muted">{description}</BaseDialog.Description>}
            </div>
            <BaseDialog.Close className={buttonClass({ variant: "ghost", size: "xs", icon: true, className: "-mr-1.5" })} aria-label={closeLabel}>
              <X />
            </BaseDialog.Close>
          </div>
          {children && <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4">{children}</div>}
          {footer && <div className="flex items-center justify-end gap-2 border-t border-divider px-5 py-3">{footer}</div>}
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  )
}

/** Closes the dialog it's in: <DialogClose render={<Button>Cancel</Button>} />. */
export const DialogClose = BaseDialog.Close

/** Asks before doing something: "Suspend service?". `onConfirm` may return a promise; the dialog waits for it. */
export function ConfirmDialog({
  trigger,
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  variant = "danger",
  children,
}: {
  trigger?: React.ReactElement
  open?: boolean
  onOpenChange?: (open: boolean) => void
  title: React.ReactNode
  description?: React.ReactNode
  confirmLabel: React.ReactNode
  cancelLabel: React.ReactNode
  onConfirm: () => unknown
  variant?: ButtonVariant
  children?: React.ReactNode
}) {
  const [own, setOwn] = React.useState(false)
  const [busy, setBusy] = React.useState(false)
  // What went wrong on the last confirm, shown in the dialog so it isn't lost when nothing else reports it.
  const [error, setError] = React.useState<string | null>(null)
  const isOpen = open ?? own
  const setOpen = (o: boolean) => {
    if (busy) return
    setError(null)
    setOwn(o)
    onOpenChange?.(o)
  }
  return (
    <BaseAlertDialog.Root open={isOpen} onOpenChange={setOpen}>
      {trigger && <BaseAlertDialog.Trigger render={trigger} />}
      <BaseAlertDialog.Portal>
        <BaseAlertDialog.Backdrop className={backdrop} />
        <BaseAlertDialog.Popup className={cx(dialogPopup, "max-w-sm")}>
          <div className="flex flex-col gap-1 px-5 pt-4 pb-4">
            <BaseAlertDialog.Title className="text-heading font-semibold">{title}</BaseAlertDialog.Title>
            {description && <BaseAlertDialog.Description className="text-body text-muted">{description}</BaseAlertDialog.Description>}
            {children && <div className="pt-2">{children}</div>}
            {error && (
              <p role="alert" className="pt-2 text-body text-danger-fg">
                {error}
              </p>
            )}
          </div>
          <div className="flex justify-end gap-2 border-t border-divider px-5 py-3">
            <BaseAlertDialog.Close render={<Button variant="secondary" disabled={busy} />}>{cancelLabel}</BaseAlertDialog.Close>
            <Button
              variant={variant}
              loading={busy}
              onClick={async () => {
                setBusy(true)
                setError(null)
                try {
                  await onConfirm()
                  setBusy(false)
                  setOwn(false)
                  onOpenChange?.(false)
                } catch (e) {
                  setBusy(false)
                  setError(e instanceof Error ? e.message : String(e))
                }
              }}
            >
              {confirmLabel}
            </Button>
          </div>
        </BaseAlertDialog.Popup>
      </BaseAlertDialog.Portal>
    </BaseAlertDialog.Root>
  )
}

export type MenuEntry =
  | { label: React.ReactNode; icon?: React.ReactNode; onSelect?: () => void; href?: string; danger?: boolean; disabled?: boolean; shortcut?: string; render?: React.ReactElement }
  | "separator"
  | { heading: React.ReactNode }

/** A dropdown menu of actions. Items with `render` (a router Link) navigate. */
export function Menu({ trigger, items, align = "end" }: { trigger: React.ReactElement; items: (MenuEntry | false | null | undefined)[]; align?: "start" | "center" | "end" }) {
  return (
    <BaseMenu.Root>
      <BaseMenu.Trigger render={trigger} />
      <BaseMenu.Portal>
        <BaseMenu.Positioner sideOffset={4} align={align} className="z-50">
          <BaseMenu.Popup className={cx(popupClass, "min-w-44")}>
            {items.filter(present).map((item, i) =>
              item === "separator" ? (
                <BaseMenu.Separator key={i} className="my-1 h-px bg-divider" />
              ) : "heading" in item ? (
                <div key={i} className="px-2 pt-1.5 pb-1 text-micro font-medium text-muted">
                  {item.heading}
                </div>
              ) : (
                <BaseMenu.Item
                  key={i}
                  disabled={item.disabled}
                  onClick={item.onSelect}
                  render={item.render}
                  className={cx(itemClass, item.danger && "text-danger-fg [&_svg]:!text-danger-fg")}
                >
                  {item.icon}
                  <span className="flex-1">{item.label}</span>
                  {item.shortcut && <span className="text-micro text-muted">{item.shortcut}</span>}
                </BaseMenu.Item>
              ),
            )}
          </BaseMenu.Popup>
        </BaseMenu.Positioner>
      </BaseMenu.Portal>
    </BaseMenu.Root>
  )
}

export function Popover({ trigger, children, align = "start", className, open, onOpenChange }: { trigger: React.ReactElement; children: React.ReactNode; align?: "start" | "center" | "end"; className?: string; open?: boolean; onOpenChange?: (open: boolean) => void }) {
  return (
    <BasePopover.Root open={open} onOpenChange={onOpenChange}>
      <BasePopover.Trigger render={trigger} />
      <BasePopover.Portal>
        <BasePopover.Positioner sideOffset={4} align={align} className="z-50">
          <BasePopover.Popup className={cx("rounded-card border border-border bg-surface p-3 text-body shadow-popover outline-none transition-opacity duration-100 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0", className)}>
            {children}
          </BasePopover.Popup>
        </BasePopover.Positioner>
      </BasePopover.Portal>
    </BasePopover.Root>
  )
}

export const TooltipProvider = BaseTooltip.Provider

export function Tooltip({ content, children, side = "top" }: { content: React.ReactNode; children: React.ReactElement; side?: "top" | "bottom" | "left" | "right" }) {
  if (!content) return children
  return (
    <BaseTooltip.Root>
      <BaseTooltip.Trigger render={children} />
      <BaseTooltip.Portal>
        <BaseTooltip.Positioner sideOffset={6} side={side} className="z-50">
          <BaseTooltip.Popup className="max-w-xs rounded-control bg-fg px-2 py-1 text-label text-white shadow-popover transition-opacity duration-100 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 dark:bg-active dark:text-fg">
            {content}
          </BaseTooltip.Popup>
        </BaseTooltip.Positioner>
      </BaseTooltip.Portal>
    </BaseTooltip.Root>
  )
}
