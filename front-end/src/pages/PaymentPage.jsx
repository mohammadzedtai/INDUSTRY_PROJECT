import React, { useState } from "react";
import { Lock, ShieldCheck, Sparkles, ArrowRight, CreditCard, CheckCircle2, QrCode, Wallet, MapPin } from "lucide-react";
import OrderCompletePage from "./OrderCompletePage";
import { createOrder, verifyResponse } from "../api/api";
import { useNavigate } from "react-router-dom";

const PaymentPage = ({
  selectedAddress,
  orderItems = [],
  subtotal = 0,
  shipping = 0,
  total,
}) => {
  const [loading, setLoading] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const navigate = useNavigate();

  // Actual amount calculation
  const totalAmount = Number(total ?? subtotal + shipping);

  const handlePayNow = async () => {
    if (loading) return;

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first.");
      return;
    }

    if (!window.Razorpay) {
      alert("Razorpay SDK not loaded. Please refresh the page.");
      return;
    }

    if (totalAmount <= 0) {
      alert("Invalid payment amount.");
      return;
    }

    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;

    if (!razorpayKey) {
      alert("Razorpay Key ID missing. Check frontend .env");
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      // 1. Create order on backend
      const data = await createOrder(totalAmount);

      if (!data.success || !data.order?.id) {
        throw new Error(data.message || "Unable to create order.");
      }

      // 2. Open Razorpay Checkout
      const options = {
        key: razorpayKey,
        amount: data.order.amount,
        currency: data.order.currency || "INR",
        name: "ShopNest Studio",
        description: "Boutique Shopping Order",
        order_id: data.order.id,

        prefill: {
          name: selectedAddress?.name || "",
          contact: selectedAddress?.phone || "",
        },

        theme: {
          color: "#1c1917", // Stone-900 theme
        },

        // 3. Verify payment on backend
        handler: async (paymentResponse) => {
          try {
            const addressText = selectedAddress
              ? [
                  selectedAddress.name,
                  selectedAddress.street || selectedAddress.address,
                  selectedAddress.city,
                  selectedAddress.state,
                  selectedAddress.pincode || selectedAddress.zipCode,
                  selectedAddress.phone || selectedAddress.mobile,
                ]
                  .filter(Boolean)
                  .join(", ")
              : "";

            if (!addressText) {
              throw new Error("Please select a valid shipping address.");
            }

            // Backend payment verify + MongoDB order create + cart clear
            const result = await verifyResponse(
              paymentResponse,
              [
                selectedAddress?.name,
                selectedAddress?.street || selectedAddress?.address,
                selectedAddress?.city,
                selectedAddress?.state,
                selectedAddress?.pincode || selectedAddress?.zipCode,
                selectedAddress?.phone || selectedAddress?.mobile,
              ].filter(Boolean).join(", ")
            );

            if (!result.success || !result.order) {
              throw new Error(
                result.message || "Unable to save order in database."
              );
            }

            localStorage.setItem(
              "lastOrder",
              JSON.stringify(result.order)
            );

            navigate("/order-complete", {
              state: { order: result.order },
              replace: true,
            });
          } catch (error) {
            console.error("Order placement error:", error);
            alert(error.message || "Payment verification failed.");
          } finally {
            setLoading(false);
          }
        },

        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", (response) => {
        alert(
          response.error?.description || "Payment failed. Try again."
        );
        setLoading(false);
      });

      razorpay.open();
    } catch (error) {
      console.error("Razorpay error:", error);
      alert(error.message || "Unable to start payment.");
      setLoading(false);
    }
  };

  // Successful payment screen
  if (isOrderPlaced) {
    return (
      <OrderCompletePage
        onGoHome={() => {
          window.location.href = "/";
        }}
      />
    );
  }

  return (
    <div className="w-full bg-[#FAF9F6] min-h-screen py-10 px-4 sm:px-8 lg:px-12 font-sans text-stone-900">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Floating Stepper */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-5 border border-stone-200/80 shadow-[0_2px_15px_rgba(0,0,0,0.02)] max-w-2xl mx-auto">
          <div className="flex items-center justify-between relative px-4">
            {[
              { label: "Address", icon: CheckCircle2, completed: true },
              { label: "Payment", icon: CreditCard, active: true },
              { label: "Confirmation", icon: Lock },
            ].map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.label} className="flex flex-col items-center relative z-10 space-y-1.5">
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center text-xs font-extrabold transition-all duration-300 ${
                      step.completed
                        ? "bg-emerald-600 text-white shadow-sm"
                        : step.active
                        ? "bg-stone-900 text-amber-200 shadow-md scale-105 ring-4 ring-stone-100"
                        : "bg-stone-100 text-stone-400 border border-stone-200"
                    }`}
                  >
                    <Icon size={18} />
                  </div>
                  <span className={`text-[10px] sm:text-[11px] font-extrabold tracking-wider uppercase ${step.active ? "text-stone-900" : "text-stone-400"}`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Grid Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column: Address Preview & Gateways */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Delivery Destination Snapshot Card */}
            {selectedAddress && (
              <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-[0_2px_15px_rgba(0,0,0,0.02)] space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-amber-700" />
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-500">
                      Delivering To
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                    Verified Address
                  </span>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-extrabold text-stone-900">
                    {selectedAddress.name}
                  </p>
                  <p className="text-xs text-stone-600 font-medium leading-relaxed">
                    {selectedAddress.street || selectedAddress.address}, {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode || selectedAddress.zipCode}
                  </p>
                  <p className="text-xs text-stone-500 font-mono pt-1">
                    Mobile: +91 {selectedAddress.phone || selectedAddress.mobile}
                  </p>
                </div>
              </div>
            )}

            {/* Payment Method Selection Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-[0_2px_15px_rgba(0,0,0,0.02)] space-y-6">
              
              <div className="space-y-1 border-b border-stone-100 pb-4">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-700 flex items-center gap-1.5">
                  <ShieldCheck size={14} /> Instant Settlement
                </span>
                <h2 className="text-xl font-extrabold text-stone-900">
                  Select Payment Portal
                </h2>
                <p className="text-xs text-stone-500 font-medium">
                  Encrypted transactions processed via secure 256-bit protocol.
                </p>
              </div>

              {/* Highlighted Razorpay Card */}
              <div className="bg-gradient-to-r from-amber-50/80 via-white to-amber-50/30 border-2 border-amber-400/90 rounded-2xl p-5 flex items-center gap-4 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 bg-stone-900 text-amber-200 text-[9px] font-black uppercase px-3 py-1 rounded-bl-xl tracking-widest shadow-sm">
                  Encrypted & Direct
                </div>

                <div className="w-12 h-12 rounded-2xl bg-amber-100/80 border border-amber-300/80 flex items-center justify-center text-amber-900 shrink-0 group-hover:scale-105 transition-transform">
                  <ShieldCheck size={24} />
                </div>

                <div className="flex-1 min-w-0 space-y-0.5">
                  <p className="text-sm font-extrabold text-stone-900">
                    Razorpay Secure Checkout
                  </p>
                  <p className="text-xs text-stone-500 font-medium leading-relaxed">
                    Google Pay, PhonePe, Paytm UPI, Credit/Debit Cards & NetBanking.
                  </p>
                </div>
              </div>

              {/* Supported Payment Badges */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-stone-50/80 border border-stone-200/60 rounded-2xl p-3 text-center space-y-1">
                  <QrCode size={18} className="mx-auto text-amber-800" />
                  <p className="text-[11px] font-extrabold text-stone-800">UPI Instant</p>
                </div>

                <div className="bg-stone-50/80 border border-stone-200/60 rounded-2xl p-3 text-center space-y-1">
                  <CreditCard size={18} className="mx-auto text-amber-800" />
                  <p className="text-[11px] font-extrabold text-stone-800">All Cards</p>
                </div>

                <div className="bg-stone-50/80 border border-stone-200/60 rounded-2xl p-3 text-center space-y-1">
                  <Wallet size={18} className="mx-auto text-amber-800" />
                  <p className="text-[11px] font-extrabold text-stone-800">NetBanking</p>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Order Summary & Pay Button */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-[0_2px_15px_rgba(0,0,0,0.02)] space-y-6">
              
              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <h2 className="text-xs font-extrabold uppercase tracking-widest text-stone-400">
                  Summary ({orderItems.length})
                </h2>
                <span className="text-[11px] font-extrabold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/60 flex items-center gap-1">
                  <Sparkles size={11} /> Secured Bag
                </span>
              </div>

              {/* Ordered Items List */}
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1 scrollbar-none">
                {orderItems.map((item) => {
                  const name = item.name || item.product?.name || "Boutique Product";
                  const price = Number(item.price || item.product?.price || 0);
                  const quantity = Number(item.quantity || 1);

                  return (
                    <div key={item.id || item._id} className="flex items-center justify-between gap-3 text-xs sm:text-sm">
                      <span className="text-stone-600 font-bold truncate flex-1">
                        {name} <span className="font-extrabold text-amber-800">× {quantity}</span>
                      </span>
                      <span className="font-black text-stone-900 shrink-0">
                        ₹{(price * quantity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Pricing Breakdown */}
              <div className="border-t border-stone-200/80 pt-4 space-y-2 text-xs sm:text-sm font-bold">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span className="text-stone-900 font-extrabold">₹{Number(subtotal).toLocaleString("en-IN")}</span>
                </div>

                <div className="flex justify-between text-stone-600">
                  <span>Delivery Charge</span>
                  <span className="text-emerald-700 font-extrabold uppercase text-xs">
                    {shipping === 0 ? "Free Express" : `₹${Number(shipping).toLocaleString("en-IN")}`}
                  </span>
                </div>

                <div className="pt-3 border-t border-stone-100 flex justify-between items-center text-base font-black text-stone-900">
                  <span>Total Payable</span>
                  <span className="text-xl font-black text-amber-800">
                    ₹{totalAmount.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Pay Now Button */}
              <button
                type="button"
                onClick={handlePayNow}
                disabled={loading}
                className="w-full bg-stone-900 hover:bg-black text-amber-200 font-extrabold py-4 rounded-2xl text-xs uppercase tracking-wider transition-all duration-300 shadow-md active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2"
              >
                <span>{loading ? "Launching Gateway..." : `Pay ₹${totalAmount.toLocaleString("en-IN")}`}</span>
                {!loading && <ArrowRight size={16} />}
              </button>

              {/* Trust Badge */}
              <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-stone-400 font-medium">
                <Lock size={13} className="text-amber-800" />
                <span>Protected by Razorpay 256-Bit SSL Encryption</span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default PaymentPage;