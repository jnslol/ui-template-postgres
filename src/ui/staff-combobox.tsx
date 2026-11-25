"use client"

import { Combobox as BaseCombobox } from "@base-ui/react/combobox"
import { Check, ChevronsUpDown } from "lucide-react"

import { cx } from "./staff-cx"
import { controlClass, type ControlSize } from "./staff-form"
import { itemClass, popupClass } from "./staff-select"

export type ComboItem = { value: string; label: string; hint?: string }

/**
 * A searchable picker. The caller owns the search: pass the matching `items` for `inputValue` (server lists),
 * or every item and `filter` = true to filter here.
 */
export function Combobox({
  items,
  value,
  onValueChange,
  inputValue,
  onInputValueChange,
  placeholder,
  emptyText,
  size = "md",
  disabled,
  invalid,
  id,
  className,
  filter = false,
  "aria-label": ariaLabel,
}: {
  items: ComboItem[]
  value: ComboItem | null
  onValueChange: (value: ComboItem | null) => void
  inputValue?: string
  onInputValueChange?: (value: string) => void
  placeholder?: string
  emptyText?: string
  size?: ControlSize
  disabled?: boolean
  invalid?: boolean
  id?: string
  className?: string
  filter?: boolean
  "aria-label"?: string
}) {
  return (
    <BaseCombobox.Root
      items={items}
      value={value}
      onValueChange={(v) => onValueChange((v as ComboItem | null) ?? null)}
      inputValue={inputValue}
      onInputValueChange={onInputValueChange}
      filter={filter ? undefined : null}
      itemToStringLabel={(i: ComboItem) => i.label}
      isItemEqualToValue={(a: ComboItem, b: ComboItem) => a.value === b.value}
      disabled={disabled}
    >
      <div className={cx("relative", className)}>
        <BaseCombobox.Input id={id} aria-label={ariaLabel} placeholder={placeholder} aria-invalid={invalid || undefined} className={controlClass(size, "pr-7")} />
        <BaseCombobox.Trigger className="absolute inset-y-0 right-1.5 flex items-center text-faint" aria-hidden tabIndex={-1}>
          <ChevronsUpDown className="size-3.5" />
        </BaseCombobox.Trigger>
      </div>
      <BaseCombobox.Portal>
        <BaseCombobox.Positioner sideOffset={4} className="z-50">
          <BaseCombobox.Popup className={cx(popupClass, "w-(--anchor-width)")}>
            <BaseCombobox.Empty className="px-2 py-1.5 text-label text-muted empty:hidden">{emptyText}</BaseCombobox.Empty>
            <BaseCombobox.List>
              {(item: ComboItem) => (
                <BaseCombobox.Item key={item.value} value={item} className={cx(itemClass, "h-auto min-h-7 py-1 pr-7")}>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate">{item.label}</span>
                    {item.hint && <span className="truncate text-label text-muted">{item.hint}</span>}
                  </span>
                  <BaseCombobox.ItemIndicator className="absolute right-2 flex">
                    <Check className="!text-fg" />
                  </BaseCombobox.ItemIndicator>
                </BaseCombobox.Item>
              )}
            </BaseCombobox.List>
          </BaseCombobox.Popup>
        </BaseCombobox.Positioner>
      </BaseCombobox.Portal>
    </BaseCombobox.Root>
  )
}
