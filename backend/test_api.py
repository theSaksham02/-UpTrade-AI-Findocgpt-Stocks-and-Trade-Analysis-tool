#!/usr/bin/env python3
"""
Comprehensive test script for UpTrade AI Backend API.
Tests all 31 endpoints to verify they are working correctly.
"""
import asyncio
import httpx
import sys

BASE_URL = "http://localhost:8000"

async def test_all_endpoints():
    """Test all API endpoints."""
    async with httpx.AsyncClient() as client:
        tests = []
        
        # System endpoints
        tests.append(("GET", "/health", "Health check"))
        tests.append(("GET", "/", "Root endpoint"))
        
        # Stock endpoints
        tests.append(("GET", "/api/v1/stocks/AAPL/price", "Stock price"))
        tests.append(("GET", "/api/v1/stocks/AAPL/history", "Stock history"))
        tests.append(("GET", "/api/v1/stocks/AAPL/fundamentals", "Stock fundamentals"))
        tests.append(("GET", "/api/v1/stocks/search?query=apple", "Stock search"))
        
        # News endpoints
        tests.append(("GET", "/api/v1/news/latest", "Latest news"))
        tests.append(("GET", "/api/v1/news/ticker/AAPL", "News by ticker"))
        tests.append(("GET", "/api/v1/news/trending", "Trending news"))
        tests.append(("POST", "/api/v1/news/search", "News search", {"query": "market"}))
        
        # Sentiment endpoints
        tests.append(("GET", "/api/v1/sentiment/AAPL", "Sentiment"))
        tests.append(("GET", "/api/v1/sentiment/trending", "Trending sentiment"))
        tests.append(("GET", "/api/v1/sentiment/social/AAPL", "Social mentions"))
        
        # Forecast endpoints
        tests.append(("POST", "/api/v1/forecast/AAPL", "Create forecast", {"ticker": "AAPL", "horizon_days": 30}))
        tests.append(("GET", "/api/v1/forecast/AAPL/latest", "Latest forecast"))
        tests.append(("GET", "/api/v1/forecast/performance", "Model performance"))
        
        # Portfolio endpoints
        tests.append(("POST", "/api/v1/portfolio", "Create portfolio", {"name": "Test", "initial_value": 10000}))
        tests.append(("GET", "/api/v1/portfolio/1", "Get portfolio"))
        tests.append(("GET", "/api/v1/portfolio/1/performance", "Portfolio performance"))
        tests.append(("POST", "/api/v1/portfolio/1/optimize", "Optimize portfolio", {"risk_tolerance": "moderate"}))
        
        # Trading endpoints
        tests.append(("POST", "/api/v1/trading/order", "Create order", {
            "portfolio_id": 1, "ticker": "AAPL", "order_type": "market",
            "side": "buy", "quantity": 10
        }))
        tests.append(("GET", "/api/v1/trading/positions/1", "Get positions"))
        tests.append(("GET", "/api/v1/trading/history/1", "Trade history"))
        tests.append(("GET", "/api/v1/trading/leaderboard", "Leaderboard"))
        
        # Filing endpoints
        tests.append(("GET", "/api/v1/filings/search", "Search filings"))
        tests.append(("GET", "/api/v1/filings/1", "Get filing"))
        tests.append(("GET", "/api/v1/filings/latest", "Latest filings"))
        
        # Social endpoints
        tests.append(("GET", "/api/v1/social/trending", "Social trending"))
        tests.append(("GET", "/api/v1/social/ticker/AAPL", "Social by ticker"))
        
        # Q&A endpoints
        tests.append(("POST", "/api/v1/qa/ask", "Ask question", {"question": "What is the revenue?"}))
        tests.append(("GET", "/api/v1/qa/history", "Q&A history"))
        
        # Run tests
        passed = 0
        failed = 0
        
        print(f"\n{'='*80}")
        print(f"Testing {len(tests)} endpoints...")
        print(f"{'='*80}\n")
        
        for test in tests:
            method = test[0]
            path = test[1]
            description = test[2]
            data = test[3] if len(test) > 3 else None
            
            try:
                if method == "GET":
                    response = await client.get(f"{BASE_URL}{path}")
                else:
                    response = await client.post(f"{BASE_URL}{path}", json=data)
                
                if response.status_code == 200:
                    print(f"✅ {method:4} {path:45} - {description}")
                    passed += 1
                else:
                    print(f"❌ {method:4} {path:45} - {description} (Status: {response.status_code})")
                    failed += 1
            except Exception as e:
                print(f"❌ {method:4} {path:45} - {description} (Error: {str(e)[:40]})")
                failed += 1
        
        print(f"\n{'='*80}")
        print(f"Results: {passed} passed, {failed} failed out of {len(tests)} tests")
        print(f"{'='*80}\n")
        
        return failed == 0

if __name__ == "__main__":
    success = asyncio.run(test_all_endpoints())
    sys.exit(0 if success else 1)
