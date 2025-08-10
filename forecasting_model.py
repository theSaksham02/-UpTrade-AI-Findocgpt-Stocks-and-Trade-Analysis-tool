# forecasting_model.py

import warnings
import yfinance as yf
import pandas as pd
from statsmodels.tsa.arima.model import ARIMA
from datetime import date

# Suppress warnings for cleaner output
warnings.filterwarnings("ignore")

def fetch_stock_data(ticker, start_date, end_date):
    """
    Fetches historical stock data from Yahoo Finance.
    """
    try:
        data = yf.download(ticker, start=start_date, end=end_date, progress=False)
        if data.empty:
            print(f"❌ No data found for ticker: {ticker}")
            return None
        print(f"✅ Successfully fetched historical data for {ticker}.")
        return data['Close']
    except Exception as e:
        print(f"❌ Error fetching stock data: {e}")
        return None

def train_and_forecast(data, forecast_days=30):
    """
    Trains an ARIMA model and forecasts future stock prices.
    
    Args:
        data (pd.Series): A pandas Series of historical closing prices.
        forecast_days (int): The number of days to forecast into the future.
        
    Returns:
        pd.Series: A pandas Series containing the forecasted prices.
    """
    if data is None or data.empty:
        return None
        
    print("🧠 Training forecasting model...")
    
    # We use the entire history to train the model for the best possible forecast
    history = data.astype(float)
    
    # Define and fit the ARIMA model
    # A common starting point for ARIMA order is (5,1,0)
    # p=5: Use 5 previous observations for autoregression
    # d=1: Use first-order differencing to make the series stationary
    # q=0: Do not use a moving average model
    model = ARIMA(history, order=(5, 1, 0))
    try:
        model_fit = model.fit()
        print("✅ Model training complete.")
    except Exception as e:
        print(f"❌ Error fitting ARIMA model: {e}")
        return None

    # Make a forecast for the specified number of days
    print(f"🔮 Generating forecast for the next {forecast_days} days...")
    forecast = model_fit.forecast(steps=forecast_days)
    
    print("✅ Forecast generated successfully.")
    return forecast

def main():
    """
    Main function to demonstrate the forecasting model.
    """
    ticker = 'AAPL'  # Example ticker
    start_date = '2020-01-01'
    end_date = date.today().strftime('%Y-%m-%d')
    
    # Fetch historical stock data
    stock_data = fetch_stock_data(ticker, start_date, end_date)
    
    if stock_data is not None:
        # Get the forecast
        forecast = train_and_forecast(stock_data, forecast_days=30)
        
        if forecast is not None:
            print(f"\n--- Forecast for {ticker} ---")
            print(forecast)
            
            # Create a combined view of historical and forecasted data
            combined_df = pd.DataFrame({
                'history': stock_data,
                'forecast': forecast
            })
            
            print("\n📈 Combined History and Forecast:")
            print(combined_df.tail(35)) # Show last 5 historical and 30 forecasted

if __name__ == "__main__":
    main()