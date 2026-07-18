"""
Web search via Google's Programmable Search Engine (Custom Search JSON API).

Why this exists: Gemini's free tier includes AI reasoning for free, but NOT
Google Search grounding (that's a paid-only feature on Gemini). To get live
web results without paying anything, we call Google's Custom Search JSON
API directly (free for up to 100 queries/day, no credit card required) and
feed the results to Gemini as context.

Setup required (see README for full steps):
1. Create a Programmable Search Engine at https://programmablesearchengine.google.com/
   configured to search the entire web -> gives you a "Search engine ID" (cx)
2. Enable the "Custom Search API" in Google Cloud Console and create an API key
3. Put both in .env / Streamlit secrets as GOOGLE_SEARCH_API_KEY and GOOGLE_SEARCH_CX

Free quota: 100 queries/day total. Each call to search() below uses exactly
one query, regardless of num_results.
"""

import requests
from config import get_secret

SEARCH_URL = "https://www.googleapis.com/customsearch/v1"


def search(query: str, num_results: int = 5) -> list[dict]:
    """
    Runs one Google Custom Search query. Returns a list of dicts with
    'title', 'snippet', and 'link'. Returns an empty list (not an
    exception) if search isn't configured or the request fails, so
    callers can degrade gracefully instead of crashing.
    """
    api_key = get_secret("GOOGLE_SEARCH_API_KEY")
    cx = get_secret("GOOGLE_SEARCH_CX")

    if not api_key or not cx:
        return []

    params = {
        "key": api_key,
        "cx": cx,
        "q": query,
        "num": min(max(num_results, 1), 10),  # API allows 1-10 per call
    }

    try:
        resp = requests.get(SEARCH_URL, params=params, timeout=10)
        resp.raise_for_status()
        data = resp.json()
    except Exception:
        return []

    results = []
    for item in data.get("items", []):
        results.append({
            "title": item.get("title", ""),
            "snippet": item.get("snippet", ""),
            "link": item.get("link", ""),
        })
    return results


def format_results_for_prompt(results: list[dict], label: str = "Search results") -> str:
    """Turns a list of search results into a readable text block for the LLM prompt."""
    if not results:
        return f"{label}: (no results found — search may be unconfigured or the query returned nothing)"

    lines = [f"{label}:"]
    for i, r in enumerate(results, 1):
        lines.append(f"{i}. {r['title']}\n   {r['snippet']}\n   Source: {r['link']}")
    return "\n".join(lines)
