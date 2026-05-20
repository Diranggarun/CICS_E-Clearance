import api from './auth'

// === Clearance (Naimah's module) ===
export const getMyClearance = () => api.get('/clearance/me')
export const getMyProgress = () => api.get('/clearance/me/progress')
export const submitClearanceRequest = () => api.post('/clearance/request')

// Download the gated PDF as a Blob and trigger a browser download.
// Throws if the server returns 409 (not all stages approved) or 403.
export const downloadClearancePdf = async (requestId, referenceNo) => {
  const res = await api.get(`/clearance/${requestId}/pdf`, {
    responseType: 'blob',
  })
  const blob = new Blob([res.data], { type: 'application/pdf' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `clearance-${referenceNo || requestId}.pdf`
  document.body.appendChild(a)
  a.click()
  a.remove()
  window.URL.revokeObjectURL(url)
}

// === Fines (Asraf's module — student reads only their own) ===
export const getMyFines = (studentId) => api.get(`/fines/${studentId}`)

// === Fees catalogue ===
export const listFees = () => api.get('/fees')

// === Payments (student) ===
export const listMyPayments = () => api.get('/payments')

export const submitPayment = ({ type, amount, method, receipt, fineId, orgRole }) =>
  api.post('/payments', { type, amount, method, receipt, fineId, orgRole })

// Upload a receipt file (multipart). Returns { file, size }.
export const uploadReceipt = async (file) => {
  const form = new FormData()
  form.append('receipt', file)
  const res = await api.post('/payments/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}

// === Notifications (shared) ===
export const listNotifications = () => api.get('/notifications')
export const markNotificationRead = (id) =>
  api.post(`/notifications/${id}/read`)
export const markAllNotificationsRead = () =>
  api.post('/notifications/read-all')
