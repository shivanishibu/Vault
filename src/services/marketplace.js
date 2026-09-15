import api from './api'

export const listProducts = (params) => api.get('/products', { params })
export const getProduct = (id) => api.get(`/products/${id}`)
export const createProduct = (payload) => api.post('/products', payload)
export const updateProduct = (id, payload) => api.put(`/products/${id}`, payload)
export const createTransaction = (productId) => api.post('/transactions', { productId })
export const getTransactions = () => api.get('/transactions/me')
export const createEscrowPayment = (transactionId, payload) => api.post(`/escrow/${transactionId}/payment`, payload)
export const requestIpTransfer = (transactionId) => api.post(`/ip-transfer/${transactionId}`)
export const getVerificationQueue = () => api.get('/verification/queue')
export const getAiSafetyReport = (productId) => api.get(`/ai-safety/products/${productId}`)
