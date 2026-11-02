import { useCallback, useEffect, useState } from 'react'

export type Theme = 'dark' | 'light' | 'solarized'

export interface ThemeInfo {
  id: Theme
  label: string
}

export const THEMES: readonly ThemeInfo[] = [
  { id: 'dark', label: 'Dark' },
  { id: 'light', label: 'Light' },
  { id: 'solarized', label: 'Solarized' },
] as const

const STORAGE_KEY = 'scaffold-theme'

function isValidTheme(value: unknown): value is Theme {
  return value === 'dark' || value === 'light' || value === 'solarized'
}

function readTheme(): Theme {
  const datasetTheme = document.documentElement.dataset.theme
  if (isValidTheme(datasetTheme)) {
    return datasetTheme
  }

  const stored = localStorage.getItem(STORAGE_KEY)
  if (isValidTheme(stored)) {
    return stored
  }

  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  localStorage.setItem(STORAGE_KEY, theme)
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(readTheme)

  const setTheme = useCallback((next: Theme) => {
    applyTheme(next)
    setThemeState(next)
  }, [])

  const cycleTheme = useCallback(() => {
    setThemeState((current) => {
      const currentIndex = THEMES.findIndex((t) => t.id === current)
      const nextIndex = (currentIndex + 1) % THEMES.length
      const nextTheme = THEMES[nextIndex].id
      applyTheme(nextTheme)
      return nextTheme
    })
  }, [])

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY && isValidTheme(event.newValue)) {
        document.documentElement.dataset.theme = event.newValue
        setThemeState(event.newValue)
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  return {
    theme,
    setTheme,
    cycleTheme,
    toggleTheme: cycleTheme,
    themes: THEMES,
  }
}
