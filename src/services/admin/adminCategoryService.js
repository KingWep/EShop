// adminCategoryService.js
import axiosInstance from "./axiosInstance";

// Get all categories (for admin)
export const getCategoriesAdmin = () =>
  axiosInstance.get("/categories");

// Create a category
export const createCategory = (data) =>
  axiosInstance.post("/categories", data);

// Update a category
export const updateCategory = (id, data) =>
  axiosInstance.put(`/categories/${id}`, data);

// Delete a category
export const deleteCategory = (id) =>
  axiosInstance.delete(`/categories/${id}`);
