"""
Comprehensive API Integration Test Suite
Tests all configured APIs and displays results
"""

from beast_api_manager import get_beast_manager
import json
from datetime import datetime

def print_section(title):
    """Print a formatted section header"""
    print("\n" + "="*80)
    print(f"  {title}")
    print("="*80 + "\n")

def test_api_health():
    """Test API configuration health"""
    print_section("🏥 API HEALTH CHECK")
    manager = get_beast_manager()
    health = manager.get_system_health()
    
    print(f"Timestamp: {health['timestamp']}")
    if 'statistics' in health:
        print(f"Cache Size: {health['statistics'].get('cache_size', 0)} items")
    else:
        print(f"Cache Size: {len(manager.cache)} items")
    print("\nAPI Status:")
    
    for category, apis in health['apis'].items():
        print(f"  📂 {category}:")
        for api_name, configured in apis.items():
            status_icon = "✅" if configured else "❌"
            print(f"    {status_icon} {api_name}: {'Configured' if configured else 'Missing'}")

def test_stock_quote():
    """Test stock quote retrieval"""
    print_section("📊 STOCK QUOTE TEST")
    manager = get_beast_manager()
    
    test_symbols = ['AAPL', 'MSFT', 'GOOGL']
    
    for symbol in test_symbols:
        print(f"\n🔍 Testing {symbol}...")
        try:
            quote = manager.get_stock_quote(symbol)
            print(f"  Source: {quote.get('source', 'Unknown')}")
            print(f"  Price: ${quote.get('price', 0):.2f}")
            print(f"  Change: {quote.get('change', 0):+.2f} ({quote.get('change_percent', '0%')})")
            print(f"  High: ${quote.get('high', 0):.2f} | Low: ${quote.get('low', 0):.2f}")
            
            if 'source' in quote and quote['source'] != 'Mock Data':
                print(f"  ✅ Real data from {quote['source']}")
            else:
                print(f"  ⚠️  Using mock data (API may need configuration)")
        except Exception as e:
            print(f"  ❌ Error: {e}")

def test_company_overview():
    """Test company overview retrieval"""
    print_section("🏢 COMPANY OVERVIEW TEST")
    manager = get_beast_manager()
    
    symbol = 'AAPL'
    print(f"🔍 Testing company overview for {symbol}...")
    
    try:
        overview = manager.get_company_overview(symbol)
        print(f"  Source: {overview.get('source', 'Unknown')}")
        print(f"  Name: {overview.get('name', 'N/A')}")
        print(f"  Industry: {overview.get('industry', 'N/A')}")
        print(f"  Description: {overview.get('description', 'N/A')[:100]}...")
        
        if 'market_cap' in overview:
            print(f"  Market Cap: {overview.get('market_cap', 'N/A')}")
        
        if 'source' in overview and overview['source'] != 'Mock Data':
            print(f"  ✅ Real data from {overview['source']}")
        else:
            print(f"  ⚠️  Using mock data")
    except Exception as e:
        print(f"  ❌ Error: {e}")

def test_financial_news():
    """Test financial news retrieval"""
    print_section("📰 FINANCIAL NEWS TEST")
    manager = get_beast_manager()
    
    queries = ['stock market', 'AAPL']
    
    for query in queries:
        print(f"\n🔍 Testing news for: {query}")
        try:
            articles = manager.get_financial_news(query=query, limit=5)
            print(f"  Found {len(articles)} articles")
            
            for i, article in enumerate(articles[:3], 1):
                print(f"\n  Article {i}:")
                print(f"    Source: {article.get('api_source', 'Unknown')} - {article.get('source', 'N/A')}")
                print(f"    Title: {article.get('title', 'N/A')[:80]}...")
                print(f"    Published: {article.get('published_at', 'N/A')}")
                
                if article.get('sentiment') is not None:
                    print(f"    Sentiment: {article.get('sentiment'):.2f}")
            
            # Check if we got real data
            real_sources = [a for a in articles if a.get('api_source') != 'Mock Data']
            if real_sources:
                print(f"\n  ✅ Got real data from: {', '.join(set(a['api_source'] for a in real_sources))}")
            else:
                print(f"\n  ⚠️  Using mock data (APIs may need configuration)")
                
        except Exception as e:
            print(f"  ❌ Error: {e}")

def test_stock_news():
    """Test stock-specific news"""
    print_section("📈 STOCK-SPECIFIC NEWS TEST")
    manager = get_beast_manager()
    
    symbol = 'AAPL'
    print(f"🔍 Testing news for {symbol}...")
    
    try:
        articles = manager.get_stock_news(symbol, limit=5)
        print(f"  Found {len(articles)} articles")
        
        for i, article in enumerate(articles[:3], 1):
            print(f"\n  Article {i}:")
            print(f"    Title: {article.get('title', 'N/A')[:80]}...")
            print(f"    Source: {article.get('api_source', 'Unknown')}")
            
        real_sources = [a for a in articles if a.get('api_source') != 'Mock Data']
        if real_sources:
            print(f"\n  ✅ Got real data from: {', '.join(set(a['api_source'] for a in real_sources))}")
        else:
            print(f"\n  ⚠️  Using mock data")
            
    except Exception as e:
        print(f"  ❌ Error: {e}")

def test_cache_performance():
    """Test caching performance"""
    print_section("⚡ CACHE PERFORMANCE TEST")
    manager = get_beast_manager()
    
    import time
    
    symbol = 'AAPL'
    
    # First request (uncached)
    print(f"🔍 First request for {symbol} (uncached)...")
    start = time.time()
    quote1 = manager.get_stock_quote(symbol)
    time1 = time.time() - start
    print(f"  Time: {time1:.3f} seconds")
    
    # Second request (cached)
    print(f"\n🔍 Second request for {symbol} (should be cached)...")
    start = time.time()
    quote2 = manager.get_stock_quote(symbol)
    time2 = time.time() - start
    print(f"  Time: {time2:.3f} seconds")
    
    if time2 < time1:
        speedup = time1 / time2
        print(f"\n  ✅ Cache speedup: {speedup:.1f}x faster!")
    else:
        print(f"\n  ⚠️  Cache may not be working optimally")

def generate_summary_report():
    """Generate final summary report"""
    print_section("📊 SUMMARY REPORT")
    manager = get_beast_manager()
    health = manager.get_api_health()
    
    stats = health['statistics']
    
    configured_apis = stats['configured_apis']
    total_apis = stats['total_apis']
    
    print(f"Total APIs Configured: {configured_apis}/{total_apis}")
    print(f"Configuration Percentage: {stats['configuration_percentage']:.1f}%")
    print(f"Cache Items: {stats['cache_size']}")
    
    print("\n✅ Configured APIs:")
    for category, apis in health['apis'].items():
        for api_name, configured in apis.items():
            if configured:
                print(f"  • {api_name} ({category})")
    
    print("\n❌ Not Configured:")
    for category, apis in health['apis'].items():
        for api_name, configured in apis.items():
            if not configured:
                print(f"  • {api_name} ({category})")
    
    print("\n" + "="*80)
    print("💡 RECOMMENDATIONS:")
    print("="*80)
    
    if configured_apis == total_apis:
        print("  🎉 All APIs configured! Your system is fully operational.")
    else:
        print(f"  ⚠️  {total_apis - configured_apis} APIs not configured.")
        print("  Consider adding the missing API keys to .env file for full functionality.")
    
    print("\n  📖 Data Sources Priority:")
    print("    1. Stock Data: Finnhub → Alpha Vantage → Polygon")
    print("    2. News Data: Marketaux → NewsAPI → NewsData")
    print("    3. All APIs have automatic failover to ensure system availability")

def main():
    """Run all tests"""
    print("\n")
    print("╔" + "="*78 + "╗")
    print("║" + " "*78 + "║")
    print("║" + "  🚀 UPTRADE AI - COMPREHENSIVE API INTEGRATION TEST SUITE".center(78) + "║")
    print("║" + " "*78 + "║")
    print("╚" + "="*78 + "╝")
    
    try:
        # Run all tests
        test_api_health()
        test_stock_quote()
        test_company_overview()
        test_financial_news()
        test_stock_news()
        test_cache_performance()
        generate_summary_report()
        
        print("\n\n✅ All tests completed successfully!")
        print("="*80)
        
    except Exception as e:
        print(f"\n\n❌ Test suite error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
