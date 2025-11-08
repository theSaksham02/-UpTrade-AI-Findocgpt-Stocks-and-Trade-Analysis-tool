#!/bin/bash

# UpTrade AI - Start Script
# Runs both backend and frontend servers simultaneously

echo "🚀 Starting UpTrade AI..."
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Python virtual environment exists
if [ ! -d ".venv" ]; then
    echo -e "${YELLOW}⚠️  Virtual environment not found. Creating...${NC}"
    python3 -m venv .venv
fi

# Activate virtual environment
echo -e "${BLUE}📦 Activating Python environment...${NC}"
source .venv/bin/activate

# Install Python dependencies if needed
if ! python -c "import fastapi" 2>/dev/null; then
    echo -e "${YELLOW}📥 Installing Python dependencies...${NC}"
    pip install -q fastapi uvicorn websockets yfinance pandas numpy
fi

# Check if node_modules exists
if [ ! -d "frontend/node_modules" ]; then
    echo -e "${YELLOW}📥 Installing frontend dependencies...${NC}"
    cd frontend && npm install && cd ..
fi

echo -e "${GREEN}✅ Dependencies ready!${NC}"
echo "================================"
echo -e "${BLUE}🔧 Starting servers...${NC}"
echo ""
echo -e "${GREEN}Backend:${NC}  http://localhost:8000"
echo -e "${GREEN}Frontend:${NC} http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all servers"
echo "================================"
echo ""

# Run both servers simultaneously
# Backend runs in background, frontend in foreground
cd backend && python enhanced_server.py &
BACKEND_PID=$!

cd ../frontend && npm run dev &
FRONTEND_PID=$!

# Trap Ctrl+C to kill both processes
trap "echo -e '\n${RED}🛑 Stopping servers...${NC}'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM

# Wait for both processes
wait
