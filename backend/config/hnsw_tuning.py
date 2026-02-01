# HNSW Tuning for Financial Time-Series
# Dynamic configuration based on workload mode

"""
HNSW Parameter Guide for Financial Time-Series:
- ef_construction: Lower (64-128) for high ingestion, Higher (256-512) for query accuracy
- max_connections (M): 16 for 384-dim vectors (rule: 2*log2(dim))
- dynamic_ef: Enable for variable recall requirements

Financial vectors have HIGH TEMPORAL CORRELATION
(consecutive minutes are similar) - optimize accordingly.
"""

from dataclasses import dataclass
from enum import Enum
from typing import Dict, Any, Optional
import numpy as np


class WorkloadMode(str, Enum):
    """System workload modes"""
    INGESTION = "ingestion"     # Market open hours (9:30-16:00 ET)
    ANALYTICS = "analytics"     # After hours research
    BALANCED = "balanced"       # Mixed workload
    MAINTENANCE = "maintenance" # Nightly maintenance


@dataclass
class HNSWParams:
    """HNSW index parameters"""
    ef: int
    ef_construction: int
    max_connections: int  # M parameter
    dynamic_ef_factor: int
    dynamic_ef_min: int
    dynamic_ef_max: int


@dataclass
class QuantizationConfig:
    """Vector quantization configuration for memory optimization"""
    enabled: bool
    type: str  # "none", "scalar", "product", "binary"
    bits: int = 8  # For scalar quantization
    segments: int = 96  # For product quantization (dim/segments)
    
    @property
    def memory_reduction(self) -> float:
        """Estimated memory reduction factor"""
        if self.type == "none":
            return 1.0
        elif self.type == "scalar":
            return 4.0  # float32 → int8
        elif self.type == "product":
            return 4.0  # Typical PQ compression
        elif self.type == "binary":
            return 32.0  # float32 → 1-bit
        return 1.0
    
    @property
    def expected_recall(self) -> float:
        """Expected recall@10 with this quantization"""
        if self.type == "none":
            return 0.99
        elif self.type == "scalar":
            return 0.97
        elif self.type == "product":
            return 0.95
        elif self.type == "binary":
            return 0.90
        return 0.99


class HNSWTuner:
    """
    Dynamic HNSW parameter tuning based on workload.
    
    Optimizes for:
    - Ingestion mode: >5k vectors/sec, recall ~0.95
    - Analytics mode: Complex similarity search, recall ~0.995
    - Balanced mode: Trade-off for mixed workloads
    """
    
    # Predefined parameter sets
    PRESETS = {
        WorkloadMode.INGESTION: HNSWParams(
            ef=64,
            ef_construction=64,
            max_connections=16,
            dynamic_ef_factor=4,
            dynamic_ef_min=50,
            dynamic_ef_max=200,
        ),
        WorkloadMode.ANALYTICS: HNSWParams(
            ef=512,
            ef_construction=256,
            max_connections=64,
            dynamic_ef_factor=16,
            dynamic_ef_min=100,
            dynamic_ef_max=1000,
        ),
        WorkloadMode.BALANCED: HNSWParams(
            ef=128,
            ef_construction=128,
            max_connections=32,
            dynamic_ef_factor=8,
            dynamic_ef_min=100,
            dynamic_ef_max=500,
        ),
        WorkloadMode.MAINTENANCE: HNSWParams(
            ef=256,
            ef_construction=512,  # High for index rebuilding
            max_connections=48,
            dynamic_ef_factor=8,
            dynamic_ef_min=100,
            dynamic_ef_max=500,
        ),
    }
    
    # Quantization presets by use case
    QUANTIZATION_PRESETS = {
        'real_time': QuantizationConfig(enabled=False, type="none"),
        'high_scale': QuantizationConfig(enabled=True, type="scalar", bits=8),
        'memory_constrained': QuantizationConfig(enabled=True, type="product", segments=96),
        'ultra_compressed': QuantizationConfig(enabled=True, type="binary"),
    }
    
    def __init__(self, embedding_dim: int = 384):
        self.embedding_dim = embedding_dim
        self.current_mode = WorkloadMode.BALANCED
        self.current_params = self.PRESETS[WorkloadMode.BALANCED]
        self.quantization = QuantizationConfig(enabled=False, type="none")
        
        # Performance tracking
        self._query_latencies: list = []
        self._ingestion_rates: list = []
    
    def set_mode(self, mode: WorkloadMode):
        """Switch to a predefined workload mode"""
        self.current_mode = mode
        self.current_params = self.PRESETS[mode]
        return self.current_params
    
    def configure_for_ingestion(self) -> HNSWParams:
        """
        Optimize for >5k vectors/sec (market open hours).
        Trade-off: Lower recall (0.95 vs 0.99) for speed.
        """
        return self.set_mode(WorkloadMode.INGESTION)
    
    def configure_for_analytics(self) -> HNSWParams:
        """
        Optimize for complex similarity search (after hours).
        Trade-off: Slower ingestion, high recall (0.995).
        """
        return self.set_mode(WorkloadMode.ANALYTICS)
    
    def configure_for_scale(self, target_vectors: int = 10_000_000) -> Dict[str, Any]:
        """
        Configure for large-scale deployment with memory optimization.
        
        Args:
            target_vectors: Expected number of vectors to store
        """
        # Calculate memory requirements
        bytes_per_vector_full = self.embedding_dim * 4  # float32
        full_memory_gb = (target_vectors * bytes_per_vector_full) / (1024**3)
        
        # Choose quantization based on memory
        if full_memory_gb > 100:
            self.quantization = self.QUANTIZATION_PRESETS['ultra_compressed']
        elif full_memory_gb > 50:
            self.quantization = self.QUANTIZATION_PRESETS['memory_constrained']
        elif full_memory_gb > 10:
            self.quantization = self.QUANTIZATION_PRESETS['high_scale']
        else:
            self.quantization = self.QUANTIZATION_PRESETS['real_time']
        
        # Set balanced params for scale
        self.set_mode(WorkloadMode.BALANCED)
        
        return {
            'hnsw_params': self.current_params,
            'quantization': self.quantization,
            'estimated_memory_gb': full_memory_gb / self.quantization.memory_reduction,
            'expected_recall': self.quantization.expected_recall,
        }
    
    def get_optimal_m(self) -> int:
        """
        Calculate optimal max_connections (M) for embedding dimension.
        Rule of thumb: M = 2 * log2(dim)
        """
        return max(16, int(2 * np.log2(self.embedding_dim)))
    
    def auto_tune_ef(self, target_recall: float, sample_queries: int = 100) -> int:
        """
        Auto-tune ef parameter for target recall.
        Uses binary search to find minimum ef for desired recall.
        """
        # Start with reasonable bounds
        ef_min, ef_max = 32, 512
        
        while ef_max - ef_min > 8:
            ef_mid = (ef_min + ef_max) // 2
            
            # Simulate recall at this ef (in production, would run actual queries)
            estimated_recall = self._estimate_recall(ef_mid)
            
            if estimated_recall >= target_recall:
                ef_max = ef_mid
            else:
                ef_min = ef_mid
        
        return ef_max
    
    def _estimate_recall(self, ef: int) -> float:
        """
        Estimate recall@10 for given ef value.
        Based on empirical observations from HNSW paper.
        """
        # Sigmoid approximation of recall curve
        base_recall = 0.99 * (1 - np.exp(-ef / 100))
        
        # Adjust for max_connections
        m_factor = min(1.0, self.current_params.max_connections / 32)
        
        return min(0.995, base_recall * m_factor)
    
    def get_config_dict(self) -> Dict[str, Any]:
        """Get current configuration as dictionary"""
        return {
            'mode': self.current_mode.value,
            'hnsw': {
                'ef': self.current_params.ef,
                'ef_construction': self.current_params.ef_construction,
                'max_connections': self.current_params.max_connections,
                'dynamic_ef_factor': self.current_params.dynamic_ef_factor,
                'dynamic_ef_min': self.current_params.dynamic_ef_min,
                'dynamic_ef_max': self.current_params.dynamic_ef_max,
            },
            'quantization': {
                'enabled': self.quantization.enabled,
                'type': self.quantization.type,
                'memory_reduction': self.quantization.memory_reduction,
                'expected_recall': self.quantization.expected_recall,
            },
            'embedding_dim': self.embedding_dim,
            'optimal_m': self.get_optimal_m(),
        }
    
    def log_performance(self, query_latency_ms: float = None, ingestion_rate: float = None):
        """Log performance metrics for adaptive tuning"""
        if query_latency_ms is not None:
            self._query_latencies.append(query_latency_ms)
            if len(self._query_latencies) > 1000:
                self._query_latencies = self._query_latencies[-500:]
        
        if ingestion_rate is not None:
            self._ingestion_rates.append(ingestion_rate)
            if len(self._ingestion_rates) > 100:
                self._ingestion_rates = self._ingestion_rates[-50:]
    
    def get_performance_stats(self) -> Dict[str, float]:
        """Get performance statistics"""
        return {
            'query_latency_p50_ms': float(np.percentile(self._query_latencies, 50)) if self._query_latencies else 0,
            'query_latency_p99_ms': float(np.percentile(self._query_latencies, 99)) if self._query_latencies else 0,
            'avg_ingestion_rate': float(np.mean(self._ingestion_rates)) if self._ingestion_rates else 0,
        }
    
    def recommend_mode(self) -> WorkloadMode:
        """
        Recommend workload mode based on current metrics.
        Could be called periodically to auto-switch.
        """
        if not self._query_latencies or not self._ingestion_rates:
            return WorkloadMode.BALANCED
        
        avg_latency = np.mean(self._query_latencies)
        avg_ingestion = np.mean(self._ingestion_rates)
        
        # High ingestion, tolerable latency → Ingestion mode
        if avg_ingestion > 5000 and avg_latency < 100:
            return WorkloadMode.INGESTION
        
        # Low ingestion, want low latency → Analytics mode
        if avg_ingestion < 100 and avg_latency > 50:
            return WorkloadMode.ANALYTICS
        
        return WorkloadMode.BALANCED


# Singleton
hnsw_tuner = HNSWTuner()
