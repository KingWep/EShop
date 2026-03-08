// // adminOrderService.js
// import api from "./axiosInstance"

// export const getAllOrders = () =>
//   api.get("/orders")

// export const getOrderById = (id) =>
//   api.get(`/orders/${id}`)

// const normalizeStatus = (status) =>
//   String(status || "")
//     .trim()
//     .toUpperCase()
//     .replace(/\s+/g, "_")
//     .replace(/-/g, "_")

// export const updateOrderStatus = async (id, status) => {
//   const normalizedStatus = normalizeStatus(status)

//   // Try most specific contract first, then fall back to common alternatives.
//   const attempts = [
//     () => api.patch(`/orders/${id}/status`, { status: normalizedStatus }),
//     () => api.put(`/orders/${id}/status`, { status: normalizedStatus }),
//     () => api.patch(`/orders/${id}`, { status: normalizedStatus }),
//     () => api.put(`/orders/${id}`, { status: normalizedStatus }),
//   ]

//   let lastError
//   for (const attempt of attempts) {
//     try {
//       return await attempt()
//     } catch (err) {
//       lastError = err

//       // For not found/method-related rejections, try next contract.
//       if (err?.status === 403 || err?.status === 404 || err?.status === 405) {
//         continue
//       }

//       throw err
//     }
//   }

//   throw lastError
// }

// orderService.js
import api from "./axiosInstance"

// ─── Response shape (from API) ────────────────────────────────────────────────
// {
//   message: "Successfully!",
//   code: "200",
//   data: {
//     id: 4,
//     order_number: "ORD-A32AD43E",
//     order_date: "2026-03-07T13:06:25.999785",
//     status: "PENDING",
//     total_amount: 3000.00,
//     items: [
//       {
//         quantity: 10,
//         unit_price: 300.00,
//         total_price: 3000.00,
//         product_sku: {
//           sku: "12-R346",
//           description: "string",
//           price: 300.00,
//           color: null,
//           size: null,
//           quantity: 30
//         }
//       }
//     ]
//   }
// }

// The custom fetch client returns parsed JSON directly (not axios-like `response.data`).
// Unwrap both shapes safely: { data: ... } and direct payload.
const unwrap = (response) => {
  if (response && typeof response === "object" && "data" in response) {
    return response.data
  }
  return response
}

// Keep status as plain string; backend expects string type (not enum conversion).
const normalizeStatus = (status) => {
  return String(status ?? "").trim()
}

// ─── Admin-side ───────────────────────────────────────────────────────────────

/**
 * GET /api/v1/orders?page=0&size=1&sort=...
 * Returns paginated list of all orders.
 */
export const getAllOrders = async (params = {}) => {
  const res = await api.get("/orders", { params })
  return unwrap(res)
}

/**
 * GET /api/v1/orders/{id}
 * Returns a single order by internal ID.
 * Unwrapped shape: { id, order_number, order_date, status, total_amount, items[] }
 */
export const getOrderById = async (id) => {
  const res = await api.get(`/orders/${id}`)
  return unwrap(res)
}

/**
 * PATCH /api/v1/orders/{id}/status  (with fallback attempts)
 * Updates order status. Tries multiple HTTP verbs/paths for resilience.
 */
export const updateOrderStatus = async (id, status) => {
  const normalizedStatus = normalizeStatus(status)

  const attempts = [
    () => api.patch(`/orders/${id}/status`, { status: normalizedStatus }),
    () => api.put(`/orders/${id}/status`, { status: normalizedStatus }),
    () => api.patch(`/orders/${id}`, { status: normalizedStatus }),
    () => api.put(`/orders/${id}`, { status: normalizedStatus }),
    () => api.patch(`/orders/${id}/status`, undefined, { params: { status: normalizedStatus } }),
    () => api.put(`/orders/${id}/status`, undefined, { params: { status: normalizedStatus } }),
  ]

  let lastError
  for (const attempt of attempts) {
    try {
      const res = await attempt()
      return unwrap(res)
    } catch (err) {
      lastError = err
      if (err?.status === 403 || err?.status === 404 || err?.status === 405) {
        continue
      }
      throw err
    }
  }

  throw lastError
}

// ─── User-side (endpoints from Swagger screenshot) ───────────────────────────

/**
 * GET /api/v1/orders/user/{userId}
 * Returns all orders belonging to a user.
 * Unwrapped shape: array of order objects (or paginated wrapper depending on API)
 */
export const getOrdersByUser = async (userId, params = {}) => {
  const res = await api.get(`/orders/user/${userId}`, { params })
  return unwrap(res)
}

/**
 * GET /api/v1/orders/number/{orderNumber}
 * Fetch one order by its human-readable number (e.g. "ORD-A32AD43E").
 * Unwrapped shape: { id, order_number, order_date, status, total_amount, items[] }
 */
export const getOrderByNumber = async (orderNumber) => {
  const res = await api.get(`/orders/number/${orderNumber}`)
  return unwrap(res)
}

/**
 * PATCH /api/v1/orders/{id}/status
 * Direct (non-fallback) status update — preferred for known-good contracts.
 * Sends: { status: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | ... }
 */
export const patchOrderStatus = async (id, status) => {
  const res = await api.patch(`/orders/${id}/status`, {
    status: normalizeStatus(status),
  })
  return unwrap(res)
}

/**
 * POST /api/v1/orders/{id}/user/{userId}/cancel
 * Cancels a specific order on behalf of a user.
 *
 * @param {string|number} id     - Internal order ID
 * @param {string|number} userId - Owner's user ID
 * @param {object}        [body] - Optional payload e.g. { reason: "Changed mind" }
 */
export const cancelOrder = async (id, userId, body = {}) => {
  const res = await api.post(`/orders/${id}/user/${userId}/cancel`, body)
  return unwrap(res)
}

/**
 * POST /api/v1/orders/user/{userId}/from-cart
 * Creates a new order from the user's active cart.
 *
 * @param {string|number} userId  - ID of the user placing the order
 * @param {object}        payload - e.g. { address_id, payment_method, note }
 * Returns unwrapped: { id, order_number, order_date, status, total_amount, items[] }
 */
export const createOrderFromCart = async (userId, payload = {}) => {
  const res = await api.post(`/orders/user/${userId}/from-cart`, payload)
  return unwrap(res)
}