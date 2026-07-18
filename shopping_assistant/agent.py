"""
Research & Shopping Assistant — powered by Google Gemini (free tier) +
Google Custom Search (free tier, 100 queries/day).

This replaces the original Anthropic-powered version to run at zero cost.
Since Gemini's free tier doesn't include built-in search grounding, this
module does the orchestration manually:

  1. Take the user's message/goal
  2. Run it through web_search.search() to get real, current results
  3. Feed those results to Gemini as context and ask it to reason over them

The public methods (ask, ask_structured, multi_source_research,
check_current_price, remember, forget, preferences, reset) are kept
identical in name/shape to the original version, so app.py, cli.py, and
price_tracker.py did not need to change.
"""

import json
import re
from google import genai
from google.genai import types

import db
import web_search
from config import get_secret

MODEL = get_secret("GEMINI_MODEL", "gemini-2.5-flash")

BASE_SYSTEM_PROMPT = """You are a careful, honest shopping and research assistant.

You will be given real web search results as context. You should:
1. Base your answer on the search results provided — don't invent prices,
   specs, or reviews that aren't in them.
2. Compare at least 3 real options when the goal involves choosing a product,
   if the search results support that.
3. Be explicit about trade-offs (price vs quality, pros vs cons).
4. If the search results are thin, conflicting, or don't answer the
   question well, say so plainly rather than guessing.
5. Cite sources by URL when stating a price, spec, or claim.

When you give a final recommendation, structure it clearly with:
- A short summary (1-2 sentences)
- A ranked list of options with price, pros, cons
- Sources

Keep responses concise and skimmable. Use plain language, not marketing speak.
"""


class ShoppingAssistant:
    """Wraps a multi-turn conversation with Gemini, grounded in live web search.

    Pass a user_id to enable persistent memory: remembered preferences
    (budget, brand, must-have features) get folded into the system prompt
    automatically on every request.
    """

    def __init__(self, user_id: str = "default"):
        api_key = get_secret("GEMINI_API_KEY")
        if not api_key:
            raise RuntimeError(
                "GEMINI_API_KEY not found. Copy .env.example to .env and add your "
                "free Gemini API key (from https://aistudio.google.com/apikey), "
                "or add it to Streamlit secrets (cloud deployment)."
            )
        self.client = genai.Client(api_key=api_key)
        self.turns = []  # clean [{"role": "user"/"model", "text": ...}] history for display/context
        self.user_id = user_id
        db.init_db()

    # ---------- Memory ----------

    def _system_prompt(self) -> str:
        """Base prompt + any remembered preferences for this user."""
        prefs = {k: v for k, v in db.get_preferences(self.user_id).items() if not k.startswith("_")}
        if not prefs:
            return BASE_SYSTEM_PROMPT
        pref_lines = "\n".join(f"- {k}: {v}" for k, v in prefs.items())
        return (
            BASE_SYSTEM_PROMPT
            + f"\n\nKnown preferences for this user (apply them unless they "
              f"explicitly say otherwise this time):\n{pref_lines}\n"
        )

    def remember(self, key: str, value: str):
        """Explicitly store a preference, e.g. remember('budget', 'under $150')."""
        db.set_preference(self.user_id, key, value)

    def forget(self, key: str):
        db.delete_preference(self.user_id, key)

    def preferences(self) -> dict:
        return db.get_preferences(self.user_id)

    # ---------- Internal helpers ----------

    def _build_contents(self, current_user_text: str):
        """Turns clean history + the new (search-grounded) user turn into
        the `contents` list the Gemini API expects."""
        contents = []
        for turn in self.turns:
            contents.append(types.Content(
                role=turn["role"],
                parts=[types.Part(text=turn["text"])],
            ))
        contents.append(types.Content(
            role="user",
            parts=[types.Part(text=current_user_text)],
        ))
        return contents

    def _generate(self, current_user_text: str, system_prompt: str = None) -> str:
        contents = self._build_contents(current_user_text)
        config = types.GenerateContentConfig(
            system_instruction=system_prompt or self._system_prompt(),
        )
        response = self.client.models.generate_content(
            model=MODEL, contents=contents, config=config,
        )
        return (response.text or "").strip()

    # ---------- Chat ----------

    def ask(self, user_message: str) -> str:
        """Send a message, get back the assistant's text reply, keep history."""
        results = web_search.search(user_message, num_results=6)
        context = web_search.format_results_for_prompt(results, label="Live web search results")

        grounded_prompt = f"{context}\n\nUser question: {user_message}"
        reply = self._generate(grounded_prompt)

        # Keep the CLEAN message (not the search dump) in history, so
        # conversation context stays readable and doesn't balloon with
        # repeated search results on every turn.
        self.turns.append({"role": "user", "text": user_message})
        self.turns.append({"role": "model", "text": reply})
        return reply

    def ask_structured(self, goal: str) -> dict:
        """
        One-shot structured version: searches the web for a goal and asks
        Gemini to return JSON instead of prose.
        """
        results = web_search.search(goal, num_results=6)
        context = web_search.format_results_for_prompt(results, label="Live web search results")

        prompt = f"""{context}

Research this goal: {goal}

Respond with ONLY valid JSON (no markdown fences, no extra text) in exactly
this shape:

{{
  "summary": "one or two sentence summary",
  "recommendations": [
    {{
      "rank": 1,
      "name": "product or option name",
      "price": "approximate price or range",
      "pros": ["...", "..."],
      "cons": ["...", "..."],
      "source_url": "..."
    }}
  ]
}}
"""
        raw = self._generate(prompt)
        return _parse_json_response(raw)

    def reset(self):
        """Clear conversation history to start a fresh research session."""
        self.turns = []

    # ---------- Multi-source research ----------

    def multi_source_research(self, goal: str) -> dict:
        """
        Runs three separate, source-focused searches (retail listings,
        community/forum opinion, and expert reviews) and then asks Gemini
        to synthesize them into one final recommendation.
        """
        queries = {
            "retail": f"{goal} price buy",
            "community": f"site:reddit.com {goal}",
            "expert": f"{goal} expert review",
        }

        findings = {}
        for label, query in queries.items():
            results = web_search.search(query, num_results=5)
            findings[label] = web_search.format_results_for_prompt(
                results, label=f"{label.capitalize()} search results"
            )

        synthesis_prompt = f"""You are researching this goal: {goal}

--- Retail/pricing findings ---
{findings['retail']}

--- Community/forum findings ---
{findings['community']}

--- Expert review findings ---
{findings['expert']}

Now synthesize ALL of this into ONE final recommendation. Respond with ONLY
valid JSON (no markdown fences, no extra text) in exactly this shape:

{{
  "summary": "one or two sentence overall summary",
  "recommendations": [
    {{
      "rank": 1,
      "name": "product or option name",
      "price": "approximate price or range",
      "pros": ["...", "..."],
      "cons": ["...", "..."],
      "community_take": "short summary of what real users/forums say",
      "expert_take": "short summary of what expert reviews say",
      "source_url": "..."
    }}
  ]
}}
"""
        raw = self._generate(synthesis_prompt)
        result = _parse_json_response(raw)
        result["_raw_findings"] = findings  # kept for transparency/debugging
        return result

    # ---------- Price tracking ----------

    def check_current_price(self, search_query: str) -> dict:
        """
        Does a focused search for the current price of a specific product
        and returns a small structured result. Used by the price tracker.
        """
        results = web_search.search(f"{search_query} price", num_results=5)
        context = web_search.format_results_for_prompt(results, label="Live web search results")

        prompt = f"""{context}

Based on the search results above, what is the current price of: {search_query}

Respond with ONLY valid JSON (no markdown fences, no extra text) in exactly
this shape:

{{
  "price": 129.99,
  "currency": "USD",
  "source_url": "...",
  "note": "short note, e.g. if price varies by retailer or is a sale price"
}}

If the search results don't give a clear current price, set "price" to null
and explain in "note".
"""
        raw = self._generate(prompt)
        return _parse_json_response(raw)


def _parse_json_response(raw: str) -> dict:
    """Strip markdown fences if present and parse JSON, with a safe fallback."""
    cleaned = re.sub(r"^```(json)?|```$", "", raw, flags=re.MULTILINE).strip()
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        return {"error": "Could not parse JSON", "raw_response": raw}
