# Delta Vector Updater
# High-frequency ingestion pipeline for 10k+ updates/second

"""
Ingestion Strategy:
1. Kafka → Real-time embeddings → Redis (Hot layer, 5min TTL)
2. Background Worker → Batch (100ms windows) → Weaviate (Warm layer)
3. Nightly ETL → Compress → S3 Parquet (Cold layer)

Key Optimizations:
- Deduplication via vector hashing (skip if cosine sim > 0.99)
- Partial updates for scalar fields (10x faster than full object)
- Async indexing to avoid blocking
- Deterministic UUIDs for upserts
"""

import asyncio
import numpy as np
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any, Callable
from dataclasses import dataclass, field
from collections import defaultdict
import hashlib
import json
import time

from schema.financial_vectors import (
    SentimentVector, IntradayVector, VectorTier,
    get_shard_key, get_symbol_tier, SYMBOL_TIERS
)


@dataclass
class BatchMetrics:
    """Metrics for batch ingestion"""
    total_received: int = 0
    duplicates_skipped: int = 0
    batches_flushed: int = 0
    avg_batch_size: float = 0
    avg_flush_latency_ms: float = 0
    errors: int = 0


@dataclass
class VectorUpdate:
    """Queued vector update"""
    symbol: str
    timestamp: datetime
    vector: np.ndarray
    properties: Dict[str, Any]
    tier: VectorTier = VectorTier.HOT


class DeltaVectorUpdater:
    """
    High-frequency vector ingestion with delta updates.
    
    Features:
    - Deduplication via vector hash (skip identical vectors)
    - Batched writes (100ms windows, up to 1000 vectors)
    - Partial updates for scalar fields
    - Multi-tier routing (Hot → Warm → Cold)
    """
    
    def __init__(
        self,
        embedding_dim: int = 384,
        batch_size: int = 1000,
        flush_interval_ms: int = 100,
        dedup_threshold: float = 0.99  # Skip if similarity > threshold
    ):
        self.embedding_dim = embedding_dim
        self.batch_size = batch_size
        self.flush_interval_ms = flush_interval_ms
        self.dedup_threshold = dedup_threshold
        
        # Queues
        self.hot_queue: asyncio.Queue = asyncio.Queue(maxsize=50000)
        self.warm_queue: asyncio.Queue = asyncio.Queue(maxsize=10000)
        
        # Deduplication cache: symbol → (vector_hash, timestamp)
        self.vector_hashes: Dict[str, tuple] = {}
        
        # In-memory hot layer (simulates Redis)
        self.hot_layer: Dict[str, Dict] = {}
        self.hot_layer_ttl: Dict[str, float] = {}
        
        # Warm layer vectors (simulates Weaviate)
        self.warm_layer: Dict[str, Dict] = {}
        self.warm_layer_vectors: Dict[str, np.ndarray] = {}
        
        # Metrics
        self.metrics = BatchMetrics()
        
        # Running state
        self._running = False
        self._workers: List[asyncio.Task] = []
    
    async def start(self):
        """Start background workers"""
        self._running = True
        self._workers = [
            asyncio.create_task(self._hot_layer_flusher()),
            asyncio.create_task(self._warm_layer_flusher()),
            asyncio.create_task(self._ttl_cleaner()),
        ]
    
    async def stop(self):
        """Stop background workers"""
        self._running = False
        for worker in self._workers:
            worker.cancel()
        await asyncio.gather(*self._workers, return_exceptions=True)
    
    def _hash_vector(self, vector: np.ndarray) -> str:
        """Generate hash of vector for deduplication"""
        return hashlib.md5(vector.tobytes()).hexdigest()[:16]
    
    def _cosine_similarity(self, a: np.ndarray, b: np.ndarray) -> float:
        """Compute cosine similarity"""
        return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b) + 1e-8))
    
    def _should_skip_duplicate(self, symbol: str, vector: np.ndarray) -> bool:
        """Check if vector is near-duplicate of cached version"""
        if symbol not in self.hot_layer:
            return False
        
        cached_vector = self.hot_layer[symbol].get('vector')
        if cached_vector is None:
            return False
        
        similarity = self._cosine_similarity(vector, cached_vector)
        return similarity > self.dedup_threshold
    
    async def ingest(self, update: VectorUpdate) -> bool:
        """
        Ingest a vector update.
        Returns True if queued, False if skipped (duplicate).
        """
        self.metrics.total_received += 1
        
        # Deduplication check
        if self._should_skip_duplicate(update.symbol, update.vector):
            self.metrics.duplicates_skipped += 1
            return False
        
        # Route to appropriate queue
        if update.tier == VectorTier.HOT:
            await self.hot_queue.put(update)
        else:
            await self.warm_queue.put(update)
        
        return True
    
    async def ingest_sentiment(
        self,
        symbol: str,
        vector: np.ndarray,
        sentiment_score: float,
        sector: str = "technology",
        market_cap_bucket: str = "mega",
        price_velocity: float = 0.0,
        source_ids: List[str] = None
    ) -> bool:
        """Convenience method for sentiment vector ingestion"""
        update = VectorUpdate(
            symbol=symbol,
            timestamp=datetime.utcnow(),
            vector=vector,
            properties={
                'sentiment_score': sentiment_score,
                'sector': sector,
                'market_cap_bucket': market_cap_bucket,
                'price_velocity': price_velocity,
                'source_ids': source_ids or [],
            },
            tier=VectorTier.HOT
        )
        return await self.ingest(update)
    
    async def _hot_layer_flusher(self):
        """
        Background worker: Flush hot queue to in-memory layer.
        Simulates Redis with TTL.
        """
        while self._running:
            batch = []
            deadline = time.time() + (self.flush_interval_ms / 1000)
            
            # Collect batch
            while len(batch) < self.batch_size and time.time() < deadline:
                try:
                    update = await asyncio.wait_for(
                        self.hot_queue.get(),
                        timeout=0.01
                    )
                    batch.append(update)
                except asyncio.TimeoutError:
                    break
            
            if not batch:
                await asyncio.sleep(0.01)
                continue
            
            # Flush to hot layer
            start_time = time.time()
            for update in batch:
                key = update.symbol
                
                # Store in hot layer
                self.hot_layer[key] = {
                    'vector': update.vector,
                    'timestamp': update.timestamp,
                    **update.properties
                }
                self.hot_layer_ttl[key] = time.time() + 300  # 5min TTL
                
                # Also queue for warm layer (async)
                await self.warm_queue.put(update)
            
            flush_latency = (time.time() - start_time) * 1000
            
            # Update metrics
            self.metrics.batches_flushed += 1
            self.metrics.avg_batch_size = (
                (self.metrics.avg_batch_size * (self.metrics.batches_flushed - 1) + len(batch))
                / self.metrics.batches_flushed
            )
            self.metrics.avg_flush_latency_ms = (
                (self.metrics.avg_flush_latency_ms * (self.metrics.batches_flushed - 1) + flush_latency)
                / self.metrics.batches_flushed
            )
    
    async def _warm_layer_flusher(self):
        """
        Background worker: Batch insert to warm layer (Weaviate).
        Uses deterministic UUIDs for upserts.
        """
        while self._running:
            batch = []
            deadline = time.time() + 0.1  # 100ms window
            
            while len(batch) < self.batch_size and time.time() < deadline:
                try:
                    update = await asyncio.wait_for(
                        self.warm_queue.get(),
                        timeout=0.01
                    )
                    batch.append(update)
                except asyncio.TimeoutError:
                    break
            
            if not batch:
                await asyncio.sleep(0.01)
                continue
            
            # Batch insert to warm layer
            for update in batch:
                vector_id = f"{update.symbol}-{int(update.timestamp.timestamp())}"
                
                self.warm_layer[vector_id] = {
                    'symbol': update.symbol,
                    'timestamp': update.timestamp.isoformat(),
                    'vector_id': vector_id,
                    **update.properties
                }
                self.warm_layer_vectors[vector_id] = update.vector
    
    async def _ttl_cleaner(self):
        """Background worker: Clean expired hot layer entries"""
        while self._running:
            await asyncio.sleep(30)  # Check every 30 seconds
            
            now = time.time()
            expired = [
                key for key, ttl in self.hot_layer_ttl.items()
                if ttl < now
            ]
            
            for key in expired:
                self.hot_layer.pop(key, None)
                self.hot_layer_ttl.pop(key, None)
    
    def get_hot_vector(self, symbol: str) -> Optional[np.ndarray]:
        """Get vector from hot layer (fastest)"""
        if symbol in self.hot_layer:
            return self.hot_layer[symbol].get('vector')
        return None
    
    def get_hot_data(self, symbol: str) -> Optional[Dict]:
        """Get full data from hot layer"""
        return self.hot_layer.get(symbol)
    
    async def update_metadata_only(self, symbol: str, updates: Dict):
        """
        Partial update: Only update scalar fields, not vector.
        10x faster than full object update.
        """
        # Update hot layer
        if symbol in self.hot_layer:
            for key, value in updates.items():
                self.hot_layer[symbol][key] = value
        
        # Update warm layer (all matching entries)
        for vector_id, data in self.warm_layer.items():
            if data['symbol'] == symbol:
                for key, value in updates.items():
                    self.warm_layer[vector_id][key] = value
    
    def get_metrics(self) -> Dict:
        """Get ingestion metrics"""
        return {
            'total_received': self.metrics.total_received,
            'duplicates_skipped': self.metrics.duplicates_skipped,
            'dedup_rate': self.metrics.duplicates_skipped / max(self.metrics.total_received, 1),
            'batches_flushed': self.metrics.batches_flushed,
            'avg_batch_size': self.metrics.avg_batch_size,
            'avg_flush_latency_ms': self.metrics.avg_flush_latency_ms,
            'hot_layer_size': len(self.hot_layer),
            'warm_layer_size': len(self.warm_layer),
            'errors': self.metrics.errors,
        }
    
    def get_all_hot_symbols(self) -> List[str]:
        """Get all symbols currently in hot layer"""
        return list(self.hot_layer.keys())


class SymbolPartitioner:
    """
    Handle 5000+ symbols with hot spotting prevention.
    AAPL/TSLA get 90% of updates - need isolation.
    """
    
    def __init__(self):
        self.tiers = SYMBOL_TIERS
        self.tenant_map: Dict[str, str] = {}
        self._init_tenants()
    
    def _init_tenants(self):
        """Initialize tenant mapping for symbol isolation"""
        # Tier 1: Each symbol gets its own tenant
        for symbol in self.tiers["tier1"]:
            self.tenant_map[symbol] = symbol
        
        # Tier 2: Grouped by sector
        sector_map = {
            "JPM": "financials", "V": "financials", "MA": "financials",
            "JNJ": "healthcare", "UNH": "healthcare",
            "ADBE": "tech-tier2", "NFLX": "tech-tier2", "CRM": "tech-tier2",
            "INTC": "semiconductors", "AMD": "semiconductors", "CSCO": "semiconductors",
        }
        for symbol in self.tiers["tier2"]:
            self.tenant_map[symbol] = sector_map.get(symbol, "tier2-shared")
    
    def get_tenant(self, symbol: str) -> str:
        """Get tenant name for a symbol"""
        return self.tenant_map.get(symbol, "shared-tier3")
    
    def get_shard_key(self, symbol: str, timestamp: datetime) -> str:
        """Generate shard key for distributed writes"""
        return get_shard_key(symbol, timestamp)
    
    def route_query(self, symbol: str) -> str:
        """Route query to specific tenant for zero-noise queries"""
        return self.get_tenant(symbol)
    
    def is_high_volume_symbol(self, symbol: str) -> bool:
        """Check if symbol is in high-volume tier"""
        return symbol in self.tiers["tier1"]


# Singleton instances
delta_updater = DeltaVectorUpdater()
symbol_partitioner = SymbolPartitioner()
