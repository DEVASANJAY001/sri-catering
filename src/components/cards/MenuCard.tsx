import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, Sparkles, Calendar, FileText, ChevronRight, Layers } from 'lucide-react';
import { MenuPackage } from '../../types/menu';

export interface MenuPackageCardProps {
  pkg: MenuPackage;
  onPreviewImage?: (src: string, title: string, images?: string[], activeIndex?: number) => void;
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
      const allFlyers = pkg.flyerImages && pkg.flyerImages.length > 0
        ? pkg.flyerImages
        : [pkg.flyerImageSrc || pkg.imageSrc];
      onPreviewImage(pkg.flyerImageSrc || pkg.imageSrc, pkg.name, allFlyers, 0);
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
        className="relative h-32 sm:h-52 overflow-hidden bg-stone-100"
        onClick={handleOpenDetails}
      >
        <img
          src={pkg.imageSrc}
          alt={pkg.name}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-1.5 sm:top-2.5 left-1.5 sm:left-2.5 right-1.5 sm:right-2.5 flex items-center justify-between gap-1 pointer-events-none">
          {showBadge ? (
            <span className="text-[9px] sm:text-[11px] font-bold py-0.5 px-1.5 sm:px-2 rounded bg-turmeric-500 text-maroon-950 backdrop-blur-xs shadow-xs flex items-center max-w-[55%] sm:max-w-[65%] truncate">
              <Sparkles className="w-2 sm:w-2.5 h-2 sm:h-2.5 mr-0.5 sm:mr-1 shrink-0" />
              <span className="truncate">{pkg.badge}</span>
            </span>
          ) : <span />}

          <div className="flex items-center gap-1">
            {pkg.flyerImages && pkg.flyerImages.length > 1 && (
              <span className="shrink-0 px-1.5 sm:px-2 py-0.5 rounded-md sm:rounded-lg bg-black/75 text-amber-300 font-bold text-[9px] sm:text-[10px] backdrop-blur-xs border border-amber-300/30 flex items-center gap-0.5 sm:gap-1 shadow-xs">
                <Layers className="w-2 sm:w-2.5 h-2 sm:h-2.5 text-gold" />
                <span className="hidden xs:inline sm:inline">{pkg.flyerImages.length} Menus</span>
                <span className="xs:hidden sm:hidden">{pkg.flyerImages.length}M</span>
              </span>
            )}
            <span className="shrink-0 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg bg-gold-dark text-stone-900 font-extrabold text-[9px] sm:text-xs shadow-md whitespace-nowrap border border-amber-300/40">
              {pkg.priceTag}
            </span>
          </div>
        </div>

        {/* Bottom Title on Image */}
        <div className="absolute bottom-1.5 sm:bottom-2.5 left-2 sm:left-3 right-2 sm:right-3 space-y-0.5">
          {pkg.highlight && (
            <span className="text-[8px] sm:text-[11px] font-semibold text-amber-300 uppercase tracking-wider block truncate">
              {pkg.highlight}
            </span>
          )}
          <h3 className="text-xs sm:text-base font-serif font-bold text-white leading-tight sm:leading-snug line-clamp-2 drop-shadow-xs group-hover:text-amber-200 transition-colors">
            {pkg.name}
          </h3>
          {pkg.tamilName && (
            <span className="font-tamil text-[9px] sm:text-[11px] text-stone-300 truncate block">
              {pkg.tamilName}
            </span>
          )}
        </div>
      </div>

      {/* Card Content - Clean & Uniform Height */}
      <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between space-y-2 sm:space-y-3.5">
        <div className="space-y-1.5 sm:space-y-3">
          <p className="text-[10px] sm:text-xs text-stone-600 leading-snug sm:leading-relaxed line-clamp-1 sm:line-clamp-2">
            {pkg.description}
          </p>

          {/* Key Inclusions - Clean Preview */}
          <div className="bg-stone-50 rounded-lg sm:rounded-xl p-2 sm:p-3 border border-stone-200/70 space-y-1 sm:space-y-2">
            <div className="flex items-center justify-between text-[9px] sm:text-[11px] font-bold text-maroon-900 uppercase tracking-wider">
              <span className="truncate">Inclusions</span>
              <span className="text-[8px] sm:text-[10px] text-stone-500 font-medium shrink-0 ml-1">
                {pkg.features.length} Items
              </span>
            </div>

            <ul className="space-y-1 sm:space-y-1.5">
              {/* Show 2 items on mobile, 3 on larger screens */}
              {pkg.features.slice(0, 2).map((feat, idx) => (
                <li key={idx} className="flex items-center text-[10px] sm:text-xs text-stone-700">
                  <Check className="w-2.5 sm:w-3.5 h-2.5 sm:h-3.5 text-leaf-700 mr-1 sm:mr-1.5 shrink-0" />
                  <span className="truncate">{feat}</span>
                </li>
              ))}
              {/* 3rd item only shown on desktop/sm */}
              {pkg.features.length > 2 && (
                <li className="hidden sm:flex items-center text-xs text-stone-700">
                  <Check className="w-3.5 h-3.5 text-leaf-700 mr-1.5 shrink-0" />
                  <span className="truncate">{pkg.features[2]}</span>
                </li>
              )}
            </ul>

            {pkg.features.length > 2 && (
              <button
                type="button"
                onClick={handleOpenDetails}
                className="text-[9px] sm:text-[11px] font-bold text-maroon-800 hover:text-maroon-950 flex items-center pt-0.5 sm:pt-1 group-hover:underline cursor-pointer truncate"
              >
                <span className="sm:hidden truncate">+ View {pkg.features.length - 2} more</span>
                <span className="hidden sm:inline truncate">+ View {pkg.features.length - 3} more items &amp; full menu</span>
                <ChevronRight className="w-2.5 sm:w-3 h-2.5 sm:h-3 ml-0.5 shrink-0" />
              </button>
            )}
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div className="pt-2 sm:pt-3 border-t border-stone-100 flex items-center justify-between gap-1.5 sm:gap-2">
          {/* See Details Button */}
          {onViewDetails ? (
            <button
              type="button"
              onClick={handleOpenDetails}
              className="flex-1 inline-flex items-center justify-center text-[10px] sm:text-xs font-bold px-1.5 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border border-stone-300 text-stone-700 hover:text-maroon-900 hover:bg-stone-50 hover:border-maroon-800/40 transition-all cursor-pointer shadow-2xs"
            >
              <FileText className="w-3 sm:w-3.5 h-3 sm:h-3.5 mr-1 sm:mr-1.5 text-maroon-800 shrink-0" />
              <span className="truncate">Details</span>
            </button>
          ) : (
            <Link
              to={`/menu?package=${encodeURIComponent(pkg.id)}`}
              onClick={handleOpenDetails}
              className="flex-1 inline-flex items-center justify-center text-[10px] sm:text-xs font-bold px-1.5 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border border-stone-300 text-stone-700 hover:text-maroon-900 hover:bg-stone-50 hover:border-maroon-800/40 transition-all cursor-pointer shadow-2xs"
            >
              <FileText className="w-3 sm:w-3.5 h-3 sm:h-3.5 mr-1 sm:mr-1.5 text-maroon-800 shrink-0" />
              <span className="truncate">Details</span>
            </Link>
          )}

          {/* Book Package Primary Button */}
          <Link
            to={`/enquiry?service=${encodeURIComponent(pkg.name)}`}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 inline-flex items-center justify-center text-[10px] sm:text-xs font-bold px-1.5 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-maroon-800 hover:bg-maroon-900 text-white transition-all shadow-xs"
          >
            <Calendar className="w-3 sm:w-3.5 h-3 sm:h-3.5 mr-1 sm:mr-1.5 text-gold shrink-0" />
            <span className="truncate">Book</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
