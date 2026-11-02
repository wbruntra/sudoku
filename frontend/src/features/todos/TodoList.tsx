import { useState } from 'react'
import {
  useAddTodoMutation,
  useDeleteTodoMutation,
  useGetTodosQuery,
  useToggleTodoMutation,
} from '@/features/todos/todosSlice'

export default function TodoList() {
  const {
    data: todos,
    isLoading,
    isError,
  } = useGetTodosQuery(undefined, {
    refetchOnMountOrArgChange: true,
  })
  const [addTodo, { isLoading: isAdding }] = useAddTodoMutation()
  const [toggleTodo] = useToggleTodoMutation()
  const [deleteTodo] = useDeleteTodoMutation()
  const [title, setTitle] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    const result = await addTodo(title)
    if (!('error' in result)) setTitle('')
  }

  const doneCount = todos?.filter((t) => t.done).length ?? 0

  return (
    <div className="animate-rise border border-void-line bg-void-raised p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl text-ink">Bucket List</h2>
          <p className="mt-1 text-sm text-ink-dim">Things to do before you kick the bucket.</p>
        </div>
        <span className="border border-sky/40 bg-sky/10 px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-widest text-sky">
          {doneCount} / {todos?.length ?? 0} Done
        </span>
      </div>

      <form onSubmit={handleSubmit} className="mb-6 flex gap-3">
        <input
          type="text"
          className="w-full border border-void-line bg-void px-3 py-2.5 text-sm text-ink placeholder:text-ink-dim/60 outline-none transition-colors focus:border-lime"
          placeholder="Swim with a whale shark…"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
        />
        <button
          type="submit"
          className="border border-lime bg-lime px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-widest text-accent-ink transition-colors hover:bg-transparent hover:text-lime disabled:pointer-events-none disabled:opacity-40"
          disabled={isAdding}
        >
          Add
        </button>
      </form>

      {isLoading && <p className="text-sm text-ink-dim">Loading…</p>}
      {isError && (
        <p className="text-sm text-flame">Failed to load your list. Please try again.</p>
      )}
      {todos?.length === 0 && (
        <p className="text-sm text-ink-dim">Nothing here yet — add your first dream above.</p>
      )}

      <ul className="flex flex-col">
        {todos?.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center gap-3 border-b border-void-line/60 py-3 last:border-0"
          >
            <input
              type="checkbox"
              className="h-4 w-4 accent-lime"
              checked={todo.done}
              aria-label={`Mark "${todo.title}" as ${todo.done ? 'not done' : 'done'}`}
              onChange={() => toggleTodo({ id: todo.id, done: !todo.done })}
            />
            <span
              className={`flex-1 text-sm ${todo.done ? 'text-ink-dim line-through' : 'text-ink'}`}
            >
              {todo.title}
            </span>
            <button
              type="button"
              className="font-mono text-xs uppercase tracking-widest text-ink-dim transition-colors hover:text-flame"
              onClick={() => deleteTodo(todo.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
