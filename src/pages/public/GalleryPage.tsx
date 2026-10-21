import React, { useState } from 'react';
import {
  Video,
  Sparkles,
  Share2,
  ExternalLink,
  Volume2,
  Play,
} from 'lucide-react';
import { MEDIA_ASSETS, MediaAsset } from '../../config/assets';
import { siteConfig } from '../../config/siteConfig';
import { MediaCard } from '../../components/cards/MediaCard';
import { KolamDivider } from '../../components/common/KolamDivider';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { SEO } from '../../components/common/SEO';

export const GalleryPage: React.FC = () => {
  const [activeLightboxAsset, setActiveLightboxAsset] = useState<MediaAsset | null>(null);

  // Gallery displays ONLY live video reels as requested
  const videoAssets: MediaAsset[] = MEDIA_ASSETS.videos;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      <SEO
        title="Live Video Gallery | Auto-Playing Event Feasts & Kitchen Reels"
        description="Watch authentic live videos of Sri Caterers Chennai. Wood-fire biryani dum, traditional banana-leaf feasts, live stalls, and wedding hall catering in action."
        keywords="wedding catering video Chennai, wood fire biryani cooking video, catering reels Chennai, Sri caterers videos, banana leaf feast video"
        canonicalPath="/gallery"
      />

      {/* 1. Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="maroon" size="md">
          <Video className="w-3.5 h-3.5 mr-1.5 inline text-gold" />
          Live Event Video Reels
        </Badge>
        <h1 className="font-serif text-3xl sm:text-5xl font-black text-maroon-950">
          Live Feast &amp; Kitchen Moments
        </h1>
        <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
          Watch our chefs slow-cooking wood-fire biryani, live buffet counters, and authentic Tamil hospitality. Reels automatically play as you scroll and touch.
        </p>

        {/* User Interaction Guidance Tip */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-gold/40 text-xs font-semibold text-maroon-900 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-gold-dark shrink-0" />
          <span>Auto-plays on scroll • Tap video to pause or play • Tap speaker to unmute</span>
        </div>

        <KolamDivider theme="gold" />
      </div>

      {/* 2. Video Reels Feed Status Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-200">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-3 py-1 rounded-lg bg-maroon-900 text-amber-200 text-xs font-bold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-2" />
            Live Reels ({videoAssets.length} Videos)
          </span>
        </div>

        <div className="text-xs text-stone-500 font-medium">
          Auto-playing vertical video experience
        </div>
      </div>

      {/* 3. Auto-Playing Reels Grid (2 Columns on mobile & tablet, 4 on desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {videoAssets.map((asset) => (
          <MediaCard
            key={asset.id}
            asset={asset}
            onOpenLightbox={(a) => setActiveLightboxAsset(a)}
          />
        ))}
      </div>

      {/* 4. Social Instagram Connect Card with QR Code */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8 sm:p-12 border border-amber-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8 space-y-4">
            <Badge variant="turmeric" size="md">
              <Sparkles className="w-3.5 h-3.5 mr-1 inline" />
              Follow Our Daily Journey
            </Badge>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-maroon-950">
              Catch Real-Time Stories &amp; Daily Feasts on Instagram
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              We regularly publish behind-the-scenes firewood cooking clips, hall decor showcases, and customer tastings from Villivakkam, Perambur, and across Chennai on our official Instagram page.
            </p>
            <div className="pt-2 flex items-center space-x-4">
              <a
                href={siteConfig.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-amber-600 via-rose-600 to-purple-600 text-white font-bold text-sm shadow-md hover:opacity-95 transition-all"
              >
                <Share2 className="w-4 h-4 mr-2" />
                <span>Visit {siteConfig.instagramHandle}</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
              </a>
            </div>
          </div>

          <div className="md:col-span-4 flex justify-center">
            <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-md text-center max-w-[200px]">
              <img
                src="/assets/images/WhatsApp Image 2026-10-11 at 1.28.08 PM.jpeg"
                alt="Sri Caterers Instagram QR"
                className="w-full aspect-square object-contain rounded-lg"
              />
              <p className="text-[11px] font-bold text-stone-700 mt-2">
                Scan to Open Instagram
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Expanded Media Modal / Lightbox */}
      {activeLightboxAsset && (
        <Modal
          isOpen={Boolean(activeLightboxAsset)}
          onClose={() => setActiveLightboxAsset(null)}
          title={activeLightboxAsset.title}
          maxWidth="lg"
        >
          <div className="space-y-4">
            <div className="relative aspect-[9/16] bg-black rounded-2xl overflow-hidden max-h-[75vh] mx-auto">
              <video
                src={activeLightboxAsset.src}
                className="w-full h-full object-contain"
                controls
                autoPlay
                playsInline
              />
            </div>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {activeLightboxAsset.description}
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {activeLightboxAsset.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] px-2.5 py-1 rounded-md bg-stone-100 text-stone-700 font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
