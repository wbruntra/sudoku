import { useSignal } from '@preact/signals'
import type { JSX } from 'preact'
import { useMutation } from '@tanstack/preact-query'
import { signup } from '@/store/auth'

interface SignUpFormProps {
  onToggle?: () => void
}

const inputClass =
  'w-full border border-void-line bg-void-raised px-3 py-2.5 text-sm text-ink placeholder:text-ink-dim/60 outline-none transition-colors focus:border-lime'

export default function SignUpForm({ onToggle }: SignUpFormProps) {
  const name = useSignal('')
  const email = useSignal('')
  const password = useSignal('')
  const mutation = useMutation({ mutationFn: signup })

  const handleSubmit = (e: JSX.TargetedEvent<HTMLFormElement, Event>) => {
    e.preventDefault()
    mutation.mutate({ name: name.value, email: email.value, password: password.value })
  }

  return (
    <div class="border border-void-line bg-void-raised p-8">
      <div class="mb-6">
        <h2 class="font-display text-2xl text-ink">Create Account</h2>
        <p class="mt-1 text-sm text-ink-dim">Start your journey with us today.</p>
      </div>

      <form onSubmit={handleSubmit} class="flex flex-col gap-4">
        <div>
          <label class="mb-1.5 block font-mono text-xs uppercase tracking-widest text-ink-dim">
            Full Name
          </label>
          <input
            type="text"
            class={inputClass}
            placeholder="John Doe"
            value={name}
            onInput={(e) => (name.value = e.currentTarget.value)}
            required
          />
        </div>

        <div>
          <label class="mb-1.5 block font-mono text-xs uppercase tracking-widest text-ink-dim">
            Email
          </label>
          <input
            type="email"
            class={inputClass}
            placeholder="you@example.com"
            value={email}
            onInput={(e) => (email.value = e.currentTarget.value)}
            required
          />
        </div>

        <div>
          <label class="mb-1.5 block font-mono text-xs uppercase tracking-widest text-ink-dim">
            Password
          </label>
          <input
            type="password"
            class={inputClass}
            placeholder="••••••••"
            value={password}
            onInput={(e) => (password.value = e.currentTarget.value)}
            required
          />
        </div>

        {mutation.isError && <p class="text-sm text-flame">{mutation.error.message}</p>}

        <button
          type="submit"
          class="mt-2 flex w-full items-center justify-center border border-lime bg-lime px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-widest text-accent-ink transition-colors hover:bg-transparent hover:text-lime disabled:pointer-events-none disabled:opacity-40"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? (
            <span class="h-4 w-4 animate-spin rounded-full border-2 border-accent-ink/30 border-t-accent-ink" />
          ) : (
            'Create Account'
          )}
        </button>
      </form>

      {onToggle && (
        <p class="mt-6 text-center text-sm text-ink-dim">
          Already have an account?{' '}
          <button
            class="font-mono text-xs font-semibold uppercase tracking-widest text-lime"
            onClick={onToggle}
          >
            Sign In
          </button>
        </p>
      )}
    </div>
  )
}
