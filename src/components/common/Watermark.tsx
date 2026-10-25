import React from 'react';

/**
 * Global Diagonal Licensed Watermark
 * Renders a full-viewport diagonal watermark across the entire website ("in cross fully")
 * for Davns Industries - Sri Catering.
 * Features:
 * - Fixed full-screen overlay (pointer-events-none, select-none, z-[9999])
 * - Crisp repeating diagonal grid of "DAVNS INDUSTRIES — SRI CATERING • LICENSED"
 * - High-legibility dual-tone styling that looks authentic on both light and dark backgrounds
 * - Zero impact on site performance, clicks, scrolling, and accessibility
 */
export const Watermark: React.FC = () => {
  // Lightweight SVG pattern data URI for repeating diagonal watermark across the entire viewport
  // Pure vector styling without expensive SVG dropShadow filters to guarantee 60-120fps scrolling on all devices
  const svgPattern = `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="460" height="260" viewBox="0 0 460 260">
      <g transform="rotate(-30 230 130)">
        <text 
          x="230" 
          y="80" 
          text-anchor="middle" 
          font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
          font-size="14" 
          font-weight="800" 
          letter-spacing="0.22em" 
          fill="rgba(30, 41, 59, 0.09)" 
        >
          DAVNS INDUSTRIES — SRI CATERING
        </text>
        <text 
          x="230" 
          y="102" 
          text-anchor="middle" 
          font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
          font-size="10.5" 
          font-weight="700" 
          letter-spacing="0.28em" 
          fill="rgba(180, 83, 9, 0.12)"
        >
          ★ OFFICIAL LICENSED COPY ★
        </text>

        <text 
          x="230" 
          y="200" 
          text-anchor="middle" 
          font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
          font-size="14" 
          font-weight="800" 
          letter-spacing="0.22em" 
          fill="rgba(30, 41, 59, 0.09)" 
        >
          DAVNS INDUSTRIES — SRI CATERING
        </text>
        <text 
          x="230" 
          y="222" 
          text-anchor="middle" 
          font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
          font-size="10.5" 
          font-weight="700" 
          letter-spacing="0.28em" 
          fill="rgba(180, 83, 9, 0.12)"
        >
          ★ OFFICIAL LICENSED COPY ★
        </text>
      </g>
    </svg>
  `)}`;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none select-none z-[9999] overflow-hidden"
      style={{
        backgroundImage: `url("${svgPattern}")`,
        backgroundRepeat: 'repeat',
        backgroundPosition: 'center center',
        contain: 'strict',
        transform: 'translateZ(0)',
        willChange: 'transform',
      }}
    >
      {/* Prominent Large Center Diagonal Cross Ribbon for Authentic License Feel */}
      <div className="absolute inset-0 flex items-center justify-center opacity-80 pointer-events-none">
        <div
          className="transform -rotate-45 whitespace-nowrap text-center px-12 py-3 border-y-2 border-dashed border-amber-900/15 bg-amber-500/[0.02]"
          style={{ width: '160vw', maxWidth: 'none' }}
        >
          <span className="text-xl md:text-3xl lg:text-4xl font-black tracking-[0.3em] text-slate-900/15 uppercase block">
            DAVNS INDUSTRIES • SRI CATERING
          </span>
          <span className="text-xs md:text-sm lg:text-base font-bold tracking-[0.45em] text-amber-900/20 uppercase block mt-1">
            VERIFIED &amp; LICENSED ENTERPRISE SYSTEM
          </span>
        </div>
      </div>
    </div>
  );
};

export default Watermark;
