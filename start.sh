#!/bin/bash

# UpTrade AI - React + FastAPI Quick Start Script
# This script starts the FastAPI backend and React frontend

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
MAGENTA='\033[0;35m'
NC='\033[0m'

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo "║        🚀 UpTrade AI - React + FastAPI Launcher           ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 not found! Please install Python 3.8+${NC}"
    exit 1
fi

PYTHON_VERSION=$(python3 --version | awk '{print $2}')
echo -e "${GREEN}✅ Python $PYTHON_VERSION found${NC}"

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}⚠️  Node.js not found! React frontend requires Node.js${NC}"
    echo -e "${YELLOW}   Install from: https://nodejs.org/${NC}"
fi

# Check if run.py exists
if [ ! -f "run.py" ]; then
    echo -e "${RED}❌ run.py not found!${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}🔧 Starting UpTrade AI Platform...${NC}"
echo ""
echo -e "${MAGENTA}Services that will start:${NC}"
echo -e "  ${GREEN}•${NC} FastAPI Backend    → http://localhost:8000"
echo -e "  ${GREEN}•${NC} React Frontend     → http://localhost:5173"
echo -e "  ${GREEN}•${NC} API Documentation  → http://localhost:8000/docs"
echo ""
echo -e "${YELLOW}💡 Press Ctrl+C to stop all servers${NC}"
echo ""

# Make run.py executable
chmod +x run.py

# Start the platform
python3 run.py
