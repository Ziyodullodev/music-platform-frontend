import { createContext, useContext, useState } from 'react'
import { api } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('access_token')
    return token ? { token } : null
  })

  async function login(email, password) {
    const data = await api.login({ email, password })
    localStorage.setItem('access_token', data.token.access_token)
    localStorage.setItem('refresh_token', data.token.refresh_token)
    setUser({ ...data.user, token: data.token.access_token })
    return data
  }

  async function register(userData) {
    const data = await api.register(userData)
    return data
  }

  function logout() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
