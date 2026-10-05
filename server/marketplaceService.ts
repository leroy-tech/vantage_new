import { productManager } from './providers/ProductManager';
import { GroundedProduct } from './multiPlatformSearch';
import { CATEGORIES_TREE, BRANDS_DIRECTORY, getCategoryById, getSubcategoryById } from './categoryTree';

interface MarketplaceRow {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  categorySlug?: string;
  query: string;
  products: GroundedProduct[];
}

interface HomeFeedResponse {
  timestamp: string;
  cachedForMinutes: number;
  featuredCategories: typeof CATEGORIES_TREE;
  bannerSlides: Array<{
    id: string;
    tag: string;
    title: string;
    subtitle: string;
    actionText: string;
    query: string;
    bgGradient: string;
    imageUrl?: string;
  }>;
  rows: MarketplaceRow[];
}

let cachedHomeFeed: { data: HomeFeedResponse; expiresAt: number } | null = null;
const CACHE_30_MIN_MS = 30 * 60 * 1000;

export async function getMarketplaceHomeFeed(): Promise<HomeFeedResponse> {
  const now = Date.now();
  if (cachedHomeFeed && cachedHomeFeed.expiresAt > now) {
    return cachedHomeFeed.data;
  }

  const ROW_CONFIGS = [
    {
      id: 'trending-now',
      title: '⚡ Trending Now Across India',
      subtitle: 'Verified fast-selling smartphones, ANC audio & tech deals across Amazon & Flipkart',
      badge: 'Live Radar',
      query: 'trending tech electronics gadgets India deals',
    },
    {
      id: 'top-deals',
      title: '🏷️ Top Deals & Steep Price Drops',
      subtitle: 'Lowest verified prices in Indian Rupees (₹) with real MRP discount verification',
      badge: 'Price Drop',
      query: 'best price drop deals headphones smartwatch electronics India',
    },
    {
      id: 'phones-under-20k',
      title: '📱 Best 5G Phones Under ₹20,000',
      subtitle: "India's highest volume price segment — verified Sony IMX sensors, AMOLED displays & fast charging",
      badge: 'Best Under ₹20k',
      categorySlug: 'electronics',
      query: 'best 5g smartphone under 20000 India',
    },
    {
      id: 'fashion-picks',
      title: '👟 Fashion & Lifestyle Verified Picks',
      subtitle: 'Pure cotton apparel, running sneakers, chronograph watches & leather wallets',
      badge: 'Lifestyle Deals',
      categorySlug: 'fashion-men',
      query: 'running sneakers shirts chronograph watch India',
    },
    {
      id: 'home-kitchen',
      title: '🍳 Home & Kitchen Essentials',
      subtitle: 'Digital air fryers, ergonomic work chairs, robotic vacuums & mixer grinders',
      badge: 'Smart Home',
      categorySlug: 'appliances',
      query: 'digital air fryer ergonomic office chair mixer grinder India',
    },
  ];

  // Fetch all rows concurrently
  const rowsResults = await Promise.allSettled(
    ROW_CONFIGS.map(async (cfg) => {
      const searchRes = await productManager.search(cfg.query, { limit: 8 });
      return {
        id: cfg.id,
        title: cfg.title,
        subtitle: cfg.subtitle,
        badge: cfg.badge,
        categorySlug: cfg.categorySlug,
        query: cfg.query,
        products: searchRes.products,
      };
    })
  );

  const rows: MarketplaceRow[] = rowsResults.map((res, idx) => {
    if (res.status === 'fulfilled') {
      return res.value;
    }
    const fallbackCfg = ROW_CONFIGS[idx];
    return {
      id: fallbackCfg.id,
      title: fallbackCfg.title,
      subtitle: fallbackCfg.subtitle,
      badge: fallbackCfg.badge,
      categorySlug: fallbackCfg.categorySlug,
      query: fallbackCfg.query,
      products: [],
    };
  });

  const bannerSlides = [
    {
      id: 'banner-1',
      tag: 'INDIA PRICE COMPARISON',
      title: 'The Full View Before You Buy in India',
      subtitle: 'Compare real-time prices across Amazon India, Flipkart, Croma, and Reliance Digital in ₹.',
      actionText: 'Explore Top 5G Phones',
      query: 'best 5g smartphone India',
      bgGradient: 'from-violet-900 via-purple-900 to-[#120726]',
      imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'banner-2',
      tag: 'ANC HEADPHONES & AUDIO',
      title: 'True Wireless & Studio ANC Headphones',
      subtitle: 'Flagship sound from Sony, boAt, JBL, and Bose with verified Indian MRP deals.',
      actionText: 'Browse Audio Deals',
      query: 'best wireless anc headphones India',
      bgGradient: 'from-blue-900 via-indigo-900 to-[#120726]',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'banner-3',
      tag: 'HOME & WORKSPACES',
      title: 'Ergonomic Desks & Digital Air Fryers',
      subtitle: 'High-rated kitchen essentials & ergonomic chairs verified for Indian households.',
      actionText: 'Shop Home Gear',
      query: 'air fryer study table home appliances India',
      bgGradient: 'from-emerald-950 via-teal-900 to-[#120726]',
      imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const response: HomeFeedResponse = {
    timestamp: new Date().toISOString(),
    cachedForMinutes: 30,
    featuredCategories: CATEGORIES_TREE,
    bannerSlides,
    rows,
  };

  cachedHomeFeed = {
    data: response,
    expiresAt: now + CACHE_30_MIN_MS,
  };

  return response;
}

export async function getCategoryListing(
  categoryId: string,
  subcategoryId?: string,
  options: {
    page?: number;
    limit?: number;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    platform?: string;
    sortBy?: 'relevance' | 'price_low' | 'price_high' | 'rating';
  } = {}
) {
  const cat = getCategoryById(categoryId);
  const sub = subcategoryId ? getSubcategoryById(categoryId, subcategoryId) : undefined;

  let query = '';
  if (sub) {
    query = sub.searchQuery;
  } else if (cat) {
    query = cat.searchQuery;
  } else {
    query = categoryId;
  }

  // Combine query with options
  const searchResult = await productManager.search(query, {
    page: options.page || 1,
    limit: options.limit || 12,
    brand: options.brand,
    minPrice: options.minPrice,
    maxPrice: options.maxPrice,
    minRating: options.minRating,
    platform: options.platform,
    sortBy: options.sortBy,
  });

  return {
    category: cat || null,
    subcategory: sub || null,
    query,
    totalProducts: searchResult.totalProducts,
    page: searchResult.page,
    hasMore: searchResult.hasMore,
    products: searchResult.products,
    availableBrands: searchResult.availableBrands,
    availablePlatforms: searchResult.availablePlatforms,
    priceRange: searchResult.priceRange,
    summary: searchResult.summary,
    relatedSubcategories: cat?.subcategories || [],
  };
}
