import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Inbox,
  Settings,
  LogOut,
  ExternalLink,
  Menu as MenuIcon,
  X,
  AlertTriangle,
  Clock,
  Sparkles,
  BellRing,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { enquiryService } from '../services/enquiries';
import { MEDIA_ASSETS } from '../config/assets';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [newEnquiriesCount, setNewEnquiriesCount] = useState<number>(0);

  useEffect(() => {
    enquiryService.getEnquiries().then((items) => {
      setNewEnquiriesCount(items.filter((i) => i.status === 'New').length);
    });

    if (enquiryService.subscribeToEnquiries) {
      const unsub = enquiryService.subscribeToEnquiries((items) => {
        setNewEnquiriesCount(items.filter((i) => i.status === 'New').length);
      });
      return () => unsub();
    }
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    {
      name: 'Dashboard Overview',
      path: '/admin/dashboard',
      icon: <LayoutDashboard className="w-5 h-5 mr-3" />,
    },
    {
      name: 'Customer Enquiries',
      path: '/admin/enquiries',
      icon: <Inbox className="w-5 h-5 mr-3" />,
    },
    {
      name: 'Admin Settings & Roster',
      path: '/admin/settings',
      icon: <Settings className="w-5 h-5 mr-3" />,
    },
  ];

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col md:flex-row text-charcoal">
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-maroon-950 text-white px-4 py-3 flex items-center justify-between border-b border-maroon-900 z-30 sticky top-0">
        <div className="flex items-center space-x-2">
          <img
            src={MEDIA_ASSETS.logo}
            alt="Logo"
            className="w-8 h-8 rounded-full border border-gold object-contain bg-white"
          />
          <span className="font-serif font-bold text-sm tracking-wide text-amber-200">
            Sri Caterers • Admin
          </span>
        </div>
        <div className="flex items-center space-x-2">
          {newEnquiriesCount > 0 && (
            <Link
              to="/admin/enquiries"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-xs animate-pulse"
            >
              <BellRing className="w-3 h-3" />
              <span>{newEnquiriesCount} New</span>
            </Link>
          )}
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-1.5 rounded-lg text-amber-300 hover:bg-maroon-900"
            aria-label="Toggle navigation menu"
          >
            {mobileSidebarOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Desktop / Responsive Sidebar */}
      <aside
        className={`fixed md:sticky top-0 z-40 h-screen w-72 bg-maroon-950 text-stone-200 flex flex-col justify-between border-r border-maroon-900/60 shadow-2xl transition-transform duration-300 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Brand header */}
          <div className="p-6 border-b border-maroon-900/60 flex items-center space-x-3">
            <img
              src={MEDIA_ASSETS.logo}
              alt="Sri Caterers Logo"
              className="w-12 h-12 rounded-full border-2 border-gold p-0.5 bg-white object-contain"
            />
            <div>
              <h2 className="font-serif font-black text-lg text-white uppercase tracking-wider">
                Sri Caterers
              </h2>
              <p className="text-[10px] text-gold font-bold uppercase tracking-widest">
                Admin Management Hub
              </p>
            </div>
          </div>

          {/* Navigation links */}
          <nav className="p-4 space-y-1.5 mt-2">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setMobileSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-maroon-800 text-white shadow-md border-l-4 border-gold'
                      : 'text-stone-300 hover:bg-maroon-900/70 hover:text-white'
                  }`
                }
              >
                {item.icon}
                <span className="flex-1">{item.name}</span>
                {item.path === '/admin/enquiries' && newEnquiriesCount > 0 && (
                  <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-xs animate-pulse">
                    {newEnquiriesCount} New
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* User Card & Sign Out at bottom of sidebar */}
        <div className="p-4 border-t border-maroon-900/60 space-y-3">
          <div className="p-3 rounded-xl bg-maroon-900/40 border border-maroon-800/60 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gold text-maroon-950 font-black flex items-center justify-center text-base shadow-sm">
              {user?.avatarLetter || 'A'}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-sm font-bold text-white truncate">
                {user?.displayName || 'Administrator'}
              </p>
              <p className="text-[11px] text-gold truncate">
                {user?.roleTitle || 'Authorized Admin'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              to="/"
              target="_blank"
              className="flex items-center justify-center px-3 py-2 rounded-lg bg-stone-900/60 hover:bg-stone-800 text-stone-300 text-xs font-semibold transition-colors"
              title="Preview Customer Website in new tab"
            >
              <ExternalLink className="w-3.5 h-3.5 mr-1 text-gold" />
              Website
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center justify-center px-3 py-2 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-200 text-xs font-semibold transition-colors"
            >
              <LogOut className="w-3.5 h-3.5 mr-1" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Admin Top Utility Header */}
        <header className="bg-white border-b border-stone-200 px-6 py-4 hidden md:flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Chennai Central Event Desk
            </span>
            <span className="text-stone-300">•</span>
            <div className="flex items-center text-xs text-stone-600">
              <Clock className="w-3.5 h-3.5 mr-1 text-maroon-700" />
              <span>Asia/Kolkata (IST)</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1.5 text-xs text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold">Firebase Live Connected</span>
            </div>

            <Link
              to="/"
              className="inline-flex items-center text-xs font-semibold text-maroon-800 hover:text-maroon-950 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1 text-gold" />
              View Live Website
            </Link>
          </div>
        </header>

        {/* Child Page Render */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Backdrop */}
      {mobileSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-xs"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}
    </div>
  );
};
