import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import { ApiError, api, authHeaders, unwrap, type ApiTodo, type TodosResponse } from '@/lib/api'

/** Re-exported so components import the backend-derived type, never a copy. */
export type Todo = ApiTodo

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
 * Full CRUD through the Hono RPC client. Mutations invalidate the 'Todos' tag,
 * so RTK Query refetches the list and the UI shows what the server stored.
 */
export const todosApi = createApi({
  reducerPath: 'todosApi',
  baseQuery: fakeBaseQuery<QueryError>(),
  tagTypes: ['Todos'],
  endpoints: (builder) => {
    const headers = (getState: () => unknown) =>
      authHeaders((getState() as RootStateWithAuth).auth.token)

    return {
      // Read
      getTodos: builder.query<Todo[], void>({
        queryFn: async (_arg, { getState }) => {
          try {
            const response = await api.todos.$get({}, { headers: headers(getState) })
            return { data: (await unwrap<TodosResponse>(response)).todos }
          } catch (error) {
            return { error: toQueryError(error) }
          }
        },
        providesTags: ['Todos'],
      }),

      // Create
      addTodo: builder.mutation<null, string>({
        queryFn: async (title, { getState }) => {
          try {
            const response = await api.todos.$post(
              { json: { title } },
              { headers: headers(getState) },
            )
            await unwrap(response)
            return { data: null }
          } catch (error) {
            return { error: toQueryError(error) }
          }
        },
        invalidatesTags: ['Todos'],
      }),

      // Update
      toggleTodo: builder.mutation<null, { id: number; done: boolean }>({
        queryFn: async ({ id, done }, { getState }) => {
          try {
            const response = await api.todos[':id'].$patch(
              { param: { id: String(id) }, json: { done } },
              { headers: headers(getState) },
            )
            await unwrap(response)
            return { data: null }
          } catch (error) {
            return { error: toQueryError(error) }
          }
        },
        invalidatesTags: ['Todos'],
      }),

      // Delete
      deleteTodo: builder.mutation<null, number>({
        queryFn: async (id, { getState }) => {
          try {
            const response = await api.todos[':id'].$delete(
              { param: { id: String(id) } },
              { headers: headers(getState) },
            )
            await unwrap(response)
            return { data: null }
          } catch (error) {
            return { error: toQueryError(error) }
          }
        },
        invalidatesTags: ['Todos'],
      }),
    }
  },
})

export const {
  useGetTodosQuery,
  useAddTodoMutation,
  useToggleTodoMutation,
  useDeleteTodoMutation,
} = todosApi
