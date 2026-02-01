# Vector Database Metrics and Monitoring
# Track query latency, recall, and HNSW efficiency

"""
Monitoring Targets:
- Query latency p99: <50ms
- Recall@10: >0.97
- Ingestion rate: >10,000 vec/sec
- Memory per vector: <400 bytes (with quantization)
"""

import time
import numpy as np
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, field
from collections import deque
import json


@dataclass
class LatencyHistogram:
    """Histogram for latency distribution"""
    buckets: List[float] = field(default_factory=lambda: [1, 5, 10, 25, 50, 100, 250, 500, 1000])
    counts: Dict[str, int] = field(default_factory=dict)
    total: int = 0
    
    def record(self, latency_ms: float):
        self.total += 1
        for bucket in self.buckets:
            if latency_ms <= bucket:
                key = f"le_{bucket}ms"
                self.counts[key] = self.counts.get(key, 0) + 1
                return
        self.counts['gt_1000ms'] = self.counts.get('gt_1000ms', 0) + 1
    
    def get_percentile(self, values: List[float], percentile: float) -> float:
        if not values:
            return 0
        return float(np.percentile(values, percentile))


@dataclass
class RecallMetrics:
    """Track recall accuracy over time"""
    measurements: List[float] = field(default_factory=list)
    window_size: int = 100
    
    def record(self, recall: float):
        self.measurements.append(recall)
        if len(self.measurements) > self.window_size:
            self.measurements = self.measurements[-self.window_size:]
    
    @property
    def current(self) -> float:
        return np.mean(self.measurements) if self.measurements else 0
    
    @property
    def trend(self) -> str:
        if len(self.measurements) < 10:
            return "insufficient_data"
        recent = np.mean(self.measurements[-10:])
        older = np.mean(self.measurements[:10])
        if recent > older + 0.01:
            return "improving"
        elif recent < older - 0.01:
            return "degrading"
        return "stable"


class VectorDatabaseMetrics:
    """
    Comprehensive vector database metrics.
    
    Tracks:
    - Query performance (latency, throughput)
    - Index health (recall, HNSW hops)
    - Ingestion (rate, duplicates, errors)
    - Memory usage
    """
    
    def __init__(self, emit_interval_seconds: int = 60):
        self.emit_interval = emit_interval_seconds
        
        # Query metrics
        self.query_latencies = deque(maxlen=10000)
        self.query_histogram = LatencyHistogram()
        self.queries_per_second = deque(maxlen=60)
        self.last_query_count = 0
        
        # Recall tracking
        self.recall_metrics = RecallMetrics()
        
        # HNSW metrics
        self.hnsw_hops = deque(maxlen=1000)
        self.hnsw_candidates_explored = deque(maxlen=1000)
        
        # Ingestion metrics
        self.ingestion_rates = deque(maxlen=60)
        self.duplicates_skipped = 0
        self.ingestion_errors = 0
        
        # Memory tracking
        self.index_size_bytes = 0
        self.vectors_count = 0
        self.bytes_per_vector = 0
        
        # Tier stats
        self.tier_queries = {'hot': 0, 'warm': 0, 'cold': 0}
        
        # Timestamps
        self.start_time = time.time()
        self.last_emit_time = time.time()
    
    def record_query(
        self,
        latency_ms: float,
        hops: int = 0,
        candidates: int = 0,
        tier: str = "warm"
    ):
        """Record a query execution"""
        self.query_latencies.append(latency_ms)
        self.query_histogram.record(latency_ms)
        
        if hops > 0:
            self.hnsw_hops.append(hops)
        if candidates > 0:
            self.hnsw_candidates_explored.append(candidates)
        
        self.tier_queries[tier] = self.tier_queries.get(tier, 0) + 1
    
    def record_recall(self, retrieved: List[str], ground_truth: List[str]):
        """
        Record recall measurement.
        
        Args:
            retrieved: Symbols returned by approximate search
            ground_truth: Symbols from exact brute-force search
        """
        if not ground_truth:
            return
        
        retrieved_set = set(retrieved)
        ground_truth_set = set(ground_truth)
        
        recall = len(retrieved_set & ground_truth_set) / len(ground_truth_set)
        self.recall_metrics.record(recall)
    
    def record_ingestion(self, count: int, errors: int = 0, duplicates: int = 0):
        """Record ingestion batch"""
        self.ingestion_rates.append(count)
        self.ingestion_errors += errors
        self.duplicates_skipped += duplicates
    
    def update_index_stats(self, vectors_count: int, index_bytes: int):
        """Update index size stats"""
        self.vectors_count = vectors_count
        self.index_size_bytes = index_bytes
        self.bytes_per_vector = index_bytes / max(vectors_count, 1)
    
    def get_query_stats(self) -> Dict:
        """Get query performance statistics"""
        latencies = list(self.query_latencies)
        
        return {
            'total_queries': len(latencies),
            'latency_avg_ms': np.mean(latencies) if latencies else 0,
            'latency_p50_ms': np.percentile(latencies, 50) if latencies else 0,
            'latency_p95_ms': np.percentile(latencies, 95) if latencies else 0,
            'latency_p99_ms': np.percentile(latencies, 99) if latencies else 0,
            'queries_per_sec': len(latencies) / max(time.time() - self.start_time, 1),
            'histogram': self.query_histogram.counts,
        }
    
    def get_hnsw_stats(self) -> Dict:
        """Get HNSW index efficiency stats"""
        hops = list(self.hnsw_hops)
        candidates = list(self.hnsw_candidates_explored)
        
        return {
            'avg_hops': np.mean(hops) if hops else 0,
            'max_hops': max(hops) if hops else 0,
            'avg_candidates': np.mean(candidates) if candidates else 0,
            'recall_current': self.recall_metrics.current,
            'recall_trend': self.recall_metrics.trend,
        }
    
    def get_ingestion_stats(self) -> Dict:
        """Get ingestion performance stats"""
        rates = list(self.ingestion_rates)
        
        return {
            'avg_rate_per_sec': np.mean(rates) if rates else 0,
            'peak_rate_per_sec': max(rates) if rates else 0,
            'total_duplicates_skipped': self.duplicates_skipped,
            'total_errors': self.ingestion_errors,
            'dedup_rate': self.duplicates_skipped / max(sum(rates), 1),
        }
    
    def get_memory_stats(self) -> Dict:
        """Get memory usage stats"""
        return {
            'index_size_mb': self.index_size_bytes / (1024 * 1024),
            'vectors_count': self.vectors_count,
            'bytes_per_vector': self.bytes_per_vector,
            'estimated_capacity_1gb': int(1024 * 1024 * 1024 / max(self.bytes_per_vector, 1)),
        }
    
    def get_tier_stats(self) -> Dict:
        """Get tier-wise query distribution"""
        total = sum(self.tier_queries.values())
        return {
            tier: {
                'count': count,
                'percentage': count / max(total, 1) * 100
            }
            for tier, count in self.tier_queries.items()
        }
    
    def get_all_metrics(self) -> Dict:
        """Get all metrics as a single dict"""
        return {
            'timestamp': datetime.utcnow().isoformat(),
            'uptime_seconds': time.time() - self.start_time,
            'query': self.get_query_stats(),
            'hnsw': self.get_hnsw_stats(),
            'ingestion': self.get_ingestion_stats(),
            'memory': self.get_memory_stats(),
            'tiers': self.get_tier_stats(),
        }
    
    def should_emit(self) -> bool:
        """Check if metrics should be emitted"""
        return time.time() - self.last_emit_time >= self.emit_interval
    
    def emit(self) -> Dict:
        """Emit metrics and reset interval"""
        metrics = self.get_all_metrics()
        self.last_emit_time = time.time()
        return metrics
    
    def health_check(self) -> Dict:
        """
        Check system health against targets.
        
        Returns status and any warnings.
        """
        warnings = []
        
        # Check latency target (<50ms p99)
        stats = self.get_query_stats()
        if stats['latency_p99_ms'] > 50:
            warnings.append(f"Query latency p99 ({stats['latency_p99_ms']:.1f}ms) exceeds 50ms target")
        
        # Check recall target (>0.97)
        if self.recall_metrics.current < 0.97 and len(self.recall_metrics.measurements) > 10:
            warnings.append(f"Recall ({self.recall_metrics.current:.3f}) below 0.97 target")
        
        # Check recall trend
        if self.recall_metrics.trend == "degrading":
            warnings.append("Recall is trending downward - consider index rebuild")
        
        # Check ingestion errors
        ingestion = self.get_ingestion_stats()
        if ingestion['total_errors'] > 100:
            warnings.append(f"High ingestion error count: {ingestion['total_errors']}")
        
        return {
            'status': 'unhealthy' if warnings else 'healthy',
            'warnings': warnings,
            'metrics_summary': {
                'latency_p99_ms': stats['latency_p99_ms'],
                'recall': self.recall_metrics.current,
                'qps': stats['queries_per_sec'],
            }
        }


# Singleton
vector_metrics = VectorDatabaseMetrics()


def format_metrics_for_prometheus(metrics: Dict) -> str:
    """
    Format metrics for Prometheus scraping.
    
    Returns OpenMetrics format text.
    """
    lines = []
    
    # Query metrics
    q = metrics['query']
    lines.append(f"uptrade_vector_query_latency_ms{{quantile=\"0.5\"}} {q['latency_p50_ms']:.2f}")
    lines.append(f"uptrade_vector_query_latency_ms{{quantile=\"0.95\"}} {q['latency_p95_ms']:.2f}")
    lines.append(f"uptrade_vector_query_latency_ms{{quantile=\"0.99\"}} {q['latency_p99_ms']:.2f}")
    lines.append(f"uptrade_vector_queries_total {q['total_queries']}")
    lines.append(f"uptrade_vector_qps {q['queries_per_sec']:.2f}")
    
    # HNSW metrics
    h = metrics['hnsw']
    lines.append(f"uptrade_hnsw_recall {h['recall_current']:.4f}")
    lines.append(f"uptrade_hnsw_avg_hops {h['avg_hops']:.2f}")
    
    # Memory metrics
    m = metrics['memory']
    lines.append(f"uptrade_vector_index_size_bytes {m['index_size_mb'] * 1024 * 1024:.0f}")
    lines.append(f"uptrade_vector_count {m['vectors_count']}")
    
    # Ingestion metrics
    i = metrics['ingestion']
    lines.append(f"uptrade_ingestion_rate {i['avg_rate_per_sec']:.2f}")
    lines.append(f"uptrade_ingestion_errors_total {i['total_errors']}")
    
    return "\n".join(lines)
