import { useSignal } from '@preact/signals'
import type { JSX } from 'preact'
import { useTodoMutations, useTodos } from '@/features/todos/useTodos'

export default function TodoList() {
  const { data: todos, isPending, isError } = useTodos()
  const { add, toggle, remove } = useTodoMutations()
  const title = useSignal('')

  const handleSubmit = (e: JSX.TargetedEvent<HTMLFormElement, Event>) => {
    e.preventDefault()
    if (!title.value.trim()) return
    add.mutate(title.value, { onSuccess: () => (title.value = '') })
  }

  const doneCount = todos?.filter((t) => t.done).length ?? 0

  return (
    <div class="animate-rise border border-void-line bg-void-raised p-6">
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h2 class="font-display text-2xl text-ink">Bucket List</h2>
          <p class="mt-1 text-sm text-ink-dim">Things to do before you kick the bucket.</p>
        </div>
        <span class="border border-sky/40 bg-sky/10 px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-widest text-sky">
          {doneCount} / {todos?.length ?? 0} Done
        </span>
      </div>

      <form onSubmit={handleSubmit} class="mb-6 flex gap-3">
        <input
          type="text"
          class="w-full border border-void-line bg-void px-3 py-2.5 text-sm text-ink placeholder:text-ink-dim/60 outline-none transition-colors focus:border-lime"
          placeholder="Swim with a whale shark…"
          value={title}
          onInput={(e) => (title.value = e.currentTarget.value)}
          maxLength={200}
        />
        <button
          type="submit"
          class="border border-lime bg-lime px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-widest text-accent-ink transition-colors hover:bg-transparent hover:text-lime disabled:pointer-events-none disabled:opacity-40"
          disabled={add.isPending}
        >
          Add
        </button>
      </form>

      {isPending && <p class="text-sm text-ink-dim">Loading…</p>}
      {isError && <p class="text-sm text-flame">Failed to load your list. Please try again.</p>}
      {todos?.length === 0 && (
        <p class="text-sm text-ink-dim">Nothing here yet — add your first dream above.</p>
      )}

      <ul class="flex flex-col">
        {todos?.map((todo) => (
          <li
            key={todo.id}
            class="flex items-center gap-3 border-b border-void-line/60 py-3 last:border-0"
          >
            <input
              type="checkbox"
              class="h-4 w-4 accent-lime"
              checked={todo.done}
              aria-label={`Mark "${todo.title}" as ${todo.done ? 'not done' : 'done'}`}
              onChange={() => toggle.mutate({ id: todo.id, done: !todo.done })}
            />
            <span class={`flex-1 text-sm ${todo.done ? 'text-ink-dim line-through' : 'text-ink'}`}>
              {todo.title}
            </span>
            <button
              type="button"
              class="font-mono text-xs uppercase tracking-widest text-ink-dim transition-colors hover:text-flame"
              onClick={() => remove.mutate(todo.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
