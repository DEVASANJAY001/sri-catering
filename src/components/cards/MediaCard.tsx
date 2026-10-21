import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Play,
  Pause,
  Maximize2,
  Volume2,
  VolumeX,
  Sparkles,
  ArrowRight,
  CalendarCheck,
} from 'lucide-react';
import { MediaAsset } from '../../config/assets';
import { Badge } from '../common/Badge';

interface MediaCardProps {
  asset: MediaAsset;
  onOpenLightbox?: (asset: MediaAsset) => void;
}

export const MediaCard: React.FC<MediaCardProps> = ({
  asset,
  onOpenLightbox,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showFeedback, setShowFeedback] = useState<'play' | 'pause' | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-play / pause based on scrolling into and out of viewport
  useEffect(() => {
    const videoEl = videoRef.current;
    const containerEl = containerRef.current;
    if (!videoEl || !containerEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.45) {
            // Auto-play when scrolled into view
            videoEl.play().then(() => {
              setIsPlaying(true);
            }).catch((err) => {
              console.log('Autoplay deferred until touch/scroll interaction:', err);
            });
          } else {
            // Auto-pause when scrolled out of view
            if (!videoEl.paused) {
              videoEl.pause();
              setIsPlaying(false);
            }
          }
        });
      },
      {
        threshold: [0.1, 0.45, 0.8],
      }
    );

    observer.observe(containerEl);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Update progress bar
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const total = videoRef.current.duration;
    if (total > 0) {
      setProgress((current / total) * 100);
    }
  };

  // Toggle play/pause on touch or click
  const handleTogglePlay = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
      setShowFeedback('pause');
      setTimeout(() => setShowFeedback(null), 700);
    } else {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
        setShowFeedback('play');
        setTimeout(() => setShowFeedback(null), 700);
      }).catch((err) => {
        console.warn('Playback error:', err);
      });
    }
  };

  // Toggle audio
  const handleToggleMute = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div
      ref={containerRef}
      className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group relative"
    >
      {/* ============================================================== */}
      {/* 1. Video Container - Like Reel (9:16 portrait aspect ratio)   */}
      {/* ============================================================== */}
      <div
        onClick={handleTogglePlay}
        className="relative aspect-[9/16] w-full bg-stone-950 overflow-hidden cursor-pointer select-none"
      >
        <video
          ref={videoRef}
          src={asset.src}
          className="w-full h-full object-cover"
          playsInline
          muted={isMuted}
          loop
          preload="metadata"
          onTimeUpdate={handleTimeUpdate}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        {/* Ambient Top Subtle Dark Vignette */}
        <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-stone-950/80 via-stone-950/30 to-transparent pointer-events-none" />

        {/* Top Badges & Audio Control */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
          <Badge variant="maroon" size="sm" className="shadow-md backdrop-blur-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-1.5" />
            <span>Live Reel</span>
          </Badge>

          <div className="flex items-center space-x-1.5 pointer-events-auto">
            {/* Audio State Toggle Button */}
            <button
              type="button"
              onClick={handleToggleMute}
              className="p-2 rounded-full bg-stone-950/75 border border-white/20 text-white hover:bg-stone-900 transition-all shadow-md active:scale-95"
              aria-label={isMuted ? 'Tap to Unmute' : 'Tap to Mute'}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-amber-300" />
              ) : (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              )}
            </button>

            {/* Expand / Lightbox Button */}
            {onOpenLightbox && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenLightbox(asset);
                }}
                className="p-2 rounded-full bg-stone-950/75 border border-white/20 text-white hover:bg-stone-900 transition-all shadow-md active:scale-95"
                aria-label="Expand video"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Center Touch / Click Feedback Indicator */}
        {showFeedback && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <div className="w-16 h-16 rounded-full bg-maroon-950/85 backdrop-blur-sm border border-gold/50 text-white flex items-center justify-center shadow-2xl animate-ping">
              {showFeedback === 'play' ? (
                <Play className="w-8 h-8 text-gold ml-1" />
              ) : (
                <Pause className="w-8 h-8 text-white" />
              )}
            </div>
          </div>
        )}

        {/* Inactive Overlay Play Button when Paused */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <div className="w-14 h-14 rounded-full bg-maroon-900/90 border border-gold/50 text-white flex items-center justify-center shadow-xl">
              <Play className="w-6 h-6 text-gold ml-1" />
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* BLACK SHADE ENDING: Gradient at bottom with 1-line description */}
        {/* ============================================================== */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/85 to-transparent pt-16 pb-3.5 px-3.5 sm:px-4 z-10 pointer-events-none">
          <div className="space-y-1">
            {/* Title in Reel */}
            <h4 className="font-serif font-bold text-xs sm:text-sm text-white truncate drop-shadow-md">
              {asset.title}
            </h4>

            {/* Description in ONE LINE inside the black shade */}
            <p className="text-[11px] sm:text-xs text-stone-200 truncate font-light drop-shadow-xs">
              {asset.description}
            </p>

            {/* Reel Status & Progress */}
            <div className="flex items-center justify-between text-[10px] text-amber-300 font-medium pt-1">
              <span className="flex items-center">
                <Sparkles className="w-2.5 h-2.5 mr-1 text-gold" />
                <span>Tap to {isPlaying ? 'pause' : 'play'}</span>
              </span>
              <span className="text-stone-400 text-[10px]">
                {isMuted ? 'Muted' : 'Audio On'}
              </span>
            </div>

            {/* Gold Progress Bar */}
            <div className="w-full bg-white/25 h-1 rounded-full overflow-hidden mt-1">
              <div
                className="bg-gradient-to-r from-amber-400 via-gold to-turmeric-400 h-full transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. OUT OF THE VIDEO: Only Keep Enquiry Button                   */}
      {/* ============================================================== */}
      <div className="p-3 sm:p-4 bg-white">
        <Link
          to={`/enquiry?service=${encodeURIComponent(asset.title)}`}
          className="w-full inline-flex items-center justify-center text-xs font-bold px-3 py-2.5 rounded-xl bg-maroon-800 hover:bg-maroon-900 text-white transition-all text-center shadow-sm active:scale-98"
        >
          <CalendarCheck className="w-3.5 h-3.5 mr-1.5 text-gold" />
          <span>Enquire for Similar Setup</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </Link>
      </div>
    </div>
  );
};
