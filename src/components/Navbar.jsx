import React from 'react';
import { Menu, LogOut, ShieldAlert, Sparkles } from 'lucide-react';
import useAuth from '../hooks/useAuth';

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 border-b border-slate-800 bg-[#0f172a]/80 backdrop-blur-md flex items-center justify-between px-4 md:px-6 z-10">
      <div className="flex items-center gap-3">
        {/* Mobile Menu Toggle */}
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 md:hidden transition-colors"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Title / Status */}
        <div className="flex items-center gap-2">
          <div className="bg-emerald-500/10 p-1.5 rounded-lg text-emerald-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-slate-100 leading-none">AI Executive Reporter</h1>
            <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Gemini-3.5-Flash Active
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* User Badge */}
        {user && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/60 border border-slate-700/50">
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-emerald-400 to-indigo-500 flex items-center justify-center text-[10px] font-bold text-white uppercase">
              {user.name ? user.name[0] : (user.email ? user.email[0] : 'U')}
            </div>
            <span className="text-xs font-medium text-slate-300">
              {user.name || user.email}
            </span>
          </div>
        )}

        {/* Logout Button */}
        <button
          onClick={logout}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 hover:border-rose-900/30 border border-transparent transition-all duration-200"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden md:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
