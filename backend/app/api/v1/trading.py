"""Trading API endpoints."""
from fastapi import APIRouter, Depends, Body, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_user
from app.schemas.trading import OrderCreate, OrderResponse, TradeResponse, LeaderboardEntry
from app.services.trading_service import trading_service

router = APIRouter(prefix="/trading", tags=["trading"])


@router.post("/order", response_model=dict)
async def create_order(
    request: OrderCreate = Body(...),
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Create a new trading order.
    
    Args:
        request: Order parameters
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        Created order
    """
    order = await trading_service.create_order(
        portfolio_id=request.portfolio_id,
        ticker=request.ticker.upper(),
        order_type=request.order_type,
        side=request.side,
        quantity=request.quantity,
        price=request.price,
        stop_price=request.stop_price
    )
    return order


@router.get("/positions/{portfolio_id}", response_model=list)
async def get_positions(
    portfolio_id: int,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get current positions for a portfolio.
    
    Args:
        portfolio_id: Portfolio ID
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        Current positions
    """
    positions = await trading_service.get_positions(portfolio_id)
    return positions


@router.get("/history/{portfolio_id}", response_model=list)
async def get_trade_history(
    portfolio_id: int,
    limit: int = Query(50, le=500),
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get trade history for a portfolio.
    
    Args:
        portfolio_id: Portfolio ID
        limit: Maximum number of trades
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        Trade history
    """
    history = await trading_service.get_trade_history(portfolio_id, limit=limit)
    return history


@router.get("/leaderboard", response_model=list)
async def get_leaderboard(
    limit: int = Query(10, le=100),
    db: AsyncSession = Depends(get_db)
):
    """
    Get trading leaderboard.
    
    Args:
        limit: Maximum number of entries
        db: Database session
        
    Returns:
        Leaderboard entries
    """
    leaderboard = await trading_service.get_leaderboard(limit=limit)
    return leaderboard
