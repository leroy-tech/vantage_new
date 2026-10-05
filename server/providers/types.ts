import { GroundedProduct, PlatformOffer, SearchSummary } from '../multiPlatformSearch';
import { DetailedProductInfo } from '../productCatalog';

export interface ProviderSearchOptions {
  page?: number;
  limit?: number;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  platform?: string;
  sortBy?: 'relevance' | 'price_low' | 'price_high' | 'rating';
}

export interface ProviderSearchResult {
  providerName: string;
  query: string;
  totalProducts: number;
  page: number;
  hasMore: boolean;
  products: GroundedProduct[];
  availableBrands: string[];
  availablePlatforms: string[];
  priceRange: { min: number; max: number };
  cached?: boolean;
}

export interface ProviderStatus {
  id: string;
  name: string;
  status: 'live' | 'placeholder';
  description: string;
  envKeysRequired: string[];
  configuredKeys: string[];
  missingKeys: string[];
  notes: string;
}

export interface ProductProvider {
  id: string;
  name: string;
  isLive: boolean;
  search(query: string, options?: ProviderSearchOptions): Promise<ProviderSearchResult>;
  getProductDetails?(idOrQuery: string): Promise<DetailedProductInfo | null>;
  getStatus(): ProviderStatus;
}
