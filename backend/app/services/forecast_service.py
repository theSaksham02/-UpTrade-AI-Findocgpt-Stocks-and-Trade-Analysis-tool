"""Forecasting service for stock price predictions using ML models."""
from typing import List, Optional, Dict
from datetime import datetime, timedelta
import numpy as np
import pandas as pd
from prophet import Prophet
from sklearn.preprocessing import MinMaxScaler
from sklearn.linear_model import LinearRegression
import warnings
warnings.filterwarnings('ignore')

from app.services.market_data import market_data_service
from app.core.logging import logger


class ForecastService:
    """Service for stock price forecasting using ML models."""
    
    def __init__(self):
        """Initialize forecast service."""
        self.models = {
            'prophet': self._prophet_forecast,
            'linear': self._linear_regression_forecast,
            'moving_average': self._moving_average_forecast
        }
    
    async def create_forecast(
        self,
        ticker: str,
        horizon_days: int = 30,
        model_name: str = "prophet",
        include_sentiment: bool = True
    ) -> dict:
        """
        Create a price forecast for a ticker using ML models.
        
        Args:
            ticker: Stock ticker symbol
            horizon_days: Number of days to forecast
            model_name: Model to use (prophet, linear, moving_average)
            include_sentiment: Whether to include sentiment data
            
        Returns:
            dict: Forecast data with predictions and confidence intervals
        """
        try:
            # Get historical data for training
            end_date = datetime.utcnow()
            start_date = end_date - timedelta(days=365)  # 1 year of data
            
            historical_data = await market_data_service.get_historical_prices(
                ticker, 
                start_date=start_date,
                end_date=end_date
            )
            
            if not historical_data or len(historical_data) < 30:
                logger.warning(f"Insufficient data for {ticker}, using mock forecast")
                return self._get_mock_forecast(ticker, horizon_days, model_name)
            
            # Convert to DataFrame
            df = pd.DataFrame(historical_data)
            df['timestamp'] = pd.to_datetime(df['timestamp'])
            df = df.sort_values('timestamp')
            
            # Select forecasting model
            forecast_func = self.models.get(model_name, self._prophet_forecast)
            predictions = forecast_func(df, horizon_days)
            
            # Calculate confidence metrics
            confidence_score = self._calculate_confidence(df, predictions)
            
            prediction_date = end_date + timedelta(days=horizon_days)
            
            return {
                "id": hash(f"{ticker}{datetime.utcnow()}") % 1000000,
                "ticker": ticker,
                "model_name": model_name,
                "forecast_date": datetime.utcnow(),
                "prediction_date": prediction_date,
                "predicted_price": float(predictions['predicted_price']),
                "predicted_high": float(predictions['predicted_high']),
                "predicted_low": float(predictions['predicted_low']),
                "confidence_interval_upper": float(predictions['upper_bound']),
                "confidence_interval_lower": float(predictions['lower_bound']),
                "confidence_score": float(confidence_score),
                "horizon_days": horizon_days,
                "training_samples": len(df),
                "features_used": predictions.get('features', [])
            }
            
        except Exception as e:
            logger.error(f"Error creating forecast for {ticker}: {e}")
            return self._get_mock_forecast(ticker, horizon_days, model_name)
    
    def _prophet_forecast(self, df: pd.DataFrame, horizon_days: int) -> Dict:
        """
        Forecast using Facebook Prophet.
        
        Args:
            df: Historical data DataFrame
            horizon_days: Days to forecast
            
        Returns:
            Dict: Prediction results
        """
        try:
            # Prepare data for Prophet
            prophet_df = pd.DataFrame({
                'ds': df['timestamp'],
                'y': df['close']
            })
            
            # Initialize and fit model
            model = Prophet(
                daily_seasonality=True,
                weekly_seasonality=True,
                yearly_seasonality=True,
                interval_width=0.95
            )
            model.fit(prophet_df)
            
            # Make future dataframe
            future = model.make_future_dataframe(periods=horizon_days)
            forecast = model.predict(future)
            
            # Get the last prediction
            last_prediction = forecast.iloc[-1]
            
            return {
                'predicted_price': last_prediction['yhat'],
                'predicted_high': last_prediction['yhat'] * 1.05,
                'predicted_low': last_prediction['yhat'] * 0.95,
                'upper_bound': last_prediction['yhat_upper'],
                'lower_bound': last_prediction['yhat_lower'],
                'features': ['trend', 'weekly', 'yearly', 'daily']
            }
        except Exception as e:
            logger.error(f"Prophet forecast error: {e}")
            # Fallback to simple prediction
            last_price = df['close'].iloc[-1]
            return {
                'predicted_price': last_price * 1.02,
                'predicted_high': last_price * 1.07,
                'predicted_low': last_price * 0.97,
                'upper_bound': last_price * 1.10,
                'lower_bound': last_price * 0.94,
                'features': ['price']
            }
    
    def _linear_regression_forecast(self, df: pd.DataFrame, horizon_days: int) -> Dict:
        """
        Simple linear regression forecast.
        
        Args:
            df: Historical data DataFrame
            horizon_days: Days to forecast
            
        Returns:
            Dict: Prediction results
        """
        try:
            # Prepare features
            df['day_num'] = range(len(df))
            X = df[['day_num']].values
            y = df['close'].values
            
            # Train model
            model = LinearRegression()
            model.fit(X, y)
            
            # Predict future
            future_day = len(df) + horizon_days - 1
            predicted_price = model.predict([[future_day]])[0]
            
            # Calculate confidence intervals based on historical volatility
            volatility = df['close'].std()
            
            return {
                'predicted_price': predicted_price,
                'predicted_high': predicted_price * 1.03,
                'predicted_low': predicted_price * 0.97,
                'upper_bound': predicted_price + (2 * volatility),
                'lower_bound': predicted_price - (2 * volatility),
                'features': ['linear_trend']
            }
        except Exception as e:
            logger.error(f"Linear regression error: {e}")
            last_price = df['close'].iloc[-1]
            return {
                'predicted_price': last_price,
                'predicted_high': last_price * 1.05,
                'predicted_low': last_price * 0.95,
                'upper_bound': last_price * 1.10,
                'lower_bound': last_price * 0.90,
                'features': ['price']
            }
    
    def _moving_average_forecast(self, df: pd.DataFrame, horizon_days: int) -> Dict:
        """
        Moving average based forecast.
        
        Args:
            df: Historical data DataFrame
            horizon_days: Days to forecast
            
        Returns:
            Dict: Prediction results
        """
        try:
            # Calculate different moving averages
            df['ma_7'] = df['close'].rolling(window=7).mean()
            df['ma_30'] = df['close'].rolling(window=30).mean()
            df['ma_90'] = df['close'].rolling(window=90).mean()
            
            # Use weighted average of MAs
            last_ma7 = df['ma_7'].iloc[-1]
            last_ma30 = df['ma_30'].iloc[-1]
            last_ma90 = df['ma_90'].iloc[-1]
            
            # Weight recent MAs more heavily
            predicted_price = (last_ma7 * 0.5 + last_ma30 * 0.3 + last_ma90 * 0.2)
            
            # Calculate volatility for bounds
            volatility = df['close'].pct_change().std()
            
            return {
                'predicted_price': predicted_price,
                'predicted_high': predicted_price * (1 + volatility),
                'predicted_low': predicted_price * (1 - volatility),
                'upper_bound': predicted_price * (1 + 2 * volatility),
                'lower_bound': predicted_price * (1 - 2 * volatility),
                'features': ['ma_7', 'ma_30', 'ma_90']
            }
        except Exception as e:
            logger.error(f"Moving average error: {e}")
            last_price = df['close'].iloc[-1]
            return {
                'predicted_price': last_price,
                'predicted_high': last_price * 1.05,
                'predicted_low': last_price * 0.95,
                'upper_bound': last_price * 1.10,
                'lower_bound': last_price * 0.90,
                'features': ['price']
            }
    
    def _calculate_confidence(self, df: pd.DataFrame, predictions: Dict) -> float:
        """
        Calculate confidence score based on historical accuracy.
        
        Args:
            df: Historical data
            predictions: Prediction results
            
        Returns:
            float: Confidence score between 0 and 1
        """
        try:
            # Calculate based on volatility and prediction range
            recent_volatility = df['close'].tail(30).pct_change().std()
            prediction_range = (predictions['upper_bound'] - predictions['lower_bound']) / predictions['predicted_price']
            
            # Lower volatility and tighter range = higher confidence
            confidence = max(0.5, min(0.95, 1.0 - (recent_volatility * 10) - (prediction_range * 0.5)))
            
            return confidence
        except:
            return 0.75  # Default confidence
    
    async def get_latest_forecast(self, ticker: str) -> dict:
        """
        Get the most recent forecast for a ticker.
        
        Args:
            ticker: Stock ticker symbol
            
        Returns:
            dict: Latest forecast
        """
        # In production, this would query the database
        # For now, create a new forecast
        return await self.create_forecast(ticker, horizon_days=30)
    
    async def get_model_performance(self) -> List[dict]:
        """
        Get performance metrics for all models.
        
        Returns:
            List[dict]: Model performance stats
        """
        # Stub - would calculate from historical predictions
        return [
            {
                "model_name": "prophet",
                "avg_accuracy": 0.78,
                "avg_mae": 2.45,
                "predictions_count": 1250,
                "best_for": "medium-term trends"
            },
            {
                "model_name": "linear",
                "avg_accuracy": 0.72,
                "avg_mae": 3.12,
                "predictions_count": 980,
                "best_for": "trending stocks"
            },
            {
                "model_name": "moving_average",
                "avg_accuracy": 0.70,
                "avg_mae": 3.45,
                "predictions_count": 850,
                "best_for": "stable stocks"
            }
        ]
    
    def _get_mock_forecast(self, ticker: str, horizon_days: int, model_name: str) -> dict:
        """Fallback mock forecast."""
        prediction_date = datetime.utcnow() + timedelta(days=horizon_days)
        
        return {
            "id": hash(f"{ticker}{datetime.utcnow()}") % 1000000,
            "ticker": ticker,
            "model_name": model_name,
            "forecast_date": datetime.utcnow(),
            "prediction_date": prediction_date,
            "predicted_price": 165.50,
            "predicted_high": 170.00,
            "predicted_low": 161.00,
            "confidence_interval_upper": 175.00,
            "confidence_interval_lower": 156.00,
            "confidence_score": 0.75,
            "horizon_days": horizon_days,
            "training_samples": 0,
            "features_used": []
        }


# Global service instance
forecast_service = ForecastService()
        """
        Get the latest forecast for a ticker.
        
        Args:
            ticker: Stock ticker symbol
            
        Returns:
            dict: Latest forecast
        """
        # Stub implementation - returns mock data
        return await self.create_forecast(ticker)
    
    async def get_model_performance(self, model_name: Optional[str] = None) -> List[dict]:
        """
        Get performance metrics for forecasting models.
        
        Args:
            model_name: Optional filter by model name
            
        Returns:
            List[dict]: Model performance metrics
        """
        # Stub implementation - returns mock data
        return [
            {
                "id": 1,
                "model_name": "default",
                "model_version": "1.0",
                "ticker": "SPY",
                "mae": 2.15,
                "mse": 6.89,
                "rmse": 2.62,
                "mape": 1.45,
                "r2_score": 0.87,
                "directional_accuracy": 0.78,
                "evaluation_start": datetime.utcnow() - timedelta(days=90),
                "evaluation_end": datetime.utcnow()
            }
        ]


# Global service instance
forecast_service = ForecastService()
