import os
from typing import List

# Server configuration
PORT: int = int(os.getenv("PORT", "8000"))
API_KEY: str = os.getenv("VANTAGE_BACKEND_API_KEY", "")
ENVIRONMENT: str = os.getenv("ENVIRONMENT", "production")

# Allowed Frontend Origins for CORS
ALLOWED_ORIGINS: List[str] = [
    origin.strip()
    for origin in os.getenv(
        "ALLOWED_ORIGINS",
        "https://ais-dev-a2ixnf5atagwubayx53sgz-771944310684.asia-southeast1.run.app,https://ais-pre-a2ixnf5atagwubayx53sgz-771944310684.asia-southeast1.run.app,http://localhost:3000,http://127.0.0.1:3000,*"
    ).split(",")
    if origin.strip()
]

# Strict Allowlist of Indian E-Commerce and Official Brand Domains
ALLOWED_DOMAINS: List[str] = [
    "amazon.in",
    "flipkart.com",
    "myntra.com",
    "croma.com",
    "reliancedigital.in",
    "nykaa.com",
    "meesho.com",
    "ajio.com",
    "tatacliq.com",
    "vijaysales.com",
    "apple.com",
    "samsung.com",
    "sony.co.in",
    "sony.com",
    "oneplus.in",
    "motorola.in",
    "nothing.tech",
    "dyson.in",
    "boseapac.com",
    "boseindia.com",
    "bose.com",
    "boat-lifestyle.com",
    "realme.com",
    "mi.com",
    "xiaomi.com",
    "asus.com",
    "dell.com",
    "hp.com",
    "lenovo.com",
    "acer.com",
    "lg.com",
    "philips.co.in",
    "logitech.com",
    "nike.com",
]

# Cache TTL in seconds (6 hours)
CACHE_TTL_SECONDS: int = 6 * 60 * 60
