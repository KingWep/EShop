import { useState } from "react";
import { Plus, Search, Edit2, Trash2, Tag, Package, MoreVertical } from "../components/icons";

const categories = [
  {
    id: 1,
    name: "Electronics",
    description: "Computers, phones, tablets, and electronic gadgets",
    emoji: "💻",
    products: 842,
    inStock: 720,
    color: "hsl(200 80% 55%)",
  },
  {
    id: 2,
    name: "Accessories",
    description: "Cables, cases, chargers, and device accessories",
    emoji: "🎒",
    products: 314,
    inStock: 291,
    color: "hsl(262 83% 58%)",
  },
  {
    id: 3,
    name: "Peripherals",
    description: "Keyboards, mice, headphones, and input devices",
    emoji: "🖱️",
    products: 276,
    inStock: 230,
    color: "hsl(142 71% 45%)",
  },
  {
    id: 4,
    name: "Furniture",
    description: "Desks, chairs, stands, and office furniture",
    emoji: "🪑",
    products: 198,
    inStock: 162,
    color: "hsl(38 92% 50%)",
  },
  {
    id: 5,
    name: "Lighting",
    description: "LED lamps, smart lights, and lighting accessories",
    emoji: "💡",
    products: 143,
    inStock: 119,
    color: "hsl(48 96% 53%)",
  },
  {
    id: 6,
    name: "Storage",
    description: "SSDs, HDDs, USB drives, and memory cards",
    emoji: "💾",
    products: 217,
    inStock: 198,
    color: "hsl(280 83% 60%)",
  },
  {
    id: 7,
    name: "Networking",
    description: "Routers, switches, cables, and network gear",
    emoji: "📡",
    products: 89,
    inStock: 76,
    color: "hsl(160 84% 39%)",
  },
  {
    id: 8,
    name: "Audio",
    description: "Speakers, microphones, and audio equipment",
    emoji: "🎵",
    products: 168,
    inStock: 140,
    color: "hsl(0 84% 60%)",
  },
];

const Categories = () => {
  const [search, setSearch] = useState("");
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Categories</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your product categories · {categories.length} total
          </p>
        </div>
        <button className="btn-primary flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold">
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {/* Search */}
      <div className="glass-card p-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-4 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
      </div>

      {/* Summary chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Categories", value: categories.length, icon: Tag, color: "hsl(262 83% 58%)" },
          { label: "Total Products", value: categories.reduce((s, c) => s + c.products, 0).toLocaleString(), icon: Package, color: "hsl(142 71% 45%)" },
          { label: "In Stock", value: categories.reduce((s, c) => s + c.inStock, 0).toLocaleString(), icon: Package, color: "hsl(200 80% 55%)" },
          { label: "Out of Stock", value: categories.reduce((s, c) => s + (c.products - c.inStock), 0), icon: Package, color: "hsl(0 84% 60%)" },
        ].map((item) => (
          <div key={item.label} className="stat-card">
            <div className="flex items-center gap-3">
              <div
                className="icon-bg w-9 h-9"
                style={{ background: `${item.color}1a`, borderColor: `${item.color}33` }}
              >
                <item.icon className="w-4 h-4" style={{ color: item.color }} />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground leading-tight">{item.value}</p>
                <p className="text-[11px] text-muted-foreground">{item.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Category grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {filtered.map((cat) => {
          const stockPct = Math.round((cat.inStock / cat.products) * 100);
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
                    <button className="flex items-center gap-2 w-full px-3 py-2 text-xs text-destructive hover:bg-destructive/10 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                )}
              </div>

              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                style={{ background: `${cat.color}18`, border: `1px solid ${cat.color}30` }}
              >
                {cat.emoji}
              </div>

              {/* Info */}
              <h3 className="font-semibold text-foreground text-sm">{cat.name}</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">{cat.description}</p>

              {/* Stats */}
              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{cat.products} products</span>
                <span className="font-medium" style={{ color: cat.color }}>{stockPct}% in stock</span>
              </div>

              {/* Stock bar */}
              <div className="mt-2 h-1.5 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${stockPct}%`, background: cat.color }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="glass-card p-12 text-center">
          <Tag className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm font-medium text-foreground">No categories found</p>
          <p className="text-xs text-muted-foreground mt-1">Try adjusting your search</p>
        </div>
      )}
    </div>
  );
};

export default Categories;
