import { ErrorBoundary, Route, Router } from 'preact-iso'
import Layout from '@/components/Layout'
import ProtectedRoute from '@/components/ProtectedRoute'
import SudokuPage from '@/pages/SudokuPage'
import AuthPage from '@/pages/AuthPage'
import UsersPage from '@/pages/UsersPage'
import TodosPage from '@/pages/TodosPage'
import NotFoundPage from '@/pages/NotFoundPage'

export default function App() {
  return (
    <Layout>
      <ErrorBoundary>
        <Router>
          {/* Public Routes */}
          <Route path="/" component={SudokuPage} />
          <Route path="/login" component={AuthPage} />

          {/* Protected Routes */}
          <ProtectedRoute path="/users" component={UsersPage} />
          <ProtectedRoute path="/todos" component={TodosPage} />

          {/* 404 Catch-All Route */}
          <Route default component={NotFoundPage} />
        </Router>
      </ErrorBoundary>
    </Layout>
  )
}
