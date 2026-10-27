import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  Phone,
  MessageCircle,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  X,
  Plus,
} from 'lucide-react';
import { enquirySchema, EnquiryFormValues } from '../../schemas/enquirySchema';
import { enquiryService } from '../../services/enquiries';
import { siteConfig } from '../../config/siteConfig';
import { CATERING_SERVICES } from '../../data/services';
import { Enquiry } from '../../types/enquiry';
import { KolamDivider } from '../../components/common/KolamDivider';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { firebaseTrafficService } from '../../services/analytics/FirebaseTrafficService';
import { SEO } from '../../components/common/SEO';

export const EnquiryPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [submittedEnquiry, setSubmittedEnquiry] = useState<Enquiry | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  // Honeypot spam defense
  const [honeypot, setHoneypot] = useState('');

  // Expandable more info section (Date, guests, location, menu)
  const [showMoreInfo, setShowMoreInfo] = useState(false);

  const prefilledService = searchParams.get('service') || '';
  const prefilledEventType = searchParams.get('eventType') || '';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<EnquiryFormValues>({
    resolver: zodResolver(enquirySchema) as any,
    defaultValues: {
      customerName: '',
      mobileNumber: '',
      email: '',
      eventType: prefilledEventType,
      eventDate: '',
      guestCount: undefined,
      eventLocation: '',
      preferredContactMethod: 'Phone Call',
      cateringService: prefilledService,
      mealPreference: 'Both',
      message: '',
    },
  });

  useEffect(() => {
    if (prefilledService) setValue('cateringService', prefilledService);
    if (prefilledEventType) setValue('eventType', prefilledEventType);
  }, [prefilledService, prefilledEventType, setValue]);

  // Minimum date today formatted for datepicker
  const todayDateString = new Date().toISOString().split('T')[0];

  const onSubmit = async (data: EnquiryFormValues) => {
    // If honeypot filled, silently drop spam
    if (honeypot) {
      console.warn('Spam detected via honeypot.');
      return;
    }

    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      const rawGuests = Number(data.guestCount);
      const guestNum = !isNaN(rawGuests) && rawGuests > 0 ? rawGuests : 0;

      const created = await enquiryService.createEnquiry({
        customerName: data.customerName,
        mobileNumber: data.mobileNumber,
        email: data.email || undefined,
        eventType: data.eventType || 'General Catering Enquiry',
        eventDate: data.eventDate || '',
        guestCount: guestNum,
        eventLocation: data.eventLocation?.trim() || '',
        cateringService: data.cateringService || undefined,
        mealPreference: data.mealPreference,
        preferredContactMethod: data.preferredContactMethod || 'Phone Call',
        message: data.message || undefined,
      });

      setSubmittedEnquiry(created);
      firebaseTrafficService.recordEvent('enquiry_submitted', `Enquiry for ${data.eventType || 'Event'}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : 'Failed to submit enquiry. Please try again.';
      setSubmissionError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyEnquiryId = () => {
    if (!submittedEnquiry) return;
    navigator.clipboard.writeText(submittedEnquiry.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      <SEO
        title="Event Booking Enquiry & Instant Quotation | Sri Caterers"
        description="Submit your catering enquiry to Sri Caterers Chennai. Get custom quotes for weddings, poojas, birthdays, and corporate banquets. Fast response & transparent pricing."
        keywords="catering enquiry Chennai, book catering online Chennai, wedding catering quotation, caterers booking form"
        canonicalPath="/enquiry"
      />

      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <Badge variant="maroon" size="md">
          Direct Booking Desk
        </Badge>
        <h1 className="font-serif text-3xl sm:text-5xl font-black text-maroon-950">
          Enquire for Your Celebration
        </h1>
        <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
          Share your event details and guest estimate. Our catering team will prepare a customized quotation with per-leaf or complete package rates.
        </p>
        <KolamDivider theme="gold" />
      </div>

      {/* Success State Screen */}
      {submittedEnquiry ? (
        <div className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-emerald-500/30 shadow-2xl text-center space-y-8 animate-in fade-in duration-300">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-900">
              Thank You! Your Catering Enquiry is Confirmed
            </h2>
            <p className="text-sm sm:text-base text-stone-600 max-w-lg mx-auto">
              We have received your enquiry for <strong className="text-charcoal">{submittedEnquiry.eventType}</strong> on{' '}
              <strong className="text-charcoal">{submittedEnquiry.eventDate}</strong>.
            </p>
          </div>

          {/* Reference ID card */}
          <div className="max-w-md mx-auto p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between">
            <div className="text-left">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                Your Enquiry Reference ID
              </span>
              <span className="font-mono text-lg font-black text-maroon-900">
                {submittedEnquiry.id}
              </span>
            </div>
            <button
              onClick={copyEnquiryId}
              className="p-2 rounded-xl bg-white border border-stone-200 text-stone-700 hover:text-maroon-800 hover:bg-stone-50 transition-colors"
              title="Copy Enquiry ID"
            >
              {copiedId ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* Next Steps Box */}
          <div className="max-w-xl mx-auto bg-ivory rounded-2xl p-6 border border-amber-200/80 text-left space-y-4">
            <h4 className="font-serif font-bold text-base text-maroon-950 flex items-center">
              <Sparkles className="w-4 h-4 mr-2 text-gold-dark" />
              What Happens Next?
            </h4>
            <div className="space-y-3 text-xs sm:text-sm text-stone-700">
              <div className="flex items-start space-x-3">
                <span className="w-5 h-5 rounded-full bg-maroon-800 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  1
                </span>
                <span>
                  Our catering director will review your guest count ({submittedEnquiry.guestCount} pax) and date availability.
                </span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="w-5 h-5 rounded-full bg-maroon-800 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  2
                </span>
                <span>
                  We will contact you via your preferred method ({submittedEnquiry.preferredContactMethod}) within 2 business hours.
                </span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="w-5 h-5 rounded-full bg-maroon-800 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  3
                </span>
                <span>
                  Sample food tasting can be scheduled at our Perambur kitchen prior to finalizing the auspicious booking token.
                </span>
              </div>
            </div>
          </div>

          {/* Instant Connect & Navigation Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={`https://wa.me/${siteConfig.whatsappNumber}?text=Hi%20Sri%20Caterers,%20I%20just%20submitted%20Enquiry%20ID%20${submittedEnquiry.id}%20for%20my%20event%20on%20${submittedEnquiry.eventDate}.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              <span>Message Us on WhatsApp Now</span>
            </a>

            <button
              onClick={() => setSubmittedEnquiry(null)}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-sm transition-all"
            >
              <span>Submit Another Enquiry</span>
            </button>

            <Link
              to="/menu"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl border border-stone-300 hover:border-maroon-800 text-stone-800 font-semibold text-sm transition-all"
            >
              <span>Explore Menu Items</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
          </div>
        </div>
      ) : (
        /* Form Card with compact mobile padding */
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-10 border border-stone-200 shadow-xl space-y-6 sm:space-y-8">
          {submissionError && (
            <div className="p-3 sm:p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-start space-x-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Submission Error:</span>
                <p className="mt-0.5">{submissionError}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
            {/* Honeypot field (hidden from real users) */}
            <div className="hidden" aria-hidden="true">
              <input
                type="text"
                name="website_url_honey"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            {/* Quick Note about requirements */}
            <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3 flex items-center gap-2.5 text-xs text-maroon-950">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Quick &amp; Easy Booking:</strong> Only your <strong>Full Name</strong> and <strong>Phone Number</strong> are mandatory. All other event details, date, and description are optional.
              </span>
            </div>

            {/* Section 1: Customer Contact Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 border-b border-stone-200 pb-2">
                <span className="w-6 h-6 rounded-full bg-maroon-800 text-white flex items-center justify-center text-xs font-bold">
                  1
                </span>
                <h3 className="font-serif font-bold text-lg text-maroon-950">
                  Customer &amp; Contact Details
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('customerName')}
                    placeholder="e.g. Karthikeyan Ramachandran"
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                      errors.customerName
                        ? 'border-red-400 focus:ring-red-300'
                        : 'border-stone-300 focus:ring-maroon-800'
                    }`}
                  />
                  {errors.customerName && (
                    <p className="text-xs text-red-600 mt-1">{errors.customerName.message}</p>
                  )}
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    10-Digit Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-500">
                      +91
                    </span>
                    <input
                      type="tel"
                      maxLength={10}
                      {...register('mobileNumber')}
                      placeholder="9840123456"
                      className={`w-full pl-12 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                        errors.mobileNumber
                          ? 'border-red-400 focus:ring-red-300'
                          : 'border-stone-300 focus:ring-maroon-800'
                      }`}
                    />
                  </div>
                  {errors.mobileNumber && (
                    <p className="text-xs text-red-600 mt-1">{errors.mobileNumber.message}</p>
                  )}
                </div>

                {/* Optional Email */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Email Address <span className="text-stone-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="email"
                    {...register('email')}
                    placeholder="e.g. karthik@example.com"
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                      errors.email
                        ? 'border-red-400 focus:ring-red-300'
                        : 'border-stone-300 focus:ring-maroon-800'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
                  )}
                </div>

                {/* Preferred Contact Method */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Preferred Contact Method <span className="text-stone-400 font-normal">(Optional)</span>
                  </label>
                  <select
                    {...register('preferredContactMethod')}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800 bg-white"
                  >
                    <option value="Phone Call">Phone Call</option>
                    <option value="WhatsApp">WhatsApp Message</option>
                    <option value="Email">Email</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Inline Trigger (No separate container) */}
            <div className="pt-1">
              {!showMoreInfo ? (
                <div className="flex flex-wrap items-center text-xs sm:text-sm text-stone-600 py-1">
                  <span className="text-red-500 font-bold mr-1.5">*</span>
                  <span>Have date, guest count, or hall location ready?</span>
                  <button
                    type="button"
                    id="btn-add-more-info"
                    onClick={() => setShowMoreInfo(true)}
                    className="ml-1.5 inline-flex items-center gap-1 text-red-600 hover:text-red-700 font-bold underline decoration-red-500 hover:decoration-red-700 underline-offset-4 transition-colors cursor-pointer bg-transparent border-0 p-0"
                  >
                    <span>Add More Info</span>
                    <ChevronDown className="w-3.5 h-3.5 text-red-600" />
                  </button>
                </div>
              ) : (
                <div className="rounded-2xl border border-stone-200 bg-stone-50/50 p-5 sm:p-6 space-y-8 animate-fadeIn">
                  {/* Top Header with Close Button */}
                  <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                    <div className="flex items-center gap-2">
                      <span className="text-red-500 font-bold">*</span>
                      <h4 className="font-serif font-bold text-base text-maroon-950">
                        Event &amp; Menu Details
                      </h4>
                      <span className="text-[10px] font-semibold bg-stone-200/80 text-stone-700 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Optional
                      </span>
                    </div>

                    <button
                      type="button"
                      id="btn-close-more-info"
                      onClick={() => setShowMoreInfo(false)}
                      className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-bold underline decoration-red-500 hover:decoration-red-700 underline-offset-4 transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5 text-red-600" />
                      <span>Close</span>
                    </button>
                  </div>

                  {/* Event Details */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                      <h4 className="font-serif font-bold text-base text-maroon-950 flex items-center gap-2">
                        <span>Event &amp; Celebration Specifications</span>
                      </h4>
                      <span className="text-xs text-stone-400">All fields optional</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Event Type */}
                      <div>
                        <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                          Event Type <span className="text-stone-400 font-normal">(Optional)</span>
                        </label>
                        <select
                          {...register('eventType')}
                          className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 bg-white ${
                            errors.eventType
                              ? 'border-red-400 focus:ring-red-300'
                              : 'border-stone-300 focus:ring-maroon-800'
                          }`}
                        >
                          <option value="">Any / General Event</option>
                          {siteConfig.eventTypes.map((evt) => (
                            <option key={evt.id} value={evt.name}>
                              {evt.name}
                            </option>
                          ))}
                        </select>
                        {errors.eventType && (
                          <p className="text-xs text-red-600 mt-1">{errors.eventType.message}</p>
                        )}
                      </div>

                      {/* Event Date */}
                      <div>
                        <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                          Event Date <span className="text-stone-400 font-normal">(Optional)</span>
                        </label>
                        <input
                          type="date"
                          min={todayDateString}
                          {...register('eventDate')}
                          className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                            errors.eventDate
                              ? 'border-red-400 focus:ring-red-300'
                              : 'border-stone-300 focus:ring-maroon-800'
                          }`}
                        />
                        {errors.eventDate && (
                          <p className="text-xs text-red-600 mt-1">{errors.eventDate.message}</p>
                        )}
                      </div>

                      {/* Guest Count */}
                      <div>
                        <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                          Estimated Guests <span className="text-stone-400 font-normal">(Optional)</span>
                        </label>
                        <input
                          type="number"
                          min={10}
                          max={10000}
                          step={10}
                          {...register('guestCount')}
                          placeholder="e.g. 100"
                          className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                            errors.guestCount
                              ? 'border-red-400 focus:ring-red-300'
                              : 'border-stone-300 focus:ring-maroon-800'
                          }`}
                        />
                        {errors.guestCount && (
                          <p className="text-xs text-red-600 mt-1">{errors.guestCount.message}</p>
                        )}
                      </div>
                    </div>

                    {/* Location */}
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                        Event Location, Hall or City <span className="text-stone-400 font-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        {...register('eventLocation')}
                        placeholder="e.g. Chennai, Villivakkam, Perambur, or Hall Name"
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                          errors.eventLocation
                            ? 'border-red-400 focus:ring-red-300'
                            : 'border-stone-300 focus:ring-maroon-800'
                        }`}
                      />
                      {errors.eventLocation && (
                        <p className="text-xs text-red-600 mt-1">{errors.eventLocation.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Menu & Food Preferences */}
                  <div className="space-y-4 pt-4 border-t border-stone-200">
                    <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                      <h4 className="font-serif font-bold text-base text-maroon-950">
                        Menu &amp; Food Preferences
                      </h4>
                      <span className="text-xs text-stone-400">All fields optional</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Catering Service Choice */}
                      <div>
                        <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                          Selected Catering Service <span className="text-stone-400 font-normal">(Optional)</span>
                        </label>
                        <select
                          {...register('cateringService')}
                          className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800 bg-white"
                        >
                          <option value="">Any / General Consultation</option>
                          {CATERING_SERVICES.map((s) => (
                            <option key={s.id} value={s.title}>
                              {s.title}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Meal Preference */}
                      <div>
                        <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                          Meal Preference <span className="text-stone-400 font-normal">(Optional)</span>
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {(['Vegetarian', 'Non-Vegetarian', 'Both'] as const).map((pref) => (
                            <label
                              key={pref}
                              className="flex items-center justify-center px-3 py-2.5 rounded-xl border border-stone-200 text-xs font-bold cursor-pointer hover:bg-stone-50 has-[:checked]:bg-maroon-50 has-[:checked]:border-maroon-800 has-[:checked]:text-maroon-900 transition-all text-center"
                            >
                              <input
                                type="radio"
                                value={pref}
                                {...register('mealPreference')}
                                className="sr-only"
                              />
                              <span>{pref}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Special message / requirements */}
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                        Special Requirements or Notes <span className="text-stone-400 font-normal">(Optional)</span>
                      </label>
                      <textarea
                        rows={3}
                        {...register('message')}
                        placeholder="Mention any specific items needed (e.g. Live Mojito stall, Muhurtham breakfast timings, Halal requirement, Chenda melam)..."
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800"
                      />
                    </div>
                  </div>

                  {/* Close button at bottom of opened dropdown */}
                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      id="btn-close-more-info-bottom"
                      onClick={() => setShowMoreInfo(false)}
                      className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-bold underline decoration-red-500 hover:decoration-red-700 underline-offset-4 transition-colors cursor-pointer bg-transparent border-0 p-0"
                    >
                      <X className="w-3.5 h-3.5 text-red-600" />
                      <span>Close Additional Details</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Privacy notice banner */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex items-start space-x-3 text-xs text-stone-600">
              <ShieldCheck className="w-5 h-5 text-leaf-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-800 font-semibold">Privacy &amp; Security:</strong> We only collect your name, mobile number, and event details to provide a catering quote and coordinate service. We never sell or share customer details with third parties.
              </div>
            </div>

            {/* Submit button */}
            <div className="pt-2">
              <Button
                type="submit"
                size="lg"
                variant="primary"
                isLoading={isSubmitting}
                className="w-full sm:w-auto px-10 py-4 text-base"
              >
                <CalendarCheck className="w-5 h-5 mr-2 text-gold" />
                <span>Submit Catering Enquiry</span>
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
