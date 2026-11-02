import { useState } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { signin } from '@/features/auth/authSlice'

interface SignInFormProps {
  onToggle?: () => void
}

const inputClass =
  'w-full border border-void-line bg-void-raised px-3 py-2.5 text-sm text-ink placeholder:text-ink-dim/60 outline-none transition-colors focus:border-lime'

export default function SignInForm({ onToggle }: SignInFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useAppDispatch()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await dispatch(signin({ email, password }))
    setIsLoading(false)
  }

  return (
    <div className="border border-void-line bg-void-raised p-8">
      <div className="mb-6">
        <h2 className="font-display text-2xl text-ink">Sign In</h2>
        <p className="mt-1 text-sm text-ink-dim">Welcome back! Please enter your details.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block font-mono text-xs uppercase tracking-widest text-ink-dim">
            Email
          </label>
          <input
            type="email"
            className={inputClass}
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="mb-1.5 block font-mono text-xs uppercase tracking-widest text-ink-dim">
            Password
          </label>
          <input
            type="password"
            className={inputClass}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="mt-2 flex w-full items-center justify-center border border-lime bg-lime px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-widest text-accent-ink transition-colors hover:bg-transparent hover:text-lime disabled:pointer-events-none disabled:opacity-40"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-accent-ink/30 border-t-accent-ink" />
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      {onToggle && (
        <p className="mt-6 text-center text-sm text-ink-dim">
          Don't have an account?{' '}
          <button
            className="font-mono text-xs font-semibold uppercase tracking-widest text-lime"
            onClick={onToggle}
          >
            Sign Up
          </button>
        </p>
      )}
    </div>
  )
}
