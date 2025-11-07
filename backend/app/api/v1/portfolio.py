"""Portfolio management API endpoints."""
from fastapi import APIRouter, Depends, Body, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_user
from app.schemas.portfolio import (
    PortfolioCreate,
    PortfolioResponse,
    PortfolioPerformanceResponse,
    PortfolioOptimizationRequest,
    PortfolioOptimizationResponse
)
from app.services.portfolio_service import portfolio_service

router = APIRouter(prefix="/portfolio", tags=["portfolio"])


@router.post("", response_model=dict)
async def create_portfolio(
    request: PortfolioCreate = Body(...),
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Create a new portfolio.
    
    Args:
        request: Portfolio creation parameters
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        Created portfolio
    """
    portfolio = await portfolio_service.create_portfolio(
        user_id=current_user["id"],
        name=request.name,
        initial_value=request.initial_value,
        description=request.description
    )
    return portfolio


@router.get("/{portfolio_id}", response_model=dict)
async def get_portfolio(
    portfolio_id: int,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get portfolio details.
    
    Args:
        portfolio_id: Portfolio ID
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        Portfolio details
    """
    portfolio = await portfolio_service.get_portfolio(portfolio_id)
    return portfolio


@router.get("/{portfolio_id}/performance", response_model=list)
async def get_portfolio_performance(
    portfolio_id: int,
    days: int = Query(30, le=365),
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get portfolio performance history.
    
    Args:
        portfolio_id: Portfolio ID
        days: Number of days of history
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        Performance history
    """
    performance = await portfolio_service.get_portfolio_performance(portfolio_id, days=days)
    return performance


@router.post("/{portfolio_id}/optimize", response_model=dict)
async def optimize_portfolio(
    portfolio_id: int,
    request: PortfolioOptimizationRequest = Body(...),
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Optimize portfolio allocation.
    
    Args:
        portfolio_id: Portfolio ID
        request: Optimization parameters
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        Optimization results
    """
    optimization = await portfolio_service.optimize_portfolio(
        portfolio_id=portfolio_id,
        target_return=request.target_return,
        risk_tolerance=request.risk_tolerance
    )
    return optimization
