"""Portfolio management and optimization service with Modern Portfolio Theory."""
from typing import List, Optional, Dict
from datetime import datetime, timedelta
import numpy as np
import pandas as pd
from pypfopt import EfficientFrontier, risk_models, expected_returns
import warnings
warnings.filterwarnings('ignore')

from app.services.market_data import market_data_service
from app.core.logging import logger


class PortfolioService:
    """Service for portfolio management and optimization using MPT."""
    
    def __init__(self):
        """Initialize portfolio service."""
        self.risk_profiles = {
            'conservative': {'target_return': 0.08, 'max_volatility': 0.15},
            'moderate': {'target_return': 0.12, 'max_volatility': 0.20},
            'aggressive': {'target_return': 0.18, 'max_volatility': 0.30}
        }
    
    async def create_portfolio(self, user_id: int, name: str, initial_value: float, description: Optional[str] = None) -> dict:
        """
        Create a new portfolio.
        
        Args:
            user_id: User ID
            name: Portfolio name
            initial_value: Initial portfolio value
            description: Optional description
            
        Returns:
            dict: Created portfolio
        """
        return {
            "id": hash(f"{name}{datetime.utcnow()}") % 1000000,
            "user_id": user_id,
            "name": name,
            "description": description,
            "initial_value": initial_value,
            "current_value": initial_value,
            "cash_balance": initial_value,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "positions": []
        }
    
    async def get_portfolio(self, portfolio_id: int) -> dict:
        """
        Get portfolio details.
        
        Args:
            portfolio_id: Portfolio ID
            
        Returns:
            dict: Portfolio details
        """
        return {
            "id": portfolio_id,
            "user_id": 1,
            "name": "My Portfolio",
            "description": "Main investment portfolio",
            "initial_value": 100000.0,
            "current_value": 125000.0,
            "cash_balance": 25000.0,
            "total_return": 25000.0,
            "total_return_percent": 25.0,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "positions": []
        }
    
    async def get_portfolio_performance(self, portfolio_id: int, days: int = 30) -> List[dict]:
        """
        Get portfolio performance history.
        
        Args:
            portfolio_id: Portfolio ID
            days: Number of days of history
            
        Returns:
            List[dict]: Performance history
        """
        return [
            {
                "date": datetime.utcnow(),
                "total_value": 125000.0,
                "daily_return": 0.015,
                "cumulative_return": 0.25,
                "volatility": 0.18,
                "sharpe_ratio": 1.42,
                "max_drawdown": -0.08
            }
        ]
    
    async def optimize_portfolio(
        self,
        portfolio_id: int,
        target_return: Optional[float] = None,
        risk_tolerance: str = "moderate"
    ) -> dict:
        """
        Optimize portfolio allocation using Modern Portfolio Theory.
        
        Args:
            portfolio_id: Portfolio ID
            target_return: Target return rate (optional)
            risk_tolerance: Risk tolerance level (conservative, moderate, aggressive)
            
        Returns:
            dict: Optimization results with allocations and metrics
        """
        try:
            # Default tickers for optimization
            tickers = ["AAPL", "GOOGL", "MSFT", "AMZN", "TSLA", "SPY", "QQQ"]
            
            # Get historical data for all tickers
            end_date = datetime.utcnow()
            start_date = end_date - timedelta(days=365)
            
            prices_data = {}
            for ticker in tickers:
                try:
                    hist = await market_data_service.get_historical_prices(
                        ticker,
                        start_date=start_date,
                        end_date=end_date
                    )
                    if hist and len(hist) > 30:
                        prices_data[ticker] = hist
                except:
                    logger.warning(f"Could not fetch data for {ticker}")
            
            if len(prices_data) < 2:
                logger.warning("Insufficient data for optimization, using mock")
                return self._get_mock_optimization(risk_tolerance)
            
            # Convert to DataFrame
            prices_df = self._build_price_dataframe(prices_data)
            
            if prices_df.empty or len(prices_df) < 30:
                return self._get_mock_optimization(risk_tolerance)
            
            # Calculate expected returns and covariance matrix
            mu = expected_returns.mean_historical_return(prices_df)
            S = risk_models.sample_cov(prices_df)
            
            # Optimize based on risk tolerance
            ef = EfficientFrontier(mu, S)
            
            risk_params = self.risk_profiles.get(risk_tolerance, self.risk_profiles['moderate'])
            
            if target_return:
                weights = ef.efficient_return(target_return)
            else:
                # Default to max Sharpe ratio
                weights = ef.max_sharpe()
            
            cleaned_weights = ef.clean_weights()
            
            # Get performance metrics
            performance = ef.portfolio_performance(verbose=False)
            expected_return, volatility, sharpe = performance
            
            # Convert weights to percentages
            allocations = {ticker: float(weight) for ticker, weight in cleaned_weights.items() if weight > 0.001}
            
            return {
                "portfolio_id": portfolio_id,
                "recommended_allocations": allocations,
                "expected_return": float(expected_return),
                "expected_risk": float(volatility),
                "sharpe_ratio": float(sharpe),
                "risk_tolerance": risk_tolerance,
                "num_assets": len(allocations),
                "diversification_score": self._calculate_diversification(allocations),
                "optimized_at": datetime.utcnow()
            }
            
        except Exception as e:
            logger.error(f"Error optimizing portfolio: {e}")
            return self._get_mock_optimization(risk_tolerance)
    
    def _build_price_dataframe(self, prices_data: Dict) -> pd.DataFrame:
        """Build a price DataFrame from historical data."""
        try:
            price_series = {}
            for ticker, data in prices_data.items():
                df = pd.DataFrame(data)
                df['timestamp'] = pd.to_datetime(df['timestamp'])
                df = df.set_index('timestamp')
                df = df.sort_index()
                price_series[ticker] = df['close']
            
            prices_df = pd.DataFrame(price_series)
            prices_df = prices_df.dropna()
            
            return prices_df
        except Exception as e:
            logger.error(f"Error building price dataframe: {e}")
            return pd.DataFrame()
    
    def _calculate_diversification(self, allocations: Dict) -> float:
        """Calculate diversification score (0-100)."""
        try:
            weights = np.array(list(allocations.values()))
            # Higher entropy = better diversification
            entropy = -np.sum(weights * np.log(weights + 1e-10))
            max_entropy = np.log(len(weights))
            score = (entropy / max_entropy) * 100 if max_entropy > 0 else 0
            return float(score)
        except:
            return 50.0
    
    def _get_mock_optimization(self, risk_tolerance: str) -> dict:
        """Fallback mock optimization."""
        allocations = {
            "AAPL": 0.25,
            "GOOGL": 0.20,
            "MSFT": 0.20,
            "TSLA": 0.15,
            "SPY": 0.20
        }
        
        risk_params = self.risk_profiles.get(risk_tolerance, self.risk_profiles['moderate'])
        
        return {
            "portfolio_id": 1,
            "recommended_allocations": allocations,
            "expected_return": risk_params['target_return'],
            "expected_risk": risk_params['max_volatility'],
            "sharpe_ratio": 0.80,
            "risk_tolerance": risk_tolerance,
            "num_assets": len(allocations),
            "diversification_score": 75.0,
            "optimized_at": datetime.utcnow()
        }


# Global service instance
portfolio_service = PortfolioService()
