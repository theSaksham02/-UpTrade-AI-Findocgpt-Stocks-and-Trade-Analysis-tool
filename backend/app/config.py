"""Application configuration using Pydantic Settings."""
from typing import Optional
from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    """Application settings with environment variable support."""
    
    # App Configuration
    app_name: str = "UpTrade AI Backend"
    app_version: str = "1.0.0"
    debug: bool = Field(default=False, description="Debug mode")
    
    # Database Configuration
    database_url: str = Field(
        default="postgresql+asyncpg://postgres:postgres@localhost:5432/uptrade",
        description="PostgreSQL connection URL"
    )
    
    # Redis Configuration
    redis_url: str = Field(
        default="redis://localhost:6379",
        description="Redis connection URL"
    )
    
    # API Keys
    alpaca_api_key: Optional[str] = Field(default=None, description="Alpaca API key")
    alpaca_secret_key: Optional[str] = Field(default=None, description="Alpaca secret key")
    polygon_api_key: Optional[str] = Field(default=None, description="Polygon API key")
    news_api_key: Optional[str] = Field(default=None, description="News API key")
    google_api_key: Optional[str] = Field(default=None, description="Google AI API key")
    
    # Security
    secret_key: str = Field(
        default="your-secret-key-change-in-production",
        description="Secret key for JWT encoding"
    )
    algorithm: str = Field(default="HS256", description="JWT algorithm")
    access_token_expire_minutes: int = Field(default=30, description="Access token expiration in minutes")
    
    # CORS
    cors_origins: list = Field(
        default=["http://localhost:3000", "http://localhost:5173", "http://localhost:8501"],
        description="Allowed CORS origins"
    )
    
    class Config:
        """Pydantic configuration."""
        env_file = ".env"
        case_sensitive = False


# Global settings instance
settings = Settings()
