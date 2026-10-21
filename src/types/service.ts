export interface CateringServiceItem {
  id: string;
  slug: string;
  title: string;
  tamilTitle: string;
  shortDescription: string;
  fullDescription: string;
  imageSrc: string;
  menuCardImageSrc: string;
  eventTypesSupported: string[];
  mealStyles: string[];
  guestCountRange: string;
  sampleHighlights: string[];
  popularAddons: string[];
  badgeText?: string;
}
