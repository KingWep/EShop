import axiosInstance from "./axiosInstance";

// Get products (supports optional server-side pagination)
export const getProducts = (page, size) => {
  const params = new URLSearchParams();

  if (Number.isInteger(page) && page >= 0) {
    params.set("page", String(page));
  }

  if (Number.isInteger(size) && size > 0) {
    params.set("size", String(size));
  }

  const query = params.toString();
  return axiosInstance.get(query ? `/products?${query}` : "/products");
};

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
// Some backends expect multipart key `image`, others `file`.
export const addProductImage = async (id, file) => {
  const withImageKey = new FormData();
  withImageKey.append("image", file);

  try {
    return await axiosInstance.post(`/products/${id}/image`, withImageKey);
  } catch (err) {
    if (err?.status !== 400) throw err;
  }

  const withFileKey = new FormData();
  withFileKey.append("file", file);
  return axiosInstance.post(`/products/${id}/image`, withFileKey);
};

// Delete product
export const deleteProduct = (id) => axiosInstance.delete(`/products/${id}`);

// Update product status
export const updateProductStatus = (id, status) =>
  axiosInstance.patch(`/products/${id}/status`, { status });