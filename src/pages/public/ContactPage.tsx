import React, { useState } from 'react';
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
  CheckCircle2,
  Send,
  AlertCircle,
  Sparkles,
  Copy,
  Check,
} from 'lucide-react';
import { InstagramIcon } from '../../components/common/InstagramIcon';
import { siteConfig } from '../../config/siteConfig';
import { MEDIA_ASSETS } from '../../config/assets';
import { KolamDivider } from '../../components/common/KolamDivider';
import { Badge } from '../../components/common/Badge';
import { SEO } from '../../components/common/SEO';
import { GoogleMapLocationWindow } from '../../components/common/GoogleMapLocationWindow';
import { enquiryService } from '../../services/enquiries';
import { firebaseTrafficService } from '../../services/analytics/FirebaseTrafficService';
import { Enquiry } from '../../types/enquiry';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    mobileNumber: '',
    email: '',
    eventType: 'Tamil Wedding Catering',
    eventDate: '',
    guestCount: '' as string | number,
    eventLocation: '',
    preferredContactMethod: 'Phone Call' as 'Phone Call' | 'WhatsApp' | 'Email',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedEnquiry, setSubmittedEnquiry] = useState<Enquiry | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const name = formData.customerName.trim();
    const phone = formData.mobileNumber.replace(/[^\d+]/g, '').trim();

    if (name.length < 2) {
      setFormError('Please enter your full name (at least 2 characters).');
      return;
    }

    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length < 10) {
      setFormError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsSubmitting(true);

    try {
      const guestNum = formData.guestCount && Number(formData.guestCount) > 0 ? Number(formData.guestCount) : 0;
      const created = await enquiryService.createEnquiry({
        customerName: name,
        mobileNumber: digitsOnly,
        email: formData.email.trim() || undefined,
        eventType: formData.eventType,
        eventDate: formData.eventDate || '',
        guestCount: guestNum,
        eventLocation: formData.eventLocation.trim() || '',
        preferredContactMethod: formData.preferredContactMethod,
        message: formData.message.trim() || undefined,
      });

      setSubmittedEnquiry(created);
    } catch (err: any) {
      setFormError(err.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyId = () => {
    if (!submittedEnquiry) return;
    navigator.clipboard.writeText(submittedEnquiry.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

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
                onClick={() => firebaseTrafficService.recordEvent('call_click', 'Contact Page Phone Card')}
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
                onClick={() => firebaseTrafficService.recordEvent('whatsapp_click', 'Contact Page WhatsApp Card')}
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
                src={MEDIA_ASSETS.images[8].src}
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

      {/* Online Quick Enquiry Section */}
      <div className="bg-gradient-to-br from-stone-900 to-stone-950 rounded-3xl p-6 sm:p-10 border border-amber-500/30 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-maroon-900/20 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl mx-auto space-y-8 relative z-10">
          <div className="text-center space-y-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
              <Sparkles className="w-3.5 h-3.5 mr-1 text-gold" />
              Quick Online Booking Enquiry
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-white">
              Send an Enquiry Directly to Our Team
            </h2>
            <p className="text-xs sm:text-sm text-stone-300">
              Fill out this quick form and our catering coordinator will contact you with a tailored package within hours.
            </p>
          </div>

          {submittedEnquiry ? (
            <div className="bg-stone-800/90 border border-emerald-500/50 rounded-2xl p-6 sm:p-8 text-center space-y-5 animate-in fade-in">
              <div className="w-14 h-14 rounded-full bg-emerald-950/80 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                  Enquiry Registered Successfully!
                </h3>
                <p className="text-xs sm:text-sm text-stone-300">
                  Thank you, <strong className="text-amber-300">{submittedEnquiry.customerName}</strong>. Your request for{' '}
                  <strong className="text-amber-300">{submittedEnquiry.eventType}</strong> has been stored securely in our system.
                </p>
              </div>

              <div className="inline-flex items-center gap-3 bg-stone-900/90 border border-stone-700 px-4 py-2.5 rounded-xl">
                <span className="text-xs text-stone-400">Reference ID:</span>
                <span className="font-mono text-sm font-bold text-amber-300">{submittedEnquiry.id}</span>
                <button
                  type="button"
                  onClick={copyId}
                  className="p-1 rounded text-stone-400 hover:text-white transition-colors"
                  title="Copy ID"
                >
                  {copiedId ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={`https://wa.me/918608188101?text=Hello%20Sri%20Caterers,%20I%20submitted%20an%20enquiry%20(Ref:%20${submittedEnquiry.id})%20for%20${encodeURIComponent(submittedEnquiry.eventType)}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-all"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  <span>Notify via WhatsApp</span>
                </a>
                <button
                  type="button"
                  onClick={() => setSubmittedEnquiry(null)}
                  className="text-xs text-stone-400 hover:text-white underline py-2"
                >
                  Submit Another Enquiry
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-amber-200 uppercase tracking-wider mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="e.g. Karthikeyan R"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-sm text-white placeholder-stone-500 focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-amber-200 uppercase tracking-wider mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.mobileNumber}
                    onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                    placeholder="e.g. 98401 23456"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-sm text-white placeholder-stone-500 focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-amber-200 uppercase tracking-wider mb-1">
                    Event Type
                  </label>
                  <select
                    value={formData.eventType}
                    onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-sm text-white focus:outline-none focus:border-amber-400 transition-colors"
                  >
                    <option value="Tamil Wedding Catering">Tamil Wedding Catering</option>
                    <option value="Grand Reception">Grand Reception Feast</option>
                    <option value="Housewarming Ceremony">Housewarming (கிரகப்பிரவேசம்)</option>
                    <option value="Birthday &amp; Family Function">Birthday &amp; Family Function</option>
                    <option value="Corporate Event Catering">Corporate Event Catering</option>
                    <option value="A to Z Wedding Service">A to Z Wedding Package</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-amber-200 uppercase tracking-wider mb-1">
                    Event Date
                  </label>
                  <input
                    type="date"
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-sm text-white focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-amber-200 uppercase tracking-wider mb-1">
                    Estimated Guests <span className="text-stone-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="number"
                    min="10"
                    step="10"
                    placeholder="e.g. 200 (Optional)"
                    value={formData.guestCount}
                    onChange={(e) => setFormData({ ...formData, guestCount: e.target.value ? Number(e.target.value) : '' })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-sm text-white focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-amber-200 uppercase tracking-wider mb-1">
                  Venue / Hall Location <span className="text-stone-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mayor Ramanathan Hall, Santhome, or City / Area"
                  value={formData.eventLocation}
                  onChange={(e) => setFormData({ ...formData, eventLocation: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-sm text-white placeholder-stone-500 focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-amber-200 uppercase tracking-wider mb-1">
                  Message / Specific Dishes or Special Instructions <span className="text-stone-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  rows={2}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Preferred menu items, timing, or questions..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-sm text-white placeholder-stone-500 focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-maroon-800 to-amber-700 hover:from-maroon-700 hover:to-amber-600 text-white font-bold text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-70"
              >
                {isSubmitting ? (
                  <span>Saving Enquiry to Firebase...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-gold" />
                    <span>Submit Enquiry Online</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Bottom Booking Prompt */}
      <div className="text-center pt-8 border-t border-stone-200">
        <p className="text-sm text-stone-600 mb-4">
          Want a detailed per-leaf quotation or customized menu package?
        </p>
        <Link
          to="/enquiry"
          className="inline-flex items-center px-8 py-3.5 rounded-xl font-bold text-sm sm:text-base text-white bg-maroon-800 hover:bg-maroon-900 shadow-md transition-all"
        >
          <CalendarCheck className="w-4 h-4 mr-2 text-gold" />
          <span>Open Full Interactive Enquiry Form</span>
        </Link>
      </div>
    </div>
  );
};
