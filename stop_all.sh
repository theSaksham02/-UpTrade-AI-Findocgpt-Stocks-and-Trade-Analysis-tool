#!/bin/bash

# 🛑 Stop All UpTrade Services

echo "🛑 Stopping all UpTrade services..."

# Kill processes on specific ports
echo "Stopping Backend (port 8000)..."
lsof -ti:8000 | xargs kill -9 2>/dev/null || echo "No process on port 8000"

echo "Stopping Dashboard (port 3000)..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || echo "No process on port 3000"

echo "Stopping TradeX (port 5173)..."
lsof -ti:5173 | xargs kill -9 2>/dev/null || echo "No process on port 5173"

# Kill any remaining python/node processes
echo "Cleaning up remaining processes..."
pkill -f "beast_fastapi_server.py" 2>/dev/null || true
pkill -f "next dev" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true

echo ""
echo "✅ All services stopped"
echo ""
echo "To start again, run: ./start_all_live.sh"
