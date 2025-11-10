import { createContext, useContext, useEffect, useState } from 'react'
import { loginRequest, registerRequest } from '../api/client'

type BackendAuthResponse = {
  success: boolean
  message: string
  data: { userId: string } | { token: string }
}

type User = { id: string; email: string; username?: string }

type AuthContextType = {
  user: User | null
  token: string | null
  loading: boolean
  error: string | null
  login: (payload: { email: string; password: string }) => Promise<void>
  register: (payload: { username: string; email: string; password: string }) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    if (savedToken) setToken(savedToken)
    if (savedUser) setUser(JSON.parse(savedUser))
  }, [])

  const persistAuth = (token: string, userData: Partial<User>) => {
    localStorage.setItem('token', token)
    const fullUser = { id: userData.id || '', email: userData.email || '', username: userData.username }
    localStorage.setItem('user', JSON.stringify(fullUser))
    setToken(token)
    setUser(fullUser as User)
  }

  const login = async (payload: { email: string; password: string }) => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await loginRequest(payload)
      if (data.success && 'token' in data.data) {
        const token = (data.data as { token: string }).token
        persistAuth(token, { email: payload.email })
      }
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Login gagal.')
    } finally {
      setLoading(false)
    }
  }

  const register = async (payload: { username: string; email: string; password: string }) => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await registerRequest(payload)
      if (data.success) {
        await login({ email: payload.email, password: payload.password })
      }
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Registrasi gagal.')
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  const value: AuthContextType = { user, token, loading, error, login, register, logout }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}