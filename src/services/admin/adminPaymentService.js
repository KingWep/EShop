// adminPaymentService.js
import api from "./axiosInstance"

// Get payment by order
export const getPaymentByOrder = (orderId) =>
  api.get(`/payments/order/${orderId}`)

// Update payment status
export const updatePaymentStatus = (paymentId, status) =>
  api.patch(`/payments/${paymentId}/status`, { status })