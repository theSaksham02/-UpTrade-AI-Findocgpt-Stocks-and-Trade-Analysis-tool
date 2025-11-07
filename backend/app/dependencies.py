"""FastAPI dependencies for dependency injection."""
from typing import AsyncGenerator
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from redis import asyncio as aioredis

from app.database import get_db
from app.config import settings


async def get_redis() -> AsyncGenerator[aioredis.Redis, None]:
    """
    Dependency to get Redis connection.
    
    Yields:
        Redis: Redis client instance
    """
    redis = await aioredis.from_url(settings.redis_url, decode_responses=True)
    try:
        yield redis
    finally:
        await redis.close()


async def get_current_user(db: AsyncSession = Depends(get_db)):
    """
    Dependency to get current authenticated user.
    Stub implementation for now.
    
    Args:
        db: Database session
        
    Returns:
        dict: User information
    """
    # TODO: Implement JWT token validation and user retrieval
    return {"id": 1, "email": "user@example.com", "role": "user"}
