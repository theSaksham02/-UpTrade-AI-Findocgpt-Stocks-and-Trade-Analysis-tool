#!/usr/bin/env python3
"""
UpTrade AI - Unified Launcher
Runs backend FastAPI server, Streamlit frontend, and all APIs in a single terminal
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
CYAN = '\033[0;36m'
NC = '\033[0m'  # No Color

def print_colored(message, color):
    print(f"{color}{message}{NC}")

def print_header():
    print("\n" + "="*80)
    print_colored("🦁 UpTrade AI - BEAST MODE - Complete Platform Launch", MAGENTA)
    print("="*80 + "\n")

def check_dependencies():
    """Check and install dependencies if needed"""
    print_colored("📦 Checking dependencies...", BLUE)
    
    # Check Python dependencies for backend
    required_packages = [
        "fastapi", "uvicorn", "websockets", "yfinance", 
        "pandas", "numpy", "streamlit", "requests"
    ]
    
    missing_packages = []
    for package in required_packages:
        try:
            __import__(package)
        except ImportError:
            missing_packages.append(package)
    
    if missing_packages:
        print_colored(f"📥 Installing missing Python dependencies: {', '.join(missing_packages)}...", YELLOW)
        subprocess.run(
            [sys.executable, "-m", "pip", "install", "-q"] + missing_packages,
            check=True
        )
        print_colored("✅ Python dependencies installed", GREEN)
    else:
        print_colored("✅ Python dependencies OK", GREEN)
    
    # Check if requirements.txt exists and install from it
    requirements_file = Path("requirements.txt")
    if requirements_file.exists():
        print_colored("📥 Installing from requirements.txt...", YELLOW)
        subprocess.run(
            [sys.executable, "-m", "pip", "install", "-q", "-r", "requirements.txt"],
            check=False  # Don't fail if some packages are optional
        )
        print_colored("✅ Requirements installed", GREEN)

def check_api_keys():
    """Check if API keys are configured"""
    print_colored("\n🔑 Checking API configuration...", BLUE)
    
    config_file = Path("config.py")
    if config_file.exists():
        print_colored("✅ config.py found", GREEN)
    else:
        print_colored("⚠️  config.py not found - API features may be limited", YELLOW)
    
    # Check for .env file
    env_file = Path(".env")
    if env_file.exists():
        print_colored("✅ .env file found", GREEN)
    else:
        print_colored("⚠️  .env file not found - using config.py settings", YELLOW)

def main():
    print_header()
    
    # Get project root
    project_root = Path(__file__).parent
    
    # Check dependencies
    check_dependencies()
    check_api_keys()
    
    print("\n" + "="*80)
    print_colored("🔧 Starting all servers...", BLUE)
    print("="*80)
    print_colored("\n� Services:", CYAN)
    print_colored("  • FastAPI Backend (BEAST MODE):  http://localhost:8000", GREEN)
    print_colored("  • API Documentation:              http://localhost:8000/docs", GREEN)
    print_colored("  • Streamlit Frontend:             http://localhost:8501", GREEN)
    print_colored("  • WebSocket Endpoints:", GREEN)
    print_colored("    - ws://localhost:8000/ws", GREEN)
    print_colored("    - ws://localhost:8000/ws/live", GREEN)
    print_colored("    - ws://localhost:8000/ws/tickers", GREEN)
    print_colored("\n💡 Press Ctrl+C to stop all servers", YELLOW)
    print_colored("💡 Wait ~10 seconds for all servers to initialize\n", YELLOW)
    print("="*80 + "\n")
    
    processes = []
    
    try:
        # 1. Start FastAPI Backend (BEAST MODE)
        print_colored("🦁 Starting FastAPI BEAST MODE Backend...", BLUE)
        beast_server_file = project_root / "beast_fastapi_server.py"
        
        if beast_server_file.exists():
            backend_process = subprocess.Popen(
                [sys.executable, "beast_fastapi_server.py"],
                cwd=project_root,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                bufsize=1
            )
            processes.append(("FastAPI Backend", backend_process, BLUE))
            print_colored("  ✅ FastAPI server starting on http://localhost:8000", GREEN)
            time.sleep(3)  # Give backend time to start
        else:
            print_colored("  ⚠️  beast_fastapi_server.py not found, skipping...", YELLOW)
        
        # 2. Start Streamlit Frontend
        print_colored("\n📊 Starting Streamlit Frontend...", MAGENTA)
        app_file = project_root / "app.py"
        
        if app_file.exists():
            streamlit_process = subprocess.Popen(
                [sys.executable, "-m", "streamlit", "run", "app.py", 
                 "--server.port=8501", 
                 "--server.headless=true",
                 "--browser.gatherUsageStats=false"],
                cwd=project_root,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                bufsize=1
            )
            processes.append(("Streamlit Frontend", streamlit_process, MAGENTA))
            print_colored("  ✅ Streamlit server starting on http://localhost:8501", GREEN)
            time.sleep(2)
        else:
            print_colored("  ⚠️  app.py not found, skipping...", YELLOW)
        
        # 3. Check for React frontend (optional)
        frontend_path = project_root / "frontend"
        if (frontend_path / "package.json").exists():
            print_colored("\n⚛️  React frontend detected, starting...", CYAN)
            
            # Check if node_modules exists
            if not (frontend_path / "node_modules").exists():
                print_colored("  📥 Installing npm dependencies...", YELLOW)
                subprocess.run(["npm", "install"], cwd=frontend_path, check=True)
            
            react_process = subprocess.Popen(
                ["npm", "run", "dev"],
                cwd=frontend_path,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                bufsize=1
            )
            processes.append(("React Frontend", react_process, CYAN))
            print_colored("  ✅ React server starting (check console for port)", GREEN)
        
        print_colored("\n" + "="*80, GREEN)
        print_colored("✨ All servers started successfully!", GREEN)
        print_colored("="*80, GREEN)
        print_colored("\n🌐 Open these URLs:", CYAN)
        print_colored("  • Streamlit UI:  http://localhost:8501", MAGENTA)
        print_colored("  • API Docs:      http://localhost:8000/docs", BLUE)
        print_colored("  • API Health:    http://localhost:8000/api/health", BLUE)
        print_colored("\n📊 Monitoring server logs...\n", YELLOW)
        print("="*80 + "\n")
        
        # Monitor processes and output
        last_output_time = {name: time.time() for name, _, _ in processes}
        
        while True:
            for name, process, color in processes:
                # Check if process is still running
                if process.poll() is not None:
                    print_colored(f"\n❌ {name} process stopped unexpectedly!", RED)
                    print_colored(f"   Exit code: {process.returncode}", RED)
                    raise KeyboardInterrupt
                
                # Read and display output (non-blocking)
                try:
                    line = process.stdout.readline()
                    if line:
                        # Filter out some verbose messages
                        line_lower = line.lower()
                        if not any(skip in line_lower for skip in [
                            'watching for file changes',
                            'debugger listening',
                            'compiled successfully'
                        ]):
                            timestamp = time.strftime("%H:%M:%S")
                            print(f"{color}[{timestamp}] [{name}]{NC} {line.strip()}")
                            last_output_time[name] = time.time()
                except Exception as e:
                    pass
            
            time.sleep(0.1)
            
    except KeyboardInterrupt:
        print_colored("\n\n🛑 Shutting down all servers...", YELLOW)
        print("="*80)
        
        for name, process, color in processes:
            try:
                print_colored(f"  Stopping {name}...", YELLOW)
                process.terminate()
                process.wait(timeout=5)
                print_colored(f"  ✅ {name} stopped", GREEN)
            except subprocess.TimeoutExpired:
                print_colored(f"  ⚠️  {name} not responding, force killing...", YELLOW)
                process.kill()
                print_colored(f"  ✅ {name} force stopped", GREEN)
            except Exception as e:
                print_colored(f"  ⚠️  Error stopping {name}: {e}", YELLOW)
        
        print("\n" + "="*80)
        print_colored("👋 UpTrade AI stopped. All services shut down cleanly!", MAGENTA)
        print_colored("   See you next time! 🦁", MAGENTA)
        print("="*80 + "\n")
        sys.exit(0)
    
    except Exception as e:
        print_colored(f"\n❌ Error: {e}", RED)
        import traceback
        traceback.print_exc()
        
        print_colored("\n🛑 Cleaning up...", YELLOW)
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
