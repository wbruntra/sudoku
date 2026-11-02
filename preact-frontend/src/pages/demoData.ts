export interface Topic {
  id: string
  title: string
  category: string
  tag: string
  summary: string
  details: string
}

export const TOPICS: Topic[] = [
  {
    id: 'oxlint',
    title: 'Oxlint Fast Linter',
    category: 'Tooling',
    tag: '50-100x Faster',
    summary:
      'A high-performance JavaScript/TypeScript linter written in Rust, designed to catch bad code with zero setup.',
    details:
      'Oxlint runs in milliseconds compared to traditional linters. It inspects ASTs efficiently, runs in parallel across worker threads, and integrates directly with Vite build pipelines.',
  },
  {
    id: 'vite-8',
    title: 'Vite v8 Bundler',
    category: 'Build',
    tag: 'Rolldown Core',
    summary:
      'Next generation frontend tooling with instant server start, lightning fast HMR, and unified bundling.',
    details:
      'Vite 8 brings deeper optimizations, native ES module support, streamlined config loading with import.meta.dirname, and first-class React 19 support.',
  },
  {
    id: 'typescript-7',
    title: 'TypeScript v7',
    category: 'Language',
    tag: 'Strict Typing',
    summary:
      'The latest major TypeScript compiler release featuring faster type checking and cleaner module resolution.',
    details:
      'TypeScript 7 removes legacy configuration options like baseUrl in favor of standardized path mappings, and enables strict type checking across modern ECMAScript targets.',
  },
  {
    id: 'react-router',
    title: 'React Router',
    category: 'Navigation',
    tag: 'Declarative SPA',
    summary: 'Universal client-side and full-stack routing library for React applications.',
    details:
      'Features declarative route matching, nested layouts via Outlet, type-safe hooks (useParams, useSearchParams, useNavigate), and automatic active link styling with NavLink.',
  },
]
