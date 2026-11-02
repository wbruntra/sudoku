import { useQuery } from '@tanstack/preact-query'
import { api, authHeaders, unwrap, type ApiUser, type UsersResponse } from '@/lib/api'
import { token } from '@/store/auth'

/** Re-exported so components import the backend-derived type, never a copy. */
export type User = ApiUser

/**
 * Requests go through the Hono RPC client, so payload types come from the
 * backend rather than being re-declared here.
 */
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async (): Promise<User[]> => {
      const response = await api.users.$get({}, { headers: authHeaders(token.value) })
      const body = await unwrap<UsersResponse>(response)
      return body.users
    },
    refetchOnMount: 'always',
  })
}
