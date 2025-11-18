# 🚀 COMPLETE DEPLOYMENT GUIDE - UpTrade AI Full Deck MVP

## 📋 Pre-Deployment Checklist

Before deploying, ensure you have:

- ✅ All dashboard errors fixed (JSX, timeouts, null checks)
- ✅ Backend running locally and tested
- ✅ API keys configured in `.env`
- ✅ Frontend builds successfully (`npm run build`)
- ✅ All tests passing (`python test_all_apis.py`)

---

## 🎯 Deployment Options

### Option 1: Vercel (Recommended for Frontend) + Railway/Render (Backend)
**Best for**: Quick deployment, auto-scaling, free tier available

### Option 2: AWS (EC2 or ECS)
**Best for**: Full control, enterprise deployment

### Option 3: DigitalOcean App Platform
**Best for**: Simple setup, good pricing

### Option 4: Docker + VPS (Any provider)
**Best for**: Cost-effective, maximum control

---

## 🚀 OPTION 1: Vercel + Render (RECOMMENDED)

### Why This Stack?
- ✅ Fastest deployment (< 10 minutes)
- ✅ Free tier available
- ✅ Auto SSL certificates
- ✅ Auto scaling
- ✅ CI/CD built-in
- ✅ Perfect for Next.js (dashboard)

---

## 📦 Step 1: Prepare Your Repository

### 1.1 Create `.env.example` files

**Root `.env.example`**:
```bash
# Stock Data APIs (Need at least 1)
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key_here
FINNHUB_API_KEY=your_finnhub_key_here
POLYGON_API_KEY=your_polygon_key_here

# News APIs (Need at least 1)
NEWS_API_KEY=your_newsapi_key_here
NEWSDATA_API_KEY=your_newsdata_key_here
MARKETAUX_API_KEY=your_marketaux_key_here

# Financial APIs
FMP_API_KEY=your_fmp_key_here

# AI/ML APIs
HUGGINGFACE_API_KEY=your_huggingface_key_here
OPENAI_API_KEY=your_openai_key_here

# Optional
FRED_API_KEY=your_fred_key_here
EXCHANGERATE_API_KEY=your_exchangerate_key_here

# Server Configuration
PORT=8000
HOST=0.0.0.0
ENVIRONMENT=production
```

**Frontend `.env.example`**:
```bash
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
```

### 1.2 Add to `.gitignore`
```bash
# Ensure these are in .gitignore
.env
.env.local
.env.production
.env.development
**/__pycache__/
**/node_modules/
*.pyc
.DS_Store
```

### 1.3 Commit and Push to GitHub
```bash
git add .
git commit -m "feat: production-ready deployment with full deck MVP"
git push origin main
```

---

## 🔧 Step 2: Deploy Backend to Render

### 2.1 Sign Up for Render
1. Go to https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"

### 2.2 Configure Backend Service

**Basic Settings**:
- **Name**: `uptrade-backend`
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Root Directory**: Leave empty (or `backend` if separate)
- **Runtime**: `Python 3`
- **Build Command**: 
  ```bash
  pip install -r requirements.txt
  ```
- **Start Command**:
  ```bash
  python beast_fastapi_server.py
  ```

**Environment Variables** (Add all from your `.env`):
```
ALPHA_VANTAGE_API_KEY=your_actual_key
FINNHUB_API_KEY=your_actual_key
POLYGON_API_KEY=your_actual_key
NEWS_API_KEY=your_actual_key
NEWSDATA_API_KEY=your_actual_key
MARKETAUX_API_KEY=your_actual_key
FMP_API_KEY=your_actual_key
HUGGINGFACE_API_KEY=your_actual_key
PORT=8000
HOST=0.0.0.0
ENVIRONMENT=production
```

**Instance Type**:
- Free tier: Good for testing
- Starter ($7/mo): Recommended for production

### 2.3 Deploy Backend
1. Click "Create Web Service"
2. Wait 5-10 minutes for build
3. Get your backend URL: `https://uptrade-backend.onrender.com`
4. Test: `curl https://uptrade-backend.onrender.com/api/stock/quote/AAPL`

---

## 🎨 Step 3: Deploy Dashboard to Vercel

### 3.1 Sign Up for Vercel
1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Add New" → "Project"

### 3.2 Import Repository
1. Select your GitHub repository
2. Vercel auto-detects Next.js

### 3.3 Configure Dashboard

**Framework Preset**: `Next.js`

**Root Directory**: `frontend/dashboard`

**Build Settings**:
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

**Environment Variables**:
```
NEXT_PUBLIC_API_URL=https://uptrade-backend.onrender.com
```

### 3.4 Deploy Dashboard
1. Click "Deploy"
2. Wait 2-5 minutes
3. Get your dashboard URL: `https://uptrade-dashboard.vercel.app`
4. Test: Open in browser

---

## 🔗 Step 4: Connect Frontend to Backend

### 4.1 Update CORS in Backend

Edit `beast_fastapi_server.py`:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://uptrade-dashboard.vercel.app",  # Add your Vercel URL
        "https://*.vercel.app"  # Allow all Vercel preview deployments
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 4.2 Test Connection
1. Open dashboard: `https://uptrade-dashboard.vercel.app`
2. Search for "AAPL"
3. Should fetch real data from backend

---

## 🐳 OPTION 2: Docker Deployment (Any VPS)

### Why Docker?
- ✅ Consistent across environments
- ✅ Easy scaling
- ✅ Works on any cloud provider
- ✅ Isolated dependencies

### 2.1 Create Production Dockerfile

**Backend Dockerfile** (already exists, verify):
```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Expose port
EXPOSE 8000

# Run server
CMD ["python", "beast_fastapi_server.py"]
```

**Dashboard Dockerfile**:
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY frontend/dashboard/package*.json ./
RUN npm ci

# Copy app files
COPY frontend/dashboard/ ./

# Build
RUN npm run build

# Production image
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
```

### 2.2 Create docker-compose.yml

```yaml
version: '3.8'

services:
  backend:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: uptrade-backend
    ports:
      - "8000:8000"
    env_file:
      - .env
    environment:
      - ENVIRONMENT=production
      - HOST=0.0.0.0
      - PORT=8000
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/docs"]
      interval: 30s
      timeout: 10s
      retries: 3

  dashboard:
    build:
      context: .
      dockerfile: frontend/dashboard/Dockerfile
    container_name: uptrade-dashboard
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:8000
    depends_on:
      - backend
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    container_name: uptrade-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - backend
      - dashboard
    restart: unless-stopped
```

### 2.3 Deploy to VPS

**DigitalOcean/AWS/GCP/Linode**:

```bash
# 1. SSH into your VPS
ssh root@your-vps-ip

# 2. Install Docker & Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
apt-get install docker-compose-plugin

# 3. Clone your repository
git clone https://github.com/theSaksham02/-UpTrade-AI-Findocgpt-Stocks-and-Trade-Analysis-tool.git
cd -UpTrade-AI-Findocgpt-Stocks-and-Trade-Analysis-tool

# 4. Create .env file with your API keys
nano .env
# Paste your API keys

# 5. Build and start
docker compose up -d --build

# 6. Check logs
docker compose logs -f

# 7. Access your app
# http://your-vps-ip:3000 (dashboard)
# http://your-vps-ip:8000/docs (backend API)
```

---

## 🌐 Step 5: Setup Domain & SSL

### 5.1 Point Domain to Your Server

**For Vercel/Render**:
1. Go to your domain registrar (GoDaddy, Namecheap, etc.)
2. Add CNAME record:
   - **Name**: `dashboard` or `@`
   - **Value**: `cname.vercel-dns.com` (Vercel) or your Render URL
   - **TTL**: Automatic

3. Add CNAME for backend:
   - **Name**: `api`
   - **Value**: `your-render-app.onrender.com`

**For VPS**:
1. Add A record:
   - **Name**: `@` (root domain)
   - **Value**: Your VPS IP address
   - **TTL**: 300

2. Add A record for subdomain:
   - **Name**: `api`
   - **Value**: Your VPS IP address

### 5.2 Setup SSL (Free with Let's Encrypt)

**For Vercel/Render**: Automatic! ✅

**For VPS with Nginx**:
```bash
# Install certbot
apt-get install certbot python3-certbot-nginx

# Get certificate
certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com

# Auto-renewal (already setup by certbot)
certbot renew --dry-run
```

---

## 📊 Step 6: Monitoring & Logging

### 6.1 Setup Monitoring

**Option 1: Render/Vercel Built-in**
- Render: Auto-monitoring in dashboard
- Vercel: Analytics & logs in dashboard

**Option 2: External Monitoring (Any deployment)**

**UptimeRobot** (Free):
1. Go to https://uptimerobot.com
2. Add monitors:
   - `https://your-backend.onrender.com/docs`
   - `https://your-dashboard.vercel.app`
3. Get email alerts when down

**Sentry** (Error Tracking):
```bash
# Install in backend
pip install sentry-sdk

# Add to beast_fastapi_server.py
import sentry_sdk
sentry_sdk.init(
    dsn="your-sentry-dsn",
    environment="production"
)

# Install in frontend
npm install @sentry/nextjs
```

### 6.2 Setup Logging

**Backend Logging** (add to `beast_fastapi_server.py`):
```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/app.log'),
        logging.StreamHandler()
    ]
)
```

---

## 🔐 Step 7: Security Checklist

### 7.1 Environment Variables
- ✅ Never commit `.env` files
- ✅ Use different API keys for prod/dev
- ✅ Rotate API keys regularly
- ✅ Use secrets manager (Vercel/Render have built-in)

### 7.2 API Security
- ✅ CORS configured for your domains only
- ✅ Rate limiting enabled
- ✅ HTTPS enforced
- ✅ API keys encrypted in transit

### 7.3 Backend Security
```python
# Add to beast_fastapi_server.py
from fastapi import FastAPI, Request
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.get("/api/stock/quote/{symbol}")
@limiter.limit("60/minute")  # 60 requests per minute
async def get_quote(request: Request, symbol: str):
    # Your existing code
```

---

## 🚦 Step 8: Testing Production

### 8.1 Smoke Tests

```bash
# Test backend health
curl https://your-backend.onrender.com/docs

# Test stock quote
curl https://your-backend.onrender.com/api/stock/quote/AAPL

# Test historical data
curl "https://your-backend.onrender.com/api/stock/historical/AAPL?period=1M"

# Test news
curl "https://your-backend.onrender.com/api/news/stock/AAPL?limit=5"

# Test sentiment
curl https://your-backend.onrender.com/api/sentiment/AAPL
```

### 8.2 Frontend Tests

1. Open dashboard: `https://your-dashboard.vercel.app`
2. Test stock search: Search "AAPL" → should show real data
3. Test historical chart: Should display 30 days
4. Test news: Should show articles from multiple sources
5. Test comparison: Compare AAPL vs MSFT
6. Test on mobile: Responsive design
7. Test error handling: Try invalid symbol "XYZZZ"

### 8.3 Performance Tests

```bash
# Load test backend
ab -n 1000 -c 10 https://your-backend.onrender.com/api/stock/quote/AAPL

# Expected: < 2s response time
# Expected: 99%+ success rate
```

---

## 📈 Step 9: Scaling Strategy

### 9.1 Immediate Scaling (1-1000 users)

**Vercel + Render Free Tier**: ✅ Handles this easily

### 9.2 Medium Scaling (1K-10K users)

**Upgrade Plan**:
- Render: Starter ($7/mo) → Standard ($25/mo)
- Vercel: Pro ($20/mo)
- **Cost**: ~$45/mo

**Add Caching**:
```python
# Add Redis for caching
import redis
redis_client = redis.Redis(host='your-redis.com', port=6379, db=0)

@app.get("/api/stock/quote/{symbol}")
async def get_quote(symbol: str):
    # Check cache first
    cached = redis_client.get(f"quote:{symbol}")
    if cached:
        return json.loads(cached)
    
    # Fetch from API
    data = fetch_quote(symbol)
    
    # Cache for 30 seconds
    redis_client.setex(f"quote:{symbol}", 30, json.dumps(data))
    return data
```

### 9.3 Large Scaling (10K+ users)

**Upgrade to AWS/GCP**:
- Load balancer
- Auto-scaling groups
- CloudFront/CDN
- RDS for database
- ElastiCache for Redis

---

## 💰 Cost Breakdown

### Free Tier (Testing)
- **Vercel**: Free (hobby)
- **Render**: Free
- **Total**: $0/mo
- **Limitations**: 
  - Render free tier sleeps after 15min inactivity
  - Limited build minutes

### Production (Recommended)
- **Vercel Pro**: $20/mo
- **Render Starter**: $7/mo
- **Domain**: $12/year
- **Total**: ~$28/mo + $12/year

### Enterprise
- **AWS EC2 t3.medium**: $30/mo
- **RDS database**: $15/mo
- **CloudFront CDN**: $10/mo
- **Load Balancer**: $18/mo
- **Total**: ~$73/mo

---

## 🎯 Quick Deploy Commands

### Deploy to Vercel (One Command)
```bash
cd frontend/dashboard
npm install -g vercel
vercel --prod
```

### Deploy to Render (Git Push)
```bash
git push origin main
# Render auto-deploys on push
```

### Deploy with Docker (VPS)
```bash
docker compose up -d --build
```

---

## 🐛 Troubleshooting

### Backend Not Starting
```bash
# Check logs
docker logs uptrade-backend

# Common issues:
# 1. Port 8000 already in use
sudo lsof -ti:8000 | xargs kill -9

# 2. Missing .env file
cp .env.example .env
# Add your API keys

# 3. Requirements not installed
pip install -r requirements.txt
```

### Frontend Can't Connect to Backend
```bash
# 1. Check CORS in backend
# 2. Verify NEXT_PUBLIC_API_URL in .env
# 3. Check backend is running:
curl https://your-backend-url.com/docs
```

### Slow API Responses
```bash
# 1. Check API rate limits
# 2. Add Redis caching
# 3. Upgrade server instance
# 4. Use CDN for static assets
```

---

## ✅ Final Checklist

Before going live:

- [ ] All API keys configured in production
- [ ] `.env` not committed to git
- [ ] CORS configured for production domains
- [ ] SSL certificates active (HTTPS)
- [ ] Domain pointed correctly
- [ ] Monitoring setup (UptimeRobot)
- [ ] Error tracking setup (Sentry)
- [ ] Logs configured
- [ ] Rate limiting enabled
- [ ] All smoke tests passing
- [ ] Mobile responsive tested
- [ ] Error handling tested
- [ ] Backup strategy in place

---

## 🎉 You're Live!

Your Full Deck MVP is now deployed with:

✅ **Backend**: 13+ APIs with triple/quad redundancy  
✅ **Frontend**: Production-ready Next.js dashboard  
✅ **APIs**: Real-time stock data, news, sentiment, comparison  
✅ **Infrastructure**: Auto-scaling, SSL, monitoring  
✅ **Error Handling**: Production-grade with retry logic  

**Next Steps**:
1. Share your dashboard URL with users
2. Monitor performance in first 24 hours
3. Collect user feedback
4. Plan next features based on usage

---

## 📞 Support & Resources

**Documentation**:
- API Docs: `https://your-backend.com/docs`
- Full Deck MVP: `FULL_DECK_MVP_COMPLETE.md`
- Quick Reference: `API_QUICK_REFERENCE.md`

**Deployment Platforms**:
- Vercel Docs: https://vercel.com/docs
- Render Docs: https://render.com/docs
- Docker Docs: https://docs.docker.com

**Monitoring**:
- UptimeRobot: https://uptimerobot.com
- Sentry: https://sentry.io

---

**Deployment Status**: 🟢 Ready for Production  
**Last Updated**: November 2025  
**Version**: 2.0.0 - Full Deck MVP
