// adminCategoryService.js
import api from "./axiosInstance";

// Get all categories (for admin)
export const getCategoriesAdmin = () =>
  api.get("/categories");

// Create a category
export const createCategory = (data) =>
  api.post("/categories", data);

// Update a category
export const updateCategory = (id, data) =>
  api.put(`/categories/${id}`, data);

// Delete a category
export const deleteCategory = (id) =>
  api.delete(`/categories/${id}`);
