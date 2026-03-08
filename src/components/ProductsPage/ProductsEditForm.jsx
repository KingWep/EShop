import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "../layouts/ui/dialog";
import { Package, Save, X } from "lucide-react";

import { getCategoriesAdmin } from "../../services/admin/adminCategoryService";
import { getSubCategoryById } from "../../services/admin/adminSubCategoryService";
import { updateProduct } from "../../services/admin/adminProductService";

const ProductsEditForm = ({ editDialogOpen, setEditDialogOpen, productToEdit, onSuccess }) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    sub_category_id: "",
    skus: [{ sku: "", description: "", price: "", color: "", size: "", quantity: "" }],
    is_active: true,
  });

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState("");

  // Pre-populate form when productToEdit changes
  useEffect(() => {
    if (!productToEdit || !editDialogOpen) return;
    setForm({
      name: productToEdit.name || "",
      description: productToEdit.description || "",
      category: productToEdit.categoryId || "",
      sub_category_id: productToEdit.sub_category_id || "",
      is_active: productToEdit.is_active ?? true,
      skus: [
        {
          sku: productToEdit.sku || "",
          description: productToEdit.skuDescription || "",
          price: productToEdit.rawPrice || "",
          color: productToEdit.color || "",
          size: productToEdit.size || "",
          quantity: productToEdit.stock || "",
        },
      ],
    });
    setPostError("");
  }, [productToEdit, editDialogOpen]);

  // Fetch categories
  useEffect(() => {
    if (!editDialogOpen) return;
    getCategoriesAdmin()
      .then((res) => {
        const list = Array.isArray(res.content) ? res.content.map((i) => i.data) : [];
        setCategories(list);
      })
      .catch(console.error);
  }, [editDialogOpen]);

  // Fetch sub-categories when category changes
  useEffect(() => {
    if (!form.category) { setSubCategories([]); return; }
    getSubCategoryById(Number(form.category))
      .then((res) => {
        const list = Array.isArray(res.data.subCategories)
          ? res.data.subCategories.map((i) => ({ id: i.data.id, name: i.data.name }))
          : [];
        setSubCategories(list);
      })
      .catch(() => setSubCategories([]));
  }, [form.category]);

  const handleSkuChange = (field, value) => {
    const skus = [...form.skus];
    skus[0] = { ...skus[0], [field]: value };
    setForm({ ...form, skus });
  };

  const handleSubmit = async () => {
    setPosting(true);
    setPostError("");
    try {
      const payload = {
        name: form.name,
        description: form.description,
        sub_category_id: Number(form.sub_category_id),
        is_active: form.is_active,
        skus: form.skus.map((s) => ({
          sku: s.sku,
          description: s.description || s.sku,
          price: Number(s.price),
          color: s.color,
          size: s.size,
          quantity: Number(s.quantity),
        })),
      };
      await updateProduct(productToEdit.id, payload);
      setEditDialogOpen(false);
      onSuccess?.();
    } catch (err) {
      console.error(err);
      setPostError(err.response?.data?.message || "Failed to update product");
    } finally {
      setPosting(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-200 outline-none transition-all duration-200 text-gray-700 placeholder-gray-400";
  const labelClass = "block text-sm font-medium text-gray-600 mb-1";

  return (
    <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
      <DialogContent className="p-0 overflow-hidden bg-white rounded-2xl shadow-xl">
        {/* Header */}
        <div className="bg-purple-600 px-6 py-5">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700">
                <Package size={20} />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-white">Edit Product</DialogTitle>
                <DialogDescription className="text-purple-200 text-sm">
                  Update the product details below.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Form */}
        <div className="px-4 py-4 max-h-[70vh] overflow-y-auto custom-scrollbar bg-white">
          <form
            id="edit-product-form"
            onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
            className="space-y-3 text-black"
          >
            {/* Product Name */}
            <div>
              <label className={labelClass}>Product Name</label>
              <input
                type="text"
                placeholder="e.g. Wireless Headphones"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputClass}
                required
              />
            </div>

            {/* Category & Subcategory */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value, sub_category_id: "" })}
                  className={inputClass}
                  required
                >
                  <option value="">Select...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Sub-Category</label>
                <select
                  value={form.sub_category_id}
                  onChange={(e) => setForm({ ...form, sub_category_id: e.target.value })}
                  className={inputClass}
                  required
                  disabled={!subCategories.length}
                >
                  <option value="">{subCategories.length ? "Select..." : "N/A"}</option>
                  {subCategories.map((sub) => (
                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* SKU, Price, Qty */}
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-6">
                <label className={labelClass}>SKU</label>
                <input
                  type="text"
                  placeholder="SKU-123"
                  value={form.skus[0].sku}
                  onChange={(e) => handleSkuChange("sku", e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
              <div className="col-span-3">
                <label className={labelClass}>Price</label>
                <input
                  type="number"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  value={form.skus[0].price}
                  onChange={(e) => handleSkuChange("price", e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
              <div className="col-span-3">
                <label className={labelClass}>Qty</label>
                <input
                  type="number"
                  placeholder="0"
                  min="0"
                  value={form.skus[0].quantity}
                  onChange={(e) => handleSkuChange("quantity", e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
            </div>

            {/* Color & Size */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Color</label>
                <select
                  value={form.skus[0].color}
                  onChange={(e) => handleSkuChange("color", e.target.value)}
                  className={inputClass}
                  required
                >
                  <option value="">Select Color</option>
                  <option value="Black">Black</option>
                  <option value="White">White</option>
                  <option value="Red">Red</option>
                  <option value="Blue">Blue</option>
                  <option value="Green">Green</option>
                  <option value="Yellow">Yellow</option>
                  <option value="Purple">Purple</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Size</label>
                <input
                  type="text"
                  placeholder="e.g. M"
                  value={form.skus[0].size}
                  onChange={(e) => handleSkuChange("size", e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className={labelClass}>Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Enter product details..."
                className={inputClass + " min-h-[80px] resize-none"}
              />
            </div>

            {postError && (
              <div className="p-2 text-red-600 bg-red-50 border border-red-100 rounded text-xs">
                {postError}
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <DialogFooter className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-white rounded-b-2xl">
          <button
            type="button"
            onClick={() => setEditDialogOpen(false)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            <X size={16} /> Cancel
          </button>
          <button
            type="submit"
            form="edit-product-form"
            disabled={posting}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
          >
            {posting ? (
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save size={16} />
            )}
            {posting ? "Saving..." : "Update"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductsEditForm;
