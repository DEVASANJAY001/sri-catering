import React from 'react';
import { Link } from 'react-router-dom';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  ShieldCheck,
  ChevronRight,
  Heart,
} from 'lucide-react';
import { InstagramIcon } from './InstagramIcon';
import { siteConfig } from '../../config/siteConfig';
import { MEDIA_ASSETS } from '../../config/assets';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t-4 border-maroon-800">
      {/* Top Banner Accent */}
      <div className="bg-maroon-900 text-amber-100 py-3 px-4 border-b border-maroon-950">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-2 text-xs md:text-sm">
          <p className="font-medium tracking-wide">
            Serving auspicious wedding banquets, corporate meetings & family gatherings across Tamil Nadu.
          </p>
          <a
            href={siteConfig.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-amber-300 font-semibold hover:text-white transition-colors"
          >
            <MessageCircle className="w-4 h-4 mr-1 text-emerald-400" />
            Quick Booking on WhatsApp: {siteConfig.displayPhone}
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: Brand & Philosophy */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img
                src={MEDIA_ASSETS.logo}
                alt="Sri Caterers"
                className="w-14 h-14 rounded-full border-2 border-gold p-0.5 bg-white object-contain"
              />
              <div>
                <h3 className="font-serif text-xl font-black tracking-wider text-white uppercase">
                  Sri Caterers
                </h3>
                <p className="text-xs text-gold font-semibold uppercase">
                  The Event Management Company
                </p>
              </div>
            </div>

            <p className="text-sm text-stone-400 leading-relaxed">
              Authentic Tamil Nadu culinary heritage curated with love, traditional firewood preparation, purest ingredients, and unmatched South Indian hospitality.
            </p>

            <div className="pt-2">
              <p className="text-xs text-stone-400 font-bold uppercase tracking-wider mb-2">
                Proprietor & Founder
              </p>
              <p className="text-sm text-amber-200 font-medium">
                {siteConfig.proprietor}
              </p>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <a
                href={siteConfig.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-stone-800 hover:bg-gradient-to-tr hover:from-amber-500 hover:to-purple-600 flex items-center justify-center text-stone-300 hover:text-white transition-all"
                title="Follow on Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href={siteConfig.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-stone-800 hover:bg-emerald-600 flex items-center justify-center text-stone-300 hover:text-white transition-all"
                title="Message on WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href={`tel:${siteConfig.rawPhone}`}
                className="w-9 h-9 rounded-full bg-stone-800 hover:bg-maroon-700 flex items-center justify-center text-stone-300 hover:text-white transition-all"
                title="Call Now"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Catering Services */}
          <div>
            <h4 className="font-serif text-base font-bold text-white uppercase tracking-wider mb-4 border-b border-stone-800 pb-2">
              Catering Services
            </h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li>
                <Link
                  to="/services/tamil-wedding-catering"
                  className="hover:text-gold transition-colors flex items-center"
                >
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-maroon-500" />
                  Tamil Wedding Catering
                </Link>
              </li>
              <li>
                <Link
                  to="/services/engagement-reception-catering"
                  className="hover:text-gold transition-colors flex items-center"
                >
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-maroon-500" />
                  Engagement & Reception
                </Link>
              </li>
              <li>
                <Link
                  to="/services/traditional-family-functions"
                  className="hover:text-gold transition-colors flex items-center"
                >
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-maroon-500" />
                  Seemantham & Family Poojas
                </Link>
              </li>
              <li>
                <Link
                  to="/services/housewarming-ceremonies"
                  className="hover:text-gold transition-colors flex items-center"
                >
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-maroon-500" />
                  Housewarming (Grahapravesam)
                </Link>
              </li>
              <li>
                <Link
                  to="/services/corporate-catering"
                  className="hover:text-gold transition-colors flex items-center"
                >
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-maroon-500" />
                  Corporate Catering & Buffets
                </Link>
              </li>
              <li>
                <Link
                  to="/services/birthday-anniversary-catering"
                  className="hover:text-gold transition-colors flex items-center"
                >
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-maroon-500" />
                  Birthday & Live Snack Stalls
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Navigation */}
          <div>
            <h4 className="font-serif text-base font-bold text-white uppercase tracking-wider mb-4 border-b border-stone-800 pb-2">
              Explore Website
            </h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li>
                <Link to="/" className="hover:text-gold transition-colors flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-maroon-500" />
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-gold transition-colors flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-maroon-500" />
                  About Our Kitchen & Philosophy
                </Link>
              </li>
              <li>
                <Link to="/menu" className="hover:text-gold transition-colors flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-maroon-500" />
                  Menu & Packages (₹149 & ₹269)
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-gold transition-colors flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-maroon-500" />
                  Photo & Video Gallery
                </Link>
              </li>
              <li>
                <Link to="/enquiry" className="hover:text-gold transition-colors flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-maroon-500" />
                  Event Booking Enquiry
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-gold transition-colors flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-maroon-500" />
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Locations */}
          <div>
            <h4 className="font-serif text-base font-bold text-white uppercase tracking-wider mb-4 border-b border-stone-800 pb-2">
              Chennai Central Office
            </h4>
            <ul className="space-y-3 text-sm text-stone-300">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <a
                  href={siteConfig.locations.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold transition-colors"
                  title="Open in Google Maps"
                >
                  <span>{siteConfig.locations.fullAddress}</span>
                  <span className="block text-xs text-stone-400 font-mono mt-0.5">
                    {siteConfig.locations.coordinates}
                  </span>
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-gold shrink-0" />
                <a
                  href={`tel:${siteConfig.rawPhone}`}
                  className="hover:text-white transition-colors"
                >
                  {siteConfig.displayPhone}
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-gold shrink-0" />
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="hover:text-white transition-colors break-all"
                >
                  {siteConfig.email}
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <Clock className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span className="text-xs text-stone-400">{siteConfig.timings}</span>
              </li>
            </ul>

            {/* Admin Portal Link */}
            <div className="mt-6 pt-4 border-t border-stone-800">
              <Link
                to="/admin/login"
                className="inline-flex items-center text-xs font-semibold text-stone-400 hover:text-gold transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-stone-500" />
                <span>Admin Management Portal</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-stone-800 flex flex-col md:flex-row items-center justify-between text-[10px] sm:text-xs text-stone-400 gap-2.5 sm:gap-4 text-center md:text-left">
          <p className="text-[10px] sm:text-xs text-stone-400/90 leading-tight">
            © {new Date().getFullYear()} {siteConfig.fullName}. All rights reserved.
          </p>
          <p className="text-[10px] sm:text-xs text-stone-400/90 leading-tight">
            Designed and Developed by{' '}
            <a
              href="https://davns.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-2 transition-colors inline-block"
            >
              Davns Industries
            </a>
          </p>
          <div className="flex items-center space-x-3 sm:space-x-4 text-[10px] sm:text-xs">
            <Link to="/privacy-policy" className="hover:text-stone-300 underline">
              Privacy Policy
            </Link>
            <span className="text-stone-600 sm:hidden">•</span>
            <Link to="/contact" className="hover:text-stone-300 underline">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
