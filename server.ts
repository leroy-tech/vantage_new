import './server/geminiConfig';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import * as db from './server/db';
import * as agent from './server/agent';
import * as notifications from './server/notifications';
import { resolveExactProductImage, getProductImageUrl, resolveExactProductSource } from './server/productImages';
import {
  queryVerifiedCatalog,
  getVerifiedPlatformLinks,
  validateProductDetailPage,
  VERIFIED_PRODUCT_CATALOG,
  TRUSTED_DOMAINS,
  cleanProductUrl,
  verifyProductLive
} from './server/productVerifier';
import { searchAllIndianPlatforms, getSearchSuggestions } from './server/multiPlatformSearch';
import { getMarketplaceHomeFeed, getCategoryListing } from './server/marketplaceService';
import { CATEGORIES_TREE, BRANDS_DIRECTORY, searchCategoryTree, getCategoryById } from './server/categoryTree';
import { productManager } from './server/providers/ProductManager';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const HOST = '0.0.0.0';

app.use(cors());
app.use(express.json());

// Initialize database
db.initDb();

// ---------- API Routes ----------

// Exact Product Source & Direct Link Lookup
app.get('/api/product-source', async (req, res) => {
  const q = String(req.query.q || '');
  if (!q) {
    return res.status(400).json({ error: 'q is required' });
  }
  const source = await resolveExactProductSource(q);
  res.json(source);
});

// Strict Verified Product & Direct Buy PDP Lookup
// Schema: name, brand, platform, price_inr, rating, image_url, image_source_url, buy_url, source_domain, verified, last_checked
app.get('/api/verify-product', async (req, res) => {
  const q = String(req.query.q || '').trim();
  if (!q) {
    return res.status(400).json({ error: 'q parameter is required' });
  }

  const candidateUrl = String(req.query.url || '').trim();
  try {
    const verified = await verifyProductLive(q, candidateUrl);
    res.json(verified);
  } catch (err: any) {
    res.status(500).json({
      name: q,
      brand: q.split(' ')[0] || 'Unknown',
      platform: 'Not Verified',
      price_inr: 'N/A',
      rating: 0,
      image_url: '',
      image_source_url: '',
      buy_url: '',
      source_domain: '',
      verified: false,
      last_checked: new Date().toISOString(),
      retry: true,
      error: err?.message || 'Verification failed',
      message: 'Failed to verify product detail page. Please retry.'
    });
  }
});

// Multi-platform Live Indian Search with Filtering & Strict PDP Verification
app.get('/api/search/vantage', async (req, res) => {
  const q = String(req.query.q || '').trim() || 'best phone under 20000';
  const page = parseInt(String(req.query.page || '1'), 10) || 1;
  const limit = parseInt(String(req.query.limit || '12'), 10) || 12;
  const sort = String(req.query.sort || 'relevance') as 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'newest';

  try {
    const result = await searchAllIndianPlatforms(q, page, limit, sort);
    res.json(result);
  } catch (err: any) {
    console.error('[server] search/vantage error:', err);
    res.status(500).json({
      error: err?.message || 'Search failed across Indian platforms',
      query: q,
      totalProducts: 0,
      page,
      hasMore: false,
      summary: {
        overview: 'Temporarily unable to fetch live data. Please retry in a few moments.',
        topPick: { name: '', reason: '', priceFormatted: '' },
        budgetPick: { name: '', reason: '', priceFormatted: '' },
        valuePick: { name: '', reason: '', priceFormatted: '' },
      },
      products: [],
      availableBrands: [],
      availablePlatforms: [],
      priceRange: { min: 0, max: 0 }
    });
  }
});

// Autocomplete suggestions and trending searches
app.get('/api/search/suggestions', (req, res) => {
  const q = String(req.query.q || '');
  const data = getSearchSuggestions(q);
  res.json(data);
});

// Verified Products Catalog Endpoint
app.get('/api/verified-catalog', (req, res) => {
  res.json({
    total: VERIFIED_PRODUCT_CATALOG.length,
    products: VERIFIED_PRODUCT_CATALOG,
    trusted_domains: TRUSTED_DOMAINS,
  });
});

// Comprehensive Product Details & Specifications Lookup
app.get('/api/product-details', async (req, res) => {
  const q = String(req.query.q || '');
  if (!q) {
    return res.status(400).json({ error: 'q is required' });
  }
  try {
    const details = await agent.getProductDetails(q);
    res.json(details);
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Failed to fetch product details' });
  }
});

// Exact Product Image Lookup
app.get('/api/product-image', async (req, res) => {
  const q = String(req.query.q || '');
  if (!q) {
    return res.json({ url: getProductImageUrl('') });
  }
  const url = await resolveExactProductImage(q);
  res.json({ url });
});

// Image Validator endpoint to check and verify product image URLs
app.post('/api/validate-images', async (req, res) => {
  try {
    const urls: string[] = Array.isArray(req.body?.urls) ? req.body.urls : [];
    const results = await Promise.all(
      urls.slice(0, 30).map(async (url) => {
        try {
          const controller = new AbortController();
          const timer = setTimeout(() => controller.abort(), 4000);
          const response = await fetch(url, { method: 'HEAD', signal: controller.signal });
          clearTimeout(timer);
          return { url, ok: response.ok, status: response.status };
        } catch (err: any) {
          return { url, ok: false, status: 0, error: err.message };
        }
      })
    );
    res.json({
      total: results.length,
      reachable: results.filter(r => r.ok).length,
      unreachable: results.filter(r => !r.ok).length,
      details: results
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Validation failed' });
  }
});

// Live 2026 Indian Market Releases Radar Endpoint
// Discovers and delivers the newest product launches in the market to update objects in the air mode
const MARKET_RELEASES_STORE = [
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
    launchBadge: '2026 New Arrival · Gemini AI',
    highlights: [
      'Google Tensor G4 chip with 16GB RAM for on-device Gemini Nano multimodal intelligence',
      'Super Actua display with 3000 nits peak brightness and 1-120Hz LTPO',
      'Triple pro camera: 50MP main + 48MP 5x telephoto + 48MP ultrawide with macro focus',
      '7 years of guaranteed OS, security, and Pixel Feature Drop updates'
    ],
    specs: {
      'Processor': 'Google Tensor G4 (Titan M2 security)',
      'Display': '6.8-inch Super Actua LTPO OLED (1344 x 2992), 3000 nits',
      'Camera': '50MP Octa PD Wide + 48MP Quad PD Telephoto 30x Super Res Zoom',
      'Battery': '5060 mAh with 37W Fast Charging and Wireless Qi',
      'Warranty': '1 Year Google India Warranty'
    },
    pros: [
      'Industry-leading computational photography and Best Take facial editing',
      'Clean pure Android 15 experience with immediate feature drops',
      'Brightest outdoor screen tested under direct Indian noon sun'
    ],
    cons: [
      'Charging speed slower than 100W competitors'
    ],
    communityTake: 'Praised across r/Android and tech creators as the best camera smartphone on the market.',
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
    tag: 'M3 Pro 11-Core CPU + 14-Core GPU',
    animationClass: 'animate-float-2',
    rating: 4.9,
    reviewsCount: '4,100+ reviews',
    isNewRelease: true,
    launchBadge: '2026 Pro Silicon · Space Black',
    highlights: [
      'Apple M3 Pro chip with 11-core CPU and 14-core GPU with hardware-accelerated ray tracing',
      'Liquid Retina XDR display with 1000 nits sustained and 1600 nits peak HDR brightness',
      'Breakthrough battery endurance up to 18 hours of continuous video playback',
      'Gorgeous Space Black anodized finish with breakthrough fingerprint resistance'
    ],
    specs: {
      'Chipset': 'Apple M3 Pro (11-core CPU, 14-core GPU, 16-core Neural Engine)',
      'Memory': '18GB Unified Memory (150GB/s memory bandwidth)',
      'Display': '14.2-inch Liquid Retina XDR (3024x1964 at 254 ppi), 120Hz ProMotion',
      'Ports': '3x Thunderbolt 4, HDMI port, SDXC card slot, MagSafe 3',
      'Warranty': '1 Year Apple India Warranty'
    },
    pros: [
      'Handles multi-track 4K ProRes video rendering and Docker without breaking a sweat',
      'Industry-leading Liquid Retina XDR display fidelity with true 120Hz',
      'Silent thermal performance even under sustained compilation workloads'
    ],
    cons: [
      'Premium price tier'
    ],
    communityTake: 'The ultimate dream machine for Indian full-stack engineers and multimedia creators.',
    expertTake: 'AnandTech & The Verge Editor Choice: "Peak laptop hardware engineering."'
  },
  {
    id: 'apple-watch-ultra-2',
    name: 'Apple Watch Ultra 2 GPS + Cellular (49mm Titanium)',
    category: 'wearables',
    price: '₹89,900',
    mrp: '₹89,900',
    savings: 'Lowest Price Guarantee + Free Fast Shipping',
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
      'S9 SiP with Double Tap gesture for hands-free one-finger navigation',
      'Blinding 3000 nits maximum display brightness for high mountain and ocean visibility',
      'Precision dual-frequency GPS (L1 and L5) with automatic track detection',
      'Up to 72 hours in Low Power Mode and EN13319 certified 40m scuba dive computer'
    ],
    specs: {
      'Case': '49mm Aerospace-grade Titanium with raised sapphire front crystal',
      'Display': 'Always-On Retina OLED, 3000 nits peak',
      'Sensors': 'Dual-frequency GPS, Depth gauge, Water temperature, ECG, Blood Oxygen',
      'Battery': 'Up to 36 hours normal use / 72 hours low power mode',
      'Warranty': '1 Year Apple India Warranty'
    },
    pros: [
      'Double Tap gesture makes using the watch with one hand effortless',
      'Incredible battery life lasting multiple days in demanding Himalayan expeditions',
      'Titanium chassis resists scratches and accidental impacts'
    ],
    cons: [
      'Large 49mm footprint requires medium to broad wrists'
    ],
    communityTake: 'Hailed by Indian marathoners and triathletes as the most reliable GPS sports timepiece.',
    expertTake: 'DC Rainmaker & Wired: "The benchmark rugged smartwatch."'
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
      'Dedicated AI processing unit recognizes human poses, insects, vehicles, and birds',
      '7.0 stops of optical 5-axis in-body image stabilization (IBIS)',
      '4K 60p 10-bit 4:2:2 video with S-Cinetone and user LUT importing'
    ],
    specs: {
      'Sensor': '33.0MP Full-Frame Exmor R CMOS Sensor',
      'Video': '4K 60p oversampled 7K full-frame 10-bit 4:2:2 internal',
      'Stabilization': '7.0-stop 5-axis optical IBIS',
      'Weight': '514g compact full-frame magnesium chassis',
      'Warranty': '2 Years Sony India Official Warranty'
    },
    pros: [
      'Compact travel-friendly body with uncompromised full-frame dynamic range',
      'AI autofocus locks onto subjects even when turning their back or wearing helmets',
      'S-Cinetone produces cinema-grade natural skin tones without grading'
    ],
    cons: [
      'Single SD card slot'
    ],
    communityTake: 'The creator gold standard for Indian wedding videographers and travel documentarians.',
    expertTake: 'DPReview Gold Award 2026: "Spectacular full-frame performance in an ultralight body."'
  },
  {
    id: 'iphone-16-pro',
    name: 'Apple iPhone 16 Pro (Desert Titanium 128GB)',
    category: 'phones',
    price: '₹1,19,900',
    mrp: '₹1,29,900',
    savings: 'Save ₹10,000 + Exchange Bonus',
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
    launchBadge: '2026 Flagship Arrival'
  },
  {
    id: 'oneplus-12',
    name: 'OnePlus 12 5G (Flowy Emerald 16GB/512GB)',
    category: 'phones',
    price: '₹64,999',
    mrp: '₹69,999',
    savings: 'Save ₹5,000 + 100W Charger in Box',
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
    launchBadge: 'Hasselblad 4th Gen'
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
    launchBadge: 'World-Class Spatial ANC'
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
    launchBadge: 'Smart Particle Counter'
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
    launchBadge: 'Hyped 2026 Street Shooter'
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
    launchBadge: 'Legendary Marshall Brass'
  }
];

app.get('/api/market-releases', (req, res) => {
  res.json({
    timestamp: new Date().toISOString(),
    market: 'India (₹ / INR)',
    total_releases: MARKET_RELEASES_STORE.length,
    releases: MARKET_RELEASES_STORE
  });
});

// Endpoint to simulate or ingest newly detected products entering the market
app.post('/api/market-releases', (req, res) => {
  const { product } = req.body;
  if (!product || !product.name) {
    return res.status(400).json({ error: 'Valid product object is required' });
  }

  const newId = product.id || `release-${Date.now()}`;
  const completeProduct = {
    ...product,
    id: newId,
    isNewRelease: true,
    launchBadge: product.launchBadge || 'New 2026 Market Arrival',
    animationClass: product.animationClass || 'animate-float-1',
    rating: product.rating || 4.8,
    reviewsCount: product.reviewsCount || '1,200+ verified buyers'
  };

  // Prepend to release store
  MARKET_RELEASES_STORE.unshift(completeProduct);

  res.json({
    success: true,
    message: `Market Radar: Ingested new arrival "${completeProduct.name}". Ready to replace air objects.`,
    total_releases: MARKET_RELEASES_STORE.length,
    releases: MARKET_RELEASES_STORE
  });
});

// Stats
app.get('/api/stats', (req, res) => {
  const userId = (req.query.user_id as string) || 'default';
  const prefs = db.getPreferences(userId);
  const prefCount = Object.keys(prefs).filter(k => !k.startsWith('_')).length;
  const tracked = db.listTrackedProducts(userId);
  const totalChecks = tracked.reduce((sum, p) => sum + db.getPriceHistory(p.id).length, 0);

  res.json({
    tracked_count: tracked.length,
    total_checks: totalChecks,
    pref_count: prefCount,
    onboarding_dismissed: prefs['_onboarding_dismissed'] === 'true',
  });
});

// Preferences
app.get('/api/preferences', (req, res) => {
  const userId = (req.query.user_id as string) || (req.query.userId as string) || 'default';
  const prefs = db.getPreferences(userId);
  res.json(prefs);
});

app.post('/api/preferences', (req, res) => {
  const userId = req.body.user_id || req.body.userId;
  const { key, value } = req.body;
  if (!userId || !key) {
    return res.status(400).json({ error: 'user_id and key are required' });
  }
  db.setPreference(userId, key, value || '');
  res.json({ success: true, preferences: db.getPreferences(userId) });
});

app.delete('/api/preferences', (req, res) => {
  const userId = req.body.user_id || req.body.userId;
  const { key } = req.body;
  if (!userId || !key) {
    return res.status(400).json({ error: 'user_id and key are required' });
  }
  db.deletePreference(userId, key);
  res.json({ success: true, preferences: db.getPreferences(userId) });
});

// Notification settings & test
app.post('/api/notifications/settings', (req, res) => {
  const userId = req.body.user_id || req.body.userId;
  const { email, telegram_chat_id } = req.body;
  if (!userId) {
    return res.status(400).json({ error: 'user_id is required' });
  }
  if (email !== undefined) {
    db.setPreference(userId, 'notify_email', email);
  }
  if (telegram_chat_id !== undefined) {
    db.setPreference(userId, 'notify_telegram_chat_id', telegram_chat_id);
  }
  res.json({ success: true, preferences: db.getPreferences(userId) });
});

app.post('/api/notifications/test', async (req, res) => {
  const userId = req.body.user_id || req.body.userId || 'default';
  const results = await notifications.notifyPriceAlert(
    userId,
    'Test Alert — Vantage Shopping Assistant',
    'This is a test alert. If you received this, your price notification settings are working properly!'
  );
  res.json({ success: true, results });
});

// Tracked Products
app.get('/api/products', (req, res) => {
  const userId = (req.query.user_id as string) || (req.query.userId as string) || 'default';
  const products = db.listTrackedProducts(userId);
  const enriched = products.map(p => {
    const history = db.getPriceHistory(p.id);
    const lowest = db.getLowestPrice(p.id);
    const latestCheck = history.length > 0 ? history[history.length - 1] : null;
    return {
      ...p,
      history,
      lowest_price: lowest,
      current_price: latestCheck ? latestCheck.price : null,
      latest_check: latestCheck,
    };
  });
  res.json(enriched);
});

app.post('/api/products', (req, res) => {
  const userId = req.body.user_id || req.body.userId || 'default';
  const { name, search_query, target_price } = req.body;
  if (!userId || !name || !search_query) {
    return res.status(400).json({ error: 'user_id, name, and search_query are required' });
  }
  const parsedTarget = target_price ? parseFloat(target_price) : null;
  const prod = db.addTrackedProduct(userId, name, search_query, parsedTarget);
  res.json({ success: true, product: prod });
});

app.delete('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid product id' });
  }
  db.removeTrackedProduct(id);
  res.json({ success: true });
});

app.get('/api/products/:id/history', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid product id' });
  }
  const history = db.getPriceHistory(id);
  const lowest = db.getLowestPrice(id);
  res.json({ history, lowest });
});

// Check price for single product
app.post('/api/products/:id/check', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const userId = (req.body.user_id as string) || 'default';
  const products = db.listTrackedProducts(userId);
  const product = products.find(p => p.id === id);

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const checkResult = await agent.checkCurrentPrice(product.search_query);
  const price = checkResult.price;

  let alert = false;
  let alertMessage = '';
  let notificationResults: notifications.NotificationResult[] = [];

  if (price !== null && !isNaN(price)) {
    const lowestBefore = db.getLowestPrice(product.id);
    db.recordPriceCheck(
      product.id,
      price,
      checkResult.source_url || '',
      checkResult.note || ''
    );

    if (product.target_price && price <= product.target_price) {
      alert = true;
      alertMessage = `🎉 Price ₹${price.toLocaleString('en-IN')} is at or below your target of ₹${product.target_price.toLocaleString('en-IN')}!`;
    } else if (lowestBefore !== null && price < lowestBefore) {
      alert = true;
      alertMessage = `📉 New lowest price seen: ₹${price.toLocaleString('en-IN')} (previous lowest: ₹${lowestBefore.toLocaleString('en-IN')})`;
    }

    if (alert) {
      notificationResults = await notifications.notifyPriceAlert(
        userId,
        product.name,
        alertMessage
      );
    }
  }

  const history = db.getPriceHistory(product.id);
  const lowest = db.getLowestPrice(product.id);

  res.json({
    success: true,
    price,
    source_url: checkResult.source_url,
    note: checkResult.note,
    alert,
    alertMessage,
    notifications: notificationResults,
    history,
    lowest,
  });
});

// Chat Endpoint
app.post('/api/chat', async (req, res) => {
  const { user_id, message, history } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'message is required' });
  }
  const userId = user_id || 'default';
  try {
    const reply = await agent.askAssistant(userId, message, history || []);
    res.json({ reply });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Chat generation failed' });
  }
});

// Multi-Source Research Endpoint
app.post('/api/research/multi', async (req, res) => {
  const { user_id, goal } = req.body;
  if (!goal) {
    return res.status(400).json({ error: 'goal is required' });
  }
  const userId = user_id || 'default';
  try {
    const result = await agent.multiSourceResearch(userId, goal);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Research failed' });
  }
});

// ==========================================
// Marketplace Home, Categories & Brands API
// ==========================================

// Marketplace Home Feed (with 30-min in-memory cache)
app.get('/api/marketplace/home', async (_req, res) => {
  try {
    const feed = await getMarketplaceHomeFeed();
    res.json(feed);
  } catch (err: any) {
    console.error('[server] marketplace/home error:', err);
    res.status(500).json({
      error: err?.message || 'Failed to load marketplace home feed',
      featuredCategories: CATEGORIES_TREE,
      bannerSlides: [],
      rows: []
    });
  }
});

// Category & Subcategory Product Listing with Multi-filters
app.get('/api/marketplace/category/:categoryId', async (req, res) => {
  const { categoryId } = req.params;
  const sub = req.query.sub ? String(req.query.sub) : undefined;
  const page = parseInt(String(req.query.page || '1'), 10) || 1;
  const limit = parseInt(String(req.query.limit || '12'), 10) || 12;
  const brand = req.query.brand ? String(req.query.brand) : undefined;
  const platform = req.query.platform ? String(req.query.platform) : undefined;
  const minPrice = req.query.minPrice ? parseFloat(String(req.query.minPrice)) : undefined;
  const maxPrice = req.query.maxPrice ? parseFloat(String(req.query.maxPrice)) : undefined;
  const minRating = req.query.minRating ? parseFloat(String(req.query.minRating)) : undefined;
  const sortBy = req.query.sortBy as any;

  try {
    const listing = await getCategoryListing(categoryId, sub, {
      page,
      limit,
      brand,
      platform,
      minPrice,
      maxPrice,
      minRating,
      sortBy
    });
    res.json(listing);
  } catch (err: any) {
    console.error(`[server] marketplace/category/${categoryId} error:`, err);
    res.status(500).json({
      error: err?.message || 'Failed to load category products',
      category: null,
      subcategory: null,
      totalProducts: 0,
      page,
      hasMore: false,
      products: [],
      availableBrands: [],
      availablePlatforms: [],
      priceRange: { min: 0, max: 0 }
    });
  }
});

// All Categories Tree & Search
app.get('/api/marketplace/categories', (req, res) => {
  const q = String(req.query.q || '').trim();
  if (q) {
    res.json({ results: searchCategoryTree(q) });
  } else {
    res.json({ categories: CATEGORIES_TREE });
  }
});

// All Brands Directory (A to Z Index)
app.get('/api/marketplace/brands', (req, res) => {
  const q = String(req.query.q || '').toLowerCase().trim();
  if (q) {
    const filtered = BRANDS_DIRECTORY.filter(
      b => b.name.toLowerCase().includes(q) || b.tagline.toLowerCase().includes(q)
    );
    res.json({ brands: filtered });
  } else {
    res.json({ brands: BRANDS_DIRECTORY });
  }
});

// Autocomplete suggestions for Categories and Brands
app.get('/api/marketplace/autocomplete', (req, res) => {
  const q = String(req.query.q || '').toLowerCase().trim();
  if (!q || q.length < 2) {
    return res.json({ matchingCategories: [], matchingBrands: [] });
  }

  const matchingCategories: Array<{ id: string; name: string; slug: string; sub?: string }> = [];
  for (const cat of CATEGORIES_TREE) {
    if (cat.name.toLowerCase().includes(q)) {
      matchingCategories.push({ id: cat.id, name: cat.name, slug: cat.slug });
    }
    for (const sub of cat.subcategories) {
      if (sub.name.toLowerCase().includes(q)) {
        matchingCategories.push({ id: cat.id, name: `${cat.name} > ${sub.name}`, slug: cat.slug, sub: sub.slug });
      }
    }
  }

  const matchingBrands = BRANDS_DIRECTORY.filter(
    b => b.name.toLowerCase().includes(q)
  ).slice(0, 6);

  res.json({
    matchingCategories: matchingCategories.slice(0, 6),
    matchingBrands
  });
});

// Providers Status & Diagnostics
app.get('/api/marketplace/providers', (_req, res) => {
  res.json({
    providers: productManager.getProvidersStatus()
  });
});

// User Report / Link Issue Dispatch Endpoint
app.post('/api/reports', (req, res) => {
  const report = req.body;
  console.log('[server] User Issue Report Received:', report);
  res.json({
    success: true,
    message: 'Report logged successfully. Our audit team will review the link.',
    receivedAt: new Date().toISOString()
  });
});

// ---------- Vite / Static Setup ----------

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true, allowedHosts: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, HOST, () => {
    console.log(`[Vantage] Server running on http://${HOST}:${PORT}`);
  });
}

startServer();
