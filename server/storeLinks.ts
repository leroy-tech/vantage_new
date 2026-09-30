export interface StoreLink {
  store: string;
  name: string;
  url: string;
  badge: string;
  color: string;
}

export function getStoreLinks(productName: string, primaryUrl?: string): StoreLink[] {
  const cleanName = productName.replace(/\(.*?\)/g, '').trim();
  const query = encodeURIComponent(cleanName);
  const links: StoreLink[] = [];

  // Direct source URL if provided by web search
  if (primaryUrl && primaryUrl.startsWith('http') && !primaryUrl.includes('example.com')) {
    if (primaryUrl.includes('amazon.')) {
      links.push({
        store: 'Amazon India',
        name: 'Amazon.in',
        url: primaryUrl,
        badge: 'Direct Listing',
        color: '#FF9900',
      });
    } else if (primaryUrl.includes('flipkart.')) {
      links.push({
        store: 'Flipkart',
        name: 'Flipkart',
        url: primaryUrl,
        badge: 'Direct Listing',
        color: '#2874F0',
      });
    } else if (primaryUrl.includes('croma.')) {
      links.push({
        store: 'Croma',
        name: 'Croma',
        url: primaryUrl,
        badge: 'Direct Listing',
        color: '#00B5B5',
      });
    } else {
      links.push({
        store: 'Official / Store',
        name: 'Brand Store / Spec Sheet',
        url: primaryUrl,
        badge: 'Verified Source',
        color: '#F0B429',
      });
    }
  }

  // Ensure Amazon India link exists
  if (!links.some(l => l.store === 'Amazon India')) {
    links.push({
      store: 'Amazon India',
      name: 'Amazon.in',
      url: `https://www.amazon.in/s?k=${query}`,
      badge: 'Check Deals',
      color: '#FF9900',
    });
  }

  // Ensure Flipkart link exists
  if (!links.some(l => l.store === 'Flipkart')) {
    links.push({
      store: 'Flipkart',
      name: 'Flipkart',
      url: `https://www.flipkart.com/search?q=${query}`,
      badge: 'Check Offers',
      color: '#2874F0',
    });
  }

  // Croma
  links.push({
    store: 'Croma',
    name: 'Croma',
    url: `https://www.croma.com/searchB?q=${query}`,
    badge: 'Store Pickup',
    color: '#00E8C6',
  });

  // Reliance Digital
  links.push({
    store: 'Reliance Digital',
    name: 'Reliance Digital',
    url: `https://www.reliancedigital.in/search?q=${query}`,
    badge: 'Compare Price',
    color: '#E42529',
  });

  return links;
}
