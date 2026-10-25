import { CateringServiceItem } from '../types/service';

export const CATERING_SERVICES: CateringServiceItem[] = [
  {
    id: 'srv-atoz-wedding',
    slug: 'a-to-z-wedding-service',
    title: 'A To Z Wedding Service',
    tamilTitle: 'முழுமையான ஏ டு இசட் திருமண சேவை',
    shortDescription: 'We handle every detail of your wedding, ensuring a seamless, memorable, and joyous celebration.',
    fullDescription: 'At SRI Wedding Caterers, we offer a complete range of wedding and event services designed to make your special day truly unforgettable. From initial muhurtham planning, traditional banana leaf feasts, and live counters to stage floral decoration, Chenda Melam, bridal styling, photography, and hospitality management.',
    imageSrc: '/assets/images/services/atoz-wedding-service.jpg',
    menuCardImageSrc: '/assets/images/WhatsApp Image 2026-10-11 at 1.23.00 PM (1).jpeg',
    menuCardImages: [
      '/assets/images/WhatsApp Image 2026-10-11 at 1.23.00 PM (1).jpeg',
      '/assets/images/WhatsApp Image 2026-10-11 at 1.23.00 PM.jpeg'
    ],
    eventTypesSupported: ['A to Z Wedding (முழு திருமணம்)', 'Muhurtham', 'Reception (வரவேற்பு)', 'Sangeet'],
    mealStyles: ['Traditional Banana Leaf (இலை சாப்பாடு)', 'Royal Banquet Buffet', 'Live Chef Counters'],
    guestCountRange: '300 to 3,000+ Guests',
    sampleHighlights: [
      'Complete end-to-end wedding execution & guest hospitality',
      'Authentic Wood-Fire Dum Biryani & 18+ Item Banana Leaf Feast',
      'Stage Floral Mandap Decoration & Entrance Arch',
      'Chenda Melam Live Band & Welcome Girls',
      'Bridal HD Makeup & Reception Jothika Garlands'
    ],
    popularAddons: ['Photography & 4K Videography', 'DJ Music with Sound System', 'Live Mojito Bar'],
    badgeText: 'All-Inclusive Signature'
  },
  {
    id: 'srv-ac-wedding-hall',
    slug: 'ac-wedding-hall',
    title: 'A/C Wedding Hall',
    tamilTitle: 'குளிர்சாதன திருமண மண்டபம்',
    shortDescription: 'Celebrate in comfort and style with our fully air-conditioned wedding halls, designed to host your guests.',
    fullDescription: 'Celebrate in comfort and style with our fully air-conditioned wedding halls, designed to host your guests in Chennai (Villivakkam, Perambur, Kolathur, Anna Nagar & surrounding areas). Featuring spacious dining halls, crystal chandeliers, air-conditioned bridal suites, power backup, and full catering logistics.',
    imageSrc: '/assets/images/services/ac-wedding-hall.jpg',
    menuCardImageSrc: '/assets/images/newbjhbj.png',
    eventTypesSupported: ['Wedding Reception', 'A/C Hall Banquet', 'Corporate Conclave', 'Engagement'],
    mealStyles: ['Centralized A/C Dining Hall', 'Seated Banana Leaf Service', 'Executive Buffet'],
    guestCountRange: '200 to 2,500+ Guests',
    sampleHighlights: [
      'Centrally Air-Conditioned Main Hall & Dining Capacity',
      'Crystal Chandelier Lighting & Regal Ambience',
      'Spacious Dining Hall with neat table layouts and roll paper',
      'Air-conditioned Bridal & Groom Suites',
      'Dedicated power backup generator & valet parking'
    ],
    popularAddons: ['Hall Floral Theme Styling', 'DJ Acoustic Sound Engineering', 'Entrance Lighting Illumination'],
    badgeText: 'Comfort & Luxury'
  },
  {
    id: 'srv-wedding',
    slug: 'tamil-wedding-catering',
    title: 'Tamil Wedding Catering',
    tamilTitle: 'பாரம்பரிய திருமண விருந்து',
    shortDescription: 'Grand royal wedding banquets featuring authentic plantain-leaf feasts, traditional sweets, and slow-cooked wood-fire dum biryani.',
    fullDescription: 'Our signature Tamil wedding catering blends centuries-old South Indian wedding culinary traditions with royal presentation. From auspicious early morning Muhurtham breakfast to the grand evening reception banquet, our culinary team and uniformed service staff deliver an unforgettable feast for your guests.',
    imageSrc: '/assets/images/services/wedding-catering.jpg',
    menuCardImageSrc: '/assets/images/WhatsApp Image 2026-10-11 at 1.22.11 PM.jpeg',
    eventTypesSupported: ['Wedding (திருமணம்)', 'Muhurtham', 'Reception (வரவேற்பு)'],
    mealStyles: ['Traditional Banana Leaf (இலை சாப்பாடு)', 'Royal Buffet', 'Live Chef Counters'],
    guestCountRange: '200 to 3,000+ Guests',
    sampleHighlights: [
      'Authentic Wood-Fire Dum Biryani (100% Halal options available)',
      'Traditional Plantain-Leaf Meals with 18+ accompaniments',
      'Elaneer Payasam & Royal Bread Halwa',
      'Trained uniformed supply boys & spotless dining hall management'
    ],
    popularAddons: ['Chenda Melam Band', 'Reception Garlands (Jothika Malai)', 'Bridal Makeup', 'Live Mojito Stalls'],
    badgeText: 'Most Popular'
  },
  {
    id: 'srv-engagement',
    slug: 'engagement-reception-catering',
    title: 'Engagement & Reception Catering',
    tamilTitle: 'நிச்சயதார்த்தம் & வரவேற்பு விருந்து',
    shortDescription: 'Memorable feasts with interactive live stalls, signature mocktails, North & South Indian spreads, and DJ entertainment.',
    fullDescription: 'Celebrate your union with a vibrant and festive dining spread. We offer fusion catering with live Chaat stalls, hot Dosai stations, Italian pasta counters alongside traditional Tamil dum biryanis, gravies, and exquisite dessert spreads.',
    imageSrc: '/assets/images/services/engagement-reception.jpg',
    menuCardImageSrc: '/assets/images/WhatsApp Image 2026-10-16 at 8.07.40 PM.jpeg',
    eventTypesSupported: ['Engagement (நிச்சயதார்த்தம்)', 'Sangeet', 'Reception (வரவேற்பு)'],
    mealStyles: ['Executive Buffet Spread', 'Live Interactive Stalls', 'Sit-down VIP Service'],
    guestCountRange: '150 to 1,500+ Guests',
    sampleHighlights: [
      'Live Stalls: Mojito Bar, Ice Cream Mukkani, Hot Beeda',
      'Crispy Chicken 65, Mutton Kola Urundai & Seer Fish Fry',
      'Paneer Butter Masala with Hot Rumali Roti',
      'PA System & Disc Jockey setup'
    ],
    popularAddons: ['Stage & Dining Floral Decor', 'Popcorn & Cotton Candy', 'Live Chocolate Fountain'],
    badgeText: 'Festive Favorite'
  },
  {
    id: 'srv-family',
    slug: 'traditional-family-functions',
    title: 'Traditional Family Functions',
    tamilTitle: 'குடும்ப சுபநிகழ்ச்சிகள் விருந்து',
    shortDescription: 'Auspicious celebratory catering for Seemantham (Baby Shower), Manjal Neerattu Vizha, and Upanayanam.',
    fullDescription: 'Every milestone in a Tamil family is sanctified with food prepared with devotion, pure ghee, and auspicious ingredients. We specialize in custom multi-course feasts honoring traditions like Seemantham, Ear Piercing, Puberty Ceremony, and 60th / 80th Birthdays (Sashtiabdapoorthi & Sadhabishekam).',
    imageSrc: '/assets/images/services/family-functions.jpg',
    menuCardImageSrc: '/assets/images/WhatsApp Image 2026-10-16 at 8.07.42 PM (2).jpeg',
    eventTypesSupported: ['Baby Shower / Seemantham (சீமந்தம்)', 'Puberty Function (மஞ்சள் நீராட்டு)', 'Ayushya Homam', 'Sashtiabdapoorthi'],
    mealStyles: ['Traditional Banana Leaf Seating', 'Authentic Family Feast'],
    guestCountRange: '50 to 500 Guests',
    sampleHighlights: [
      '5-Variety Auspicious Rice Platter (Lemon, Tamarind, Coconut, Curd, Bisibelebath)',
      'Rich Siruparupu Payasam & Medu Vadai',
      'Fresh Poriyal, Kootu & Vatha Kuzhambu',
      'Water bottles & roll paper provided for every guest'
    ],
    popularAddons: ['Return Gift Sweet Boxes', 'Chenda Melam', 'Traditional Garlands']
  },
  {
    id: 'srv-birthday',
    slug: 'birthday-anniversary-catering',
    title: 'Birthday & Anniversary Catering',
    tamilTitle: 'பிறந்த நாள் & திருமண நாள் விருந்து',
    shortDescription: 'Fun, flavourful parties with live snack stalls, kid-friendly treats, biryani platters, and decadent desserts.',
    fullDescription: 'Make milestone birthdays and wedding anniversaries stress-free and delicious. From kids birthday parties featuring live cotton candy, popcorn, and chocolate fountains to sophisticated silver/golden jubilee sit-down dinners, we manage everything from food to hospitality.',
    imageSrc: '/assets/images/services/birthday-catering.jpg',
    menuCardImageSrc: '/assets/images/WhatsApp Image 2026-10-07 at 9.29.39 PM.jpeg',
    eventTypesSupported: ['Birthday Party (பிறந்த நாள்)', 'Anniversary Celebration', 'Get-Togethers'],
    mealStyles: ['Party Buffet', 'Live Snacks & Finger Foods', 'Bento Platter Boxes'],
    guestCountRange: '30 to 400 Guests',
    sampleHighlights: [
      'Live Popcorn Machine & Spinning Cotton Candy',
      'Mini Chicken & Veg Biryani boxes with Raitha & Halwa',
      'Hot Bonda, Bajji & White Chutney live counters',
      'Customised celebration mocktails'
    ],
    popularAddons: ['Themed Cake Table Setup', 'Live Balloon Artists', 'DJ Music']
  },
  {
    id: 'srv-corporate',
    slug: 'corporate-catering',
    title: 'Corporate Catering & Conferences',
    tamilTitle: 'நிறுவன நிகழ்வுகள் & கருத்தரங்குகள்',
    shortDescription: 'Punctual, hygienic executive meal boxes, conference buffet spreads, and live high-tea counters for Chennai IT corridors.',
    fullDescription: 'Serving leading corporate offices, IT parks in Porur, Guindy, OMR, and Perambur. We provide structured corporate lunches, annual general meetings, product launches, and client appreciation luncheons with zero delay, high hygiene standards, and GST compliance.',
    imageSrc: '/assets/images/services/corporate-catering.jpg',
    menuCardImageSrc: '/assets/images/WhatsApp Image 2026-10-16 at 8.07.42 PM.jpeg',
    eventTypesSupported: ['Corporate Conferences', 'Annual Team Meets', 'Product Launches', 'Office Celebrations'],
    mealStyles: ['Executive Corporate Buffet', 'Packed Bento Meal Boxes', 'Live High Tea & Coffee Station'],
    guestCountRange: '40 to 2,000+ Attendees',
    sampleHighlights: [
      'Live Automatic Tea & Filter Coffee dispensing machines',
      'Nutritious Executive Thali & Biryani platters',
      'Assorted healthy salads, fresh cut fruits & juices',
      'Professional service boys with uniform aprons'
    ],
    popularAddons: ['High Tea Snacks Bar', 'Mineral Water Dispensers', 'Custom Corporate Branding']
  },
  {
    id: 'srv-housewarming',
    slug: 'housewarming-ceremonies',
    title: 'Housewarming Ceremonies (Grahapravesam)',
    tamilTitle: 'புதுமனை புகுவிழா விருந்து',
    shortDescription: 'Pure traditional vegetarian banquets with fresh milk boiling auspiciousness, filter coffee, and plantain leaf feasts.',
    fullDescription: 'Bless your new home with auspicious flavours. We organize the dawn milk-boiling coffee service, breakfast of steaming idlis, crispy medu vadai, and ghee pongal, followed by an opulent afternoon banana-leaf lunch for family and well-wishers.',
    imageSrc: '/assets/images/services/housewarming-ceremony.jpg',
    menuCardImageSrc: '/assets/images/WhatsApp Image 2026-10-16 at 8.13.20 PM.jpeg',
    eventTypesSupported: ['Housewarming / Grahapravesam (புதுமனை புகுவிழா)', 'Bhoomi Pooja'],
    mealStyles: ['Traditional Banana Leaf (இலை சாப்பாடு)', 'Breakfast Buffet'],
    guestCountRange: '50 to 500 Guests',
    sampleHighlights: [
      'Early Morning Hot Kumbakonam Degree Coffee',
      'Ghee Pongal, Poori Masala & Mini Idly Sambar',
      '14-Dish Traditional Brahmin / Chettinad Veg Feast',
      'Hot Kasi Halwa / Badam Halwa'
    ],
    popularAddons: ['Banana Tree & Entrance Thoranam', 'Return Gift Prasadam Packets']
  },
  {
    id: 'srv-temple',
    slug: 'temple-religious-functions',
    title: 'Temple & Religious Annadhanam',
    tamilTitle: 'கோவில் திருவிழா & அன்னதானம்',
    shortDescription: 'Pure, pious vegetarian prasadam preparation and large-scale bulk annadhanam cooked with sanctity.',
    fullDescription: 'Specialized bulk catering for temple kumbhabhishekam, annual car festivals, and devotional gatherings. Prepared strictly according to traditional sattvic rules without onion or garlic upon request, using pure cow ghee and traditional firewood cooking methods.',
    imageSrc: '/assets/images/services/temple-annadhanam.jpg',
    menuCardImageSrc: '/assets/images/catlog1.png',
    menuCardImages: [
      '/assets/images/catlog1.png',
      '/assets/images/catlog2.png',
      '/assets/images/catlog3.png'
    ],
    eventTypesSupported: ['Kumbhabhishekam', 'Mandala Pooja', 'Annadhanam', 'Sastha Preethi'],
    mealStyles: ['Bulk Leaf Annadhanam', 'Prasadam Distribution Boxes'],
    guestCountRange: '100 to 5,000+ Devotees',
    sampleHighlights: [
      'Temple Sambar Sadham & Puliyodharai (Tamarind Rice)',
      'Sweet Sakkarai Pongal with abundant cashews & ghee',
      'Curd Rice with Pomegranate & More Milagai',
      'Clean eco-friendly leaf plates and water distribution'
    ],
    popularAddons: ['Prasadam Laddu Packing', 'Volunteer Meal Supply']
  },
  {
    id: 'srv-festivals',
    slug: 'festival-catering',
    title: 'Festival Catering (விழாக்கள் விருந்து)',
    tamilTitle: 'பண்டிகைகள் மற்றும் சிறப்பு விருந்து',
    shortDescription: 'Seasonal festive menus celebrating Pongal, Diwali, Tamil New Year, Navratri, and Ramzan Eid feasts.',
    fullDescription: 'Experience festive warmth with traditional heritage dishes made specifically for seasonal celebrations. Whether its sugarcane and Sakkarai Pongal during harvest season, Eid wood-fire biryani feasts, or Navratri Sundal spreads, we bring festive joy to your doorstep.',
    imageSrc: '/assets/images/services/festival-catering.jpg',
    menuCardImageSrc: '/assets/images/WhatsApp Image 2026-10-07 at 9.29.06 PM.jpeg',
    eventTypesSupported: ['Pongal Festival', 'Diwali Celebrations', 'Ramzan Eid Feast', 'Tamil New Year'],
    mealStyles: ['Festive Banana Leaf', 'Family Platter Combos'],
    guestCountRange: '30 to 1,000 Guests',
    sampleHighlights: [
      'Authentic Wood Fire Mutton & Chicken Biryani',
      'Special Halwa Varieties (Bread, Kasi, Badam)',
      'Sundal Varieties & Traditional Murukku Combos',
      'Fresh fruit juices & traditional buttermilk'
    ],
    popularAddons: ['Gift Sweet Boxes', 'Festive Hall Decoration']
  },
  {
    id: 'srv-bulk-stalls',
    slug: 'bulk-meal-orders-live-stalls',
    title: 'Bulk Meal Orders & Live Stalls',
    tamilTitle: 'மொத்த உணவு பார்சல்கள் & நேரடி ஸ்டால்கள்',
    shortDescription: 'Hygienic packed food delivery for large groups, film shoots, tour groups, plus interactive event stalls.',
    fullDescription: 'Need packed meal parcels delivered on time across Chennai? Or looking to add exciting live food stalls to your existing venue? We offer hot packed lunch/dinner boxes and individual live food stalls with professional equipment and attendants.',
    imageSrc: '/assets/images/services/bulk-stalls-catering.jpg',
    menuCardImageSrc: '/assets/images/WhatsApp Image 2026-10-16 at 8.07.41 PM (1).jpeg',
    eventTypesSupported: ['Film Shoot Catering', 'Tour Groups & Pilgrimages', 'Exhibitions & Carnivals'],
    mealStyles: ['Hygienic Thermal Packed Boxes', 'Stand-alone Food Stalls'],
    guestCountRange: '50 to 5,000 Parcels',
    sampleHighlights: [
      'Leak-proof high-grade thermal food containers',
      'Live Stalls: Mojito Live, Pani Poori, Ice Cream, Hot Chai',
      'Complimentary water bottle, banana leaf & tissue roll',
      'Dedicated delivery van with thermal warmers'
    ],
    popularAddons: ['Customised Box Printing', 'Event Attendants']
  }
];
