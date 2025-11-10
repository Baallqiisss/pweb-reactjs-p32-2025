import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, token, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to={token ? '/books' : '/'} className="font-semibold text-gray-900">
            IT Literature Shop
          </Link>
          {token && (
            <>
              <Link to="/books" className="link">Buku</Link>
              {/* Nanti: <Link to="/transactions" className="link">Transaksi</Link> */}
            </>
          )}
        </div>
        <div className="flex items-center gap-3">
          {token && user ? (
            <>
              <span className="text-sm text-gray-600">Login: {user.email}</span>
              <button onClick={handleLogout} className="button">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="link">Login</Link>
              <Link to="/register" className="link">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
