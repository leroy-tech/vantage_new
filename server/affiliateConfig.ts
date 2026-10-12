/**
 * Vantage AI - Affiliate Link Engine & Configuration
 * 
 * HOW TO ADD AFFILIATE LINKS (Amazon Associates, Flipkart Affiliate, etc.):
 * 
 * 1. Amazon Associates India:
 *    - Sign up at https://affiliate-program.amazon.in
 *    - Obtain your Associate Tracking ID (e.g., "vantageai-21").
 *    - Set the environment variable: AMAZON_ASSOCIATE_TAG=your-tag-21
 *    - When a user clicks "Buy on Amazon India", our utility automatically appends:
 *      `&tag=${AMAZON_ASSOCIATE_TAG}&linkCode=ll1` to the canonical product URL.
 * 
 * 2. Flipkart Affiliate Programme:
 *    - Sign up at https://affiliate.flipkart.com
 *    - Obtain your Tracking ID (affid) (e.g., "vantageai").
 *    - Set the environment variable: FLIPKART_AFFILIATE_ID=your-affid
 *    - Our utility appends `&affid=${FLIPKART_AFFILIATE_ID}`.
 * 
 * 3. Croma / Tata CLiQ / Reliance Digital / Myntra (via Admitad, Cuelinks, or Involve Asia):
 *    - Join affiliate networks like Cuelinks (https://www.cuelinks.com) or EarnKaro.
 *    - Configure sub-ids or deep-link wrappers.
 * 
 * 4. Regulatory & Compliance Notice:
 *    - In accordance with the Advertising Standards Council of India (ASCI) and global FTC guidelines:
 *      Vantage AI displays a prominent disclaimer on product cards and in the footer:
 *      "Vantage AI may earn an affiliate commission from qualifying purchases made through links on this site at no extra cost to you."
 */

export interface AffiliateConfig {
  amazonAssociateTag?: string;
  flipkartAffiliateId?: string;
  cromaSubId?: string;
  enableAffiliateTags: boolean;
}

export const AFFILIATE_CONFIG: AffiliateConfig = {
  amazonAssociateTag: process.env.AMAZON_ASSOCIATE_TAG || '',
  flipkartAffiliateId: process.env.FLIPKART_AFFILIATE_ID || '',
  cromaSubId: process.env.CROMA_SUB_ID || '',
  enableAffiliateTags: Boolean(process.env.AMAZON_ASSOCIATE_TAG || process.env.FLIPKART_AFFILIATE_ID),
};

/**
 * Applies authentic affiliate tags to product URLs safely without altering canonical product ASINs or paths
 */
export function attachAffiliateTags(rawUrl: string, storeName: string): { url: string; hasAffiliateTag: boolean } {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return { url: '', hasAffiliateTag: false };
  }

  try {
    const parsed = new URL(rawUrl);
    const host = parsed.hostname.toLowerCase();

    // 1. Amazon India
    if (host.includes('amazon.in') || host.includes('amazon.com')) {
      if (AFFILIATE_CONFIG.amazonAssociateTag) {
        parsed.searchParams.set('tag', AFFILIATE_CONFIG.amazonAssociateTag);
        parsed.searchParams.set('linkCode', 'll1');
        return { url: parsed.toString(), hasAffiliateTag: true };
      }
    }

    // 2. Flipkart
    if (host.includes('flipkart.com')) {
      if (AFFILIATE_CONFIG.flipkartAffiliateId) {
        parsed.searchParams.set('affid', AFFILIATE_CONFIG.flipkartAffiliateId);
        return { url: parsed.toString(), hasAffiliateTag: true };
      }
    }

    // 3. Croma / Tata CLiQ
    if (host.includes('croma.com') && AFFILIATE_CONFIG.cromaSubId) {
      parsed.searchParams.set('sub_id', AFFILIATE_CONFIG.cromaSubId);
      return { url: parsed.toString(), hasAffiliateTag: true };
    }

    return { url: rawUrl, hasAffiliateTag: false };
  } catch {
    return { url: rawUrl, hasAffiliateTag: false };
  }
}

/**
 * FTC & ASCI compliant affiliate commission disclaimer
 */
export const AFFILIATE_DISCLOSURE = 
  "Disclaimer: Vantage AI is an independent shopping assistant. When you buy through verified links on our site, we may earn an affiliate commission at no extra cost to you. Prices and availability are subject to change by respective stores.";
