import { Route, Routes, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import BooksList from './pages/BooksList'
import BookDetail from './pages/BooksDetail'
import AddBook from './pages/AddBook'
import TransactionList from './pages/TransactionList'
import TransactionDetail from './pages/TransactionDetail'
import ProtectedRoute from './routes/ProtectedRoute'
import { useAuth } from './context/AuthContext'

export default function App() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        {/* Arahkan root ke login atau books tergantung status login */}
        <Route path="/" element={<Navigate to={user ? '/books' : '/login'} replace />} />

        {/* Auth pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected pages */}
        <Route element={<ProtectedRoute />}>
          {/* Buku */}
          <Route path="/books" element={<BooksList />} />
          <Route path="/books/:id" element={<BookDetail />} />
          <Route path="/books/add" element={<AddBook />} />
          
          {/* Transaksi */}
          <Route path="/transactions" element={<TransactionList />} />
          <Route path="/transactions/:id" element={<TransactionDetail />} />
        </Route>

        {/* Fallback page */}
        <Route
          path="*"
          element={
            <div className="flex flex-col items-center justify-center min-h-screen text-gray-700">
              <h1 className="text-3xl font-bold mb-2">404</h1>
              <p>Halaman tidak ditemukan.</p>
              <a href="/" className="mt-4 text-indigo-600 hover:underline">
                Kembali ke beranda
              </a>
            </div>
          }
        />
      </Routes>
    </div>
  )
}
