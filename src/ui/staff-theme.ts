"use client"

import { useEffect, useState } from "react"

export type Theme = "light" | "dark" | "system"

export function useStaffTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "system"
    try {
      const stored = window.localStorage.getItem("staff-theme")
      if (stored === "light" || stored === "dark") return stored
    } catch {
      // The theme still works for the current session when storage is unavailable.
    }
    return "system"
  })

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const apply = () => {
      document.documentElement.dataset.theme = theme === "system" ? (media.matches ? "dark" : "light") : theme
    }
    try {
      window.localStorage.setItem("staff-theme", theme)
    } catch {
      // Keep the in-memory preference.
    }
    apply()
    media.addEventListener("change", apply)
    return () => media.removeEventListener("change", apply)
  }, [theme])

  return [theme, setTheme] as const
}
