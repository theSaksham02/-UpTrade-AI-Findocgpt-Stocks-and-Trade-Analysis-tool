"""
Simplified FastAPI Backend - Working Version
Uses only installed dependencies (yfinance, fastapi, uvicorn)
"""
import asyncio
from datetime import datetime, timedelta
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import yfinance as yf
import pandas as pd

app = FastAPI(
    title="UpTrade AI API",
    version="1.0.0",
    description="Financial trading platform API"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://localhost:8080", "http://localhost:8081"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple in-memory paper trading account
paper_account = {
    "equity": 100000.0,
    "buying_power": 100000.0,
    "cash": 100000.0
}

positions = []
orders = []

@app.get("/health")
async def health():
    return {"status": "healthy", "app": "UpTrade AI", "version": "1.0.0"}

@app.get("/")
async def root():
    return {"message": "UpTrade AI API", "docs": "/docs"}

# Stock API
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
            "price": current_price,
            "change": change,
            "change_percent": change_percent,
            "volume": int(hist['Volume'].iloc[-1]),
            "open": float(hist['Open'].iloc[-1]),
            "high": float(hist['High'].iloc[-1]),
            "low": float(hist['Low'].iloc[-1]),
            "market_cap": info.get('marketCap', 'N/A'),
            "pe_ratio": info.get('trailingPE', 'N/A'),
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/stocks/{ticker}/historical")
async def get_historical(ticker: str, period: str = "1y"):
    try:
        stock = yf.Ticker(ticker)
        hist = stock.history(period=period)
        
        if hist.empty:
            raise HTTPException(status_code=404, detail=f"No data for {ticker}")
        
        data = []
        for date, row in hist.iterrows():
            data.append({
                "date": date.strftime("%Y-%m-%d"),
                "open": float(row['Open']),
                "high": float(row['High']),
                "low": float(row['Low']),
                "close": float(row['Close']),
                "volume": int(row['Volume'])
            })
        
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/stocks/{ticker}/technical")
async def get_technical_indicators(ticker: str):
    try:
        stock = yf.Ticker(ticker)
        hist = stock.history(period="3mo")
        
        if hist.empty:
            raise HTTPException(status_code=404, detail=f"No data for {ticker}")
        
        # Calculate simple indicators
        close_prices = hist['Close']
        
        # Moving averages
        sma_20 = close_prices.rolling(window=20).mean().iloc[-1] if len(close_prices) >= 20 else None
        sma_50 = close_prices.rolling(window=50).mean().iloc[-1] if len(close_prices) >= 50 else None
        
        # RSI
        delta = close_prices.diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
        rs = gain / loss
        rsi = 100 - (100 / (1 + rs)).iloc[-1] if len(delta) >= 14 else None
        
        return {
            "SMA_20": float(sma_20) if sma_20 and not pd.isna(sma_20) else None,
            "SMA_50": float(sma_50) if sma_50 and not pd.isna(sma_50) else None,
            "RSI": float(rsi) if rsi and not pd.isna(rsi) else None,
            "current_price": float(close_prices.iloc[-1]),
            "52_week_high": float(close_prices.max()),
            "52_week_low": float(close_prices.min())
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Paper Trading API
@app.get("/api/v1/trading/paper/account")
async def get_paper_account():
    # Update equity based on positions
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
    # Update position values
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
        
        # Get current price
        stock = yf.Ticker(symbol)
        current_price = stock.history(period="1d")['Close'].iloc[-1]
        
        if side == "buy":
            cost = current_price * qty
            if cost > paper_account["cash"]:
                raise HTTPException(status_code=400, detail="Insufficient funds")
            
            paper_account["cash"] -= cost
            
            # Add or update position
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
        
        # Record order
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

@app.post("/api/v1/trading/paper/reset")
async def reset_account():
    global paper_account, positions, orders
    paper_account = {
        "equity": 100000.0,
        "buying_power": 100000.0,
        "cash": 100000.0
    }
    positions.clear()
    orders.clear()
    return {"message": "Account reset successfully", "account": paper_account}

@app.get("/api/v1/trading/paper/history")
async def get_trade_history():
    return orders

# Forecast API (simplified)
@app.get("/api/v1/forecast/{ticker}")
async def get_forecast(ticker: str, days: int = 7):
    try:
        stock = yf.Ticker(ticker)
        hist = stock.history(period="1mo")
        
        if hist.empty:
            raise HTTPException(status_code=404, detail=f"No data for {ticker}")
        
        # Simple linear extrapolation
        close_prices = hist['Close'].values
        current_price = close_prices[-1]
        avg_change = (close_prices[-1] - close_prices[0]) / len(close_prices)
        
        forecast = []
        for i in range(1, days + 1):
            forecast.append({
                "date": (datetime.now() + timedelta(days=i)).strftime("%Y-%m-%d"),
                "predicted_price": float(current_price + (avg_change * i)),
                "confidence": 0.7
            })
        
        return {
            "ticker": ticker,
            "current_price": float(current_price),
            "forecast": forecast,
            "model": "simple_trend"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
