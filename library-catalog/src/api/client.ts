import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:4000'
})


api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export type RegisterPayload = { username: string; email: string; password: string }
export type LoginPayload = { email: string; password: string }

export type AuthResponse = {
  success: boolean
  message: string
  data: { userId: string } | { token: string }
}

export const registerRequest = (payload: RegisterPayload) =>
  api.post<AuthResponse>('/auth/register', payload)

export const loginRequest = (payload: LoginPayload) =>
  api.post<AuthResponse>('/auth/login', payload)

export const getBooks = async () => {
  const res = await api.get<any>('/books')
  return res.data.data
}

export const createBook = (payload: any) =>
  api.post('/books', payload)

export const getTransactions = () =>
  api.get('/transactions')