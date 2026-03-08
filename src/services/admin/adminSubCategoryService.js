// services/subCategoryService.js
import api from "./axiosInstance";

// Get all subcategories
export const getSubCategories = (params = {}) => {
  return api.get("/subcategories", { params });
};

// Create a subcategory (supports image upload)
export const createSubCategory = (data) => {
  const categoryId = data.categoryId ?? data.category_id;
  if (!categoryId) {
    throw new Error("Parent category is required.");
  }

  // name, categoryId, description go as QUERY PARAMS (as shown in Swagger)
  const params = {
    name: data.name,
    description: data.description,
    categoryId: String(categoryId),
  };

  // image goes as multipart/form-data in the request BODY
  const formData = new FormData();
  if (data.image) {
    formData.append("image", data.image); // must be a File object
  }

  return api.post("/subcategories", formData, { params });
};

// Get subcategories by category ID
export const getSubCategoryById = (id) => {
  return api.get(`/categories/${id}/with-subcategories`);
};

// Get all subcategories (paged endpoint used by backend)
export const getAllSubCategories = (page = 0, size = 200) => {
  return api.get(`/subcategories/All?page=${page}&size=${size}`);
};

// Update subcategory (supports image upload)
export const updateSubCategory = (id, data) => {
  const categoryId = data.categoryId ?? data.category_id;

  if (!id) {
    throw new Error("Sub-category id is required.");
  }

  const formData = new FormData();
  if (data.image) formData.append("image", data.image);

  // Keep update contract consistent with create endpoint: metadata as query params.
  const params = {
    name: data.name,
    description: data.description,
    categoryId: categoryId ? String(categoryId) : undefined,
  };

  // Do not set multipart Content-Type manually; browser adds required boundary.
  return api.put(`/subcategories/${id}`, formData, { params });
};

// Delete subcategory
export const deleteSubCategory = (id) => {
  return api.delete(`/subcategories/${id}`);
};