import { FormEvent, useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AddBook() {
  const { token } = useAuth()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [stockQuantity, setStockQuantity] = useState('')
  const [genres, setGenres] = useState<{ id: string; name: string }[]>([])
  const [selectedGenre, setSelectedGenre] = useState('')
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [publisher, setPublisher] = useState('')
  const [publicationYear, setPublicationYear] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
  const fetchGenres = async () => {
    try {
      const res = await fetch('http://localhost:4000/genres', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const json = await res.json()
      if (json.success) {
        setGenres(json.data)
      }
    } catch (err) {
      console.error('Gagal ambil genre')
    }
  }

  if (token) fetchGenres()
 }, [token])

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    const token = localStorage.getItem('token')
    if (!token) {
    setError('Silakan login terlebih dahulu.')
    return
    }

    if (!title || !author || !price || !stockQuantity) {
      setError('Judul, penulis, harga, dan stok wajib diisi.')
      return
    }

    const formData = new FormData()
    formData.append('title', title)
    formData.append('writer', author)
    formData.append('description', description)
    formData.append('price', price)
    formData.append('stockQuantity', stockQuantity)
    formData.append('publisher', publisher)
    formData.append('publicationYear', publicationYear) 
    if (selectedGenre) formData.append('genre_id', selectedGenre)
    if (coverFile) formData.append('cover', coverFile)

    try {
      setLoading(true)
      const res = await fetch('http://localhost:4000/books', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Gagal menambahkan buku.')

      setSuccess('Buku berhasil ditambahkan!')
      setTitle('')
      setAuthor('')
      setDescription('')
      setPrice('')
      setStockQuantity('')
      setSelectedGenre('')
      setCoverFile(null)

      setTimeout(() => navigate('/books'), 1200)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-lg mx-auto bg-white shadow-md rounded-2xl p-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Tambah Buku Baru</h1>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Judul Buku</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="Judul Buku"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Penulis</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="Nama Penulis"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              rows={3}
              placeholder="Deskripsi buku..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Harga</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="100000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Stok</label>
              <input
                type="number"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="10"
              />
            </div>
          </div>

          <div>
           <label className="block text-sm font-medium text-gray-700">Genre</label>
           <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
           >
          <option value="">Pilih Genre</option>
          {genres.map(g => (
          <option key={g.id} value={g.id}>{g.name}</option>
          ))}
          </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Penerbit</label>
            <input
              type="text"
              value={publisher}
              onChange={(e) => setPublisher(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="Gramedia"
             />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tahun Terbit</label>
            <input
              type="number"
              value={publicationYear}
              onChange={(e) => setPublicationYear(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="2023"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Upload Gambar</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
            disabled={loading}
          >
            {loading ? 'Menyimpan...' : 'Simpan Buku'}
          </button>
        </form>

        <p className="mt-4 text-sm text-center">
          <Link to="/books" className="text-indigo-600 hover:underline">
            ← Kembali ke daftar buku
          </Link>
        </p>
      </div>
    </div>
  )
}