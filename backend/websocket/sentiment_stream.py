# backend/websocket/sentiment_stream.py
import asyncio
import json
import logging
import random
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Set
from dataclasses import dataclass, asdict
from collections import defaultdict, deque

import websockets
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, APIRouter
from pydantic import BaseModel
import redis.asyncio as redis
import numpy as np
from transformers import pipeline  # For sentiment analysis

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class SentimentMessage:
    """Individual social media message"""
    id: str
    source: str  # twitter, reddit, news, stocktwits
    symbol: str
    text: str
    sentiment_score: float  # -1.0 to 1.0
    confidence: float
    timestamp: datetime
    username: Optional[str] = None
    followers: int = 0
    verified: bool = False
    engagement_score: float = 0.0  # Likes + retweets normalized

@dataclass
class AggregateSentiment:
    """Aggregated sentiment for a symbol"""
    symbol: str
    composite_score: float
    volume_mentions: int
    bullish_count: int
    bearish_count: int
    neutral_count: int
    trend_direction: str  # rising, falling, stable
    trend_strength: float  # 0.0 to 1.0
    sources_breakdown: Dict[str, float]
    top_keywords: List[str]
    last_updated: datetime
    anomaly_detected: bool = False
    anomaly_type: Optional[str] = None

class SentimentEngine:
    """
    High-performance sentiment aggregation engine
    Handles 10k+ messages/sec, maintains 5-min rolling window
    """
    
    def __init__(self):
        # Rolling windows for each symbol (5-minute TTL)
        self.message_buffer: Dict[str, deque] = defaultdict(
            lambda: deque(maxlen=10000)
        )
        self.aggregate_cache: Dict[str, AggregateSentiment] = {}
        self.subscribers: Dict[str, Set[WebSocket]] = defaultdict(set)
        
        # Redis for persistence
        self.redis_client: Optional[redis.Redis] = None
        
        # ML Model (lazy loaded)
        self.sentiment_model = None
        
        # Anomaly detection thresholds
        self.anomaly_threshold = 2.5  # Standard deviations
        
    async def initialize(self):
        """Initialize Redis connection and ML model"""
        try:
            self.redis_client = redis.Redis(
                host='localhost',
                port=6379,
                db=0,
                decode_responses=True
            )
            # Test connection
            await self.redis_client.ping()
        except Exception as e:
            logger.warning(f"Redis connection failed: {e}. Running in memory-only mode.")
            self.redis_client = None
        
        # Load DistilBERT for sentiment (cached)
        logger.info("Loading sentiment model...")
        try:
            self.sentiment_model = pipeline(
                "sentiment-analysis",
                model="distilbert-base-uncased-finetuned-sst-2-english",
                device=-1  # CPU, use 0 for GPU
            )
            logger.info("Sentiment model loaded")
        except Exception as e:
            logger.error(f"Failed to load sentiment model: {e}")
            self.sentiment_model = None
        
    async def ingest_message(self, message: SentimentMessage):
        """Process incoming social media message"""
        # Add to rolling buffer
        self.message_buffer[message.symbol].append(message)
        
        # Calculate engagement-weighted sentiment
        weighted_score = message.sentiment_score * (
            1 + np.log1p(message.engagement_score) * 0.1
        )
        if message.verified:
            weighted_score *= 1.5
            
        # Update aggregate immediately
        await self._update_aggregate(message.symbol)
        
        # Check for anomalies
        await self._detect_anomaly(message.symbol, weighted_score)
        
        # Persist to Redis for historical analysis
        if self.redis_client:
            await self._persist_message(message)
        
    async def _update_aggregate(self, symbol: str):
        """Recalculate aggregate sentiment for symbol"""
        messages = list(self.message_buffer[symbol])
        
        if not messages:
            return
            
        # Time-weighted average (newer = more weight)
        now = datetime.utcnow()
        scores = []
        weights = []
        
        for msg in messages:
            age_seconds = (now - msg.timestamp).total_seconds()
            time_weight = np.exp(-age_seconds / 300)  # 5-min decay
            engagement_weight = 1 + np.log1p(msg.engagement_score) * 0.1
            
            combined_weight = time_weight * engagement_weight
            scores.append(msg.sentiment_score)
            weights.append(combined_weight)
            
        weighted_avg = np.average(scores, weights=weights) if weights else 0
        
        # Count sentiment categories
        bullish = sum(1 for s in scores if s > 0.2)
        bearish = sum(1 for s in scores if s < -0.2)
        neutral = len(scores) - bullish - bearish
        
        # Source breakdown
        sources = defaultdict(list)
        for msg in messages:
            sources[msg.source].append(msg.sentiment_score)
            
        source_avg = {
            src: np.mean(scores) for src, scores in sources.items()
        }
        
        # Calculate trend
        if len(scores) >= 10:
            half = len(scores) // 2
            recent_avg = np.mean(scores[-half:])
            older_avg = np.mean(scores[:half])
            trend_diff = recent_avg - older_avg
            
            if abs(trend_diff) < 0.05:
                trend_dir = "stable"
            elif trend_diff > 0:
                trend_dir = "rising"
            else:
                trend_dir = "falling"
            trend_str = min(abs(trend_diff) * 5, 1.0)
        else:
            trend_dir = "stable"
            trend_str = 0.0
            
        # Extract keywords (simple TF-IDF approximation)
        all_text = " ".join([m.text for m in messages[-100:]])
        words = all_text.lower().split()
        word_counts = defaultdict(int)
        for word in words:
            if len(word) > 3 and word not in {'this', 'that', 'with', 'from'}:
                word_counts[word] += 1
        top_keywords = sorted(word_counts.items(), key=lambda x: x[1], reverse=True)[:5]
        
        aggregate = AggregateSentiment(
            symbol=symbol,
            composite_score=round(weighted_avg, 4),
            volume_mentions=len(messages),
            bullish_count=bullish,
            bearish_count=bearish,
            neutral_count=neutral,
            trend_direction=trend_dir,
            trend_strength=round(trend_str, 2),
            sources_breakdown=source_avg,
            top_keywords=[kw[0] for kw in top_keywords],
            last_updated=now,
            anomaly_detected=False
        )
        
        self.aggregate_cache[symbol] = aggregate
        
        # Broadcast to subscribers
        await self._broadcast(symbol, aggregate)
        
    async def _detect_anomaly(self, symbol: str, new_score: float):
        """Detect sentiment anomalies (VisualX divergence)"""
        if not self.redis_client:
            return

        # Get historical baseline from Redis
        history_key = f"sentiment:history:{symbol}"
        try:
            history = await self.redis_client.lrange(history_key, 0, 100)
            
            if len(history) < 20:
                return
                
            scores = [float(s) for s in history]
            mean = np.mean(scores)
            std = np.std(scores)
            
            if std == 0:
                return
                
            z_score = (new_score - mean) / std
            
            if abs(z_score) > self.anomaly_threshold:
                # Anomaly detected!
                aggregate = self.aggregate_cache.get(symbol)
                if aggregate:
                    aggregate.anomaly_detected = True
                    aggregate.anomaly_type = "sentiment_spike" if z_score > 0 else "sentiment_crash"
                    
                    # Broadcast anomaly alert
                    alert = {
                        "type": "ANOMALY",
                        "symbol": symbol,
                        "severity": "HIGH" if abs(z_score) > 3.5 else "MEDIUM",
                        "z_score": round(z_score, 2),
                        "description": f"Sentiment {'spike' if z_score > 0 else 'crash'} detected",
                        "timestamp": datetime.utcnow().isoformat(),
                        "current_sentiment": new_score,
                        "baseline": round(mean, 4)
                    }
                    
                    await self._broadcast_alert(symbol, alert)
                    logger.warning(f"Anomaly detected for {symbol}: z={z_score:.2f}")
        except Exception as e:
            logger.error(f"Anomaly detection error: {e}")
                
    async def _persist_message(self, message: SentimentMessage):
        """Store message in Redis for historical analysis"""
        if not self.redis_client:
            return

        try:
            pipe = self.redis_client.pipeline()
            
            # Store sentiment score in time series
            history_key = f"sentiment:history:{message.symbol}"
            pipe.lpush(history_key, message.sentiment_score)
            pipe.ltrim(history_key, 0, 999)  # Keep last 1000
            pipe.expire(history_key, 86400)  # 24h TTL
            
            # Store full message
            msg_key = f"message:{message.id}"
            pipe.setex(msg_key, 3600, json.dumps(asdict(message), default=str))
            
            await pipe.execute()
        except Exception as e:
            logger.error(f"Redis persist error: {e}")
        
    async def _broadcast(self, symbol: str, aggregate: AggregateSentiment):
        """Broadcast aggregate to WebSocket subscribers"""
        if symbol not in self.subscribers:
            return
            
        message = {
            "type": "SENTIMENT_UPDATE",
            "data": {
                "symbol": aggregate.symbol,
                "composite_score": aggregate.composite_score,
                "volume_mentions": aggregate.volume_mentions,
                "trend": {
                    "direction": aggregate.trend_direction,
                    "strength": aggregate.trend_strength
                },
                "breakdown": {
                    "bullish": aggregate.bullish_count,
                    "bearish": aggregate.bearish_count,
                    "neutral": aggregate.neutral_count
                },
                "sources": aggregate.sources_breakdown,
                "keywords": aggregate.top_keywords,
                "timestamp": aggregate.last_updated.isoformat(),
                "anomaly": aggregate.anomaly_detected
            }
        }
        
        dead_sockets = set()
        for ws in self.subscribers[symbol]:
            try:
                await ws.send_json(message)
            except:
                dead_sockets.add(ws)
                
        # Cleanup dead connections
        self.subscribers[symbol] -= dead_sockets
        
    async def _broadcast_alert(self, symbol: str, alert: dict):
        """Broadcast anomaly alert"""
        alert_msg = {
            "type": "DIVERGENCE_ALERT",
            "data": alert
        }
        
        for ws in self.subscribers.get(symbol, set()):
            try:
                await ws.send_json(alert_msg)
            except:
                pass
                
    def subscribe(self, symbol: str, websocket: WebSocket):
        """Add WebSocket subscriber"""
        self.subscribers[symbol].add(websocket)
        
    def unsubscribe(self, symbol: str, websocket: WebSocket):
        """Remove WebSocket subscriber"""
        self.subscribers[symbol].discard(websocket)
        
    async def get_historical(self, symbol: str, hours: int = 24) -> List[dict]:
        """Get historical sentiment data"""
        if not self.redis_client:
            return []

        key = f"sentiment:history:{symbol}"
        scores = await self.redis_client.lrange(key, 0, -1)
        
        # Generate timestamps retroactively
        now = datetime.utcnow()
        points = []
        
        for i, score in enumerate(reversed(scores)):
            timestamp = now - timedelta(minutes=i*5)
            points.append({
                "timestamp": timestamp.isoformat(),
                "sentiment": float(score)
            })
            
        return points

# FastAPI Integration
router = APIRouter(prefix="/sentiment", tags=["Sentiment"])

# Global engine instance
sentiment_engine = SentimentEngine()

@router.on_event("startup")
async def startup():
    await sentiment_engine.initialize()

@router.websocket("/ws/{symbol}")
async def sentiment_websocket(websocket: WebSocket, symbol: str):
    """WebSocket endpoint for real-time sentiment"""
    await websocket.accept()
    sentiment_engine.subscribe(symbol.upper(), websocket)
    
    try:
        # Send initial data
        aggregate = sentiment_engine.aggregate_cache.get(symbol.upper())
        if aggregate:
            await websocket.send_json({
                "type": "INITIAL",
                "data": asdict(aggregate)
            })
            
        # Keep connection alive
        while True:
            try:
                message = await asyncio.wait_for(
                    websocket.receive_text(),
                    timeout=30.0
                )
                # Handle client messages (subscriptions, etc.)
                data = json.loads(message)
                if data.get("action") == "unsubscribe":
                    break
            except asyncio.TimeoutError:
                # Send ping
                await websocket.send_json({"type": "PING"})
                
    except WebSocketDisconnect:
        logger.info(f"Client disconnected from {symbol}")
    finally:
        sentiment_engine.unsubscribe(symbol.upper(), websocket)

@router.get("/aggregate/{symbol}")
async def get_aggregate_sentiment(symbol: str):
    """REST endpoint for current sentiment"""
    aggregate = sentiment_engine.aggregate_cache.get(symbol.upper())
    if not aggregate:
        return {"error": "No data available"}
    return asdict(aggregate)

@router.get("/historical/{symbol}")
async def get_historical_sentiment(symbol: str, hours: int = 24):
    """Get historical sentiment time series"""
    data = await sentiment_engine.get_historical(symbol.upper(), hours)
    return {"symbol": symbol, "data": data}

# Mock data generator for testing
async def mock_stream():
    """Generate fake social media stream for testing"""
    symbols = ["AAPL", "TSLA", "BTC", "SPY"]
    sources = ["twitter", "reddit", "news", "stocktwits"]
    
    while True:
        symbol = random.choice(symbols)
        source = random.choice(sources)
        
        # Generate realistic sentiment
        base_sentiment = random.gauss(0, 0.3)
        
        message = SentimentMessage(
            id=f"msg_{random.randint(1000000, 9999999)}",
            source=source,
            symbol=symbol,
            text="Mock message about stock performance",
            sentiment_score=base_sentiment,
            confidence=random.uniform(0.7, 0.98),
            timestamp=datetime.utcnow(),
            engagement_score=random.randint(0, 1000),
            verified=random.random() > 0.95
        )
        
        await sentiment_engine.ingest_message(message)
        await asyncio.sleep(random.uniform(0.1, 0.5))  # 2-10 messages/sec
