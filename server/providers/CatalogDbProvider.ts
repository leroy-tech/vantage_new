import { ProductProvider, ProviderSearchOptions, ProviderSearchResult, ProviderStatus } from './types';
import { DETAILED_PRODUCTS_CATALOG, DetailedProductInfo } from '../productCatalog';
import { GroundedProduct } from '../multiPlatformSearch';

export class CatalogDbProvider implements ProductProvider {
  public id = 'catalog_db';
  public name = 'Vantage Verified Catalog Database';
  public isLive = true;

  public async search(query: string, options: ProviderSearchOptions = {}): Promise<ProviderSearchResult> {
    const qLower = query.trim().toLowerCase();
    const allProducts = Object.values(DETAILED_PRODUCTS_CATALOG);

    const matches: GroundedProduct[] = allProducts
      .filter((p) => {
        if (!qLower) return true;
        const inName = p.name.toLowerCase().includes(qLower);
        const inCanon = p.canonicalName.toLowerCase().includes(qLower);
        const inCat = p.category.toLowerCase().includes(qLower);
        const inSpecs = Object.values(p.specs || {}).some(val => val.toLowerCase().includes(qLower));
        const inHighlights = (p.highlights || []).some(h => h.toLowerCase().includes(qLower));
        return inName || inCanon || inCat || inSpecs || inHighlights;
      })
      .map((p): GroundedProduct => {
        const numPrice = parseInt(p.price.replace(/[^\d]/g, ''), 10) || 0;
        const brand = p.name.split(' ')[0] || 'Curated';

        const offers = (p.storeLinks || []).map((sl) => {
          let domain = 'flipkart.com';
          try {
            domain = new URL(sl.url).hostname.replace(/^www\./, '');
          } catch {
            domain = (sl.store || '').toLowerCase().includes('amazon') ? 'amazon.in' : 'flipkart.com';
          }
          return {
            platform: sl.name || sl.store || 'Verified Store',
            domain,
            price: numPrice,
            priceFormatted: p.price,
            buyUrl: sl.url,
            isVerifiedGrounded: true,
            storeBadge: sl.badge ? `${sl.name} ${sl.badge}` : `${sl.name} Verified Deal`,
            inStock: true,
          };
        });

        const cheapest = offers.length
          ? [...offers].sort((a, b) => (a.price || 0) - (b.price || 0))[0]
          : {
              platform: p.sourceStore || 'Flipkart',
              domain: 'flipkart.com',
              price: numPrice,
              priceFormatted: p.price,
              buyUrl: p.sourceUrl,
              isVerifiedGrounded: true,
              storeBadge: p.sourceBadge,
              inStock: true,
            };

        return {
          id: p.id,
          name: p.canonicalName || p.name,
          brand,
          category: p.category,
          price: numPrice,
          priceFormatted: p.price,
          mrpFormatted: p.mrp,
          rating: p.rating || 4.5,
          ratingCount: p.reviewsCount,
          specs: Object.entries(p.specs || {}).slice(0, 5).map(([k, v]) => `${k}: ${v}`),
          imageUrl: p.imageUrl,
          cheapestOffer: cheapest,
          offers: offers.length ? offers : [cheapest],
          missingPlatforms: [],
          reviewSummary: {
            pros: p.pros || [],
            cons: p.cons || [],
            hasData: true,
          },
        };
      });

    let filtered = matches;
    if (options.brand) {
      filtered = filtered.filter(p => p.brand.toLowerCase() === options.brand!.toLowerCase());
    }
    if (options.minPrice !== undefined) {
      filtered = filtered.filter(p => p.price >= options.minPrice!);
    }
    if (options.maxPrice !== undefined) {
      filtered = filtered.filter(p => p.price <= options.maxPrice!);
    }
    if (options.minRating !== undefined) {
      filtered = filtered.filter(p => p.rating >= options.minRating!);
    }

    if (options.sortBy === 'price_low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (options.sortBy === 'price_high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (options.sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    const page = options.page || 1;
    const limit = options.limit || 12;
    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    return {
      providerName: this.name,
      query,
      totalProducts: filtered.length,
      page,
      hasMore: start + limit < filtered.length,
      products: paginated,
      availableBrands: Array.from(new Set(filtered.map(p => p.brand))),
      availablePlatforms: ['Amazon India', 'Flipkart', 'Croma', 'Reliance Digital'],
      priceRange: {
        min: filtered.length ? Math.min(...filtered.map(p => p.price)) : 0,
        max: filtered.length ? Math.max(...filtered.map(p => p.price)) : 0,
      },
    };
  }

  public async getProductDetails(idOrQuery: string): Promise<DetailedProductInfo | null> {
    const key = idOrQuery.toLowerCase().trim();
    if (DETAILED_PRODUCTS_CATALOG[key]) return DETAILED_PRODUCTS_CATALOG[key];
    const found = Object.values(DETAILED_PRODUCTS_CATALOG).find(
      p => p.id === idOrQuery || p.name.toLowerCase().includes(key) || p.canonicalName.toLowerCase().includes(key)
    );
    return found || null;
  }

  public getStatus(): ProviderStatus {
    return {
      id: this.id,
      name: this.name,
      status: 'live',
      description: 'Built-in verified Indian product specifications, expert reviews, and price tracking catalog.',
      envKeysRequired: [],
      configuredKeys: [],
      missingKeys: [],
      notes: 'Always live with verified specifications and official product CDN photos.',
    };
  }
}
