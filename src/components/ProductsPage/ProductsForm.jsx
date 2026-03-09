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
import { Package, Save, X, ChevronDown } from "lucide-react";

import { createProduct } from "../../services/admin/adminProductService";
import { getCategoriesAdmin } from "../../services/admin/adminCategoryService";
import { getSubCategoryById } from "../../services/admin/adminSubCategoryService";

const Field = ({ label, children, hint }) => (
  <div className="space-y-1.5">
    <div className="flex items-center justify-between">
      <label className="text-[11px] font-bold tracking-[0.12em] uppercase text-purple-300/80">{label}</label>
      {hint && <span className="text-[10px] text-purple-400/50">{hint}</span>}
    </div>
    {children}
  </div>
);

const inputBase =
  "w-full px-4 py-2.5 rounded-xl border border-purple-500/20 bg-purple-950/40 text-white placeholder-purple-400/30 text-sm focus:border-purple-400/60 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all duration-200 hover:border-purple-400/30";

const SelectWrapper = ({ children, ...props }) => (
  <div className="relative">
    <select
      {...props}
      className={inputBase + " appearance-none pr-9 cursor-pointer"}
    >
      {children}
    </select>
    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400/50 pointer-events-none" />
  </div>
);

const ProductsFormStyled = ({ addDialogOpen, setAddDialogOpen, onProductAdded }) => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    skus: [{ sku: "", description: "", price: "", color: "", size: "", quantity: "" }],
    is_active: true,
    sub_category_id: "",
  });

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState("");

  useEffect(() => {
    if (!addDialogOpen) return;
    const fetchCategories = async () => {
      try {
        const res = await getCategoriesAdmin();
        const categoryList = Array.isArray(res.content) ? res.content.map((item) => item.data) : [];
        setCategories(categoryList);
      } catch (err) { console.error(err); }
    };
    fetchCategories();
  }, [addDialogOpen]);

  useEffect(() => {
    if (!newProduct.category) { setSubCategories([]); return; }
    const fetchSubCategories = async () => {
      try {
        const res = await getSubCategoryById(Number(newProduct.category));
        const subCatList = Array.isArray(res.data.subCategories)
          ? res.data.subCategories.map((item) => ({ id: item.data.id, name: item.data.name }))
          : [];
        setSubCategories(subCatList);
      } catch (err) { setSubCategories([]); }
    };
    fetchSubCategories();
  }, [newProduct.category]);

  const handleSkuChange = (field, value) => {
    const updatedSkus = [...newProduct.skus];
    updatedSkus[0] = { ...updatedSkus[0], [field]: value };
    setNewProduct({ ...newProduct, skus: updatedSkus });
  };

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
      setNewProduct({ name: "", description: "", category: "", sub_category_id: "", is_active: true, skus: [{ sku: "", description: "", price: "", quantity: "", color: "", size: "" }] });
      setAddDialogOpen(false);
      if (onProductAdded) onProductAdded();
    } catch (err) {
      setPostError(err.data?.message || err.message || "Failed to add product");
    } finally {
      setPosting(false);
    }
  };

  return (
    <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
      <DialogContent className="w-[80vw] max-w-xl p-0 overflow-hidden rounded-3xl border border-purple-500/20 bg-[#0f0a1e] shadow-[0_0_60px_rgba(139,92,246,0.15)]">

        {/* Header */}
        <div className="relative overflow-hidden">
          {/* Glow orb */}
          <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />
          <div className="absolute -top-6 left-1/2 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />

          <DialogHeader>
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="h-12 w-12 rounded-2xl bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-600/30">
                  <Package size={20} className="text-white" />
                </div>
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-white tracking-tight">New Product</DialogTitle>
                <DialogDescription className="text-purple-400/70 text-xs mt-0.5">
                  Fill in the details to add to your catalog
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Divider */}
          <div className="absolute bottom-0 left-7 right-7 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
        </div>

        {/* Form Body */}
        <div className="px-7 py-5 max-h-[60vh] overflow-y-auto space-y-5
          [&::-webkit-scrollbar]:w-1
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:bg-purple-500/30
          [&::-webkit-scrollbar-thumb]:rounded-full">

          <form id="product-form" onSubmit={(e) => { e.preventDefault(); handleAddProductSubmit(); }} className="space-y-4">

            {/* Product Name */}
            <Field label="Product Name">
              <input
                type="text"
                placeholder="e.g. Wireless Headphones"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className={inputBase}
                required
              />
            </Field>

            {/* Category row */}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Category">
                <SelectWrapper
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value, sub_category_id: "" })}
                  required
                >
                  <option value="">Select…</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </SelectWrapper>
              </Field>

              <Field label="Sub-Category">
                <SelectWrapper
                  value={newProduct.sub_category_id}
                  onChange={(e) => setNewProduct({ ...newProduct, sub_category_id: e.target.value })}
                  required
                  disabled={!subCategories.length}
                >
                  <option value="">{subCategories.length ? "Select…" : "N/A"}</option>
                  {subCategories.map((sub) => (
                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                  ))}
                </SelectWrapper>
              </Field>
            </div>

            {/* SKU / Price / Qty */}
            <div className="rounded-2xl border border-purple-500/15 bg-purple-950/20 p-4 space-y-3">
              <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-purple-400/50">SKU Details</p>
              <div className="grid grid-cols-12 gap-3">
                <div className="col-span-6">
                  <Field label="SKU Code">
                    <input
                      type="text"
                      placeholder="SKU-123"
                      value={newProduct.skus[0].sku}
                      onChange={(e) => handleSkuChange("sku", e.target.value)}
                      className={inputBase}
                      required
                    />
                  </Field>
                </div>
                <div className="col-span-3">
                  <Field label="Price">
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400/50 text-xs font-medium">$</span>
                      <input
                        type="number"
                        placeholder="0.00"
                        min="0.00"
                        step="0.01"
                        value={newProduct.skus[0].price}
                        onChange={(e) => handleSkuChange("price", e.target.value)}
                        className={inputBase + " pl-7"}
                        required
                      />
                    </div>
                  </Field>
                </div>
                <div className="col-span-3">
                  <Field label="Qty">
                    <input
                      type="number"
                      placeholder="0"
                      min="1"
                      value={newProduct.skus[0].quantity}
                      onChange={(e) => handleSkuChange("quantity", e.target.value)}
                      className={inputBase}
                      required
                    />
                  </Field>
                </div>
              </div>
            </div>

            {/* Color & Size */}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Color">
                <SelectWrapper
                  value={newProduct.skus[0].color}
                  onChange={(e) => handleSkuChange("color", e.target.value)}
                  required
                >
                  <option value="">Select Color</option>
                  {["Black", "White", "Red", "Blue", "Green", "Yellow", "Purple"].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </SelectWrapper>
              </Field>
              <Field label="Size">
                <input
                  type="text"
                  placeholder="e.g. M, XL, 42"
                  value={newProduct.skus[0].size}
                  onChange={(e) => handleSkuChange("size", e.target.value)}
                  className={inputBase}
                  required
                />
              </Field>
            </div>

            {/* Description */}
            <Field label="Description" hint="Optional">
              <textarea
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                placeholder="Describe this product…"
                className={inputBase + " min-h-[80px] resize-none leading-relaxed"}
              />
            </Field>

            {/* Error */}
            {postError && (
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                <div className="h-1.5 w-1.5 rounded-full bg-red-400 shrink-0" />
                {postError}
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="relative px-7 py-5">
          <div className="absolute top-0 left-7 right-7 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
          <DialogFooter className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setAddDialogOpen(false)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-purple-500/20 bg-purple-950/40 text-purple-300/70 text-sm font-medium hover:bg-purple-900/30 hover:text-purple-200 hover:border-purple-500/30 transition-all duration-200"
            >
              <X size={14} />
              Cancel
            </button>
            <button
              type="submit"
              form="product-form"
              disabled={posting}
              className="relative flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 text-white text-sm font-semibold hover:bg-purple-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-purple-600/25 hover:shadow-purple-500/30 active:scale-[0.98]"
            >
              <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10" />
              {posting
                ? <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <Save size={14} />}
              {posting ? "Saving…" : "Create Product"}
            </button>
          </DialogFooter>
        </div>

      </DialogContent>
    </Dialog>
  );
};

export default ProductsFormStyled;