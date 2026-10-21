import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, Sparkles, Calendar, FileText, ChevronRight } from 'lucide-react';
import { MenuPackage } from '../../types/menu';

export interface MenuPackageCardProps {
  pkg: MenuPackage;
  onPreviewImage?: (src: string, title: string) => void;
  onViewDetails?: (pkg: MenuPackage) => void;
  isTargeted?: boolean;
}

export const MenuPackageCard: React.FC<MenuPackageCardProps> = ({
  pkg,
  onPreviewImage,
  onViewDetails,
  isTargeted = false,
}) => {
  const navigate = useNavigate();

  // Prevent duplicate badge if badge matches priceTag
  const showBadge = pkg.badge && pkg.badge.toLowerCase() !== pkg.priceTag.toLowerCase();

  const handleOpenDetails = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (onViewDetails) {
      onViewDetails(pkg);
    } else if (onPreviewImage) {
      onPreviewImage(pkg.flyerImageSrc || pkg.imageSrc, pkg.name);
    } else {
      navigate(`/menu?package=${encodeURIComponent(pkg.id)}`);
    }
  };

  const handleCardBodyClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('a') || target.closest('button')) {
      return;
    }
    handleOpenDetails();
  };

  return (
    <div
      onClick={handleCardBodyClick}
      className={`bg-white rounded-2xl border overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col h-full group cursor-pointer ${
        isTargeted
          ? 'border-gold ring-2 ring-gold/60 shadow-lg'
          : 'border-stone-200/90 hover:border-gold/50'
      }`}
    >
      {/* Visual Header with balanced fixed height */}
      <div
        className="relative h-44 sm:h-52 overflow-hidden bg-stone-100"
        onClick={handleOpenDetails}
      >
        <img
          src={pkg.imageSrc}
          alt={pkg.name}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5 pointer-events-none">
          {showBadge ? (
            <span className="text-[10px] sm:text-[11px] font-bold py-0.5 px-2 rounded-md bg-turmeric-500 text-maroon-950 backdrop-blur-xs shadow-xs flex items-center max-w-[65%] truncate">
              <Sparkles className="w-2.5 h-2.5 mr-1 shrink-0" />
              <span className="truncate">{pkg.badge}</span>
            </span>
          ) : <span />}

          <span className="shrink-0 px-2.5 py-1 rounded-lg bg-gold-dark text-stone-900 font-extrabold text-[10px] sm:text-xs shadow-md whitespace-nowrap border border-amber-300/40">
            {pkg.priceTag}
          </span>
        </div>

        {/* Bottom Title on Image */}
        <div className="absolute bottom-2.5 left-3 right-3 space-y-0.5">
          {pkg.highlight && (
            <span className="text-[10px] sm:text-[11px] font-semibold text-amber-300 uppercase tracking-wider block truncate">
              {pkg.highlight}
            </span>
          )}
          <h3 className="text-sm sm:text-base font-serif font-bold text-white leading-snug line-clamp-2 drop-shadow-xs group-hover:text-amber-200 transition-colors">
            {pkg.name}
          </h3>
          {pkg.tamilName && (
            <span className="font-tamil text-[11px] text-stone-300 line-clamp-1 block">
              {pkg.tamilName}
            </span>
          )}
        </div>
      </div>

      {/* Card Content - Clean & Uniform Height */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3.5">
        <div className="space-y-3">
          <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">
            {pkg.description}
          </p>

          {/* Key Inclusions - Clean 3-Item Preview Only */}
          <div className="bg-stone-50 rounded-xl p-3 border border-stone-200/70 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-maroon-900 uppercase tracking-wider">
              <span>Top Inclusions</span>
              <span className="text-[10px] text-stone-600 font-medium">
                {pkg.features.length} Items Total
              </span>
            </div>

            <ul className="space-y-1.5">
              {pkg.features.slice(0, 3).map((feat, idx) => (
                <li key={idx} className="flex items-start text-xs text-stone-700">
                  <Check className="w-3.5 h-3.5 text-leaf-700 mr-1.5 shrink-0 mt-0.5" />
                  <span className="line-clamp-1">{feat}</span>
                </li>
              ))}
            </ul>

            {pkg.features.length > 3 && (
              <button
                type="button"
                onClick={handleOpenDetails}
                className="text-[11px] font-bold text-maroon-800 hover:text-maroon-950 flex items-center pt-1 group-hover:underline cursor-pointer"
              >
                <span>+ View {pkg.features.length - 3} more items &amp; full menu</span>
                <ChevronRight className="w-3 h-3 ml-0.5" />
              </button>
            )}
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
          {/* See Details Button */}
          {onViewDetails ? (
            <button
              type="button"
              onClick={handleOpenDetails}
              className="flex-1 inline-flex items-center justify-center text-xs font-bold px-3 py-2 rounded-xl border border-stone-300 text-stone-700 hover:text-maroon-900 hover:bg-stone-50 hover:border-maroon-800/40 transition-all cursor-pointer shadow-2xs"
            >
              <FileText className="w-3.5 h-3.5 mr-1.5 text-maroon-800" />
              <span>See Details</span>
            </button>
          ) : (
            <Link
              to={`/menu?package=${encodeURIComponent(pkg.id)}`}
              onClick={handleOpenDetails}
              className="flex-1 inline-flex items-center justify-center text-xs font-bold px-3 py-2 rounded-xl border border-stone-300 text-stone-700 hover:text-maroon-900 hover:bg-stone-50 hover:border-maroon-800/40 transition-all cursor-pointer shadow-2xs"
            >
              <FileText className="w-3.5 h-3.5 mr-1.5 text-maroon-800" />
              <span>See Details</span>
            </Link>
          )}

          {/* Book Package Primary Button */}
          <Link
            to={`/enquiry?service=${encodeURIComponent(pkg.name)}`}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 inline-flex items-center justify-center text-xs font-bold px-3 py-2 rounded-xl bg-maroon-800 hover:bg-maroon-900 text-white transition-all shadow-xs"
          >
            <Calendar className="w-3.5 h-3.5 mr-1.5 text-gold" />
            <span>Book Now</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
