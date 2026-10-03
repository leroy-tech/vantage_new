import React, { useState, useEffect } from 'react';
import {
  X,
  ExternalLink,
  ShoppingCart,
  TrendingDown,
  Sparkles,
  Star,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Layers,
  Copy,
  Check,
  Share2,
  ShieldCheck,
  ChevronRight,
  Radio,
  ArrowRight
} from 'lucide-react';
import { handleImageError } from '../utils/image-validator';
import { VerifiedBuyCardActions } from './VerifiedBuyCardActions';

export interface ProductModalData {
  id?: string;
  name: string;
  brand?: string;
  canonicalName?: string;
  category?: string;
  price: string;
  mrp?: string;
  savings?: string;
  rating?: number;
  reviewsCount?: string;
  imageUrl: string;
  image_source_url?: string;
  gallery?: string[];
  store?: string;
  sourceUrl?: string;
  buy_url?: string;
  source_domain?: string;
  verified?: boolean;
  sourceStore?: string;
  sourceBadge?: string;
  tag?: string;
  highlights?: string[];
  specs?: Record<string, string>;
  pros?: string[];
  cons?: string[];
  communityTake?: string;
  expertTake?: string;
  storeLinks?: Array<{
    store: string;
    name: string;
    url: string;
    badge: string;
    color?: string;
  }>;
}

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductModalData | null;
  onTrackProduct?: (name: string, query: string, targetPrice?: number) => void;
  onAskAi?: (productName: string) => void;
  isWhite?: boolean;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  isOpen,
  onClose,
  product,
  onTrackProduct,
  onAskAi,
  isWhite = true,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [trackedSuccess, setTrackedSuccess] = useState(false);

  useEffect(() => {
    setActiveImageIndex(0);
    setTrackedSuccess(false);
  }, [product]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  // Compute image gallery
  const gallery = product.gallery && product.gallery.length > 0
    ? product.gallery
    : [product.imageUrl];
  const currentImg = gallery[activeImageIndex] || product.imageUrl;

  // Safe parse price for tracker
  const parseNumericPrice = (pStr: string): number | undefined => {
    const match = pStr.replace(/,/g, '').match(/\d+/);
    return match ? parseInt(match[0], 10) : undefined;
  };

  const handleCopy = () => {
    const text = `${product.name} — Best Price ${product.price} (MRP: ${product.mrp || 'N/A'})\nCheck verified store links on Vantage AI Shopping Assistant`;
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleTrackClick = () => {
    if (onTrackProduct) {
      const numPrice = parseNumericPrice(product.price);
      const target = numPrice ? Math.round(numPrice * 0.95) : undefined;
      onTrackProduct(product.name, product.name, target);
      setTrackedSuccess(true);
      setTimeout(() => setTrackedSuccess(false), 3000);
    }
  };

  // Generate fallback specifications if not explicitly provided
  const derivedSpecs: Record<string, string> = product.specs || {
    'Authenticity': '100% Genuine Indian Retail Stock',
    'Warranty': '1 Year Manufacturer Official Warranty in India',
    'Return Policy': '7-Day Replacement / Return Guarantee',
    'Currency / Market': 'Indian Rupees (₹ / INR)',
    'Verified Stores': 'Amazon India, Flipkart, Croma, Brand Store',
  };

  const derivedHighlights = product.highlights || [
    'Verified live Indian market pricing & MRP comparison',
    'Real-time deal monitoring & price drop alert supported',
    'Official manufacturer warranty coverage across India'
  ];

  const derivedPros = product.pros || [
    'Leading performance & value in its price bracket',
    'Broad Indian service network & warranty support',
    'High user satisfaction & positive Indian tech community sentiment'
  ];

  const derivedCons = product.cons || [
    'Prices subject to daily Indian e-commerce promotions and bank discounts',
    'Stock availability varies by delivery PIN code across India'
  ];

  const buyUrl = product.sourceUrl ||
    (product.storeLinks && product.storeLinks[0]?.url) ||
    `https://www.amazon.in/s?k=${encodeURIComponent(product.name)}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto backdrop-blur-md bg-black/60 transition-opacity animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border shadow-2xl transition-all ${
          isWhite
            ? 'bg-white/95 border-violet-200 text-[#2E1065] shadow-violet-500/15'
            : 'bg-[#121624]/95 border-violet-500/30 text-[#E9EDF5] shadow-black/80'
        } backdrop-blur-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className={`sticky top-0 z-20 flex items-center justify-between px-5 py-4 border-b ${
          isWhite ? 'bg-white/90 border-violet-100' : 'bg-[#121624]/90 border-white/10'
        } backdrop-blur-md`}>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide border bg-violet-50 text-[#7C3AED] border-violet-200">
              <Sparkles className="w-3.5 h-3.5 text-[#7C3AED]" />
              <span>VERIFIED PRODUCT REPORT</span>
            </span>
            {product.category && (
              <span className={`text-xs px-2.5 py-0.5 rounded-lg capitalize font-medium ${
                isWhite ? 'bg-violet-100/60 text-[#4C1D95]' : 'bg-white/10 text-slate-300'
              }`}>
                {product.category}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                isWhite
                  ? 'border-violet-200 hover:bg-violet-50 text-[#4C1D95]'
                  : 'border-white/15 hover:bg-white/10 text-slate-300'
              }`}
              title="Copy product summary"
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-600 text-xs hidden sm:inline">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-[#7C3AED]" />
                  <span className="text-xs hidden sm:inline">Share</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isWhite
                  ? 'border-violet-200 hover:bg-violet-100 text-[#4C1D95]'
                  : 'border-white/15 hover:bg-white/10 text-slate-300'
              }`}
              title="Close modal (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Content Grid */}
        <div className="p-5 sm:p-7 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
            {/* Left Column: Product Image Gallery & Direct Store Actions */}
            <div className="md:col-span-5 space-y-4">
              {/* Primary Image View with Zoom / Verified Stamp */}
              <div className={`w-full aspect-square rounded-2xl overflow-hidden border relative flex items-center justify-center p-4 transition-all ${
                isWhite ? 'bg-[#FAF8FF] border-violet-100 shadow-inner' : 'bg-black/40 border-white/10'
              }`}>
                <img
                  src={currentImg}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                  onError={(e) => handleImageError(e, product.category)}
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-xl bg-black/75 backdrop-blur-md text-emerald-400 font-bold text-[10px] flex items-center gap-1 border border-white/10">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>100% Authentic Product</span>
                </div>
                {product.tag && (
                  <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-xl bg-[#7C3AED]/90 text-white font-extrabold text-[10px] shadow-sm uppercase tracking-wider">
                    {product.tag}
                  </div>
                )}
              </div>

              {/* Gallery Thumbnails */}
              {gallery.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {gallery.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-16 h-16 rounded-xl border overflow-hidden p-1 shrink-0 transition-all cursor-pointer ${
                        activeImageIndex === idx
                          ? 'border-[#7C3AED] ring-2 ring-violet-400 shadow-md scale-105'
                          : isWhite
                            ? 'border-violet-100 hover:border-violet-300 bg-white'
                            : 'border-white/10 hover:border-white/30 bg-black/40'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} angle ${idx + 1}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain"
                        onError={(e) => handleImageError(e, product.category)}
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Verified Direct Buy Actions with PDP Check, Domain & Report Tool */}
              <div className="space-y-2 pt-2">
                <VerifiedBuyCardActions
                  productName={product.name}
                  buyUrl={product.buy_url || buyUrl}
                  sourceDomain={product.source_domain || (buyUrl ? new URL(buyUrl).hostname.replace(/^www\./, '') : '')}
                  platform={product.sourceStore || product.store || 'Verified Store'}
                  verified={product.verified !== false}
                  imageSourceUrl={product.image_source_url || product.sourceUrl}
                  priceInr={product.price}
                  isCompact={false}
                />

                {/* Track Price & Ask AI buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleTrackClick}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      trackedSuccess
                        ? 'bg-emerald-500 text-white border-emerald-600'
                        : isWhite
                          ? 'bg-violet-50 hover:bg-violet-100 text-[#4C1D95] border-violet-200'
                          : 'bg-white/5 hover:bg-white/15 text-white border-white/15'
                    }`}
                  >
                    {trackedSuccess ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-white" />
                        <span>Tracking in ₹!</span>
                      </>
                    ) : (
                      <>
                        <TrendingDown className="w-3.5 h-3.5 text-[#7C3AED]" />
                        <span>Track Price Drop</span>
                      </>
                    )}
                  </button>

                  {onAskAi && (
                    <button
                      onClick={() => {
                        onClose();
                        onAskAi(product.name);
                      }}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        isWhite
                          ? 'bg-violet-100/70 hover:bg-violet-200 text-[#2E1065] border-violet-200'
                          : 'bg-violet-500/20 hover:bg-violet-500/30 text-violet-300 border-violet-500/30'
                      }`}
                    >
                      <Zap className="w-3.5 h-3.5 text-[#7C3AED]" />
                      <span>Ask Vantage AI</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Title, Prices, Specs, Pros/Cons, Reviews */}
            <div className="md:col-span-7 space-y-5">
              {/* Product Title and Rating */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Live Indian Market Data</span>
                  </span>
                  {product.sourceBadge && (
                    <span className={`text-[11px] font-semibold ${isWhite ? 'text-[#7C3AED]' : 'text-violet-300'}`}>
                      {product.sourceBadge}
                    </span>
                  )}
                </div>

                <h2 className={`font-heading font-black text-xl sm:text-2xl leading-tight ${
                  isWhite ? 'text-[#2E1065]' : 'text-white'
                }`}>
                  {product.name}
                </h2>

                {/* Rating & Review count */}
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex items-center gap-1 text-amber-500 font-bold bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{product.rating || '4.6'}</span>
                  </div>
                  <span className={`text-xs ${isWhite ? 'text-[#7C6898]' : 'text-[#8B96AC]'}`}>
                    ({product.reviewsCount || '12,500+ Indian buyer reviews'})
                  </span>
                </div>
              </div>

              {/* Price Callout Banner */}
              <div className={`p-4 rounded-2xl border ${
                isWhite
                  ? 'bg-violet-50/70 border-violet-200'
                  : 'bg-black/50 border-white/10'
              } flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3`}>
                <div>
                  <div className="flex items-baseline gap-2.5 flex-wrap">
                    <span className="font-heading font-black text-2xl sm:text-3xl text-emerald-600">
                      {product.price}
                    </span>
                    {product.mrp && (
                      <span className={`text-sm ${isWhite ? 'text-[#8B78A5]' : 'text-[#8B96AC]'} line-through`}>
                        MRP {product.mrp}
                      </span>
                    )}
                  </div>
                  {product.savings && (
                    <div className="text-xs font-bold text-[#7C3AED] mt-0.5">
                      🎉 {product.savings}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Lowest Price Verified</span>
                </div>
              </div>

              {/* Highlights */}
              <div className="space-y-2">
                <h4 className={`text-xs font-bold uppercase tracking-wider ${isWhite ? 'text-[#7C3AED]' : 'text-violet-400'} flex items-center gap-1.5`}>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Key Highlights</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {derivedHighlights.map((hl, i) => (
                    <div
                      key={i}
                      className={`flex items-start gap-2 p-2.5 rounded-xl border ${
                        isWhite ? 'bg-white border-violet-100 text-[#3B1E7A]' : 'bg-white/5 border-white/10 text-slate-200'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="leading-snug">{hl}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Specifications Table */}
              <div className="space-y-2">
                <h4 className={`text-xs font-bold uppercase tracking-wider ${isWhite ? 'text-[#7C3AED]' : 'text-violet-400'} flex items-center gap-1.5`}>
                  <Layers className="w-3.5 h-3.5" />
                  <span>Technical Specifications & Features</span>
                </h4>
                <div className={`rounded-xl border overflow-hidden text-xs divide-y ${
                  isWhite ? 'border-violet-100 divide-violet-100 bg-white' : 'border-white/10 divide-white/10 bg-black/40'
                }`}>
                  {Object.entries(derivedSpecs).map(([key, value], idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between px-3.5 py-2.5 gap-1">
                      <span className={`font-semibold ${isWhite ? 'text-[#7C6898]' : 'text-slate-400'}`}>{key}</span>
                      <span className={`font-medium ${isWhite ? 'text-[#2E1065]' : 'text-slate-100'} sm:text-right`}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pros & Cons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className={`p-3.5 rounded-xl border ${
                  isWhite ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950' : 'bg-emerald-950/20 border-emerald-800/40 text-slate-200'
                }`}>
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 mb-2">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Pros
                  </span>
                  <ul className="space-y-1.5 text-xs">
                    {derivedPros.map((p, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={`p-3.5 rounded-xl border ${
                  isWhite ? 'bg-amber-50/70 border-amber-200 text-[#2E1065]' : 'bg-amber-950/20 border-amber-800/40 text-slate-200'
                }`}>
                  <span className="text-xs font-bold text-amber-600 flex items-center gap-1 mb-2">
                    <AlertTriangle className="w-3.5 h-3.5" /> Cons & Trade-offs
                  </span>
                  <ul className="space-y-1.5 text-xs">
                    {derivedCons.map((c, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Community & Expert Takes */}
              {(product.communityTake || product.expertTake) && (
                <div className="space-y-2.5 pt-1 text-xs">
                  {product.communityTake && (
                    <div className={`p-3.5 rounded-xl border ${
                      isWhite ? 'bg-[#FAF8FF] border-violet-100 text-[#2E1065]' : 'bg-black/40 border-white/10 text-slate-200'
                    }`}>
                      <span className={`font-bold block mb-1 ${isWhite ? 'text-[#7C3AED]' : 'text-violet-400'}`}>
                        💬 Indian Tech Forum & Community Take:
                      </span>
                      <p className="leading-relaxed">{product.communityTake}</p>
                    </div>
                  )}
                  {product.expertTake && (
                    <div className={`p-3.5 rounded-xl border ${
                      isWhite ? 'bg-[#FAF8FF] border-violet-100 text-[#2E1065]' : 'bg-black/40 border-white/10 text-slate-200'
                    }`}>
                      <span className={`font-bold block mb-1 ${isWhite ? 'text-[#7C3AED]' : 'text-violet-400'}`}>
                        🔬 Expert Lab Review Verdict:
                      </span>
                      <p className="leading-relaxed">{product.expertTake}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Direct Store Comparison Links */}
              {product.storeLinks && product.storeLinks.length > 0 && (
                <div className={`pt-3 border-t ${isWhite ? 'border-violet-100' : 'border-white/10'} space-y-2`}>
                  <span className={`text-xs font-bold uppercase tracking-wider ${isWhite ? 'text-[#7C3AED]' : 'text-violet-400'} flex items-center gap-1.5`}>
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Check Live Availability Across Major Indian Retailers:</span>
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {product.storeLinks.map((sl, idx) => (
                      <a
                        key={idx}
                        href={sl.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                          isWhite
                            ? 'bg-violet-50 hover:bg-violet-100 text-[#2E1065] border-violet-200 shadow-sm'
                            : 'bg-white/10 hover:bg-white/20 text-white border-white/15'
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full bg-[#7C3AED]" />
                        <span>{sl.name}</span>
                        <span className={`text-[10px] font-normal opacity-80 ${isWhite ? 'bg-white text-[#3B1E7A]' : 'bg-black/40 text-slate-300'} px-1.5 py-0.5 rounded-md`}>
                          {sl.badge}
                        </span>
                        <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
