import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import { ApiError, api, authHeaders, unwrap, type ApiUser, type UsersResponse } from '@/lib/api'

/** Re-exported so components import the backend-derived type, never a copy. */
export type User = ApiUser

interface RootStateWithAuth {
  auth: { token: string | null }
}

export interface QueryError {
  status: number
  message: string
}

function toQueryError(error: unknown): QueryError {
  if (error instanceof ApiError) return { status: error.status, message: error.message }
  return { status: 500, message: error instanceof Error ? error.message : 'Request failed' }
}

/**
 * Requests go through the Hono RPC client, so payload types come from the
 * backend rather than being re-declared here. `fakeBaseQuery` is the supported
 * way to pair RTK Query's caching with a custom transport.
 */
export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fakeBaseQuery<QueryError>(),
  tagTypes: ['Users'],
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      queryFn: async (_arg, { getState }) => {
        try {
          const { token } = (getState() as RootStateWithAuth).auth
          const response = await api.users.$get({}, { headers: authHeaders(token) })
          const body = await unwrap<UsersResponse>(response)
          return { data: body.users }
        } catch (error) {
          return { error: toQueryError(error) }
        }
      },
      providesTags: ['Users'],
    }),
  }),
})

export const { useGetUsersQuery } = usersApi
export default usersApi
