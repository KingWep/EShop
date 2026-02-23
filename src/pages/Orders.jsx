import { useState } from "react";
import { Search, ChevronDown, Eye, Package, TrendingUp, Clock, CheckCircle } from "../components/icons";

const orders = [
  {
    id: "ORD-4821",
    customer: "Alice Johnson",
    avatar: "AJ",
    email: "alice@example.com",
    items: 3,
    total: "$247.97",
    date: "Feb 19, 2026",
    status: "delivered",
    payment: "Visa •• 4242",
  },
  {
    id: "ORD-4820",
    customer: "Marcus Chen",
    avatar: "MC",
    email: "m.chen@techcorp.com",
    items: 1,
    total: "$129.99",
    date: "Feb 18, 2026",
    status: "shipped",
    payment: "Mastercard •• 8833",
  },
  {
    id: "ORD-4819",
    customer: "Sarah Williams",
    avatar: "SW",
    email: "sarah.w@gmail.com",
    items: 5,
    total: "$389.95",
    date: "Feb 18, 2026",
    status: "processing",
    payment: "PayPal",
  },
  {
    id: "ORD-4818",
    customer: "David Kim",
    avatar: "DK",
    email: "d.kim@studio.io",
    items: 2,
    total: "$169.98",
    date: "Feb 17, 2026",
    status: "pending",
    payment: "Visa •• 1234",
  },
  {
    id: "ORD-4817",
    customer: "Emma Rodriguez",
    avatar: "ER",
    email: "emma@design.co",
    items: 4,
    total: "$319.96",
    date: "Feb 17, 2026",
    status: "delivered",
    payment: "Amex •• 9001",
  },
  {
    id: "ORD-4816",
    customer: "James Patel",
    avatar: "JP",
    email: "james.patel@corp.com",
    items: 1,
    total: "$89.99",
    date: "Feb 16, 2026",
    status: "cancelled",
    payment: "Visa •• 5566",
  },
  {
    id: "ORD-4815",
    customer: "Olivia Nguyen",
    avatar: "ON",
    email: "o.nguyen@mail.com",
    items: 2,
    total: "$194.98",
    date: "Feb 16, 2026",
    status: "shipped",
    payment: "Mastercard •• 7722",
  },
  {
    id: "ORD-4814",
    customer: "Ryan Thompson",
    avatar: "RT",
    email: "ryan.t@agency.dev",
    items: 6,
    total: "$512.94",
    date: "Feb 15, 2026",
    status: "delivered",
    payment: "Stripe •• 3399",
  },
  {
    id: "ORD-4813",
    customer: "Priya Sharma",
    avatar: "PS",
    email: "priya@startup.in",
    items: 1,
    total: "$44.99",
    date: "Feb 14, 2026",
    status: "processing",
    payment: "PayPal",
  },
  {
    id: "ORD-4812",
    customer: "Liam Foster",
    avatar: "LF",
    email: "liam.f@store.uk",
    items: 3,
    total: "$229.97",
    date: "Feb 13, 2026",
    status: "delivered",
    payment: "Visa •• 8811",
  },
];

const statusConfig = {
  pending:    { label: "Pending",    cls: "bg-muted/40 text-muted-foreground border border-border",                   dot: "bg-muted-foreground" },
  processing: { label: "Processing", cls: "bg-primary/15 text-primary border border-primary/25",                       dot: "bg-primary" },
  shipped:    { label: "Shipped",    cls: "bg-[hsl(200_80%_55%/0.15)] text-[hsl(200_80%_65%)] border border-[hsl(200_80%_55%/0.3)]", dot: "bg-[hsl(200_80%_55%)]" },
  delivered:  { label: "Delivered",  cls: "badge-in-stock",                                                            dot: "bg-success" },
  cancelled:  { label: "Cancelled",  cls: "badge-out-of-stock",                                                        dot: "bg-destructive" },
};

const Orders = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || o.status === filter;
    return matchSearch && matchFilter;
  });

  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((s, o) => s + parseFloat(o.total.replace("$", "")), 0);

  const countByStatus = (s) => orders.filter((o) => o.status === s).length;

  return (
    <div className="space-y-5 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Orders</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Track and manage customer orders · {orders.length} total
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-secondary hover:bg-accent/10 text-sm text-foreground font-medium transition-colors">
            Export CSV
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Revenue", value: `$${totalRevenue.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`, icon: TrendingUp, color: "hsl(142 71% 45%)" },
          { label: "Pending", value: countByStatus("pending"), icon: Clock, color: "hsl(38 92% 50%)" },
          { label: "Processing", value: countByStatus("processing") + countByStatus("shipped"), icon: Package, color: "hsl(262 83% 58%)" },
          { label: "Delivered", value: countByStatus("delivered"), icon: CheckCircle, color: "hsl(142 71% 45%)" },
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

      {/* Filters */}
      <div className="glass-card p-4 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by order ID, customer, or email..."
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
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                {["Order ID", "Customer", "Items", "Total", "Payment", "Date", "Status", ""].map((h, i) => (
                  <th
                    key={i}
                    className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((order) => {
                const sc = statusConfig[order.status];
                return (
                  <tr key={order.id} className="table-row-hover">
                    {/* Order ID */}
                    <td className="px-5 py-4">
                      <span className="font-mono text-xs font-semibold text-primary">{order.id}</span>
                    </td>

                    {/* Customer */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0">
                          {order.avatar}
                        </div>
                        <div>
                          <p className="font-medium text-foreground whitespace-nowrap text-xs">{order.customer}</p>
                          <p className="text-[10px] text-muted-foreground">{order.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Items */}
                    <td className="px-5 py-4 text-muted-foreground text-center">
                      <span className="px-2 py-0.5 rounded-md bg-secondary text-xs font-medium text-foreground">
                        {order.items}
                      </span>
                    </td>

                    {/* Total */}
                    <td className="px-5 py-4 font-bold text-foreground whitespace-nowrap">
                      {order.total}
                    </td>

                    {/* Payment */}
                    <td className="px-5 py-4 text-xs text-muted-foreground whitespace-nowrap">
                      {order.payment}
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4 text-xs text-muted-foreground whitespace-nowrap">
                      {order.date}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${sc.cls}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                        {sc.label}
                      </span>
                    </td>

                    {/* View */}
                    <td className="px-5 py-4">
                      <button className="p-1.5 rounded-lg hover:bg-primary/10 hover:text-primary text-muted-foreground transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-secondary/20">
          <p className="text-xs text-muted-foreground">
            Showing {filtered.length} of {orders.length} orders
          </p>
          <div className="flex gap-1">
            {[1, 2, 3].map((p) => (
              <button
                key={p}
                className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${
                  p === 1 ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
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

export default Orders;