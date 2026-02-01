# TradeX Comparison Engine - Pydantic Models
# Multi-factor comparison with VisualX sentiment fusion

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Literal, Tuple
from datetime import datetime
from enum import Enum

class FactorType(str, Enum):
    FUNDAMENTAL = "fundamental"
    SENTIMENT = "sentiment"
    TECHNICAL = "technical"
    MACRO = "macro"

class AssetVector(BaseModel):
    """
    High-dimensional embedding for vector similarity search
    Represents an asset's position in 'Factor Space'
    """
    symbol: str
    timestamp: datetime
    
    # Fundamental factors
    pe_ratio: float = Field(default=0.0, alias="pe")
    pb_ratio: float = 0.0
    roe: float = 0.0
    debt_to_equity: float = 0.0
    revenue_growth: float = 0.0
    profit_margin: float = 0.0
    free_cash_flow: float = 0.0
    
    # VisualX Sentiment factors
    sentiment_score: float = Field(default=0.0, ge=-1.0, le=1.0)
    sentiment_volatility: float = 0.0
    narrative_strength: float = 0.0
    buzz_volume: int = 0
    sentiment_trend: float = 0.0
    
    # Technical factors
    rsi_14: float = 50.0
    macd_signal: float = 0.0
    bollinger_position: float = 0.5
    atr_14: float = 0.0
    
    # Neural embedding (384-dim)
    latent_vector: Optional[List[float]] = None
    
    class Config:
        populate_by_name = True

class FactorBreakdown(BaseModel):
    """Factor contribution breakdown"""
    value_factor: float = 0.0
    momentum_factor: float = 0.0
    sentiment_alpha: float = 0.0
    quality_factor: float = 0.0
    fusion_weight_fundamental: float = 0.33
    fusion_weight_sentiment: float = 0.34
    fusion_weight_technical: float = 0.33

class EdgeScore(BaseModel):
    """Statistical edge calculation output"""
    symbol: str
    composite_score: float  # Predictive Alpha Score (0-100)
    confidence_interval: Tuple[float, float]  # 95% CI
    factor_breakdown: FactorBreakdown
    anomaly_flags: List[str] = []
    similar_assets: List[Dict] = []

class ComparisonRequest(BaseModel):
    """Request for multi-asset comparison"""
    symbols: List[str] = Field(min_length=2, max_length=10)
    lookback_days: int = 90
    factor_weights: Optional[Dict[str, float]] = None

class AssetRanking(BaseModel):
    """Single asset ranking result"""
    rank: int
    symbol: str
    pas_score: float
    confidence: Tuple[float, float]
    quartile: Literal['Q1', 'Q2', 'Q3', 'Q4']
    factors: FactorBreakdown
    risks: List[str] = []

class StatisticalRecommendation(BaseModel):
    """Statistically significant recommendation"""
    symbol: str
    z_score: float
    alpha: float
    confidence: Literal['high', 'moderate', 'low']

class ClusterAnalysis(BaseModel):
    """K-means cluster analysis result"""
    clusters: List[int] = []
    outliers: List[str] = []
    centroids: Optional[List[List[float]]] = None

class ComparisonResult(BaseModel):
    """Complete comparison result"""
    rankings: List[AssetRanking]
    top_recommendations: List[StatisticalRecommendation] = []
    cluster_analysis: ClusterAnalysis
    market_regime: Literal['bull', 'bear', 'volatile', 'neutral'] = 'neutral'
    comparison_timestamp: str

class SimilarAsset(BaseModel):
    """Similar asset from vector search"""
    symbol: str
    distance: float
    sentiment: float
    pe: float

class SimilarityResult(BaseModel):
    """Similarity search result"""
    source: str
    matches: List[SimilarAsset]

# Strategy simulation for backtesting
class BacktestConfig(BaseModel):
    strategy: str
    symbol: str
    start_date: str
    end_date: str
    initial_capital: float = 100000.0
    position_size: float = 0.1
    stop_loss: Optional[float] = None
    take_profit: Optional[float] = None

class BacktestTrade(BaseModel):
    entry_time: int
    exit_time: int
    entry_price: float
    exit_price: float
    side: Literal['long', 'short']
    pnl: float
    pnl_percent: float

class BacktestResult(BaseModel):
    config: BacktestConfig
    total_return: float
    annualized_return: float
    sharpe_ratio: float
    max_drawdown: float
    win_rate: float
    profit_factor: float
    total_trades: int
    trades: List[BacktestTrade] = []
