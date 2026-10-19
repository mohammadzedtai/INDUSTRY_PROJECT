import React, { useState, useEffect, useCallback } from "react";
import { Trash2, X, ShoppingBag, ArrowRight, ShieldCheck, Truck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingItem, setUpdatingItem] = useState(null);
    const [error, setError] = useState("");

    // Fetch cart
    const fetchCart = useCallback(async (showLoading = true) => {
        const token = localStorage.getItem("token");

        if (!token) {
            setCartItems([]);
            setError("Please log in to access your personal shopping bag.");
            setLoading(false);
            return;
        }

        try {
            if (showLoading) setLoading(true);
            setError("");

            const response = await fetch(`${API_BASE_URL}/cart`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Unable to retrieve shopping bag contents.");
            }

            setCartItems(Array.isArray(data.items) ? data.items : []);
        } catch (err) {
            console.error("Fetch cart error:", err);
            setError(err.message || "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    // Update quantity
    const handleQuantityChange = async (item, delta) => {
        const currentQuantity = Number(item.quantity) || 1;
        const newQuantity = currentQuantity + delta;

        if (newQuantity < 1) return;

        const token = localStorage.getItem("token");

        if (!token) {
            alert("Please sign in first.");
            return;
        }

        try {
            setUpdatingItem(item.id);

            const response = await fetch(
                `${API_BASE_URL}/cart/${item.id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        quantity: newQuantity,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Unable to update quantity."
                );
            }

            await fetchCart(false);
        } catch (err) {
            console.error("Quantity update error:", err);
            alert(err.message || "Unable to update item quantity.");
        } finally {
            setUpdatingItem(null);
        }
    };

    // Remove item
    const handleRemoveItem = async (itemId) => {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("Please sign in first.");
            return;
        }

        try {
            setUpdatingItem(itemId);

            const response = await fetch(
                `${API_BASE_URL}/cart/${itemId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Unable to remove item from bag."
                );
            }

            await fetchCart(false);
        } catch (err) {
            console.error("Remove cart item error:", err);
            alert(err.message || "Unable to remove item.");
        } finally {
            setUpdatingItem(null);
        }
    };

    // Price calculations
    const subtotal = cartItems.reduce(
        (acc, item) =>
            acc + Number(item.price || 0) * Number(item.quantity || 0),
        0
    );

    const shipping = 0;
    const total = subtotal + shipping;

    const formatPrice = (price) =>
        Number(price || 0).toLocaleString("en-IN");

    // Loading View
    if (loading) {
        return (
            <div className="w-full bg-gradient-to-b from-stone-50 via-white to-stone-50 min-h-screen py-24 px-4 flex items-center justify-center font-sans">
                <div className="text-center space-y-4">
                    <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto" />
                    <p className="text-sm font-extrabold text-stone-600 tracking-wide uppercase">
                        Retrieving Shopping Bag...
                    </p>
                </div>
            </div>
        );
    }

    // Error View
    if (error) {
        return (
            <div className="w-full bg-gradient-to-b from-stone-50 via-white to-stone-50 min-h-screen py-20 px-4 font-sans text-stone-900 flex items-center justify-center">
                <div className="max-w-md mx-auto text-center">
                    <div className="bg-white rounded-3xl p-10 border border-stone-200/80 shadow-sm space-y-5">
                        <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100">
                            <ShoppingBag size={28} />
                        </div>

                        <p className="text-xs sm:text-sm font-bold text-rose-600 leading-relaxed">
                            {error}
                        </p>

                        {!localStorage.getItem("token") ? (
                            <Link
                                to="/auth"
                                className="inline-flex items-center gap-2 bg-stone-900 hover:bg-black text-amber-200 px-7 py-3.5 rounded-2xl text-xs font-extrabold uppercase tracking-wider shadow-md transition-all"
                            >
                                <span>Sign In To Access</span>
                                <ArrowRight size={15} />
                            </Link>
                        ) : (
                            <button
                                onClick={() => fetchCart()}
                                className="bg-stone-900 hover:bg-black text-amber-200 px-7 py-3.5 rounded-2xl text-xs font-extrabold uppercase tracking-wider shadow-md transition-all"
                            >
                                Retry Connection
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-gradient-to-b from-stone-50 via-white to-stone-50 min-h-screen py-10 px-4 sm:px-8 lg:px-12 font-sans text-stone-900">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
                    <div className="space-y-1">
                        <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-700 flex items-center gap-1.5">
                            <ShoppingBag size={14} /> Personal Curation
                        </span>
                        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                            Your Shopping Bag
                        </h1>
                        <p className="text-xs sm:text-sm text-stone-500 font-medium">
                            Review your selected items before proceeding to checkout.
                        </p>
                    </div>

                    <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-900 text-xs font-extrabold px-4 py-2 rounded-full shadow-sm self-start sm:self-auto">
                        <Sparkles size={14} className="text-amber-600" />
                        <span>{cartItems.length} Reserved Item(s)</span>
                    </div>
                </div>

                {/* Content Layout */}
                {cartItems.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                        {/* Items List Column */}
                        <div className="lg:col-span-8 space-y-4">
                            {cartItems.map((item) => {
                                const variant = [
                                    item.size ? `Size: ${item.size}` : "",
                                    item.color ? `Color: ${item.color}` : "",
                                ]
                                    .filter(Boolean)
                                    .join(" | ");

                                return (
                                    <div
                                        key={item.id}
                                        className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-sm hover:border-amber-300 transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative"
                                    >
                                        {/* Product Image & Details */}
                                        <div className="flex items-center gap-4 min-w-0 flex-1">
                                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-stone-100 border border-stone-200/80 overflow-hidden shrink-0 flex items-center justify-center p-2">
                                                <img
                                                    src={
                                                        item.image ||
                                                        "https://placehold.co/300x300?text=Product"
                                                    }
                                                    alt={item.name || "Product"}
                                                    className="w-full h-full object-cover rounded-xl"
                                                />
                                            </div>

                                            <div className="min-w-0 space-y-1.5 flex-1">
                                                <div className="flex items-start justify-between gap-2 pr-2">
                                                    <h3 className="text-sm sm:text-base font-extrabold text-stone-900 truncate">
                                                        {item.name}
                                                    </h3>

                                                    <button
                                                        onClick={() => handleRemoveItem(item.id)}
                                                        disabled={updatingItem === item.id}
                                                        className="text-stone-400 hover:text-rose-600 transition-colors disabled:opacity-40 p-1"
                                                        aria-label="Remove item"
                                                        title="Remove item"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </div>

                                                {variant && (
                                                    <p className="text-xs text-stone-500 font-bold">
                                                        {variant}
                                                    </p>
                                                )}

                                                <p className="text-xs font-black text-amber-700">
                                                    ₹ {formatPrice(item.price)} <span className="text-[10px] font-medium text-stone-400">/ unit</span>
                                                </p>
                                            </div>
                                        </div>

                                        {/* Controls & Subtotal */}
                                        <div className="flex items-center justify-between sm:flex-col sm:items-end gap-3 shrink-0 pt-3 sm:pt-0 border-t sm:border-0 border-stone-100">
                                            <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-xl px-2 py-1">
                                                <button
                                                    onClick={() => handleQuantityChange(item, -1)}
                                                    disabled={updatingItem === item.id || item.quantity <= 1}
                                                    className="w-7 h-7 flex items-center justify-center text-stone-600 font-bold hover:text-stone-900 disabled:opacity-30 text-sm"
                                                    aria-label="Decrease quantity"
                                                >
                                                    −
                                                </button>

                                                <span className="text-xs font-black text-stone-900 min-w-[20px] text-center">
                                                    {item.quantity}
                                                </span>

                                                <button
                                                    onClick={() => handleQuantityChange(item, 1)}
                                                    disabled={updatingItem === item.id}
                                                    className="w-7 h-7 flex items-center justify-center text-stone-600 font-bold hover:text-stone-900 disabled:opacity-30 text-sm"
                                                    aria-label="Increase quantity"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <div className="text-right">
                                                <p className="text-xs text-stone-400 font-medium hidden sm:block">Item Total</p>
                                                <p className="text-base font-black text-stone-900">
                                                    ₹ {formatPrice(Number(item.price || 0) * Number(item.quantity || 0))}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Order Summary Column */}
                        <div className="lg:col-span-4 space-y-4">
                            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm space-y-6">
                                <h2 className="text-sm font-extrabold uppercase tracking-widest text-stone-400 border-b border-stone-100 pb-4">
                                    Order Summary
                                </h2>

                                <div className="space-y-3.5 text-xs sm:text-sm">
                                    <div className="flex justify-between font-bold text-stone-600">
                                        <span>Subtotal ({cartItems.length} items)</span>
                                        <span className="text-stone-900 font-extrabold">₹ {formatPrice(subtotal)}</span>
                                    </div>

                                    <div className="flex justify-between font-bold text-stone-600">
                                        <span>Complimentary Shipping</span>
                                        <span className="text-emerald-700 font-extrabold uppercase text-xs">Free</span>
                                    </div>

                                    <div className="pt-4 border-t border-stone-200 flex justify-between items-center text-base font-black text-stone-900">
                                        <span>Total Investment</span>
                                        <span className="text-xl text-amber-700">₹ {formatPrice(total)}</span>
                                    </div>
                                </div>

                                <Link
                                    to="/check-out"
                                    className="block w-full bg-stone-900 hover:bg-black text-amber-200 text-center font-extrabold py-4 rounded-2xl text-xs uppercase tracking-wider transition-all shadow-md active:scale-[0.99]"
                                >
                                    Proceed To Checkout
                                </Link>

                                {/* Trust Badges */}
                                <div className="pt-4 border-t border-stone-100 space-y-3 text-[11px] text-stone-500 font-medium">
                                    <div className="flex items-center gap-2.5">
                                        <ShieldCheck size={16} className="text-amber-700 shrink-0" />
                                        <span>256-Bit Encrypted Secure Checkout</span>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <Truck size={16} className="text-amber-700 shrink-0" />
                                        <span>Insured White-Glove Express Delivery</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                ) : (

                    /* Empty State View */
                    <div className="bg-white rounded-3xl p-16 text-center border border-stone-200/80 shadow-sm space-y-5 max-w-lg mx-auto">
                        <div className="w-16 h-16 rounded-3xl bg-amber-50 border border-amber-200/80 text-amber-800 flex items-center justify-center mx-auto shadow-sm">
                            <ShoppingBag size={28} />
                        </div>

                        <div className="space-y-1.5">
                            <h3 className="text-lg font-extrabold text-stone-900">
                                Your Shopping Bag Is Empty
                            </h3>
                            <p className="text-xs text-stone-500 font-medium leading-relaxed">
                                You haven't added any items to your bag yet. Explore our curated collections to discover luxury essentials.
                            </p>
                        </div>

                        <div className="pt-2">
                            <Link
                                to="/product"
                                className="inline-flex items-center gap-2 bg-stone-900 hover:bg-black text-amber-200 font-extrabold px-7 py-3.5 rounded-2xl text-xs uppercase tracking-wider shadow-md transition-all"
                            >
                                <span>Continue Shopping</span>
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default CartPage;