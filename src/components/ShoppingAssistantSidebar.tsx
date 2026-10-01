import React, { useState, useMemo } from 'react';
import {
  X,
  ShoppingCart,
  ExternalLink,
  Sparkles,
  TrendingDown,
  Brain,
  Bell,
  Search,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Send,
  Trash2,
  Plus,
  Tag,
  ChevronDown,
  ChevronRight,
  User,
  ShieldCheck,
  Store,
  Layers,
  Check
} from 'lucide-react';
import { FloatingProduct, getProductFallbackImg } from '../App';
import { handleImageError } from '../utils/image-validator';

// Comprehensive Popular Products Catalog across Flipkart, Amazon, Croma, Tata CLiQ
export interface CuratedStoreProduct {
  id: string;
  name: string;
  category: 'phones' | 'laptops' | 'audio' | 'wearables' | 'appliances' | 'gaming';
  price: string;
  mrp: string;
  savings: string;
  store: 'Flipkart' | 'Amazon' | 'Croma' | 'Tata CLiQ';
  storeBadge: string;
  sourceUrl: string;
  amazonUrl?: string;
  flipkartUrl?: string;
  cromaUrl?: string;
  imageUrl: string;
  rating: number;
  reviewsCount: string;
  tag: string;
  highlights: string[];
}

export const POPULAR_STORE_PRODUCTS: CuratedStoreProduct[] = [
  // --- FLIPKART POPULAR DEALS ---
  {
    id: 'fp-pixel-9-pro-xl',
    name: 'Google Pixel 9 Pro XL (Obsidian 256GB, Tensor G4)',
    category: 'phones',
    price: '₹1,24,999',
    mrp: '₹1,29,999',
    savings: 'Save ₹5,000 + Bank Offer',
    store: 'Flipkart',
    storeBadge: 'Flipkart Assured · Google Official',
    sourceUrl: 'https://www.flipkart.com/google-pixel-9-pro-xl-obsidian-256-gb/p/itm5a840c83a71b1',
    flipkartUrl: 'https://www.flipkart.com/google-pixel-9-pro-xl-obsidian-256-gb/p/itm5a840c83a71b1',
    amazonUrl: 'https://www.amazon.in/dp/B0DGJ9M8V2',
    imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    reviewsCount: '6,400+',
    tag: 'Tensor G4 AI',
    highlights: ['Gemini Nano multimodal AI', '50MP Triple Pro Camera', '3000 nits Super Actua OLED']
  },
  {
    id: 'fp-moto-edge-50-ultra',
    name: 'Motorola Edge 50 Ultra 5G (Peach Fuzz 512GB, Snapdragon 8s Gen 3)',
    category: 'phones',
    price: '₹54,999',
    mrp: '₹64,999',
    savings: 'Save ₹10,000 Direct Deal',
    store: 'Flipkart',
    storeBadge: 'Flipkart Assured · Motorola Direct',
    sourceUrl: 'https://www.flipkart.com/motorola-edge-50-ultra-peach-fuzz-512-gb/p/itmdb2ebdc8104fb',
    flipkartUrl: 'https://www.flipkart.com/motorola-edge-50-ultra-peach-fuzz-512-gb/p/itmdb2ebdc8104fb',
    amazonUrl: 'https://www.amazon.in/s?k=Motorola+Edge+50+Ultra',
    imageUrl: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=600&q=80',
    rating: 4.7,
    reviewsCount: '3,200+',
    tag: 'Pantone Wooden Back',
    highlights: ['Real wood & vegan leather finish', '125W TurboPower charging', '50MP Periscope 3x optical']
  },
  {
    id: 'fp-nothing-phone-2a-plus',
    name: 'Nothing Phone (2a) Plus (Grey 256GB, Dimensity 7350 Pro)',
    category: 'phones',
    price: '₹27,999',
    mrp: '₹31,999',
    savings: 'Save ₹4,000 Instant',
    store: 'Flipkart',
    storeBadge: 'Flipkart Exclusive · Nothing Brand',
    sourceUrl: 'https://www.flipkart.com/nothing-phone-2a-plus-grey-256-gb/p/itmd5b94f0685956',
    flipkartUrl: 'https://www.flipkart.com/nothing-phone-2a-plus-grey-256-gb/p/itmd5b94f0685956',
    amazonUrl: 'https://www.amazon.in/s?k=Nothing+Phone+2a+Plus',
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
    rating: 4.6,
    reviewsCount: '12,800+',
    tag: 'Glyph Interface',
    highlights: ['Iconic Glyph LED notification system', '50MP dual camera', '5000 mAh all-day battery']
  },
  {
    id: 'fp-acer-nitro-v16',
    name: 'Acer Nitro V 16 Gaming Laptop (Ryzen 7 8845HS, RTX 4060 8GB, 16GB/1TB)',
    category: 'laptops',
    price: '₹94,990',
    mrp: '₹1,19,999',
    savings: 'Save ₹25,009 Big Saving',
    store: 'Flipkart',
    storeBadge: 'Flipkart Assured · Top Rated Gaming',
    sourceUrl: 'https://www.flipkart.com/acer-nitro-v-amd-ryzen-7-octa-core-8845hs-16-gb-1-tb-ssd-windows-11-home-8-gb-graphics-nvidia-geforce-rtx-4060-anv16-41-gaming-laptop/p/itmffad400e93a65',
    flipkartUrl: 'https://www.flipkart.com/acer-nitro-v-amd-ryzen-7-octa-core-8845hs-16-gb-1-tb-ssd-windows-11-home-8-gb-graphics-nvidia-geforce-rtx-4060-anv16-41-gaming-laptop/p/itmffad400e93a65',
    amazonUrl: 'https://www.amazon.in/s?k=Acer+Nitro+V+16+RTX+4060',
    imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    reviewsCount: '1,950+',
    tag: 'RTX 4060 8GB',
    highlights: ['AMD Ryzen 7 8845HS with AI NPU', 'NVIDIA GeForce RTX 4060', '165Hz 16-inch WUXGA display']
  },
  {
    id: 'fp-nothing-ear-a',
    name: 'Nothing Ear (a) Wireless Earbuds with 45dB Smart ANC (Yellow)',
    category: 'audio',
    price: '₹7,999',
    mrp: '₹9,999',
    savings: 'Save ₹2,000 + LDAC Support',
    store: 'Flipkart',
    storeBadge: 'Flipkart Assured · Nothing Official',
    sourceUrl: 'https://www.flipkart.com/nothing-ear-a-active-noise-cancellation-bluetooth-headset/p/itm5a3857db7f561',
    flipkartUrl: 'https://www.flipkart.com/nothing-ear-a-active-noise-cancellation-bluetooth-headset/p/itm5a3857db7f561',
    amazonUrl: 'https://www.amazon.in/s?k=Nothing+Ear+a',
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
    rating: 4.6,
    reviewsCount: '8,400+',
    tag: 'Hi-Res Audio LDAC',
    highlights: ['45dB Active Noise Cancellation', 'Hi-Res Wireless LDAC certified', 'Up to 42.5 hrs playtime']
  },
  {
    id: 'fp-asus-vivobook-16',
    name: 'ASUS Vivobook 16X (Intel Core i7 13th Gen, 16GB/512GB, RTX 3050)',
    category: 'laptops',
    price: '₹72,990',
    mrp: '₹98,990',
    savings: 'Save ₹26,000 + 0% EMI',
    store: 'Flipkart',
    storeBadge: 'Flipkart Assured · ASUS India',
    sourceUrl: 'https://www.flipkart.com/asus-vivobook-16x-oled-intel-core-i7-13th-gen-13700h-16-gb-512-gb-ssd-windows-11-home-k3605vu-mb741ws-laptop/p/itmcdbd158913926',
    flipkartUrl: 'https://www.flipkart.com/asus-vivobook-16x-oled-intel-core-i7-13th-gen-13700h-16-gb-512-gb-ssd-windows-11-home-k3605vu-mb741ws-laptop/p/itmcdbd158913926',
    amazonUrl: 'https://www.amazon.in/s?k=ASUS+Vivobook+16X+i7',
    imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80',
    rating: 4.7,
    reviewsCount: '3,100+',
    tag: 'Core i7 Creator Laptop',
    highlights: ['Intel Core i7 13th Gen 13700H', '16-inch 120Hz display', 'Military-grade MIL-STD 810H durability']
  },

  // --- AMAZON INDIA POPULAR DEALS ---
  {
    id: 'amz-iphone-16-pro',
    name: 'Apple iPhone 16 Pro (Desert Titanium 128GB, A18 Pro)',
    category: 'phones',
    price: '₹1,19,900',
    mrp: '₹1,29,900',
    savings: 'Save ₹10,000 via Amazon Prime',
    store: 'Amazon',
    storeBadge: 'Amazon Prime · Apple Official Store',
    sourceUrl: 'https://www.amazon.in/dp/B0DGJ9M8V2',
    amazonUrl: 'https://www.amazon.in/dp/B0DGJ9M8V2',
    flipkartUrl: 'https://www.flipkart.com/apple-iphone-16-pro-desert-titanium-128-gb/p/itmd0471b674b884',
    imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    reviewsCount: '8,200+',
    tag: 'A18 Pro + Camera Control',
    highlights: ['Camera Control button for instant capture', '4K 120 fps Dolby Vision video', 'Grade 5 Titanium design']
  },
  {
    id: 'amz-macbook-pro-m3',
    name: 'Apple MacBook Pro 14" M3 Pro (18GB/512GB Space Black)',
    category: 'laptops',
    price: '₹1,99,900',
    mrp: '₹2,19,900',
    savings: 'Save ₹20,000 Bank Offer',
    store: 'Amazon',
    storeBadge: 'Amazon Prime · Apple Authorised',
    sourceUrl: 'https://www.amazon.in/dp/B0CM5N3T1L',
    amazonUrl: 'https://www.amazon.in/dp/B0CM5N3T1L',
    flipkartUrl: 'https://www.flipkart.com/apple-macbook-pro-m3-pro-18-gb-512-gb-ssd-macos-sonoma-mrx33hn-a/p/itm7e3f89a9415c1',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    reviewsCount: '4,100+',
    tag: 'M3 Pro 11-Core',
    highlights: ['Hardware ray tracing', 'Liquid Retina XDR 120Hz ProMotion', 'Up to 18 hrs battery endurance']
  },
  {
    id: 'amz-sony-wh-1000xm5',
    name: 'Sony WH-1000XM5 Wireless Industry-Leading ANC Headphones (Black)',
    category: 'audio',
    price: '₹26,990',
    mrp: '₹34,990',
    savings: 'Save ₹8,000 Lowest in 90 Days',
    store: 'Amazon',
    storeBadge: 'Amazon Prime · Sony Brand Store',
    sourceUrl: 'https://www.amazon.in/dp/B09XS7JWHH',
    amazonUrl: 'https://www.amazon.in/dp/B09XS7JWHH',
    flipkartUrl: 'https://www.flipkart.com/sony-wh-1000xm5-bluetooth-headset/p/itmd8a6cf2b6bb3b',
    imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    reviewsCount: '15,600+',
    tag: 'Auto NC Optimizer',
    highlights: ['Two processors & 8 microphones', 'Crystal clear hands-free calling', '30 hours continuous battery']
  },
  {
    id: 'amz-apple-watch-ultra-2',
    name: 'Apple Watch Ultra 2 GPS + Cellular (49mm Rugged Titanium)',
    category: 'wearables',
    price: '₹89,900',
    mrp: '₹89,900',
    savings: 'Lowest Price Guarantee + Free Prime Delivery',
    store: 'Amazon',
    storeBadge: 'Amazon Prime · Apple Official',
    sourceUrl: 'https://www.amazon.in/dp/B0CHX6X33L',
    amazonUrl: 'https://www.amazon.in/dp/B0CHX6X33L',
    flipkartUrl: 'https://www.flipkart.com/apple-watch-ultra-2-gps-cellular-49mm-titanium-case/p/itmd5b128ff3a34f',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    reviewsCount: '3,800+',
    tag: '3000 Nits Outdoor',
    highlights: ['Double Tap gesture control', 'Precision Dual-Frequency GPS', '100m water resistant']
  },
  {
    id: 'amz-oneplus-12',
    name: 'OnePlus 12 5G (Flowy Emerald 16GB/512GB, Snapdragon 8 Gen 3)',
    category: 'phones',
    price: '₹64,999',
    mrp: '₹69,999',
    savings: 'Save ₹5,000 + 100W Charger in Box',
    store: 'Amazon',
    storeBadge: 'Amazon Choice · OnePlus Official',
    sourceUrl: 'https://www.amazon.in/dp/B0CQPNR38F',
    amazonUrl: 'https://www.amazon.in/dp/B0CQPNR38F',
    flipkartUrl: 'https://www.flipkart.com/oneplus-12-flowy-emerald-512-gb/p/itmca4fe61bcf742',
    imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    reviewsCount: '7,300+',
    tag: 'Hasselblad 4th Gen',
    highlights: ['Snapdragon 8 Gen 3 with Dual Cryo-velocity VC', '100W SUPERVOOC + 50W AIRVOOC', '2K 120Hz ProXDR display']
  },
  {
    id: 'amz-bose-qc-ultra',
    name: 'Bose QuietComfort Ultra Wireless ANC Headphones with Spatial Audio',
    category: 'audio',
    price: '₹35,900',
    mrp: '₹39,900',
    savings: 'Save ₹4,000 + Immersive Audio',
    store: 'Amazon',
    storeBadge: 'Amazon Prime · Bose Official',
    sourceUrl: 'https://www.amazon.in/dp/B0CCZ26B5V',
    amazonUrl: 'https://www.amazon.in/dp/B0CCZ26B5V',
    flipkartUrl: 'https://www.flipkart.com/bose-quietcomfort-ultra-bluetooth-headset/p/itmd5f73d8f8a84d',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    reviewsCount: '2,900+',
    tag: 'CustomTune Calibration',
    highlights: ['Bose Immersive Audio with head tracking', 'CustomTune sound personalized to your ear canal', 'Ultra-soft plush protein leather cushions']
  },
  {
    id: 'amz-kindle-paperwhite',
    name: 'Amazon Kindle Paperwhite (16 GB, 6.8" 300 ppi, Adjustable Warm Light)',
    category: 'appliances',
    price: '₹14,999',
    mrp: '₹14,999',
    savings: 'Lowest Price Guarantee + Free 3 Months Kindle Unlimited',
    store: 'Amazon',
    storeBadge: 'Amazon Device Official Store',
    sourceUrl: 'https://www.amazon.in/dp/B08N3TCP2F',
    amazonUrl: 'https://www.amazon.in/dp/B08N3TCP2F',
    flipkartUrl: 'https://www.flipkart.com/search?q=Amazon+Kindle+Paperwhite+16GB',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    reviewsCount: '21,000+',
    tag: 'Paperwhite 300 ppi',
    highlights: ['Flush-front design and 300 ppi glare-free display', 'Adjustable warm light for night reading', 'Up to 10 weeks battery life']
  },
  {
    id: 'amz-logitech-mx-master-3s',
    name: 'Logitech MX Master 3S Wireless Performance Mouse (Quiet Clicks, 8K DPI)',
    category: 'laptops',
    price: '₹8,995',
    mrp: '₹10,995',
    savings: 'Save ₹2,000 + Quiet Clicks',
    store: 'Amazon',
    storeBadge: 'Amazon Prime · Logitech Direct',
    sourceUrl: 'https://www.amazon.in/dp/B09HM94VDS',
    amazonUrl: 'https://www.amazon.in/dp/B09HM94VDS',
    flipkartUrl: 'https://www.flipkart.com/logitech-mx-master-3s-wireless-optical-mouse/p/itm5fa59b15aa687',
    imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    reviewsCount: '11,400+',
    tag: '8,000 DPI MagSpeed',
    highlights: ['MagSpeed electromagnetic scroll wheel (1,000 lines/sec)', 'Quiet Click switches with 90% noise reduction', 'Tracks on any surface including glass']
  },
  {
    id: 'amz-ps5-slim',
    name: 'Sony PlayStation 5 Slim Console (Disc Edition with 1TB SSD)',
    category: 'gaming',
    price: '₹54,990',
    mrp: '₹54,990',
    savings: 'Official Sony India Warranty + Free Prime Delivery',
    store: 'Amazon',
    storeBadge: 'Amazon Prime · Sony PlayStation Official',
    sourceUrl: 'https://www.amazon.in/dp/B0CY5HVDS2',
    amazonUrl: 'https://www.amazon.in/dp/B0CY5HVDS2',
    flipkartUrl: 'https://www.flipkart.com/sony-playstation-5-slim-cfi-2008a01x-1024-gb/p/itm677ffce41416e',
    imageUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    reviewsCount: '9,800+',
    tag: 'Ultra-HD Blu-ray 4K',
    highlights: ['Slimmer form factor with 1TB high-speed SSD', 'DualSense wireless controller with haptic feedback', '4K 120Hz ray tracing support']
  },

  // --- CROMA OFFICIAL DEALS ---
  {
    id: 'cr-sony-bravia-65',
    name: 'Sony Bravia XR 65" 4K Ultra HD OLED Google TV (XR-65A80L)',
    category: 'appliances',
    price: '₹2,18,490',
    mrp: '₹2,69,900',
    savings: 'Save ₹51,410 Croma Clearance',
    store: 'Croma',
    storeBadge: 'Croma Verified · Official Retailer',
    sourceUrl: 'https://www.croma.com/sony-bravia-xr-164-cm-65-inch-4k-ultra-hd-oled-google-tv-xr-65a80l/p/272714',
    cromaUrl: 'https://www.croma.com/sony-bravia-xr-164-cm-65-inch-4k-ultra-hd-oled-google-tv-xr-65a80l/p/272714',
    amazonUrl: 'https://www.amazon.in/s?k=Sony+Bravia+65+OLED+A80L',
    flipkartUrl: 'https://www.flipkart.com/search?q=Sony+Bravia+65+OLED+A80L',
    imageUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    reviewsCount: '1,450+',
    tag: 'Cognitive Processor XR',
    highlights: ['Pure OLED blacks with XR OLED Contrast Pro', 'Acoustic Surface Audio+ screen vibrates as speaker', 'Perfect for PlayStation 5 with Auto HDR Tone Mapping']
  },
  {
    id: 'cr-lg-c3-oled-55',
    name: 'LG C3 55" 4K OLED evo Smart TV (OLED55C3PSA, 120Hz Dolby Vision)',
    category: 'appliances',
    price: '₹1,24,990',
    mrp: '₹1,69,990',
    savings: 'Save ₹45,000 Croma Exclusive',
    store: 'Croma',
    storeBadge: 'Croma Verified · Free Installation',
    sourceUrl: 'https://www.croma.com/lg-c3-139-cm-55-inch-4k-ultra-hd-oled-webos-tv-oled55c3psa/p/271836',
    cromaUrl: 'https://www.croma.com/lg-c3-139-cm-55-inch-4k-ultra-hd-oled-webos-tv-oled55c3psa/p/271836',
    amazonUrl: 'https://www.amazon.in/s?k=LG+C3+55+OLED',
    flipkartUrl: 'https://www.flipkart.com/search?q=LG+C3+55+OLED',
    imageUrl: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    reviewsCount: '2,800+',
    tag: 'OLED evo Brightness Booster',
    highlights: ['α9 AI Processor 4K Gen6', '4x HDMI 2.1 ports with 4K 120Hz & G-Sync', 'Infinite contrast with 0.1ms response time']
  },
  {
    id: 'cr-philips-air-fryer',
    name: 'Philips HD9252/90 4.1L Digital Air Fryer with Rapid Air Technology',
    category: 'appliances',
    price: '₹7,999',
    mrp: '₹12,995',
    savings: 'Save ₹4,996 Croma Super Deal',
    store: 'Croma',
    storeBadge: 'Croma Best Seller · 90% Less Fat',
    sourceUrl: 'https://www.croma.com/philips-essential-4-1-litres-air-fryer-hd9252-90-black-/p/234720',
    cromaUrl: 'https://www.croma.com/philips-essential-4-1-litres-air-fryer-hd9252-90-black-/p/234720',
    amazonUrl: 'https://www.amazon.in/s?k=Philips+HD9252+Air+Fryer',
    flipkartUrl: 'https://www.flipkart.com/search?q=Philips+HD9252+Air+Fryer',
    imageUrl: 'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=600&q=80',
    rating: 4.7,
    reviewsCount: '34,000+',
    tag: 'Rapid Air Cooking',
    highlights: ['Patented starfish design cooks 90% less oil', 'Touch screen with 7 presets for samosas, fries, and paneer', 'QuickClean basket dishwasher safe']
  },
  {
    id: 'cr-dyson-v15',
    name: 'Dyson V15 Detect Extra Cordless Vacuum Cleaner (Laser Slim Fluffy)',
    category: 'appliances',
    price: '₹59,900',
    mrp: '₹74,900',
    savings: 'Save ₹15,000 In-Store Pickup',
    store: 'Croma',
    storeBadge: 'Croma Official Partner · Dyson Tech',
    sourceUrl: 'https://www.croma.com/dyson-v15-detect-cordless-vacuum-cleaner-yellow-iron-/p/243689',
    cromaUrl: 'https://www.croma.com/dyson-v15-detect-cordless-vacuum-cleaner-yellow-iron-/p/243689',
    amazonUrl: 'https://www.amazon.in/dp/B0B2W2B7Z3',
    flipkartUrl: 'https://www.flipkart.com/search?q=Dyson+V15+Detect',
    imageUrl: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    reviewsCount: '3,200+',
    tag: 'Laser Dust Detection',
    highlights: ['Laser illuminates invisible microscopic dust', 'Piezo sensor sizes and counts particles in real-time', 'Up to 60 minutes run time with click-in battery']
  },

  // --- TATA CLIQ LUXURY & LIFESTYLE DEALS ---
  {
    id: 'tc-marshall-stanmore',
    name: 'Marshall Stanmore III Bluetooth Home Speaker (Black & Brass)',
    category: 'audio',
    price: '₹37,999',
    mrp: '₹41,999',
    savings: 'Save ₹4,000 Tata CLiQ Luxury',
    store: 'Tata CLiQ',
    storeBadge: 'Tata CLiQ Luxury · 100% Genuine Guarantee',
    sourceUrl: 'https://www.tatacliq.com/marshall-stanmore-iii-wireless-bluetooth-speaker-black/p-mp000000018596328',
    amazonUrl: 'https://www.amazon.in/s?k=Marshall+Stanmore+III',
    flipkartUrl: 'https://www.flipkart.com/search?q=Marshall+Stanmore+III',
    imageUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    reviewsCount: '2,600+',
    tag: 'Iconic British Sound',
    highlights: ['Outward-angled tweeters for wide soundstage', 'Dynamic Loudness adjusts tonal balance at every volume', 'Iconic textured vinyl casing with brass script logo']
  },
  {
    id: 'tc-fujifilm-x100vi',
    name: 'Fujifilm X100VI Digital Camera (40.2MP X-Trans CMOS 5 HR, Silver)',
    category: 'appliances',
    price: '₹1,79,999',
    mrp: '₹1,79,999',
    savings: 'Rare In-Stock Allocation · Free Tata Neu Points',
    store: 'Tata CLiQ',
    storeBadge: 'Tata CLiQ Luxury · Fujifilm Official',
    sourceUrl: 'https://www.tatacliq.com/fujifilm-x100vi-digital-camera-silver/p-mp000000021485901',
    amazonUrl: 'https://www.amazon.in/s?k=Fujifilm+X100VI',
    flipkartUrl: 'https://www.flipkart.com/search?q=Fujifilm+X100VI',
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    reviewsCount: '1,100+',
    tag: '6.0-Stop In-Body Stabilization',
    highlights: ['40.2MP high-resolution sensor with AI autofocus', '20 Film Simulation modes including REALA ACE', 'Hybrid optical and electronic viewfinder']
  },
  {
    id: 'tc-sennheiser-momentum-4',
    name: 'Sennheiser Momentum 4 Wireless ANC Headphones (60h Battery Life)',
    category: 'audio',
    price: '₹24,990',
    mrp: '₹34,990',
    savings: 'Save ₹10,000 Audiophile Pick',
    store: 'Tata CLiQ',
    storeBadge: 'Tata CLiQ Luxury · Audiophile Grade',
    sourceUrl: 'https://www.tatacliq.com/sennheiser-momentum-4-wireless-over-ear-headphones-black/p-mp000000015482390',
    amazonUrl: 'https://www.amazon.in/s?k=Sennheiser+Momentum+4',
    flipkartUrl: 'https://www.flipkart.com/search?q=Sennheiser+Momentum+4',
    imageUrl: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    reviewsCount: '4,500+',
    tag: '60-Hour Monster Battery',
    highlights: ['Class-leading 60-hour playback per charge', '42mm audiophile-inspired transducer system', 'Adaptive Noise Cancellation with Transparency mode']
  }
];

interface ShoppingAssistantSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
  isWhite: boolean;
  userId: string;
  tempUserId: string;
  setTempUserId: (val: string) => void;
  handleSwitchUser: (e: React.FormEvent) => void;
  userSavedPrefs: [string, string][];
  handleDeletePreference: (k: string) => void;
  newPrefKey: string;
  setNewPrefKey: (k: string) => void;
  newPrefValue: string;
  setNewPrefValue: (v: string) => void;
  handleSavePreference: (e: React.FormEvent) => void;
  notifyEmail: string;
  setNotifyEmail: (e: string) => void;
  notifyTelegram: string;
  setNotifyTelegram: (t: string) => void;
  notifySaved: boolean;
  handleSaveNotifications: (e: React.FormEvent) => void;
  handleSendTestNotification: () => void;
  isSendingTestAlert: boolean;
  testAlerts: Array<{ channel: string; success: boolean; detail: string }>;
  products: any[];
  expandedProductIds: any[];
  toggleProductExpand: (id: any) => void;
  checkingProductId: any;
  priceCheckAlerts: Record<string, { alert: boolean; message: string }>;
  renderSparkline: (history: any[]) => React.ReactNode;
  handleCheckProductPrice: (prod: any) => void;
  handleDeleteProduct: (id: any) => void;
  newProdName: string;
  setNewProdName: (v: string) => void;
  newProdQuery: string;
  setNewProdQuery: (v: string) => void;
  newProdTarget: string;
  setNewProdTarget: (v: string) => void;
  handleAddProduct: (e: React.FormEvent) => void;
  handleOpenProductModal: (prod: any) => void;
  formatINR: (num: number) => string;
  onTrackCuratedProduct?: (name: string, query: string, targetPrice?: string) => void;
}

export const ShoppingAssistantSidebar: React.FC<ShoppingAssistantSidebarProps> = ({
  isOpen,
  onClose,
  isWhite,
  userId,
  tempUserId,
  setTempUserId,
  handleSwitchUser,
  userSavedPrefs,
  handleDeletePreference,
  newPrefKey,
  setNewPrefKey,
  newPrefValue,
  setNewPrefValue,
  handleSavePreference,
  notifyEmail,
  setNotifyEmail,
  notifyTelegram,
  setNotifyTelegram,
  notifySaved,
  handleSaveNotifications,
  handleSendTestNotification,
  isSendingTestAlert,
  testAlerts,
  products,
  expandedProductIds,
  toggleProductExpand,
  checkingProductId,
  priceCheckAlerts,
  renderSparkline,
  handleCheckProductPrice,
  handleDeleteProduct,
  newProdName,
  setNewProdName,
  newProdQuery,
  setNewProdQuery,
  newProdTarget,
  setNewProdTarget,
  handleAddProduct,
  handleOpenProductModal,
  formatINR,
  onTrackCuratedProduct
}) => {
  // Sidebar Internal Tab Selection
  const [activeSidebarTab, setActiveSidebarTab] = useState<'catalog' | 'tracked' | 'profile'>('catalog');

  // Catalog Filters
  const [catalogStoreFilter, setCatalogStoreFilter] = useState<'all' | 'Flipkart' | 'Amazon' | 'Croma' | 'Tata CLiQ'>('all');
  const [catalogSearchQuery, setCatalogSearchQuery] = useState('');
  const [copiedLinkProductId, setCopiedLinkProductId] = useState<string | null>(null);

  // Filter curated store products
  const filteredProducts = useMemo(() => {
    return POPULAR_STORE_PRODUCTS.filter(p => {
      const matchStore = catalogStoreFilter === 'all' || p.store === catalogStoreFilter;
      const matchQuery =
        !catalogSearchQuery.trim() ||
        p.name.toLowerCase().includes(catalogSearchQuery.toLowerCase()) ||
        p.tag.toLowerCase().includes(catalogSearchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(catalogSearchQuery.toLowerCase());
      return matchStore && matchQuery;
    });
  }, [catalogStoreFilter, catalogSearchQuery]);

  const handleCopyDirectLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLinkProductId(id);
    setTimeout(() => setCopiedLinkProductId(null), 2000);
  };

  return (
    <>
      {/* Mobile Backdrop Overlay - closes sidebar on backdrop click */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Shopping Assistant Sidebar Container */}
      <aside
        className={`fixed lg:relative top-0 bottom-0 left-0 z-50 lg:z-20 h-full w-[90vw] sm:w-[420px] lg:w-[390px] xl:w-[420px] flex flex-col transition-all duration-300 ease-in-out ${
          isOpen
            ? 'translate-x-0 opacity-100 shadow-2xl shrink-0'
            : '-translate-x-full lg:-translate-x-full lg:w-0 lg:overflow-hidden pointer-events-none opacity-0'
        } ${
          isWhite
            ? 'bg-white/98 text-[#2E1065] border-r border-violet-100 backdrop-blur-2xl'
            : 'bg-[#120726]/98 text-white border-r border-violet-900/60 backdrop-blur-2xl'
        }`}
        style={{
          display: isOpen ? 'flex' : undefined
        }}
      >
        {/* --- Top Header with Close & Toggle Controls --- */}
        <div
          className={`p-4 border-b ${
            isWhite ? 'border-violet-100 bg-gradient-to-r from-violet-50/90 to-purple-50/70' : 'border-violet-900/40 bg-[#1E0B38]/90'
          } flex items-center justify-between shrink-0`}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#8B5CF6] via-[#7C3AED] to-[#6D28D9] flex items-center justify-center text-white font-heading font-black text-base shadow-md">
              🛍️
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className={`font-heading font-black text-base tracking-tight ${isWhite ? 'text-[#2E1065]' : 'text-white'}`}>
                  Shopping Assistant
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                  LIVE
                </span>
              </div>
              <span className="text-[10px] text-[#7C3AED] font-bold tracking-wide flex items-center gap-1">
                <span>Verified Direct Buy</span>
                <span>•</span>
                <span>Flipkart & Amazon</span>
              </span>
            </div>
          </div>

          {/* Close Sidebar Button */}
          <button
            onClick={onClose}
            className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1 text-xs font-bold ${
              isWhite
                ? 'bg-white hover:bg-violet-100 text-[#7C6898] hover:text-[#2E1065] border-violet-200 shadow-xs'
                : 'bg-white/10 hover:bg-white/20 text-violet-200 hover:text-white border-white/10'
            }`}
            title="Close Assistant Sidebar (or click backdrop)"
          >
            <X className="w-4 h-4 text-[#7C3AED]" />
            <span className="text-[11px]">Close</span>
          </button>
        </div>

        {/* --- Assistant Navigation Tabs --- */}
        <div
          className={`px-3 py-2 border-b flex items-center gap-1 shrink-0 ${
            isWhite ? 'border-violet-100 bg-white/80' : 'border-violet-900/30 bg-black/20'
          }`}
        >
          <button
            onClick={() => setActiveSidebarTab('catalog')}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeSidebarTab === 'catalog'
                ? 'bg-[#7C3AED] text-white shadow-xs font-heading'
                : isWhite
                ? 'text-[#6D28D9] hover:bg-violet-50'
                : 'text-violet-300 hover:bg-white/5'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Popular Deals ({filteredProducts.length})</span>
          </button>

          <button
            onClick={() => setActiveSidebarTab('tracked')}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeSidebarTab === 'tracked'
                ? 'bg-[#7C3AED] text-white shadow-xs font-heading'
                : isWhite
                ? 'text-[#6D28D9] hover:bg-violet-50'
                : 'text-violet-300 hover:bg-white/5'
            }`}
          >
            <TrendingDown className="w-3.5 h-3.5" />
            <span>Tracked ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveSidebarTab('profile')}
            className={`py-1.5 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all ${
              activeSidebarTab === 'profile'
                ? 'bg-[#7C3AED] text-white shadow-xs'
                : isWhite
                ? 'text-[#6D28D9] hover:bg-violet-50'
                : 'text-violet-300 hover:bg-white/5'
            }`}
            title="User Profile & Settings"
          >
            <User className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Settings</span>
          </button>
        </div>

        {/* --- Scrollable Content Area --- */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-4 text-sm">
          {/* ========================================================
              TAB 1: CURATED STORE CATALOG & DIRECT BUY BUTTONS
             ======================================================== */}
          {activeSidebarTab === 'catalog' && (
            <div className="space-y-3.5">
              {/* Trust & Guarantee Banner */}
              <div
                className={`p-3 rounded-2xl border text-xs flex items-center gap-2.5 ${
                  isWhite
                    ? 'bg-gradient-to-r from-violet-50 via-purple-50 to-indigo-50 border-violet-200 text-[#2E1065]'
                    : 'bg-violet-950/40 border-violet-800/50 text-violet-200'
                }`}
              >
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <div className="leading-tight">
                  <div className="font-bold text-[11px] text-[#7C3AED]">
                    Direct Platform Guarantee
                  </div>
                  <div className="text-[10px] text-[#7C6898]">
                    Clicking <strong>Direct Buy</strong> takes you straight to the authentic item on Flipkart, Amazon, or Croma.
                  </div>
                </div>
              </div>

              {/* Store Filter Pills */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
                  <button
                    onClick={() => setCatalogStoreFilter('all')}
                    className={`px-3 py-1 rounded-xl text-xs font-bold shrink-0 transition-all border ${
                      catalogStoreFilter === 'all'
                        ? 'bg-[#7C3AED] text-white border-[#6D28D9] shadow-xs'
                        : isWhite
                        ? 'bg-white hover:bg-violet-50 text-[#4C1D95] border-violet-200'
                        : 'bg-white/5 hover:bg-white/10 text-violet-200 border-white/10'
                    }`}
                  >
                    All Stores
                  </button>

                  <button
                    onClick={() => setCatalogStoreFilter('Flipkart')}
                    className={`px-3 py-1 rounded-xl text-xs font-bold shrink-0 transition-all border flex items-center gap-1 ${
                      catalogStoreFilter === 'Flipkart'
                        ? 'bg-[#2874F0] text-white border-blue-600 shadow-xs'
                        : isWhite
                        ? 'bg-blue-50/80 hover:bg-blue-100 text-[#1D4ED8] border-blue-200'
                        : 'bg-blue-950/40 hover:bg-blue-900/60 text-[#60A5FA] border-blue-800/40'
                    }`}
                  >
                    <span>🛍️ Flipkart</span>
                  </button>

                  <button
                    onClick={() => setCatalogStoreFilter('Amazon')}
                    className={`px-3 py-1 rounded-xl text-xs font-bold shrink-0 transition-all border flex items-center gap-1 ${
                      catalogStoreFilter === 'Amazon'
                        ? 'bg-[#FF9900] text-slate-950 border-amber-500 shadow-xs'
                        : isWhite
                        ? 'bg-amber-50/80 hover:bg-amber-100 text-[#B45309] border-amber-200'
                        : 'bg-amber-950/40 hover:bg-amber-900/60 text-[#FBBF24] border-amber-800/40'
                    }`}
                  >
                    <span>🛒 Amazon</span>
                  </button>

                  <button
                    onClick={() => setCatalogStoreFilter('Croma')}
                    className={`px-3 py-1 rounded-xl text-xs font-bold shrink-0 transition-all border flex items-center gap-1 ${
                      catalogStoreFilter === 'Croma'
                        ? 'bg-[#00E5D2] text-slate-950 border-teal-500 shadow-xs'
                        : isWhite
                        ? 'bg-teal-50/80 hover:bg-teal-100 text-teal-900 border-teal-200'
                        : 'bg-teal-950/40 hover:bg-teal-900/60 text-teal-300 border-teal-800/40'
                    }`}
                  >
                    <span>⚡ Croma</span>
                  </button>

                  <button
                    onClick={() => setCatalogStoreFilter('Tata CLiQ')}
                    className={`px-3 py-1 rounded-xl text-xs font-bold shrink-0 transition-all border flex items-center gap-1 ${
                      catalogStoreFilter === 'Tata CLiQ'
                        ? 'bg-[#D5265B] text-white border-rose-600 shadow-xs'
                        : isWhite
                        ? 'bg-rose-50/80 hover:bg-rose-100 text-rose-900 border-rose-200'
                        : 'bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border-rose-800/40'
                    }`}
                  >
                    <span>💎 Tata CLiQ</span>
                  </button>
                </div>

                {/* Instant Search within Assistant Catalog */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#7C6898]" />
                  <input
                    type="text"
                    value={catalogSearchQuery}
                    onChange={e => setCatalogSearchQuery(e.target.value)}
                    placeholder="Search Flipkart, Amazon, Croma deals..."
                    className={`w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border focus:outline-none transition-colors ${
                      isWhite
                        ? 'bg-[#FAF8FF] border-violet-200 text-[#2E1065] focus:border-[#7C3AED]'
                        : 'bg-black/40 border-violet-800/60 text-white focus:border-[#7C3AED]'
                    }`}
                  />
                  {catalogSearchQuery && (
                    <button
                      onClick={() => setCatalogSearchQuery('')}
                      className="absolute right-2.5 top-2 text-xs text-[#7C6898] hover:text-[#2E1065]"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Products List with Direct Buy Buttons */}
              <div className="space-y-3">
                {filteredProducts.map(item => {
                  const directUrl = item.sourceUrl || item.amazonUrl || item.flipkartUrl || item.cromaUrl;
                  const isCopied = copiedLinkProductId === item.id;

                  // Platform specific button styling
                  let storeBtnColor = 'from-[#8B5CF6] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] text-white';
                  if (item.store === 'Flipkart') {
                    storeBtnColor = 'from-[#2874F0] to-[#1E60D0] hover:from-[#1E60D0] hover:to-[#174EA6] text-white';
                  } else if (item.store === 'Amazon') {
                    storeBtnColor = 'from-[#FF9900] to-[#E68A00] hover:from-[#E68A00] hover:to-[#CC7A00] text-slate-950 font-black';
                  } else if (item.store === 'Croma') {
                    storeBtnColor = 'from-[#00BFA5] to-[#009688] hover:from-[#009688] hover:to-[#00796B] text-white';
                  } else if (item.store === 'Tata CLiQ') {
                    storeBtnColor = 'from-[#D5265B] to-[#B01E49] hover:from-[#B01E49] hover:to-[#91163A] text-white';
                  }

                  return (
                    <div
                      key={item.id}
                      className={`p-3 rounded-2xl border transition-all ${
                        isWhite
                          ? 'bg-white border-violet-100 hover:border-violet-300 shadow-sm'
                          : 'bg-black/30 border-violet-900/50 hover:border-violet-700/80 shadow-md'
                      }`}
                    >
                      {/* Top Row: Thumbnail + Product Title + Store Badge */}
                      <div className="flex gap-2.5 mb-2.5">
                        <div
                          onClick={() => handleOpenProductModal(item)}
                          className={`w-14 h-14 rounded-xl overflow-hidden shrink-0 border cursor-pointer relative group ${
                            isWhite ? 'bg-violet-50 border-violet-100' : 'bg-black/50 border-white/10'
                          }`}
                          title="Click to view full specs & photos"
                        >
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            onError={e => handleImageError(e)}
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <span
                              className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md border ${
                                item.store === 'Flipkart'
                                  ? 'bg-blue-50 text-[#1D4ED8] border-blue-200'
                                  : item.store === 'Amazon'
                                  ? 'bg-amber-50 text-[#B45309] border-amber-200'
                                  : item.store === 'Croma'
                                  ? 'bg-teal-50 text-teal-800 border-teal-200'
                                  : 'bg-rose-50 text-rose-800 border-rose-200'
                              }`}
                            >
                              {item.store}
                            </span>
                            <span className="text-[10px] text-[#7C6898] flex items-center gap-0.5">
                              ★ <span className="font-bold">{item.rating}</span> ({item.reviewsCount})
                            </span>
                          </div>

                          <div
                            onClick={() => handleOpenProductModal(item)}
                            className={`font-semibold text-xs leading-snug line-clamp-2 cursor-pointer transition-colors ${
                              isWhite ? 'text-[#2E1065] hover:text-[#7C3AED]' : 'text-white hover:text-violet-300'
                            }`}
                            title={item.name}
                          >
                            {item.name}
                          </div>
                        </div>
                      </div>

                      {/* Price & Savings Row */}
                      <div className="flex items-baseline justify-between gap-1 mb-2.5 px-0.5">
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-heading font-black text-sm text-[#7C3AED]">
                            {item.price}
                          </span>
                          <span className="text-[11px] line-through text-[#7C6898]">
                            {item.mrp}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          {item.savings}
                        </span>
                      </div>

                      {/* DIRECT BUY BUTTON (Strict original platform URL) */}
                      <div className="space-y-1.5">
                        <a
                          href={directUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`w-full bg-gradient-to-r ${storeBtnColor} text-xs font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer`}
                          title={`Direct Buy on ${item.store} — strictly opens ${directUrl}`}
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>Direct Buy on {item.store}</span>
                          <ExternalLink className="w-3 h-3 opacity-80 ml-0.5" />
                        </a>

                        {/* Secondary Store Links & Specs Action */}
                        <div className="flex items-center gap-1.5 pt-0.5">
                          <button
                            type="button"
                            onClick={() => handleOpenProductModal(item)}
                            className={`flex-1 py-1 px-2 rounded-lg text-[10px] font-bold border transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                              isWhite
                                ? 'bg-violet-50 hover:bg-violet-100 text-[#4C1D95] border-violet-200'
                                : 'bg-white/5 hover:bg-white/10 text-violet-200 border-white/10'
                            }`}
                          >
                            <Sparkles className="w-2.5 h-2.5 text-[#7C3AED]" />
                            <span>Specs & Photos</span>
                          </button>

                          {/* Quick Track Price Button */}
                          <button
                            type="button"
                            onClick={() => {
                              if (onTrackCuratedProduct) {
                                onTrackCuratedProduct(item.name, `${item.name} price India`);
                              } else {
                                setNewProdName(item.name);
                                setNewProdQuery(`${item.name} price India`);
                                setActiveSidebarTab('tracked');
                              }
                            }}
                            className={`py-1 px-2 rounded-lg text-[10px] font-bold border transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                              isWhite
                                ? 'bg-white hover:bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-emerald-950/30 hover:bg-emerald-900/50 text-emerald-300 border-emerald-800/40'
                            }`}
                            title="Add to Tracked Products for price drop alerts"
                          >
                            <Plus className="w-2.5 h-2.5 text-emerald-500" />
                            <span>Track Price</span>
                          </button>

                          {/* Alternative store quick links if available */}
                          {item.store !== 'Amazon' && item.amazonUrl && (
                            <a
                              href={item.amazonUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2 py-1 rounded-lg text-[10px] font-bold border bg-amber-50 hover:bg-amber-100 text-[#B45309] border-amber-200 flex items-center gap-0.5"
                              title="Compare on Amazon India"
                            >
                              <span>Amazon ↗</span>
                            </a>
                          )}

                          {item.store !== 'Flipkart' && item.flipkartUrl && (
                            <a
                              href={item.flipkartUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2 py-1 rounded-lg text-[10px] font-bold border bg-blue-50 hover:bg-blue-100 text-[#1D4ED8] border-blue-200 flex items-center gap-0.5"
                              title="Compare on Flipkart"
                            >
                              <span>Flipkart ↗</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 2: TRACKED PRODUCTS & PRICE DROP ALERTS
             ======================================================== */}
          {activeSidebarTab === 'tracked' && (
            <div className="space-y-4">
              {/* Notifications Settings */}
              <div
                className={`p-3.5 rounded-2xl border ${
                  isWhite ? 'glass-panel-white border-violet-100' : 'glass-panel border-white/10'
                } shadow-md`}
              >
                <div className="flex items-center gap-2 text-[#7C3AED] font-semibold text-xs tracking-wider uppercase mb-1.5">
                  <Bell className="w-4 h-4" />
                  <span>Price-Drop Alerts</span>
                </div>
                <p className={`text-[11px] ${isWhite ? 'text-[#7C6898]' : 'text-[#8B96AC]'} mb-3`}>
                  Receive alerts when prices drop below your target price in ₹.
                </p>

                <form onSubmit={handleSaveNotifications} className="space-y-2 mb-3">
                  <div>
                    <label className={`text-[11px] ${isWhite ? 'text-[#7C6898]' : 'text-[#8B96AC]'} block mb-1`}>
                      Alert Email
                    </label>
                    <input
                      type="email"
                      value={notifyEmail}
                      onChange={e => setNotifyEmail(e.target.value)}
                      placeholder="you@example.com"
                      className={`${
                        isWhite
                          ? 'bg-[#FAF8FF] border-violet-200 text-[#2E1065] focus:border-[#7C3AED]'
                          : 'bg-black/30 border-white/10 text-[#E9EDF5] focus:border-[#7C3AED]'
                      } border rounded-xl px-3 py-1.5 text-xs w-full focus:outline-none`}
                    />
                  </div>
                  <div>
                    <label className={`text-[11px] ${isWhite ? 'text-[#7C6898]' : 'text-[#8B96AC]'} block mb-1`}>
                      Telegram Chat ID
                    </label>
                    <input
                      type="text"
                      value={notifyTelegram}
                      onChange={e => setNotifyTelegram(e.target.value)}
                      placeholder="e.g. 123456789"
                      className={`${
                        isWhite
                          ? 'bg-[#FAF8FF] border-violet-200 text-[#2E1065] focus:border-[#7C3AED]'
                          : 'bg-black/30 border-white/10 text-[#E9EDF5] focus:border-[#7C3AED]'
                      } border rounded-xl px-3 py-1.5 text-xs w-full focus:outline-none`}
                    />
                  </div>
                  <button
                    type="submit"
                    className={`w-full ${
                      isWhite
                        ? 'bg-violet-50 hover:bg-violet-100 text-[#2E1065] border-violet-200'
                        : 'bg-[#1E273A] hover:bg-[#2B3752] text-white border-white/10'
                    } border text-xs font-semibold py-1.5 rounded-xl transition-colors`}
                  >
                    {notifySaved ? '✓ Saved' : 'Save Notification Settings'}
                  </button>
                </form>

                <button
                  type="button"
                  onClick={handleSendTestNotification}
                  disabled={isSendingTestAlert}
                  className={`w-full ${
                    isWhite
                      ? 'bg-violet-50 hover:bg-slate-200 text-[#2E1065] border-violet-200'
                      : 'bg-black/40 hover:bg-black/60 border-white/10 text-[#E9EDF5]'
                  } border text-xs py-1.5 rounded-xl font-medium flex items-center justify-center gap-1.5 transition-all`}
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
                            ? isWhite
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                              : 'bg-emerald-950/40 border-emerald-700/60 text-emerald-300'
                            : isWhite
                            ? 'bg-violet-50 border-amber-200 text-[#7C3AED]'
                            : 'bg-amber-950/40 border-amber-700/60 text-[#7C3AED]'
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

              {/* Tracked Products List */}
              <div
                className={`p-3.5 rounded-2xl border ${
                  isWhite ? 'glass-panel-white border-violet-100' : 'glass-panel border-white/10'
                } shadow-md`}
              >
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
                      <div
                        key={prod.id}
                        className={`${
                          isWhite ? 'bg-white border-violet-100 shadow-xs' : 'bg-black/30 border-white/5'
                        } rounded-xl border overflow-hidden`}
                      >
                        <div
                          className={`w-full text-left px-3 py-2 flex items-center justify-between ${
                            isWhite ? 'hover:bg-[#FAF8FF]' : 'hover:bg-white/5'
                          } transition-colors`}
                        >
                          <div
                            onClick={() => handleOpenProductModal(prod.name)}
                            className="flex items-center gap-2.5 truncate pr-2 cursor-pointer flex-1"
                            title="Click to view full pictures and details"
                          >
                            <div
                              className={`w-9 h-9 rounded-lg overflow-hidden ${
                                isWhite ? 'bg-violet-50 border-violet-100' : 'bg-black/50 border-white/10'
                              } border shrink-0`}
                            >
                              <img
                                src={getProductFallbackImg(prod.name)}
                                alt={prod.name}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                                onError={e => handleImageError(e)}
                              />
                            </div>
                            <div className="truncate">
                              <div
                                className={`font-semibold text-xs ${
                                  isWhite ? 'text-[#2E1065] hover:text-[#7C3AED]' : 'text-[#E9EDF5] hover:text-violet-300'
                                } truncate transition-colors`}
                              >
                                {prod.name}
                              </div>
                              <div className={`text-[11px] ${isWhite ? 'text-[#7C6898]' : 'text-[#8B96AC]'}`}>
                                {prod.current_price ? (
                                  <span className="font-semibold text-emerald-600">
                                    {formatINR(prod.current_price)}
                                  </span>
                                ) : (
                                  'No price check yet'
                                )}
                                {prod.target_price && (
                                  <span className="ml-1 text-[#7C3AED] font-bold">
                                    (target: {formatINR(prod.target_price)})
                                  </span>
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
                          <div
                            className={`px-3 pb-3 pt-1 border-t ${
                              isWhite ? 'border-violet-100 bg-[#FAF8FF]/80' : 'border-white/5 bg-black/40'
                            } text-xs space-y-2`}
                          >
                            <p className={`text-[11px] ${isWhite ? 'text-[#7C6898]' : 'text-[#8B96AC]'}`}>
                              Query: <span className={`${isWhite ? 'text-[#2E1065]' : 'text-[#D2D9E8]'} font-mono`}>{prod.search_query}</span>
                            </p>
                            {prod.lowest_price !== null && (
                              <p className="text-[11px] text-emerald-600 font-bold">
                                Lowest seen in India: {formatINR(prod.lowest_price)}
                              </p>
                            )}

                            {renderSparkline(prod.history)}

                            {/* Direct Buy Buttons for Tracked Product */}
                            <div className="flex items-center gap-1.5 pt-1 flex-wrap">
                              <a
                                href={`https://www.flipkart.com/search?q=${encodeURIComponent(prod.search_query)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-[#2874F0] hover:bg-[#1E60D0] text-white px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-xs"
                                title="Direct Buy on Flipkart"
                              >
                                <ShoppingCart className="w-2.5 h-2.5" />
                                <span>Flipkart ↗</span>
                              </a>

                              <a
                                href={`https://www.amazon.in/s?k=${encodeURIComponent(prod.search_query)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-[#FF9900] hover:bg-[#E68A00] text-slate-950 px-2.5 py-1 rounded-lg text-[10px] font-black flex items-center gap-1 shadow-xs"
                                title="Direct Buy on Amazon India"
                              >
                                <ShoppingCart className="w-2.5 h-2.5" />
                                <span>Amazon ↗</span>
                              </a>

                              <button
                                type="button"
                                onClick={() => handleOpenProductModal(prod.name)}
                                className="bg-violet-100 hover:bg-violet-200 border border-violet-200 text-[#4C1D95] px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                              >
                                <Sparkles className="w-2.5 h-2.5 text-[#7C3AED]" />
                                <span>Specs</span>
                              </button>
                            </div>

                            {alertInfo && (
                              <div
                                className={`p-2 rounded-lg text-[11px] ${
                                  alertInfo.alert
                                    ? isWhite
                                      ? 'bg-violet-100 border border-violet-200 text-[#2E1065]'
                                      : 'bg-amber-950/60 border border-amber-600 text-amber-200'
                                    : isWhite
                                    ? 'bg-violet-50 border border-violet-100 text-[#3B1E7A]'
                                    : 'bg-[#141A29] border border-[#262F42] text-[#8B96AC]'
                                }`}
                              >
                                {alertInfo.message}
                              </div>
                            )}

                            <div className="flex gap-2 pt-1">
                              <button
                                onClick={() => handleCheckProductPrice(prod)}
                                disabled={isChecking}
                                className={`flex-1 ${
                                  isWhite
                                    ? 'bg-violet-100 hover:bg-violet-200 border-violet-200 text-[#2E1065]'
                                    : 'bg-[#7C3AED]/15 hover:bg-[#7C3AED]/25 border-[#F0B429]/40 text-[#7C3AED]'
                                } border py-1 px-2 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors`}
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
                                className={`${
                                  isWhite
                                    ? 'bg-violet-50 hover:bg-rose-100 text-[#7C6898] hover:text-rose-700 border-violet-100'
                                    : 'bg-white/5 hover:bg-rose-900/60 hover:text-rose-200 text-[#8B96AC]'
                                } border p-1 px-2 rounded-lg text-[11px] transition-colors`}
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
                    className={`${
                      isWhite
                        ? 'bg-[#FAF8FF] border-violet-200 text-[#2E1065] focus:border-[#7C3AED]'
                        : 'bg-black/30 border-white/10 text-[#E9EDF5] focus:border-[#7C3AED]'
                    } border rounded-xl px-3 py-1.5 text-xs w-full focus:outline-none`}
                  />
                  <input
                    type="text"
                    value={newProdQuery}
                    onChange={e => setNewProdQuery(e.target.value)}
                    placeholder="Search query (e.g. Sony WH-1000XM5 price India)"
                    className={`${
                      isWhite
                        ? 'bg-[#FAF8FF] border-violet-200 text-[#2E1065] focus:border-[#7C3AED]'
                        : 'bg-black/30 border-white/10 text-[#E9EDF5] focus:border-[#7C3AED]'
                    } border rounded-xl px-3 py-1.5 text-xs w-full focus:outline-none`}
                  />
                  <div className="relative">
                    <span className="absolute left-3 top-1.5 text-xs text-[#7C3AED] font-bold">₹</span>
                    <input
                      type="number"
                      step="any"
                      value={newProdTarget}
                      onChange={e => setNewProdTarget(e.target.value)}
                      placeholder="Target alert price in ₹ (optional)"
                      className={`${
                        isWhite
                          ? 'bg-[#FAF8FF] border-violet-200 text-[#2E1065] focus:border-[#7C3AED]'
                          : 'bg-black/30 border-white/10 text-[#E9EDF5] focus:border-[#7C3AED]'
                      } border rounded-xl pl-7 pr-3 py-1.5 text-xs w-full focus:outline-none`}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-purple-600 hover:to-violet-700 text-white font-bold text-xs py-2 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    Track Product in ₹
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 3: USER PROFILE & PREFERENCES
             ======================================================== */}
          {activeSidebarTab === 'profile' && (
            <div className="space-y-4">
              {/* User Profile */}
              <div
                className={`${isWhite ? 'glass-panel-white' : 'glass-panel'} p-3.5 rounded-2xl border ${
                  isWhite ? 'border-violet-100' : 'border-violet-900/50'
                } shadow-md`}
              >
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
                    className={`${
                      isWhite
                        ? 'bg-[#FAF8FF] border-violet-200 text-[#2E1065] focus:border-violet-500'
                        : 'bg-black/30 border-violet-800 text-[#FAF8FF] focus:border-violet-400'
                    } border rounded-xl px-3 py-1.5 text-xs w-full focus:outline-none transition-colors`}
                  />
                  <button
                    type="submit"
                    className={`${
                      isWhite
                        ? 'bg-violet-100 hover:bg-violet-200 text-[#6D28D9] border-violet-200'
                        : 'bg-violet-900 hover:bg-violet-800 text-white border-violet-700'
                    } border text-xs font-semibold px-3 py-1.5 rounded-xl shrink-0 transition-colors`}
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
              <div
                className={`${isWhite ? 'glass-panel-white' : 'glass-panel'} p-3.5 rounded-2xl border ${
                  isWhite ? 'border-violet-100' : 'border-white/10'
                } shadow-md`}
              >
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
                        className={`flex items-center justify-between ${
                          isWhite ? 'bg-[#FAF8FF] border-violet-100 text-[#2E1065]' : 'bg-black/40 border-white/5 text-[#D2D9E8]'
                        } px-3 py-1.5 rounded-xl border text-xs`}
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
                  <div className={`text-xs ${isWhite ? 'text-[#8B78A5]' : 'text-[#8B96AC]'} italic mb-3`}>
                    No preferences saved yet.
                  </div>
                )}

                <form onSubmit={handleSavePreference} className={`space-y-2 pt-2 border-t ${isWhite ? 'border-violet-100' : 'border-white/10'}`}>
                  <input
                    type="text"
                    value={newPrefKey}
                    onChange={e => setNewPrefKey(e.target.value)}
                    placeholder="Preference name (e.g. budget, store, brand)"
                    className={`${
                      isWhite
                        ? 'bg-[#FAF8FF] border-violet-200 text-[#2E1065] focus:border-[#7C3AED]'
                        : 'bg-black/30 border-white/10 text-[#E9EDF5] focus:border-[#7C3AED]'
                    } border rounded-xl px-3 py-1.5 text-xs w-full focus:outline-none`}
                  />
                  <input
                    type="text"
                    value={newPrefValue}
                    onChange={e => setNewPrefValue(e.target.value)}
                    placeholder="Value (e.g. under ₹50,000, Flipkart, Sony)"
                    className={`${
                      isWhite
                        ? 'bg-[#FAF8FF] border-violet-200 text-[#2E1065] focus:border-[#7C3AED]'
                        : 'bg-black/30 border-white/10 text-[#E9EDF5] focus:border-[#7C3AED]'
                    } border rounded-xl px-3 py-1.5 text-xs w-full focus:outline-none`}
                  />
                  <button
                    type="submit"
                    className={`w-full ${
                      isWhite
                        ? 'bg-violet-100 hover:bg-violet-200 text-[#2E1065] border-violet-200'
                        : 'bg-[#7C3AED]/15 hover:bg-[#7C3AED]/25 text-[#7C3AED] border-[#F0B429]/30 hover:border-[#F0B429]'
                    } border text-xs font-semibold py-1.5 rounded-xl transition-all flex items-center justify-center gap-1.5`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Remember Preference
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* --- Footer Status Bar --- */}
        <div
          className={`p-3 border-t text-[11px] flex items-center justify-between ${
            isWhite ? 'border-violet-100 bg-violet-50/60 text-[#7C6898]' : 'border-violet-900/40 bg-black/40 text-violet-300'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Assistant Active</span>
          </div>
          <button
            onClick={onClose}
            className="text-[#7C3AED] hover:underline font-bold text-[10px] cursor-pointer"
          >
            Collapse Sidebar ✕
          </button>
        </div>
      </aside>
    </>
  );
};
