import { useState } from 'react'
import { Navigate } from 'react-router'
import { useAppSelector } from '@/store/hooks'
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
    description: 'Built with Bun, Drizzle ORM, and Vite v8',
  },
  {
    icon: '🧭',
    title: 'Client-Side Routing',
    description: 'Declarative React Router navigation',
  },
]

export default function AuthPage() {
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const [showSignUp, setShowSignUp] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/users" replace />
  }

  return (
    <div className="grid animate-rise grid-cols-1 items-center gap-16 py-8 md:grid-cols-2">
      <div>
        <h1 className="font-display text-4xl italic text-ink">Scaffold</h1>
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-dim">
          A modern foundation for your next project. Secure authentication, elegant UI, and React
          Router navigation.
        </p>

        <div className="mt-10 flex flex-col gap-6">
          {features.map((feature) => (
            <div key={feature.title} className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-void-line text-lg">
                {feature.icon}
              </div>
              <div>
                <h4 className="font-mono text-sm font-medium uppercase tracking-wide text-ink">
                  {feature.title}
                </h4>
                <p className="mt-1 text-sm text-ink-dim">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        {showSignUp ? (
          <SignUpForm onToggle={() => setShowSignUp(false)} />
        ) : (
          <SignInForm onToggle={() => setShowSignUp(true)} />
        )}
      </div>
    </div>
  )
}
