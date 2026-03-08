import { useEffect, useMemo, useState } from "react";
import { Search, ChevronDown, Eye, Package, TrendingUp, Clock, CheckCircle } from "../components/icons";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/layouts/ui/dialog";
import { getAllOrders, getOrderById, updateOrderStatus } from "../services/admin/adminOrderService";

const statusConfig = {
  pending: { label: "Pending", cls: "bg-muted/40 text-muted-foreground border border-border", dot: "bg-muted-foreground" },
  processing: { label: "Processing", cls: "bg-primary/15 text-primary border border-primary/25", dot: "bg-primary" },
  shipped: { label: "Shipped", cls: "bg-[hsl(200_80%_55%/0.15)] text-[hsl(200_80%_65%)] border border-[hsl(200_80%_55%/0.3)]", dot: "bg-[hsl(200_80%_55%)]" },
  delivered: { label: "Delivered", cls: "badge-in-stock", dot: "bg-success" },
  cancelled: { label: "Cancelled", cls: "badge-out-of-stock", dot: "bg-destructive" },
  paid: { label: "Paid", cls: "bg-primary/15 text-primary border border-primary/25", dot: "bg-primary" },
  completed: { label: "Completed", cls: "badge-in-stock", dot: "bg-success" },
};

const statusOptions = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const toCurrency = (value) => {
  const amount = Number(value || 0);
  return `$${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
};

const toDate = (value) => {
  if (!value) return "N/A";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const toInitials = (name) => {
  const text = String(name || "").trim();
  if (!text) return "NA";
  const parts = text.split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() || "").join("") || "NA";
};

const normalizeStatus = (status) => {
  const raw = String(status || "pending").toLowerCase().replace(/\s+/g, "-");
  const map = {
    confirmed: "processing",
    completed: "delivered",
    paid: "processing",
  };
  return map[raw] || raw;
};

const normalizeOrders = (response) => {
  const source = response?.content ?? response?.data?.content ?? response?.data ?? response ?? [];
  const items = Array.isArray(source) ? source : [];

  return items.map((raw, index) => {
    const order = raw?.data || raw;
    const customer = order?.customer?.data || order?.customer || order?.user?.data || order?.user || {};
    const orderItems = order?.items || order?.order_items || order?.products || [];

    const customerName =
      order?.customer_name ||
      customer?.full_name ||
      customer?.name ||
      "Unknown Customer";

    const email = order?.customer_email || customer?.email || "N/A";
    const status = normalizeStatus(order?.status);
    const totalAmount =
      order?.total_amount ?? order?.total_price ?? order?.total ?? order?.amount ?? 0;
    const itemsCount = Array.isArray(orderItems)
      ? orderItems.reduce((sum, item) => sum + Number(item?.quantity || item?.qty || 1), 0)
      : Number(order?.item_count || 0);

    return {
      apiId: order?.id || order?.order_id || null,
      id: order?.order_code || order?.code || order?.order_number || `ORD-${order?.id || index + 1}`,
      customer: customerName,
      avatar: toInitials(customerName),
      email,
      items: itemsCount,
      total: toCurrency(totalAmount),
      totalNumber: Number(totalAmount || 0),
      date: toDate(order?.created_at || order?.createdAt || order?.order_date),
      status,
      payment:
        order?.payment_method ||
        order?.payment?.method ||
        order?.payment?.data?.method ||
        "N/A",
    };
  });
};

const normalizeOrderDetail = (response, fallbackOrder) => {
  const order = response?.data || response || {};
  const customer = order?.customer?.data || order?.customer || order?.user?.data || order?.user || {};
  const rawItems = order?.items || order?.order_items || [];

  const customerName =
    order?.customer_name ||
    customer?.full_name ||
    customer?.name ||
    fallbackOrder?.customer ||
    "Unknown Customer";

  const items = Array.isArray(rawItems)
    ? rawItems.map((item, index) => {
      const sku = item?.product_sku?.data || item?.product_sku || {};
      const quantity = Number(item?.quantity || item?.qty || 1);
      const unitPrice = Number(item?.unit_price || sku?.price || 0);
      const lineTotal = Number(item?.total_price || quantity * unitPrice);
      const itemName =
        sku?.description ||
        sku?.sku ||
        item?.name ||
        `Item ${index + 1}`;

      return {
        id: item?.id || `${sku?.sku || "sku"}-${index}`,
        name: itemName,
        sku: sku?.sku || "N/A",
        quantity,
        unitPrice,
        lineTotal,
      };
    })
    : [];

  const totalAmount = Number(
    order?.total_amount ?? order?.total_price ?? order?.total ?? fallbackOrder?.totalNumber ?? 0
  );

  return {
    id: order?.order_number || order?.order_code || fallbackOrder?.id || "N/A",
    customer: customerName,
    email: order?.customer_email || customer?.email || fallbackOrder?.email || "N/A",
    status: normalizeStatus(order?.status || fallbackOrder?.status),
    date: toDate(order?.order_date || order?.created_at || order?.createdAt || fallbackOrder?.date),
    payment:
      order?.payment_method ||
      order?.payment?.method ||
      order?.payment?.data?.method ||
      fallbackOrder?.payment ||
      "N/A",
    total: totalAmount,
    items,
  };
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [orderDetailOpen, setOrderDetailOpen] = useState(false);
  const [orderDetailLoading, setOrderDetailLoading] = useState(false);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getAllOrders();
      setOrders(normalizeOrders(response));
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError(err?.data?.message || err?.message || "Failed to load orders.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filtered = useMemo(() => orders.filter((o) => {
    const matchSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || o.status === filter;
    return matchSearch && matchFilter;
  }), [orders, search, filter]);

  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((s, o) => s + Number(o.totalNumber || 0), 0);

  const countByStatus = (s) => orders.filter((o) => o.status === s).length;

  const handleStatusChange = async (order, nextStatus) => {
    if (!order) return;
    if (order.status === nextStatus) return;

    const targetId = order.apiId || order.id;
    if (!targetId) {
      setError("Cannot update this order because id is missing.");
      return;
    }

    const previousStatus = order.status;
    setError("");
    setUpdatingOrderId(String(targetId));

    // Optimistic UI update
    setOrders((prev) =>
      prev.map((item) =>
        (item.apiId || item.id) === targetId ? { ...item, status: nextStatus } : item
      )
    );

    try {
      await updateOrderStatus(targetId, nextStatus);
    } catch (err) {
      // Roll back if API update fails
      setOrders((prev) =>
        prev.map((item) =>
          (item.apiId || item.id) === targetId ? { ...item, status: previousStatus } : item
        )
      );
      setError(err?.data?.message || err?.message || "Failed to update order status.");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleViewDetail = async (order) => {
    if (!order) return;

    setOrderDetailOpen(true);
    setOrderDetailLoading(true);
    setError("");

    try {
      const targetId = order.apiId || order.id;
      if (!targetId) {
        setSelectedOrderDetail(normalizeOrderDetail({}, order));
        return;
      }

      const detail = await getOrderById(targetId);
      setSelectedOrderDetail(normalizeOrderDetail(detail, order));
    } catch (err) {
      console.error("Failed to fetch order detail:", err);
      setError(err?.data?.message || err?.message || "Failed to load order detail.");
      setSelectedOrderDetail(normalizeOrderDetail({}, order));
    } finally {
      setOrderDetailLoading(false);
    }
  };

  const detailStatus = statusConfig[selectedOrderDetail?.status] || statusConfig.pending;

  return (
    <div className="space-y-6 p-5 sm:p-6 animate-fade-up">
      {/* Header */}
      <div className="rounded-2xl border border-border/70 bg-card/80 p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Orders</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track and manage customer orders · {orders.length} total
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-secondary/70 hover:bg-accent/10 text-sm text-foreground font-medium transition-colors">
            Export CSV
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: `$${totalRevenue.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`, icon: TrendingUp, color: "hsl(142 71% 45%)" },
          { label: "Pending", value: countByStatus("pending"), icon: Clock, color: "hsl(38 92% 50%)" },
          { label: "Processing", value: countByStatus("processing") + countByStatus("shipped"), icon: Package, color: "hsl(262 83% 58%)" },
          { label: "Delivered", value: countByStatus("delivered"), icon: CheckCircle, color: "hsl(142 71% 45%)" },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl border border-border/60 bg-card/80 p-4 shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-lg border flex items-center justify-center"
                style={{ background: `${item.color}1a`, borderColor: `${item.color}33` }}
              >
                <item.icon className="w-4 h-4" style={{ color: item.color }} />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground leading-tight">{item.value}</p>
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{item.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-border/70 bg-card/70 p-4 flex flex-col sm:flex-row gap-3 shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by order ID, customer, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-lg bg-secondary/70 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
          />
        </div>
        <div className="relative">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="appearance-none h-10 pl-3 pr-8 rounded-lg bg-secondary/70 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer transition-all"
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

      {error && (
        <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-4 text-destructive text-sm">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl border border-border/70 bg-card/80 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/40">
                {["Order ID", "Customer", "Items", "Total", "Date", "Status", "Action"].map((h, i) => (
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
              {loading && (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-sm text-muted-foreground">
                    Loading orders...
                  </td>
                </tr>
              )}

              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-sm text-muted-foreground">
                    No orders found.
                  </td>
                </tr>
              )}

              {filtered.map((order) => {
                return (
                  <tr key={order.id} className="border-b border-border/60 last:border-none hover:bg-muted/20">
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

                    {/* Date */}
                    <td className="px-5 py-4 text-xs text-muted-foreground whitespace-nowrap">
                      {order.date}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <div className="relative inline-block min-w-32">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order, e.target.value)}
                          disabled={updatingOrderId === String(order.apiId || order.id)}
                          className="appearance-none h-8 w-full pl-3 pr-8 rounded-lg bg-secondary border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60"
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {statusConfig[status]?.label || status}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                      </div>
                    </td>

                    {/* View */}
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => handleViewDetail(order)}
                        className="p-1.5 rounded-lg hover:bg-primary/10 hover:text-primary text-muted-foreground transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-secondary/30">
          <p className="text-xs text-muted-foreground">
            Showing {filtered.length} of {orders.length} orders
          </p>
          <button
            type="button"
            onClick={fetchOrders}
            className="h-7 px-3 rounded-lg text-xs font-medium text-muted-foreground hover:bg-secondary transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>
      <Dialog open={orderDetailOpen} onOpenChange={setOrderDetailOpen}>
  <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-3xl border border-purple-500/20 bg-[#0f0a1e] shadow-[0_0_60px_rgba(139,92,246,0.15)]">

    {/* Header */}
    <div className="relative px-7 pt-7 pb-6 overflow-hidden">
      <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />
      <div className="absolute -top-6 left-1/2 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-purple-300/80 mb-1">Order Detail</p>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {selectedOrderDetail?.id ?? "—"}
          </h2>
        </div>
        <span className={`mt-1 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${detailStatus.cls}`}>
          {detailStatus.label}
        </span>
      </div>

      <div className="absolute bottom-0 left-7 right-7 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
    </div>

    {orderDetailLoading ? (
      <div className="px-7 py-16 text-sm text-purple-400/50 text-center animate-pulse">
        Loading order…
      </div>
    ) : (
      <div className="px-7 pb-7 pt-5 space-y-4">

        {/* Customer + Summary */}
        <div className="grid grid-cols-2 gap-4">

          {/* Customer card */}
          <div className="rounded-2xl border border-purple-500/15 bg-purple-950/20 p-5 space-y-4">
            <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-purple-400/50">Customer</p>
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl bg-purple-600 text-white text-sm font-bold flex items-center justify-center shrink-0 shadow-lg shadow-purple-600/30">
                {toInitials(selectedOrderDetail?.customer || "NA")}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-white leading-tight truncate">{selectedOrderDetail?.customer || "N/A"}</p>
                <p className="text-xs text-purple-400/60 truncate">{selectedOrderDetail?.email || "N/A"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[11px] rounded-xl border border-purple-500/20 bg-purple-950/40 px-3 py-2">
              <span className="font-medium text-purple-300/60">Order</span>
              <span className="font-mono text-purple-200">{selectedOrderDetail?.id || "N/A"}</span>
            </div>
          </div>

          {/* Summary card — inverted purple */}
          <div className="rounded-2xl bg-purple-600 p-5 space-y-4 shadow-lg shadow-purple-600/25 relative overflow-hidden">
            <div className="absolute -bottom-6 -right-6 h-28 w-28 rounded-full bg-purple-500/30 blur-2xl pointer-events-none" />
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
            <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-white/50">Total</p>
            <p className="text-3xl font-bold text-white tracking-tight">{toCurrency(selectedOrderDetail?.total || 0)}</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl bg-white/10 px-3 py-2.5">
                <p className="text-[10px] text-white/50 font-medium mb-1">Date</p>
                <p className="text-xs font-semibold text-white">{selectedOrderDetail?.date || "N/A"}</p>
              </div>
              <div className="rounded-xl bg-white/10 px-3 py-2.5">
                <p className="text-[10px] text-white/50 font-medium mb-1">Payment</p>
                <p className="text-xs font-semibold text-white">{selectedOrderDetail?.payment || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Items table */}
        <div className="rounded-2xl border border-purple-500/15 overflow-hidden bg-purple-950/20">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-purple-500/15">
                <th className="text-left px-5 py-3 text-[10px] font-bold tracking-[0.15em] uppercase text-purple-400/50">Item</th>
                <th className="text-left px-4 py-3 text-[10px] font-bold tracking-[0.15em] uppercase text-purple-400/50">SKU</th>
                <th className="text-right px-4 py-3 text-[10px] font-bold tracking-[0.15em] uppercase text-purple-400/50">Qty</th>
                <th className="text-right px-4 py-3 text-[10px] font-bold tracking-[0.15em] uppercase text-purple-400/50">Price</th>
                <th className="text-right px-5 py-3 text-[10px] font-bold tracking-[0.15em] uppercase text-purple-400/50">Total</th>
              </tr>
            </thead>
            <tbody>
              {selectedOrderDetail?.items?.length ? (
                selectedOrderDetail.items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-purple-500/10 last:border-none hover:bg-purple-500/5 transition-colors duration-150"
                  >
                    <td className="px-5 py-3.5 font-semibold text-white">{item.name}</td>
                    <td className="px-4 py-3.5 text-purple-400/60 font-mono text-xs">{item.sku}</td>
                    <td className="px-4 py-3.5 text-right text-purple-200/80">{item.quantity}</td>
                    <td className="px-4 py-3.5 text-right text-purple-200/80">{toCurrency(item.unitPrice)}</td>
                    <td className="px-5 py-3.5 text-right font-bold text-white">{toCurrency(item.lineTotal)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-purple-400/40 text-sm">
                    No items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="relative pt-1">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
          <div className="flex justify-end pt-3">
            <DialogClose asChild>
              <button
                type="button"
                className="relative h-11 px-8 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold tracking-wide transition-all duration-200 shadow-lg shadow-purple-600/25 hover:shadow-purple-500/30 active:scale-[0.98]"
              >
                <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10" />
                Done
              </button>
            </DialogClose>
          </div>
        </div>

      </div>
    )}
  </DialogContent>
</Dialog>
    </div>
  );
};

export default Orders;