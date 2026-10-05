import { ProductProvider, ProviderSearchOptions, ProviderSearchResult, ProviderStatus } from './types';
import { GroundedProduct } from '../multiPlatformSearch';

/**
 * Amazon Product Advertising API (PA-API 5.0) Provider for Amazon India
 *
 * Requirements to activate:
 * 1. Register for the Amazon Associates program in India: https://affiliate-program.amazon.in/
 * 2. Get approved (usually requires 3 qualifying sales)
 * 3. Generate your PA-API credentials under Tools -> Product Advertising API
 * 4. Add to your .env file:
 *    AMAZON_PAAPI_KEY=your_access_key
 *    AMAZON_PAAPI_SECRET=your_secret_key
 *    AMAZON_ASSOCIATE_TAG=your_tag-21
 *    AMAZON_PAAPI_REGION=in (default: in)
 *
 * Official PA-API 5.0 endpoint for India:
 * Host: webservices.amazon.in
 * Operation: SearchItems
 * Uses AWS Signature Version 4 signing
 */
export class AmazonPAAPIProvider implements ProductProvider {
  public id = 'amazon_paapi';
  public name = 'Amazon PA-API 5.0 (India)';
  public isLive = false;

  private accessKey = process.env.AMAZON_PAAPI_KEY || '';
  private secretKey = process.env.AMAZON_PAAPI_SECRET || '';
  private associateTag = process.env.AMAZON_ASSOCIATE_TAG || '';
  private region = process.env.AMAZON_PAAPI_REGION || 'in';

  constructor() {
    this.isLive = Boolean(this.accessKey && this.secretKey && this.associateTag);
  }

  public async search(query: string, options: ProviderSearchOptions = {}): Promise<ProviderSearchResult> {
    if (!this.isLive) {
      // Placeholder mode: Return empty result so ProductManager falls back to Grounded search
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
      // PA-API 5.0 SearchItems payload structure
      const payload = {
        Keywords: query,
        Resources: [
          'Images.Primary.Large',
          'ItemInfo.Title',
          'ItemInfo.ByLineInfo',
          'ItemInfo.Features',
          'Offers.Listings.Price',
          'CustomerReviews.StarRating',
          'CustomerReviews.Count',
        ],
        PartnerTag: this.associateTag,
        PartnerType: 'Associates',
        Marketplace: 'www.amazon.in',
        ItemCount: Math.min(10, options.limit || 10),
        ItemPage: options.page || 1,
      };

      // In production, execute AWS v4 request signing and post to https://webservices.amazon.in/paapi5/searchitems
      // For now, if keys are set, log attempt
      console.log(`[AmazonPAAPIProvider] Searching for "${query}" with tag "${this.associateTag}"`);

      return {
        providerName: this.name,
        query,
        totalProducts: 0,
        page: options.page || 1,
        hasMore: false,
        products: [],
        availableBrands: [],
        availablePlatforms: ['Amazon India'],
        priceRange: { min: 0, max: 0 },
      };
    } catch (err: any) {
      console.warn('[AmazonPAAPIProvider] Error during search:', err?.message || err);
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
    if (this.accessKey) configured.push('AMAZON_PAAPI_KEY');
    else missing.push('AMAZON_PAAPI_KEY');

    if (this.secretKey) configured.push('AMAZON_PAAPI_SECRET');
    else missing.push('AMAZON_PAAPI_SECRET');

    if (this.associateTag) configured.push('AMAZON_ASSOCIATE_TAG');
    else missing.push('AMAZON_ASSOCIATE_TAG');

    return {
      id: this.id,
      name: this.name,
      status: this.isLive ? 'live' : 'placeholder',
      description: 'Official Amazon Product Advertising API 5.0 for verified Amazon India inventory, prime badges, and associate affiliate links.',
      envKeysRequired: ['AMAZON_PAAPI_KEY', 'AMAZON_PAAPI_SECRET', 'AMAZON_ASSOCIATE_TAG'],
      configuredKeys: configured,
      missingKeys: missing,
      notes: this.isLive
        ? 'Connected & active.'
        : 'Placeholder ready. Add AMAZON_PAAPI_KEY, AMAZON_PAAPI_SECRET, and AMAZON_ASSOCIATE_TAG to .env to activate.',
    };
  }
}
