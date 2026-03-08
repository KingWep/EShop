import { useState } from "react";
import { MoreVertical, Edit2, Trash2 } from "../icons";

const CategoriesList = ({
  categories = [],
  loading = false,
  onDeleteCategory,
  onSelectCategory,
  selectedCategoryId,
  onEditCategory,
}) => {
  const [openMenu, setOpenMenu] = useState(null);

  if (loading) {
    return <div className="rounded-2xl border border-border/70 bg-card p-10 text-center text-sm text-muted-foreground">Loading categories...</div>;
  }

  if (!categories.length) {
    return <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">No categories found.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {categories.map((cat) => {
        const productsCount = Number(cat.products || cat.product_count || 0);
        const inStockCount = Number(cat.inStock || cat.in_stock || 0);
        const stockPct = productsCount ? Math.round((inStockCount / productsCount) * 100) : 0;

        return (
          <div
            key={cat.id}
            className={`glass-card p-5 group transition-all duration-300 relative cursor-pointer ${
              selectedCategoryId === cat.id
                ? "border border-primary/60 ring-2 ring-primary/20 shadow-lg"
                : "border border-border/60 hover:border-primary/30 hover:-translate-y-0.5"
            }`}
            onClick={() => onSelectCategory?.(cat)}
          >
            {/* Menu */}
            <div className="absolute top-3 right-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenMenu(openMenu === cat.id ? null : cat.id);
                }}
                className="p-1.5 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors opacity-0 group-hover:opacity-100"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
              {openMenu === cat.id && (
                <div className="absolute right-0 top-8 w-36 glass-card py-1 z-10 animate-scale-in">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenu(null);
                      onEditCategory?.(cat);
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-xs text-foreground hover:bg-secondary transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit Category
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenu(null);
                      onDeleteCategory?.(cat);
                    }}
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
            <h3 className="font-semibold text-foreground text-sm tracking-tight">{cat.name || "Unnamed"}</h3>
            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed line-clamp-2 min-h-9">
              {cat.description || "-"}
            </p>

            {/* Stats */}
            <div className="mt-5 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{productsCount} products</span>
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
