import React from 'react';
import { Menu, Bell, Search, User } from 'lucide-react';

const AdminHeader = ({ setIsMobileOpen }) => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-stone-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-sm">
      
      {/* Left: Mobile Toggle & Search */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsMobileOpen((prev) => !prev)}
          className="p-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 lg:hidden"
        >
          <Menu size={20} />
        </button>

      </div>

      {/* Right: Notifications & Admin Profile */}
      <div className="flex items-center gap-3">
        <button className="p-2.5 rounded-2xl border border-stone-200 text-stone-600 hover:bg-stone-50 relative">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-600"></span>
        </button>

        <div className="h-8 w-px bg-stone-200 mx-1"></div>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-stone-900 border border-stone-800 text-amber-200 flex items-center justify-center font-black text-xs shadow-sm">
            A
          </div>
          <div className="hidden sm:block text-left">
            <span className="text-xs font-black text-stone-900 block leading-tight">Admin User</span>
            <span className="text-[10px] text-stone-400 font-bold">Manager</span>
          </div>
        </div>
      </div>

    </header>
  );
};

export default AdminHeader;