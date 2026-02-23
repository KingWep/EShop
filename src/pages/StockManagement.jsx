import { useState } from "react";
import { Search, ChevronDown, AlertTriangle, Plus, Minus, RefreshCw, Package } from "../components/icons";

const stockItems = [
  {
    id: 1,
    name: "Wireless Keyboard Pro",
    sku: "WK-PRO-001",
    category: "Electronics",
    emoji: "⌨️",
    current: 243,
    reorder: 50,
    max: 400,
    supplier: "TechSupply Co.",
    lastRestocked: "Feb 12, 2026",
    cost: "$42.00",
  },
  {
    id: 2,
    name: "USB-C Hub 7-in-1",
    sku: "UC-HUB-007",
    category: "Accessories",
    emoji: "🔌",
    current: 38,
    reorder: 40,
    max: 200,
    supplier: "GadgetWorld",
    lastRestocked: "Jan 28, 2026",
    cost: "$22.50",
  },
  {
    id: 3,
    name: "Ergonomic Mouse",
    sku: "EM-MOU-002",
    category: "Peripherals",
    emoji: "🖱️",
    current: 0,
    reorder: 30,
    max: 150,
    supplier: "Periph Plus",
    lastRestocked: "Dec 15, 2025",
    cost: "$28.00",
  },
  {
    id: 4,
    name: "Monitor Stand Adjustable",
    sku: "MS-STD-003",
    category: "Furniture",
    emoji: "🖥️",
    current: 189,
    reorder: 25,
    max: 250,
    supplier: "OfficeMate",
    lastRestocked: "Feb 1, 2026",
    cost: "$38.00",
  },
  {
    id: 5,
    name: "Mechanical Numpad",
    sku: "MN-PAD-004",
    category: "Peripherals",
    emoji: "🔢",
    current: 22,
    reorder: 30,
    max: 120,
    supplier: "KeyCraft",
    lastRestocked: "Jan 10, 2026",
    cost: "$18.00",
  },
  {
    id: 6,
    name: "Cable Management Kit",
    sku: "CM-KIT-005",
    category: "Accessories",
    emoji: "🗂️",
    current: 512,
    reorder: 100,
    max: 600,
    supplier: "GadgetWorld",
    lastRestocked: "Feb 15, 2026",
    cost: "$8.50",
  },
  {
    id: 7,
    name: "Desk Lamp LED Smart",
    sku: "DL-LED-006",
    category: "Lighting",
    emoji: "💡",
    current: 0,
    reorder: 20,
    max: 100,
    supplier: "LightTech",
    lastRestocked: "Nov 30, 2025",
    cost: "$21.00",
  },
  {
    id: 8,
    name: "Webcam 4K Ultra",
    sku: "WC-4K-008",
    category: "Electronics",
    emoji: "📷",
    current: 67,
    reorder: 30,
    max: 150,
    supplier: "VisionGear",
    lastRestocked: "Feb 8, 2026",
    cost: "$62.00",
  },
];

const getStatus = (current, reorder) => {
  if (current === 0) return { label: "Out of Stock", cls: "badge-out-of-stock" };
  if (current <= reorder) return { label: "Low Stock", cls: "badge-low-stock" };
  return { label: "In Stock", cls: "badge-in-stock" };
};

const StockManagement = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [adjustments, setAdjustments] = useState({});

  const filtered = stockItems.filter((item) => {
    const matchSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase());
    const status = getStatus(item.current, item.reorder).label;
    const matchFilter =
      filter === "all" ||
      (filter === "in-stock" && status === "In Stock") ||
      (filter === "low-stock" && status === "Low Stock") ||
      (filter === "out-of-stock" && status === "Out of Stock");
    return matchSearch && matchFilter;
  });

  const adjust = (id, delta) => {
    setAdjustments((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + delta }));
  };

  const totalLowStock = stockItems.filter((i) => i.current > 0 && i.current <= i.reorder).length;
  const totalOutOfStock = stockItems.filter((i) => i.current === 0).length;
  const totalValue = stockItems.reduce((s, i) => s + i.current * parseFloat(i.cost.replace("$", "")), 0);

  return (
    <div className="space-y-5 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Stock Management</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Monitor and adjust inventory levels
          </p>
        </div>
        <button className="btn-primary flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold">
          <RefreshCw className="w-4 h-4" />
          Restock Order
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total SKUs", value: stockItems.length, color: "hsl(262 83% 58%)" },
          { label: "Low Stock", value: totalLowStock, color: "hsl(38 92% 50%)" },
          { label: "Out of Stock", value: totalOutOfStock, color: "hsl(0 84% 60%)" },
          { label: "Stock Value", value: `$${(totalValue / 1000).toFixed(1)}k`, color: "hsl(142 71% 45%)" },
        ].map((item) => (
          <div key={item.label} className="stat-card">
            <p className="text-2xl font-bold" style={{ color: item.color }}>{item.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="glass-card p-4 flex flex-col sm:flex-row gap-3">
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
      </div>

      {/* Alert banner */}
      {(totalLowStock + totalOutOfStock) > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-warning/30 bg-warning/10 text-warning text-sm font-medium">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          {totalOutOfStock} item{totalOutOfStock !== 1 ? "s" : ""} out of stock · {totalLowStock} item{totalLowStock !== 1 ? "s" : ""} running low — consider restocking soon.
        </div>
      )}

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                {["Product", "SKU", "Supplier", "Stock Level", "Adjust Qty", "Last Restocked", "Status"].map((h) => (
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
              {filtered.map((item) => {
                const adj = adjustments[item.id] ?? 0;
                const effective = Math.max(0, item.current + adj);
                const pct = Math.min(100, (effective / item.max) * 100);
                const status = getStatus(effective, item.reorder);
                const barColor =
                  effective === 0
                    ? "hsl(0 84% 60%)"
                    : effective <= item.reorder
                    ? "hsl(38 92% 50%)"
                    : "hsl(142 71% 45%)";

                return (
                  <tr key={item.id} className="table-row-hover">
                    {/* Product */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center text-xl flex-shrink-0">
                          {item.emoji}
                        </div>
                        <div>
                          <p className="font-medium text-foreground whitespace-nowrap">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.category}</p>
                        </div>
                      </div>
                    </td>

                    {/* SKU */}
                    <td className="px-5 py-4 text-muted-foreground font-mono text-xs whitespace-nowrap">
                      {item.sku}
                    </td>

                    {/* Supplier */}
                    <td className="px-5 py-4 text-xs text-muted-foreground whitespace-nowrap">
                      {item.supplier}
                    </td>

                    {/* Stock Level */}
                    <td className="px-5 py-4 min-w-[160px]">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-semibold text-foreground">{effective.toLocaleString()}</span>
                        <span className="text-muted-foreground">/ {item.max}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${pct}%`, background: barColor }}
                        />
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1">Reorder at {item.reorder}</p>
                    </td>

                    {/* Adjust */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => adjust(item.id, -10)}
                          className="w-7 h-7 rounded-lg bg-secondary border border-border hover:bg-destructive/20 hover:border-destructive/40 hover:text-destructive text-muted-foreground transition-colors flex items-center justify-center"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-10 text-center text-xs font-semibold text-foreground">
                          {adj > 0 ? `+${adj}` : adj}
                        </span>
                        <button
                          onClick={() => adjust(item.id, 10)}
                          className="w-7 h-7 rounded-lg bg-secondary border border-border hover:bg-success/20 hover:border-success/40 hover:text-success text-muted-foreground transition-colors flex items-center justify-center"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </td>

                    {/* Last Restocked */}
                    <td className="px-5 py-4 text-xs text-muted-foreground whitespace-nowrap">
                      {item.lastRestocked}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span className={status.cls}>{status.label}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3 border-t border-border bg-secondary/20">
          <p className="text-xs text-muted-foreground">
            Showing {filtered.length} of {stockItems.length} items
          </p>
        </div>
      </div>
    </div>
  );
};

export default StockManagement;
