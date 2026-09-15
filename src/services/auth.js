import api from './api'

export const login = (credentials) => api.post('/auth/login', credentials)
export const register = (payload) => api.post('/auth/register', payload)
export const getCurrentUser = () => api.get('/users/me')
export const logout = () => { localStorage.removeItem('vault_token'); localStorage.removeItem('vault_user') }
