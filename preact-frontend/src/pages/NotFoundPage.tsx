export default function NotFoundPage() {
  return (
    <div class="animate-rise py-16 text-center">
      <h1 class="font-display text-8xl italic text-lime">404</h1>
      <h2 class="mt-4 font-display text-2xl text-ink">Page Not Found</h2>
      <p class="mx-auto mt-4 mb-10 max-w-md text-sm leading-relaxed text-ink-dim">
        The route you requested doesn't exist or has moved. Use the buttons below to navigate back.
      </p>
      <div class="flex justify-center gap-3">
        <a
          href="/"
          class="border border-lime bg-lime px-4 py-2 font-mono text-xs font-semibold uppercase tracking-widest text-accent-ink transition-colors hover:bg-transparent hover:text-lime"
        >
          Back to Home
        </a>
      </div>
    </div>
  )
}
