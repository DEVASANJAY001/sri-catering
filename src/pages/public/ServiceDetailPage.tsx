import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import {
  CalendarCheck,
  CheckCircle2,
  Users,
  Utensils,
  Sparkles,
  ArrowLeft,
  Phone,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  X,
} from 'lucide-react';
import { CATERING_SERVICES } from '../../data/services';
import { siteConfig } from '../../config/siteConfig';
import { KolamDivider } from '../../components/common/KolamDivider';
import { Badge } from '../../components/common/Badge';
import { SEO } from '../../components/common/SEO';

export const ServiceDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const service = CATERING_SERVICES.find((s) => s.slug === slug);

  const bannerImages = (service?.menuCardImages && service.menuCardImages.length > 0)
    ? service.menuCardImages
    : (service ? [service.menuCardImageSrc] : []);

  const [activeIdx, setActiveIdx] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartXRef = useRef<number | null>(null);

  // Reset to first slide if service changes
  useEffect(() => {
    setActiveIdx(0);
  }, [slug]);

  // Auto-play cycling when there are multiple banner cards and user isn't hovering
  useEffect(() => {
    if (bannerImages.length <= 1 || isPaused || isLightboxOpen) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % bannerImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [bannerImages.length, isPaused, isLightboxOpen]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsLightboxOpen(false);
      if (e.key === 'ArrowRight') setActiveIdx((prev) => (prev + 1) % bannerImages.length);
      if (e.key === 'ArrowLeft') setActiveIdx((prev) => (prev - 1 + bannerImages.length) % bannerImages.length);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, bannerImages.length]);

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % bannerImages.length);
  };

  const handlePrev = () => {
    setActiveIdx((prev) => (prev - 1 + bannerImages.length) % bannerImages.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    if (deltaX > 40) {
      handlePrev();
    } else if (deltaX < -40) {
      handleNext();
    }
    touchStartXRef.current = null;
  };

  const getCardLabel = (idx: number) => {
    if (service?.slug === 'a-to-z-wedding-service') {
      if (idx === 0) return { title: 'Package Overview (₹1.98L)', shortTitle: '₹1.98L Package', subtitle: '600 Guests Overview', badge: 'Overview' };
      if (idx === 1) return { title: 'Menu & Inclusions List', shortTitle: 'Menu & Stalls', subtitle: 'Veg, Non-Veg & Stalls', badge: 'Inclusions' };
    }
    if (service?.slug === 'temple-religious-functions' || service?.menuCardImages?.length === 4) {
      if (idx === 0) return { title: 'Menu 1: Dinner & Lunch', shortTitle: 'Menu 1: Dinner & Lunch', subtitle: 'Dinner ₹290 • Lunch ₹180', badge: '₹290/leaf' };
      if (idx === 1) return { title: 'Menu 2: 4-Course Tariff', shortTitle: 'Menu 2: 4-Course Tariff', subtitle: 'Dinner ₹280 • Lunch ₹160', badge: '₹280/leaf' };
      if (idx === 2) return { title: 'Menu 3: Evening High-Tea', shortTitle: 'Menu 3: Evening High-Tea', subtitle: 'Snacks ₹180 • Drinks ₹90', badge: '₹180/leaf' };
      if (idx === 3) return { title: 'Menu 4: Mint Leaf Special', shortTitle: 'Menu 4: Mint Leaf Special', subtitle: 'Snacks ₹180 • B/F ₹160', badge: '₹180/leaf' };
    }
    return { title: `Card ${idx + 1}`, shortTitle: `Card ${idx + 1}`, subtitle: 'Official Tariff Sheet', badge: `Part ${idx + 1}` };
  };

  if (!service) {
    return <Navigate to="/services" replace />;
  }

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    alternateName: service.tamilTitle,
    serviceType: service.title,
    description: service.fullDescription,
    provider: {
      '@type': 'LocalBusiness',
      name: 'Sri Caterers Chennai',
      telephone: '+918608188101',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Chennai',
        addressRegion: 'Tamil Nadu',
        addressCountry: 'IN',
      },
    },
    areaServed: {
      '@type': 'City',
      name: 'Chennai',
    },
    image: `https://sricaterers.in${service.imageSrc}`,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      <SEO
        title={`${service.title} (${service.tamilTitle})`}
        description={service.shortDescription}
        keywords={`${service.title}, ${service.tamilTitle}, catering Chennai, ${service.eventTypesSupported.join(', ')}`}
        canonicalPath={`/services/${service.slug}`}
        ogImage={`https://sricaterers.in${service.imageSrc}`}
        schema={serviceSchema}
      />

      {/* Back button */}
      <div>
        <Link
          to="/services"
          className="inline-flex items-center text-xs sm:text-sm font-semibold text-stone-600 hover:text-maroon-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          <span>Back to All Catering Services</span>
        </Link>
      </div>

      {/* Main Hero & Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Visual Asset - Official Menu Card & Live Setup */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main Visual Box: Official Menu Card Banner Sequence */}
          <div
            className="rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-gold/40 shadow-xl bg-white relative group"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Banner Header */}
            <div className="bg-gradient-to-r from-maroon-950 via-maroon-900 to-maroon-950 text-amber-200 px-3.5 py-2 flex items-center justify-between border-b border-gold/30">
              <div className="flex items-center space-x-2 min-w-0">
                <Utensils className="w-3.5 h-3.5 text-gold shrink-0" />
                <span className="font-serif text-xs sm:text-sm font-bold text-amber-100 truncate">
                  Official Menu Card &amp; Package
                </span>
                {bannerImages.length > 1 && (
                  <span className="shrink-0 px-2 py-0.5 rounded-full bg-gold/20 text-gold-light text-[10px] font-extrabold border border-gold/40">
                    {activeIdx + 1} of {bannerImages.length}
                  </span>
                )}
              </div>
              <span className="text-[10px] sm:text-xs text-amber-300 font-tamil font-medium shrink-0 ml-2">
                அதிகாரப்பூர்வ மெனு கார்டு
              </span>
            </div>

            {/* Sequence Selector Tabs (if multiple images) - Clean 2x2 Compact Grid */}
            {bannerImages.length > 1 && (
              <div className="bg-amber-50/70 border-b border-gold/20 p-1.5 grid grid-cols-2 gap-1.5">
                {bannerImages.map((_, idx) => {
                  const label = getCardLabel(idx);
                  const isActive = activeIdx === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveIdx(idx)}
                      className={`py-1.5 px-2 rounded-lg text-left transition-all flex items-center justify-between gap-1 border ${
                        isActive
                          ? 'bg-maroon-800 text-amber-100 shadow-xs border-gold/60 ring-1 ring-gold/40'
                          : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-1.5">
                          <span
                            className={`text-[9px] font-black px-1.5 py-0.5 rounded leading-none shrink-0 ${
                              isActive ? 'bg-gold text-maroon-950' : 'bg-stone-100 text-stone-700'
                            }`}
                          >
                            {idx + 1}
                          </span>
                          <p className="text-[10px] sm:text-[11px] font-bold leading-tight truncate">
                            {label.shortTitle || label.title}
                          </p>
                        </div>
                        <p
                          className={`text-[9px] truncate font-medium mt-0.5 pl-4.5 ${
                            isActive ? 'text-amber-200' : 'text-stone-500'
                          }`}
                        >
                          {label.subtitle}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Image Stage */}
            <div
              className="relative aspect-[3/4] sm:aspect-[4/5] bg-stone-900/5 overflow-hidden flex items-center justify-center p-1 sm:p-2 cursor-pointer"
              onClick={() => setIsLightboxOpen(true)}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <img
                src={bannerImages[activeIdx]}
                alt={bannerImages.length > 1 ? `${service.title} Official Menu Card - Part ${activeIdx + 1}` : `${service.title} Official Menu Card`}
                key={bannerImages[activeIdx]}
                className="w-full h-full object-contain rounded-xl transition-all duration-300 group-hover:scale-102"
              />

              {/* Prev / Next buttons if multiple images */}
              {bannerImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrev();
                    }}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-maroon-950/80 hover:bg-maroon-950 text-amber-200 border border-gold/50 shadow-lg backdrop-blur-xs transition-all hover:scale-110 active:scale-95 z-10"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNext();
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-maroon-950/80 hover:bg-maroon-950 text-amber-200 border border-gold/50 shadow-lg backdrop-blur-xs transition-all hover:scale-110 active:scale-95 z-10"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}

              {/* Zoom In button hint on top right */}
              <div className="absolute top-3 right-3 bg-stone-950/75 backdrop-blur-xs text-white px-2.5 py-1 rounded-full text-[10px] font-semibold border border-white/20 flex items-center space-x-1 shadow-md opacity-85 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="w-3 h-3 text-gold" />
                <span>Tap to Zoom</span>
              </div>

              {/* Sequence Dots at bottom */}
              {bannerImages.length > 1 && (
                <div
                  className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center space-x-1.5 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-full border border-white/10 z-10"
                  onClick={(e) => e.stopPropagation()}
                >
                  {bannerImages.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      type="button"
                      onClick={() => setActiveIdx(dotIdx)}
                      className={`h-2 rounded-full transition-all ${
                        activeIdx === dotIdx ? 'w-5 bg-gold' : 'w-2 bg-white/50 hover:bg-white/80'
                      }`}
                      aria-label={`Go to slide ${dotIdx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Real Feast & Setup Photo */}
          <div className="rounded-2xl overflow-hidden border border-stone-200 shadow-sm bg-stone-50 p-3 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-700">
              <span className="flex items-center">
                <Sparkles className="w-3.5 h-3.5 mr-1 text-gold-dark" />
                Live Catering Feast Setup
              </span>
              <span className="text-[10px] text-stone-500 font-tamil">
                நிகழ்வு விருந்து புகைப்படம்
              </span>
            </div>
            <div className="aspect-[16/9] rounded-xl overflow-hidden relative">
              <img
                src={service.imageSrc}
                alt={`${service.title} Live Catering Setup`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-2 left-2.5 right-2.5 text-white text-[11px] font-medium drop-shadow">
                Authentic {service.title} Feast Arrangement
              </div>
            </div>
          </div>

          {/* Quick Contact Card */}
          <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200 space-y-3">
            <h4 className="font-serif font-bold text-base text-maroon-950">
              Need Direct Consultation?
            </h4>
            <p className="text-xs text-stone-600">
              Speak directly with our proprietor regarding bespoke menu combinations, auspicious dates, or venue logistics.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <a
                href={`tel:${siteConfig.rawPhone}`}
                className="flex items-center justify-center px-3 py-2.5 rounded-xl bg-maroon-800 text-white text-xs font-bold shadow-sm hover:bg-maroon-900 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 mr-1.5 text-gold" />
                Call Now
              </a>
              <a
                href={siteConfig.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center px-3 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-sm hover:bg-emerald-700 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Service Specifications */}
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="maroon" size="md">
                Catering Service Overview
              </Badge>
              {service.badgeText && (
                <Badge variant="turmeric" size="md">
                  {service.badgeText}
                </Badge>
              )}
            </div>

            <p className="font-tamil text-sm text-gold-dark font-semibold">
              {service.tamilTitle}
            </p>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-maroon-950">
              {service.title}
            </h1>

            <p className="text-sm sm:text-base text-stone-600 leading-relaxed pt-2">
              {service.fullDescription}
            </p>
          </div>

          <KolamDivider theme="gold" className="my-2" />

          {/* Key Attributes Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white border border-stone-200 flex items-start space-x-3 shadow-xs">
              <Users className="w-5 h-5 text-maroon-800 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-stone-500 uppercase">
                  Guest Capacity Range
                </span>
                <p className="text-sm font-extrabold text-charcoal">
                  {service.guestCountRange}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-stone-200 flex items-start space-x-3 shadow-xs">
              <Utensils className="w-5 h-5 text-maroon-800 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-stone-500 uppercase">
                  Dining &amp; Serving Styles
                </span>
                <p className="text-sm font-semibold text-charcoal">
                  {service.mealStyles.join(' • ')}
                </p>
              </div>
            </div>
          </div>

          {/* Event Types Supported */}
          <div className="space-y-3">
            <h3 className="font-serif font-bold text-lg text-maroon-950">
              Event Types Supported
            </h3>
            <div className="flex flex-wrap gap-2">
              {service.eventTypesSupported.map((evt, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg bg-stone-100 text-stone-800 text-xs font-semibold border border-stone-200"
                >
                  {evt}
                </span>
              ))}
            </div>
          </div>

          {/* Sample Menu Highlights */}
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-lg text-maroon-950">
              Signature Menu Highlights &amp; Inclusions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {service.sampleHighlights.map((hl, idx) => (
                <div key={idx} className="flex items-start space-x-2 text-xs sm:text-sm text-stone-700">
                  <CheckCircle2 className="w-4 h-4 text-leaf-700 shrink-0 mt-0.5" />
                  <span>{hl}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Addons */}
          <div className="space-y-3">
            <h3 className="font-serif font-bold text-lg text-maroon-950 flex items-center">
              <Sparkles className="w-4 h-4 mr-2 text-gold-dark" />
              Popular Event Add-ons
            </h3>
            <div className="flex flex-wrap gap-2">
              {service.popularAddons.map((addon, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 text-xs font-medium"
                >
                  + {addon}
                </span>
              ))}
            </div>
          </div>

          {/* Book this service CTA */}
          <div className="pt-6 border-t border-stone-200">
            <Link
              to={`/enquiry?service=${encodeURIComponent(service.title)}`}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-bold text-maroon-950 bg-gradient-to-r from-amber-300 via-gold to-turmeric-400 hover:from-amber-400 hover:to-turmeric-500 shadow-xl transition-all"
            >
              <CalendarCheck className="w-5 h-5 mr-2 text-maroon-950" />
              <span>Book / Enquire for {service.title}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Lightbox Modal for Fullscreen Menu Card Viewing */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex flex-col items-center justify-center p-3 sm:p-6"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Lightbox Header Bar */}
          <div
            className="w-full max-w-4xl flex items-center justify-between text-white pb-3 px-2 border-b border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center space-x-2 min-w-0">
              <Utensils className="w-4 h-4 text-gold shrink-0" />
              <span className="font-serif font-bold text-sm sm:text-base text-gold truncate">
                {bannerImages.length > 1 ? `${service.title} - ${getCardLabel(activeIdx).title}` : `${service.title} - Official Menu Card`}
              </span>
              {bannerImages.length > 1 && (
                <span className="text-xs text-amber-200/80 font-mono shrink-0 px-2 py-0.5 rounded-full bg-white/10">
                  {activeIdx + 1} / {bannerImages.length}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors ml-2 shrink-0"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Lightbox Main Image & Navigation */}
          <div
            className="relative w-full max-w-4xl flex-1 flex items-center justify-center my-3 min-h-0"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <img
              src={bannerImages[activeIdx]}
              alt={`${service.title} Menu Card`}
              className="max-h-[75vh] w-auto max-w-full object-contain rounded-lg shadow-2xl"
            />

            {bannerImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-2 sm:-left-5 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-stone-900/85 hover:bg-gold hover:text-maroon-950 text-white border border-white/20 transition-all shadow-xl hover:scale-110 active:scale-95"
                  aria-label="Previous card"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-2 sm:-right-5 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-stone-900/85 hover:bg-gold hover:text-maroon-950 text-white border border-white/20 transition-all shadow-xl hover:scale-110 active:scale-95"
                  aria-label="Next card"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Lightbox Footer Thumbnails */}
          {bannerImages.length > 1 && (
            <div
              className="flex items-center space-x-3 pt-2"
              onClick={(e) => e.stopPropagation()}
            >
              {bannerImages.map((imgSrc, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveIdx(idx)}
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    activeIdx === idx
                      ? 'border-gold ring-2 ring-gold/50 scale-105 opacity-100'
                      : 'border-white/30 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={imgSrc} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
