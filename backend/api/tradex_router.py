# TradeX Comparison Engine API Router
# Multi-factor asset comparison with VisualX sentiment fusion

from fastapi import APIRouter, HTTPException, Query
from typing import List, Dict, Optional
import numpy as np
from datetime import datetime
import asyncio

from models.tradex_schemas import (
    ComparisonRequest, ComparisonResult, EdgeScore, AssetRanking,
    FactorBreakdown, StatisticalRecommendation, ClusterAnalysis,
    SimilarityResult, SimilarAsset
)
from ai.fusion_network import fusion_network, visualx_encoder
from services.vector_store import vector_store

router = APIRouter(prefix="/tradex", tags=["TradeX Comparison Engine"])


class TradeXEngine:
    """
    Core engine for multi-factor asset comparison.
    
    Combines:
    - Fundamental factors (P/E, ROE, margins)
    - VisualX sentiment (NLP-transformed narrative)
    - Technical indicators (RSI, MACD, volatility)
    
    Uses neural factor fusion for dynamic weighting.
    """
    
    def __init__(self):
        self.fusion_model = fusion_network
        self.visualx = visualx_encoder
        self.vector_store = vector_store
        
        # Demo fundamental data
        self.fundamentals_cache = {
            'AAPL': {'pe': 28.5, 'roe': 0.47, 'debt_equity': 1.8, 'revenue_growth': 0.08, 'margin': 0.26},
            'MSFT': {'pe': 32.1, 'roe': 0.38, 'debt_equity': 0.42, 'revenue_growth': 0.12, 'margin': 0.37},
            'GOOGL': {'pe': 24.3, 'roe': 0.25, 'debt_equity': 0.08, 'revenue_growth': 0.15, 'margin': 0.28},
            'AMZN': {'pe': 58.2, 'roe': 0.12, 'debt_equity': 0.65, 'revenue_growth': 0.22, 'margin': 0.08},
            'NVDA': {'pe': 65.4, 'roe': 0.55, 'debt_equity': 0.41, 'revenue_growth': 0.85, 'margin': 0.56},
            'TSLA': {'pe': 72.1, 'roe': 0.22, 'debt_equity': 0.15, 'revenue_growth': 0.28, 'margin': 0.11},
            'META': {'pe': 26.8, 'roe': 0.23, 'debt_equity': 0.18, 'revenue_growth': 0.16, 'margin': 0.35},
            'JPM': {'pe': 11.2, 'roe': 0.15, 'debt_equity': 1.2, 'revenue_growth': 0.05, 'margin': 0.32},
            'V': {'pe': 29.5, 'roe': 0.45, 'debt_equity': 0.52, 'revenue_growth': 0.11, 'margin': 0.54},
            'JNJ': {'pe': 15.3, 'roe': 0.22, 'debt_equity': 0.35, 'revenue_growth': 0.04, 'margin': 0.22},
            'BTC': {'pe': 0, 'roe': 0, 'debt_equity': 0, 'revenue_growth': 0, 'margin': 0},
            'ETH': {'pe': 0, 'roe': 0, 'debt_equity': 0, 'revenue_growth': 0, 'margin': 0},
        }
        
        # Demo technical data
        self.technicals_cache = {
            'AAPL': {'rsi': 58, 'macd': 1.2, 'bb_position': 0.65, 'atr': 2.8},
            'MSFT': {'rsi': 62, 'macd': 2.1, 'bb_position': 0.72, 'atr': 4.5},
            'GOOGL': {'rsi': 48, 'macd': -0.5, 'bb_position': 0.45, 'atr': 3.2},
            'AMZN': {'rsi': 54, 'macd': 0.8, 'bb_position': 0.58, 'atr': 5.1},
            'NVDA': {'rsi': 71, 'macd': 8.5, 'bb_position': 0.88, 'atr': 18.2},
            'TSLA': {'rsi': 42, 'macd': -3.2, 'bb_position': 0.35, 'atr': 12.5},
            'META': {'rsi': 55, 'macd': 1.5, 'bb_position': 0.52, 'atr': 8.3},
            'JPM': {'rsi': 52, 'macd': 0.3, 'bb_position': 0.48, 'atr': 2.1},
            'V': {'rsi': 60, 'macd': 1.8, 'bb_position': 0.62, 'atr': 3.8},
            'JNJ': {'rsi': 45, 'macd': -0.8, 'bb_position': 0.38, 'atr': 1.5},
            'BTC': {'rsi': 65, 'macd': 1200, 'bb_position': 0.68, 'atr': 1850},
            'ETH': {'rsi': 58, 'macd': 85, 'bb_position': 0.55, 'atr': 125},
        }
        
        # Demo sentiment data
        self.sentiment_cache = {
            'AAPL': {'score': 0.65, 'volume': 15000, 'trend': 0.02},
            'MSFT': {'score': 0.72, 'volume': 12000, 'trend': 0.05},
            'GOOGL': {'score': 0.55, 'volume': 8500, 'trend': -0.01},
            'AMZN': {'score': 0.48, 'volume': 9200, 'trend': -0.03},
            'NVDA': {'score': 0.85, 'volume': 25000, 'trend': 0.12},
            'TSLA': {'score': 0.35, 'volume': 45000, 'trend': -0.08},
            'META': {'score': 0.52, 'volume': 11000, 'trend': 0.02},
            'JPM': {'score': 0.58, 'volume': 5500, 'trend': 0.01},
            'V': {'score': 0.62, 'volume': 4200, 'trend': 0.03},
            'JNJ': {'score': 0.45, 'volume': 3800, 'trend': -0.02},
            'BTC': {'score': 0.68, 'volume': 85000, 'trend': 0.08},
            'ETH': {'score': 0.72, 'volume': 42000, 'trend': 0.10},
        }
    
    def get_market_regime(self) -> str:
        """Determine current market regime based on broad indicators"""
        # Simulated - in production would analyze VIX, breadth, etc.
        regimes = ['bull', 'bear', 'volatile', 'neutral']
        weights = [0.35, 0.15, 0.20, 0.30]
        return np.random.choice(regimes, p=weights)
    
    async def calculate_edge_score(self, symbol: str, lookback: int = 30) -> EdgeScore:
        """
        Calculate Predictive Alpha Score (PAS) for an asset.
        
        Formula: Ŝ = β₁F + β₂V + β₃T + α_sentiment
        """
        # Get data
        fund = self.fundamentals_cache.get(symbol, {})
        tech = self.technicals_cache.get(symbol, {})
        sent = self.sentiment_cache.get(symbol, {})
        
        if not fund and not tech:
            raise HTTPException(status_code=404, detail=f"Symbol {symbol} not found")
        
        # Normalize fundamental factors
        fund_vector = [
            fund.get('pe', 30) / 50,  # Normalize P/E
            fund.get('roe', 0.15),
            min(fund.get('debt_equity', 1) / 2, 1),
            fund.get('revenue_growth', 0.1),
            fund.get('margin', 0.2),
            0.5,  # Placeholder
        ]
        
        # Get sentiment embedding
        sent_embedding = [sent.get('score', 0.5)] * 10  # Simplified
        
        # Normalize technical factors
        tech_vector = [
            tech.get('rsi', 50) / 100,
            min(abs(tech.get('macd', 0)) / 10, 1),
            tech.get('bb_position', 0.5),
            min(tech.get('atr', 5) / 20, 1),
            0.5,  # Volume slope placeholder
        ]
        
        # Get market regime
        regime = self.get_market_regime()
        
        # Monte Carlo inference for uncertainty
        mean_alpha, ci_lower, ci_upper = self.fusion_model.monte_carlo_inference(
            fund_vector, sent_embedding, tech_vector, regime
        )
        
        # Get similar assets
        similar = self.vector_store.find_similar(symbol, limit=3)
        
        # Detect anomalies
        anomalies = []
        if sent.get('trend', 0) < -0.05:
            anomalies.append("sentiment_declining")
        if tech.get('rsi', 50) > 70:
            anomalies.append("overbought_rsi")
        if fund.get('debt_equity', 0) > 1.5:
            anomalies.append("high_leverage")
        
        # Get fusion weights
        output = self.fusion_model.forward(fund_vector, sent_embedding, tech_vector, regime)
        
        return EdgeScore(
            symbol=symbol,
            composite_score=mean_alpha * 100,
            confidence_interval=(ci_lower * 100, ci_upper * 100),
            factor_breakdown=FactorBreakdown(
                value_factor=np.mean(fund_vector[:3]),
                momentum_factor=tech_vector[0],
                sentiment_alpha=sent.get('score', 0.5),
                quality_factor=fund.get('roe', 0.15),
                fusion_weight_fundamental=output.factor_weights[0],
                fusion_weight_sentiment=output.factor_weights[1],
                fusion_weight_technical=output.factor_weights[2],
            ),
            anomaly_flags=anomalies,
            similar_assets=similar
        )
    
    async def compare_assets(self, request: ComparisonRequest) -> ComparisonResult:
        """
        Multi-asset comparison with statistical ranking.
        """
        # Calculate scores in parallel
        tasks = [self.calculate_edge_score(sym, request.lookback_days) for sym in request.symbols]
        scores = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Filter out errors
        valid_scores = [s for s in scores if isinstance(s, EdgeScore)]
        
        if not valid_scores:
            raise HTTPException(status_code=400, detail="No valid symbols provided")
        
        # Rank by composite score
        ranked = sorted(valid_scores, key=lambda x: x.composite_score, reverse=True)
        
        # Assign quartiles
        n = len(ranked)
        rankings = []
        for i, score in enumerate(ranked):
            if i < n * 0.25:
                quartile = 'Q1'
            elif i < n * 0.5:
                quartile = 'Q2'
            elif i < n * 0.75:
                quartile = 'Q3'
            else:
                quartile = 'Q4'
            
            rankings.append(AssetRanking(
                rank=i + 1,
                symbol=score.symbol,
                pas_score=score.composite_score,
                confidence=score.confidence_interval,
                quartile=quartile,
                factors=score.factor_breakdown,
                risks=score.anomaly_flags
            ))
        
        # Statistical significance testing
        scores_arr = [s.composite_score for s in ranked]
        mean_score = np.mean(scores_arr)
        std_score = np.std(scores_arr) + 1e-6
        
        recommendations = []
        for score in ranked:
            z = (score.composite_score - mean_score) / std_score
            if z > 1.96:  # 95% confidence
                recommendations.append(StatisticalRecommendation(
                    symbol=score.symbol,
                    z_score=float(z),
                    alpha=float(score.composite_score - mean_score),
                    confidence='high' if z > 2.5 else 'moderate'
                ))
        
        # Cluster analysis
        cluster_data = self.vector_store.cluster_analysis(request.symbols)
        
        return ComparisonResult(
            rankings=rankings,
            top_recommendations=recommendations[:5],
            cluster_analysis=ClusterAnalysis(
                clusters=cluster_data.get('clusters', []),
                outliers=cluster_data.get('outliers', [])
            ),
            market_regime=self.get_market_regime(),
            comparison_timestamp=datetime.utcnow().isoformat()
        )


# Initialize engine
engine = TradeXEngine()


# API Endpoints

@router.post("/compare", response_model=ComparisonResult)
async def compare_assets(request: ComparisonRequest):
    """
    Multi-factor asset comparison.
    
    Returns ranked assets with Predictive Alpha Scores (PAS),
    statistical significance testing, and cluster analysis.
    """
    return await engine.compare_assets(request)


@router.get("/score/{symbol}", response_model=EdgeScore)
async def get_single_score(
    symbol: str,
    lookback: int = Query(default=30, ge=7, le=365)
):
    """
    Get Predictive Alpha Score for a single asset.
    
    Includes factor breakdown, confidence interval, and anomaly flags.
    """
    return await engine.calculate_edge_score(symbol.upper(), lookback)


@router.get("/similar/{symbol}", response_model=SimilarityResult)
async def find_similar_assets(
    symbol: str,
    min_sentiment: float = Query(default=0.0, ge=-1.0, le=1.0),
    limit: int = Query(default=5, ge=1, le=20)
):
    """
    Find similar assets using vector similarity search.
    
    Use case: "Find assets like AAPL but with better sentiment"
    """
    filters = {}
    if min_sentiment > 0:
        filters['min_sentiment'] = min_sentiment
    
    matches = engine.vector_store.find_similar(
        symbol.upper(),
        filters=filters,
        limit=limit
    )
    
    return SimilarityResult(
        source=symbol.upper(),
        matches=[
            SimilarAsset(
                symbol=m['symbol'],
                distance=m['distance'],
                sentiment=m['sentiment'],
                pe=m['pe']
            )
            for m in matches
        ]
    )


@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "engine": "TradeX Comparison",
        "version": "1.0.0",
        "symbols_indexed": len(engine.vector_store.vectors)
    }
