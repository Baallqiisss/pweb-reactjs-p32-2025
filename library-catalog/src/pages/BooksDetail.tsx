import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface Book {
  id: string
  title: string
  writer: string
  description: string
  price: number
  stockQuantity: number
  genre: { name: string } | null
  coverUrl?: string
}

export default function BookDetail() {
  const { id } = useParams()
  const { token } = useAuth()
  const navigate = useNavigate()

  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true)
        const res = await fetch(`http://localhost:4000/books/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error('Gagal memuat data buku.')
        const data = await res.json()  

      setBook(data.success ? data.data : null)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchBook()
  }, [id, token])

  const handleBuy = async () => {
    if (!book) return
    if (book.stockQuantity <= 0) return alert('Stok habis!')
      
    try {
      const res = await fetch('http://localhost:4000/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: [{ book_id: book.id, quantity: 1 }],
        }),
      })
      const data = await res.json()
      if (res.ok) {
        alert('Transaksi berhasil!')
        navigate('/transactions')
      } else {
        alert(data.message || 'Gagal membuat transaksi.')
      }
    } catch (err) {
      console.error(err)
      alert('Terjadi kesalahan.')
    }
  }

  if (loading) return <p className="text-center mt-10 text-gray-700">Memuat data buku...</p>
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>
  if (!book) return <p className="text-center mt-10 text-gray-600">Buku tidak ditemukan.</p>

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-2xl p-8 grid md:grid-cols-2 gap-8">
        {/* Cover Buku */}
        <div className="aspect-[3/4] bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
          {book.coverUrl ? (
            <img
              src={book.coverUrl}
              alt={book.title}
              className="object-cover w-full h-full"
            />
          ) : (
            <span className="text-gray-500 text-sm">Tidak ada gambar</span>
          )}
        </div>

        {/* Detail Buku */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{book.title}</h1>
          <p className="text-gray-600 text-sm mb-1">Oleh: <span className="font-medium">{book.writer}</span></p>
          <p className="text-sm text-indigo-600 mb-4">
            Genre: {book.genre?.name || 'Tidak diketahui'}
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            {book.description || 'Belum ada deskripsi untuk buku ini.'}
          </p>

          <div className="border-t pt-4 mt-4 space-y-2">
            <p className="text-gray-700">
              Harga: <span className="font-semibold text-indigo-600">Rp {book.price.toLocaleString()}</span>
            </p>
            <p className="text-gray-700">
              Stok: <span className="font-semibold">{book.stockQuantity}</span>
            </p>
          </div>

          <div className="mt-6 flex gap-4">
            <button
              onClick={handleBuy}
              className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition"
              disabled={book.stockQuantity <= 0}
            >
              {book.stockQuantity > 0 ? 'Beli Buku' : 'Stok Habis'}
            </button>
            <Link
              to="/books"
              className="border border-gray-300 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-100 transition"
            >
              Kembali
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
