import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users } from 'lucide-react';
import { CateringServiceItem } from '../../types/service';

interface ServiceCardProps {
  service: CateringServiceItem;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  return (
    <div className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-stone-200/90 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col h-full">
      {/* Visual Image - Tall portrait 3:4 ratio for bigger card & full image view */}
      <Link
        to={`/services/${service.slug}`}
        className="relative aspect-[3/4] sm:aspect-[4/5] w-full overflow-hidden bg-stone-100 block"
      >
        <img
          src={service.imageSrc}
          alt={service.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

        {/* Floating Menu Available Indicator */}
        <div className="absolute top-2 right-2 bg-maroon-950/80 backdrop-blur-xs text-amber-200 text-[9px] sm:text-[10px] font-semibold px-2 py-0.5 rounded-full border border-gold/40 shadow-xs flex items-center">
          <span>Menu Card</span>
        </div>

        {/* Tamil Badge */}
        <div className="absolute bottom-2 left-2 right-2">
          <p className="text-amber-300 font-tamil text-[10px] sm:text-xs font-semibold truncate drop-shadow-xs">
            {service.tamilTitle}
          </p>
        </div>
      </Link>

      {/* Card Content - Simple & Scannable for 2-column Mobile */}
      <div className="p-2.5 sm:p-3.5 flex-1 flex flex-col justify-between space-y-2">
        <div>
          <Link to={`/services/${service.slug}`}>
            <h3 className="font-serif font-bold text-xs sm:text-base text-charcoal leading-snug line-clamp-2 group-hover:text-maroon-800 transition-colors">
              {service.title}
            </h3>
          </Link>

          <div className="mt-1 flex items-center text-[10px] sm:text-xs text-stone-500">
            <Users className="w-3 h-3 mr-1 text-maroon-700 shrink-0" />
            <span className="truncate">{service.guestCountRange}</span>
          </div>
        </div>

        {/* View Details Action - navigates to service detail page for all specifications */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
          <Link
            to={`/services/${service.slug}`}
            className="w-full inline-flex items-center justify-center text-[11px] sm:text-xs font-bold px-2 py-1.5 rounded-lg bg-maroon-50 hover:bg-maroon-800 hover:text-white text-maroon-900 transition-all text-center"
          >
            <span>View Menu &amp; Details</span>
            <ArrowRight className="w-3 h-3 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};
