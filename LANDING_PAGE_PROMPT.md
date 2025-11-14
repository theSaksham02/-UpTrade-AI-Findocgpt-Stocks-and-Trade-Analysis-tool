# 🎯 DETAILED FRONTEND PROMPT FOR UPTRADE LANDING PAGE

## PROJECT OVERVIEW
Build a professional, modern landing page for **UpTrade** - an AI-powered financial terminal and trading platform. The page should drive user acquisition and conversions while showcasing the platform's core capabilities.

---

## DESIGN REQUIREMENTS

### Theme & Colors
- **Primary**: Dark navy/black background (`#0D0219`, `#1A0537`)
- **Accent**: Vibrant purple (`#8B5CF6`, `#A78BFA`)
- **Secondary accents**: Cyan (`#06B6D4`), Green (`#10B981`), Orange (`#F59E0B`)
- **Text**: White with opacity variants
- **Style**: No glow effects - clean, professional aesthetic

### Typography
- **Headlines**: Bold, large, modern sans-serif (Inter, Poppins)
- **Body**: Clean, readable sans-serif
- **Code blocks**: Monospace (Fira Code, Monaco)

### Visual Style
- Minimalist with strategic use of gradients
- SVG animations and charts
- Smooth hover effects and transitions
- No excessive animations - performance-focused
- Professional yet approachable

---

## PAGE STRUCTURE & SECTIONS

### 1. HEADER / NAVIGATION
- **Type**: Sticky navigation bar
- **Content**:
  - Logo: "UpTrade" with icon
  - Navigation links: Home, Features, Products, Pricing, API Docs, Dashboard
  - CTA buttons: "Sign In" | "Get Started Free"
- **Mobile**: Hamburger menu dropdown
- **Design**: Transparent background with backdrop blur, stays on top while scrolling

### 2. HERO SECTION
- **Layout**: 2-column (desktop), 1-column (mobile)
- **Left Column**:
  - Headline: "The AI-Powered Terminal for Modern Traders"
  - Subheading: "Real-time data. Advanced analytics. Institutional-grade tools. All in one platform."
  - Key metrics: "50M+ data points" | "10M+ instruments" | "24/7 AI Analysis"
  - CTAs: "Start Free Today" (primary) | "Watch Demo" (secondary)
- **Right Column (Desktop)**: 
  - Animated SVG chart showing stock price movement
  - Gradient overlay
  - Data point animations
- **Background**: Dark with subtle gradient
- **Vibe**: Bold, confident, professional

### 3. PROBLEM SECTION
- **Headline**: "Why Traders Choose UpTrade"
- **Format**: 3 color-coded cards (grid layout)
- **Card 1 - "Terminal Chaos"**
  - Color: Red/Pink gradient
  - Icon: Confused chart
  - Text: "Juggling 5+ platforms for data. UpTrade consolidates everything."
- **Card 2 - "Stale Insights"**
  - Color: Orange gradient
  - Icon: Clock/delay icon
  - Text: "Market moves fast. Your tools can't keep up. UpTrade is real-time."
- **Card 3 - "No AI"**
  - Color: Yellow gradient
  - Icon: Brain icon
  - Text: "Traditional terminals lack intelligence. UpTrade has built-in AI analysis."

### 4. CORE PRODUCTS SECTION
- **Headline**: "Integrated Trading Suite"
- **Format**: 2x2 grid (responsive to single column on mobile)
- **Product 1 - TradeX**
  - Color: Green gradient background
  - Icon: Trending up chart
  - Title: "TradeX"
  - Description: "Multi-factor stock comparison with entity extraction. Compare 100+ metrics instantly."
  - Link: "Explore TradeX →"
- **Product 2 - VisualX**
  - Color: Cyan gradient background
  - Icon: Network/nodes
  - Title: "VisualX"
  - Description: "Real-time sentiment analysis and narrative detection. See market sentiment evolve live."
  - Link: "Explore VisualX →"
- **Product 3 - FinDocGPT / Research**
  - Color: Violet gradient background
  - Icon: Document/PDF
  - Title: "Research Hub"
  - Description: "AI-powered document Q&A. Analyze SEC filings, earnings calls, and research reports."
  - Link: "Explore Research →"
- **Product 4 - TradeSphere / Portfolio**
  - Color: Orange gradient background
  - Icon: Pie chart/portfolio
  - Title: "TradeSphere"
  - Description: "Portfolio management and backtesting. Track positions, run scenarios, optimize allocations."
  - Link: "Explore Portfolio →"

### 5. FEATURES SECTION
- **Headline**: "Built for Professional Traders"
- **Format**: 3-column grid (6 feature cards)
- **Features to include**:
  1. **Real-time Data** - Sub: "50M+ data points updated every second"
  2. **Advanced Analytics** - Sub: "Technical analysis, correlations, pattern recognition"
  3. **AI-Powered Insights** - Sub: "Machine learning models for trend detection"
  4. **Lightning Fast** - Sub: "99.9% uptime, sub-100ms latency"
  5. **API & Webhooks** - Sub: "Build custom integrations and bots"
  6. **Global Coverage** - Sub: "Stocks, crypto, forex, commodities - all in one"
- **Design**: Minimalist cards with icon, title, and description
- **Hover**: Subtle elevation and color shift

### 6. COMPARISON TABLE
- **Headline**: "See How UpTrade Stacks Up"
- **Format**: Responsive table (horizontal scroll on mobile)
- **Columns**: Feature | UpTrade | Traditional Terminal | Competing AI Tool
- **Rows**: 10-12 comparison points
  - Real-time data
  - AI analysis
  - Multi-asset support
  - Mobile app
  - API access
  - Custom alerts
  - Portfolio tracking
  - Backtesting
  - Community features
  - Price
  - Support
  - Learning resources
- **Design**: UpTrade column highlighted (green checkmarks), competitors grayed (X marks)
- **Message**: "Everything you need, nothing you don't"

### 7. PRICING SECTION
- **Headline**: "Flexible Plans for Every Trader"
- **Format**: 3-column pricing cards
- **Tier 1 - Starter (Free)**
  - Price: "Free Forever"
  - Features: 100 API calls/month, 5 saved portfolios, basic alerts, community support
  - CTA: "Get Started Free"
  - Badge: none
- **Tier 2 - Professional ($99/month)**
  - Price: "$99/month" (annual discount available)
  - Features: 10K API calls/month, unlimited portfolios, advanced analytics, priority support, backtesting
  - CTA: "Start Free Trial"
  - Badge: "Most Popular ⭐"
  - Highlighted background (slightly brighter)
- **Tier 3 - Enterprise (Custom)**
  - Price: "Custom Pricing"
  - Features: Unlimited everything, dedicated support, custom integrations, SLA guarantee
  - CTA: "Contact Sales"
  - Badge: none

### 8. API & DEVELOPERS SECTION
- **Headline**: "Build Your Trading Bot"
- **Layout**: 2-column (left: content, right: code example)
- **Left Column**:
  - Description: "Powerful REST & WebSocket APIs for building custom trading strategies"
  - 3 key features:
    1. **SDKs** - Python, JavaScript, Go ready to use
    2. **WebSockets** - Real-time data streams
    3. **Permissions** - Granular API key controls
  - CTA: "View API Documentation →"
- **Right Column**:
  - Code example (Python):
    ```python
    import uptrade
    
    client = uptrade.Client(api_key="your_key")
    
    # Get real-time quote
    quote = client.get_quote("AAPL")
    print(f"AAPL: ${quote.price}")
    
    # Analyze sentiment
    sentiment = client.analyze_sentiment("AAPL")
    print(f"Sentiment: {sentiment.score}")
    ```
  - Syntax highlighting, copy button

### 9. FINAL CTA SECTION
- **Headline**: "Ready to Find Your Alpha?"
- **Subheading**: "Join 50K+ traders using UpTrade"
- **CTAs**: 
  - "Start Free Trial" (primary, green)
  - "Schedule Demo" (secondary, outline)
- **Background**: Gradient overlay with subtle animation

### 10. CONTACT / FOOTER SECTION
- **Left: Contact Info (3 cards)**
  - Email: support@uptrade.ai | "Contact us"
  - Phone: +1 (650) 999-7777 | "Call us"
  - Location: "San Francisco, CA" | "Visit us"
- **Middle: Contact Form**
  - Fields: Name, Email, Subject dropdown (General | Demo | Partnership | Bug Report), Message
  - Submit button: "Send Message"
  - Success message
- **Footer (4 columns)**:
  - **Product**: Features, Pricing, API, Blog, Changelog
  - **Developers**: Documentation, API Ref, SDKs, Examples, Status
  - **Company**: About, Team, Careers, Press, Contact
  - **Legal**: Privacy, Terms, Security, Compliance, Cookies
- **Social**: Twitter, GitHub, LinkedIn, Discord icons
- **Copyright**: "© 2025 UpTrade. All rights reserved."

---

## INTERACTIVE ELEMENTS

### Hover Effects
- Buttons: Scale 1.05, opacity change, smooth color transition
- Cards: Subtle lift/shadow, border glow (purple/20)
- Links: Color transition, underline appear

### Animations
- SVG chart: Staggered data point pulse (0.1s delay between points)
- Background gradients: Slow rotation (20-30s cycle)
- Entrance animations: Fade-in on scroll (Intersection Observer)
- Smooth transitions: 300ms ease-in-out

### Mobile Interactions
- Touch-friendly buttons (44px+ minimum)
- Hamburger menu with smooth slide animation
- Swipe gestures for carousel (if applicable)
- No hover effects on mobile

---

## RESPONSIVE BREAKPOINTS

### Mobile (<768px)
- Single column layouts
- Full-width buttons
- Hero: SVG chart hidden
- Navigation: Hamburger menu
- Font sizes: Reduced for readability
- Spacing: Compact

### Tablet (768-1024px)
- 2-column grids
- Visible navigation
- Partial visualizations

### Desktop (>1024px)
- Full 2/3-column layouts
- All visualizations visible
- Maximum spacing

---

## PERFORMANCE REQUIREMENTS

- Page load: < 2 seconds
- First paint: < 1 second
- Animations: 60fps (CSS-based, not JS)
- Mobile Lighthouse score: > 90
- No external image dependencies (use SVG/CSS)

---

## TECHNICAL STACK

- **Framework**: React 18+ with TypeScript
- **Styling**: Tailwind CSS 3.4
- **Icons**: Lucide React or similar
- **Routing**: React Router v6
- **Animations**: CSS transitions, Framer Motion (optional)
- **No external**: Bootstrap, Material-UI, etc.

---

## TONE & MESSAGING

### Tone
Professional, confident, approachable

### Audience
Retail traders, quants, institutional traders, developers

### Key Messages
- "Consolidate, analyze, dominate"
- "AI-powered, data-driven, human-focused"
- "Professional tools for modern trading"
- "Free to start, powerful to scale"

---

## SUCCESS METRICS

- Bounce rate < 40%
- Average time on page > 2 minutes
- CTA click-through > 5%
- Form submissions > 2%
- Scroll depth > 70%

---

## SUMMARY

This comprehensive prompt provides everything needed to build a world-class landing page for UpTrade. It covers:
- ✅ Complete design specifications
- ✅ 10 detailed sections with content
- ✅ Interactive elements and animations
- ✅ Responsive design requirements
- ✅ Performance targets
- ✅ Technical stack guidelines
- ✅ Tone and messaging guidelines
- ✅ Success metrics

Use this as your guide when working with the frontend vibe coding platform to generate production-ready code. 🚀
