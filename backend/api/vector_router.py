# Vector Database API Router
# Exposes vector search, ingestion, and metrics endpoints

from fastapi import APIRouter, HTTPException, Query, BackgroundTasks
from typing import List, Dict, Optional
from pydantic import BaseModel, Field
from datetime import datetime
import numpy as np

from query.optimized_search import vector_search, SearchResponse, SearchResult
from ingestion.delta_updater import delta_updater, symbol_partitioner, VectorUpdate
from config.hnsw_tuning import hnsw_tuner, WorkloadMode
from monitoring.vector_metrics import vector_metrics
from schema.financial_vectors import VectorTier

router = APIRouter(prefix="/vectors", tags=["Vector Database"])


# Request/Response Models

class SimilarityRequest(BaseModel):
    symbol: str
    min_sentiment: Optional[float] = None
    sectors: Optional[List[str]] = None
    market_cap_buckets: Optional[List[str]] = None
    limit: int = Field(default=10, ge=1, le=100)
    use_temporal_rerank: bool = True


class SimilarityResponse(BaseModel):
    source: str
    results: List[Dict]
    total_candidates: int
    query_time_ms: float
    strategy: str
    recall_estimate: float


class IngestRequest(BaseModel):
    symbol: str
    vector: List[float] = Field(min_length=384, max_length=384)
    sentiment_score: float = Field(ge=-1.0, le=1.0)
    sector: str = "technology"
    market_cap_bucket: str = "mega"
    price_velocity: float = 0.0
    source_ids: Optional[List[str]] = None


class IngestBatchRequest(BaseModel):
    vectors: List[IngestRequest] = Field(max_length=1000)


class WorkloadModeRequest(BaseModel):
    mode: str = Field(description="One of: ingestion, analytics, balanced, maintenance")


class DivergentPair(BaseModel):
    symbol: str
    vector_similarity: float
    sentiment_gap: float
    opportunity: str


# Endpoints

@router.post("/similar", response_model=SimilarityResponse)
async def find_similar_vectors(request: SimilarityRequest):
    """
    Find similar assets using optimized vector search.
    
    Features:
    - Tiered lookup (Hot → Warm → Cold)
    - Optional temporal correlation reranking
    - Metadata filtering (sentiment, sector, market cap)
    """
    filters = {}
    if request.min_sentiment is not None:
        filters['min_sentiment'] = request.min_sentiment
    if request.sectors:
        filters['sectors'] = request.sectors
    if request.market_cap_buckets:
        filters['market_cap_buckets'] = request.market_cap_buckets
    
    response = await vector_search.find_similar(
        symbol=request.symbol.upper(),
        filters=filters if filters else None,
        limit=request.limit,
        use_temporal_rerank=request.use_temporal_rerank
    )
    
    # Record metrics
    vector_metrics.record_query(
        latency_ms=response.query_time_ms,
        tier="warm"  # Simplified
    )
    
    return SimilarityResponse(
        source=request.symbol.upper(),
        results=[
            {
                'symbol': r.symbol,
                'similarity': r.similarity,
                'distance': r.distance,
                'sentiment': r.properties.get('sentiment_score', 0),
                'sector': r.properties.get('sector', 'unknown'),
            }
            for r in response.results
        ],
        total_candidates=response.total_candidates,
        query_time_ms=response.query_time_ms,
        strategy=response.strategy_used.value,
        recall_estimate=response.recall_estimate
    )


@router.get("/similar/{symbol}")
async def find_similar_quick(
    symbol: str,
    min_sentiment: float = Query(default=0.0, ge=-1.0, le=1.0),
    limit: int = Query(default=10, ge=1, le=50)
):
    """Quick similarity search for a single symbol"""
    response = await vector_search.find_similar(
        symbol=symbol.upper(),
        filters={'min_sentiment': min_sentiment} if min_sentiment > 0 else None,
        limit=limit
    )
    
    return {
        'source': symbol.upper(),
        'matches': [
            {
                'symbol': r.symbol,
                'similarity': round(r.similarity, 4),
                'sentiment': r.properties.get('sentiment_score', 0),
            }
            for r in response.results
        ],
        'query_time_ms': round(response.query_time_ms, 2)
    }


@router.get("/divergent/{symbol}", response_model=List[DivergentPair])
async def find_divergent_pairs(
    symbol: str,
    sentiment_threshold: float = Query(default=0.3, ge=0.1, le=0.8)
):
    """
    Find assets with similar fundamentals but divergent sentiment.
    
    Use case: "Like AAPL but sentiment undervalued"
    """
    pairs = await vector_search.find_divergent_pairs(
        reference_symbol=symbol.upper(),
        sentiment_threshold=sentiment_threshold
    )
    
    return [DivergentPair(**p) for p in pairs]


@router.post("/ingest")
async def ingest_vector(request: IngestRequest, background_tasks: BackgroundTasks):
    """
    Ingest a single sentiment vector.
    
    Vector is added to hot layer immediately, then batched to warm layer.
    """
    vector = np.array(request.vector, dtype=np.float32)
    
    success = await delta_updater.ingest_sentiment(
        symbol=request.symbol.upper(),
        vector=vector,
        sentiment_score=request.sentiment_score,
        sector=request.sector,
        market_cap_bucket=request.market_cap_bucket,
        price_velocity=request.price_velocity,
        source_ids=request.source_ids
    )
    
    return {
        'success': success,
        'symbol': request.symbol.upper(),
        'skipped_duplicate': not success,
        'metrics': delta_updater.get_metrics()
    }


@router.post("/ingest/batch")
async def ingest_batch(request: IngestBatchRequest):
    """
    Ingest a batch of vectors (up to 1000).
    
    Optimized for high-throughput ingestion.
    """
    results = {'success': 0, 'skipped': 0, 'errors': 0}
    
    for item in request.vectors:
        try:
            vector = np.array(item.vector, dtype=np.float32)
            success = await delta_updater.ingest_sentiment(
                symbol=item.symbol.upper(),
                vector=vector,
                sentiment_score=item.sentiment_score,
                sector=item.sector,
                market_cap_bucket=item.market_cap_bucket,
                price_velocity=item.price_velocity,
                source_ids=item.source_ids
            )
            if success:
                results['success'] += 1
            else:
                results['skipped'] += 1
        except Exception as e:
            results['errors'] += 1
    
    # Record metrics
    vector_metrics.record_ingestion(
        count=results['success'],
        errors=results['errors'],
        duplicates=results['skipped']
    )
    
    return {
        'batch_size': len(request.vectors),
        'results': results,
        'ingestion_metrics': delta_updater.get_metrics()
    }


@router.get("/hot/{symbol}")
async def get_hot_vector(symbol: str):
    """
    Get vector from hot layer (fastest, last 5 min).
    
    Returns null if symbol not in hot layer.
    """
    data = delta_updater.get_hot_data(symbol.upper())
    
    if data is None:
        return {'symbol': symbol.upper(), 'in_hot_layer': False, 'data': None}
    
    # Don't return raw vector, just metadata
    return {
        'symbol': symbol.upper(),
        'in_hot_layer': True,
        'sentiment_score': data.get('sentiment_score'),
        'sector': data.get('sector'),
        'timestamp': data.get('timestamp'),
    }


@router.get("/hot")
async def list_hot_symbols():
    """List all symbols currently in hot layer"""
    symbols = delta_updater.get_all_hot_symbols()
    return {
        'count': len(symbols),
        'symbols': symbols,
        'ttl_seconds': 300
    }


@router.post("/config/mode")
async def set_workload_mode(request: WorkloadModeRequest):
    """
    Switch HNSW workload mode.
    
    Modes:
    - ingestion: Optimize for >5k vec/sec (market hours)
    - analytics: Optimize for high recall (after hours)
    - balanced: Trade-off for mixed workload
    - maintenance: For index rebuilding
    """
    try:
        mode = WorkloadMode(request.mode)
        params = hnsw_tuner.set_mode(mode)
        
        return {
            'mode': mode.value,
            'config': hnsw_tuner.get_config_dict()
        }
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid mode. Must be one of: {[m.value for m in WorkloadMode]}"
        )


@router.get("/config")
async def get_hnsw_config():
    """Get current HNSW configuration"""
    return {
        'hnsw': hnsw_tuner.get_config_dict(),
        'performance': hnsw_tuner.get_performance_stats(),
        'recommended_mode': hnsw_tuner.recommend_mode().value
    }


@router.get("/metrics")
async def get_metrics():
    """Get vector database metrics"""
    return {
        'search': vector_search.get_metrics(),
        'ingestion': delta_updater.get_metrics(),
        'system': vector_metrics.get_all_metrics()
    }


@router.get("/metrics/prometheus")
async def get_prometheus_metrics():
    """Get metrics in Prometheus format"""
    from monitoring.vector_metrics import format_metrics_for_prometheus
    
    metrics = vector_metrics.get_all_metrics()
    return format_metrics_for_prometheus(metrics)


@router.get("/health")
async def health_check():
    """Vector database health check"""
    health = vector_metrics.health_check()
    
    return {
        **health,
        'hot_layer_size': len(delta_updater.get_all_hot_symbols()),
        'warm_layer_size': len(vector_search.vector_index),
        'current_mode': hnsw_tuner.current_mode.value,
    }


@router.get("/partitioner/{symbol}")
async def get_symbol_partition(symbol: str):
    """Get partitioning info for a symbol"""
    return {
        'symbol': symbol.upper(),
        'tenant': symbol_partitioner.get_tenant(symbol.upper()),
        'is_high_volume': symbol_partitioner.is_high_volume_symbol(symbol.upper()),
        'shard_key': symbol_partitioner.get_shard_key(symbol.upper(), datetime.utcnow())
    }
