import { useEffect } from 'preact/hooks'
import { useSignal } from '@preact/signals'
import { useLocation } from 'preact-iso'
import { isAuthenticated } from '@/store/auth'
import SignInForm from '@/features/auth/SignInForm'
import SignUpForm from '@/features/auth/SignUpForm'

const features = [
  {
    icon: '🔐',
    title: 'Secure Authentication',
    description: 'JWT-based auth with bcrypt password hashing',
  },
  {
    icon: '⚡',
    title: 'Lightning Fast',
    description: 'Built with Bun, Kysely, and Vite v8',
  },
  {
    icon: '🧭',
    title: 'Client-Side Routing',
    description: 'Lightweight preact-iso routing',
  },
]

export default function AuthPage() {
  const { route } = useLocation()
  const showSignUp = useSignal(false)
  const authenticated = isAuthenticated.value

  useEffect(() => {
    if (authenticated) route('/users', true)
  }, [authenticated, route])

  if (authenticated) return null

  return (
    <div class="grid animate-rise grid-cols-1 items-center gap-16 py-8 md:grid-cols-2">
      <div>
        <h1 class="font-display text-4xl italic text-ink">Scaffold</h1>
        <p class="mt-4 max-w-sm text-sm leading-relaxed text-ink-dim">
          A modern foundation for your next project. Secure authentication, elegant UI, and Preact
          navigation.
        </p>

        <div class="mt-10 flex flex-col gap-6">
          {features.map((feature) => (
            <div key={feature.title} class="flex items-start gap-4">
              <div class="flex h-10 w-10 shrink-0 items-center justify-center border border-void-line text-lg">
                {feature.icon}
              </div>
              <div>
                <h4 class="font-mono text-sm font-medium uppercase tracking-wide text-ink">
                  {feature.title}
                </h4>
                <p class="mt-1 text-sm text-ink-dim">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        {showSignUp.value ? (
          <SignUpForm onToggle={() => (showSignUp.value = false)} />
        ) : (
          <SignInForm onToggle={() => (showSignUp.value = true)} />
        )}
      </div>
    </div>
  )
}
