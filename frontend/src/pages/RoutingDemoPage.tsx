import {
  NavLink,
  Outlet,
  useLocation,
  useParams,
  useNavigate,
  useSearchParams,
  Link,
} from 'react-router'
import { TOPICS } from './demoData'

const badgeClass = {
  primary: 'border-lime/40 bg-lime/10 text-lime',
  success: 'border-sky/40 bg-sky/10 text-sky',
  warning: 'border-flame/40 bg-flame/10 text-flame',
}

const badge = (variant: keyof typeof badgeClass, children: React.ReactNode) => (
  <span
    className={`inline-block border px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-widest ${badgeClass[variant]}`}
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

export function DemoOverview() {
  const navigate = useNavigate()

  return (
    <div>
      <div className="mb-10">
        <h3 className="font-display text-xl text-ink">Routing Features Covered</h3>
        <p className="mt-2 text-sm text-ink-dim">
          This page demonstrates key React Router concepts working in this Vite + React SPA.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className={cardTileClass}>
          {badge('primary', 'useParams')}
          <h4 className="font-display text-lg text-ink">Dynamic Route Matching</h4>
          <p className="flex-1 text-sm text-ink-dim">
            Extract parameters from URL paths like <code>/demo/topics/:topicId</code>.
          </p>
          <Link to="/demo/topics/oxlint" className={`${btnSecondary} mt-2 text-[0.8125rem]`}>
            View /demo/topics/oxlint →
          </Link>
        </div>

        <div className={cardTileClass}>
          {badge('success', 'useSearchParams')}
          <h4 className="font-display text-lg text-ink">Search / Query Parameters</h4>
          <p className="flex-1 text-sm text-ink-dim">
            Synchronize state with URL query parameters (e.g.{' '}
            <code>?category=Tooling&sort=asc</code>).
          </p>
          <Link
            to="/demo/query?category=Tooling&sort=asc"
            className={`${btnSecondary} mt-2 text-[0.8125rem]`}
          >
            Try Query Params →
          </Link>
        </div>

        <div className={cardTileClass}>
          {badge('warning', <>&lt;Outlet /&gt;</>)}
          <h4 className="font-display text-lg text-ink">Nested Route Layouts</h4>
          <p className="flex-1 text-sm text-ink-dim">
            Render sub-pages inside parent layouts without full page reloads.
          </p>
          <Link to="/demo/nested/metrics" className={`${btnSecondary} mt-2 text-[0.8125rem]`}>
            Explore Nested Tabs →
          </Link>
        </div>
      </div>

      <div className="mt-6 border border-void-line bg-void-raised p-6">
        <h4 className="mb-2 font-display text-lg text-ink">
          Programmatic Navigation (<code>useNavigate</code>)
        </h4>
        <p className="mb-4 text-sm text-ink-dim">
          Trigger routing transitions imperatively from event handlers:
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            className={btnPrimary}
            onClick={() => {
              const randomTopic = TOPICS[Math.floor(Math.random() * TOPICS.length)]
              navigate(`/demo/topics/${randomTopic.id}`)
            }}
          >
            🎲 Random Topic via navigate()
          </button>
          <button
            className={btnSecondary}
            onClick={() => navigate('/demo/query?sort=desc&view=grid')}
          >
            Apply Query Filters via navigate()
          </button>
        </div>
      </div>
    </div>
  )
}

export function TopicListDemo() {
  return (
    <div>
      <div className="mb-6">
        <h3 className="font-display text-xl text-ink">
          Dynamic Topics (<code>/demo/topics</code>)
        </h3>
        <p className="mt-2 text-sm text-ink-dim">
          Click any topic to navigate to its parameter route <code>/demo/topics/:topicId</code>:
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {TOPICS.map((topic) => (
          <NavLink
            key={topic.id}
            to={`/demo/topics/${topic.id}`}
            className={({ isActive }) =>
              `${cardTileClass} ${isActive ? 'border-lime bg-lime/5' : ''}`
            }
          >
            <div className="flex items-center justify-between">
              {badge('primary', topic.category)}
              <span className="font-mono text-xs text-sky">{topic.tag}</span>
            </div>
            <h4 className="font-display text-lg text-ink">{topic.title}</h4>
            <p className="text-sm text-ink-dim">{topic.summary}</p>
            <span className="mt-auto font-mono text-[0.8125rem] text-lime">
              Open Topic Details →
            </span>
          </NavLink>
        ))}
      </div>
    </div>
  )
}

export function TopicDetailDemo() {
  const { topicId } = useParams<{ topicId: string }>()
  const navigate = useNavigate()
  const topic = TOPICS.find((t) => t.id === topicId)

  if (!topic) {
    return (
      <div className="border border-void-line bg-void-raised p-10 text-center">
        <h3 className="mb-2 font-display text-xl text-flame">Topic Not Found</h3>
        <p className="mb-4 text-sm text-ink-dim">
          No topic matches parameter: <code>{topicId}</code>
        </p>
        <Link to="/demo/topics" className={btnSecondary}>
          ← Back to Topics
        </Link>
      </div>
    )
  }

  return (
    <div className="border border-void-line bg-void-raised p-6">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <div className="mb-2 flex gap-2">
            {badge('primary', topic.category)}
            {badge('success', topic.tag)}
          </div>
          <h2 className="font-display text-2xl text-ink">{topic.title}</h2>
        </div>
        <button className={btnGhost} onClick={() => navigate('/demo/topics')}>
          ✕ Close
        </button>
      </div>

      <div className="mb-6 border border-void-line bg-void p-4">
        <div className="mb-1 font-mono text-[0.8125rem] text-sky">
          Extracted Param from useParams():
        </div>
        <code className="text-[0.9375rem] text-ink">topicId = "{topicId}"</code>
      </div>

      <p className="mb-6 text-base leading-[1.7] text-ink">{topic.details}</p>

      <div className="flex flex-wrap gap-3">
        <Link to="/demo/topics" className={btnSecondary}>
          ← Back to Topics List
        </Link>
        <button
          className={btnGhost}
          onClick={() => {
            const nextIdx = (TOPICS.findIndex((t) => t.id === topicId) + 1) % TOPICS.length
            navigate(`/demo/topics/${TOPICS[nextIdx].id}`)
          }}
        >
          Next Topic →
        </button>
      </div>
    </div>
  )
}

export function QueryParamsDemo() {
  const [searchParams, setSearchParams] = useSearchParams()
  const categoryFilter = searchParams.get('category') || 'All'
  const sortBy = searchParams.get('sort') || 'asc'
  const viewMode = searchParams.get('view') || 'list'

  const categories = ['All', 'Tooling', 'Build', 'Language', 'Navigation']

  const filteredTopics = TOPICS.filter(
    (t) => categoryFilter === 'All' || t.category === categoryFilter,
  ).sort((a, b) => {
    if (sortBy === 'asc') return a.title.localeCompare(b.title)
    return b.title.localeCompare(a.title)
  })

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams)
    if (value === 'All' && key === 'category') {
      next.delete(key)
    } else {
      next.set(key, value)
    }
    setSearchParams(next)
  }

  const filterBtn = (active: boolean) =>
    `border px-3 py-1.5 font-mono text-[0.8125rem] uppercase tracking-widest transition-colors ${
      active
        ? 'border-lime bg-lime text-accent-ink'
        : 'border-void-line text-ink-dim hover:border-lime hover:text-lime'
    }`

  return (
    <div>
      <div className="mb-6">
        <h3 className="font-display text-xl text-ink">
          Search &amp; Query Parameters (<code>useSearchParams</code>)
        </h3>
        <p className="mt-2 text-sm text-ink-dim">
          Filter and sort topics using live URL query parameters. Notice the browser address bar
          update in real time:
        </p>
      </div>

      <div className="mb-6 border border-void-line bg-void-raised p-6">
        <div className="flex flex-wrap items-center gap-8">
          <div>
            <label className="mb-1.5 block font-mono text-xs uppercase tracking-widest text-ink-dim">
              Filter Category:
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={filterBtn(
                    categoryFilter === cat || (cat === 'All' && !searchParams.get('category')),
                  )}
                  onClick={() => updateParam('category', cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block font-mono text-xs uppercase tracking-widest text-ink-dim">
              Sort Direction:
            </label>
            <div className="flex gap-2">
              <button
                className={filterBtn(sortBy === 'asc')}
                onClick={() => updateParam('sort', 'asc')}
              >
                A → Z
              </button>
              <button
                className={filterBtn(sortBy === 'desc')}
                onClick={() => updateParam('sort', 'desc')}
              >
                Z → A
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block font-mono text-xs uppercase tracking-widest text-ink-dim">
              View Style:
            </label>
            <div className="flex gap-2">
              <button
                className={filterBtn(viewMode === 'list')}
                onClick={() => updateParam('view', 'list')}
              >
                List
              </button>
              <button
                className={filterBtn(viewMode === 'grid')}
                onClick={() => updateParam('view', 'grid')}
              >
                Grid
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className={
          viewMode === 'grid' ? 'grid grid-cols-1 gap-4 md:grid-cols-3' : 'flex flex-col gap-3'
        }
      >
        {filteredTopics.map((topic) => (
          <div key={topic.id} className="border border-void-line bg-void-raised p-4">
            <div className="mb-1 flex items-center justify-between">
              <h4 className="font-display text-base text-ink">{topic.title}</h4>
              {badge('primary', topic.category)}
            </div>
            <p className="text-sm text-ink-dim">{topic.summary}</p>
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

export function NestedRoutesDemo() {
  return (
    <div>
      <div className="mb-6">
        <h3 className="font-display text-xl text-ink">
          Nested Routes &amp; Layouts (<code>&lt;Outlet /&gt;</code>)
        </h3>
        <p className="mt-2 text-sm text-ink-dim">
          Sub-routes render child components inside the parent layout below without unmounting the
          parent:
        </p>
      </div>

      <div className="flex border-b border-void-line">
        <NavLink to="/demo/nested/metrics" className={tabBtnClass}>
          📊 Performance Metrics
        </NavLink>
        <NavLink to="/demo/nested/settings" className={tabBtnClass}>
          ⚙️ Router Settings
        </NavLink>
        <NavLink to="/demo/nested/logs" className={tabBtnClass}>
          📜 Navigation Logs
        </NavLink>
      </div>

      <div className="border border-t-0 border-void-line bg-void-raised p-6">
        <Outlet />
      </div>
    </div>
  )
}

export function NestedMetrics() {
  const metrics = [
    { label: 'Vite Build Speed', value: '154ms', color: 'text-lime' },
    { label: 'Oxlint Lint Speed', value: '17ms', color: 'text-sky' },
    { label: 'Route Transition', value: '< 1ms', color: 'text-flame' },
  ]

  return (
    <div>
      <h4 className="mb-2 font-display text-lg text-ink">Nested View: Performance Metrics</h4>
      <p className="mb-4 text-sm text-ink-dim">
        Active child route: <code>/demo/nested/metrics</code>
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {metrics.map((metric) => (
          <div key={metric.label} className="border border-void-line bg-void p-4">
            <div className="font-mono text-[0.8125rem] text-ink-dim">{metric.label}</div>
            <div className={`font-display text-2xl font-semibold ${metric.color}`}>
              {metric.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function NestedSettings() {
  const rows: [string, React.ReactNode][] = [
    ['Mode', badge('primary', 'Declarative SPA (BrowserRouter)')],
    ['Version', badge('success', 'React Router v7 / v8')],
    ['TypeScript Support', badge('warning', 'v7.0.2 Strict')],
  ]

  return (
    <div>
      <h4 className="mb-2 font-display text-lg text-ink">Nested View: Router Settings</h4>
      <p className="mb-4 text-sm text-ink-dim">
        Active child route: <code>/demo/nested/settings</code>
      </p>
      <div className="flex flex-col">
        {rows.map(([label, value]) => (
          <div
            key={label}
            className="flex items-center justify-between border-b border-void-line py-3 last:border-0"
          >
            <span className="text-sm text-ink">{label}</span>
            {value}
          </div>
        ))}
      </div>
    </div>
  )
}

export function NestedLogs() {
  const location = useLocation()
  return (
    <div>
      <h4 className="mb-2 font-display text-lg text-ink">Nested View: Navigation Logs</h4>
      <p className="mb-4 text-sm text-ink-dim">
        Active child route: <code>/demo/nested/logs</code>
      </p>
      <div className="border border-void-line bg-void p-4 font-mono text-[0.8125rem] text-ink-dim">
        <div>[ROUTER EVENT] Matched layout: &lt;RoutingDemoPage /&gt;</div>
        <div>[ROUTER EVENT] Matched child: &lt;NestedLogs /&gt;</div>
        <div>[ROUTER EVENT] Current key: {location.key}</div>
        <div>[ROUTER EVENT] Status: Ready</div>
      </div>
    </div>
  )
}

export default function RoutingDemoPage() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <div className="animate-rise">
      {/* Header Banner */}
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl italic text-ink">React Router Demo</h1>
          <p className="mt-2 text-sm text-ink-dim">
            Explore live route matching, dynamic params, query strings, and nested layouts.
          </p>
        </div>

        <div className="flex gap-3">
          <button className={`${btnSecondary} text-[0.8125rem]`} onClick={() => navigate(-1)}>
            ← Back
          </button>
          <button className={`${btnSecondary} text-[0.8125rem]`} onClick={() => navigate(1)}>
            Forward →
          </button>
          <button className={`${btnGhost} text-[0.8125rem]`} onClick={() => navigate('/')}>
            🏠 Home
          </button>
        </div>
      </div>

      {/* Live Route Inspector */}
      <div className="mb-8 border border-void-line bg-void-raised p-4 font-mono text-[0.8125rem]">
        <div className="mb-2 font-semibold text-ink-dim">
          🔍 Live Route Inspector (useLocation)
        </div>
        <div className="flex gap-2">
          <span className="text-ink-dim">location.pathname:</span>
          <span className="text-lime">{location.pathname}</span>
        </div>
        <div className="flex gap-2">
          <span className="text-ink-dim">location.search:</span>
          <span className="text-lime">{location.search || '(none)'}</span>
        </div>
        <div className="flex gap-2">
          <span className="text-ink-dim">location.key:</span>
          <span className="text-lime">{location.key}</span>
        </div>
      </div>

      {/* Top Demo Navigation Tabs */}
      <div className="mb-6 flex flex-wrap border-b border-void-line">
        <NavLink to="/demo" end className={tabBtnClass}>
          📖 Overview
        </NavLink>
        <NavLink to="/demo/topics" className={tabBtnClass}>
          🏷️ Dynamic Params (:topicId)
        </NavLink>
        <NavLink to="/demo/query" className={tabBtnClass}>
          🔎 Query Params (?search=)
        </NavLink>
        <NavLink to="/demo/nested/metrics" className={tabBtnClass}>
          🗂️ Nested Routes (&lt;Outlet /&gt;)
        </NavLink>
      </div>

      {/* Child Routes Outlet */}
      <Outlet />
    </div>
  )
}
