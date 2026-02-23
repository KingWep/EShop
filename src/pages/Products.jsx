import { useState } from "react";
import { Plus, Search, Filter, Edit2, Trash2, ChevronDown } from "../components/icons";

const products = [
  {
    id: 1,
    name: "Wireless Keyboard Pro",
    image: "⌨️",
    sku: "WK-PRO-001",
    category: "Electronics",
    price: "$89.99",
    stock: 243,
    status: "in-stock",
  },
  {
    id: 2,
    name: "USB-C Hub 7-in-1",
    image: "🔌",
    sku: "UC-HUB-007",
    category: "Accessories",
    price: "$49.99",
    stock: 38,
    status: "low-stock",
  },
  {
    id: 3,
    name: "Ergonomic Mouse",
    image: "🖱️",
    sku: "EM-MOU-002",
    category: "Peripherals",
    price: "$59.99",
    stock: 0,
    status: "out-of-stock",
  },
  {
    id: 4,
    name: "Monitor Stand Adjustable",
    image: "🖥️",
    sku: "MS-STD-003",
    category: "Furniture",
    price: "$79.99",
    stock: 189,
    status: "in-stock",
  },
  {
    id: 5,
    name: "Mechanical Numpad",
    image: "🔢",
    sku: "MN-PAD-004",
    category: "Peripherals",
    price: "$39.99",
    stock: 22,
    status: "low-stock",
  },
  {
    id: 6,
    name: "Cable Management Kit",
    image: "🗂️",
    sku: "CM-KIT-005",
    category: "Accessories",
    price: "$19.99",
    stock: 512,
    status: "in-stock",
  },
  {
    id: 7,
    name: "Desk Lamp LED Smart",
    image: "💡",
    sku: "DL-LED-006",
    category: "Lighting",
    price: "$44.99",
    stock: 0,
    status: "out-of-stock",
  },
  {
    id: 8,
    name: "Webcam 4K Ultra",
    image: "📷",
    sku: "WC-4K-008",
    category: "Electronics",
    price: "$129.99",
    stock: 67,
    status: "in-stock",
  },
];

const statusLabel = {
  "in-stock": { label: "In Stock", cls: "badge-in-stock" },
  "low-stock": { label: "Low Stock", cls: "badge-low-stock" },
  "out-of-stock": { label: "Out of Stock", cls: "badge-out-of-stock" },
};

const Products = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || p.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-5 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Products</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your product catalog · {products.length} items
          </p>
        </div>
        <button className="btn-primary flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold">
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-4 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>

        {/* Status filter */}
        <div className="relative">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="appearance-none h-9 pl-3 pr-8 rounded-lg bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer transition-all"
          >
            <option value="all">All Status</option>
            <option value="in-stock">In Stock</option>
            <option value="low-stock">Low Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>

        <button className="flex items-center gap-2 px-3 h-9 rounded-lg border border-border bg-secondary hover:bg-accent/10 text-sm text-muted-foreground transition-colors">
          <Filter className="w-4 h-4" />
          More Filters
        </button>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                {["Product", "SKU", "Category", "Price", "Stock", "Status", "Actions"].map((h) => (
                  <th
                    key={h}
                    className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((product) => (
                <tr key={product.id} className="table-row-hover">
                  {/* Product */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center text-xl flex-shrink-0">
                        {product.image}
                      </div>
                      <span className="font-medium text-foreground whitespace-nowrap">
                        {product.name}
                      </span>
                    </div>
                  </td>
                  {/* SKU */}
                  <td className="px-5 py-4 text-muted-foreground font-mono text-xs">
                    {product.sku}
                  </td>
                  {/* Category */}
                  <td className="px-5 py-4">
                    <span className="px-2 py-1 rounded-md bg-accent/30 text-accent-foreground text-xs font-medium">
                      {product.category}
                    </span>
                  </td>
                  {/* Price */}
                  <td className="px-5 py-4 font-semibold text-foreground">{product.price}</td>
                  {/* Stock */}
                  <td className="px-5 py-4 text-muted-foreground">{product.stock}</td>
                  {/* Status */}
                  <td className="px-5 py-4">
                    <span className={statusLabel[product.status].cls}>
                      {statusLabel[product.status].label}
                    </span>
                  </td>
                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded-lg hover:bg-primary/10 hover:text-primary text-muted-foreground transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-secondary/20">
          <p className="text-xs text-muted-foreground">
            Showing {filtered.length} of {products.length} products
          </p>
          <div className="flex gap-1">
            {[1, 2, 3].map((p) => (
              <button
                key={p}
                className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${
                  p === 1
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
