import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  HiOutlineUserGroup, 
  HiOutlineBookOpen, 
  HiOutlineChatAlt2, 
  HiOutlineLogout,
  HiOutlineMenuAlt2,
  HiOutlineX,
  HiOutlineViewGrid
} from 'react-icons/hi';

const AdminLayout = ({ children, title }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { 
      name: 'Dashboard', 
      path: '/admin-panel', 
      icon: <HiOutlineViewGrid className="w-6 h-6" />,
      active: location.pathname === '/admin-panel' || location.pathname === '/admin'
    },
    { 
      name: 'Users', 
      path: '/admin-panel', 
      params: { view: 'users' },
      icon: <HiOutlineUserGroup className="w-6 h-6" />,
      active: location.pathname === '/admin-panel' && localStorage.getItem('adminView') === 'users'
    },
    { 
      name: 'Blogs', 
      path: '/admin-panel', 
      params: { view: 'blogs' },
      icon: <HiOutlineBookOpen className="w-6 h-6" />,
      active: location.pathname === '/admin-panel' && localStorage.getItem('adminView') === 'blogs'
    },
    { 
      name: 'Messages', 
      path: '/admin-contact', 
      icon: <HiOutlineChatAlt2 className="w-6 h-6" />,
      active: location.pathname === '/admin-contact'
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminView');
    navigate('/admin-login');
  };

  const handleNavClick = (item) => {
    if (item.params?.view) {
      localStorage.setItem('adminView', item.params.view);
      // If we are already on admin-panel, we might need a refresh or state update
      // But for now, navigating is enough as AdminPanel reads from localStorage
    }
    navigate(item.path);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-72' : 'w-24'
        } fixed inset-y-0 left-0 z-50 bg-white/80 backdrop-blur-xl border-r border-slate-200/50 transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) shadow-[4px_0_24px_rgba(0,0,0,0.02)] overflow-hidden`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-8 flex items-center justify-between">
            {isSidebarOpen && (
              <span className="text-2xl font-black bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent tracking-tight">
                MSP Blog
              </span>
            )}
            <button 
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-2xl hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-all active:scale-95"
            >
              {isSidebarOpen ? <HiOutlineX className="w-6 h-6" /> : <HiOutlineMenuAlt2 className="w-6 h-6" />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-5 space-y-3 mt-4">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item)}
                className={`w-full flex items-center p-4 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                  item.active 
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600'
                }`}
              >
                {item.active && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-100 -z-10"></div>
                )}
                <span className={`${item.active ? 'text-white scale-110' : 'text-slate-400 group-hover:text-blue-600 group-hover:scale-110'} transition-transform duration-300`}>
                  {item.icon}
                </span>
                {isSidebarOpen && (
                  <span className={`ml-4 font-bold tracking-wide transition-all ${item.active ? 'translate-x-1' : 'group-hover:translate-x-1'}`}>
                    {item.name}
                  </span>
                )}
                {item.active && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-white rounded-l-full"></div>
                )}
              </button>
            ))}
          </nav>

          {/* Logout Section */}
          <div className="p-5 border-t border-slate-100/50">
            <button
              onClick={handleLogout}
              className={`w-full flex items-center p-4 rounded-2xl text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all duration-300 group`}
            >
              <HiOutlineLogout className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
              {isSidebarOpen && (
                <span className="ml-4 font-bold tracking-wide whitespace-nowrap">Logout System</span>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main 
        className={`flex-1 transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${
          isSidebarOpen ? 'ml-72' : 'ml-24'
        } mesh-gradient-blue min-h-screen`}
      >
        {/* Top Header */}
        <header className="h-24 bg-white/40 backdrop-blur-xl sticky top-0 z-30 border-b border-slate-200/30 px-10 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-1">System View</p>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">{title}</h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right hidden md:block">
              <p className="text-sm font-black text-slate-800 tracking-wide">Administrator</p>
              <div className="flex items-center justify-end gap-1.5">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Session</p>
              </div>
            </div>
            <div className="relative group p-1 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">
              <div className="w-12 h-12 rounded-[14px] bg-white flex items-center justify-center text-blue-600 font-black text-xl overflow-hidden">
                <span className="group-hover:scale-125 transition-transform duration-500">A</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-10 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 cubic-bezier(0, 0, 0.2, 1)">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
