import { signal } from '@preact/signals'

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

// Module-level so every component shares one source of truth; anything that
// reads `theme.value` while rendering updates when it changes.
const theme = signal<Theme>(readTheme())

function setTheme(next: Theme) {
  document.documentElement.dataset.theme = next
  localStorage.setItem(STORAGE_KEY, next)
  theme.value = next
}

function cycleTheme() {
  const currentIndex = THEMES.findIndex((t) => t.id === theme.value)
  setTheme(THEMES[(currentIndex + 1) % THEMES.length].id)
}

// Keep tabs in sync.
window.addEventListener('storage', (event) => {
  if (event.key === STORAGE_KEY && isValidTheme(event.newValue)) {
    document.documentElement.dataset.theme = event.newValue
    theme.value = event.newValue
  }
})

export function useTheme() {
  return {
    theme: theme.value,
    setTheme,
    cycleTheme,
    toggleTheme: cycleTheme,
    themes: THEMES,
  }
}
