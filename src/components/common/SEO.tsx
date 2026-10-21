import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalPath?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'business.business';
  schema?: Record<string, unknown> | Array<Record<string, unknown>>;
}

const DEFAULT_TITLE = 'Sri Caterers Chennai | Authentic Tamil Nadu Catering & Royal Event Management';
const DEFAULT_DESC =
  'Sri Caterers Chennai offers authentic Tamil Nadu catering. Traditional banana leaf wedding feasts, wood-fire mutton biryani, live snack stalls, and complete event management. Pure vegetarian & Halal non-veg packages from ₹149/leaf.';
const DEFAULT_KEYWORDS =
  'Tamil Nadu catering, Chennai caterers, wedding catering Chennai, banana leaf meals Chennai, wood fire biryani Chennai, Sri Caterers Villivakkam, Perambur catering, Seemantham catering Chennai, Muhurtham feast';
const SITE_URL = 'https://sricaterers.in';
const DEFAULT_OG_IMAGE = 'https://sricaterers.in/assets/images/WhatsApp%20Image%202026-10-07%20at%209.30.46%20PM.jpeg';

export const SEO: React.FC<SEOProps> = ({
  title,
  description = DEFAULT_DESC,
  keywords = DEFAULT_KEYWORDS,
  canonicalPath,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  schema,
}) => {
  const location = useLocation();
  const currentPath = canonicalPath || location.pathname;
  const canonicalUrl = `${SITE_URL}${currentPath === '/' ? '' : currentPath}`;
  const fullTitle = title ? `${title} | Sri Caterers Chennai` : DEFAULT_TITLE;

  useEffect(() => {
    // 1. Update Title
    document.title = fullTitle;

    // Helper to update or create meta tags
    const setMetaTag = (attribute: 'name' | 'property', key: string, content: string) => {
      let element = document.querySelector(`meta[${attribute}="${key}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 2. Primary Meta Tags
    setMetaTag('name', 'description', description);
    setMetaTag('name', 'keywords', keywords);
    setMetaTag('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    setMetaTag('name', 'geo.region', 'IN-TN');
    setMetaTag('name', 'geo.placename', 'Chennai');
    setMetaTag('name', 'geo.position', '13.1075;80.2058');
    setMetaTag('name', 'ICBM', '13.1075, 80.2058');

    // 3. Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // 4. Open Graph Meta Tags
    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:image', ogImage);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:site_name', 'Sri Caterers Chennai');
    setMetaTag('property', 'og:locale', 'en_IN');

    // 5. Twitter Card Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', fullTitle);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', ogImage);

    // 6. JSON-LD Structured Data
    const SCRIPT_ID = 'route-schema-jsonld';
    let scriptTag = document.getElementById(SCRIPT_ID);

    if (schema) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = SCRIPT_ID;
        scriptTag.setAttribute('type', 'application/ld+json');
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(schema);
    } else if (scriptTag) {
      scriptTag.remove();
    }
  }, [fullTitle, description, keywords, canonicalUrl, ogImage, ogType, schema]);

  return null;
};
