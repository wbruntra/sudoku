import type { ComponentChildren } from 'preact'
import { Route, Router, useLocation, useRoute } from 'preact-iso'
import NavLink from '@/components/NavLink'
import { TOPICS } from './demoData'

const badgeClass = {
  primary: 'border-lime/40 bg-lime/10 text-lime',
  success: 'border-sky/40 bg-sky/10 text-sky',
  warning: 'border-flame/40 bg-flame/10 text-flame',
}

const badge = (variant: keyof typeof badgeClass, children: ComponentChildren) => (
  <span
    class={`inline-block border px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-widest ${badgeClass[variant]}`}
  >
    {children}
  </span>
)

const cardTileClass =
  'flex flex-col gap-2 border border-void-line bg-void-raised p-5 transition-colors hover:border-lime/50'

const btnPrimary =
  'inline-flex w-fit items-center justify-center border border-lime bg-lime px-4 py-2 font-mono text-xs font-semibold uppercase tracking-widest text-accent-ink transition-colors hover:bg-transparent hover:text-lime'
const btnSecondary =
  'inline-flex w-fit items-center justify-center border border-void-line px-4 py-2 font-mono text-xs font-semibold uppercase tracking-widest text-ink transition-colors hover:border-lime hover:text-lime'
const btnGhost =
  'inline-flex w-fit items-center justify-center font-mono text-xs font-semibold uppercase tracking-widest text-ink-dim transition-colors hover:text-lime'

function DemoOverview() {
  const { route } = useLocation()

  return (
    <div>
      <div class="mb-10">
        <h3 class="font-display text-xl text-ink">Routing Features Covered</h3>
        <p class="mt-2 text-sm text-ink-dim">
          This page demonstrates key preact-iso concepts working in this Vite + Preact SPA.
        </p>
      </div>

      <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div class={cardTileClass}>
          {badge('primary', 'useRoute')}
          <h4 class="font-display text-lg text-ink">Dynamic Route Matching</h4>
          <p class="flex-1 text-sm text-ink-dim">
            Extract parameters from URL paths like <code>/demo/topics/:topicId</code>.
          </p>
          <a href="/demo/topics/oxlint" class={`${btnSecondary} mt-2 text-[0.8125rem]`}>
            View /demo/topics/oxlint →
          </a>
        </div>

        <div class={cardTileClass}>
          {badge('success', 'useLocation().query')}
          <h4 class="font-display text-lg text-ink">Search / Query Parameters</h4>
          <p class="flex-1 text-sm text-ink-dim">
            Synchronize state with URL query parameters (e.g.{' '}
            <code>?category=Tooling&sort=asc</code>).
          </p>
          <a
            href="/demo/query?category=Tooling&sort=asc"
            class={`${btnSecondary} mt-2 text-[0.8125rem]`}
          >
            Try Query Params →
          </a>
        </div>

        <div class={cardTileClass}>
          {badge('warning', <>&lt;Router /&gt;</>)}
          <h4 class="font-display text-lg text-ink">Nested Route Layouts</h4>
          <p class="flex-1 text-sm text-ink-dim">
            Render sub-pages inside parent layouts without full page reloads.
          </p>
          <a href="/demo/nested/metrics" class={`${btnSecondary} mt-2 text-[0.8125rem]`}>
            Explore Nested Tabs →
          </a>
        </div>
      </div>

      <div class="mt-6 border border-void-line bg-void-raised p-6">
        <h4 class="mb-2 font-display text-lg text-ink">
          Programmatic Navigation (<code>useLocation().route</code>)
        </h4>
        <p class="mb-4 text-sm text-ink-dim">
          Trigger routing transitions imperatively from event handlers:
        </p>
        <div class="flex flex-wrap gap-3">
          <button
            class={btnPrimary}
            onClick={() => {
              const randomTopic = TOPICS[Math.floor(Math.random() * TOPICS.length)]
              route(`/demo/topics/${randomTopic.id}`)
            }}
          >
            🎲 Random Topic via route()
          </button>
          <button class={btnSecondary} onClick={() => route('/demo/query?sort=desc&view=grid')}>
            Apply Query Filters via route()
          </button>
        </div>
      </div>
    </div>
  )
}

function TopicListDemo() {
  return (
    <div>
      <div class="mb-6">
        <h3 class="font-display text-xl text-ink">
          Dynamic Topics (<code>/demo/topics</code>)
        </h3>
        <p class="mt-2 text-sm text-ink-dim">
          Click any topic to navigate to its parameter route <code>/demo/topics/:topicId</code>:
        </p>
      </div>

      <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
        {TOPICS.map((topic) => (
          <NavLink
            key={topic.id}
            href={`/demo/topics/${topic.id}`}
            class={({ isActive }) => `${cardTileClass} ${isActive ? 'border-lime bg-lime/5' : ''}`}
          >
            <div class="flex items-center justify-between">
              {badge('primary', topic.category)}
              <span class="font-mono text-xs text-sky">{topic.tag}</span>
            </div>
            <h4 class="font-display text-lg text-ink">{topic.title}</h4>
            <p class="text-sm text-ink-dim">{topic.summary}</p>
            <span class="mt-auto font-mono text-[0.8125rem] text-lime">Open Topic Details →</span>
          </NavLink>
        ))}
      </div>
    </div>
  )
}

function TopicDetailDemo() {
  const { params } = useRoute()
  const { route } = useLocation()
  const topicId = params.topicId
  const topic = TOPICS.find((t) => t.id === topicId)

  if (!topic) {
    return (
      <div class="border border-void-line bg-void-raised p-10 text-center">
        <h3 class="mb-2 font-display text-xl text-flame">Topic Not Found</h3>
        <p class="mb-4 text-sm text-ink-dim">
          No topic matches parameter: <code>{topicId}</code>
        </p>
        <a href="/demo/topics" class={btnSecondary}>
          ← Back to Topics
        </a>
      </div>
    )
  }

  return (
    <div class="border border-void-line bg-void-raised p-6">
      <div class="mb-4 flex items-start justify-between">
        <div>
          <div class="mb-2 flex gap-2">
            {badge('primary', topic.category)}
            {badge('success', topic.tag)}
          </div>
          <h2 class="font-display text-2xl text-ink">{topic.title}</h2>
        </div>
        <button class={btnGhost} onClick={() => route('/demo/topics')}>
          ✕ Close
        </button>
      </div>

      <div class="mb-6 border border-void-line bg-void p-4">
        <div class="mb-1 font-mono text-[0.8125rem] text-sky">
          Extracted Param from useRoute():
        </div>
        <code class="text-[0.9375rem] text-ink">topicId = "{topicId}"</code>
      </div>

      <p class="mb-6 text-base leading-[1.7] text-ink">{topic.details}</p>

      <div class="flex flex-wrap gap-3">
        <a href="/demo/topics" class={btnSecondary}>
          ← Back to Topics List
        </a>
        <button
          class={btnGhost}
          onClick={() => {
            const nextIdx = (TOPICS.findIndex((t) => t.id === topicId) + 1) % TOPICS.length
            route(`/demo/topics/${TOPICS[nextIdx].id}`)
          }}
        >
          Next Topic →
        </button>
      </div>
    </div>
  )
}

function QueryParamsDemo() {
  const { path, query, route } = useLocation()
  const categoryFilter = query.category || 'All'
  const sortBy = query.sort || 'asc'
  const viewMode = query.view || 'list'

  const categories = ['All', 'Tooling', 'Build', 'Language', 'Navigation']

  const filteredTopics = TOPICS.filter(
    (t) => categoryFilter === 'All' || t.category === categoryFilter,
  ).sort((a, b) => {
    if (sortBy === 'asc') return a.title.localeCompare(b.title)
    return b.title.localeCompare(a.title)
  })

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(query)
    if (value === 'All' && key === 'category') {
      next.delete(key)
    } else {
      next.set(key, value)
    }
    route(`${path}?${next}`, true)
  }

  const filterBtn = (active: boolean) =>
    `border px-3 py-1.5 font-mono text-[0.8125rem] uppercase tracking-widest transition-colors ${
      active
        ? 'border-lime bg-lime text-accent-ink'
        : 'border-void-line text-ink-dim hover:border-lime hover:text-lime'
    }`

  return (
    <div>
      <div class="mb-6">
        <h3 class="font-display text-xl text-ink">
          Search &amp; Query Parameters (<code>useLocation().query</code>)
        </h3>
        <p class="mt-2 text-sm text-ink-dim">
          Filter and sort topics using live URL query parameters. Notice the browser address bar
          update in real time:
        </p>
      </div>

      <div class="mb-6 border border-void-line bg-void-raised p-6">
        <div class="flex flex-wrap items-center gap-8">
          <div>
            <label class="mb-1.5 block font-mono text-xs uppercase tracking-widest text-ink-dim">
              Filter Category:
            </label>
            <div class="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  class={filterBtn(categoryFilter === cat)}
                  onClick={() => updateParam('category', cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label class="mb-1.5 block font-mono text-xs uppercase tracking-widest text-ink-dim">
              Sort Direction:
            </label>
            <div class="flex gap-2">
              <button
                class={filterBtn(sortBy === 'asc')}
                onClick={() => updateParam('sort', 'asc')}
              >
                A → Z
              </button>
              <button
                class={filterBtn(sortBy === 'desc')}
                onClick={() => updateParam('sort', 'desc')}
              >
                Z → A
              </button>
            </div>
          </div>

          <div>
            <label class="mb-1.5 block font-mono text-xs uppercase tracking-widest text-ink-dim">
              View Style:
            </label>
            <div class="flex gap-2">
              <button
                class={filterBtn(viewMode === 'list')}
                onClick={() => updateParam('view', 'list')}
              >
                List
              </button>
              <button
                class={filterBtn(viewMode === 'grid')}
                onClick={() => updateParam('view', 'grid')}
              >
                Grid
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        class={
          viewMode === 'grid' ? 'grid grid-cols-1 gap-4 md:grid-cols-3' : 'flex flex-col gap-3'
        }
      >
        {filteredTopics.map((topic) => (
          <div key={topic.id} class="border border-void-line bg-void-raised p-4">
            <div class="mb-1 flex items-center justify-between">
              <h4 class="font-display text-base text-ink">{topic.title}</h4>
              {badge('primary', topic.category)}
            </div>
            <p class="text-sm text-ink-dim">{topic.summary}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

const tabBtnClass = ({ isActive }: { isActive: boolean }) =>
  `border-b-2 px-4 py-2.5 font-mono text-xs uppercase tracking-widest transition-colors ${
    isActive ? 'border-lime text-lime' : 'border-transparent text-ink-dim hover:text-ink'
  }`

function NestedRoutesDemo() {
  return (
    <div>
      <div class="mb-6">
        <h3 class="font-display text-xl text-ink">
          Nested Routes &amp; Layouts (<code>&lt;Router /&gt;</code>)
        </h3>
        <p class="mt-2 text-sm text-ink-dim">
          Sub-routes render child components inside the parent layout below without unmounting the
          parent:
        </p>
      </div>

      <div class="flex border-b border-void-line">
        <NavLink href="/demo/nested/metrics" class={tabBtnClass}>
          📊 Performance Metrics
        </NavLink>
        <NavLink href="/demo/nested/settings" class={tabBtnClass}>
          ⚙️ Router Settings
        </NavLink>
        <NavLink href="/demo/nested/logs" class={tabBtnClass}>
          📜 Navigation Logs
        </NavLink>
      </div>

      <div class="border border-t-0 border-void-line bg-void-raised p-6">
        <Router>
          <Route path="/metrics" component={NestedMetrics} />
          <Route path="/settings" component={NestedSettings} />
          <Route path="/logs" component={NestedLogs} />
        </Router>
      </div>
    </div>
  )
}

function NestedMetrics() {
  const metrics = [
    { label: 'Vite Build Speed', value: '154ms', color: 'text-lime' },
    { label: 'Oxlint Lint Speed', value: '17ms', color: 'text-sky' },
    { label: 'Route Transition', value: '< 1ms', color: 'text-flame' },
  ]

  return (
    <div>
      <h4 class="mb-2 font-display text-lg text-ink">Nested View: Performance Metrics</h4>
      <p class="mb-4 text-sm text-ink-dim">
        Active child route: <code>/demo/nested/metrics</code>
      </p>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {metrics.map((metric) => (
          <div key={metric.label} class="border border-void-line bg-void p-4">
            <div class="font-mono text-[0.8125rem] text-ink-dim">{metric.label}</div>
            <div class={`font-display text-2xl font-semibold ${metric.color}`}>{metric.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function NestedSettings() {
  const rows: [string, ComponentChildren][] = [
    ['Mode', badge('primary', 'SPA (LocationProvider + Router)')],
    ['Version', badge('success', 'preact-iso v2')],
    ['TypeScript Support', badge('warning', 'v7.0.2 Strict')],
  ]

  return (
    <div>
      <h4 class="mb-2 font-display text-lg text-ink">Nested View: Router Settings</h4>
      <p class="mb-4 text-sm text-ink-dim">
        Active child route: <code>/demo/nested/settings</code>
      </p>
      <div class="flex flex-col">
        {rows.map(([label, value]) => (
          <div
            key={label}
            class="flex items-center justify-between border-b border-void-line py-3 last:border-0"
          >
            <span class="text-sm text-ink">{label}</span>
            {value}
          </div>
        ))}
      </div>
    </div>
  )
}

function NestedLogs() {
  const location = useLocation()
  return (
    <div>
      <h4 class="mb-2 font-display text-lg text-ink">Nested View: Navigation Logs</h4>
      <p class="mb-4 text-sm text-ink-dim">
        Active child route: <code>/demo/nested/logs</code>
      </p>
      <div class="border border-void-line bg-void p-4 font-mono text-[0.8125rem] text-ink-dim">
        <div>[ROUTER EVENT] Matched layout: &lt;RoutingDemoPage /&gt;</div>
        <div>[ROUTER EVENT] Matched child: &lt;NestedLogs /&gt;</div>
        <div>[ROUTER EVENT] Current url: {location.url}</div>
        <div>[ROUTER EVENT] Status: Ready</div>
      </div>
    </div>
  )
}

export default function RoutingDemoPage() {
  const location = useLocation()

  return (
    <div class="animate-rise">
      {/* Header Banner */}
      <div class="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 class="font-display text-4xl italic text-ink">Preact Router Demo</h1>
          <p class="mt-2 text-sm text-ink-dim">
            Explore live route matching, dynamic params, query strings, and nested layouts.
          </p>
        </div>

        <div class="flex gap-3">
          <button class={`${btnSecondary} text-[0.8125rem]`} onClick={() => history.back()}>
            ← Back
          </button>
          <button class={`${btnSecondary} text-[0.8125rem]`} onClick={() => history.forward()}>
            Forward →
          </button>
          <button class={`${btnGhost} text-[0.8125rem]`} onClick={() => location.route('/')}>
            🏠 Home
          </button>
        </div>
      </div>

      {/* Live Route Inspector */}
      <div class="mb-8 border border-void-line bg-void-raised p-4 font-mono text-[0.8125rem]">
        <div class="mb-2 font-semibold text-ink-dim">🔍 Live Route Inspector (useLocation)</div>
        <div class="flex gap-2">
          <span class="text-ink-dim">location.path:</span>
          <span class="text-lime">{location.path}</span>
        </div>
        <div class="flex gap-2">
          <span class="text-ink-dim">location.query:</span>
          <span class="text-lime">{JSON.stringify(location.query)}</span>
        </div>
        <div class="flex gap-2">
          <span class="text-ink-dim">location.url:</span>
          <span class="text-lime">{location.url}</span>
        </div>
      </div>

      {/* Top Demo Navigation Tabs */}
      <div class="mb-6 flex flex-wrap border-b border-void-line">
        <NavLink href="/demo" end class={tabBtnClass}>
          📖 Overview
        </NavLink>
        <NavLink href="/demo/topics" class={tabBtnClass}>
          🏷️ Dynamic Params (:topicId)
        </NavLink>
        <NavLink href="/demo/query" class={tabBtnClass}>
          🔎 Query Params (?search=)
        </NavLink>
        <NavLink href="/demo/nested/metrics" class={tabBtnClass}>
          🗂️ Nested Routes (&lt;Router /&gt;)
        </NavLink>
      </div>

      {/* Child routes */}
      <Router>
        <Route path="/" component={DemoOverview} />
        <Route path="/topics" component={TopicListDemo} />
        <Route path="/topics/:topicId" component={TopicDetailDemo} />
        <Route path="/query" component={QueryParamsDemo} />
        <Route path="/nested/*" component={NestedRoutesDemo} />
      </Router>
    </div>
  )
}
