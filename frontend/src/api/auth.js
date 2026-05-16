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

// Handle global 401 (Unauthorized) errors
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('access_token')
      window.location.href = '/login'
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