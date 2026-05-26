import { createContext, useContext, useState, useEffect } from 'react'
import { login as apiLogin, getMe, logout as apiLogout } from '../api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      setLoading(false)
      return
    }
    getMe()
      .then((res) => setUser(res.data.user || res.data))
      .catch(() => localStorage.removeItem('access_token'))
      .finally(() => setLoading(false))
  }, [])

  const loginUser = async (email, password) => {
    try {
      const data = await apiLogin(email, password)
      const u = data.user || (await getMe()).data.user
      setUser(u)
      return { success: true, user: u }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Invalid email or password'
      return { success: false, message }
    }
  }

  const logoutUser = () => {
    setUser(null)
    apiLogout()
  }

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
