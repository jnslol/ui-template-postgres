"use client"

import { Page, PageHeader, SettingsRow, SettingsSection } from "./staff-layout"
import { Switch } from "./staff-form"
import { Select } from "./staff-select"
import type { Theme } from "./staff-theme"

export function WorkspaceSettings({
  theme, onThemeChange, compact, onCompactChange,
}: {
  theme: Theme
  onThemeChange: (theme: Theme) => void
  compact: boolean
  onCompactChange: (compact: boolean) => void
}) {
  return (
    <Page width="narrow">
      <PageHeader title="Settings" description="Adjust how the workspace looks in this browser." />
      <SettingsSection title="Appearance">
        <SettingsRow label="Theme" description="Choose a color scheme or follow your system setting.">
          <Select aria-label="Theme" className="min-w-32" value={theme} onValueChange={onThemeChange}
            options={[{ value: "system", label: "System" }, { value: "light", label: "Light" }, { value: "dark", label: "Dark" }]} />
        </SettingsRow>
        <SettingsRow label="Compact sidebar" htmlFor="compact-sidebar" description="Show icons only in the desktop navigation.">
          <Switch id="compact-sidebar" checked={compact} onCheckedChange={onCompactChange} />
        </SettingsRow>
      </SettingsSection>
    </Page>
  )
}
