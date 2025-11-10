import { FormEvent, useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

export default function Register() {
  const { register, loading, error, token } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [clientError, setClientError] = useState<string | null>(null)

  useEffect(() => {
    if (token) navigate('/books', { replace: true })
  }, [token, navigate])

  const validate = () => {
    if (!email || !password) return 'Email dan password wajib diisi.'
    if (password.length < 6) return 'Password minimal 6 karakter.'
    if (password !== confirmPassword) return 'Konfirmasi password tidak cocok.'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return 'Format email tidak valid.'
    return null
  }

  const onSubmit = async (e: FormEvent) => {
   e.preventDefault()
   const v = validate()
   setClientError(v)
   if (v) return
   await register({ username: name || 'user', email, password })
}

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 px-4">
      <div className="bg-white/80 backdrop-blur-md shadow-lg rounded-2xl w-full max-w-md p-8 border border-pink-50">
        <h1 className="text-2xl font-bold text-center text-gray-700 mb-6">
          Daftar Akun Baru
        </h1>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Nama (opsional)
            </label>
            <input
              type="text"
              className="w-full border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-pink-200 outline-none bg-white/70"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama Anda"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-pink-200 outline-none bg-white/70"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-pink-200 outline-none bg-white/70"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Konfirmasi Password
            </label>
            <input
              type="password"
              className="w-full border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-pink-200 outline-none bg-white/70"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {clientError && <p className="text-sm text-red-500">{clientError}</p>}
          {error && <p className="text-sm text-red-500">{error}</p>}
          {loading && <p className="text-sm text-gray-500">Memproses registrasi...</p>}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 hover:from-pink-400 hover:to-blue-400 text-gray-700 font-medium py-2.5 rounded-lg transition duration-300 shadow-sm"
            disabled={loading}
          >
            {loading ? 'Mendaftar...' : 'Daftar'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-gray-600">
          Sudah punya akun?{' '}
          <Link
            to="/login"
            className="text-pink-500 hover:underline font-medium"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}
