import axiosInstance from "../services/admin/axiosInstance";

// GET all products
export const getProducts = () => {
  return axiosInstance.get("/products");
};

// GET product by id
export const getProductById = (id) => {
  return axiosInstance.get(`/products/${id}`);
};

// DELETE product
export const deleteProduct = (id) => {
  return axiosInstance.delete(`/products/${id}`);
};