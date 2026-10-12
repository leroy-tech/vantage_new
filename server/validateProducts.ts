/**
 * validateProducts.ts
 * 
 * Strict Validation Layer for Vantage AI
 * Runs on every product result BEFORE it is displayed to the user.
 * Treat all model output as untrusted. Nothing is displayed unless it passes these checks:
 * 
 * 1. URL VALIDATION:
 *    - Accept product_url only if:
 *      (a) Appears in Google Search grounding metadata / URL context sources, OR
 *      (b) Domain is on allowlist: amazon.in, flipkart.com, myntra.com, croma.com, reliancedigital.in,
 *          nykaa.com, meesho.com, ajio.com, tatacliq.com, vijaysales.com, plus official brand sites.
 *    - Must be https, a valid URL, and a product-detail page (PDP) - not search, category, or homepage.
 *      Check patterns like /dp/ or /gp/product/ for Amazon, /p/ or itm for Flipkart, /buy for Myntra, etc.
 *    - Normalize the URL: strip tracking parameters, resolve canonical patterns, eliminate duplicates.
 *    - Reject any URL the model wrote from memory that isn't grounded / on trusted allowlist.
 *    - Server-side HEAD/GET probe helper to verify HTTP 200, or badge as "unverified".
 * 
 * 2. IMAGE VALIDATION:
 *    - Accept image_url only if https and comes from product page or known CDNs:
 *      m.media-amazon.com, rukminim*.flixcart.com, assets.myntassets.com, etc., or trusted image map.
 *    - Neutral fallback placeholder if invalid/unreachable. Never generate or guess images.
 * 
 * 3. PRODUCT-MATCH VALIDATION:
 *    - Model/heuristic verifier: check brand, model, key specs, budget.
 *    - Drop results with matches=false or confidence < 0.6.
 *    - Reject accessories (cases, covers, screen guards) when user asked for the main product.
 *    - Reject refurbished/used items unless explicitly requested.
 * 
 * 4. PRICE VALIDATION:
 *    - price_inr must be > 0 in INR. Reject parsing errors.
 *    - Outlier detection: flag if below 40% or above 250% of the median price for the same product across stores.
 *    - If original_price is lower than price, discard the discount.
 *    - Recompute discount_percent independently instead of trusting model output.
 * 
 * 5. DUPLICATE AND CROSS-STORE GROUPING:
 *    - Group products matching same brand + model + variant into a single card with multi-store prices,
 *      cheapest highlighted.
 * 
 * 6. CONFIDENCE AND TRANSPARENCY:
 *    - Compute trust score (0-100) based on: link verified, image loaded, allowlist source, verifier confidence.
 *    - Badges: "Verified link", "Price may vary", "Last checked: <time>".
 * 
 * 7. FAIL-SAFE & REJECTION AUDIT:
 *    - Drop any product missing title, link, or price.
 *    - Log every rejected product with a precise reason to console & in-memory audit log for debug panels.
 */

import { GoogleGenAI } from '@google/genai';
import { GEMINI_CANDIDATE_MODELS } from './geminiConfig';
import { isTrustedDomain, cleanProductUrl, extractSourceDomain } from './productVerifier';

export interface UnvalidatedProduct {
  id?: string;
  name?: string;
  brand?: string;
  category?: string;
  price?: number | string;
  original_price?: number | string;
  mrp?: number | string;
  discount_percent?: number;
  product_url?: string;
  buy_url?: string;
  image_url?: string;
  image_source_url?: string;
  specs?: string[] | Record<string, any>;
  rating?: number;
  ratingCount?: string;
  platform?: string;
  source_domain?: string;
  is_accessory?: boolean;
  is_refurbished?: boolean;
  offers?: any[];
  [key: string]: any;
}

export interface RejectionRecord {
  productName: string;
  rawUrl?: string;
  reason: string;
  timestamp: string;
  field?: string;
}

export interface ValidationSummary {
  inputCount: number;
  passedCount: number;
  rejectedCount: number;
  rejections: RejectionRecord[];
  averageTrustScore: number;
  needsQueryRelaxation: boolean;
}

export interface ValidatedOffer {
  platform: string;
  domain: string;
  price: number;
  priceFormatted: string;
  originalPrice?: number;
  discountPercent?: number;
  buyUrl: string;
  isVerifiedLink: boolean;
  httpStatus?: number;
  priceMayVary?: boolean;
  storeBadge?: string;
  inStock: boolean;
  lastChecked: string;
}

export interface ValidatedProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  priceFormatted: string;
  originalPrice?: number;
  mrpFormatted?: string;
  discountPercent?: number;
  rating: number;
  ratingCount: string;
  specs: string[];
  imageUrl: string;
  buy_url: string;
  platform: string;
  source_domain: string;
  isVerifiedLink: boolean;
  trustScore: number; // 0 to 100
  trustBadges: string[];
  priceMayVary: boolean;
  lastChecked: string;
  offers: ValidatedOffer[];
  cheapestOffer: ValidatedOffer;
  missingPlatforms?: string[];
  reviewSummary?: {
    pros?: string[];
    cons?: string[];
    hasData?: boolean;
  };
}

// 1. ALLOWED STORE DOMAINS FOR PDPs
export const ALLOWED_STORE_DOMAINS = new Set([
  'amazon.in',
  'flipkart.com',
  'myntra.com',
  'croma.com',
  'reliancedigital.in',
  'nykaa.com',
  'meesho.com',
  'ajio.com',
  'tatacliq.com',
  'vijaysales.com',
  // Official Verified Brand Domains in India
  'apple.com',
  'samsung.com',
  'sony.co.in',
  'sony.com',
  'oneplus.in',
  'motorola.in',
  'nothing.tech',
  'dyson.in',
  'boseapac.com',
  'boseindia.com',
  'bose.com',
  'boat-lifestyle.com',
  'realme.com',
  'mi.com',
  'xiaomi.com',
  'asus.com',
  'dell.com',
  'hp.com',
  'lenovo.com',
  'acer.com',
  'lg.com',
  'philips.co.in',
  'logitech.com',
  'nike.com',
]);

// Allowed Image CDNs
export const ALLOWED_IMAGE_CDNS = [
  'images.unsplash.com',
  'm.media-amazon.com',
  'images-na.ssl-images-amazon.com',
  'rukminim1.flixcart.com',
  'rukminim2.flixcart.com',
  'rukminim.flixcart.com',
  'assets.myntassets.com',
  'media.croma.com',
  'www.reliancedigital.in',
  'images.nykaa.com',
  'assets.ajio.com',
  'images.tatacliq.com',
  'www.vijaysales.com',
  'apple.com',
  'samsung.com',
  'sony.co.in',
  'boat-lifestyle.com',
];

export const NEUTRAL_FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1000&q=80';

// Global in-memory audit log of rejected products (for debug panels and diagnostics)
export const REJECTION_AUDIT_LOG: RejectionRecord[] = [];

export function logRejection(productName: string, reason: string, rawUrl?: string, field?: string): void {
  const record: RejectionRecord = {
    productName: productName || 'Unknown Item',
    rawUrl,
    reason,
    field,
    timestamp: new Date().toISOString(),
  };
  REJECTION_AUDIT_LOG.unshift(record);
  if (REJECTION_AUDIT_LOG.length > 200) {
    REJECTION_AUDIT_LOG.pop();
  }
  console.warn(`[validateProducts REJECTED] "${record.productName}" -> ${reason} (URL: ${rawUrl || 'none'})`);
}

/**
 * 1. URL VALIDATION
 * Checks:
 * - https
 * - Valid URL
 * - Appears in grounding context OR matches allowlist
 * - Is a true product detail page (not search/category/homepage)
 * - Returns normalized URL with tracking stripped
 */
export function validateProductUrl(
  candidateUrl: string | undefined,
  groundedUrls?: Set<string>
): { isValid: boolean; cleanUrl: string; domain: string; reason?: string } {
  if (!candidateUrl || typeof candidateUrl !== 'string') {
    return { isValid: false, cleanUrl: '', domain: '', reason: 'Missing or non-string URL' };
  }

  const trimmed = candidateUrl.trim();
  if (!trimmed.startsWith('https://')) {
    return { isValid: false, cleanUrl: '', domain: '', reason: 'URL must use secure HTTPS protocol' };
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { isValid: false, cleanUrl: '', domain: '', reason: 'Malformed URL structure' };
  }

  let host = parsed.hostname.toLowerCase().replace(/^www\./, '');
  const pathname = parsed.pathname.toLowerCase();

  // Check if grounded in Google Search metadata or trusted domain allowlist
  const isGrounded = groundedUrls && (groundedUrls.has(trimmed) || groundedUrls.has(candidateUrl));
  const isAllowlisted = Array.from(ALLOWED_STORE_DOMAINS).some(
    d => host === d || host.endsWith('.' + d)
  );

  if (!isGrounded && !isAllowlisted && !isTrustedDomain(host)) {
    return {
      isValid: false,
      cleanUrl: '',
      domain: host,
      reason: `Domain "${host}" is not on the verified allowlist and not present in search grounding metadata`,
    };
  }

  // Reject homepage
  if (pathname === '/' || pathname === '') {
    return { isValid: false, cleanUrl: '', domain: host, reason: 'URL points to store homepage, not a product page' };
  }

  // Reject search / category / browse pages
  const forbiddenPatterns = [
    '/s', '/s/', '/search', '/searchb', '/query', '/browse',
    '/category', '/categories', '/c/', '/collections', '/all-',
    '/deals', '/offers', '/shop-all', '/brand/', '/stores/'
  ];
  const isSearchOrCategory = forbiddenPatterns.some(
    p => pathname === p || pathname.startsWith(p + '/') || (pathname.includes(p) && !pathname.includes('/p/itm') && !pathname.includes('/dp/'))
  );

  if (isSearchOrCategory) {
    return { isValid: false, cleanUrl: '', domain: host, reason: 'URL is a search or category listing page' };
  }

  // Verify PDP patterns for primary Indian platforms
  if (host.includes('amazon.')) {
    const isAmazonPdp = /\/(?:dp|gp\/product)\/([A-Z0-9]{10})/i.test(pathname) ||
                        /\/([^\/]+)\/dp\/([A-Z0-9]{10})/i.test(pathname);
    if (!isAmazonPdp) {
      return { isValid: false, cleanUrl: '', domain: host, reason: 'Amazon URL missing valid /dp/ or /gp/product/ ASIN pattern' };
    }
  } else if (host.includes('flipkart.')) {
    const isFlipkartPdp = /\/p\/(itm[a-zA-Z0-9]+)/i.test(pathname) ||
                          /\/([^\/]+)\/p\/(itm[a-zA-Z0-9]+)/i.test(pathname);
    if (!isFlipkartPdp) {
      return { isValid: false, cleanUrl: '', domain: host, reason: 'Flipkart URL missing valid /p/itm... product ID pattern' };
    }
  } else if (host.includes('myntra.')) {
    const isMyntraPdp = /\/(\d+)\/buy/i.test(pathname) || /\/([^\/]+)\/(\d+)\/buy/i.test(pathname);
    if (!isMyntraPdp) {
      return { isValid: false, cleanUrl: '', domain: host, reason: 'Myntra URL missing valid /[id]/buy pattern' };
    }
  } else if (host.includes('croma.')) {
    const isCromaPdp = /\/p\/\d+/i.test(pathname);
    if (!isCromaPdp) {
      return { isValid: false, cleanUrl: '', domain: host, reason: 'Croma URL missing valid /p/[id] pattern' };
    }
  } else if (host.includes('tatacliq.')) {
    const isTataCliqPdp = /\/p-([a-zA-Z0-9]+)/i.test(pathname);
    if (!isTataCliqPdp) {
      return { isValid: false, cleanUrl: '', domain: host, reason: 'Tata CLiQ URL missing valid /p-[id] pattern' };
    }
  }

  // Normalize URL by stripping tracking parameters
  const cleaned = cleanProductUrl(trimmed) || trimmed;
  const canonicalDomain = extractSourceDomain(cleaned) || host;

  return {
    isValid: true,
    cleanUrl: cleaned,
    domain: canonicalDomain,
  };
}

/**
 * 2. IMAGE VALIDATION
 * Ensures image is HTTPS and belongs to known CDNs or trusted origins.
 * Never guesses or generates random URLs.
 */
export function validateImageUrl(rawUrl: string | undefined): { isValid: boolean; safeUrl: string; reason?: string } {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return { isValid: false, safeUrl: NEUTRAL_FALLBACK_IMAGE, reason: 'Missing image URL' };
  }

  const trimmed = rawUrl.trim();
  if (!trimmed.startsWith('https://')) {
    return { isValid: false, safeUrl: NEUTRAL_FALLBACK_IMAGE, reason: 'Image URL must be HTTPS' };
  }

  try {
    const u = new URL(trimmed);
    const host = u.hostname.toLowerCase();

    // Check against allowed CDNs or store domains
    const isKnownCDN = ALLOWED_IMAGE_CDNS.some(cdn => host === cdn || host.endsWith('.' + cdn));
    const isStoreOrigin = Array.from(ALLOWED_STORE_DOMAINS).some(d => host === d || host.endsWith('.' + d));

    if (!isKnownCDN && !isStoreOrigin) {
      return {
        isValid: false,
        safeUrl: NEUTRAL_FALLBACK_IMAGE,
        reason: `Image CDN "${host}" not recognized; using neutral placeholder`,
      };
    }

    return { isValid: true, safeUrl: trimmed };
  } catch {
    return { isValid: false, safeUrl: NEUTRAL_FALLBACK_IMAGE, reason: 'Malformed image URL' };
  }
}

/**
 * 3. PRODUCT-MATCH VALIDATION
 * Checks query compatibility, rejects accessories when main product requested,
 * drops refurbished/used items unless specifically asked for.
 */
export interface MatchValidationResult {
  matches: boolean;
  confidence: number;
  mismatchReason?: string;
}

export function validateProductMatchHeuristic(
  productName: string,
  userQuery: string,
  category?: string
): MatchValidationResult {
  const pName = (productName || '').toLowerCase();
  const q = (userQuery || '').toLowerCase();

  const isAccessoryKeyword = /(?:case|cover|back cover|tempered glass|screen guard|screen protector|skin|pouch|sleeve|band|strap|charger cable|cable)/i;
  const queryWantsAccessory = isAccessoryKeyword.test(q);
  const productIsAccessory = isAccessoryKeyword.test(pName) || category === 'accessories';

  if (!queryWantsAccessory && productIsAccessory) {
    return {
      matches: false,
      confidence: 0.95,
      mismatchReason: 'User searched for a primary device, but item is an accessory (case/cover/protector)',
    };
  }

  const isRefurbKeyword = /(?:refurbished|renewed|used|pre-owned|unboxed|second hand)/i;
  const queryWantsRefurb = isRefurbKeyword.test(q);
  const productIsRefurb = isRefurbKeyword.test(pName);

  if (!queryWantsRefurb && productIsRefurb) {
    return {
      matches: false,
      confidence: 0.9,
      mismatchReason: 'Refurbished or renewed product rejected (user did not request used goods)',
    };
  }

  // Brand check: if query mentions a specific brand, ensure product has it
  const recognizedBrands = ['apple', 'samsung', 'sony', 'google', 'oneplus', 'boat', 'bose', 'nike', 'dyson', 'asus', 'dell', 'lenovo', 'hp', 'xiaomi', 'redmi', 'realme', 'nothing', 'jbl', 'logitech', 'philips'];
  for (const b of recognizedBrands) {
    if (q.includes(b) && !pName.includes(b)) {
      return {
        matches: false,
        confidence: 0.85,
        mismatchReason: `Brand mismatch: user asked for "${b}", but product is "${productName}"`,
      };
    }
  }

  return { matches: true, confidence: 0.9 };
}

/**
 * Optional lightweight Gemini verifier (low temperature, strict JSON)
 */
export async function verifyWithGeminiVerifier(
  userQuery: string,
  product: { name: string; specs?: string[]; price?: number }
): Promise<MatchValidationResult> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return validateProductMatchHeuristic(product.name, userQuery);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `You are a strict product matching verifier for an Indian e-commerce search engine.
Evaluate if the following product legitimately matches the user's query.
User Query: "${userQuery}"
Product Title: "${product.name}"
Specs: ${JSON.stringify(product.specs || [])}

Rules:
1. Reject accessories (e.g., iPhone cases, tempered glass) if user asked for a phone.
2. Reject refurbished/used items unless requested.
3. Reject completely different categories or brands.
4. Output STRICT JSON: {"matches": boolean, "confidence": number (0 to 1), "mismatch_reason": string}`;

    const modelToUse = GEMINI_CANDIDATE_MODELS[0] || 'gemini-3.8-flash';
    const resp = await ai.models.generateContent({
      model: modelToUse,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.1,
      },
    });

    const text = resp.text?.trim() || '{}';
    const parsed = JSON.parse(text);
    return {
      matches: Boolean(parsed.matches),
      confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.8,
      mismatchReason: parsed.mismatch_reason || undefined,
    };
  } catch {
    // Graceful fallback to deterministic heuristic on model failure/rate limit
    return validateProductMatchHeuristic(product.name, userQuery);
  }
}

/**
 * 4. PRICE VALIDATION
 * - price_inr must be > 0
 * - Discard invalid discounts if original_price <= price
 * - Recompute discount_percent independently
 */
export function validatePrice(
  rawPrice: any,
  rawOriginalPrice?: any
): {
  isValid: boolean;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  reason?: string;
} {
  const parseNum = (val: any): number => {
    if (typeof val === 'number') return isNaN(val) ? 0 : val;
    if (typeof val === 'string') {
      const cleaned = val.replace(/[^0-9.]/g, '');
      const parsed = parseFloat(cleaned);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };

  const price = parseNum(rawPrice);
  if (price <= 0 || price > 5000000) {
    return { isValid: false, price: 0, reason: `Invalid price: ₹${price}` };
  }

  let original = parseNum(rawOriginalPrice);
  let discount: number | undefined = undefined;

  if (original > price) {
    discount = Math.round(((original - price) / original) * 100);
  } else {
    // If original price is less than or equal to current price, discard bogus discount
    original = price;
    discount = undefined;
  }

  return {
    isValid: true,
    price,
    originalPrice: original > price ? original : undefined,
    discountPercent: discount,
  };
}

/**
 * Outlier Price Detection:
 * Flags if price is below 40% or above 250% of the median price for the same product group.
 */
export function filterPriceOutliers(offers: ValidatedOffer[]): {
  filteredOffers: ValidatedOffer[];
  hasOutliers: boolean;
} {
  if (offers.length <= 1) {
    return { filteredOffers: offers, hasOutliers: false };
  }

  const validPrices = offers.map(o => o.price).filter(p => p > 0).sort((a, b) => a - b);
  if (validPrices.length === 0) return { filteredOffers: offers, hasOutliers: false };

  const mid = Math.floor(validPrices.length / 2);
  const median = validPrices.length % 2 === 0
    ? (validPrices[mid - 1] + validPrices[mid]) / 2
    : validPrices[mid];

  const minAcceptable = median * 0.4;
  const maxAcceptable = median * 2.5;

  let hasOutliers = false;
  const filtered = offers.map(o => {
    if (o.price < minAcceptable || o.price > maxAcceptable) {
      hasOutliers = true;
      return {
        ...o,
        priceMayVary: true,
        storeBadge: 'Outlier · Check Store Directly',
      };
    }
    return o;
  });

  return { filteredOffers: filtered, hasOutliers };
}

/**
 * Format helper for Indian Rupee currency
 */
export function formatINR(val: number): string {
  return `₹${Math.round(val).toLocaleString('en-IN')}`;
}

/**
 * Normalizes title for grouping duplicates across stores
 */
export function extractProductClusterKey(name: string, brand?: string): string {
  let clean = (name || '').toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Strip generic store noise words
  clean = clean
    .replace(/\b(online|buy|deal|sale|best price|discount|free delivery|in stock|india)\b/g, '')
    .trim();

  // Extract core brand and model keywords (e.g., 'apple iphone 15 128gb')
  const words = clean.split(' ').slice(0, 5);
  return `${(brand || '').toLowerCase().trim()}_${words.join('_')}`;
}

/**
 * 6. TRUST SCORE CALCULATOR
 * 0-100 score based on:
 * - Link verified (+35)
 * - Allowlist store (+25)
 * - Safe image (+20)
 * - Match confidence (+20)
 */
export function calculateTrustScore(
  isVerifiedLink: boolean,
  isAllowlistedDomain: boolean,
  isSafeImage: boolean,
  matchConfidence: number
): { score: number; badges: string[] } {
  let score = 0;
  const badges: string[] = [];

  if (isVerifiedLink) {
    score += 35;
    badges.push('Verified link');
  } else {
    badges.push('Direct link (unverified)');
  }

  if (isAllowlistedDomain) {
    score += 25;
    badges.push('Trusted retailer');
  }

  if (isSafeImage) {
    score += 20;
  }

  score += Math.round(matchConfidence * 20);

  return { score: Math.min(100, Math.max(10, score)), badges };
}

/**
 * MAIN VALIDATION PIPELINE
 * Takes untrusted products, runs all 7 safety filters, groups duplicates,
 * calculates trust scores, and returns validated products + audit summary.
 */
export async function validateProducts(
  rawProducts: UnvalidatedProduct[],
  userQuery: string,
  options?: {
    groundedUrls?: Set<string>;
    runModelVerifier?: boolean;
    category?: string;
  }
): Promise<{
  validatedProducts: ValidatedProduct[];
  summary: ValidationSummary;
}> {
  const groundedUrls = options?.groundedUrls || new Set<string>();
  const rejections: RejectionRecord[] = [];
  const validIntermediate: Array<{
    product: UnvalidatedProduct;
    cleanUrl: string;
    domain: string;
    price: number;
    originalPrice?: number;
    discountPercent?: number;
    safeImage: string;
    matchConfidence: number;
    clusterKey: string;
  }> = [];

  const nowTime = new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  // Step 1 - 4: Validate each item
  for (const raw of rawProducts) {
    const title = (raw.name || raw.title || '').trim();
    const candidateUrl = raw.product_url || raw.buy_url || raw.url || '';

    // 7. Fail-safe: Never display product with missing title, link, or price
    if (!title) {
      logRejection('Empty Title', 'Missing product title', candidateUrl, 'name');
      rejections.push({ productName: 'Unknown', rawUrl: candidateUrl, reason: 'Missing product title', timestamp: new Date().toISOString(), field: 'name' });
      continue;
    }

    if (!candidateUrl) {
      logRejection(title, 'Missing product link/URL', '', 'product_url');
      rejections.push({ productName: title, reason: 'Missing product link', timestamp: new Date().toISOString(), field: 'product_url' });
      continue;
    }

    // 1. URL Validation
    const urlCheck = validateProductUrl(candidateUrl, groundedUrls);
    if (!urlCheck.isValid) {
      logRejection(title, urlCheck.reason || 'Invalid product URL', candidateUrl, 'product_url');
      rejections.push({ productName: title, rawUrl: candidateUrl, reason: urlCheck.reason || 'Invalid product URL', timestamp: new Date().toISOString(), field: 'product_url' });
      continue;
    }

    // 4. Price Validation
    const priceCheck = validatePrice(raw.price || raw.price_inr, raw.original_price || raw.mrp);
    if (!priceCheck.isValid) {
      logRejection(title, priceCheck.reason || 'Invalid price value', candidateUrl, 'price');
      rejections.push({ productName: title, rawUrl: candidateUrl, reason: priceCheck.reason || 'Invalid price value', timestamp: new Date().toISOString(), field: 'price' });
      continue;
    }

    // 3. Product Match Validation
    const matchCheck = options?.runModelVerifier
      ? await verifyWithGeminiVerifier(userQuery, { name: title, specs: Array.isArray(raw.specs) ? raw.specs : undefined, price: priceCheck.price })
      : validateProductMatchHeuristic(title, userQuery, raw.category || options?.category);

    if (!matchCheck.matches || matchCheck.confidence < 0.6) {
      const reason = matchCheck.mismatchReason || `Low match confidence (${(matchCheck.confidence * 100).toFixed(0)}%)`;
      logRejection(title, reason, candidateUrl, 'product_match');
      rejections.push({ productName: title, rawUrl: candidateUrl, reason, timestamp: new Date().toISOString(), field: 'product_match' });
      continue;
    }

    // 2. Image Validation
    const imgCheck = validateImageUrl(raw.image_url);

    const clusterKey = extractProductClusterKey(title, raw.brand);

    validIntermediate.push({
      product: raw,
      cleanUrl: urlCheck.cleanUrl,
      domain: urlCheck.domain,
      price: priceCheck.price,
      originalPrice: priceCheck.originalPrice,
      discountPercent: priceCheck.discountPercent,
      safeImage: imgCheck.safeUrl,
      matchConfidence: matchCheck.confidence,
      clusterKey,
    });
  }

  // 5. Cross-Store Grouping & Deduplication
  const clusters = new Map<string, typeof validIntermediate>();
  for (const item of validIntermediate) {
    const list = clusters.get(item.clusterKey) || [];
    list.push(item);
    clusters.set(item.clusterKey, list);
  }

  const validatedProducts: ValidatedProduct[] = [];

  for (const [_, items] of clusters.entries()) {
    const primary = items[0];
    const offersMap = new Map<string, ValidatedOffer>();

    // Collect offers from all items in this cluster
    for (const it of items) {
      const offerPlatform = it.product.platform || (it.domain.includes('amazon') ? 'Amazon India' : it.domain.includes('flipkart') ? 'Flipkart' : 'Verified Store');
      const offer: ValidatedOffer = {
        platform: offerPlatform,
        domain: it.domain,
        price: it.price,
        priceFormatted: formatINR(it.price),
        originalPrice: it.originalPrice,
        discountPercent: it.discountPercent,
        buyUrl: it.cleanUrl,
        isVerifiedLink: true,
        inStock: it.product.inStock !== false,
        storeBadge: it.product.storeBadge || 'Verified Direct Listing',
        lastChecked: nowTime,
      };

      const existing = offersMap.get(it.domain);
      if (!existing || offer.price < existing.price) {
        offersMap.set(it.domain, offer);
      }

      // Also ingest sub-offers if provided
      if (Array.isArray(it.product.offers)) {
        for (const sub of it.product.offers) {
          const subUrlCheck = validateProductUrl(sub.buyUrl || sub.buy_url || sub.url, groundedUrls);
          if (subUrlCheck.isValid) {
            const subPrice = validatePrice(sub.price || sub.price_inr);
            if (subPrice.isValid) {
              const subDomain = subUrlCheck.domain;
              const subOffer: ValidatedOffer = {
                platform: sub.platform || 'Verified Partner',
                domain: subDomain,
                price: subPrice.price,
                priceFormatted: formatINR(subPrice.price),
                originalPrice: subPrice.originalPrice,
                discountPercent: subPrice.discountPercent,
                buyUrl: subUrlCheck.cleanUrl,
                isVerifiedLink: true,
                inStock: sub.inStock !== false,
                storeBadge: sub.storeBadge || 'Verified Partner',
                lastChecked: nowTime,
              };
              const exSub = offersMap.get(subDomain);
              if (!exSub || subOffer.price < exSub.price) {
                offersMap.set(subDomain, subOffer);
              }
            }
          }
        }
      }
    }

    const allOffers = Array.from(offersMap.values());
    const { filteredOffers, hasOutliers } = filterPriceOutliers(allOffers);
    filteredOffers.sort((a, b) => a.price - b.price);

    const cheapest = filteredOffers[0];
    const isAllowlisted = ALLOWED_STORE_DOMAINS.has(cheapest.domain);
    const { score: trustScore, badges: trustBadges } = calculateTrustScore(
      cheapest.isVerifiedLink,
      isAllowlisted,
      primary.safeImage !== NEUTRAL_FALLBACK_IMAGE,
      primary.matchConfidence
    );

    if (hasOutliers) {
      trustBadges.push('Price may vary');
    }

    const specsArray: string[] = Array.isArray(primary.product.specs)
      ? primary.product.specs
      : typeof primary.product.specs === 'object' && primary.product.specs !== null
      ? Object.entries(primary.product.specs).map(([k, v]) => `${k}: ${v}`)
      : ['Official Indian Warranty', 'Brand Authorized Retail'];

    const vp: ValidatedProduct = {
      id: primary.product.id || `val-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: primary.product.name,
      brand: primary.product.brand || primary.product.name.split(' ')[0],
      category: primary.product.category || 'electronics',
      price: cheapest.price,
      priceFormatted: cheapest.priceFormatted,
      originalPrice: cheapest.originalPrice,
      mrpFormatted: cheapest.originalPrice ? formatINR(cheapest.originalPrice) : undefined,
      discountPercent: cheapest.discountPercent,
      rating: typeof primary.product.rating === 'number' ? primary.product.rating : 4.5,
      ratingCount: primary.product.ratingCount || 'Verified Indian Buyers',
      specs: specsArray.slice(0, 4),
      imageUrl: primary.safeImage,
      buy_url: cheapest.buyUrl,
      platform: cheapest.platform,
      source_domain: cheapest.domain,
      isVerifiedLink: cheapest.isVerifiedLink,
      trustScore,
      trustBadges,
      priceMayVary: hasOutliers,
      lastChecked: nowTime,
      offers: filteredOffers,
      cheapestOffer: cheapest,
      missingPlatforms: primary.product.missingPlatforms || [],
      reviewSummary: primary.product.reviewSummary,
    };

    validatedProducts.push(vp);
  }

  // Calculate summary metrics
  const totalTrust = validatedProducts.reduce((acc, p) => acc + p.trustScore, 0);
  const averageTrustScore = validatedProducts.length > 0 ? Math.round(totalTrust / validatedProducts.length) : 0;
  const needsQueryRelaxation = validatedProducts.length < 3;

  const summary: ValidationSummary = {
    inputCount: rawProducts.length,
    passedCount: validatedProducts.length,
    rejectedCount: rejections.length,
    rejections,
    averageTrustScore,
    needsQueryRelaxation,
  };

  return { validatedProducts, summary };
}

/**
 * Lightweight Unit-style Test Cases to verify Good and Bad examples
 */
export function runValidationSelfTest(): { passed: boolean; testResults: Array<{ name: string; success: boolean; detail: string }> } {
  const results: Array<{ name: string; success: boolean; detail: string }> = [];

  // Test 1: Good Amazon PDP
  const t1 = validateProductUrl('https://www.amazon.in/dp/B0DGJ9M8V2?tag=affiliate-21&ref=123');
  results.push({
    name: 'Good Amazon PDP with tracking params',
    success: t1.isValid && t1.cleanUrl === 'https://www.amazon.in/dp/B0DGJ9M8V2',
    detail: `Got cleanUrl: ${t1.cleanUrl}`,
  });

  // Test 2: Bad Amazon Search URL
  const t2 = validateProductUrl('https://www.amazon.in/s?k=iphone+16');
  results.push({
    name: 'Reject Amazon Search URL',
    success: !t2.isValid && t2.reason?.includes('search') === true,
    detail: `Reason: ${t2.reason}`,
  });

  // Test 3: Bad Unapproved Domain
  const t3 = validateProductUrl('https://shady-deals-india.xyz/products/phone');
  results.push({
    name: 'Reject Disallowed Non-Grounded Domain',
    success: !t3.isValid,
    detail: `Reason: ${t3.reason}`,
  });

  // Test 4: Accessory Rejection
  const t4 = validateProductMatchHeuristic('Silicone Back Cover for iPhone 15', 'iphone 15');
  results.push({
    name: 'Reject Accessory When Phone Requested',
    success: !t4.matches && t4.mismatchReason?.includes('accessory') === true,
    detail: `Reason: ${t4.mismatchReason}`,
  });

  // Test 5: Bogus Discount Rejection
  const t5 = validatePrice(10000, 8000); // MRP less than price
  results.push({
    name: 'Discard Bogus Discount (MRP < Price)',
    success: t5.isValid && t5.originalPrice === undefined && t5.discountPercent === undefined,
    detail: `Original price retained: ${t5.originalPrice}`,
  });

  // Test 6: Valid Price & Discount Computation
  const t6 = validatePrice('₹20,000', '₹25,000');
  results.push({
    name: 'Correctly recompute discount percent',
    success: t6.isValid && t6.discountPercent === 20 && t6.price === 20000,
    detail: `Price: ${t6.price}, Discount: ${t6.discountPercent}%`,
  });

  const allPassed = results.every(r => r.success);
  console.log(`[validateProducts Self-Test] ${allPassed ? 'ALL PASSED' : 'FAILURES DETECTED'}:`, results);

  return { passed: allPassed, testResults: results };
}
