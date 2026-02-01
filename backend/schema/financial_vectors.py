# Uptrade Financial Vector Schema
# High-performance tiered vector storage for sub-100ms similarity search

"""
Architecture: Hot-Warm-Cold Tiered Storage

HOT LAYER (Redis + Memory):
- Last 5 minutes of data
- Active symbols
- Real-time sentiment
- TTL: 300 seconds

WARM LAYER (Weaviate In-Memory):
- Last 24 hours
- Intraday patterns
- Similarity search optimized

COLD LAYER (S3 + Parquet):
- Historical data
- Batch analytics
- Model training
"""

from dataclasses import dataclass, field
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Any
from enum import Enum
import numpy as np


class VectorTier(str, Enum):
    """Storage tier classification"""
    HOT = "hot"      # Real-time, <5min, in-memory
    WARM = "warm"    # Intraday, HNSW indexed
    COLD = "cold"    # Historical, Parquet archives


class QuantizationType(str, Enum):
    """Vector quantization strategies"""
    NONE = "none"           # Full float32 (1536 bytes/384-dim)
    PQ = "product"          # Product Quantization (384 bytes)
    SQ = "scalar"           # Scalar Quantization (384 bytes, int8)
    BQ = "binary"           # Binary (48 bytes, 1-bit)


@dataclass
class HNSWConfig:
    """Hierarchical Navigable Small World graph configuration"""
    ef: int = 128                    # Query-time accuracy
    ef_construction: int = 128       # Build-time accuracy
    max_connections: int = 32        # M parameter
    dynamic_ef_factor: int = 8       # Auto-adjust factor
    dynamic_ef_min: int = 100
    dynamic_ef_max: int = 500
    quantizer: QuantizationType = QuantizationType.NONE
    
    @classmethod
    def for_ingestion(cls) -> 'HNSWConfig':
        """Optimized for >5k vectors/sec ingestion"""
        return cls(
            ef=64,
            ef_construction=64,
            max_connections=16,
            dynamic_ef_factor=4,
        )
    
    @classmethod
    def for_analytics(cls) -> 'HNSWConfig':
        """Optimized for high-recall similarity search"""
        return cls(
            ef=512,
            ef_construction=256,
            max_connections=64,
            dynamic_ef_factor=16,
        )
    
    @classmethod
    def for_scale(cls) -> 'HNSWConfig':
        """Optimized for 10M+ vectors with memory constraints"""
        return cls(
            ef=128,
            ef_construction=128,
            max_connections=32,
            quantizer=QuantizationType.SQ,
        )


@dataclass
class ShardingConfig:
    """Sharding strategy for high-throughput writes"""
    strategy: str = "hash"           # hash, time, or symbol
    virtual_per_physical: int = 128
    desired_count: int = 6           # Match CPU cores
    
    @classmethod
    def for_realtime(cls) -> 'ShardingConfig':
        return cls(strategy="hash", virtual_per_physical=128, desired_count=6)
    
    @classmethod
    def for_timeseries(cls) -> 'ShardingConfig':
        return cls(strategy="time", virtual_per_physical=64, desired_count=24)


@dataclass
class CollectionConfig:
    """Collection configuration for Weaviate"""
    name: str
    description: str
    hnsw: HNSWConfig
    sharding: ShardingConfig
    properties: List[Dict[str, Any]]
    tier: VectorTier = VectorTier.WARM
    ttl_seconds: Optional[int] = None
    

class FinancialVectorSchema:
    """
    Multi-collection schema optimized for financial time-series.
    
    Collections separated by update frequency to prevent index thrashing:
    1. SentimentRealTime: High-frequency (5min TTL)
    2. IntradayVectors: 5-min candles with sentiment
    3. FundamentalVectors: Daily snapshots
    """
    
    COLLECTIONS = {
        'SentimentRealTime': CollectionConfig(
            name='SentimentRealTime',
            description='High-frequency sentiment embeddings (last 5min)',
            hnsw=HNSWConfig.for_ingestion(),
            sharding=ShardingConfig.for_realtime(),
            tier=VectorTier.HOT,
            ttl_seconds=300,
            properties=[
                {'name': 'symbol', 'type': 'text', 'filterable': True, 'searchable': False},
                {'name': 'timestamp', 'type': 'datetime', 'filterable': True},
                {'name': 'vector_id', 'type': 'text', 'filterable': False},
                {'name': 'sentiment_score', 'type': 'float', 'filterable': False},  # Volatile
                {'name': 'sector', 'type': 'text', 'filterable': True},
                {'name': 'market_cap_bucket', 'type': 'text', 'filterable': True},
                {'name': 'price_velocity', 'type': 'float', 'filterable': False},
                {'name': 'source_ids', 'type': 'text[]', 'filterable': False},
            ]
        ),
        
        'IntradayVectors': CollectionConfig(
            name='IntradayVectors',
            description='5-minute aggregated vectors (OHLCV + Sentiment)',
            hnsw=HNSWConfig.for_scale(),
            sharding=ShardingConfig.for_timeseries(),
            tier=VectorTier.WARM,
            properties=[
                {'name': 'symbol', 'type': 'text', 'filterable': True},
                {'name': 'bucket_timestamp', 'type': 'datetime', 'filterable': True},
                {'name': 'open', 'type': 'float', 'filterable': False},
                {'name': 'high', 'type': 'float', 'filterable': False},
                {'name': 'low', 'type': 'float', 'filterable': False},
                {'name': 'close', 'type': 'float', 'filterable': False},
                {'name': 'volume', 'type': 'float', 'filterable': False},
                {'name': 'avg_sentiment', 'type': 'float', 'filterable': True},
                {'name': 'sentiment_volatility', 'type': 'float', 'filterable': False},
            ]
        ),
        
        'FundamentalVectors': CollectionConfig(
            name='FundamentalVectors',
            description='Quarterly fundamental data embeddings',
            hnsw=HNSWConfig.for_analytics(),
            sharding=ShardingConfig(strategy="hash", desired_count=3),
            tier=VectorTier.COLD,
            properties=[
                {'name': 'symbol', 'type': 'text', 'filterable': True},
                {'name': 'filing_date', 'type': 'datetime', 'filterable': True},
                {'name': 'pe_ratio', 'type': 'float', 'filterable': True},
                {'name': 'roe', 'type': 'float', 'filterable': True},
                {'name': 'debt_equity', 'type': 'float', 'filterable': True},
                {'name': 'sector', 'type': 'text', 'filterable': True},
                {'name': 'market_cap', 'type': 'float', 'filterable': True},
            ]
        ),
    }
    
    @classmethod
    def get_collection_config(cls, name: str) -> Optional[CollectionConfig]:
        return cls.COLLECTIONS.get(name)
    
    @classmethod
    def get_all_configs(cls) -> Dict[str, CollectionConfig]:
        return cls.COLLECTIONS


@dataclass
class SentimentVector:
    """Real-time sentiment vector for hot layer"""
    symbol: str
    timestamp: datetime
    vector: np.ndarray  # 384-dim embedding
    sentiment_score: float
    sector: str
    market_cap_bucket: str
    price_velocity: float
    source_ids: List[str] = field(default_factory=list)
    
    @property
    def vector_id(self) -> str:
        return f"{self.symbol}-{int(self.timestamp.timestamp())}"
    
    def to_dict(self) -> Dict:
        return {
            'symbol': self.symbol,
            'timestamp': self.timestamp.isoformat(),
            'vector_id': self.vector_id,
            'sentiment_score': self.sentiment_score,
            'sector': self.sector,
            'market_cap_bucket': self.market_cap_bucket,
            'price_velocity': self.price_velocity,
            'source_ids': self.source_ids,
        }


@dataclass
class IntradayVector:
    """5-minute aggregated vector for warm layer"""
    symbol: str
    bucket_timestamp: datetime
    vector: np.ndarray
    open: float
    high: float
    low: float
    close: float
    volume: float
    avg_sentiment: float
    sentiment_volatility: float
    
    def to_dict(self) -> Dict:
        return {
            'symbol': self.symbol,
            'bucket_timestamp': self.bucket_timestamp.isoformat(),
            'open': self.open,
            'high': self.high,
            'low': self.low,
            'close': self.close,
            'volume': self.volume,
            'avg_sentiment': self.avg_sentiment,
            'sentiment_volatility': self.sentiment_volatility,
        }


@dataclass  
class FundamentalVector:
    """Quarterly fundamental vector for cold layer"""
    symbol: str
    filing_date: datetime
    vector: np.ndarray
    pe_ratio: float
    roe: float
    debt_equity: float
    sector: str
    market_cap: float
    
    def to_dict(self) -> Dict:
        return {
            'symbol': self.symbol,
            'filing_date': self.filing_date.isoformat(),
            'pe_ratio': self.pe_ratio,
            'roe': self.roe,
            'debt_equity': self.debt_equity,
            'sector': self.sector,
            'market_cap': self.market_cap,
        }


# Symbol tier classification for sharding
SYMBOL_TIERS = {
    "tier1": [  # Highest volume - dedicated shards
        "AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "NVDA", "META", 
        "SPY", "QQQ", "BTC", "ETH"
    ],
    "tier2": [  # S&P 500 constituents
        "JPM", "V", "JNJ", "UNH", "HD", "PG", "MA", "DIS", "PYPL",
        "ADBE", "NFLX", "CRM", "INTC", "AMD", "CSCO"
    ],
    # tier3: Everything else (hashed distribution)
}

def get_symbol_tier(symbol: str) -> str:
    """Get the tier for a symbol (used for shard routing)"""
    if symbol in SYMBOL_TIERS["tier1"]:
        return "tier1"
    elif symbol in SYMBOL_TIERS["tier2"]:
        return "tier2"
    return "tier3"


def get_shard_key(symbol: str, timestamp: datetime) -> str:
    """
    Generate composite shard key: Symbol tier + Time bucket
    Prevents hot symbols from slowing down others
    """
    time_bucket = timestamp.strftime("%Y%m%d%H")
    tier = get_symbol_tier(symbol)
    
    if tier == "tier1":
        # Tier 1 gets dedicated shards
        return f"tier1-{symbol}-{time_bucket}"
    else:
        # Tier 2/3 gets hashed distribution
        hash_val = hash(symbol) % 10
        return f"standard-{hash_val}-{time_bucket}"
