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

import api from "../../services/admin/axiosInstance";
import { getCategoriesAdmin } from "../../services/admin/adminCategoryService";
import { getSubCategoryById } from "../../services/admin/adminSubCategoryService";

const ProductsFormStyled = ({ addDialogOpen, setAddDialogOpen }) => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    sub_category_id: "",
    description: "",
    skus: [{ sku: "", price: "", quantity: "" }],
  });
  const [subCategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState("");
  // Category
  useEffect(() => {
    if (!addDialogOpen) return;
    const fetchCategories = async () => {
      try {
        const res = await getCategoriesAdmin();
        const categoryList = Array.isArray(res.content)
          ? res.content.map((item) => item.data)
          : [];
        console.log("ID", categoryList.map((cat) => cat.id)),
          setCategories(categoryList);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, [addDialogOpen]);

  // Sub-Category
  useEffect(() => {
    if (!newProduct.category) {
      setSubCategories([]);
      console.log("No category selected, skipping fetch");
      return;
    }

    const fetchSubCategories = async () => {
      try {
        const categoryId = Number(newProduct.category); // convert string -> number
        const res = await getSubCategoryById(categoryId);

        // Access correct path
        const subCatList = Array.isArray(res.data.data.subCategories)
          ? res.data.data.subCategories
          : [];

        console.log("Fetched sub-categories:", subCatList);
        setSubCategories(subCatList);
      } catch (err) {
        console.error("Fetch sub-category error:", err);
        setSubCategories([]);
      }
    };

    fetchSubCategories();
  }, [newProduct.category]);

  const handleAddProductSubmit = async () => {
    setPosting(true);
    setPostError("");
    try {
      await api.post("/products", {
        name: newProduct.name,
        description: newProduct.description,
        sub_category_id: Number(newProduct.sub_category_id),
        skus: newProduct.skus.map((sku) => ({
          sku: sku.sku,
          price: Number(sku.price),
          quantity: Number(sku.quantity),
          description: sku.sku,
        })),
        is_active: true,
      });
      setNewProduct({
        name: "",
        category: "",
        sub_category_id: "",
        description: "",
        skus: [{ sku: "", price: "", quantity: "" }],
      });
      setAddDialogOpen(false);
      alert("Product added successfully!");
    } catch (err) {
      console.error(err);
      setPostError(err.response?.data?.message || "Failed to add product");
    } finally {
      setPosting(false);
    }
  };

  // Input styling like registration form in the image
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
                <DialogTitle className="text-xl font-bold text-white">
                  New Product
                </DialogTitle>
                <DialogDescription className="text-purple-200 text-sm">
                  Enter product details below.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Form */}
        <div className="px-6 py-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <form
            id="product-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleAddProductSubmit();
            }}
            className="space-y-5"
          >
            {/* Product Name */}
            <div>
              <label className={labelClass}>Product Name</label>
              <input
                type="text"
                placeholder="Wireless Headphones"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
                className={inputClass}
                required
              />
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Categories */}
              <div>
                <label className={labelClass}>Category</label>
                <select
                  value={newProduct.category}
                  onChange={(e) => {
                    console.log("Selected category ID:", e.target.value, typeof e.target.value);
                    // console.log("Selected category ID:", e.target.value); //
                    setNewProduct({
                      ...newProduct,
                      category: e.target.value,
                      sub_category_id: "", // reset sub-category
                    });
                  }}
                  className={`${inputClass} appearance-none cursor-pointer`}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* Sub Category */}
              <div>
                <label className={labelClass}>Sub-Category</label>
                <select
                  value={newProduct.sub_category_id}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      sub_category_id: e.target.value,
                    })
                  }
                  className={`${inputClass} appearance-none cursor-pointer`}
                  required
                  disabled={!subCategories.length}
                >
                  <option value="">
                    {subCategories.length ? "Select Sub-Category" : "No sub-categories"}
                  </option>

                  {subCategories.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            {/* Description */}
            <div>
              <label className={labelClass}>Description</label>
              <textarea
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, description: e.target.value })
                }
                placeholder="Enter product details..."
                className={`${inputClass} min-h-[100px] resize-none`}
              />
            </div>

            {/* SKU */}
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="SKU"
                value={newProduct.skus[0].sku}
                onChange={(e) => handleSkuChange("sku", e.target.value)}
                className="flex-1 px-3 py-3 rounded-lg border border-gray-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-200 outline-none"
                required
              />
              <input
                type="number"
                placeholder="Price"
                min="0"
                step="0.01"
                value={newProduct.skus[0].price}
                onChange={(e) => handleSkuChange("price", e.target.value)}
                className="w-24 px-3 py-3 rounded-lg border border-gray-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-200 outline-none"
                required
              />
              <input
                type="number"
                placeholder="Qty"
                min="0"
                value={newProduct.skus[0].quantity}
                onChange={(e) => handleSkuChange("quantity", e.target.value)}
                className="w-20 px-3 py-3 rounded-lg border border-gray-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-200 outline-none"
                required
              />
            </div>

            {postError && (
              <div className="p-2 text-red-600 bg-red-50 rounded-md text-sm">
                {postError}
              </div>
            )}
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
            {posting ? (
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save size={16} />
            )}
            {posting ? "Saving..." : "Create"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductsFormStyled;