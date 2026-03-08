// ProductsEditForm.jsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "../layouts/ui/dialog";
import { Save, X, ChevronDown, Pencil } from "lucide-react";

import { getCategoriesAdmin } from "../../services/admin/adminCategoryService";
import { getSubCategoryById } from "../../services/admin/adminSubCategoryService";
import { addProductImage, updateProduct } from "../../services/admin/adminProductService";

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
    <select {...props} className={inputBase + " appearance-none pr-9 cursor-pointer"}>
      {children}
    </select>
    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400/50 pointer-events-none" />
  </div>
);

const isPreviewImage = (value) => {
  const text = String(value || "").trim();
  if (!text) return false;
  return /^(https?:\/\/|blob:|data:image\/|\/)/.test(text);
};

const ProductsEditForm = ({ editDialogOpen, setEditDialogOpen, productToEdit, onSuccess }) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    sub_category_id: "",
    skus: [{ sku_id: "", sku: "", description: "", price: "", color: "", size: "", quantity: "" }],
    is_active: true,
  });

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // FIX 1: Fetch subcategories FIRST, then set form
  useEffect(() => {
    if (!productToEdit || !editDialogOpen) return;

    setPostError("");
    setImageFile(null);
    setImagePreview(typeof productToEdit.image === "string" ? productToEdit.image : "");

    const baseForm = {
      name: productToEdit.name || "",
      description: productToEdit.description || "",
      category: productToEdit.categoryId || "",
      sub_category_id: productToEdit.sub_category_id || "",
      is_active: productToEdit.is_active ?? true,
      skus: [{
        sku_id: productToEdit.skuId || "",
        sku: productToEdit.sku || "",
        description: productToEdit.skuDescription || "",
        price: productToEdit.rawPrice || "",
        color: productToEdit.color || "",
        size: productToEdit.size || "",
        quantity: productToEdit.stock || "",
      }],
    };

    if (productToEdit.categoryId) {
      getSubCategoryById(Number(productToEdit.categoryId))
        .then((res) => {
          const list = Array.isArray(res.data.subCategories)
            ? res.data.subCategories.map((i) => ({ id: i.data.id, name: i.data.name }))
            : [];
          setSubCategories(list);
        })
        .catch(() => setSubCategories([]))
        .finally(() => setForm(baseForm)); // set form AFTER subcategories loaded
    } else {
      setSubCategories([]);
      setForm(baseForm);
    }
  }, [productToEdit, editDialogOpen]);

  // Refresh subcategories when user manually changes category
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

  useEffect(() => {
    if (!imageFile) return;
    const localUrl = URL.createObjectURL(imageFile);
    setImagePreview(localUrl);
    return () => URL.revokeObjectURL(localUrl);
  }, [imageFile]);

  useEffect(() => {
    if (!editDialogOpen) return;
    getCategoriesAdmin()
      .then((res) => {
        const list = Array.isArray(res.content) ? res.content.map((i) => i.data) : [];
        setCategories(list);
      })
      .catch(console.error);
  }, [editDialogOpen]);

  const handleSkuChange = (field, value) => {
    const skus = [...form.skus];
    skus[0] = { ...skus[0], [field]: value };
    setForm({ ...form, skus });
  };

  const handleSubmit = async () => {
    setPosting(true);
    setPostError("");

    const priceValue = Number(form.skus[0]?.price);
    const qtyValue = Number(form.skus[0]?.quantity);
    const subCategoryId = Number(form.sub_category_id);

    if (!Number.isFinite(subCategoryId) || subCategoryId <= 0) {
      setPostError("Please select a valid sub-category.");
      setPosting(false);
      return;
    }

    if (!Number.isFinite(priceValue) || priceValue < 0) {
      setPostError("Please enter a valid SKU price.");
      setPosting(false);
      return;
    }

    if (!Number.isFinite(qtyValue) || qtyValue < 0) {
      setPostError("Please enter a valid SKU quantity.");
      setPosting(false);
      return;
    }

    try {
      const payload = {
        name: String(form.name || "").trim(),
        description: String(form.description || "").trim(),
        sub_category_id: subCategoryId,
        is_active: form.is_active,
        skus: [
          {
            sku: String(form.skus[0]?.sku || "").trim(),
            description: String(form.skus[0]?.description || form.skus[0]?.sku || "").trim(),
            price: priceValue,
            color: form.skus[0]?.color || "",
            size: form.skus[0]?.size || "",
            quantity: qtyValue,
          },
        ],
      };

      await updateProduct(productToEdit.id, payload);

      if (imageFile) {
        await addProductImage(productToEdit.id, imageFile);
      }

      setEditDialogOpen(false);
      onSuccess?.();
    } catch (err) {
      setPostError(err?.data?.message || err?.message || "Failed to update product");
    } finally {
      setPosting(false);
    }
  };

  return (
    <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
      <DialogContent className="w-[80vw] max-w-xl p-0 overflow-hidden rounded-3xl border border-purple-500/20 bg-[#0f0a1e] shadow-[0_0_60px_rgba(139,92,246,0.15)]">

        <div className="relative px-7 pt-7 pb-6 overflow-hidden">
          <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />
          <div className="absolute -top-6 left-1/2 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />

          <DialogHeader>
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="h-12 w-12 rounded-2xl bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-600/30">
                  <Pencil size={18} className="text-white" />
                </div>
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-white tracking-tight">Edit Product</DialogTitle>
                <DialogDescription className="text-purple-400/70 text-xs mt-0.5">
                  {productToEdit?.name ? `Editing "${productToEdit.name}"` : "Update the product details below"}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="absolute bottom-0 left-7 right-7 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
        </div>

        <div className="px-7 py-5 max-h-[60vh] overflow-y-auto space-y-5
          [&::-webkit-scrollbar]:w-1
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:bg-purple-500/30
          [&::-webkit-scrollbar-thumb]:rounded-full">

          <form
            id="edit-product-form"
            onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
            className="space-y-4"
          >
            <Field label="Product Name">
              <input
                type="text"
                placeholder="e.g. Wireless Headphones"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputBase}
                required
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Category">
                <SelectWrapper
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value, sub_category_id: "" })}
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
                  value={form.sub_category_id}
                  onChange={(e) => setForm({ ...form, sub_category_id: e.target.value })}
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

            <div className="rounded-2xl border border-purple-500/15 bg-purple-950/20 p-4 space-y-3">
              <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-purple-400/50">SKU Details</p>
              <div className="grid grid-cols-12 gap-3">
                <div className="col-span-6">
                  <Field label="SKU Code">
                    <input
                      type="text"
                      placeholder="SKU-123"
                      value={form.skus[0].sku}
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
                        min="0"
                        step="0.01"
                        value={form.skus[0].price}
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
                      min="0"
                      value={form.skus[0].quantity}
                      onChange={(e) => handleSkuChange("quantity", e.target.value)}
                      className={inputBase}
                      required
                    />
                  </Field>
                </div>
              </div>

              <Field label="SKU Description" hint="Optional">
                <input
                  type="text"
                  placeholder="Describe this SKU"
                  value={form.skus[0].description}
                  onChange={(e) => handleSkuChange("description", e.target.value)}
                  className={inputBase}
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Color">
                <SelectWrapper
                  value={form.skus[0].color}
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
                  value={form.skus[0].size}
                  onChange={(e) => handleSkuChange("size", e.target.value)}
                  className={inputBase}
                  required
                />
              </Field>
            </div>

            <Field label="Description" hint="Optional">
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe this product…"
                className={inputBase + " min-h-[80px] resize-none leading-relaxed"}
              />
            </Field>

            <Field label="Product Image" hint="Optional">
              <div className="space-y-3">
                {isPreviewImage(imagePreview) && (
                  <div className="h-24 w-24 overflow-hidden rounded-xl border border-purple-500/20 bg-purple-950/30">
                    <img src={imagePreview} alt="Product preview" className="h-full w-full object-cover" />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="w-full text-sm text-purple-300/60 file:mr-3 file:rounded-lg file:border-0 file:bg-purple-600 file:px-3 file:py-2 file:text-white file:text-xs file:font-semibold file:cursor-pointer hover:file:bg-purple-500 transition-all"
                />
              </div>
            </Field>

            <div className="flex items-center justify-between rounded-xl border border-purple-500/20 bg-purple-950/40 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-white">Active listing</p>
                <p className="text-[11px] text-purple-400/50 mt-0.5">Product is visible in the catalog</p>
              </div>
              <button
                type="button"
                onClick={() => setForm({ ...form, is_active: !form.is_active })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
                  form.is_active ? "bg-purple-600" : "bg-purple-950 border border-purple-500/30"
                }`}
              >
                <span className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${
                  form.is_active ? "translate-x-6" : "translate-x-1"
                }`} />
              </button>
            </div>

            {postError && (
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                <div className="h-1.5 w-1.5 rounded-full bg-red-400 shrink-0" />
                {postError}
              </div>
            )}
          </form>
        </div>

        <div className="relative px-7 py-5">
          <div className="absolute top-0 left-7 right-7 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
          <DialogFooter className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setEditDialogOpen(false)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-purple-500/20 bg-purple-950/40 text-purple-300/70 text-sm font-medium hover:bg-purple-900/30 hover:text-purple-200 hover:border-purple-500/30 transition-all duration-200"
            >
              <X size={14} />
              Cancel
            </button>
            <button
              type="submit"
              form="edit-product-form"
              disabled={posting}
              className="relative flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 text-white text-sm font-semibold hover:bg-purple-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-purple-600/25 hover:shadow-purple-500/30 active:scale-[0.98]"
            >
              <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10" />
              {posting
                ? <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <Save size={14} />}
              {posting ? "Saving…" : "Save Changes"}
            </button>
          </DialogFooter>
        </div>

      </DialogContent>
    </Dialog>
  );
};

export default ProductsEditForm;