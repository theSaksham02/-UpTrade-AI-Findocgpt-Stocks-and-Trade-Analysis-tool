#!/bin/bash

# UpTrade Dashboard Startup Script
# This script starts both the backend API and frontend dashboard

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     UpTrade Dashboard Launcher         ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$SCRIPT_DIR"

# Check if backend is already running
echo -e "${YELLOW}Checking backend status...${NC}"
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${GREEN}✓ Backend already running on port 8000${NC}"
else
    echo -e "${YELLOW}Starting backend API server...${NC}"
    
    # Check if virtual environment exists
    if [ -d "$PROJECT_ROOT/.venv" ]; then
        cd "$PROJECT_ROOT"
        source .venv/bin/activate
        echo -e "${GREEN}✓ Virtual environment activated${NC}"
        
        # Start backend in background
        python api_server.py > backend.log 2>&1 &
        BACKEND_PID=$!
        echo -e "${GREEN}✓ Backend started (PID: $BACKEND_PID)${NC}"
        echo -e "${BLUE}  Backend API: http://localhost:8000${NC}"
        echo -e "${BLUE}  API Docs: http://localhost:8000/api/docs${NC}"
        
        # Wait for backend to be ready
        echo -e "${YELLOW}Waiting for backend to be ready...${NC}"
        for i in {1..30}; do
            if curl -s http://localhost:8000/api/health > /dev/null 2>&1; then
                echo -e "${GREEN}✓ Backend is ready!${NC}"
                break
            fi
            sleep 1
            echo -n "."
        done
        echo ""
    else
        echo -e "${RED}✗ Virtual environment not found at .venv${NC}"
        echo -e "${YELLOW}Please run: python -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt${NC}"
        exit 1
    fi
fi

# Check if dashboard is already running
echo ""
echo -e "${YELLOW}Checking dashboard status...${NC}"
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${GREEN}✓ Dashboard already running on port 3000${NC}"
    echo -e "${BLUE}  Dashboard: http://localhost:3000${NC}"
elif lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${GREEN}✓ Dashboard already running on port 3001${NC}"
    echo -e "${BLUE}  Dashboard: http://localhost:3001${NC}"
else
    echo -e "${YELLOW}Starting dashboard...${NC}"
    
    # Navigate to dashboard directory
    DASHBOARD_DIR="$PROJECT_ROOT/frontend/dashboard"
    
    if [ -d "$DASHBOARD_DIR" ]; then
        cd "$DASHBOARD_DIR"
        
        # Check if node_modules exists
        if [ ! -d "node_modules" ]; then
            echo -e "${YELLOW}Installing dashboard dependencies...${NC}"
            npm install --legacy-peer-deps
        fi
        
        # Start dashboard
        echo -e "${GREEN}✓ Starting dashboard...${NC}"
        npm run dev > dashboard.log 2>&1 &
        DASHBOARD_PID=$!
        echo -e "${GREEN}✓ Dashboard started (PID: $DASHBOARD_PID)${NC}"
        
        # Wait for dashboard to be ready
        echo -e "${YELLOW}Waiting for dashboard to be ready...${NC}"
        for i in {1..30}; do
            if curl -s http://localhost:3000 > /dev/null 2>&1; then
                echo -e "${GREEN}✓ Dashboard is ready at http://localhost:3000${NC}"
                break
            elif curl -s http://localhost:3001 > /dev/null 2>&1; then
                echo -e "${GREEN}✓ Dashboard is ready at http://localhost:3001${NC}"
                break
            fi
            sleep 1
            echo -n "."
        done
        echo ""
    else
        echo -e "${RED}✗ Dashboard directory not found at $DASHBOARD_DIR${NC}"
        exit 1
    fi
fi

echo ""
echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║     ✓ UpTrade is Ready!                ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}🚀 Access Points:${NC}"
echo -e "   • Dashboard:  http://localhost:3000 or http://localhost:3001"
echo -e "   • Backend API: http://localhost:8000"
echo -e "   • API Docs:   http://localhost:8000/api/docs"
echo ""
echo -e "${YELLOW}📝 Tips:${NC}"
echo -e "   • Press Ctrl+C in terminals to stop servers"
echo -e "   • Backend logs: ./backend.log"
echo -e "   • Dashboard logs: ./frontend/dashboard/dashboard.log"
echo -e "   • Monitor API: curl http://localhost:8000/api/health"
echo ""
echo -e "${BLUE}Happy Trading! 📈${NC}"
