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
    """Check if React frontend exists and has dependencies"""
    frontend_path = Path("frontend")
    
    if not frontend_path.exists():
        print_colored("❌ frontend/ directory not found!", RED)
        return False
    
    if not (frontend_path / "package.json").exists():
        print_colored("❌ frontend/package.json not found!", RED)
        return False
    
    print_colored("✅ React frontend found", GREEN)
    
    # Check if node_modules exists
    if not (frontend_path / "node_modules").exists():
        print_colored("📥 Installing npm dependencies...", YELLOW)
        result = subprocess.run(
            ["npm", "install"],
            cwd=frontend_path,
            capture_output=True,
            text=True
        )
        if result.returncode == 0:
            print_colored("✅ npm dependencies installed", GREEN)
        else:
            print_colored("⚠️  npm install had issues, continuing anyway...", YELLOW)
    
    return True

def main():
    print_header()
    
    project_root = Path(__file__).parent
    
    # Check dependencies
    check_dependencies()
    
    # Check frontend
    has_frontend = check_frontend()
    
    print("\n" + "="*80)
    print_colored("🔧 Starting servers...", BLUE)
    print("="*80)
    print_colored("\n�� Services:", CYAN)
    print_colored("  • FastAPI Backend:    http://localhost:8000", GREEN)
    print_colored("  • API Documentation:  http://localhost:8000/docs", GREEN)
    print_colored("  • Interactive API:    http://localhost:8000/redoc", GREEN)
    if has_frontend:
        print_colored("  • React Frontend:     http://localhost:5051 (or check logs)", GREEN)
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
        
        # Start React Frontend
        if has_frontend:
            print_colored("\n⚛️  Starting React Frontend...", CYAN)
            frontend_path = project_root / "frontend"
            
            react_process = subprocess.Popen(
                ["npm", "run", "dev"],
                cwd=frontend_path,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                bufsize=1
            )
            processes.append(("React", react_process, CYAN))
            print_colored("  ✅ React starting (check logs for port)", GREEN)
        
        print_colored("\n" + "="*80, GREEN)
        print_colored("✨ All servers started!", GREEN)
        print_colored("="*80, GREEN)
        print_colored("\n🌐 Quick Links:", CYAN)
        print_colored("  • Frontend:   http://localhost:5173", MAGENTA)
        print_colored("  • API Docs:   http://localhost:8000/docs", BLUE)
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
