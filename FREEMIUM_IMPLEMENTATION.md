# 🛠️ Freemium Implementation Guide

## Quick Implementation Checklist

### Backend Setup

#### 1. Create Tier Configuration
```python
# config.py - Add this
TIERS = {
    "FREE": {
        "api_calls_per_day": 100,
        "api_calls_per_minute": 5,
        "max_watchlists": 1,
        "max_stocks_per_watchlist": 5,
        "max_alerts": 0,
        "data_delay_minutes": 15,
        "features": {
            "real_time_quotes": False,
            "forecasting": False,
            "backtesting": False,
            "advanced_charts": False,
            "sentiment_analysis": True,
            "paper_trading": True,
        }
    },
    "PRO": {
        "api_calls_per_day": 10000,
        "api_calls_per_minute": 100,
        "max_watchlists": 50,
        "max_stocks_per_watchlist": 5000,
        "max_alerts": 50,
        "data_delay_minutes": 0,
        "features": {
            "real_time_quotes": True,
            "forecasting": True,
            "backtesting": True,
            "advanced_charts": True,
            "sentiment_analysis": True,
            "paper_trading": True,
        }
    },
    "ENTERPRISE": {
        "api_calls_per_day": float('inf'),
        "api_calls_per_minute": float('inf'),
        "max_watchlists": float('inf'),
        "max_stocks_per_watchlist": float('inf'),
        "max_alerts": float('inf'),
        "data_delay_minutes": 0,
        "features": {
            "real_time_quotes": True,
            "forecasting": True,
            "backtesting": True,
            "advanced_charts": True,
            "sentiment_analysis": True,
            "paper_trading": True,
            "custom_models": True,
            "ftp_protocol": True,
        }
    }
}
```

#### 2. Create Rate Limiting Middleware
```python
# backend/app/core/rate_limit.py
from functools import wraps
from datetime import datetime, timedelta
from typing import Optional
import time

class RateLimiter:
    def __init__(self):
        self.requests = {}  # {user_id: [timestamps]}
    
    def is_allowed(self, user_id: str, tier: str, limit: int) -> bool:
        """Check if user is within rate limit."""
        now = time.time()
        
        if user_id not in self.requests:
            self.requests[user_id] = []
        
        # Clean old requests (older than 1 day)
        self.requests[user_id] = [
            req_time for req_time in self.requests[user_id]
            if now - req_time < 86400  # 24 hours
        ]
        
        if len(self.requests[user_id]) < limit:
            self.requests[user_id].append(now)
            return True
        
        return False
    
    def get_remaining(self, user_id: str, limit: int) -> int:
        """Get remaining requests."""
        if user_id not in self.requests:
            return limit
        return max(0, limit - len(self.requests[user_id]))

rate_limiter = RateLimiter()

def require_tier(required_tier: str = "FREE"):
    """Decorator to require minimum tier."""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, user_id: str, user_tier: str, **kwargs):
            tiers = ["FREE", "PRO", "ENTERPRISE"]
            tier_levels = {t: i for i, t in enumerate(tiers)}
            
            if tier_levels[user_tier] < tier_levels[required_tier]:
                return {
                    "error": "Upgrade required",
                    "required_tier": required_tier,
                    "current_tier": user_tier
                }
            
            return await func(*args, **kwargs)
        return wrapper
    return decorator
```

#### 3. Update User Model
```python
# backend/app/models/user.py
from enum import Enum
from datetime import datetime

class TierEnum(str, Enum):
    FREE = "FREE"
    PRO = "PRO"
    ENTERPRISE = "ENTERPRISE"

class User(Base):
    __tablename__ = "users"
    
    id: int = Column(Integer, primary_key=True)
    email: str = Column(String, unique=True)
    tier: TierEnum = Column(Enum(TierEnum), default=TierEnum.FREE)
    stripe_customer_id: Optional[str] = Column(String)
    subscription_id: Optional[str] = Column(String)
    tier_start_date: datetime = Column(DateTime, default=datetime.utcnow)
    tier_end_date: Optional[datetime] = Column(DateTime)
    api_calls_used_today: int = Column(Integer, default=0)
    api_calls_reset_at: datetime = Column(DateTime)
    
    # Relationships
    watchlists = relationship("Watchlist", back_populates="user")
    alerts = relationship("Alert", back_populates="user")
```

#### 4. Create Tier Check Endpoints
```python
# backend/app/api/v1/tier.py
from fastapi import APIRouter, Depends

router = APIRouter(prefix="/api/v1/tier", tags=["Tier"])

@router.get("/limits")
async def get_tier_limits(current_user: User = Depends(get_current_user)):
    """Get current tier limits."""
    from app.config import TIERS
    tier_config = TIERS[current_user.tier]
    
    return {
        "tier": current_user.tier,
        "limits": tier_config,
        "api_calls_remaining": (
            tier_config["api_calls_per_day"] - 
            current_user.api_calls_used_today
        )
    }

@router.get("/upgrade-url")
async def get_upgrade_url(current_user: User = Depends(get_current_user)):
    """Get Stripe checkout URL for upgrade."""
    import stripe
    
    if current_user.tier == "PRO":
        plan_id = "prod_pro"  # Pro annual plan
    else:
        plan_id = "prod_pro_monthly"
    
    checkout_session = stripe.checkout.Session.create(
        customer_email=current_user.email,
        payment_method_types=["card"],
        line_items=[{"price": plan_id, "quantity": 1}],
        mode="subscription",
        success_url="http://localhost:5173/success",
        cancel_url="http://localhost:5173/pricing"
    )
    
    return {"checkout_url": checkout_session.url}
```

---

### Frontend Setup

#### 1. Create Tier Context
```typescript
// frontend/src/context/TierContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

interface TierLimits {
  tier: string;
  api_calls_per_day: number;
  api_calls_remaining: number;
  features: Record<string, boolean>;
}

interface TierContextType {
  tier: string;
  limits: TierLimits | null;
  isLoading: boolean;
  refetchLimits: () => Promise<void>;
}

const TierContext = createContext<TierContextType | undefined>(undefined);

export const TierProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [tier, setTier] = useState("FREE");
  const [limits, setLimits] = useState<TierLimits | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    refetchLimits();
  }, []);

  const refetchLimits = async () => {
    try {
      const response = await fetch('/api/v1/tier/limits', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setTier(data.tier);
      setLimits(data.limits);
    } catch (error) {
      console.error('Failed to fetch tier limits:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TierContext.Provider value={{ tier, limits, isLoading, refetchLimits }}>
      {children}
    </TierContext.Provider>
  );
};

export const useTier = () => {
  const context = useContext(TierContext);
  if (!context) {
    throw new Error('useTier must be used within TierProvider');
  }
  return context;
};
```

#### 2. Create Premium Feature Gate Component
```typescript
// frontend/src/components/PremiumFeature.tsx
import React from 'react';
import { useTier } from '../context/TierContext';

interface PremiumFeatureProps {
  feature: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const PremiumFeature: React.FC<PremiumFeatureProps> = ({
  feature,
  children,
  fallback,
}) => {
  const { tier, limits } = useTier();

  if (!limits?.features[feature]) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-yellow-800">
              🔒 Premium Feature
            </p>
            <p className="text-sm text-yellow-700 mt-1">
              Upgrade to {tier === 'FREE' ? 'Pro' : 'Enterprise'} to use this feature.
            </p>
          </div>
          <button
            onClick={() => window.location.href = '/pricing'}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Upgrade Now
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
```

#### 3. Create Rate Limit Display
```typescript
// frontend/src/components/RateLimitDisplay.tsx
import React from 'react';
import { useTier } from '../context/TierContext';

export const RateLimitDisplay: React.FC = () => {
  const { limits } = useTier();

  if (!limits) return null;

  const percentage = (
    (limits.api_calls_remaining / limits.api_calls_per_day) * 100
  );

  return (
    <div className="bg-gray-100 rounded p-4">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium">API Calls Today</span>
        <span className="text-sm text-gray-600">
          {limits.api_calls_remaining} / {limits.api_calls_per_day}
        </span>
      </div>
      <div className="w-full bg-gray-300 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all ${
            percentage > 50 ? 'bg-green-500' :
            percentage > 25 ? 'bg-yellow-500' :
            'bg-red-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {percentage < 10 && (
        <p className="text-xs text-red-600 mt-2">
          ⚠️ Running low on daily API calls. Resets tomorrow.
        </p>
      )}
    </div>
  );
};
```

#### 4. Update API Service
```typescript
// frontend/src/services/api.ts
import axios, { AxiosInstance } from 'axios';

class APIService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
    });

    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 402) {
          // Payment required - tier limit exceeded
          window.location.href = '/pricing';
        }
        return Promise.reject(error);
      }
    );
  }

  async getStockQuote(ticker: string) {
    return this.api.get(`/api/v1/stocks/${ticker}/quote`);
  }

  async getForecasts(ticker: string) {
    return this.api.get(`/api/v1/forecasts/${ticker}`);
  }

  // ... other methods
}

export const apiService = new APIService();
```

---

### Database Migrations

```sql
-- migrations/add_tier_system.sql

-- Add tier column to users
ALTER TABLE users ADD COLUMN tier VARCHAR(50) DEFAULT 'FREE';
ALTER TABLE users ADD COLUMN stripe_customer_id VARCHAR(255);
ALTER TABLE users ADD COLUMN subscription_id VARCHAR(255);
ALTER TABLE users ADD COLUMN tier_start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE users ADD COLUMN tier_end_date TIMESTAMP NULL;
ALTER TABLE users ADD COLUMN api_calls_used_today INT DEFAULT 0;
ALTER TABLE users ADD COLUMN api_calls_reset_at TIMESTAMP;

-- Create subscriptions table
CREATE TABLE subscriptions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    stripe_subscription_id VARCHAR(255) UNIQUE,
    tier VARCHAR(50),
    status VARCHAR(50),
    current_period_start TIMESTAMP,
    current_period_end TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create usage tracking table
CREATE TABLE api_usage (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    endpoint VARCHAR(255),
    method VARCHAR(10),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX (user_id, timestamp)
);
```

---

### Stripe Integration

```python
# backend/app/services/payment_service.py
import stripe
from app.models import User
from sqlalchemy.orm import Session

stripe.api_key = "sk_live_your_key"

class PaymentService:
    @staticmethod
    async def create_checkout_session(user: User, tier: str):
        """Create Stripe checkout session."""
        prices = {
            "PRO_MONTHLY": "price_monthly_pro",
            "PRO_ANNUAL": "price_annual_pro",
            "ENTERPRISE": "price_enterprise"
        }
        
        session = stripe.checkout.Session.create(
            customer_email=user.email,
            payment_method_types=["card"],
            line_items=[{
                "price": prices[tier],
                "quantity": 1
            }],
            mode="subscription",
            success_url="http://localhost:5173/billing/success",
            cancel_url="http://localhost:5173/pricing"
        )
        
        return session

    @staticmethod
    async def handle_webhook(event: dict, db: Session):
        """Handle Stripe webhook events."""
        if event["type"] == "customer.subscription.created":
            stripe_customer_id = event["data"]["object"]["customer"]
            user = db.query(User).filter_by(
                stripe_customer_id=stripe_customer_id
            ).first()
            
            if user:
                user.tier = "PRO"
                db.commit()
        
        elif event["type"] == "customer.subscription.deleted":
            # Downgrade to FREE
            stripe_customer_id = event["data"]["object"]["customer"]
            user = db.query(User).filter_by(
                stripe_customer_id=stripe_customer_id
            ).first()
            
            if user:
                user.tier = "FREE"
                db.commit()
```

---

### Pricing Page Component

```typescript
// frontend/src/pages/Pricing.tsx
import React from 'react';
import { useTier } from '../context/TierContext';

export const PricingPage: React.FC = () => {
  const { tier } = useTier();

  const plans = [
    {
      name: "Free",
      price: "$0",
      duration: "forever",
      features: [
        "50 stock quotes/day",
        "Basic sentiment analysis",
        "Paper trading ($100k)",
        "1 watchlist (5 stocks)",
        "Community support"
      ],
      cta: tier === "FREE" ? "Current Plan" : "Downgrade"
    },
    {
      name: "Pro",
      price: "$29.99",
      duration: "/month or $299/year",
      features: [
        "Everything in Free",
        "Real-time quotes",
        "AI forecasting",
        "Backtesting",
        "50+ indicators",
        "50 watchlists",
        "50 price alerts",
        "24/7 support"
      ],
      cta: tier === "PRO" ? "Current Plan" : "Upgrade Now",
      highlighted: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      duration: "contact sales",
      features: [
        "Everything in Pro",
        "Unlimited API calls",
        "Custom ML models",
        "Dedicated account manager",
        "99.99% SLA",
        "White-label options",
        "24/7 phone support"
      ],
      cta: "Contact Sales"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4">
          Simple, Transparent Pricing
        </h1>
        <p className="text-center text-gray-600 mb-12">
          Start free. Upgrade when you're ready. No credit card required.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`rounded-lg border-2 p-8 ${
                plan.highlighted
                  ? 'border-blue-600 bg-blue-50 shadow-lg scale-105'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                <p className="text-gray-600 text-sm">{plan.duration}</p>
              </div>

              <button
                className={`w-full py-3 rounded-lg font-semibold mb-8 ${
                  plan.highlighted
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {plan.cta}
              </button>

              <ul className="space-y-3">
                {plan.features.map((feature, fidx) => (
                  <li key={fidx} className="flex items-start">
                    <span className="text-green-500 mr-3">✓</span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
```

---

## Implementation Priority

### Week 1: MVP
- [ ] Rate limiting middleware
- [ ] User tier configuration
- [ ] Basic tier checks on 3-5 critical endpoints
- [ ] Pricing page

### Week 2: Enhancement
- [ ] Stripe integration
- [ ] Tier context & components
- [ ] Premium feature gates
- [ ] Rate limit display

### Week 3: Polish
- [ ] Analytics tracking
- [ ] Retention emails
- [ ] A/B testing upgrade prompts
- [ ] Documentation

---

## Testing Checklist

```bash
# Test Free tier rate limiting
curl -H "Authorization: Bearer free_user_token" \
  http://localhost:8000/api/v1/stocks/AAPL/quote

# Test Pro tier unlimited access
curl -H "Authorization: Bearer pro_user_token" \
  http://localhost:8000/api/v1/stocks/AAPL/quote

# Test feature gate
curl -X POST http://localhost:8000/api/v1/forecasts \
  -H "Authorization: Bearer free_user_token"
  # Should return 402 Payment Required

# Test webhook
curl -X POST http://localhost:8000/webhooks/stripe \
  -H "Content-Type: application/json" \
  -d @webhook_payload.json
```

---

**Ready to implement? Start with Week 1 items! 🚀**
