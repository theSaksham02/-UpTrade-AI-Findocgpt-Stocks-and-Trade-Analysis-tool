"""
Configuration module for FinDocGPT
Handles loading environment variables and API keys
"""

import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def get_google_api_key():
    """
    Get Google API key from environment variables
    
    Returns:
        str: Google API key
        
    Raises:
        ValueError: If API key is not found
    """
    api_key = os.getenv('GOOGLE_API_KEY')
    if not api_key:
        raise ValueError(
            "GOOGLE_API_KEY not found in environment variables. "
            "Please check your .env file."
        )
    return api_key

def validate_api_key():
    """
    Validate that the API key is properly configured
    
    Returns:
        bool: True if API key is available, False otherwise
    """
    try:
        api_key = get_google_api_key()
        return bool(api_key and len(api_key) > 0)
    except ValueError:
        return False

# Make API key available at module level for easy import
try:
    GOOGLE_API_KEY = get_google_api_key()
    print("✅ Google API key loaded successfully")
except ValueError as e:
    GOOGLE_API_KEY = None
    print(f"❌ Error loading API key: {e}")
