"use client"

import * as React from "react"
import { Select as BaseSelect } from "@base-ui/react/select"
import { Check, ChevronsUpDown } from "lucide-react"

import { cx } from "./staff-cx"
import { controlClass, type ControlSize, type Option } from "./staff-form"

export const popupClass =
  "z-50 max-h-(--available-height) min-w-(--anchor-width) overflow-y-auto rounded-card border border-border bg-surface p-1 text-body text-fg shadow-popover outline-none origin-(--transform-origin) transition-[opacity,transform] duration-100 data-[starting-style]:opacity-0 data-[starting-style]:scale-[0.98] data-[ending-style]:opacity-0"
export const itemClass =
  "relative flex h-7 cursor-default items-center gap-2 rounded-[4px] px-2 text-body outline-none select-none data-[highlighted]:bg-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted"

/** A dropdown of options. `value` null shows the placeholder. */
export function Select<V extends string>({
  options,
  value,
  onValueChange,
  placeholder,
  size = "md",
  className,
  disabled,
  id,
  name,
  "aria-label": ariaLabel,
}: {
  options: Option<V>[]
  value: V | null | undefined
  onValueChange: (value: V) => void
  placeholder?: string
  size?: ControlSize
  className?: string
  disabled?: boolean
  id?: string
  name?: string
  "aria-label"?: string
}) {
  const items = React.useMemo(() => options.map((o) => ({ value: o.value, label: o.label })), [options])
  return (
    <BaseSelect.Root items={items} value={value ?? null} onValueChange={(v) => v != null && onValueChange(v as V)} disabled={disabled} name={name}>
      <BaseSelect.Trigger id={id} aria-label={ariaLabel} className={controlClass(size, cx("flex items-center justify-between gap-2 text-left data-[popup-open]:border-focus", className))}>
        <BaseSelect.Value className="truncate data-[placeholder]:text-muted">{(v: V | null) => (v == null ? placeholder : options.find((o) => o.value === v)?.label)}</BaseSelect.Value>
        <BaseSelect.Icon className="flex text-faint">
          <ChevronsUpDown className="size-3.5" />
        </BaseSelect.Icon>
      </BaseSelect.Trigger>
      <BaseSelect.Portal>
        <BaseSelect.Positioner sideOffset={4} alignItemWithTrigger={false} className="z-50">
          <BaseSelect.Popup className={popupClass}>
            <BaseSelect.List>
              {options.map((o) => (
                <BaseSelect.Item key={o.value} value={o.value} disabled={o.disabled} className={cx(itemClass, "pr-7")}>
                  <BaseSelect.ItemText className="flex-1 truncate">{o.label}</BaseSelect.ItemText>
                  <BaseSelect.ItemIndicator className="absolute right-2 flex">
                    <Check className="!text-fg" />
                  </BaseSelect.ItemIndicator>
                </BaseSelect.Item>
              ))}
            </BaseSelect.List>
          </BaseSelect.Popup>
        </BaseSelect.Positioner>
      </BaseSelect.Portal>
    </BaseSelect.Root>
  )
}
