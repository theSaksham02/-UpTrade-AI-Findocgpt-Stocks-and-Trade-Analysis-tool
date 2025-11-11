"""
Test Alpha Vantage API Integration
Run this script to verify your Alpha Vantage API key is working correctly
"""

import os
import requests
from dotenv import load_dotenv
from datetime import datetime

# Load environment variables
load_dotenv()

def test_alpha_vantage():
    """Test Alpha Vantage API connection and functionality"""
    
    api_key = os.getenv('ALPHA_VANTAGE_KEY')
    
    print("=" * 70)
    print("🔍 ALPHA VANTAGE API TEST")
    print("=" * 70)
    
    if not api_key:
        print("❌ ERROR: ALPHA_VANTAGE_KEY not found in .env file")
        return False
    
    print(f"✅ API Key Found: {api_key[:8]}...{api_key[-4:]}")
    print()
    
    # Test 1: Global Quote (Real-time Stock Quote)
    print("📊 Test 1: Getting Real-time Stock Quote for AAPL...")
    try:
        url = 'https://www.alphavantage.co/query'
        params = {
            'function': 'GLOBAL_QUOTE',
            'symbol': 'AAPL',
            'apikey': api_key
        }
        
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        if 'Global Quote' in data and data['Global Quote']:
            quote = data['Global Quote']
            print(f"✅ SUCCESS! Retrieved AAPL Stock Data:")
            print(f"   Symbol: {quote.get('01. symbol', 'N/A')}")
            print(f"   Price: ${quote.get('05. price', 'N/A')}")
            print(f"   Change: {quote.get('09. change', 'N/A')} ({quote.get('10. change percent', 'N/A')})")
            print(f"   Volume: {quote.get('06. volume', 'N/A')}")
            print(f"   Last Trading Day: {quote.get('07. latest trading day', 'N/A')}")
        elif 'Note' in data:
            print(f"⚠️  API Limit Warning: {data['Note']}")
            print("   You've hit the free tier limit (25 calls/day)")
            return False
        elif 'Error Message' in data:
            print(f"❌ API Error: {data['Error Message']}")
            return False
        else:
            print(f"❌ Unexpected response format: {data}")
            return False
            
    except Exception as e:
        print(f"❌ ERROR: {e}")
        return False
    
    print()
    
    # Test 2: Company Overview
    print("🏢 Test 2: Getting Company Overview for MSFT...")
    try:
        params = {
            'function': 'OVERVIEW',
            'symbol': 'MSFT',
            'apikey': api_key
        }
        
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        if 'Symbol' in data:
            print(f"✅ SUCCESS! Retrieved MSFT Company Data:")
            print(f"   Company: {data.get('Name', 'N/A')}")
            print(f"   Sector: {data.get('Sector', 'N/A')}")
            print(f"   Industry: {data.get('Industry', 'N/A')}")
            print(f"   Market Cap: ${data.get('MarketCapitalization', 'N/A')}")
            print(f"   P/E Ratio: {data.get('PERatio', 'N/A')}")
            print(f"   52 Week High: ${data.get('52WeekHigh', 'N/A')}")
            print(f"   52 Week Low: ${data.get('52WeekLow', 'N/A')}")
        elif 'Note' in data:
            print(f"⚠️  API Limit Warning: {data['Note']}")
            return False
        else:
            print(f"❌ Unexpected response: {data}")
            return False
            
    except Exception as e:
        print(f"❌ ERROR: {e}")
        return False
    
    print()
    print("=" * 70)
    print("✅ ALL TESTS PASSED! Your Alpha Vantage API is configured correctly!")
    print("=" * 70)
    print()
    print("📝 IMPORTANT NOTES:")
    print("   - Free tier limit: 25 API calls per day")
    print("   - Rate limit: 5 API calls per minute")
    print("   - Data delay: ~15 minutes for real-time quotes")
    print("   - Upgrade at: https://www.alphavantage.co/premium/")
    print()
    
    return True

def test_api_limits():
    """Display API limit information"""
    print("📊 ALPHA VANTAGE FREE TIER LIMITS:")
    print("   Daily Limit: 25 API calls")
    print("   Rate Limit: 5 calls per minute")
    print("   Data Refresh: Every 15 minutes")
    print()
    print("💡 TIP: Use caching to minimize API calls!")
    print()

if __name__ == "__main__":
    test_api_limits()
    success = test_alpha_vantage()
    
    if success:
        print("🚀 You're ready to use Alpha Vantage in UpTrade AI!")
        print("   Run your main application: streamlit run app.py")
    else:
        print("⚠️  There were issues. Please check your API key and try again.")
