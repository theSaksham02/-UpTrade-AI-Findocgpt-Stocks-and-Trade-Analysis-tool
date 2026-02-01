# TradeX Vector Store Service
# In-memory vector storage for similarity search (production: Weaviate/Pinecone)

import numpy as np
from typing import List, Dict, Optional
from datetime import datetime
from dataclasses import dataclass, field
import json

@dataclass
class VectorEntry:
    """Single vector entry in the store"""
    symbol: str
    timestamp: datetime
    vector: np.ndarray
    metadata: Dict = field(default_factory=dict)

class TradeXVectorStore:
    """
    In-memory vector store for asset embeddings.
    
    In production, this would use Weaviate or Pinecone:
    - HNSW index for fast approximate nearest neighbor
    - Cosine similarity metric
    - Hybrid dense + sparse search
    
    Features:
    - Similarity search: "Find assets like AAPL"
    - Filtered search: "Like AAPL but with better sentiment"
    - Cluster analysis: Detect outliers using K-means
    """
    
    def __init__(self, embedding_dim: int = 384):
        self.embedding_dim = embedding_dim
        self.vectors: Dict[str, VectorEntry] = {}
        self._initialize_demo_data()
    
    def _initialize_demo_data(self):
        """Initialize with demo asset embeddings"""
        demo_assets = {
            'AAPL': {'sector': 'technology', 'market_cap': 2800e9, 'sentiment': 0.65, 'pe': 28.5},
            'MSFT': {'sector': 'technology', 'market_cap': 2700e9, 'sentiment': 0.72, 'pe': 32.1},
            'GOOGL': {'sector': 'technology', 'market_cap': 1600e9, 'sentiment': 0.55, 'pe': 24.3},
            'AMZN': {'sector': 'consumer', 'market_cap': 1500e9, 'sentiment': 0.48, 'pe': 58.2},
            'NVDA': {'sector': 'technology', 'market_cap': 1200e9, 'sentiment': 0.85, 'pe': 65.4},
            'TSLA': {'sector': 'automotive', 'market_cap': 800e9, 'sentiment': 0.35, 'pe': 72.1},
            'META': {'sector': 'technology', 'market_cap': 900e9, 'sentiment': 0.52, 'pe': 26.8},
            'JPM': {'sector': 'financial', 'market_cap': 450e9, 'sentiment': 0.58, 'pe': 11.2},
            'V': {'sector': 'financial', 'market_cap': 480e9, 'sentiment': 0.62, 'pe': 29.5},
            'JNJ': {'sector': 'healthcare', 'market_cap': 380e9, 'sentiment': 0.45, 'pe': 15.3},
            'UNH': {'sector': 'healthcare', 'market_cap': 450e9, 'sentiment': 0.55, 'pe': 21.4},
            'XOM': {'sector': 'energy', 'market_cap': 420e9, 'sentiment': 0.38, 'pe': 10.8},
            'BTC': {'sector': 'crypto', 'market_cap': 850e9, 'sentiment': 0.68, 'pe': 0},
            'ETH': {'sector': 'crypto', 'market_cap': 280e9, 'sentiment': 0.72, 'pe': 0},
        }
        
        np.random.seed(42)
        
        for symbol, meta in demo_assets.items():
            # Generate pseudo-embedding based on sector and fundamentals
            base_vector = np.random.randn(self.embedding_dim)
            
            # Add sector clustering effect
            sector_offset = hash(meta['sector']) % 100 / 100
            base_vector[:50] += sector_offset
            
            # Add sentiment influence
            base_vector[50:100] += meta['sentiment'] * 0.5
            
            # Normalize
            base_vector = base_vector / np.linalg.norm(base_vector)
            
            self.vectors[symbol] = VectorEntry(
                symbol=symbol,
                timestamp=datetime.utcnow(),
                vector=base_vector,
                metadata=meta
            )
    
    def upsert(self, symbol: str, vector: List[float], metadata: Dict):
        """Insert or update a vector entry"""
        vec = np.array(vector)
        if len(vec) != self.embedding_dim:
            # Pad or truncate
            if len(vec) < self.embedding_dim:
                vec = np.pad(vec, (0, self.embedding_dim - len(vec)))
            else:
                vec = vec[:self.embedding_dim]
        
        vec = vec / np.linalg.norm(vec)  # Normalize
        
        self.vectors[symbol] = VectorEntry(
            symbol=symbol,
            timestamp=datetime.utcnow(),
            vector=vec,
            metadata=metadata
        )
    
    def cosine_similarity(self, a: np.ndarray, b: np.ndarray) -> float:
        """Compute cosine similarity between two vectors"""
        return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b) + 1e-8))
    
    def find_similar(
        self,
        symbol: str,
        filters: Optional[Dict] = None,
        limit: int = 5
    ) -> List[Dict]:
        """
        Find similar assets using cosine similarity.
        
        Args:
            symbol: Source symbol to find similar assets for
            filters: Optional filters like {'min_sentiment': 0.5}
            limit: Maximum results to return
            
        Returns:
            List of similar assets with distance and metadata
        """
        if symbol not in self.vectors:
            return []
        
        source_vec = self.vectors[symbol].vector
        results = []
        
        for sym, entry in self.vectors.items():
            if sym == symbol:
                continue
            
            # Apply filters
            if filters:
                if 'min_sentiment' in filters:
                    if entry.metadata.get('sentiment', 0) < filters['min_sentiment']:
                        continue
                if 'sector' in filters:
                    if entry.metadata.get('sector') != filters['sector']:
                        continue
                if 'max_pe' in filters:
                    if entry.metadata.get('pe', 100) > filters['max_pe']:
                        continue
            
            similarity = self.cosine_similarity(source_vec, entry.vector)
            distance = 1 - similarity  # Convert to distance
            
            results.append({
                'symbol': sym,
                'distance': distance,
                'similarity': similarity,
                'sentiment': entry.metadata.get('sentiment', 0),
                'pe': entry.metadata.get('pe', 0),
                'sector': entry.metadata.get('sector', 'unknown')
            })
        
        # Sort by similarity (descending) = distance (ascending)
        results.sort(key=lambda x: x['distance'])
        
        return results[:limit]
    
    def cluster_analysis(
        self,
        symbols: List[str],
        n_clusters: int = 3
    ) -> Dict:
        """
        K-means clustering on asset vectors.
        
        Returns clusters and outliers (assets far from centroids).
        """
        # Filter to valid symbols
        valid_symbols = [s for s in symbols if s in self.vectors]
        
        if len(valid_symbols) < n_clusters:
            return {'clusters': [], 'outliers': [], 'centroids': []}
        
        vectors = np.array([self.vectors[s].vector for s in valid_symbols])
        
        # Simple K-means implementation
        np.random.seed(42)
        
        # Initialize centroids randomly
        indices = np.random.choice(len(vectors), n_clusters, replace=False)
        centroids = vectors[indices].copy()
        
        # Iterate
        for _ in range(10):
            # Assign points to nearest centroid
            distances = np.array([
                [np.linalg.norm(v - c) for c in centroids]
                for v in vectors
            ])
            labels = np.argmin(distances, axis=1)
            
            # Update centroids
            for k in range(n_clusters):
                mask = labels == k
                if np.sum(mask) > 0:
                    centroids[k] = vectors[mask].mean(axis=0)
        
        # Find outliers (highest distance to assigned centroid)
        min_distances = np.min(distances, axis=1)
        outlier_indices = np.argsort(min_distances)[-3:]  # Top 3 outliers
        outliers = [valid_symbols[i] for i in outlier_indices]
        
        return {
            'clusters': labels.tolist(),
            'outliers': outliers,
            'centroids': centroids.tolist(),
            'symbols': valid_symbols
        }
    
    def get_metadata(self, symbol: str) -> Optional[Dict]:
        """Get metadata for a symbol"""
        if symbol in self.vectors:
            return self.vectors[symbol].metadata
        return None


# Singleton instance
vector_store = TradeXVectorStore()
