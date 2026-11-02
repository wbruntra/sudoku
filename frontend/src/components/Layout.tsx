import { NavLink, Link, Outlet } from 'react-router'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { signout } from '@/features/auth/authSlice'
import { todosApi } from '@/features/todos/todosSlice'
import ThemeToggle from '@/components/ThemeToggle'

interface LayoutProps {
  children?: React.ReactNode
}

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `font-mono text-xs uppercase tracking-widest transition-colors ${
    isActive ? 'text-lime' : 'text-ink-dim hover:text-ink'
  }`

export default function Layout({ children }: LayoutProps) {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()

  return (
    <div className="flex min-h-screen flex-col">
      <nav className="border-b border-void-line/80">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <Link to="/" className="group flex items-center gap-2">
            <span className="h-2 w-2 bg-lime transition-transform group-hover:scale-125" />
            <span className="font-display text-xl italic text-ink">Scaffold</span>
          </Link>

          <div className="flex items-center gap-6">
            <NavLink to="/" end className={navLinkClass}>
              Home
            </NavLink>

            {/* demo:start — removed by `bun run init` */}
            <NavLink to="/demo" className={navLinkClass}>
              Routing Demo
            </NavLink>
            {/* demo:end */}

            {isAuthenticated ? (
              <NavLink to="/users" className={navLinkClass}>
                Users
              </NavLink>
            ) : null}

            {isAuthenticated ? (
              <NavLink to="/todos" className={navLinkClass}>
                Bucket List
              </NavLink>
            ) : null}

            {isAuthenticated ? (
              <>
                <span className="font-mono text-xs text-ink-dim">{user?.email}</span>
                <button
                  className="font-mono text-xs uppercase tracking-widest text-ink-dim transition-colors hover:text-flame"
                  onClick={() => {
                    dispatch(signout())
                    // Drop cached todos so the next user never sees this one's.
                    dispatch(todosApi.util.resetApiState())
                  }}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `border px-3 py-1.5 font-mono text-xs uppercase tracking-widest transition-colors ${
                    isActive
                      ? 'border-lime bg-lime text-accent-ink'
                      : 'border-void-line text-ink hover:border-lime hover:text-lime'
                  }`
                }
              >
                Sign In
              </NavLink>
            )}

            <ThemeToggle />
          </div>
        </div>
      </nav>

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">{children || <Outlet />}</main>
    </div>
  )
}
