<!-- FinDocGPT — AkashX | Built for Hack‑Nation’s Global AI Hackathon (with MIT Sloan AI Club) -->

<p align="center">
  <img src="assets/hack-nation-banner.png" alt="Hack‑Nation Global AI Hackathon" width="100%" />
</p>

<h1 align="center">FinDocGPT</h1>
<p align="center"><b>Enterprise AI for Financial Document Intelligence</b></p>

<p align="center">
  <img src="assets/akashx-logo.png" alt="AkashX" height="120" />
</p>

<p align="center">
  <a href="http://localhost:8501"><b>🚀 Live Demo</b></a> •
  <a href="#-quick-start"><b>⚡ Quick Start</b></a> •
  <a href="#-judge-in-2-minutes"><b>🧪 Judge in 2 Minutes</b></a> •
  <a href="#-submission-deliverables"><b>📦 Deliverables</b></a>
</p>

---

## ✨ In one glance
- 🤖 Q&A over filings with cited sources (Gemini 1.5)
- 😊 Financial-text sentiment (DistilBERT)
- 🔮 30‑day stock forecasting (ML + sentiment)
- ⚖️ TradeX: side‑by‑side ticker comparison
- 🚨 Volume anomaly detection

---

## ⚡ Quick Start
```bash
# Clone
git clone https://github.com/theSaksham02/AkashX.ai-FinDocGPT-AI-for-financial-document-analysis-investment-strategy.git
cd AkashX.ai-FinDocGPT-AI-for-financial-document-analysis-investment-strategy

# Environment (Python 3.12+ on Ubuntu 24.04)
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Configure (.env)
cp .env.example .env
echo "GOOGLE_API_KEY=your_api_key_here" >> .env

# Run
streamlit run app.py --server.port 8501
```
Open: http://localhost:8501  
Or: `$BROWSER` http://localhost:8501

---

## 🧪 Judge in 2 Minutes
1) Launch
- App boots without errors, sidebar shows modes

2) Smoke tests
- Q&A: Ask “What was 3M’s FY2018 capex?” → grounded answer + citation
- Sentiment: Paste a financial paragraph → label + score
- Forecast: AAPL → 30‑day chart renders

3) Accept
- Grounded answer with source
- Sentiment/forecast show visuals
- Typical latency < 5s

---

## 🧩 Features (quick)
- Sources-first Q&A using Gemini 1.5 + FAISS retrieval
- DistilBERT sentiment pipeline for earnings/filings
- Stock forecasting with sentiment features
- TradeX multi‑ticker comparison with scores
- Anomaly alerts on unusual volume spikes

---

## 🏗️ Workflow (high level)
```mermaid
graph LR
    A[Financial Docs / Filings] --> B[Chunk + Embed]
    B --> C[FAISS Vector Store]
    C --> D[Q&A (Gemini 1.5)]
    A --> E[Sentiment (DistilBERT)]
    F[Market Data (Yahoo)] --> G[Forecasting (ML+Sentiment)]
    D --> H[Streamlit UI]
    E --> H
    G --> H
```

---

## 🔧 Environment
- OS: Ubuntu 24.04.2 LTS (dev container)
- Python: 3.12+
- Key env vars (.env):
  - GOOGLE_API_KEY=your_api_key_here
- Optional: set HTTP(S)_PROXY if behind a proxy

Handy commands:
```bash
# Lint quick syntax
python -m py_compile app.py

# Kill existing Streamlit on 8501 (Linux)
lsof -t -i:8501 | xargs -r kill
```

---

## 📦 Submission Deliverables
- GitHub Repository: Public link with full code and clear README (setup + description)
- Zipped Code (.zip): Full codebase with README and requirements.txt
  ```bash
  zip -r findocgpt.zip . -x ".venv/*" "__pycache__/*" ".git/*"
  ```
- Dataset (if used or generated): share a link, or write “N/A”

Checklist
- [ ] Public repo link added
- [ ] Zip uploaded with README + requirements.txt
- [ ] Dataset link or “N/A”
- [ ] App demoed with cited Q&A

---

## 📄 License
MIT — see LICENSE

Note: FinDocGPT is for informational use. Validate insights before making financial decisions.