import type { ComponentType } from 'preact'
import { useEffect } from 'preact/hooks'
import { useLocation } from 'preact-iso'
import { isAuthenticated, loading } from '@/store/auth'

interface ProtectedRouteProps {
  /** Consumed by the Router for matching; unused here. */
  path?: string
  component: ComponentType
}

/** Route element: `<ProtectedRoute path="/users" component={UsersPage} />`. */
export default function ProtectedRoute({ component: Component }: ProtectedRouteProps) {
  const { route } = useLocation()
  const authenticated = isAuthenticated.value
  const isLoading = loading.value

  useEffect(() => {
    if (!isLoading && !authenticated) route('/login', true)
  }, [isLoading, authenticated, route])

  if (isLoading) {
    return (
      <div class="flex min-h-[40vh] items-center justify-center">
        <div class="h-9 w-9 animate-spin rounded-full border-2 border-void-line border-t-lime" />
      </div>
    )
  }

  return authenticated ? <Component /> : null
}
