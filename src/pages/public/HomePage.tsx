import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarCheck,
  UtensilsCrossed,
  Phone,
  ShieldCheck,
  Users,
  ArrowRight,
  Clock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';
import { MEDIA_ASSETS, MediaAsset } from '../../config/assets';
import { CATERING_SERVICES } from '../../data/services';
import { MENU_PACKAGES } from '../../data/menu';
import { KolamDivider } from '../../components/common/KolamDivider';
import { Badge } from '../../components/common/Badge';
import { ServiceCard } from '../../components/cards/ServiceCard';
import { MenuPackageCard } from '../../components/cards/MenuCard';
import { MediaCard } from '../../components/cards/MediaCard';
import { Modal } from '../../components/common/Modal';
import { SEO } from '../../components/common/SEO';
import { FAQSection } from '../../components/common/FAQSection';

export const HomePage: React.FC = () => {
  const [activeVideoModal, setActiveVideoModal] = useState<MediaAsset | null>(null);
  const [isCarouselScrolling, setIsCarouselScrolling] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCarouselScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 6);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 6);
    }
    setIsCarouselScrolling(true);
    if (scrollTimerRef.current) {
      clearTimeout(scrollTimerRef.current);
    }
    scrollTimerRef.current = setTimeout(() => {
      setIsCarouselScrolling(false);
    }, 450);
  };

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const amount = direction === 'left' ? -320 : 320;
      carouselRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const checkScroll = () => {
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        setCanScrollLeft(scrollLeft > 6);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 6);
      }
    };
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => {
      window.removeEventListener('resize', checkScroll);
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    };
  }, []);

  return (
    <div className="space-y-12 sm:space-y-20">
      <SEO
        title="Authentic Tamil Nadu Catering & Royal Event Management"
        description="Sri Caterers Chennai offers authentic Tamil Nadu catering. Traditional banana leaf wedding feasts, wood-fire mutton biryani, live snack stalls, and complete event management. Pure vegetarian & Halal non-veg packages from ₹149/leaf."
        keywords="Tamil Nadu catering, Chennai caterers, wedding catering Chennai, banana leaf meals Chennai, wood fire mutton biryani Chennai, Sri Caterers Villivakkam, Perambur catering, Seemantham catering Chennai, Muhurtham feast, marriage catering Chennai, halal biryani catering"
        canonicalPath="/"
      />

      {/* 1. Hero Section - Mobile Compact & High-Impact */}
      <section className="relative overflow-hidden bg-maroon-950 text-white pt-8 pb-14 sm:py-20 lg:py-24">
        {/* Background Catering Feast Image with Smooth Gradient Overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src={MEDIA_ASSETS.heroBg}
            alt="Sri Caterers Authentic Tamil Nadu Feast and Banquet Setup"
            className="w-full h-full object-cover object-right lg:object-center opacity-90 contrast-105 brightness-100"
            loading="eager"
          />
          {/* Smooth directional gradient: protective tint on the left for text contrast, fading to fully transparent on the right to reveal the feast setup bright and smooth */}
          <div className="absolute inset-0 bg-gradient-to-r from-maroon-950 via-maroon-950/80 via-40% lg:via-50% to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-maroon-950/70 via-transparent to-maroon-950/85" />
        </div>

        <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-maroon-800/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-turmeric-600/20 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl lg:max-w-2xl xl:max-w-3xl space-y-4 sm:space-y-6 text-center lg:text-left py-2 sm:py-6 lg:py-8">
            {/* Top Emblem / Quality Badge */}
            <div className="inline-flex items-center px-3.5 py-1 rounded-full bg-maroon-900/90 border border-gold/40 text-[11px] sm:text-xs text-amber-200 backdrop-blur-sm shadow-sm">
              <span className="font-semibold tracking-wide">
                One Among the Best Catering &amp; Events
              </span>
            </div>

            <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight text-white tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.85)]">
              Authentic Flavours of{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-gold to-turmeric-400">
                Tamil Nadu
              </span>{' '}
              for Your Grand Occasions
            </h1>

            <p className="text-xs sm:text-base text-stone-100 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
              From authentic banana-leaf Muhurtham feasts and slow-cooked firewood biryani to modern live snack stalls and complete event management. Directed by{' '}
              <strong className="text-amber-300 font-semibold">{siteConfig.proprietor}</strong> in Chennai.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
              <Link
                to="/enquiry"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl text-xs sm:text-sm font-bold text-maroon-950 bg-gradient-to-r from-amber-300 via-gold to-turmeric-400 hover:from-amber-400 hover:to-turmeric-500 shadow-lg shadow-amber-500/10 transition-all duration-200 active:scale-95"
              >
                <CalendarCheck className="w-4 h-4 mr-2 text-maroon-950" />
                <span>Enquire for Your Event</span>
              </Link>

              <Link
                to="/services"
                className="w-full sm:w-auto inline-flex items-center justify-center px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl text-xs sm:text-sm font-semibold text-white border border-amber-300/40 hover:border-gold hover:bg-white/5 transition-all duration-200"
              >
                <UtensilsCrossed className="w-4 h-4 mr-2 text-gold" />
                <span>Explore Our Services</span>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="pt-4 border-t border-maroon-900/80 flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 text-[11px] sm:text-xs text-amber-200/90">
              <span className="flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-leaf-400" />
                100% Halal Options
              </span>
              <span className="flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-gold" />
                Wood-Fire Dum
              </span>
              <span className="flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-leaf-400" />
                Banana-Leaf Feasts
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key Highlights Strip - Clean, icon-free & simplified for easy understanding */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-12 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
          {siteConfig.highlights.map((h, i) => (
            <div
              key={i}
              className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-stone-200/90 shadow-xs hover:border-maroon-300 hover:shadow-sm transition-all flex flex-col justify-between border-t-2 border-t-gold"
            >
              <div>
                <h3 className="font-serif font-bold text-xs sm:text-base text-maroon-950">
                  {h.title}
                </h3>
                {/* Simplified & easy to understand on mobile, full text on desktop */}
                <p className="mt-1 text-[11px] sm:text-xs text-stone-600 leading-snug sm:hidden">
                  {h.simpleDesc}
                </p>
                <p className="mt-1 text-xs text-stone-600 leading-relaxed hidden sm:block">
                  {h.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Catering Service Highlights - 2 Columns on Mobile View */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <Badge variant="maroon" size="sm">
            Our Services
          </Badge>
          <h2 className="font-serif text-xl sm:text-3xl md:text-4xl font-extrabold text-maroon-950">
            Expertly Crafted Services for Memorable Events
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            SRI Wedding Caterers, we offer a complete range of wedding and event services designed to make your special day truly unforgettable.
          </p>
          <KolamDivider theme="gold" className="my-2" />
        </div>

        {/* 2-Column Mobile Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6 mt-6 sm:mt-10">
          {CATERING_SERVICES.slice(0, 6).map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        <div className="text-center mt-6 sm:mt-8">
          <Link
            to="/services"
            className="inline-flex items-center text-xs sm:text-sm font-bold text-maroon-800 hover:text-maroon-950 border border-maroon-800/30 hover:border-maroon-800 px-5 py-2.5 rounded-xl transition-all"
          >
            <span>View All Catering Services</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Link>
        </div>
      </section>

      {/* 4. Grand Menu Packages Highlight - Right to Left Scrollable Carousel with Blur Edge */}
      <section className="bg-stone-50 py-10 sm:py-16 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <Badge variant="turmeric" size="sm">
              Special Menu Packages
            </Badge>
            <h2 className="font-serif text-xl sm:text-3xl md:text-4xl font-extrabold text-maroon-950">
              Popular Catering Feasts &amp; Combos
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              Explore our best-selling packages starting from ₹149/leaf up to full ₹1.98 Lakh mega wedding event packages.
            </p>
            <KolamDivider theme="maroon" className="my-2" />
          </div>

          {/* Header Controls for Desktop */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1" />
            <div className="hidden sm:flex items-center space-x-2">
              <button
                type="button"
                onClick={() => scrollCarousel('left')}
                disabled={!canScrollLeft}
                aria-label="Previous packages"
                className={`p-2 rounded-xl border border-stone-300 bg-white shadow-2xs transition-all ${
                  canScrollLeft
                    ? 'hover:bg-maroon-800 hover:text-white hover:border-maroon-800 text-stone-700 cursor-pointer'
                    : 'opacity-40 text-stone-400 cursor-not-allowed'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollCarousel('right')}
                disabled={!canScrollRight}
                aria-label="Next packages"
                className={`p-2 rounded-xl border border-stone-300 bg-white shadow-2xs transition-all ${
                  canScrollRight
                    ? 'hover:bg-maroon-800 hover:text-white hover:border-maroon-800 text-stone-700 cursor-pointer'
                    : 'opacity-40 text-stone-400 cursor-not-allowed'
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Horizontal Right-to-Left Scrollable Carousel (Full-Height Seamless Soft Vignette) */}
          <div className="relative mt-2 sm:mt-4">
            {/* Left Edge: Seamless Soft Vignette Fade (Full Height, No Borders/Corners) */}
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute -left-1 sm:left-0 inset-y-0 w-8 sm:w-16 bg-gradient-to-r from-stone-50 via-stone-50/70 to-transparent z-10 transition-opacity duration-300 ease-out ${
                isCarouselScrolling && canScrollLeft ? 'opacity-100' : 'opacity-0'
              }`}
            />

            {/* Right Edge: Seamless Soft Vignette Fade (Full Height, No Borders/Corners) */}
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute -right-1 sm:right-0 inset-y-0 w-8 sm:w-16 bg-gradient-to-l from-stone-50 via-stone-50/70 to-transparent z-10 transition-opacity duration-300 ease-out ${
                isCarouselScrolling && canScrollRight ? 'opacity-100' : 'opacity-0'
              }`}
            />

            <div
              ref={carouselRef}
              onScroll={handleCarouselScroll}
              className="flex overflow-x-auto snap-x snap-mandatory space-x-3 sm:space-x-6 pb-4 pt-1 px-1 sm:px-2 scroll-smooth items-stretch"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {MENU_PACKAGES.map((pkg) => (
                <div
                  key={pkg.id}
                  className="w-[calc(50%-6px)] sm:w-[320px] lg:w-[360px] shrink-0 snap-start flex-none flex flex-col"
                >
                  <MenuPackageCard pkg={pkg} />
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Swipe Hint */}
          <div className="flex items-center justify-between mt-1 px-1 text-[11px] text-stone-500 sm:hidden">
            <span>Swipe left to view more feasts</span>
            <span className="text-maroon-800 font-bold flex items-center">
              &rarr;
            </span>
          </div>

          <div className="text-center mt-6 sm:mt-8">
            <Link
              to="/menu"
              className="inline-flex items-center text-xs sm:text-sm font-bold text-white bg-maroon-800 hover:bg-maroon-900 px-6 py-3 rounded-xl shadow-md transition-all"
            >
              <UtensilsCrossed className="w-3.5 h-3.5 mr-1.5 text-gold" />
              <span>Explore Complete Menu &amp; Categories</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Live Videos & Preparation Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <Badge variant="leaf" size="sm">
            Live Action &amp; Atmosphere
          </Badge>
          <h2 className="font-serif text-xl sm:text-3xl md:text-4xl font-extrabold text-maroon-950">
            Food Preparation &amp; Live Service
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            Real event clips demonstrating authentic slow wood-fire cooking and live food stalls.
          </p>
          <KolamDivider theme="leaf" className="my-2" />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8 mt-6 sm:mt-10">
          {MEDIA_ASSETS.videos.map((vid) => (
            <MediaCard
              key={vid.id}
              asset={vid}
              onOpenLightbox={(asset) => setActiveVideoModal(asset)}
            />
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            to="/gallery"
            className="inline-flex items-center text-xs sm:text-sm font-bold text-white bg-maroon-800 hover:bg-maroon-900 px-6 py-3 rounded-xl shadow-md transition-all"
          >
            <span>Open Full Gallery ({MEDIA_ASSETS.videos.length} Live Feasts &amp; Kitchen Reels)</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Link>
        </div>
      </section>

      {/* 6. Event Types Served (Easy Learning & Simple Cultural Guide) */}
      <section className="bg-maroon-950 text-white py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[10px] sm:text-xs font-bold text-gold uppercase tracking-wider">
              Ceremonies &amp; Gatherings
            </span>
            <h2 className="font-serif text-xl sm:text-3xl md:text-4xl font-extrabold text-white">
              Events We Cater
            </h2>
            <p className="text-xs sm:text-sm text-stone-300">
              Easy guide to traditional menus and services we offer for every Tamil celebration.
            </p>
            <KolamDivider theme="gold" className="my-2" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-4 mt-6 sm:mt-10">
            {siteConfig.eventTypes.map((evt) => (
              <Link
                key={evt.id}
                to={`/enquiry?eventType=${encodeURIComponent(evt.name)}`}
                className="p-2.5 sm:p-4 rounded-xl bg-maroon-900/70 border border-gold/25 hover:border-gold hover:bg-maroon-900 transition-all group flex flex-col justify-between text-left"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-tamil text-amber-300 text-[11px] sm:text-xs font-semibold">
                      {evt.tamil}
                    </span>
                    <span className="text-[9px] text-gold/70 uppercase font-bold tracking-wider hidden sm:inline">
                      Catering
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-xs sm:text-sm text-white mt-1 group-hover:text-amber-200 transition-colors">
                    {evt.name}
                  </h4>
                  <p className="text-[10px] sm:text-xs text-stone-300 mt-1 leading-snug line-clamp-2">
                    {evt.shortDesc}
                  </p>
                </div>
                <div className="mt-2.5 pt-1.5 border-t border-maroon-800/80 flex items-center justify-between text-[9px] sm:text-[10px] text-amber-300/90 font-medium">
                  <span>Enquire Now</span>
                  <span className="group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Why Choose Sri Caterers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-10 border border-stone-200 shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
            <div className="lg:col-span-6 space-y-4 sm:space-y-6">
              <Badge variant="maroon" size="sm">
                Why Choose Us
              </Badge>
              <h2 className="font-serif text-xl sm:text-3xl font-extrabold text-maroon-950">
                Purity, Punctuality &amp; Tamil Hospitality
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                We treat every event as our own family function. Our recipes have been perfected through years of catering experience in Chennai, using pure ghee, freshly ground masalas, and pristine water.
              </p>

              <div className="space-y-3">
                <div className="flex items-start space-x-2.5">
                  <div className="w-7 h-7 rounded-lg bg-leaf-100 text-leaf-800 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-charcoal">
                      Hygienic Preparation &amp; Pure Ingredients
                    </h4>
                    <p className="text-[11px] sm:text-xs text-stone-500 mt-0.5">
                      Cold-pressed oils, pure cow ghee, and stringent vegetable inspection.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-2.5">
                  <div className="w-7 h-7 rounded-lg bg-turmeric-100 text-turmeric-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-charcoal">
                      On-Time Service Guarantee
                    </h4>
                    <p className="text-[11px] sm:text-xs text-stone-500 mt-0.5">
                      Food is served hot exactly at the auspicious muhurtham or planned dining schedule.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-2.5">
                  <div className="w-7 h-7 rounded-lg bg-maroon-100 text-maroon-800 flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-charcoal">
                      Professional Service Boys &amp; Cleaning
                    </h4>
                    <p className="text-[11px] sm:text-xs text-stone-500 mt-0.5">
                      Uniformed staff to serve leaves, refill dishes, and clear dining halls cleanly.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 mt-4 lg:mt-0">
              <div className="rounded-xl sm:rounded-2xl overflow-hidden border border-stone-200 shadow-sm max-w-sm sm:max-w-md mx-auto">
                <img
                  src={MEDIA_ASSETS.images[2].src}
                  alt="Sri Caterers Promise and Highlights"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Frequently Asked Questions (with Google FAQPage Rich Snippet) */}
      <FAQSection />

      {/* 9. Final Enquiry CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-r from-maroon-900 via-maroon-950 to-stone-900 text-white p-6 sm:p-10 border border-gold/40 shadow-xl">
          <div className="relative z-10 max-w-3xl space-y-3 sm:space-y-4">
            <span className="text-[10px] sm:text-xs font-bold text-amber-300 uppercase tracking-widest">
              Book Your Date in Advance
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-black text-white leading-tight">
              Planning a Wedding or Celebration in Chennai?
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Get an instant quotation tailored to your guest count, meal styles, and date. Speak directly with{' '}
              <strong className="text-amber-300">{siteConfig.proprietor}</strong>.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                to="/enquiry"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-xs sm:text-sm font-bold text-maroon-950 bg-gradient-to-r from-amber-300 via-gold to-turmeric-400 hover:from-amber-400 hover:to-turmeric-500 shadow-lg transition-all"
              >
                <CalendarCheck className="w-4 h-4 mr-2 text-maroon-950" />
                <span>Submit Event Enquiry</span>
              </Link>

              <a
                href={`tel:${siteConfig.rawPhone}`}
                className="inline-flex items-center justify-center px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold text-white border border-stone-600 hover:border-gold hover:bg-white/5 transition-all"
              >
                <Phone className="w-4 h-4 mr-2 text-gold" />
                <span>Call {siteConfig.displayPhone}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Expanded Media Modal / Lightbox */}
      {activeVideoModal && (
        <Modal
          isOpen={Boolean(activeVideoModal)}
          onClose={() => setActiveVideoModal(null)}
          title={activeVideoModal.title}
          maxWidth="lg"
        >
          <div className="space-y-4">
            <div className="relative aspect-[9/16] bg-black rounded-2xl overflow-hidden max-h-[75vh] mx-auto">
              <video
                src={activeVideoModal.src}
                className="w-full h-full object-contain"
                controls
                autoPlay
                playsInline
              />
            </div>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {activeVideoModal.description}
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {activeVideoModal.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] px-2.5 py-1 rounded-md bg-stone-100 text-stone-700 font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
