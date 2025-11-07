"""Forecasting and prediction models."""
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Float, JSON, Text

from app.database import Base


class Forecast(Base):
    """Stock price forecast model."""
    
    __tablename__ = "forecasts"
    
    id = Column(Integer, primary_key=True, index=True)
    ticker = Column(String, index=True, nullable=False)
    
    # Forecast information
    model_name = Column(String, nullable=False)
    model_version = Column(String)
    forecast_date = Column(DateTime, index=True, nullable=False)
    prediction_date = Column(DateTime, nullable=False)
    
    # Predictions
    predicted_price = Column(Float, nullable=False)
    predicted_high = Column(Float)
    predicted_low = Column(Float)
    confidence_interval_upper = Column(Float)
    confidence_interval_lower = Column(Float)
    confidence_score = Column(Float)
    
    # Features used
    features_used = Column(JSON, default=dict)
    
    # Model parameters
    model_params = Column(JSON, default=dict)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    def __repr__(self):
        return f"<Forecast(ticker={self.ticker}, model={self.model_name}, price={self.predicted_price})>"


class ModelPerformance(Base):
    """Model performance tracking."""
    
    __tablename__ = "model_performance"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Model information
    model_name = Column(String, index=True, nullable=False)
    model_version = Column(String)
    ticker = Column(String, index=True)
    
    # Performance metrics
    mae = Column(Float)  # Mean Absolute Error
    mse = Column(Float)  # Mean Squared Error
    rmse = Column(Float)  # Root Mean Squared Error
    mape = Column(Float)  # Mean Absolute Percentage Error
    r2_score = Column(Float)  # R-squared
    
    # Additional metrics
    directional_accuracy = Column(Float)
    
    # Evaluation period
    evaluation_start = Column(DateTime)
    evaluation_end = Column(DateTime)
    
    # Metadata
    extra_data = Column(JSON, default=dict)
    notes = Column(Text)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    def __repr__(self):
        return f"<ModelPerformance(model={self.model_name}, ticker={self.ticker}, rmse={self.rmse})>"
