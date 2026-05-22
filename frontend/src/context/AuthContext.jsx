import { createContext, useContext, useState, useEffect } from 'react'
<<<<<<< HEAD
=======
import { login as apiLogin, getMe, logout as apiLogout } from '../api/auth'
>>>>>>> d28bd3b538eb5eb7f22a9b7749abab309e37038e

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
<<<<<<< HEAD
  const [loading, setLoading] = useState(false)

  const loginUser = async (email, password) => {
    if (email === "student@cics.edu.ph" && password === "student123") {
      setUser({ 
        id: "test-user-123", 
        email, 
        name: 'PLANGUGN A WATA',
        role: 'student'
      })
      return { success: true }
    } else {
      return { success: false, message: "Invalid email or password" }
=======
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
>>>>>>> d28bd3b538eb5eb7f22a9b7749abab309e37038e
    }
  }

  const logoutUser = () => {
    setUser(null)
<<<<<<< HEAD
=======
    apiLogout()
>>>>>>> d28bd3b538eb5eb7f22a9b7749abab309e37038e
  }

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  )
}

<<<<<<< HEAD
export const useAuth = () => useContext(AuthContext)
=======
export const useAuth = () => useContext(AuthContext)
>>>>>>> d28bd3b538eb5eb7f22a9b7749abab309e37038e
