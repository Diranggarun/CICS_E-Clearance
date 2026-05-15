/**
 * context/AuthContext.jsx
 * ──────────────────────────────────────────────────────────────────────────────
 * Global auth state. Backend team: once real API is wired, replace the mock
 * logic in loginUser/registerUser with actual API calls from src/api/auth.js.
 * ──────────────────────────────────────────────────────────────────────────────
 */
import { createContext, useContext, useState, useEffect } from 'react'
import { login as loginApi, getMe } from '../api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // On mount, try to restore session
  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token) {
      getMe()
        .then((res) => setUser(res.data))
        .catch(() => localStorage.removeItem('access_token'))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const loginUser = async (email, password) => {
    // TODO (backend): uncomment when API is ready
    // const res = await loginApi(email, password)
    // localStorage.setItem('access_token', res.data.access_token)
    // setUser(res.data.user)

    // ── MOCK (remove once backend is ready) ──────────────────────────────────
    console.warn('MOCK LOGIN — replace with real API call')

    // ✅ TEST USER — ONLY THESE DETAILS WORK
    if (email === "student@cics.edu.ph" && password === "student123") {
      setUser({ 
        id: "test-user-123", 
        email, 
        name: 'Jonaidah',
        role: 'student'
      })
      return { success: true }
    } else {
      return { success: false, message: "Invalid email or password" }
    }
    // ─────────────────────────────────────────────────────────────────────────
  }

  const logoutUser = () => {
    localStorage.removeItem('access_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)