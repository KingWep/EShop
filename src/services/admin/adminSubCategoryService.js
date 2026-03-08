// services/subCategoryService.js
import api from "./axiosInstance";

export const getSubCategories = (params = {}) => {
  return api.get("/subcategories", { params });
};

// Create a subcategory
export const createSubCategory = (data) => {
  return api.post("/subcategories", data);
};

// Get subcategory by ID
export const getSubCategoryById = (id) => {
  // console.log("Fetching sub-category with ID:===============================", id);
  return api.get(`/categories/${id}/with-subcategories`);
};

// Update subcategory
export const updateSubCategory = (id, data) => {
  return api.put(`/subcategories/${id}/with-subcategories`, data);
};

// Delete subcategory
export const deleteSubCategory = (id) => {
  return api.delete(`/subcategories/${id}/with-subcategories`);
};