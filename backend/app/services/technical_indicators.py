"""Technical indicators service for stock analysis."""
from typing import Dict, List, Optional
import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)


class TechnicalIndicatorsService:
    """Service for calculating technical indicators."""
    
    def __init__(self):
        """Initialize technical indicators service."""
        pass
    
    def _get_historical_data(self, ticker: str, period: str = "1y") -> Optional[pd.DataFrame]:
        """Fetch historical data for a ticker."""
        try:
            stock = yf.Ticker(ticker)
            data = stock.history(period=period)
            if data.empty:
                logger.warning(f"No data available for {ticker}")
                return None
            return data
        except Exception as e:
            logger.error(f"Error fetching data for {ticker}: {e}")
            return None
    
    def calculate_rsi(self, prices: pd.Series, period: int = 14) -> pd.Series:
        """
        Calculate Relative Strength Index (RSI).
        
        Args:
            prices: Series of prices
            period: RSI period (default 14)
            
        Returns:
            pd.Series: RSI values
        """
        delta = prices.diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=period).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=period).mean()
        
        rs = gain / loss
        rsi = 100 - (100 / (1 + rs))
        return rsi
    
    def calculate_macd(
        self, 
        prices: pd.Series, 
        fast: int = 12, 
        slow: int = 26, 
        signal: int = 9
    ) -> Dict[str, pd.Series]:
        """
        Calculate MACD (Moving Average Convergence Divergence).
        
        Args:
            prices: Series of prices
            fast: Fast EMA period (default 12)
            slow: Slow EMA period (default 26)
            signal: Signal line period (default 9)
            
        Returns:
            dict: MACD line, signal line, and histogram
        """
        ema_fast = prices.ewm(span=fast, adjust=False).mean()
        ema_slow = prices.ewm(span=slow, adjust=False).mean()
        
        macd_line = ema_fast - ema_slow
        signal_line = macd_line.ewm(span=signal, adjust=False).mean()
        histogram = macd_line - signal_line
        
        return {
            "macd": macd_line,
            "signal": signal_line,
            "histogram": histogram
        }
    
    def calculate_bollinger_bands(
        self, 
        prices: pd.Series, 
        period: int = 20, 
        std_dev: float = 2.0
    ) -> Dict[str, pd.Series]:
        """
        Calculate Bollinger Bands.
        
        Args:
            prices: Series of prices
            period: Moving average period (default 20)
            std_dev: Standard deviation multiplier (default 2.0)
            
        Returns:
            dict: Upper band, middle band (SMA), lower band
        """
        sma = prices.rolling(window=period).mean()
        std = prices.rolling(window=period).std()
        
        upper_band = sma + (std * std_dev)
        lower_band = sma - (std * std_dev)
        
        return {
            "upper": upper_band,
            "middle": sma,
            "lower": lower_band
        }
    
    def calculate_atr(self, data: pd.DataFrame, period: int = 14) -> pd.Series:
        """
        Calculate Average True Range (ATR).
        
        Args:
            data: DataFrame with High, Low, Close columns
            period: ATR period (default 14)
            
        Returns:
            pd.Series: ATR values
        """
        high = data['High']
        low = data['Low']
        close = data['Close']
        
        tr1 = high - low
        tr2 = abs(high - close.shift())
        tr3 = abs(low - close.shift())
        
        tr = pd.concat([tr1, tr2, tr3], axis=1).max(axis=1)
        atr = tr.rolling(window=period).mean()
        
        return atr
    
    def calculate_stochastic(
        self, 
        data: pd.DataFrame, 
        k_period: int = 14, 
        d_period: int = 3
    ) -> Dict[str, pd.Series]:
        """
        Calculate Stochastic Oscillator.
        
        Args:
            data: DataFrame with High, Low, Close columns
            k_period: %K period (default 14)
            d_period: %D period (default 3)
            
        Returns:
            dict: %K and %D values
        """
        high = data['High']
        low = data['Low']
        close = data['Close']
        
        lowest_low = low.rolling(window=k_period).min()
        highest_high = high.rolling(window=k_period).max()
        
        k_percent = 100 * ((close - lowest_low) / (highest_high - lowest_low))
        d_percent = k_percent.rolling(window=d_period).mean()
        
        return {
            "k": k_percent,
            "d": d_percent
        }
    
    async def get_all_indicators(self, ticker: str, period: str = "6mo") -> Dict:
        """
        Calculate all technical indicators for a ticker.
        
        Args:
            ticker: Stock ticker
            period: Historical data period (default 6 months)
            
        Returns:
            dict: All technical indicators with current values
        """
        data = self._get_historical_data(ticker.upper(), period)
        
        if data is None or data.empty:
            return {
                "ticker": ticker,
                "error": "Unable to fetch historical data",
                "indicators": None
            }
        
        try:
            close_prices = data['Close']
            
            # Calculate all indicators
            rsi = self.calculate_rsi(close_prices)
            macd_data = self.calculate_macd(close_prices)
            bb_data = self.calculate_bollinger_bands(close_prices)
            atr = self.calculate_atr(data)
            stoch_data = self.calculate_stochastic(data)
            
            # Calculate moving averages
            sma_20 = close_prices.rolling(window=20).mean()
            sma_50 = close_prices.rolling(window=50).mean()
            sma_200 = close_prices.rolling(window=200).mean()
            ema_12 = close_prices.ewm(span=12, adjust=False).mean()
            ema_26 = close_prices.ewm(span=26, adjust=False).mean()
            
            # Get current price
            current_price = float(close_prices.iloc[-1])
            
            # Calculate volume metrics
            avg_volume_20 = float(data['Volume'].rolling(window=20).mean().iloc[-1])
            current_volume = float(data['Volume'].iloc[-1])
            volume_ratio = current_volume / avg_volume_20 if avg_volume_20 > 0 else 1.0
            
            # Generate signals
            signals = self._generate_signals(
                current_price,
                rsi.iloc[-1],
                macd_data["macd"].iloc[-1],
                macd_data["signal"].iloc[-1],
                bb_data["upper"].iloc[-1],
                bb_data["lower"].iloc[-1],
                sma_50.iloc[-1],
                sma_200.iloc[-1]
            )
            
            return {
                "ticker": ticker,
                "timestamp": datetime.utcnow(),
                "current_price": current_price,
                "indicators": {
                    "rsi": {
                        "value": float(rsi.iloc[-1]) if not pd.isna(rsi.iloc[-1]) else None,
                        "signal": "overbought" if rsi.iloc[-1] > 70 else "oversold" if rsi.iloc[-1] < 30 else "neutral"
                    },
                    "macd": {
                        "macd": float(macd_data["macd"].iloc[-1]),
                        "signal": float(macd_data["signal"].iloc[-1]),
                        "histogram": float(macd_data["histogram"].iloc[-1]),
                        "signal": "bullish" if macd_data["macd"].iloc[-1] > macd_data["signal"].iloc[-1] else "bearish"
                    },
                    "bollinger_bands": {
                        "upper": float(bb_data["upper"].iloc[-1]),
                        "middle": float(bb_data["middle"].iloc[-1]),
                        "lower": float(bb_data["lower"].iloc[-1]),
                        "position": "above_upper" if current_price > bb_data["upper"].iloc[-1] 
                                   else "below_lower" if current_price < bb_data["lower"].iloc[-1]
                                   else "within_bands"
                    },
                    "atr": {
                        "value": float(atr.iloc[-1]) if not pd.isna(atr.iloc[-1]) else None,
                        "volatility": "high" if atr.iloc[-1] > current_price * 0.03 else "low"
                    },
                    "stochastic": {
                        "k": float(stoch_data["k"].iloc[-1]) if not pd.isna(stoch_data["k"].iloc[-1]) else None,
                        "d": float(stoch_data["d"].iloc[-1]) if not pd.isna(stoch_data["d"].iloc[-1]) else None,
                        "signal": "overbought" if stoch_data["k"].iloc[-1] > 80 else "oversold" if stoch_data["k"].iloc[-1] < 20 else "neutral"
                    },
                    "moving_averages": {
                        "sma_20": float(sma_20.iloc[-1]) if not pd.isna(sma_20.iloc[-1]) else None,
                        "sma_50": float(sma_50.iloc[-1]) if not pd.isna(sma_50.iloc[-1]) else None,
                        "sma_200": float(sma_200.iloc[-1]) if not pd.isna(sma_200.iloc[-1]) else None,
                        "ema_12": float(ema_12.iloc[-1]),
                        "ema_26": float(ema_26.iloc[-1]),
                        "trend": "uptrend" if sma_50.iloc[-1] > sma_200.iloc[-1] else "downtrend"
                    },
                    "volume": {
                        "current": current_volume,
                        "average_20d": avg_volume_20,
                        "ratio": volume_ratio,
                        "signal": "high" if volume_ratio > 1.5 else "low" if volume_ratio < 0.5 else "normal"
                    }
                },
                "signals": signals,
                "summary": self._generate_summary(signals)
            }
        
        except Exception as e:
            logger.error(f"Error calculating indicators for {ticker}: {e}")
            return {
                "ticker": ticker,
                "error": str(e),
                "indicators": None
            }
    
    def _generate_signals(
        self,
        price: float,
        rsi: float,
        macd: float,
        macd_signal: float,
        bb_upper: float,
        bb_lower: float,
        sma_50: float,
        sma_200: float
    ) -> Dict[str, str]:
        """Generate trading signals based on indicators."""
        signals = {}
        
        # RSI signal
        if rsi < 30:
            signals["rsi"] = "buy"
        elif rsi > 70:
            signals["rsi"] = "sell"
        else:
            signals["rsi"] = "hold"
        
        # MACD signal
        if macd > macd_signal:
            signals["macd"] = "buy"
        else:
            signals["macd"] = "sell"
        
        # Bollinger Bands signal
        if price < bb_lower:
            signals["bollinger"] = "buy"
        elif price > bb_upper:
            signals["bollinger"] = "sell"
        else:
            signals["bollinger"] = "hold"
        
        # Moving average signal
        if price > sma_50 and sma_50 > sma_200:
            signals["trend"] = "strong_buy"
        elif price > sma_50:
            signals["trend"] = "buy"
        elif price < sma_50 and sma_50 < sma_200:
            signals["trend"] = "strong_sell"
        else:
            signals["trend"] = "sell"
        
        return signals
    
    def _generate_summary(self, signals: Dict[str, str]) -> str:
        """Generate overall trading summary from signals."""
        buy_signals = sum(1 for s in signals.values() if "buy" in s.lower())
        sell_signals = sum(1 for s in signals.values() if "sell" in s.lower())
        
        if buy_signals > sell_signals + 1:
            return "STRONG BUY"
        elif buy_signals > sell_signals:
            return "BUY"
        elif sell_signals > buy_signals + 1:
            return "STRONG SELL"
        elif sell_signals > buy_signals:
            return "SELL"
        else:
            return "HOLD"


# Global service instance
technical_indicators_service = TechnicalIndicatorsService()
