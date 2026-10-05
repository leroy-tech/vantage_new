import { ProductProvider, ProviderSearchOptions, ProviderSearchResult, ProviderStatus } from './types';
import { GroundedProduct } from '../multiPlatformSearch';
import { DetailedProductInfo } from '../productCatalog';

/**
 * Flipkart Affiliate API Provider (Ready for production connection)
 *
 * Requirements to activate:
 * 1. Register at https://affiliate.flipkart.com/
 * 2. Get your Affiliate Tracking ID (e.g., 'yourname07')
 * 3. Generate your Affiliate Token from the API Access tab
 * 4. Add to your .env file:
 *    FLIPKART_AFFILIATE_ID=your_tracking_id
 *    FLIPKART_AFFILIATE_TOKEN=your_api_token
 *
 * Official endpoints:
 * Search API: https://affiliate-api.flipkart.net/affiliate/1.0/search.json?query={q}&resultCount={limit}
 * Headers:
 *   Fk-Affiliate-Id: <FLIPKART_AFFILIATE_ID>
 *   Fk-Affiliate-Token: <FLIPKART_AFFILIATE_TOKEN>
 */
export class FlipkartAffiliateProvider implements ProductProvider {
  public id = 'flipkart_affiliate';
  public name = 'Flipkart Affiliate API';
  public isLive = false;

  private affiliateId = process.env.FLIPKART_AFFILIATE_ID || '';
  private affiliateToken = process.env.FLIPKART_AFFILIATE_TOKEN || '';

  constructor() {
    this.isLive = Boolean(this.affiliateId && this.affiliateToken);
  }

  public async search(query: string, options: ProviderSearchOptions = {}): Promise<ProviderSearchResult> {
    if (!this.isLive) {
      // Placeholder mode: Return empty result safely so the ProductManager falls back to Grounded search
      return {
        providerName: this.name,
        query,
        totalProducts: 0,
        page: options.page || 1,
        hasMore: false,
        products: [],
        availableBrands: [],
        availablePlatforms: [],
        priceRange: { min: 0, max: 0 },
      };
    }

    try {
      const limit = options.limit || 12;
      const url = `https://affiliate-api.flipkart.net/affiliate/1.0/search.json?query=${encodeURIComponent(query)}&resultCount=${limit}`;
      const res = await fetch(url, {
        headers: {
          'Fk-Affiliate-Id': this.affiliateId,
          'Fk-Affiliate-Token': this.affiliateToken,
        },
      });

      if (!res.ok) {
        throw new Error(`Flipkart Affiliate API returned HTTP ${res.status}`);
      }

      const data = await res.json() as any;
      const products: GroundedProduct[] = (data?.products || []).map((item: any) => {
        const baseInfo = item?.productBaseInfoV1 || {};
        const title = baseInfo.title || 'Flipkart Product';
        const price = baseInfo.flipkartSellingPrice?.amount || baseInfo.maximumRetailPrice?.amount || 0;
        const mrp = baseInfo.maximumRetailPrice?.amount || price;
        const productUrl = baseInfo.productUrl || '';
        const imgUrl = baseInfo.imageUrls?.['400x400'] || baseInfo.imageUrls?.['200x200'] || '';

        return {
          id: `fk_${baseInfo.productId || Math.random().toString(36).slice(2)}`,
          name: title,
          brand: baseInfo.productBrand || 'Flipkart',
          category: options.category || 'General',
          price,
          priceFormatted: `₹${Number(price).toLocaleString('en-IN')}`,
          mrpFormatted: mrp > price ? `₹${Number(mrp).toLocaleString('en-IN')}` : undefined,
          rating: Number(baseInfo.rating) || 4.2,
          ratingCount: 'Verified Flipkart Reviews',
          specs: [],
          imageUrl: imgUrl,
          cheapestOffer: {
            platform: 'Flipkart',
            domain: 'flipkart.com',
            price,
            priceFormatted: `₹${Number(price).toLocaleString('en-IN')}`,
            buyUrl: productUrl,
            isVerifiedGrounded: true,
            storeBadge: 'Official Affiliate Link · Flipkart',
            inStock: baseInfo.inStock !== false,
          },
          offers: [
            {
              platform: 'Flipkart',
              domain: 'flipkart.com',
              price,
              priceFormatted: `₹${Number(price).toLocaleString('en-IN')}`,
              buyUrl: productUrl,
              isVerifiedGrounded: true,
              storeBadge: 'Official Affiliate Link · Flipkart',
              inStock: baseInfo.inStock !== false,
            }
          ],
          missingPlatforms: [],
        };
      });

      return {
        providerName: this.name,
        query,
        totalProducts: products.length,
        page: options.page || 1,
        hasMore: Boolean(data?.nextUrl),
        products,
        availableBrands: Array.from(new Set(products.map(p => p.brand).filter(Boolean))),
        availablePlatforms: ['Flipkart'],
        priceRange: {
          min: products.length ? Math.min(...products.map(p => p.price)) : 0,
          max: products.length ? Math.max(...products.map(p => p.price)) : 0,
        },
      };
    } catch (err: any) {
      console.warn('[FlipkartAffiliateProvider] Search error:', err.message);
      return {
        providerName: this.name,
        query,
        totalProducts: 0,
        page: options.page || 1,
        hasMore: false,
        products: [],
        availableBrands: [],
        availablePlatforms: [],
        priceRange: { min: 0, max: 0 },
      };
    }
  }

  public getStatus(): ProviderStatus {
    const configured = [];
    const missing = [];
    if (this.affiliateId) configured.push('FLIPKART_AFFILIATE_ID');
    else missing.push('FLIPKART_AFFILIATE_ID');

    if (this.affiliateToken) configured.push('FLIPKART_AFFILIATE_TOKEN');
    else missing.push('FLIPKART_AFFILIATE_TOKEN');

    return {
      id: this.id,
      name: this.name,
      status: this.isLive ? 'live' : 'placeholder',
      description: 'Official Flipkart Affiliate Search API for live inventory, commission-tagged URLs, and selling prices.',
      envKeysRequired: ['FLIPKART_AFFILIATE_ID', 'FLIPKART_AFFILIATE_TOKEN'],
      configuredKeys: configured,
      missingKeys: missing,
      notes: this.isLive
        ? 'Connected & active.'
        : 'Placeholder ready. Add FLIPKART_AFFILIATE_ID and FLIPKART_AFFILIATE_TOKEN to .env to activate.',
    };
  }
}
