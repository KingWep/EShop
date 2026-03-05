import { Package, Tags, XCircle, TrendingUp, TrendingDown, ArrowUpRight, Clock } from "../components/icons";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useProducts } from "../context/ProductsContext.jsx";

const Dashboard = () => {
  const { products, activeProducts, totalProducts,totalCategory, loading } = useProducts();

  if (loading) return <div className="p-6">Loading dashboard...</div>;

  // ===== Stats =====
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
    }
  ];

  // ===== Revenue Chart Data =====
  const salesData = products.slice(0, 6).map((p, index) => ({
    month: `P${index + 1}`,
    value: p.price || 0,
  }));

  // ===== Top Products =====
  const topProducts = products.slice(0, 5);

  // Custom tooltip for chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload.length) return null;
    return (
      <div className="glass-card px-3 py-2 text-sm">
        <p className="text-muted-foreground mb-1">{label}</p>
        <p className="font-semibold text-primary">${payload[0].value}</p>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-up p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Welcome back, Admin ·{" "}
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className="flex justify-between items-center">
              <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
              <span className={`text-xs font-semibold ${stat.up ? "text-green-500" : "text-red-500"}`}>
                {stat.up ? <TrendingUp className="inline w-3 h-3" /> : <TrendingDown className="inline w-3 h-3" />}{" "}
                {stat.change}
              </span>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="glass-card p-5">
        <h2 className="text-sm font-semibold mb-4">Revenue Overview</h2>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="hsl(262, 83%, 58%)"
              fillOpacity={0.2}
              fill="hsl(262, 83%, 58%)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Top Products Table */}
      <div className="glass-card p-5">
        <div className="flex justify-between mb-4">
          <h2 className="text-sm font-semibold">Top Products</h2>
          <button className="text-xs text-primary flex items-center gap-1">
            View all <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left pb-2">Product</th>
                <th className="text-left pb-2">Price</th>
                <th className="text-left pb-2">Stock</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((p) => (
                <tr key={p.id} className="border-b">
                  <td className="py-3">{p.name}</td>
                  <td>${p.price}</td>
                  <td>
                    <span className={p.stock < 10 ? "text-red-500" : "text-green-500"}>
                      {p.stock || 0} units
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Products */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold">Recent Products Added</h2>
        </div>
        <div className="space-y-2">
          {products.slice(-5).reverse().map((p) => (
            <div key={p.id} className="text-xs">
              New product "{p.name}" added
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;