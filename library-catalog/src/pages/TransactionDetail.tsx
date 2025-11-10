import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface Genre {
  name: string
}

interface Book {
  id: string
  title: string
  price: number
  genre: Genre | null
}

interface OrderItem {
  id: string
  quantity: number
  book: Book
}

interface Order {
  id: string
  createdAt: string
  user: { id: string; email: string }
  items: OrderItem[]
}

export default function TransactionDetail() {
  const { id } = useParams()
  const { token } = useAuth()

  const [transaction, setTransaction] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        setLoading(true)
        const res = await fetch(`http://localhost:4000/transactions/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error('Gagal memuat detail transaksi.')
        const data = await res.json()
        setTransaction(data.data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchTransaction()
  }, [id, token])

  if (loading) return <p className="text-center mt-10 text-gray-700">Memuat detail transaksi...</p>
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>
  if (!transaction) return <p className="text-center mt-10 text-gray-600">Transaksi tidak ditemukan.</p>

  const totalPrice = transaction.items.reduce(
    (sum, it) => sum + it.book.price * it.quantity,
    0
  )

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Detail Transaksi</h1>

        <div className="border-b pb-4 mb-6">
          <p className="text-sm text-gray-600">
            <span className="font-medium text-gray-800">ID Transaksi:</span> {transaction.id}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium text-gray-800">Tanggal:</span>{' '}
            {new Date(transaction.createdAt).toLocaleString('id-ID')}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium text-gray-800">User:</span>{' '}
            {transaction.user.email}
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Item Buku</h2>
          <div className="divide-y border rounded-lg">
            {transaction.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-4 hover:bg-gray-50">
                <div>
                  <p className="font-medium text-gray-800">{item.book.title}</p>
                  <p className="text-sm text-gray-600">
                    Genre: {item.book.genre?.name || 'Tidak diketahui'}
                  </p>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold text-indigo-600">
                  Rp {(item.book.price * item.quantity).toLocaleString('id-ID')}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-between items-center border-t pt-4">
          <p className="text-lg font-semibold text-gray-700">Total</p>
          <p className="text-xl font-bold text-indigo-700">
            Rp {totalPrice.toLocaleString('id-ID')}
          </p>
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/transactions"
            className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            ← Kembali ke Daftar Transaksi
          </Link>
        </div>
      </div>
    </div>
  )
}
