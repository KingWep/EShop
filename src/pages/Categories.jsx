import { useEffect, useMemo, useState } from "react";
import { Package, Tags, XCircle, TrendingUp, TrendingDown, FolderPlus, FolderOpen, Pencil, Trash2, ChevronDown, AlertTriangle } from "lucide-react";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "../components/layouts/ui/dialog";

import CategoryForm from "../components/CategoryPage/CategoryForm";
import CategoriesList from "../components/CategoryPage/CategoriesList";
import CategoryPagination from "../components/CategoryPage/CategoryPagination";
import { useProducts } from "../context/ProductsContext.jsx";
import { createCategory, deleteCategory, getCategoriesAdmin, updateCategory } from "../services/admin/adminCategoryService";
import { createSubCategory, deleteSubCategory, getSubCategoryById, updateSubCategory } from "../services/admin/adminSubCategoryService";

// ─── Shared Design Tokens ───────────────────────────────────────────────────
const inputBase =
  "w-full px-4 py-2.5 rounded-xl border border-purple-500/20 bg-purple-950/40 text-white placeholder-purple-400/30 text-sm focus:border-purple-400/60 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all duration-200 hover:border-purple-400/30";

const Field = ({ label, children, hint }) => (
  <div className="space-y-1.5">
    <div className="flex items-center justify-between">
      <label className="text-[11px] font-bold tracking-[0.12em] uppercase text-purple-300/80">{label}</label>
      {hint && <span className="text-[10px] text-purple-400/50">{hint}</span>}
    </div>
    {children}
  </div>
);

const SelectField = ({ children, ...props }) => (
  <div className="relative">
    <select {...props} className={inputBase + " appearance-none pr-9 cursor-pointer"}>
      {children}
    </select>
    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400/50 pointer-events-none" />
  </div>
);

// ─── Reusable Purple Dialog Shell ───────────────────────────────────────────
const PurpleDialog = ({ open, onOpenChange, icon: Icon, iconColor = "bg-purple-600", title, subtitle, formId, onSubmit, saving, onCancel, submitLabel, children, maxWidth = "max-w-lg" }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className={`${maxWidth} p-0 overflow-hidden rounded-3xl border border-purple-500/20 bg-[#0f0a1e] shadow-[0_0_60px_rgba(139,92,246,0.15)]`}>

      {/* Header */}
      <div className="relative px-7 pt-7 pb-6 overflow-hidden">
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />
        <div className="absolute -top-6 left-1/2 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
        <DialogHeader>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className={`h-12 w-12 rounded-2xl ${iconColor} flex items-center justify-center shadow-lg shadow-purple-600/30`}>
                <Icon size={20} className="text-white" />
              </div>
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-white tracking-tight">{title}</DialogTitle>
              <DialogDescription className="text-purple-400/70 text-xs mt-0.5">{subtitle}</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="absolute bottom-0 left-7 right-7 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
      </div>

      {/* Body */}
      <div className="px-7 py-5 max-h-[60vh] overflow-y-auto
        [&::-webkit-scrollbar]:w-1
        [&::-webkit-scrollbar-track]:bg-transparent
        [&::-webkit-scrollbar-thumb]:bg-purple-500/30
        [&::-webkit-scrollbar-thumb]:rounded-full">
        {children}
      </div>

      {/* Footer */}
      <div className="relative px-7 py-5">
        <div className="absolute top-0 left-7 right-7 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
        <DialogFooter className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-purple-500/20 bg-purple-950/40 text-purple-300/70 text-sm font-medium hover:bg-purple-900/30 hover:text-purple-200 hover:border-purple-500/30 transition-all duration-200 disabled:opacity-40"
          >
            Cancel
          </button>
          {formId && (
            <button
              type="submit"
              form={formId}
              disabled={saving}
              className="relative flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 text-white text-sm font-semibold hover:bg-purple-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-purple-600/25 active:scale-[0.98]"
            >
              <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10" />
              {saving
                ? <><div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</>
                : submitLabel}
            </button>
          )}
        </DialogFooter>
      </div>
    </DialogContent>
  </Dialog>
);

// ─── Main Component ──────────────────────────────────────────────────────────
const Categories = () => {
  const { activeProducts, totalProducts, totalCategory, loading } = useProducts();

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [addCategoryOpen, setAddCategoryOpen] = useState(false);
  const [addSubCategoryOpen, setAddSubCategoryOpen] = useState(false);
  const [editCategoryOpen, setEditCategoryOpen] = useState(false);
  const [editSubCategoryOpen, setEditSubCategoryOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [subCategoryPopupOpen, setSubCategoryPopupOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const [loadingSubCategories, setLoadingSubCategories] = useState(false);
  const [subCategoryError, setSubCategoryError] = useState("");

  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [newSubCategory, setNewSubCategory] = useState({ name: "", description: "", category_id: "", image: null });
  const [editCategoryForm, setEditCategoryForm] = useState({ id: null, name: "", description: "" });
  const [editSubCategoryForm, setEditSubCategoryForm] = useState({ id: null, name: "", description: "", category_id: "", image: null });
  const [deleteTarget, setDeleteTarget] = useState({ type: null, id: null, name: "" });

  const itemsPerPage = 10;

  const getApiErrorMessage = (error, fallback) =>
    error?.data?.message || error?.data?.error?.message || error?.message || fallback;

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await getCategoriesAdmin();
      const rawItems = Array.isArray(response?.content) ? response.content : [];
      setCategories(rawItems.map((item) => item?.data || item).filter(Boolean));
    } catch (error) {
      setCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  };

  const normalizeSubCategories = (response) => {
    const payload = response?.data || response || {};
    const rawItems = payload?.subCategories || payload?.subcategories || payload?.content || [];
    if (!Array.isArray(rawItems)) return [];
    return rawItems.map((item) => item?.data || item).filter(Boolean).map((sub) => ({
      id: sub.id, name: sub.name || "Unnamed", description: sub.description || "-",
    }));
  };

  const fetchSubCategoriesForCategory = async (category) => {
    if (!category?.id) return;
    try {
      setSubCategoryError("");
      setLoadingSubCategories(true);
      const response = await getSubCategoryById(category.id);
      setSubCategories(normalizeSubCategories(response));
    } catch (error) {
      setSubCategories([]);
      setSubCategoryError(getApiErrorMessage(error, "Failed to load sub-categories."));
    } finally {
      setLoadingSubCategories(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const filtered = useMemo(() => categories.filter((c) => {
    const kw = search.toLowerCase();
    return String(c?.name || "").toLowerCase().includes(kw) || String(c?.description || "").toLowerCase().includes(kw);
  }), [categories, search]);

  useEffect(() => { setCurrentPage(1); }, [search]);

  if (loading) return <div className="p-6 text-purple-300/60">Loading categories...</div>;

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentCategories = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDeleteCategory = (category) => {
    setFormError("");
    setDeleteTarget({ type: "category", id: category?.id ?? null, name: category?.name || "this category" });
    setDeleteDialogOpen(true);
  };

  const performDeleteCategory = async (id) => {
    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
      if (selectedCategory?.id === id) { setSelectedCategory(null); setSubCategories([]); setSubCategoryError(""); }
    } catch (error) { setFormError(getApiErrorMessage(error, "Failed to delete category.")); }
  };

  const handleSelectCategory = async (category) => {
    setSelectedCategory(category);
    setSubCategoryPopupOpen(true);
    await fetchSubCategoriesForCategory(category);
  };

  const handleOpenEditCategory = (category) => {
    setFormError("");
    setEditCategoryForm({ id: category?.id || null, name: category?.name || "", description: category?.description || "" });
    setEditCategoryOpen(true);
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault(); setFormError("");
    if (!editCategoryForm.id || !editCategoryForm.name.trim()) { setFormError("Category name is required."); return; }
    try {
      setSaving(true);
      await updateCategory(editCategoryForm.id, { name: editCategoryForm.name.trim(), description: editCategoryForm.description.trim() });
      setEditCategoryOpen(false);
      await fetchCategories();
      if (selectedCategory?.id === editCategoryForm.id) setSelectedCategory({ ...selectedCategory, name: editCategoryForm.name.trim(), description: editCategoryForm.description.trim() });
    } catch (error) { setFormError(getApiErrorMessage(error, "Failed to update category.")); } finally { setSaving(false); }
  };

  const handleOpenEditSubCategory = (sub) => {
    setFormError("");
    setEditSubCategoryForm({ id: sub?.id || null, name: sub?.name || "", description: sub?.description === "-" ? "" : sub?.description || "", category_id: String(selectedCategory?.id || ""), image: null });
    setEditSubCategoryOpen(true);
  };

  const handleUpdateSubCategory = async (e) => {
    e.preventDefault(); setFormError("");
    if (!editSubCategoryForm.id || !editSubCategoryForm.name.trim()) { setFormError("Sub-category name is required."); return; }
    if (!editSubCategoryForm.category_id) { setFormError("Parent category is required."); return; }
    try {
      setSaving(true);
      await updateSubCategory(editSubCategoryForm.id, { name: editSubCategoryForm.name.trim(), description: editSubCategoryForm.description.trim(), categoryId: Number(editSubCategoryForm.category_id), image: editSubCategoryForm.image });
      setEditSubCategoryOpen(false);
      await fetchCategories();
      if (selectedCategory?.id) await fetchSubCategoriesForCategory(selectedCategory);
    } catch (error) { setFormError(getApiErrorMessage(error, "Failed to update sub-category.")); } finally { setSaving(false); }
  };

  const handleDeleteSubCategory = (sub) => {
    setFormError("");
    setDeleteTarget({ type: "sub-category", id: sub?.id ?? null, name: sub?.name || "this sub-category" });
    setDeleteDialogOpen(true);
  };

  const performDeleteSubCategory = async (id) => {
    try {
      setSaving(true);
      await deleteSubCategory(id);
      setSubCategories((prev) => prev.filter((sub) => sub.id !== id));
      await fetchCategories();
    } catch (error) { setFormError(getApiErrorMessage(error, "Failed to delete sub-category.")); } finally { setSaving(false); }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget?.id || !deleteTarget?.type) return;
    if (deleteTarget.type === "category") await performDeleteCategory(deleteTarget.id);
    if (deleteTarget.type === "sub-category") await performDeleteSubCategory(deleteTarget.id);
    setDeleteDialogOpen(false);
    setDeleteTarget({ type: null, id: null, name: "" });
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault(); setFormError("");
    if (!newCategory.name.trim()) { setFormError("Category name is required."); return; }
    try {
      setSaving(true);
      await createCategory({ name: newCategory.name.trim(), description: newCategory.description.trim() });
      setAddCategoryOpen(false);
      setNewCategory({ name: "", description: "" });
      await fetchCategories();
    } catch (error) { setFormError(getApiErrorMessage(error, "Failed to create category.")); } finally { setSaving(false); }
  };

  const handleCreateSubCategory = async (e) => {
    e.preventDefault(); setFormError("");
    if (!newSubCategory.name.trim() || !newSubCategory.category_id) { setFormError("Sub-category name and parent category are required."); return; }
    try {
      setSaving(true);
      await createSubCategory({ name: newSubCategory.name.trim(), description: newSubCategory.description.trim(), categoryId: Number(newSubCategory.category_id), image: newSubCategory.image });
      const selId = Number(newSubCategory.category_id);
      setAddSubCategoryOpen(false);
      setNewSubCategory({ name: "", description: "", category_id: "", image: null });
      await fetchCategories();
      if (selId && selectedCategory?.id === selId) await fetchSubCategoriesForCategory(selectedCategory);
    } catch (error) { setFormError(getApiErrorMessage(error, "Failed to create sub-category.")); } finally { setSaving(false); }
  };

  const ErrorBanner = ({ msg }) => msg ? (
    <div className="flex items-center gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
      <div className="h-1.5 w-1.5 rounded-full bg-red-400 shrink-0" />{msg}
    </div>
  ) : null;

  const stats = [
    { label: "Total Products", value: totalProducts, icon: Package, color: "text-purple-400", bg: "bg-purple-500/10", trend: true },
    { label: "Active Products", value: activeProducts.length, icon: Tags, color: "text-emerald-400", bg: "bg-emerald-500/10", trend: true },
    { label: "Inactive Products", value: totalProducts - activeProducts.length, icon: XCircle, color: "text-red-400", bg: "bg-red-500/10", trend: false },
    { label: "Total Categories", value: categories.length || totalCategory, icon: Tags, color: "text-purple-400", bg: "bg-purple-500/10", trend: true },
  ];

  return (
    <div className="space-y-7 p-5 sm:p-6 animate-fade-up">

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-purple-500/15 bg-[#0f0a1e]/80 p-5 flex flex-col justify-between shadow-sm hover:border-purple-500/30 hover:shadow-[0_0_20px_rgba(139,92,246,0.08)] transition-all duration-200">
            <div className="flex justify-between items-center">
              <div className={`h-9 w-9 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <span className={`flex items-center gap-1 text-xs font-semibold ${stat.trend ? "text-emerald-400" : "text-red-400"}`}>
                {stat.trend ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />} +0%
              </span>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold tracking-tight text-white">{stat.value.toLocaleString()}</p>
              <p className="text-[11px] font-bold tracking-[0.12em] uppercase text-purple-400/50 mt-1">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <CategoryForm search={search} setSearch={setSearch}
        onOpenAddCategory={() => { setFormError(""); setAddCategoryOpen(true); }}
        onOpenAddSubCategory={() => { setFormError(""); setAddSubCategoryOpen(true); }}
      />

      <CategoriesList categories={currentCategories} loading={loadingCategories}
        onDeleteCategory={handleDeleteCategory} onSelectCategory={handleSelectCategory}
        selectedCategoryId={selectedCategory?.id} onEditCategory={handleOpenEditCategory}
      />

      {/* Sub-categories popup */}
      <PurpleDialog
        open={subCategoryPopupOpen}
        onOpenChange={setSubCategoryPopupOpen}
        icon={FolderOpen}
        title="Sub-Categories"
        subtitle={selectedCategory ? `Category: ${selectedCategory.name}` : "Category details"}
        onCancel={() => setSubCategoryPopupOpen(false)}
        maxWidth="max-w-4xl"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-purple-300/70">
              {selectedCategory ? "Click edit or delete to manage sub-categories." : "Select a category first."}
            </p>
            <span className="inline-flex items-center rounded-full border border-purple-500/20 bg-purple-950/40 px-3 py-1 text-xs font-semibold text-purple-300/70">
              {subCategories.length} item{subCategories.length === 1 ? "" : "s"}
            </span>
          </div>

          {loadingSubCategories && <p className="text-sm text-purple-400/50 animate-pulse">Loading sub-categories...</p>}
          {!loadingSubCategories && subCategoryError && <p className="text-sm text-red-400">{subCategoryError}</p>}
          {!loadingSubCategories && !subCategoryError && subCategories.length === 0 && (
            <p className="text-sm text-purple-400/40">No sub-categories found.</p>
          )}

          {!loadingSubCategories && !subCategoryError && subCategories.length > 0 && (
            <div className="overflow-x-auto rounded-xl border border-purple-500/15 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-purple-500/15 bg-purple-950/20">
                    <th className="text-left px-5 py-3 text-[10px] font-bold tracking-[0.15em] uppercase text-purple-400/50">Name</th>
                    <th className="text-left px-4 py-3 text-[10px] font-bold tracking-[0.15em] uppercase text-purple-400/50">Description</th>
                    <th className="text-right px-5 py-3 text-[10px] font-bold tracking-[0.15em] uppercase text-purple-400/50">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subCategories.map((sub) => (
                    <tr key={sub.id} className="border-b border-purple-500/10 last:border-none hover:bg-purple-500/5 transition-colors duration-150">
                      <td className="px-5 py-3.5 font-semibold text-white">{sub.name}</td>
                      <td className="px-4 py-3.5 text-purple-400/60 text-xs">{sub.description}</td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEditSubCategory(sub)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-purple-500/20 bg-purple-950/40 text-purple-300/70 text-xs font-medium hover:bg-purple-900/30 hover:text-purple-200 hover:border-purple-500/30 transition-all duration-150"
                          >
                            <Pencil size={11} /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteSubCategory(sub)}
                            disabled={saving}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/20 bg-red-500/5 text-red-400/70 text-xs font-medium hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-all duration-150 disabled:opacity-40"
                          >
                            <Trash2 size={11} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </PurpleDialog>

      <CategoryPagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />

      {/* ── Add Category ──────────────────────────────── */}
      <PurpleDialog open={addCategoryOpen} onOpenChange={setAddCategoryOpen} icon={FolderPlus}
        title="Add Category" subtitle="Create a new parent category"
        formId="add-category-form" saving={saving} onCancel={() => setAddCategoryOpen(false)} submitLabel="Create Category">
        <form id="add-category-form" onSubmit={handleCreateCategory} className="space-y-4">
          <Field label="Category Name">
            <input type="text" value={newCategory.name}
              onChange={(e) => setNewCategory((p) => ({ ...p, name: e.target.value }))}
              className={inputBase} placeholder="e.g. Electronics" required />
          </Field>
          <Field label="Description" hint="Optional">
            <textarea value={newCategory.description}
              onChange={(e) => setNewCategory((p) => ({ ...p, description: e.target.value }))}
              className={inputBase + " min-h-[80px] resize-none leading-relaxed"} placeholder="Optional description" />
          </Field>
          <ErrorBanner msg={formError} />
        </form>
      </PurpleDialog>

      {/* ── Add Sub-Category ──────────────────────────── */}
      <PurpleDialog open={addSubCategoryOpen} onOpenChange={setAddSubCategoryOpen} icon={FolderOpen}
        title="Add Sub-Category" subtitle="Create a sub-category under an existing category"
        formId="add-sub-category-form" saving={saving} onCancel={() => setAddSubCategoryOpen(false)} submitLabel="Create Sub-Category">
        <form id="add-sub-category-form" onSubmit={handleCreateSubCategory} className="space-y-4">
          <Field label="Parent Category">
            <SelectField value={newSubCategory.category_id}
              onChange={(e) => setNewSubCategory((p) => ({ ...p, category_id: e.target.value }))} required>
              <option value="">Select category</option>
              {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </SelectField>
          </Field>
          <Field label="Sub-Category Name">
            <input type="text" value={newSubCategory.name}
              onChange={(e) => setNewSubCategory((p) => ({ ...p, name: e.target.value }))}
              className={inputBase} placeholder="e.g. Smartphones" required />
          </Field>
          <Field label="Description" hint="Optional">
            <textarea value={newSubCategory.description}
              onChange={(e) => setNewSubCategory((p) => ({ ...p, description: e.target.value }))}
              className={inputBase + " min-h-[80px] resize-none leading-relaxed"} placeholder="Optional description" />
          </Field>
          <Field label="Image" hint="Optional">
            <input type="file" accept="image/*"
              onChange={(e) => setNewSubCategory((p) => ({ ...p, image: e.target.files?.[0] || null }))}
              className="w-full text-sm text-purple-300/60 file:mr-3 file:rounded-lg file:border-0 file:bg-purple-600 file:px-3 file:py-2 file:text-white file:text-xs file:font-semibold file:cursor-pointer hover:file:bg-purple-500 transition-all" />
          </Field>
          <ErrorBanner msg={formError} />
        </form>
      </PurpleDialog>

      {/* ── Edit Category ─────────────────────────────── */}
      <PurpleDialog open={editCategoryOpen} onOpenChange={setEditCategoryOpen} icon={Pencil}
        title="Edit Category" subtitle={`Editing "${editCategoryForm.name}"`}
        formId="edit-category-form" saving={saving} onCancel={() => setEditCategoryOpen(false)} submitLabel="Save Changes">
        <form id="edit-category-form" onSubmit={handleUpdateCategory} className="space-y-4">
          <Field label="Category Name">
            <input type="text" value={editCategoryForm.name}
              onChange={(e) => setEditCategoryForm((p) => ({ ...p, name: e.target.value }))}
              className={inputBase} placeholder="e.g. Electronics" required />
          </Field>
          <Field label="Description" hint="Optional">
            <textarea value={editCategoryForm.description}
              onChange={(e) => setEditCategoryForm((p) => ({ ...p, description: e.target.value }))}
              className={inputBase + " min-h-[80px] resize-none leading-relaxed"} placeholder="Optional description" />
          </Field>
          <ErrorBanner msg={formError} />
        </form>
      </PurpleDialog>

      {/* ── Edit Sub-Category ─────────────────────────── */}
      <PurpleDialog open={editSubCategoryOpen} onOpenChange={setEditSubCategoryOpen} icon={Pencil}
        title="Edit Sub-Category" subtitle={`Editing "${editSubCategoryForm.name}"`}
        formId="edit-sub-category-form" saving={saving} onCancel={() => setEditSubCategoryOpen(false)} submitLabel="Save Changes">
        <form id="edit-sub-category-form" onSubmit={handleUpdateSubCategory} className="space-y-4">
          <Field label="Parent Category">
            <SelectField value={editSubCategoryForm.category_id}
              onChange={(e) => setEditSubCategoryForm((p) => ({ ...p, category_id: e.target.value }))} required>
              <option value="">Select category</option>
              {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </SelectField>
          </Field>
          <Field label="Sub-Category Name">
            <input type="text" value={editSubCategoryForm.name}
              onChange={(e) => setEditSubCategoryForm((p) => ({ ...p, name: e.target.value }))}
              className={inputBase} placeholder="e.g. Smartphones" required />
          </Field>
          <Field label="Description" hint="Optional">
            <textarea value={editSubCategoryForm.description}
              onChange={(e) => setEditSubCategoryForm((p) => ({ ...p, description: e.target.value }))}
              className={inputBase + " min-h-[80px] resize-none leading-relaxed"} placeholder="Optional description" />
          </Field>
          <Field label="Replace Image" hint="Optional">
            <input type="file" accept="image/*"
              onChange={(e) => setEditSubCategoryForm((p) => ({ ...p, image: e.target.files?.[0] || null }))}
              className="w-full text-sm text-purple-300/60 file:mr-3 file:rounded-lg file:border-0 file:bg-purple-600 file:px-3 file:py-2 file:text-white file:text-xs file:font-semibold file:cursor-pointer hover:file:bg-purple-500 transition-all" />
          </Field>
          <ErrorBanner msg={formError} />
        </form>
      </PurpleDialog>

      {/* ── Delete Confirm ────────────────────────────── */}
      <Dialog open={deleteDialogOpen} onOpenChange={(open) => { setDeleteDialogOpen(open); if (!open) setDeleteTarget({ type: null, id: null, name: "" }); }}>
        <DialogContent className="max-w-sm p-0 overflow-hidden rounded-3xl border border-red-500/20 bg-[#0f0a1e] shadow-[0_0_60px_rgba(239,68,68,0.1)]">
          <div className="relative px-7 pt-7 pb-6 overflow-hidden">
            <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-red-600/10 blur-3xl pointer-events-none" />
            <div className="absolute -top-6 left-1/2 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="h-12 w-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <AlertTriangle size={20} className="text-red-400" />
                </div>
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-white tracking-tight">Confirm Delete</DialogTitle>
                <DialogDescription className="text-purple-400/70 text-xs mt-0.5">This action cannot be undone</DialogDescription>
              </div>
            </div>
            <div className="absolute bottom-0 left-7 right-7 h-px bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />
          </div>

          <div className="px-7 py-5">
            <p className="text-sm text-purple-200/70">
              This will permanently delete{" "}
              <span className="font-bold text-white">"{deleteTarget.name}"</span>.
              Are you sure?
            </p>
          </div>

          <div className="relative px-7 py-5">
            <div className="absolute top-0 left-7 right-7 h-px bg-gradient-to-r from-transparent via-red-500/10 to-transparent" />
            <DialogFooter className="flex items-center justify-end gap-3">
              <button type="button" onClick={() => setDeleteDialogOpen(false)} disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-purple-500/20 bg-purple-950/40 text-purple-300/70 text-sm font-medium hover:bg-purple-900/30 hover:text-purple-200 transition-all duration-200 disabled:opacity-40">
                Cancel
              </button>
              <button type="button" onClick={handleConfirmDelete} disabled={saving}
                className="relative flex items-center gap-2 px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-semibold disabled:opacity-60 transition-all duration-200 shadow-lg shadow-red-600/20 active:scale-[0.98]">
                <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10" />
                {saving ? <><div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Deleting…</> : <><Trash2 size={14} /> Delete</>}
              </button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default Categories;