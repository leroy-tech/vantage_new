import { GoogleGenAI } from '@google/genai';
import { GEMINI_CANDIDATE_MODELS } from './geminiConfig';

export interface ParsedQuery {
  original_query: string;
  corrected_query: string;
  has_spelling_correction: boolean;
  product_type: string;
  brand: string | null;
  model: string | null;
  variant: {
    color?: string;
    size?: string;
    storage?: string;
    ram?: string;
  };
  budget: {
    min: number | null;
    max: number | null;
  };
  must_have_features: string[];
  use_case: string | null;
  gender_or_age: string | null;
  intent: 'specific_product' | 'category_browsing' | 'comparison' | 'recommendation';
  is_accessory: boolean;
  confidence: number;
  shorthand_expanded: string;
  did_you_mean: string | null;
  search_variations: string[];
  category_slug: 'phones' | 'laptops' | 'shoes' | 'audio' | 'appliances' | 'lifestyle' | 'accessories' | 'electronics';
}

function getAiClient(): GoogleGenAI | null {
  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.API_KEY ||
    process.env.GOOGLE_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'vantage-ai-query-parser',
      },
    },
  });
}

const CANDIDATE_MODELS = GEMINI_CANDIDATE_MODELS;

// Common Indian shopping spelling & Hinglish corrections lookup
const SPELLING_AND_HINGLISH_MAP: Record<string, string> = {
  'iphon': 'iphone',
  'iphne': 'iphone',
  'maks': 'max',
  'samsng': 'samsung',
  'samung': 'samsung',
  'smarthone': 'smartphone',
  'lapotp': 'laptop',
  'erabuds': 'earbuds',
  'earbud': 'earbuds',
  'earpod': 'earbuds',
  'airpod': 'airpods',
  'sasta': 'budget affordable',
  'saste': 'budget affordable',
  'badhiya': 'best high quality',
  'kam daam': 'low price budget',
  'hazar': 'thousand',
  'hazaar': 'thousand',
  'ke andar': 'under',
  'ke niche': 'under',
  'ac': 'air conditioner',
  'tws': 'true wireless stereo earbuds',
  'anc': 'active noise cancellation',
};

/**
 * Robust deterministic fallback parser for query understanding
 * Works offline, handles Hinglish, shorthand, budget, and accessories
 */
export function parseQueryOffline(rawQuery: string): ParsedQuery {
  const original = (rawQuery || '').trim();
  const lower = original.toLowerCase();

  // 1. Token-level spelling correction & shorthand expansion
  const words = lower.split(/\s+/).filter(Boolean);
  let correctedWords: string[] = [];
  let spellingCorrected = false;

  for (const w of words) {
    if (SPELLING_AND_HINGLISH_MAP[w]) {
      correctedWords.push(SPELLING_AND_HINGLISH_MAP[w]);
      if (['iphon', 'iphne', 'maks', 'samsng', 'samung', 'lapotp', 'erabuds'].includes(w)) {
        spellingCorrected = true;
      }
    } else {
      correctedWords.push(w);
    }
  }

  let cleaned = correctedWords.join(' ');

  // 2. Budget extraction (under 20k, below 15000, 50 hazar ke andar, under 1000)
  let maxBudget: number | null = null;
  let minBudget: number | null = null;

  // Patterns like "50 thousand under", "50000 ke andar", "under 20k", "under ₹20,000", "below 15000"
  const underRegex = /(?:under|below|less than|within|<|ke andar|ke niche)?\s*(?:₹|rs\.?|inr)?\s*(\d+(?:,\d+)?(?:\.\d+)?)\s*(k|thousand|lakh)?\s*(?:under|below|ke andar)?/i;
  
  // Specific match for "under X" or "X ke andar"
  const budgetMatch = lower.match(/(?:under|below|less than|within|<)\s*(?:₹|rs\.?|inr)?\s*(\d+(?:,\d+)?(?:\.\d+)?)\s*(k|thousand|lakh)?/i) ||
                      lower.match(/(\d+(?:,\d+)?(?:\.\d+)?)\s*(k|thousand|lakh|hazar|hazaar)\s*(?:ke andar|ke niche|under|budget)/i);

  if (budgetMatch) {
    let val = parseFloat(budgetMatch[1].replace(/,/g, ''));
    const mult = (budgetMatch[2] || '').toLowerCase();
    if (mult === 'k' || mult === 'thousand' || mult === 'hazar' || mult === 'hazaar') val *= 1000;
    else if (mult === 'lakh') val *= 100000;
    if (!isNaN(val) && val > 0) {
      maxBudget = val;
    }
  }

  // 3. Accessory intent detection
  const isAccessory = /(?:case|cover|back cover|tempered glass|screen protector|skin|pouch|charger|cable|adapter|strap|band|sleeve)(?:\b|$)/i.test(lower);

  // 4. Product Type & Category Slug detection
  let productType = 'general product';
  let categorySlug: ParsedQuery['category_slug'] = 'electronics';

  if (isAccessory) {
    categorySlug = 'accessories';
    productType = 'phone case or accessory';
  } else if (/(?:phone|smartphone|mobile|android|iphone)/i.test(lower)) {
    categorySlug = 'phones';
    productType = 'smartphone';
  } else if (/(?:laptop|notebook|macbook|gaming laptop|pc|computer)/i.test(lower)) {
    categorySlug = 'laptops';
    productType = lower.includes('gaming') || lower.includes('sasta gaming') ? 'gaming laptop' : 'laptop';
  } else if (/(?:shoe|shoes|sneaker|sneakers|running|footwear|air max|pegasus)/i.test(lower)) {
    categorySlug = 'shoes';
    productType = lower.includes('running') ? 'running shoes' : 'shoes';
  } else if (/(?:earbud|earbuds|tws|headphone|headphones|earphones|airpods|buds|audio)/i.test(lower)) {
    categorySlug = 'audio';
    productType = lower.includes('headphone') ? 'headphones' : 'earbuds';
  } else if (/(?:ac|air conditioner|split ac|inverter ac|refrigerator|washing machine|fryer|vacuum|tv|television)/i.test(lower)) {
    categorySlug = 'appliances';
    productType = lower.includes('ac') || lower.includes('air conditioner') ? 'split air conditioner' : 'home appliance';
  } else if (/(?:lipstick|makeup|cosmetics|skincare|gift for mom|perfume|cream|hamper)/i.test(lower)) {
    categorySlug = 'lifestyle';
    productType = lower.includes('lipstick') ? 'matte lipstick' : (lower.includes('gift') ? 'gift hamper' : 'beauty & personal care');
  }

  // 5. Brand and Model extraction (check on both lower and cleaned text for spelling corrections)
  const textToCheck = `${lower} ${cleaned}`;
  let brand: string | null = null;
  let model: string | null = null;

  if (textToCheck.includes('apple') || textToCheck.includes('iphone') || textToCheck.includes('macbook')) {
    brand = 'Apple';
    if (textToCheck.includes('iphone 15 pro')) model = 'iPhone 15 Pro';
    else if (textToCheck.includes('iphone 15')) model = 'iPhone 15';
    else if (textToCheck.includes('iphone 16 pro')) model = 'iPhone 16 Pro';
    else if (textToCheck.includes('macbook pro')) model = 'MacBook Pro';
    else if (textToCheck.includes('macbook air')) model = 'MacBook Air';
  } else if (textToCheck.includes('samsung') || textToCheck.includes('galaxy')) {
    brand = 'Samsung';
    if (textToCheck.includes('s24 ultra')) model = 'Galaxy S24 Ultra';
    else if (textToCheck.includes('m35')) model = 'Galaxy M35 5G';
  } else if (textToCheck.includes('nike')) {
    brand = 'Nike';
    if (textToCheck.includes('air max')) model = 'Air Max SC';
    else if (textToCheck.includes('pegasus')) model = 'Pegasus 41';
  } else if (textToCheck.includes('boat')) {
    brand = 'boAt';
    if (textToCheck.includes('airdopes')) model = 'Airdopes 141';
    else if (textToCheck.includes('nirvana')) model = 'Nirvana Ion ANC';
  } else if (textToCheck.includes('daikin')) {
    brand = 'Daikin';
    model = '1.5 Ton 5 Star Split AC';
  } else if (textToCheck.includes('maybelline')) {
    brand = 'Maybelline';
    model = 'SuperStay Matte Ink';
  } else if (textToCheck.includes('spigen')) {
    brand = 'Spigen';
    model = 'Liquid Air Case';
  } else if (textToCheck.includes('lenovo')) {
    brand = 'Lenovo';
    model = 'LOQ 15 Gaming Laptop';
  } else if (textToCheck.includes('motorola') || textToCheck.includes('moto')) {
    brand = 'Motorola';
    model = 'Moto G85 5G';
  } else if (textToCheck.includes('nothing') || textToCheck.includes('cmf')) {
    brand = textToCheck.includes('cmf') ? 'CMF by Nothing' : 'Nothing';
    model = textToCheck.includes('cmf') ? 'CMF Phone 1' : 'Phone (2a)';
  } else if (textToCheck.includes('puma')) {
    brand = 'Puma';
    model = 'Velocity Nitro 3';
  } else if (textToCheck.includes('sony')) {
    brand = 'Sony';
    model = 'WH-1000XM5';
  }

  // 6. Variants: storage, ram, size, color
  const variant: ParsedQuery['variant'] = {};
  const storageMatch = lower.match(/(128gb|256gb|512gb|1tb|64gb)/i);
  if (storageMatch) variant.storage = storageMatch[1].toUpperCase();

  const ramMatch = lower.match(/(8gb|16gb|12gb|32gb|6gb|4gb)\s*ram/i) || lower.match(/\b(16gb|8gb)\b/i);
  if (ramMatch && !variant.storage) variant.ram = ramMatch[1].toUpperCase();

  const sizeMatch = lower.match(/size\s*(\d+(?:\.\d+)?)/i) || lower.match(/\b(\d+)\s*(?:uk|us)\b/i);
  if (sizeMatch) variant.size = `Size ${sizeMatch[1]}`;

  const colorMatch = lower.match(/\b(black|white|red|blue|matte red|natural titanium|desert titanium|olive green|yellow)\b/i);
  if (colorMatch) variant.color = colorMatch[1];

  // 7. Must have features & use case
  const mustHave: string[] = [];
  if (lower.includes('1.5 ton')) mustHave.push('1.5 Ton Capacity');
  if (lower.includes('5 star')) mustHave.push('5 Star Inverter');
  if (lower.includes('split ac')) mustHave.push('Split AC');
  if (lower.includes('matte')) mustHave.push('Matte Finish');
  if (lower.includes('128gb')) mustHave.push('128GB Storage');
  if (lower.includes('size 9')) mustHave.push('Size 9 UK');
  if (lower.includes('anc')) mustHave.push('Active Noise Cancellation');

  let useCase: string | null = null;
  if (lower.includes('coding') || lower.includes('programming')) useCase = 'Coding & Software Development';
  else if (lower.includes('gaming')) useCase = 'High Performance Gaming';
  else if (lower.includes('running') || lower.includes('gym')) useCase = 'Running & Athletic Fitness';
  else if (lower.includes('gift for mom') || lower.includes('for mom')) useCase = 'Mother Gifting & Spa Pampering';

  let genderOrAge: string | null = null;
  if (lower.includes('mom') || lower.includes('mother')) genderOrAge = 'Mom';
  else if (lower.includes('men') || lower.includes("men's")) genderOrAge = 'Men';
  else if (lower.includes('women') || lower.includes("women's")) genderOrAge = 'Women';

  // 8. Intent
  let intent: ParsedQuery['intent'] = 'category_browsing';
  if (model) intent = 'specific_product';
  else if (lower.includes('vs') || lower.includes('compare')) intent = 'comparison';
  else if (lower.includes('best') || lower.includes('top') || lower.includes('recommend') || lower.includes('gift')) intent = 'recommendation';

  // Corrected Query string
  let correctedQuery = original;
  if (lower.includes('iphon 15 pro maks')) correctedQuery = 'iPhone 15 Pro Max';
  else if (lower.includes('iphon 15')) correctedQuery = 'iPhone 15';
  else if (lower.includes('sasta gaming laptop')) correctedQuery = 'Budget Gaming Laptop';
  else if (spellingCorrected) {
    correctedQuery = words.map(w => SPELLING_AND_HINGLISH_MAP[w] || w).join(' ');
  }

  // 9. Search Variations (4 to 6 expansions)
  const variations = new Set<string>();
  variations.add(original);
  if (correctedQuery !== original) variations.add(correctedQuery);
  if (brand && model) variations.add(`${brand} ${model} ${variant.storage || ''}`.trim());
  if (productType !== 'general product') {
    if (brand) variations.add(`${brand} ${productType}`);
    else variations.add(productType);
  }
  if (useCase) variations.add(`${productType} ${useCase}`);
  if (maxBudget) variations.add(`${productType} under ${maxBudget}`);

  return {
    original_query: original,
    corrected_query: correctedQuery,
    has_spelling_correction: spellingCorrected || (correctedQuery.toLowerCase() !== lower),
    product_type: productType,
    brand,
    model,
    variant,
    budget: {
      min: minBudget,
      max: maxBudget,
    },
    must_have_features: mustHave,
    use_case: useCase,
    gender_or_age: genderOrAge,
    intent,
    is_accessory: isAccessory,
    confidence: model ? 0.95 : (productType !== 'general product' ? 0.85 : 0.6),
    shorthand_expanded: cleaned,
    did_you_mean: spellingCorrected ? correctedQuery : null,
    search_variations: Array.from(variations).slice(0, 6),
    category_slug: categorySlug,
  };
}

/**
 * Intelligent query understanding pipeline
 * Calls Gemini with strict schema; falls back gracefully to deterministic parser
 */
export async function understandQuery(userQuery: string): Promise<ParsedQuery> {
  const clean = (userQuery || '').trim();
  if (!clean) return parseQueryOffline('best electronics deals');

  const offlineParsed = parseQueryOffline(clean);
  // If offline parser has high confidence (exact model, brand, or accessory recognized), return immediately!
  if (offlineParsed.confidence >= 0.85) {
    return offlineParsed;
  }

  const ai = getAiClient();
  if (!ai) return offlineParsed;

  const systemInstruction = `You are the Vantage AI Query Understanding Engine for Indian e-commerce.
Convert any user query into a clean, structured JSON specification.
Handle spelling mistakes (e.g. "iphon 15" -> "iPhone 15"), Indian slang/Hinglish (e.g. "sasta gaming laptop" -> "budget gaming laptop", "50 hazar ke andar phone" -> max budget 50000), and abbreviations ("tws" -> true wireless earbuds, "1.5 ton ac" -> split air conditioner).
CRITICAL: Detect if the user wants an ACCESSORY (e.g., case, cover, charger, screen protector) vs the actual phone/device! "samsung s24 ultra case" has is_accessory: true and product_type: "phone case".
Return ONLY valid JSON (no markdown fences, no explanation).`;

  const prompt = `Analyze this shopping query: "${clean}".
Return a JSON object matching this schema:
{
  "product_type": "string (e.g. smartphone, running shoes, gaming laptop, phone case, earbuds, split air conditioner, matte lipstick)",
  "brand": "string or null",
  "model": "string or null",
  "corrected_query": "string (corrected for spelling mistakes or Indian slang)",
  "has_spelling_correction": true/false,
  "is_accessory": true/false,
  "budget": { "min": number or null, "max": number or null },
  "variant": { "color": "string or null", "size": "string or null", "storage": "string or null", "ram": "string or null" },
  "must_have_features": ["string"],
  "use_case": "string or null",
  "gender_or_age": "string or null",
  "intent": "specific_product" | "category_browsing" | "comparison" | "recommendation",
  "search_variations": ["variation 1", "variation 2", "variation 3", "variation 4"]
}`;

  for (const model of CANDIDATE_MODELS) {
    try {
      const response: any = await Promise.race([
        ai.models.generateContent({
          model,
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
          },
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 1500)),
      ]);

      const raw = (response.text || '').trim();
      const parsed = JSON.parse(raw);

      if (parsed && parsed.product_type) {
        return {
          original_query: clean,
          corrected_query: parsed.corrected_query || offlineParsed.corrected_query,
          has_spelling_correction: Boolean(parsed.has_spelling_correction) || offlineParsed.has_spelling_correction,
          product_type: parsed.product_type || offlineParsed.product_type,
          brand: parsed.brand !== undefined ? parsed.brand : offlineParsed.brand,
          model: parsed.model !== undefined ? parsed.model : offlineParsed.model,
          variant: {
            color: parsed.variant?.color || offlineParsed.variant.color,
            size: parsed.variant?.size || offlineParsed.variant.size,
            storage: parsed.variant?.storage || offlineParsed.variant.storage,
            ram: parsed.variant?.ram || offlineParsed.variant.ram,
          },
          budget: {
            min: typeof parsed.budget?.min === 'number' ? parsed.budget.min : offlineParsed.budget.min,
            max: typeof parsed.budget?.max === 'number' ? parsed.budget.max : offlineParsed.budget.max,
          },
          must_have_features: Array.isArray(parsed.must_have_features) && parsed.must_have_features.length > 0
            ? parsed.must_have_features
            : offlineParsed.must_have_features,
          use_case: parsed.use_case || offlineParsed.use_case,
          gender_or_age: parsed.gender_or_age || offlineParsed.gender_or_age,
          intent: parsed.intent || offlineParsed.intent,
          is_accessory: parsed.is_accessory !== undefined ? Boolean(parsed.is_accessory) : offlineParsed.is_accessory,
          confidence: 0.95,
          shorthand_expanded: offlineParsed.shorthand_expanded,
          did_you_mean: parsed.has_spelling_correction ? parsed.corrected_query : offlineParsed.did_you_mean,
          search_variations: Array.isArray(parsed.search_variations) && parsed.search_variations.length >= 3
            ? parsed.search_variations.slice(0, 6)
            : offlineParsed.search_variations,
          category_slug: offlineParsed.category_slug,
        };
      }
    } catch {
      // Try next model or fall back to offline parser
      continue;
    }
  }

  return offlineParsed;
}
