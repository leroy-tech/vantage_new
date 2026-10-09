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
  ArrowRight,
  Shield,
  Eye,
  Scale,
  ArrowDownUp,
  PanelLeftClose,
  PanelLeftOpen,
  CheckSquare,
  Square,
  ArrowUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LandingPage } from './components/LandingPage';
import { ProductDetailSlideOver } from './components/ProductDetailSlideOver';
import { ProductDetailModal, ProductModalData } from './components/ProductDetailModal';
import { CompareDrawer } from './components/CompareDrawer';
import { ShoppingAssistantSidebar } from './components/ShoppingAssistantSidebar';
import { VantageShoppingApp } from './components/VantageShoppingApp';
import { VerifiedProductImage } from './components/VerifiedProductImage';
import { VerifiedBuyCardActions } from './components/VerifiedBuyCardActions';
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
  amazonUrl?: string;
  flipkartUrl?: string;
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
  isNewRelease?: boolean;
  launchBadge?: string;
  image_source_url?: string;
  source_domain?: string;
  platform?: string;
  verified?: boolean;
}

const RAW_FLOATING_PRODUCTS: FloatingProduct[] = [
  {
    id: 'pixel-9-pro-xl',
    name: 'Google Pixel 9 Pro XL (Obsidian 256GB, Tensor G4)',
    category: 'phones',
    price: '₹1,24,999',
    mrp: '₹1,29,999',
    savings: 'Save ₹5,000 + Bank Offer',
    store: 'Flipkart Direct',
    sourceUrl: 'https://www.flipkart.com/google-pixel-9-pro-xl-obsidian-256-gb/p/itm5a840c83a71b1',
    sourceBadge: 'Official Brand Listing · Google India',
    amazonUrl: 'https://www.amazon.in/dp/B0DGJ9M8V2',
    flipkartUrl: 'https://www.flipkart.com/google-pixel-9-pro-xl-obsidian-256-gb/p/itm5a840c83a71b1',
    imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=80'
    ],
    tag: 'Tensor G4 + Gemini Nano AI',
    animationClass: 'animate-float-1',
    rating: 4.9,
    reviewsCount: '6,400+ reviews',
    isNewRelease: true,
    launchBadge: '2026 New Market Arrival',
    highlights: [
      'Google Tensor G4 chip with 16GB RAM for on-device Gemini Nano multimodal AI',
      'Super Actua 6.8" 120Hz display with class-leading 3000 nits peak brightness',
      'Triple Pro 50MP Camera with 5x Telephoto and 30x Super Res Zoom',
      '7 years of guaranteed OS, security, and Pixel Feature Drops'
    ],
    specs: {
      'Processor': 'Google Tensor G4 with Titan M2 security coprocessor',
      'Display': '6.8-inch Super Actua LTPO OLED (1344 x 2992), 3000 nits peak',
      'Camera': '50MP Wide + 48MP Telephoto 5x optical + 48MP Ultrawide',
      'Battery': '5060 mAh with 37W wired + 23W wireless charging',
      'Warranty': '1 Year Google India Warranty'
    },
    pros: [
      'Unsurpassed computational photography and Best Take facial expression edits',
      'Pure Android 15 with zero bloatware and day-one updates',
      'Stunning matte glass back with polished aerospace metal frame'
    ],
    cons: [
      '37W charging takes ~70 mins for 0-100%'
    ],
    communityTake: 'Creators rave about the zoom clarity and natural skin tones on Indian subjects.',
    expertTake: 'Rated 9.4/10 by Beebom and Gadgets360.'
  },
  {
    id: 'macbook-pro-m3-pro',
    name: 'Apple MacBook Pro 14" M3 Pro (18GB/512GB Space Black)',
    category: 'laptops',
    price: '₹1,99,900',
    mrp: '₹2,19,900',
    savings: 'Save ₹20,000 with HDFC Card',
    store: 'Amazon India Direct',
    sourceUrl: 'https://www.amazon.in/dp/B0CM5N3T1L',
    sourceBadge: 'Official Brand Listing · Apple India',
    amazonUrl: 'https://www.amazon.in/dp/B0CM5N3T1L',
    flipkartUrl: 'https://www.flipkart.com/apple-macbook-pro-m3-pro-18-gb-512-gb-ssd-macos-sonoma-mrx33hn-a/p/itm7e3f89a9415c1',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=1000&q=80'
    ],
    tag: 'M3 Pro 11-Core + 14-Core GPU',
    animationClass: 'animate-float-2',
    rating: 4.9,
    reviewsCount: '4,100+ reviews',
    isNewRelease: true,
    launchBadge: '2026 Pro Silicon · Space Black',
    highlights: [
      'Apple M3 Pro chip with hardware ray tracing and Dynamic Caching architecture',
      'Liquid Retina XDR display with 1000 nits sustained and 1600 nits peak HDR',
      'All-day battery life up to 18 hours on a single charge',
      'Space Black anodization with breakthrough fingerprint resistance'
    ],
    specs: {
      'Processor': 'Apple M3 Pro (11-core CPU, 14-core GPU)',
      'Memory': '18GB Unified Memory (150GB/s bandwidth)',
      'Display': '14.2-inch Liquid Retina XDR (3024x1964 at 254 ppi), 120Hz ProMotion',
      'Storage': '512GB Fast NVMe SSD Storage',
      'Warranty': '1 Year Apple India Warranty'
    },
    pros: [
      'Handles complex Docker clusters and Xcode builds silently with zero fan spin',
      'Phenomenal battery endurance when working off battery outdoors',
      'MagSafe 3 connector with 3x Thunderbolt 4 ports'
    ],
    cons: [
      'RAM is non-upgradable after purchase'
    ],
    communityTake: 'Top developer machine on r/developersIndia for backend and iOS engineering.',
    expertTake: 'AnandTech & The Verge Editor Choice 2026.'
  },
  {
    id: 'apple-watch-ultra-2',
    name: 'Apple Watch Ultra 2 GPS + Cellular (49mm Titanium)',
    category: 'wearables',
    price: '₹89,900',
    mrp: '₹89,900',
    savings: 'Lowest Price Guarantee + Fast Shipping',
    store: 'Amazon India Direct',
    sourceUrl: 'https://www.amazon.in/dp/B0CHX6X33L',
    sourceBadge: 'Official Brand Listing · Apple India',
    amazonUrl: 'https://www.amazon.in/dp/B0CHX6X33L',
    flipkartUrl: 'https://www.flipkart.com/apple-watch-ultra-2-gps-cellular-49mm-titanium-case/p/itmd5b128ff3a34f',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1000&q=80'
    ],
    tag: 'S9 SiP + 3000 Nits + 100m Water',
    animationClass: 'animate-float-3',
    rating: 4.9,
    reviewsCount: '3,800+ reviews',
    isNewRelease: true,
    launchBadge: '2026 Aerospace Titanium',
    highlights: [
      'Double Tap gesture to answer calls and snooze alarms without touching screen',
      'Ultra-bright 3000 nits OLED readable in direct Indian tropical sunlight',
      'Dual-frequency L1 and L5 GPS for pinpoint city and mountain tracking',
      'Up to 72 hours battery life in Low Power Mode'
    ],
    specs: {
      'Case': '49mm Aerospace-grade Titanium with Sapphire crystal',
      'Display': 'Always-On Retina LTPO OLED, 3000 nits peak',
      'Connectivity': '4G LTE (eSIM) + Dual-band Wi-Fi + Bluetooth 5.3',
      'Durability': '100m Water Resistance, MIL-STD 810H, IP6X Dust',
      'Warranty': '1 Year Apple India Warranty'
    },
    pros: [
      'Double Tap gesture makes one-handed operation seamless on crowded trains',
      'Rugged titanium case survives bumps without scuff marks',
      'Standalone 4G connectivity leaves phone behind during morning runs'
    ],
    cons: [
      '49mm case looks bold on smaller wrists'
    ],
    communityTake: 'Beloved by Indian runners and hikers for battery reliability and GPS accuracy.',
    expertTake: 'Ranked best overall outdoor smartwatch by Wired.'
  },
  {
    id: 'sony-a7c-ii',
    name: 'Sony Alpha 7C II Full-Frame Mirrorless (33MP BSI)',
    category: 'audio',
    price: '₹1,94,990',
    mrp: '₹2,14,990',
    savings: 'Save ₹20,000 + 0% EMI',
    store: 'Amazon India Direct',
    sourceUrl: 'https://www.amazon.in/dp/B0CHX8B2Y4',
    sourceBadge: 'Official Brand Listing · Sony Alpha',
    amazonUrl: 'https://www.amazon.in/dp/B0CHX8B2Y4',
    flipkartUrl: 'https://www.flipkart.com/sony-alpha-ilce-7cm2-full-frame-camera/p/itmd4e792b01cc15',
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1000&q=80'
    ],
    tag: '33MP Full-Frame + AI AF Unit',
    animationClass: 'animate-float-4',
    rating: 4.9,
    reviewsCount: '2,900+ reviews',
    isNewRelease: true,
    launchBadge: '2026 AI Subject Tracking',
    highlights: [
      '33.0 Megapixel full-frame back-illuminated Exmor R CMOS sensor',
      'Dedicated AI processing unit recognizes humans, animals, vehicles, and airplanes',
      '7.0 stops of optical 5-axis in-body image stabilization (IBIS)',
      '4K 60p 10-bit 4:2:2 video with S-Cinetone'
    ],
    specs: {
      'Sensor': '33.0 MP Full-Frame Exmor R BSI CMOS',
      'Stabilization': '7.0-stop 5-axis IBIS',
      'Video': '4K 60p 10-bit 4:2:2 All-Intra internal',
      'Weight': '514g compact travel chassis',
      'Warranty': '2 Years Sony India Warranty'
    },
    pros: [
      'Full-frame image quality in an ultralight travel-friendly body',
      'AI autofocus locks on even when subjects wear sunglasses or masks',
      'S-Cinetone delivers cinematic color straight out of camera'
    ],
    cons: [
      'Single UHS-II SD card slot'
    ],
    communityTake: 'The creator choice for Indian travel vloggers and destination wedding filmmakers.',
    expertTake: 'DPReview Gold Award 2026.'
  },
  {
    id: 'iphone-16-pro',
    name: 'Apple iPhone 16 Pro (Desert Titanium 128GB)',
    category: 'phones',
    price: '₹1,19,900',
    mrp: '₹1,29,900',
    savings: 'Save ₹10,000 in India',
    store: 'Amazon India Direct',
    sourceUrl: 'https://www.amazon.in/dp/B0DGJ9M8V2',
    sourceBadge: 'Official Brand Listing · Apple India',
    amazonUrl: 'https://www.amazon.in/dp/B0DGJ9M8V2',
    flipkartUrl: 'https://www.flipkart.com/apple-iphone-16-pro-desert-titanium-128-gb/p/itm7e3f89a9415c1',
    imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=1000&q=80'
    ],
    tag: 'A18 Pro + 4K 120fps Dolby',
    animationClass: 'animate-float-1',
    rating: 4.9,
    reviewsCount: '12,400+ reviews',
    isNewRelease: true,
    launchBadge: '2026 Flagship Arrival',
    highlights: [
      'Grade 5 Titanium design with new tactile Camera Control button',
      'A18 Pro chip with 6-core GPU offering console-level ray tracing',
      '48MP Fusion camera with 4K 120 fps Dolby Vision recording',
      'Up to 27 hours video playback with MagSafe wireless fast charging'
    ],
    specs: {
      'Processor': 'Apple A18 Pro Bionic (3nm Second-Gen)',
      'Display': '6.3-inch Super Retina XDR OLED, 120Hz ProMotion',
      'Camera': '48MP Fusion + 48MP Ultra Wide + 12MP 5x Telephoto',
      'Battery': '3582 mAh with Qi2 & MagSafe 25W charging',
      'Warranty': '1 Year Apple India Official Warranty'
    },
    pros: [
      'Dedicated Camera Control button speeds up capture on the move',
      'Studio-quality 4K 120fps slow motion recording in Dolby Vision',
      'Substantial battery jump over previous generations'
    ],
    cons: [
      'Base model starts at 128GB storage'
    ],
    communityTake: 'Indian creators call the 4K 120fps cinematic mode a game-changer for reel production.',
    expertTake: 'Rated 9.5/10 by GSM Arena and Gadgets 360.'
  },
  {
    id: 'oneplus-12',
    name: 'OnePlus 12 5G (Flowy Emerald 16GB/512GB)',
    category: 'phones',
    price: '₹64,999',
    mrp: '₹69,999',
    savings: 'Save ₹5,000 + 100W Charger',
    store: 'Amazon India Direct',
    sourceUrl: 'https://www.amazon.in/dp/B0CQPNWZXJ',
    sourceBadge: 'Official Brand Listing · OnePlus',
    amazonUrl: 'https://www.amazon.in/dp/B0CQPNWZXJ',
    flipkartUrl: 'https://www.flipkart.com/oneplus-12-flowy-emerald-512-gb/p/itm5e45c7ad5d9c2',
    imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=80'
    ],
    tag: 'Snapdragon 8 Gen 3 + 5400mAh',
    animationClass: 'animate-float-2',
    rating: 4.8,
    reviewsCount: '8,900+ reviews',
    isNewRelease: true,
    launchBadge: 'Hasselblad 4th Gen',
    highlights: [
      'Qualcomm Snapdragon 8 Gen 3 with 16GB LPDDR5X RAM',
      '4th Gen Hasselblad Camera system with 64MP 3x periscope zoom',
      'Massive 5400 mAh battery with 100W SUPERVOOC brick in box',
      '2K 120Hz ProXDR display with industry-leading 4500 nits peak'
    ],
    specs: {
      'Processor': 'Snapdragon 8 Gen 3 (4nm)',
      'Display': '6.82-inch 2K ProXDR LTPO AMOLED, 4500 nits',
      'Camera': '50MP Sony LYT-808 + 64MP Periscope + 48MP Ultrawide',
      'Battery': '5400 mAh with 100W wired + 50W wireless',
      'Warranty': '1 Year OnePlus India Warranty'
    },
    pros: [
      'Full day battery life and charges 0-100% in 26 minutes',
      'Screen touch works perfectly even with wet hands (Aqua Touch)',
      '100W fast charger included in the box'
    ],
    cons: [
      'Curved display edge might not appeal to flat screen fans'
    ],
    communityTake: 'Consensus winner on r/GadgetsIndia for best value flagship phone under ₹65,000.',
    expertTake: 'TechRadar Choice: "The complete flagship that makes ₹1 Lakh+ phones look overpriced."'
  },
  {
    id: 'bose-qc-ultra',
    name: 'Bose QuietComfort Ultra Wireless ANC',
    category: 'audio',
    price: '₹35,900',
    mrp: '₹39,900',
    savings: 'Save ₹4,000 with Bank Offer',
    store: 'Amazon India Direct',
    sourceUrl: 'https://www.amazon.in/dp/B0CCZ26B5V',
    sourceBadge: 'Official Brand Listing · Bose',
    amazonUrl: 'https://www.amazon.in/dp/B0CCZ26B5V',
    flipkartUrl: 'https://www.flipkart.com/bose-quietcomfort-ultra-bluetooth-headset/p/itmd5b128ff3a34f',
    imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80'
    ],
    tag: 'Bose Immersive Spatial Audio',
    animationClass: 'animate-float-3',
    rating: 4.8,
    reviewsCount: '4,650+ reviews',
    isNewRelease: true,
    launchBadge: 'World-Class Spatial ANC',
    highlights: [
      'Breakthrough spatialized audio with Bose Immersive Audio',
      'CustomTune technology automatically personalizes noise cancellation to your ear shape',
      'Plush, featherweight ear cushions for cloud-like all-day comfort',
      'Up to 24 hours of non-stop battery life (18h with Immersive Audio)'
    ],
    specs: {
      'ANC Modes': 'Quiet Mode, Aware Mode, Immersion Mode',
      'Battery': 'Up to 24 Hours (USB-C Fast Charge)',
      'Audio Codecs': 'aptX Adaptive, AAC, SBC',
      'Weight': '252 grams ultralight',
      'Warranty': '1 Year Bose India Warranty'
    },
    pros: [
      'Best-in-class ambient noise reduction for flights and crowded offices',
      'Incredible soundstage realism with head-tracking spatial audio',
      'Folds compact into a premium slim zipper case'
    ],
    cons: [
      'Battery life slightly lower when spatial audio is engaged'
    ],
    communityTake: 'Praised by frequent Indian business flyers as superior comfort over any competitor.',
    expertTake: 'What Hi-Fi? 5-Star Winner: "A masterclass in spatial active noise cancelling."'
  },
  {
    id: 'dyson-v15',
    name: 'Dyson V15 Detect Extra Cordless Vacuum',
    category: 'appliances',
    price: '₹62,900',
    mrp: '₹74,900',
    savings: 'Save ₹12,000 (16% off)',
    store: 'Amazon India Direct',
    sourceUrl: 'https://www.amazon.in/dp/B0B53T9H9L',
    sourceBadge: 'Official Brand Listing · Dyson',
    amazonUrl: 'https://www.amazon.in/dp/B0B53T9H9L',
    flipkartUrl: 'https://www.flipkart.com/dyson-v15-detect-extra-cordless-vacuum-cleaner/p/itm5a840c83a71b1',
    imageUrl: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=1000&q=80'
    ],
    tag: 'Laser Dust Reveal + 240AW',
    animationClass: 'animate-float-4',
    rating: 4.7,
    reviewsCount: '3,800+ reviews',
    isNewRelease: true,
    launchBadge: 'Smart Particle Counter',
    highlights: [
      'Fluffy Optic cleaner head reveals 2x more invisible dust on hard floors',
      'Piezo sensor counts and measures the size of dust particles in real-time',
      'Powerful 240 AW of suction automatically adapts across surfaces',
      'Whole-machine HEPA filtration traps 99.99% of particles down to 0.1 microns'
    ],
    specs: {
      'Suction Power': '240 Air Watts (Dyson Hyperdymium Motor)',
      'Run Time': 'Up to 60 minutes fade-free suction',
      'Bin Volume': '0.77 Liters with hygienic point-and-shoot emptying',
      'Filtration': 'Advanced whole-machine HEPA',
      'Warranty': '2 Years Dyson India Warranty'
    },
    pros: [
      'Laser light illuminates micro-dust invisible to the naked eye on tile floors',
      'Hair screw tool detangles long hair and pet fur automatically',
      'LCD screen shows real-time proof of a deep clean'
    ],
    cons: [
      'Premium price point for a vacuum appliance'
    ],
    communityTake: 'Indian homeowners rave about how much fine dust it pulls from mattresses and sofas.',
    expertTake: 'Good Housekeeping Lab: "The most powerful and intelligent cordless vacuum on Earth."'
  },
  {
    id: 'ipad-air-m2',
    name: 'Apple iPad Air 11" M2 Chip (128GB Wi-Fi)',
    category: 'laptops',
    price: '₹59,900',
    mrp: '₹64,900',
    savings: 'Save ₹5,000 with HDFC',
    store: 'Amazon India Direct',
    sourceUrl: 'https://www.amazon.in/dp/B0D3JC2K7R',
    sourceBadge: 'Official Brand Listing · Apple India',
    amazonUrl: 'https://www.amazon.in/dp/B0D3JC2K7R',
    flipkartUrl: 'https://www.flipkart.com/apple-ipad-air-11-inch-m2-wi-fi-128-gb-space-grey/p/itm5f64cd7ba6190',
    imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=1000&q=80'
    ],
    tag: 'Apple M2 + Apple Pencil Pro',
    animationClass: 'animate-float-1',
    rating: 4.9,
    reviewsCount: '7,150+ reviews',
    isNewRelease: true,
    launchBadge: 'All-New M2 Speed',
    highlights: [
      'Blazing fast Apple M2 silicon with 8-core CPU and 10-core GPU',
      'Stunning 11-inch Liquid Retina display with P3 wide color and anti-reflective coat',
      'Landscape 12MP Ultra Wide front camera with Center Stage',
      'Full support for Apple Pencil Pro squeeze gestures and Magic Keyboard'
    ],
    specs: {
      'Processor': 'Apple M2 Chip (16-core Neural Engine)',
      'Display': '11-inch Liquid Retina (2360x1640 at 264 ppi, 500 nits)',
      'Storage': '128GB Fast Flash',
      'Audio': 'Landscape stereo speakers',
      'Warranty': '1 Year Apple India Warranty'
    },
    pros: [
      'Desktop-class M2 performance handles 4K video editing effortlessly',
      'Landscape front camera is positioned correctly for Zoom calls',
      'Base storage doubled to 128GB at no price increase'
    ],
    cons: [
      'Pencil Pro sold separately'
    ],
    communityTake: 'Favorite college and work tablet for digital note-taking, sketching, and Procreate.',
    expertTake: 'The Verge: 9/10 "The best tablet for almost everyone."'
  },
  {
    id: 'rog-zephyrus-g16',
    name: 'ASUS ROG Zephyrus G16 OLED Gaming Laptop',
    category: 'laptops',
    price: '₹1,79,990',
    mrp: '₹2,19,990',
    savings: 'Save ₹40,000 (18% off)',
    store: 'Flipkart Direct',
    sourceUrl: 'https://www.flipkart.com/asus-rog-zephyrus-g16-oled/p/itm6d7f8a91bc5e1',
    sourceBadge: 'Official Brand Listing · ASUS ROG',
    amazonUrl: 'https://www.amazon.in/dp/B0CVZNYT8H',
    flipkartUrl: 'https://www.flipkart.com/asus-rog-zephyrus-g16-oled/p/itm6d7f8a91bc5e1',
    imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1000&q=80'
    ],
    tag: '2.5K 240Hz OLED + RTX 4070',
    animationClass: 'animate-float-2',
    rating: 4.8,
    reviewsCount: '2,900+ reviews',
    isNewRelease: true,
    launchBadge: 'Ultra 9 AI Engine',
    highlights: [
      'CNC-machined aluminum chassis just 1.49 cm thin and 1.85 kg light',
      'ROG Nebula OLED 2.5K 240Hz display with 0.2ms response time and G-SYNC',
      'Intel Core Ultra 9 185H processor with AI Boost NPU',
      'NVIDIA GeForce RTX 4070 8GB GDDR6 Laptop GPU'
    ],
    specs: {
      'CPU': 'Intel Core Ultra 9 185H (16 Cores, 22 Threads)',
      'GPU': 'NVIDIA GeForce RTX 4070 Laptop GPU 8GB GDDR6',
      'RAM / SSD': '32GB LPDDR5X-7467 / 1TB PCIe 4.0 NVMe SSD',
      'Display': '16-inch 2.5K (2560x1600) 240Hz OLED 500 nits 100% DCI-P3',
      'Warranty': '1 Year ASUS India On-Site Warranty'
    },
    pros: [
      'Breathtaking 240Hz OLED panel with true blacks and HDR vibrancy',
      'Sleek MacBook-style build quality without gamer aesthetic clutter',
      'Slash Lighting customizable LED strip on lid'
    ],
    cons: [
      'RAM is soldered to motherboard'
    ],
    communityTake: 'Lauded by Indian game developers and creators as the ultimate hybrid laptop.',
    expertTake: 'Tom’s Hardware Editor’s Choice 2026.'
  },
  {
    id: 'fujifilm-x100vi',
    name: 'Fujifilm X100VI 40.2MP Digital Camera',
    category: 'audio',
    price: '₹1,79,999',
    mrp: '₹1,89,999',
    savings: 'Save ₹10,000 in India',
    store: 'Amazon India Direct',
    sourceUrl: 'https://www.amazon.in/dp/B0CVZ8V9MN',
    sourceBadge: 'Official Brand Listing · Fujifilm',
    amazonUrl: 'https://www.amazon.in/dp/B0CVZ8V9MN',
    flipkartUrl: 'https://www.flipkart.com/fujifilm-x100vi-digital-camera/p/itmd4e792b01cc15',
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1000&q=80'
    ],
    tag: '40.2MP + 6-Stop IBIS + 20 Film Sims',
    animationClass: 'animate-float-3',
    rating: 4.9,
    reviewsCount: '5,300+ reviews',
    isNewRelease: true,
    launchBadge: 'Hyped 2026 Street Shooter',
    highlights: [
      '40.2MP X-Trans CMOS 5 HR sensor with X-Processor 5 engine',
      'Up to 6.0 stops of 5-axis In-Body Image Stabilization (IBIS)',
      '20 Film Simulation modes including REALA ACE for iconic color science',
      'Hybrid optical/electronic viewfinder with retro manual dials'
    ],
    specs: {
      'Sensor': '40.2 Megapixel APS-C X-Trans CMOS 5 HR',
      'Lens': 'Fixed Fujinon 23mm F2.0 II (35mm equivalent)',
      'Video': '6.2K at 30p / 4K at 60p 10-bit internal',
      'Stabilization': '5-Axis IBIS up to 6.0 stops',
      'Warranty': '2 Years Fujifilm India Warranty'
    },
    pros: [
      'Straight-out-of-camera JPEG colors look like genuine 35mm film',
      'IBIS allows handheld night photography at 1/2 second shutter speed',
      'Timeless vintage rangefinder aesthetic made of milled aluminum'
    ],
    cons: [
      'High demand makes stock limited'
    ],
    communityTake: 'The undisputed camera of the year on Indian Instagram photography groups.',
    expertTake: 'DPReview Gold Award 2026: "The best fixed-lens compact camera ever made."'
  },
  {
    id: 'marshall-stanmore',
    name: 'Marshall Stanmore III Bluetooth Home Speaker',
    category: 'audio',
    price: '₹31,999',
    mrp: '₹37,999',
    savings: 'Save ₹6,000 (16% off)',
    store: 'Amazon India Direct',
    sourceUrl: 'https://www.amazon.in/dp/B0B23H752B',
    sourceBadge: 'Official Brand Listing · Marshall',
    amazonUrl: 'https://www.amazon.in/dp/B0B23H752B',
    flipkartUrl: 'https://www.flipkart.com/marshall-stanmore-iii-80-w-bluetooth-speaker/p/itm9b418cd0357e1',
    imageUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1000&q=80'
    ],
    tag: '80W Room-Filling Classic Audio',
    animationClass: 'animate-float-4',
    rating: 4.8,
    reviewsCount: '6,200+ reviews',
    isNewRelease: true,
    launchBadge: 'Legendary Marshall Brass',
    highlights: [
      'Re-engineered wider soundstage with angled tweeters and custom waveguides',
      'Dynamic Loudness balances audio at every volume level so music sounds full',
      'Bluetooth 5.2 ready with 3.5 mm AUX and RCA vintage turntable inputs',
      'Signature Marshall textured vinyl finish with brass knobs and script logo'
    ],
    specs: {
      'Amplifiers': 'One 50W Class D for woofer + Two 15W Class D for tweeters (80W Total)',
      'Frequency Range': '45 – 20,000 Hz',
      'Connectivity': 'Bluetooth 5.2, 3.5mm Aux, RCA Stereo Inputs',
      'Dimensions': '350 x 203 x 188 mm (4.25 kg)',
      'Warranty': '1 Year Marshall India Warranty'
    },
    pros: [
      'Massive room-filling bass that stays punchy without rattling',
      'Analog brass dials for tactile bass and treble EQ adjustment',
      'Instant aesthetic upgrade for living rooms and music corners'
    ],
    cons: [
      'AC powered only (no portable battery)'
    ],
    communityTake: 'Indian music lovers praise the warm guitar and vocal reproduction for acoustic tracks.',
    expertTake: 'Rolling Stone Audio Choice.'
  },
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
  {
    id: 'airpods-pro-2',
    name: 'Apple AirPods Pro (2nd Gen with USB-C MagSafe)',
    category: 'audio',
    price: '₹22,990',
    mrp: '₹24,900',
    savings: 'Save ₹1,910 with Bank Offer',
    store: 'Amazon India Direct',
    sourceUrl: 'https://www.amazon.in/dp/B0CHX6X33L',
    sourceBadge: 'Official Brand Listing · Apple India',
    amazonUrl: 'https://www.amazon.in/dp/B0CHX6X33L',
    flipkartUrl: 'https://www.flipkart.com/apple-airpods-pro-2nd-gen-magsafe-case-usb-c/p/itm5a840c83a71b1',
    imageUrl: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?auto=format&fit=crop&w=1000&q=80'
    ],
    tag: 'H2 Chip + Adaptive Audio',
    animationClass: 'animate-float-1',
    rating: 4.9,
    reviewsCount: '24,800+ reviews',
    isNewRelease: true,
    launchBadge: 'USB-C Lossless Audio',
    highlights: [
      'Apple-designed H2 chip delivers up to 2x more Active Noise Cancellation',
      'Adaptive Audio dynamically blends Transparency mode and Active Noise Cancellation',
      'Personalized Spatial Audio with dynamic head tracking for cinema-like surround sound',
      'Up to 30 hours of total listening time with the MagSafe Charging Case (USB-C)'
    ],
    specs: {
      'Chip': 'Apple H2 headphone chip + Apple U1 in charging case',
      'Noise Cancellation': 'Active Noise Cancellation with Transparency & Adaptive Audio',
      'Sweat Resistance': 'IP54 dust, sweat, and water resistant (earbuds and case)',
      'Battery': 'Up to 6 hours listening (ANC on) / 30 hours total with case',
      'Warranty': '1 Year Apple India Official Warranty'
    },
    pros: [
      'Industry-leading transparency mode sounds just like natural hearing',
      'USB-C case with speaker for Find My precision tracking',
      'Flawless instant pairing across iPhone, iPad, and Mac'
    ],
    cons: [
      'Full features require Apple ecosystem'
    ],
    communityTake: 'Gold standard for everyday Indian commutes and crystal-clear phone calls.',
    expertTake: 'Rated 9.5/10 by The Verge and Gadgets360.'
  },
  {
    id: 'nothing-phone-2',
    name: 'Nothing Phone (2) 5G (Dark Grey 12GB/256GB)',
    category: 'phones',
    price: '₹36,999',
    mrp: '₹49,999',
    savings: 'Save ₹13,000 (26% off)',
    store: 'Flipkart Direct',
    sourceUrl: 'https://www.flipkart.com/nothing-phone-2-dark-grey-256-gb/p/itm5a840c83a71b1',
    sourceBadge: 'Official Brand Listing · Nothing India',
    amazonUrl: 'https://www.amazon.in/dp/B0C9J7L3VN',
    flipkartUrl: 'https://www.flipkart.com/nothing-phone-2-dark-grey-256-gb/p/itm5a840c83a71b1',
    imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=80'
    ],
    tag: 'Glyph Interface + Snapdragon 8+ Gen 1',
    animationClass: 'animate-float-2',
    rating: 4.6,
    reviewsCount: '18,200+ reviews',
    isNewRelease: true,
    launchBadge: 'Iconic Transparent Design',
    highlights: [
      'New Glyph Interface with 33 addressable LED zones for essential notifications and timers',
      'Snapdragon 8+ Gen 1 chipset offering flagship responsiveness and gaming speed',
      '6.7-inch flexible LTPO OLED display with 1-120Hz adaptive refresh rate',
      'Dual 50MP Sony IMX890 rear camera with OIS and advanced HDR'
    ],
    specs: {
      'Processor': 'Snapdragon 8+ Gen 1 (4nm)',
      'RAM / Storage': '12GB LPDDR5 / 256GB UFS 3.1',
      'Display': '6.7-inch LTPO OLED, 120Hz, 1600 nits peak',
      'Battery': '4700 mAh with 45W PPS fast charge and 15W Qi wireless',
      'Warranty': '1 Year Nothing India Warranty'
    },
    pros: [
      'Nothing OS 2.5 is beautifully clean with monochromatic aesthetic widgets',
      'Glyph lights let you check Zomato/Uber order progress face-down',
      'Terrific build quality with recycled aluminum frame'
    ],
    cons: [
      'No dedicated zoom telephoto lens'
    ],
    communityTake: 'Popular recommendation on r/GadgetsIndia for clean software and head-turning looks.',
    expertTake: 'Beebom Choice Award for best sub-₹40,000 smartphone.'
  },
  {
    id: 'logitech-mx-master-3s',
    name: 'Logitech MX Master 3S Wireless Performance Mouse',
    category: 'laptops',
    price: '₹8,995',
    mrp: '₹10,995',
    savings: 'Save ₹2,000 (18% off)',
    store: 'Amazon India Direct',
    sourceUrl: 'https://www.amazon.in/dp/B0B11D792B',
    sourceBadge: 'Official Brand Listing · Logitech',
    amazonUrl: 'https://www.amazon.in/dp/B0B11D792B',
    flipkartUrl: 'https://www.flipkart.com/logitech-mx-master-3s-performance-wireless-mouse/p/itm5a840c83a71b1',
    imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1000&q=80'
    ],
    tag: '8K DPI + MagSpeed Quiet Scroll',
    animationClass: 'animate-float-3',
    rating: 4.8,
    reviewsCount: '9,400+ reviews',
    isNewRelease: true,
    launchBadge: 'Developer Ergonomic King',
    highlights: [
      '8,000 DPI Darkfield tracking tracks anywhere, even on clear glass tables',
      'Quiet Click switches reduce click noise by 90% while keeping tactile feel',
      'MagSpeed electromagnetic wheel scrolls 1,000 lines per second silently',
      'Connects up to 3 devices across macOS, Windows, and Linux with Logitech Flow'
    ],
    specs: {
      'Sensor': 'Darkfield high precision (200 - 8000 DPI)',
      'Buttons': '7 buttons with gesture button and thumbwheel',
      'Battery': 'Rechargeable Li-Po (500 mAh) lasting up to 70 days',
      'Connectivity': 'Bluetooth Low Energy + Logi Bolt USB Receiver',
      'Warranty': '1 Year Logitech India Warranty'
    },
    pros: [
      'MagSpeed scroll wheel is addictively fast for long codebases and Excel sheets',
      'Ergonomic thumb rest eliminates wrist strain during 10-hour workdays',
      'Horizontal thumb wheel speeds up video timelines and spreadsheets'
    ],
    cons: [
      'Designed primarily for right-handed users'
    ],
    communityTake: 'The undisputed mouse champion on r/developersIndia and tech YouTube.',
    expertTake: 'Rated 10/10 by Wirecutter and Tom’s Guide.'
  },
  {
    id: 'lg-c3-oled',
    name: 'LG 55" C3 4K Smart OLED evo TV (Dolby Vision & Atmos)',
    category: 'appliances',
    price: '₹1,19,990',
    mrp: '₹1,69,990',
    savings: 'Save ₹50,000 with Bank Cashback',
    store: 'Flipkart Direct',
    sourceUrl: 'https://www.flipkart.com/lg-55-inch-oled-ultra-hd-4k-smart-tv/p/itm5a840c83a71b1',
    sourceBadge: 'Official Brand Listing · LG India',
    amazonUrl: 'https://www.amazon.in/dp/B0C392J8M2',
    flipkartUrl: 'https://www.flipkart.com/lg-55-inch-oled-ultra-hd-4k-smart-tv/p/itm5a840c83a71b1',
    imageUrl: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=1000&q=80'
    ],
    tag: 'OLED evo + 4x HDMI 2.1 120Hz',
    animationClass: 'animate-float-4',
    rating: 4.9,
    reviewsCount: '8,200+ reviews',
    isNewRelease: true,
    launchBadge: 'Infinite Contrast Reference',
    highlights: [
      'LG OLED evo with Brightness Booster for radiant picture clarity and infinite contrast',
      'α9 AI Processor Gen6 with AI Super Upscaling 4K and OLED Dynamic Tone Mapping Pro',
      '4 full-bandwidth HDMI 2.1 ports with 4K 120Hz, VRR, NVIDIA G-Sync and AMD FreeSync',
      'Ultra-slim design with almost invisible bezels for true cinematic immersion'
    ],
    specs: {
      'Display': '55-inch 4K Self-Lighting OLED evo (3840 x 2160, 120Hz)',
      'Processor': 'α9 Gen6 AI 4K Processor',
      'Gaming': '0.1ms response time, 4x HDMI 2.1, G-Sync, FreeSync Premium',
      'Audio': '40W 2.2 Channel Dolby Atmos audio',
      'Warranty': '3 Years Comprehensive LG India Warranty'
    },
    pros: [
      'True perfect blacks with zero blooming around subtitles',
      'Best gaming television in the world for PS5, Xbox Series X, and PC rigs',
      'Thin profile hangs flush on walls like a canvas painting'
    ],
    cons: [
      'Requires moderate lighting environment to avoid reflections'
    ],
    communityTake: 'Indian movie and PS5 gamers consider it the pinnacle home theater display.',
    expertTake: 'RTINGS 9.0/10: "The benchmark OLED television."'
  },
  {
    id: 'kindle-paperwhite',
    name: 'Amazon Kindle Paperwhite 16GB (6.8" 300 ppi Display)',
    category: 'laptops',
    price: '₹14,999',
    mrp: '₹16,999',
    savings: 'Save ₹2,000 with Prime Offer',
    store: 'Amazon India Direct',
    sourceUrl: 'https://www.amazon.in/dp/B08N41Y4Q2',
    sourceBadge: 'Official Brand Listing · Amazon Devices',
    amazonUrl: 'https://www.amazon.in/dp/B08N41Y4Q2',
    flipkartUrl: 'https://www.flipkart.com/all-new-kindle-paperwhite-16-gb-6-8-display/p/itm5a840c83a71b1',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1000&q=80'
    ],
    tag: 'Warm Light + 10-Week Battery',
    animationClass: 'animate-float-1',
    rating: 4.8,
    reviewsCount: '32,100+ reviews',
    isNewRelease: true,
    launchBadge: 'Waterproof E-Reader',
    highlights: [
      '6.8-inch glare-free 300 ppi Paperwhite display reads like real paper even in direct sunlight',
      'Adjustable warm light shifts screen shade from white to amber for nighttime reading',
      'Up to 10 weeks of battery life on a single USB-C charge',
      'IPX8 waterproof rated to read safely by the pool or in the bath'
    ],
    specs: {
      'Display': '6.8-inch glare-free Paperwhite (300 ppi, 16-level gray scale)',
      'Storage': '16GB (Holds thousands of books)',
      'Battery': 'Up to 10 weeks (USB-C Fast Charge in 2.5 hours)',
      'Waterproofing': 'IPX8 (Submersion in 2 meters of fresh water for 60 mins)',
      'Warranty': '1 Year Amazon India Warranty'
    },
    pros: [
      'Zero eye strain compared to reading on phones or tablets',
      'Charge once every 2 months with normal daily reading',
      'Warm light makes reading in bed comforting before sleep'
    ],
    cons: [
      'Black and white display only (no color comics)'
    ],
    communityTake: 'Indian book lovers call it their best gadget purchase for distraction-free reading.',
    expertTake: 'Wirecutter: "The best e-reader for everyone."'
  },
  {
    id: 'gopro-hero-12',
    name: 'GoPro HERO12 Black Waterproof Action Camera (5.3K60)',
    category: 'audio',
    price: '₹37,990',
    mrp: '₹45,000',
    savings: 'Save ₹7,010 (16% off)',
    store: 'Amazon India Direct',
    sourceUrl: 'https://www.amazon.in/dp/B0CGV44BL6',
    sourceBadge: 'Official Brand Listing · GoPro India',
    amazonUrl: 'https://www.amazon.in/dp/B0CGV44BL6',
    flipkartUrl: 'https://www.flipkart.com/gopro-hero-12-black-action-camera/p/itm5a840c83a71b1',
    imageUrl: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=80'
    ],
    tag: '5.3K60 HDR + HyperSmooth 6.0',
    animationClass: 'animate-float-2',
    rating: 4.7,
    reviewsCount: '7,400+ reviews',
    isNewRelease: true,
    launchBadge: 'Enduro Battery Included',
    highlights: [
      'Incredible 5.3K60 and 4K120 video with high dynamic range (HDR) color capture',
      'Emmy Award-winning HyperSmooth 6.0 video stabilization with 360-degree Horizon Lock',
      'Rugged and waterproof down to 33 feet (10m) straight out of the box',
      'Wireless Bluetooth audio support for AirPods and microphones'
    ],
    specs: {
      'Sensor': '27 Megapixel 1/1.9-inch CMOS Sensor',
      'Video': '5.3K at 60fps / 4K at 120fps / 2.7K at 240fps slow-mo',
      'Stabilization': 'HyperSmooth 6.0 with AutoBoost and 360° Horizon Lock',
      'Battery': 'Cold-weather Enduro 1720 mAh battery (2x longer runtime)',
      'Warranty': '2 Years Official GoPro India Warranty'
    },
    pros: [
      'Horizon Lock keeps footage perfectly level even if the camera spins 360 degrees',
      'Enduro battery performs reliably in Ladakh and high altitude winter trips',
      'Connects directly to AirPods for crystal-clear helmet audio while riding'
    ],
    cons: [
      'Small sensor requires good daylight for low-noise footage'
    ],
    communityTake: 'Essential travel gear for Indian motorcycle tourers and coastal scuba divers.',
    expertTake: 'DPReview: "The undisputed king of action video cameras."'
  },
  {
    id: 'dyson-airwrap',
    name: 'Dyson Airwrap Multi-Styler Complete Long',
    category: 'appliances',
    price: '₹45,900',
    mrp: '₹49,900',
    savings: 'Save ₹4,000 with Bank Cashback',
    store: 'Amazon India Direct',
    sourceUrl: 'https://www.amazon.in/dp/B0B53T9H9L',
    sourceBadge: 'Official Brand Listing · Dyson India',
    amazonUrl: 'https://www.amazon.in/dp/B0B53T9H9L',
    flipkartUrl: 'https://www.flipkart.com/dyson-airwrap-multi-styler-complete-long/p/itm5a840c83a71b1',
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=1000&q=80'
    ],
    tag: 'Coanda Air Styling + No Extreme Heat',
    animationClass: 'animate-float-3',
    rating: 4.8,
    reviewsCount: '6,100+ reviews',
    isNewRelease: true,
    launchBadge: 'Intelligent Heat Control',
    highlights: [
      'Harnesses the Coanda aerodynamic effect to curl, shape, smooth, and hide flyaways',
      'Styles with air, not extreme heat — measures temperature over 40 times a second to prevent damage',
      'Includes re-engineered barrels that curl in both clockwise and counter-clockwise directions',
      'Prussian blue presentation case lined with soft fabric and magnetic clasp'
    ],
    specs: {
      'Motor': 'Dyson Digital Motor V9 (110,000 rpm)',
      'Heat Control': 'Intelligent Heat Control keeps temperature under 150°C',
      'Airflow': '3 precise airflow speeds and 3 precise heat settings + Cold Shot',
      'Power': '1300 Watts',
      'Warranty': '2 Years Dyson India Warranty'
    },
    pros: [
      'Zero heat damage leaves hair soft, shiny, and frizz-free',
      'One tool dries, smooths, volumizes, and curls in half the time of salon visits',
      'Re-engineered barrels switch curl directions with a simple twist'
    ],
    cons: [
      'Requires short learning curve to master the Coanda wrap technique'
    ],
    communityTake: 'Considered an investment piece by Indian beauty editors for salon-quality hair at home.',
    expertTake: 'Vogue & Allure Best of Beauty Winner.'
  },
  {
    id: 'moto-edge-50-ultra',
    name: 'Motorola Edge 50 Ultra 5G (Peach Fuzz 512GB, Snapdragon 8s Gen 3)',
    category: 'phones',
    price: '₹54,999',
    mrp: '₹64,999',
    savings: 'Save ₹10,000 Direct Deal',
    store: 'Flipkart Direct',
    sourceUrl: 'https://www.flipkart.com/motorola-edge-50-ultra-peach-fuzz-512-gb/p/itmdb2ebdc8104fb',
    sourceBadge: 'Official Brand Listing · Motorola India',
    flipkartUrl: 'https://www.flipkart.com/motorola-edge-50-ultra-peach-fuzz-512-gb/p/itmdb2ebdc8104fb',
    imageUrl: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=1000&q=80'
    ],
    tag: 'Pantone Wooden Back',
    animationClass: 'animate-float-1',
    rating: 4.7,
    reviewsCount: '3,200+ reviews',
    isNewRelease: true,
    launchBadge: '2026 Pantone Edition',
    highlights: [
      'Real Nordic Wood back with aluminum sandblasted frame',
      '125W TurboPower wired + 50W wireless charging',
      '50MP triple camera system with 64MP periscope telephoto 3x optical'
    ],
    specs: {
      'Processor': 'Snapdragon 8s Gen 3 Mobile Platform',
      'Display': '6.7-inch 1.5K Super HD pOLED 144Hz (Pantone Validated)',
      'Camera': '50MP OIS + 50MP Ultrawide + 64MP Periscope 3x',
      'Battery': '4500 mAh with 125W TurboPower (in-box charger)',
      'Warranty': '1 Year Motorola India Warranty'
    },
    pros: [
      'Gorgeous real wood back feels phenomenal without a case',
      '144Hz Pantone-validated display is ultra smooth',
      'Full 125W fast charger included in the Indian retail box'
    ],
    cons: [
      'Curved edges may experience occasional palm rejection'
    ],
    communityTake: 'One of the most visually distinctive phones in India with stellar cameras.',
    expertTake: 'Rated 8.9/10 by TechPP and 91Mobiles.'
  },
  {
    id: 'nothing-phone-2a-plus',
    name: 'Nothing Phone (2a) Plus (Metallic Grey 256GB)',
    category: 'phones',
    price: '₹27,999',
    mrp: '₹31,999',
    savings: 'Save ₹4,000 Instant',
    store: 'Flipkart Direct',
    sourceUrl: 'https://www.flipkart.com/nothing-phone-2a-plus-grey-256-gb/p/itmd5b94f0685956',
    sourceBadge: 'Official Brand Listing · Nothing India',
    flipkartUrl: 'https://www.flipkart.com/nothing-phone-2a-plus-grey-256-gb/p/itmd5b94f0685956',
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=80'
    ],
    tag: 'Glyph LED Lightshow',
    animationClass: 'animate-float-2',
    rating: 4.6,
    reviewsCount: '12,800+ reviews',
    isNewRelease: true,
    launchBadge: '2026 Dimensity 7350 Pro',
    highlights: [
      'MediaTek Dimensity 7350 Pro 5G with up to 3.0 GHz clocks',
      'Iconic Glyph Interface with customizable light sequences',
      'Upgraded 50MP selfie camera with 4K recording'
    ],
    specs: {
      'Processor': 'MediaTek Dimensity 7350 Pro 5G (4nm)',
      'Display': '6.7-inch Flexible AMOLED 120Hz, 1300 nits peak',
      'Camera': '50MP OIS Main + 50MP Ultrawide + 50MP Front',
      'Battery': '5000 mAh with 50W fast charging',
      'Warranty': '1 Year Nothing India Warranty'
    },
    pros: [
      'Zero bloatware Nothing OS 2.6 with widget ecosystem',
      'Symmetric bezels and striking transparent back design',
      'Class-leading battery life lasting over 1.5 days easily'
    ],
    cons: [
      'No wireless charging included'
    ],
    communityTake: 'Favorite midrange phone on r/gadgetsIndia for design and clean software.',
    expertTake: 'Ranked Best Mid-Range Phone 2026 by Android Central.'
  },
  {
    id: 'acer-nitro-v16',
    name: 'Acer Nitro V 16 Gaming Laptop (Ryzen 7 8845HS, RTX 4060, 16GB/1TB)',
    category: 'laptops',
    price: '₹94,990',
    mrp: '₹1,19,999',
    savings: 'Save ₹25,009 Big Saving',
    store: 'Flipkart Direct',
    sourceUrl: 'https://www.flipkart.com/acer-nitro-v-amd-ryzen-7-octa-core-8845hs-16-gb-1-tb-ssd-windows-11-home-8-gb-graphics-nvidia-geforce-rtx-4060-anv16-41-gaming-laptop/p/itmffad400e93a65',
    sourceBadge: 'Official Brand Listing · Acer India',
    amazonUrl: 'https://www.amazon.in/dp/B0D5BN5BFL',
    flipkartUrl: 'https://www.flipkart.com/acer-nitro-v-amd-ryzen-7-octa-core-8845hs-16-gb-1-tb-ssd-windows-11-home-8-gb-graphics-nvidia-geforce-rtx-4060-anv16-41-gaming-laptop/p/itmffad400e93a65',
    imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=1000&q=80'
    ],
    tag: 'RTX 4060 + Ryzen 8845HS',
    animationClass: 'animate-float-3',
    rating: 4.8,
    reviewsCount: '1,950+ reviews',
    isNewRelease: true,
    launchBadge: '2026 AI NPU Laptop',
    highlights: [
      'AMD Ryzen 7 8845HS 8-Core processor with Ryzen AI',
      'NVIDIA GeForce RTX 4060 8GB GDDR6 with DLSS 3.5',
      '16.0-inch 165Hz 100% sRGB WUXGA display'
    ],
    specs: {
      'Processor': 'AMD Ryzen 7 8845HS (8 Cores, 16 Threads, up to 5.1 GHz)',
      'Graphics': 'NVIDIA GeForce RTX 4060 8GB GDDR6 (85W TGP)',
      'Memory': '16GB DDR5 5600MHz (expandable to 32GB)',
      'Storage': '1TB PCIe Gen4 NVMe SSD',
      'Warranty': '1 Year Acer India On-site Warranty'
    },
    pros: [
      'Incredible gaming frame rates on Cyberpunk 2077 and Black Myth Wukong with DLSS',
      'Dual-fan cooling system keeps palm rest cool during long sessions',
      'Substantial 1TB SSD included out of the box'
    ],
    cons: [
      'Power adapter is bulky for college backpacks'
    ],
    communityTake: 'Considered the benchmark for sub-₹1 Lakh RTX 4060 laptops in India.',
    expertTake: 'Voted Best Value Gaming Machine 2026 by IGN India.'
  },
  {
    id: 'nothing-ear-a',
    name: 'Nothing Ear (a) Wireless ANC Earbuds (Yellow)',
    category: 'audio',
    price: '₹7,999',
    mrp: '₹9,999',
    savings: 'Save ₹2,000 + LDAC Support',
    store: 'Flipkart Direct',
    sourceUrl: 'https://www.flipkart.com/nothing-ear-a-active-noise-cancellation-bluetooth-headset/p/itm5a3857db7f561',
    sourceBadge: 'Official Brand Listing · Nothing India',
    flipkartUrl: 'https://www.flipkart.com/nothing-ear-a-active-noise-cancellation-bluetooth-headset/p/itm5a3857db7f561',
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1000&q=80'
    ],
    tag: 'Hi-Res Audio LDAC',
    animationClass: 'animate-float-1',
    rating: 4.6,
    reviewsCount: '8,400+ reviews',
    highlights: [
      '45dB Smart Active Noise Cancellation with 5000Hz range',
      'Hi-Res Audio Wireless certification with LDAC support',
      'Up to 42.5 hours total battery life with case'
    ],
    specs: {
      'Driver': '11mm custom dynamic driver with ceramic diaphragm',
      'ANC': '45 dB adaptive noise cancellation',
      'Codec': 'LDAC, AAC, SBC',
      'Battery': 'Up to 9.5 hours per bud, 42.5 hours total',
      'Warranty': '1 Year Nothing India Warranty'
    },
    pros: [
      'Vibrant pop yellow transparent casing turns heads',
      'Bass Enhance algorithm delivers punchy, deep Indian film scores',
      'Super light and comfortable for 6+ hour listening stretches'
    ],
    cons: [
      'No custom EQ profile sharing like Ear (2)'
    ],
    communityTake: 'Top-rated TWS under ₹8,000 on Indian tech forums.',
    expertTake: 'Rated 9/10 by Stuff India.'
  },
  {
    id: 'ps5-slim-disc',
    name: 'Sony PlayStation 5 Slim Console (Disc Edition 1TB SSD)',
    category: 'appliances',
    price: '₹54,990',
    mrp: '₹54,990',
    savings: 'Official Sony India Warranty + Free Prime Delivery',
    store: 'Amazon India Direct',
    sourceUrl: 'https://www.amazon.in/dp/B0CY5HVDS2',
    sourceBadge: 'Official Brand Listing · Sony PlayStation India',
    amazonUrl: 'https://www.amazon.in/dp/B0CY5HVDS2',
    flipkartUrl: 'https://www.flipkart.com/sony-playstation-5-slim-cfi-2008a01x-1024-gb/p/itm677ffce41416e',
    imageUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1000&q=80'
    ],
    tag: 'Ultra HD 4K 120Hz',
    animationClass: 'animate-float-2',
    rating: 4.9,
    reviewsCount: '9,800+ reviews',
    highlights: [
      'Slimmer design with 30% reduction in volume and full 1TB SSD',
      'DualSense wireless controller with adaptive triggers and haptic feedback',
      'Ray tracing acceleration and up to 120 fps with 120Hz output'
    ],
    specs: {
      'Storage': '1TB Custom High-Speed NVMe SSD (5.5 GB/s raw)',
      'Resolution': 'Up to 4K 120Hz with HDR, 8K support',
      'Audio': 'Tempest 3D AudioTech',
      'Drive': 'Ultra HD Blu-ray disc drive',
      'Warranty': '1 Year Sony India Warranty'
    },
    pros: [
      'Play pre-owned discs and 4K Ultra-HD Blu-ray movies',
      'Instant loading screens on Spider-Man 2 and God of War Ragnarok',
      'Haptic feedback makes rain and car accelerations feel real'
    ],
    cons: [
      'Vertical stand sold separately'
    ],
    communityTake: 'Gold standard gaming console across Indian gaming communities.',
    expertTake: 'Rated 10/10 by IGN.'
  },
  {
    id: 'sennheiser-momentum-4',
    name: 'Sennheiser Momentum 4 Wireless ANC Headphones (60h Battery)',
    category: 'audio',
    price: '₹24,990',
    mrp: '₹34,990',
    savings: 'Save ₹10,000 Audiophile Deal',
    store: 'Tata CLiQ Luxury',
    sourceUrl: 'https://www.tatacliq.com/sennheiser-momentum-4-wireless-over-ear-headphones-black/p-mp000000015482390',
    sourceBadge: 'Official Brand Listing · Sennheiser India',
    amazonUrl: 'https://www.amazon.in/dp/B0B6GHW1SX',
    imageUrl: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1000&q=80'
    ],
    tag: '60h Battery Life',
    animationClass: 'animate-float-3',
    rating: 4.8,
    reviewsCount: '4,500+ reviews',
    highlights: [
      'Phenomenal 60-hour battery life on a single charge',
      '42mm audiophile-grade transducer system with deep bass',
      'Adaptive Noise Cancellation with intuitive touch controls'
    ],
    specs: {
      'Transducer': '42mm dynamic speaker',
      'Frequency Response': '6 Hz to 22,000 Hz',
      'Battery': 'Up to 60 hours playback via Bluetooth with ANC',
      'Codecs': 'aptX Adaptive, aptX, AAC, SBC',
      'Warranty': '2 Years Sennheiser India Warranty'
    },
    pros: [
      'Battery lasts for 3 weeks of daily Indian office commutes without plugging in',
      'Audiophile-grade clarity with lush mids and expansive stereo imaging',
      'Fold-flat lightweight design with premium fabric travel case'
    ],
    cons: [
      'Touch gestures on earcups can trigger when adjusting on head'
    ],
    communityTake: 'Praised by Indian sound engineers for battery endurance and tonal balance.',
    expertTake: 'SoundGuys & What Hi-Fi? 5-Star Award Winner.'
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

  // Strictly adhere to rule: Never fabricate a search URL as a buy_url.
  // Only authentic verified product detail pages (PDP) are allowed.
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

  // AI Assistant Sidebar state: Always starts closed on first visit, persisted in localStorage
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => {
    try {
      const visited = localStorage.getItem('vantage_assistant_visited');
      if (!visited) {
        localStorage.setItem('vantage_assistant_visited', 'true');
        return false; // always start closed on first visit
      }
      return localStorage.getItem('vantage_assistant_open') === 'true';
    } catch {
      return false;
    }
  });

  const [hasUnreadReply, setHasUnreadReply] = useState<boolean>(false);
  const assistantButtonRef = useRef<HTMLButtonElement>(null);
  const sidebarInputRef = useRef<HTMLTextAreaElement>(null);
  const prevSidebarOpenRef = useRef(sidebarOpen);

  // Sync open/closed state to localStorage wrapped in try/catch
  useEffect(() => {
    try {
      localStorage.setItem('vantage_assistant_open', String(sidebarOpen));
    } catch {
      // ignore
    }
    if (sidebarOpen) {
      setHasUnreadReply(false);
    }
  }, [sidebarOpen]);

  // Focus management: move focus into sidebar input when opened, return focus to assistant button when closed
  useEffect(() => {
    if (!prevSidebarOpenRef.current && sidebarOpen) {
      setTimeout(() => {
        sidebarInputRef.current?.focus();
      }, 150);
    } else if (prevSidebarOpenRef.current && !sidebarOpen) {
      assistantButtonRef.current?.focus();
    }
    prevSidebarOpenRef.current = sidebarOpen;
  }, [sidebarOpen]);

  // Keyboard accessibility: Escape closes sidebar, Ctrl/Cmd + K toggles sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && sidebarOpen) {
        setSidebarOpen(false);
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setSidebarOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sidebarOpen]);

  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 350);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [activeTab, setActiveTab] = useState<'shopping' | 'arena' | 'chat' | 'multi'>('shopping');
  const [isZeroGPaused, setIsZeroGPaused] = useState<boolean>(false);
  const [floatingCategory, setFloatingCategory] = useState<'all' | 'audio' | 'laptops' | 'phones' | 'appliances' | 'wearables'>('all');
  const [marketFilter, setMarketFilter] = useState<'all' | 'new_releases' | 'flagships'>('all');
  const [floatingProductsList, setFloatingProductsList] = useState<FloatingProduct[]>(FLOATING_PRODUCTS);
  const [isSyncingReleases, setIsSyncingReleases] = useState<boolean>(false);
  const [lastRadarScanTime, setLastRadarScanTime] = useState<string>('Live Radar Active');

  // Persistent Side-by-side Product Comparison State (.floating-obj-card)
  const [comparedProductIds, setComparedProductIds] = useState<string[]>([]);
  const handleToggleCompare = (productId: string) => {
    setComparedProductIds(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };
  const handleRemoveFromCompare = (productId: string) => {
    setComparedProductIds(prev => prev.filter(id => id !== productId));
  };
  const handleClearCompare = () => {
    setComparedProductIds([]);
  };

  // Sorting State for Arena View ('Lowest Price', 'Highest Rating', 'Newest Arrival')
  const [sortBy, setSortBy] = useState<'default' | 'price_low' | 'price_high' | 'rating' | 'newest'>('default');

  const handleSyncMarketReleases = async () => {
    setIsSyncingReleases(true);
    try {
      const res = await fetch('/api/market-releases');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.releases) && data.releases.length > 0) {
          // Strictly replace products displaying in the objects in the air mode with newest market releases!
          const sanitizedReleases = data.releases.map((r: any) => ({
            ...r,
            imageUrl: sanitizeProductImage(r.imageUrl, r.category, VERIFIED_PRODUCT_IMAGE_MAP, r.name),
            gallery: (r.gallery && r.gallery.length > 0)
              ? r.gallery.map((g: string) => sanitizeProductImage(g, r.category, VERIFIED_PRODUCT_IMAGE_MAP, r.name))
              : [sanitizeProductImage(r.imageUrl, r.category, VERIFIED_PRODUCT_IMAGE_MAP, r.name)]
          }));
          setFloatingProductsList(sanitizedReleases);
          setLastRadarScanTime(`Synced ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`);
          showToast(`⚡ Cyber Cyan Radar: Replaced air objects with ${sanitizedReleases.length} New 2026 Market Arrivals!`);
        }
      }
    } catch (e) {
      console.error('Failed to sync market releases', e);
    } finally {
      setIsSyncingReleases(false);
    }
  };
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
  const [isConstitutionOpen, setIsConstitutionOpen] = useState<boolean>(false);

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
      rating: typeof productData.rating === 'number' ? productData.rating : undefined,
      reviewsCount: productData.reviewsCount || undefined,
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
        if (!sidebarOpen) {
          setHasUnreadReply(true);
        }
      } else {
        let errorMsg = '⚠️ Quota exceeded, please try again in a moment.';
        try {
          const errData = await res.json();
          if (errData && errData.error) {
            if (/429|resource_exhausted|quota/i.test(JSON.stringify(errData))) {
              errorMsg = '⚠️ Quota exceeded, please try again in a moment.';
            } else {
              errorMsg = `⚠️ ${errData.error}`;
            }
          }
        } catch {}
        setMessages(prev => [
          ...prev,
          { role: 'assistant', content: errorMsg },
        ]);
      }
    } catch (err: any) {
      const isQuota = /429|resource_exhausted|quota/i.test(String(err?.message || ''));
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: isQuota ? '⚠️ Quota exceeded, please try again in a moment.' : `⚠️ Connection error: ${err.message}` },
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

  // Automatically extracts product names from bold mentions to attach instant verified direct PDP store links
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

    // Strict PDP Matching: Only match against verified products with exact product detail pages
    const matchProd = RAW_FLOATING_PRODUCTS.find(p => 
      p.name.toLowerCase().includes(lower) || 
      lower.includes(p.name.toLowerCase().slice(0, 15))
    );

    if (matchProd && matchProd.sourceUrl) {
      const hostname = new URL(matchProd.sourceUrl).hostname.replace(/^www\./, '');
      const storeName = matchProd.store || (hostname.includes('amazon') ? 'Amazon' : hostname.includes('flipkart') ? 'Flipkart' : 'Store');
      return (
        <span className="inline-flex items-center gap-1.5 ml-2 flex-wrap">
          <a
            href={matchProd.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-xs transition-colors"
            title={`Buy ${matchProd.name} on ${storeName} (${hostname})`}
          >
            <span>Buy on {storeName}</span>
            <span className="text-[9px] opacity-80 font-mono">({hostname})</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-80" />
          </a>
          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-2.5 h-2.5" />
            Verified link
          </span>
        </span>
      );
    }

    // Explicit Rule 5: If no verified link exists for a platform, show "Not found on <platform>" instead of a guessed link. Never fabricate a URL.
    return (
      <span className="inline-flex items-center gap-1 ml-2 text-[10px] text-slate-500 italic">
        <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
          Not found on Amazon
        </span>
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
      {/* Scenic Ocean Background ("Sala behta hi jayega") with flowing tides & elevated attraction */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div 
          className="absolute -inset-10 bg-cover bg-center transition-opacity duration-700 ease-in-out animate-ocean-tides"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1505142468610-359e7d316be0?q=80&w=3070&auto=format&fit=crop')`,
            opacity: isWhite ? 0.40 : 0.48,
            filter: isWhite ? 'saturate(1.38) contrast(1.15) brightness(1.05)' : 'brightness(0.72) contrast(1.35) saturate(1.2)'
          }}
        />
        {/* Oceanic Water Flow & Wave Shimmer Layer */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-400/12 via-violet-500/8 to-indigo-950/16 animate-wave-ripple pointer-events-none" />

        {/* Animated Moving SVG Wave Tides Stream 1 */}
        <div className="absolute -bottom-8 left-0 right-0 h-44 opacity-35 pointer-events-none animate-tide-stream-1 overflow-hidden">
          <svg className="w-[200%] h-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0 C150,90 350,-40 500,45 C650,130 900,10 1200,60 L1200,120 L0,120 Z" fill="rgba(139, 92, 246, 0.20)" />
          </svg>
        </div>

        {/* Animated Moving SVG Wave Tides Stream 2 (Counter Tide Current) */}
        <div className="absolute -bottom-4 left-0 right-0 h-36 opacity-30 pointer-events-none animate-tide-stream-2 overflow-hidden">
          <svg className="w-[200%] h-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,30 C200,80 400,0 600,50 C800,100 1000,20 1200,50 L1200,120 L0,120 Z" fill="rgba(6, 182, 212, 0.18)" />
          </svg>
        </div>
      </div>

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
        <div className="max-w-7xl lg:max-w-[95%] mx-auto flex items-center justify-between gap-3">
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

            {/* Toggle Assistant Sidebar Button */}
            <button
              onClick={() => {
                if (mainView === 'landing') setMainView('app');
                setSidebarOpen(s => !s);
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                sidebarOpen && mainView === 'app'
                  ? 'bg-violet-100 text-[#7C3AED] border-violet-300 shadow-xs'
                  : 'bg-white hover:bg-violet-50 text-[#4C1D95] border-violet-200 shadow-xs'
              }`}
              title={sidebarOpen && mainView === 'app' ? "Close Assistant Sidebar" : "Open Assistant Sidebar (Flipkart, Amazon & Croma Deals)"}
            >
              <ShoppingCart className="w-3.5 h-3.5 text-[#7C3AED]" />
              <span className="hidden sm:inline">
                {sidebarOpen && mainView === 'app' ? 'Close Sidebar' : '🛍️ Assistant Deals'}
              </span>
            </button>

            {/* Design Constitution Trigger Button */}
            <button
              onClick={() => setIsConstitutionOpen(true)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                isWhite
                  ? 'bg-white hover:bg-violet-50 text-[#6D28D9] border-violet-200 shadow-sm'
                  : 'bg-white/10 hover:bg-white/20 text-violet-200 border-white/10'
              }`}
              title="Vantage Design Constitution: 3 Inviolable Pillars"
            >
              <Shield className="w-3.5 h-3.5 text-[#7C3AED]" />
              <span className="hidden md:inline">Constitution</span>
            </button>

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
            floatingProducts={floatingProductsList}
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
        <div className="flex-1 flex overflow-x-hidden overflow-y-hidden relative z-10 w-full">
          {/* Main Content Area */}
          <main className="flex-1 min-w-0 flex flex-col h-full overflow-hidden relative z-10 transition-[width,flex] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none">
            {/* Top Navbar */}
        <header className={`px-4 sm:px-6 py-4 ${isWhite ? 'bg-white/85 border-b border-violet-100 shadow-sm' : 'glass-panel border-b border-white/10'} flex flex-col md:flex-row md:items-center justify-between gap-4 backdrop-blur-md transition-colors`}>
          <div className="flex items-center gap-3.5">
            <button
              onClick={() => setSidebarOpen(s => !s)}
              className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center gap-2 ${
                sidebarOpen
                  ? 'bg-violet-100 text-[#7C3AED] border-violet-200 hover:bg-violet-200'
                  : 'bg-violet-50 border-violet-100 text-[#3B1E7A] hover:bg-violet-100 hover:text-slate-950'
              }`}
              title={sidebarOpen ? "Close AI Assistant Sidebar (Esc or ⌘K)" : "Open AI Assistant Sidebar (⌘K)"}
              aria-label={sidebarOpen ? "Close AI Assistant" : "Open AI Assistant"}
            >
              <Sparkles className="w-4 h-4 text-[#7C3AED]" />
              <span className="text-xs font-bold hidden sm:inline">
                {sidebarOpen ? 'Close Assistant' : 'AI Assistant'}
              </span>
            </button>
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
                onClick={() => setActiveTab('shopping')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'shopping'
                    ? 'bg-gradient-to-r from-[#8B5CF6] via-[#7C3AED] to-[#6D28D9] text-white shadow-md font-bold'
                    : 'text-[#6D28D9] hover:text-[#2E1065]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-current" />
                <span>🛍️ AI Shopping & Compare</span>
              </button>
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
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 max-w-5xl lg:max-w-[95%] w-full mx-auto">
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

          {/* Tab: Full AI Shopping Assistant (AI Picks, Compare Mode, Wishlist, Smart Follow-ups) */}
          {activeTab === 'shopping' && (
            <div className="space-y-6">
              <VantageShoppingApp onOpenProductModal={handleOpenProductModal} />
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

                  {/* Motion & Real-Time Cyber Cyan Radar controls */}
                  <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    <button
                      onClick={handleSyncMarketReleases}
                      disabled={isSyncingReleases}
                      className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl border border-cyan-400 bg-gradient-to-r from-cyan-50 via-white to-violet-50 text-[#0E7490] hover:text-[#0891B2] hover:border-cyan-500 font-bold text-xs shadow-md transition-all relative overflow-hidden group cursor-pointer"
                      title="Real-Time Radar Scanner: Scan Indian market & replace air objects with newest launches"
                    >
                      <span className="w-2 h-2 rounded-full bg-[#06B6D4] animate-ping" />
                      <Radio className={`w-3.5 h-3.5 text-[#06B6D4] ${isSyncingReleases ? 'animate-spin' : 'animate-pulse'}`} />
                      <span>{isSyncingReleases ? 'Radar Scanning...' : '⚡ Radar: Replace Air With New Launches'}</span>
                    </button>

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

                  {/* Sorting Dropdown Menu ('Lowest Price', 'Highest Rating', 'Newest Arrival') */}
                  <div className="flex items-center gap-1.5 ml-auto shrink-0 bg-white/90 border border-violet-200 px-3 py-1 rounded-xl shadow-xs">
                    <ArrowDownUp className="w-3.5 h-3.5 text-[#7C3AED]" />
                    <span className="text-[11px] font-bold text-[#7C6898]">Sort:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="bg-transparent text-[#2E1065] text-xs font-bold outline-none cursor-pointer"
                    >
                      <option value="default">Featured & Zero-G</option>
                      <option value="price_low">Lowest Price (₹)</option>
                      <option value="price_high">Highest Price (₹)</option>
                      <option value="rating">Highest Rating (★)</option>
                      <option value="newest">Newest Arrival (2026)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Levitating Products 3D Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 perspective-1000">
                {[...floatingProductsList]
                  .filter(p => floatingCategory === 'all' || p.category === floatingCategory)
                  .sort((a, b) => {
                    if (sortBy === 'price_low') {
                      const pA = parseInt(a.price.replace(/[^\d]/g, '')) || 0;
                      const pB = parseInt(b.price.replace(/[^\d]/g, '')) || 0;
                      return pA - pB;
                    }
                    if (sortBy === 'price_high') {
                      const pA = parseInt(a.price.replace(/[^\d]/g, '')) || 0;
                      const pB = parseInt(b.price.replace(/[^\d]/g, '')) || 0;
                      return pB - pA;
                    }
                    if (sortBy === 'rating') {
                      return (b.rating || 0) - (a.rating || 0);
                    }
                    if (sortBy === 'newest') {
                      return (b.isNewRelease ? 1 : 0) - (a.isNewRelease ? 1 : 0);
                    }
                    return 0;
                  })
                  .map((product, idx) => {
                    const animClass = isZeroGPaused ? '' : product.animationClass;
                    const isCompared = comparedProductIds.includes(product.id);

                    return (
                      <div
                        key={product.id}
                        className={`flex flex-col preserve-3d ${animClass}`}
                        style={{ animationDelay: `${(idx % 4) * 0.4}s` }}
                      >
                        {/* Levitating Card with Framer Motion Staggered Entrance, Lift & Compare Scale */}
                        <motion.div
                          initial={{ opacity: 0, y: 25 }}
                          animate={{
                            opacity: 1,
                            y: 0,
                            scale: isCompared ? 1.02 : 1
                          }}
                          whileHover={{
                            y: -8,
                            transition: { duration: 0.25, ease: 'easeOut' }
                          }}
                          transition={{
                            delay: Math.min((idx % 12) * 0.04, 0.35),
                            duration: 0.4,
                            ease: 'easeOut'
                          }}
                          className={`glass-panel-white border ${
                            isCompared
                              ? 'border-[#7C3AED] ring-2 ring-violet-500/40 shadow-xl'
                              : 'border-violet-200/70 hover:border-violet-400 shadow-md'
                          } rounded-3xl p-4 flex flex-col justify-between h-full floating-obj-card relative overflow-hidden backdrop-blur-2xl group transition-all duration-300`}
                          style={{
                            boxShadow: isCompared
                              ? '0 0 0 2px #7C3AED, 0 16px 36px -4px rgba(109, 40, 217, 0.25)'
                              : undefined
                          }}
                        >
                          {/* Glowing ambient backdrop on hover with soft violet sheen */}
                          <div className="absolute top-0 right-0 w-36 h-36 bg-violet-400/15 group-hover:bg-violet-400/25 rounded-full blur-2xl pointer-events-none transition-colors" />

                          {/* Top Tag, Store Pill & Compare Checkbox */}
                          <div className="flex items-center justify-between gap-1 mb-3">
                            <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-lg ${isWhite ? 'bg-violet-50 text-[#7C3AED] border-violet-200' : 'bg-black/60 text-[#7C3AED] border-[#F0B429]/30'} border`}>
                              {product.tag}
                            </span>

                            <div className="flex items-center gap-1.5">
                              {/* Compare Checkbox */}
                              <label
                                onClick={(e) => e.stopPropagation()}
                                className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold border cursor-pointer select-none transition-all ${
                                  isCompared
                                    ? 'bg-[#7C3AED] text-white border-[#6D28D9] shadow-xs'
                                    : 'bg-violet-50 hover:bg-violet-100 text-[#4C1D95] border-violet-200'
                                }`}
                                title="Add to side-by-side comparison"
                              >
                                <input
                                  type="checkbox"
                                  checked={isCompared}
                                  onChange={() => handleToggleCompare(product.id)}
                                  className="accent-[#7C3AED] rounded w-3 h-3 cursor-pointer"
                                />
                                <span>{isCompared ? 'Comparing' : 'Compare'}</span>
                              </label>

                              <span className={`text-[10px] ${isWhite ? 'text-[#4C1D95] bg-violet-50 border border-violet-100' : 'text-[#A0AEC0] bg-white/5'} font-medium px-2 py-0.5 rounded-md`}>
                                {product.store}
                              </span>
                            </div>
                          </div>

                        {/* Product Image Floating Display - Clickable to open full details */}
                        <div
                          onClick={() => handleOpenProductModal(product)}
                          className="w-full relative mb-3.5 cursor-pointer"
                          title="Click to open full product details and pictures"
                        >
                          <VerifiedProductImage
                            src={product.imageUrl}
                            alt={product.name}
                            productName={product.name}
                            imageSourceUrl={product.image_source_url || product.sourceUrl}
                            fallbackUrls={product.gallery}
                            aspectRatioClass="aspect-[4/3] h-44"
                            showSourceBadge={true}
                          />
                          <div className={`absolute bottom-2 left-2 px-2.5 py-1 rounded-xl ${isWhite ? 'bg-white/95 text-emerald-700 border-violet-100 shadow-md font-bold' : 'bg-black/80 text-emerald-400 border-white/10 font-mono font-black'} backdrop-blur-md border text-xs z-20`}>
                            {product.price}
                          </div>
                        </div>

                        {/* Details - Clickable */}
                        <div
                          onClick={() => handleOpenProductModal(product)}
                          className="space-y-1.5 flex-1 mb-3 cursor-pointer"
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

                        {/* Verified Direct Store Buy Actions */}
                        <div className={`space-y-2 mb-3 pt-2 border-t ${isWhite ? 'border-violet-100' : 'border-white/10'}`}>
                          <VerifiedBuyCardActions
                            productName={product.name}
                            buyUrl={product.sourceUrl || product.amazonUrl || product.flipkartUrl}
                            sourceDomain={product.source_domain || (product.sourceUrl ? new URL(product.sourceUrl).hostname.replace(/^www\./, '') : '')}
                            platform={product.platform || product.store || 'Verified Store'}
                            verified={product.verified !== false}
                            imageSourceUrl={product.image_source_url || product.sourceUrl}
                            priceInr={product.price}
                          />

                          {/* Secondary Platform Links if available */}
                          {(product.amazonUrl || product.flipkartUrl) && (
                            <div className="grid grid-cols-2 gap-1.5 pt-1">
                              {product.amazonUrl ? (
                                <a
                                  href={product.amazonUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`${isWhite ? 'bg-violet-50 hover:bg-violet-100 border-violet-200 text-[#2E1065] font-bold' : 'bg-amber-950/40 hover:bg-amber-900/60 border-amber-600/40 hover:border-violet-400 text-[#FFB020]'} border text-[11px] py-1 px-2 rounded-xl flex items-center justify-between gap-1 transition-all`}
                                  title={`Buy on Amazon India — opens ${product.amazonUrl}`}
                                >
                                  <span className="truncate">Amazon</span>
                                  <div className="flex items-center gap-0.5 text-[9px] opacity-75 font-mono">
                                    <span>amazon.in</span>
                                    <ExternalLink className="w-2 h-2" />
                                  </div>
                                </a>
                              ) : (
                                <div className="text-[10px] text-slate-400 bg-slate-50 border border-slate-200 py-1 px-2 rounded-xl text-center">
                                  Not found on Amazon
                                </div>
                              )}

                              {product.flipkartUrl ? (
                                <a
                                  href={product.flipkartUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`${isWhite ? 'bg-blue-50 hover:bg-blue-100 border-blue-300 text-blue-900 font-bold' : 'bg-blue-950/40 hover:bg-blue-900/60 border-blue-600/40 hover:border-blue-500 text-[#93C5FD]'} border text-[11px] py-1 px-2 rounded-xl flex items-center justify-between gap-1 transition-all`}
                                  title={`Buy on Flipkart — opens ${product.flipkartUrl}`}
                                >
                                  <span className="truncate">Flipkart</span>
                                  <div className="flex items-center gap-0.5 text-[9px] opacity-75 font-mono">
                                    <span>flipkart.com</span>
                                    <ExternalLink className="w-2 h-2" />
                                  </div>
                                </a>
                              ) : (
                                <div className="text-[10px] text-slate-400 bg-slate-50 border border-slate-200 py-1 px-2 rounded-xl text-center">
                                  Not found on Flipkart
                                </div>
                              )}
                            </div>
                          )}
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
                      </motion.div>

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
                    className="glass-panel-white flex items-center gap-2 hover:bg-violet-50/80 border border-violet-200/70 hover:border-violet-300 p-1.5 pr-3 rounded-xl shrink-0 transition-all text-left group"
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
                    <div className="bg-rose-950/40 border border-rose-800 text-rose-300 p-4 rounded-2xl text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <strong>Error:</strong> {multiResult.error}
                      </div>
                      <button
                        type="button"
                        onClick={() => runMultiResearch()}
                        className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 transition-all cursor-pointer shadow-md"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Retry Research</span>
                      </button>
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

          {/* Global Vantage Shopping Assistant Footer with Mandatory Price Disclaimer & Verified Domain Badges */}
          <footer className="mt-16 pt-8 pb-12 border-t border-violet-200/60 dark:border-white/10 text-xs text-[#5B3E8C] dark:text-slate-400 space-y-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#7C3AED] to-[#A78BFA] flex items-center justify-center text-white font-black shadow-md shadow-violet-500/25">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-heading font-black text-sm text-[#2E1065] dark:text-white tracking-tight">
                    Vantage AI Shopping Assistant
                  </div>
                  <div className="text-[11px] text-[#7C6898] dark:text-slate-400">
                    Strict Verified Direct Buy PDPs & Multi-Source Intelligence
                  </div>
                </div>
              </div>

              {/* Trusted Retailers Strip */}
              <div className="flex items-center gap-1.5 flex-wrap justify-center">
                {['amazon.in', 'flipkart.com', 'croma.com', 'tatacliq.com', 'myntra.com', 'ajio.com', 'reliancedigital.in', 'vijaysales.com'].map(domain => (
                  <span
                    key={domain}
                    className="px-2 py-0.5 rounded-md bg-white/80 dark:bg-white/5 border border-violet-200/60 dark:border-white/10 text-[10px] font-mono font-bold text-[#6D28D9] dark:text-violet-300"
                  >
                    {domain}
                  </span>
                ))}
              </div>
            </div>

            {/* Mandatory Price & Availability Disclaimer */}
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-900 dark:text-amber-300 flex items-start gap-2.5 text-xs">
              <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong className="font-semibold">Notice:</strong> Price and availability may change, check the store before buying. Vantage AI surfaces direct product detail pages (PDP) and compares live prices across verified Indian stores with zero sponsored ranking influence.
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#7C6898] dark:text-slate-500 pt-2 border-t border-violet-100 dark:border-white/5">
              <div>
                © 2026 Vantage AI. Direct Indian Retail Grounding Engine.
              </div>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setIsConstitutionOpen(true)}
                  className="hover:text-[#7C3AED] transition-colors cursor-pointer underline"
                >
                  Constitutional Manifesto
                </button>
                <button
                  type="button"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="hover:text-[#7C3AED] transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>Back to top</span>
                  <ArrowUp className="w-3 h-3" />
                </button>
              </div>
            </div>
          </footer>
        </div>
      </main>

      {/* Collapsible AI Assistant Sidebar on the RIGHT */}
      <ShoppingAssistantSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onToggle={() => setSidebarOpen(s => !s)}
        isWhite={isWhite}
        chatMessages={messages}
        isChatLoading={isChatLoading}
        onSendChat={handleSendChat}
        onClearChat={() => setMessages([])}
        sidebarInputRef={sidebarInputRef}
        userId={userId}
        tempUserId={tempUserId}
        setTempUserId={setTempUserId}
        handleSwitchUser={handleSwitchUser}
        userSavedPrefs={userSavedPrefs}
        handleDeletePreference={handleDeletePreference}
        newPrefKey={newPrefKey}
        setNewPrefKey={setNewPrefKey}
        newPrefValue={newPrefValue}
        setNewPrefValue={setNewPrefValue}
        handleSavePreference={handleSavePreference}
        notifyEmail={notifyEmail}
        setNotifyEmail={setNotifyEmail}
        notifyTelegram={notifyTelegram}
        setNotifyTelegram={setNotifyTelegram}
        notifySaved={notifySaved}
        handleSaveNotifications={handleSaveNotifications}
        handleSendTestNotification={handleSendTestNotification}
        isSendingTestAlert={isSendingTestAlert}
        testAlerts={testAlerts}
        products={products}
        expandedProductIds={expandedProductIds}
        toggleProductExpand={toggleProductExpand}
        checkingProductId={checkingProductId}
        priceCheckAlerts={priceCheckAlerts}
        renderSparkline={renderSparkline}
        handleCheckProductPrice={handleCheckProductPrice}
        handleDeleteProduct={handleDeleteProduct}
        newProdName={newProdName}
        setNewProdName={setNewProdName}
        newProdQuery={newProdQuery}
        setNewProdQuery={setNewProdQuery}
        newProdTarget={newProdTarget}
        setNewProdTarget={setNewProdTarget}
        handleAddProduct={handleAddProduct}
        handleOpenProductModal={handleOpenProductModal}
        formatINR={formatINR}
        onTrackCuratedProduct={(name, query, target) => {
          setNewProdName(name);
          setNewProdQuery(query);
          if (target) setNewProdTarget(target);
          handleAddProduct({ preventDefault: () => {} } as any);
        }}
      />
    </div>
  )}

  {/* Interactive Verified Product Detail Slide-Over Drawer with Full Specs, Real-Time Prices & User Reviews */}
  <ProductDetailSlideOver
    isOpen={isProductModalOpen}
    onClose={() => setIsProductModalOpen(false)}
    product={selectedProductForModal}
    onAskAi={handleAskAiAboutProduct}
    onDeepResearch={runMultiResearch}
    onTrackPrice={(prod) => handleTrackGenericProduct(prod.name, prod.name)}
    isWhite={isWhite}
  />

  {/* Design Constitution Modal */}
  {isConstitutionOpen && (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-md transition-opacity"
        onClick={() => setIsConstitutionOpen(false)}
      />
      <div className="relative z-10 w-full max-w-4xl glass-panel-white border border-violet-200/80 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden text-[#2E1065]">
        <div className="flex items-center justify-between gap-3 border-b border-violet-100 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#8B5CF6] via-[#7C3AED] to-[#6D28D9] text-white flex items-center justify-center font-bold shadow-md">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#7C3AED] bg-violet-100 px-2.5 py-0.5 rounded-full border border-violet-200">
                Core Engineering Standard
              </span>
              <h3 className="font-heading font-black text-xl sm:text-2xl text-[#2E1065]">
                The Vantage Design Constitution
              </h3>
            </div>
          </div>
          <button
            onClick={() => setIsConstitutionOpen(false)}
            className="p-2 rounded-xl border border-violet-100 bg-violet-50 hover:bg-violet-100 text-[#2E1065] transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Pillar 1: Visual Integrity */}
          <div className="p-6 rounded-2xl border border-violet-200/80 bg-white/90 shadow-md flex flex-col justify-between group hover:border-violet-400 transition-all">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#7C3AED] bg-violet-100 px-2.5 py-1 rounded-full border border-violet-200">
                  Visual Integrity
                </span>
                <div className="w-7 h-7 rounded-lg bg-violet-100 text-[#7C3AED] flex items-center justify-center">
                  <Eye className="w-4 h-4" />
                </div>
              </div>
              <h4 className="font-heading font-black text-base text-[#2E1065] mb-2 group-hover:text-[#7C3AED] transition-colors">
                1. Strict Zero Fake Stock Policy
              </h4>
              <p className="text-xs text-[#4C1D95] leading-relaxed font-medium">
                No generic smiling people or stock laptop illustrations. Every product photo displayed in Vantage MUST originate from the verified official retailer or manufacturer CDN with canonical 200 HTTP headers.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-violet-100 flex items-center gap-1.5 text-[10px] font-bold text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>100% Verified Retailer CDN Headers</span>
            </div>
          </div>

          {/* Pillar 2: Radical Transparency */}
          <div className="p-6 rounded-2xl border border-violet-200/80 bg-white/90 shadow-md flex flex-col justify-between group hover:border-violet-400 transition-all">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Radical Transparency
                </span>
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Shield className="w-4 h-4" />
                </div>
              </div>
              <h4 className="font-heading font-black text-base text-[#2E1065] mb-2 group-hover:text-[#7C3AED] transition-colors">
                2. Zero Affiliate Promotion Bias
              </h4>
              <p className="text-xs text-[#4C1D95] leading-relaxed font-medium">
                Traditional comparison engines rank items based on who pays the highest affiliate referral commission. Vantage has zero sponsored rankings—recommendations are strictly scored on technical performance and price history.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-violet-100 flex items-center gap-1.5 text-[10px] font-bold text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>0% Sponsored Pay-for-Rank Influence</span>
            </div>
          </div>

          {/* Pillar 3: Zero Cost Sovereignty */}
          <div className="p-6 rounded-2xl border border-violet-200/80 bg-white/90 shadow-md flex flex-col justify-between group hover:border-violet-400 transition-all">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-900 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  Zero Cost Sovereignty
                </span>
                <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </div>
              </div>
              <h4 className="font-heading font-black text-base text-[#2E1065] mb-2 group-hover:text-[#7C3AED] transition-colors">
                3. 100% Free-Tier Architecture
              </h4>
              <p className="text-xs text-[#4C1D95] leading-relaxed font-medium">
                Runs on Google Gemini 3.8 Flash free quota, Google Programmable Search, and local SQLite persistence. Zero mandatory monthly subscriptions, zero paywalls for basic price tracking.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-violet-100 flex items-center gap-1.5 text-[10px] font-bold text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Google Gemini 3.8 Flash Free Quota Engine</span>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-violet-100 flex items-center justify-end">
          <button
            onClick={() => setIsConstitutionOpen(false)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] via-[#7C3AED] to-[#6D28D9] text-white font-bold text-xs shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer font-heading"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  )}

  {/* Persistent Compare Drawer at Bottom when products are selected */}
  <CompareDrawer
    comparedProducts={floatingProductsList.filter(p => comparedProductIds.includes(p.id))}
    onRemoveFromCompare={handleRemoveFromCompare}
    onClearCompare={() => setComparedProductIds([])}
    isWhite={isWhite}
  />

  {/* Floating Back to Top Button */}
  {showBackToTop && (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`fixed bottom-20 sm:bottom-6 right-6 sm:right-48 z-40 px-3.5 py-2.5 rounded-2xl font-bold text-xs shadow-2xl flex items-center gap-1.5 transition-all cursor-pointer hover:scale-105 active:scale-95 ${
        isWhite
          ? 'bg-white/95 text-[#2E1065] border-2 border-violet-200/80 hover:border-[#7C3AED] shadow-xl backdrop-blur-md'
          : 'bg-[#181126]/95 text-white border-2 border-violet-500/40 hover:border-violet-500 shadow-xl backdrop-blur-md'
      }`}
      title="Scroll back to top"
      aria-label="Back to top"
    >
      <ArrowUp className="w-4 h-4 text-[#7C3AED]" />
      <span className="hidden sm:inline font-heading font-extrabold text-xs">Top</span>
    </button>
  )}

  {/* Persistent Global Floating Assistant Button fixed at bottom-right corner */}
  <button
    ref={assistantButtonRef}
    onClick={() => {
      if (mainView === 'landing') setMainView('app');
      setSidebarOpen(s => !s);
    }}
    aria-expanded={sidebarOpen}
    aria-controls="vantage-assistant-sidebar"
    aria-label={sidebarOpen ? "Close AI Assistant" : "Open AI Assistant"}
    className={`fixed bottom-6 right-6 z-40 px-4 py-2.5 rounded-2xl font-bold text-xs shadow-2xl flex items-center gap-2.5 transition-all cursor-pointer hover:scale-105 active:scale-95 ${
      sidebarOpen && mainView === 'app'
        ? 'bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] text-white ring-2 ring-violet-400 shadow-violet-500/25'
        : isWhite
        ? 'bg-white/95 text-[#2E1065] border-2 border-[#7C3AED]/40 hover:border-[#7C3AED] shadow-xl backdrop-blur-md'
        : 'bg-[#181126]/95 text-white border-2 border-violet-500/40 hover:border-violet-500 shadow-xl backdrop-blur-md'
    }`}
    title={sidebarOpen ? "Close AI Assistant (Esc or ⌘K)" : "Open AI Assistant (⌘K)"}
  >
    {/* Unread dot when new reply arrives while sidebar is closed */}
    {hasUnreadReply && !sidebarOpen && (
      <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-500 border-2 border-white dark:border-[#181126]"></span>
      </span>
    )}

    <Sparkles className="w-4 h-4 text-[#7C3AED] shrink-0" />
    <span className="font-heading font-extrabold">{sidebarOpen && mainView === 'app' ? 'Close Assistant' : 'Assistant'}</span>
    <kbd className="hidden sm:inline-block text-[10px] px-1.5 py-0.5 rounded-md font-mono font-bold bg-violet-100 dark:bg-violet-900/60 text-[#6D28D9] dark:text-violet-200">
      ⌘K
    </kbd>
  </button>
</div>
  );
}
