import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  Package,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronLeft,
  MapPin,
  Truck,
  Calendar,
  Sparkles,
  X,
  ShoppingBag,
  ShieldCheck
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getMyOrders, cancelMyOrder } from "../api/api";

const cancellationReasons = [
  "Ordered by mistake",
  "Found a better price elsewhere",
  "Delivery timeline is too delayed",
  "Need to change size or color variant",
  "Payment processing or billing issue",
  "Other reason",
];

const MyOrdersPage = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Cancellation states
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [cancelSubmitting, setCancelSubmitting] = useState(false);

  // Normalize order status
  const getStatus = (status) => {
    if (status?.toLowerCase() === "delivered") {
      return "Delivered";
    }

    if (["cancelled", "canceled"].includes(status?.toLowerCase())) {
      return "Canceled";
    }

    return "Processing";
  };

  // Format backend order
  const formatOrder = (order) => ({
    id: order.orderNumber || order.orderId || order._id,
    date: order.createdAt
      ? new Date(order.createdAt).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "Date unavailable",

    status: getStatus(order.status),
    totalAmount: Number(order.totalAmount || order.amount || 0),

    shippingAddress:
      typeof order.shippingAddress === "string"
        ? order.shippingAddress
        : [
            order.shippingAddress?.name,
            order.shippingAddress?.phone,
            order.shippingAddress?.street,
            order.shippingAddress?.city,
            order.shippingAddress?.state,
            order.shippingAddress?.pincode,
          ]
            .filter(Boolean)
            .join(", ") || "Address unavailable",

    paymentMethod:
      order.paymentMethod ||
      (order.paymentId ? "Razorpay Online" : "Secure Payment"),

    cancellationReason: order.cancellationReason || "",

    items: (order.items || []).map((item) => {
      const product =
        item.product && typeof item.product === "object"
          ? item.product
          : null;

      return {
        productId: product?._id || item.productId || item.product,
        name: item.name || product?.name || "Boutique Product",
        image:
          item.image ||
          item.productImage ||
          product?.images?.[0] ||
          product?.image ||
          "",
        price: Number(item.price || product?.price || 0),
        quantity: Number(item.quantity || 1),
        size: item.size || "",
        color: item.color || "",
        variant:
          item.variant ||
          [item.size, item.color].filter(Boolean).join(" / ") ||
          "Standard Edition",
      };
    }),
  });

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getMyOrders();

      const data = Array.isArray(response)
        ? response
        : response?.orders || response?.data?.orders || [];

      setOrders(data.map(formatOrder));
    } catch (err) {
      console.error("Fetch orders error:", err);
      setError(
        err.message || "We encountered an issue loading your history. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Open product details
  const openProduct = (productId) => {
    if (!productId || typeof productId === "object") {
      alert("Product reference is unavailable.");
      return;
    }

    navigate("/product", {
      state: { productId: String(productId) },
    });
  };

  // Submit order cancellation
  const handleCancelOrder = async (e) => {
    e.preventDefault();

    if (!cancelTarget) return;

    const reason =
      cancelReason === "Other reason"
        ? customReason.trim()
        : cancelReason;

    if (!reason) {
      alert("Please select or specify a reason for cancellation.");
      return;
    }

    try {
      setCancelSubmitting(true);

      const response = await cancelMyOrder(
        cancelTarget.id,
        reason
      );

      alert(response.message || "Order canceled successfully.");

      const canceledOrderId = cancelTarget.id;

      setCancelTarget(null);
      setCancelReason("");
      setCustomReason("");

      await fetchOrders();

      setSelectedOrder((previous) => {
        if (previous?.id !== canceledOrderId) return previous;

        return {
          ...previous,
          status: "Canceled",
          cancellationReason: reason,
        };
      });
    } catch (err) {
      console.error("Cancel order error:", err);
      alert(err.message || "Unable to process order cancellation. Please try again.");
    } finally {
      setCancelSubmitting(false);
    }
  };

  // Status badge
  const StatusBadge = ({ status }) => {
    const styles = {
      Delivered:
        "bg-emerald-50 text-emerald-800 border-emerald-200",
      Processing:
        "bg-amber-50 text-amber-900 border-amber-200",
      Canceled:
        "bg-rose-50 text-rose-800 border-rose-200",
    };

    const Icon =
      status === "Delivered"
        ? CheckCircle2
        : status === "Processing"
        ? Clock
        : XCircle;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold tracking-wide border shadow-sm ${
          styles[status] || styles.Processing
        }`}
      >
        <Icon size={13} />
        {status}
      </span>
    );
  };

  const filteredOrders = orders.filter(
    (order) => activeTab === "All" || order.status === activeTab
  );

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-stone-50 via-white to-stone-50">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto" />
          <p className="text-sm font-bold text-stone-600 tracking-wide">
            Retrieving your order history...
          </p>
        </div>
      </div>
    );
  }

  // Selected order detailed view
  if (selectedOrder) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-stone-50 via-white to-stone-50 py-12 px-4 sm:px-6 font-sans">
        <div className="max-w-3xl mx-auto space-y-6">
          
          <button
            onClick={() => setSelectedOrder(null)}
            className="inline-flex items-center gap-2 bg-white px-5 py-2.5 rounded-2xl border border-stone-200/80 text-xs font-bold text-stone-700 hover:bg-stone-50 transition-all shadow-sm"
          >
            <ChevronLeft size={16} />
            <span>Return to Orders List</span>
          </button>

          {/* Main Info Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-sm space-y-8">
            <div className="flex flex-wrap justify-between items-center gap-4 border-b border-stone-100 pb-6">
              <div>
                <span className="text-[10px] uppercase tracking-widest font-extrabold text-stone-400 block mb-1">
                  Reference ID
                </span>
                <h1 className="text-2xl font-black text-stone-900 tracking-tight">
                  {selectedOrder.id}
                </h1>
              </div>

              <StatusBadge status={selectedOrder.status} />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-stone-50/70 p-5 rounded-2xl border border-stone-100 space-y-1">
                <p className="text-xs font-bold text-stone-400 flex items-center gap-2 uppercase tracking-wider">
                  <Calendar size={14} className="text-amber-600" />
                  Placement Date
                </p>
                <p className="text-sm font-extrabold text-stone-900">
                  {selectedOrder.date}
                </p>
              </div>

              <div className="bg-stone-50/70 p-5 rounded-2xl border border-stone-100 space-y-1">
                <p className="text-xs font-bold text-stone-400 flex items-center gap-2 uppercase tracking-wider">
                  <Truck size={14} className="text-amber-600" />
                  Payment Status
                </p>
                <p className="text-sm font-extrabold text-stone-900">
                  {selectedOrder.paymentMethod}
                </p>
              </div>
            </div>

            <div className="bg-stone-50/70 p-5 rounded-2xl border border-stone-100 space-y-2">
              <p className="text-xs font-bold text-stone-400 flex items-center gap-2 uppercase tracking-wider">
                <MapPin size={14} className="text-amber-600" />
                Shipping Destination
              </p>
              <p className="text-sm font-extrabold text-stone-900 leading-relaxed">
                {selectedOrder.shippingAddress}
              </p>
            </div>

            {selectedOrder.status === "Canceled" &&
              selectedOrder.cancellationReason && (
                <div className="bg-rose-50 border border-rose-200 p-5 rounded-2xl space-y-1">
                  <p className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                    Cancellation Justification
                  </p>
                  <p className="text-sm font-bold text-rose-900">
                    {selectedOrder.cancellationReason}
                  </p>
                </div>
              )}
          </div>

          {/* Purchased Items List */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-sm space-y-6">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-stone-400 border-b border-stone-100 pb-4">
              Purchased Items ({selectedOrder.items.length})
            </h2>

            <div className="space-y-6">
              {selectedOrder.items.map((item, index) => (
                <div
                  key={`${item.productId || item.name}-${index}`}
                  className="flex items-center justify-between gap-4 pb-6 border-b border-stone-100 last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <button
                      onClick={() => openProduct(item.productId)}
                      className="w-20 h-20 rounded-2xl bg-stone-100 border border-stone-200 p-2 shrink-0 overflow-hidden hover:scale-105 transition-transform"
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        <Package className="mx-auto text-stone-400 mt-4" />
                      )}
                    </button>

                    <div className="min-w-0 space-y-1">
                      <button
                        onClick={() => openProduct(item.productId)}
                        className="text-left text-sm font-extrabold text-stone-900 hover:text-amber-700 transition-colors truncate block"
                      >
                        {item.name}
                      </button>

                      <p className="text-xs text-stone-500 font-medium">
                        Variant: <span className="font-bold text-stone-800">{item.variant}</span>
                      </p>

                      <p className="text-xs text-stone-500 font-medium">
                        Units: <span className="font-bold text-stone-800">{item.quantity}</span>
                      </p>
                    </div>
                  </div>

                  <p className="text-base font-black text-stone-900 shrink-0">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center border-t border-stone-200 pt-6">
              <span className="text-sm font-extrabold text-stone-700 uppercase tracking-wider">Total Investment</span>
              <span className="text-xl font-black text-amber-700">
                ₹{selectedOrder.totalAmount.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // Orders List Page
  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 via-white to-stone-50 py-12 px-4 sm:px-8 lg:px-12 font-sans text-stone-900">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
          <div className="space-y-1">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-700 flex items-center gap-1.5">
              <ShieldCheck size={14} /> Client Purchases
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Order History
            </h1>
          </div>

          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold px-4 py-2 rounded-full shadow-sm self-start sm:self-auto">
            <Sparkles size={14} className="text-amber-600" />
            <span>{filteredOrders.length} Total Records</span>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {["All", "Delivered", "Processing", "Canceled"].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-full text-xs font-extrabold tracking-wide whitespace-nowrap transition-all duration-300 ${
                  activeTab === tab
                    ? "bg-stone-900 text-amber-200 shadow-md scale-105"
                    : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-50"
                }`}
              >
                {tab}
              </button>
            )
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 p-5 rounded-3xl shadow-sm space-y-2">
            <p className="text-sm font-bold">{error}</p>
            <button
              onClick={fetchOrders}
              className="text-xs font-extrabold uppercase underline hover:text-stone-900 transition-colors"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Orders Listing */}
        {filteredOrders.length > 0 ? (
          <div className="space-y-5">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-sm hover:shadow-xl hover:border-amber-300 transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-6"
              >
                {/* Left product snapshot */}
                <div className="flex items-center gap-5 min-w-0">
                  <button
                    onClick={() =>
                      openProduct(order.items[0]?.productId)
                    }
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-stone-100 border border-stone-200 p-2 shrink-0 overflow-hidden hover:scale-105 transition-transform"
                  >
                    {order.items[0]?.image ? (
                      <img
                        src={order.items[0].image}
                        alt={order.items[0].name}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <Package className="mx-auto text-stone-400 mt-6" />
                    )}
                  </button>

                  <div className="min-w-0 space-y-2">
                    <span className="text-[10px] font-mono font-bold text-stone-400 tracking-wider">
                      ID: {order.id}
                    </span>

                    <div>
                      <StatusBadge status={order.status} />
                    </div>

                    <button
                      onClick={() =>
                        openProduct(order.items[0]?.productId)
                      }
                      className="block text-left text-sm font-extrabold text-stone-900 hover:text-amber-700 transition-colors truncate max-w-xs sm:max-w-md"
                    >
                      {order.items[0]?.name || "Curated Merchandise"}
                      {order.items.length > 1
                        ? ` + ${order.items.length - 1} more item(s)`
                        : ""}
                    </button>

                    <p className="text-xs text-stone-400 font-medium">
                      Placed on {order.date}
                    </p>
                  </div>
                </div>

                {/* Right controls */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 shrink-0 pt-4 sm:pt-0 border-t sm:border-0 border-stone-100">
                  {order.status === "Processing" && (
                    <button
                      onClick={() => {
                        setCancelTarget(order);
                        setCancelReason("");
                        setCustomReason("");
                      }}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold transition-colors shadow-sm"
                    >
                      <XCircle size={14} />
                      <span>Cancel Order</span>
                    </button>
                  )}

                  <p className="text-lg font-black text-stone-900">
                    ₹{order.totalAmount.toLocaleString("en-IN")}
                  </p>

                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="inline-flex items-center gap-1.5 text-xs font-extrabold text-amber-700 hover:text-stone-900 transition-colors group"
                  >
                    <span>View Specifications</span>
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !error && (
            <div className="bg-white rounded-3xl p-16 text-center border border-stone-200/80 shadow-sm space-y-4">
              <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-700">
                <ShoppingBag size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-stone-900">No Orders Recorded</h3>
                <p className="text-xs text-stone-400 font-medium">
                  There are currently no records found under the "{activeTab}" category.
                </p>
              </div>
            </div>
          )
        )}

        {/* Cancellation Modal Dialog */}
        {cancelTarget && (
          <div className="fixed inset-0 z-[100] bg-stone-950/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-3xl p-7 shadow-2xl border border-stone-200 space-y-6">
              
              <div className="flex items-start justify-between gap-3 border-b border-stone-100 pb-4">
                <div className="space-y-0.5">
                  <h2 className="text-lg font-black text-stone-900">
                    Confirm Order Cancellation
                  </h2>
                  <p className="text-xs text-stone-400 font-mono">
                    Ref ID: {cancelTarget.id}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!cancelSubmitting) {
                      setCancelTarget(null);
                      setCancelReason("");
                      setCustomReason("");
                    }
                  }}
                  disabled={cancelSubmitting}
                  className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:bg-stone-200 transition-all disabled:opacity-50"
                  aria-label="Close dialog"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4">
                <p className="text-xs text-rose-900 font-semibold leading-relaxed">
                  Are you certain you wish to withdraw this order? Please select a cancellation reason below.
                </p>
              </div>

              <form onSubmit={handleCancelOrder} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-stone-700 block">
                    Reason for Cancellation *
                  </label>

                  <select
                    required
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="w-full border border-stone-200 rounded-2xl p-3.5 text-xs font-bold text-stone-800 outline-none focus:border-amber-600 bg-stone-50/50 cursor-pointer"
                  >
                    <option value="">Select a specific reason</option>
                    {cancellationReasons.map((reason) => (
                      <option key={reason} value={reason}>
                        {reason}
                      </option>
                    ))}
                  </select>
                </div>

                {cancelReason === "Other reason" && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold uppercase tracking-wider text-stone-700 block">
                      Specify Reason *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={customReason}
                      onChange={(e) => setCustomReason(e.target.value)}
                      placeholder="Please elaborate..."
                      className="w-full border border-stone-200 rounded-2xl p-3.5 text-xs font-medium text-stone-800 outline-none focus:border-amber-600 bg-stone-50/50 resize-none"
                    />
                  </div>
                )}

                <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
                  <button
                    type="button"
                    disabled={cancelSubmitting}
                    onClick={() => {
                      setCancelTarget(null);
                      setCancelReason("");
                      setCustomReason("");
                    }}
                    className="flex-1 px-5 py-3.5 rounded-2xl border border-stone-200 text-stone-700 font-bold text-xs uppercase tracking-wider hover:bg-stone-50 transition-all disabled:opacity-50"
                  >
                    Keep Order
                  </button>

                  <button
                    type="submit"
                    disabled={
                      cancelSubmitting ||
                      !cancelReason ||
                      (cancelReason === "Other reason" &&
                        !customReason.trim())
                    }
                    className="flex-1 px-5 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-md transition-all disabled:opacity-50"
                  >
                    {cancelSubmitting
                      ? "Processing..."
                      : "Confirm Cancellation"}
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default MyOrdersPage;