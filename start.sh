#!/bin/bash

# UpTrade AI - Complete Platform Startup Script
# Starts FastAPI Backend + Streamlit Frontend + All APIs

echo ""
echo "═══════════════════════════════════════════════════════════════════════════"
echo "  🦁 UpTrade AI - BEAST MODE - Starting Complete Platform..."
echo "═══════════════════════════════════════════════════════════════════════════"
echo ""
echo "  This will start:"
echo "    ✅ FastAPI Backend (Port 8000) - All APIs"
echo "    ✅ Streamlit Frontend (Port 8501) - Trading UI"
echo "    ✅ React Frontend (Port 5173) - If available"
echo "    ✅ 13 External API Integrations"
echo "    ✅ 3 WebSocket Endpoints"
echo ""
echo "  🌐 After startup (~10 seconds), open:"
echo "     • Main UI:     http://localhost:8501"
echo "     • API Docs:    http://localhost:8000/docs"
echo "     • API Health:  http://localhost:8000/api/health"
echo ""
echo "  💡 Press Ctrl+C to stop all servers"
echo ""
echo "═══════════════════════════════════════════════════════════════════════════"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Python is available
if ! command -v python &> /dev/null && ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Error: Python is not installed!${NC}"
    echo "   Please install Python 3.8 or higher"
    exit 1
fi

# Use python3 if available, otherwise python
PYTHON_CMD="python"
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
fi

echo -e "${BLUE}� Using: $PYTHON_CMD${NC}"
$PYTHON_CMD --version
echo ""

# Check if run.py exists
if [ ! -f "run.py" ]; then
    echo -e "${RED}❌ Error: run.py not found in current directory${NC}"
    echo "   Please run this script from the project root"
    exit 1
fi

# Start the platform using run.py
echo -e "${GREEN}🚀 Launching UpTrade AI...${NC}"
echo ""
$PYTHON_CMD run.py

# Script ends when run.py exits (Ctrl+C)
echo ""
echo "═══════════════════════════════════════════════════════════════════════════"
echo "  👋 Thanks for using UpTrade AI BEAST MODE!"
echo "═══════════════════════════════════════════════════════════════════════════"
echo ""
