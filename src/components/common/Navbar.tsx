import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  Menu as MenuIcon,
  X,
  Phone,
  MessageCircle,
  CalendarCheck,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';
import { MEDIA_ASSETS } from '../../config/assets';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Menu', path: '/menu' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full shadow-md">
      {/* Top Auspicious Announcement Bar */}
      <div className="bg-maroon-950 text-amber-200 text-[11px] sm:text-xs py-1 sm:py-1.5 px-3 sm:px-4 border-b border-amber-900/40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2 sm:space-x-3 overflow-hidden">
            <span className="flex items-center text-amber-300 font-medium truncate">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 text-gold shrink-0" />
              <span className="truncate">Sri Caterers • Chennai &amp; Across TN</span>
            </span>
            <span className="hidden md:inline-block text-amber-400/60">•</span>
            <span className="hidden md:inline-block text-amber-100/90 font-tamil">
              100% ஹலால் &amp; பாரம்பரிய இலை சாப்பாடு
            </span>
          </div>

          <div className="flex items-center space-x-2.5 sm:space-x-4 shrink-0">
            <a
              href={`tel:${siteConfig.rawPhone}`}
              className="flex items-center hover:text-white transition-colors"
            >
              <Phone className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1 text-gold" />
              <span className="hidden xs:inline">{siteConfig.displayPhone}</span>
              <span className="xs:hidden">Call</span>
            </a>
            <a
              href={siteConfig.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center hover:text-white transition-colors text-emerald-400"
            >
              <MessageCircle className="w-3 h-3 mr-1" />
              <span>WhatsApp</span>
            </a>
            <Link
              to="/admin/login"
              className="flex items-center text-stone-300 hover:text-gold transition-colors pl-2 border-l border-stone-700"
              title="Admin Portal Login"
            >
              <ShieldCheck className="w-3 h-3 mr-1 text-stone-400" />
              <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase">
                Admin
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo and Brand */}
            <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group">
              <img
                src={MEDIA_ASSETS.logo}
                alt="Sri Caterers Logo"
                className="w-10 h-10 sm:w-14 sm:h-14 rounded-full border-2 border-gold object-contain p-0.5 bg-white shadow-sm group-hover:scale-105 transition-transform shrink-0"
              />
              <div className="flex flex-col">
                <span className="font-serif text-lg sm:text-2xl font-black tracking-wider text-maroon-900 group-hover:text-maroon-700 transition-colors uppercase leading-none">
                  Sri Caterers
                </span>
                <span className="text-[9px] sm:text-xs tracking-wider sm:tracking-widest text-gold-dark font-bold uppercase mt-0.5 sm:mt-1 truncate max-w-[190px] sm:max-w-none">
                  Event Management • Chennai
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
              {navLinks.map((link) => {
                const isActive =
                  link.path === '/'
                    ? location.pathname === '/'
                    : location.pathname.startsWith(link.path);

                return (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
                      isActive
                        ? 'text-maroon-900 bg-maroon-50 border-b-2 border-maroon-800 font-bold'
                        : 'text-charcoal-muted hover:text-maroon-800 hover:bg-stone-50'
                    }`}
                  >
                    {link.name}
                  </NavLink>
                );
              })}
            </div>

            {/* Desktop CTA Button */}
            <div className="hidden lg:flex items-center space-x-3">
              <Link
                to="/enquiry"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-maroon-800 hover:bg-maroon-900 shadow-md shadow-maroon-950/15 hover:shadow-lg transition-all duration-200 active:scale-95 group"
              >
                <CalendarCheck className="w-4 h-4 mr-2 text-gold group-hover:rotate-12 transition-transform" />
                <span>Enquire Now</span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex lg:hidden items-center space-x-2">
              <Link
                to="/enquiry"
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-maroon-800 hover:bg-maroon-900 shadow-sm"
              >
                Enquire
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-charcoal hover:text-maroon-800 hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-maroon-800"
                aria-label="Toggle menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-maroon-800" />
                ) : (
                  <MenuIcon className="w-6 h-6 text-charcoal" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-2 duration-200">
            {navLinks.map((link) => {
              const isActive =
                link.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(link.path);

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-xl text-base font-semibold ${
                    isActive
                      ? 'bg-maroon-50 text-maroon-900 border-l-4 border-maroon-800 font-bold'
                      : 'text-charcoal hover:bg-stone-50 hover:text-maroon-800'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            <div className="pt-4 border-t border-stone-200 space-y-2">
              <Link
                to="/enquiry"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center px-5 py-3 rounded-xl text-base font-bold text-white bg-maroon-800 hover:bg-maroon-900 shadow-md text-center"
              >
                <CalendarCheck className="w-5 h-5 mr-2 text-gold" />
                Enquire for Your Event
              </Link>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <a
                  href={`tel:${siteConfig.rawPhone}`}
                  className="flex items-center justify-center px-3 py-2.5 rounded-lg border border-stone-200 bg-stone-50 text-xs font-semibold text-charcoal"
                >
                  <Phone className="w-3.5 h-3.5 mr-1.5 text-maroon-800" />
                  Call Us
                </a>
                <a
                  href={siteConfig.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center px-3 py-2.5 rounded-lg border border-emerald-200 bg-emerald-50 text-xs font-semibold text-emerald-800"
                >
                  <MessageCircle className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
