<<<<<<< HEAD
/**
 * components/ProtectedRoute.jsx
 * ──────────────────────────────────────────────────────────────────────────────
 * Wraps any page that requires authentication.
 * Backend team: uncomment the AuthProvider in main.jsx and replace the mock
 * loginUser in AuthContext.jsx with real API calls, then wire this up in App.jsx.
 * ──────────────────────────────────────────────────────────────────────────────
 */
import { Navigate } from 'react-router-dom'
// import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  // TODO (backend team): uncomment once AuthContext is wired
  // const { user, loading } = useAuth()
  // if (loading) return <div style={{ display: 'grid', placeItems: 'center', height: '100vh' }}>Loading…</div>
  // if (!user) return <Navigate to="/login" replace />

  const token = localStorage.getItem('access_token')
  if (!token) return <Navigate to="/login" replace />
=======
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Wraps any route that requires a logged-in user.
// Pass `roles={['student']}` to restrict to one or more specific roles.
export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', height: '100vh' }}>
        Loading…
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/login" replace />
  }
>>>>>>> d28bd3b538eb5eb7f22a9b7749abab309e37038e

  return children
}
