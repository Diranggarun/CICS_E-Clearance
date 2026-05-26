import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Global auth-error handling.
//   401 = the session is genuinely invalid/expired -> clear it and send the
//         user to login.
//   403 = authenticated but not allowed to do THIS action -> surface the
//         error to the caller; never destroy the session (doing so just hides
//         the real problem and bounces the user to login for no reason).
// The login/register calls are exempt so a wrong password shows an inline
// error instead of silently reloading the page.
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error.response?.status
    const url = error.config?.url || ''
    const isAuthCall = url.includes('/auth/login') || url.includes('/auth/register')

    if (status === 401 && !isAuthCall) {
      localStorage.removeItem('access_token')
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  
  // CRITICAL: Save the token returned by the backend
  if (response.data.access_token) {
    localStorage.setItem('access_token', response.data.access_token);
  }
  
  return response.data;
}

export const register = (payload) => api.post('/auth/register', payload);

export const getMe = () => api.get('/auth/me');

export const logout = () => {
  localStorage.removeItem('access_token');
  window.location.href = '/login';
};

export default api;