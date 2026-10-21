export interface MenuItem {
  id: string;
  name: string;
  tamilName?: string;
  category: string;
  description: string;
  isVegetarian: boolean;
  dietaryNorm?: 'pure-veg' | 'halal-non-veg';
  servingNorm?: 'banana-leaf' | 'buffet' | 'live-stall' | 'tiffin-box';
  isPopular?: boolean;
  isChefSpecial?: boolean;
  suggestedStyles?: string[];
  packageAssociation?: string[];
}

export interface MenuPackage {
  id: string;
  name: string;
  tamilName?: string;
  priceTag: string;
  perLeafPrice?: number;
  highlight: string;
  description: string;
  features: string[];
  imageSrc: string;
  flyerImageSrc?: string;
  badge?: string;
  category?: 'leaf-meal' | 'wedding-grand' | 'event-management' | 'tariff-card';
  dietaryNorm?: 'pure-veg' | 'halal-non-veg' | 'all';
}
