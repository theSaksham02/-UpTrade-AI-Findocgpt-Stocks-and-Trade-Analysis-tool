# 🚀 Quick Deploy - UpTrade AI Full Deck MVP

## ⚡ 3 Ways to Deploy (Choose One)

---

## Option 1: **FASTEST** - Vercel + Render (Recommended)

### Time: ~10 minutes | Cost: Free tier available

#### Step 1: Deploy Backend to Render (5 min)
```bash
1. Go to https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Select your repository
5. Configure:
   - Name: uptrade-backend
   - Runtime: Python 3
   - Build: pip install -r requirements.txt
   - Start: python beast_fastapi_server.py
   - Add Environment Variables (copy from .env):
     * ALPHA_VANTAGE_API_KEY
     * FINNHUB_API_KEY
     * POLYGON_API_KEY
     * NEWS_API_KEY
     * NEWSDATA_API_KEY
     * MARKETAUX_API_KEY
     * FMP_API_KEY
     * HUGGINGFACE_API_KEY
6. Click "Create Web Service"
7. Copy your backend URL: https://uptrade-backend.onrender.com
```

#### Step 2: Deploy Dashboard to Vercel (5 min)
```bash
1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Add New" → "Project"
4. Select your repository
5. Configure:
   - Framework: Next.js
   - Root Directory: frontend/dashboard
   - Environment Variables:
     * NEXT_PUBLIC_API_URL=https://uptrade-backend.onrender.com
6. Click "Deploy"
7. Your dashboard URL: https://uptrade-dashboard.vercel.app
```

#### Step 3: Update CORS (2 min)
```bash
# In beast_fastapi_server.py, update allow_origins:
allow_origins=[
    "https://uptrade-dashboard.vercel.app",
    "https://*.vercel.app"
]

# Push changes
git add beast_fastapi_server.py
git commit -m "Update CORS for production"
git push origin main
```

✅ **Done!** Your app is live.

---

## Option 2: **EASIEST** - One-Click Local Deploy

### Time: ~5 minutes | Cost: Free

```bash
# 1. Ensure .env file exists with API keys
cp .env.example .env
nano .env  # Add your API keys

# 2. Run deployment script
./deploy.sh

# 3. Select option 1 (Local Docker Compose)

# 4. Access your app
# Backend: http://localhost:8000/docs
# Dashboard: http://localhost:3000
```

✅ **Done!** Your app is running locally.

---

## Option 3: **FLEXIBLE** - VPS Deploy (DigitalOcean/AWS/GCP)

### Time: ~30 minutes | Cost: ~$5-15/month

#### Step 1: Setup VPS (10 min)
```bash
# 1. Create VPS (DigitalOcean/AWS EC2/etc)
#    - Ubuntu 22.04
#    - 2GB RAM minimum
#    - Open ports 80, 443, 8000, 3000

# 2. SSH into server
ssh root@your-vps-ip

# 3. Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
apt-get install docker-compose-plugin
```

#### Step 2: Deploy App (10 min)
```bash
# 1. Clone repository
git clone https://github.com/yourusername/your-repo.git
cd your-repo

# 2. Create .env with your API keys
nano .env
# Paste your API keys

# 3. Deploy
docker compose -f docker-compose.prod.yml up -d --build

# 4. Check status
docker compose -f docker-compose.prod.yml logs -f
```

#### Step 3: Setup Domain & SSL (10 min)
```bash
# 1. Point domain A record to VPS IP
# 2. Install Certbot
apt-get install certbot python3-certbot-nginx

# 3. Get SSL certificate
certbot --nginx -d yourdomain.com -d api.yourdomain.com

# 4. Update nginx.prod.conf with your domain

# 5. Restart nginx
docker compose -f docker-compose.prod.yml restart nginx
```

✅ **Done!** Your app is live at https://yourdomain.com

---

## 📊 Cost Comparison

| Option | Cost | Performance | Scalability | Setup Time |
|--------|------|-------------|-------------|------------|
| **Vercel + Render** | Free - $27/mo | ⭐⭐⭐⭐⭐ | Auto-scaling | 10 min |
| **Local Docker** | $0 | ⭐⭐⭐ | Manual | 5 min |
| **VPS** | $5-15/mo | ⭐⭐⭐⭐ | Manual | 30 min |

---

## 🔑 API Keys Required (Get Free)

| API | URL | Free Tier |
|-----|-----|-----------|
| **Alpha Vantage** | https://www.alphavantage.co/support/#api-key | 5/min, 500/day |
| **Finnhub** | https://finnhub.io/register | 60/min |
| **Polygon** | https://polygon.io/dashboard/signup | 5/min |
| **NewsAPI** | https://newsapi.org/register | 100/day |
| **NewsData** | https://newsdata.io/register | 200/day |
| **Marketaux** | https://www.marketaux.com/account/signup | 100/day |
| **FMP** | https://site.financialmodelingprep.com/developer/docs | 250/day |
| **HuggingFace** | https://huggingface.co/settings/tokens | Unlimited |

---

## ✅ Verify Deployment

### Backend Test:
```bash
# Test stock quote
curl https://your-backend-url/api/stock/quote/AAPL

# Expected: {"symbol":"AAPL","price":272.41,...}
```

### Dashboard Test:
```bash
1. Open https://your-dashboard-url
2. Search "AAPL"
3. Should show real-time data
```

---

## 🐛 Troubleshooting

### Backend not starting:
```bash
# Check logs
docker logs uptrade-backend

# Common fix: Check .env file has all API keys
```

### Dashboard can't connect:
```bash
# 1. Verify NEXT_PUBLIC_API_URL is correct
# 2. Check CORS in backend (allow_origins)
# 3. Test backend directly with curl
```

### Slow responses:
```bash
# Upgrade server instance
# Add Redis caching
# Enable CDN
```

---

## 📚 Full Documentation

- **Complete Guide**: See `DEPLOYMENT_GUIDE.md`
- **API Docs**: `https://your-backend-url/docs`
- **Architecture**: See `ARCHITECTURE.md`

---

## 🎯 Recommended: Vercel + Render

**Why?**
- ✅ Fastest deployment (10 minutes)
- ✅ Free tier available
- ✅ Auto SSL certificates
- ✅ Auto scaling
- ✅ Zero maintenance
- ✅ Global CDN
- ✅ CI/CD built-in

**Perfect for:**
- MVP launches
- Testing with users
- Demo to investors
- Production apps

---

## 🚀 Next Steps After Deploy

1. **Monitor**: Setup UptimeRobot (free)
2. **Analytics**: Add Google Analytics
3. **Errors**: Setup Sentry (free tier)
4. **Users**: Share your URL!
5. **Feedback**: Iterate based on usage

---

**Questions?** See `DEPLOYMENT_GUIDE.md` for detailed instructions.

**Ready to deploy?** Run `./deploy.sh` or follow Option 1 above! 🎉
