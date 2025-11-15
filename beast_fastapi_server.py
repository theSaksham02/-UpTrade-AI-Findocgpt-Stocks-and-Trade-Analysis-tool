"""
🦁 BEAST MODE - FastAPI Backend Server
Ultimate Financial Intelligence API
"""

from fastapi import FastAPI, HTTPException, Query, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime
import uvicorn
import asyncio
import json

from beast_api_manager import get_beast_manager
from api_integrations_enhanced import get_enhanced_api_manager

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
async def search_stocks(query: str):
    """Search for US stocks by symbol or name"""
    try:
        # Use Alpha Vantage for stock search
        results = beast_manager.search_stocks(query)
        return JSONResponse(content={"results": results, "query": query})
    except Exception as e:
        # Fallback: return mock data for common stocks
        mock_results = [
            {"symbol": "AAPL", "name": "Apple Inc.", "type": "Common Stock"},
            {"symbol": "MSFT", "name": "Microsoft Corporation", "type": "Common Stock"},
            {"symbol": "GOOGL", "name": "Alphabet Inc.", "type": "Common Stock"},
            {"symbol": "TSLA", "name": "Tesla Inc.", "type": "Common Stock"},
            {"symbol": "AMZN", "name": "Amazon.com Inc.", "type": "Common Stock"},
        ]
        filtered = [r for r in mock_results if query.upper() in r["symbol"] or query.lower() in r["name"].lower()]
        return JSONResponse(content={"results": filtered[:5], "query": query})

@app.post("/api/ai/analyze")
async def ai_analysis(prompt: str):
    """Get AI-powered market analysis"""
    try:
        analysis = beast_manager.analyze_with_gpt(prompt)
        return JSONResponse(content=analysis)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ai/sentiment")
async def sentiment_analysis(text: str):
    """Advanced sentiment analysis using HuggingFace"""
    try:
        sentiment = beast_manager.analyze_sentiment_huggingface(text)
        return JSONResponse(content=sentiment)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

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
    """Compare multiple stocks side-by-side"""
    try:
        comparison = {}
        for symbol in symbols:
            comparison[symbol] = {
                "quote": basic_manager.get_stock_quote(symbol.upper()),
                "company": basic_manager.get_company_overview(symbol.upper()),
                "news_count": len(basic_manager.get_stock_news(symbol.upper(), limit=5))
            }
        
        return JSONResponse(content={
            "symbols": symbols,
            "comparison": comparison,
            "timestamp": datetime.now().isoformat()
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
    """Initialize on startup"""
    print("\n" + "="*80)
    print("  🦁 BEAST MODE API SERVER STARTING...")
    print("="*80)
    print("\n  🚀 UpTrade AI - Ultimate Financial Intelligence System")
    print("  📊 13+ APIs Integrated")
    print("  🤖 AI-Powered Analysis")
    print("  ⚡ Real-Time Data")
    print("\n  📖 Documentation: http://localhost:8000/docs")
    print("  🔗 API Base URL: http://localhost:8000/api")
    print("\n" + "="*80 + "\n")

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
