import React from 'react';
import { Store, Mail, Phone, MapPin, Sparkles } from 'lucide-react';
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="w-full bg-[#0C0A09] text-stone-300 pt-16 pb-8 px-6 md:px-12 border-t border-stone-800 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800/80">
        
        {/* Brand Info */}
        <div className="lg:col-span-2 space-y-4">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#FAF3EA]/10 border border-[#FAF3EA]/30 flex items-center justify-center text-amber-200">
              <Store size={20} />
            </div>
            <span className="text-2xl font-black text-white tracking-tight">
              ShopNest
            </span>
          </Link>
          <p className="text-stone-400 text-xs sm:text-sm max-w-sm leading-relaxed font-medium">
            Your destination for luxury fashion, lifestyle essentials, and modern curated collections. Discover timeless elegance with seamless shopping.
          </p>
          
          {/* Social Icons */}
          <div className="flex items-center gap-3 pt-2">
            <a 
              href="#facebook" 
              className="w-9 h-9 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 hover:bg-[#966F33] hover:text-white hover:border-[#966F33] transition-all flex items-center justify-center text-xs shadow-sm"
              aria-label="Facebook"
            >
              <FaFacebookF size={14} />
            </a>
            <a 
              href="#instagram" 
              className="w-9 h-9 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 hover:bg-[#966F33] hover:text-white hover:border-[#966F33] transition-all flex items-center justify-center text-xs shadow-sm"
              aria-label="Instagram"
            >
              <FaInstagram size={14} />
            </a>
            <a 
              href="#twitter" 
              className="w-9 h-9 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 hover:bg-[#966F33] hover:text-white hover:border-[#966F33] transition-all flex items-center justify-center text-xs shadow-sm"
              aria-label="Twitter"
            >
              <FaTwitter size={14} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h4 className="text-white font-extrabold text-xs uppercase tracking-wider">Quick Links</h4>
          <ul className="space-y-2.5 text-xs font-medium">
            <li><Link to="/" className="hover:text-amber-200 transition-colors">Home</Link></li>
            <li><Link to="/product" className="hover:text-amber-200 transition-colors">Shop Catalog</Link></li>
            <li><Link to="/about" className="hover:text-amber-200 transition-colors">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-amber-200 transition-colors">Contact Concierge</Link></li>
            <li><Link to="/my-orders" className="hover:text-amber-200 transition-colors">My Orders</Link></li>
          </ul>
        </div>

        {/* Customer Care */}
        <div className="space-y-4">
          <h4 className="text-white font-extrabold text-xs uppercase tracking-wider">Customer Care</h4>
          <ul className="space-y-2.5 text-xs font-medium">
            <li><a href="#faq" className="hover:text-amber-200 transition-colors">FAQ & Support</a></li>
            <li><a href="#returns" className="hover:text-amber-200 transition-colors">Shipping & Returns</a></li>
            <li><a href="#privacy" className="hover:text-amber-200 transition-colors">Privacy Policy</a></li>
            <li><a href="#terms" className="hover:text-amber-200 transition-colors">Terms of Service</a></li>
            <li><Link to="/my-orders" className="hover:text-amber-200 transition-colors">Track Order</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <h4 className="text-white font-extrabold text-xs uppercase tracking-wider">Headquarters</h4>
          <div className="space-y-3 text-xs font-medium text-stone-400">
            <div className="flex items-start gap-3">
              <MapPin size={16} className="text-[#966F33] shrink-0 mt-0.5" />
              <span>123 Fashion Street, Ahmedabad, Gujarat, India</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={16} className="text-[#966F33] shrink-0" />
              <span>+91 98765 43210</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail size={16} className="text-[#966F33] shrink-0" />
              <span>support@shopnest.com</span>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Copyright */}
      <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 font-medium gap-4">
        <p>© {new Date().getFullYear()} ShopNest Boutique. All rights reserved.</p>
        <p className="flex items-center gap-1 text-stone-400">
          <Sparkles size={12} className="text-[#966F33]" /> Crafted for Luxury Shopping Experience
        </p>
      </div>
    </footer>
  );
};

export default Footer;