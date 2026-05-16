import api from './auth'

// === Approval (Phase 7) ===
export const listPendingForRole = () => api.get('/approval/pending')
export const approveStage = (id, reason) =>
  api.post(`/approval/${id}/approve`, { reason })
export const denyStage = (id, reason) =>
  api.post(`/approval/${id}/deny`, { reason })
export const getAuditTrail = (id) => api.get(`/approval/${id}/audit`)

// === Accounts (admin) ===
export const listPendingAccounts = () => api.get('/admin/pending-accounts')
export const approveAccount = (id) =>
  api.post(`/admin/pending-accounts/${id}/approve`)
export const denyAccount = (id, reason) =>
  api.post(`/admin/pending-accounts/${id}/deny`, { reason })

// === Payments ===
export const listPayments = (status) =>
  api.get('/payments', { params: status ? { status } : {} })
export const approvePayment = (id) => api.put(`/payments/${id}/approve`)
export const denyPayment = (id, reason) =>
  api.put(`/payments/${id}/deny`, { reason })

// === Fines ===
export const listFines = (studentId) => api.get(`/fines/${studentId}`)
export const createFine = (payload) => api.post('/fines', payload)
export const deleteFine = (id) => api.delete(`/fines/${id}`)

// === Reports / Dashboard (Phase 9) ===
export const dashboardStats = () => api.get('/admin/dashboard-stats')
export const clearanceReport = (params) =>
  api.get('/admin/reports/clearance', { params })
export const reportDownloadUrl = (format, params) => {
  const qs = new URLSearchParams(params || {}).toString()
  return `/api/admin/reports/clearance.${format}${qs ? `?${qs}` : ''}`
}

// === Requirements ===
export const listRequirements = (role) =>
  api.get('/requirements', { params: role ? { role } : {} })
export const createRequirement = (payload) => api.post('/requirements', payload)
export const updateRequirement = (id, payload) =>
  api.put(`/requirements/${id}`, payload)
export const deleteRequirement = (id) => api.delete(`/requirements/${id}`)

// === Notifications (used by header bell / Notifications page) ===
export const listNotifications = (params) => api.get('/notifications', { params })
export const markNotificationRead = (id) => api.post(`/notifications/${id}/read`)
export const markAllNotificationsRead = () => api.post('/notifications/read-all')
