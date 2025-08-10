# investment_strategy.py

import pandas as pd
import numpy as np

def generate_recommendation(historical_data, forecast_data):
    """
    Generates a buy, sell, or hold recommendation based on historical and forecasted data.

    Args:
        historical_data (pd.Series): A pandas Series of historical closing prices.
        forecast_data (pd.Series): A pandas Series of forecasted prices.

    Returns:
        tuple: A tuple containing the recommendation (str), the reason (str), 
               and key metrics (dict).
    """
    if historical_data is None or forecast_data is None or historical_data.empty or forecast_data.empty:
        return "Error", "Insufficient data for a recommendation.", {}

    # --- Key Metrics ---
    last_historical_price = historical_data.iloc[-1]
    peak_forecast_price = forecast_data.max()
    end_forecast_price = forecast_data.iloc[-1]
    
    # Calculate the projected change
    projected_change_pct = ((end_forecast_price - last_historical_price) / last_historical_price) * 100
    
    # --- Strategy Logic ---
    
    # 1. Strong Buy Signal: Significant upward momentum
    if projected_change_pct > 5.0:
        recommendation = "Strong Buy"
        reason = (
            f"The forecast predicts a significant price increase of {projected_change_pct:.2f}% "
            f"over the next {len(forecast_data)} days. The model shows strong upward momentum, "
            f"projecting a rise from ${last_historical_price:.2f} to ${end_forecast_price:.2f}."
        )
        
    # 2. Buy Signal: Moderate upward trend
    elif projected_change_pct > 1.5:
        recommendation = "Buy"
        reason = (
            f"A moderate upward trend is expected, with a projected gain of {projected_change_pct:.2f}%. "
            f"This suggests a good entry point for a potential long position."
        )

    # 3. Strong Sell Signal: Significant downward momentum
    elif projected_change_pct < -5.0:
        recommendation = "Strong Sell"
        reason = (
            f"The model forecasts a significant price drop of {projected_change_pct:.2f}%. "
            f"This indicates strong bearish pressure, suggesting it may be time to exit positions."
        )
        
    # 4. Sell Signal: Moderate downward trend
    elif projected_change_pct < -1.5:
        recommendation = "Sell"
        reason = (
            f"A moderate downward trend is predicted, with a potential loss of {projected_change_pct:.2f}%. "
            f"Consider reducing exposure or exiting positions to mitigate risk."
        )
        
    # 5. Hold Signal: Low volatility or unclear trend
    else:
        recommendation = "Hold"
        reason = (
            f"The forecast shows low volatility with a projected change of only {project_change_pct:.2f}%. "
            f"The current trend is not strong enough to signal a clear buy or sell action. "
            f"It is advisable to hold and monitor the asset."
        )
        
    # --- Package Metrics for Display ---
    key_metrics = {
        "Current Price": f"${last_historical_price:.2f}",
        "Forecasted End Price": f"${end_forecast_price:.2f}",
        "Projected Change": f"{projected_change_pct:.2f}%",
        "Forecast Horizon (Days)": len(forecast_data)
    }
    
    return recommendation, reason, key_metrics

def main():
    """
    Example usage of the recommendation function.
    """
    # Create sample data
    hist = pd.Series([100, 102, 101, 103, 105])
    # Sample 1: Strong Buy
    forecast_buy = pd.Series([106, 108, 110, 112, 115])
    
    rec, reason, metrics = generate_recommendation(hist, forecast_buy)
    print(f"Recommendation: {rec}")
    print(f"Reason: {reason}")
    print(f"Metrics: {metrics}\n")

    # Sample 2: Sell
    forecast_sell = pd.Series([104, 102, 100, 98, 97])
    rec, reason, metrics = generate_recommendation(hist, forecast_sell)
    print(f"Recommendation: {rec}")
    print(f"Reason: {reason}")
    print(f"Metrics: {metrics}\n")

if __name__ == "__main__":
    main()
