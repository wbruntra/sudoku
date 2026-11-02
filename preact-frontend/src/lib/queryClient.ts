import { QueryClient } from '@tanstack/preact-query'
import { ApiError } from '@/lib/api'

/**
 * Client errors (4xx) will not succeed on retry, so fail fast and let the UI
 * show the error; only transient failures are retried.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) =>
        !(error instanceof ApiError && error.status < 500) && failureCount < 2,
    },
  },
})
