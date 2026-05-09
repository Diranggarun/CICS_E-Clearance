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

  return children
}
