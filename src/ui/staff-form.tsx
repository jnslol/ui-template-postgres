"use client"

import * as React from "react"
import { Field as BaseField } from "@base-ui/react/field"
import { Input as BaseInput } from "@base-ui/react/input"
import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox"
import { Switch as BaseSwitch } from "@base-ui/react/switch"
import { RadioGroup as BaseRadioGroup } from "@base-ui/react/radio-group"
import { Radio as BaseRadio } from "@base-ui/react/radio"
import { ToggleGroup as BaseToggleGroup } from "@base-ui/react/toggle-group"
import { Toggle as BaseToggle } from "@base-ui/react/toggle"
import { Check, Minus } from "lucide-react"

import { cx } from "./staff-cx"

const control =
  "min-w-0 rounded-control border border-control bg-surface px-2.5 text-body text-fg shadow-control outline-none transition-colors placeholder:text-faint hover:border-border-hover focus:border-focus focus:ring-2 focus:ring-focus-ring disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-danger-dot data-[invalid]:border-danger-dot"

export type ControlSize = "sm" | "md"
const heights: Record<ControlSize, string> = { sm: "h-7", md: "h-8" }

/** Full width unless the caller gives a width (`w-24`, `max-w-80`…): classes aren't merged, so both would fight. */
const width = (className?: string) => (className && /(^|\s)w-/.test(className) ? "" : "w-full")

export function controlClass(size: ControlSize = "md", className?: string) {
  return cx(control, width(className), heights[size], className)
}

export type InputProps = Omit<BaseInput.Props, "size"> & { size?: ControlSize; className?: string }

export function Input({ size = "md", className, ...props }: InputProps) {
  return <BaseInput className={controlClass(size, className)} {...props} />
}

/** An input with fixed text before or after it: "$", "+54", "Mbps". */
export function AffixInput({ prefix, suffix, size = "md", className, ...props }: Omit<InputProps, "prefix"> & { prefix?: React.ReactNode; suffix?: React.ReactNode }) {
  return (
    <div className={cx(control, width(className), heights[size], "flex items-center gap-1.5 focus-within:border-focus focus-within:ring-2 focus-within:ring-focus-ring has-[[aria-invalid=true]]:border-danger-dot", className)}>
      {prefix && <span className="shrink-0 text-muted select-none">{prefix}</span>}
      <BaseInput className="h-full min-w-0 flex-1 bg-transparent outline-none placeholder:text-faint" {...props} />
      {suffix && <span className="shrink-0 text-muted select-none">{suffix}</span>}
    </div>
  )
}

export function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  // A Field control, so the Field's label, hint and error are linked to it like an Input's.
  return <BaseField.Control render={<textarea {...props} />} className={cx(control, width(className), "min-h-20 py-1.5", className)} />
}

/** A labelled form field: label, the control, a hint and the error. The control inside is linked to the label. */
export function Field({
  label,
  hint,
  error,
  className,
  children,
  name,
  invalid,
  ...props
}: {
  label?: React.ReactNode
  hint?: React.ReactNode
  error?: React.ReactNode
  className?: string
  children: React.ReactNode
  name?: string
  invalid?: boolean
} & Omit<BaseField.Root.Props, "className" | "children">) {
  return (
    <BaseField.Root name={name} invalid={invalid ?? !!error} className={cx("flex min-w-0 flex-col gap-1.5", className)} {...props}>
      {label && <BaseField.Label className="text-label font-medium text-fg">{label}</BaseField.Label>}
      {children}
      {hint && !error && <BaseField.Description className="text-label text-muted">{hint}</BaseField.Description>}
      {/* Field.Error (always shown when given) so the control's aria-describedby points at it. */}
      {error && (
        <BaseField.Error match className="text-label text-danger-fg">
          {error}
        </BaseField.Error>
      )}
    </BaseField.Root>
  )
}

/** A row of fields side by side that stacks on small screens. */
export function FieldRow({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cx("grid grid-cols-1 gap-3 sm:grid-cols-2", className)} {...props} />
}

export function Checkbox({ className, indeterminate, ...props }: Omit<BaseCheckbox.Root.Props, "className"> & { className?: string }) {
  return (
    <BaseCheckbox.Root
      indeterminate={indeterminate}
      className={cx(
        "flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-strong bg-surface text-accent-on outline-none transition-colors data-[checked]:border-accent data-[checked]:bg-accent data-[indeterminate]:border-accent data-[indeterminate]:bg-accent focus-visible:outline-2 focus-visible:outline-focus data-[disabled]:opacity-50",
        className,
      )}
      {...props}
    >
      <BaseCheckbox.Indicator className="flex">{indeterminate ? <Minus className="size-3" strokeWidth={3} /> : <Check className="size-3" strokeWidth={3} />}</BaseCheckbox.Indicator>
    </BaseCheckbox.Root>
  )
}

/** A checkbox with its label to the right. */
export function CheckboxField({ label, hint, ...props }: Omit<BaseCheckbox.Root.Props, "className"> & { label: React.ReactNode; hint?: React.ReactNode }) {
  // The checkbox is a span with role="checkbox": a wrapping <label> doesn't name it, so point at the text.
  const id = React.useId()
  return (
    <label className="flex cursor-pointer items-start gap-2">
      <Checkbox className="mt-0.5" aria-labelledby={id} {...props} />
      <span className="flex flex-col">
        <span id={id} className="text-body">
          {label}
        </span>
        {hint && <span className="text-label text-muted">{hint}</span>}
      </span>
    </label>
  )
}

export function Switch({ className, ...props }: Omit<BaseSwitch.Root.Props, "className"> & { className?: string }) {
  return (
    <BaseSwitch.Root
      className={cx(
        "relative inline-flex h-[18px] w-8 shrink-0 cursor-pointer items-center rounded-full bg-strong p-0.5 outline-none transition-colors data-[checked]:bg-accent focus-visible:outline-2 focus-visible:outline-focus data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
        className,
      )}
      {...props}
    >
      <BaseSwitch.Thumb className="block size-3.5 rounded-full bg-white shadow-sm transition-transform data-[checked]:translate-x-3.5" />
    </BaseSwitch.Root>
  )
}

export type Option<V extends string = string> = { value: V; label: React.ReactNode; hint?: React.ReactNode; disabled?: boolean }

export function RadioGroup<V extends string>({ options, value, onValueChange, className, disabled }: { options: Option<V>[]; value: V | null | undefined; onValueChange: (value: V) => void; className?: string; disabled?: boolean }) {
  return (
    <BaseRadioGroup value={value ?? null} onValueChange={(v) => onValueChange(v as V)} disabled={disabled} className={cx("flex flex-col gap-2", className)}>
      {options.map((o) => (
        <label key={o.value} className="flex cursor-pointer items-start gap-2">
          <BaseRadio.Root
            value={o.value}
            disabled={o.disabled}
            className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border border-strong bg-surface outline-none data-[checked]:border-accent focus-visible:outline-2 focus-visible:outline-focus data-[disabled]:opacity-50"
          >
            <BaseRadio.Indicator className="size-2 rounded-full bg-accent" />
          </BaseRadio.Root>
          <span className="flex flex-col">
            <span className="text-body">{o.label}</span>
            {o.hint && <span className="text-label text-muted">{o.hint}</span>}
          </span>
        </label>
      ))}
    </BaseRadioGroup>
  )
}

/** A segmented control: one of a few values, all visible (24h / 7d / 30d). */
export function Segmented<V extends string>({ options, value, onValueChange, size = "sm", className, "aria-label": ariaLabel }: { options: Option<V>[]; value: V; onValueChange: (value: V) => void; size?: ControlSize; className?: string; "aria-label"?: string }) {
  return (
    <BaseToggleGroup
      value={[value]}
      onValueChange={(v) => v[0] && onValueChange(v[0] as V)}
      aria-label={ariaLabel}
      className={cx("inline-flex items-center gap-0.5 rounded-control border border-control bg-subtle p-0.5", size === "sm" ? "h-7" : "h-8", className)}
    >
      {options.map((o) => (
        <BaseToggle
          key={o.value}
          value={o.value}
          disabled={o.disabled}
          className="inline-flex h-full items-center gap-1 rounded-[4px] px-2 text-label font-medium text-muted outline-none transition-colors hover:text-fg data-[pressed]:bg-surface data-[pressed]:text-fg data-[pressed]:shadow-control focus-visible:outline-2 focus-visible:outline-focus"
        >
          {o.label}
        </BaseToggle>
      ))}
    </BaseToggleGroup>
  )
}
