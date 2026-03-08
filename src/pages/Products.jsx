import { useState, useEffect } from "react";
import { Plus } from "../components/icons";
import { AlertTriangle, Trash2 } from "lucide-react";

import {
  getProducts,
  deleteProduct,
  getProductWithSkus,
  updateProductStatus,
} from "../services/admin/adminProductService";
import { getAllSubCategories } from "../services/admin/adminSubCategoryService";

import ProductsList from "../components/ProductsPage/ProductsList";
import ProductsForm from "../components/ProductsPage/ProductsForm";
import ProductsEditForm from "../components/ProductsPage/ProductsEditForm";
import ProductsPagination from "../components/ProductsPage/ProductsPagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/layouts/ui/dialog";

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
  const [successMessage, setSuccessMessage] = useState("");
  const [subCategoryMeta, setSubCategoryMeta] = useState({});

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  // Delete Dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Edit Dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  // Add Product Dialog
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  // ================================
  // LOAD SUBCATEGORY -> CATEGORY MAP
  // ================================
  const loadSubCategoryMeta = async () => {
    try {
      const res = await getAllSubCategories(0, 500);
      const entries = Array.isArray(res.content) ? res.content : [];
      const nextMeta = {};

      entries.forEach((entry) => {
        const data = entry?.data || entry;
        const subId = data?.id;
        if (!subId) return;
        nextMeta[String(subId)] = {
          subCategoryName: data?.name || "",
          categoryName: data?.category_name || "",
        };
      });

      setSubCategoryMeta(nextMeta);
      return nextMeta;
    } catch (err) {
      console.error("Failed to fetch subcategories:", err);
      return {};
    }
  };

  // ================================
  // FETCH PRODUCTS (server-side paged)
  // ================================
  const fetchProducts = async (page = currentPage) => {
    try {
      setLoading(true);

      const meta = Object.keys(subCategoryMeta).length
        ? subCategoryMeta
        : await loadSubCategoryMeta();

      // API is 0-indexed, UI is 1-indexed
      const res = await getProducts(page - 1, itemsPerPage);
      const productsArray = (res.content || []).map((item) => {
        const product = item.data;
        const skuRaw = product.skus?.[0] || {};
        const sku = skuRaw?.data || skuRaw;
        const subCategoryId = product.sub_category?.data?.id || product.sub_category_id || "";
        const subMeta = subCategoryId ? meta[String(subCategoryId)] : null;
        return {
          id: product.id,
          name: product.name,
          description: product.description || "",
          skuId: sku.id || sku.sku_id || "",
          sku: sku.sku || "N/A",
          category: product.sub_category?.data?.category_name || subMeta?.categoryName || "Uncategorized",
          categoryId: product.sub_category?.data?.category_id || "",
          subCategoryName: product.sub_category?.data?.name || subMeta?.subCategoryName || "",
          sub_category_id: subCategoryId,
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

  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => setSuccessMessage(""), 2500);
    return () => clearTimeout(timer);
  }, [successMessage]);

  // Reset to page 1 when search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filter]);

  // ================================
  // DELETE PRODUCT
  // ================================
  const handleDeleteClick = (id) => {
    const selectedProduct = products.find((p) => p.id === id) || null;
    setProductToDelete(selectedProduct);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete?.id) return;

    try {
      setDeleting(true);
      await deleteProduct(productToDelete.id);
      await fetchProducts(currentPage);
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    } catch (err) {
      console.error("Failed to delete product:", err);
    } finally {
      setDeleting(false);
    }
  };

  // ================================
  // EDIT PRODUCT
  // ================================
  const handleEditClick = async (product) => {
    try {
      const detailRes = await getProductWithSkus(product.id);
      const detailProductRaw = detailRes?.data?.data || detailRes?.data || detailRes;
      const detailProduct = detailProductRaw?.data || detailProductRaw;
      const firstSkuRaw = detailProduct?.skus?.[0] || {};
      const firstSku = firstSkuRaw?.data || firstSkuRaw;

      setProductToEdit({
        ...product,
        name: detailProduct?.name || product.name,
        description: detailProduct?.description || product.description,
        category: detailProduct?.sub_category?.data?.category_name || product.category,
        categoryId: detailProduct?.sub_category?.data?.category_id || product.categoryId,
        subCategoryName: detailProduct?.sub_category?.data?.name || product.subCategoryName,
        sub_category_id: detailProduct?.sub_category?.data?.id || product.sub_category_id,
        skuId: firstSku.id || firstSku.sku_id || product.skuId || null,
        sku: firstSku.sku || product.sku,
        skuDescription: firstSku.description || product.skuDescription,
        rawPrice: firstSku.price ?? product.rawPrice,
        stock: firstSku.quantity ?? product.stock,
        color: firstSku.color || product.color,
        size: firstSku.size || product.size,
        image: detailProduct?.main_image || product.image,
        is_active: detailProduct?.is_active ?? product.is_active,
      });
    } catch (err) {
      // Fallback to table data if detail endpoint fails.
      console.error("Failed to fetch product details:", err);
      setProductToEdit(product);
    } finally {
      setEditDialogOpen(true);
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
    <div className="space-y-5 mt-5 animate-fade-up">
      {successMessage && (
        <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          {successMessage}
        </div>
      )}

      {/* Header + Add Button */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Products</h1>

        <button
          onClick={() => setAddDialogOpen(true)}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg shadow-md shadow-purple-600/25 transition"
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
        handleEditClick={handleEditClick}
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

      {/* Edit Product Form */}
      <ProductsEditForm
        editDialogOpen={editDialogOpen}
        setEditDialogOpen={setEditDialogOpen}
        productToEdit={productToEdit}
        onSuccess={async (message) => {
          await fetchProducts(currentPage);
          setSuccessMessage(message || "Product updated successfully.");
        }}
      />

      {/* Delete Product Confirmation */}
      <Dialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) setProductToDelete(null);
        }}
      >
        <DialogContent className="max-w-sm p-0 overflow-hidden rounded-3xl border border-red-500/20 bg-[#0f0a1e] shadow-[0_0_60px_rgba(239,68,68,0.1)]">
          <div className="relative px-7 pt-7 pb-6 overflow-hidden">
            <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-red-600/10 blur-3xl pointer-events-none" />
            <div className="absolute -top-6 left-1/2 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />

            <DialogHeader className="space-y-0">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <AlertTriangle size={20} className="text-red-400" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold text-white tracking-tight">Confirm Delete</DialogTitle>
                  <DialogDescription className="text-purple-400/70 text-xs mt-0.5">
                    This action cannot be undone
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="absolute bottom-0 left-7 right-7 h-px bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />
          </div>

          <div className="px-7 py-5">
            <p className="text-sm text-purple-200/70">
              This will permanently delete{" "}
              <span className="font-bold text-white">"{productToDelete?.name || "this product"}"</span>.
              Are you sure?
            </p>
          </div>

          <div className="relative px-7 py-5">
            <div className="absolute top-0 left-7 right-7 h-px bg-gradient-to-r from-transparent via-red-500/10 to-transparent" />
            <DialogFooter className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setDeleteDialogOpen(false);
                  setProductToDelete(null);
                }}
                disabled={deleting}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-purple-500/20 bg-purple-950/40 text-purple-300/70 text-sm font-medium hover:bg-purple-900/30 hover:text-purple-200 transition-all duration-200 disabled:opacity-40"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="relative flex items-center gap-2 px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-semibold disabled:opacity-60 transition-all duration-200 shadow-lg shadow-red-600/20 active:scale-[0.98]"
              >
                <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10" />
                {deleting ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={14} />
                    Delete
                  </>
                )}
              </button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Products;