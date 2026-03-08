// adminOrderService.js
import api from "./axiosInstance"

export const getAllOrders = () =>
  api.get("/orders")

export const getOrderById = (id) =>
  api.get(`/orders/${id}`)

export const updateOrderStatus = (id, status) =>
  api.patch(`/orders/${id}/status`, { status })