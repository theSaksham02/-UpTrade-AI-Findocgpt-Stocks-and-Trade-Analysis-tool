#!/bin/bash

# 🦁 Start UpTrade AI Server and Test WebSocket Fix

echo ""
echo "================================================================================"
echo "  🦁 UpTrade AI - Starting Server and Testing WebSocket Fix"
echo "================================================================================"
echo ""

# Start the server in background
echo "📡 Starting FastAPI server..."
python beast_fastapi_server.py &
SERVER_PID=$!

echo "   Server PID: $SERVER_PID"
echo "   Waiting for server to start..."
sleep 5

# Check if server is running
if kill -0 $SERVER_PID 2>/dev/null; then
    echo "   ✅ Server is running!"
    echo ""
    
    # Run WebSocket test
    echo "🧪 Running WebSocket connection test..."
    echo ""
    python test_websocket_fixed.py
    
    echo ""
    echo "================================================================================"
    echo "  Server is still running in background (PID: $SERVER_PID)"
    echo "  To stop: kill $SERVER_PID"
    echo "  API Docs: http://localhost:8000/docs"
    echo "================================================================================"
    echo ""
    
else
    echo "   ❌ Server failed to start"
    exit 1
fi
