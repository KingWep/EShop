import axiosInstance from "./axiosInstance";

// Get all products (optionally paged)
export const getProducts = (page = 0, size = 10) =>
  axiosInstance.get(`/products?page=${page}&size=${size}`);

// Get product by ID
export const getProduct = (id) => axiosInstance.get(`/products/${id}`);

// Get product with SKUs
export const getProductWithSkus = (id) => axiosInstance.get(`/products/${id}/with-skus`);

// Get products by subcategory
export const getProductsBySubcategory = (subCategoryId) =>
  axiosInstance.get(`/products/subcategory/${subCategoryId}`);

// Get products by category
export const getProductsByCategory = (categoryId) =>
  axiosInstance.get(`/products/category/${categoryId}`);

// Search products
export const searchProducts = (query) =>
  axiosInstance.get(`/products/search?keyword=${encodeURIComponent(query)}`);

// Get active products
export const getActiveProducts = () => axiosInstance.get("/products/active");

// Create product
export const createProduct = (data) => axiosInstance.post("/products", data);

// Update product
export const updateProduct = (id, data) => axiosInstance.put(`/products/${id}`, data);

// Add image to product
export const addProductImage = (id, formData) =>
  axiosInstance.post(`/products/${id}/image`, formData);
// Delete product
export const deleteProduct = (id) => axiosInstance.delete(`/products/${id}`);

// Update product status
export const updateProductStatus = (id, status) =>
  axiosInstance.patch(`/products/${id}/status`, { status });
