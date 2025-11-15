#!/usr/bin/env python3
"""
🧪 Test Improved Chatbot with Intelligent Fallbacks
This tests the enhanced AI chatbot with conversation context and smart fallbacks
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_chatbot_response(prompt, context=None):
    """Test chatbot with a prompt"""
    print(f"\n{'='*70}")
    print(f"🧪 Testing: {prompt}")
    print(f"{'='*70}")
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/ai/analyze",
            json={"prompt": prompt, "context": context or []},
            timeout=30
        )
        
        print(f"\n✅ Status Code: {response.status_code}")
        
        data = response.json()
        print(f"\n📊 Response:")
        print(f"   Source: {data.get('source', 'Unknown')}")
        print(f"   Fallback: {data.get('fallback', False)}")
        
        print(f"\n💬 Message:")
        print(data.get('analysis', data.get('message', 'No response')))
        
        return data
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        return None

def test_sentiment(text):
    """Test sentiment analysis"""
    print(f"\n{'='*70}")
    print(f"📊 Testing Sentiment: {text}")
    print(f"{'='*70}")
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/ai/sentiment",
            json={"text": text},
            timeout=30
        )
        
        print(f"\n✅ Status Code: {response.status_code}")
        
        data = response.json()
        print(f"\n📈 Sentiment Result:")
        print(f"   Sentiment: {data.get('sentiment', 'N/A')}")
        print(f"   Score: {data.get('score', 'N/A')}")
        print(f"   Source: {data.get('source', 'Unknown')}")
        
        return data
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        return None

def main():
    """Run all tests"""
    print("\n" + "="*70)
    print("🚀 UpTrade AI - Improved Chatbot Test Suite")
    print("="*70)
    
    # Test 1: Stock price query
    print("\n\n📌 TEST 1: Stock Price Query")
    test_chatbot_response("What's the current price of Apple stock?")
    
    # Test 2: Sentiment query
    print("\n\n📌 TEST 2: Sentiment Query")
    test_chatbot_response("What's the market sentiment for Tesla?")
    
    # Test 3: Comparison
    print("\n\n📌 TEST 3: Stock Comparison")
    test_chatbot_response("Compare Microsoft and Google")
    
    # Test 4: Technical analysis
    print("\n\n📌 TEST 4: Technical Analysis")
    test_chatbot_response("Show me technical analysis for NVDA")
    
    # Test 5: Forecasting
    print("\n\n📌 TEST 5: Forecasting")
    test_chatbot_response("Predict TSLA price for next week")
    
    # Test 6: Market overview
    print("\n\n📌 TEST 6: Market Overview")
    test_chatbot_response("What's happening in the market today?")
    
    # Test 7: Investment advice
    print("\n\n📌 TEST 7: Investment Advice")
    test_chatbot_response("Should I invest in tech stocks?")
    
    # Test 8: Portfolio management
    print("\n\n📌 TEST 8: Portfolio Question")
    test_chatbot_response("How can I diversify my portfolio?")
    
    # Test 9: General greeting
    print("\n\n📌 TEST 9: General Greeting")
    test_chatbot_response("Hello!")
    
    # Test 10: Conversational follow-up (with context)
    print("\n\n📌 TEST 10: Conversational Follow-up")
    context = [
        {"role": "user", "content": "What's the price of Apple?"},
        {"role": "assistant", "content": "Apple stock is trading around $170."}
    ]
    test_chatbot_response("What about Tesla?", context=context)
    
    # Test 11: Sentiment analysis
    print("\n\n📌 TEST 11: Sentiment Analysis")
    test_sentiment("Tesla stock is soaring today after amazing earnings!")
    
    # Test 12: Negative sentiment
    print("\n\n📌 TEST 12: Negative Sentiment")
    test_sentiment("Market crash fears as inflation hits new high")
    
    print("\n\n" + "="*70)
    print("✅ All tests completed!")
    print("="*70)
    print("\n📝 Summary:")
    print("   - Chatbot should provide intelligent responses even without API keys")
    print("   - Fallback responses should be helpful and informative")
    print("   - Conversation context should be maintained")
    print("   - Multiple query types should be handled gracefully")
    print("\n💡 Open http://localhost:3000 and click the chatbot icon to test the UI!")
    print("="*70 + "\n")

if __name__ == "__main__":
    main()
