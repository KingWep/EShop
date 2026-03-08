import { useState, useEffect } from "react";
import { Plus } from "../components/icons";

import {
  getProducts,
  deleteProduct,
  updateProductStatus,
} from "../services/admin/adminProductService";

import ProductsList from "../components/ProductsPage/ProductsList";
import ProductsForm from "../components/ProductsPage/ProductsForm";
import ProductsPagination from "../components/ProductsPage/ProductsPagination";

const statusLabel = {
  "in-stock": { label: "In Stock", cls: "badge-in-stock" },
  "low-stock": { label: "Low Stock", cls: "badge-low-stock" },
  "out-of-stock": { label: "Out of Stock", cls: "badge-out-of-stock" },
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  // Delete Dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Add Product Dialog
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  // ================================
  // FETCH PRODUCTS (server-side paged)
  // ================================
  const fetchProducts = async (page = currentPage) => {
    try {
      setLoading(true);
      // API is 0-indexed, UI is 1-indexed
      const res = await getProducts(page - 1, itemsPerPage);
      const productsArray = (res.content || []).map((item) => {
        const product = item.data;
        const sku = product.skus?.[0] || {};
        return {
          id: product.id,
          name: product.name,
          sku: sku.sku || "N/A",
          category: product.sub_category?.data?.category_name || "N/A",
          price: sku.price ? `$${sku.price}` : "$0",
          stock: sku.quantity || 0,
          status: product.is_active
            ? sku.quantity === 0
              ? "out-of-stock"
              : sku.quantity < 10
              ? "low-stock"
              : "in-stock"
            : "out-of-stock",
          image: product.main_image || "📦",
        };
      });
      setProducts(productsArray);
      setTotalPages(res.totalPages || Math.ceil((res.totalElements || 0) / itemsPerPage) || 1);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch when page changes
  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  // Reset to page 1 when search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filter]);

  // ================================
  // DELETE PRODUCT
  // ================================
  const handleDeleteClick = (id) => {
    setProductToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await deleteProduct(productToDelete);
      setDeleteDialogOpen(false);
      setProductToDelete(null);
      fetchProducts(currentPage);
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  };

  // ================================
  // TOGGLE STATUS
  // ================================
  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "in-stock" ? "out-of-stock" : "in-stock";
      await updateProductStatus(id, newStatus);
      fetchProducts(currentPage);
    } catch (err) {
      console.error("Failed to update product status:", err);
    }
  };

  // ================================
  // CLIENT-SIDE FILTER (on current page)
  // ================================
  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || p.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-5 animate-fade-up">
      {/* Header + Add Button */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Products</h1>

        <button
          onClick={() => setAddDialogOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {/* Products List */}
      <ProductsList
        products={filtered}
        loading={loading}
        search={search}
        setSearch={setSearch}
        filter={filter}
        setFilter={setFilter}
        statusLabel={statusLabel}
        handleToggleStatus={handleToggleStatus}
        handleDeleteClick={handleDeleteClick}
        deleteDialogOpen={deleteDialogOpen}
        setDeleteDialogOpen={setDeleteDialogOpen}
        handleConfirmDelete={handleConfirmDelete}
        productToDelete={productToDelete}
      />

      {/* Pagination */}
      <ProductsPagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />

      {/* Add Product Form */}
      <ProductsForm
        addDialogOpen={addDialogOpen}
        setAddDialogOpen={setAddDialogOpen}
        onProductAdded={() => fetchProducts(currentPage)}
      />
    </div>
  );
};

export default Products;