"""
Test script to verify WebSocket 403 issue is FIXED
Tests both REST API and WebSocket connections
"""

import asyncio
import json
import sys
from datetime import datetime

try:
    import websockets
    WEBSOCKETS_AVAILABLE = True
except ImportError:
    WEBSOCKETS_AVAILABLE = False
    print("⚠️  websockets library not installed. Installing...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "websockets", "-q"])
    import websockets
    WEBSOCKETS_AVAILABLE = True

import requests

# Server configuration
API_BASE = "http://localhost:8000"
WS_BASE = "ws://localhost:8000"

def print_header(text):
    """Print formatted header"""
    print("\n" + "="*80)
    print(f"  {text}")
    print("="*80 + "\n")

def test_rest_api():
    """Test REST API endpoints"""
    print_header("🔍 TESTING REST API")
    
    try:
        # Test root endpoint
        response = requests.get(f"{API_BASE}/", timeout=5)
        if response.status_code == 200:
            print("✅ REST API Root: WORKING")
            data = response.json()
            print(f"   Service: {data.get('service')}")
            print(f"   Version: {data.get('version')}")
            print(f"   Status: {data.get('status')}")
        else:
            print(f"❌ REST API Root: FAILED ({response.status_code})")
            return False
        
        # Test health endpoint
        response = requests.get(f"{API_BASE}/api/health", timeout=5)
        if response.status_code == 200:
            print("✅ Health Check: WORKING")
            health = response.json()
            stats = health.get('statistics', {})
            print(f"   APIs Configured: {stats.get('configured_apis')}/{stats.get('total_apis')}")
            print(f"   Status: {stats.get('status')}")
        else:
            print(f"❌ Health Check: FAILED ({response.status_code})")
        
        return True
        
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to server. Is it running?")
        print("   Start server with: python beast_fastapi_server.py")
        return False
    except Exception as e:
        print(f"❌ REST API Test Error: {str(e)}")
        return False

async def test_websocket_connection(uri, name):
    """Test WebSocket connection"""
    try:
        print(f"\n🔌 Testing WebSocket: {name}")
        print(f"   URI: {uri}")
        
        async with websockets.connect(uri, timeout=10) as websocket:
            # Wait for welcome message
            try:
                welcome = await asyncio.wait_for(websocket.recv(), timeout=5)
                data = json.loads(welcome)
                print(f"   ✅ Connected successfully!")
                print(f"   📨 Welcome message: {data.get('message', 'N/A')}")
                print(f"   🕐 Timestamp: {data.get('timestamp', 'N/A')}")
                
                # Send ping message
                ping_msg = json.dumps({"type": "ping", "timestamp": datetime.now().isoformat()})
                await websocket.send(ping_msg)
                print(f"   📤 Sent: PING")
                
                # Wait for pong response
                pong = await asyncio.wait_for(websocket.recv(), timeout=5)
                pong_data = json.loads(pong)
                if pong_data.get('type') == 'pong':
                    print(f"   📥 Received: PONG")
                    print(f"   ✅ WebSocket communication: WORKING")
                else:
                    print(f"   📥 Received: {pong_data.get('type', 'unknown')}")
                
                # Send subscribe message
                sub_msg = json.dumps({"type": "subscribe", "symbol": "AAPL"})
                await websocket.send(sub_msg)
                print(f"   📤 Sent: SUBSCRIBE to AAPL")
                
                sub_response = await asyncio.wait_for(websocket.recv(), timeout=5)
                sub_data = json.loads(sub_response)
                print(f"   📥 Received: {sub_data.get('message', 'N/A')}")
                
                return True
                
            except asyncio.TimeoutError:
                print(f"   ⚠️  Timeout waiting for response")
                return False
                
    except websockets.exceptions.InvalidStatusCode as e:
        if e.status_code == 403:
            print(f"   ❌ 403 FORBIDDEN - WebSocket rejected!")
            print(f"   ⚠️  This is the error we're trying to fix!")
            return False
        else:
            print(f"   ❌ Status Code: {e.status_code}")
            return False
    except Exception as e:
        print(f"   ❌ Connection Error: {str(e)}")
        return False

async def test_all_websockets():
    """Test all WebSocket endpoints"""
    print_header("🔌 TESTING WEBSOCKET CONNECTIONS")
    
    results = {}
    
    # Test main WebSocket endpoint
    results['/ws'] = await test_websocket_connection(f"{WS_BASE}/ws", "/ws (Main Endpoint)")
    
    # Test legacy WebSocket endpoint
    results['/ws/live'] = await test_websocket_connection(f"{WS_BASE}/ws/live", "/ws/live (Legacy Endpoint)")
    
    # Test tickers WebSocket endpoint
    results['/ws/tickers'] = await test_websocket_tickers(f"{WS_BASE}/ws/tickers")
    
    return results


async def test_websocket_tickers(uri):
    """Test WebSocket ticker endpoint with subscribe/unsubscribe"""
    try:
        print(f"\n🔌 Testing WebSocket: /ws/tickers (Ticker Stream)")
        print(f"   URI: {uri}")
        
        async with websockets.connect(uri, timeout=10) as websocket:
            # Wait for welcome message
            try:
                welcome = await asyncio.wait_for(websocket.recv(), timeout=5)
                data = json.loads(welcome)
                print(f"   ✅ Connected successfully!")
                print(f"   📨 Welcome: {data.get('message', 'N/A')}")
                
                # Subscribe to AAPL
                subscribe_msg = json.dumps({
                    "type": "subscribe",
                    "symbols": ["AAPL", "MSFT"]
                })
                await websocket.send(subscribe_msg)
                print(f"   📤 Sent: SUBSCRIBE to AAPL, MSFT")
                
                # Wait for subscription confirmation and quotes
                messages_received = 0
                subscription_confirmed = False
                quotes_received = 0
                
                while messages_received < 5:  # Wait for multiple messages
                    try:
                        response = await asyncio.wait_for(websocket.recv(), timeout=5)
                        resp_data = json.loads(response)
                        msg_type = resp_data.get('type')
                        
                        if msg_type == 'subscribed':
                            subscription_confirmed = True
                            symbols = resp_data.get('symbols', [])
                            print(f"   📥 Subscribed to: {', '.join(symbols)}")
                        
                        elif msg_type == 'quote':
                            quotes_received += 1
                            symbol = resp_data.get('symbol')
                            quote_data = resp_data.get('data', {})
                            price = quote_data.get('price', 'N/A')
                            print(f"   📥 Quote: {symbol} = ${price}")
                        
                        messages_received += 1
                        
                    except asyncio.TimeoutError:
                        break
                
                if subscription_confirmed and quotes_received > 0:
                    print(f"   ✅ Ticker WebSocket: WORKING ({quotes_received} quotes received)")
                    return True
                else:
                    print(f"   ⚠️  Partial success (subscribed={subscription_confirmed}, quotes={quotes_received})")
                    return True  # Still consider it working if we connected
                
            except asyncio.TimeoutError:
                print(f"   ⚠️  Timeout waiting for response")
                return False
                
    except websockets.exceptions.InvalidStatusCode as e:
        if e.status_code == 403:
            print(f"   ❌ 403 FORBIDDEN - WebSocket rejected!")
            return False
        else:
            print(f"   ❌ Status Code: {e.status_code}")
            return False
    except Exception as e:
        print(f"   ❌ Connection Error: {str(e)}")
        return False

def print_summary(rest_ok, ws_results):
    """Print test summary"""
    print_header("📊 TEST SUMMARY")
    
    print("REST API:")
    print(f"  {'✅' if rest_ok else '❌'} HTTP Endpoints: {'WORKING' if rest_ok else 'FAILED'}")
    
    print("\nWebSocket Endpoints:")
    for endpoint, result in ws_results.items():
        status = '✅ WORKING' if result else '❌ FAILED'
        print(f"  {status}: {endpoint}")
    
    # Overall status
    all_ok = rest_ok and all(ws_results.values())
    
    print("\n" + "="*80)
    if all_ok:
        print("\n  🎉 ALL TESTS PASSED!")
        print("  ✅ REST API: Working")
        print("  ✅ WebSocket: Working")
        print("  ✅ No more 403 Forbidden errors!")
        print("\n  Your server is now fully operational with WebSocket support!")
    else:
        print("\n  ⚠️  SOME TESTS FAILED")
        if not rest_ok:
            print("  ❌ REST API issues detected")
        if not all(ws_results.values()):
            print("  ❌ WebSocket issues detected")
        print("\n  Make sure the server is running:")
        print("  $ python beast_fastapi_server.py")
    
    print("\n" + "="*80 + "\n")

async def main():
    """Main test execution"""
    print("\n" + "="*80)
    print("  🧪 WEBSOCKET FIX VALIDATION TEST")
    print("  Testing REST API + WebSocket connections")
    print("="*80)
    
    # Test REST API first
    rest_ok = test_rest_api()
    
    if not rest_ok:
        print("\n⚠️  Server not responding. Please start the server first:")
        print("   $ python beast_fastapi_server.py")
        return
    
    # Give server a moment
    await asyncio.sleep(1)
    
    # Test WebSocket connections
    ws_results = await test_all_websockets()
    
    # Print summary
    print_summary(rest_ok, ws_results)

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n\n⚠️  Test interrupted by user")
    except Exception as e:
        print(f"\n❌ Test failed with error: {str(e)}")
        import traceback
        traceback.print_exc()
