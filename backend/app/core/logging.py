"""Logging configuration for the application."""
import logging
import sys
from pathlib import Path

from app.config import settings


def setup_logging() -> logging.Logger:
    """
    Configure application logging.
    
    Returns:
        logging.Logger: Configured logger
    """
    # Create logger
    logger = logging.getLogger("uptrade")
    logger.setLevel(logging.DEBUG if settings.debug else logging.INFO)
    
    # Remove existing handlers
    logger.handlers.clear()
    
    # Console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(logging.DEBUG if settings.debug else logging.INFO)
    
    # Format
    formatter = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S"
    )
    console_handler.setFormatter(formatter)
    
    # Add handler
    logger.addHandler(console_handler)
    
    return logger


# Global logger instance
logger = setup_logging()
