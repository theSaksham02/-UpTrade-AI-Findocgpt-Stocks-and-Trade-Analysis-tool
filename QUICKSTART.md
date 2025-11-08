# 🚀 Quick Start Guide

## Running UpTrade AI (Both Servers in One Terminal)

### Method 1: Python Script (Recommended ⭐)

```bash
python3 run.py
```

or

```bash
./run.py
```

**Features:**
- ✅ Starts both backend and frontend automatically
- ✅ Shows colored output from both servers
- ✅ Checks and installs dependencies
- ✅ Easy to stop (Ctrl+C kills both)
- ✅ Professional startup messages

---

### Method 2: Bash Script

```bash
./start.sh
```

**Features:**
- ✅ Runs both servers simultaneously
- ✅ Background process management
- ✅ Auto dependency check

---

### Method 3: Manual (Old Way)

**Terminal 1 - Backend:**
```bash
source .venv/bin/activate
cd backend
python enhanced_server.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

---

## 📍 Server URLs

- **Backend API:** http://localhost:8000
- **Frontend App:** http://localhost:3000
- **API Docs:** http://localhost:8000/docs

---

## 🛑 Stopping Servers

Press `Ctrl+C` in the terminal running the script. Both servers will stop automatically.

---

## 🔧 First Time Setup

The scripts handle everything automatically, but if you want to do it manually:

1. **Install Python dependencies:**
   ```bash
   pip install fastapi uvicorn websockets yfinance pandas numpy
   ```

2. **Install frontend dependencies:**
   ```bash
   cd frontend
   npm install
   ```

---

## ⚡ Quick Commands

```bash
# Start everything
python3 run.py

# Or use bash script
./start.sh

# Check if servers are running
curl http://localhost:8000/api/health
curl http://localhost:3000
```

---

## 🐛 Troubleshooting

**Port already in use:**
```bash
# Kill processes on port 8000 (backend)
lsof -ti:8000 | xargs kill -9

# Kill processes on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9
```

**Dependencies not found:**
```bash
# Reinstall Python deps
pip install -r requirements.txt

# Reinstall frontend deps
cd frontend && npm install
```

**Permission denied:**
```bash
chmod +x run.py
chmod +x start.sh
```

---

## 💡 Tips

- Use `python3 run.py` for best experience with colored output
- Frontend hot-reloads automatically on code changes
- Backend requires restart for code changes
- Check `http://localhost:8000/docs` for API documentation

---

## 🎯 What Next?

1. Open http://localhost:3000 in your browser
2. Explore the premium UI
3. Try the AI assistant
4. Check the live ticker tape
5. Analyze stocks with advanced charts

**Enjoy trading! 🚀📈**
