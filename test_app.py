#!/usr/bin/env python3
"""
Comprehensive test script for FinDocGPT Application
Tests frontend, backend, and core functionality
"""
import sys
import requests
from datetime import datetime, timedelta
from forecasting_model import fetch_stock_data, train_and_forecast
from investment_strategy import generate_recommendation
from anomaly_detection import detect_volume_anomalies

def print_header(title):
    """Print a formatted header"""
    print("\n" + "="*60)
    print(f"  {title}")
    print("="*60)

def test_dependencies():
    """Test if all required dependencies are installed"""
    print_header("Testing Dependencies")
    
    try:
        import streamlit
        print("✅ Streamlit installed")
    except ImportError:
        print("❌ Streamlit not installed")
        return False
    
    try:
        import pandas
        print("✅ Pandas installed")
    except ImportError:
        print("❌ Pandas not installed")
        return False
    
    try:
        import yfinance
        print("✅ yfinance installed")
    except ImportError:
        print("❌ yfinance not installed")
        return False
    
    try:
        from google import generativeai
        print("✅ Google Generative AI installed")
    except ImportError:
        print("❌ Google Generative AI not installed")
        return False
    
    return True

def test_streamlit_server():
    """Test if Streamlit server is running"""
    print_header("Testing Streamlit Server")
    
    try:
        response = requests.get("http://localhost:8502", timeout=5)
        if response.status_code == 200:
            print("✅ Streamlit server is running on port 8502")
            return True
        else:
            print(f"⚠️  Streamlit server responded with status {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Streamlit server is not responding: {e}")
        return False

def test_react_frontend():
    """Test if React frontend is running"""
    print_header("Testing React Frontend")
    
    # Try both port 8080 and 8081
    ports = [8080, 8081]
    for port in ports:
        try:
            response = requests.get(f"http://localhost:{port}", timeout=5)
            if response.status_code == 200:
                print(f"✅ React frontend is running on port {port}")
                return True
        except requests.exceptions.RequestException:
            continue
    
    print("❌ React frontend is not responding on ports 8080 or 8081")
    print("   (This is OK if only testing Streamlit backend)")
    return False

def test_stock_data_fetching():
    """Test stock data fetching functionality"""
    print_header("Testing Stock Data Fetching")
    
    try:
        ticker = "AAPL"
        end_date = datetime.now().date()
        start_date = end_date - timedelta(days=30)
        
        print(f"Fetching data for {ticker} from {start_date} to {end_date}")
        data = fetch_stock_data(ticker, start_date, end_date)
        
        if data is not None and not data.empty:
            print(f"✅ Stock data fetch PASSED - Got {len(data)} data points")
            latest_price = float(data.iloc[-1])
            print(f"   Latest close price: ${latest_price:.2f}")
            return True, data
        else:
            print("❌ Stock data fetch FAILED - No data returned")
            return False, None
    except Exception as e:
        print(f"❌ Stock data fetch ERROR: {e}")
        return False, None

def test_forecasting():
    """Test stock price forecasting"""
    print_header("Testing Forecasting Model")
    
    try:
        ticker = "AAPL"
        end_date = datetime.now().date()
        start_date = end_date - timedelta(days=90)
        
        data = fetch_stock_data(ticker, start_date, end_date)
        
        if data is not None and not data.empty:
            print(f"Training ARIMA model for {ticker}...")
            forecast_result = train_and_forecast(data, forecast_days=7)
            
            if forecast_result is not None:
                print("✅ Forecasting PASSED")
                print(f"   7-day forecast available")
                return True
            else:
                print("❌ Forecasting FAILED - No forecast generated")
                return False
        else:
            print("❌ Forecasting FAILED - No data for training")
            return False
    except Exception as e:
        print(f"❌ Forecasting ERROR: {e}")
        return False

def test_investment_strategy():
    """Test investment recommendation generation"""
    print_header("Testing Investment Strategy")
    
    try:
        ticker = "AAPL"
        end_date = datetime.now().date()
        start_date = end_date - timedelta(days=90)
        
        data = fetch_stock_data(ticker, start_date, end_date)
        
        if data is not None and not data.empty:
            print(f"Generating recommendation for {ticker}...")
            # Generate forecast first
            forecast_result = train_and_forecast(data, forecast_days=7)
            if forecast_result is None:
                print("❌ Investment strategy FAILED - Could not generate forecast")
                return False
            recommendation, reason, metrics = generate_recommendation(data, forecast_result)
            
            if recommendation:
                print("✅ Investment strategy PASSED")
                print(f"   Recommendation: {recommendation}")
                print(f"   Reason: {reason[:100]}...")
                return True
            else:
                print("❌ Investment strategy FAILED - No recommendation generated")
                return False
        else:
            print("❌ Investment strategy FAILED - No data available")
            return False
    except Exception as e:
        print(f"❌ Investment strategy ERROR: {e}")
        return False

def test_anomaly_detection():
    """Test volume anomaly detection"""
    print_header("Testing Anomaly Detection")
    
    try:
        ticker = "AAPL"
        end_date = datetime.now().date()
        start_date = end_date - timedelta(days=60)
        
        import yfinance as yf
        data = yf.download(ticker, start=start_date, end=end_date, progress=False)
        
        if not data.empty:
            print(f"Detecting anomalies for {ticker}...")
            anomalies = detect_volume_anomalies(data)
            
            if anomalies is not None:
                print("✅ Anomaly detection PASSED")
                print(f"   Detected {len(anomalies)} anomalies")
                return True
            else:
                print("⚠️  Anomaly detection completed with no anomalies")
                return True
        else:
            print("❌ Anomaly detection FAILED - No data available")
            return False
    except Exception as e:
        print(f"❌ Anomaly detection ERROR: {e}")
        return False

def main():
    """Run all tests"""
    print("\n🧪 FinDocGPT Application Test Suite")
    print(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
    
    results = {}
    
    # Run tests
    results['dependencies'] = test_dependencies()
    results['streamlit'] = test_streamlit_server()
    results['react'] = test_react_frontend()
    results['stock_data'] = test_stock_data_fetching()[0]
    results['forecasting'] = test_forecasting()
    results['strategy'] = test_investment_strategy()
    results['anomaly'] = test_anomaly_detection()
    
    # Print summary
    print_header("Test Summary")
    total = len(results)
    passed = sum(1 for v in results.values() if v)
    
    for test, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} - {test.replace('_', ' ').title()}")
    
    print(f"\n📊 Overall: {passed}/{total} tests passed ({passed/total*100:.1f}%)")
    
    if passed == total:
        print("\n🎉 All tests passed!")
        return 0
    else:
        print(f"\n⚠️  {total - passed} test(s) failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())
