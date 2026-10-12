from pydantic import BaseModel, HttpUrl, Field
from typing import List, Optional, Dict, Any

class VerifyLinksRequest(BaseModel):
    urls: List[str] = Field(..., max_length=50, description="List of product candidate URLs to verify")

class VerifiedLinkResult(BaseModel):
    original_url: str
    final_url: str
    status: int
    is_product_page: bool
    domain: str
    is_trusted: bool
    error: Optional[str] = None

class VerifyLinksResponse(BaseModel):
    results: List[VerifiedLinkResult]
    total_checked: int
    all_ok: bool

class ExtractRequest(BaseModel):
    url: str = Field(..., description="Product detail page URL to extract attributes from")
    force_refresh: bool = Field(False, description="Whether to bypass 6-hour cache")

class ExtractResponse(BaseModel):
    url: str
    title: str
    price: float
    price_formatted: str
    rating: float
    image_url: str
    specs: List[str]
    in_stock: bool
    cached: bool
    domain: str
    extraction_time_ms: float

class ProductDocument(BaseModel):
    id: str
    name: str
    category: Optional[str] = "electronics"
    brand: Optional[str] = ""
    price: Optional[float] = 0.0
    price_formatted: Optional[str] = ""
    rating: Optional[float] = 4.5
    image_url: Optional[str] = ""
    buy_url: Optional[str] = ""
    store: Optional[str] = "Verified Store"
    specs: Optional[List[str]] = []
    metadata: Optional[Dict[str, Any]] = {}

class EmbedSearchRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=500, description="Semantic search query")
    top_k: int = Field(5, ge=1, le=25, description="Number of top similar items to return")
    products: Optional[List[ProductDocument]] = Field(None, description="Optional set of products to index/refresh")

class ScoredProductMatch(BaseModel):
    id: str
    name: str
    category: str
    brand: str
    price: float
    price_formatted: str
    rating: float
    image_url: str
    buy_url: str
    store: str
    specs: List[str]
    similarity_score: float

class EmbedSearchResponse(BaseModel):
    query: str
    total_indexed: int
    matches: List[ScoredProductMatch]
    engine: str

class HealthResponse(BaseModel):
    status: str
    service: str
    version: str
    chroma_available: bool
    embedder_loaded: bool
    uptime_seconds: float
