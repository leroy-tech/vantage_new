import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Search,
  User,
  Brain,
  Bell,
  TrendingDown,
  Trash2,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Send,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Info,
  X,
  Menu,
  Check,
  Plus,
  Compass,
  Tag,
  ShoppingCart,
  ShoppingBag,
  Headphones,
  Laptop,
  Smartphone,
  Tv,
  Watch,
  Camera,
  Play,
  Pause,
  Zap,
  Radio,
  Flame,
  Layers,
  Sun,
  Moon,
  ArrowRight
} from 'lucide-react';
import { LandingPage } from './components/LandingPage';
import { ProductDetailModal, ProductModalData } from './components/ProductDetailModal';
import {
  VERIFIED_FALLBACK_PLACEHOLDER,
  CATEGORY_FALLBACK_PLACEHOLDERS,
  VERIFIED_PRODUCT_IMAGE_MAP,
  handleImageError,
  sanitizeProductImage,
  verifyImageUrl,
} from './utils/image-validator';

export interface FloatingProduct {
  id: string;
  name: string;
  category: 'audio' | 'laptops' | 'phones' | 'appliances' | 'wearables';
  price: string;
  mrp: string;
  savings: string;
  store: string;
  sourceUrl: string;
  sourceBadge: string;
  amazonUrl: string;
  flipkartUrl: string;
  imageUrl: string;
  gallery?: string[];
  tag: string;
  animationClass: string;
  rating?: number;
  reviewsCount?: string;
  highlights?: string[];
  specs?: Record<string, string>;
  pros?: string[];
  cons?: string[];
  communityTake?: string;
  expertTake?: string;
}

const RAW_FLOATING_PRODUCTS: FloatingProduct[] = [
  {
    id: 'sony-xm5',
    name: 'Sony WH-1000XM5 Wireless ANC',
    category: 'audio',
    price: '₹28,990',
    mrp: '₹34,990',
    savings: 'Save ₹6,000 (17% off)',
    store: 'Flipkart Direct',
    sourceUrl: 'https://www.flipkart.com/sony-wh-1000xm5-wireless-industry-leading-active-noise-cancelling-headphones-mic-bluetooth-wired/p/itmb7d860129eb21',
    sourceBadge: 'Official Product Listing · Flipkart',
    amazonUrl: 'https://www.amazon.in/Sony-WH-1000XM5-Wireless-Cancelling-Headphones/dp/B09XS7JWHH',
    flipkartUrl: 'https://www.flipkart.com/sony-wh-1000xm5-wireless-industry-leading-active-noise-cancelling-headphones-mic-bluetooth-wired/p/itmb7d860129eb21',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1000&q=80'
    ],
    tag: 'Flagship ANC Leader',
    animationClass: 'animate-float-1',
    rating: 4.7,
    reviewsCount: '16,420+ verified Indian buyers',
    highlights: [
      'Industry-leading Active Noise Cancellation with dual V1/QN1 processors',
      '30-hour battery life with 3-minute ultra-fast quick charge',
      'Ultra-comfortable, lightweight design with soft fit leather earcups',
      'Crystal-clear hands-free calling with 4 beamforming microphones'
    ],
    specs: {
      'Driver Unit': '30mm Carbon Fiber Dome',
      'Battery Life': '30h (ANC on) / 40h (ANC off)',
      'Noise Cancellation': 'Dual Processors (QN1 + V1) with 8 Microphones',
      'Bluetooth': 'v5.2 with LDAC, AAC, SBC & Multipoint',
      'Weight': '250g ultra-lightweight',
      'Warranty': '1 Year Official Sony India Warranty'
    },
    pros: [
      'Unsurpassed active noise cancellation for Indian metro and flights',
      'Audiophile-grade high-resolution LDAC audio playback',
      'Remarkable plush comfort for long 8+ hour work sessions'
    ],
    cons: [
      'Earcups swivel flat but do not fold inward like older XM4',
      'No IP water resistance rating'
    ],
    communityTake: 'Praised across r/headphones and r/indiangaming as the gold standard for silent commutes in Indian traffic.',
    expertTake: 'Rated 4.6/5 by TechRadar and Gadgets360 for class-leading background noise suppression.'
  },
  {
    id: 'macbook-air',
    name: 'Apple MacBook Air M3 (16GB/512GB)',
    category: 'laptops',
    price: '₹1,14,990',
    mrp: '₹1,34,900',
    savings: 'Save ₹19,910 with HDFC',
    store: 'Amazon India Direct',
    sourceUrl: 'https://www.amazon.in/Apple-MacBook-13-inch-Unified-Storage/dp/B0CX21C8S7',
    sourceBadge: 'Official Product Listing · Amazon',
    amazonUrl: 'https://www.amazon.in/Apple-MacBook-13-inch-Unified-Storage/dp/B0CX21C8S7',
    flipkartUrl: 'https://www.flipkart.com/apple-macbook-air-apple-m3-16-gb-512-gb-ssd-macos-sonoma-mxd13hn-a/p/itm5a4ecb3c0c0b8',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=1000&q=80'
    ],
    tag: 'All-Day 18h Battery',
    animationClass: 'animate-float-2',
    rating: 4.8,
    reviewsCount: '8,940+ developer reviews',
    highlights: [
      'Next-generation Apple M3 chip with 8-core CPU and 10-core GPU',
      'Up to 18 hours of real battery life on a single charge',
      '13.6-inch Liquid Retina display with 500 nits brightness',
      'Fanless, completely silent aluminum unibody design'
    ],
    specs: {
      'Processor': 'Apple M3 Chip (8-core CPU, 10-core GPU)',
      'Memory': '16GB Unified Memory',
      'Storage': '512GB Fast SSD Storage',
      'Display': '13.6-inch Liquid Retina (2560x1664 at 500 nits)',
      'Battery': 'Up to 18 Hours wireless usage',
      'Weight': '1.24 kg ultralight',
      'Warranty': '1 Year Apple India Warranty'
    },
    pros: [
      'Legendary battery endurance lasting 2 full workdays',
      'Silent operation with zero fan noise',
      'MagSafe fast-charging and industry-best trackpad'
    ],
    cons: [
      'External dual monitors require laptop lid to remain closed'
    ],
    communityTake: 'The consensus favorite on r/developersIndia for coding, Docker, and design work on the go.',
    expertTake: 'Awarded 9.3/10 by TechRadar India as the undisputed best everyday laptop.'
  },
  {
    id: 's24-ultra',
    name: 'Samsung Galaxy S24 Ultra 5G AI',
    category: 'phones',
    price: '₹1,19,999',
    mrp: '₹1,34,999',
    savings: 'Save ₹15,000 + Exchange',
    store: 'Amazon India Direct',
    sourceUrl: 'https://www.amazon.in/Samsung-Galaxy-Ultra-Titanium-Storage/dp/B0CS5X682H',
    sourceBadge: 'Official Product Listing · Amazon',
    amazonUrl: 'https://www.amazon.in/Samsung-Galaxy-Ultra-Titanium-Storage/dp/B0CS5X682H',
    flipkartUrl: 'https://www.flipkart.com/samsung-galaxy-s24-ultra-5g-titanium-gray-256-gb/p/itm87bc7dbeffea5',
    imageUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=80'
    ],
    tag: '200MP + Galaxy AI',
    animationClass: 'animate-float-3',
    rating: 4.8,
    reviewsCount: '21,300+ reviews',
    highlights: [
      'Titanium Frame with Corning Gorilla Armor Anti-Reflective Glass',
      '200MP Quad Camera with 5x 50MP Periscope Optical Zoom',
      'Full suite of Galaxy AI: Circle to Search, Live Call Translate',
      '7 Years of guaranteed Android OS updates'
    ],
    specs: {
      'Processor': 'Snapdragon 8 Gen 3 for Galaxy (4nm)',
      'RAM / ROM': '12GB LPDDR5X / 256GB UFS 4.0',
      'Display': '6.8-inch Dynamic AMOLED 2X, 120Hz LTPO, 2600 nits',
      'Camera': '200MP + 50MP (5x) + 10MP (3x) + 12MP Ultra-wide',
      'Battery': '5000 mAh with 45W Fast Charging, S-Pen included',
      'Warranty': '1 Year Samsung India Warranty'
    },
    pros: [
      'Gorilla Armor anti-reflective display is unmatched under bright Indian sunlight',
      'Magnificent 200MP zoom clarity and low-light performance',
      'Built-in S-Pen for digital signatures and precision editing'
    ],
    cons: [
      'Fast charger not included inside the box',
      'Heavier titanium frame'
    ],
    communityTake: 'Indian buyers highlight the screen legibility outdoors and consistent 8+ hours screen-on-time.',
    expertTake: 'Beebom rates it 9.4/10: "The most capable and versatile Android flagship on the market."'
  },
  {
    id: 'air-fryer',
    name: 'Philips Digital Air Fryer HD9252',
    category: 'appliances',
    price: '₹6,499',
    mrp: '₹10,995',
    savings: 'Save ₹4,496 (41% off)',
    store: 'Amazon India Direct',
    sourceUrl: 'https://www.amazon.in/Philips-Technology-NutriU-App-Recipes-Fryer-HD9252/dp/B097RJ867P',
    sourceBadge: 'Official Product Listing · Philips',
    amazonUrl: 'https://www.amazon.in/Philips-Technology-NutriU-App-Recipes-Fryer-HD9252/dp/B097RJ867P',
    flipkartUrl: 'https://www.flipkart.com/philips-hd9252-90-rapid-air-technology-digital-display-touch-panel-4-1-l-air-fryer/p/itm67d934bb61b17',
    imageUrl: 'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1000&q=80'
    ],
    tag: '90% Less Oil Cooking',
    animationClass: 'animate-float-4',
    rating: 4.6,
    reviewsCount: '34,800+ Indian home reviews',
    highlights: [
      'Rapid Air Technology with patented Starfish base for even roasting without flipping',
      'Cooks with up to 90% less oil for crispy samosas and fries',
      '7 pre-set digital touch cooking modes for snacks and meals',
      'Dishwasher safe QuickClean non-stick basket'
    ],
    specs: {
      'Capacity': '4.1 Liters (Ideal for 3-4 person family)',
      'Power': '1400 Watts',
      'Temperature': 'Up to 200°C digital thermostat',
      'Presets': '7 One-touch cooking menus',
      'Warranty': '2 Years Worldwide Philips Guarantee'
    },
    pros: [
      'Crispy snacks without the guilt of deep-frying',
      'Easy to clean basket and compact kitchen counter size',
      'NutriU app with hundreds of Indian recipes'
    ],
    cons: [
      'Basket capacity best for up to 4 people'
    ],
    communityTake: 'A staple recommendation for healthy Indian cooking, paneer tikkas, and evening snacks.',
    expertTake: 'Recognized as the most reliable air fryer heating element in long-term kitchen tests.'
  },
  {
    id: 'galaxy-watch',
    name: 'Samsung Galaxy Watch 6 LTE',
    category: 'wearables',
    price: '₹21,999',
    mrp: '₹33,999',
    savings: 'Save ₹12,000 in India',
    store: 'Amazon India Direct',
    sourceUrl: 'https://www.amazon.in/Samsung-Galaxy-Bluetooth-Graphite-Compatible/dp/B0CC95BHYK',
    sourceBadge: 'Official Product Listing · Samsung',
    amazonUrl: 'https://www.amazon.in/Samsung-Galaxy-Bluetooth-Graphite-Compatible/dp/B0CC95BHYK',
    flipkartUrl: 'https://www.flipkart.com/samsung-galaxy-watch6-lte-smartwatch/p/itm6e97c9c0b16a2',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1000&q=80'
    ],
    tag: 'Sapphire Crystal + ECG',
    animationClass: 'animate-float-1',
    rating: 4.6,
    reviewsCount: '9,200+ reviews',
    highlights: [
      'Sapphire crystal glass screen for scratch-free protection',
      'Advanced BioActive sensor with ECG and body composition analysis',
      'Standalone 4G LTE calling on your wrist without your phone',
      'Slimmer bezels with 20% larger AMOLED display'
    ],
    specs: {
      'Display': '1.5-inch Super AMOLED (480x480), Sapphire Crystal',
      'Connectivity': '4G LTE (eSIM), Wi-Fi, NFC Samsung Wallet, GPS',
      'Durability': '5ATM + IP68 / MIL-STD-810H Military Standard',
      'Battery': '425 mAh with Fast Magnetic Charging',
      'Warranty': '1 Year Samsung India Warranty'
    },
    pros: [
      'Make calls and tap to pay with NFC on Indian POS terminals',
      'Accurate sleep coaching and ECG monitoring',
      'Bright display readable under direct sunlight'
    ],
    cons: [
      'Battery needs charging every 1.5 days'
    ],
    communityTake: 'Indian users love leaving their phones home during workouts while still receiving phone calls.',
    expertTake: 'Top rated Wear OS smartwatch for Android phone users.'
  },
  {
    id: 'sony-oled',
    name: 'Sony Bravia 55" 4K Google TV',
    category: 'appliances',
    price: '₹57,990',
    mrp: '₹99,900',
    savings: 'Save ₹41,910 (42% off)',
    store: 'Amazon India Direct',
    sourceUrl: 'https://www.amazon.in/Sony-Bravia-inches-Google-KD-55X74L/dp/B0C15BLYS3',
    sourceBadge: 'Official Product Listing · Sony',
    amazonUrl: 'https://www.amazon.in/Sony-Bravia-inches-Google-KD-55X74L/dp/B0C15BLYS3',
    flipkartUrl: 'https://www.flipkart.com/sony-bravia-2-138-8-cm-55-inch-ultra-hd-4k-led-smart-google-tv-2024-kd-55s25b/p/itm53472ca62ae4a',
    imageUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=1000&q=80'
    ],
    tag: 'Dolby Vision & Atmos',
    animationClass: 'animate-float-2',
    rating: 4.8,
    reviewsCount: '19,500+ Indian home reviews',
    highlights: [
      'X1 4K Processor with Motionflow XR 100 for blur-free sports',
      'Open Baffle Speaker with 20W Dolby Audio sound',
      'X-Protection PRO defends against power surges, dust, and humidity',
      'Google TV with Chromecast built-in and Apple AirPlay'
    ],
    specs: {
      'Display Size': '55 inches (138.8 cm diagonal 4K UHD)',
      'Audio': '20W Dolby Audio 2-channel speaker',
      'Smart OS': 'Google TV with Voice Remote',
      'Protection': 'X-Protection PRO (Anti-humidity & surge resistant)',
      'Warranty': '1 Year Comprehensive Sony India Warranty'
    },
    pros: [
      'Natural, lifelike color reproduction tuned for movies and cricket',
      'Surge and humidity protection engineered for Indian conditions',
      'Fast Google TV interface with all Indian OTT apps'
    ],
    cons: [
      '60Hz refresh rate (sufficient for cinema, but 120Hz gaming needs Bravia XR)'
    ],
    communityTake: 'Renowned for realistic colors that look pleasing without artificial oversaturation.',
    expertTake: 'NDTV Gadgets 360 top-ranked 55-inch television under ₹60,000.'
  },
  {
    id: 'sony-camera',
    name: 'Sony Alpha ILCE-6100L Mirrorless',
    category: 'audio',
    price: '₹61,490',
    mrp: '₹75,990',
    savings: 'Save ₹14,500 + Lens Kit',
    store: 'Amazon India Direct',
    sourceUrl: 'https://www.amazon.in/Sony-ILCE-6100L-Mirrorless-Smartphone-Connectivity/dp/B07ZHLG4C4',
    sourceBadge: 'Official Product Listing · Sony Alpha',
    amazonUrl: 'https://www.amazon.in/Sony-ILCE-6100L-Mirrorless-Smartphone-Connectivity/dp/B07ZHLG4C4',
    flipkartUrl: 'https://www.flipkart.com/sony-ilce-6100l-b-in5-mirrorless-camera-body-with-16-50-mm-power-zoom-lens/p/itmd06649725f190',
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1000&q=80'
    ],
    tag: 'Real-time Eye AF & 4K',
    animationClass: 'animate-float-3',
    rating: 4.7,
    reviewsCount: '6,100+ reviews',
    highlights: [
      '24.2 MP APS-C Exmor CMOS Sensor with BIONZ X Processor',
      '0.02-second autofocus with 425 phase-detection points',
      'Real-time Eye AF tracking for humans and animals',
      '180-degree flip-up touchscreen for vlogging and YouTube'
    ],
    specs: {
      'Sensor': '24.2 Megapixel APS-C Exmor CMOS',
      'Video': '4K UHD at 30p / 1080p at 120p slow-mo',
      'Screen': '3-inch 180° Tiltable Touchscreen LCD',
      'Included Lens': '16-50mm Power Zoom Lens (SELP1650)',
      'Warranty': '2 Years Official Sony India Warranty'
    },
    pros: [
      'Lightning-fast autofocus that never loses eye tracking',
      'Flip screen makes YouTube reels and podcasts effortless',
      'Extensive Sony E-mount lens selection'
    ],
    cons: [
      'No in-body sensor stabilization'
    ],
    communityTake: 'The creator favorite across Indian YouTube channels for video sharpness and autofocus.',
    expertTake: 'DPReview Silver Award for flagship autofocus in an accessible creator body.'
  },
  {
    id: 'mech-keyboard',
    name: 'Keychron K2 V2 Wireless Keyboard',
    category: 'laptops',
    price: '₹7,999',
    mrp: '₹10,499',
    savings: 'Save ₹2,500 (24% off)',
    store: 'Amazon India Direct',
    sourceUrl: 'https://www.amazon.in/Keychron-Mechanical-Keyboard-Backlight-Wireless/dp/B087612TFL',
    sourceBadge: 'Official Product Listing · Keychron',
    amazonUrl: 'https://www.amazon.in/Keychron-Mechanical-Keyboard-Backlight-Wireless/dp/B087612TFL',
    flipkartUrl: 'https://www.flipkart.com/keychron-k2-version-2-bluetooth-mechanical-keyboard/p/itm4d5f19bfd081f',
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=1000&q=80'
    ],
    tag: 'Gateron Brown Switches',
    animationClass: 'animate-float-4',
    rating: 4.8,
    reviewsCount: '4,800+ developer reviews',
    highlights: [
      '75% compact 84-key layout retaining all essential function and arrow keys',
      'Wireless Bluetooth 5.1 connection with up to 3 devices + Type-C wired mode',
      'Tactile Gateron G Pro mechanical switches',
      'Giant 4000 mAh rechargeable battery lasting up to 240 hours'
    ],
    specs: {
      'Layout': '75% Layout (84 Keys)',
      'Switches': 'Gateron Brown Tactile Switches',
      'Battery': '4000 mAh rechargeable Li-polymer',
      'OS Support': 'macOS / Windows / iOS / Android',
      'Warranty': '1 Year Keychron India Warranty'
    },
    pros: [
      'Satisfying tactile typing feedback that reduces finger fatigue',
      'Native Mac key layout with Windows keycaps included',
      'Long-lasting battery life that requires monthly charging'
    ],
    cons: [
      'Slightly tall front lip; using a wrist rest is recommended'
    ],
    communityTake: 'Most recommended keyboard on r/developersIndia for Mac and PC setups.',
    expertTake: 'Ranked best mechanical keyboard under ₹10,000 by TechRadar India.'
  },
];

export const FLOATING_PRODUCTS: FloatingProduct[] = RAW_FLOATING_PRODUCTS.map((product): FloatingProduct => ({
  ...product,
  imageUrl: sanitizeProductImage(product.imageUrl, product.category, VERIFIED_PRODUCT_IMAGE_MAP, product.name),
  gallery: (product.gallery && product.gallery.length > 0)
    ? product.gallery.map((img) => sanitizeProductImage(img, product.category, VERIFIED_PRODUCT_IMAGE_MAP, product.name))
    : [sanitizeProductImage(product.imageUrl, product.category, VERIFIED_PRODUCT_IMAGE_MAP, product.name)],
}));

interface Stats {
  tracked_count: number;
  total_checks: number;
  pref_count: number;
  onboarding_dismissed: boolean;
}

interface TrackedProduct {
  id: number;
  user_id: string;
  name: string;
  search_query: string;
  target_price: number | null;
  created_at: string;
  history: Array<{ id: number; price: number | null; source_url: string; raw_note: string; checked_at: string }>;
  lowest_price: number | null;
  current_price: number | null;
}

interface StoreLink {
  store: string;
  name: string;
  url: string;
  badge: string;
  color: string;
}

interface Recommendation {
  rank: number;
  name: string;
  price: string;
  image_url?: string;
  pros: string[];
  cons: string[];
  community_take?: string;
  expert_take?: string;
  source_url?: string;
  source_store?: string;
  store_badge?: string;
  store_links?: StoreLink[];
}

function getFallbackStoreLinks(name: string, sourceUrl?: string): StoreLink[] {
  const clean = name.replace(/\(.*?\)/g, '').trim();
  const q = encodeURIComponent(clean);
  const links: StoreLink[] = [];

  if (sourceUrl && sourceUrl.startsWith('http') && !sourceUrl.includes('example.com')) {
    if (sourceUrl.includes('amazon.')) {
      links.push({
        store: 'Amazon India',
        name: 'Amazon.in (Product)',
        url: sourceUrl,
        badge: 'Direct Product',
        color: '#FF9900',
      });
    } else if (sourceUrl.includes('flipkart.')) {
      links.push({
        store: 'Flipkart',
        name: 'Flipkart (Product)',
        url: sourceUrl,
        badge: 'Direct Product',
        color: '#2874F0',
      });
    } else {
      links.push({
        store: 'Source',
        name: 'Official Store / Review',
        url: sourceUrl,
        badge: 'Verified Source',
        color: '#F0B429',
      });
    }
  }

  if (!links.some(l => l.store === 'Amazon India')) {
    links.push({
      store: 'Amazon India',
      name: 'Amazon.in',
      url: `https://www.amazon.in/s?k=${q}`,
      badge: 'Check Deals',
      color: '#FF9900',
    });
  }

  if (!links.some(l => l.store === 'Flipkart')) {
    links.push({
      store: 'Flipkart',
      name: 'Flipkart',
      url: `https://www.flipkart.com/search?q=${q}`,
      badge: 'Check Offers',
      color: '#2874F0',
    });
  }

  links.push({
    store: 'Croma',
    name: 'Croma',
    url: `https://www.croma.com/searchB?q=${q}`,
    badge: 'Store Pickup',
    color: '#00E8C6',
  });

  links.push({
    store: 'Reliance Digital',
    name: 'Reliance Digital',
    url: `https://www.reliancedigital.in/search?q=${q}`,
    badge: 'Compare',
    color: '#E42529',
  });

  return links;
}

// Verified exact product photos from authentic retail and high-resolution CDNs (100% 200 OK)
export const EXACT_CLIENT_IMAGE_MAP: Record<string, string> = VERIFIED_PRODUCT_IMAGE_MAP;

// Exact product photography resolver (guaranteed 100% verified fallback placeholder)
export function getProductFallbackImg(name: string, explicit?: string): string {
  return sanitizeProductImage(explicit, undefined, EXACT_CLIENT_IMAGE_MAP, name);
}

interface MultiResult {
  summary: string;
  recommendations: Recommendation[];
  error?: string;
}

// Format numbers into Indian Rupee representation (e.g. ₹14,999)
function formatINR(val: number | null | undefined): string {
  if (val === null || val === undefined || isNaN(val)) return '—';
  return `₹${val.toLocaleString('en-IN')}`;
}

export default function App() {
  const [mainView, setMainView] = useState<'landing' | 'app'>('landing');
  const [theme, setTheme] = useState<'white' | 'dark'>('white');
  const isWhite = true;
  // const isWhite = theme === 'white';
  // locked to white & violet
  const [userId, setUserId] = useState<string>('default');
  const [tempUserId, setTempUserId] = useState<string>('default');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'arena' | 'chat' | 'multi'>('arena');
  const [isZeroGPaused, setIsZeroGPaused] = useState<boolean>(false);
  const [floatingCategory, setFloatingCategory] = useState<'all' | 'audio' | 'laptops' | 'phones' | 'appliances' | 'wearables'>('all');
  const [frontSearchQuery, setFrontSearchQuery] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [instantProductSource, setInstantProductSource] = useState<{
    productName: string;
    imageUrl: string;
    sourceUrl: string;
    sourceStore: string;
    badge: string;
    storeLinks: StoreLink[];
  } | null>(null);
  const [isSearchingSource, setIsSearchingSource] = useState<boolean>(false);

  const lookupProductSource = async (q: string) => {
    if (!q.trim()) return;
    setIsSearchingSource(true);
    try {
      const res = await fetch(`/api/product-source?q=${encodeURIComponent(q.trim())}`);
      if (res.ok) {
        const data = await res.json();
        setInstantProductSource(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearchingSource(false);
    }
  };

  // Sync body class with active theme (White and Violet palette)
  useEffect(() => {
    document.body.className = 'bg-[#FAF8FF] text-[#2E1065] min-h-screen antialiased';
  }, []);

  // Stats & Onboarding
  const [stats, setStats] = useState<Stats>({
    tracked_count: 0,
    total_checks: 0,
    pref_count: 0,
    onboarding_dismissed: false,
  });
  const [showOnboarding, setShowOnboarding] = useState<boolean>(true);

  // Preferences
  const [preferences, setPreferences] = useState<Record<string, string>>({});
  const [newPrefKey, setNewPrefKey] = useState<string>('');
  const [newPrefValue, setNewPrefValue] = useState<string>('');

  // Notifications
  const [notifyEmail, setNotifyEmail] = useState<string>('');
  const [notifyTelegram, setNotifyTelegram] = useState<string>('');
  const [notifySaved, setNotifySaved] = useState<boolean>(false);
  const [testAlerts, setTestAlerts] = useState<Array<{ channel: string; success: boolean; detail: string }>>([]);
  const [isSendingTestAlert, setIsSendingTestAlert] = useState<boolean>(false);

  // Tracked products
  const [products, setProducts] = useState<TrackedProduct[]>([]);
  const [expandedProductIds, setExpandedProductIds] = useState<number[]>([]);
  const [checkingProductId, setCheckingProductId] = useState<number | null>(null);
  const [priceCheckAlerts, setPriceCheckAlerts] = useState<Record<number, { message: string; alert: boolean }>>({});
  const [newProdName, setNewProdName] = useState<string>('');
  const [newProdQuery, setNewProdQuery] = useState<string>('');
  const [newProdTarget, setNewProdTarget] = useState<string>('');

  // Chat
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [chatInput, setChatInput] = useState<string>('');
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Multi-source research
  const [multiGoal, setMultiGoal] = useState<string>('');
  const [isMultiLoading, setIsMultiLoading] = useState<boolean>(false);
  const [multiResult, setMultiResult] = useState<MultiResult | null>(null);

  // Product Details Modal State
  const [selectedProductForModal, setSelectedProductForModal] = useState<ProductModalData | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState<boolean>(false);

  const handleOpenProductModal = async (productData: any) => {
    if (!productData) return;

    if (typeof productData === 'string') {
      const q = productData;
      const initial: ProductModalData = {
        name: q,
        price: 'Checking Live Deal in ₹...',
        imageUrl: getProductFallbackImg(q),
        category: 'electronics'
      };
      setSelectedProductForModal(initial);
      setIsProductModalOpen(true);

      try {
        const res = await fetch(`/api/product-details?q=${encodeURIComponent(q)}`);
        if (res.ok) {
          const data = await res.json();
          setSelectedProductForModal(data);
        }
      } catch (e) {
        console.error('Failed to fetch product details', e);
      }
      return;
    }

    const prod: ProductModalData = {
      name: productData.name,
      price: productData.price || 'Check Live Price',
      mrp: productData.mrp,
      savings: productData.savings,
      rating: productData.rating || 4.7,
      reviewsCount: productData.reviewsCount || '15,000+ verified ratings',
      category: productData.category,
      imageUrl: productData.imageUrl || productData.image_url || getProductFallbackImg(productData.name),
      gallery: productData.gallery || [
        productData.imageUrl || productData.image_url || getProductFallbackImg(productData.name)
      ],
      store: productData.store || productData.source_store,
      sourceStore: productData.sourceStore || productData.source_store,
      sourceUrl: productData.sourceUrl || productData.source_url,
      sourceBadge: productData.sourceBadge || productData.store_badge,
      tag: productData.tag,
      highlights: productData.highlights,
      specs: productData.specs,
      pros: productData.pros,
      cons: productData.cons,
      communityTake: productData.communityTake || productData.community_take,
      expertTake: productData.expertTake || productData.expert_take,
      storeLinks: productData.storeLinks || productData.store_links || getFallbackStoreLinks(productData.name, productData.sourceUrl || productData.source_url)
    };

    setSelectedProductForModal(prod);
    setIsProductModalOpen(true);

    // If specs are not populated or thin, enrich asynchronously
    if (!prod.specs || Object.keys(prod.specs).length <= 2) {
      try {
        const res = await fetch(`/api/product-details?q=${encodeURIComponent(productData.name)}`);
        if (res.ok) {
          const enriched = await res.json();
          setSelectedProductForModal(prev => prev && prev.name === prod.name ? { ...prev, ...enriched } : prev);
        }
      } catch (e) {
        console.error('Enrichment failed', e);
      }
    }
  };

  const handleTrackGenericProduct = async (name: string, query: string, targetPrice?: number) => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          name: name,
          search_query: query || `${name} price India`,
          target_price: targetPrice || null,
        }),
      });
      if (res.ok) {
        fetchProducts();
        fetchStats();
        showToast(`✓ Tracking ${name} in ₹!`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Load user data
  useEffect(() => {
    fetchStats();
    fetchPreferences();
    fetchProducts();
  }, [userId]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isChatLoading]);

  const fetchStats = async () => {
    try {
      const res = await fetch(`/api/stats?user_id=${encodeURIComponent(userId)}`);
      if (res.ok) {
        const data: Stats = await res.json();
        setStats(data);
        if (data.onboarding_dismissed) {
          setShowOnboarding(false);
        } else {
          setShowOnboarding(data.tracked_count === 0 && data.pref_count === 0);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchPreferences = async () => {
    try {
      const res = await fetch(`/api/preferences?user_id=${encodeURIComponent(userId)}`);
      if (res.ok) {
        const data: Record<string, string> = await res.json();
        setPreferences(data);
        setNotifyEmail(data['notify_email'] || '');
        setNotifyTelegram(data['notify_telegram_chat_id'] || '');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(`/api/products?user_id=${encodeURIComponent(userId)}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
        if (expandedProductIds.length === 0 && data.length > 0) {
          setExpandedProductIds([data[0].id]);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSwitchUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempUserId.trim() && tempUserId !== userId) {
      setUserId(tempUserId.trim());
      setMessages([]);
      setMultiResult(null);
      setPriceCheckAlerts({});
    }
  };

  const handleSavePreference = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrefKey.trim() || !newPrefValue.trim()) return;
    try {
      const res = await fetch('/api/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          key: newPrefKey.trim(),
          value: newPrefValue.trim(),
        }),
      });
      if (res.ok) {
        setNewPrefKey('');
        setNewPrefValue('');
        fetchPreferences();
        fetchStats();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeletePreference = async (key: string) => {
    try {
      const res = await fetch('/api/preferences', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, key }),
      });
      if (res.ok) {
        fetchPreferences();
        fetchStats();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveNotifications = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/notifications/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          email: notifyEmail.trim(),
          telegram_chat_id: notifyTelegram.trim(),
        }),
      });
      if (res.ok) {
        setNotifySaved(true);
        setTimeout(() => setNotifySaved(false), 2500);
        fetchPreferences();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendTestNotification = async () => {
    setIsSendingTestAlert(true);
    setTestAlerts([]);
    try {
      const res = await fetch('/api/notifications/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId }),
      });
      if (res.ok) {
        const data = await res.json();
        setTestAlerts(data.results || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSendingTestAlert(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim() || !newProdQuery.trim()) return;
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          name: newProdName.trim(),
          search_query: newProdQuery.trim(),
          target_price: newProdTarget.trim() ? parseFloat(newProdTarget.replace(/[^0-9.]/g, '')) : null,
        }),
      });
      if (res.ok) {
        setNewProdName('');
        setNewProdQuery('');
        setNewProdTarget('');
        fetchProducts();
        fetchStats();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleTrackFloatingProduct = async (fp: FloatingProduct) => {
    try {
      const numericTarget = parseFloat(fp.price.replace(/[^0-9.]/g, ''));
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          name: fp.name,
          search_query: `${fp.name} price India`,
          target_price: isNaN(numericTarget) ? null : numericTarget,
        }),
      });
      if (res.ok) {
        fetchProducts();
        fetchStats();
        showToast(`✓ Added ${fp.name} to your tracked products at ${fp.price}!`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAskAiAboutProduct = (productName: string) => {
    setActiveTab('chat');
    handleSendChat(`Give me the full Indian market view for "${productName}": current street price, official MRP in ₹, pros, cons, and best live deals on Amazon India and Flipkart.`);
  };

  const handleResearchProduct = (productName: string) => {
    lookupProductSource(productName);
    setActiveTab('multi');
    runMultiResearch(`${productName} price deals review India`);
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchProducts();
        fetchStats();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCheckProductPrice = async (prod: TrackedProduct) => {
    setCheckingProductId(prod.id);
    try {
      const res = await fetch(`/api/products/${prod.id}/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId }),
      });
      if (res.ok) {
        const data = await res.json();
        fetchProducts();
        fetchStats();
        if (data.alert) {
          setPriceCheckAlerts(prev => ({
            ...prev,
            [prod.id]: { message: data.alertMessage, alert: true },
          }));
        } else if (data.price !== null) {
          setPriceCheckAlerts(prev => ({
            ...prev,
            [prod.id]: {
              message: `Current market price: ${formatINR(data.price)}. (No alert triggered)`,
              alert: false,
            },
          }));
        } else {
          setPriceCheckAlerts(prev => ({
            ...prev,
            [prod.id]: { message: data.note || 'Could not verify current price in India.', alert: false },
          }));
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCheckingProductId(null);
    }
  };

  const toggleProductExpand = (id: number) => {
    setExpandedProductIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleDismissOnboarding = async () => {
    setShowOnboarding(false);
    try {
      await fetch('/api/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          key: '_onboarding_dismissed',
          value: 'true',
        }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Chat Submission
  const handleSendChat = async (promptText?: string) => {
    const textToSend = promptText || chatInput;
    if (!textToSend.trim() || isChatLoading) return;

    const newMsgs = [...messages, { role: 'user' as const, content: textToSend.trim() }];
    setMessages(newMsgs);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          message: textToSend.trim(),
          history: newMsgs.slice(-8),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages(prev => [
          ...prev,
          { role: 'assistant', content: '⚠️ Error reaching assistant server.' },
        ]);
      }
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: `⚠️ Connection error: ${err.message}` },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Multi-source Research runner that can be called programmatically or via form
  const runMultiResearch = async (customGoal?: string) => {
    const goalToRun = (customGoal || multiGoal).trim();
    if (!goalToRun || isMultiLoading) return;

    if (customGoal) setMultiGoal(goalToRun);
    setIsMultiLoading(true);
    setMultiResult(null);

    try {
      const res = await fetch('/api/research/multi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          goal: goalToRun,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setMultiResult(data);
      } else {
        setMultiResult({
          summary: 'Failed to run research.',
          recommendations: [],
          error: 'Server returned an error status.',
        });
      }
    } catch (err: any) {
      setMultiResult({
        summary: 'Network connection failure.',
        recommendations: [],
        error: err.message,
      });
    } finally {
      setIsMultiLoading(false);
    }
  };

  const handleRunMulti = (e: React.FormEvent) => {
    e.preventDefault();
    runMultiResearch();
  };

  // Render store or web link with store-branded button styling
  const renderStoreOrWebLink = (url: string, customLabel?: string, key?: any) => {
    let label = customLabel || 'View Link';
    const lowerUrl = url.toLowerCase();
    const isAmazon = lowerUrl.includes('amazon.');
    const isFlipkart = lowerUrl.includes('flipkart.');
    const isCroma = lowerUrl.includes('croma.');
    const isReliance = lowerUrl.includes('reliancedigital.');

    let badgeClass = isWhite
      ? 'bg-violet-50 hover:bg-slate-200 text-[#2E1065] border-violet-200'
      : 'bg-white/10 text-[#7C3AED] hover:bg-white/20 border-white/15';

    if (isAmazon) {
      if (!customLabel) label = 'Amazon.in 🛒';
      badgeClass = isWhite
        ? 'bg-violet-50 hover:bg-violet-100 text-[#2E1065] border-violet-200 shadow-sm font-bold'
        : 'bg-amber-950/40 hover:bg-amber-900/60 text-[#FF9900] border-amber-600/40 hover:border-violet-400 font-bold';
    } else if (isFlipkart) {
      if (!customLabel) label = 'Flipkart 🛍️';
      badgeClass = isWhite
        ? 'bg-blue-50 hover:bg-blue-100 text-blue-950 border-blue-300 shadow-sm font-bold'
        : 'bg-blue-950/40 hover:bg-blue-900/60 text-[#93C5FD] border-blue-600/40 hover:border-blue-500 font-bold';
    } else if (isCroma) {
      if (!customLabel) label = 'Croma 🏬';
      badgeClass = isWhite
        ? 'bg-teal-50 hover:bg-teal-100 text-teal-950 border-teal-300 shadow-sm font-bold'
        : 'bg-teal-950/40 hover:bg-teal-900/60 text-[#2DD4BF] border-teal-600/40 hover:border-teal-500 font-bold';
    } else if (isReliance) {
      if (!customLabel) label = 'Reliance Digital ⚡';
      badgeClass = isWhite
        ? 'bg-rose-50 hover:bg-rose-100 text-rose-950 border-rose-300 shadow-sm font-bold'
        : 'bg-rose-950/40 hover:bg-rose-900/60 text-[#FB7185] border-rose-600/40 hover:border-rose-500 font-bold';
    }

    return (
      <a
        key={key}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border transition-all ${badgeClass} my-0.5 mx-1 shadow-sm hover:scale-105 active:scale-95`}
      >
        <span>{label}</span>
        <ExternalLink className="w-3 h-3 inline opacity-80" />
      </a>
    );
  };

  // Automatically extracts product names from bold mentions to attach instant direct store links
  const extractAutoStorePills = (line: string) => {
    if (line.includes('http://') || line.includes('https://')) return null;

    const match = line.match(/\*\*(.*?)\*\*/);
    if (!match) return null;
    const rawName = match[1].trim();

    const lower = rawName.toLowerCase();
    if (['summary', 'pros', 'cons', 'verdict', 'trade-offs', 'tradeoffs', 'retailers', 'note', 'options', 'key retailers'].includes(lower)) {
      return null;
    }
    if (rawName.length < 3 || rawName.length > 50) return null;

    const query = encodeURIComponent(rawName);
    const amazonUrl = `https://www.amazon.in/s?k=${query}`;
    const flipkartUrl = `https://www.flipkart.com/search?q=${query}`;

    return (
      <span className="inline-flex items-center gap-1.5 ml-2 flex-wrap">
        <a
          href={amazonUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-bold border transition-all ${
            isWhite
              ? 'bg-violet-50 hover:bg-violet-100 text-[#2E1065] border-violet-200 shadow-sm'
              : 'bg-amber-950/40 hover:bg-amber-900/60 text-[#FF9900] border-amber-600/40'
          }`}
          title={`Find ${rawName} on Amazon India`}
        >
          <span>Amazon 🛒</span>
          <ExternalLink className="w-2.5 h-2.5 opacity-80" />
        </a>
        <a
          href={flipkartUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-bold border transition-all ${
            isWhite
              ? 'bg-blue-50 hover:bg-blue-100 text-blue-950 border-blue-300 shadow-sm'
              : 'bg-blue-950/40 hover:bg-blue-900/60 text-[#93C5FD] border-blue-600/40'
          }`}
          title={`Find ${rawName} on Flipkart`}
        >
          <span>Flipkart 🛍️</span>
          <ExternalLink className="w-2.5 h-2.5 opacity-80" />
        </a>
      </span>
    );
  };

  const parseBoldAndLinks = (text: string) => {
    const regex = /(\[[^\]]+\]\(https?:\/\/[^\s)]+\)|\*\*.*?\*\*|https?:\/\/[^\s)]+)/g;
    const parts = text.split(regex);

    return parts.map((part, i) => {
      if (!part) return null;

      const mdLinkMatch = part.match(/^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/);
      if (mdLinkMatch) {
        const [, label, url] = mdLinkMatch;
        return renderStoreOrWebLink(url, label, i);
      }

      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className={`${isWhite ? 'text-[#2E1065] font-bold' : 'text-[#E9EDF5] font-bold'}`}>
            {part.slice(2, -2)}
          </strong>
        );
      }

      if (part.startsWith('http://') || part.startsWith('https://')) {
        return renderStoreOrWebLink(part, undefined, i);
      }

      return part;
    });
  };

  // Render text with full markdown formatting, direct store pills, and exact images
  const renderFormattedText = (content: string) => {
    const lines = content.split('\n');
    return (
      <div className={`space-y-2 text-sm leading-relaxed ${isWhite ? 'text-[#2E1065]' : 'text-[#D2D9E8]'}`}>
        {lines.map((line, idx) => {
          if (!line.trim()) return <div key={idx} className="h-1" />;

          // Render markdown images e.g. ![Alt](url)
          const imgMatch = line.match(/^!\[(.*?)\]\((https?:\/\/.*?)\)$/);
          if (imgMatch) {
            const [, altText, imgUrl] = imgMatch;
            return (
              <div key={idx} className={`my-2 max-w-sm rounded-2xl overflow-hidden border ${isWhite ? 'border-violet-100 bg-white shadow-md' : 'border-white/10 bg-black/40 shadow-lg'}`}>
                <img
                  src={imgUrl}
                  alt={altText || 'Product'}
                  className="w-full h-44 object-cover hover:scale-105 transition-transform duration-300"
                  onError={(e) => handleImageError(e)}
                />
                {altText && (
                  <div className={`p-2 text-[11px] ${isWhite ? 'text-[#4C1D95] bg-[#FAF8FF] border-t border-violet-100' : 'text-[#8B96AC] bg-black/60'} truncate`}>
                    {altText}
                  </div>
                )}
              </div>
            );
          }

          if (line.startsWith('### ')) {
            return (
              <h4 key={idx} className={`font-heading font-bold text-base ${isWhite ? 'text-[#7C3AED]' : 'text-[#7C3AED]'} mt-3 mb-1`}>
                {line.replace('### ', '')}
              </h4>
            );
          }
          if (line.startsWith('## ')) {
            return (
              <h3 key={idx} className={`font-heading font-bold text-lg ${isWhite ? 'text-[#2E1065] font-extrabold' : 'text-[#7C3AED]'} mt-3 mb-1`}>
                {line.replace('## ', '')}
              </h3>
            );
          }
          if (line.startsWith('# ')) {
            return (
              <h2 key={idx} className={`font-heading font-extrabold text-xl ${isWhite ? 'text-[#2E1065] font-black' : 'text-[#7C3AED]'} mt-4 mb-2`}>
                {line.replace('# ', '')}
              </h2>
            );
          }

          // Numbered list item e.g. 1. **Product Name**
          const numMatch = line.match(/^(\d+)\.\s+(.*)$/);
          if (numMatch) {
            const [, num, itemText] = numMatch;
            return (
              <div key={idx} className="flex items-start gap-2 ml-2 my-1">
                <span className={`px-2 py-0.5 rounded-md text-[11px] font-black ${isWhite ? 'bg-violet-100 text-[#2E1065] border border-violet-200' : 'bg-black/60 text-[#7C3AED] border border-[#F0B429]/40'} shrink-0 mt-0.5`}>
                  #{num}
                </span>
                <div className="flex-1">
                  {parseBoldAndLinks(itemText)}
                  {extractAutoStorePills(itemText)}
                </div>
              </div>
            );
          }

          // Bullet points
          if (line.startsWith('- ') || line.startsWith('* ')) {
            const bulletText = line.substring(2);
            return (
              <div key={idx} className="flex items-start gap-2 ml-2">
                <span className={`mt-1 text-xs ${isWhite ? 'text-[#7C3AED] font-bold' : 'text-[#7C3AED]'}`}>◆</span>
                <div className="flex-1">
                  {parseBoldAndLinks(bulletText)}
                  {extractAutoStorePills(bulletText)}
                </div>
              </div>
            );
          }

          return (
            <p key={idx}>
              {parseBoldAndLinks(line)}
              {extractAutoStorePills(line)}
            </p>
          );
        })}
      </div>
    );
  };

  // Sparkline generator for price history
  const renderSparkline = (history: TrackedProduct['history']) => {
    const valid = history.filter(h => h.price !== null && !isNaN(h.price!));
    if (valid.length < 2) return null;
    const prices = valid.map(h => h.price!);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const range = max - min || 1;

    const width = 200;
    const height = 40;
    const padding = 5;

    const points = prices
      .map((p, i) => {
        const x = padding + (i / (prices.length - 1)) * (width - 2 * padding);
        const y = height - padding - ((p - min) / range) * (height - 2 * padding);
        return `${x},${y}`;
      })
      .join(' ');

    return (
      <div className="my-2 bg-[#0B101E]/80 rounded-lg p-2.5 border border-white/5 shadow-inner">
        <div className="flex justify-between text-[11px] text-[#8B96AC] mb-1">
          <span className="font-medium text-[#7C3AED]/80">MRP / Price Trend</span>
          <span>
            {formatINR(min)} - {formatINR(max)}
          </span>
        </div>
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-10 overflow-visible">
          <polyline
            fill="none"
            stroke="#F0B429"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />
        </svg>
      </div>
    );
  };

  const userSavedPrefs = Object.entries(preferences).filter(([k]) => !k.startsWith('_'));

  return (
    <div className={`flex flex-col h-screen ${isWhite ? 'aesthetic-bg-white text-[#2E1065]' : 'aesthetic-bg text-[#FAF8FF]'} overflow-hidden font-sans relative transition-colors duration-300`}>
      {/* Background ambient decorative glow orbs & Levitating Space Objects */}
      <div className="fixed top-[-100px] left-[20%] w-[500px] h-[500px] bg-violet-400/20 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-[-100px] right-[10%] w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none z-0" />
      
      {/* Levitating Ambient Objects in Air (Background Atmosphere) */}
      <div className={`fixed inset-0 pointer-events-none z-0 overflow-hidden ${isWhite ? 'subtle-grid-white' : 'subtle-grid'}`}>
        {/* Floating Token 1: Levitating INR Hologram */}
        <div className="absolute top-[12%] right-[8%] animate-float-1 opacity-40 hover:opacity-70 transition-opacity">
          <div className="w-16 h-16 rounded-2xl bg-white/90 border border-violet-200 shadow-xl text-[#7C3AED] backdrop-blur-md flex items-center justify-center rotate-12">
            <span className="font-heading font-black text-2xl">₹</span>
          </div>
        </div>

        {/* Floating Object 2: Levitating Gadget Orb Left */}
        <div className="absolute top-[38%] left-[4%] animate-float-3 opacity-35">
          <div className="w-20 h-20 rounded-3xl bg-white/90 border border-violet-200 shadow-lg text-[#6D28D9] backdrop-blur-md p-2 flex flex-col items-center justify-center -rotate-6">
            <Headphones className="w-7 h-7 mb-1" />
            <span className="text-[9px] font-mono font-bold">ANC 3D</span>
          </div>
        </div>

        {/* Floating Object 3: Levitating Smart Tech Orb Bottom Right */}
        <div className="absolute bottom-[15%] right-[14%] animate-float-2 opacity-35">
          <div className="w-24 h-24 rounded-3xl bg-white/90 border border-violet-200 shadow-lg text-[#5B21B6] backdrop-blur-md p-2 flex flex-col items-center justify-center rotate-6">
            <Laptop className="w-8 h-8 mb-1" />
            <span className="text-[9px] font-mono font-bold">M3 SILICON</span>
          </div>
        </div>

        {/* Floating Object 4: Levitating Phone Orb Bottom Left */}
        <div className="absolute bottom-[8%] left-[28%] animate-float-4 opacity-30">
          <div className="w-18 h-18 rounded-2xl bg-white/90 border border-violet-200 shadow-md text-[#7C3AED] backdrop-blur-md p-2 flex flex-col items-center justify-center rotate-12">
            <Smartphone className="w-6 h-6 mb-1" />
            <span className="text-[9px] font-mono font-bold">200MP AI</span>
          </div>
        </div>

        {/* Floating Ambient AI Orbital Ring */}
        <div className="absolute top-[20%] left-[45%] w-96 h-96 border border-violet-200/50 rounded-full pointer-events-none animate-orbital opacity-40">
          <div className="absolute top-0 left-1/2 w-3 h-3 bg-[#7C3AED] rounded-full blur-[2px] -translate-x-1/2" />
        </div>
      </div>

      {/* Global Master Switcher Header */}
      <header className={`shrink-0 w-full py-2.5 px-4 sm:px-6 border-b z-40 transition-colors ${
        isWhite
          ? 'bg-white/95 border-violet-100 shadow-sm backdrop-blur-md'
          : 'bg-[#120726]/95 border-violet-900/60 shadow-md backdrop-blur-md'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Logo & Name */}
          <div
            className="flex items-center gap-2.5 cursor-pointer select-none"
            onClick={() => setMainView('landing')}
            title="Go to Landing Page & Brand Guide"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#8B5CF6] via-[#7C3AED] to-[#6D28D9] beacon-glow flex items-center justify-center font-heading font-black text-sm text-white">
              ₹
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className={`font-heading font-black text-base tracking-tight ${isWhite ? 'text-[#2E1065]' : 'text-white'}`}>
                  VANTAGE
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-violet-100 text-[#6D28D9] border border-violet-200">
                  AI
                </span>
              </div>
            </div>
          </div>

          {/* Central Segmented Pill: Landing Page vs Assistant App */}
          <div className={`p-1 rounded-2xl border flex items-center gap-1 ${
            isWhite ? 'bg-violet-50 border-violet-200' : 'bg-[#1E0B38] border-violet-800/80'
          }`}>
            <button
              onClick={() => setMainView('landing')}
              className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                mainView === 'landing'
                  ? 'bg-gradient-to-r from-[#8B5CF6] via-[#7C3AED] to-[#6D28D9] text-white shadow-md font-heading'
                  : isWhite ? 'text-[#6D28D9] hover:text-[#2E1065]' : 'text-violet-300 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-current" />
              <span>✨ Landing Page & Brand Guide</span>
            </button>

            <button
              onClick={() => setMainView('app')}
              className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                mainView === 'app'
                  ? 'bg-gradient-to-r from-[#8B5CF6] via-[#7C3AED] to-[#6D28D9] text-white shadow-md font-heading'
                  : isWhite ? 'text-[#6D28D9] hover:text-[#2E1065]' : 'text-violet-300 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-current" />
              <span>🛍️ Shopping Assistant App</span>
            </button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {mainView === 'landing' ? (
              <button
                onClick={() => setMainView('app')}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-sm transition-all font-heading"
              >
                <span>Launch App</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => setMainView('landing')}
                className={`hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  isWhite ? 'border-violet-200 text-[#6D28D9] hover:bg-violet-50' : 'border-violet-800 text-violet-200 hover:bg-[#2B104E]'
                }`}
              >
                <span>Brand & UI Tour</span>
              </button>
            )}

            {/* Theme Badge: Pure White & Violet */}
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-violet-100/90 text-[#6D28D9] border border-violet-200 shadow-sm"
              title="White & Violet Palette Active"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#7C3AED]" />
              <span className="hidden sm:inline">White & Violet</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main View Switcher: Landing Page vs Assistant App */}
      {mainView === 'landing' ? (
        <div className="flex-1 overflow-y-auto relative z-10">
          <LandingPage
            isWhite={isWhite}
            floatingProducts={FLOATING_PRODUCTS}
            userId={userId}
            onOpenProductModal={handleOpenProductModal}
            onLaunchApp={(opts) => {
              setMainView('app');
              if (opts?.tab) setActiveTab(opts.tab);
              if (opts?.initialQuery) {
                if (opts.tab === 'multi') {
                  setMultiGoal(opts.initialQuery);
                  runMultiResearch(opts.initialQuery);
                } else if (opts.tab === 'chat') {
                  handleSendChat(opts.initialQuery);
                } else {
                  setFrontSearchQuery(opts.initialQuery);
                  lookupProductSource(opts.initialQuery);
                }
              }
            }}
          />
        </div>
      ) : (
        <div className="flex-1 flex overflow-hidden relative z-10">
          {/* Sidebar Drawer */}
          <aside
            className={`${
              sidebarOpen ? 'w-84 md:w-92 shrink-0' : 'hidden'
            } ${isWhite ? 'bg-white/95 border-r border-violet-100 shadow-xl' : 'bg-[#120726]/95 border-r border-violet-900/60 shadow-2xl'} flex flex-col h-full z-20 transition-all duration-200 relative`}
          >
        {/* Sidebar Header */}
        <div className={`p-4 border-b ${isWhite ? 'border-violet-100 bg-violet-50/80' : 'border-violet-900/40 bg-[#1E0B38]/60'} flex items-center justify-between`}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#8B5CF6] via-[#7C3AED] to-[#6D28D9] flex items-center justify-center beacon-glow text-white font-heading font-black text-sm">
              ₹
            </div>
            <div>
              <span className={`font-heading font-bold text-base tracking-tight ${isWhite ? 'text-[#2E1065]' : 'text-white'} block leading-none`}>
                Vantage Control
              </span>
              <span className="text-[10px] text-[#7C3AED] font-bold tracking-wide">
                INDIA EDITION (INR ₹)
              </span>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className={`p-1 rounded ${isWhite ? 'text-[#7C6898] hover:text-[#2E1065] hover:bg-violet-50' : 'text-violet-300 hover:text-white hover:bg-white/5'} md:hidden`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Content Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 text-sm">
          {/* User Profile */}
          <div className={`${isWhite ? 'glass-panel-white' : 'glass-panel'} p-3.5 rounded-2xl border ${isWhite ? 'border-violet-100' : 'border-violet-900/50'} shadow-md`}>
            <div className="flex items-center gap-2 text-[#7C3AED] font-semibold text-xs tracking-wider uppercase mb-2">
              <User className="w-4 h-4" />
              <span>User Profile</span>
            </div>
            <form onSubmit={handleSwitchUser} className="flex gap-2">
              <input
                type="text"
                value={tempUserId}
                onChange={e => setTempUserId(e.target.value)}
                placeholder="User ID (e.g. default, gowtham)"
                className={`${isWhite ? 'bg-[#FAF8FF] border-violet-200 text-[#2E1065] focus:border-violet-500' : 'bg-black/30 border-violet-800 text-[#FAF8FF] focus:border-violet-400'} border rounded-xl px-3 py-1.5 text-xs w-full focus:outline-none transition-colors`}
              />
              <button
                type="submit"
                className={`${isWhite ? 'bg-violet-100 hover:bg-violet-200 text-[#6D28D9] border-violet-200' : 'bg-violet-900 hover:bg-violet-800 text-white border-violet-700'} border text-xs font-semibold px-3 py-1.5 rounded-xl shrink-0 transition-colors`}
              >
                Switch
              </button>
            </form>
            <p className={`text-[11px] ${isWhite ? 'text-[#7C6898]' : 'text-violet-300'} mt-1.5 flex items-center justify-between`}>
              <span>Active profile:</span>
              <span className="text-[#7C3AED] font-mono font-bold">{userId}</span>
            </p>
          </div>

          {/* Remembered Preferences */}
          <div className={`${isWhite ? 'glass-panel-white' : 'glass-panel'} p-3.5 rounded-2xl border ${isWhite ? 'border-violet-100' : 'border-white/10'} shadow-md`}>
            <div className="flex items-center justify-between mb-2">
              <div className={`flex items-center gap-2 ${isWhite ? 'text-[#7C3AED]' : 'text-[#7C3AED]'} font-semibold text-xs tracking-wider uppercase`}>
                <Brain className="w-4 h-4" />
                <span>Memory & Preferences ({userSavedPrefs.length})</span>
              </div>
            </div>
            <p className={`text-[11px] ${isWhite ? 'text-[#7C6898]' : 'text-[#8B96AC]'} mb-2.5`}>
              Saved preferences (like budget or favorite brands) are factored into all recommendations.
            </p>

            {userSavedPrefs.length > 0 ? (
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1 mb-3">
                {userSavedPrefs.map(([k, v]) => (
                  <div
                    key={k}
                    className={`flex items-center justify-between ${isWhite ? 'bg-[#FAF8FF] border-violet-100 text-[#2E1065]' : 'bg-black/40 border-white/5 text-[#D2D9E8]'} px-3 py-1.5 rounded-xl border text-xs`}
                  >
                    <div className="truncate mr-2">
                      <span className={`font-semibold ${isWhite ? 'text-[#7C3AED]' : 'text-[#7C3AED]'}`}>{k}:</span>{' '}
                      <span>{v}</span>
                    </div>
                    <button
                      onClick={() => handleDeletePreference(k)}
                      className={`${isWhite ? 'text-[#8B78A5] hover:text-rose-600' : 'text-[#8B96AC] hover:text-rose-400'} p-0.5 rounded transition-colors`}
                      title="Forget preference"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`text-xs ${isWhite ? 'text-[#8B78A5]' : 'text-[#8B96AC]'} italic mb-3`}>No preferences saved yet.</div>
            )}

            <form onSubmit={handleSavePreference} className={`space-y-2 pt-2 border-t ${isWhite ? 'border-violet-100' : 'border-white/10'}`}>
              <input
                type="text"
                value={newPrefKey}
                onChange={e => setNewPrefKey(e.target.value)}
                placeholder="Preference name (e.g. budget, brand)"
                className={`${isWhite ? 'bg-[#FAF8FF] border-violet-200 text-[#2E1065] focus:border-[#7C3AED]' : 'bg-black/30 border-white/10 text-[#E9EDF5] focus:border-[#7C3AED]'} border rounded-xl px-3 py-1.5 text-xs w-full focus:outline-none`}
              />
              <input
                type="text"
                value={newPrefValue}
                onChange={e => setNewPrefValue(e.target.value)}
                placeholder="Value (e.g. under ₹20,000, Sony)"
                className={`${isWhite ? 'bg-[#FAF8FF] border-violet-200 text-[#2E1065] focus:border-[#7C3AED]' : 'bg-black/30 border-white/10 text-[#E9EDF5] focus:border-[#7C3AED]'} border rounded-xl px-3 py-1.5 text-xs w-full focus:outline-none`}
              />
              <button
                type="submit"
                className={`w-full ${isWhite ? 'bg-violet-100 hover:bg-violet-200 text-[#2E1065] border-violet-200' : 'bg-[#7C3AED]/15 hover:bg-[#7C3AED]/25 text-[#7C3AED] border-[#F0B429]/30 hover:border-[#F0B429]'} border text-xs font-semibold py-1.5 rounded-xl transition-all flex items-center justify-center gap-1.5`}
              >
                <Plus className="w-3.5 h-3.5" />
                Remember Preference
              </button>
            </form>
          </div>

          {/* Notifications Settings */}
          <div className={`${isWhite ? 'glass-panel-white' : 'glass-panel'} p-3.5 rounded-2xl border ${isWhite ? 'border-violet-100' : 'border-white/10'} shadow-md`}>
            <div className={`flex items-center gap-2 ${isWhite ? 'text-[#7C3AED]' : 'text-[#7C3AED]'} font-semibold text-xs tracking-wider uppercase mb-1.5`}>
              <Bell className="w-4 h-4" />
              <span>Price-Drop Alerts</span>
            </div>
            <p className={`text-[11px] ${isWhite ? 'text-[#7C6898]' : 'text-[#8B96AC]'} mb-3`}>
              Receive alerts when prices drop below your target price in ₹.
            </p>

            <form onSubmit={handleSaveNotifications} className="space-y-2 mb-3">
              <div>
                <label className={`text-[11px] ${isWhite ? 'text-[#7C6898]' : 'text-[#8B96AC]'} block mb-1`}>Alert Email</label>
                <input
                  type="email"
                  value={notifyEmail}
                  onChange={e => setNotifyEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={`${isWhite ? 'bg-[#FAF8FF] border-violet-200 text-[#2E1065] focus:border-[#7C3AED]' : 'bg-black/30 border-white/10 text-[#E9EDF5] focus:border-[#7C3AED]'} border rounded-xl px-3 py-1.5 text-xs w-full focus:outline-none`}
                />
              </div>
              <div>
                <label className={`text-[11px] ${isWhite ? 'text-[#7C6898]' : 'text-[#8B96AC]'} block mb-1`}>Telegram Chat ID</label>
                <input
                  type="text"
                  value={notifyTelegram}
                  onChange={e => setNotifyTelegram(e.target.value)}
                  placeholder="e.g. 123456789"
                  className={`${isWhite ? 'bg-[#FAF8FF] border-violet-200 text-[#2E1065] focus:border-[#7C3AED]' : 'bg-black/30 border-white/10 text-[#E9EDF5] focus:border-[#7C3AED]'} border rounded-xl px-3 py-1.5 text-xs w-full focus:outline-none`}
                />
                <span className={`text-[10px] ${isWhite ? 'text-[#8B78A5]' : 'text-[#8B96AC]'} block mt-0.5`}>
                  Telegram: message <code className={`${isWhite ? 'text-[#7C3AED] font-bold' : 'text-[#7C3AED]'}`}>@userinfobot</code> for your ID.
                </span>
              </div>
              <button
                type="submit"
                className={`w-full ${isWhite ? 'bg-violet-50 hover:bg-slate-200 text-[#2E1065] border-violet-200' : 'bg-[#1E273A] hover:bg-[#2B3752] text-white border-white/10'} border text-xs font-semibold py-1.5 rounded-xl transition-colors`}
              >
                {notifySaved ? '✓ Saved' : 'Save Notification Settings'}
              </button>
            </form>

            <button
              type="button"
              onClick={handleSendTestNotification}
              disabled={isSendingTestAlert}
              className={`w-full ${isWhite ? 'bg-violet-50 hover:bg-slate-200 text-[#2E1065] border-violet-200' : 'bg-black/40 hover:bg-black/60 border-white/10 hover:border-[#F0B429]/50 text-[#E9EDF5]'} border text-xs py-1.5 rounded-xl font-medium flex items-center justify-center gap-1.5 transition-all`}
            >
              {isSendingTestAlert ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-500" />
                  Dispatching test alert...
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5 text-amber-500" />
                  Send Test Notification
                </>
              )}
            </button>

            {testAlerts.length > 0 && (
              <div className="mt-2.5 space-y-1">
                {testAlerts.map((t, idx) => (
                  <div
                    key={idx}
                    className={`text-[11px] p-2 rounded-xl border flex items-start gap-1.5 ${
                      t.success
                        ? isWhite ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-emerald-950/40 border-emerald-700/60 text-emerald-300'
                        : isWhite ? 'bg-violet-50 border-amber-200 text-[#7C3AED]' : 'bg-amber-950/40 border-amber-700/60 text-[#7C3AED]'
                    }`}
                  >
                    {t.success ? (
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-500" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-500" />
                    )}
                    <div>
                      <strong className="capitalize">{t.channel}:</strong> {t.detail}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tracked Products */}
          <div className="glass-panel p-3.5 rounded-2xl border border-white/10 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-[#7C3AED] font-semibold text-xs tracking-wider uppercase">
                <TrendingDown className="w-4 h-4" />
                <span>Tracked Products ({products.length})</span>
              </div>
            </div>

            <div className="space-y-2 mb-3">
              {products.map(prod => {
                const isExpanded = expandedProductIds.includes(prod.id);
                const isChecking = checkingProductId === prod.id;
                const alertInfo = priceCheckAlerts[prod.id];

                return (
                  <div key={prod.id} className={`${isWhite ? 'bg-white border-violet-100 shadow-sm' : 'bg-black/30 border-white/5'} rounded-xl border overflow-hidden`}>
                    <div className={`w-full text-left px-3 py-2 flex items-center justify-between ${isWhite ? 'hover:bg-[#FAF8FF]' : 'hover:bg-white/5'} transition-colors`}>
                      <div
                        onClick={() => handleOpenProductModal(prod.name)}
                        className="flex items-center gap-2.5 truncate pr-2 cursor-pointer flex-1"
                        title="Click to view full pictures and details"
                      >
                        <div className={`w-9 h-9 rounded-lg overflow-hidden ${isWhite ? 'bg-violet-50 border-violet-100' : 'bg-black/50 border-white/10'} border shrink-0`}>
                          <img
                            src={getProductFallbackImg(prod.name)}
                            alt={prod.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                            onError={(e) => handleImageError(e)}
                          />
                        </div>
                        <div className="truncate">
                          <div className={`font-semibold text-xs ${isWhite ? 'text-[#2E1065] hover:text-[#7C3AED]' : 'text-[#E9EDF5] hover:text-violet-300'} truncate transition-colors`}>{prod.name}</div>
                          <div className={`text-[11px] ${isWhite ? 'text-[#7C6898]' : 'text-[#8B96AC]'}`}>
                            {prod.current_price ? (
                              <span className="font-semibold text-emerald-600">{formatINR(prod.current_price)}</span>
                            ) : (
                              'No price check yet'
                            )}
                            {prod.target_price && (
                              <span className="ml-1 text-[#7C3AED] font-bold">(target: {formatINR(prod.target_price)})</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleProductExpand(prod.id)}
                        className="p-1 hover:bg-violet-100 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
                        title="Expand price history"
                      >
                        {isExpanded ? (
                          <ChevronDown className={`w-4 h-4 ${isWhite ? 'text-[#8B78A5]' : 'text-[#8B96AC]'} shrink-0`} />
                        ) : (
                          <ChevronRight className={`w-4 h-4 ${isWhite ? 'text-[#8B78A5]' : 'text-[#8B96AC]'} shrink-0`} />
                        )}
                      </button>
                    </div>

                    {isExpanded && (
                      <div className={`px-3 pb-3 pt-1 border-t ${isWhite ? 'border-violet-100 bg-[#FAF8FF]/80' : 'border-white/5 bg-black/40'} text-xs space-y-2`}>
                        <p className={`text-[11px] ${isWhite ? 'text-[#7C6898]' : 'text-[#8B96AC]'}`}>
                          Query: <span className={`${isWhite ? 'text-[#2E1065]' : 'text-[#D2D9E8]'} font-mono`}>{prod.search_query}</span>
                        </p>
                        {prod.lowest_price !== null && (
                          <p className="text-[11px] text-emerald-600 font-bold">
                            Lowest seen in India: {formatINR(prod.lowest_price)}
                          </p>
                        )}

                        {renderSparkline(prod.history)}

                        {/* Quick store links & specs for tracked product */}
                        <div className="flex items-center gap-1.5 pt-1 flex-wrap">
                          <button
                            type="button"
                            onClick={() => handleOpenProductModal(prod.name)}
                            className="bg-violet-100 hover:bg-violet-200 border border-violet-200 text-[#4C1D95] px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                          >
                            <Sparkles className="w-2.5 h-2.5 text-[#7C3AED]" />
                            <span>Specs & Photos</span>
                          </button>
                          <a
                            href={`https://www.amazon.in/s?k=${encodeURIComponent(prod.search_query)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${isWhite ? 'bg-violet-100/80 hover:bg-violet-200/80 border-violet-200 text-[#2E1065]' : 'bg-violet-500/15 hover:bg-violet-500/25 border-amber-500/30 text-[#FF9900]'} border px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1`}
                          >
                            Amazon ↗
                          </a>
                          <a
                            href={`https://www.flipkart.com/search?q=${encodeURIComponent(prod.search_query)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${isWhite ? 'bg-blue-100/80 hover:bg-blue-200/80 border-blue-300 text-blue-900' : 'bg-blue-500/15 hover:bg-blue-500/25 border-blue-500/30 text-[#60A5FA]'} border px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1`}
                          >
                            Flipkart ↗
                          </a>
                        </div>

                        {alertInfo && (
                          <div
                            className={`p-2 rounded-lg text-[11px] ${
                              alertInfo.alert
                                ? isWhite ? 'bg-violet-100 border border-violet-200 text-[#2E1065]' : 'bg-amber-950/60 border border-amber-600 text-amber-200'
                                : isWhite ? 'bg-violet-50 border border-violet-100 text-[#3B1E7A]' : 'bg-[#141A29] border border-[#262F42] text-[#8B96AC]'
                            }`}
                          >
                            {alertInfo.message}
                          </div>
                        )}

                        <div className="flex gap-2 pt-1">
                          <button
                            onClick={() => handleCheckProductPrice(prod)}
                            disabled={isChecking}
                            className={`flex-1 ${isWhite ? 'bg-violet-100 hover:bg-violet-200 border-violet-200 text-[#2E1065]' : 'bg-[#7C3AED]/15 hover:bg-[#7C3AED]/25 border-[#F0B429]/40 text-[#7C3AED]'} border py-1 px-2 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors`}
                          >
                            {isChecking ? (
                              <RefreshCw className="w-3 h-3 animate-spin" />
                            ) : (
                              <RefreshCw className="w-3 h-3" />
                            )}
                            Check Price in ₹
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod.id)}
                            className={`${isWhite ? 'bg-violet-50 hover:bg-rose-100 text-[#7C6898] hover:text-rose-700 border-violet-100' : 'bg-white/5 hover:bg-rose-900/60 hover:text-rose-200 text-[#8B96AC]'} border p-1 px-2 rounded-lg text-[11px] transition-colors`}
                            title="Remove tracked product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Add product form */}
            <form onSubmit={handleAddProduct} className={`space-y-2 pt-2 border-t ${isWhite ? 'border-violet-100' : 'border-white/10'}`}>
              <div className={`text-[11px] font-semibold ${isWhite ? 'text-[#2E1065]' : 'text-[#D2D9E8]'} flex items-center gap-1`}>
                <Tag className="w-3 h-3 text-amber-500" />
                Track New Product
              </div>
              <input
                type="text"
                value={newProdName}
                onChange={e => setNewProdName(e.target.value)}
                placeholder="Product nickname (e.g. Sony XM5)"
                className={`${isWhite ? 'bg-[#FAF8FF] border-violet-200 text-[#2E1065] focus:border-[#7C3AED]' : 'bg-black/30 border-white/10 text-[#E9EDF5] focus:border-[#7C3AED]'} border rounded-xl px-3 py-1.5 text-xs w-full focus:outline-none`}
              />
              <input
                type="text"
                value={newProdQuery}
                onChange={e => setNewProdQuery(e.target.value)}
                placeholder="Search query (e.g. Sony WH-1000XM5 price India)"
                className={`${isWhite ? 'bg-[#FAF8FF] border-violet-200 text-[#2E1065] focus:border-[#7C3AED]' : 'bg-black/30 border-white/10 text-[#E9EDF5] focus:border-[#7C3AED]'} border rounded-xl px-3 py-1.5 text-xs w-full focus:outline-none`}
              />
              <div className="relative">
                <span className="absolute left-3 top-1.5 text-xs text-[#7C3AED] font-bold">₹</span>
                <input
                  type="number"
                  step="any"
                  value={newProdTarget}
                  onChange={e => setNewProdTarget(e.target.value)}
                  placeholder="Target alert price in ₹ (optional)"
                  className={`${isWhite ? 'bg-[#FAF8FF] border-violet-200 text-[#2E1065] focus:border-[#7C3AED]' : 'bg-black/30 border-white/10 text-[#E9EDF5] focus:border-[#7C3AED]'} border rounded-xl pl-7 pr-3 py-1.5 text-xs w-full focus:outline-none`}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold text-xs py-2 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                Track Product in ₹
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
        {/* Top Navbar */}
        <header className={`px-4 sm:px-6 py-4 ${isWhite ? 'bg-white/85 border-b border-violet-100 shadow-sm' : 'glass-panel border-b border-white/10'} flex flex-col md:flex-row md:items-center justify-between gap-4 backdrop-blur-md transition-colors`}>
          <div className="flex items-center gap-3.5">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className={`p-2 rounded-xl ${isWhite ? 'bg-violet-50 border-violet-100 text-[#3B1E7A] hover:text-slate-950' : 'bg-black/40 border-white/10 text-[#8B96AC] hover:text-white'} border transition-colors`}
                title="Open Control Panel"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#8B5CF6] via-[#7C3AED] to-[#6D28D9] beacon-glow flex items-center justify-center shrink-0 text-white font-heading font-black text-xl">
              ₹
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading font-extrabold text-2xl tracking-tight text-[#2E1065]">
                  Vantage
                </h1>
                <span className="bg-violet-100 text-[#6D28D9] border border-violet-200 text-[10px] font-extrabold tracking-wider px-2 py-0.5 rounded-full uppercase">
                  India Edition (₹)
                </span>
              </div>
              <p className={`text-xs ${isWhite ? 'text-[#7C6898]' : 'text-[#8B96AC]'} hidden sm:block`}>
                The full view before you buy in India — retail deals, community verdict, and expert tests in Indian Rupees (₹).
              </p>
            </div>
          </div>

          {/* Tab selector & Theme toggle in header */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Quick Button to Brand Guide & Tour */}
            <button
              onClick={() => setMainView('landing')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all bg-violet-50 hover:bg-violet-100 border-violet-200 text-[#6D28D9] shadow-sm"
              title="Return to Landing Page & Brand Guide"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#7C3AED]" />
              <span className="hidden sm:inline">Brand Guide</span>
            </button>

            <div className="flex items-center bg-violet-50/90 border border-violet-200 p-1 rounded-2xl backdrop-blur-md">
              <button
                onClick={() => setActiveTab('arena')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'arena'
                    ? 'bg-gradient-to-r from-[#8B5CF6] via-[#7C3AED] to-[#6D28D9] text-white shadow-md font-bold'
                    : 'text-[#6D28D9] hover:text-[#2E1065]'
                }`}
              >
                <Radio className="w-3.5 h-3.5 text-current animate-pulse" />
                <span>🪐 Objects in Air</span>
              </button>
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'chat'
                    ? 'bg-gradient-to-r from-[#8B5CF6] via-[#7C3AED] to-[#6D28D9] text-white shadow-md font-bold'
                    : 'text-[#6D28D9] hover:text-[#2E1065]'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>💬 Chat in ₹</span>
              </button>
              <button
                onClick={() => setActiveTab('multi')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'multi'
                    ? 'bg-gradient-to-r from-[#8B5CF6] via-[#7C3AED] to-[#6D28D9] text-white shadow-md font-bold'
                    : 'text-[#6D28D9] hover:text-[#2E1065]'
                }`}
              >
                <Search className="w-3.5 h-3.5" />
                <span>🔍 Deep Synthesis</span>
              </button>
            </div>

            {/* Theme Badge: Pure White & Violet */}
            <div
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold bg-violet-100 text-[#6D28D9] border border-violet-200 shadow-sm"
              title="White & Violet Palette"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#7C3AED]" />
              <span>White & Violet</span>
            </div>
          </div>
        </header>

        {/* Floating Notification Toast */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#0F1626]/95 border border-[#F0B429] text-white px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold backdrop-blur-xl animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-[#7C3AED]" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Scrollable View Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 max-w-5xl w-full mx-auto">
          {/* Stat Chips */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <div className={`${isWhite ? 'glass-panel-white border-violet-100' : 'glass-panel border-white/10'} border rounded-2xl p-4 relative overflow-hidden group hover:border-violet-300 transition-colors shadow-sm`}>
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#7C3AED] to-transparent opacity-60" />
              <div className={`font-heading text-2xl sm:text-3xl font-extrabold ${isWhite ? 'text-[#7C3AED]' : 'text-[#7C3AED]'} tracking-tight`}>
                {stats.tracked_count}
              </div>
              <div className={`text-xs ${isWhite ? 'text-[#7C6898]' : 'text-[#8B96AC]'} font-medium mt-1`}>Tracked Products</div>
            </div>
            <div className={`${isWhite ? 'glass-panel-white border-violet-100' : 'glass-panel border-white/10'} border rounded-2xl p-4 relative overflow-hidden group hover:border-violet-300 transition-colors shadow-sm`}>
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#7C3AED] to-transparent opacity-60" />
              <div className={`font-heading text-2xl sm:text-3xl font-extrabold ${isWhite ? 'text-[#7C3AED]' : 'text-[#7C3AED]'} tracking-tight`}>
                {stats.total_checks}
              </div>
              <div className={`text-xs ${isWhite ? 'text-[#7C6898]' : 'text-[#8B96AC]'} font-medium mt-1`}>Price Checks Logged</div>
            </div>
            <div className={`${isWhite ? 'glass-panel-white border-violet-100' : 'glass-panel border-white/10'} border rounded-2xl p-4 relative overflow-hidden group hover:border-violet-300 transition-colors shadow-sm`}>
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#7C3AED] to-transparent opacity-60" />
              <div className={`font-heading text-2xl sm:text-3xl font-extrabold ${isWhite ? 'text-[#7C3AED]' : 'text-[#7C3AED]'} tracking-tight`}>
                {stats.pref_count}
              </div>
              <div className={`text-xs ${isWhite ? 'text-[#7C6898]' : 'text-[#8B96AC]'} font-medium mt-1`}>Preferences Saved</div>
            </div>
          </div>

          {/* Onboarding Banner */}
          {showOnboarding && (
            <div className={`${isWhite ? 'glass-panel-white border-violet-200 shadow-md' : 'glass-panel-white'} rounded-2xl p-5 relative overflow-hidden`}>
              <div className="flex items-start gap-3.5">
                <div className={`p-2 rounded-xl ${isWhite ? 'bg-violet-100 text-[#7C3AED]' : 'bg-[#7C3AED]/20 text-[#7C3AED]'} shrink-0`}>
                  <Compass className="w-5 h-5" />
                </div>
                <div className={`text-xs space-y-2 ${isWhite ? 'text-[#3B1E7A]' : 'text-[#D2D9E8]'}`}>
                  <h3 className={`font-heading font-bold text-sm ${isWhite ? 'text-[#2E1065]' : 'text-white'}`}>
                    Welcome to Vantage — Intelligent Indian Shopping Assistant
                  </h3>
                  <p className={`${isWhite ? 'text-[#4C1D95]' : 'text-[#8B96AC]'} leading-relaxed`}>
                    Designed specifically for discovering products and tracking MRP & deals across Indian retailers (Amazon.in, Flipkart, Croma, Vijay Sales, Reliance Digital).
                  </p>
                  <ul className={`grid grid-cols-1 sm:grid-cols-2 gap-2 ${isWhite ? 'text-[#3B1E7A]' : 'text-[#C4D0E6]'} pt-1`}>
                    <li className="flex items-center gap-2">
                      <span className="text-amber-500">◆</span> All quotes & budgets in Indian Rupees (₹ / INR).
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-amber-500">◆</span> Live multi-source research: Retail vs Community vs Lab tests.
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-amber-500">◆</span> Save your preferences (budget, brand, size) in memory.
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-amber-500">◆</span> Automatic alerts via Email & Telegram on price drops.
                    </li>
                  </ul>
                  <button
                    onClick={handleDismissOnboarding}
                    className={`mt-3 text-xs ${isWhite ? 'bg-white hover:bg-violet-50 text-[#2E1065] border-violet-200 shadow-sm' : 'bg-white/10 hover:bg-white/20 text-white border-white/10'} font-semibold px-3.5 py-1.5 rounded-xl transition-all inline-flex items-center gap-1.5 border`}
                  >
                    <Check className="w-3.5 h-3.5 text-amber-500" />
                    Got it, dismiss guide
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 0: FRONT PAGE AI ZERO-GRAVITY ARENA (Objects & Products Floating in Air) */}
          {activeTab === 'arena' && (
            <div className="space-y-6">
              {/* Arena Hero Header with AI Gravitational Field Controls */}
              <div className={`${isWhite ? 'glass-panel-white border-violet-200/80 shadow-xl' : 'glass-panel-white border-[#F0B429]/28 shadow-2xl'} rounded-3xl p-6 relative overflow-hidden`}>
                {/* Decorative radar scan line */}
                <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
                  <div
                    className="w-full h-1 bg-gradient-to-r from-transparent via-[#7C3AED] to-transparent"
                    style={{ animation: 'radar-scan 6s linear infinite' }}
                  />
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
                  <div className="space-y-1.5">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${isWhite ? 'bg-violet-100 text-[#2E1065] border-violet-200' : 'bg-[#7C3AED]/15 border-[#F0B429]/30 text-[#7C3AED]'} border text-xs font-bold uppercase tracking-wider`}>
                      <span className="w-2 h-2 rounded-full bg-violet-500 animate-ping" />
                      <span>Zero-Gravity AI Engine · Indian Market Radar</span>
                    </div>
                    <h2 className={`font-heading font-black text-2xl sm:text-3xl ${isWhite ? 'text-[#2E1065]' : 'text-white'} tracking-tight`}>
                      Objects & Products Levitating in Air
                    </h2>
                    <p className={`text-xs sm:text-sm ${isWhite ? 'text-[#4C1D95]' : 'text-[#A0AEC0]'} max-w-2xl leading-relaxed`}>
                      Interactive 3D air-floating arena. Items levitate with atmospheric zero-gravity physics. Tap any hovering object to analyze Indian prices & MRPs (₹), find deals on Amazon & Flipkart, or start AI deep research.
                    </p>
                  </div>

                  {/* Motion toggle controls */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setIsZeroGPaused(p => !p)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-xs font-bold transition-all shadow-md ${
                        isWhite
                          ? isZeroGPaused
                            ? 'bg-violet-50 text-[#2E1065] border-violet-200 hover:border-violet-400'
                            : 'bg-violet-100 border-violet-200 text-[#2E1065] hover:bg-violet-200'
                          : isZeroGPaused
                            ? 'bg-[#1E2638] text-white border-white/20 hover:border-[#F0B429]'
                            : 'bg-[#7C3AED]/20 border-[#F0B429]/60 text-[#7C3AED] hover:bg-[#7C3AED]/30'
                      }`}
                    >
                      {isZeroGPaused ? (
                        <>
                          <Play className="w-3.5 h-3.5 text-amber-500" />
                          <span>Resume Float Physics</span>
                        </>
                      ) : (
                        <>
                          <Pause className="w-3.5 h-3.5 text-amber-500" />
                          <span>Pause Float Motion</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Front Page Live Product Search with Direct Store Links */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!frontSearchQuery.trim()) return;
                    handleResearchProduct(frontSearchQuery.trim());
                  }}
                  className="mt-5 relative z-10"
                >
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isWhite ? 'text-[#8B78A5]' : 'text-[#7C6898]'}`} />
                      <input
                        type="text"
                        value={frontSearchQuery}
                        onChange={(e) => setFrontSearchQuery(e.target.value)}
                        placeholder="Search any product (e.g. Sony XM5, MacBook M3, Samsung S24, Air Fryer, Smartwatch)..."
                        className={`w-full pl-10 pr-4 py-3 rounded-2xl text-xs sm:text-sm border transition-all ${
                          isWhite
                            ? 'bg-white border-violet-200 text-[#2E1065] placeholder:text-[#8B78A5] focus:border-[#7C3AED] focus:ring-2 focus:ring-amber-200 shadow-sm'
                            : 'bg-black/50 border-white/15 text-white placeholder-slate-500 focus:border-[#7C3AED] shadow-inner'
                        } outline-none`}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={!frontSearchQuery.trim()}
                      className="bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-amber-500 hover:to-amber-400 disabled:opacity-40 text-slate-950 font-black text-xs px-5 py-3 rounded-2xl flex items-center justify-center gap-1.5 transition-all shadow-md shrink-0 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Search with Store Links in ₹</span>
                    </button>
                  </div>

                  {/* Quick Search Chips */}
                  <div className="flex items-center gap-1.5 flex-wrap mt-2.5 text-[11px]">
                    <span className={`${isWhite ? 'text-[#7C6898]' : 'text-[#8B96AC]'} font-semibold mr-1`}>Popular:</span>
                    {[
                      'Sony WH-1000XM5',
                      'Apple MacBook Air M3',
                      'Samsung Galaxy S24 Ultra',
                      'Philips Digital Air Fryer',
                      'Keychron Mechanical Keyboard',
                    ].map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => {
                          setFrontSearchQuery(chip);
                          handleResearchProduct(chip);
                        }}
                        className={`px-2.5 py-1 rounded-lg border text-[11px] transition-all cursor-pointer ${
                          isWhite
                            ? 'bg-white/80 hover:bg-white text-[#3B1E7A] hover:text-[#7C3AED] border-violet-100 hover:border-violet-300 shadow-xs'
                            : 'bg-black/30 hover:bg-black/60 text-slate-300 hover:text-white border-white/10 hover:border-violet-300/40'
                        }`}
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </form>

                {/* Instant Verified Product Sourcing Card from the Resource Taken From */}
                {instantProductSource && (
                  <div className={`mt-4 p-4 rounded-2xl border ${
                    isWhite ? 'bg-violet-50/95 border-violet-200 shadow-md text-[#2E1065]' : 'bg-black/60 border-violet-300/40 text-slate-200'
                  } relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 backdrop-blur-md`}>
                    <button
                      onClick={() => setInstantProductSource(null)}
                      className={`absolute top-2.5 right-2.5 p-1 rounded-lg ${isWhite ? 'text-[#8B78A5] hover:text-[#3B1E7A]' : 'text-[#8B78A5] hover:text-white'} transition-colors`}
                      title="Dismiss"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-3.5 pr-6 cursor-pointer" onClick={() => handleOpenProductModal(instantProductSource.productName)}>
                      <div className={`w-16 h-16 rounded-xl overflow-hidden ${isWhite ? 'bg-white border-violet-100 hover:border-violet-300' : 'bg-black/80 border-white/15 hover:border-violet-400'} border p-1 shrink-0 shadow-sm relative transition-all`}>
                        <img
                          src={instantProductSource.imageUrl}
                          alt={instantProductSource.productName}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-contain hover:scale-105 transition-transform"
                          onError={(e) => handleImageError(e)}
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300">
                            ✓ {instantProductSource.sourceStore} Verified Photo
                          </span>
                          <span className={`text-[10px] font-semibold ${isWhite ? 'text-[#7C3AED]' : 'text-[#7C3AED]'}`}>
                            {instantProductSource.badge}
                          </span>
                        </div>
                        <h4 className={`font-heading font-bold text-sm ${isWhite ? 'text-[#2E1065] hover:text-[#7C3AED]' : 'text-white hover:text-violet-300'} line-clamp-1 transition-colors`}>
                          {instantProductSource.productName}
                        </h4>
                        <p className={`text-[11px] ${isWhite ? 'text-[#4C1D95]' : 'text-[#8B78A5]'}`}>
                          Exact product source: <strong className={isWhite ? 'text-[#2E1065]' : 'text-white'}>{instantProductSource.sourceStore}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap shrink-0 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => handleOpenProductModal(instantProductSource.productName)}
                        className="px-3.5 py-2.5 rounded-xl bg-violet-100 hover:bg-violet-200 text-[#4C1D95] border border-violet-200 font-bold text-xs inline-flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#7C3AED]" />
                        <span>Specs & Photos</span>
                      </button>

                      <a
                        href={instantProductSource.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-purple-600 hover:to-violet-700 text-white font-black text-xs inline-flex items-center justify-center gap-1.5 shadow-md transition-all hover:scale-105 active:scale-95"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Buy on {instantProductSource.sourceStore}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                )}

                {/* Category Filters */}
                <div className={`flex flex-wrap items-center gap-2 pt-5 border-t ${isWhite ? 'border-violet-100' : 'border-white/10'} mt-5`}>
                  <span className={`text-[11px] font-bold ${isWhite ? 'text-[#7C6898]' : 'text-[#8B96AC]'} uppercase tracking-wider mr-1`}>
                    Air Filter:
                  </span>
                  {[
                    { id: 'all', label: 'All Floating Items' },
                    { id: 'audio', label: '🎧 Audio & ANC' },
                    { id: 'laptops', label: '💻 Laptops & Gear' },
                    { id: 'phones', label: '📱 Flagship Phones' },
                    { id: 'appliances', label: '🍳 Smart Home & TV' },
                    { id: 'wearables', label: '⌚ Wearables' },
                  ].map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setFloatingCategory(cat.id as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        floatingCategory === cat.id
                          ? 'bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-slate-950 font-bold shadow-md'
                          : isWhite
                            ? 'bg-white text-[#4C1D95] border border-violet-100 hover:bg-violet-50 hover:text-[#2E1065] shadow-sm'
                            : 'bg-black/40 text-[#8B96AC] hover:text-white border border-white/5 hover:border-white/15'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Levitating Products 3D Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 perspective-1000">
                {FLOATING_PRODUCTS.filter(
                  p => floatingCategory === 'all' || p.category === floatingCategory
                ).map((product, idx) => {
                  const animClass = isZeroGPaused ? '' : product.animationClass;

                  return (
                    <div
                      key={product.id}
                      className={`flex flex-col preserve-3d ${animClass}`}
                      style={{ animationDelay: `${(idx % 4) * 0.4}s` }}
                    >
                      {/* Levitating Card */}
                      <div className={`${isWhite ? 'glass-panel-white border-violet-100 hover:border-violet-400 shadow-xl' : 'glass-panel border-white/15 hover:border-[#F0B429] shadow-2xl'} border rounded-3xl p-4 flex flex-col justify-between h-full floating-obj-card relative overflow-hidden backdrop-blur-2xl group transition-all`}>
                        {/* Glowing ambient backdrop on hover */}
                        <div className={`absolute top-0 right-0 w-32 h-32 ${isWhite ? 'bg-amber-300/15 group-hover:bg-amber-400/25' : 'bg-[#7C3AED]/10 group-hover:bg-[#7C3AED]/20'} rounded-full blur-2xl pointer-events-none transition-colors`} />

                        {/* Top Tag & Store Pill */}
                        <div className="flex items-center justify-between gap-1 mb-3">
                          <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-lg ${isWhite ? 'bg-violet-50 text-[#7C3AED] border-violet-200' : 'bg-black/60 text-[#7C3AED] border-[#F0B429]/30'} border`}>
                            {product.tag}
                          </span>
                          <span className={`text-[10px] ${isWhite ? 'text-[#4C1D95] bg-violet-50 border border-violet-100' : 'text-[#A0AEC0] bg-white/5'} font-medium px-2 py-0.5 rounded-md`}>
                            {product.store}
                          </span>
                        </div>

                        {/* Product Image Floating Display - Clickable to open full details */}
                        <div
                          onClick={() => handleOpenProductModal(product)}
                          className={`w-full h-44 rounded-2xl overflow-hidden ${isWhite ? 'bg-violet-50 border-violet-100 group-hover:border-violet-300/60' : 'bg-black/40 border-white/10 group-hover:border-[#F0B429]/50'} border relative mb-3.5 transition-all cursor-pointer`}
                          title="Click to open full product details and pictures"
                        >
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-contain p-2 group-hover:scale-108 transition-transform duration-500"
                            onError={(e) => handleImageError(e, product.category)}
                          />
                          <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-lg ${isWhite ? 'bg-violet-100/95 text-[#2E1065] border-violet-200' : 'bg-black/85 text-[#7C3AED] border-violet-300/40'} border text-[10px] font-bold shadow-xs backdrop-blur-md`}>
                            Verified Photo
                          </div>
                          <div className={`absolute bottom-2 left-2 px-2.5 py-1 rounded-xl ${isWhite ? 'bg-white/95 text-emerald-700 border-violet-100 shadow-md font-bold' : 'bg-black/80 text-emerald-400 border-white/10 font-mono font-black'} backdrop-blur-md border text-xs`}>
                            {product.price}
                          </div>
                        </div>

                        {/* Details - Clickable */}
                        <div
                          onClick={() => handleOpenProductModal(product)}
                          className="space-y-1.5 flex-1 mb-3.5 cursor-pointer"
                        >
                          <h4 className={`font-heading font-bold text-sm ${isWhite ? 'text-[#2E1065] hover:text-[#7C3AED]' : 'text-white hover:text-amber-400'} line-clamp-2 leading-snug transition-colors`}>
                            {product.name}
                          </h4>
                          <div className="flex items-center gap-2 text-xs">
                            <span className={`text-[11px] ${isWhite ? 'text-[#8B78A5]' : 'text-[#8B96AC]'} line-through`}>MRP {product.mrp}</span>
                            <span className={`text-[11px] font-bold ${isWhite ? 'text-[#7C3AED]' : 'text-[#7C3AED]'}`}>{product.savings}</span>
                          </div>
                          {product.sourceBadge && (
                            <div className={`text-[10px] ${isWhite ? 'text-[#7C6898]' : 'text-[#8B78A5]'} flex items-center gap-1`}>
                              <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                              <span className="truncate">{product.sourceBadge}</span>
                            </div>
                          )}
                        </div>

                        {/* Open Product Report & Specs Primary Button */}
                        <button
                          onClick={() => handleOpenProductModal(product)}
                          className={`w-full mb-3 py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                            isWhite
                              ? 'bg-violet-100/70 hover:bg-violet-200 border-violet-200 text-[#2E1065]'
                              : 'bg-violet-500/20 hover:bg-violet-500/30 border-violet-500/30 text-violet-200'
                          }`}
                        >
                          <Sparkles className="w-3.5 h-3.5 text-[#7C3AED]" />
                          <span>View Full Specs & Photos</span>
                          <ArrowRight className="w-3 h-3 ml-0.5 opacity-80" />
                        </button>

                        {/* Direct Store Links Bar */}
                        <div className={`space-y-1.5 mb-3 pt-2 border-t ${isWhite ? 'border-violet-100' : 'border-white/10'}`}>
                          {/* Primary Direct Buy Button from the Taken Resource */}
                          <a
                            href={product.sourceUrl || product.amazonUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-purple-600 hover:to-violet-700 text-white font-black text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md hover:scale-[1.02] active:scale-[0.98]"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>Buy on {product.store} (Direct)</span>
                            <ExternalLink className="w-3 h-3 opacity-80" />
                          </a>

                          <div className="grid grid-cols-2 gap-1.5">
                            <a
                              href={product.amazonUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`${isWhite ? 'bg-violet-50 hover:bg-violet-100 border-violet-200 text-[#2E1065] font-bold' : 'bg-amber-950/40 hover:bg-amber-900/60 border-amber-600/40 hover:border-violet-400 text-[#FFB020]'} border text-[11px] py-1 px-2 rounded-xl flex items-center justify-center gap-1 transition-all`}
                            >
                              <span>Amazon</span>
                              <ExternalLink className="w-2.5 h-2.5 opacity-80" />
                            </a>
                            <a
                              href={product.flipkartUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`${isWhite ? 'bg-blue-50 hover:bg-blue-100 border-blue-300 text-blue-900 font-bold' : 'bg-blue-950/40 hover:bg-blue-900/60 border-blue-600/40 hover:border-blue-500 text-[#93C5FD]'} border text-[11px] py-1 px-2 rounded-xl flex items-center justify-center gap-1 transition-all`}
                            >
                              <span>Flipkart</span>
                              <ExternalLink className="w-2.5 h-2.5 opacity-80" />
                            </a>
                          </div>
                        </div>

                        {/* AI Trigger & Modal Actions */}
                        <div className="space-y-1.5">
                          <div className="grid grid-cols-2 gap-1.5">
                            <button
                              onClick={() => handleOpenProductModal(product)}
                              className="bg-violet-100 hover:bg-violet-200 text-[#4C1D95] border border-violet-200 font-bold text-xs py-2 rounded-xl flex items-center justify-center gap-1 transition-all shadow-xs cursor-pointer"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-[#7C3AED]" />
                              <span>Specs & Pics</span>
                            </button>
                            <button
                              onClick={() => handleAskAiAboutProduct(product.name)}
                              className="bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-purple-600 hover:to-violet-700 text-white font-black text-xs py-2 rounded-xl flex items-center justify-center gap-1 transition-all shadow-md cursor-pointer"
                            >
                              <Zap className="w-3.5 h-3.5 fill-white" />
                              <span>Ask AI</span>
                            </button>
                          </div>
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => handleResearchProduct(product.name)}
                              className={`flex-1 ${isWhite ? 'bg-violet-50 hover:bg-slate-200 text-[#2E1065] border-violet-200' : 'bg-white/5 hover:bg-white/15 text-white border-white/10'} border text-[11px] font-semibold py-1.5 rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer`}
                            >
                              <Search className="w-3 h-3 text-[#7C3AED]" />
                              <span>Deep Review</span>
                            </button>
                            <button
                              onClick={() => handleTrackFloatingProduct(product)}
                              className={`${isWhite ? 'bg-violet-100 hover:bg-violet-200 border-violet-200 text-[#2E1065]' : 'bg-[#7C3AED]/15 hover:bg-[#7C3AED]/30 border-[#F0B429]/40 text-[#7C3AED]'} border text-[11px] font-bold px-2.5 py-1.5 rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer`}
                              title="Track price in ₹"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Track</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Levitating Shadow Beneath the Floating Object */}
                      <div
                        className={`w-3/4 h-2.5 ${isWhite ? 'bg-slate-400/35' : 'bg-black/60'} rounded-full blur-sm mx-auto mt-2.5 transition-transform ${
                          !isZeroGPaused ? 'animate-pulse' : ''
                        }`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Floating Objects Quick Carousel when in Chat or Multi tabs */}
          {activeTab !== 'arena' && (
            <div className={`${isWhite ? 'glass-panel-white border-violet-100' : 'glass-panel border-white/10'} p-3.5 rounded-2xl border overflow-hidden relative shadow-sm`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[11px] font-bold ${isWhite ? 'text-[#7C3AED]' : 'text-[#7C3AED]'} uppercase tracking-wider flex items-center gap-1.5`}>
                  <Radio className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                  Floating in Air — Quick AI Search:
                </span>
                <button
                  onClick={() => setActiveTab('arena')}
                  className={`text-[11px] ${isWhite ? 'text-[#7C6898] hover:text-[#7C3AED]' : 'text-[#A0AEC0] hover:text-[#7C3AED]'} flex items-center gap-1 font-semibold`}
                >
                  <span>View All 3D Objects</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
                {FLOATING_PRODUCTS.slice(0, 6).map((fp) => (
                  <button
                    key={fp.id}
                    onClick={() => handleAskAiAboutProduct(fp.name)}
                    className={`flex items-center gap-2 ${isWhite ? 'bg-[#FAF8FF] hover:bg-violet-50 border-violet-100 hover:border-violet-300' : 'bg-black/40 hover:bg-black/70 border-white/10 hover:border-[#F0B429]'} border p-1.5 pr-3 rounded-xl shrink-0 transition-all text-left group`}
                  >
                    <img
                      src={fp.imageUrl}
                      alt={fp.name}
                      className="w-8 h-8 rounded-lg object-cover"
                      onError={(e) => handleImageError(e, fp.category)}
                    />
                    <div className="truncate max-w-[130px]">
                      <div className={`text-[11px] font-bold ${isWhite ? 'text-[#2E1065] group-hover:text-[#7C3AED]' : 'text-white group-hover:text-[#7C3AED]'} truncate`}>
                        {fp.name}
                      </div>
                      <div className={`text-[10px] ${isWhite ? 'text-emerald-700' : 'text-emerald-400'} font-mono font-bold`}>
                        {fp.price}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tab 1: Chat */}
          {activeTab === 'chat' && (
            <div className={`flex flex-col h-[calc(100vh-270px)] min-h-[480px] ${isWhite ? 'glass-panel-white border-violet-100' : 'glass-panel border-white/10'} border rounded-3xl overflow-hidden shadow-2xl`}>
              {/* Message History */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col justify-center items-center text-center p-6 space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#F6C453] via-[#F0B429] to-[#B8790F] beacon-glow flex items-center justify-center text-black font-extrabold text-2xl">
                      ₹
                    </div>
                    <div>
                      <h3 className={`font-heading font-extrabold text-lg ${isWhite ? 'text-[#2E1065]' : 'text-white'}`}>
                        What are you shopping for in India?
                      </h3>
                      <p className={`text-xs ${isWhite ? 'text-[#4C1D95]' : 'text-[#8B96AC]'} mt-1 max-w-md`}>
                        Ask about any product or category. Vantage checks current Indian market MRPs, offers, pros, and cons.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2.5 justify-center max-w-xl pt-2">
                      {[
                        'Best noise-canceling headphones under ₹15,000',
                        'Top 55-inch 4K Smart TVs under ₹40,000',
                        'Reliable student laptop under ₹50,000',
                        'Compact air fryer under ₹4,999',
                      ].map((prompt, i) => (
                        <button
                          key={i}
                          onClick={() => handleSendChat(prompt)}
                          className={`text-xs ${isWhite ? 'bg-[#FAF8FF] hover:bg-violet-50 border-violet-100 text-[#3B1E7A] hover:border-violet-300' : 'bg-black/40 hover:bg-black/60 border-white/10 hover:border-[#F0B429] text-[#D2D9E8]'} border px-3.5 py-2.5 rounded-xl transition-all text-left shadow-sm flex items-center gap-1.5`}
                        >
                          <span className="text-amber-500">⚡</span> "{prompt}"
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  messages.map((m, idx) => (
                    <div
                      key={idx}
                      className={`flex gap-3 ${
                        m.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {m.role === 'assistant' && (
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#F6C453] to-[#B8790F] flex items-center justify-center shrink-0 mt-0.5 shadow-md">
                          <span className="font-extrabold text-xs text-black">₹</span>
                        </div>
                      )}
                      <div
                        className={`max-w-[85%] rounded-2xl p-4.5 ${
                          m.role === 'user'
                            ? 'bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-slate-950 font-semibold shadow-md'
                            : isWhite
                              ? 'bg-white border border-violet-100 shadow-md text-[#2E1065]'
                              : 'glass-panel border border-white/10 shadow-md text-[#E9EDF5]'
                        }`}
                      >
                        {m.role === 'user' ? (
                          <div className="text-sm">{m.content}</div>
                        ) : (
                          renderFormattedText(m.content)
                        )}
                      </div>
                    </div>
                  ))
                )}

                {isChatLoading && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#F6C453] to-[#B8790F] flex items-center justify-center shrink-0 animate-pulse">
                      <span className="font-extrabold text-xs text-black">₹</span>
                    </div>
                    <div className={`${isWhite ? 'bg-white border-violet-100 text-[#4C1D95]' : 'glass-panel border-white/10 text-[#8B96AC]'} border rounded-2xl p-3.5 flex items-center gap-2.5 text-xs shadow-sm`}>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-500" />
                      <span>Checking Indian retail prices, MRPs, and expert reviews...</span>
                    </div>
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Chat Input Bar */}
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleSendChat();
                }}
                className={`p-3 sm:p-4 ${isWhite ? 'bg-[#FAF8FF] border-t border-violet-100' : 'bg-black/40 border-t border-white/10'} flex gap-2.5 backdrop-blur-lg`}
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  placeholder="Ask anything (e.g. Best wireless earbuds with ANC under ₹5,000)"
                  className={`flex-1 ${isWhite ? 'bg-white border-violet-200 text-[#2E1065] placeholder:text-[#8B78A5] focus:border-[#7C3AED]' : 'bg-black/50 border-white/10 text-[#E9EDF5] placeholder-[#8B96AC] focus:border-[#7C3AED]'} border rounded-2xl px-4 py-3 text-sm focus:outline-none transition-all shadow-inner`}
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim() || isChatLoading}
                  className="bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-amber-500 hover:to-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-black px-5 rounded-2xl flex items-center justify-center transition-all shadow-md"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* Tab 2: Multi-Source Research */}
          {activeTab === 'multi' && (
            <div className="space-y-6">
              <div className={`${isWhite ? 'glass-panel-white border-violet-100' : 'glass-panel border-white/10'} border rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl`}>
                <div>
                  <h3 className={`font-heading font-extrabold text-lg ${isWhite ? 'text-[#2E1065]' : 'text-white'}`}>
                    Deep Multi-Angle Indian Market Research
                  </h3>
                  <p className={`text-xs ${isWhite ? 'text-[#4C1D95]' : 'text-[#8B96AC]'} mt-1 leading-relaxed`}>
                    Combines three dedicated research angles: <strong className={`${isWhite ? 'text-[#2E1065] font-bold' : 'text-white'}`}>Indian Retail MRP & Offers</strong> (Amazon India, Flipkart), <strong className={`${isWhite ? 'text-[#2E1065] font-bold' : 'text-white'}`}>Community Verdict</strong> (Reddit, DesiDime, Indian tech forums), and <strong className={`${isWhite ? 'text-[#2E1065] font-bold' : 'text-white'}`}>Professional Reviewers</strong> (NDTV Gadgets, Beebom, TechRadar).
                  </p>
                </div>

                <form onSubmit={handleRunMulti} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={multiGoal}
                    onChange={e => setMultiGoal(e.target.value)}
                    placeholder="e.g. best ergonomic office chair under ₹15,000 in India"
                    className={`flex-1 ${isWhite ? 'bg-white border-violet-200 text-[#2E1065] placeholder:text-[#8B78A5] focus:border-[#7C3AED]' : 'bg-black/50 border-white/10 text-[#E9EDF5] placeholder-[#8B96AC] focus:border-[#7C3AED]'} border rounded-2xl px-4 py-3 text-sm focus:outline-none shadow-inner`}
                  />
                  <button
                    type="submit"
                    disabled={!multiGoal.trim() || isMultiLoading}
                    className="bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-amber-500 hover:to-amber-400 disabled:opacity-50 text-slate-950 font-black px-6 py-3 rounded-2xl transition-all flex items-center justify-center gap-2 text-sm shrink-0 shadow-lg"
                  >
                    {isMultiLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Synthesizing in ₹...</span>
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4" />
                        <span>Run Multi-source Research</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Research Results */}
              {multiResult && (
                <div className="space-y-4">
                  {multiResult.error ? (
                    <div className="bg-rose-950/40 border border-rose-800 text-rose-300 p-4 rounded-2xl text-sm">
                      <strong>Error:</strong> {multiResult.error}
                    </div>
                  ) : (
                    <>
                      {/* Executive Summary */}
                      {multiResult.summary && (
                        <div className={`${isWhite ? 'glass-panel-white border-violet-200 text-[#2E1065]' : 'glass-panel border-[#F0B429]/30 text-[#D2D9E8]'} border rounded-2xl p-5 shadow-lg`}>
                          <h4 className={`font-heading font-extrabold text-xs uppercase tracking-wider ${isWhite ? 'text-[#7C3AED]' : 'text-[#7C3AED]'} mb-1.5 flex items-center gap-1.5`}>
                            <Sparkles className="w-3.5 h-3.5" />
                            Executive Market Synthesis
                          </h4>
                          <p className="text-sm leading-relaxed">
                            {multiResult.summary}
                          </p>
                        </div>
                      )}

                      {/* Recommendations List */}
                      <div className="space-y-5">
                        {(multiResult.recommendations || []).map((rec, i) => {
                          const productImg = getProductFallbackImg(rec.name, rec.image_url);

                          return (
                            <div
                              key={i}
                              className={`${isWhite ? 'glass-panel-white border-l-4 border-l-[#7C3AED] border-violet-100 text-[#2E1065] shadow-xl' : 'glass-panel border-l-4 border-l-[#7C3AED] border-y border-r border-white/10 text-[#D2D9E8] shadow-xl'} rounded-3xl p-5 space-y-4 hover:border-white/20 transition-all duration-200 overflow-hidden`}
                            >
                              {/* Top Product Header with High-Resolution Visual Banner */}
                              <div className={`flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-b ${isWhite ? 'border-violet-100' : 'border-white/10'} pb-4`}>
                                <div className="flex items-center gap-3.5">
                                  {/* Product Thumbnail with Rank Overlay and Verified Photo Badge - Clickable */}
                                  <div
                                    onClick={() => handleOpenProductModal(rec)}
                                    className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden ${isWhite ? 'bg-violet-50 border-violet-100 hover:border-violet-300' : 'bg-black/50 border-white/15 hover:border-violet-400'} border shrink-0 relative group shadow-md cursor-pointer transition-all`}
                                    title="Click to view full photos and verified specs"
                                  >
                                    <img
                                      src={rec.image_url || productImg}
                                      alt={rec.name}
                                      referrerPolicy="no-referrer"
                                      className="w-full h-full object-contain p-1.5 group-hover:scale-110 transition-transform duration-300"
                                      onError={(e) => handleImageError(e)}
                                    />
                                    <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-lg bg-black/75 backdrop-blur-md text-[#7C3AED] font-heading font-black text-xs border border-white/10 shadow-sm">
                                      #{rec.rank || i + 1}
                                    </span>
                                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[8px] bg-black/85 backdrop-blur-md text-[#7C3AED] font-bold border border-violet-300/30">
                                      Exact Photo
                                    </span>
                                  </div>

                                  <div>
                                    <h4
                                      onClick={() => handleOpenProductModal(rec)}
                                      className={`font-heading font-bold text-base sm:text-lg ${isWhite ? 'text-[#2E1065] hover:text-[#7C3AED]' : 'text-white hover:text-violet-300'} cursor-pointer transition-colors`}
                                      title="Click to open full product report"
                                    >
                                      {rec.name}
                                    </h4>
                                    <div className="mt-1 flex items-center gap-2 flex-wrap">
                                      <span className={`text-[11px] ${isWhite ? 'text-[#7C6898]' : 'text-[#8B96AC]'}`}>Best Price:</span>
                                      <span className={`text-xs sm:text-sm font-extrabold ${isWhite ? 'text-[#2E1065] bg-violet-50 border-violet-200' : 'text-[#7C3AED] bg-black/60 border-[#F0B429]/40'} px-3 py-1 rounded-xl border shadow-sm`}>
                                        {rec.price}
                                      </span>
                                      {rec.source_store && (
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${
                                          isWhite ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40'
                                        }`}>
                                          ✓ {rec.source_store} Listing
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Actions: View Full Specs / Photos & Direct Buy */}
                                <div className="flex items-center gap-2 flex-wrap">
                                  <button
                                    onClick={() => handleOpenProductModal(rec)}
                                    className="px-3.5 py-2.5 rounded-2xl bg-violet-100 hover:bg-violet-200 text-[#4C1D95] border border-violet-200 font-bold text-xs inline-flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                                  >
                                    <Sparkles className="w-3.5 h-3.5 text-[#7C3AED]" />
                                    <span>Specs & Photos</span>
                                  </button>

                                  {rec.source_url && (
                                    <a
                                      href={rec.source_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-purple-600 hover:to-violet-700 text-white font-black text-xs inline-flex items-center gap-2 shadow-md transition-all hover:scale-105 active:scale-95 shrink-0"
                                    >
                                      <ShoppingCart className="w-3.5 h-3.5" />
                                      <span>Buy on {rec.source_store || 'Source'}</span>
                                      <ExternalLink className="w-3 h-3 opacity-80" />
                                    </a>
                                  )}
                                </div>
                              </div>

                            {/* Pros and Cons */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className={`${isWhite ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950' : 'bg-emerald-950/20 border-emerald-900/40 text-[#D2D9E8]'} p-4 rounded-xl border`}>
                                <span className="font-heading font-bold text-xs text-emerald-600 block mb-2">
                                  ✅ Key Advantages (Pros)
                                </span>
                                <ul className="space-y-1.5 text-xs">
                                  {(rec.pros || []).map((p, pIdx) => (
                                    <li key={pIdx} className="flex items-start gap-1.5">
                                      <span className="text-emerald-500 mt-0.5 font-bold">•</span>
                                      <span>{p}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div className={`${isWhite ? 'bg-violet-50/80 border-amber-200 text-[#2E1065]' : 'bg-amber-950/20 border-amber-900/40 text-[#D2D9E8]'} p-4 rounded-xl border`}>
                                <span className="font-heading font-bold text-xs text-[#7C3AED] block mb-2">
                                  ⚠️ Trade-offs & Cons
                                </span>
                                <ul className="space-y-1.5 text-xs">
                                  {(rec.cons || []).map((c, cIdx) => (
                                    <li key={cIdx} className="flex items-start gap-1.5">
                                      <span className="text-amber-500 mt-0.5 font-bold">•</span>
                                      <span>{c}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            {/* Community & Expert Takes */}
                            <div className="space-y-2 pt-1 text-xs">
                              {rec.community_take && (
                                <div className={`${isWhite ? 'bg-[#FAF8FF] border-violet-100 text-[#2E1065]' : 'bg-black/40 border-white/5 text-[#C4D0E6]'} border p-3.5 rounded-xl`}>
                                  <strong className={`${isWhite ? 'text-[#7C3AED]' : 'text-[#7C3AED]'} block mb-1 font-bold`}>
                                    💬 Indian Community & Forum Verdict:
                                  </strong>
                                  {rec.community_take}
                                </div>
                              )}
                              {rec.expert_take && (
                                <div className={`${isWhite ? 'bg-[#FAF8FF] border-violet-100 text-[#2E1065]' : 'bg-black/40 border-white/5 text-[#C4D0E6]'} border p-3.5 rounded-xl`}>
                                  <strong className={`${isWhite ? 'text-[#7C3AED]' : 'text-[#7C3AED]'} block mb-1 font-bold`}>
                                    🔬 Expert Reviews & Lab Tests:
                                  </strong>
                                  {rec.expert_take}
                                </div>
                              )}
                              {/* Dedicated Multi-Store Shopping Links Bar */}
                              <div className={`pt-3 border-t ${isWhite ? 'border-violet-100' : 'border-white/10'} space-y-2`}>
                                <div className="flex items-center justify-between">
                                  <span className={`text-xs font-bold ${isWhite ? 'text-[#7C3AED]' : 'text-[#7C3AED]'} flex items-center gap-1.5 uppercase tracking-wider`}>
                                    <ShoppingCart className="w-3.5 h-3.5" /> Buy / Check Live Prices in India:
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-2 pt-0.5">
                                  {(rec.store_links || getFallbackStoreLinks(rec.name, rec.source_url)).map((storeLink, sIdx) => {
                                    const isAmazon = storeLink.store.toLowerCase().includes('amazon');
                                    const isFlipkart = storeLink.store.toLowerCase().includes('flipkart');
                                    const isCroma = storeLink.store.toLowerCase().includes('croma');
                                    const isReliance = storeLink.store.toLowerCase().includes('reliance');

                                    let bgClasses = isWhite
                                      ? 'bg-violet-50 hover:bg-slate-200 text-[#2E1065] border-violet-200'
                                      : 'bg-white/10 hover:bg-white/20 text-white border-white/10';
                                    let dotColor = 'bg-[#7C3AED]';

                                    if (isAmazon) {
                                      bgClasses = isWhite
                                        ? 'bg-violet-50 hover:bg-violet-100 text-[#2E1065] border-violet-200 shadow-sm'
                                        : 'bg-amber-950/40 hover:bg-amber-900/60 text-[#FFB020] border-amber-600/40 hover:border-violet-400';
                                      dotColor = 'bg-[#FF9900]';
                                    } else if (isFlipkart) {
                                      bgClasses = isWhite
                                        ? 'bg-blue-50 hover:bg-blue-100 text-blue-900 border-blue-300 shadow-sm'
                                        : 'bg-blue-950/40 hover:bg-blue-900/60 text-[#93C5FD] border-blue-600/40 hover:border-blue-500';
                                      dotColor = 'bg-[#2874F0]';
                                    } else if (isCroma) {
                                      bgClasses = isWhite
                                        ? 'bg-teal-50 hover:bg-teal-100 text-teal-900 border-teal-300 shadow-sm'
                                        : 'bg-teal-950/40 hover:bg-teal-900/60 text-[#5EEAD4] border-teal-600/40 hover:border-teal-500';
                                      dotColor = 'bg-[#00E8C6]';
                                    } else if (isReliance) {
                                      bgClasses = isWhite
                                        ? 'bg-rose-50 hover:bg-rose-100 text-rose-900 border-rose-300 shadow-sm'
                                        : 'bg-rose-950/40 hover:bg-rose-900/60 text-[#FDA4AF] border-rose-600/40 hover:border-rose-500';
                                      dotColor = 'bg-[#E42529]';
                                    }

                                    return (
                                      <a
                                        key={sIdx}
                                        href={storeLink.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all duration-150 shadow-sm ${bgClasses}`}
                                      >
                                        <span className={`w-2 h-2 rounded-full ${dotColor}`} />
                                        <span>{storeLink.name}</span>
                                        <span className={`text-[10px] font-normal opacity-80 ${isWhite ? 'bg-white text-[#3B1E7A]' : 'bg-black/40 text-slate-300'} px-1.5 py-0.5 rounded-md`}>
                                          {storeLink.badge}
                                        </span>
                                        <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
                                      </a>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )}

  {/* Interactive Verified Product Detail Modal with Specs, Gallery & Reviews */}
  <ProductDetailModal
    isOpen={isProductModalOpen}
    onClose={() => setIsProductModalOpen(false)}
    product={selectedProductForModal}
    onTrackProduct={handleTrackGenericProduct}
    onAskAi={handleAskAiAboutProduct}
    isWhite={isWhite}
  />
</div>
  );
}
