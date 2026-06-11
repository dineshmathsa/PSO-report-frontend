import React from 'react';
import { Plus, MessageSquare, X, LogOut, BarChart3 } from 'lucide-react';
import useAuth from '../hooks/useAuth';

const Sidebar = ({ isOpen, onClose, chats = [], activeChatId, onSelectChat, onNewChat }) => {
  const { user, logout } = useAuth();

  const displayChats = chats;

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-30 w-64 border-r border-slate-800 bg-[#0f172a] flex flex-col transition-transform duration-300 md:static md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
              <BarChart3 className="w-5 h-5" />
            </div>
            <span className="font-bold text-slate-100 tracking-wide text-sm">
              PSO REPORTING
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 md:hidden transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Body */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {/* New Chat Button */}
          <button
            onClick={() => {
              if (onNewChat) onNewChat();
              if (window.innerWidth < 768) onClose(); // Auto close on mobile
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all duration-200 shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            New Report Chat
          </button>

          {/* Chat List Section */}
          <div className="space-y-1">
            <h3 className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Recent Reports
            </h3>
            <div className="mt-2 space-y-1">
              {displayChats.length === 0 ? (
                <p className="px-3 py-2 text-xs text-slate-500">No report chats yet.</p>
              ) : (
                displayChats.map((chat) => {
                  const IconComponent = chat.icon || MessageSquare;
                  const isActive = chat.id === activeChatId;
                  return (
                    <button
                      key={chat.id}
                      onClick={() => {
                        if (onSelectChat) onSelectChat(chat.id);
                        if (window.innerWidth < 768) onClose();
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-sm font-medium transition-all duration-200 group ${
                        isActive
                          ? 'bg-slate-800 text-emerald-400 border border-slate-700/50'
                          : 'text-slate-300 hover:bg-slate-800/40 hover:text-white border border-transparent'
                      }`}
                    >
                      <IconComponent
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive
                            ? 'text-emerald-400'
                            : 'text-slate-400 group-hover:text-slate-200'
                        }`}
                      />
                      <span className="truncate flex-1">{chat.title}</span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#0d1322]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-400 to-indigo-500 flex items-center justify-center text-xs font-bold text-white uppercase shadow-md shadow-indigo-950">
              {user?.name ? user.name[0] : (user?.email ? user.email[0] : 'U')}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-200 truncate">
                {user?.name || 'Executive User'}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                {user?.email || 'executive@company.com'}
              </p>
            </div>
            <button
              onClick={logout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800/60 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
