#!/bin/bash

# 🚀 UpTrade Live Data Quick Start
# Starts all services with 100% live data integration

set -e

echo "🦁 UpTrade BEAST MODE - Starting All Services"
echo "=============================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if backend directory exists
if [ ! -d "backend" ]; then
    echo -e "${RED}❌ Backend directory not found${NC}"
    echo "Please run this script from the project root"
    exit 1
fi

# Check if frontend directory exists
if [ ! -d "frontend" ]; then
    echo -e "${RED}❌ Frontend directory not found${NC}"
    exit 1
fi

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        return 0
    else
        return 1
    fi
}

# Check API keys
echo -e "${YELLOW}🔑 Checking API Keys...${NC}"
if [ ! -f ".env" ]; then
    echo -e "${RED}❌ .env file not found${NC}"
    echo "Please create .env file with your API keys"
    echo "See .env.example for required keys"
    exit 1
else
    echo -e "${GREEN}✅ .env file found${NC}"
fi

# Kill existing processes
echo ""
echo -e "${YELLOW}🧹 Cleaning up existing processes...${NC}"

if check_port 8000; then
    echo "Killing process on port 8000..."
    lsof -ti:8000 | xargs kill -9 2>/dev/null || true
fi

if check_port 3000; then
    echo "Killing process on port 3000..."
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
fi

if check_port 5173; then
    echo "Killing process on port 5173..."
    lsof -ti:5173 | xargs kill -9 2>/dev/null || true
fi

echo -e "${GREEN}✅ Ports cleared${NC}"

# Start Backend
echo ""
echo -e "${YELLOW}🔥 Starting Backend (BEAST MODE)...${NC}"
cd backend

# Check if requirements are installed
if ! python -c "import fastapi" 2>/dev/null; then
    echo "Installing backend dependencies..."
    pip install -r requirements.txt
fi

# Start backend in background
python beast_fastapi_server.py > ../backend.log 2>&1 &
BACKEND_PID=$!
echo -e "${GREEN}✅ Backend started (PID: $BACKEND_PID) on http://localhost:8000${NC}"
echo "   Logs: backend.log"

# Wait for backend to be ready
echo "Waiting for backend to initialize..."
sleep 3

# Check if backend is running
if ! check_port 8000; then
    echo -e "${RED}❌ Backend failed to start${NC}"
    echo "Check backend.log for errors"
    exit 1
fi

# Test backend health
echo "Testing backend health..."
if curl -s http://localhost:8000/api/health > /dev/null; then
    echo -e "${GREEN}✅ Backend health check passed${NC}"
else
    echo -e "${YELLOW}⚠️  Backend health check failed (may need more time)${NC}"
fi

cd ..

# Start Dashboard
echo ""
echo -e "${YELLOW}📊 Starting Dashboard (Next.js)...${NC}"
cd frontend/dashboard

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dashboard dependencies..."
    npm install
fi

# Start dashboard in background
npm run dev > ../../dashboard.log 2>&1 &
DASHBOARD_PID=$!
echo -e "${GREEN}✅ Dashboard started (PID: $DASHBOARD_PID) on http://localhost:3000${NC}"
echo "   Logs: dashboard.log"

cd ../..

# Start Old Frontend (TradeX)
echo ""
echo -e "${YELLOW}📈 Starting TradeX/VisualX (React)...${NC}"
cd frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

# Start frontend in background
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
echo -e "${GREEN}✅ TradeX started (PID: $FRONTEND_PID) on http://localhost:5173${NC}"
echo "   Logs: frontend.log"

cd ..

# Summary
echo ""
echo "=============================================="
echo -e "${GREEN}🎉 ALL SERVICES STARTED SUCCESSFULLY${NC}"
echo "=============================================="
echo ""
echo -e "${YELLOW}🔗 Access URLs:${NC}"
echo "   Backend API:  http://localhost:8000"
echo "   API Docs:     http://localhost:8000/docs"
echo "   Dashboard:    http://localhost:3000"
echo "   TradeX:       http://localhost:5173"
echo ""
echo -e "${YELLOW}📝 Process IDs:${NC}"
echo "   Backend:  $BACKEND_PID"
echo "   Dashboard: $DASHBOARD_PID"
echo "   TradeX:    $FRONTEND_PID"
echo ""
echo -e "${YELLOW}📊 Log Files:${NC}"
echo "   backend.log"
echo "   dashboard.log"
echo "   frontend.log"
echo ""
echo -e "${YELLOW}🛑 To Stop All Services:${NC}"
echo "   kill $BACKEND_PID $DASHBOARD_PID $FRONTEND_PID"
echo "   OR"
echo "   ./stop_all.sh"
echo ""
echo -e "${GREEN}✅ Ready for testing!${NC}"
echo ""
echo -e "${YELLOW}🧪 Next Steps:${NC}"
echo "1. Open http://localhost:3000 in browser"
echo "2. Search for a stock (e.g., AAPL)"
echo "3. Verify 'Live Data' indicator appears"
echo "4. Check all APIs return real data (not mock)"
echo "5. Review LIVE_DATA_TESTING_GUIDE.md for full tests"
echo ""
echo "=============================================="
echo -e "${GREEN}🦁 BEAST MODE: ACTIVATED${NC}"
echo "=============================================="
