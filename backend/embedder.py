import math
from typing import List, Dict, Any, Optional
from schemas import ProductDocument, ScoredProductMatch

# Fallback vector index with cosine similarity if sentence-transformers / Chroma
# is not yet initialized or memory constrained on free tier.
class SemanticEmbedderService:
    def __init__(self):
        self.chroma_client = None
        self.collection = None
        self.embed_model = None
        self.in_memory_docs: Dict[str, ProductDocument] = {}
        self.in_memory_vectors: Dict[str, List[float]] = {}
        self.initialized = False

    def initialize(self):
        try:
            from sentence_transformers import SentenceTransformer
            import chromadb

            # Use lightweight bge-small or all-MiniLM-L6-v2
            self.embed_model = SentenceTransformer("BAAI/bge-small-en-v1.5")
            self.chroma_client = chromadb.Client()
            self.collection = self.chroma_client.get_or_create_collection(name="vantage_products")
            self.initialized = True
            print("[Backend] ChromaDB & SentenceTransformer loaded successfully.")
        except Exception as e:
            print(f"[Backend] Note: Using fast fallback keyword/token vector embedder ({e})")
            self.initialized = False

    def _simple_vectorize(self, text: str) -> List[float]:
        # Fast 64-dimensional token frequency hashing vectorizer
        words = text.lower().split()
        vec = [0.0] * 64
        for w in words:
            h = hash(w) % 64
            vec[h] += 1.0
        # Normalize
        norm = math.sqrt(sum(x * x for x in vec)) or 1.0
        return [x / norm for x in vec]

    def _cosine_similarity(self, v1: List[float], v2: List[float]) -> float:
        dot = sum(a * b for a, b in zip(v1, v2))
        return max(0.0, min(1.0, dot))

    def index_products(self, products: List[ProductDocument]) -> int:
        for p in products:
            self.in_memory_docs[p.id] = p
            full_text = f"{p.name} {p.brand or ''} {p.category or ''} {' '.join(p.specs or [])}"

            if self.initialized and self.embed_model and self.collection:
                try:
                    embedding = self.embed_model.encode(full_text).tolist()
                    self.collection.upsert(
                        ids=[p.id],
                        embeddings=[embedding],
                        metadatas=[{"name": p.name, "category": p.category or ""}],
                        documents=[full_text]
                    )
                    continue
                except Exception:
                    pass

            # Fallback in-memory
            self.in_memory_vectors[p.id] = self._simple_vectorize(full_text)

        return len(self.in_memory_docs)

    def search(self, query: str, top_k: int = 5) -> List[ScoredProductMatch]:
        results: List[ScoredProductMatch] = []

        if self.initialized and self.embed_model and self.collection:
            try:
                q_embed = self.embed_model.encode(query).tolist()
                query_res = self.collection.query(query_embeddings=[q_embed], n_results=top_k)
                if query_res and query_res["ids"] and len(query_res["ids"][0]) > 0:
                    for i, pid in enumerate(query_res["ids"][0]):
                        doc = self.in_memory_docs.get(pid)
                        if doc:
                            dist = query_res["distances"][0][i] if "distances" in query_res and query_res["distances"] else 0.2
                            score = max(0.1, 1.0 - (dist / 2.0))
                            results.append(
                                ScoredProductMatch(
                                    id=doc.id,
                                    name=doc.name,
                                    category=doc.category or "electronics",
                                    brand=doc.brand or "",
                                    price=doc.price or 0.0,
                                    price_formatted=doc.price_formatted or "₹0",
                                    rating=doc.rating or 4.5,
                                    image_url=doc.image_url or "",
                                    buy_url=doc.buy_url or "",
                                    store=doc.store or "Verified Store",
                                    specs=doc.specs or [],
                                    similarity_score=round(score, 3)
                                )
                            )
                    return results
            except Exception:
                pass

        # In-memory cosine similarity fallback
        q_vec = self._simple_vectorize(query)
        scored = []
        for pid, doc in self.in_memory_docs.items():
            doc_vec = self.in_memory_vectors.get(pid)
            if not doc_vec:
                full_text = f"{doc.name} {doc.brand or ''} {doc.category or ''} {' '.join(doc.specs or [])}"
                doc_vec = self._simple_vectorize(full_text)
                self.in_memory_vectors[pid] = doc_vec

            score = self._cosine_similarity(q_vec, doc_vec)
            scored.append((score, doc))

        scored.sort(key=lambda x: x[0], reverse=True)

        for score, doc in scored[:top_k]:
            results.append(
                ScoredProductMatch(
                    id=doc.id,
                    name=doc.name,
                    category=doc.category or "electronics",
                    brand=doc.brand or "",
                    price=doc.price or 0.0,
                    price_formatted=doc.price_formatted or "₹0",
                    rating=doc.rating or 4.5,
                    image_url=doc.image_url or "",
                    buy_url=doc.buy_url or "",
                    store=doc.store or "Verified Store",
                    specs=doc.specs or [],
                    similarity_score=round(score, 3)
                )
            )

        return results

embedder_service = SemanticEmbedderService()
