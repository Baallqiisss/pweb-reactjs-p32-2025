import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface Order {
  id: string
  createdAt: string
  items: Array<{ quantity: number; book: { title: string; price: number } }>
}

export default function TransactionList() {
  const { token } = useAuth()
  const [transactions, setTransactions] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

useEffect(() => {
  const fetchTransactions = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      setLoading(false)
      return
    }

    try {
      const res = await fetch('http://localhost:4000/transactions', {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      })
      if (!res.ok) throw new Error('Gagal ambil transaksi')
      const json = await res.json()
      setTransactions(json.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }
  fetchTransactions()
}, [])

  if (loading) return <p>Memuat...</p>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Daftar Transaksi</h1>
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">ID</th>
            <th className="p-2">Tanggal</th>
            <th className="p-2">Jumlah</th>
            <th className="p-2">Total</th>
            <th className="p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => {
            const total = t.items.reduce((s, i) => s + i.book.price * i.quantity, 0)
            const qty = t.items.reduce((s, i) => s + i.quantity, 0)
            return (
              <tr key={t.id}>
                <td className="p-2">{t.id}</td>
                <td className="p-2">{new Date(t.createdAt).toLocaleString()}</td>
                <td className="p-2">{qty}</td>
                <td className="p-2">Rp {total.toLocaleString()}</td>
                <td className="p-2">
                  <Link to={`/transactions/${t.id}`} className="text-indigo-600">
                    Lihat
                  </Link>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}