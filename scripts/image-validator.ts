import fs from 'fs';
import path from 'path';

interface UrlCheckResult {
  url: string;
  source: string;
  status: number | null;
  ok: boolean;
  contentType?: string;
  error?: string;
}

export const VERIFIED_FALLBACK_PLACEHOLDER =
  'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1000&q=80';

export const CATEGORY_FALLBACK_PLACEHOLDERS: Record<string, string> = {
  audio: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80',
  laptops: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80',
  phones: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=1000&q=80',
  appliances: 'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=1000&q=80',
  wearables: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80',
  default: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1000&q=80',
};

export async function testSingleUrl(url: string, timeoutMs = 7000): Promise<{ ok: boolean; status: number | null; error?: string; contentType?: string }> {
  if (!url || typeof url !== 'string' || !url.startsWith('http')) {
    return { ok: false, status: null, error: 'Invalid URL string' };
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      },
      signal: controller.signal,
    });
    clearTimeout(timer);

    const contentType = res.headers.get('content-type') || '';
    const ok = res.ok && (res.status >= 200 && res.status < 400);

    return {
      ok,
      status: res.status,
      contentType,
      error: ok ? undefined : `HTTP ${res.status} ${res.statusText}`,
    };
  } catch (err: any) {
    return {
      ok: false,
      status: null,
      error: err.name === 'AbortError' ? 'Request timed out' : err.message,
    };
  }
}

export async function validateImageUrls(urlsWithSource: Array<{ url: string; source: string }>): Promise<{
  valid: UrlCheckResult[];
  broken: UrlCheckResult[];
  summary: { total: number; validCount: number; brokenCount: number };
}> {
  const valid: UrlCheckResult[] = [];
  const broken: UrlCheckResult[] = [];

  // Group by unique URL to prevent duplicate checks
  const uniqueUrls = new Map<string, string[]>();
  for (const item of urlsWithSource) {
    if (!uniqueUrls.has(item.url)) {
      uniqueUrls.set(item.url, []);
    }
    uniqueUrls.get(item.url)!.push(item.source);
  }

  const entries = Array.from(uniqueUrls.entries());
  console.log(`[image-validator] Validating ${entries.length} unique image URLs...`);

  // Concurrency batching
  const BATCH_SIZE = 8;
  for (let i = 0; i < entries.length; i += BATCH_SIZE) {
    const batch = entries.slice(i, i + BATCH_SIZE);
    const results = await Promise.all(
      batch.map(async ([url, sources]) => {
        const check = await testSingleUrl(url);
        return {
          url,
          source: sources.join(', '),
          status: check.status,
          ok: check.ok,
          contentType: check.contentType,
          error: check.error,
        };
      })
    );

    for (const r of results) {
      if (r.ok) {
        valid.push(r);
      } else {
        broken.push(r);
        console.warn(`[image-validator] BROKEN URL: ${r.url} (${r.error}) from [${r.source}]`);
      }
    }
  }

  return {
    valid,
    broken,
    summary: {
      total: entries.length,
      validCount: valid.length,
      brokenCount: broken.length,
    },
  };
}

// CLI runner if executed directly
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('image-validator.ts')) {
  async function runCli() {
    console.log('--- Running Image Validator for Entire Catalog & Frontend Showcase ---');

    const filesToScan = [
      { path: 'src/App.tsx', label: 'App.tsx (FLOATING_PRODUCTS & EXACT_CLIENT_IMAGE_MAP)' },
      { path: 'src/components/LandingPage.tsx', label: 'LandingPage.tsx' },
      { path: 'src/components/ProductDetailModal.tsx', label: 'ProductDetailModal.tsx' },
      { path: 'server/productCatalog.ts', label: 'server/productCatalog.ts' },
      { path: 'server/productImages.ts', label: 'server/productImages.ts' },
    ];

    const urlsToTest: Array<{ url: string; source: string }> = [];

    for (const fileObj of filesToScan) {
      const fullPath = path.resolve(process.cwd(), fileObj.path);
      if (!fs.existsSync(fullPath)) continue;
      const content = fs.readFileSync(fullPath, 'utf8');

      // Match all http/https image URLs
      const matches = Array.from(content.matchAll(/['"`](https:\/\/[^'"`\s\)\}\],]+)['"`]/g));
      for (const m of matches) {
        const u = m[1].replace(/[,;]+$/, '');
        // Exclude store search pages and API links
        if (u.includes('/search') || u.includes('/dp/') || u.includes('/p/itm') || u.includes('/s?k=')) {
          continue;
        }
        if (
          u.includes('images.unsplash.com') ||
          u.includes('/images/') ||
          u.includes('/image/') ||
          u.includes('cdn') ||
          u.match(/\.(jpeg|jpg|png|webp|avif|gif)(\?.*)?$/i)
        ) {
          urlsToTest.push({ url: u, source: fileObj.label });
        }
      }
    }

    console.log(`Found ${urlsToTest.length} total image references across project`);

    const result = await validateImageUrls(urlsToTest);
    console.log('\n--- Image Validation Summary ---');
    console.log(`Total Unique URLs: ${result.summary.total}`);
    console.log(`Reachable (200 OK): ${result.summary.validCount}`);
    console.log(`Broken / Unreachable: ${result.summary.brokenCount}`);

    if (result.broken.length > 0) {
      console.log('\nBroken / Unreachable URLs details:');
      for (const b of result.broken) {
        console.log(`- [${b.status || 'ERR'}] ${b.url}: ${b.error} (found in ${b.source})`);
      }
    } else {
      console.log('\nAll checked images are 100% valid, verified, and reachable!');
    }
  }

  runCli().catch((err) => {
    console.error('Fatal validator error:', err);
    process.exit(1);
  });
}
