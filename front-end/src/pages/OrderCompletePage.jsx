import React from "react";
import { CheckCircle2, Package, Home, Sparkles, ArrowRight, ShieldCheck, Truck, Receipt } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const OrderCompletePage = ({ order: orderProp, onGoHome }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Actual order data: props or React Router state or localStorage
  const order =
    orderProp ||
    location.state?.order ||
    JSON.parse(localStorage.getItem("lastOrder") || "null");

  const handleGoHome = () => {
    if (onGoHome) {
      onGoHome();
    } else {
      navigate("/");
    }
  };

  // No dummy products: show only the products actually ordered
  const rawItems =
    order?.items ||
    order?.products ||
    order?.cartItems ||
    order?.orderItems ||
    [];

  const items = rawItems.map((item, index) => {
    const product = item.product || item.productId || item;

    const price = Number(
      item.price ?? product.price ?? item.unitPrice ?? 0
    );

    const quantity = Number(item.quantity ?? item.qty ?? 1);

    const image =
      item.image ||
      item.images?.[0] ||
      product.image ||
      product.images?.[0] ||
      "";

    const attributes = [
      item.size && `Size: ${item.size}`,
      item.color && `Color: ${item.color}`,
      item.selectedSize && `Size: ${item.selectedSize}`,
      item.selectedColor && `Color: ${item.selectedColor}`,
    ].filter(Boolean);

    return {
      id: item._id || item.id || product._id || index,
      name: item.name || product.name || "Boutique Product",
      image,
      variant: attributes.join(" | "),
      price,
      quantity,
      subtotal: Number(item.subtotal ?? price * quantity),
    };
  });

  const totalAmount = Number(
    order?.totalAmount ??
    order?.amount ??
    items.reduce((total, item) => total + item.subtotal, 0)
  );

  const orderId = order?.orderId || order?._id || order?.id;
  const paymentId = order?.paymentId;

  // Don't show a success page without a confirmed order
  if (!order || items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-stone-50 via-white to-stone-50 flex items-center justify-center p-6 font-sans">
        <div className="bg-white rounded-3xl border border-stone-200/80 p-10 text-center max-w-md shadow-sm space-y-5">
          <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-800 flex items-center justify-center mx-auto border border-amber-200/60">
            <Package size={30} />
          </div>
          
          <div className="space-y-1.5">
            <h1 className="text-xl font-extrabold text-stone-900">
              Order Record Unreachable
            </h1>
            <p className="text-xs text-stone-500 font-medium leading-relaxed">
              We couldn't retrieve your order details. Please verify your purchases in your account or return to the shop.
            </p>
          </div>

          <button
            onClick={handleGoHome}
            className="w-full bg-stone-900 hover:bg-black text-amber-200 py-3.5 rounded-2xl text-xs font-extrabold uppercase tracking-wider transition-all shadow-md"
          >
            Return To Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-b from-stone-50 via-white to-stone-50 min-h-screen py-10 px-4 sm:px-8 lg:px-12 font-sans text-stone-900">
      <div className="max-w-4xl mx-auto space-y-10">

        {/* Stepper Header */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-5 border border-stone-200/80 shadow-[0_2px_15px_rgba(0,0,0,0.02)] max-w-2xl mx-auto">
          <div className="flex items-center justify-between relative px-4">
            {[
              { label: "Address", completed: true },
              { label: "Payment", completed: true },
              { label: "Confirmation", active: true },
            ].map((step, index) => (
              <div key={step.label} className="flex flex-col items-center relative z-10 space-y-1.5">
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center text-xs font-extrabold transition-all duration-300 ${
                    step.completed || step.active
                      ? "bg-emerald-600 text-white shadow-md scale-105"
                      : "bg-stone-100 text-stone-400 border border-stone-200"
                  }`}
                >
                  ✓
                </div>
                <span className="text-[10px] sm:text-[11px] font-extrabold tracking-wider uppercase text-stone-900">
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Success Confirmation Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.03)] text-center space-y-6 relative overflow-hidden">
          
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto border border-emerald-200/80 shadow-sm">
            <CheckCircle2 size={42} />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-[11px] font-extrabold px-3 py-1 rounded-full border border-emerald-200/60 uppercase tracking-wider">
              <Sparkles size={12} /> Payment Verified & Reserved
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900">
              Order Confirmed Successfully!
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 font-medium leading-relaxed">
              Thank you for shopping with us. Your purchase has been logged and our team is preparing your package.
            </p>
          </div>

          {/* Reference Chips */}
          <div className="bg-stone-50/80 border border-stone-200/80 rounded-2xl p-5 text-left max-w-xl mx-auto space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200/60 pb-3">
              <div className="flex items-center gap-2">
                <Receipt size={16} className="text-amber-800" />
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Order Reference</span>
              </div>
              <span className="text-xs font-mono font-black text-stone-900 bg-white px-2.5 py-1 rounded-lg border border-stone-200">
                #{orderId || "N/A"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-0.5">
                <p className="text-stone-400 font-medium">Estimated Delivery</p>
                <p className="font-extrabold text-stone-900 flex items-center gap-1">
                  <Truck size={13} className="text-amber-800" />
                  <span>{order?.estimatedDelivery || "3 - 5 Business Days"}</span>
                </p>
              </div>

              {paymentId && (
                <div className="space-y-0.5">
                  <p className="text-stone-400 font-medium">Razorpay Payment ID</p>
                  <p className="font-mono font-bold text-stone-800 truncate">
                    {paymentId}
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Ordered Items Breakdown */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-[0_2px_15px_rgba(0,0,0,0.02)] space-y-6">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-stone-400">
              Purchased Curation ({items.length})
            </h2>
            <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60 flex items-center gap-1">
              <ShieldCheck size={13} /> Insured Shipping
            </span>
          </div>

          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 pb-4 border-b border-stone-100 last:border-0 last:pb-0"
              >
                <div className="w-16 h-16 rounded-2xl bg-stone-50 border border-stone-200/80 overflow-hidden shrink-0 flex items-center justify-center p-1.5">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <Package size={22} className="text-stone-400" />
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-0.5">
                  <h4 className="text-xs sm:text-sm font-extrabold text-stone-900 truncate">
                    {item.name}
                  </h4>

                  {item.variant && (
                    <p className="text-[11px] text-stone-500 font-bold">
                      {item.variant}
                    </p>
                  )}

                  <p className="text-[11px] text-stone-400 font-medium">
                    Quantity: <span className="font-extrabold text-stone-800">{item.quantity}</span>
                  </p>
                </div>

                <span className="text-xs sm:text-sm font-black text-stone-900 whitespace-nowrap">
                  ₹{item.subtotal.toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-stone-200 flex justify-between items-center text-base font-black text-stone-900">
            <span>Total Paid</span>
            <span className="text-xl text-amber-800">
              ₹{totalAmount.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={handleGoHome}
            className="w-full bg-stone-900 hover:bg-black text-amber-200 font-extrabold py-4 rounded-2xl text-xs uppercase tracking-wider transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2"
          >
            <Home size={16} />
            <span>Return To Home</span>
          </button>

          <button
            onClick={() => navigate("/product")}
            className="w-full bg-white hover:bg-stone-50 text-stone-900 font-extrabold py-4 rounded-2xl text-xs uppercase tracking-wider transition-all border border-stone-200/80 shadow-sm active:scale-[0.99] flex items-center justify-center gap-2"
          >
            <span>Explore More</span>
            <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </div>
  );
};

export default OrderCompletePage;