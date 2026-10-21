import React from 'react';
import { Link } from 'react-router-dom';
import { Home, UtensilsCrossed } from 'lucide-react';
import { MEDIA_ASSETS } from '../../config/assets';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-stone-200 shadow-xl text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-maroon-50 border-2 border-gold p-1 mx-auto flex items-center justify-center">
          <img
            src={MEDIA_ASSETS.logo}
            alt="Sri Caterers Logo"
            className="w-full h-full object-contain"
          />
        </div>

        <div className="space-y-2">
          <span className="font-mono text-4xl sm:text-5xl font-black text-maroon-900 block">
            404
          </span>
          <h1 className="font-serif text-2xl font-bold text-charcoal">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
            The page or catering section you are looking for does not exist or may have been relocated.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-maroon-800 hover:bg-maroon-900 shadow-sm transition-all"
          >
            <Home className="w-4 h-4 mr-1.5" />
            <span>Return Home</span>
          </Link>

          <Link
            to="/menu"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 transition-all"
          >
            <UtensilsCrossed className="w-4 h-4 mr-1.5 text-maroon-800" />
            <span>View Menu</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
