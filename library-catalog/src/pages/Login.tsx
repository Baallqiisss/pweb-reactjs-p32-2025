import { FormEvent, useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useLocation, useNavigate, Link } from 'react-router-dom'

export default function Login() {
  const { login, loading, error, token } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as any)?.from?.pathname || '/books'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [clientError, setClientError] = useState<string | null>(null)

  useEffect(() => {
    if (token) {
      navigate('/books', { replace: true })
    }
  }, [token, navigate])

  const validate = () => {
    if (!email || !password) return 'Email dan password wajib diisi.'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return 'Format email tidak valid.'
    return null
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const v = validate()
    setClientError(v)
    if (v) return
    await login({ email, password })
    navigate(from, { replace: true })
  }

  return (
    <div className="page">
      <div className="max-w-md mx-auto card">
        <h1 className="text-xl font-semibold mb-4">Login</h1>
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {clientError && <p className="text-sm text-red-600">{clientError}</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}
          {loading && <p className="text-sm text-gray-600">Memproses login...</p>}

          <button type="submit" className="button w-full" disabled={loading}>
            Masuk
          </button>
        </form>

        <p className="mt-3 text-sm">
          Belum punya akun? <Link to="/register" className="link">Daftar</Link>
        </p>
      </div>
    </div>
  )
}
