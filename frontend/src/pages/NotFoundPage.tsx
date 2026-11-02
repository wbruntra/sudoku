import { Link } from 'react-router'

export default function NotFoundPage() {
  return (
    <div className="animate-rise py-16 text-center">
      <h1 className="font-display text-8xl italic text-lime">404</h1>
      <h2 className="mt-4 font-display text-2xl text-ink">Page Not Found</h2>
      <p className="mx-auto mt-4 mb-10 max-w-md text-sm leading-relaxed text-ink-dim">
        The route you requested doesn't exist or has moved. Use the buttons below to navigate back.
      </p>
      <div className="flex justify-center gap-3">
        <Link
          to="/"
          className="border border-lime bg-lime px-4 py-2 font-mono text-xs font-semibold uppercase tracking-widest text-accent-ink transition-colors hover:bg-transparent hover:text-lime"
        >
          Back to Home
        </Link>
        {/* demo:start — removed by `bun run init` */}
        <Link
          to="/demo"
          className="border border-void-line px-4 py-2 font-mono text-xs font-semibold uppercase tracking-widest text-ink transition-colors hover:border-lime hover:text-lime"
        >
          Go to Demo
        </Link>
        {/* demo:end */}
      </div>
    </div>
  )
}
