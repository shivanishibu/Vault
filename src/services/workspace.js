import api from './api'

export const getMessages = () => api.get('/messages')
export const sendMessage = (payload) => api.post('/messages', payload)
export const getNotifications = () => api.get('/notifications')
export const createSupportTicket = (payload) => api.post('/support/tickets', payload)
export const getSupportTickets = () => api.get('/support/tickets')
export const getBuyerDashboard = () => api.get('/users/me/dashboard/buyer')
export const getSellerDashboard = () => api.get('/users/me/dashboard/seller')
export const getAdminDashboard = () => api.get('/admin/dashboard')
export const approveProduct = (id, payload) => api.patch(`/admin/products/${id}/verification`, payload)
