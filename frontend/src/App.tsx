import { useEffect } from 'react'
import { Routes, Route } from 'react-router'
import { useAppDispatch } from '@/store/hooks'
import { initializeAuth } from '@/features/auth/authSlice'
import Layout from '@/components/Layout'
import ProtectedRoute from '@/components/ProtectedRoute'
import HomePage from '@/pages/HomePage'
import AuthPage from '@/pages/AuthPage'
import UsersPage from '@/pages/UsersPage'
import TodosPage from '@/pages/TodosPage'
import NotFoundPage from '@/pages/NotFoundPage'
// demo:start — removed by `bun run init`
import RoutingDemoPage, {
  DemoOverview,
  TopicListDemo,
  TopicDetailDemo,
  QueryParamsDemo,
  NestedRoutesDemo,
  NestedMetrics,
  NestedSettings,
  NestedLogs,
} from '@/pages/RoutingDemoPage'
// demo:end

export default function App() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(initializeAuth())
  }, [dispatch])

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public Routes */}
        <Route index element={<HomePage />} />
        <Route path="login" element={<AuthPage />} />

        {/* Protected Routes */}
        <Route
          path="users"
          element={
            <ProtectedRoute>
              <UsersPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="todos"
          element={
            <ProtectedRoute>
              <TodosPage />
            </ProtectedRoute>
          }
        />

        {/* demo:start — removed by `bun run init` */}
        <Route path="demo" element={<RoutingDemoPage />}>
          <Route index element={<DemoOverview />} />
          <Route path="topics" element={<TopicListDemo />} />
          <Route path="topics/:topicId" element={<TopicDetailDemo />} />
          <Route path="query" element={<QueryParamsDemo />} />
          <Route path="nested" element={<NestedRoutesDemo />}>
            <Route index element={<NestedMetrics />} />
            <Route path="metrics" element={<NestedMetrics />} />
            <Route path="settings" element={<NestedSettings />} />
            <Route path="logs" element={<NestedLogs />} />
          </Route>
        </Route>
        {/* demo:end */}

        {/* 404 Catch-All Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
