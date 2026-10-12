import time
import asyncio
import httpx
from fastapi import FastAPI, Header, HTTPException, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from config import ALLOWED_ORIGINS, API_KEY
from schemas import (
    VerifyLinksRequest,
    VerifyLinksResponse,
    VerifiedLinkResult,
    ExtractRequest,
    ExtractResponse,
    EmbedSearchRequest,
    EmbedSearchResponse,
    HealthResponse,
    ProductDocument
)
from security import (
    check_ssrf_safety,
    extract_domain,
    is_allowed_domain,
    check_is_product_detail_page
)
from extractor import extract_product_data
from embedder import embedder_service

START_TIME = time.time()

# Rate limiting
limiter = Limiter(key_func=get_remote_address)
app = FastAPI(
    title="Vantage AI Verification & Semantic Search API",
    description="Python FastAPI auxiliary microservice for strict SSRF-safe link verification, product extraction, and semantic vector matching.",
    version="1.0.0"
)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if "*" in ALLOWED_ORIGINS else ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def verify_api_key_header(x_api_key: str = Header(None)):
    """Optional simple API key authentication. Bypassed if server has no key configured."""
    if API_KEY and x_api_key != API_KEY:
        raise HTTPException(status_code=401, detail="Invalid or missing X-API-Key header.")

@app.on_event("startup")
async def on_startup():
    # Warm up embedder asynchronously without blocking boot
    try:
        embedder_service.initialize()
    except Exception as e:
        print(f"[Backend] Startup embedder note: {e}")

    # Seed baseline products for immediate embed-search testing
    seed_products = [
        ProductDocument(
            id="pixel-9-pro",
            name="Google Pixel 9 Pro XL",
            category="phones",
            brand="Google",
            price=124999.0,
            price_formatted="₹1,24,999",
            specs=["Tensor G4 chip", "50MP Triple Camera", "Super Actua display"],
            store="Flipkart"
        ),
        ProductDocument(
            id="sony-wh-xm5",
            name="Sony WH-1000XM5 Wireless Headphones",
            category="audio",
            brand="Sony",
            price=28990.0,
            price_formatted="₹28,990",
            specs=["Industry Leading ANC", "30-hr battery", "LDAC Lossless"],
            store="Amazon India"
        ),
        ProductDocument(
            id="macbook-air-m3",
            name="Apple MacBook Air 13-inch M3",
            category="laptops",
            brand="Apple",
            price=114900.0,
            price_formatted="₹1,14,900",
            specs=["Apple M3 chip", "16GB Unified RAM", "Liquid Retina Display"],
            store="Amazon India"
        ),
        ProductDocument(
            id="boat-nirvana-ion",
            name="boAt Nirvana Ion ANC Earbuds",
            category="audio",
            brand="boAt",
            price=2499.0,
            price_formatted="₹2,499",
            specs=["32dB ANC", "120-hour playback", "Crystal Bionic Sound"],
            store="Amazon India"
        )
    ]
    embedder_service.index_products(seed_products)

@app.get("/health", response_model=HealthResponse)
async def health_check():
    return HealthResponse(
        status="ok",
        service="vantage-python-backend",
        version="1.0.0",
        chroma_available=bool(embedder_service.collection is not None),
        embedder_loaded=bool(embedder_service.embed_model is not None),
        uptime_seconds=round(time.time() - START_TIME, 2)
    )

async def probe_single_url(raw_url: str, client: httpx.AsyncClient) -> VerifiedLinkResult:
    # 1. SSRF & Scheme check
    safe, err = check_ssrf_safety(raw_url)
    if not safe:
        return VerifiedLinkResult(
            original_url=raw_url,
            final_url=raw_url,
            status=400,
            is_product_page=False,
            domain=extract_domain(raw_url),
            is_trusted=False,
            error=err
        )

    domain = extract_domain(raw_url)
    is_trusted = is_allowed_domain(domain)
    if not is_trusted:
        return VerifiedLinkResult(
            original_url=raw_url,
            final_url=raw_url,
            status=403,
            is_product_page=False,
            domain=domain,
            is_trusted=False,
            error=f"Domain {domain} is not in trusted allowlist"
        )

    # 2. HTTP probe with redirect following
    final_url = raw_url
    status_code = 200
    try:
        resp = await client.head(raw_url)
        final_url = str(resp.url)
        status_code = resp.status_code
        if status_code >= 400:
            # Fallback to GET for CDNs that reject HEAD
            get_resp = await client.get(raw_url, headers={"Range": "bytes=0-100"})
            final_url = str(get_resp.url)
            status_code = get_resp.status_code
    except Exception as e:
        status_code = 0
        final_url = raw_url

    is_pdp = check_is_product_detail_page(final_url)

    return VerifiedLinkResult(
        original_url=raw_url,
        final_url=final_url,
        status=status_code,
        is_product_page=is_pdp,
        domain=extract_domain(final_url),
        is_trusted=is_trusted,
        error=None if (200 <= status_code < 400 or status_code == 0) else f"HTTP {status_code}"
    )

@app.post("/verify-links", response_model=VerifyLinksResponse)
@limiter.limit("60/minute")
async def verify_links(
    req: VerifyLinksRequest,
    request: Request,
    _: None = Depends(verify_api_key_header)
):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    }

    results: list[VerifiedLinkResult] = []
    async with httpx.AsyncClient(headers=headers, timeout=5.0, follow_redirects=True) as client:
        tasks = [probe_single_url(u, client) for u in req.urls[:20]]
        results = await asyncio.gather(*tasks)

    all_ok = all(r.status >= 200 and r.status < 400 for r in results) if results else True
    return VerifyLinksResponse(
        results=results,
        total_checked=len(results),
        all_ok=all_ok
    )

@app.post("/extract", response_model=ExtractResponse)
@limiter.limit("30/minute")
async def extract_product(
    req: ExtractRequest,
    request: Request,
    _: None = Depends(verify_api_key_header)
):
    try:
        data = await extract_product_data(req.url, req.force_refresh)
        return ExtractResponse(**data)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Extraction failure: {str(e)}")

@app.post("/embed-search", response_model=EmbedSearchResponse)
@limiter.limit("60/minute")
async def embed_search(
    req: EmbedSearchRequest,
    request: Request,
    _: None = Depends(verify_api_key_header)
):
    if req.products:
        embedder_service.index_products(req.products)

    matches = embedder_service.search(req.query, top_k=req.top_k)
    return EmbedSearchResponse(
        query=req.query,
        total_indexed=len(embedder_service.in_memory_docs),
        matches=matches,
        engine="chromadb-bge-small" if embedder_service.initialized else "in-memory-cosine"
    )

if __name__ == "__main__":
    import uvicorn
    from config import PORT
    uvicorn.run("main:app", host="0.0.0.0", port=PORT, reload=False)
