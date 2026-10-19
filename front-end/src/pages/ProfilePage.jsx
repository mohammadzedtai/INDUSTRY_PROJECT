import React, { useState } from 'react';
import {
  User,
  Package,
  MapPin,
  Heart,
  KeyRound,
  LogOut,
  Edit3,
  Crown,
  Sparkles,
  ChevronRight,
  Star,
  ShoppingBag,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowUpRight,
  Plus,
  Trash2,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Check
} from 'lucide-react';

const initialWishlistData = [
  {
    id: 1,
    name: 'Nike Air Force 1 "Special Edition"',
    category: 'Footwear',
    price: 6999,
    originalPrice: 8999,
    rating: 4.8,
    reviews: 124,
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=600&auto=format&fit=crop',
    inStock: true,
  },
  {
    id: 2,
    name: 'Sony WH-1000XM5 Wireless Headphones',
    category: 'Audio & Acoustics',
    price: 12999,
    originalPrice: 15999,
    rating: 4.9,
    reviews: 210,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop',
    inStock: true,
  },
  {
    id: 3,
    name: 'Fossil Townsman Chronograph Watch',
    category: 'Luxury Timepieces',
    price: 8499,
    originalPrice: 10999,
    rating: 4.7,
    reviews: 95,
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=600&auto=format&fit=crop',
    inStock: true,
  },
  {
    id: 4,
    name: 'Artisan Leather Everyday Backpack',
    category: 'Travel & Goods',
    price: 2499,
    originalPrice: 3499,
    rating: 4.6,
    reviews: 80,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop',
    inStock: false,
  },
];

const initialOrdersData = [
  {
    id: '#ORD-982341',
    date: '28 Sep 2026',
    name: 'Nike Air Force 1 "Special Edition"',
    variant: 'Size 9 | Pure White',
    price: 6999,
    status: 'Delivered',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: '#ORD-982340',
    date: '14 Sep 2026',
    name: 'Sony WH-1000XM5 Wireless Headphones',
    variant: 'Silver Gold Edition',
    price: 12999,
    status: 'Processing',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: '#ORD-982339',
    date: '02 Aug 2026',
    name: 'Fossil Townsman Chronograph Watch',
    variant: 'Genuine Leather | Rose Gold',
    price: 8499,
    status: 'Delivered',
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=600&auto=format&fit=crop',
  },
];

const initialAddressesData = [
  {
    id: 1,
    type: 'Home',
    isDefault: true,
    name: 'Arman Tai',
    phone: '+91 98765 43210',
    addressLine: 'Flat 402, Royal Palms Suite, Near Boulevard Tower',
    city: 'Ahmedabad',
    state: 'Gujarat',
    pincode: '380015',
  },
  {
    id: 2,
    type: 'Office',
    isDefault: false,
    name: 'Arman Tai (Work)',
    phone: '+91 98765 12345',
    addressLine: '7th Floor, Horizon Business Park, SG Highway',
    city: 'Ahmedabad',
    state: 'Gujarat',
    pincode: '380054',
  },
];

const WishlistPage = ({ wishlist, setWishlist, onAddToCart }) => {
  const [notification, setNotification] = useState('');

  const handleRemoveFromWishlist = (id) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCartClick = (product) => {
    onAddToCart(product);
    setNotification(`"${product.name}" added to shopping bag!`);
    setTimeout(() => setNotification(''), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#081225] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs font-semibold animate-bounce border border-amber-500/20">
          <Sparkles size={16} className="text-[#C5A059]" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-4 gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 tracking-tight flex items-center gap-2">
            Curated Wishlist
          </h2>
          <p className="text-xs text-gray-400 font-medium mt-0.5">
            Your personal selection of luxury favorites
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="bg-[#FAF3EA] border border-[#EEDFCD] text-[#966F33] text-xs font-extrabold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
            <Sparkles size={13} /> {wishlist.length} Items Saved
          </span>
        </div>
      </div>

      {/* Wishlist Grid */}
      {wishlist.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-3xl p-4 border border-gray-100/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_35px_rgba(150,111,51,0.08)] transition-all duration-500 flex flex-col justify-between relative overflow-hidden"
            >
              {/* Product Card Image Container */}
              <div className="relative w-full h-56 bg-[#FAF9F6] rounded-2xl overflow-hidden flex items-center justify-center p-5 border border-gray-100/60">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain mix-blend-multiply group-hover:scale-108 transition-transform duration-500"
                />

                {/* Subtle Stock Badge */}
                <div className="absolute top-3 left-3">
                  {product.inStock ? (
                    <span className="bg-emerald-50/90 backdrop-blur-md text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-200/50 uppercase tracking-widest">
                      In Stock
                    </span>
                  ) : (
                    <span className="bg-gray-100/90 backdrop-blur-md text-gray-500 text-[10px] font-bold px-2.5 py-1 rounded-full border border-gray-200/50 uppercase tracking-widest">
                      Waitlist
                    </span>
                  )}
                </div>

                {/* Quick Action Heart Button */}
                <button
                  onClick={() => handleRemoveFromWishlist(product.id)}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md shadow-sm border border-gray-100 flex items-center justify-center text-rose-500 hover:scale-110 active:scale-95 transition-all duration-200"
                  title="Remove from wishlist"
                >
                  <Heart size={16} fill="currentColor" />
                </button>
              </div>

              {/* Product Info */}
              <div className="pt-4 pb-1 space-y-2.5">
                <div className="flex items-center justify-between text-[11px] text-gray-400 font-semibold uppercase tracking-wider">
                  <span>{product.category}</span>
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star size={12} fill="currentColor" />
                    <span className="text-gray-700 font-bold">{product.rating}</span>
                    <span className="text-gray-400">({product.reviews})</span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#966F33] transition-colors line-clamp-1">
                  {product.name}
                </h3>

                <div className="flex items-baseline gap-2 pt-0.5">
                  <span className="text-base font-black text-gray-900">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs font-semibold text-gray-400 line-through">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>

                {/* Luxury Action Button */}
                <button
                  onClick={() => handleCartClick(product)}
                  className="w-full mt-2 bg-[#FAF3EA] hover:bg-[#081225] text-[#966F33] hover:text-white border border-[#EEDFCD] hover:border-[#081225] font-extrabold py-3 rounded-2xl text-xs transition-all duration-300 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                >
                  <ShoppingBag size={14} /> Add To Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm space-y-4 my-6">
          <div className="w-16 h-16 rounded-3xl bg-[#FAF3EA] text-[#966F33] flex items-center justify-center mx-auto border border-[#EEDFCD]">
            <Heart size={26} />
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-bold text-gray-900">Your Wishlist is Empty</h4>
            <p className="text-xs text-gray-400 max-w-xs mx-auto">
              Save your most desired luxury items here to view or purchase them later.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const MyOrdersPage = ({ orders }) => {
  const [activeTab, setActiveTab] = useState('All');

  const filteredOrders = orders.filter((order) => {
    if (activeTab === 'All') return true;
    return order.status.toLowerCase() === activeTab.toLowerCase();
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wide bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            <CheckCircle2 size={12} /> Delivered
          </span>
        );
      case 'Processing':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wide bg-amber-50 text-amber-700 border border-amber-200/60">
            <Clock size={12} /> Processing
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wide bg-rose-50 text-rose-700 border border-rose-200/60">
            <XCircle size={12} /> Canceled
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 tracking-tight">
          Purchase History
        </h2>
        <p className="text-xs text-gray-400 font-medium mt-0.5">
          Track and review your past order details
        </p>
      </div>

      {/* Aesthetic Light Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['All', 'Delivered', 'Processing', 'Canceled'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold tracking-wide transition-all whitespace-nowrap ${
              activeTab === tab
                ? 'bg-[#FAF3EA] text-[#966F33] border border-[#EEDFCD] shadow-sm'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order, idx) => (
            <div
              key={idx}
              className="group bg-white rounded-3xl p-4 sm:p-5 border border-gray-100/80 shadow-[0_2px_15px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.05)] transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="w-20 h-20 rounded-2xl bg-[#FAF9F6] border border-gray-100 overflow-hidden shrink-0 flex items-center justify-center p-2">
                  <img
                    src={order.image}
                    alt={order.name}
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-xs font-mono font-bold text-gray-800 tracking-wider">
                      {order.id}
                    </span>
                    {getStatusBadge(order.status)}
                  </div>

                  <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#966F33] transition-colors">
                    {order.name}
                  </h3>
                  <p className="text-[11px] text-gray-400 font-medium">
                    {order.variant} • {order.date}
                  </p>
                </div>
              </div>

              <div className="flex sm:flex-col justify-between sm:justify-center items-end w-full sm:w-auto border-t sm:border-t-0 border-gray-50 pt-3 sm:pt-0">
                <span className="text-base sm:text-lg font-black text-gray-900">
                  ₹{order.price.toLocaleString('en-IN')}
                </span>

                <button className="inline-flex items-center gap-1 text-xs font-extrabold text-[#966F33] hover:text-black tracking-wide transition-colors pt-1">
                  <span>View Invoice</span>
                  <ArrowUpRight size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FAF3EA] text-[#966F33] flex items-center justify-center mx-auto border border-[#EEDFCD]">
            <Package size={22} />
          </div>
          <h4 className="text-base font-bold text-gray-900">No Orders Found</h4>
          <p className="text-xs text-gray-400 max-w-xs mx-auto">
            You currently have no orders listed under {activeTab.toLowerCase()} status.
          </p>
        </div>
      )}
    </div>
  );
};

const AddressesPage = ({ addresses, setAddresses }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAddr, setNewAddr] = useState({
    type: 'Home',
    name: '',
    phone: '',
    addressLine: '',
    city: '',
    state: '',
    pincode: '',
  });

  const handleSetDefault = (id) => {
    setAddresses((prev) =>
      prev.map((addr) => ({ ...addr, isDefault: addr.id === id }))
    );
  };

  const handleDelete = (id) => {
    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newAddr.name || !newAddr.addressLine) return;
    setAddresses((prev) => [
      ...prev,
      { ...newAddr, id: Date.now(), isDefault: prev.length === 0 },
    ]);
    setShowAddModal(false);
    setNewAddr({ type: 'Home', name: '', phone: '', addressLine: '', city: '', state: '', pincode: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 tracking-tight">
            Saved Addresses
          </h2>
          <p className="text-xs text-gray-400 font-medium mt-0.5">
            Manage your delivery and billing locations
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#081225] hover:bg-black text-white text-xs font-bold px-4 py-2.5 rounded-2xl transition-all shadow-md flex items-center gap-1.5"
        >
          <Plus size={15} /> Add New
        </button>
      </div>

      {/* Address Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={`bg-white rounded-3xl p-5 border transition-all duration-300 relative flex flex-col justify-between ${
              addr.isDefault
                ? 'border-[#966F33] ring-1 ring-[#966F33]/20 shadow-md'
                : 'border-gray-100 hover:border-gray-200'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#966F33] bg-[#FAF3EA] px-3 py-1 rounded-full border border-[#EEDFCD]">
                  {addr.type}
                </span>
                {addr.isDefault && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Check size={10} /> Default
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-bold text-gray-900">{addr.name}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {addr.addressLine}, {addr.city}, {addr.state} -{' '}
                  <span className="font-semibold text-gray-700">{addr.pincode}</span>
                </p>
                <p className="text-xs font-semibold text-gray-700 pt-1">
                  Phone: {addr.phone}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-gray-50 pt-4 mt-4">
              {!addr.isDefault && (
                <button
                  onClick={() => handleSetDefault(addr.id)}
                  className="text-xs font-bold text-gray-600 hover:text-[#966F33] transition-colors"
                >
                  Set as Default
                </button>
              )}
              <button
                onClick={() => handleDelete(addr.id)}
                className="text-xs font-bold text-rose-500 hover:text-rose-700 transition-colors ml-auto flex items-center gap-1"
              >
                <Trash2 size={13} /> Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Address Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 border border-gray-100 shadow-2xl">
            <h3 className="text-lg font-serif font-bold text-gray-900">
              Add New Address
            </h3>
            <form onSubmit={handleAddSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Full Name"
                required
                value={newAddr.name}
                onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })}
                className="w-full text-xs font-semibold p-3.5 rounded-2xl border border-gray-200 focus:outline-none focus:border-gray-900"
              />
              <input
                type="text"
                placeholder="Phone Number"
                required
                value={newAddr.phone}
                onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                className="w-full text-xs font-semibold p-3.5 rounded-2xl border border-gray-200 focus:outline-none focus:border-gray-900"
              />
              <textarea
                placeholder="Street Address, Flat, Building"
                required
                rows={2}
                value={newAddr.addressLine}
                onChange={(e) => setNewAddr({ ...newAddr, addressLine: e.target.value })}
                className="w-full text-xs font-semibold p-3.5 rounded-2xl border border-gray-200 focus:outline-none focus:border-gray-900"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="City"
                  required
                  value={newAddr.city}
                  onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                  className="w-full text-xs font-semibold p-3.5 rounded-2xl border border-gray-200 focus:outline-none focus:border-gray-900"
                />
                <input
                  type="text"
                  placeholder="Pincode"
                  required
                  value={newAddr.pincode}
                  onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                  className="w-full text-xs font-semibold p-3.5 rounded-2xl border border-gray-200 focus:outline-none focus:border-gray-900"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 py-3 rounded-2xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-3 rounded-2xl bg-[#081225] text-white text-xs font-bold hover:bg-black"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const ChangePasswordPage = () => {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 4000);
  };

  return (
    <div className="space-y-6 max-w-xl">
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 tracking-tight">
          Security & Password
        </h2>
        <p className="text-xs text-gray-400 font-medium mt-0.5">
          Update your password and security options
        </p>
      </div>

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold flex items-center gap-2">
          <ShieldCheck size={16} /> Password updated successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-700">Current Password</label>
          <div className="relative">
            <input
              type={showOld ? 'text' : 'password'}
              required
              className="w-full text-xs font-semibold p-3.5 rounded-2xl border border-gray-200 focus:outline-none focus:border-gray-900"
            />
            <button
              type="button"
              onClick={() => setShowOld(!showOld)}
              className="absolute right-4 top-3.5 text-gray-400"
            >
              {showOld ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-700">New Password</label>
          <div className="relative">
            <input
              type={showNew ? 'text' : 'password'}
              required
              className="w-full text-xs font-semibold p-3.5 rounded-2xl border border-gray-200 focus:outline-none focus:border-gray-900"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-4 top-3.5 text-gray-400"
            >
              {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-[#081225] hover:bg-black text-white font-bold py-3.5 rounded-2xl text-xs transition-all shadow-md mt-2"
        >
          Update Password
        </button>
      </form>
    </div>
  );
};

export default function ProfileDashboard() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);

  const [wishlist, setWishlist] = useState(initialWishlistData);
  const [orders, setOrders] = useState(initialOrdersData);
  const [addresses, setAddresses] = useState(initialAddressesData);
  const [cartCount, setCartCount] = useState(2);

  const [userData, setUserData] = useState({
    fullName: 'Arman Tai',
    email: 'arman@gmail.com',
    mobile: '+91 98765 43210',
    dob: '1998-05-15',
    gender: 'Male',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsEditing(false);
  };

  const handleAddToCart = () => {
    setCartCount((prev) => prev + 1);
  };

  const menuItems = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'wishlist', label: 'My Wishlist', icon: Heart, badge: wishlist.length },
    { id: 'orders', label: 'My Orders', icon: Package, badge: orders.length },
    { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
    { id: 'password', label: 'Security & Password', icon: KeyRound },
  ];

  return (
    <div className="w-full bg-[#FAF9F6] min-h-screen py-8 px-4 sm:px-6 lg:px-12 font-sans selection:bg-[#FAF3EA] selection:text-[#966F33]">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Soft Light Luxury Banner Header */}
        <div className="relative rounded-3xl bg-white p-6 sm:p-8 text-gray-900 shadow-[0_4px_30px_rgba(0,0,0,0.02)] border border-gray-100 overflow-hidden">
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5 sm:gap-6">
              {/* Profile Avatar */}
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#FAF3EA] border-2 border-[#EEDFCD] p-1 shadow-sm flex items-center justify-center">
                  <div className="w-full h-full bg-[#081225] rounded-xl flex items-center justify-center text-white font-serif font-extrabold text-2xl sm:text-3xl">
                    {userData.fullName ? userData.fullName.charAt(0).toUpperCase() : 'A'}
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 bg-[#FAF3EA] text-[#966F33] p-1.5 rounded-xl border border-[#EEDFCD] shadow-sm">
                  <Crown size={15} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 tracking-tight">
                    {userData.fullName}
                  </h1>
                  <span className="bg-[#FAF3EA] border border-[#EEDFCD] text-[#966F33] text-[10px] font-extrabold px-3 py-1 rounded-full flex items-center gap-1 uppercase tracking-widest shadow-sm">
                    <Sparkles size={11} /> VIP Member
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-500 font-medium">
                  {userData.email}
                </p>
                <p className="text-[11px] text-[#966F33] font-extrabold tracking-wider uppercase pt-0.5">
                  Private Tier • Member Since 2024
                </p>
              </div>
            </div>

            {/* Stat Badges */}
            <div className="bg-[#FAF9F6] border border-gray-100/80 p-4 rounded-2xl flex items-center gap-6 text-center w-full sm:w-auto justify-around">
              <div>
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Total Orders</p>
                <p className="text-lg font-black text-gray-900">{orders.length}</p>
              </div>
              <div className="w-[1px] h-8 bg-gray-200" />
              <div>
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Saved Items</p>
                <p className="text-lg font-black text-[#966F33]">{wishlist.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDEBAR NAVIGATION */}
          <div className="lg:col-span-3 bg-white p-3 rounded-3xl border border-gray-100 shadow-sm space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                    isActive
                      ? 'bg-[#FAF3EA] text-[#966F33] border border-[#EEDFCD] shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className={isActive ? 'text-[#966F33]' : 'text-gray-400'} />
                    <span>{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.badge !== undefined && (
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        isActive ? 'bg-[#966F33] text-white' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight size={14} className={`transition-transform ${isActive ? 'rotate-90 text-[#966F33]' : 'opacity-30'}`} />
                  </div>
                </button>
              );
            })}

            <div className="pt-2 border-t border-gray-100">
              <button
                onClick={() => alert('Signed out successfully!')}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs sm:text-sm font-bold text-rose-600 hover:bg-rose-50 transition-all"
              >
                <LogOut size={18} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* RIGHT CONTENT DISPLAY CARD */}
          <div className="lg:col-span-9 bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm min-h-[520px]">
            
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 tracking-tight">
                      Personal Details
                    </h2>
                    <p className="text-xs text-gray-400 font-medium">Manage your personal details</p>
                  </div>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-4 py-2.5 rounded-2xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <Edit3 size={14} />
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </button>
                </div>

                <form onSubmit={handleSave} className="space-y-5 max-w-2xl">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700 block">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        disabled={!isEditing}
                        value={userData.fullName}
                        onChange={handleInputChange}
                        className="w-full text-xs sm:text-sm font-semibold p-3.5 rounded-2xl border border-gray-200 focus:outline-none focus:border-gray-900 disabled:bg-gray-50/60 disabled:text-gray-700 transition-colors bg-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700 block">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        disabled={!isEditing}
                        value={userData.email}
                        onChange={handleInputChange}
                        className="w-full text-xs sm:text-sm font-semibold p-3.5 rounded-2xl border border-gray-200 focus:outline-none focus:border-gray-900 disabled:bg-gray-50/60 disabled:text-gray-700 transition-colors bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700 block">Phone Number</label>
                      <input
                        type="text"
                        name="mobile"
                        disabled={!isEditing}
                        value={userData.mobile}
                        onChange={handleInputChange}
                        className="w-full text-xs sm:text-sm font-semibold p-3.5 rounded-2xl border border-gray-200 focus:outline-none focus:border-gray-900 disabled:bg-gray-50/60 disabled:text-gray-700 transition-colors bg-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700 block">Date of Birth</label>
                      <input
                        type="date"
                        name="dob"
                        disabled={!isEditing}
                        value={userData.dob}
                        onChange={handleInputChange}
                        className="w-full text-xs sm:text-sm font-semibold p-3.5 rounded-2xl border border-gray-200 focus:outline-none focus:border-gray-900 disabled:bg-gray-50/60 disabled:text-gray-700 transition-colors bg-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 block">Gender</label>
                    <select
                      name="gender"
                      disabled={!isEditing}
                      value={userData.gender}
                      onChange={handleInputChange}
                      className="w-full text-xs sm:text-sm font-semibold p-3.5 rounded-2xl border border-gray-200 focus:outline-none focus:border-gray-900 disabled:bg-gray-50/60 disabled:text-gray-700 transition-colors bg-white cursor-pointer"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {isEditing && (
                    <button
                      type="submit"
                      className="w-full bg-[#081225] hover:bg-black text-white font-bold py-3.5 rounded-2xl text-xs sm:text-sm transition-all shadow-md mt-2"
                    >
                      Save Changes
                    </button>
                  )}
                </form>
              </div>
            )}

            {activeTab === 'wishlist' && (
              <WishlistPage
                wishlist={wishlist}
                setWishlist={setWishlist}
                onAddToCart={handleAddToCart}
              />
            )}

            {activeTab === 'orders' && <MyOrdersPage orders={orders} />}
            {activeTab === 'addresses' && (
              <AddressesPage addresses={addresses} setAddresses={setAddresses} />
            )}
            {activeTab === 'password' && <ChangePasswordPage />}

          </div>

        </div>

      </div>
    </div>
  );
}