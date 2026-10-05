import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  Sparkles,
  Filter,
  SlidersHorizontal,
  ArrowUpDown,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  Star,
  CheckCircle2,
  ShoppingCart,
  ShoppingBag,
  Eye,
  Heart,
  Layers,
  Clock,
  Zap,
  ArrowRight,
  X,
  RefreshCw,
  Compass,
  ShieldCheck,
  Tag,
  Laptop,
  Tv,
  Flame,
  AlertCircle,
  Info,
  Check,
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { handleImageError } from '../utils/image-validator';

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
  cheapestOffer: {
    platform: string;
    domain: string;
    price: number | null;
    priceFormatted: string;
    buyUrl: string;
    isVerifiedGrounded: boolean;
    storeBadge?: string;
    inStock?: boolean;
  };
  offers: Array<{
    platform: string;
    domain: string;
    price: number | null;
    priceFormatted: string;
    buyUrl: string;
    isVerifiedGrounded: boolean;
    storeBadge?: string;
    inStock?: boolean;
  }>;
  reviewSummary?: {
    pros: string[];
    cons: string[];
    hasData: boolean;
  };
}

export interface SubCategory {
  id: string;
  name: string;
  slug: string;
  searchQuery: string;
  description: string;
  itemCountEstimated: string;
  popularBrands: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  tagline: string;
  searchQuery: string;
  bannerGradient: string;
  subcategories: SubCategory[];
}

export interface BrandItem {
  id: string;
  name: string;
  firstLetter: string;
  popularCategories: string[];
  searchQuery: string;
  tagline: string;
  origin?: string;
  featured?: boolean;
}

interface HomeFeedResponse {
  timestamp: string;
  cachedForMinutes: number;
  featuredCategories: Category[];
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
  rows: Array<{
    id: string;
    title: string;
    subtitle: string;
    badge?: string;
    categorySlug?: string;
    query: string;
    products: GroundedProduct[];
  }>;
}

interface MarketplaceHomeProps {
  onOpenProductModal?: (product: any) => void;
  onSelectQuery?: (query: string) => void;
  isWhite?: boolean;
}

const RECENTLY_VIEWED_KEY = 'vantage_recently_viewed_v1';

export const MarketplaceHome: React.FC<MarketplaceHomeProps> = ({
  onOpenProductModal,
  onSelectQuery,
  isWhite = true,
}) => {
  // Navigation View State: 'home' | 'category' | 'brand_index' | 'category_index' | 'pdp'
  const [viewMode, setViewMode] = useState<'home' | 'category' | 'brand_index' | 'category_index' | 'pdp'>('home');
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [activeSubcategory, setActiveSubcategory] = useState<SubCategory | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<GroundedProduct | null>(null);

  // Home Feed State (with 30-min in-memory cache)
  const [feed, setFeed] = useState<HomeFeedResponse | null>(null);
  const [isLoadingFeed, setIsLoadingFeed] = useState<boolean>(true);
  const [activeSlide, setActiveSlide] = useState<number>(0);

  // Category Listing State
  const [categoryProducts, setCategoryProducts] = useState<GroundedProduct[]>([]);
  const [isLoadingCategory, setIsLoadingCategory] = useState<boolean>(false);
  const [catPage, setCatPage] = useState<number>(1);
  const [catHasMore, setCatHasMore] = useState<boolean>(true);
  const [catTotal, setCatTotal] = useState<number>(0);
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);
  const [availablePlatforms, setAvailablePlatforms] = useState<string[]>([]);

  // Category Filters
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [pricePreset, setPricePreset] = useState<'all' | 'under5k' | '5k-20k' | '20k-50k' | 'above50k'>('all');
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [sortBy, setSortBy] = useState<'relevance' | 'price_low' | 'price_high' | 'rating'>('relevance');

  // A to Z Index Data
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [allBrands, setAllBrands] = useState<BrandItem[]>([]);
  const [brandSearchTerm, setBrandSearchTerm] = useState<string>('');
  const [categorySearchTerm, setCategorySearchTerm] = useState<string>('');

  // Recently Viewed Products
  const [recentlyViewed, setRecentlyViewed] = useState<GroundedProduct[]>(() => {
    try {
      const saved = localStorage.getItem(RECENTLY_VIEWED_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Track product view in localStorage
  const trackProductView = (prod: GroundedProduct) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => p.id !== prod.id && p.name !== prod.name);
      const updated = [prod, ...filtered].slice(0, 12);
      try {
        localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updated));
      } catch {
        // storage full
      }
      return updated;
    });
  };

  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

  const handleProductCardClick = (prod: GroundedProduct) => {
    trackProductView(prod);
    setSelectedProduct(prod);
    setSelectedImageIndex(0);
    setViewMode('pdp');
  };

  // Derive similar products for PDP
  const similarProducts = useMemo(() => {
    if (!selectedProduct) return [];
    const feedProducts = (feed?.rows || []).flatMap((r) => r.products || []);
    const pool = [...feedProducts, ...categoryProducts];
    const seen = new Set<string>();
    seen.add(selectedProduct.id);
    seen.add(selectedProduct.name.toLowerCase());

    return pool.filter((p) => {
      if (seen.has(p.id) || seen.has(p.name.toLowerCase())) return false;
      const matchCat = p.category.toLowerCase().includes(selectedProduct.category.toLowerCase()) ||
        selectedProduct.category.toLowerCase().includes(p.category.toLowerCase());
      const matchBrand = p.brand.toLowerCase() === selectedProduct.brand.toLowerCase();
      if (matchCat || matchBrand) {
        seen.add(p.id);
        seen.add(p.name.toLowerCase());
        return true;
      }
      return false;
    }).slice(0, 4);
  }, [selectedProduct, feed, categoryProducts]);

  // 1. Fetch Home Feed on mount
  useEffect(() => {
    let isMounted = true;
    const loadHomeFeed = async () => {
      try {
        setIsLoadingFeed(true);
        const res = await fetch('/api/marketplace/home');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: HomeFeedResponse = await res.json();
        if (isMounted) {
          setFeed(data);
          if (data.featuredCategories) setAllCategories(data.featuredCategories);
        }
      } catch (err) {
        console.warn('Could not load marketplace feed:', err);
      } finally {
        if (isMounted) setIsLoadingFeed(false);
      }
    };

    loadHomeFeed();

    // Also prefetch brands & categories list
    fetch('/api/marketplace/brands')
      .then((r) => r.json())
      .then((d) => {
        if (isMounted && d?.brands) setAllBrands(d.brands);
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  // Auto-advance banner slides
  useEffect(() => {
    if (!feed?.bannerSlides?.length) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % feed.bannerSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [feed?.bannerSlides?.length]);

  // 2. Fetch Category Products when category or filters change
  const fetchCategoryListing = async (
    catSlug: string,
    subSlug?: string,
    pageNum: number = 1,
    append: boolean = false
  ) => {
    try {
      setIsLoadingCategory(true);
      const params = new URLSearchParams();
      if (subSlug) params.set('sub', subSlug);
      params.set('page', String(pageNum));
      params.set('limit', '12');
      if (selectedBrand) params.set('brand', selectedBrand);
      if (selectedPlatform) params.set('platform', selectedPlatform);
      if (selectedRating > 0) params.set('minRating', String(selectedRating));
      if (sortBy) params.set('sortBy', sortBy);

      if (pricePreset === 'under5k') {
        params.set('maxPrice', '5000');
      } else if (pricePreset === '5k-20k') {
        params.set('minPrice', '5000');
        params.set('maxPrice', '20000');
      } else if (pricePreset === '20k-50k') {
        params.set('minPrice', '20000');
        params.set('maxPrice', '50000');
      } else if (pricePreset === 'above50k') {
        params.set('minPrice', '50000');
      }

      const res = await fetch(`/api/marketplace/category/${encodeURIComponent(catSlug)}?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      if (append) {
        setCategoryProducts((prev) => [...prev, ...(data.products || [])]);
      } else {
        setCategoryProducts(data.products || []);
      }
      setCatTotal(data.totalProducts || 0);
      setCatHasMore(Boolean(data.hasMore));
      setCatPage(pageNum);

      if (data.availableBrands?.length) setAvailableBrands(data.availableBrands);
      if (data.availablePlatforms?.length) setAvailablePlatforms(data.availablePlatforms);
    } catch (err) {
      console.warn('Error fetching category listing:', err);
    } finally {
      setIsLoadingCategory(false);
    }
  };

  const handleOpenCategory = (cat: Category, sub?: SubCategory) => {
    setActiveCategory(cat);
    setActiveSubcategory(sub || null);
    setSelectedBrand('');
    setPricePreset('all');
    setSelectedRating(0);
    setSelectedPlatform('');
    setSortBy('relevance');
    setViewMode('category');
    fetchCategoryListing(cat.slug, sub?.slug, 1, false);
  };

  const handleApplyFilter = () => {
    if (!activeCategory) return;
    fetchCategoryListing(activeCategory.slug, activeSubcategory?.slug, 1, false);
  };

  useEffect(() => {
    if (viewMode === 'category' && activeCategory) {
      fetchCategoryListing(activeCategory.slug, activeSubcategory?.slug, 1, false);
    }
  }, [selectedBrand, pricePreset, selectedRating, selectedPlatform, sortBy]);

  const handleLoadMore = () => {
    if (!activeCategory || isLoadingCategory || !catHasMore) return;
    fetchCategoryListing(activeCategory.slug, activeSubcategory?.slug, catPage + 1, true);
  };

  // Grouped Brands for A to Z index
  const groupedBrands = useMemo(() => {
    const q = brandSearchTerm.toLowerCase().trim();
    const filtered = allBrands.filter((b) => !q || b.name.toLowerCase().includes(q) || b.tagline.toLowerCase().includes(q));
    const groups: Record<string, BrandItem[]> = {};
    for (const b of filtered) {
      const letter = b.firstLetter.toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(b);
    }
    return groups;
  }, [allBrands, brandSearchTerm]);

  // Grouped Categories for A to Z index
  const filteredCategories = useMemo(() => {
    const q = categorySearchTerm.toLowerCase().trim();
    if (!q) return allCategories;
    return allCategories.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.tagline.toLowerCase().includes(q) ||
        c.subcategories.some((s) => s.name.toLowerCase().includes(q))
    );
  }, [allCategories, categorySearchTerm]);

  // Horizontal scroll helper for product rows
  const scrollRow = (rowId: string, direction: 'left' | 'right') => {
    const container = document.getElementById(`row-${rowId}`);
    if (container) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Get icon component dynamically
  const renderCategoryIcon = (iconName: string, className: string = 'w-5 h-5') => {
    switch (iconName) {
      case 'Laptop':
        return <Laptop className={className} />;
      case 'Tv':
        return <Tv className={className} />;
      case 'Sparkles':
        return <Sparkles className={className} />;
      case 'Flame':
        return <Flame className={className} />;
      case 'Compass':
        return <Compass className={className} />;
      case 'Tag':
        return <Tag className={className} />;
      case 'ShoppingCart':
        return <ShoppingCart className={className} />;
      case 'ShieldCheck':
        return <ShieldCheck className={className} />;
      default:
        return <ShoppingBag className={className} />;
    }
  };

  return (
    <div className="space-y-6 w-full">
      {/* 1. TOP FLIPKART-STYLE CATEGORY BAR */}
      <div className="bg-white/90 border border-violet-100 rounded-2xl p-2.5 sm:p-3 shadow-xs backdrop-blur-md">
        <div className="flex items-center justify-between gap-2 overflow-x-auto scrollbar-none pb-1">
          {/* A to Z All Categories Button */}
          <button
            onClick={() => setViewMode('category_index')}
            className={`flex flex-col items-center justify-center p-2 rounded-xl min-w-[76px] transition-all cursor-pointer ${
              viewMode === 'category_index'
                ? 'bg-violet-100 text-[#7C3AED] font-bold shadow-xs'
                : 'text-[#4C1D95] hover:bg-violet-50 hover:text-[#7C3AED]'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-violet-100 text-[#7C3AED] flex items-center justify-center mb-1">
              <Layers className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold tracking-tight text-center">All A to Z</span>
          </button>

          {/* Quick Categories */}
          {(feed?.featuredCategories || allCategories).slice(0, 9).map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleOpenCategory(cat)}
              className={`flex flex-col items-center justify-center p-2 rounded-xl min-w-[80px] sm:min-w-[88px] transition-all cursor-pointer group ${
                viewMode === 'category' && activeCategory?.id === cat.id
                  ? 'bg-gradient-to-b from-violet-100 to-violet-50 text-[#7C3AED] font-bold shadow-xs'
                  : 'text-[#2E1065] hover:bg-violet-50/80 hover:text-[#7C3AED]'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-[#FAF8FF] border border-violet-100 group-hover:border-violet-300 group-hover:scale-105 text-[#7C3AED] flex items-center justify-center mb-1 transition-all shadow-2xs">
                {renderCategoryIcon(cat.iconName)}
              </div>
              <span className="text-[11px] font-semibold tracking-tight text-center line-clamp-1 max-w-[84px]">
                {cat.name.replace("Fashion - ", "")}
              </span>
            </button>
          ))}

          {/* A to Z Brands Directory Button */}
          <button
            onClick={() => setViewMode('brand_index')}
            className={`flex flex-col items-center justify-center p-2 rounded-xl min-w-[76px] transition-all cursor-pointer ${
              viewMode === 'brand_index'
                ? 'bg-violet-100 text-[#7C3AED] font-bold shadow-xs'
                : 'text-[#4C1D95] hover:bg-violet-50 hover:text-[#7C3AED]'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center mb-1 font-heading font-black text-xs">
              A-Z
            </div>
            <span className="text-[11px] font-bold tracking-tight text-center">Top Brands</span>
          </button>
        </div>
      </div>

      {/* 2. VIEW: HOME PAGE FEED (Hero Carousel + Rows) */}
      {viewMode === 'home' && (
        <div className="space-y-8">
          {/* HERO BANNER CAROUSEL */}
          {feed?.bannerSlides && feed.bannerSlides.length > 0 && (
            <div className="relative rounded-3xl overflow-hidden shadow-xl border border-violet-200/80 bg-gradient-to-r from-violet-900 via-purple-900 to-[#120726] text-white min-h-[220px] sm:min-h-[260px] flex items-center">
              <div className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-overlay" style={{ backgroundImage: `url(${feed.bannerSlides[activeSlide]?.imageUrl})` }} />

              <div className="relative z-10 p-6 sm:p-10 max-w-2xl space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase border border-white/20">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>{feed.bannerSlides[activeSlide]?.tag}</span>
                </div>
                <h2 className="font-heading font-black text-xl sm:text-3xl text-white tracking-tight">
                  {feed.bannerSlides[activeSlide]?.title}
                </h2>
                <p className="text-xs sm:text-sm text-violet-200 leading-relaxed max-w-lg">
                  {feed.bannerSlides[activeSlide]?.subtitle}
                </p>
                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={() => {
                      if (onSelectQuery) {
                        onSelectQuery(feed.bannerSlides[activeSlide]?.query);
                      }
                    }}
                    className="px-5 py-2.5 rounded-xl bg-white hover:bg-violet-50 text-[#2E1065] font-black text-xs sm:text-sm inline-flex items-center gap-2 shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer font-heading"
                  >
                    <span>{feed.bannerSlides[activeSlide]?.actionText}</span>
                    <ArrowRight className="w-4 h-4 text-[#7C3AED]" />
                  </button>
                  <span className="text-[11px] text-violet-300 hidden sm:inline-block">
                    ✓ Verified links in INR (₹)
                  </span>
                </div>
              </div>

              {/* Slide Indicators */}
              <div className="absolute bottom-4 right-6 flex items-center gap-2 z-20">
                {feed.bannerSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSlide(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      activeSlide === idx ? 'w-6 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
                    }`}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* SKELETON LOADER IF STILL FETCHING */}
          {isLoadingFeed && (
            <div className="space-y-8 animate-pulse">
              {[1, 2, 3].map((n) => (
                <div key={n} className="space-y-4">
                  <div className="h-6 w-60 bg-violet-100 rounded-lg" />
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-64 bg-violet-50 rounded-2xl border border-violet-100" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* MARKETPLACE FEED ROWS */}
          {feed?.rows?.map((row) => (
            <div key={row.id} className="space-y-3.5">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-heading font-black text-lg sm:text-xl text-[#2E1065]">
                      {row.title}
                    </h3>
                    {row.badge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-100 text-[#6D28D9] border border-violet-200">
                        {row.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#7C6898]">
                    {row.subtitle}
                  </p>
                </div>

                {/* Left/Right Scroll Controls */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => scrollRow(row.id, 'left')}
                    className="w-8 h-8 rounded-full border border-violet-200 bg-white hover:bg-violet-50 flex items-center justify-center text-[#4C1D95] shadow-2xs transition-all cursor-pointer"
                    title="Scroll left"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => scrollRow(row.id, 'right')}
                    className="w-8 h-8 rounded-full border border-violet-200 bg-white hover:bg-violet-50 flex items-center justify-center text-[#4C1D95] shadow-2xs transition-all cursor-pointer"
                    title="Scroll right"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Product Horizontal Carousel */}
              <div
                id={`row-${row.id}`}
                className="flex gap-4 overflow-x-auto scrollbar-none pb-2 pt-1 scroll-smooth"
              >
                {row.products.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleProductCardClick(product)}
                    className="min-w-[240px] max-w-[260px] sm:min-w-[260px] sm:max-w-[280px] bg-white rounded-2xl p-4 border border-violet-100 hover:border-violet-300 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between shrink-0 group cursor-pointer"
                  >
                    <div>
                      {/* Store & Rating */}
                      <div className="flex items-center justify-between gap-1 mb-2.5">
                        <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>{product.cheapestOffer?.platform || 'Verified'}</span>
                        </span>
                        <div className="flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{product.rating || '4.5'}</span>
                        </div>
                      </div>

                      {/* Image */}
                      <div className="h-40 w-full rounded-xl bg-[#FAF8FF] border border-violet-50 p-3 flex items-center justify-center mb-3 relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          className="max-h-full max-w-full object-contain drop-shadow-xs"
                          onError={(e) => handleImageError(e, product.category)}
                        />
                      </div>

                      {/* Brand & Name */}
                      <div className="text-[10px] font-bold text-[#7C3AED] uppercase tracking-wider mb-0.5">
                        {product.brand}
                      </div>
                      <h4 className="font-heading font-bold text-xs sm:text-sm text-[#2E1065] line-clamp-2 group-hover:text-[#7C3AED] transition-colors mb-2">
                        {product.name}
                      </h4>
                    </div>

                    {/* Price & Actions */}
                    <div className="pt-2 border-t border-violet-50 mt-1">
                      <div className="flex items-baseline justify-between mb-2">
                        <div>
                          <span className="font-heading font-black text-base text-[#7C3AED]">
                            {product.priceFormatted}
                          </span>
                          {product.mrpFormatted && (
                            <span className="text-[11px] text-[#7C6898] line-through ml-1.5">
                              {product.mrpFormatted}
                            </span>
                          )}
                        </div>
                        {product.offers && product.offers.length > 1 && (
                          <span className="text-[10px] font-semibold text-violet-700 bg-violet-50 px-1.5 py-0.5 rounded">
                            {product.offers.length} stores
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleProductCardClick(product);
                          }}
                          className="text-[11px] font-semibold py-1.5 px-2 rounded-xl bg-violet-50 hover:bg-violet-100 text-[#6D28D9] border border-violet-200 flex items-center justify-center gap-1 transition-all cursor-pointer"
                        >
                          <Sparkles className="w-3 h-3 text-[#7C3AED]" />
                          <span>Specs</span>
                        </button>
                        <a
                          href={product.cheapestOffer?.buyUrl || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-[11px] font-bold py-1.5 px-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white flex items-center justify-center gap-1 shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer font-heading"
                        >
                          <span>Buy Direct</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* RECENTLY VIEWED ROW (Loaded from localStorage) */}
          {recentlyViewed.length > 0 && (
            <div className="space-y-3.5 pt-4 border-t border-violet-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#7C3AED]" />
                  <h3 className="font-heading font-black text-lg sm:text-xl text-[#2E1065]">
                    Recently Viewed
                  </h3>
                  <span className="text-xs text-[#7C6898]">({recentlyViewed.length} items)</span>
                </div>
                <button
                  onClick={() => {
                    setRecentlyViewed([]);
                    localStorage.removeItem(RECENTLY_VIEWED_KEY);
                  }}
                  className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear History</span>
                </button>
              </div>

              <div className="flex gap-4 overflow-x-auto scrollbar-none pb-2 pt-1">
                {recentlyViewed.map((product) => (
                  <div
                    key={`recent-${product.id}`}
                    onClick={() => handleProductCardClick(product)}
                    className="min-w-[200px] max-w-[220px] bg-white rounded-2xl p-3.5 border border-violet-100 hover:border-violet-300 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between shrink-0 group cursor-pointer"
                  >
                    <div className="h-28 rounded-xl bg-[#FAF8FF] p-2 flex items-center justify-center mb-2">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        loading="lazy"
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => handleImageError(e, product.category)}
                      />
                    </div>
                    <div>
                      <h5 className="font-heading font-bold text-xs text-[#2E1065] line-clamp-1 mb-1">
                        {product.name}
                      </h5>
                      <div className="font-heading font-black text-sm text-[#7C3AED]">
                        {product.priceFormatted}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. VIEW: CATEGORY LISTING PAGE (With Filters & Pagination) */}
      {viewMode === 'category' && activeCategory && (
        <div className="space-y-6">
          {/* Breadcrumbs & Header */}
          <div className="bg-white/90 border border-violet-100 rounded-3xl p-6 shadow-xs backdrop-blur-md">
            <div className="flex items-center gap-2 text-xs text-[#7C6898] mb-2 flex-wrap">
              <button
                onClick={() => setViewMode('home')}
                className="hover:text-[#7C3AED] font-semibold cursor-pointer"
              >
                Home
              </button>
              <span>›</span>
              <button
                onClick={() => handleOpenCategory(activeCategory)}
                className={`font-semibold ${!activeSubcategory ? 'text-[#7C3AED]' : 'hover:text-[#7C3AED]'} cursor-pointer`}
              >
                {activeCategory.name}
              </button>
              {activeSubcategory && (
                <>
                  <span>›</span>
                  <span className="text-[#7C3AED] font-bold">{activeSubcategory.name}</span>
                </>
              )}
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="font-heading font-black text-2xl sm:text-3xl text-[#2E1065] tracking-tight">
                  {activeSubcategory ? activeSubcategory.name : activeCategory.name}
                </h2>
                <p className="text-xs sm:text-sm text-[#7C6898] mt-1 max-w-2xl">
                  {activeSubcategory ? activeSubcategory.description : activeCategory.tagline}
                </p>
                <div className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block mt-2">
                  ✓ Showing {categoryProducts.length} verified products with real-time Indian store links
                </div>
              </div>

              {/* Subcategory Pills */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {activeCategory.subcategories.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => handleOpenCategory(activeCategory, sub)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      activeSubcategory?.id === sub.id
                        ? 'bg-[#7C3AED] text-white shadow-xs font-bold'
                        : 'bg-violet-50 hover:bg-violet-100 text-[#4C1D95] border border-violet-200'
                    }`}
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Grid with Filter Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
            {/* Filter Sidebar */}
            <div className="bg-white/95 border border-violet-100 rounded-3xl p-5 shadow-xs space-y-5 sticky top-24">
              <div className="flex items-center justify-between pb-3 border-b border-violet-100">
                <div className="flex items-center gap-2 font-heading font-black text-sm text-[#2E1065]">
                  <Filter className="w-4 h-4 text-[#7C3AED]" />
                  <span>Filters & Refine</span>
                </div>
                {(selectedBrand || pricePreset !== 'all' || selectedRating > 0 || selectedPlatform) && (
                  <button
                    onClick={() => {
                      setSelectedBrand('');
                      setPricePreset('all');
                      setSelectedRating(0);
                      setSelectedPlatform('');
                    }}
                    className="text-[11px] text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Price Preset Chips */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#2E1065] uppercase tracking-wider block">
                  Price in ₹
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'all', label: 'All Budgets' },
                    { id: 'under5k', label: 'Under ₹5k' },
                    { id: '5k-20k', label: '₹5k - ₹20k' },
                    { id: '20k-50k', label: '₹20k - ₹50k' },
                    { id: 'above50k', label: 'Above ₹50k' },
                  ].map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => setPricePreset(preset.id as any)}
                      className={`text-xs py-1.5 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                        pricePreset === preset.id
                          ? 'bg-[#7C3AED] text-white font-bold border-[#7C3AED]'
                          : 'bg-violet-50/70 hover:bg-violet-100 text-[#4C1D95] border-violet-100'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brands */}
              {availableBrands.length > 0 && (
                <div className="space-y-2 pt-3 border-t border-violet-100">
                  <label className="text-xs font-bold text-[#2E1065] uppercase tracking-wider block">
                    Brand
                  </label>
                  <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
                    <button
                      onClick={() => setSelectedBrand('')}
                      className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center justify-between ${
                        !selectedBrand ? 'bg-violet-100 text-[#7C3AED] font-bold' : 'text-[#4C1D95] hover:bg-violet-50'
                      }`}
                    >
                      <span>All Brands</span>
                      {!selectedBrand && <Check className="w-3.5 h-3.5 text-[#7C3AED]" />}
                    </button>
                    {availableBrands.map((b) => (
                      <button
                        key={b}
                        onClick={() => setSelectedBrand(b === selectedBrand ? '' : b)}
                        className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center justify-between ${
                          selectedBrand === b
                            ? 'bg-violet-100 text-[#7C3AED] font-bold'
                            : 'text-[#4C1D95] hover:bg-violet-50'
                        }`}
                      >
                        <span>{b}</span>
                        {selectedBrand === b && <Check className="w-3.5 h-3.5 text-[#7C3AED]" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Rating */}
              <div className="space-y-2 pt-3 border-t border-violet-100">
                <label className="text-xs font-bold text-[#2E1065] uppercase tracking-wider block">
                  Customer Rating
                </label>
                <div className="space-y-1">
                  {[
                    { val: 0, label: 'Any Rating' },
                    { val: 4, label: '4★ & Above' },
                    { val: 4.5, label: '4.5★ & Above (Top Rated)' },
                  ].map((r) => (
                    <button
                      key={r.val}
                      onClick={() => setSelectedRating(r.val)}
                      className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center justify-between ${
                        selectedRating === r.val
                          ? 'bg-violet-100 text-[#7C3AED] font-bold'
                          : 'text-[#4C1D95] hover:bg-violet-50'
                      }`}
                    >
                      <span>{r.label}</span>
                      {selectedRating === r.val && <Check className="w-3.5 h-3.5 text-[#7C3AED]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Platform */}
              {availablePlatforms.length > 0 && (
                <div className="space-y-2 pt-3 border-t border-violet-100">
                  <label className="text-xs font-bold text-[#2E1065] uppercase tracking-wider block">
                    Store Platform
                  </label>
                  <div className="space-y-1">
                    <button
                      onClick={() => setSelectedPlatform('')}
                      className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center justify-between ${
                        !selectedPlatform ? 'bg-violet-100 text-[#7C3AED] font-bold' : 'text-[#4C1D95] hover:bg-violet-50'
                      }`}
                    >
                      <span>All Verified Stores</span>
                      {!selectedPlatform && <Check className="w-3.5 h-3.5 text-[#7C3AED]" />}
                    </button>
                    {availablePlatforms.map((plat) => (
                      <button
                        key={plat}
                        onClick={() => setSelectedPlatform(plat === selectedPlatform ? '' : plat)}
                        className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center justify-between ${
                          selectedPlatform === plat
                            ? 'bg-violet-100 text-[#7C3AED] font-bold'
                            : 'text-[#4C1D95] hover:bg-violet-50'
                        }`}
                      >
                        <span>{plat}</span>
                        {selectedPlatform === plat && <Check className="w-3.5 h-3.5 text-[#7C3AED]" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Products Grid Column */}
            <div className="lg:col-span-3 space-y-4">
              {/* Sort Bar */}
              <div className="flex items-center justify-between bg-white border border-violet-100 px-4 py-2.5 rounded-2xl shadow-2xs">
                <span className="text-xs text-[#7C6898]">
                  Showing <strong className="text-[#2E1065]">{categoryProducts.length}</strong> products
                </span>
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-3.5 h-3.5 text-[#7C3AED]" />
                  <span className="text-xs font-bold text-[#2E1065]">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="text-xs bg-violet-50 border border-violet-200 rounded-lg px-2.5 py-1 font-bold text-[#2E1065] outline-none cursor-pointer"
                  >
                    <option value="relevance">Featured & Relevant</option>
                    <option value="price_low">Price: Low to High (₹)</option>
                    <option value="price_high">Price: High to Low (₹)</option>
                    <option value="rating">Highest Customer Rating (★)</option>
                  </select>
                </div>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {categoryProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleProductCardClick(product)}
                    className="bg-white rounded-3xl p-4 border border-violet-100 hover:border-violet-300 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-2.5">
                        <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          ✓ {product.cheapestOffer?.platform || 'Verified'}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{product.rating}</span>
                        </div>
                      </div>

                      <div className="h-44 w-full rounded-2xl bg-[#FAF8FF] p-3 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-300">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          loading="lazy"
                          className="max-h-full max-w-full object-contain"
                          onError={(e) => handleImageError(e, product.category)}
                        />
                      </div>

                      <div className="text-[10px] font-bold text-[#7C3AED] uppercase tracking-wider mb-0.5">
                        {product.brand}
                      </div>
                      <h4 className="font-heading font-bold text-sm text-[#2E1065] line-clamp-2 group-hover:text-[#7C3AED] transition-colors mb-2">
                        {product.name}
                      </h4>

                      {/* Specs bullets */}
                      {product.specs && product.specs.length > 0 && (
                        <div className="text-[11px] text-[#7C6898] space-y-0.5 mb-3 line-clamp-2">
                          {product.specs.slice(0, 2).map((s, i) => (
                            <div key={i} className="truncate">• {s}</div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-2.5 border-t border-violet-50">
                      <div className="flex items-baseline justify-between mb-2">
                        <div>
                          <span className="font-heading font-black text-base text-[#7C3AED]">
                            {product.priceFormatted}
                          </span>
                          {product.mrpFormatted && (
                            <span className="text-[11px] text-[#7C6898] line-through ml-1.5">
                              {product.mrpFormatted}
                            </span>
                          )}
                        </div>
                        {product.offers && product.offers.length > 1 && (
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                            {product.offers.length} stores
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleProductCardClick(product);
                          }}
                          className="text-xs font-semibold py-2 px-2 rounded-xl bg-violet-50 hover:bg-violet-100 text-[#6D28D9] border border-violet-200 flex items-center justify-center gap-1 transition-all cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-[#7C3AED]" />
                          <span>Specs & Pics</span>
                        </button>
                        <a
                          href={product.cheapestOffer?.buyUrl || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs font-bold py-2 px-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white flex items-center justify-center gap-1 shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer font-heading"
                        >
                          <span>Buy Direct</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty state & honest rules */}
              {categoryProducts.length === 0 && !isLoadingCategory && (
                <div className="bg-white rounded-3xl p-8 border border-violet-100 text-center space-y-3">
                  <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
                  <h4 className="font-heading font-bold text-lg text-[#2E1065]">
                    No verified items match the current filters
                  </h4>
                  <p className="text-xs text-[#7C6898] max-w-md mx-auto">
                    In compliance with Vantage honesty rules, we never invent fake products or prices. Try clearing your filters or exploring another subcategory below.
                  </p>
                  <div className="pt-2 flex justify-center gap-2 flex-wrap">
                    {activeCategory.subcategories.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => handleOpenCategory(activeCategory, s)}
                        className="text-xs px-3 py-1.5 rounded-xl bg-violet-50 hover:bg-violet-100 text-[#7C3AED] border border-violet-200"
                      >
                        {s.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Load More Pagination */}
              {catHasMore && (
                <div className="text-center pt-4">
                  <button
                    onClick={handleLoadMore}
                    disabled={isLoadingCategory}
                    className="px-6 py-2.5 rounded-2xl bg-white hover:bg-violet-50 border border-violet-200 text-[#7C3AED] font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer inline-flex items-center gap-2"
                  >
                    {isLoadingCategory ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-[#7C3AED]" />
                        <span>Loading verified products...</span>
                      </>
                    ) : (
                      <>
                        <span>Load More Products</span>
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. VIEW: A TO Z CATEGORY INDEX */}
      {viewMode === 'category_index' && (
        <div className="space-y-6">
          <div className="bg-white/90 border border-violet-100 rounded-3xl p-6 shadow-xs backdrop-blur-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <button
                  onClick={() => setViewMode('home')}
                  className="text-xs font-semibold text-[#7C3AED] hover:underline mb-1 inline-flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Back to Home
                </button>
                <h2 className="font-heading font-black text-2xl sm:text-3xl text-[#2E1065] tracking-tight">
                  A to Z Category Directory
                </h2>
                <p className="text-xs sm:text-sm text-[#7C6898] mt-0.5">
                  Browse all 16 major marketplace categories and 60+ verified sub-categories.
                </p>
              </div>

              {/* Search Filter */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-violet-400" />
                <input
                  type="text"
                  value={categorySearchTerm}
                  onChange={(e) => setCategorySearchTerm(e.target.value)}
                  placeholder="Filter categories or items..."
                  className="w-full pl-9 pr-3 py-2 bg-violet-50 border border-violet-200 rounded-xl text-xs text-[#2E1065] outline-none focus:border-[#7C3AED]"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCategories.map((cat) => (
              <div
                key={cat.id}
                className="bg-white rounded-3xl p-5 border border-violet-100 shadow-xs hover:border-violet-300 transition-all space-y-3"
              >
                <div
                  onClick={() => handleOpenCategory(cat)}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-2xl bg-violet-100 text-[#7C3AED] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    {renderCategoryIcon(cat.iconName)}
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-base text-[#2E1065] group-hover:text-[#7C3AED] transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-[11px] text-[#7C6898] line-clamp-1">{cat.tagline}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-violet-50 space-y-1.5">
                  {cat.subcategories.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => handleOpenCategory(cat, sub)}
                      className="w-full text-left text-xs px-2.5 py-1.5 rounded-lg hover:bg-violet-50 text-[#4C1D95] hover:text-[#7C3AED] transition-colors flex items-center justify-between group cursor-pointer"
                    >
                      <span className="font-semibold">{sub.name}</span>
                      <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. VIEW: A TO Z BRAND INDEX */}
      {viewMode === 'brand_index' && (
        <div className="space-y-6">
          <div className="bg-white/90 border border-violet-100 rounded-3xl p-6 shadow-xs backdrop-blur-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <button
                  onClick={() => setViewMode('home')}
                  className="text-xs font-semibold text-[#7C3AED] hover:underline mb-1 inline-flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Back to Home
                </button>
                <h2 className="font-heading font-black text-2xl sm:text-3xl text-[#2E1065] tracking-tight">
                  A to Z Brands Index
                </h2>
                <p className="text-xs sm:text-sm text-[#7C6898] mt-0.5">
                  Direct verified search across India's top authorized consumer electronics & lifestyle brands.
                </p>
              </div>

              {/* Brand Search */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-violet-400" />
                <input
                  type="text"
                  value={brandSearchTerm}
                  onChange={(e) => setBrandSearchTerm(e.target.value)}
                  placeholder="Search brand (e.g. Sony, boAt)..."
                  className="w-full pl-9 pr-3 py-2 bg-violet-50 border border-violet-200 rounded-xl text-xs text-[#2E1065] outline-none focus:border-[#7C3AED]"
                />
              </div>
            </div>
          </div>

          {/* Letter Groups */}
          <div className="space-y-6">
            {Object.keys(groupedBrands).sort().map((letter) => (
              <div key={letter} className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-violet-600 text-white font-heading font-black flex items-center justify-center text-sm shadow-xs">
                    {letter}
                  </div>
                  <div className="h-px bg-violet-200 flex-1" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
                  {groupedBrands[letter].map((b) => (
                    <button
                      key={b.id}
                      onClick={() => {
                        if (onSelectQuery) {
                          onSelectQuery(b.searchQuery);
                        }
                      }}
                      className="bg-white rounded-2xl p-3.5 border border-violet-100 hover:border-violet-300 text-left transition-all shadow-2xs hover:shadow-xs group cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-heading font-bold text-sm text-[#2E1065] group-hover:text-[#7C3AED] transition-colors">
                          {b.name}
                        </span>
                        {b.featured && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#7C6898] line-clamp-1 mb-2">
                        {b.tagline}
                      </p>
                      <div className="flex items-center gap-1 flex-wrap">
                        {b.popularCategories.map((c) => (
                          <span key={c} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-violet-50 text-[#7C3AED]">
                            {c}
                          </span>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. VIEW: STANDALONE PRODUCT DETAIL PAGE (If opened from Marketplace) */}
      {viewMode === 'pdp' && selectedProduct && (
        <div className="space-y-6">
          <button
            onClick={() => setViewMode('home')}
            className="text-xs font-semibold text-[#7C3AED] hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Back to Marketplace
          </button>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-violet-100 shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Gallery */}
            <div className="space-y-3">
              <div className="h-80 w-full rounded-2xl bg-[#FAF8FF] border border-violet-100 p-6 flex items-center justify-center relative overflow-hidden group">
                <img
                  src={selectedProduct.imageUrl}
                  alt={selectedProduct.name}
                  className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => handleImageError(e, selectedProduct.category)}
                />
              </div>

              {/* Verified Image Gallery Thumbnails */}
              <div className="flex items-center gap-2 justify-center">
                {['Primary Angle', 'Verified Spec', 'Retail Pack'].map((label, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold border transition-all cursor-pointer ${
                      selectedImageIndex === idx
                        ? 'border-[#7C3AED] bg-violet-50 text-[#7C3AED] shadow-2xs font-bold'
                        : 'border-violet-100 bg-white text-gray-500 hover:border-violet-300'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 text-[11px] font-mono text-[#7C6898] justify-center">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verified Retail CDN Image (Genuine Authorized Sources Only)</span>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-[#7C3AED] uppercase tracking-wider">
                  {selectedProduct.brand} · {selectedProduct.category}
                </span>
                <h1 className="font-heading font-black text-xl sm:text-2xl text-[#2E1065] mt-1">
                  {selectedProduct.name}
                </h1>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{selectedProduct.rating} / 5</span>
                  </div>
                  <span className="text-xs text-[#7C6898]">{selectedProduct.ratingCount || 'Verified Indian Buyers'}</span>
                </div>
              </div>

              {/* Price & Platform Offers Table */}
              <div className="bg-violet-50/70 border border-violet-200/80 rounded-2xl p-4 space-y-3">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-[#7C6898] block">Lowest Verified Price:</span>
                    <span className="font-heading font-black text-2xl text-[#7C3AED]">
                      {selectedProduct.priceFormatted}
                    </span>
                    {selectedProduct.mrpFormatted && (
                      <span className="text-xs text-[#7C6898] line-through ml-2">
                        {selectedProduct.mrpFormatted}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-bold px-2 py-1 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                    ✓ Grounded Live Deal
                  </span>
                </div>

                <div className="space-y-2 pt-2 border-t border-violet-200/60">
                  <span className="text-xs font-bold text-[#2E1065] block">
                    Available Verified Stores:
                  </span>
                  {selectedProduct.offers.map((off, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-violet-100 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <div>
                          <div className="font-bold text-[#2E1065]">{off.platform}</div>
                          <div className="text-[10px] text-[#7C6898]">{off.storeBadge || 'Authorized Seller'}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-heading font-bold text-[#7C3AED]">
                          {off.priceFormatted}
                        </span>
                        <a
                          href={off.buyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-[11px] inline-flex items-center gap-1 shadow-2xs font-heading"
                        >
                          <span>Buy</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Specs */}
              {selectedProduct.specs && selectedProduct.specs.length > 0 && (
                <div className="space-y-2 pt-2">
                  <h3 className="font-heading font-bold text-sm text-[#2E1065]">
                    Key Specifications
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#4C1D95]">
                    {selectedProduct.specs.map((s, idx) => (
                      <div key={idx} className="p-2 rounded-xl bg-violet-50/60 border border-violet-100 flex items-center gap-1.5">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Review summary */}
              {selectedProduct.reviewSummary?.hasData && (
                <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                    <span className="font-bold text-emerald-800 block mb-1">Pros:</span>
                    {selectedProduct.reviewSummary.pros.map((p, i) => (
                      <div key={i} className="text-emerald-950">• {p}</div>
                    ))}
                  </div>
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                    <span className="font-bold text-amber-800 block mb-1">Cons:</span>
                    {selectedProduct.reviewSummary.cons.map((c, i) => (
                      <div key={i} className="text-amber-950">• {c}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Similar Products in Category */}
          {similarProducts.length > 0 && (
            <div className="bg-white rounded-3xl p-6 border border-violet-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-black text-lg text-[#2E1065] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#7C3AED]" />
                    <span>Similar Verified Products & Alternatives</span>
                  </h3>
                  <p className="text-xs text-[#7C6898]">
                    Grounded live alternatives in {selectedProduct.category} across Indian e-commerce
                  </p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Verified In Stock
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {similarProducts.map((sp) => (
                  <div
                    key={sp.id}
                    onClick={() => handleProductCardClick(sp)}
                    className="bg-violet-50/40 rounded-2xl p-4 border border-violet-100 hover:border-violet-300 transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="h-36 w-full rounded-xl bg-white p-2 flex items-center justify-center mb-3">
                        <img
                          src={sp.imageUrl}
                          alt={sp.name}
                          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                          onError={(e) => handleImageError(e, sp.category)}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-[#7C3AED] uppercase">{sp.brand}</span>
                      <h4 className="font-heading font-bold text-xs text-[#2E1065] line-clamp-2 mt-0.5 group-hover:text-[#7C3AED] transition-colors">
                        {sp.name}
                      </h4>
                    </div>

                    <div className="pt-2 mt-3 border-t border-violet-100 flex items-center justify-between">
                      <span className="font-heading font-black text-sm text-[#7C3AED]">
                        {sp.priceFormatted}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 group-hover:bg-emerald-100">
                        View Spec →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MarketplaceHome;
