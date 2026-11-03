import type { ComponentChildren } from 'preact'
import { isAuthenticated, signout, user } from '@/store/auth'
import NavLink from '@/components/NavLink'
import ThemeToggle from '@/components/ThemeToggle'

interface LayoutProps {
  children?: ComponentChildren
}

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `font-mono text-xs uppercase tracking-widest transition-colors max-sm:hidden ${
    isActive ? 'text-lime' : 'text-ink-dim hover:text-ink'
  }`

export default function Layout({ children }: LayoutProps) {
  return (
    <div class="flex min-h-screen flex-col">
      <nav class="border-b border-void-line/80">
        <div class="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-3 sm:px-6 sm:py-5">
          <a href="/" class="group flex items-center gap-2">
            <span class="h-2 w-2 bg-lime transition-transform group-hover:scale-125" />
            <span class="font-display text-xl italic text-ink">Sudoku</span>
          </a>

          <div class="flex flex-wrap items-center gap-x-4 gap-y-2 sm:gap-x-6">
            <NavLink href="/" end class={navLinkClass}>
              Play
            </NavLink>

            {/* demo:start — removed by `bun run init` */}
            <NavLink href="/demo" class={navLinkClass}>
              Routing Demo
            </NavLink>
            {/* demo:end */}

            {isAuthenticated.value ? (
              <NavLink href="/users" class={navLinkClass}>
                Users
              </NavLink>
            ) : null}

            {isAuthenticated.value ? (
              <NavLink href="/todos" class={navLinkClass}>
                Bucket List
              </NavLink>
            ) : null}

            {isAuthenticated.value ? (
              <>
                <span class="font-mono text-xs text-ink-dim max-sm:hidden">
                  {user.value?.email}
                </span>
                <button
                  class="font-mono text-xs uppercase tracking-widest text-ink-dim transition-colors hover:text-flame"
                  onClick={signout}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <NavLink
                href="/login"
                class={({ isActive }) =>
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

      <main class="mx-auto w-full max-w-5xl flex-1 px-4 py-4 sm:px-6 sm:py-12">{children}</main>
    </div>
  )
}
