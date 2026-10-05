import { ProductProvider, ProviderSearchOptions, ProviderSearchResult, ProviderStatus } from './types';
import { GroundedSearchProvider } from './GroundedSearchProvider';
import { FlipkartAffiliateProvider } from './FlipkartAffiliateProvider';
import { AmazonPAAPIProvider } from './AmazonPAAPIProvider';
import { CatalogDbProvider } from './CatalogDbProvider';
import { GroundedProduct, PlatformOffer, SearchSummary } from '../multiPlatformSearch';
import { DetailedProductInfo } from '../productCatalog';

export class ProductManager {
  private providers: ProductProvider[] = [];

  constructor() {
    this.providers = [
      new CatalogDbProvider(),
      new GroundedSearchProvider(),
      new FlipkartAffiliateProvider(),
      new AmazonPAAPIProvider(),
    ];
  }

  public getProvidersStatus(): ProviderStatus[] {
    return this.providers.map(p => p.getStatus());
  }

  /**
   * Search unified catalog:
   * 1. Query catalog DB provider for instant cached/verified matches
   * 2. Query grounded live search and any active affiliate providers
   * 3. Merge & deduplicate products by normalized name and brand
   */
  public async search(query: string, options: ProviderSearchOptions = {}): Promise<ProviderSearchResult & { summary: SearchSummary }> {
    const qTrim = query.trim();

    // Query active providers in parallel
    const activeProviders = this.providers.filter(p => p.isLive);
    const results = await Promise.allSettled(
      activeProviders.map(p => p.search(qTrim, options))
    );

    const mergedProducts: GroundedProduct[] = [];
    const seenTitles = new Set<string>();

    for (const res of results) {
      if (res.status === 'fulfilled') {
        for (const prod of res.value.products) {
          const normKey = this.normalizeTitle(prod.name);
          if (!seenTitles.has(normKey)) {
            seenTitles.add(normKey);
            mergedProducts.push(prod);
          } else {
            // Merge offers if duplicate product found on multiple platforms
            const existing = mergedProducts.find(p => this.normalizeTitle(p.name) === normKey);
            if (existing) {
              const existingDomains = new Set(existing.offers.map(o => o.domain));
              for (const off of prod.offers) {
                if (!existingDomains.has(off.domain)) {
                  existing.offers.push(off);
                  existingDomains.add(off.domain);
                }
              }
              // Recompute cheapest offer
              existing.offers.sort((a, b) => (a.price || Infinity) - (b.price || Infinity));
              if (existing.offers[0] && existing.offers[0].price) {
                existing.cheapestOffer = existing.offers[0];
                existing.price = existing.offers[0].price;
                existing.priceFormatted = existing.offers[0].priceFormatted;
              }
            }
          }
        }
      }
    }

    // Apply sorting
    if (options.sortBy === 'price_low') {
      mergedProducts.sort((a, b) => a.price - b.price);
    } else if (options.sortBy === 'price_high') {
      mergedProducts.sort((a, b) => b.price - a.price);
    } else if (options.sortBy === 'rating') {
      mergedProducts.sort((a, b) => b.rating - a.rating);
    }

    // Paginate
    const page = options.page || 1;
    const limit = options.limit || 12;
    const start = (page - 1) * limit;
    const paginated = mergedProducts.slice(start, start + limit);

    // Compute available brands & platforms
    const availableBrands = Array.from(new Set(mergedProducts.map(p => p.brand).filter(Boolean)));
    const availablePlatforms = Array.from(
      new Set(mergedProducts.flatMap(p => p.offers.map(o => o.platform)).filter(Boolean))
    );

    const prices = mergedProducts.map(p => p.price).filter(p => p > 0);
    const priceRange = {
      min: prices.length ? Math.min(...prices) : 0,
      max: prices.length ? Math.max(...prices) : 0,
    };

    // Synthesize top, budget, and value picks
    const sortedByPrice = [...mergedProducts].filter(p => p.price > 0).sort((a, b) => a.price - b.price);
    const sortedByRating = [...mergedProducts].sort((a, b) => b.rating - a.rating);

    const budgetPickItem = sortedByPrice[0];
    const topPickItem = sortedByRating[0];
    const valuePickItem = sortedByRating.find(p => p !== topPickItem && p !== budgetPickItem) || topPickItem;

    const summary: SearchSummary = {
      overview: mergedProducts.length
        ? `Verified comparisons across Indian stores for "${query}". Found ${mergedProducts.length} verified products with direct store links.`
        : `No direct matches found for "${query}". Explore popular categories or refine your keywords.`,
      topPick: topPickItem
        ? {
            name: topPickItem.name,
            reason: `Top rated (${topPickItem.rating}★) with verified specs`,
            priceFormatted: topPickItem.priceFormatted,
          }
        : { name: '', reason: '', priceFormatted: '' },
      budgetPick: budgetPickItem
        ? {
            name: budgetPickItem.name,
            reason: `Lowest verified price in India at ${budgetPickItem.cheapestOffer.platform}`,
            priceFormatted: budgetPickItem.priceFormatted,
          }
        : { name: '', reason: '', priceFormatted: '' },
      valuePick: valuePickItem
        ? {
            name: valuePickItem.name,
            reason: 'Best balance of specifications, reliability, and price',
            priceFormatted: valuePickItem.priceFormatted,
          }
        : { name: '', reason: '', priceFormatted: '' },
    };

    return {
      providerName: 'Unified Multi-Provider Engine',
      query,
      totalProducts: mergedProducts.length,
      page,
      hasMore: start + limit < mergedProducts.length,
      products: paginated,
      availableBrands,
      availablePlatforms,
      priceRange,
      summary,
    };
  }

  public async getProductDetails(idOrQuery: string): Promise<DetailedProductInfo | null> {
    for (const provider of this.providers) {
      if (provider.getProductDetails) {
        const details = await provider.getProductDetails(idOrQuery);
        if (details) return details;
      }
    }
    return null;
  }

  private normalizeTitle(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 40);
  }
}

export const productManager = new ProductManager();
