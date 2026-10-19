import React, { useEffect, useState } from "react";
import { CheckCircle2, MapPin, Plus, ShieldCheck, Truck, ArrowRight, Sparkles, CreditCard, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PaymentPage from "./PaymentPage";
import { getAddresses, getCart } from "../api/api";

const API = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

// Empty address form
const emptyAddress = {
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
};

const CheckoutPage = () => {
    const navigate = useNavigate();

    // States
    const [addresses, setAddresses] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState("");
    const [form, setForm] = useState(emptyAddress);
    const [showForm, setShowForm] = useState(false);
    const [payment, setPayment] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Token for API requests
    const token = localStorage.getItem("token");

    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };

    // Load addresses and cart
    useEffect(() => {
        const loadData = async () => {
            if (!localStorage.getItem("token")) {
                navigate("/auth");
                return;
            }

            try {
                const addressData = await getAddresses();
                const cartData = await getCart();

                const savedAddresses = addressData.addresses || [];
                const savedCart = cartData.items || [];

                setAddresses(savedAddresses);
                setCartItems(savedCart);

                // Select default address, or first address
                const defaultAddress = savedAddresses.find(
                    (address) => address.isDefault
                );

                setSelectedAddress(
                    defaultAddress?._id || savedAddresses[0]?._id || ""
                );

                // Show form if no address exists
                if (savedAddresses.length === 0) {
                    setShowForm(true);
                }
            } catch (err) {
                setError(err.message || "Failed to retrieve checkout parameters.");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [navigate]);

    // Update address form
    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: value,
        });
    };

    // Save new address
    const addAddress = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch(`${API}/address`, {
                method: "POST",
                headers,
                body: JSON.stringify(form),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Unable to save delivery address.");
            }

            let newAddress = data.address;

            if (!newAddress?._id) {
                const refreshResponse = await fetch(`${API}/address`, {
                    headers,
                });

                const refreshData = await refreshResponse.json();

                if (!refreshResponse.ok) {
                    throw new Error("Failed to refresh address repository.");
                }

                const updatedAddresses = refreshData.addresses || [];

                setAddresses(updatedAddresses);
                newAddress = updatedAddresses[0];
            } else {
                setAddresses((oldAddresses) => [
                    newAddress,
                    ...oldAddresses,
                ]);
            }

            if (newAddress?._id) {
                setSelectedAddress(newAddress._id);
            }

            setForm(emptyAddress);
            setShowForm(false);
        } catch (err) {
            setError(err.message || "An error occurred while saving.");
        }
    };

    // Get selected address
    const selected = addresses.find(
        (address) => address._id === selectedAddress
    );

    // Calculate total price
    const subtotal = cartItems.reduce((total, item) => {
        const price = Number(item.price || item.product?.price || 0);
        const quantity = Number(item.quantity || 1);

        return total + price * quantity;
    }, 0);

    const money = (amount) =>
        Number(amount || 0).toLocaleString("en-IN");

    // Loading Screen
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-stone-50 via-white to-stone-50 flex items-center justify-center font-sans">
                <div className="text-center space-y-4">
                    <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto" />
                    <p className="text-sm font-extrabold text-stone-600 tracking-wide uppercase">
                        Initializing Secure Checkout...
                    </p>
                </div>
            </div>
        );
    }

    // Payment Screen Component Render
    if (payment) {
        return (
            <PaymentPage
                selectedAddress={selected}
                orderItems={cartItems}
                subtotal={subtotal}
                shipping={0}
                total={subtotal}
            />
        );
    }

    return (
        <div className="w-full bg-gradient-to-b from-stone-50 via-white to-stone-50 min-h-screen py-10 px-4 sm:px-8 lg:px-12 font-sans text-stone-900">
            <div className="max-w-7xl mx-auto space-y-10">

                {/* Progress Steps Header */}
                <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm max-w-2xl mx-auto">
                    <div className="flex items-center justify-between relative px-2">
                        {[
                            { label: "Dispatch Address", icon: MapPin },
                            { label: "Payment Method", icon: CreditCard },
                            { label: "Order Confirmed", icon: Lock },
                        ].map((step, index) => {
                            const Icon = step.icon;
                            const isCurrent = index === 0;
                            return (
                                <div key={step.label} className="flex flex-col items-center relative z-10 space-y-1.5">
                                    <div
                                        className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-black transition-all ${
                                            isCurrent
                                                ? "bg-stone-900 text-amber-300 shadow-md scale-105"
                                                : "bg-stone-100 text-stone-400 border border-stone-200"
                                        }`}
                                    >
                                        <Icon size={18} />
                                    </div>
                                    <span className={`text-[11px] font-extrabold tracking-wider uppercase ${isCurrent ? "text-stone-900" : "text-stone-400"}`}>
                                        {step.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="max-w-7xl mx-auto bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl text-xs sm:text-sm font-bold shadow-sm">
                        {error}
                    </div>
                )}

                {/* Main 2-Column Checkout Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Left Column: Address Selection & Form */}
                    <div className="lg:col-span-7 space-y-6">
                        
                        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm space-y-6">
                            
                            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                                <div className="space-y-0.5">
                                    <h2 className="text-lg font-extrabold text-stone-900">
                                        Select Shipping Destination
                                    </h2>
                                    <p className="text-xs text-stone-500 font-medium">
                                        Choose where you would like your luxury package delivered.
                                    </p>
                                </div>

                                <button
                                    onClick={() => setShowForm(!showForm)}
                                    className="inline-flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all"
                                >
                                    <Plus size={14} />
                                    <span>{showForm ? "Cancel" : "Add Address"}</span>
                                </button>
                            </div>

                            {/* Saved Address Cards */}
                            <div className="space-y-3">
                                {addresses.map((address) => {
                                    const isSelected = selectedAddress === address._id;
                                    return (
                                        <button
                                            key={address._id}
                                            onClick={() => setSelectedAddress(address._id)}
                                            className={`w-full text-left rounded-2xl p-5 border transition-all duration-300 relative ${
                                                isSelected
                                                    ? "bg-amber-50/40 border-amber-400 shadow-md ring-1 ring-amber-400"
                                                    : "bg-stone-50/50 border-stone-200/80 hover:bg-stone-50"
                                            }`}
                                        >
                                            <div className="flex items-start gap-3.5">
                                                <CheckCircle2
                                                    size={20}
                                                    className={`shrink-0 mt-0.5 ${
                                                        isSelected ? "text-amber-700" : "text-stone-300"
                                                    }`}
                                                />

                                                <div className="space-y-1 text-xs sm:text-sm font-medium text-stone-700">
                                                    <p className="font-extrabold text-stone-900 text-sm">
                                                        {address.name}
                                                    </p>
                                                    <p className="leading-relaxed">
                                                        {address.street}
                                                    </p>
                                                    <p className="font-bold text-stone-800">
                                                        {address.city}, {address.state} — {address.pincode}
                                                    </p>
                                                    <p className="text-stone-500 font-mono text-xs pt-1 flex items-center gap-1">
                                                        <MapPin size={12} className="text-amber-700 inline" />
                                                        <span>Phone: {address.phone}</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Add Address Form Accordion */}
                            {showForm && (
                                <form
                                    onSubmit={addAddress}
                                    className="bg-stone-50 rounded-2xl p-6 border border-stone-200 space-y-4 pt-4"
                                >
                                    <h3 className="text-xs font-extrabold uppercase tracking-widest text-amber-800">
                                        Add New Delivery Destination
                                    </h3>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <input
                                            name="name"
                                            value={form.name}
                                            onChange={handleChange}
                                            placeholder="Full Name *"
                                            required
                                            className="w-full border border-stone-200 rounded-xl p-3 text-xs font-semibold outline-none focus:border-amber-600 bg-white"
                                        />

                                        <input
                                            name="phone"
                                            value={form.phone}
                                            onChange={handleChange}
                                            placeholder="10-Digit Phone *"
                                            type="tel"
                                            pattern="[0-9]{10}"
                                            maxLength={10}
                                            required
                                            className="w-full border border-stone-200 rounded-xl p-3 text-xs font-semibold outline-none focus:border-amber-600 bg-white"
                                        />
                                    </div>

                                    <input
                                        name="street"
                                        value={form.street}
                                        onChange={handleChange}
                                        placeholder="Flat, House No., Street, Area *"
                                        required
                                        className="w-full border border-stone-200 rounded-xl p-3 text-xs font-semibold outline-none focus:border-amber-600 bg-white"
                                    />

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <input
                                            name="city"
                                            value={form.city}
                                            onChange={handleChange}
                                            placeholder="City *"
                                            required
                                            className="w-full border border-stone-200 rounded-xl p-3 text-xs font-semibold outline-none focus:border-amber-600 bg-white"
                                        />

                                        <input
                                            name="state"
                                            value={form.state}
                                            onChange={handleChange}
                                            placeholder="State *"
                                            required
                                            className="w-full border border-stone-200 rounded-xl p-3 text-xs font-semibold outline-none focus:border-amber-600 bg-white"
                                        />

                                        <input
                                            name="pincode"
                                            value={form.pincode}
                                            onChange={handleChange}
                                            placeholder="PIN Code *"
                                            inputMode="numeric"
                                            pattern="[0-9]{6}"
                                            maxLength={6}
                                            required
                                            className="w-full border border-stone-200 rounded-xl p-3 text-xs font-semibold outline-none focus:border-amber-600 bg-white"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-stone-900 hover:bg-black text-amber-200 font-extrabold py-3 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md"
                                    >
                                        Save & Apply Address
                                    </button>
                                </form>
                            )}

                        </div>

                    </div>

                    {/* Right Column: Order Summary & Checkout Action */}
                    <div className="lg:col-span-5 space-y-6">
                        
                        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm space-y-6">
                            
                            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                                <h2 className="text-sm font-extrabold uppercase tracking-widest text-stone-400">
                                    Order Summary ({cartItems.length})
                                </h2>
                                <span className="text-xs font-extrabold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200/60">
                                    Reserved
                                </span>
                            </div>

                            {/* Cart Item Cards */}
                            <div className="space-y-4 max-h-80 overflow-y-auto pr-1 scrollbar-none">
                                {cartItems.length === 0 ? (
                                    <div className="text-center py-6 space-y-2">
                                        <p className="text-xs text-stone-500 font-bold">Your shopping bag is empty.</p>
                                        <button
                                            onClick={() => navigate("/product")}
                                            className="text-xs text-amber-700 font-extrabold uppercase underline"
                                        >
                                            Explore Boutique
                                        </button>
                                    </div>
                                ) : (
                                    cartItems.map((item) => {
                                        const name = item.name || item.product?.name || "Boutique Product";
                                        const image = item.image || item.product?.images?.[0] || "https://placehold.co/100";
                                        const price = Number(item.price || item.product?.price || 0);
                                        const quantity = Number(item.quantity || 1);

                                        return (
                                            <div
                                                key={item.id || item._id}
                                                className="flex items-center gap-3.5 pb-3 border-b border-stone-100 last:border-0 last:pb-0"
                                            >
                                                <img
                                                    src={image}
                                                    alt={name}
                                                    className="w-14 h-14 rounded-xl object-cover bg-stone-50 p-1 border border-stone-100 shrink-0"
                                                />

                                                <div className="flex-1 min-w-0 space-y-0.5">
                                                    <p className="text-xs font-extrabold text-stone-900 truncate">
                                                        {name}
                                                    </p>
                                                    <p className="text-[11px] text-stone-400 font-medium">
                                                        Qty: <span className="font-bold text-stone-800">{quantity}</span>
                                                        {item.size && ` | Size: ${item.size}`}
                                                    </p>
                                                </div>

                                                <p className="text-xs font-black text-stone-900 shrink-0">
                                                    ₹{money(price * quantity)}
                                                </p>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            {/* Total Pricing Breakdown */}
                            <div className="border-t border-stone-200 pt-4 space-y-2.5 text-xs sm:text-sm font-bold">
                                <div className="flex justify-between text-stone-600">
                                    <span>Subtotal</span>
                                    <span className="text-stone-900 font-extrabold">₹{money(subtotal)}</span>
                                </div>

                                <div className="flex justify-between text-stone-600">
                                    <span>Insured Delivery</span>
                                    <span className="text-emerald-700 font-extrabold uppercase text-xs">Complimentary</span>
                                </div>

                                <div className="pt-3 border-t border-stone-100 flex justify-between items-center text-base font-black text-stone-900">
                                    <span>Grand Total</span>
                                    <span className="text-xl text-amber-700">₹{money(subtotal)}</span>
                                </div>
                            </div>

                            {/* Continue CTA */}
                            <button
                                disabled={!selected || cartItems.length === 0}
                                onClick={() => {
                                    if (!selected) {
                                        setError("Please select or specify a delivery address to proceed.");
                                        setShowForm(true);
                                        return;
                                    }

                                    if (cartItems.length === 0) {
                                        setError("Your shopping bag is currently empty.");
                                        return;
                                    }

                                    setError("");
                                    setPayment(true);
                                }}
                                className="w-full bg-stone-900 hover:bg-black text-amber-200 font-extrabold py-4 rounded-2xl text-xs uppercase tracking-wider transition-all shadow-md active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <span>{!selected ? "Select Address To Continue" : "Proceed To Payment"}</span>
                                <ArrowRight size={16} />
                            </button>

                            {/* Security Note */}
                            <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-stone-400 font-medium">
                                <ShieldCheck size={14} className="text-amber-700" />
                                <span>256-Bit SSL Encrypted & Protected Checkout</span>
                            </div>

                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
};

export default CheckoutPage;