import { ParsedQuery } from './queryUnderstanding';
import { GroundedProduct } from './multiPlatformSearch';

export interface ScoredProduct extends GroundedProduct {
  relevanceScore: number;
  matchReasons: string[];
  isExactModelMatch?: boolean;
}

/**
 * Calculates a comprehensive 0-100 relevance score for a product given a parsed query
 */
export function calculateProductRelevance(
  product: GroundedProduct,
  parsed: ParsedQuery
): { score: number; reasons: string[]; isEligible: boolean } {
  const pName = (product.name || '').toLowerCase();
  const pBrand = (product.brand || '').toLowerCase();
  const pCat = (product.category || '').toLowerCase();
  const reasons: string[] = [];

  // Accessory check: strict filter
  const productIsAccessory = /(?:case|cover|back cover|tempered glass|screen protector|skin|pouch|sleeve|strap)/i.test(pName);
  
  if (parsed.is_accessory && !productIsAccessory) {
    // User specifically asked for an accessory (e.g. case) but this is a phone/laptop
    return { score: 5, reasons: ['Not an accessory'], isEligible: false };
  }
  if (!parsed.is_accessory && productIsAccessory) {
    // User asked for a main device, but this is a case/cover
    return { score: 5, reasons: ['Excluded accessory'], isEligible: false };
  }

  // Strict Category Mismatch Filter:
  if (parsed.category_slug && parsed.category_slug !== 'electronics') {
    const isCategoryMatch = 
      (parsed.category_slug === 'phones' && (pCat === 'phones' || pName.includes('phone') || pName.includes('pixel') || pName.includes('galaxy') || pName.includes('iphone') || pName.includes('g85') || pName.includes('narzo') || pName.includes('cmf'))) ||
      (parsed.category_slug === 'shoes' && (pCat === 'shoes' || pName.includes('shoe') || pName.includes('sneaker') || pName.includes('running') || pName.includes('air max') || pName.includes('pegasus'))) ||
      (parsed.category_slug === 'laptops' && (pCat === 'laptops' || pName.includes('laptop') || pName.includes('macbook') || pName.includes('notebook') || pName.includes('nitro') || pName.includes('loq') || pName.includes('vivobook'))) ||
      (parsed.category_slug === 'audio' && (pCat === 'audio' || pName.includes('earbud') || pName.includes('headphone') || pName.includes('airdopes') || pName.includes('buds') || pName.includes('audio') || pName.includes('speaker') || pName.includes('wh-1000xm5'))) ||
      (parsed.category_slug === 'appliances' && (pCat === 'appliances' || pName.includes('ac') || pName.includes('air conditioner') || pName.includes('fryer') || pName.includes('vacuum') || pName.includes('tv') || pName.includes('television'))) ||
      (parsed.category_slug === 'accessories' && (pCat === 'accessories' || productIsAccessory)) ||
      (parsed.category_slug === 'lifestyle' && (pCat === 'lifestyle' || pName.includes('lipstick') || pName.includes('hamper') || pName.includes('gift') || pName.includes('care') || pName.includes('spa')));

    if (!isCategoryMatch) {
      return { score: 10, reasons: ['Category mismatch'], isEligible: false };
    }
  }

  // Strict Brand Mismatch Filter:
  if (parsed.brand) {
    const bLower = parsed.brand.toLowerCase();
    if (!pBrand.includes(bLower) && !pName.includes(bLower)) {
      return { score: 15, reasons: ['Brand mismatch'], isEligible: false };
    }
  }

  // Model exactness check:
  // e.g. iPhone 15 vs iPhone 15 Pro
  if (parsed.model) {
    const mLower = parsed.model.toLowerCase();
    const queryWantsPro = mLower.includes('pro');
    const queryWantsMax = mLower.includes('max') || mLower.includes('plus');
    const productIsPro = pName.includes('pro') && !pName.includes('processor');
    const productIsMax = pName.includes('max') || pName.includes('plus');

    if (mLower.includes('iphone 15') && !queryWantsPro && productIsPro) {
      // User asked for iPhone 15 base, do not return iPhone 15 Pro
      return { score: 20, reasons: ['Model variant mismatch (Pro vs Base)'], isEligible: false };
    }
    if (mLower.includes('iphone 15 pro') && !productIsPro) {
      // User asked for iPhone 15 Pro, do not return iPhone 15 base
      return { score: 20, reasons: ['Model variant mismatch (Base vs Pro)'], isEligible: false };
    }
  }

  let score = 0;

  // 1. Title & Token Match (up to 30 points)
  const queryTokens = parsed.original_query
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length >= 3 && !['under', 'below', 'with', 'for', 'best', 'good', 'the', 'and'].includes(t));

  let matchedTokens = 0;
  for (const token of queryTokens) {
    if (pName.includes(token) || pBrand.includes(token)) {
      matchedTokens++;
    }
  }
  const tokenFraction = queryTokens.length > 0 ? matchedTokens / queryTokens.length : 1;
  const titleScore = Math.round(tokenFraction * 30);
  score += titleScore;
  if (tokenFraction >= 0.7) reasons.push('Strong title keyword match');

  // 2. Brand and Model Match (up to 25 points)
  let isExactModel = false;
  if (parsed.brand && pBrand.includes(parsed.brand.toLowerCase())) {
    score += 12;
    reasons.push(`${parsed.brand} brand match`);
  }
  if (parsed.model) {
    const mTokens = parsed.model.toLowerCase().split(/\s+/);
    const modelMatched = mTokens.every(t => pName.includes(t));
    if (modelMatched) {
      score += 13;
      isExactModel = true;
      reasons.push(`${parsed.model} exact model match`);
    }
  } else if (!parsed.brand) {
    // Generic query gets proportional model credit
    score += 15;
  }

  // 3. Budget Fit (up to 20 points)
  const price = product.price || (product.cheapestOffer?.price ?? null);
  if (parsed.budget.max !== null) {
    if (price !== null && price > 0) {
      if (price <= parsed.budget.max) {
        score += 20;
        reasons.push(`Within ₹${parsed.budget.max.toLocaleString('en-IN')} budget`);
      } else {
        const overPercent = (price - parsed.budget.max) / parsed.budget.max;
        if (overPercent <= 0.15) {
          score += 8; // Slightly over budget (15%)
          reasons.push(`Close to budget (+${Math.round(overPercent * 100)}%)`);
        } else {
          // Severely over budget -> heavily penalize
          score -= 30;
          return { score: Math.max(0, score), reasons: ['Significantly above budget limit'], isEligible: false };
        }
      }
    }
  } else {
    // No budget specified
    score += 15;
  }

  // 4. Feature & Specificity Match (up to 15 points)
  let featurePoints = 0;
  for (const feature of parsed.must_have_features) {
    const fLower = feature.toLowerCase();
    const inSpecs = product.specs.some(s => s.toLowerCase().includes(fLower));
    if (pName.includes(fLower) || inSpecs) {
      featurePoints += 5;
      reasons.push(feature);
    }
  }
  score += Math.min(15, featurePoints > 0 ? featurePoints : 8);

  // Variant storage / size check
  if (parsed.variant.storage && pName.includes(parsed.variant.storage.toLowerCase())) {
    score += 5;
    reasons.push(`${parsed.variant.storage} variant`);
  }
  if (parsed.variant.size && (pName.includes(parsed.variant.size.toLowerCase()) || product.specs.some(s => s.toLowerCase().includes(parsed.variant.size!.toLowerCase())))) {
    score += 5;
    reasons.push(parsed.variant.size);
  }

  // 5. Rating & Reviews Trust (up to 5 points)
  if (product.rating >= 4.5) {
    score += 5;
  } else if (product.rating >= 4.0) {
    score += 3;
  }

  // 6. Trusted Platform & Verified PDP Direct Link (up to 5 points)
  if (product.cheapestOffer?.isVerifiedGrounded && product.cheapestOffer.buyUrl) {
    score += 5;
  }

  const finalScore = Math.max(0, Math.min(100, score));
  const isEligible = finalScore >= 35;

  return {
    score: finalScore,
    reasons: reasons.slice(0, 3),
    isEligible,
  };
}

/**
 * Ranks, filters, and sorts products by relevance or specified sort option
 */
export function rankAndFilterProducts(
  products: GroundedProduct[],
  parsed: ParsedQuery,
  sortBy: 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'newest' = 'relevance',
  minScoreThreshold: number = 35
): ScoredProduct[] {
  const scored: ScoredProduct[] = [];

  for (const p of products) {
    const { score, reasons, isEligible } = calculateProductRelevance(p, parsed);
    if (isEligible && score >= minScoreThreshold) {
      scored.push({
        ...p,
        relevanceScore: score,
        matchReasons: reasons,
        isExactModelMatch: score >= 75,
      });
    }
  }

  // Sorting
  switch (sortBy) {
    case 'price_asc':
      return scored.sort((a, b) => (a.price || 0) - (b.price || 0));
    case 'price_desc':
      return scored.sort((a, b) => (b.price || 0) - (a.price || 0));
    case 'rating':
      return scored.sort((a, b) => b.rating - a.rating || b.relevanceScore - a.relevanceScore);
    case 'newest':
      return scored.sort((a, b) => b.relevanceScore - a.relevanceScore);
    case 'relevance':
    default:
      return scored.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }
}
