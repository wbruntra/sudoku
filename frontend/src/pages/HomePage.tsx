import { Link } from 'react-router'
import { useAppSelector } from '@/store/hooks'

const badgeClass = {
  primary: 'border-lime/40 bg-lime/10 text-lime',
  success: 'border-sky/40 bg-sky/10 text-sky',
  warning: 'border-flame/40 bg-flame/10 text-flame',
}

export default function HomePage() {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)

  return (
    <div className="animate-rise">
      <div className="mb-16 max-w-2xl">
        <h1 className="font-display text-5xl leading-[1.05] text-ink">
          Vite + React Router
          <span className="italic text-lime"> + Oxlint</span>
        </h1>
        <p className="mt-5 max-w-xl font-mono text-sm leading-relaxed text-ink-dim">
          Upgraded to Vite v8, TypeScript v7, and React Router v7/v8 with Oxlint speed.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-px bg-void-line md:grid-cols-3">
        {/* demo:start — removed by `bun run init` */}
        <div className="flex flex-col bg-void p-6">
          <span
            className={`mb-3 inline-block w-fit border px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-widest ${badgeClass.primary}`}
          >
            Routing
          </span>
          <h3 className="mb-2 font-display text-xl text-ink">Interactive Demo</h3>
          <p className="mb-6 flex-1 text-sm leading-relaxed text-ink-dim">
            Explore dynamic URL parameters, query search params, nested layouts with Outlets, and
            programmatic navigation.
          </p>
          <Link
            to="/demo"
            className="w-fit border border-lime bg-lime px-4 py-2 font-mono text-xs font-semibold uppercase tracking-widest text-accent-ink transition-colors hover:bg-transparent hover:text-lime"
          >
            Launch Routing Demo →
          </Link>
        </div>
        {/* demo:end */}

        <div className="flex flex-col bg-void p-6">
          <span
            className={`mb-3 inline-block w-fit border px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-widest ${badgeClass.success}`}
          >
            Architecture
          </span>
          <h3 className="mb-2 font-display text-xl text-ink">Authentication &amp; State</h3>
          <p className="mb-6 flex-1 text-sm leading-relaxed text-ink-dim">
            {isAuthenticated
              ? `Signed in as ${user?.email || 'User'}. Access protected user management and data.`
              : 'Secure JWT authentication with Redux Toolkit state management and protected routes.'}
          </p>
          {isAuthenticated ? (
            <Link
              to="/users"
              className="w-fit border border-void-line px-4 py-2 font-mono text-xs font-semibold uppercase tracking-widest text-ink transition-colors hover:border-lime hover:text-lime"
            >
              View Users List →
            </Link>
          ) : (
            <Link
              to="/login"
              className="w-fit border border-void-line px-4 py-2 font-mono text-xs font-semibold uppercase tracking-widest text-ink transition-colors hover:border-lime hover:text-lime"
            >
              Sign In / Sign Up →
            </Link>
          )}
        </div>

        <div className="flex flex-col bg-void p-6">
          <span
            className={`mb-3 inline-block w-fit border px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-widest ${badgeClass.warning}`}
          >
            Tooling
          </span>
          <h3 className="mb-2 font-display text-xl text-ink">Cutting-Edge Stack</h3>
          <p className="mb-6 flex-1 text-sm leading-relaxed text-ink-dim">
            Equipped with Oxlint for lightning-fast linting, Vite v8 rolldown engine, and
            TypeScript v7 strict typing.
          </p>
          <div className="flex flex-wrap gap-2">
            {['TypeScript 7', 'Vite 8', 'Oxlint', 'React 19'].map((tag) => (
              <span
                key={tag}
                className={`border px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-widest ${badgeClass.primary}`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
