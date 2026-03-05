import { useState, useEffect } from "react";
import { MoreVertical, Edit2, Trash2 } from "../icons";
import { getCategoriesAdmin, deleteCategory } from "../../services/admin/adminCategoryService";

const CategoriesList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openMenu, setOpenMenu] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await getCategoriesAdmin();
        console.log("Fetched Categories:", response);

        const categoryList = Array.isArray(response.content)
          ? response.content.map(item => item.data)
          : [];

        console.log("Parsed categories:", categoryList);
        setCategories(categoryList); // ✅ Fixed: was missing before
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await deleteCategory(id);
      setCategories(categories.filter(cat => cat.id !== id));
    } catch (error) {
      console.error("Failed to delete category:", error);
    }
  };

  if (loading) {
    return <div className="text-center p-10">Loading categories...</div>;
  }

  if (!categories.length) {
    return <div className="text-center p-10">No categories found.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {categories.map((cat) => {
        const stockPct = cat.products ? Math.round((cat.inStock / cat.products) * 100) : 0;

        return (
          <div
            key={cat.id}
            className="glass-card p-5 group hover:border-primary/30 transition-all duration-300 relative"
          >
            {/* Menu */}
            <div className="absolute top-3 right-3">
              <button
                onClick={() => setOpenMenu(openMenu === cat.id ? null : cat.id)}
                className="p-1.5 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors opacity-0 group-hover:opacity-100"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
              {openMenu === cat.id && (
                <div className="absolute right-0 top-8 w-36 glass-card py-1 z-10 animate-scale-in">
                  <button className="flex items-center gap-2 w-full px-3 py-2 text-xs text-foreground hover:bg-secondary transition-colors">
                    <Edit2 className="w-3.5 h-3.5" /> Edit Category
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="flex items-center gap-2 w-full px-3 py-2 text-xs text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              )}
            </div>

            {/* Icon */}
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
              style={{ background: `${cat.color || "#ccc"}18`, border: `1px solid ${cat.color || "#ccc"}30` }}
            >
              {cat.emoji || "📦"}
            </div>

            {/* Info */}
            <h3 className="font-semibold text-foreground text-sm">{cat.name || "Unnamed"}</h3>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">
              {cat.description || "-"}
            </p>

            {/* Stats */}
            <div className="mt-4 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{cat.products || 0} products</span>
              <span className="font-medium" style={{ color: cat.color || "#000" }}>
                {stockPct}% in stock
              </span>
            </div>

            {/* Stock bar */}
            <div className="mt-2 h-1.5 rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${stockPct}%`, background: cat.color || "#000" }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CategoriesList;
