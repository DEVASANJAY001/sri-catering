import React from 'react';
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
} from 'lucide-react';
import { CATERING_SERVICES } from '../../data/services';
import { siteConfig } from '../../config/siteConfig';
import { KolamDivider } from '../../components/common/KolamDivider';
import { Badge } from '../../components/common/Badge';
import { SEO } from '../../components/common/SEO';

export const ServiceDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const service = CATERING_SERVICES.find((s) => s.slug === slug);

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
          {/* Main Visual Box: Official Menu Card */}
          <div className="rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-gold/40 shadow-xl bg-white relative group">
            <div className="bg-maroon-900 text-amber-200 px-4 py-2.5 flex items-center justify-between border-b border-gold/30">
              <span className="font-serif text-xs sm:text-sm font-bold flex items-center">
                <Utensils className="w-3.5 h-3.5 mr-1.5 text-gold" />
                Official Menu Card &amp; Package
              </span>
              <span className="text-[10px] sm:text-xs text-amber-300 font-tamil font-medium">
                அதிகாரப்பூர்வ மெனு கார்டு
              </span>
            </div>

            <div className="relative aspect-[3/4] sm:aspect-[4/5] bg-stone-900/5 overflow-hidden flex items-center justify-center p-1 sm:p-2">
              <img
                src={service.menuCardImageSrc}
                alt={`${service.title} Official Menu Card`}
                className="w-full h-full object-contain group-hover:scale-102 transition-transform duration-300 rounded-xl"
              />
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
    </div>
  );
};
