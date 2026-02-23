// adminProductService.js
import api from "../api"

// GET all products
export const getAllProductsAdmin = () =>
  api.get("/products")

// CREATE product
export const createProduct = (data) =>
  api.post("/products", data)

// UPDATE product
export const updateProduct = (id, data) =>
  api.put(`/products/${id}`, data)

// DELETE product
export const deleteProduct = (id) =>
  api.delete(`/products/${id}`)

// CHANGE status
export const changeProductStatus = (id, status) =>
  api.patch(`/products/${id}/status`, { status })