import { useState, useEffect } from "react";
import { Plus } from "../components/icons";

import {
  getProducts,
  deleteProduct,
  updateProductStatus,
} from "../services/admin/adminProductService";

import ProductsList from "../components/ProductsPage/ProductsList";
import ProductsForm from "../components/ProductsPage/ProductsForm";
import ProductsEditForm from "../components/ProductsPage/ProductsEditForm";
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
  const itemsPerPage = 8;

  // Delete Dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Edit Dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  // Add Product Dialog
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    sku: "", 
    stock: "",
    price: "", 
    quantity: "",
    description: "",
    
   
   
   
  });
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState("");

  // ================================
  // FETCH PRODUCTS
  // ================================
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await getProducts();
      const productsArray = res.content.map((item) => {
        const product = item.data;
        const sku = product.skus?.[0] || {};

        return {
          id: product.id,
          name: product.name,
          description: product.description || "",
          sku: sku.sku || "N/A",
          category: product.sub_category?.data?.category_name || "N/A",
          categoryId: product.sub_category?.data?.category_id || "",
          sub_category_id: product.sub_category?.data?.id || "",
          price: sku.price ? `$${sku.price}` : "$0",
          rawPrice: sku.price || "",
          stock: sku.quantity || 0,
          skuDescription: sku.description || "",
          color: sku.color || "",
          size: sku.size || "",
          is_active: product.is_active,
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
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Reset page when search/filter changes
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
      fetchProducts();
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  };

  // ================================
  // EDIT PRODUCT
  // ================================
  const handleEditClick = (product) => {
    setProductToEdit(product);
    setEditDialogOpen(true);
  };

  // ================================
  // TOGGLE STATUS
  // ================================
  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const newStatus =
        currentStatus === "in-stock" ? "out-of-stock" : "in-stock";

      await updateProductStatus(id, newStatus);
      fetchProducts();
    } catch (err) {
      console.error("Failed to update product status:", err);
    }
  };

  // ================================
  // FILTER
  // ================================
  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());

    const matchFilter = filter === "all" || p.status === filter;

    return matchSearch && matchFilter;
  });

  // ================================
  // PAGINATION
  // ================================
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filtered.slice(
    startIndex,
    startIndex + itemsPerPage
  );

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
        products={paginatedProducts}
        loading={loading}
        search={search}
        setSearch={setSearch}
        filter={filter}
        setFilter={setFilter}
        filtered={filtered}
        statusLabel={statusLabel}
        handleToggleStatus={handleToggleStatus}
        handleDeleteClick={handleDeleteClick}
        handleEditClick={handleEditClick}
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
        newProduct={newProduct}
        setNewProduct={setNewProduct}
        posting={posting}
        postError={postError}
        handleAddProductSubmit={() => {}}
      />

      {/* Edit Product Form */}
      <ProductsEditForm
        editDialogOpen={editDialogOpen}
        setEditDialogOpen={setEditDialogOpen}
        productToEdit={productToEdit}
        onSuccess={fetchProducts}
      />
    </div>
  );
};

export default Products;