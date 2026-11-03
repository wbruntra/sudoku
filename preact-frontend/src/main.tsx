import { render } from 'preact'
import { LocationProvider } from 'preact-iso'
import { QueryClientProvider } from '@tanstack/preact-query'
import { queryClient } from '@/lib/queryClient'
import { initializeAuth } from '@/store/auth'
import App from '@/App.tsx'
import '@/styles/app.css'

// Served from a sub-path on GitHub Pages: strip the base so preact-iso's router sees `/`.
const base = import.meta.env.BASE_URL.replace(/\/$/, '')
if (base && location.pathname.startsWith(base)) {
  history.replaceState(null, '', location.pathname.slice(base.length) || '/')
}

void initializeAuth()

render(
  <QueryClientProvider client={queryClient}>
    <LocationProvider>
      <App />
    </LocationProvider>
  </QueryClientProvider>,
  document.getElementById('root')!,
)
