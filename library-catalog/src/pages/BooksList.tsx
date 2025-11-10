import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

interface Genre {
  id: string
  name: string
}

interface Book {
  id: string
  title: string
  writer: string
  genre: Genre | null
  stockQuantity: number
  coverUrl?: string
}

export default function BooksList() {
  const { token } = useAuth()
  const [books, setBooks] = useState<Book[]>([])
  const [genres, setGenres] = useState<Genre[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [search, setSearch] = useState('')
  const [genreFilter, setGenreFilter] = useState('')
  const [sortBy, setSortBy] = useState<'title' | 'createdAt'>('title')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const limit = 12

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await fetch('http://localhost:4000/genre')
        const json = await res.json()
        setGenres(json.data || [])
      } catch (err) {
        console.error('Gagal ambil genre')
      }
    }
    fetchGenres()
  }, [])

  // FETCH BUKU DENGAN SEMUA PARAM
  const fetchBooks = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        search,
        genre_id: genreFilter,
        sort: sortBy,
        order: sortBy === 'title' ? 'asc' : 'desc',
        page: page.toString(),
        limit: limit.toString(),
      })
      const res = await fetch(`http://localhost:4000/books?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Gagal mengambil buku.')
      const json = await res.json()
      setBooks(json.data || [])
      setTotalPages(json.pagination?.totalPages || 1)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // REFRESH KETIKA PARAM BERUBAH
  useEffect(() => {
    if (token) fetchBooks()
  }, [token, search, genreFilter, sortBy, page])

  // PINJAM BUKU
  const handleBuy = async (book: Book) => {
    if (book.stockQuantity <= 0) return alert('Stok habis!')
    if (!confirm(`Pinjam "${book.title}"?`)) return

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
      const json = await res.json()
      if (res.ok && json.success) {
        alert('Pinjam berhasil!')
        fetchBooks()
      } else {
        alert(json.message || 'Gagal pinjam.')
      }
    } catch {
      alert('Error jaringan.')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin hapus buku ini?')) return
    try {
      const res = await fetch(`http://localhost:4000/books/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        await fetchBooks()
        alert('Buku dihapus!')
      } else {
        const data = await res.json()
        alert(data.message || 'Gagal hapus.')
      }
    } catch {
      alert('Error jaringan.')
    }
  }

  if (loading) return <p className="text-center mt-10">Memuat...</p>
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Daftar Buku</h1>
          <div className="flex gap-2">
            <Link
              to="/books/add"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              + Tambah Buku
            </Link>
            <Link
              to="/transactions"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Lihat Transaksi
            </Link>
          </div>
        </header>

        {/* SEARCH, FILTER, SORT, PAGINATION */}
        <div className="mb-6 space-y-4 bg-white p-4 rounded-lg shadow-sm">
          {/* Search */}
          <input
            type="text"
            placeholder="Cari judul / penulis..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="w-full md:w-64 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* Filter & Sort */}
          <div className="flex flex-wrap gap-2">
            <select
              value={genreFilter}
              onChange={(e) => { setGenreFilter(e.target.value); setPage(1) }}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Semua Genre</option>
              {genres.map(g => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value as any); setPage(1) }}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="title">Urutkan: Judul (A-Z)</option>
              <option value="createdAt">Urutkan: Tanggal Terbaru</option>
            </select>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-4">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100"
              >
                ← Prev
              </button>
              <span className="px-3 py-1 text-sm">
                Halaman {page} dari {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100"
              >
                Next →
              </button>
            </div>
          )}
        </div>

        {/* DAFTAR BUKU */}
        {books.length === 0 ? (
          <p className="text-center text-gray-600 mt-10">Belum ada buku.</p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books.map((book) => (
              <Link
                key={book.id}
                to={`/books/${book.id}`}
                className="block bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition"
              >
                <div className="aspect-[3/4] w-full bg-gray-200 rounded-lg mb-4 overflow-hidden">
                  {book.coverUrl ? (
                    <img
                      src={`http://localhost:4000${book.coverUrl}`}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                      No Cover
                    </div>
                  )}
                </div>
                <h2 className="text-lg font-semibold text-gray-800 truncate">{book.title}</h2>
                <p className="text-sm text-gray-600">Oleh {book.writer}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Genre:{' '}
                  <span className="font-medium text-indigo-600">
                    {book.genre?.name || 'Tidak diketahui'}
                  </span>
                </p>
                <p className="text-sm text-gray-700 mt-1">
                  Stok: <span className="font-semibold">{book.stockQuantity}</span>
                </p>

                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleBuy(book)
                  }}
                  className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                  disabled={book.stockQuantity <= 0}
                >
                  {book.stockQuantity > 0 ? 'Pinjam Buku' : 'Stok Habis'}
                </button>

                {/* HAPUS BUKU */}
                {token && (
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleDelete(book.id)
                    }}
                    className="mt-2 w-full bg-red-600 text-white py-1 rounded text-sm hover:bg-red-700 transition"
                  >
                    Hapus Buku
                  </button>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}