import React from 'react';
import { Link } from 'react-router-dom';
import {
  UtensilsCrossed,
  Flame,
  ShieldCheck,
  Users,
  Award,
  Heart,
  CalendarCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';
import { MEDIA_ASSETS } from '../../config/assets';
import { KolamDivider } from '../../components/common/KolamDivider';
import { Badge } from '../../components/common/Badge';
import { SEO } from '../../components/common/SEO';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-16 sm:space-y-24 py-10 sm:py-16">
      <SEO
        title="About Sri Caterers | Tamil Culinary Heritage & Event Masters"
        description="Learn about Sri Caterers Chennai, directed by Srinivasan .R, B.Com. Master chefs of authentic Tamil wedding catering, wood-fire dum biryani, and plantain leaf feasts."
        keywords="about Sri Caterers, Srinivasan caterer Chennai, Villivakkam caterers, authentic Tamil catering company, event management Chennai"
        canonicalPath="/about"
      />

      {/* 1. Header Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <Badge variant="maroon" size="md">
          About Sri Caterers Chennai
        </Badge>
        <h1 className="font-serif text-3xl sm:text-5xl font-black text-maroon-950">
          Rooted in Tamil Culinary Heritage &amp; Hospitality
        </h1>
        <p className="text-base sm:text-lg text-stone-600 max-w-3xl mx-auto leading-relaxed">
          Bringing the authentic tastes of Tamil weddings, festival banquets, and time-honored recipes to families across Chennai, Villivakkam, Perambur, and all across Tamil Nadu.
        </p>
        <KolamDivider theme="gold" />
      </section>

      {/* 2. Business Introduction & Founder Profile */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Visual */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl overflow-hidden border-2 border-gold/40 shadow-xl bg-maroon-950 p-2">
                <img
                  src={MEDIA_ASSETS.logo}
                  alt="Sri Caterers Founder Emblem"
                  className="w-full aspect-square object-contain bg-white rounded-xl p-4"
                />
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center space-x-2 text-xs font-bold text-gold-dark uppercase tracking-wider">
                <Award className="w-4 h-4" />
                <span>Leadership &amp; Culinary Passion</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-maroon-950">
                Founded &amp; Directed by {siteConfig.proprietor}
              </h2>

              <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                <strong className="text-charcoal font-semibold">{siteConfig.fullName}</strong> was established with a singular devotion: to preserve and celebrate the timeless dining experience of Tamil Nadu. Food is considered sacred in Tamil culture—a blessing to be shared with utmost generosity, purity, and warmth.
              </p>

              <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                Operating from our core facilities in <strong className="text-charcoal">{siteConfig.locations.primary}</strong>, we have earned trust by adhering strictly to traditional cooking methods: slow wood-fire preparation for authentic aromatic biryani, brass cauldrons for sambar and payasam, and fresh tender plantain leaves for serving.
              </p>

              <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-stone-100 text-center">
                <div className="p-3 bg-stone-50 rounded-xl">
                  <span className="text-xl font-black text-maroon-800">100%</span>
                  <p className="text-[11px] font-medium text-stone-500 mt-0.5">Halal Available</p>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl">
                  <span className="text-xl font-black text-leaf-700">Pure Ghee</span>
                  <p className="text-[11px] font-medium text-stone-500 mt-0.5">&amp; Cold Pressed Oils</p>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl col-span-2 sm:col-span-1">
                  <span className="text-xl font-black text-turmeric-600">Wood-Fire</span>
                  <p className="text-[11px] font-medium text-stone-500 mt-0.5">Authentic Cooking</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Catering Philosophy */}
      <section className="bg-maroon-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold text-gold uppercase tracking-wider">
              Our Core Principles
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-white">
              The Three Pillars of Tamil Catering
            </h2>
            <p className="text-sm text-stone-300">
              Good food is only complete when prepared with pure devotion and served with heartfelt hospitality.
            </p>
            <KolamDivider theme="gold" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="p-8 rounded-2xl bg-maroon-900/60 border border-gold/30 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-gold/20 text-gold flex items-center justify-center">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-amber-200">
                1. Wood-Fire Authenticity
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                Nothing replicates the earthy aroma of slow wood-fire cooking. We slow-cook Seeraga Samba biryani over dry firewood and pure country ghee to lock in natural juices and exquisite flavours.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-maroon-900/60 border border-gold/30 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-leaf-500/20 text-leaf-400 flex items-center justify-center">
                <UtensilsCrossed className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-amber-200">
                2. Plantain Leaf Tradition
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                The traditional banana leaf meal (இலை சாப்பாடு) is a culinary science. From placing salt and pickle on the top left to pouring hot ghee on the first scoop of rice, we preserve every authentic sequence.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-maroon-900/60 border border-gold/30 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-turmeric-500/20 text-turmeric-400 flex items-center justify-center">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-amber-200">
                3. Virundhombal (Hospitality)
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                In Tamil, guests are treated as divine embodiments (&quot;Athithi Devo Bhava&quot;). Our uniformed service staff smile, refill second servings proactively, and ensure no plate is left untended.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Kitchen Standards & Hygiene */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-6">
              <Badge variant="leaf" size="md">
                Safety &amp; Purity
              </Badge>
              <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-maroon-950">
                Kitchen Hygiene &amp; Quality Control
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                Every feast begins at dawn with strict cleanliness. Our kitchen protocols are structured to ensure absolute food safety for infants, elders, and every guest.
              </p>

              <div className="space-y-3">
                {[
                  'Farm-fresh vegetables hand-washed in purified water',
                  '100% Halal meat sourcing with trusted butcher verification',
                  'Zero synthetic food colours or artificial flavour enhancers',
                  'Uniformed staff wearing hairnets, gloves, and clean aprons',
                  'High-grade food-safe thermal transport for hot on-time delivery',
                  'Packaged 300ml sealed mineral water bottles with every meal'
                ].map((std, i) => (
                  <div key={i} className="flex items-center space-x-3 text-xs sm:text-sm text-stone-700">
                    <CheckCircle2 className="w-4 h-4 text-leaf-700 shrink-0" />
                    <span>{std}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-2xl overflow-hidden border border-stone-200 shadow-lg">
                <img
                  src={MEDIA_ASSETS.images[3].src} // WhatsApp Image 2026-10-07 at 9.29.39 PM.jpeg - Chicken Biryani Package
                  alt="Sri Caterers Authentic Food Standard"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Complete Event Management */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="turmeric" size="md">
            Beyond Catering
          </Badge>
          <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-maroon-950">
            End-to-End Event Management
          </h2>
          <p className="text-sm text-stone-600">
            As &quot;The Event Management Company,&quot; we offer comprehensive wedding and celebration support alongside food.
          </p>
          <KolamDivider theme="maroon" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-10">
          <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 text-center space-y-2">
            <Sparkles className="w-6 h-6 text-maroon-800 mx-auto" />
            <h4 className="font-bold text-sm text-charcoal">Chenda Melam &amp; Music</h4>
            <p className="text-xs text-stone-500">Live traditional Kerala Chenda Melam &amp; DJ sound systems</p>
          </div>
          <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 text-center space-y-2">
            <Users className="w-6 h-6 text-maroon-800 mx-auto" />
            <h4 className="font-bold text-sm text-charcoal">Reception Garlands</h4>
            <p className="text-xs text-stone-500">Special Jothika Malai &amp; fragrant floral po chendu</p>
          </div>
          <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 text-center space-y-2">
            <ShieldCheck className="w-6 h-6 text-maroon-800 mx-auto" />
            <h4 className="font-bold text-sm text-charcoal">Bridal Makeup &amp; Mehandi</h4>
            <p className="text-xs text-stone-500">Professional HD Bridal makeover, saree draping &amp; henna artists</p>
          </div>
          <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 text-center space-y-2">
            <Award className="w-6 h-6 text-maroon-800 mx-auto" />
            <h4 className="font-bold text-sm text-charcoal">Photography &amp; Stalls</h4>
            <p className="text-xs text-stone-500">Full candid videography, dining table decor &amp; live mojito stalls</p>
          </div>
        </div>
      </section>

      {/* 6. CTA to Submit Enquiry */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="bg-gradient-to-r from-maroon-900 via-maroon-950 to-stone-900 rounded-3xl p-8 sm:p-12 text-center text-white border border-gold/40 shadow-xl space-y-5">
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white">
            Let Us Host Your Next Celebration
          </h2>
          <p className="text-sm sm:text-base text-stone-300 max-w-2xl mx-auto leading-relaxed">
            Reach out today to discuss guest counts, auspicious muhurtham dates, and tailored menu packages.
          </p>
          <div className="pt-2">
            <Link
              to="/enquiry"
              className="inline-flex items-center px-8 py-4 rounded-xl text-base font-bold text-maroon-950 bg-gradient-to-r from-amber-300 via-gold to-turmeric-400 hover:from-amber-400 hover:to-turmeric-500 shadow-xl transition-all"
            >
              <CalendarCheck className="w-5 h-5 mr-2 text-maroon-950" />
              <span>Submit Event Enquiry</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
