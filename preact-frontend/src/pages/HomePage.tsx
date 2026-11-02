import { isAuthenticated, user } from '@/store/auth'

const badgeClass = {
  primary: 'border-lime/40 bg-lime/10 text-lime',
  success: 'border-sky/40 bg-sky/10 text-sky',
  warning: 'border-flame/40 bg-flame/10 text-flame',
}

export default function HomePage() {
  return (
    <div class="animate-rise">
      <div class="mb-16 max-w-2xl">
        <h1 class="font-display text-5xl leading-[1.05] text-ink">
          Vite + Preact
          <span class="italic text-lime"> + Oxlint</span>
        </h1>
        <p class="mt-5 max-w-xl font-mono text-sm leading-relaxed text-ink-dim">
          Upgraded to Vite v8, TypeScript v7, and Preact 10 with Oxlint speed.
        </p>
      </div>

      <div class="grid grid-cols-1 gap-px bg-void-line md:grid-cols-3">
        {/* demo:start — removed by `bun run init` */}
        <div class="flex flex-col bg-void p-6">
          <span
            class={`mb-3 inline-block w-fit border px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-widest ${badgeClass.primary}`}
          >
            Routing
          </span>
          <h3 class="mb-2 font-display text-xl text-ink">Interactive Demo</h3>
          <p class="mb-6 flex-1 text-sm leading-relaxed text-ink-dim">
            Explore dynamic URL parameters, query search params, nested layouts with Outlets, and
            programmatic navigation.
          </p>
          <a
            href="/demo"
            class="w-fit border border-lime bg-lime px-4 py-2 font-mono text-xs font-semibold uppercase tracking-widest text-accent-ink transition-colors hover:bg-transparent hover:text-lime"
          >
            Launch Routing Demo →
          </a>
        </div>
        {/* demo:end */}

        <div class="flex flex-col bg-void p-6">
          <span
            class={`mb-3 inline-block w-fit border px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-widest ${badgeClass.success}`}
          >
            Architecture
          </span>
          <h3 class="mb-2 font-display text-xl text-ink">Authentication &amp; State</h3>
          <p class="mb-6 flex-1 text-sm leading-relaxed text-ink-dim">
            {isAuthenticated.value
              ? `Signed in as ${user.value?.email || 'User'}. Access protected user management and data.`
              : 'Secure JWT authentication with Preact Signals, TanStack Query and protected routes.'}
          </p>
          {isAuthenticated.value ? (
            <a
              href="/users"
              class="w-fit border border-void-line px-4 py-2 font-mono text-xs font-semibold uppercase tracking-widest text-ink transition-colors hover:border-lime hover:text-lime"
            >
              View Users List →
            </a>
          ) : (
            <a
              href="/login"
              class="w-fit border border-void-line px-4 py-2 font-mono text-xs font-semibold uppercase tracking-widest text-ink transition-colors hover:border-lime hover:text-lime"
            >
              Sign In / Sign Up →
            </a>
          )}
        </div>

        <div class="flex flex-col bg-void p-6">
          <span
            class={`mb-3 inline-block w-fit border px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-widest ${badgeClass.warning}`}
          >
            Tooling
          </span>
          <h3 class="mb-2 font-display text-xl text-ink">Cutting-Edge Stack</h3>
          <p class="mb-6 flex-1 text-sm leading-relaxed text-ink-dim">
            Equipped with Oxlint for lightning-fast linting, Vite v8 rolldown engine, and
            TypeScript v7 strict typing.
          </p>
          <div class="flex flex-wrap gap-2">
            {['TypeScript 7', 'Vite 8', 'Oxlint', 'Preact 10'].map((tag) => (
              <span
                key={tag}
                class={`border px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-widest ${badgeClass.primary}`}
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
