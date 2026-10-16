#!/usr/bin/env python3
"""
UpTrade AI - React + FastAPI Launcher
Runs FastAPI backend and React frontend
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
CYAN = '\033[0;36m'
MAGENTA = '\033[0;35m'
NC = '\033[0m'

def print_colored(message, color):
    print(f"{color}{message}{NC}")

def print_header():
    print("\n" + "="*80)
    print_colored("🚀 UpTrade AI - React + FastAPI Platform", MAGENTA)
    print("="*80 + "\n")

def check_dependencies():
    """Check and install Python dependencies"""
    print_colored("📦 Checking Python dependencies...", BLUE)
    
    required_packages = [
        "fastapi", "uvicorn", "websockets", "yfinance", 
        "pandas", "numpy", "requests", "pydantic"
    ]
    
    missing_packages = []
    for package in required_packages:
        try:
            __import__(package)
        except ImportError:
            missing_packages.append(package)
    
    if missing_packages:
        print_colored(f"📥 Installing: {', '.join(missing_packages)}...", YELLOW)
        subprocess.run(
            [sys.executable, "-m", "pip", "install", "-q"] + missing_packages,
            check=True
        )
        print_colored("✅ Dependencies installed", GREEN)
    else:
        print_colored("✅ Python dependencies OK", GREEN)
    
    # Install from requirements.txt if exists
    if Path("requirements.txt").exists():
        print_colored("📥 Installing from requirements.txt...", YELLOW)
        subprocess.run(
            [sys.executable, "-m", "pip", "install", "-q", "-r", "requirements.txt"],
            check=False
        )

def check_frontend():
    """Check if Next.js landing page and dashboard exist and have dependencies"""
    landing_path = Path("frontend/uptrade-website")
    dashboard_path = Path("frontend/dashboard")
    
    has_landing = False
    if landing_path.exists() and (landing_path / "package.json").exists():
        print_colored("✅ Next.js landing page found", GREEN)
        has_landing = True
        
        # Check if node_modules exists for landing page
        if not (landing_path / "node_modules").exists():
            print_colored("📥 Installing npm dependencies for landing page...", YELLOW)
            result = subprocess.run(
                ["npm", "install"],
                cwd=landing_path,
                capture_output=True,
                text=True
            )
            if result.returncode == 0:
                print_colored("✅ Landing page dependencies installed", GREEN)
            else:
                print_colored("⚠️  npm install had issues, continuing anyway...", YELLOW)
    
    has_dashboard = False
    if dashboard_path.exists() and (dashboard_path / "package.json").exists():
        print_colored("✅ Next.js dashboard found", GREEN)
        has_dashboard = True
        
        # Check if node_modules exists for dashboard
        if not (dashboard_path / "node_modules").exists():
            print_colored("📥 Installing npm dependencies for dashboard...", YELLOW)
            result = subprocess.run(
                ["npm", "install"],
                cwd=dashboard_path,
                capture_output=True,
                text=True
            )
            if result.returncode == 0:
                print_colored("✅ Dashboard dependencies installed", GREEN)
            else:
                print_colored("⚠️  npm install had issues, continuing anyway...", YELLOW)
    
    if not has_landing and not has_dashboard:
        print_colored("❌ No frontend found!", RED)
        return False, False
    
    return has_landing, has_dashboard

def main():
    print_header()
    
    project_root = Path(__file__).parent
    
    # Check dependencies
    check_dependencies()
    
    # Check frontend
    has_landing, has_dashboard = check_frontend()
    
    print("\n" + "="*80)
    print_colored("🔧 Starting servers...", BLUE)
    print("="*80)
    print_colored("\n�� Services:", CYAN)
    print_colored("  • FastAPI Backend:    http://localhost:8000", GREEN)
    print_colored("  • API Documentation:  http://localhost:8000/docs", GREEN)
    print_colored("  • Interactive API:    http://localhost:8000/redoc", GREEN)
    if has_landing:
        print_colored("  • Landing Page:       http://localhost:3000", GREEN)
    if has_dashboard:
        print_colored("  • Dashboard:          http://localhost:3001", GREEN)
    print_colored("\n  • WebSocket Endpoints:", GREEN)
    print_colored("    - ws://localhost:8000/ws", GREEN)
    print_colored("    - ws://localhost:8000/ws/live", GREEN)
    print_colored("    - ws://localhost:8000/ws/tickers", GREEN)
    print_colored("\n💡 Press Ctrl+C to stop all servers", YELLOW)
    print("="*80 + "\n")
    
    processes = []
    
    try:
        # Start FastAPI Backend
        print_colored("🦁 Starting FastAPI Backend...", BLUE)
        beast_server = project_root / "beast_fastapi_server.py"
        
        if not beast_server.exists():
            print_colored("❌ beast_fastapi_server.py not found!", RED)
            sys.exit(1)
        
        backend_process = subprocess.Popen(
            [sys.executable, "beast_fastapi_server.py"],
            cwd=project_root,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1
        )
        processes.append(("FastAPI", backend_process, BLUE))
        print_colored("  ✅ FastAPI starting on http://localhost:8000", GREEN)
        time.sleep(3)  # Give backend time to start
        
        # Start Landing Page
        if has_landing:
            print_colored("\n🌐 Starting Landing Page...", CYAN)
            landing_path = project_root / "frontend" / "uptrade-website"
            
            landing_process = subprocess.Popen(
                ["npm", "run", "dev"],
                cwd=landing_path,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                bufsize=1
            )
            processes.append(("Landing", landing_process, CYAN))
            print_colored("  ✅ Landing page starting on http://localhost:3000", GREEN)
        
        # Start Dashboard
        if has_dashboard:
            print_colored("\n📊 Starting Dashboard...", MAGENTA)
            dashboard_path = project_root / "frontend" / "dashboard"
            
            dashboard_process = subprocess.Popen(
                ["npm", "run", "dev"],
                cwd=dashboard_path,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                bufsize=1
            )
            processes.append(("Dashboard", dashboard_process, MAGENTA))
            print_colored("  ✅ Dashboard starting on http://localhost:3001", GREEN)
        
        print_colored("\n" + "="*80, GREEN)
        print_colored("✨ All servers started!", GREEN)
        print_colored("="*80, GREEN)
        print_colored("\n🌐 Quick Links:", CYAN)
        if has_landing:
            print_colored("  • Landing Page: http://localhost:3000", MAGENTA)
            print_colored("  • TradeX:       http://localhost:3000/tradex", MAGENTA)
            print_colored("  • VisualX:      http://localhost:3000/visualx", MAGENTA)
        if has_dashboard:
            print_colored("  • Dashboard:    http://localhost:3001", MAGENTA)
        print_colored("  • API Docs:     http://localhost:8000/docs", BLUE)
        print_colored("  • API Health: http://localhost:8000/api/health", BLUE)
        print_colored("\n�� Server logs:\n", YELLOW)
        print("="*80 + "\n")
        
        # Monitor processes
        while True:
            for name, process, color in processes:
                if process.poll() is not None:
                    print_colored(f"\n❌ {name} stopped! Exit code: {process.returncode}", RED)
                    raise KeyboardInterrupt
                
                try:
                    line = process.stdout.readline()
                    if line:
                        timestamp = time.strftime("%H:%M:%S")
                        print(f"{color}[{timestamp}] [{name:8s}]{NC} {line.strip()}")
                except:
                    pass
            
            time.sleep(0.1)
    
    except KeyboardInterrupt:
        print_colored("\n\n🛑 Shutting down...", YELLOW)
        print("="*80)
        
        for name, process, _ in processes:
            try:
                print_colored(f"  Stopping {name}...", YELLOW)
                process.terminate()
                process.wait(timeout=5)
                print_colored(f"  ✅ {name} stopped", GREEN)
            except subprocess.TimeoutExpired:
                process.kill()
                print_colored(f"  ✅ {name} force stopped", GREEN)
            except Exception as e:
                print_colored(f"  ⚠️  Error: {e}", YELLOW)
        
        print("\n" + "="*80)
        print_colored("👋 UpTrade AI stopped cleanly!", MAGENTA)
        print("="*80 + "\n")
        sys.exit(0)
    
    except Exception as e:
        print_colored(f"\n❌ Error: {e}", RED)
        
        for _, process, _ in processes:
            try:
                process.terminate()
                process.wait(timeout=2)
            except:
                process.kill()
        
        sys.exit(1)

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print_colored(f"\n❌ Fatal error: {e}", RED)
        sys.exit(1)
