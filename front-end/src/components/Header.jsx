import React, { useEffect, useState } from 'react';
import { ShoppingBag, User, LogOut, Store, Menu, X, Heart, Sparkles } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getWishlist } from '../api/api';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/product' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Orders', path: '/my-orders' }
  ];

  const handleLogout = () => {
    alert("Logged out successfully!");
    localStorage.removeItem("token");
    navigate("/auth");
  };

  useEffect(() => {
    const fetchWishlistCount = async () => {
      if (!localStorage.getItem("token")) {
        setWishlistCount(0);
        return;
      }

      try {
        const response = await getWishlist();
        const products = response?.products || [];
        setWishlistCount(products.length);
      } catch (error) {
        console.log("Wishlist error:", error.message);
      }
    };

    fetchWishlistCount();

    window.addEventListener("wishlistUpdated", fetchWishlistCount);
    return () => {
      window.removeEventListener("wishlistUpdated", fetchWishlistCount);
    };
  }, [location.pathname]);

  return (
    <header className={`w-full bg-white/90 backdrop-blur-md sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'shadow-md border-b border-gray-100 py-3' : 'border-b border-gray-200 py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

        {/* Left: Logo & Brand Name */}
        <Link to="/" onClick={closeMenu} className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-amber-600/20 group-hover:scale-105 transition-transform">
            <Store size={22} />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold text-gray-900 tracking-tight flex items-center gap-1">
              ShopNest
            </span>
            <span className="text-[10px] uppercase tracking-widest font-semibold text-amber-600 -mt-1">
              Store
            </span>
          </div>
        </Link>

        {/* ==================== CENTER NAV LINKS (NEW UI) ==================== */}
        <nav className="hidden md:flex items-center p-1.5 bg-gray-100/80 backdrop-blur-sm rounded-2xl border border-gray-200/70 shadow-sm">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`relative px-5 py-2 text-sm font-semibold rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'text-gray-900 bg-white shadow-sm shadow-gray-200 ring-1 ring-black/5'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
                }`}
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  {link.name}
                  {/* Active Animated Dot */}
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></span>
                  )}
                </span>
              </Link>
            );
          })}
        </nav>
        {/* ==================================================================== */}

        {/* Right: Action Icons & Mobile Menu Button */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Wishlist Icon Button */}
          <Link to={token ? "/wishlist" : "/auth"} onClick={closeMenu}>
            <button
              aria-label="Wishlist"
              title="Wishlist"
              className="p-2.5 text-gray-700 hover:text-amber-600 hover:bg-amber-50 rounded-full transition-all relative"
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-amber-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm animate-pulse">
                  {wishlistCount > 99 ? "99+" : wishlistCount}
                </span>
              )}
            </button>
          </Link>

          {/* Shopping Cart Icon Button */}
          <Link to={token ? "/cart" : "/auth"} onClick={closeMenu}>
            <button
              aria-label="Shopping Cart"
              title="Cart"
              className="p-2.5 text-gray-700 hover:text-amber-600 hover:bg-amber-50 rounded-full transition-all relative"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-amber-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>
          </Link>

          <div className="h-5 w-[1px] bg-gray-200 mx-1"></div>

          {/* Auth Button (Login / Logout) */}
          {token ? (
            <button
              onClick={handleLogout}
              aria-label="Logout"
              title="Logout"
              className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-full transition-all border border-red-100"
            >
              <LogOut size={18} />
              <span className="hidden lg:inline">Logout</span>
            </button>
          ) : (
            <Link to="/auth" onClick={closeMenu}>
              <button
                aria-label="User Profile"
                title="Login"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-full transition-all shadow-sm"
              >
                <User size={16} />
                <span>Sign In</span>
              </button>
            </Link>
          )}

          {/* Mobile Hamburger Menu Toggle Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Navigation Menu"
            className="p-2.5 md:hidden text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

      </div>

      {/* Mobile Navigation Drawer */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-xl px-6 py-6 space-y-3 transition-all animate-fadeIn">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={closeMenu}
                className={`block text-base font-semibold py-3 px-4 rounded-xl transition-all ${
                  isActive
                    ? 'bg-amber-50 text-amber-800 border-l-4 border-amber-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};

export default Header;