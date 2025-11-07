"""Trading service with paper trading simulation and risk management."""
from typing import List, Dict, Optional
from datetime import datetime, timedelta
import yfinance as yf
import logging
import random

logger = logging.getLogger(__name__)


class TradingService:
    """Service for paper trading execution and order management."""
    
    def __init__(self):
        """Initialize trading service with paper trading portfolio."""
        self.portfolios: Dict[int, Dict] = {}
        self.orders: Dict[int, Dict] = {}
        self.order_counter = 0
        self.position_counter = 0
        
    def _get_current_price(self, ticker: str) -> float:
        """Get current market price for a ticker."""
        try:
            stock = yf.Ticker(ticker)
            data = stock.history(period="1d", interval="1m")
            if not data.empty:
                return float(data['Close'].iloc[-1])
            # Fallback to daily data
            data = stock.history(period="5d")
            if not data.empty:
                return float(data['Close'].iloc[-1])
        except Exception as e:
            logger.error(f"Error getting price for {ticker}: {e}")
        return None
    
    def _initialize_portfolio(self, portfolio_id: int):
        """Initialize a paper trading portfolio."""
        if portfolio_id not in self.portfolios:
            self.portfolios[portfolio_id] = {
                "cash": 100000.00,  # Starting with $100k
                "positions": {},
                "trades": [],
                "total_pnl": 0.0,
                "created_at": datetime.utcnow()
            }
    
    async def create_order(
        self,
        portfolio_id: int,
        ticker: str,
        order_type: str,
        side: str,
        quantity: float,
        price: float = None,
        stop_price: float = None
    ) -> dict:
        """
        Create and execute a paper trading order.
        
        Args:
            portfolio_id: Portfolio ID
            ticker: Stock ticker
            order_type: Order type (market, limit, stop)
            side: Buy or sell
            quantity: Order quantity
            price: Limit price (optional)
            stop_price: Stop price (optional)
            
        Returns:
            dict: Created and executed order
        """
        self._initialize_portfolio(portfolio_id)
        self.order_counter += 1
        
        # Get current market price
        current_price = self._get_current_price(ticker.upper())
        if current_price is None:
            return {
                "id": self.order_counter,
                "status": "rejected",
                "message": "Unable to fetch current price",
                "ticker": ticker,
                "side": side,
                "quantity": quantity
            }
        
        # Determine execution price based on order type
        execution_price = current_price
        if order_type == "limit":
            if side == "buy" and price and current_price > price:
                return {
                    "id": self.order_counter,
                    "status": "pending",
                    "message": f"Limit price ${price} below current price ${current_price:.2f}",
                    "ticker": ticker
                }
            elif side == "sell" and price and current_price < price:
                return {
                    "id": self.order_counter,
                    "status": "pending",
                    "message": f"Limit price ${price} above current price ${current_price:.2f}",
                    "ticker": ticker
                }
            execution_price = price if price else current_price
        
        # Calculate order value and fees
        order_value = execution_price * quantity
        fee = max(1.00, order_value * 0.001)  # 0.1% fee, minimum $1
        
        portfolio = self.portfolios[portfolio_id]
        
        # Execute order
        if side == "buy":
            total_cost = order_value + fee
            if portfolio["cash"] < total_cost:
                return {
                    "id": self.order_counter,
                    "status": "rejected",
                    "message": f"Insufficient funds. Need ${total_cost:.2f}, have ${portfolio['cash']:.2f}",
                    "ticker": ticker
                }
            
            # Deduct cash
            portfolio["cash"] -= total_cost
            
            # Add/update position
            if ticker not in portfolio["positions"]:
                self.position_counter += 1
                portfolio["positions"][ticker] = {
                    "id": self.position_counter,
                    "ticker": ticker,
                    "quantity": quantity,
                    "average_price": execution_price,
                    "opened_at": datetime.utcnow()
                }
            else:
                pos = portfolio["positions"][ticker]
                total_qty = pos["quantity"] + quantity
                pos["average_price"] = (
                    (pos["average_price"] * pos["quantity"] + execution_price * quantity) / total_qty
                )
                pos["quantity"] = total_qty
        
        else:  # sell
            if ticker not in portfolio["positions"]:
                return {
                    "id": self.order_counter,
                    "status": "rejected",
                    "message": f"No position in {ticker} to sell",
                    "ticker": ticker
                }
            
            pos = portfolio["positions"][ticker]
            if pos["quantity"] < quantity:
                return {
                    "id": self.order_counter,
                    "status": "rejected",
                    "message": f"Insufficient shares. Have {pos['quantity']}, trying to sell {quantity}",
                    "ticker": ticker
                }
            
            # Calculate P&L
            pnl = (execution_price - pos["average_price"]) * quantity - fee
            portfolio["total_pnl"] += pnl
            
            # Update position
            pos["quantity"] -= quantity
            if pos["quantity"] == 0:
                del portfolio["positions"][ticker]
            
            # Add cash
            portfolio["cash"] += order_value - fee
        
        # Record trade
        trade = {
            "id": len(portfolio["trades"]) + 1,
            "order_id": self.order_counter,
            "ticker": ticker,
            "side": side,
            "quantity": quantity,
            "price": execution_price,
            "total_value": order_value,
            "fees": fee,
            "executed_at": datetime.utcnow()
        }
        portfolio["trades"].append(trade)
        
        # Create order record
        order = {
            "id": self.order_counter,
            "portfolio_id": portfolio_id,
            "ticker": ticker,
            "order_type": order_type,
            "side": side,
            "quantity": quantity,
            "price": price,
            "stop_price": stop_price,
            "filled_price": execution_price,
            "filled_quantity": quantity,
            "status": "filled",
            "fee": fee,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "filled_at": datetime.utcnow()
        }
        
        self.orders[self.order_counter] = order
        return order
    
    async def get_positions(self, portfolio_id: int) -> List[dict]:
        """
        Get current positions for a portfolio with real-time prices.
        
        Args:
            portfolio_id: Portfolio ID
            
        Returns:
            List[dict]: Current positions with P&L
        """
        self._initialize_portfolio(portfolio_id)
        portfolio = self.portfolios[portfolio_id]
        
        positions = []
        for ticker, pos in portfolio["positions"].items():
            current_price = self._get_current_price(ticker)
            if current_price:
                total_value = current_price * pos["quantity"]
                cost_basis = pos["average_price"] * pos["quantity"]
                unrealized_pnl = total_value - cost_basis
                unrealized_pnl_pct = (unrealized_pnl / cost_basis) * 100 if cost_basis > 0 else 0
                
                positions.append({
                    "id": pos["id"],
                    "portfolio_id": portfolio_id,
                    "ticker": ticker,
                    "quantity": pos["quantity"],
                    "average_price": pos["average_price"],
                    "current_price": current_price,
                    "total_value": total_value,
                    "unrealized_pnl": unrealized_pnl,
                    "unrealized_pnl_percent": unrealized_pnl_pct,
                    "opened_at": pos["opened_at"]
                })
        
        return positions
    
    async def get_trade_history(self, portfolio_id: int, limit: int = 50) -> List[dict]:
        """
        Get trade history for a portfolio.
        
        Args:
            portfolio_id: Portfolio ID
            limit: Maximum number of trades
            
        Returns:
            List[dict]: Trade history
        """
        self._initialize_portfolio(portfolio_id)
        portfolio = self.portfolios[portfolio_id]
        
        trades = portfolio["trades"][-limit:]
        return trades
    
    async def get_portfolio_summary(self, portfolio_id: int) -> dict:
        """Get portfolio summary with total value and P&L."""
        self._initialize_portfolio(portfolio_id)
        portfolio = self.portfolios[portfolio_id]
        
        positions_value = 0.0
        for ticker, pos in portfolio["positions"].items():
            current_price = self._get_current_price(ticker)
            if current_price:
                positions_value += current_price * pos["quantity"]
        
        total_value = portfolio["cash"] + positions_value
        total_return_pct = ((total_value - 100000) / 100000) * 100
        
        return {
            "portfolio_id": portfolio_id,
            "cash": portfolio["cash"],
            "positions_value": positions_value,
            "total_value": total_value,
            "total_return": total_return_pct,
            "realized_pnl": portfolio["total_pnl"],
            "num_positions": len(portfolio["positions"]),
            "num_trades": len(portfolio["trades"])
        }
    
    async def calculate_var(self, portfolio_id: int, confidence: float = 0.95) -> dict:
        """
        Calculate Value at Risk (VaR) for portfolio.
        
        Args:
            portfolio_id: Portfolio ID
            confidence: Confidence level (default 95%)
            
        Returns:
            dict: VaR metrics
        """
        # Simplified VaR calculation
        positions = await self.get_positions(portfolio_id)
        
        if not positions:
            return {"var_1day": 0.0, "var_10day": 0.0, "confidence": confidence}
        
        total_value = sum(p["total_value"] for p in positions)
        
        # Assume 2% daily volatility (simplified)
        daily_volatility = 0.02
        z_score = 1.645 if confidence == 0.95 else 2.326  # 95% or 99%
        
        var_1day = total_value * daily_volatility * z_score
        var_10day = var_1day * (10 ** 0.5)  # Square root of time rule
        
        return {
            "portfolio_value": total_value,
            "var_1day": var_1day,
            "var_10day": var_10day,
            "confidence": confidence,
            "method": "parametric"
        }
    
    async def get_leaderboard(self, limit: int = 10) -> List[dict]:
        """
        Get trading leaderboard based on real portfolio performance.
        
        Args:
            limit: Maximum number of entries
            
        Returns:
            List[dict]: Leaderboard entries
        """
        leaderboard = []
        
        for portfolio_id, portfolio in self.portfolios.items():
            summary = await self.get_portfolio_summary(portfolio_id)
            
            # Calculate Sharpe ratio (simplified)
            returns = summary["total_return"] / 100
            volatility = 0.15  # Assumed 15% annualized volatility
            risk_free = 0.02
            sharpe = (returns - risk_free) / volatility if volatility > 0 else 0
            
            leaderboard.append({
                "portfolio_id": portfolio_id,
                "portfolio_name": f"Portfolio {portfolio_id}",
                "total_return": summary["total_return"],
                "total_value": summary["total_value"],
                "sharpe_ratio": sharpe,
                "total_trades": summary["num_trades"],
                "num_positions": summary["num_positions"]
            })
        
        # Sort by total return
        leaderboard.sort(key=lambda x: x["total_return"], reverse=True)
        
        # Add ranks
        for i, entry in enumerate(leaderboard[:limit]):
            entry["rank"] = i + 1
        
        return leaderboard[:limit]


# Global service instance
trading_service = TradingService()
