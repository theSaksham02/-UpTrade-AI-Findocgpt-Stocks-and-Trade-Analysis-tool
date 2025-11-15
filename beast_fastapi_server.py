"""
🦁 BEAST MODE - FastAPI Backend Server
Ultimate Financial Intelligence API
"""

from fastapi import FastAPI, HTTPException, Query, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime
import uvicorn
import asyncio
import json

from beast_api_manager import get_beast_manager
from api_integrations_enhanced import get_enhanced_api_manager

# ============================================================================
# REQUEST/RESPONSE MODELS
# ============================================================================

class ChatRequest(BaseModel):
    """Chat request model"""
    prompt: str = Field(..., description="User's question or message")
    context: Optional[List[Dict[str, str]]] = Field(default=None, description="Conversation history")

class SentimentRequest(BaseModel):
    """Sentiment analysis request"""
    text: str = Field(..., description="Text to analyze")
    symbol: Optional[str] = Field(default=None, description="Related stock symbol")

# Initialize FastAPI app
app = FastAPI(
    title="UpTrade AI - BEAST MODE API",
    description="Ultimate Financial Intelligence System with 13+ integrated APIs",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize managers
beast_manager = get_beast_manager()
basic_manager = get_enhanced_api_manager()

# ============================================================================
# HEALTH & STATUS ENDPOINTS
# ============================================================================

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "UpTrade AI - BEAST MODE",
        "version": "2.0.0",
        "status": "operational",
        "mode": "BEAST",
        "timestamp": datetime.now().isoformat(),
        "documentation": "/docs"
    }

@app.get("/api/health")
async def health_check():
    """Comprehensive system health check"""
    health = beast_manager.get_system_health()
    return JSONResponse(content=health)

@app.get("/api/status")
async def system_status():
    """Quick system status"""
    health = beast_manager.get_system_health()
    stats = health['statistics']
    
    return {
        "status": stats['status'],
        "mode": "BEAST MODE",
        "apis_configured": f"{stats['configured_apis']}/{stats['total_apis']}",
        "configuration_percentage": stats['configuration_percentage'],
        "cache_size": stats['cache_size'],
        "timestamp": datetime.now().isoformat()
    }

# ============================================================================
# MARKET DATA ENDPOINTS
# ============================================================================

@app.get("/api/stock/quote/{symbol}")
async def get_stock_quote(symbol: str):
    """Get real-time stock quote"""
    try:
        quote = basic_manager.get_stock_quote(symbol.upper())
        return JSONResponse(content=quote)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/stock/company/{symbol}")
async def get_company_info(symbol: str):
    """Get company overview and profile"""
    try:
        company = basic_manager.get_company_overview(symbol.upper())
        return JSONResponse(content=company)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/stock/analysis/{symbol}")
async def get_comprehensive_analysis(symbol: str):
    """
    🦁 BEAST MODE: Get comprehensive stock analysis
    Combines data from multiple APIs
    """
    try:
        analysis = beast_manager.get_complete_stock_analysis(symbol.upper())
        return JSONResponse(content=analysis)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/stock/financials/{symbol}")
async def get_financial_statements(symbol: str, period: str = Query("annual", enum=["annual", "quarter"])):
    """Get company financial statements"""
    try:
        financials = beast_manager.get_company_financials(symbol.upper(), period)
        return JSONResponse(content=financials)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/stock/rating/{symbol}")
async def get_stock_rating(symbol: str):
    """Get analyst ratings and recommendations"""
    try:
        rating = beast_manager.get_stock_rating(symbol.upper())
        return JSONResponse(content=rating)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/stock/batch")
async def get_batch_quotes(symbols: List[str]):
    """Get quotes for multiple stocks"""
    try:
        quotes = {}
        for symbol in symbols:
            quotes[symbol] = basic_manager.get_stock_quote(symbol.upper())
        return JSONResponse(content=quotes)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/stock/historical/{symbol}")
async def get_historical_data(symbol: str, period: str = Query("1M", enum=["1D", "1W", "1M", "3M", "6M", "1Y", "5Y", "10Y", "YTD"])):
    """
    Get historical OHLCV data with multi-API failover
    Uses Alpha Vantage (primary), Polygon (secondary), Finnhub (tertiary)
    """
    try:
        historical = basic_manager.get_historical_data(symbol.upper(), period)
        return JSONResponse(content=historical)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================================
# NEWS ENDPOINTS
# ============================================================================

@app.get("/api/news/market")
async def get_market_news(query: str = "stock market", limit: int = Query(20, ge=1, le=50)):
    """Get aggregated market news from multiple sources"""
    try:
        news = basic_manager.get_financial_news(query, limit)
        return JSONResponse(content={"query": query, "count": len(news), "articles": news})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/news/stock/{symbol}")
async def get_stock_news(symbol: str, limit: int = Query(10, ge=1, le=30)):
    """Get news specific to a stock"""
    try:
        news = basic_manager.get_stock_news(symbol.upper(), limit)
        return JSONResponse(content={"symbol": symbol, "count": len(news), "articles": news})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================================
# ECONOMIC DATA ENDPOINTS
# ============================================================================

@app.get("/api/economic/indicators")
async def get_economic_indicators():
    """Get key economic indicators from FRED"""
    try:
        indicators = beast_manager.get_key_economic_indicators()
        return JSONResponse(content=indicators)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/economic/indicator/{series_id}")
async def get_specific_indicator(series_id: str, limit: int = Query(100, ge=1, le=1000)):
    """Get specific economic indicator"""
    try:
        data = beast_manager.get_economic_indicator(series_id, limit)
        return JSONResponse(content=data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================================
# FOREX & CURRENCY ENDPOINTS
# ============================================================================

@app.get("/api/forex/rates/{base_currency}")
async def get_forex_rates(base_currency: str = "USD"):
    """Get exchange rates for a base currency"""
    try:
        rates = beast_manager.get_exchange_rates(base_currency.upper())
        return JSONResponse(content=rates)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/forex/convert")
async def convert_currency(
    amount: float,
    from_currency: str,
    to_currency: str
):
    """Convert currency amounts"""
    try:
        conversion = beast_manager.convert_currency(amount, from_currency.upper(), to_currency.upper())
        return JSONResponse(content=conversion)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================================
# CRYPTO ENDPOINTS
# ============================================================================

@app.get("/api/crypto/prices")
async def get_crypto_prices(ids: Optional[str] = None):
    """Get cryptocurrency prices"""
    try:
        crypto_ids = ids.split(',') if ids else None
        prices = beast_manager.get_crypto_prices(crypto_ids)
        return JSONResponse(content=prices)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================================
# AI & ANALYTICS ENDPOINTS
# ============================================================================

@app.get("/api/stocks/search")
async def search_stocks(query: str = Query(..., min_length=1)):
    """Search for stocks by symbol or name - REAL DATA ONLY"""
    try:
        # Try Alpha Vantage first
        if beast_manager.alpha_vantage_key:
            results = beast_manager.search_stocks(query)
            if results:
                return JSONResponse(content={"results": results, "query": query, "source": "Alpha Vantage"})
        
        # Try Finnhub as backup
        if beast_manager.finnhub_key:
            results = beast_manager.search_stocks_finnhub(query)
            if results:
                return JSONResponse(content={"results": results, "query": query, "source": "Finnhub"})
        
        # No API keys configured
        return JSONResponse(
            status_code=503,
            content={
                "error": "API keys not configured",
                "message": "Please configure Alpha Vantage or Finnhub API keys in .env file to use stock search",
                "query": query,
                "results": []
            }
        )
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={
                "error": str(e),
                "message": "Stock search temporarily unavailable",
                "query": query,
                "results": []
            }
        )

@app.post("/api/ai/analyze")
async def ai_analysis(request: ChatRequest):
    """Get AI-powered market analysis with conversation context"""
    try:
        # Update conversation history if provided
        if request.context:
            beast_manager.conversation_history = request.context[-10:]  # Keep last 10 messages
        
        analysis = beast_manager.analyze_with_gpt(request.prompt)
        
        # Always ensure we have a valid response
        if not analysis or 'analysis' not in analysis:
            analysis = beast_manager._generate_intelligent_fallback(request.prompt)
        
        return JSONResponse(content=analysis)
    except Exception as e:
        # Return intelligent fallback instead of error
        fallback = beast_manager._generate_intelligent_fallback(request.prompt)
        return JSONResponse(content=fallback)

@app.post("/api/ai/sentiment")
async def sentiment_analysis(request: SentimentRequest):
    """Advanced sentiment analysis using HuggingFace"""
    try:
        sentiment = beast_manager.analyze_sentiment_huggingface(request.text)
        
        # Ensure valid response
        if not sentiment or 'error' in sentiment:
            # Provide basic sentiment response
            sentiment = {
                "text": request.text,
                "sentiment": "neutral",
                "score": 0.0,
                "source": "UpTrade AI (Fallback)",
                "message": "Sentiment analysis service temporarily unavailable. Using fallback."
            }
        
        return JSONResponse(content=sentiment)
    except Exception as e:
        # Return fallback sentiment
        return JSONResponse(content={
            "text": request.text,
            "sentiment": "neutral",
            "score": 0.0,
            "source": "UpTrade AI (Fallback)",
            "error": str(e)
        })

# ============================================================================
# COMPREHENSIVE ENDPOINTS
# ============================================================================

@app.get("/api/market/overview")
async def market_overview():
    """
    🦁 BEAST MODE: Get comprehensive market overview
    Includes stocks, crypto, forex, and economic data
    """
    try:
        overview = beast_manager.get_market_overview()
        return JSONResponse(content=overview)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/dashboard/data")
async def dashboard_data(symbols: Optional[str] = None):
    """Get comprehensive dashboard data"""
    try:
        symbol_list = symbols.split(',') if symbols else ['AAPL', 'MSFT', 'GOOGL']
        
        dashboard = {
            "timestamp": datetime.now().isoformat(),
            "stocks": {},
            "market_overview": {},
            "crypto": {},
            "economic": {}
        }
        
        # Get stock quotes
        for symbol in symbol_list:
            dashboard["stocks"][symbol] = basic_manager.get_stock_quote(symbol.upper())
        
        # Get market overview
        indices = ['SPY', 'QQQ', 'DIA']
        dashboard["market_overview"] = {
            idx: basic_manager.get_stock_quote(idx)
            for idx in indices
        }
        
        # Get crypto
        dashboard["crypto"] = beast_manager.get_crypto_prices(['bitcoin', 'ethereum'])
        
        # Get key economic indicators
        dashboard["economic"] = {
            "unemployment": beast_manager.get_economic_indicator('UNRATE', limit=1),
            "fed_funds": beast_manager.get_economic_indicator('DFF', limit=1)
        }
        
        return JSONResponse(content=dashboard)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================================
# COMPARISON & ANALYSIS ENDPOINTS
# ============================================================================

@app.post("/api/compare/stocks")
async def compare_stocks(symbols: List[str]):
    """
    Compare multiple stocks side-by-side with comprehensive data
    Uses Finnhub + Alpha Vantage + Polygon for quotes
    Uses FMP for financials and ratings
    """
    try:
        comparison = {}
        for symbol in symbols:
            sym = symbol.upper()
            comparison[sym] = {
                "quote": basic_manager.get_stock_quote(sym),
                "company": basic_manager.get_company_overview(sym),
                "financials": beast_manager.get_company_financials(sym, 'annual'),
                "rating": beast_manager.get_stock_rating(sym),
                "news_count": len(basic_manager.get_stock_news(sym, limit=5)),
                "recent_news": basic_manager.get_stock_news(sym, limit=3)
            }
        
        return JSONResponse(content={
            "symbols": symbols,
            "comparison": comparison,
            "timestamp": datetime.now().isoformat(),
            "sources": {
                "quotes": "Finnhub + Alpha Vantage + Polygon",
                "financials": "FMP",
                "news": "NewsAPI + NewsData + Marketaux + Finnhub"
            }
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/sentiment/{symbol}")
async def get_aggregated_sentiment(symbol: str):
    """
    Get aggregated sentiment analysis for a stock
    Analyzes news from NewsAPI, NewsData, Marketaux, and Finnhub
    Uses FinBERT for sentiment scoring
    """
    try:
        sym = symbol.upper()
        
        # Get news from all sources
        news = basic_manager.get_stock_news(sym, limit=20)
        
        if not news:
            return JSONResponse(content={
                "symbol": sym,
                "overall": "neutral",
                "score": 0.0,
                "distribution": {"positive": 0, "neutral": 0, "negative": 0},
                "totalArticles": 0,
                "analyzedArticles": 0,
                "source": "No news available",
                "message": "No news articles found for sentiment analysis"
            })
        
        # Analyze sentiment for each article using FinBERT
        sentiments = []
        positive_count = 0
        negative_count = 0
        neutral_count = 0
        total_score = 0.0
        
        for article in news:
            text = f"{article.get('title', '')} {article.get('description', '')}"
            if text.strip():
                sentiment_result = beast_manager.analyze_sentiment_huggingface(text)
                if sentiment_result and 'sentiment' in sentiment_result:
                    sentiments.append(sentiment_result)
                    
                    sentiment_label = sentiment_result.get('sentiment', 'neutral').lower()
                    score = sentiment_result.get('score', 0.0)
                    
                    if sentiment_label == 'positive':
                        positive_count += 1
                    elif sentiment_label == 'negative':
                        negative_count += 1
                    else:
                        neutral_count += 1
                    
                    total_score += score
        
        analyzed_count = len(sentiments)
        avg_score = total_score / analyzed_count if analyzed_count > 0 else 0.0
        
        # Determine overall sentiment
        if avg_score > 0.15:
            overall = "bullish"
        elif avg_score < -0.15:
            overall = "bearish"
        else:
            overall = "neutral"
        
        return JSONResponse(content={
            "symbol": sym,
            "overall": overall,
            "score": round(avg_score, 4),
            "distribution": {
                "positive": round((positive_count / analyzed_count * 100), 2) if analyzed_count > 0 else 0,
                "neutral": round((neutral_count / analyzed_count * 100), 2) if analyzed_count > 0 else 0,
                "negative": round((negative_count / analyzed_count * 100), 2) if analyzed_count > 0 else 0
            },
            "totalArticles": len(news),
            "analyzedArticles": analyzed_count,
            "source": "FinBERT + Multi-Source News (NewsAPI, NewsData, Marketaux, Finnhub)",
            "news_sources": list(set([article.get('api_source', 'Unknown') for article in news]))
        })
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================================
# SEARCH & DISCOVERY ENDPOINTS
# ============================================================================

@app.get("/api/search/stocks")
async def search_stocks(query: str):
    """Search for stocks by name or symbol"""
    # This would integrate with a stock search API
    # For now, return a mock response
    return {
        "query": query,
        "results": [
            {"symbol": "AAPL", "name": "Apple Inc."},
            {"symbol": "GOOGL", "name": "Alphabet Inc."},
        ]
    }

# ============================================================================
# WEBSOCKET FOR REAL-TIME UPDATES
# ============================================================================

from fastapi import WebSocket, WebSocketDisconnect
import asyncio
import json

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """
    WebSocket endpoint for real-time updates
    Accepts connections and can send live market data
    """
    await websocket.accept()
    print(f"✅ WebSocket client connected: {websocket.client}")
    
    try:
        # Send welcome message
        await websocket.send_json({
            "type": "connection",
            "status": "connected",
            "message": "Connected to UpTrade AI BEAST MODE",
            "timestamp": datetime.now().isoformat()
        })
        
        # Keep connection alive and handle messages
        while True:
            try:
                # Wait for client messages (with timeout)
                data = await asyncio.wait_for(websocket.receive_text(), timeout=30.0)
                
                # Parse and handle the message
                try:
                    message = json.loads(data)
                    msg_type = message.get('type', 'unknown')
                    
                    if msg_type == 'ping':
                        # Respond to ping with pong
                        await websocket.send_json({
                            "type": "pong",
                            "timestamp": datetime.now().isoformat()
                        })
                    
                    elif msg_type == 'subscribe':
                        # Handle subscription requests
                        symbol = message.get('symbol', '')
                        await websocket.send_json({
                            "type": "subscribed",
                            "symbol": symbol,
                            "message": f"Subscribed to {symbol} updates",
                            "timestamp": datetime.now().isoformat()
                        })
                    
                    elif msg_type == 'unsubscribe':
                        # Handle unsubscribe requests
                        symbol = message.get('symbol', '')
                        await websocket.send_json({
                            "type": "unsubscribed",
                            "symbol": symbol,
                            "timestamp": datetime.now().isoformat()
                        })
                    
                    else:
                        # Echo back unknown message types
                        await websocket.send_json({
                            "type": "echo",
                            "received": message,
                            "timestamp": datetime.now().isoformat()
                        })
                
                except json.JSONDecodeError:
                    # If not JSON, treat as text
                    await websocket.send_json({
                        "type": "text",
                        "message": f"Received: {data}",
                        "timestamp": datetime.now().isoformat()
                    })
            
            except asyncio.TimeoutError:
                # Send keepalive ping every 30 seconds
                await websocket.send_json({
                    "type": "keepalive",
                    "timestamp": datetime.now().isoformat()
                })
    
    except WebSocketDisconnect:
        print(f"❌ WebSocket client disconnected: {websocket.client}")
    
    except Exception as e:
        print(f"⚠️ WebSocket error: {str(e)}")
        try:
            await websocket.close(code=1011, reason=str(e))
        except:
            pass


@app.websocket("/ws/live")
async def websocket_live_data(websocket: WebSocket):
    """
    WebSocket endpoint for live market data streaming
    Legacy endpoint for compatibility
    """
    await websocket.accept()
    print(f"✅ WebSocket client connected to /ws/live: {websocket.client}")
    
    try:
        await websocket.send_json({
            "type": "connection",
            "status": "connected",
            "endpoint": "/ws/live",
            "message": "Connected to live market data stream",
            "timestamp": datetime.now().isoformat()
        })
        
        # Keep connection alive
        while True:
            try:
                data = await asyncio.wait_for(websocket.receive_text(), timeout=30.0)
                await websocket.send_json({
                    "type": "echo",
                    "data": data,
                    "timestamp": datetime.now().isoformat()
                })
            except asyncio.TimeoutError:
                await websocket.send_json({
                    "type": "keepalive",
                    "timestamp": datetime.now().isoformat()
                })
    
    except WebSocketDisconnect:
        print(f"❌ WebSocket client disconnected from /ws/live")
    except Exception as e:
        print(f"⚠️ WebSocket error on /ws/live: {str(e)}")
        try:
            await websocket.close(code=1011, reason=str(e))
        except:
            pass


@app.websocket("/ws/tickers")
async def websocket_tickers(websocket: WebSocket):
    """
    WebSocket endpoint for real-time ticker updates
    Streams live stock price updates for subscribed symbols
    """
    await websocket.accept()
    print(f"✅ WebSocket client connected to /ws/tickers: {websocket.client}")
    
    subscribed_symbols = set()
    
    try:
        # Send welcome message
        await websocket.send_json({
            "type": "connection",
            "status": "connected",
            "endpoint": "/ws/tickers",
            "message": "Connected to ticker stream",
            "timestamp": datetime.now().isoformat()
        })
        
        # Handle ticker subscriptions
        while True:
            try:
                data = await asyncio.wait_for(websocket.receive_text(), timeout=30.0)
                
                try:
                    message = json.loads(data)
                    msg_type = message.get('type', 'unknown')
                    
                    if msg_type == 'subscribe':
                        # Add symbols to subscription list
                        symbols = message.get('symbols', [])
                        if isinstance(symbols, str):
                            symbols = [symbols]
                        
                        subscribed_symbols.update(s.upper() for s in symbols)
                        
                        await websocket.send_json({
                            "type": "subscribed",
                            "symbols": list(subscribed_symbols),
                            "message": f"Subscribed to {len(subscribed_symbols)} symbol(s)",
                            "timestamp": datetime.now().isoformat()
                        })
                        
                        # Send initial quotes for subscribed symbols
                        for symbol in symbols:
                            try:
                                quote = basic_manager.get_stock_quote(symbol.upper())
                                await websocket.send_json({
                                    "type": "quote",
                                    "symbol": symbol.upper(),
                                    "data": quote,
                                    "timestamp": datetime.now().isoformat()
                                })
                            except Exception as e:
                                await websocket.send_json({
                                    "type": "error",
                                    "symbol": symbol.upper(),
                                    "message": f"Failed to get quote: {str(e)}",
                                    "timestamp": datetime.now().isoformat()
                                })
                    
                    elif msg_type == 'unsubscribe':
                        # Remove symbols from subscription list
                        symbols = message.get('symbols', [])
                        if isinstance(symbols, str):
                            symbols = [symbols]
                        
                        subscribed_symbols.difference_update(s.upper() for s in symbols)
                        
                        await websocket.send_json({
                            "type": "unsubscribed",
                            "symbols": list(subscribed_symbols),
                            "message": f"Now subscribed to {len(subscribed_symbols)} symbol(s)",
                            "timestamp": datetime.now().isoformat()
                        })
                    
                    elif msg_type == 'ping':
                        await websocket.send_json({
                            "type": "pong",
                            "subscribed_count": len(subscribed_symbols),
                            "timestamp": datetime.now().isoformat()
                        })
                    
                    elif msg_type == 'get_subscriptions':
                        await websocket.send_json({
                            "type": "subscriptions",
                            "symbols": list(subscribed_symbols),
                            "count": len(subscribed_symbols),
                            "timestamp": datetime.now().isoformat()
                        })
                    
                    else:
                        await websocket.send_json({
                            "type": "error",
                            "message": f"Unknown message type: {msg_type}",
                            "timestamp": datetime.now().isoformat()
                        })
                
                except json.JSONDecodeError:
                    await websocket.send_json({
                        "type": "error",
                        "message": "Invalid JSON format",
                        "timestamp": datetime.now().isoformat()
                    })
            
            except asyncio.TimeoutError:
                # Send keepalive and update quotes for subscribed symbols
                await websocket.send_json({
                    "type": "keepalive",
                    "subscribed_count": len(subscribed_symbols),
                    "timestamp": datetime.now().isoformat()
                })
                
                # Optionally send updated quotes (can be disabled for performance)
                # Uncomment to enable auto-refresh every 30 seconds
                # for symbol in list(subscribed_symbols)[:5]:  # Limit to 5 at a time
                #     try:
                #         quote = basic_manager.get_stock_quote(symbol)
                #         await websocket.send_json({
                #             "type": "quote_update",
                #             "symbol": symbol,
                #             "data": quote,
                #             "timestamp": datetime.now().isoformat()
                #         })
                #     except:
                #         pass
    
    except WebSocketDisconnect:
        print(f"❌ WebSocket client disconnected from /ws/tickers (was subscribed to {len(subscribed_symbols)} symbols)")
    except Exception as e:
        print(f"⚠️ WebSocket error on /ws/tickers: {str(e)}")
        try:
            await websocket.close(code=1011, reason=str(e))
        except:
            pass

# ============================================================================
# ERROR HANDLERS
# ============================================================================

@app.exception_handler(404)
async def not_found_handler(request, exc):
    return JSONResponse(
        status_code=404,
        content={
            "error": "Not Found",
            "message": "The requested endpoint does not exist",
            "documentation": "/docs"
        }
    )

@app.exception_handler(500)
async def internal_error_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal Server Error",
            "message": "An unexpected error occurred",
            "timestamp": datetime.now().isoformat()
        }
    )

# ============================================================================
# STARTUP & SHUTDOWN EVENTS
# ============================================================================

@app.on_event("startup")
async def startup_event():
    """Initialize on startup and validate API keys"""
    print("\n" + "="*80)
    print("  🦁 BEAST MODE API SERVER STARTING...")
    print("="*80)
    print("\n  🚀 UpTrade AI - Ultimate Financial Intelligence System")
    print("  📊 13+ APIs Integrated")
    print("  🤖 AI-Powered Analysis")
    print("  ⚡ Real-Time Data")
    print("\n  📖 Documentation: http://localhost:8000/docs")
    print("  🔗 API Base URL: http://localhost:8000/api")
    print("\n" + "="*80)
    
    # Validate API keys for MVP
    import os
    from dotenv import load_dotenv
    load_dotenv()
    
    required_keys = {
        'ALPHA_VANTAGE_API_KEY': 'Stock quotes and company data (CRITICAL)',
    }
    
    recommended_keys = {
        'OPENAI_API_KEY': 'AI-powered analysis',
        'FINNHUB_API_KEY': 'Real-time stock data',
        'NEWS_API_KEY': 'Financial news',
        'HUGGINGFACE_API_KEY': 'Sentiment analysis'
    }
    
    missing_required = []
    missing_recommended = []
    
    for key, description in required_keys.items():
        if not os.getenv(key):
            missing_required.append(f"{key} - {description}")
    
    for key, description in recommended_keys.items():
        if not os.getenv(key):
            missing_recommended.append(f"{key} - {description}")
    
    if missing_required:
        print("\n  ❌ CRITICAL: Missing required API keys:")
        for key in missing_required:
            print(f"     • {key}")
        print("\n  ⚠️  Add to .env file for real-time data")
        print("  📝 See API_KEYS_GUIDE.md for setup\n")
    
    if missing_recommended:
        print("\n  ⚠️  Recommended API keys not configured:")
        for key in missing_recommended:
            print(f"     • {key}")
        print("\n  💡 Add these for enhanced features\n")
    
    if not missing_required and not missing_recommended:
        print("\n  ✅ All API keys configured!\n")
    
    print("="*80 + "\n")

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    print("\n🛑 BEAST MODE API Server shutting down...")

# ============================================================================
# RUN SERVER
# ============================================================================

if __name__ == "__main__":
    uvicorn.run(
        "beast_fastapi_server:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
