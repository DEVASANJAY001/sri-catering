import React from 'react';
import { Link } from 'react-router-dom';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  CalendarCheck,
  Navigation,
  Compass,
} from 'lucide-react';
import { InstagramIcon } from '../../components/common/InstagramIcon';
import { siteConfig } from '../../config/siteConfig';
import { MEDIA_ASSETS } from '../../config/assets';
import { KolamDivider } from '../../components/common/KolamDivider';
import { Badge } from '../../components/common/Badge';
import { SEO } from '../../components/common/SEO';
import { GoogleMapLocationWindow } from '../../components/common/GoogleMapLocationWindow';

export const ContactPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      <SEO
        title="Contact Sri Caterers Chennai | Phone, WhatsApp & Office Hub"
        description="Contact Sri Caterers Chennai. Reach proprietor Srinivasan .R at +91 86081 88101 or sricateres001@gmail.com. Offices in Villivakkam & Perambur, Chennai."
        keywords="contact Sri Caterers, Sri Caterers phone number, caterers Villivakkam address, Perambur catering contact, caterer phone Chennai"
        canonicalPath="/contact"
      />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="maroon" size="md">
          Get in Touch
        </Badge>
        <h1 className="font-serif text-3xl sm:text-5xl font-black text-maroon-950">
          Contact Sri Caterers Chennai
        </h1>
        <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
          Planning an upcoming wedding, family function, or corporate conference? We are here to help design the ideal menu.
        </p>
        <KolamDivider theme="gold" />
      </div>

      {/* Main Contact Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Info Cards */}
        <div className="lg:col-span-7 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Phone Card */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-maroon-50 text-maroon-800 flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-base text-charcoal">
                Direct Phone Call
              </h3>
              <p className="text-xs text-stone-500">
                Call proprietor Srinivasan R for immediate inquiries and auspicious date check.
              </p>
              <a
                href={`tel:${siteConfig.rawPhone}`}
                className="inline-block text-sm font-bold text-maroon-800 hover:text-maroon-950 transition-colors"
              >
                {siteConfig.displayPhone}
              </a>
            </div>

            {/* WhatsApp Card */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-base text-charcoal">
                WhatsApp Chat
              </h3>
              <p className="text-xs text-stone-500">
                Send event dates, hall locations, and receive menu package PDFs directly.
              </p>
              <a
                href={siteConfig.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-sm font-bold text-emerald-700 hover:text-emerald-900 transition-colors"
              >
                Chat on WhatsApp
              </a>
            </div>

            {/* Email Card */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-base text-charcoal">
                Email Desk
              </h3>
              <p className="text-xs text-stone-500">
                For corporate quotations, vendor onboarding, and formal proposals.
              </p>
              <a
                href={`mailto:${siteConfig.email}`}
                className="inline-block text-sm font-bold text-amber-800 hover:text-amber-950 transition-colors break-all"
              >
                {siteConfig.email}
              </a>
            </div>

            {/* Working Hours */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-base text-charcoal">
                Operating Timings
              </h3>
              <p className="text-xs text-stone-500">
                Available all 7 days a week for consultations and kitchen tastings.
              </p>
              <p className="text-sm font-bold text-charcoal">
                {siteConfig.timings}
              </p>
            </div>
          </div>

          {/* Central Kitchen & Service Coverage */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-start space-x-3">
              <MapPin className="w-6 h-6 text-maroon-800 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-serif font-bold text-lg text-charcoal">
                  Catering Hub &amp; Kitchen Location
                </h3>
                <p className="text-sm text-stone-700 font-medium mt-1">
                  {siteConfig.locations.fullAddress}
                </p>
                <div className="mt-1.5 text-xs text-stone-500">
                  <a
                    href={siteConfig.locations.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-maroon-800 hover:text-maroon-950 underline inline-flex items-center"
                  >
                    <span>View on Google Map</span>
                  </a>
                </div>
                <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                  <strong>Service Coverage:</strong> {siteConfig.locations.coverage}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex flex-wrap gap-4 items-center justify-between text-xs text-stone-600">
              <span className="flex items-center">
                <Compass className="w-4 h-4 mr-1 text-gold-dark" />
                Villivakkam &amp; Perambur Central
              </span>
              <span className="flex items-center">
                <Navigation className="w-4 h-4 mr-1 text-leaf-700" />
                Dedicated Thermal Delivery Fleet
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Google Maps Interactive Window & Social QR Card */}
        <div className="lg:col-span-5 space-y-6">
          {/* Interactive Google Map Location Window with Zoom & Move */}
          <GoogleMapLocationWindow heightClassName="h-[350px] sm:h-[380px]" />

          {/* Social Instagram Card - Responsive */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 sm:p-6 border border-amber-200 shadow-sm flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-5 text-center sm:text-left">
            <div className="bg-white p-2 rounded-xl border border-amber-200 shadow-sm shrink-0">
              <img
                src={MEDIA_ASSETS.images[8].src} // WhatsApp Image 2026-10-11 at 1.28.08 PM.jpeg - QR
                alt="Instagram QR"
                className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-center sm:justify-start space-x-1.5 text-xs font-bold text-purple-700">
                <InstagramIcon className="w-3.5 h-3.5" />
                <span>@sri_catereres</span>
              </div>
              <h4 className="font-serif font-bold text-sm sm:text-base text-maroon-950">
                Scan &amp; Connect on Instagram
              </h4>
              <p className="text-[11px] sm:text-xs text-stone-600 leading-relaxed">
                Scan this QR code with your mobile camera to visit our official Instagram page.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Booking Prompt */}
      <div className="text-center pt-8 border-t border-stone-200">
        <p className="text-sm text-stone-600 mb-4">
          Ready to reserve your date or request a customized menu package?
        </p>
        <Link
          to="/enquiry"
          className="inline-flex items-center px-8 py-3.5 rounded-xl font-bold text-sm sm:text-base text-white bg-maroon-800 hover:bg-maroon-900 shadow-md transition-all"
        >
          <CalendarCheck className="w-4 h-4 mr-2 text-gold" />
          <span>Go to Customer Enquiry Form</span>
        </Link>
      </div>
    </div>
  );
};
