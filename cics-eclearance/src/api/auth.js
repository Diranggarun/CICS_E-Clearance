/**
 * api/auth.js
 * ──────────────────────────────────────────────────────────────────────────────
 * All authentication API calls are centralized here.
 * Backend team: implement the endpoints below and update BASE_URL if needed.
 * ──────────────────────────────────────────────────────────────────────────────
 */
import axios from 'axios'

// Base URL is proxied through Vite (see vite.config.js → proxy: /api → localhost:8000)
// Change the target port in vite.config.js to match your backend port.
const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// ── Request interceptor: attach JWT token if present ──────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ── Response interceptor: handle 401 globally ─────────────────────────────────
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ── Auth endpoints ─────────────────────────────────────────────────────────────
// TODO (backend): POST /api/auth/login  → { email, password } → { access_token, user }
export const login = (email, password) =>
  api.post('/auth/login', { email, password })

// TODO (backend): POST /api/auth/register → { ...fields } → { message } or { user }
export const register = (payload) =>
  api.post('/auth/register', payload)

// TODO (backend): POST /api/auth/logout  → {}
export const logout = () =>
  api.post('/auth/logout')

// TODO (backend): GET  /api/auth/me      → { user }
export const getMe = () =>
  api.get('/auth/me')

export default api
