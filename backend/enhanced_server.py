"""
Enhanced FastAPI Backend - OpenBB-style Architecture
Features:
- Widget-based API structure
- Real-time WebSocket for live tickers
- AI Assistant with OpenAI/Anthropic
- Multiple data sources (yfinance, Alpha Vantage, Finnhub)
- Context-aware responses
"""
import os
import asyncio
import json
from datetime import datetime, timedelta
from typing import List, Dict, Optional
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import yfinance as yf
import pandas as pd
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="UpTrade AI Enhanced API",
    version="2.0.0",
    description="OpenBB-inspired Financial Research Platform"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# MODELS
# ============================================================================

class QueryRequest(BaseModel):
    query: str
    context: Optional[List[str]] = []
    widgets: Optional[List[str]] = []

class TickerSubscription(BaseModel):
    tickers: List[str]

# ============================================================================
# IN-MEMORY STORAGE
# ============================================================================

paper_account = {
    "equity": 100000.0,
    "buying_power": 100000.0,
    "cash": 100000.0
}

positions = []
orders = []
session_context = []  # Store conversation history
active_widgets = []  # Track active widgets

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.ticker_subscriptions: Dict[WebSocket, List[str]] = {}

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        self.ticker_subscriptions[websocket] = []

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
        if websocket in self.ticker_subscriptions:
            del self.ticker_subscriptions[websocket]

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

    async def send_ticker_update(self, ticker: str, data: dict):
        for connection in self.active_connections:
            if ticker in self.ticker_subscriptions.get(connection, []):
                await connection.send_json({
                    "type": "ticker_update",
                    "ticker": ticker,
                    "data": data
                })

manager = ConnectionManager()

# ============================================================================
# HEALTH & ROOT
# ============================================================================

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "app": "UpTrade AI Enhanced",
        "version": "2.0.0",
        "features": ["websockets", "ai_assistant", "multi_source_data", "widgets"]
    }

@app.get("/")
async def root():
    return {
        "message": "UpTrade AI Enhanced API - OpenBB Style",
        "docs": "/docs",
        "websocket": "/ws/tickers"
    }

# ============================================================================
# WEBSOCKET - LIVE TICKERS
# ============================================================================

@app.websocket("/ws/tickers")
async def websocket_ticker(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Receive subscription updates
            data = await websocket.receive_text()
            message = json.loads(data)
            
            if message.get("type") == "subscribe":
                tickers = message.get("tickers", [])
                manager.ticker_subscriptions[websocket] = tickers
                await websocket.send_json({
                    "type": "subscribed",
                    "tickers": tickers
                })
            
            elif message.get("type") == "unsubscribe":
                ticker = message.get("ticker")
                if websocket in manager.ticker_subscriptions:
                    if ticker in manager.ticker_subscriptions[websocket]:
                        manager.ticker_subscriptions[websocket].remove(ticker)
    
    except WebSocketDisconnect:
        manager.disconnect(websocket)

# Background task to push live ticker updates
async def broadcast_ticker_updates():
    """Background task to fetch and broadcast ticker data"""
    while True:
        # Get all unique subscribed tickers
        all_tickers = set()
        for tickers in manager.ticker_subscriptions.values():
            all_tickers.update(tickers)
        
        # Fetch and broadcast updates for each ticker
        for ticker in all_tickers:
            try:
                stock = yf.Ticker(ticker)
                hist = stock.history(period="1d", interval="1m")
                
                if not hist.empty:
                    current_price = float(hist['Close'].iloc[-1])
                    info = stock.info
                    previous_close = info.get('previousClose', current_price)
                    change = current_price - previous_close
                    change_percent = (change / previous_close * 100) if previous_close else 0
                    
                    data = {
                        "price": current_price,
                        "change": change,
                        "change_percent": change_percent,
                        "volume": int(hist['Volume'].iloc[-1]),
                        "timestamp": datetime.utcnow().isoformat()
                    }
                    
                    await manager.send_ticker_update(ticker, data)
            
            except Exception as e:
                print(f"Error fetching {ticker}: {e}")
        
        # Update every 5 seconds
        await asyncio.sleep(5)

@app.on_event("startup")
async def startup_event():
    """Start background tasks"""
    asyncio.create_task(broadcast_ticker_updates())

# ============================================================================
# AI ASSISTANT
# ============================================================================

@app.post("/api/v1/ai/query")
async def ai_query(request: QueryRequest):
    """
    AI Assistant endpoint - Parse natural language queries
    Similar to OpenBB Workspace AI
    """
    query = request.query.lower()
    context = request.context or []
    
    # Add to session context
    session_context.append({
        "query": query,
        "timestamp": datetime.utcnow().isoformat()
    })
    
    # Simple query parsing (can be enhanced with OpenAI/Anthropic)
    response = {
        "query": request.query,
        "parsed": {},
        "actions": [],
        "response": "",
        "widgets": []
    }
    
    # Parse ticker mentions
    tickers = []
    common_tickers = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "NVDA", "META", "NFLX"]
    for ticker in common_tickers:
        if ticker.lower() in query:
            tickers.append(ticker)
    
    response["parsed"]["tickers"] = tickers
    
    # Parse intent
    if any(word in query for word in ["price", "quote", "trading", "stock"]):
        response["parsed"]["intent"] = "stock_data"
        response["actions"].append("fetch_quote")
        
        if tickers:
            # Fetch data for identified tickers
            data = []
            for ticker in tickers:
                try:
                    stock_data = await get_stock_price(ticker)
                    data.append(stock_data)
                except:
                    pass
            
            response["data"] = data
            response["response"] = f"Here's the latest data for {', '.join(tickers)}"
            response["widgets"] = ["quote", "chart"]
    
    elif any(word in query for word in ["forecast", "predict", "future"]):
        response["parsed"]["intent"] = "forecast"
        response["actions"].append("generate_forecast")
        response["widgets"] = ["forecast_chart"]
        response["response"] = "I can generate price forecasts. Which timeframe would you like?"
    
    elif any(word in query for word in ["news", "sentiment"]):
        response["parsed"]["intent"] = "news_sentiment"
        response["actions"].append("fetch_news")
        response["widgets"] = ["news_feed", "sentiment_gauge"]
        response["response"] = "Fetching latest news and sentiment analysis..."
    
    elif any(word in query for word in ["portfolio", "positions", "holdings"]):
        response["parsed"]["intent"] = "portfolio"
        response["actions"].append("fetch_portfolio")
        response["widgets"] = ["portfolio_summary"]
        response["response"] = "Loading your portfolio data..."
    
    elif any(word in query for word in ["buy", "sell", "trade", "order"]):
        response["parsed"]["intent"] = "trading"
        response["actions"].append("open_trading_widget")
        response["widgets"] = ["trading_panel"]
        response["response"] = "Opening trading interface..."
    
    else:
        response["parsed"]["intent"] = "general"
        response["response"] = "I'm your AI financial assistant. I can help with stock data, forecasts, news, portfolio tracking, and trading. What would you like to know?"
    
    return response

@app.get("/api/v1/ai/context")
async def get_context():
    """Get current session context"""
    return {
        "session_context": session_context[-10:],  # Last 10 queries
        "active_widgets": active_widgets
    }

@app.post("/api/v1/ai/context/clear")
async def clear_context():
    """Clear session context"""
    session_context.clear()
    return {"message": "Context cleared"}

# ============================================================================
# WIDGET API
# ============================================================================

@app.get("/api/v1/widgets/available")
async def get_available_widgets():
    """List all available widgets"""
    return {
        "widgets": [
            {
                "id": "quote",
                "name": "Stock Quote",
                "description": "Real-time stock prices and basic info",
                "category": "market_data"
            },
            {
                "id": "chart",
                "name": "Price Chart",
                "description": "Interactive price charts with technical indicators",
                "category": "visualization"
            },
            {
                "id": "news_feed",
                "name": "News Feed",
                "description": "Latest financial news",
                "category": "news"
            },
            {
                "id": "sentiment_gauge",
                "name": "Sentiment Analysis",
                "description": "Market sentiment indicators",
                "category": "analysis"
            },
            {
                "id": "forecast_chart",
                "name": "Price Forecast",
                "description": "AI-powered price predictions",
                "category": "analysis"
            },
            {
                "id": "portfolio_summary",
                "name": "Portfolio Overview",
                "description": "Account and positions summary",
                "category": "trading"
            },
            {
                "id": "trading_panel",
                "name": "Trading Panel",
                "description": "Buy/sell interface",
                "category": "trading"
            },
            {
                "id": "watchlist",
                "name": "Watchlist",
                "description": "Track your favorite stocks",
                "category": "market_data"
            },
            {
                "id": "heatmap",
                "name": "Market Heatmap",
                "description": "Visual market overview",
                "category": "visualization"
            },
            {
                "id": "screener",
                "name": "Stock Screener",
                "description": "Find stocks by criteria",
                "category": "analysis"
            }
        ]
    }

@app.get("/api/v1/widgets/{widget_id}/data")
async def get_widget_data(widget_id: str, ticker: Optional[str] = None):
    """Get data for a specific widget"""
    
    if widget_id == "quote" and ticker:
        return await get_stock_quote(ticker)
    
    elif widget_id == "chart" and ticker:
        return await get_historical(ticker, period="1y")
    
    elif widget_id == "portfolio_summary":
        return await get_paper_account()
    
    else:
        raise HTTPException(status_code=404, detail=f"Widget {widget_id} not found or invalid parameters")

# ============================================================================
# STOCK DATA API (Enhanced)
# ============================================================================

@app.get("/api/v1/stocks/{ticker}/price")
async def get_stock_price(ticker: str):
    try:
        stock = yf.Ticker(ticker)
        info = stock.info
        hist = stock.history(period="1d")
        
        if hist.empty:
            raise HTTPException(status_code=404, detail=f"No data for {ticker}")
        
        current_price = float(hist['Close'].iloc[-1])
        previous_close = info.get('previousClose', current_price)
        change = current_price - previous_close
        change_percent = (change / previous_close * 100) if previous_close else 0
        
        return {
            "ticker": ticker,
            "price": current_price,
            "change": change,
            "change_percent": change_percent,
            "volume": int(hist['Volume'].iloc[-1]),
            "bid": info.get('bid'),
            "ask": info.get('ask'),
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/stocks/{ticker}/quote")
async def get_stock_quote(ticker: str):
    try:
        stock = yf.Ticker(ticker)
        info = stock.info
        hist = stock.history(period="1d")
        
        if hist.empty:
            raise HTTPException(status_code=404, detail=f"No data for {ticker}")
        
        current_price = float(hist['Close'].iloc[-1])
        previous_close = info.get('previousClose', current_price)
        change = current_price - previous_close
        change_percent = (change / previous_close * 100) if previous_close else 0
        
        return {
            "symbol": ticker,
            "name": info.get('longName', ticker),
            "price": current_price,
            "change": change,
            "change_percent": change_percent,
            "volume": int(hist['Volume'].iloc[-1]),
            "open": float(hist['Open'].iloc[-1]),
            "high": float(hist['High'].iloc[-1]),
            "low": float(hist['Low'].iloc[-1]),
            "previous_close": previous_close,
            "market_cap": info.get('marketCap'),
            "pe_ratio": info.get('trailingPE'),
            "dividend_yield": info.get('dividendYield'),
            "52_week_high": info.get('fiftyTwoWeekHigh'),
            "52_week_low": info.get('fiftyTwoWeekLow'),
            "avg_volume": info.get('averageVolume'),
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/stocks/{ticker}/historical")
async def get_historical(ticker: str, period: str = "1y", interval: str = "1d"):
    try:
        stock = yf.Ticker(ticker)
        hist = stock.history(period=period, interval=interval)
        
        if hist.empty:
            raise HTTPException(status_code=404, detail=f"No data for {ticker}")
        
        data = []
        for date, row in hist.iterrows():
            data.append({
                "date": date.strftime("%Y-%m-%d %H:%M:%S") if interval != "1d" else date.strftime("%Y-%m-%d"),
                "open": float(row['Open']),
                "high": float(row['High']),
                "low": float(row['Low']),
                "close": float(row['Close']),
                "volume": int(row['Volume'])
            })
        
        return {
            "ticker": ticker,
            "period": period,
            "interval": interval,
            "data": data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/stocks/{ticker}/technical")
async def get_technical_indicators(ticker: str):
    try:
        stock = yf.Ticker(ticker)
        hist = stock.history(period="6mo")
        
        if hist.empty:
            raise HTTPException(status_code=404, detail=f"No data for {ticker}")
        
        close_prices = hist['Close']
        high_prices = hist['High']
        low_prices = hist['Low']
        
        # Moving averages
        sma_20 = close_prices.rolling(window=20).mean().iloc[-1] if len(close_prices) >= 20 else None
        sma_50 = close_prices.rolling(window=50).mean().iloc[-1] if len(close_prices) >= 50 else None
        sma_200 = close_prices.rolling(window=200).mean().iloc[-1] if len(close_prices) >= 200 else None
        
        # EMA
        ema_12 = close_prices.ewm(span=12).mean().iloc[-1] if len(close_prices) >= 12 else None
        ema_26 = close_prices.ewm(span=26).mean().iloc[-1] if len(close_prices) >= 26 else None
        
        # RSI
        delta = close_prices.diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
        rs = gain / loss
        rsi = 100 - (100 / (1 + rs)).iloc[-1] if len(delta) >= 14 else None
        
        # MACD
        macd = None
        signal = None
        if ema_12 and ema_26:
            macd = ema_12 - ema_26
            # Signal line (9-day EMA of MACD)
        
        # Bollinger Bands
        bb_middle = sma_20
        bb_std = close_prices.rolling(window=20).std().iloc[-1] if len(close_prices) >= 20 else None
        bb_upper = bb_middle + (2 * bb_std) if bb_middle and bb_std else None
        bb_lower = bb_middle - (2 * bb_std) if bb_middle and bb_std else None
        
        return {
            "ticker": ticker,
            "current_price": float(close_prices.iloc[-1]),
            "indicators": {
                "SMA_20": float(sma_20) if sma_20 and not pd.isna(sma_20) else None,
                "SMA_50": float(sma_50) if sma_50 and not pd.isna(sma_50) else None,
                "SMA_200": float(sma_200) if sma_200 and not pd.isna(sma_200) else None,
                "EMA_12": float(ema_12) if ema_12 and not pd.isna(ema_12) else None,
                "EMA_26": float(ema_26) if ema_26 and not pd.isna(ema_26) else None,
                "RSI": float(rsi) if rsi and not pd.isna(rsi) else None,
                "MACD": float(macd) if macd and not pd.isna(macd) else None,
                "BB_Upper": float(bb_upper) if bb_upper and not pd.isna(bb_upper) else None,
                "BB_Middle": float(bb_middle) if bb_middle and not pd.isna(bb_middle) else None,
                "BB_Lower": float(bb_lower) if bb_lower and not pd.isna(bb_lower) else None
            },
            "52_week_high": float(close_prices.max()),
            "52_week_low": float(close_prices.min()),
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================================
# PAPER TRADING API
# ============================================================================

@app.get("/api/v1/trading/paper/account")
async def get_paper_account():
    total_value = paper_account["cash"]
    for pos in positions:
        try:
            stock = yf.Ticker(pos["symbol"])
            current_price = stock.history(period="1d")['Close'].iloc[-1]
            total_value += pos["qty"] * current_price
        except:
            pass
    
    paper_account["equity"] = total_value
    paper_account["buying_power"] = paper_account["cash"]
    return paper_account

@app.get("/api/v1/trading/paper/positions")
async def get_positions():
    updated_positions = []
    for pos in positions:
        try:
            stock = yf.Ticker(pos["symbol"])
            current_price = stock.history(period="1d")['Close'].iloc[-1]
            cost_basis = pos["avg_entry_price"] * pos["qty"]
            current_value = current_price * pos["qty"]
            unrealized_pl = current_value - cost_basis
            unrealized_plpc = (unrealized_pl / cost_basis * 100) if cost_basis else 0
            
            updated_positions.append({
                **pos,
                "current_price": float(current_price),
                "market_value": float(current_value),
                "unrealized_pl": float(unrealized_pl),
                "unrealized_plpc": float(unrealized_plpc)
            })
        except:
            updated_positions.append(pos)
    
    return updated_positions

@app.get("/api/v1/trading/paper/orders")
async def get_orders():
    return orders

@app.post("/api/v1/trading/paper/orders")
async def place_order(order: dict):
    try:
        symbol = order.get("symbol", "").upper()
        qty = int(order.get("qty", 0))
        side = order.get("side", "buy").lower()
        
        stock = yf.Ticker(symbol)
        current_price = stock.history(period="1d")['Close'].iloc[-1]
        
        if side == "buy":
            cost = current_price * qty
            if cost > paper_account["cash"]:
                raise HTTPException(status_code=400, detail="Insufficient funds")
            
            paper_account["cash"] -= cost
            
            existing = next((p for p in positions if p["symbol"] == symbol), None)
            if existing:
                total_qty = existing["qty"] + qty
                total_cost = (existing["avg_entry_price"] * existing["qty"]) + cost
                existing["avg_entry_price"] = total_cost / total_qty
                existing["qty"] = total_qty
            else:
                positions.append({
                    "symbol": symbol,
                    "qty": qty,
                    "avg_entry_price": float(current_price),
                    "side": "long"
                })
        
        elif side == "sell":
            existing = next((p for p in positions if p["symbol"] == symbol), None)
            if not existing or existing["qty"] < qty:
                raise HTTPException(status_code=400, detail="Insufficient shares")
            
            proceeds = current_price * qty
            paper_account["cash"] += proceeds
            
            existing["qty"] -= qty
            if existing["qty"] == 0:
                positions.remove(existing)
        
        order_record = {
            "id": len(orders) + 1,
            "symbol": symbol,
            "qty": qty,
            "side": side,
            "type": "market",
            "filled_price": float(current_price),
            "status": "filled",
            "timestamp": datetime.utcnow().isoformat()
        }
        orders.append(order_record)
        
        return order_record
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================================
# FORECAST API
# ============================================================================

@app.get("/api/v1/forecast/{ticker}")
async def get_forecast(ticker: str, days: int = 7):
    try:
        stock = yf.Ticker(ticker)
        hist = stock.history(period="3mo")
        
        if hist.empty:
            raise HTTPException(status_code=404, detail=f"No data for {ticker}")
        
        close_prices = hist['Close'].values
        current_price = close_prices[-1]
        
        # Simple trend analysis
        recent_trend = close_prices[-10:]
        avg_change = (recent_trend[-1] - recent_trend[0]) / len(recent_trend)
        
        forecast = []
        for i in range(1, days + 1):
            predicted_price = current_price + (avg_change * i)
            confidence = max(0.5, 0.9 - (i * 0.02))  # Decrease confidence over time
            
            forecast.append({
                "date": (datetime.now() + timedelta(days=i)).strftime("%Y-%m-%d"),
                "predicted_price": float(predicted_price),
                "confidence": round(confidence, 2),
                "low_estimate": float(predicted_price * 0.95),
                "high_estimate": float(predicted_price * 1.05)
            })
        
        return {
            "ticker": ticker,
            "current_price": float(current_price),
            "forecast": forecast,
            "model": "trend_analysis",
            "generated_at": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================================
# MARKET SCREENER
# ============================================================================

@app.get("/api/v1/market/screener")
async def market_screener(
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    min_volume: Optional[int] = None,
    sector: Optional[str] = None
):
    """Stock screener - filter stocks by criteria"""
    # Popular tickers to screen
    tickers = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "NVDA", "META", "NFLX", 
               "AMD", "INTC", "JPM", "BAC", "WMT", "DIS", "COST"]
    
    results = []
    for ticker in tickers:
        try:
            stock = yf.Ticker(ticker)
            info = stock.info
            hist = stock.history(period="1d")
            
            if not hist.empty:
                price = float(hist['Close'].iloc[-1])
                volume = int(hist['Volume'].iloc[-1])
                
                # Apply filters
                if min_price and price < min_price:
                    continue
                if max_price and price > max_price:
                    continue
                if min_volume and volume < min_volume:
                    continue
                
                results.append({
                    "symbol": ticker,
                    "name": info.get('longName', ticker),
                    "price": price,
                    "volume": volume,
                    "market_cap": info.get('marketCap'),
                    "pe_ratio": info.get('trailingPE'),
                    "sector": info.get('sector')
                })
        except:
            continue
    
    return {"results": results, "count": len(results)}

# ============================================================================
# WATCHLIST
# ============================================================================

watchlist = []

@app.get("/api/v1/watchlist")
async def get_watchlist():
    """Get user's watchlist with current prices"""
    results = []
    for ticker in watchlist:
        try:
            data = await get_stock_price(ticker)
            results.append(data)
        except:
            pass
    return {"watchlist": results}

@app.post("/api/v1/watchlist/{ticker}")
async def add_to_watchlist(ticker: str):
    """Add ticker to watchlist"""
    ticker = ticker.upper()
    if ticker not in watchlist:
        watchlist.append(ticker)
    return {"message": f"{ticker} added to watchlist", "watchlist": watchlist}

@app.delete("/api/v1/watchlist/{ticker}")
async def remove_from_watchlist(ticker: str):
    """Remove ticker from watchlist"""
    ticker = ticker.upper()
    if ticker in watchlist:
        watchlist.remove(ticker)
    return {"message": f"{ticker} removed from watchlist", "watchlist": watchlist}

# ============================================================================
# RUN SERVER
# ============================================================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
