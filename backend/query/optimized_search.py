# Optimized Vector Search Service
# Hybrid search with filter pushdown and temporal reranking

"""
Query Optimization Strategy:
1. Filter first (cheap) → Then vector search (expensive)
2. Hot layer lookup (Redis) → Warm layer search (HNSW) → Cold layer fallback (Parquet)
3. Temporal reranking: Boost assets that move in sync with reference

Performance Targets:
- Query latency p99: <50ms
- Recall@10: >0.97
- Concurrent queries: 2000+ QPS
"""

import numpy as np
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Any, Tuple
from dataclasses import dataclass, field
from enum import Enum
import time
import asyncio

from schema.financial_vectors import get_symbol_tier, SYMBOL_TIERS
from ingestion.delta_updater import delta_updater, symbol_partitioner
from config.hnsw_tuning import hnsw_tuner


class SearchStrategy(str, Enum):
    """Vector search strategies"""
    EXACT = "exact"           # Brute force (highest recall)
    APPROXIMATE = "approximate"  # HNSW (fast, good recall)
    FILTERED = "filtered"      # Pre-filter + ANN
    HYBRID = "hybrid"          # Combined vector + keyword


@dataclass
class SearchResult:
    """Single search result with metadata"""
    symbol: str
    distance: float
    similarity: float
    properties: Dict[str, Any]
    tier: str  # hot, warm, cold
    
    @property
    def score(self) -> float:
        """Convenience alias for similarity"""
        return self.similarity


@dataclass
class SearchResponse:
    """Complete search response with metrics"""
    results: List[SearchResult]
    total_candidates: int
    query_time_ms: float
    strategy_used: SearchStrategy
    recall_estimate: float = 0.97


@dataclass
class SearchMetrics:
    """Query performance metrics"""
    total_queries: int = 0
    avg_latency_ms: float = 0
    p50_latency_ms: float = 0
    p99_latency_ms: float = 0
    cache_hit_rate: float = 0
    hot_layer_hits: int = 0
    warm_layer_hits: int = 0


class VectorSearchOptimizer:
    """
    Optimized vector search with tiered lookup and hybrid strategies.
    
    Features:
    - Pre-filtering for cheap metadata queries
    - Dynamic strategy selection based on filter selectivity
    - Temporal correlation reranking
    - Query result caching
    """
    
    def __init__(self):
        self.updater = delta_updater
        self.partitioner = symbol_partitioner
        self.tuner = hnsw_tuner
        
        # In-memory vector index (warm layer simulation)
        self.vector_index: Dict[str, np.ndarray] = {}
        self.metadata_index: Dict[str, Dict] = {}
        
        # Correlation cache for temporal reranking
        self.correlation_cache: Dict[str, float] = {}
        
        # Query result cache (LRU simulation)
        self.result_cache: Dict[str, Tuple[SearchResponse, float]] = {}
        self.cache_ttl_seconds = 5
        
        # Metrics
        self.metrics = SearchMetrics()
        self._latency_samples: List[float] = []
        
        # Initialize with demo data
        self._initialize_demo_index()
    
    def _initialize_demo_index(self):
        """Initialize with demo vectors for all known symbols"""
        np.random.seed(42)
        
        all_symbols = (
            SYMBOL_TIERS["tier1"] + SYMBOL_TIERS["tier2"] + 
            ["WMT", "KO", "PEP", "MCD", "NKE", "SBUX", "TGT", "COST"]
        )
        
        sector_map = {
            "AAPL": "technology", "MSFT": "technology", "GOOGL": "technology",
            "AMZN": "consumer", "TSLA": "automotive", "NVDA": "semiconductors",
            "META": "technology", "JPM": "financials", "V": "financials",
            "JNJ": "healthcare", "UNH": "healthcare", "BTC": "crypto", "ETH": "crypto",
            "SPY": "etf", "QQQ": "etf",
        }
        
        for symbol in all_symbols:
            # Generate correlated vectors (same sector = more similar)
            sector = sector_map.get(symbol, "other")
            sector_seed = hash(sector) % 1000
            
            np.random.seed(sector_seed + hash(symbol) % 100)
            vector = np.random.randn(384).astype(np.float32)
            vector = vector / np.linalg.norm(vector)
            
            self.vector_index[symbol] = vector
            self.metadata_index[symbol] = {
                'symbol': symbol,
                'sector': sector,
                'market_cap_bucket': 'mega' if symbol in SYMBOL_TIERS["tier1"] else 'large',
                'sentiment_score': np.random.uniform(0.3, 0.8),
                'timestamp': datetime.utcnow().isoformat(),
            }
        
        # Pre-compute correlations for common pairs
        for s1 in SYMBOL_TIERS["tier1"][:5]:
            for s2 in SYMBOL_TIERS["tier1"][:5]:
                if s1 != s2:
                    key = f"{s1}:{s2}"
                    self.correlation_cache[key] = np.random.uniform(-0.3, 0.8)
    
    def _cosine_similarity(self, a: np.ndarray, b: np.ndarray) -> float:
        """Compute cosine similarity"""
        return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b) + 1e-8))
    
    def _get_cache_key(self, symbol: str, filters: Optional[Dict]) -> str:
        """Generate cache key for query"""
        filter_str = str(sorted(filters.items())) if filters else ""
        return f"{symbol}:{filter_str}"
    
    def _check_cache(self, cache_key: str) -> Optional[SearchResponse]:
        """Check if result is in cache and not expired"""
        if cache_key in self.result_cache:
            response, timestamp = self.result_cache[cache_key]
            if time.time() - timestamp < self.cache_ttl_seconds:
                self.metrics.cache_hit_rate = (
                    (self.metrics.cache_hit_rate * self.metrics.total_queries + 1) /
                    (self.metrics.total_queries + 1)
                )
                return response
            else:
                del self.result_cache[cache_key]
        return None
    
    def _cache_result(self, cache_key: str, response: SearchResponse):
        """Cache query result"""
        self.result_cache[cache_key] = (response, time.time())
        
        # LRU eviction (keep last 1000)
        if len(self.result_cache) > 1000:
            oldest_key = min(self.result_cache.keys(), 
                           key=lambda k: self.result_cache[k][1])
            del self.result_cache[oldest_key]
    
    def _apply_filters(
        self,
        candidates: Dict[str, Dict],
        filters: Dict
    ) -> Dict[str, Dict]:
        """Apply metadata filters to candidates"""
        filtered = {}
        
        for symbol, metadata in candidates.items():
            passes = True
            
            if 'min_sentiment' in filters:
                if metadata.get('sentiment_score', 0) < filters['min_sentiment']:
                    passes = False
            
            if 'sectors' in filters:
                if metadata.get('sector') not in filters['sectors']:
                    passes = False
            
            if 'market_cap_buckets' in filters:
                if metadata.get('market_cap_bucket') not in filters['market_cap_buckets']:
                    passes = False
            
            if 'exclude_symbols' in filters:
                if symbol in filters['exclude_symbols']:
                    passes = False
            
            if passes:
                filtered[symbol] = metadata
        
        return filtered
    
    def _select_strategy(
        self,
        filters: Optional[Dict],
        limit: int
    ) -> SearchStrategy:
        """
        Select optimal search strategy based on filter selectivity.
        
        - High selectivity (few candidates) → Filter first, then ANN
        - Low selectivity (many candidates) → ANN first, then filter
        - No filters → Pure ANN
        """
        if not filters:
            return SearchStrategy.APPROXIMATE
        
        # Estimate filter selectivity
        total_vectors = len(self.vector_index)
        
        # Apply filters to estimate result size
        filtered = self._apply_filters(self.metadata_index, filters)
        selectivity = len(filtered) / total_vectors
        
        if selectivity < 0.1:  # Very selective
            return SearchStrategy.FILTERED
        elif selectivity < 0.5:
            return SearchStrategy.HYBRID
        else:
            return SearchStrategy.APPROXIMATE
    
    async def find_similar(
        self,
        symbol: str,
        filters: Optional[Dict] = None,
        limit: int = 10,
        use_temporal_rerank: bool = True
    ) -> SearchResponse:
        """
        Find similar assets with optimized search.
        
        Args:
            symbol: Reference symbol to find similar assets for
            filters: Optional metadata filters
            limit: Maximum results
            use_temporal_rerank: Whether to rerank by temporal correlation
        
        Returns:
            SearchResponse with results and metrics
        """
        start_time = time.time()
        self.metrics.total_queries += 1
        
        # Check cache
        cache_key = self._get_cache_key(symbol, filters)
        cached = self._check_cache(cache_key)
        if cached:
            return cached
        
        # Get reference vector (try hot layer first)
        ref_vector = self.updater.get_hot_vector(symbol)
        tier_used = "hot" if ref_vector is not None else "warm"
        
        if ref_vector is None:
            ref_vector = self.vector_index.get(symbol)
            if ref_vector is None:
                return SearchResponse(
                    results=[],
                    total_candidates=0,
                    query_time_ms=0,
                    strategy_used=SearchStrategy.APPROXIMATE
                )
        
        if tier_used == "hot":
            self.metrics.hot_layer_hits += 1
        else:
            self.metrics.warm_layer_hits += 1
        
        # Select strategy
        strategy = self._select_strategy(filters, limit)
        
        # Get candidates based on strategy
        if strategy == SearchStrategy.FILTERED:
            # Filter first, then search
            candidates = self._apply_filters(self.metadata_index, filters or {})
            candidate_symbols = list(candidates.keys())
        else:
            # Search all, filter later
            candidate_symbols = list(self.vector_index.keys())
        
        # Compute similarities (ANN simulation - in production use HNSW)
        similarities = []
        for sym in candidate_symbols:
            if sym == symbol:
                continue
            
            vec = self.vector_index.get(sym)
            if vec is None:
                continue
            
            sim = self._cosine_similarity(ref_vector, vec)
            similarities.append((sym, sim))
        
        # Sort by similarity
        similarities.sort(key=lambda x: x[1], reverse=True)
        
        # Apply post-filters for APPROXIMATE strategy
        if strategy == SearchStrategy.APPROXIMATE and filters:
            similarities = [
                (sym, sim) for sym, sim in similarities
                if sym in self._apply_filters(
                    {sym: self.metadata_index.get(sym, {})}, filters
                )
            ]
        
        total_candidates = len(similarities)
        
        # Take top candidates
        top_candidates = similarities[:limit * 3] if use_temporal_rerank else similarities[:limit]
        
        # Temporal reranking
        if use_temporal_rerank and top_candidates:
            reranked = self._rerank_by_temporal_correlation(
                reference_symbol=symbol,
                candidates=top_candidates
            )
            top_candidates = reranked[:limit]
        else:
            top_candidates = top_candidates[:limit]
        
        # Build results
        results = []
        for sym, similarity in top_candidates:
            results.append(SearchResult(
                symbol=sym,
                distance=1 - similarity,
                similarity=similarity,
                properties=self.metadata_index.get(sym, {}),
                tier=tier_used
            ))
        
        query_time = (time.time() - start_time) * 1000
        
        # Update metrics
        self._latency_samples.append(query_time)
        if len(self._latency_samples) > 1000:
            self._latency_samples = self._latency_samples[-500:]
        
        self.metrics.avg_latency_ms = np.mean(self._latency_samples)
        self.metrics.p50_latency_ms = np.percentile(self._latency_samples, 50)
        self.metrics.p99_latency_ms = np.percentile(self._latency_samples, 99)
        
        response = SearchResponse(
            results=results,
            total_candidates=total_candidates,
            query_time_ms=query_time,
            strategy_used=strategy,
            recall_estimate=self.tuner.quantization.expected_recall
        )
        
        # Cache result
        self._cache_result(cache_key, response)
        
        # Log to tuner
        self.tuner.log_performance(query_latency_ms=query_time)
        
        return response
    
    def _rerank_by_temporal_correlation(
        self,
        reference_symbol: str,
        candidates: List[Tuple[str, float]]
    ) -> List[Tuple[str, float]]:
        """
        Rerank candidates by temporal correlation with reference.
        
        Boost assets that historically move in sync with the reference.
        """
        reranked = []
        
        for sym, vector_sim in candidates:
            # Get correlation from cache
            corr_key = f"{reference_symbol}:{sym}"
            correlation = self.correlation_cache.get(corr_key, 0)
            
            # Weighted combination: 70% vector similarity, 30% temporal correlation
            final_score = 0.7 * vector_sim + 0.3 * abs(correlation)
            reranked.append((sym, final_score))
        
        reranked.sort(key=lambda x: x[1], reverse=True)
        return reranked
    
    async def search_by_sector(
        self,
        sector: str,
        reference_embedding: Optional[np.ndarray] = None,
        limit: int = 10
    ) -> SearchResponse:
        """Search within a specific sector"""
        return await self.find_similar(
            symbol=SYMBOL_TIERS["tier1"][0],  # Use any as reference
            filters={'sectors': [sector]},
            limit=limit
        )
    
    async def find_divergent_pairs(
        self,
        reference_symbol: str,
        sentiment_threshold: float = 0.3
    ) -> List[Dict]:
        """
        Find assets with similar fundamentals but divergent sentiment.
        Use case: "Like AAPL but sentiment undervalued"
        """
        similar = await self.find_similar(
            symbol=reference_symbol,
            limit=20,
            use_temporal_rerank=False
        )
        
        ref_sentiment = self.metadata_index.get(reference_symbol, {}).get('sentiment_score', 0.5)
        
        divergent = []
        for result in similar.results:
            their_sentiment = result.properties.get('sentiment_score', 0.5)
            sentiment_gap = their_sentiment - ref_sentiment
            
            if abs(sentiment_gap) > sentiment_threshold:
                divergent.append({
                    'symbol': result.symbol,
                    'vector_similarity': result.similarity,
                    'sentiment_gap': sentiment_gap,
                    'opportunity': 'undervalued' if sentiment_gap < 0 else 'overvalued'
                })
        
        return divergent
    
    def get_metrics(self) -> Dict:
        """Get search performance metrics"""
        return {
            'total_queries': self.metrics.total_queries,
            'avg_latency_ms': self.metrics.avg_latency_ms,
            'p50_latency_ms': self.metrics.p50_latency_ms,
            'p99_latency_ms': self.metrics.p99_latency_ms,
            'cache_hit_rate': self.metrics.cache_hit_rate,
            'hot_layer_hits': self.metrics.hot_layer_hits,
            'warm_layer_hits': self.metrics.warm_layer_hits,
            'index_size': len(self.vector_index),
        }


# Singleton
vector_search = VectorSearchOptimizer()
