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
  Copy,
  Check,
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
  const [copied, setCopied] = useState(false);

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

  const handleCopyCoordinates = () => {
    navigator.clipboard.writeText(`${center.lat}, ${center.lng}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const mapSrc = `https://maps.google.com/maps?q=${center.lat},${center.lng}&t=&z=${zoom}&ie=UTF8&iwloc=&output=embed`;
  const isOffset = center.lat !== DEFAULT_LAT || center.lng !== DEFAULT_LNG || zoom !== DEFAULT_ZOOM;

  const content = (
    <div className={`bg-white rounded-2xl overflow-hidden border-2 border-gold/40 shadow-xl flex flex-col ${className}`}>
      {/* Window Header Bar */}
      <div className="bg-gradient-to-r from-maroon-950 via-maroon-900 to-maroon-950 text-white px-4 py-3 flex items-center justify-between border-b border-gold/30">
        <div className="flex items-center space-x-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-gold/20 border border-gold/50 flex items-center justify-center shrink-0">
            <MapPin className="w-4 h-4 text-gold" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <h3 className="font-serif font-bold text-sm sm:text-base text-amber-100 truncate">
                Sri Caterers Central Base
              </h3>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1" />
                Live Pin
              </span>
            </div>
            <p className="text-[11px] text-amber-200/80 font-mono truncate">
              {siteConfig.locations.coordinates} • Villivakkam &amp; Perambur
            </p>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center space-x-1.5 shrink-0 ml-2">
          <a
            href={siteConfig.locations.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold text-amber-200 hover:text-white bg-white/10 hover:bg-white/20 transition-all border border-white/15"
            title="Open in Google Maps"
          >
            <span>Google Maps</span>
            <ExternalLink className="w-3 h-3 ml-1" />
          </a>
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg text-amber-200 hover:text-white bg-white/10 hover:bg-white/20 transition-all border border-white/15"
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
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-maroon-950 uppercase tracking-wider">
                  Catering Hub &amp; Kitchen Address
                </span>
                <span className="text-[10px] font-mono text-stone-500 bg-white px-2 py-0.5 rounded border border-stone-200">
                  {center.lat.toFixed(6)}, {center.lng.toFixed(6)}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-charcoal">
                {siteConfig.locations.fullAddress}
              </p>
              <p className="text-[11px] text-stone-500">
                Pincode: {siteConfig.locations.pincode} • Near Villivakkam &amp; Perambur Railway Stations
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1 sm:pt-0">
              <button
                type="button"
                onClick={handleCopyCoordinates}
                className="inline-flex items-center px-3 py-1.5 rounded-lg bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 text-xs font-semibold shadow-2xs transition-all active:scale-95"
                title="Copy Lat, Lng coordinates"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 mr-1" /> : <Copy className="w-3.5 h-3.5 text-stone-500 mr-1" />}
                <span>{copied ? 'Copied!' : 'Copy Coords'}</span>
              </button>

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
