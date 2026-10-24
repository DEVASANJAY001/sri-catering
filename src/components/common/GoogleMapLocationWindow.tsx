import React, { useState } from 'react';
import {
  MapPin,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Navigation,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Compass,
} from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';

interface GoogleMapLocationWindowProps {
  className?: string;
  defaultZoom?: number;
  heightClassName?: string;
  showDetailsCard?: boolean;
}

const DEFAULT_LAT = 13.1112072;
const DEFAULT_LNG = 80.2586718;
const DEFAULT_ZOOM = 17;

export const GoogleMapLocationWindow: React.FC<GoogleMapLocationWindowProps> = ({
  className = '',
  defaultZoom = DEFAULT_ZOOM,
  heightClassName = 'aspect-[16/10] sm:aspect-[16/9] min-h-[380px]',
  showDetailsCard = true,
}) => {
  const [zoom, setZoom] = useState(defaultZoom);
  const [center, setCenter] = useState({ lat: DEFAULT_LAT, lng: DEFAULT_LNG });
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Dynamic step size so panning feels natural at any zoom level
  const panStep = 0.0025 * Math.pow(2, 17 - zoom);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(21, prev + 1));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(9, prev - 1));
  };

  const handlePan = (direction: 'up' | 'down' | 'left' | 'right') => {
    setCenter((prev) => {
      switch (direction) {
        case 'up':
          return { ...prev, lat: prev.lat + panStep };
        case 'down':
          return { ...prev, lat: prev.lat - panStep };
        case 'left':
          return { ...prev, lng: prev.lng - panStep };
        case 'right':
          return { ...prev, lng: prev.lng + panStep };
      }
    });
  };

  const handleReset = () => {
    setCenter({ lat: DEFAULT_LAT, lng: DEFAULT_LNG });
    setZoom(DEFAULT_ZOOM);
  };

  const mapSrc = `https://maps.google.com/maps?q=${center.lat},${center.lng}&t=&z=${zoom}&ie=UTF8&iwloc=&output=embed`;
  const isOffset = center.lat !== DEFAULT_LAT || center.lng !== DEFAULT_LNG || zoom !== DEFAULT_ZOOM;

  const content = (
    <div className={`bg-white rounded-2xl overflow-hidden border-2 border-gold/40 shadow-xl flex flex-col ${className}`}>
      {/* Window Header Bar */}
      <div className="bg-stone-50 text-stone-700 px-4 py-2.5 flex items-center justify-between border-b border-stone-200">
        <span className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center">
          <MapPin className="w-3.5 h-3.5 mr-1.5 text-maroon-800" />
          Chennai Service Map
        </span>
        <div className="flex items-center space-x-2">
          <a
            href={siteConfig.locations.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-maroon-800 font-bold hover:underline inline-flex items-center"
            title="Open in Google Maps"
          >
            <span>Open in Google Maps</span>
            <ExternalLink className="w-3 h-3 ml-1" />
          </a>
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1 rounded-md text-stone-500 hover:text-stone-800 hover:bg-stone-200/60 transition-all ml-1"
            aria-label={isFullscreen ? 'Exit full screen' : 'Expand full screen'}
            title={isFullscreen ? 'Exit Full Screen' : 'Expand Full Screen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Interactive Map Stage */}
      <div className={`relative w-full bg-stone-100 overflow-hidden ${isFullscreen ? 'flex-1 min-h-[500px]' : heightClassName}`}>
        <iframe
          src={mapSrc}
          title="Sri Caterers Google Maps Location"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full"
        />

        {/* Floating Zoom & Pan Control Pad (Desktop & Mobile) */}
        <div className="absolute top-3 right-3 flex flex-col space-y-2 z-10 pointer-events-auto">
          {/* Zoom In & Zoom Out Controls */}
          <div className="bg-stone-900/90 backdrop-blur-md rounded-xl p-1 border border-white/20 shadow-2xl flex flex-col items-center space-y-1">
            <button
              type="button"
              onClick={handleZoomIn}
              disabled={zoom >= 21}
              className="p-2 rounded-lg text-white hover:text-amber-300 hover:bg-white/15 disabled:opacity-40 disabled:hover:bg-transparent transition-all active:scale-95"
              aria-label="Zoom in"
              title="Zoom In (+)"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            <span className="text-[10px] font-mono font-bold text-amber-200 px-1 py-0.5 rounded bg-black/40">
              {zoom}z
            </span>

            <button
              type="button"
              onClick={handleZoomOut}
              disabled={zoom <= 9}
              className="p-2 rounded-lg text-white hover:text-amber-300 hover:bg-white/15 disabled:opacity-40 disabled:hover:bg-transparent transition-all active:scale-95"
              aria-label="Zoom out"
              title="Zoom Out (-)"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>

          {/* Move / Pan D-Pad */}
          <div className="bg-stone-900/90 backdrop-blur-md rounded-xl p-1.5 border border-white/20 shadow-2xl flex flex-col items-center">
            <button
              type="button"
              onClick={() => handlePan('up')}
              className="p-1.5 rounded-md text-white hover:text-amber-300 hover:bg-white/15 transition-all active:scale-95"
              aria-label="Pan North"
              title="Move Up"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={() => handlePan('left')}
                className="p-1.5 rounded-md text-white hover:text-amber-300 hover:bg-white/15 transition-all active:scale-95"
                aria-label="Pan West"
                title="Move Left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div
                className="w-4 h-4 rounded-full bg-gold/40 border border-gold flex items-center justify-center cursor-pointer"
                onClick={handleReset}
                title="Reset Center Pin"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-gold" />
              </div>
              <button
                type="button"
                onClick={() => handlePan('right')}
                className="p-1.5 rounded-md text-white hover:text-amber-300 hover:bg-white/15 transition-all active:scale-95"
                aria-label="Pan East"
                title="Move Right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => handlePan('down')}
              className="p-1.5 rounded-md text-white hover:text-amber-300 hover:bg-white/15 transition-all active:scale-95"
              aria-label="Pan South"
              title="Move Down"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Reset View Button (if adjusted) */}
          {isOffset && (
            <button
              type="button"
              onClick={handleReset}
              className="bg-stone-900/90 backdrop-blur-md text-amber-200 hover:text-white px-2 py-1.5 rounded-lg border border-gold/40 shadow-xl text-[10px] font-bold flex items-center justify-center space-x-1 transition-all hover:bg-maroon-900 active:scale-95"
              title="Reset Zoom & Move to Original Base"
            >
              <RotateCcw className="w-3 h-3 text-gold" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Floating Bottom Left Badge & Hint */}
        <div className="absolute bottom-3 left-3 bg-stone-950/85 backdrop-blur-md text-white px-3 py-1.5 rounded-xl border border-white/20 shadow-lg text-[11px] flex items-center space-x-2">
          <Compass className="w-3.5 h-3.5 text-gold animate-spin-slow" />
          <span className="font-medium text-stone-200">
            Drag to pan • Use +/- or buttons to Zoom
          </span>
        </div>
      </div>

      {/* Location Details & Direct Action Toolbar */}
      {showDetailsCard && (
        <div className="p-4 sm:p-5 bg-gradient-to-b from-stone-50 to-amber-50/40 border-t border-stone-200 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="text-xs font-bold text-maroon-950 uppercase tracking-wider block">
                Catering Hub &amp; Kitchen Address
              </span>
              <p className="text-xs sm:text-sm font-semibold text-charcoal">
                {siteConfig.locations.fullAddress}
              </p>
              <p className="text-[11px] text-stone-500">
                Pincode: {siteConfig.locations.pincode} • Near Villivakkam &amp; Perambur Railway Stations
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1 sm:pt-0">
              <a
                href={siteConfig.locations.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3.5 py-1.5 rounded-lg bg-maroon-900 hover:bg-maroon-950 text-amber-100 text-xs font-bold shadow-xs transition-all active:scale-95 hover:shadow-md"
              >
                <Navigation className="w-3.5 h-3.5 mr-1 text-gold" />
                <span>Directions</span>
              </a>

              <a
                href={siteConfig.locations.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-maroon-950 text-xs font-extrabold shadow-xs transition-all active:scale-95 hover:shadow-md"
              >
                <span>Open Google Map</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm p-3 sm:p-6 flex flex-col items-center justify-center animate-fade-in">
        <div className="w-full max-w-6xl h-full flex flex-col">
          {content}
        </div>
      </div>
    );
  }

  return content;
};
