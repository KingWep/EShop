import React from "react";
import { Edit2, Trash2 } from "../icons";

export default function ProductsList({
  products,
  loading,
  search,
  setSearch,
  filter,
  setFilter,
  statusLabel,
  handleToggleStatus,
  handleDeleteClick,
  handleEditClick,
}) {
  return (
    <div className="space-y-5 animate-fade-up">
      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search by name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-4 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="h-9 pl-3 pr-8 rounded-lg bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer transition-all"
        >
          <option value="all">All Status</option>
          <option value="in-stock">In Stock</option>
          <option value="low-stock">Low Stock</option>
          <option value="out-of-stock">Out of Stock</option>
        </select>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                {["ID", "Name", "SKU", "Price", "Stock", "Status","Actions"].map((h) => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-5 text-muted-foreground">
                    Loading products...
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="table-row-hover">
                    <td className="px-5 py-4">{product.id}</td>
                    <td className="px-5 py-4 font-medium flex gap-2 items-center">
                      <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded-md" />
                      {product.name}
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-muted-foreground">{product.sku}</td>
                    <td className="px-5 py-4 font-semibold">{product.price}</td>
                    <td className="px-5 py-4">{product.stock}</td>
                    <td className="px-5 py-4">
                      <span className={statusLabel[product.status]?.cls}>
                        {statusLabel[product.status]?.label || product.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 flex items-center gap-1">
                      <button onClick={() => handleEditClick(product)} title="Edit product">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteClick(product.id)}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}