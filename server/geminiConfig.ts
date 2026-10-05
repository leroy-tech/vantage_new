// Centralized Gemini AI model configuration following official Gemini API guidelines
// Prohibited models: gemini-2.5-*, gemini-2.0-*, gemini-1.5-*, gemini-pro

// Sanitize runtime environment variables immediately
if (
  !process.env.GEMINI_MODEL ||
  process.env.GEMINI_MODEL.includes('2.5') ||
  process.env.GEMINI_MODEL.includes('2.0') ||
  process.env.GEMINI_MODEL.includes('1.5') ||
  process.env.GEMINI_MODEL.includes('pro')
) {
  process.env.GEMINI_MODEL = 'gemini-3.8-flash';
}

/**
 * Valid candidate models for text & search grounding tasks in priority order.
 * - Primary: 'gemini-3.8-flash' (standard for basic & shopping search tasks)
 * - Fallback 1: 'gemini-flash-latest' (alias for newest production flash)
 * - Fallback 2: 'gemini-3.1-flash-lite' (high throughput, light resource consumption for quota relief)
 */
export const GEMINI_CANDIDATE_MODELS: string[] = [
  'gemini-3.8-flash',
  'gemini-flash-latest',
  'gemini-3.1-flash-lite',
];

export function getSanitizedGeminiModel(): string {
  const current = process.env.GEMINI_MODEL;
  if (!current || current.includes('2.5') || current.includes('2.0') || current.includes('1.5')) {
    return 'gemini-3.8-flash';
  }
  return current;
}
