import { useState } from "react";
import { Package, Tags, XCircle, TrendingUp, TrendingDown } from "lucide-react";

import CategoryForm from "../components/CategoryPage/CategoryForm";
import CategoriesList from "../components/CategoryPage/CategoriesList";
import CategoryPagination from "../components/CategoryPage/CategoryPagination";
import StatCardCategory from "../components/CategoryPage/StatCardCategory";
import { useProducts } from "../context/ProductsContext.jsx";

const Categories = () => {
  const { products, activeProducts, totalProducts, totalCategory, loading } = useProducts();

  const [search, setSearch] = useState("");
  const [openMenu, setOpenMenu] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  if (loading) return <div className="p-6">Loading categories...</div>;

  // Filtered categories (static example)
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
      description: "Keyboards, mice, headphones",
      emoji: "🖱️",
      products: 276,
      inStock: 230,
      color: "hsl(142 71% 45%)",
    },
    {
      id: 4,
      name: "Furniture",
      description: "Desks, chairs, stands",
      emoji: "🪑",
      products: 198,
      inStock: 162,
      color: "hsl(38 92% 50%)",
    },
  ];

  const filtered = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCategories = filtered.slice(startIndex, startIndex + itemsPerPage);

  /* Stats cards for Dashboard style */
  const stats = [
    {
      label: "Total Products",
      value: totalProducts,
      icon: Package,
      up: true,
      change: "+0%",
      color: "hsl(262 83% 58%)",
    },
    {
      label: "Active Products",
      value: activeProducts.length,
      icon: Tags,
      up: true,
      change: "+0%",
      color: "hsl(142 71% 45%)",
    },
    {
      label: "Inactive Products",
      value: totalProducts - activeProducts.length,
      icon: XCircle,
      up: false,
      change: "0%",
      color: "hsl(0 84% 60%)",
    },
    {
      label: "Total Categories",
      value: totalCategory,
      icon: Tags,
      up: true,
      change: "+0%",
      color: "hsl(142 71% 45%)",
    },
  ];

  return (
    <div className="space-y-6 p-6 animate-fade-up">
      
      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-secondary shadow rounded-xl p-4 flex flex-col justify-between hover:shadow-lg transition">
            <div className="flex justify-between items-center">
              <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
              <span
                className={`text-xs font-semibold ${stat.up ? "text-green-500" : "text-red-500"
                  }`}
              >
                {stat.up ? <TrendingUp className="inline w-3 h-3" /> : <TrendingDown className="inline w-3 h-3" />}{" "}
                {stat.change}
              </span>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold">{stat.value.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <CategoryForm search={search} setSearch={setSearch} />

      {/* Category List */}
      <CategoriesList
        categories={currentCategories}
        openMenu={openMenu}
        setOpenMenu={setOpenMenu}
      />

      {/* Pagination */}
      <CategoryPagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="bg-white shadow rounded-xl p-10 text-center">
          <p className="font-medium">No categories found</p>
          <p className="text-sm text-gray-500">Try adjusting your search</p>
        </div>
      )}
    </div>
  );
};

export default Categories;