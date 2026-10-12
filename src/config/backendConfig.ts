/**
 * Frontend Configuration for Auxiliary Python Backend Service
 *
 * Configurable via Vite environment variables:
 * - VITE_PYTHON_BACKEND_URL: Base URL of deployed FastAPI backend (e.g. Render / Cloud Run)
 * - VITE_PYTHON_BACKEND_API_KEY: Optional API key header value
 *
 * Defaults to empty string, enabling instant zero-error fallback to Express & Gemini pipeline.
 */

export const BACKEND_CONFIG = {
  // If set, requests are routed to the Python service; otherwise graceful fallback is used
  baseUrl: (import.meta as any).env?.VITE_PYTHON_BACKEND_URL || '',
  apiKey: (import.meta as any).env?.VITE_PYTHON_BACKEND_API_KEY || '',
  timeoutMs: 4500,
  maxRetries: 1,
};
