import { useMutation, useQuery, useQueryClient } from '@tanstack/preact-query'
import { api, authHeaders, unwrap, type ApiTodo, type TodosResponse } from '@/lib/api'
import { token } from '@/store/auth'

const KEY = ['todos']

const headers = () => ({ headers: authHeaders(token.value) })

/** Read: the signed-in user's todos. */
export function useTodos() {
  return useQuery({
    queryKey: KEY,
    queryFn: async (): Promise<ApiTodo[]> => {
      const body = await unwrap<TodosResponse>(await api.todos.$get({}, headers()))
      return body.todos
    },
  })
}

/**
 * Create / update / delete. Each one refetches the list on success, so the UI
 * always shows what the server actually stored.
 */
export function useTodoMutations() {
  const queryClient = useQueryClient()
  const onSuccess = () => queryClient.invalidateQueries({ queryKey: KEY })

  const add = useMutation({
    mutationFn: async (title: string) =>
      unwrap(await api.todos.$post({ json: { title } }, headers())),
    onSuccess,
  })

  const toggle = useMutation({
    mutationFn: async ({ id, done }: { id: number; done: boolean }) =>
      unwrap(
        await api.todos[':id'].$patch({ param: { id: String(id) }, json: { done } }, headers()),
      ),
    onSuccess,
  })

  const remove = useMutation({
    mutationFn: async (id: number) =>
      unwrap(await api.todos[':id'].$delete({ param: { id: String(id) } }, headers())),
    onSuccess,
  })

  return { add, toggle, remove }
}
