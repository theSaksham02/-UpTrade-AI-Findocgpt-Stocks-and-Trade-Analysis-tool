# btc_pipeline.py
"""
Re-runs the forecasting / strategy / anomaly pipeline on real historical BTC data
from Hugging Face and exports JSON for the frontend charts.

Dataset: https://huggingface.co/datasets/Farmaanaa/global_bitcoin_price_daily
(daily OHLC, 2014-09-17 onwards; no volume column).

Usage:
    python btc_pipeline.py
Outputs:
    frontend/uptrade-website/public/data/btc_daily.json
"""

import json
import os
import warnings
from datetime import timedelta

import numpy as np
import pandas as pd

from forecasting_model import train_and_forecast
from investment_strategy import generate_recommendation

warnings.filterwarnings("ignore")

HF_URL = (
    "https://huggingface.co/datasets/Farmaanaa/global_bitcoin_price_daily"
    "/resolve/main/bitcoin.parquet"
)
OUT_PATH = os.path.join("frontend", "uptrade-website", "public", "data", "btc_daily.json")
FORECAST_DAYS = 30
TRAIN_YEARS = 3  # ARIMA on the full 12y history is dominated by early regimes


def load_btc():
    print(f"⬇️  Loading BTC daily OHLC from Hugging Face...")
    df = pd.read_parquet(HF_URL)
    df["date"] = pd.to_datetime(df["date_greg"])
    df = df.set_index("date").sort_index()[["open", "high", "low", "close"]].astype(float)
    df = df[~df.index.duplicated()].dropna()
    print(f"✅ {len(df)} rows, {df.index[0].date()} → {df.index[-1].date()}")
    return df


def detect_return_anomalies(close, window=30, z=3.0):
    """Price-move anomalies (dataset has no volume, so volume anomalies can't run)."""
    ret = close.pct_change()
    mu = ret.rolling(window).mean()
    sd = ret.rolling(window).std()
    zscore = (ret - mu) / sd
    flagged = zscore.abs() > z
    return [
        {
            "time": d.strftime("%Y-%m-%d"),
            "return_pct": round(float(ret[d]) * 100, 2),
            "zscore": round(float(zscore[d]), 2),
        }
        for d in close.index[flagged]
    ]


def main():
    df = load_btc()
    close = df["close"]

    train = close[close.index >= close.index[-1] - pd.DateOffset(years=TRAIN_YEARS)]
    forecast = train_and_forecast(train.reset_index(drop=True), forecast_days=FORECAST_DAYS)
    last = close.index[-1]
    forecast.index = [last + timedelta(days=i + 1) for i in range(FORECAST_DAYS)]

    rec, reason, metrics = generate_recommendation(close, forecast)
    anomalies = detect_return_anomalies(close)

    sma50 = close.rolling(50).mean()
    sma200 = close.rolling(200).mean()

    out = {
        "symbol": "BTC",
        "source": HF_URL.split("/resolve")[0],
        "generated_at": pd.Timestamp.utcnow().isoformat(),
        "last_date": last.strftime("%Y-%m-%d"),
        "candles": [
            {"time": d.strftime("%Y-%m-%d"), "open": round(r.open, 2), "high": round(r.high, 2),
             "low": round(r.low, 2), "close": round(r.close, 2)}
            for d, r in df.iterrows()
        ],
        "sma50": [{"time": d.strftime("%Y-%m-%d"), "value": round(v, 2)} for d, v in sma50.dropna().items()],
        "sma200": [{"time": d.strftime("%Y-%m-%d"), "value": round(v, 2)} for d, v in sma200.dropna().items()],
        "forecast": [{"time": d.strftime("%Y-%m-%d"), "value": round(float(v), 2)} for d, v in forecast.items()],
        "recommendation": {"signal": rec, "reason": reason, "metrics": metrics},
        "anomalies": anomalies,
    }

    os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
    with open(OUT_PATH, "w") as f:
        json.dump(out, f)

    print(f"\n📊 Recommendation: {rec}\n   {reason}")
    for k, v in metrics.items():
        print(f"   {k}: {v}")
    print(f"⚠️  {len(anomalies)} return anomalies (|z|>3); latest: {anomalies[-3:]}")
    print(f"💾 Wrote {OUT_PATH}")


if __name__ == "__main__":
    main()
