import { render } from 'preact'
import { LocationProvider } from 'preact-iso'
import { QueryClientProvider } from '@tanstack/preact-query'
import { queryClient } from '@/lib/queryClient'
import { initializeAuth } from '@/store/auth'
import App from '@/App.tsx'
import '@/styles/app.css'

void initializeAuth()

render(
  <QueryClientProvider client={queryClient}>
    <LocationProvider>
      <App />
    </LocationProvider>
  </QueryClientProvider>,
  document.getElementById('root')!,
)
