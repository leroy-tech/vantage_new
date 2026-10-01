import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  ExternalLink,
  Star,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ChevronDown,
  ChevronRight,
  TrendingDown,
  ShoppingBag,
  ShoppingCart,
  X,
  RefreshCw,
  Sun,
  Moon,
  PanelLeftClose,
  PanelLeft,
  History,
  Layers,
  Check,
  Flame,
  Info,
  Tag,
  ArrowRight,
  ShieldCheck,
  Compass,
  Image as ImageIcon,
  Heart,
  HelpCircle,
  ThumbsUp,
  ThumbsDown,
  Scale,
  Trash2,
  Clock,
  Zap,
  Filter
} from 'lucide-react';
import FocusCardsDemo from './focus-cards-demo';
import { handleImageError, VERIFIED_FALLBACK_PLACEHOLDER } from '../utils/image-validator';

export interface PlatformOffer {
  platform: string;
  domain: string;
  price: number | null;
  priceFormatted: string;
  buyUrl: string;
  isVerifiedGrounded: boolean;
  storeBadge?: string;
  inStock?: boolean;
}

export interface ReviewSummary {
  pros: string[];
  cons: string[];
  hasData: boolean;
}

export interface GroundedProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  priceFormatted: string;
  mrpFormatted?: string;
  rating: number;
  ratingCount?: string;
  specs: string[];
  imageUrl: string;
  cheapestOffer: PlatformOffer;
  offers: PlatformOffer[];
  missingPlatforms: string[];
  reviewSummary?: ReviewSummary;
}

export interface SearchSummary {
  overview: string;
  topPick: { name: string; reason: string; priceFormatted: string };
  budgetPick: { name: string; reason: string; priceFormatted: string };
  valuePick: { name: string; reason: string; priceFormatted: string };
}

interface MultiPlatformSearchResult {
  query: string;
  totalProducts: number;
  page: number;
  hasMore: boolean;
  summary: SearchSummary;
  products: GroundedProduct[];
  availableBrands: string[];
  availablePlatforms: string[];
  priceRange: { min: number; max: number };
}

interface VantageShoppingAppProps {
  onOpenProductModal?: (product: any) => void;
}

const POPULAR_SEARCH_SUGGESTIONS = [
  'best phone under 20000',
  'Nike running shoes',
  'boAt earbuds',
  'good laptop for coding under 60k',
  'Sony WH-1000XM5',
  'Philips air fryer',
  'Samsung Galaxy S24 Ultra',
];

interface VagueQueryRefinement {
  isVague: boolean;
  category: string;
  question1: {
    title: string;
    options: string[];
  };
  question2: {
    title: string;
    options: string[];
  };
}

/**
 * Detect vague queries and return 1 to 2 targeted questions for budget & use case
 */
function detectVagueQuery(query: string): VagueQueryRefinement | null {
  const q = query.trim().toLowerCase();
  if (!q) return null;

  // If query already has budget or specific specs, it is not vague
  const hasSpecifics = /\b(\d+k|\d{4,6}|under|above|below|budget|gb|tb|rtx|intel|ryzen|pro|max|ultra|plus|air|oled|5g)\b/i.test(q);
  if (hasSpecifics && q.split(/\s+/).length >= 4) {
    return null;
  }

  if (/\b(laptop|macbook|computer|notebook)\b/i.test(q)) {
    return {
      isVague: true,
      category: 'Laptop',
      question1: {
        title: 'What is your target budget?',
        options: ['Under ₹40,000', '₹40,000 - ₹70,000', 'Above ₹70,000'],
      },
      question2: {
        title: 'What is your primary use case?',
        options: ['Coding & Office Work', 'Gaming & Heavy Graphics', 'College & Daily Study'],
      },
    };
  }

  if (/\b(phone|mobile|smartphone|android|iphone)\b/i.test(q)) {
    return {
      isVague: true,
      category: 'Smartphone',
      question1: {
        title: 'What is your target budget?',
        options: ['Under ₹15,000', '₹15,000 - ₹30,000', 'Flagship (Above ₹50,000)'],
      },
      question2: {
        title: 'What is your top priority?',
        options: ['Best Camera & Portraits', 'Long Battery & 5G Performance', 'Gaming & Smooth Display'],
      },
    };
  }

  if (/\b(earbud|earbuds|headphone|headphones|earphone|earphones|audio|tws)\b/i.test(q)) {
    return {
      isVague: true,
      category: 'Audio',
      question1: {
        title: 'What is your budget?',
        options: ['Under ₹2,000', '₹2,000 - ₹6,000', 'Premium ANC (Above ₹10,000)'],
      },
      question2: {
        title: 'Form factor preference?',
        options: ['TWS Wireless Earbuds', 'Over-Ear ANC Headphones', 'Neckband / Gym Earphones'],
      },
    };
  }

  if (/\b(shoe|shoes|sneaker|sneakers|running)\b/i.test(q)) {
    return {
      isVague: true,
      category: 'Footwear',
      question1: {
        title: 'What is your budget?',
        options: ['Under ₹3,000', '₹3,000 - ₹7,000', 'Pro / Marathon (Above ₹8,000)'],
      },
      question2: {
        title: 'Intended use?',
        options: ['Daily Running & Training', 'Casual Lifestyle Wear', 'Walking & Office Comfort'],
      },
    };
  }

  if (/\b(tv|television|smart tv)\b/i.test(q)) {
    return {
      isVague: true,
      category: 'Television',
      question1: {
        title: 'Screen size preference?',
        options: ['43 Inch 4K', '55 Inch 4K UHD', '65 Inch+ OLED/QLED'],
      },
      question2: {
        title: 'Target budget?',
        options: ['Under ₹25,000', '₹25,000 - ₹50,000', 'Above ₹50,000'],
      },
    };
  }

  if (/\b(watch|smartwatch|fitness band)\b/i.test(q)) {
    return {
      isVague: true,
      category: 'Smartwatch',
      question1: {
        title: 'Target budget?',
        options: ['Under ₹3,000', '₹3,000 - ₹10,000', 'Premium (Apple/Samsung Galaxy)'],
      },
      question2: {
        title: 'Primary focus?',
        options: ['Bluetooth Calling & AMOLED', 'Accurate Sports GPS & Health', '7+ Day Battery Life'],
      },
    };
  }

  return null;
}

export function VantageShoppingApp({ onOpenProductModal }: VantageShoppingAppProps) {
  // Theme & Background States
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('vantage_dark_mode') === 'true';
  });
  const [oceanBg, setOceanBg] = useState<boolean>(() => {
    return localStorage.getItem('vantage_ocean_bg') === 'true';
  });

  // Current view: 'search' | 'wishlist'
  const [activeView, setActiveView] = useState<'search' | 'wishlist'>('search');

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  // Search & Query state
  const [searchQuery, setSearchQuery] = useState<string>('best phone under 20000');
  const [activeQuery, setActiveQuery] = useState<string>('best phone under 20000');
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isInstantCacheLoaded, setIsInstantCacheLoaded] = useState<boolean>(false);

  // Smart follow-up state for vague queries
  const [pendingFollowUp, setPendingFollowUp] = useState<VagueQueryRefinement | null>(null);
  const [selectedAns1, setSelectedAns1] = useState<string>('');
  const [selectedAns2, setSelectedAns2] = useState<string>('');

  // Results & Pagination
  const [searchResult, setSearchResult] = useState<MultiPlatformSearchResult | null>(null);
  const [productsList, setProductsList] = useState<GroundedProduct[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(false);

  // Recent searches (last 5)
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('vantage_recent_searches');
      return stored ? JSON.parse(stored).slice(0, 5) : ['best phone under 20000', 'Sony WH-1000XM5', 'Nike running shoes'];
    } catch {
      return ['best phone under 20000', 'Sony WH-1000XM5'];
    }
  });

  // Wishlist in localStorage
  const [wishlist, setWishlist] = useState<GroundedProduct[]>(() => {
    try {
      const stored = localStorage.getItem('vantage_wishlist');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Save wishlist changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('vantage_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.warn('Failed to save wishlist to localStorage', e);
    }
  }, [wishlist]);

  const toggleWishlist = (product: GroundedProduct) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.name === product.name || p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.name !== product.name && p.id !== product.id);
      } else {
        return [product, ...prev];
      }
    });
  };

  const isProductWishlisted = (product: GroundedProduct) => {
    return wishlist.some((p) => p.name === product.name || p.id === product.id);
  };

  // Filters & Sorting state
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [priceFilter, setPriceFilter] = useState<'all' | 'under-5k' | '5k-20k' | '20k-50k' | 'above-50k'>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'relevance' | 'price-asc' | 'price-desc' | 'rating-desc'>('relevance');

  // Compare up to 3 products
  const [compareItems, setCompareItems] = useState<GroundedProduct[]>([]);
  const [compareDrawerOpen, setCompareDrawerOpen] = useState<boolean>(false);

  // Focus Cards Showcase tab
  const [showFocusCards, setShowFocusCards] = useState<boolean>(false);

  // Sync theme to root DOM
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('vantage_dark_mode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('vantage_dark_mode', 'false');
    }
  }, [darkMode]);

  // Sync ocean background
  useEffect(() => {
    localStorage.setItem('vantage_ocean_bg', oceanBg ? 'true' : 'false');
  }, [oceanBg]);

  // Save recent searches
  const addRecentSearch = (queryStr: string) => {
    const trimmed = queryStr.trim();
    if (!trimmed) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...filtered].slice(0, 5);
      try {
        localStorage.setItem('vantage_recent_searches', JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to save recent searches', e);
      }
      return updated;
    });
  };

  // Search Cache helpers
  const getSearchCache = (queryStr: string): MultiPlatformSearchResult | null => {
    try {
      const cacheRaw = localStorage.getItem('vantage_search_cache_v2');
      if (!cacheRaw) return null;
      const cache = JSON.parse(cacheRaw);
      const normalized = queryStr.trim().toLowerCase();
      const entry = cache[normalized];
      if (entry && entry.data) {
        return entry.data as MultiPlatformSearchResult;
      }
    } catch {
      // cache read fallback
    }
    return null;
  };

  const saveSearchCache = (queryStr: string, data: MultiPlatformSearchResult) => {
    try {
      const normalized = queryStr.trim().toLowerCase();
      const cacheRaw = localStorage.getItem('vantage_search_cache_v2');
      const cache = cacheRaw ? JSON.parse(cacheRaw) : {};
      cache[normalized] = {
        timestamp: Date.now(),
        data,
      };
      // Keep cache size bounded to last 20 queries to conserve localStorage
      const keys = Object.keys(cache);
      if (keys.length > 20) {
        delete cache[keys[0]];
      }
      localStorage.setItem('vantage_search_cache_v2', JSON.stringify(cache));
    } catch (e) {
      console.warn('Failed to save search cache to localStorage', e);
    }
  };

  // Perform search across Indian platforms with instant cache + background revalidation
  const executeSearch = async (queryText: string, pageNum: number = 1, append: boolean = false) => {
    const q = queryText.trim() || 'best phone under 20000';

    if (!append) {
      setActiveQuery(q);
      addRecentSearch(q);
      setActiveView('search');

      // Check cache first for instant loading
      const cached = getSearchCache(q);
      if (cached && pageNum === 1) {
        setSearchResult(cached);
        setProductsList(cached.products);
        setCurrentPage(cached.page);
        setHasMore(cached.hasMore);
        setIsInstantCacheLoaded(true);
        setError(null);
      } else {
        setLoading(true);
        setIsInstantCacheLoaded(false);
      }
      setError(null);
    } else {
      setLoadingMore(true);
    }

    try {
      const res = await fetch(`/api/search/vantage?q=${encodeURIComponent(q)}&page=${pageNum}&limit=12`);
      if (!res.ok) {
        throw new Error(`Search failed: HTTP ${res.status}`);
      }
      const data: MultiPlatformSearchResult = await res.json();
      setSearchResult(data);
      setCurrentPage(data.page);
      setHasMore(data.hasMore);
      setIsInstantCacheLoaded(false);

      if (append) {
        setProductsList((prev) => [...prev, ...data.products]);
      } else {
        setProductsList(data.products);
        // Cache the result for instant recall
        saveSearchCache(q, data);
      }
    } catch (err: any) {
      // If we already had cached data, keep it and do not block user
      if (!append && productsList.length === 0) {
        setError(err?.message || 'Failed to search across platforms. Please check your connection.');
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Initial search on mount
  useEffect(() => {
    executeSearch('best phone under 20000', 1, false);
  }, []);

  // Handle Search Input submit with smart follow-up detection
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    // Check if query is vague and needs follow-up refinement
    const vagueCheck = detectVagueQuery(query);
    if (vagueCheck) {
      setPendingFollowUp(vagueCheck);
      setSelectedAns1('');
      setSelectedAns2('');
      return;
    }

    // Direct search if specific enough
    setPendingFollowUp(null);
    executeSearch(query, 1, false);
  };

  // Apply smart follow-up answers to refine search
  const handleApplyFollowUp = () => {
    if (!pendingFollowUp) return;
    const parts = [searchQuery.trim()];
    if (selectedAns1) parts.push(selectedAns1);
    if (selectedAns2) parts.push(selectedAns2);
    const refined = parts.join(' ');
    setSearchQuery(refined);
    setPendingFollowUp(null);
    executeSearch(refined, 1, false);
  };

  const handleSkipFollowUp = () => {
    const q = searchQuery.trim();
    setPendingFollowUp(null);
    executeSearch(q, 1, false);
  };

  // Filtered & Sorted products
  const displayProducts = useMemo(() => {
    const listToFilter = activeView === 'wishlist' ? wishlist : productsList;
    let result = [...listToFilter];

    // Filter by Brand
    if (selectedBrand !== 'all') {
      result = result.filter((p) => p.brand.toLowerCase() === selectedBrand.toLowerCase());
    }

    // Filter by Platform
    if (selectedPlatform !== 'all') {
      result = result.filter((p) => p.offers.some((o) => o.platform.toLowerCase() === selectedPlatform.toLowerCase()));
    }

    // Filter by Price range
    if (priceFilter === 'under-5k') {
      result = result.filter((p) => p.price > 0 && p.price < 5000);
    } else if (priceFilter === '5k-20k') {
      result = result.filter((p) => p.price >= 5000 && p.price <= 20000);
    } else if (priceFilter === '20k-50k') {
      result = result.filter((p) => p.price >= 20000 && p.price <= 50000);
    } else if (priceFilter === 'above-50k') {
      result = result.filter((p) => p.price > 50000);
    }

    // Filter by Rating
    if (minRating > 0) {
      result = result.filter((p) => p.rating >= minRating);
    }

    // Sort
    if (sortBy === 'price-asc') {
      result.sort((a, b) => (a.price || Infinity) - (b.price || Infinity));
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === 'rating-desc') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [productsList, wishlist, activeView, selectedBrand, selectedPlatform, priceFilter, minRating, sortBy]);

  // Comparison toggle
  const toggleCompare = (product: GroundedProduct) => {
    if (compareItems.some((item) => item.id === product.id || item.name === product.name)) {
      setCompareItems((prev) => prev.filter((item) => item.id !== product.id && item.name !== product.name));
    } else {
      if (compareItems.length >= 3) {
        alert('You can compare up to 3 products at a time.');
        return;
      }
      setCompareItems((prev) => [...prev, product]);
      setCompareDrawerOpen(true);
    }
  };

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      executeSearch(activeQuery, currentPage + 1, true);
    }
  };

  // Compute best values for comparison table
  const compareAnalytics = useMemo(() => {
    if (compareItems.length === 0) return { bestRatingId: null, bestPriceId: null };
    let highestRating = -1;
    let bestRatingId: string | null = null;
    let lowestPrice = Infinity;
    let bestPriceId: string | null = null;

    for (const item of compareItems) {
      if (item.rating > highestRating) {
        highestRating = item.rating;
        bestRatingId = item.id;
      }
      if (item.price > 0 && item.price < lowestPrice) {
        lowestPrice = item.price;
        bestPriceId = item.id;
      }
    }

    return { bestRatingId, bestPriceId };
  }, [compareItems]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${oceanBg ? 'ocean-vantage-bg' : 'aesthetic-bg'} text-[#2E1065] dark:text-[#E9EDF5]`}>
      {/* Sticky Top Header */}
      <header className="sticky top-0 z-40 glass-panel border-b border-violet-200/50 dark:border-white/10 px-4 py-3 shadow-sm backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Logo & Sidebar Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen((prev) => !prev)}
              className="p-2 rounded-xl border border-violet-200 dark:border-white/15 bg-white/70 dark:bg-white/5 hover:bg-violet-50 dark:hover:bg-white/10 transition-all text-[#7C3AED] dark:text-violet-300 shadow-xs"
              title={sidebarOpen ? 'Close assistant filters' : 'Open assistant filters'}
            >
              {sidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeft className="w-5 h-5" />}
            </button>

            <div
              className="flex items-center gap-2.5 cursor-pointer group"
              onClick={() => {
                setActiveView('search');
                executeSearch('top tech deals in India');
              }}
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#7C3AED] to-[#A78BFA] flex items-center justify-center text-white font-black shadow-md shadow-violet-500/25 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-heading font-black text-lg sm:text-xl tracking-tight bg-gradient-to-r from-[#2E1065] via-[#7C3AED] to-[#6D28D9] dark:from-white dark:via-violet-200 dark:to-violet-400 bg-clip-text text-transparent">
                    Vantage AI
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-100 text-[#7C3AED] dark:bg-violet-900/60 dark:text-violet-300 border border-violet-300/40">
                    India (₹)
                  </span>
                </div>
                <div className="text-[10px] text-[#7C6898] dark:text-gray-400 hidden sm:block">
                  Verified Multi-Platform Shopping Search
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Search Bar */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl mx-2 hidden md:block">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products (e.g. 'best phone under 20000', 'Nike running shoes', 'boAt earbuds')..."
                className="w-full pl-10 pr-24 py-2 text-sm rounded-xl border border-violet-200 dark:border-white/15 bg-white/80 dark:bg-black/40 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] dark:text-white placeholder:text-gray-400 transition-all shadow-xs"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-1.5 top-1 px-3.5 py-1.5 rounded-lg text-xs font-bold primary-action disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Search'}
              </button>
            </div>
          </form>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2">
            {/* Wishlist Toggle Button with Count Badge */}
            <button
              onClick={() => setActiveView((prev) => (prev === 'wishlist' ? 'search' : 'wishlist'))}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 shadow-xs ${
                activeView === 'wishlist'
                  ? 'bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-500/25'
                  : 'border-violet-200 dark:border-white/15 bg-white/70 dark:bg-white/5 text-[#7C3AED] dark:text-violet-300 hover:bg-violet-50'
              }`}
              title="View Wishlist"
            >
              <Heart className={`w-3.5 h-3.5 ${activeView === 'wishlist' ? 'fill-white' : 'fill-rose-500 text-rose-500'}`} />
              <span className="hidden sm:inline">Wishlist</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${activeView === 'wishlist' ? 'bg-white text-rose-600' : 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-300'}`}>
                {wishlist.length}
              </span>
            </button>

            {/* Compare items quick trigger */}
            {compareItems.length > 0 && (
              <button
                onClick={() => setCompareDrawerOpen(true)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-violet-100 dark:bg-violet-950 text-[#7C3AED] dark:text-violet-300 border border-violet-300 dark:border-violet-700 flex items-center gap-1.5 shadow-sm hover:scale-105 transition-all"
              >
                <Layers className="w-3.5 h-3.5 text-[#7C3AED]" />
                <span>Compare</span>
                <span className="w-4 h-4 rounded-full bg-[#7C3AED] text-white text-[10px] flex items-center justify-center font-bold">
                  {compareItems.length}
                </span>
              </button>
            )}

            {/* Focus Cards Demo Showcase View Toggle */}
            <button
              onClick={() => setShowFocusCards((prev) => !prev)}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                showFocusCards
                  ? 'bg-violet-600 text-white border-violet-600 shadow-md shadow-violet-500/20'
                  : 'border-violet-200 dark:border-white/15 bg-white/70 dark:bg-white/5 text-[#7C3AED] dark:text-violet-300 hover:bg-violet-50'
              }`}
              title="Toggle Focus Cards Demo"
            >
              <ImageIcon className="w-4 h-4" />
              <span className="hidden lg:inline">{showFocusCards ? 'Close Showcase' : 'Focus Cards'}</span>
            </button>

            {/* Ocean (Sala behta hi jayega) background toggle */}
            <button
              onClick={() => setOceanBg((prev) => !prev)}
              className={`p-2 rounded-xl border transition-all ${
                oceanBg
                  ? 'bg-cyan-500 text-white border-cyan-500 shadow-sm'
                  : 'border-violet-200 dark:border-white/15 bg-white/70 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-violet-50'
              }`}
              title={oceanBg ? 'Switch to Pure Aesthetic White canvas' : 'Switch to Ocean (Sala behta hi jayega) background'}
            >
              <Compass className="w-4 h-4" />
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode((prev) => !prev)}
              className="p-2 rounded-xl border border-violet-200 dark:border-white/15 bg-white/70 dark:bg-white/5 text-[#7C3AED] dark:text-violet-300 hover:bg-violet-50 dark:hover:bg-white/10 transition-all shadow-xs"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-[#7C3AED]" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <form onSubmit={handleSearchSubmit} className="mt-2.5 block md:hidden">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products in India (₹)..."
              className="w-full pl-9 pr-20 py-2 text-sm rounded-xl border border-violet-200 dark:border-white/15 bg-white/80 dark:bg-black/40 text-black dark:text-white placeholder:text-gray-400"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-1 top-1 px-3 py-1.5 rounded-lg text-xs font-bold primary-action"
            >
              {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Search'}
            </button>
          </div>
        </form>
      </header>

      {/* Main Container with Smooth Sidebar Transition */}
      <div className="flex max-w-7xl mx-auto w-full transition-all duration-300 ease-in-out relative">
        {/* Collapsible Sidebar */}
        <aside
          className={`shrink-0 overflow-y-auto z-30 transition-all duration-300 ease-in-out border-r border-violet-200/50 dark:border-white/10 glass-panel ${
            sidebarOpen
              ? 'w-72 p-4 opacity-100 translate-x-0'
              : 'w-0 p-0 opacity-0 -translate-x-full pointer-events-none'
          }`}
          style={{ height: 'calc(100vh - 65px)', position: 'sticky', top: '65px' }}
        >
          {sidebarOpen && (
            <div className="space-y-6">
              {/* Close sidebar helper for small screens */}
              <div className="flex items-center justify-between pb-2 border-b border-violet-100 dark:border-white/10">
                <span className="text-xs font-bold uppercase tracking-wider text-[#7C3AED] dark:text-violet-400">
                  Assistant Filters
                </span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* View Switcher: Search vs Wishlist */}
              <div className="p-1 rounded-xl bg-violet-100/70 dark:bg-white/5 border border-violet-200/60 dark:border-white/10 flex items-center gap-1">
                <button
                  onClick={() => setActiveView('search')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    activeView === 'search'
                      ? 'bg-[#7C3AED] text-white shadow-xs'
                      : 'text-gray-600 dark:text-gray-400 hover:text-[#7C3AED]'
                  }`}
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Search</span>
                </button>
                <button
                  onClick={() => setActiveView('wishlist')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    activeView === 'wishlist'
                      ? 'bg-rose-500 text-white shadow-xs'
                      : 'text-gray-600 dark:text-gray-400 hover:text-rose-500'
                  }`}
                >
                  <Heart className="w-3.5 h-3.5" />
                  <span>Wishlist ({wishlist.length})</span>
                </button>
              </div>

              {/* Recent Searches (Last 5) with Instant Cache Recall */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-gray-700 dark:text-gray-300 mb-2.5">
                  <div className="flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5 text-[#7C3AED]" />
                    <span>Recent Searches</span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono">Instant Cache</span>
                </div>
                <div className="space-y-1.5">
                  {recentSearches.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSearchQuery(item);
                        executeSearch(item, 1, false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-violet-100/70 dark:hover:bg-white/10 hover:text-[#7C3AED] dark:hover:text-violet-300 transition-colors flex items-center justify-between group truncate"
                    >
                      <span className="truncate">{item}</span>
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#7C3AED]" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Trending Queries in India */}
              <div>
                <div className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  <span>Trending Queries in India</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_SEARCH_SUGGESTIONS.map((sug, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSearchQuery(sug);
                        executeSearch(sug, 1, false);
                      }}
                      className="text-[11px] px-2 py-1 rounded-lg border border-violet-200 dark:border-white/10 bg-white/60 dark:bg-white/5 hover:border-[#7C3AED] hover:text-[#7C3AED] dark:hover:text-violet-300 transition-all text-left"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filter: Platforms */}
              <div>
                <div className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                  <ShoppingBag className="w-3.5 h-3.5 text-[#7C3AED]" />
                  <span>Shopping Platforms</span>
                </div>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedPlatform('all')}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      selectedPlatform === 'all'
                        ? 'bg-[#7C3AED] text-white font-bold'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-violet-100/60 dark:hover:bg-white/5'
                    }`}
                  >
                    All Covered Platforms (10+)
                  </button>
                  {['Amazon India', 'Flipkart', 'Croma', 'Reliance Digital', 'Tata CLiQ', 'Myntra', 'Ajio', 'Vijay Sales'].map((plat) => (
                    <button
                      key={plat}
                      onClick={() => setSelectedPlatform(plat)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                        selectedPlatform.toLowerCase() === plat.toLowerCase()
                          ? 'bg-violet-100 dark:bg-violet-900/50 text-[#7C3AED] dark:text-violet-300 font-bold'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-violet-100/60 dark:hover:bg-white/5'
                      }`}
                    >
                      <span>{plat}</span>
                      {selectedPlatform.toLowerCase() === plat.toLowerCase() && <Check className="w-3 h-3 text-[#7C3AED]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filter: Price Range */}
              <div>
                <div className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Budget Range</span>
                </div>
                <div className="space-y-1">
                  {[
                    { id: 'all', label: 'All Budgets' },
                    { id: 'under-5k', label: 'Under ₹5,000' },
                    { id: '5k-20k', label: '₹5,000 - ₹20,000' },
                    { id: '20k-50k', label: '₹20,000 - ₹50,000' },
                    { id: 'above-50k', label: 'Above ₹50,000' },
                  ].map((budget) => (
                    <button
                      key={budget.id}
                      onClick={() => setPriceFilter(budget.id as any)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        priceFilter === budget.id
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-800'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-violet-100/60 dark:hover:bg-white/5'
                      }`}
                    >
                      {budget.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filter: Ratings */}
              <div>
                <div className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>Minimum Rating</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  {[0, 4.0, 4.5].map((rt) => (
                    <button
                      key={rt}
                      onClick={() => setMinRating(rt)}
                      className={`py-1.5 rounded-lg text-xs font-bold border transition-all ${
                        minRating === rt
                          ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                          : 'border-violet-200 dark:border-white/10 bg-white/40 dark:bg-white/5 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {rt === 0 ? 'Any' : `${rt}★+`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* Dynamic Main Content Area - Expands or contracts without overlap */}
        <main className="flex-1 p-4 sm:p-6 overflow-hidden min-w-0">
          {/* Smart Follow-up Refinement Card (Shown when query is vague) */}
          {pendingFollowUp && (
            <div className="mb-6 p-5 sm:p-6 rounded-3xl glass-panel-violet border border-violet-300 dark:border-violet-700/60 shadow-xl animate-in fade-in slide-in-from-top-3 duration-300">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#7C3AED] text-white flex items-center justify-center font-bold shadow-sm">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-heading font-black text-sm text-[#2E1065] dark:text-white">
                      Smart Assistant Refinement: {pendingFollowUp.category}
                    </h3>
                    <p className="text-[11px] text-[#7C6898] dark:text-gray-400">
                      Vantage AI can pinpoint the exact best Indian store deals with 2 quick answers:
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleSkipFollowUp}
                  className="text-xs text-gray-500 hover:text-gray-800 dark:hover:text-white underline"
                >
                  Skip & search directly
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-3">
                {/* Question 1: Budget */}
                <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-white/5 border border-violet-200/70 dark:border-white/10">
                  <div className="text-xs font-bold text-[#7C3AED] dark:text-violet-300 mb-2">
                    1. {pendingFollowUp.question1.title}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {pendingFollowUp.question1.options.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setSelectedAns1(opt === selectedAns1 ? '' : opt)}
                        className={`text-xs px-2.5 py-1.5 rounded-xl border transition-all ${
                          selectedAns1 === opt
                            ? 'bg-[#7C3AED] text-white border-[#7C3AED] font-bold shadow-xs'
                            : 'border-violet-200 dark:border-white/15 bg-white dark:bg-black/30 hover:border-violet-400'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Question 2: Priority / Use Case */}
                <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-white/5 border border-violet-200/70 dark:border-white/10">
                  <div className="text-xs font-bold text-[#7C3AED] dark:text-violet-300 mb-2">
                    2. {pendingFollowUp.question2.title}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {pendingFollowUp.question2.options.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setSelectedAns2(opt === selectedAns2 ? '' : opt)}
                        className={`text-xs px-2.5 py-1.5 rounded-xl border transition-all ${
                          selectedAns2 === opt
                            ? 'bg-[#7C3AED] text-white border-[#7C3AED] font-bold shadow-xs'
                            : 'border-violet-200 dark:border-white/15 bg-white dark:bg-black/30 hover:border-violet-400'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-2 border-t border-violet-100 dark:border-white/10">
                <span className="text-[11px] text-gray-500">
                  Selected: {selectedAns1 || 'Any budget'} · {selectedAns2 || 'Any use'}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSkipFollowUp}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-violet-50"
                  >
                    Search without refining
                  </button>
                  <button
                    onClick={handleApplyFollowUp}
                    className="px-4 py-1.5 rounded-xl text-xs font-bold primary-action flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Search With Refinements</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Optional Focus Cards Showcase Section */}
          {showFocusCards && (
            <div className="mb-8 p-6 rounded-3xl glass-panel-white border border-violet-200 dark:border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-heading font-black text-[#2E1065] dark:text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#7C3AED]" />
                    Interactive Focus Cards Showcase
                  </h2>
                  <p className="text-xs text-[#7C6898] dark:text-gray-400">
                    Demonstrating smooth focus-hover card states and the ocean background inspiration.
                  </p>
                </div>
                <button
                  onClick={() => setShowFocusCards(false)}
                  className="p-1.5 rounded-xl border border-violet-200 dark:border-white/10 hover:bg-violet-50 text-gray-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <FocusCardsDemo />
            </div>
          )}

          {/* View: Wishlist Page Header */}
          {activeView === 'wishlist' && (
            <div className="mb-6 p-5 sm:p-6 rounded-3xl glass-panel-white border border-rose-200/70 dark:border-rose-900/40 shadow-lg">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center font-bold shadow-md shadow-rose-500/25">
                    <Heart className="w-5 h-5 fill-white" />
                  </div>
                  <div>
                    <h2 className="font-heading font-black text-lg text-[#2E1065] dark:text-white flex items-center gap-2">
                      <span>Saved Products Wishlist</span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                        {wishlist.length} item{wishlist.length === 1 ? '' : 's'}
                      </span>
                    </h2>
                    <p className="text-xs text-[#7C6898] dark:text-gray-400">
                      Saved in your browser localStorage. Monitor live prices and compare deals anytime.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {wishlist.length > 0 && (
                    <button
                      onClick={() => {
                        if (confirm('Clear all items from your wishlist?')) {
                          setWishlist([]);
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear All</span>
                    </button>
                  )}
                  <button
                    onClick={() => setActiveView('search')}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold border border-violet-200 dark:border-white/10 hover:bg-violet-50 text-[#7C3AED]"
                  >
                    Back to Search
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* AI Picks: Top Pick, Best Budget, Best Value (Search Mode Only) */}
          {activeView === 'search' && searchResult?.summary && (
            <div className="mb-6 p-5 sm:p-6 rounded-3xl glass-panel-white border border-violet-200 dark:border-white/10 shadow-lg">
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#7C3AED] text-white flex items-center justify-center font-bold">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-heading font-black text-[#2E1065] dark:text-white flex items-center gap-2">
                      <span>Vantage AI Grounded Market Synthesis</span>
                      {isInstantCacheLoaded && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300/40 flex items-center gap-1">
                          <Zap className="w-2.5 h-2.5" /> Instant Cache
                        </span>
                      )}
                    </h2>
                    <p className="text-[11px] text-[#7C6898] dark:text-gray-400">
                      Query: "{activeQuery}" · Live pricing checked in Indian Rupees (₹)
                    </p>
                  </div>
                </div>
                <span className="verified-pill text-[10px]">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified Results Only
                </span>
              </div>

              <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                {searchResult.summary.overview}
              </p>

              {/* 3 AI Picks Cards: Top Pick, Best Budget, Best Value */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* 1. Top Pick */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-violet-500/10 to-violet-600/5 dark:from-violet-950/40 dark:to-transparent border border-violet-300/40 dark:border-violet-700/50 transform transition-all duration-300 ease-out hover:scale-[1.02] hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-500/10">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-extrabold text-[#7C3AED] dark:text-violet-300 uppercase tracking-wide text-[10px] flex items-center gap-1">
                      <span>🏆</span> #1 Overall Top Pick
                    </span>
                    <span className="font-mono font-bold text-[#2E1065] dark:text-white">
                      {searchResult.summary.topPick.priceFormatted}
                    </span>
                  </div>
                  <div className="font-bold text-xs text-gray-900 dark:text-white truncate">
                    {searchResult.summary.topPick.name}
                  </div>
                  <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                    {searchResult.summary.topPick.reason}
                  </p>
                </div>

                {/* 2. Best Budget Pick */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 dark:from-emerald-950/40 dark:to-transparent border border-emerald-300/40 dark:border-emerald-700/50 transform transition-all duration-300 ease-out hover:scale-[1.02] hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/10">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-extrabold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide text-[10px] flex items-center gap-1">
                      <span>💰</span> Best Budget Pick
                    </span>
                    <span className="font-mono font-bold text-[#2E1065] dark:text-white">
                      {searchResult.summary.budgetPick.priceFormatted}
                    </span>
                  </div>
                  <div className="font-bold text-xs text-gray-900 dark:text-white truncate">
                    {searchResult.summary.budgetPick.name}
                  </div>
                  <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                    {searchResult.summary.budgetPick.reason}
                  </p>
                </div>

                {/* 3. Best Value Pick */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 dark:from-cyan-950/40 dark:to-transparent border border-cyan-300/40 dark:border-cyan-700/50 transform transition-all duration-300 ease-out hover:scale-[1.02] hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/10">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-extrabold text-cyan-700 dark:text-cyan-400 uppercase tracking-wide text-[10px] flex items-center gap-1">
                      <span>⚖️</span> Best Value Pick
                    </span>
                    <span className="font-mono font-bold text-[#2E1065] dark:text-white">
                      {searchResult.summary.valuePick.priceFormatted}
                    </span>
                  </div>
                  <div className="font-bold text-xs text-gray-900 dark:text-white truncate">
                    {searchResult.summary.valuePick.name}
                  </div>
                  <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                    {searchResult.summary.valuePick.reason}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Mandatory Shopping Notice */}
          <div className="mb-5 px-4 py-2.5 rounded-2xl border border-amber-300/40 dark:border-amber-700/40 bg-amber-50/80 dark:bg-amber-950/30 flex items-center gap-2 text-xs text-amber-900 dark:text-amber-200">
            <Info className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Notice:</strong> Prices and availability may change. Check the store before buying. Only verified grounded links from trusted domains are displayed.
            </span>
          </div>

          {/* Filter Chips Bar (Price, Brand, Platform, Rating, Sort) */}
          <div className="space-y-2.5 mb-6 p-4 rounded-3xl glass-panel border border-violet-100 dark:border-white/10 shadow-sm">
            {/* Top row: Results Count & Sort Dropdown */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-violet-100 dark:border-white/10">
              <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                <SlidersHorizontal className="w-4 h-4 text-[#7C3AED]" />
                <span>
                  Showing <strong>{displayProducts.length}</strong> {activeView === 'wishlist' ? 'wishlisted' : 'matching'} product{displayProducts.length === 1 ? '' : 's'}
                </span>
                {(selectedBrand !== 'all' || selectedPlatform !== 'all' || priceFilter !== 'all' || minRating > 0) && (
                  <button
                    onClick={() => {
                      setSelectedBrand('all');
                      setSelectedPlatform('all');
                      setPriceFilter('all');
                      setMinRating(0);
                    }}
                    className="text-[11px] text-rose-600 hover:underline font-bold ml-2"
                  >
                    Reset Filters
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-1.5 rounded-xl border border-violet-200 dark:border-white/15 text-xs bg-white dark:bg-black/50 text-[#2E1065] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
                >
                  <option value="relevance">Best Match</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating-desc">Highest Rated</option>
                </select>
              </div>
            </div>

            {/* Interactive Filter Chips Row */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
              <span className="text-gray-400 text-[11px] font-semibold uppercase tracking-wider shrink-0 mr-1">
                Filter Chips:
              </span>

              {/* Price Chips */}
              <button
                onClick={() => setPriceFilter('all')}
                className={`px-3 py-1 rounded-xl text-xs font-semibold shrink-0 transition-all border ${
                  priceFilter === 'all'
                    ? 'bg-[#7C3AED] text-white border-[#7C3AED] shadow-xs'
                    : 'border-violet-200 dark:border-white/15 bg-white/70 dark:bg-white/5 text-gray-700 dark:text-gray-300'
                }`}
              >
                All Prices
              </button>
              <button
                onClick={() => setPriceFilter(priceFilter === 'under-5k' ? 'all' : 'under-5k')}
                className={`px-3 py-1 rounded-xl text-xs font-semibold shrink-0 transition-all border ${
                  priceFilter === 'under-5k'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'border-violet-200 dark:border-white/15 bg-white/70 dark:bg-white/5 text-gray-700 dark:text-gray-300'
                }`}
              >
                Under ₹5,000
              </button>
              <button
                onClick={() => setPriceFilter(priceFilter === '5k-20k' ? 'all' : '5k-20k')}
                className={`px-3 py-1 rounded-xl text-xs font-semibold shrink-0 transition-all border ${
                  priceFilter === '5k-20k'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'border-violet-200 dark:border-white/15 bg-white/70 dark:bg-white/5 text-gray-700 dark:text-gray-300'
                }`}
              >
                ₹5k - ₹20k
              </button>
              <button
                onClick={() => setPriceFilter(priceFilter === '20k-50k' ? 'all' : '20k-50k')}
                className={`px-3 py-1 rounded-xl text-xs font-semibold shrink-0 transition-all border ${
                  priceFilter === '20k-50k'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'border-violet-200 dark:border-white/15 bg-white/70 dark:bg-white/5 text-gray-700 dark:text-gray-300'
                }`}
              >
                ₹20k - ₹50k
              </button>
              <button
                onClick={() => setPriceFilter(priceFilter === 'above-50k' ? 'all' : 'above-50k')}
                className={`px-3 py-1 rounded-xl text-xs font-semibold shrink-0 transition-all border ${
                  priceFilter === 'above-50k'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'border-violet-200 dark:border-white/15 bg-white/70 dark:bg-white/5 text-gray-700 dark:text-gray-300'
                }`}
              >
                Above ₹50k
              </button>

              <div className="h-4 w-px bg-violet-200 dark:bg-white/15 shrink-0 mx-1" />

              {/* Rating Chips */}
              <button
                onClick={() => setMinRating(minRating === 4.0 ? 0 : 4.0)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold shrink-0 transition-all border flex items-center gap-1 ${
                  minRating === 4.0
                    ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                    : 'border-violet-200 dark:border-white/15 bg-white/70 dark:bg-white/5 text-gray-700 dark:text-gray-300'
                }`}
              >
                <Star className="w-3 h-3 fill-current" />
                <span>4.0★+</span>
              </button>
              <button
                onClick={() => setMinRating(minRating === 4.5 ? 0 : 4.5)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold shrink-0 transition-all border flex items-center gap-1 ${
                  minRating === 4.5
                    ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                    : 'border-violet-200 dark:border-white/15 bg-white/70 dark:bg-white/5 text-gray-700 dark:text-gray-300'
                }`}
              >
                <Star className="w-3 h-3 fill-current" />
                <span>4.5★+</span>
              </button>

              <div className="h-4 w-px bg-violet-200 dark:bg-white/15 shrink-0 mx-1" />

              {/* Platform Chips */}
              {['Amazon India', 'Flipkart', 'Croma', 'Reliance Digital'].map((plat) => (
                <button
                  key={plat}
                  onClick={() => setSelectedPlatform(selectedPlatform.toLowerCase() === plat.toLowerCase() ? 'all' : plat)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-semibold shrink-0 transition-all border ${
                    selectedPlatform.toLowerCase() === plat.toLowerCase()
                      ? 'bg-cyan-600 text-white border-cyan-600 shadow-xs'
                      : 'border-violet-200 dark:border-white/15 bg-white/70 dark:bg-white/5 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {plat}
                </button>
              ))}
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-800 dark:text-rose-200 text-xs mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{error}</span>
              </div>
              <button
                onClick={() => executeSearch(activeQuery, 1, false)}
                className="px-3 py-1 rounded-lg bg-rose-600 text-white font-bold text-xs"
              >
                Retry
              </button>
            </div>
          )}

          {/* Loading Skeletons */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="rounded-3xl p-5 border border-violet-100 dark:border-white/10 bg-white/60 dark:bg-white/5 animate-pulse space-y-4">
                  <div className="w-full h-44 bg-violet-200/50 dark:bg-white/10 rounded-2xl"></div>
                  <div className="h-4 bg-violet-200/50 dark:bg-white/10 rounded w-3/4"></div>
                  <div className="h-3 bg-violet-200/50 dark:bg-white/10 rounded w-1/2"></div>
                  <div className="h-8 bg-violet-200/50 dark:bg-white/10 rounded-xl"></div>
                </div>
              ))}
            </div>
          )}

          {/* Products Grid */}
          {!loading && (
            <>
              {displayProducts.length === 0 ? (
                <div className="text-center py-16 p-8 rounded-3xl glass-panel-white border border-violet-100 dark:border-white/10">
                  {activeView === 'wishlist' ? (
                    <>
                      <Heart className="w-12 h-12 text-rose-400 mx-auto mb-3" />
                      <h3 className="font-heading font-black text-lg text-[#2E1065] dark:text-white mb-1">
                        Your Wishlist is Empty
                      </h3>
                      <p className="text-xs text-[#7C6898] dark:text-gray-400 max-w-md mx-auto mb-4">
                        Save products to monitor price drops across Indian stores and compare specifications side-by-side.
                      </p>
                      <button
                        onClick={() => setActiveView('search')}
                        className="px-5 py-2.5 rounded-xl text-xs font-bold primary-action"
                      >
                        Start Searching Products
                      </button>
                    </>
                  ) : (
                    <>
                      <Search className="w-12 h-12 text-[#7C3AED]/40 mx-auto mb-3" />
                      <h3 className="font-heading font-black text-lg text-[#2E1065] dark:text-white mb-1">
                        No matching products found
                      </h3>
                      <p className="text-xs text-[#7C6898] dark:text-gray-400 max-w-md mx-auto mb-4">
                        Try adjusting your filters or search for another query like "best phone under 20000" or "boAt headphones".
                      </p>
                      <button
                        onClick={() => {
                          setSelectedBrand('all');
                          setSelectedPlatform('all');
                          setPriceFilter('all');
                          setMinRating(0);
                        }}
                        className="px-4 py-2 rounded-xl text-xs font-bold primary-action"
                      >
                        Reset All Filters
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayProducts.map((product) => {
                    const isComparing = compareItems.some((item) => item.id === product.id || item.name === product.name);
                    const isWishlisted = isProductWishlisted(product);

                    return (
                      <div
                        key={product.id}
                        className="rounded-3xl border border-violet-100 dark:border-white/10 glass-panel-white overflow-hidden flex flex-col justify-between transform transition-all duration-300 ease-out hover:scale-[1.02] hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-violet-500/15 dark:hover:shadow-violet-900/30 hover:border-violet-300 dark:hover:border-violet-500/60 group"
                      >
                        <div>
                          {/* Image View + Badges */}
                          <div
                            onClick={() => onOpenProductModal && onOpenProductModal(product.name)}
                            className="relative h-48 bg-gradient-to-b from-violet-50/50 to-white dark:from-white/5 dark:to-transparent p-4 flex items-center justify-center cursor-pointer overflow-hidden"
                            title="Click to view full pictures and details"
                          >
                            <img
                              src={product.imageUrl || VERIFIED_FALLBACK_PLACEHOLDER}
                              alt={product.name}
                              referrerPolicy="no-referrer"
                              className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => handleImageError(e, product.category)}
                            />

                            {/* Verified Photo Tag */}
                            <span className="absolute top-3 left-3 px-2 py-0.5 rounded-lg text-[9px] font-bold bg-white/90 dark:bg-black/80 backdrop-blur-md text-[#7C3AED] dark:text-violet-300 border border-violet-200 dark:border-white/10 shadow-xs flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3 text-emerald-500" />
                              Verified CDN
                            </span>

                            {/* Right Top Action Buttons: Wishlist & Compare */}
                            <div className="absolute top-3 right-3 flex items-center gap-1.5">
                              {/* Wishlist Button */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleWishlist(product);
                                }}
                                className={`p-1.5 rounded-xl border transition-all ${
                                  isWishlisted
                                    ? 'bg-rose-500 text-white border-rose-500 shadow-md'
                                    : 'bg-white/80 dark:bg-black/60 text-gray-600 dark:text-gray-300 border-violet-200 dark:border-white/10 hover:text-rose-500'
                                }`}
                                title={isWishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'}
                              >
                                <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-white' : ''}`} />
                              </button>

                              {/* Compare Button */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleCompare(product);
                                }}
                                className={`px-2 py-1 rounded-xl text-[10px] font-bold border transition-all flex items-center gap-1 ${
                                  isComparing
                                    ? 'bg-[#7C3AED] text-white border-[#7C3AED] shadow-md'
                                    : 'bg-white/80 dark:bg-black/60 text-gray-700 dark:text-gray-300 border-violet-200 dark:border-white/10 hover:border-[#7C3AED]'
                                }`}
                              >
                                <Layers className="w-3 h-3" />
                                <span>{isComparing ? 'Comparing' : 'Compare'}</span>
                              </button>
                            </div>
                          </div>

                          {/* Card Content */}
                          <div className="p-4 sm:p-5">
                            {/* Brand & Rating */}
                            <div className="flex items-center justify-between text-xs text-[#7C6898] dark:text-gray-400 mb-1.5">
                              <span className="font-bold text-[#7C3AED] dark:text-violet-400 uppercase tracking-wider text-[10px]">
                                {product.brand || 'Verified Brand'}
                              </span>
                              <div className="flex items-center gap-1 text-amber-500 font-bold">
                                <Star className="w-3.5 h-3.5 fill-amber-500" />
                                <span>{product.rating > 0 ? product.rating : 'Not rated'}</span>
                                {product.ratingCount && (
                                  <span className="text-[10px] text-gray-400">({product.ratingCount})</span>
                                )}
                              </div>
                            </div>

                            {/* Product Title */}
                            <h3
                              onClick={() => onOpenProductModal && onOpenProductModal(product.name)}
                              className="font-heading font-black text-sm text-[#2E1065] dark:text-white line-clamp-2 hover:text-[#7C3AED] dark:hover:text-violet-300 cursor-pointer transition-colors mb-2"
                              title={product.name}
                            >
                              {product.name}
                            </h3>

                            {/* Specs Highlights */}
                            <div className="space-y-1 mb-3">
                              {product.specs.slice(0, 2).map((spec, sIdx) => (
                                <div key={sIdx} className="text-[11px] text-gray-600 dark:text-gray-300 flex items-center gap-1.5 truncate">
                                  <div className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] shrink-0" />
                                  <span className="truncate">{spec}</span>
                                </div>
                              ))}
                            </div>

                            {/* Review Summary (3 Pros & 3 Cons or 'Not enough review data') */}
                            <div className="mb-3 p-2.5 rounded-xl bg-violet-50/60 dark:bg-white/5 border border-violet-100 dark:border-white/10 text-xs">
                              {product.reviewSummary && product.reviewSummary.hasData && product.reviewSummary.pros.length > 0 ? (
                                <div className="space-y-1.5">
                                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#7C3AED] dark:text-violet-300 flex items-center gap-1">
                                    <Sparkles className="w-3 h-3" />
                                    <span>Verified Review Highlights</span>
                                  </div>
                                  {/* Pros */}
                                  <div className="space-y-0.5">
                                    {product.reviewSummary.pros.slice(0, 2).map((pro, pIdx) => (
                                      <div key={pIdx} className="text-[11px] text-emerald-700 dark:text-emerald-400 flex items-start gap-1">
                                        <CheckCircle2 className="w-3 h-3 shrink-0 mt-0.5" />
                                        <span className="line-clamp-1">{pro}</span>
                                      </div>
                                    ))}
                                  </div>
                                  {/* Cons */}
                                  <div className="space-y-0.5">
                                    {product.reviewSummary.cons.slice(0, 1).map((con, cIdx) => (
                                      <div key={cIdx} className="text-[11px] text-rose-600 dark:text-rose-400 flex items-start gap-1">
                                        <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
                                        <span className="line-clamp-1">{con}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ) : (
                                <div className="text-[11px] text-gray-500 dark:text-gray-400 italic flex items-center gap-1.5">
                                  <Info className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                  <span>Not enough review data</span>
                                </div>
                              )}
                            </div>

                            {/* Multi-Platform Price Comparison Section */}
                            <div className="space-y-2 pt-2 border-t border-violet-100 dark:border-white/10">
                              <div className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                Live Platform Pricing (Cheapest Highlighted)
                              </div>

                              {/* Available Store Offers */}
                              <div className="space-y-1.5">
                                {product.offers.map((offer, oIdx) => {
                                  const isCheapest = product.cheapestOffer?.buyUrl === offer.buyUrl;

                                  return (
                                    <div
                                      key={oIdx}
                                      className={`p-2 rounded-xl flex items-center justify-between transition-all border ${
                                        isCheapest
                                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700/60 shadow-xs'
                                          : 'bg-white/60 dark:bg-white/5 border-violet-100 dark:border-white/5'
                                      }`}
                                    >
                                      <div className="flex items-center gap-1.5 truncate">
                                        <div className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate">
                                          {offer.platform}
                                        </div>
                                        <span className="text-[9px] px-1.5 py-0.5 rounded font-mono bg-black/5 dark:bg-white/10 text-gray-500 dark:text-gray-400 shrink-0">
                                          {offer.domain}
                                        </span>
                                        {isCheapest && (
                                          <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-emerald-600 text-white shadow-xs shrink-0">
                                            Lowest
                                          </span>
                                        )}
                                      </div>

                                      <div className="flex items-center gap-2 shrink-0">
                                        <span className={`text-xs font-mono font-black ${isCheapest ? 'text-emerald-700 dark:text-emerald-400' : 'text-gray-700 dark:text-gray-300'}`}>
                                          {offer.priceFormatted || 'Check Store'}
                                        </span>
                                        <a
                                          href={offer.buyUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all ${
                                            isCheapest
                                              ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
                                              : 'bg-violet-600 text-white hover:bg-violet-700 shadow-xs'
                                          }`}
                                          title={`Buy directly on ${offer.platform}`}
                                        >
                                          <span>Buy</span>
                                          <ExternalLink className="w-2.5 h-2.5" />
                                        </a>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>

                              {/* Missing Platforms ("Not found on this platform") */}
                              {product.missingPlatforms.length > 0 && (
                                <div className="pt-1.5">
                                  <div className="text-[9px] text-gray-400 dark:text-gray-500">
                                    Not found on this platform:{' '}
                                    <span className="italic">{product.missingPlatforms.join(', ')}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Card Footer Actions */}
                        <div className="p-4 pt-0 flex items-center gap-2">
                          <button
                            onClick={() => onOpenProductModal && onOpenProductModal(product.name)}
                            className="w-full py-2 rounded-xl text-xs font-bold border border-violet-200 dark:border-white/10 bg-white/70 dark:bg-white/5 hover:bg-violet-50 dark:hover:bg-white/10 text-[#7C3AED] dark:text-violet-300 transition-colors flex items-center justify-center gap-1"
                          >
                            <span>Inspect Specs & Reviews</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Load More Pagination Button (Search Mode Only) */}
              {activeView === 'search' && hasMore && (
                <div className="mt-8 text-center">
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="px-6 py-3 rounded-2xl text-xs font-bold primary-action shadow-lg shadow-violet-500/20 disabled:opacity-50 inline-flex items-center gap-2"
                  >
                    {loadingMore ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Searching More Platforms...</span>
                      </>
                    ) : (
                      <>
                        <span>Load More Products</span>
                        <ChevronDown className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Side-by-Side Product Comparison Drawer / Modal (Up to 3 products) */}
      {compareDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl glass-panel-white border border-violet-200 dark:border-white/15 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-violet-100 dark:border-white/10 mb-6">
              <div>
                <h2 className="text-xl font-heading font-black text-[#2E1065] dark:text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#7C3AED]" />
                  Side-by-Side Comparison Table
                </h2>
                <p className="text-xs text-[#7C6898] dark:text-gray-400">
                  Comparing {compareItems.length} product{compareItems.length === 1 ? '' : 's'} with best values highlighted in each row.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCompareItems([])}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setCompareDrawerOpen(false)}
                  className="p-1.5 rounded-xl border border-violet-200 dark:border-white/15 text-gray-500 hover:bg-violet-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {compareItems.length === 0 ? (
              <div className="text-center py-12 text-gray-500 text-sm">
                No products selected for comparison. Click "Compare" on any product card.
              </div>
            ) : (
              <div className="space-y-6">
                {/* Product Column Cards Header */}
                <div className={`grid grid-cols-1 md:grid-cols-${compareItems.length} gap-4`}>
                  {compareItems.map((prod) => {
                    const isBestRating = prod.id === compareAnalytics.bestRatingId;
                    const isBestPrice = prod.id === compareAnalytics.bestPriceId;

                    return (
                      <div key={prod.id} className="p-4 rounded-2xl border border-violet-100 dark:border-white/10 bg-white/70 dark:bg-white/5 space-y-3 relative">
                        <button
                          onClick={() => setCompareItems((prev) => prev.filter((p) => p.id !== prod.id))}
                          className="absolute top-2 right-2 p-1 rounded-lg text-gray-400 hover:text-rose-500"
                          title="Remove from comparison"
                        >
                          <X className="w-4 h-4" />
                        </button>

                        <div className="w-full h-36 flex items-center justify-center bg-violet-50 dark:bg-white/5 rounded-xl p-2">
                          <img
                            src={prod.imageUrl}
                            alt={prod.name}
                            className="max-h-full max-w-full object-contain"
                            onError={(e) => handleImageError(e, prod.category)}
                          />
                        </div>

                        <div>
                          <span className="text-[10px] font-bold text-[#7C3AED] uppercase">{prod.brand}</span>
                          <h4 className="font-heading font-bold text-xs text-[#2E1065] dark:text-white line-clamp-2">
                            {prod.name}
                          </h4>
                        </div>

                        {/* Best Price Banner with Highlight */}
                        <div className={`p-2.5 rounded-xl border ${
                          isBestPrice
                            ? 'bg-emerald-100 dark:bg-emerald-950/70 border-emerald-400 dark:border-emerald-600 shadow-sm'
                            : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'
                        }`}>
                          <div className="flex items-center justify-between text-[10px] font-bold">
                            <span className="text-emerald-700 dark:text-emerald-300 uppercase">Lowest Verified Deal</span>
                            {isBestPrice && (
                              <span className="px-1.5 py-0.2 rounded bg-emerald-600 text-white font-extrabold text-[9px]">
                                Best Deal in Row
                              </span>
                            )}
                          </div>
                          <div className="text-base font-mono font-black text-emerald-800 dark:text-emerald-300">
                            {prod.cheapestOffer?.priceFormatted || prod.priceFormatted}
                          </div>
                          <div className="text-[10px] text-gray-500">on {prod.cheapestOffer?.platform || 'Amazon India'}</div>
                        </div>

                        {/* Rating Row with Highlight */}
                        <div className={`p-2 rounded-xl border flex items-center justify-between text-xs ${
                          isBestRating
                            ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-700'
                            : 'bg-white/50 dark:bg-white/5 border-violet-100 dark:border-white/5'
                        }`}>
                          <span className="text-gray-500">Rating:</span>
                          <div className="flex items-center gap-1 font-bold text-amber-500">
                            <Star className="w-3.5 h-3.5 fill-amber-500" />
                            <span>{prod.rating > 0 ? prod.rating : 'N/A'}</span>
                            {isBestRating && (
                              <span className="ml-1 px-1.5 py-0.2 rounded bg-amber-500 text-white text-[9px] font-extrabold">
                                Highest
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Platform Pricing Breakdown */}
                        <div className="space-y-1">
                          <div className="text-[10px] font-bold text-gray-400 uppercase">All Platform Offers</div>
                          {prod.offers.map((off, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-violet-50 dark:border-white/5">
                              <span className="text-gray-700 dark:text-gray-300">{off.platform}</span>
                              <a
                                href={off.buyUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-bold font-mono text-[#7C3AED] hover:underline flex items-center gap-1"
                              >
                                <span>{off.priceFormatted}</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            </div>
                          ))}
                        </div>

                        {/* Specs Highlights */}
                        <div className="space-y-1">
                          <div className="text-[10px] font-bold text-gray-400 uppercase">Specs Highlights</div>
                          {prod.specs.slice(0, 3).map((sp, idx) => (
                            <div key={idx} className="text-[11px] text-gray-600 dark:text-gray-300">
                              • {sp}
                            </div>
                          ))}
                        </div>

                        {/* Review Summary (3 Pros / 3 Cons) */}
                        <div className="space-y-1 pt-1 border-t border-violet-100 dark:border-white/10">
                          <div className="text-[10px] font-bold text-gray-400 uppercase">Review Summary</div>
                          {prod.reviewSummary && prod.reviewSummary.hasData && prod.reviewSummary.pros.length > 0 ? (
                            <div className="space-y-1 text-[11px]">
                              {prod.reviewSummary.pros.slice(0, 3).map((p, idx) => (
                                <div key={idx} className="text-emerald-700 dark:text-emerald-400 flex items-start gap-1">
                                  <Check className="w-3 h-3 shrink-0 mt-0.5" />
                                  <span>{p}</span>
                                </div>
                              ))}
                              {prod.reviewSummary.cons.slice(0, 3).map((c, idx) => (
                                <div key={idx} className="text-rose-600 dark:text-rose-400 flex items-start gap-1">
                                  <X className="w-3 h-3 shrink-0 mt-0.5" />
                                  <span>{c}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-[11px] text-gray-400 italic">
                              Not enough review data
                            </div>
                          )}
                        </div>

                        {/* Direct Buy CTA */}
                        {prod.cheapestOffer?.buyUrl && (
                          <a
                            href={prod.cheapestOffer.buyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-2.5 rounded-xl text-xs font-bold primary-action flex items-center justify-center gap-1.5 shadow-md mt-2"
                          >
                            <span>Buy on {prod.cheapestOffer.platform}</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
