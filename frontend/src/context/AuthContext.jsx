import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

  const loginUser = async (email, password) => {
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
  }

  const logoutUser = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)