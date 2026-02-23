import {
  Package,
  Tags,
  AlertTriangle,
  XCircle,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Clock,
} from "../components/icons";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const stats = [
  {
    label: "Total Products",
    value: "2,847",
    change: "+12.5%",
    up: true,
    icon: Package,
    color: "hsl(262 83% 58%)",
  },
  {
    label: "Total Categories",
    value: "48",
    change: "+4.2%",
    up: true,
    icon: Tags,
    color: "hsl(200 80% 55%)",
  },
  {
    label: "Low Stock Items",
    value: "134",
    change: "+18.7%",
    up: false,
    icon: AlertTriangle,
    color: "hsl(38 92% 50%)",
  },
  {
    label: "Out of Stock",
    value: "23",
    change: "-5.1%",
    up: true,
    icon: XCircle,
    color: "hsl(0 84% 60%)",
  },
  {
    label: "Total Orders",
    value: "18,392",
    change: "+23.1%",
    up: true,
    icon: ShoppingCart,
    color: "hsl(262 83% 58%)",
  },
  {
    label: "Total Revenue",
    value: "$948,200",
    change: "+31.4%",
    up: true,
    icon: DollarSign,
    color: "hsl(142 71% 45%)",
  },
];

const salesData = [
  { month: "Jan", value: 42000 },
  { month: "Feb", value: 58000 },
  { month: "Mar", value: 51000 },
  { month: "Apr", value: 73000 },
  { month: "May", value: 68000 },
  { month: "Jun", value: 89000 },
  { month: "Jul", value: 94000 },
  { month: "Aug", value: 82000 },
  { month: "Sep", value: 108000 },
  { month: "Oct", value: 97000 },
  { month: "Nov", value: 124000 },
  { month: "Dec", value: 141000 },
];

const recentActivity = [
  { action: "New order #ORD-4821 received", time: "2 min ago", type: "order" },
  { action: "Product 'Wireless Mouse' is low stock (12 left)", time: "18 min ago", type: "warning" },
  { action: "Category 'Electronics' updated", time: "1 hr ago", type: "update" },
  { action: "Stock replenished for 'USB-C Cables'", time: "3 hr ago", type: "stock" },
  { action: "New product 'Gaming Chair' added", time: "5 hr ago", type: "product" },
];

const topProducts = [
  { name: "Wireless Keyboard", sales: 1240, stock: 89, revenue: "$61,800" },
  { name: "USB-C Hub", sales: 987, stock: 243, revenue: "$39,480" },
  { name: "Monitor Stand", sales: 854, stock: 56, revenue: "$34,160" },
  { name: "Mechanical Mouse", sales: 732, stock: 120, revenue: "$36,600" },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card px-3 py-2 text-sm">
        <p className="text-muted-foreground mb-1">{label}</p>
        <p className="font-semibold text-primary">
          ${(payload[0].value / 1000).toFixed(0)}k
        </p>
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Welcome back, Admin · {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <div key={stat.label} className="stat-card" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="flex items-start justify-between">
              <div
                className="icon-bg w-10 h-10"
                style={{
                  background: `${stat.color}1a`,
                  borderColor: `${stat.color}33`,
                }}
              >
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
              <span
                className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg ${
                  stat.up
                    ? "bg-success/10 text-success"
                    : "bg-destructive/10 text-destructive"
                }`}
              >
                {stat.up ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {stat.change}
              </span>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-0.5">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Sales Area Chart */}
        <div className="glass-card p-5 xl:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Revenue Overview</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Monthly sales performance 2024</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-lg bg-primary/10 text-primary font-medium border border-primary/20">
              2024
            </span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={salesData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(262, 83%, 58%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(262, 83%, 58%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 5% 16%)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "hsl(240 5% 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "hsl(240 5% 55%)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="value" stroke="hsl(262, 83%, 58%)" strokeWidth={2} fill="url(#purpleGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Recent Activity</h2>
          </div>
          <div className="space-y-3">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div
                  className={`mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                    item.type === "warning"
                      ? "bg-warning"
                      : item.type === "order"
                      ? "bg-primary"
                      : item.type === "stock"
                      ? "bg-success"
                      : "bg-muted-foreground"
                  }`}
                />
                <div>
                  <p className="text-xs text-foreground leading-snug">{item.action}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-foreground">Top Selling Products</h2>
          <button className="text-xs text-primary hover:text-primary-glow transition-colors flex items-center gap-1">
            View all <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Product", "Sales", "Stock", "Revenue"].map((h) => (
                  <th key={h} className="text-left pb-3 text-xs font-medium text-muted-foreground">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {topProducts.map((p) => (
                <tr key={p.name} className="table-row-hover">
                  <td className="py-3 font-medium text-foreground">{p.name}</td>
                  <td className="py-3 text-muted-foreground">{p.sales.toLocaleString()}</td>
                  <td className="py-3">
                    <span
                      className={
                        p.stock < 60
                          ? "badge-low-stock"
                          : "badge-in-stock"
                      }
                    >
                      {p.stock} units
                    </span>
                  </td>
                  <td className="py-3 font-semibold text-foreground">{p.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
