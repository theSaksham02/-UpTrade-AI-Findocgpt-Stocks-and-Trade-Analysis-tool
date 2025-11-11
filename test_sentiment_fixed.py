#!/usr/bin/env python3
"""
Test Fixed HuggingFace Sentiment Analysis
Tests the updated FinBERT-Tone model
"""

import sys
from beast_api_manager import BeastAPIManager

def main():
    print("\n" + "=" * 80)
    print("🧠 TESTING FIXED HUGGINGFACE SENTIMENT ANALYSIS")
    print("=" * 80 + "\n")
    
    # Initialize manager
    manager = BeastAPIManager()
    
    # Test texts
    test_texts = [
        "Apple reports record earnings beating analyst expectations significantly.",
        "The company faces challenges with supply chain disruptions and rising costs.",
        "Market remains stable with mixed signals from economic indicators.",
        "Tesla announces groundbreaking AI breakthrough, stock surges 15% in pre-market trading.",
        "Federal Reserve hints at potential interest rate cuts boosting market sentiment."
    ]
    
    print("Analyzing financial sentiment with updated FinBERT-Tone model...\n")
    
    for i, text in enumerate(test_texts, 1):
        print(f"{i}. Text: {text}")
        result = manager.analyze_sentiment_huggingface(text)
        
        if 'error' not in result:
            sentiment = result.get('sentiment', {})
            dominant = result.get('dominant', 'unknown')
            confidence = result.get('confidence', 0)
            source = result.get('source', 'Unknown')
            
            print(f"   ✅ Dominant Sentiment: {dominant.upper()}")
            print(f"   📊 Confidence: {confidence}%")
            print(f"   🔍 Scores: {sentiment}")
            print(f"   📡 Source: {source}")
            
            if 'note' in result:
                print(f"   💡 Note: {result['note']}")
        else:
            print(f"   ❌ Error: {result.get('error')}")
        
        print()
    
    print("=" * 80)
    print("✅ Sentiment Analysis Testing Complete!")
    print("=" * 80 + "\n")

if __name__ == "__main__":
    main()
