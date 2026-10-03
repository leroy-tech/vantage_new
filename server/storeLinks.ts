import { validateProductDetailPage, queryVerifiedCatalog, cleanProductUrl } from './productVerifier';

export interface StoreLink {
  store: string;
  name: string;
  url: string;
  badge: string;
  color: string;
  isVerified?: boolean;
}

/**
 * Returns strictly verified product detail page (PDP) store links.
 * Search URLs, category pages, and homepages are strictly omitted.
 */
export function getStoreLinks(productName: string, primaryUrl?: string): StoreLink[] {
  const links: StoreLink[] = [];
  const addedUrls = new Set<string>();

  // 1. Direct source URL if provided and validated as an authentic PDP on a trusted domain
  if (primaryUrl && primaryUrl.startsWith('http') && !primaryUrl.includes('example.com')) {
    const cleaned = cleanProductUrl(primaryUrl);
    const check = validateProductDetailPage(cleaned || primaryUrl);
    if (check.isValidPdp) {
      const urlToAdd = check.cleanUrl || primaryUrl;
      const lower = urlToAdd.toLowerCase();
      let storeName = check.platform || 'Official Store';
      let color = '#7C3AED';

      if (lower.includes('amazon.')) {
        storeName = 'Amazon India';
        color = '#FF9900';
      } else if (lower.includes('flipkart.')) {
        storeName = 'Flipkart';
        color = '#2874F0';
      } else if (lower.includes('croma.')) {
        storeName = 'Croma';
        color = '#00B5B5';
      } else if (lower.includes('tatacliq.')) {
        storeName = 'Tata CLiQ';
        color = '#0F1111';
      } else if (lower.includes('myntra.')) {
        storeName = 'Myntra';
        color = '#FF3F6C';
      }

      links.push({
        store: storeName,
        name: storeName,
        url: urlToAdd,
        badge: 'Verified Direct PDP',
        color,
        isVerified: true
      });
      addedUrls.add(urlToAdd);
    }
  }

  // 2. Cross-reference curated and grounded verified catalog for exact PDP links
  const verifiedMatch = queryVerifiedCatalog(productName);
  if (verifiedMatch && verifiedMatch.buy_url && !addedUrls.has(verifiedMatch.buy_url)) {
    const check = validateProductDetailPage(verifiedMatch.buy_url);
    if (check.isValidPdp) {
      links.push({
        store: verifiedMatch.platform,
        name: verifiedMatch.platform,
        url: check.cleanUrl || verifiedMatch.buy_url,
        badge: 'Verified Direct PDP',
        color: verifiedMatch.platform.includes('Amazon') ? '#FF9900' : '#2874F0',
        isVerified: true
      });
      addedUrls.add(verifiedMatch.buy_url);
    }
  }

  // Strict Rule: Never return fabricated search URLs (e.g. /s?k= or /search?q=)
  return links;
}
