"use client"

import * as React from "react"
import { Button as BaseButton } from "@base-ui/react/button"
import { Check, Copy, Loader2 } from "lucide-react"

import { cx } from "./staff-cx"

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "danger-soft" | "link"
export type ButtonSize = "xs" | "sm" | "md"

const base =
  "inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-control font-medium select-none transition-colors duration-100 outline-none focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-1 disabled:pointer-events-none disabled:opacity-50 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:shrink-0 [&_svg]:pointer-events-none"

const variants: Record<ButtonVariant, string> = {
  primary: "bg-accent text-accent-on hover:bg-accent-hover shadow-control",
  secondary: "border border-control bg-surface text-fg hover:bg-hover hover:border-border-hover shadow-control aria-expanded:bg-hover",
  ghost: "text-fg hover:bg-hover aria-expanded:bg-hover",
  danger: "bg-danger text-white hover:bg-danger-hover shadow-control",
  "danger-soft": "border border-control bg-surface text-danger-fg hover:bg-danger-bg shadow-control",
  link: "text-accent-fg hover:underline underline-offset-2 !h-auto !px-0",
}

// Heights: 24 in tables, 28 in toolbars and headers, 32 in forms.
const sizes: Record<ButtonSize, string> = {
  xs: "h-6 px-2 text-label [&_svg]:size-3.5",
  sm: "h-7 px-2.5 text-body [&_svg]:size-4",
  md: "h-8 px-3 text-body [&_svg]:size-4",
}
const iconSizes: Record<ButtonSize, string> = {
  xs: "size-6 [&_svg]:size-3.5",
  sm: "size-7 [&_svg]:size-4",
  md: "size-8 [&_svg]:size-4",
}

/** The classes of a button, for links and other elements that look like one. */
export function buttonClass({ variant = "secondary", size = "sm", icon = false, className }: { variant?: ButtonVariant; size?: ButtonSize; icon?: boolean; className?: string } = {}) {
  return cx(base, variants[variant], icon ? iconSizes[size] : sizes[size], className)
}

export type ButtonProps = BaseButton.Props & {
  variant?: ButtonVariant
  size?: ButtonSize
  /** Square, for an icon alone (give it an aria-label). */
  icon?: boolean
  /** Shows a spinner and disables the button. */
  loading?: boolean
}

export function Button({ variant, size, icon, loading, className, children, disabled, ...props }: ButtonProps) {
  return (
    <BaseButton
      className={buttonClass({ variant, size, icon, className: typeof className === "string" ? className : undefined })}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="animate-spin" aria-hidden />}
      {icon && loading ? null : children}
    </BaseButton>
  )
}

/** A keyboard shortcut hint: <Kbd>⌘K</Kbd>. */
export function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      className={cx("inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-badge border border-border bg-subtle px-1 font-sans text-micro font-medium text-muted", className)}
      {...props}
    />
  )
}

/** A button whose click returns a promise: it shows the spinner until it settles. */
export function AsyncButton({ onClick, onError, ...props }: Omit<ButtonProps, "onClick" | "loading" | "onError"> & { onClick: () => Promise<unknown>; onError?: (error: unknown) => void }) {
  const [busy, setBusy] = React.useState(false)
  return (
    <Button
      {...props}
      loading={busy}
      onClick={async () => {
        setBusy(true)
        try {
          await onClick()
        } catch (e) {
          if (onError) onError(e)
          else throw e
        } finally {
          setBusy(false)
        }
      }}
    />
  )
}

/** Copies `text` and shows a check for a moment. */
export function CopyButton({ text, label = "Copy", copiedLabel = "Copied", size = "sm" }: { text: string; label?: string; copiedLabel?: string; size?: ButtonSize }) {
  const [copied, setCopied] = React.useState(false)
  return (
    <Button
      type="button"
      size={size}
      icon
      aria-label={copied ? copiedLabel : label}
      onClick={async () => {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      }}
    >
      {copied ? <Check /> : <Copy />}
    </Button>
  )
}
