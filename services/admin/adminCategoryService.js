// adminCategoryService.js
import api from "../api"

export const getCategoriesAdmin = () =>
  api.get("/categories")

export const createCategory = (data) =>
  api.post("/categories", data)

export const updateCategory = (id, data) =>
  api.put(`/categories/${id}`, data)

export const deleteCategory = (id) =>
  api.delete(`/categories/${id}`)