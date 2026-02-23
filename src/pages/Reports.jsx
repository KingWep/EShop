import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const salesTrend = [
  { month: "Jan", sales: 42000, returns: 3200 },
  { month: "Feb", sales: 58000, returns: 4100 },
  { month: "Mar", sales: 51000, returns: 2800 },
  { month: "Apr", sales: 73000, returns: 5200 },
  { month: "May", sales: 68000, returns: 3900 },
  { month: "Jun", sales: 89000, returns: 6100 },
  { month: "Jul", sales: 94000, returns: 4800 },
  { month: "Aug", sales: 82000, returns: 5500 },
  { month: "Sep", sales: 108000, returns: 7200 },
  { month: "Oct", sales: 97000, returns: 6400 },
  { month: "Nov", sales: 124000, returns: 8100 },
  { month: "Dec", sales: 141000, returns: 9300 },
];

const revenueByCategory = [
  { category: "Electronics", revenue: 284000 },
  { category: "Accessories", revenue: 196000 },
  { category: "Furniture", revenue: 143000 },
  { category: "Peripherals", revenue: 168000 },
  { category: "Lighting", revenue: 97000 },
  { category: "Storage", revenue: 60200 },
];

const stockDistribution = [
  { name: "In Stock", value: 2690, color: "hsl(142, 71%, 45%)" },
  { name: "Low Stock", value: 134, color: "hsl(38, 92%, 50%)" },
  { name: "Out of Stock", value: 23, color: "hsl(0, 84%, 60%)" },
];

const tooltipStyle = {
  backgroundColor: "hsl(240, 6%, 10%)",
  border: "1px solid hsl(240, 5%, 20%)",
  borderRadius: "12px",
  color: "hsl(0, 0%, 96%)",
  fontSize: "12px",
};

const Reports = () => {
  return (
    <div className="space-y-5 animate-fade-up">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Reports</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Analytics and performance insights
        </p>
      </div>

      {/* Summary chips */}
      <div className="flex flex-wrap gap-3">
        {[
          { label: "Total Revenue", value: "$948,200" },
          { label: "Total Sales", value: "18,392" },
          { label: "Avg. Order Value", value: "$51.56" },
          { label: "Return Rate", value: "6.2%" },
        ].map((item) => (
          <div key={item.label} className="glass-card px-4 py-3 flex items-center gap-3">
            <span className="text-xs text-muted-foreground">{item.label}</span>
            <span className="text-sm font-bold text-gradient">{item.value}</span>
          </div>
        ))}
      </div>

      {/* Sales Line Chart */}
      <div className="glass-card p-5">
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-foreground">Sales vs Returns — 2024</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Monthly trend comparison</p>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={salesTrend} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="salesGrad" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="sales" stroke="#8884d8" fill="url(#salesGrad)" />
            <Area type="monotone" dataKey="returns" stroke="#82ca9d" fillOpacity={0.2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Revenue & Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="glass-card p-4 lg:col-span-2">
          <h3 className="text-sm font-semibold mb-3">Revenue by Category</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={revenueByCategory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-4">
          <h3 className="text-sm font-semibold mb-3">Stock Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={stockDistribution} dataKey="value" nameKey="name" innerRadius={40} outerRadius={80}>
                {stockDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default Reports
