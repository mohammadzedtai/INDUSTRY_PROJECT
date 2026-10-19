import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Layers, 
  Users, 
  CreditCard, 
  Settings, 
  Store, 
  LogOut,
  Sparkles,
  ArrowLeft
} from 'lucide-react';

const AdminSidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const adminNavLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/dashboard/products', icon: ShoppingBag },
    { name: 'Categories', path: '/dashboard/categories', icon: Layers },
    { name: 'Orders', path: '/dashboard/orders', icon: CreditCard },
    { name: 'Customers', path: '/dashboard/customers', icon: Users },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Drawer Container */}
      <aside className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-[#0C0A09] text-stone-300 border-r border-stone-800 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6 space-y-8">
          
          {/* Logo & Brand Name */}
          <div className="flex items-center justify-between">
            <Link to="/admin" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-[#FAF3EA]/10 border border-[#FAF3EA]/30 flex items-center justify-center text-amber-200 shrink-0">
                <Store size={18} />
              </div>
              <div>
                <span className="text-lg font-black text-white tracking-tight block leading-none">
                  ShopNest
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#966F33]">
                  Admin Portal
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-stone-500 px-3 block mb-2">
              Main Menu
            </span>
            {adminNavLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.name}
                  to={link.path}
                  end={link.path === '/admin'}
                  onClick={() => setIsMobileOpen(false)}
                  className={({ isActive }) => `flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-extrabold transition-all ${
                    isActive
                      ? 'bg-[#FAF3EA] text-stone-900 shadow-md font-black'
                      : 'text-stone-400 hover:bg-stone-900 hover:text-white'
                  }`}
                >
                  <Icon size={18} />
                  <span>{link.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-6 border-t border-stone-800/80 space-y-3">
          {/* <Link
            to="/"
            className="flex items-center justify-between p-3 rounded-2xl bg-stone-900/80 border border-stone-800 text-stone-300 hover:text-amber-200 transition-colors text-xs font-bold"
          >
            <span className="flex items-center gap-2">
              <ArrowLeft size={15} /> Back to Store
            </span>
            <Sparkles size={13} className="text-[#966F33]" />
          </Link> */}

          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/auth";
            }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-extrabold text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors"
          >
            <LogOut size={16} />
            <span>Logout Admin</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;