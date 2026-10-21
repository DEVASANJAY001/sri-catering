import React, { useState, useRef, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Utensils,
  Search,
  Sparkles,
  Leaf,
  Drumstick,
  Eye,
  Info,
  CalendarCheck,
  Download,
  ChevronLeft,
  ChevronRight,
  Grid as GridIcon,
  List as ListIcon,
  Columns,
  Layers,
  ArrowRight,
  Filter,
  FileText,
  Check,
  CheckCircle2,
  Calendar,
  X,
  ExternalLink,
} from 'lucide-react';
import {
  MENU_CATEGORIES,
  MENU_ITEMS,
  MENU_PACKAGES,
} from '../../data/menu';
import { MenuPackage, MenuItem } from '../../types/menu';
import { MEDIA_ASSETS } from '../../config/assets';
import { KolamDivider } from '../../components/common/KolamDivider';
import { Badge } from '../../components/common/Badge';
import { MenuPackageCard } from '../../components/cards/MenuCard';
import { Modal } from '../../components/common/Modal';
import { SEO } from '../../components/common/SEO';

export const MenuPage: React.FC = () => {
  // Navigation & View Mode
  const [packageViewMode, setPackageViewMode] = useState<'carousel' | 'grid'>('carousel');
  const [selectedPackageCategory, setSelectedPackageCategory] = useState<string>('All');
  const [dishViewMode, setDishViewMode] = useState<'list' | 'card'>('list');

  // Dish filtering state
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dietFilter, setDietFilter] = useState<'all' | 'veg' | 'non-veg'>('all');
  const [servingFilter, setServingFilter] = useState<'all' | 'banana-leaf' | 'live-stall' | 'buffet'>('all');

  // Modals state
  const [previewImage, setPreviewImage] = useState<{ src: string; title: string } | null>(null);
  const [selectedPackageDetails, setSelectedPackageDetails] = useState<MenuPackage | null>(null);

  // URL search params for deep linking from Home Page or external links
  const [searchParams, setSearchParams] = useSearchParams();
  const packageParam = searchParams.get('package');

  // Sync package query parameter with selectedPackageDetails modal
  useEffect(() => {
    if (packageParam) {
      const targetId = packageParam.trim().toLowerCase();
      const matched = MENU_PACKAGES.find(
        (p) =>
          p.id.toLowerCase() === targetId ||
          p.name.toLowerCase() === targetId ||
          p.name.toLowerCase().includes(targetId)
      );
      if (matched) {
        setSelectedPackageDetails(matched);
        setSelectedPackageCategory('All');
        setTimeout(() => {
          const el = document.getElementById('packages-section');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 150);
      }
    }
  }, [packageParam]);

  const handleOpenPackageDetails = (pkg: MenuPackage) => {
    setSelectedPackageDetails(pkg);
    setSearchParams({ package: pkg.id }, { replace: true });
  };

  const handleClosePackageDetails = () => {
    setSelectedPackageDetails(null);
    if (searchParams.get('package')) {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete('package');
      setSearchParams(nextParams, { replace: true });
    }
  };

  // Carousel Scroll State & Refs
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isCarouselScrolling, setIsCarouselScrolling] = useState(false);

  // Package categories
  const packageCategories = [
    { id: 'All', label: 'All Packages', count: MENU_PACKAGES.length },
    { id: 'tariff-card', label: 'Per-Plate & Tariffs', count: MENU_PACKAGES.filter(p => p.category === 'tariff-card').length },
    { id: 'leaf-meal', label: 'Feasts & Baby Shower', count: MENU_PACKAGES.filter(p => p.category === 'leaf-meal').length },
    { id: 'wedding-grand', label: 'Grand Weddings', count: MENU_PACKAGES.filter(p => p.category === 'wedding-grand').length },
    { id: 'event-management', label: 'Full Event Management', count: MENU_PACKAGES.filter(p => p.category === 'event-management').length },
  ];

  // Filtered packages
  const filteredPackages = MENU_PACKAGES.filter((pkg) => {
    if (selectedPackageCategory === 'All') return true;
    return pkg.category === selectedPackageCategory;
  });

  const checkCarouselScroll = () => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkCarouselScroll();
    window.addEventListener('resize', checkCarouselScroll);
    return () => window.removeEventListener('resize', checkCarouselScroll);
  }, [filteredPackages]);

  const handleCarouselScroll = () => {
    setIsCarouselScrolling(true);
    checkCarouselScroll();
  };

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const scrollAmount = carouselRef.current.clientWidth * 0.75;
    carouselRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Dish filtering
  const filteredItems = MENU_ITEMS.filter((item) => {
    if (activeCategory !== 'All' && item.category !== activeCategory) {
      return false;
    }
    if (dietFilter === 'veg' && !item.isVegetarian) return false;
    if (dietFilter === 'non-veg' && item.isVegetarian) return false;
    if (servingFilter !== 'all' && item.servingNorm !== servingFilter) return false;

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      const matchName = item.name.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchTamil = item.tamilName ? item.tamilName.includes(q) : false;
      return matchName || matchDesc || matchTamil;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-12 sm:space-y-16">
      <SEO
        title="Catering Menu & Published Tariff Packages (₹149 to ₹299 / Plate) | Sri Caterers Chennai"
        description="Browse Sri Caterers complete catering menus and published tariffs. ₹149 Chicken Biryani, ₹269 Mutton Biryani, ₹299 Royal 39-item dinner, ₹160 Muhurtham tiffin, Seemantham baby shower feasts and live stalls."
        keywords="catering menu Chennai, biryani leaf price Chennai, 149 leaf catering Chennai, mutton biryani 269 leaf, marriage menu list Tamil, breakfast catering menu Chennai, Seemantham menu Chennai, baby shower catering"
        canonicalPath="/menu"
      />

      {/* 1. Page Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="maroon" size="md">
          Tamil Nadu Culinary Showcase
        </Badge>
        <h1 className="font-serif text-3xl sm:text-5xl font-black text-maroon-950">
          Our Traditional Catering Menus &amp; Feasts
        </h1>
        <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
          Inspired by authentic Tamil recipes, fragrant Seeraga Samba biryanis, plantain-leaf wedding spreads, and interactive live snack counters.
        </p>

        {/* Quick Section Anchor Pills */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => scrollToSection('packages-section')}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white text-stone-700 hover:text-maroon-900 hover:bg-stone-50 border border-stone-200 shadow-2xs transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-maroon-800" />
            <span>Published Packages ({MENU_PACKAGES.length})</span>
          </button>

          <button
            onClick={() => scrollToSection('dishes-section')}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white text-stone-700 hover:text-maroon-900 hover:bg-stone-50 border border-stone-200 shadow-2xs transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <Utensils className="w-3.5 h-3.5 text-leaf-700" />
            <span>Dish-by-Dish Directory ({MENU_ITEMS.length})</span>
          </button>

          <button
            onClick={() =>
              setPreviewImage({
                src: MEDIA_ASSETS.images[1].src,
                title: 'Official Sri Caterers 4-Tier Tariff Card (Breakfast, Lunch, Dinner, Snack)',
              })
            }
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200 shadow-2xs transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-amber-700" />
            <span>Official Tariff Card</span>
          </button>
        </div>

        {/* Illustrative Notice Disclaimer */}
        <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/90 text-stone-700 text-xs flex items-start space-x-2 text-left max-w-2xl mx-auto shadow-2xs">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p>
            <strong>Menu Transparency Note:</strong> All packages below represent our genuine, published event tariffs and verified menu cards. Each menu can be tailored for your exact guest count, dietary preferences, and event date during consultation.
          </p>
        </div>

        <KolamDivider theme="gold" />
      </div>

      {/* 2. Official Menu Packages Showcase */}
      <section id="packages-section" className="space-y-6 scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-gold-dark uppercase tracking-wider">
                Published Event Tariffs
              </span>
              <span className="bg-stone-100 text-stone-600 text-[11px] font-bold px-2 py-0.5 rounded-full">
                {filteredPackages.length} Packages Available
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-maroon-950 mt-1">
              Complete Catering Packages &amp; Combos
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Click <strong>&quot;See Details&quot;</strong> on any card to view the complete menu inclusions and official flyer.
            </p>
          </div>

          {/* Right Header Controls: Carousel vs Grid Toggle & Navigation Arrows */}
          <div className="flex items-center space-x-3 self-start md:self-auto">
            {/* View Mode Toggle */}
            <div className="bg-stone-100 p-1 rounded-xl border border-stone-200 inline-flex items-center">
              <button
                type="button"
                onClick={() => setPackageViewMode('carousel')}
                aria-label="Carousel scroll view"
                className={`p-1.5 rounded-lg text-xs font-bold flex items-center space-x-1 transition-all cursor-pointer ${
                  packageViewMode === 'carousel'
                    ? 'bg-white text-maroon-900 shadow-2xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
                title="Scrollable Carousel View"
              >
                <Columns className="w-4 h-4" />
                <span className="hidden sm:inline">Carousel</span>
              </button>
              <button
                type="button"
                onClick={() => setPackageViewMode('grid')}
                aria-label="Grid view"
                className={`p-1.5 rounded-lg text-xs font-bold flex items-center space-x-1 transition-all cursor-pointer ${
                  packageViewMode === 'grid'
                    ? 'bg-white text-maroon-900 shadow-2xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
                title="Grid Layout View"
              >
                <GridIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Grid</span>
              </button>
            </div>

            {/* Carousel Arrow Controls (Visible in Carousel View) */}
            {packageViewMode === 'carousel' && (
              <div className="flex items-center space-x-1.5">
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
            )}
          </div>
        </div>

        {/* Package Category Filter Pills */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 scrollbar-none">
          {packageCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedPackageCategory(cat.id)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                selectedPackageCategory === cat.id
                  ? 'bg-maroon-800 text-white shadow-sm'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              <span>{cat.label}</span>
              <span className={`ml-1.5 text-[10px] px-1.5 py-0.2 rounded-full ${
                selectedPackageCategory === cat.id ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-500'
              }`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* Mode A: Horizontal Right-to-Left Scrollable Carousel */}
        {packageViewMode === 'carousel' && (
          <div className="relative mt-2">
            {/* Left Edge: Soft Vignette Fade */}
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute -left-1 sm:left-0 inset-y-0 w-8 sm:w-16 bg-gradient-to-r from-stone-50 via-stone-50/70 to-transparent z-10 transition-opacity duration-300 ease-out ${
                isCarouselScrolling && canScrollLeft ? 'opacity-100' : 'opacity-0'
              }`}
            />

            {/* Right Edge: Soft Vignette Fade */}
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute -right-1 sm:right-0 inset-y-0 w-8 sm:w-16 bg-gradient-to-l from-stone-50 via-stone-50/70 to-transparent z-10 transition-opacity duration-300 ease-out ${
                isCarouselScrolling && canScrollRight ? 'opacity-100' : 'opacity-0'
              }`}
            />

            <div
              ref={carouselRef}
              onScroll={handleCarouselScroll}
              className="flex overflow-x-auto snap-x snap-mandatory space-x-4 sm:space-x-6 pb-4 pt-1 px-1 sm:px-2 scroll-smooth items-stretch"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {filteredPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="w-[calc(88vw-32px)] sm:w-[320px] lg:w-[350px] shrink-0 snap-start flex-none flex flex-col"
                >
                  <MenuPackageCard
                    pkg={pkg}
                    isTargeted={packageParam?.toLowerCase() === pkg.id.toLowerCase()}
                    onPreviewImage={(src, title) => setPreviewImage({ src, title })}
                    onViewDetails={handleOpenPackageDetails}
                  />
                </div>
              ))}
            </div>

            {/* Mobile Swipe Hint */}
            <div className="flex items-center justify-between mt-1 px-1 text-[11px] text-stone-500 sm:hidden">
              <span>Swipe left to view all {filteredPackages.length} packages</span>
              <span className="text-maroon-800 font-bold flex items-center">
                Scroll &rarr;
              </span>
            </div>
          </div>
        )}

        {/* Mode B: Full Responsive Grid with Balanced Alignment */}
        {packageViewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn items-stretch">
            {filteredPackages.map((pkg) => (
              <div key={pkg.id} className="flex flex-col h-full">
                <MenuPackageCard
                  pkg={pkg}
                  isTargeted={packageParam?.toLowerCase() === pkg.id.toLowerCase()}
                  onPreviewImage={(src, title) => setPreviewImage({ src, title })}
                  onViewDetails={handleOpenPackageDetails}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 3. Detailed Menu Items Section with Simple Scannable Listing */}
      <section id="dishes-section" className="space-y-6 pt-8 border-t border-stone-200 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200 pb-4">
          <div>
            <Badge variant="maroon" size="sm">
              Item-by-Item Menu
            </Badge>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-maroon-950 mt-1">
              Dish by Dish Showcase
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Browse through our authentic dishes for your customized event menu selection.
            </p>
          </div>

          {/* List vs Card View Mode Toggle */}
          <div className="bg-stone-100 p-1 rounded-xl border border-stone-200 inline-flex items-center self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setDishViewMode('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                dishViewMode === 'list'
                  ? 'bg-white text-maroon-900 shadow-2xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
              title="Clean Simple List View"
            >
              <ListIcon className="w-3.5 h-3.5 text-maroon-800" />
              <span>Simple List</span>
            </button>
            <button
              type="button"
              onClick={() => setDishViewMode('card')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                dishViewMode === 'card'
                  ? 'bg-white text-maroon-900 shadow-2xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
              title="Card Grid View"
            >
              <GridIcon className="w-3.5 h-3.5" />
              <span>Cards</span>
            </button>
          </div>
        </div>

        {/* Search & Dietary Bar */}
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full lg:w-96">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes (e.g. Biryani, Halwa, Idiyappam, Jigarthanda)..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-maroon-800 focus:border-maroon-800 transition-all"
            />
          </div>

          {/* Filters: Dietary & Serving Style */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-start lg:justify-end">
            {/* Diet Toggle */}
            <div className="flex items-center space-x-1 bg-stone-50 p-1 rounded-xl border border-stone-200">
              <span className="text-[11px] font-semibold text-stone-500 ml-1 mr-0.5">Diet:</span>
              <button
                onClick={() => setDietFilter('all')}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  dietFilter === 'all'
                    ? 'bg-stone-900 text-white shadow-2xs'
                    : 'text-stone-600 hover:bg-stone-200/70'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setDietFilter('veg')}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition-all flex items-center cursor-pointer ${
                  dietFilter === 'veg'
                    ? 'bg-leaf-700 text-white shadow-2xs'
                    : 'text-leaf-800 hover:bg-leaf-100'
                }`}
              >
                <Leaf className="w-3 h-3 mr-1 text-leaf-300" />
                Pure Veg
              </button>
              <button
                onClick={() => setDietFilter('non-veg')}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition-all flex items-center cursor-pointer ${
                  dietFilter === 'non-veg'
                    ? 'bg-maroon-800 text-white shadow-2xs'
                    : 'text-maroon-800 hover:bg-maroon-100'
                }`}
              >
                <Drumstick className="w-3 h-3 mr-1" />
                Non-Veg
              </button>
            </div>

            {/* Serving Style Filter */}
            <div className="flex items-center space-x-1 bg-stone-50 p-1 rounded-xl border border-stone-200">
              <span className="text-[11px] font-semibold text-stone-500 ml-1 mr-0.5">Style:</span>
              <button
                onClick={() => setServingFilter('all')}
                className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  servingFilter === 'all'
                    ? 'bg-maroon-800 text-white shadow-2xs'
                    : 'text-stone-600 hover:bg-stone-200/70'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setServingFilter('banana-leaf')}
                className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  servingFilter === 'banana-leaf'
                    ? 'bg-maroon-800 text-white shadow-2xs'
                    : 'text-stone-600 hover:bg-stone-200/70'
                }`}
              >
                Leaf
              </button>
              <button
                onClick={() => setServingFilter('live-stall')}
                className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  servingFilter === 'live-stall'
                    ? 'bg-maroon-800 text-white shadow-2xs'
                    : 'text-stone-600 hover:bg-stone-200/70'
                }`}
              >
                Live Stall
              </button>
              <button
                onClick={() => setServingFilter('buffet')}
                className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  servingFilter === 'buffet'
                    ? 'bg-maroon-800 text-white shadow-2xs'
                    : 'text-stone-600 hover:bg-stone-200/70'
                }`}
              >
                Buffet
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter Pills (Smooth horizontal scrollable with counts) */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none">
          {MENU_CATEGORIES.map((cat) => {
            const count =
              cat === 'All'
                ? MENU_ITEMS.length
                : MENU_ITEMS.filter((item) => item.category === cat).length;

            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-maroon-800 text-white shadow-sm'
                    : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                <span>{cat}</span>
                <span className={`ml-1.5 text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeCategory === cat ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ==================================================== */}
        {/* MODE 1: PROPER SIMPLE LISTING (User Preferred)       */}
        {/* ==================================================== */}
        {dishViewMode === 'list' && (
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs overflow-hidden divide-y divide-stone-100 animate-fadeIn">
            {/* Table-Like Header for Desktop */}
            <div className="hidden md:grid grid-cols-12 px-5 py-3 bg-stone-50/90 text-[11px] font-bold text-stone-500 uppercase tracking-wider border-b border-stone-200">
              <span className="col-span-5">Dish Name &amp; Description</span>
              <span className="col-span-3">Category</span>
              <span className="col-span-2">Serving Style</span>
              <span className="col-span-2 text-right">Highlights</span>
            </div>

            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="p-3.5 sm:px-5 sm:py-3.5 hover:bg-amber-50/40 transition-colors flex flex-col md:grid md:grid-cols-12 md:items-center gap-2 md:gap-4"
              >
                {/* Column 1: Diet Indicator + Name + Tamil Name + Description */}
                <div className="md:col-span-5 flex items-start space-x-2.5">
                  {/* Veg / Non-Veg Indicator Icon */}
                  <div className="shrink-0 mt-0.5">
                    {item.isVegetarian ? (
                      <span
                        className="w-4 h-4 rounded-xs border-2 border-leaf-600 p-0.5 flex items-center justify-center"
                        title="Pure Vegetarian"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-leaf-600" />
                      </span>
                    ) : (
                      <span
                        className="w-4 h-4 rounded-xs border-2 border-maroon-700 p-0.5 flex items-center justify-center"
                        title="Non-Vegetarian"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-maroon-700" />
                      </span>
                    )}
                  </div>

                  <div className="space-y-0.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-baseline gap-1.5">
                      <h3 className="font-bold text-sm text-stone-900 font-serif">
                        {item.name}
                      </h3>
                      {item.tamilName && (
                        <span className="font-tamil text-xs text-gold-dark font-medium">
                          ({item.tamilName})
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-500 line-clamp-1 leading-snug">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Column 2: Category Badge */}
                <div className="md:col-span-3 flex items-center">
                  <span className="text-[11px] font-medium text-stone-700 bg-stone-100 px-2.5 py-1 rounded-lg">
                    {item.category}
                  </span>
                </div>

                {/* Column 3: Serving Style Tag */}
                <div className="md:col-span-2 flex items-center">
                  <span className="text-[11px] font-semibold text-maroon-900 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-md">
                    {item.servingNorm === 'banana-leaf'
                      ? 'Banana Leaf'
                      : item.servingNorm === 'live-stall'
                      ? 'Live Counter'
                      : item.servingNorm === 'buffet'
                      ? 'Buffet'
                      : 'Traditional'}
                  </span>
                </div>

                {/* Column 4: Highlights / Badges */}
                <div className="md:col-span-2 flex items-center md:justify-end space-x-1.5">
                  {item.isPopular && (
                    <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300/60">
                      <Sparkles className="w-2.5 h-2.5 mr-1 text-amber-600" />
                      Popular
                    </span>
                  )}
                  {item.isChefSpecial && (
                    <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-maroon-100 text-maroon-900 border border-maroon-300/60">
                      Chef Special
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ==================================================== */}
        {/* MODE 2: CARD GRID VIEW                               */}
        {/* ==================================================== */}
        {dishViewMode === 'card' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6 animate-fadeIn">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between h-full group"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      {item.tamilName && (
                        <span className="font-tamil text-xs text-stone-500 font-medium block">
                          {item.tamilName}
                        </span>
                      )}
                      <h3 className="font-serif font-bold text-sm sm:text-base text-charcoal leading-snug group-hover:text-maroon-900 transition-colors">
                        {item.name}
                      </h3>
                    </div>

                    {item.isVegetarian ? (
                      <span
                        className="w-4 h-4 rounded-xs border-2 border-leaf-600 p-0.5 flex items-center justify-center shrink-0 mt-1"
                        title="Pure Vegetarian"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-leaf-600" />
                      </span>
                    ) : (
                      <span
                        className="w-4 h-4 rounded-xs border-2 border-maroon-700 p-0.5 flex items-center justify-center shrink-0 mt-1"
                        title="Non-Vegetarian"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-maroon-700" />
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between gap-1">
                  <span className="text-[10px] sm:text-[11px] font-medium text-stone-600 bg-stone-100 px-2 py-0.5 rounded truncate max-w-[130px]">
                    {item.category}
                  </span>

                  <div className="flex items-center space-x-1 shrink-0">
                    {item.isPopular && (
                      <Badge variant="turmeric" size="sm">
                        <Sparkles className="w-2.5 h-2.5 mr-0.5 inline" />
                        Popular
                      </Badge>
                    )}
                    {item.isChefSpecial && (
                      <Badge variant="maroon" size="sm">
                        Chef Special
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredItems.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
            <Utensils className="w-10 h-10 text-stone-400 mx-auto mb-2" />
            <h3 className="text-base font-bold text-charcoal">No Dishes Found</h3>
            <p className="text-xs text-stone-500 mt-1">
              Try adjusting your search query or selecting a different dietary filter.
            </p>
          </div>
        )}
      </section>

      {/* 4. Bottom Menu Consultation CTA */}
      <section id="custom-quote" className="bg-maroon-950 text-white rounded-3xl p-8 sm:p-12 text-center border border-gold/40 shadow-xl space-y-4">
        <Badge variant="turmeric" size="sm">
          Tailored Hospitality
        </Badge>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold">
          Want a Custom Menu Tailored for Your Guests?
        </h2>
        <p className="text-xs sm:text-sm text-stone-300 max-w-2xl mx-auto leading-relaxed">
          We curate custom menus blending South Indian, North Indian, and Live Street food counters suited for all ages.
        </p>
        <div className="pt-2">
          <Link
            to="/enquiry"
            className="inline-flex items-center px-8 py-3.5 rounded-xl font-bold text-sm sm:text-base text-maroon-950 bg-gradient-to-r from-amber-300 via-gold to-turmeric-400 hover:from-amber-400 hover:to-turmeric-500 shadow-lg transition-all"
          >
            <CalendarCheck className="w-4 h-4 mr-2 text-maroon-950" />
            <span>Request Custom Menu Quotation</span>
          </Link>
        </div>
      </section>

      {/* MODAL 1: Comprehensive Package Details Modal (Triggered by "See Details") */}
      {selectedPackageDetails && (
        <Modal
          isOpen={Boolean(selectedPackageDetails)}
          onClose={handleClosePackageDetails}
          title={selectedPackageDetails.name}
          maxWidth="4xl"
        >
          <div className="space-y-6">
            {/* Header info */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 pb-3">
              <div>
                {selectedPackageDetails.tamilName && (
                  <span className="font-tamil text-sm text-gold-dark font-medium block">
                    {selectedPackageDetails.tamilName}
                  </span>
                )}
                <span className="text-xs font-semibold text-stone-500">
                  {selectedPackageDetails.highlight}
                </span>
              </div>
              <span className="px-3 py-1 rounded-xl bg-gold-dark text-stone-900 font-extrabold text-sm shadow-sm">
                {selectedPackageDetails.priceTag}
              </span>
            </div>

            {/* Split Content: Flyer Preview on Left, Inclusions on Right */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Official Menu Card / Flyer */}
              <div className="space-y-3">
                <div
                  className="rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 relative group cursor-pointer shadow-xs max-h-[380px] flex items-center justify-center"
                  onClick={() =>
                    setPreviewImage({
                      src: selectedPackageDetails.flyerImageSrc || selectedPackageDetails.imageSrc,
                      title: selectedPackageDetails.name,
                    })
                  }
                >
                  <img
                    src={selectedPackageDetails.flyerImageSrc || selectedPackageDetails.imageSrc}
                    alt={selectedPackageDetails.name}
                    className="w-full h-auto object-contain max-h-[380px] group-hover:scale-102 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5">
                    <Eye className="w-4 h-4" />
                    <span>Click to Zoom Flyer</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span>Official Published Menu Flyer</span>
                  <button
                    type="button"
                    onClick={() =>
                      setPreviewImage({
                        src: selectedPackageDetails.flyerImageSrc || selectedPackageDetails.imageSrc,
                        title: selectedPackageDetails.name,
                      })
                    }
                    className="text-maroon-800 hover:underline font-semibold flex items-center"
                  >
                    <Eye className="w-3.5 h-3.5 mr-1" />
                    View Fullscreen
                  </button>
                </div>
              </div>

              {/* Right Column: Inclusions & Details */}
              <div className="space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                    <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-1">
                      Package Overview:
                    </h4>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {selectedPackageDetails.description}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-maroon-900 uppercase tracking-wider mb-2 flex items-center justify-between">
                      <span>Complete Inclusions ({selectedPackageDetails.features.length} Items):</span>
                      <span className="text-[10px] text-leaf-700 font-semibold flex items-center">
                        <CheckCircle2 className="w-3 h-3 mr-0.5 inline" />
                        All Included
                      </span>
                    </h4>

                    <div className="max-h-[220px] overflow-y-auto pr-2 space-y-2 border border-stone-100 rounded-xl p-2 bg-white scrollbar-thin">
                      {selectedPackageDetails.features.map((feature, idx) => (
                        <div
                          key={idx}
                          className="flex items-start text-xs text-stone-700 bg-stone-50/70 p-2 rounded-lg border border-stone-200/50"
                        >
                          <Check className="w-3.5 h-3.5 text-leaf-700 mr-2 shrink-0 mt-0.5" />
                          <span className="leading-snug">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Modal Action CTA */}
                <div className="pt-3 border-t border-stone-200 flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleClosePackageDetails}
                    className="px-4 py-2.5 rounded-xl border border-stone-300 text-xs font-bold text-stone-700 hover:bg-stone-100 transition-colors"
                  >
                    Close
                  </button>
                  <Link
                    to={`/enquiry?service=${encodeURIComponent(selectedPackageDetails.name)}`}
                    className="px-5 py-2.5 rounded-xl bg-maroon-800 hover:bg-maroon-900 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md transition-all"
                  >
                    <Calendar className="w-3.5 h-3.5 text-gold mr-1" />
                    <span>Book / Enquire for this Package</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL 2: Image Preview Modal for Menu Flyers */}
      {previewImage && (
        <Modal
          isOpen={Boolean(previewImage)}
          onClose={() => setPreviewImage(null)}
          title={previewImage.title}
          maxWidth="2xl"
        >
          <div className="space-y-4">
            <div className="rounded-xl overflow-hidden border border-stone-200 bg-stone-100 flex items-center justify-center max-h-[70vh]">
              <img
                src={previewImage.src}
                alt={previewImage.title}
                className="w-full h-auto object-contain max-h-[70vh]"
              />
            </div>
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span>Official Sri Caterers Menu Flyer</span>
              <a
                href={previewImage.src}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-maroon-800 hover:underline font-semibold"
              >
                <Download className="w-3.5 h-3.5 mr-1" />
                Open Full Resolution
              </a>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

