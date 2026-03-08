// ProductsFormStyled.jsx
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

import { createProduct } from "../../services/admin/adminProductService";
import { getCategoriesAdmin } from "../../services/admin/adminCategoryService";
import { getSubCategoryById } from "../../services/admin/adminSubCategoryService";

const ProductsFormStyled = ({ addDialogOpen, setAddDialogOpen, onProductAdded }) => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    skus: [
      {
        sku: "",
        description: "",
        price: "",
        color: "",
        size: "",
        quantity: "",
      },
    ],
    is_active: true,
    sub_category_id: "",
  });

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState("");

  // Fetch Categories
  useEffect(() => {
    if (!addDialogOpen) return;

    const fetchCategories = async () => {
      try {
        const res = await getCategoriesAdmin();
        const categoryList = Array.isArray(res.content)
          ? res.content.map((item) => item.data)
          : [];
        setCategories(categoryList);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, [addDialogOpen]);

  // Fetch Sub-Categories
  useEffect(() => {
    if (!newProduct.category) {
      setSubCategories([]);
      return;
    }

    const fetchSubCategories = async () => {
      try {
        const categoryId = Number(newProduct.category);
        const res = await getSubCategoryById(categoryId);
        const subCatList = Array.isArray(res.data.subCategories)
          ? res.data.subCategories.map((item) => ({
            id: item.data.id,
            name: item.data.name,
          }))
          : [];
        setSubCategories(subCatList);
      } catch (err) {
        console.error(err);
        setSubCategories([]);
      }
    };

    fetchSubCategories();
  }, [newProduct.category]);

  // Handle SKU changes
  const handleSkuChange = (field, value) => {
    const updatedSkus = [...newProduct.skus];
    updatedSkus[0] = { ...updatedSkus[0], [field]: value };
    setNewProduct({ ...newProduct, skus: updatedSkus });
  };

  // Submit Product
  const handleAddProductSubmit = async () => {
    setPosting(true);
    setPostError("");

    try {
      const payload = {
        name: newProduct.name,
        description: newProduct.description,
        sub_category_id: Number(newProduct.sub_category_id),
        is_active: true,
        skus: newProduct.skus.map((sku) => ({
          sku: sku.sku,
          description: sku.description || sku.sku,
          price: Number(sku.price),
          color: sku.color,
          size: sku.size,
          quantity: Number(sku.quantity),
        })),
      };

      await createProduct(payload);

      setNewProduct({
        name: "",
        description: "",
        category: "",
        sub_category_id: "",
        is_active: true,
        skus: [{ sku: "", description: "", price: "", quantity: "", color: "", size: "" }],
      });

      setAddDialogOpen(false);
      if (onProductAdded) onProductAdded();
    } catch (err) {
      console.error(err);
      setPostError(err.data?.message || err.message || "Failed to add product");
    } finally {
      setPosting(false);
    }
  };

  // Input styling
  const inputClass =
    "w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-200 outline-none transition-all duration-200 text-gray-700 placeholder-gray-400";
  const labelClass = "block text-sm font-medium text-gray-600 mb-1";

  return (
    <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
      <DialogContent className=" p-0 overflow-hidden bg-white rounded-2xl shadow-xl">
        {/* Header */}
        <div className="bg-purple-600 px-6 py-5">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700">
                <Package size={20} />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-white">New Product</DialogTitle>
                <DialogDescription className="text-purple-200 text-sm">
                  Enter product details below.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Form */}
        <div className="px-4 py-4 max-h-[70vh] overflow-y-auto custom-scrollbar bg-white">
          <form
            id="product-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleAddProductSubmit();
            }}
            className="space-y-3 text-black"
          >
            {/* Product Name */}
            <div>
              <label className={labelClass}>Product Name</label>
              <input
                type="text"
                placeholder="e.g. Wireless Headphones"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className={inputClass}
                required
              />
            </div>

            {/* Category & Subcategory */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Category</label>
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value, sub_category_id: "" })}
                  className={inputClass}
                  required
                >
                  <option value="">Select...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Sub-Category</label>
                <select
                  value={newProduct.sub_category_id}
                  onChange={(e) => setNewProduct({ ...newProduct, sub_category_id: e.target.value })}
                  className={inputClass}
                  required
                  disabled={!subCategories.length}
                >
                  <option value="">{subCategories.length ? "Select..." : "N/A"}</option>
                  {subCategories.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
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
                  value={newProduct.skus[0].sku}
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
                  min="0.00"
                  step="0.01"
                  value={newProduct.skus[0].price}
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
                  min="1"
                  value={newProduct.skus[0].quantity}
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
                  value={newProduct.skus[0].color}
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
                  value={newProduct.skus[0].size}
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
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                placeholder="Enter product details..."
                className={inputClass + " min-h-[80px] resize-none"}
              />
            </div>

            {postError && <div className="p-2 text-red-600 bg-red-50 border border-red-100 rounded text-xs">{postError}</div>}
          </form>
        </div>

        {/* Footer */}
        <DialogFooter className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-white rounded-b-2xl">
          <button
            type="button"
            onClick={() => setAddDialogOpen(false)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            <X size={16} /> Cancel
          </button>
          <button
            type="submit"
            form="product-form"
            disabled={posting}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
          >
            {posting ? <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
            {posting ? "Saving..." : "Create"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductsFormStyled;