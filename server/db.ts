import fs from 'fs';
import path from 'path';

export interface Preference {
  user_id: string;
  key: string;
  value: string;
  updated_at: string;
}

export interface TrackedProduct {
  id: number;
  user_id: string;
  name: string;
  search_query: string;
  target_price: number | null;
  created_at: string;
}

export interface PriceCheck {
  id: number;
  product_id: number;
  price: number | null;
  source_url: string;
  raw_note: string;
  checked_at: string;
}

interface DatabaseSchema {
  preferences: Preference[];
  tracked_products: TrackedProduct[];
  price_checks: PriceCheck[];
  nextProductId: number;
  nextPriceCheckId: number;
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'assistant.json');

let memoryDb: DatabaseSchema = {
  preferences: [],
  tracked_products: [],
  price_checks: [],
  nextProductId: 1,
  nextPriceCheckId: 1,
};

export function initDb() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      memoryDb = JSON.parse(raw);
    } else {
      saveDb();
    }
  } catch (err) {
    console.error('Failed to init DB file, using memory storage:', err);
  }
}

function saveDb() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(memoryDb, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to persist DB to file:', err);
  }
}

// ---------- Preferences ----------

export function setPreference(userId: string, key: string, value: string): void {
  const existing = memoryDb.preferences.find(p => p.user_id === userId && p.key === key);
  const now = new Date().toISOString();
  if (existing) {
    existing.value = value;
    existing.updated_at = now;
  } else {
    memoryDb.preferences.push({
      user_id: userId,
      key,
      value,
      updated_at: now,
    });
  }
  saveDb();
}

export function getPreferences(userId: string): Record<string, string> {
  const res: Record<string, string> = {};
  for (const p of memoryDb.preferences) {
    if (p.user_id === userId) {
      res[p.key] = p.value;
    }
  }
  return res;
}

export function deletePreference(userId: string, key: string): void {
  memoryDb.preferences = memoryDb.preferences.filter(
    p => !(p.user_id === userId && p.key === key)
  );
  saveDb();
}

// ---------- Tracked products ----------

export function addTrackedProduct(
  userId: string,
  name: string,
  searchQuery: string,
  targetPrice: number | null = null
): TrackedProduct {
  const id = memoryDb.nextProductId++;
  const prod: TrackedProduct = {
    id,
    user_id: userId,
    name,
    search_query: searchQuery,
    target_price: targetPrice,
    created_at: new Date().toISOString(),
  };
  memoryDb.tracked_products.push(prod);
  saveDb();
  return prod;
}

export function listTrackedProducts(userId: string): TrackedProduct[] {
  return memoryDb.tracked_products
    .filter(p => p.user_id === userId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function removeTrackedProduct(productId: number): void {
  memoryDb.price_checks = memoryDb.price_checks.filter(c => c.product_id !== productId);
  memoryDb.tracked_products = memoryDb.tracked_products.filter(p => p.id !== productId);
  saveDb();
}

export function recordPriceCheck(
  productId: number,
  price: number | null,
  sourceUrl: string = '',
  rawNote: string = ''
): PriceCheck {
  const id = memoryDb.nextPriceCheckId++;
  const check: PriceCheck = {
    id,
    product_id: productId,
    price,
    source_url: sourceUrl,
    raw_note: rawNote,
    checked_at: new Date().toISOString(),
  };
  memoryDb.price_checks.push(check);
  saveDb();
  return check;
}

export function getPriceHistory(productId: number): PriceCheck[] {
  return memoryDb.price_checks
    .filter(c => c.product_id === productId)
    .sort((a, b) => new Date(a.checked_at).getTime() - new Date(b.checked_at).getTime());
}

export function getLowestPrice(productId: number): number | null {
  const history = getPriceHistory(productId);
  const prices = history.map(h => h.price).filter((p): p is number => p !== null && !isNaN(p));
  return prices.length > 0 ? Math.min(...prices) : null;
}
