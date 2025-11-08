#!/usr/bin/env python3
"""
UpTrade AI - Unified Launcher
Runs both backend and frontend servers in a single terminal
"""

import os
import sys
import subprocess
import signal
import time
from pathlib import Path

# ANSI colors
RED = '\033[0;31m'
GREEN = '\033[0;32m'
BLUE = '\033[0;34m'
YELLOW = '\033[1;33m'
MAGENTA = '\033[0;35m'
NC = '\033[0m'  # No Color

def print_colored(message, color):
    print(f"{color}{message}{NC}")

def print_header():
    print("\n" + "="*50)
    print_colored("🚀 UpTrade AI - Premium Trading Platform", MAGENTA)
    print("="*50 + "\n")

def check_dependencies():
    """Check and install dependencies if needed"""
    print_colored("📦 Checking dependencies...", BLUE)
    
    # Check Python dependencies
    try:
        import fastapi
        import uvicorn
        print_colored("✅ Python dependencies OK", GREEN)
    except ImportError:
        print_colored("📥 Installing Python dependencies...", YELLOW)
        subprocess.run([sys.executable, "-m", "pip", "install", "-q", 
                       "fastapi", "uvicorn[standard]", "websockets", "yfinance", "pandas", "numpy"])
        print_colored("✅ Python dependencies installed", GREEN)
    
    # Check Node dependencies
    frontend_path = Path("frontend")
    if not (frontend_path / "node_modules").exists():
        print_colored("📥 Installing frontend dependencies...", YELLOW)
        subprocess.run(["npm", "install"], cwd=frontend_path)
        print_colored("✅ Frontend dependencies installed", GREEN)
    else:
        print_colored("✅ Frontend dependencies OK", GREEN)

def main():
    print_header()
    
    # Get project root
    project_root = Path(__file__).parent
    backend_path = project_root / "backend"
    frontend_path = project_root / "frontend"
    
    # Check dependencies
    check_dependencies()
    
    print("\n" + "="*50)
    print_colored("🔧 Starting servers...", BLUE)
    print("="*50)
    print_colored("\n📍 Backend:  http://localhost:8000", GREEN)
    print_colored("📍 Frontend: http://localhost:3000", GREEN)
    print_colored("\n💡 Press Ctrl+C to stop all servers\n", YELLOW)
    print("="*50 + "\n")
    
    processes = []
    
    try:
        # Start backend
        print_colored("🐍 Starting Python backend...", BLUE)
        backend_process = subprocess.Popen(
            [sys.executable, "enhanced_server.py"],
            cwd=backend_path,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1
        )
        processes.append(("Backend", backend_process))
        time.sleep(2)  # Give backend time to start
        
        # Start frontend
        print_colored("⚛️  Starting React frontend...", BLUE)
        frontend_process = subprocess.Popen(
            ["npm", "run", "dev"],
            cwd=frontend_path,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1
        )
        processes.append(("Frontend", frontend_process))
        
        print_colored("\n✨ All servers started successfully!", GREEN)
        print_colored("🌐 Open http://localhost:3000 in your browser\n", MAGENTA)
        
        # Monitor processes and output
        while True:
            for name, process in processes:
                # Check if process is still running
                if process.poll() is not None:
                    print_colored(f"\n❌ {name} process stopped unexpectedly!", RED)
                    raise KeyboardInterrupt
                
                # Read and display output (non-blocking)
                try:
                    line = process.stdout.readline()
                    if line:
                        color = BLUE if name == "Backend" else GREEN
                        print(f"{color}[{name}]{NC} {line.strip()}")
                except:
                    pass
            
            time.sleep(0.1)
            
    except KeyboardInterrupt:
        print_colored("\n\n🛑 Shutting down servers...", YELLOW)
        for name, process in processes:
            try:
                process.terminate()
                process.wait(timeout=5)
                print_colored(f"✅ {name} stopped", GREEN)
            except subprocess.TimeoutExpired:
                process.kill()
                print_colored(f"⚠️  {name} force killed", YELLOW)
        
        print_colored("\n👋 UpTrade AI stopped. See you next time!", MAGENTA)
        sys.exit(0)
    
    except Exception as e:
        print_colored(f"\n❌ Error: {e}", RED)
        for _, process in processes:
            process.terminate()
        sys.exit(1)

if __name__ == "__main__":
    main()
