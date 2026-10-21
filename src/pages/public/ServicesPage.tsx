import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Utensils,
  Layers,
  Search,
  Sparkles,
  Leaf,
  Drumstick,
  CheckCircle2,
  CalendarCheck,
  Eye,
  Grid,
} from 'lucide-react';
import { CATERING_SERVICES } from '../../data/services';
import { MENU_PACKAGES, MENU_ITEMS, MENU_CATEGORIES } from '../../data/menu';
import { ServiceCard } from '../../components/cards/ServiceCard';
import { MenuPackageCard } from '../../components/cards/MenuCard';
import { KolamDivider } from '../../components/common/KolamDivider';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { SEO } from '../../components/common/SEO';

export const ServicesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') === 'all-menus' ? 'all-menus' : 'services';

  // State for Services Tab
  const [selectedServiceCategory, setSelectedServiceCategory] = useState<string>('All');
  const serviceCategories = ['All', 'Weddings & Halls', 'Family & Traditional', 'Corporate', 'Bulk & Stalls'];

  // State for All Items & Menus Tab
  const [activeGroup, setActiveGroup] = useState<string>('All');
  const [selectedDietNorm, setSelectedDietNorm] = useState<'all' | 'pure-veg' | 'halal-non-veg'>('all');
  const [selectedServingNorm, setSelectedServingNorm] = useState<'all' | 'banana-leaf' | 'live-stall' | 'buffet'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [previewFlyer, setPreviewFlyer] = useState<{ src: string; title: string } | null>(null);

  const setTab = (tab: 'services' | 'all-menus') => {
    if (tab === 'all-menus') {
      setSearchParams({ tab: 'all-menus' });
    } else {
      setSearchParams({});
    }
  };

  // Filter Services
  const filteredServices = CATERING_SERVICES.filter((service) => {
    if (selectedServiceCategory === 'All') return true;
    if (selectedServiceCategory === 'Weddings & Halls') {
      return (
        service.slug.includes('wedding') ||
        service.slug.includes('hall') ||
        service.slug.includes('engagement')
      );
    }
    if (selectedServiceCategory === 'Family & Traditional') {
      return (
        service.slug.includes('family') ||
        service.slug.includes('housewarming') ||
        service.slug.includes('temple') ||
        service.slug.includes('birthday') ||
        service.slug.includes('festival')
      );
    }
    if (selectedServiceCategory === 'Corporate') {
      return service.slug.includes('corporate');
    }
    if (selectedServiceCategory === 'Bulk & Stalls') {
      return service.slug.includes('bulk');
    }
    return true;
  });

  // Filter Menu Items (By Group and By Norm)
  const filteredMenuItems = MENU_ITEMS.filter((item) => {
    // 1. Filter by Group (Category)
    if (activeGroup !== 'All' && item.category !== activeGroup) {
      return false;
    }

    // 2. Filter by Dietary Norm
    if (selectedDietNorm === 'pure-veg' && !item.isVegetarian) {
      return false;
    }
    if (selectedDietNorm === 'halal-non-veg' && item.isVegetarian) {
      return false;
    }

    // 3. Filter by Serving Norm
    if (selectedServingNorm !== 'all' && item.servingNorm !== selectedServingNorm) {
      return false;
    }

    // 4. Search query
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      <SEO
        title="Catering Services & All Available Menus by Group & Norm | Sri Caterers Chennai"
        description="Browse all catering services and comprehensive menus. Explore items by group (Welcome drinks, Biryani, Veg meals, Tiffins) and by norm (Pure Veg, Halal Non-Veg, Banana Leaf, Live Stalls)."
        keywords="catering services Chennai, Tamil catering menu list, pure veg catering Chennai, halal biryani Chennai, banana leaf catering menu, live stalls catering Chennai"
        canonicalPath="/services"
      />

      {/* 1. Page Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="maroon" size="md">
          Our Services
        </Badge>
        <h1 className="font-serif text-3xl sm:text-5xl font-black text-maroon-950">
          Expertly Crafted Services for Memorable Events
        </h1>
        <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
          SRI Wedding Caterers, we offer a complete range of wedding and event services designed to make your special day truly unforgettable.
        </p>
        <KolamDivider theme="gold" />
      </div>

      {/* 2. Main High-Level Navigation: Services vs All Items & Menus */}
      <div className="flex justify-center">
        <div className="bg-stone-100 p-1.5 rounded-2xl border border-stone-200 inline-flex flex-col sm:flex-row gap-1 shadow-inner max-w-full">
          <button
            type="button"
            onClick={() => setTab('services')}
            className={`px-5 py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center transition-all ${
              currentTab === 'services'
                ? 'bg-maroon-800 text-white shadow-md'
                : 'text-stone-700 hover:text-maroon-900 hover:bg-white/60'
            }`}
          >
            <Grid className="w-4 h-4 mr-2" />
            <span>Catering Services ({CATERING_SERVICES.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setTab('all-menus')}
            className={`px-5 py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center transition-all ${
              currentTab === 'all-menus'
                ? 'bg-maroon-800 text-white shadow-md'
                : 'text-stone-700 hover:text-maroon-900 hover:bg-white/60'
            }`}
          >
            <Utensils className="w-4 h-4 mr-2 text-gold" />
            <span>View All Items &amp; Menus Available (By Group &amp; Norm)</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: CATERING SERVICES                                  */}
      {/* ========================================================= */}
      {currentTab === 'services' && (
        <section className="space-y-8 animate-fadeIn">
          {/* Service Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {serviceCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedServiceCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  selectedServiceCategory === cat
                    ? 'bg-maroon-800 text-white shadow-md'
                    : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Services Grid (2 Columns on mobile) */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6">
            {filteredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>

          {/* Bottom Callout to explore All Menu Items */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-maroon-900 via-maroon-950 to-stone-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl border border-gold/30">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="font-serif text-lg sm:text-xl font-bold text-amber-200">
                Want to explore the complete dish-by-dish menu list?
              </h3>
              <p className="text-xs sm:text-sm text-stone-300">
                View all items classified by culinary group (Live Stalls, Biryani, Veg Meals) and dietary norm.
              </p>
            </div>
            <button
              onClick={() => setTab('all-menus')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-300 via-gold to-turmeric-400 text-maroon-950 font-bold text-xs sm:text-sm shadow-md hover:opacity-95 transition-all shrink-0"
            >
              Browse All Items by Group &amp; Norm
            </button>
          </div>
        </section>
      )}

      {/* ========================================================= */}
      {/* TAB 2: VIEW ALL ITEMS OR MENUS (BY GROUP & BY NORM)       */}
      {/* ========================================================= */}
      {currentTab === 'all-menus' && (
        <section className="space-y-12 animate-fadeIn">
          {/* Section A: Published Event Tariff Packages */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-stone-200 pb-3">
              <div>
                <Badge variant="turmeric" size="sm">
                  Official Published Tariffs
                </Badge>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-maroon-950 mt-1">
                  Popular Catering Packages
                </h2>
                <p className="text-xs sm:text-sm text-stone-600">
                  Carefully structured from ₹149/leaf up to full ₹1.98 Lakh mega wedding event packages.
                </p>
              </div>

              <span className="text-xs text-stone-500 font-medium">
                {MENU_PACKAGES.length} Complete Packages
              </span>
            </div>

            {/* Packages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {MENU_PACKAGES.map((pkg) => (
                <MenuPackageCard
                  key={pkg.id}
                  pkg={pkg}
                  onPreviewImage={(src, title) => setPreviewFlyer({ src, title })}
                />
              ))}
            </div>
          </div>

          {/* Section B: All Menu Items Directory - Filter by Group & by Norm */}
          <div className="space-y-8 pt-6 border-t border-stone-200">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <Badge variant="maroon" size="sm">
                Item-by-Item Directory
              </Badge>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-maroon-950">
                Explore All Available Dishes
              </h2>
              <p className="text-xs sm:text-sm text-stone-600">
                Organized by culinary group and standardized by dietary and serving norms.
              </p>
            </div>

            {/* Comprehensive Filter Console: Search, Dietary Norm & Serving Norm */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-5">
              {/* Row 1: Search & Dietary Norm */}
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
                {/* Search Bar */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search dishes by English or Tamil name (e.g., Biryani, Halwa, இட்லி)..."
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-maroon-800 focus:border-maroon-800"
                  />
                </div>

                {/* Dietary Norm Filter (By Norm) */}
                <div className="flex items-center space-x-2 shrink-0">
                  <span className="text-xs font-bold text-stone-700">Dietary Norm:</span>
                  <div className="inline-flex rounded-xl bg-stone-100 p-1 border border-stone-200">
                    <button
                      type="button"
                      onClick={() => setSelectedDietNorm('all')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        selectedDietNorm === 'all'
                          ? 'bg-stone-900 text-white shadow-xs'
                          : 'text-stone-700 hover:text-stone-950'
                      }`}
                    >
                      All Norms
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedDietNorm('pure-veg')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center ${
                        selectedDietNorm === 'pure-veg'
                          ? 'bg-leaf-700 text-white shadow-xs'
                          : 'text-leaf-800 hover:bg-leaf-100'
                      }`}
                    >
                      <Leaf className="w-3 h-3 mr-1" />
                      <span>Pure Veg</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedDietNorm('halal-non-veg')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center ${
                        selectedDietNorm === 'halal-non-veg'
                          ? 'bg-maroon-800 text-white shadow-xs'
                          : 'text-maroon-800 hover:bg-maroon-100'
                      }`}
                    >
                      <Drumstick className="w-3 h-3 mr-1" />
                      <span>Halal Non-Veg</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Row 2: Serving Norm Filter (By Norm) */}
              <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-stone-100">
                <span className="text-xs font-bold text-stone-700 mr-1">Serving Norm:</span>
                {[
                  { id: 'all', label: 'All Serving Styles' },
                  { id: 'banana-leaf', label: 'Traditional Banana Leaf (இலை சாப்பாடு)' },
                  { id: 'live-stall', label: 'Live Interactive Stalls (நேரடி ஸ்டால்கள்)' },
                  { id: 'buffet', label: 'Royal Buffet Spread (பஃபே)' },
                ].map((norm) => (
                  <button
                    key={norm.id}
                    onClick={() => setSelectedServingNorm(norm.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      selectedServingNorm === norm.id
                        ? 'bg-gold-dark text-stone-950 font-bold shadow-xs'
                        : 'bg-stone-50 text-stone-600 hover:bg-stone-100 border border-stone-200'
                    }`}
                  >
                    {norm.label}
                  </button>
                ))}
              </div>

              {/* Row 3: Category Groups Filter (By Group) */}
              <div className="space-y-2 pt-3 border-t border-stone-100">
                <span className="text-xs font-bold text-stone-700">Filter By Group:</span>
                <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-1">
                  {MENU_CATEGORIES.map((group) => (
                    <button
                      key={group}
                      onClick={() => setActiveGroup(group)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                        activeGroup === group
                          ? 'bg-maroon-800 text-white shadow-xs font-bold'
                          : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                      }`}
                    >
                      {group}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results Count & Current Filter Summary */}
            <div className="flex items-center justify-between text-xs text-stone-500 px-1">
              <span>
                Showing <strong>{filteredMenuItems.length}</strong> items (Group: {activeGroup} • Dietary:{' '}
                {selectedDietNorm === 'all'
                  ? 'All'
                  : selectedDietNorm === 'pure-veg'
                  ? 'Pure Veg'
                  : 'Halal Non-Veg'}
                )
              </span>

              {(activeGroup !== 'All' || selectedDietNorm !== 'all' || selectedServingNorm !== 'all' || searchQuery) && (
                <button
                  onClick={() => {
                    setActiveGroup('All');
                    setSelectedDietNorm('all');
                    setSelectedServingNorm('all');
                    setSearchQuery('');
                  }}
                  className="text-maroon-800 font-bold hover:underline"
                >
                  Reset Filters
                </button>
              )}
            </div>

            {/* Menu Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredMenuItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-5 border border-stone-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-3 group"
                >
                  <div className="space-y-2">
                    {/* Header: Diet symbol & Group */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          {/* Veg / Non-Veg Indicator Icon */}
                          <span
                            className={`w-4 h-4 rounded-xs border flex items-center justify-center shrink-0 ${
                              item.isVegetarian
                                ? 'border-emerald-600 bg-white'
                                : 'border-red-600 bg-white'
                            }`}
                            title={item.isVegetarian ? 'Pure Vegetarian' : '100% Halal Non-Veg'}
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${
                                item.isVegetarian ? 'bg-emerald-600' : 'bg-red-600'
                              }`}
                            />
                          </span>

                          <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">
                            {item.category}
                          </span>
                        </div>

                        {item.tamilName && (
                          <span className="font-tamil text-xs text-amber-700 font-semibold block mt-1">
                            {item.tamilName}
                          </span>
                        )}

                        <h3 className="font-serif font-bold text-sm sm:text-base text-charcoal group-hover:text-maroon-800 transition-colors leading-snug">
                          {item.name}
                        </h3>
                      </div>

                      {/* Popular / Chef Special Badge */}
                      {item.isPopular && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 shrink-0">
                          Popular
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-stone-600 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Norm Attributes Badges */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.servingNorm && (
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-medium capitalize">
                          {item.servingNorm.replace('-', ' ')}
                        </span>
                      )}
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-md font-medium ${
                          item.isVegetarian
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-red-50 text-red-800 border border-red-200'
                        }`}
                      >
                        {item.isVegetarian ? '100% Pure Veg' : 'Halal Certified'}
                      </span>
                    </div>

                    {/* Included in Packages */}
                    {item.packageAssociation && item.packageAssociation.length > 0 && (
                      <div className="text-[11px] text-stone-500 pt-1">
                        <span className="font-semibold text-stone-700">Included in: </span>
                        <span className="italic">{item.packageAssociation.join(', ')}</span>
                      </div>
                    )}
                  </div>

                  {/* Card Footer: Enquiry button */}
                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                    <Link
                      to={`/enquiry?service=${encodeURIComponent(item.name)}`}
                      className="w-full inline-flex items-center justify-center text-xs font-bold px-3 py-2 rounded-xl bg-stone-100 hover:bg-maroon-800 hover:text-white text-stone-800 transition-all text-center"
                    >
                      <CalendarCheck className="w-3.5 h-3.5 mr-1.5" />
                      <span>Enquire for this Menu</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty state if search returns zero */}
            {filteredMenuItems.length === 0 && (
              <div className="text-center py-12 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <Utensils className="w-8 h-8 text-stone-400 mx-auto" />
                <h3 className="font-serif font-bold text-base text-stone-700">
                  No matching dishes found
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Try adjusting your search terms or reset the filters to see our full range of Tamil dishes.
                </p>
                <button
                  onClick={() => {
                    setActiveGroup('All');
                    setSelectedDietNorm('all');
                    setSelectedServingNorm('all');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 rounded-xl bg-maroon-800 text-white text-xs font-bold"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Modal Lightbox for Flyer Previews */}
      {previewFlyer && (
        <Modal
          isOpen={Boolean(previewFlyer)}
          onClose={() => setPreviewFlyer(null)}
          title={previewFlyer.title}
          maxWidth="2xl"
        >
          <div className="space-y-4">
            <div className="max-h-[75vh] overflow-auto rounded-xl border border-stone-200 bg-stone-900/5 p-2">
              <img
                src={previewFlyer.src}
                alt={previewFlyer.title}
                className="w-full h-auto object-contain rounded-lg mx-auto"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-stone-500">
                Official Published Catering Tariff Flyer
              </span>
              <Link
                to={`/enquiry?service=${encodeURIComponent(previewFlyer.title)}`}
                className="px-4 py-2 rounded-xl bg-maroon-800 text-white font-bold text-xs"
              >
                Enquire for this Package
              </Link>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
