import { ProductProvider, ProviderSearchOptions, ProviderSearchResult, ProviderStatus } from './types';
import { searchAllIndianPlatforms, GroundedProduct } from '../multiPlatformSearch';
import { getCuratedProductDetails, DetailedProductInfo } from '../productCatalog';

interface CacheEntry {
  data: ProviderSearchResult;
  expiresAt: number;
}

export class GroundedSearchProvider implements ProductProvider {
  public id = 'grounded_search';
  public name = 'Google Grounded Live Search';
  public isLive = true;

  // 30-minute cache: key = `${query}_${page}_${limit}`
  private cache = new Map<string, CacheEntry>();
  private CACHE_TTL_MS = 30 * 60 * 1000;

  public async search(query: string, options: ProviderSearchOptions = {}): Promise<ProviderSearchResult> {
    const page = options.page || 1;
    const limit = options.limit || 12;
    const cacheKey = `${query.trim().toLowerCase()}_p${page}_l${limit}`;

    const cached = this.cache.get(cacheKey);
    const now = Date.now();
    if (cached && cached.expiresAt > now) {
      return {
        ...cached.data,
        cached: true,
      };
    }

    try {
      const result = await searchAllIndianPlatforms(query, page, limit);

      let filteredProducts = result.products;
      if (options.brand) {
        filteredProducts = filteredProducts.filter(p => p.brand.toLowerCase() === options.brand!.toLowerCase());
      }
      if (options.minPrice !== undefined) {
        filteredProducts = filteredProducts.filter(p => p.price >= options.minPrice!);
      }
      if (options.maxPrice !== undefined) {
        filteredProducts = filteredProducts.filter(p => p.price <= options.maxPrice!);
      }
      if (options.minRating !== undefined) {
        filteredProducts = filteredProducts.filter(p => p.rating >= options.minRating!);
      }
      if (options.platform) {
        filteredProducts = filteredProducts.filter(p =>
          p.offers.some(o => o.platform.toLowerCase().includes(options.platform!.toLowerCase()))
        );
      }
      if (options.sortBy === 'price_low') {
        filteredProducts.sort((a, b) => a.price - b.price);
      } else if (options.sortBy === 'price_high') {
        filteredProducts.sort((a, b) => b.price - a.price);
      } else if (options.sortBy === 'rating') {
        filteredProducts.sort((a, b) => b.rating - a.rating);
      }

      const searchResult: ProviderSearchResult = {
        providerName: this.name,
        query,
        totalProducts: filteredProducts.length,
        page,
        hasMore: result.hasMore,
        products: filteredProducts,
        availableBrands: result.availableBrands,
        availablePlatforms: result.availablePlatforms,
        priceRange: result.priceRange,
      };

      // Store in 30-min cache
      this.cache.set(cacheKey, {
        data: searchResult,
        expiresAt: now + this.CACHE_TTL_MS,
      });

      return searchResult;
    } catch (err: any) {
      console.warn(`[GroundedSearchProvider] Error searching "${query}":`, err?.message || err);
      return {
        providerName: this.name,
        query,
        totalProducts: 0,
        page,
        hasMore: false,
        products: [],
        availableBrands: [],
        availablePlatforms: [],
        priceRange: { min: 0, max: 0 },
      };
    }
  }

  public async getProductDetails(idOrQuery: string): Promise<DetailedProductInfo | null> {
    return getCuratedProductDetails(idOrQuery);
  }

  public getStatus(): ProviderStatus {
    const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY);
    return {
      id: this.id,
      name: this.name,
      status: 'live',
      description: 'Live real-time web search grounding via Gemini and Google Search for verified Indian retailer prices & links.',
      envKeysRequired: ['GEMINI_API_KEY'],
      configuredKeys: hasGeminiKey ? ['GEMINI_API_KEY'] : [],
      missingKeys: hasGeminiKey ? [] : ['GEMINI_API_KEY'],
      notes: 'Active and currently serving real-time Indian e-commerce comparisons.',
    };
  }
}
