export interface SearchResult {
  title: string;
  snippet: string;
  link: string;
  imageUrl?: string;
}

const SEARCH_URL = 'https://www.googleapis.com/customsearch/v1';

export async function search(query: string, numResults: number = 5): Promise<SearchResult[]> {
  const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
  const cx = process.env.GOOGLE_SEARCH_CX;

  if (!apiKey || !cx) {
    return [];
  }

  const count = Math.min(Math.max(numResults, 1), 10);
  const url = new URL(SEARCH_URL);
  url.searchParams.set('key', apiKey);
  url.searchParams.set('cx', cx);
  url.searchParams.set('q', query);
  url.searchParams.set('num', count.toString());

  try {
    const resp = await fetch(url.toString(), {
      signal: AbortSignal.timeout(10000),
    });
    if (!resp.ok) {
      return [];
    }
    const data = await resp.json();
    const items = data.items || [];
    return items.map((item: any) => {
      const pm = item.pagemap || {};
      const img =
        pm.cse_image?.[0]?.src ||
        pm.cse_thumbnail?.[0]?.src ||
        pm.metatags?.[0]?.['og:image'] ||
        undefined;

      return {
        title: item.title || '',
        snippet: item.snippet || '',
        link: item.link || '',
        imageUrl: img,
      };
    });
  } catch {
    return [];
  }
}

export function formatResultsForPrompt(results: SearchResult[], label: string = 'Search results'): string {
  if (!results || results.length === 0) {
    return `${label}: (no direct Google Custom Search results — live grounding or model knowledge will be used)`;
  }

  const lines = [`${label}:`];
  results.forEach((r, i) => {
    let entry = `${i + 1}. ${r.title}\n   ${r.snippet}\n   Source: ${r.link}`;
    if (r.imageUrl) {
      entry += `\n   Image: ${r.imageUrl}`;
    }
    lines.push(entry);
  });
  return lines.join('\n');
}
