import { createContext, useContext, useState } from 'react'
import * as authApi from '../services/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('vault_user') || 'null'))
  const [loading, setLoading] = useState(false)

  const signIn = async (credentials) => {
    setLoading(true)
    try {
      const { data } = await authApi.login(credentials)
      localStorage.setItem('vault_token', data.token)
      localStorage.setItem('vault_user', JSON.stringify(data.user))
      setUser(data.user)
      return data.user
    } finally { setLoading(false) }
  }

  const signOut = () => { authApi.logout(); setUser(null) }
  return <AuthContext.Provider value={{ user, loading, signIn, signOut, isAuthenticated: Boolean(user), role: user?.role }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
