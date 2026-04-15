"""
Earthion Backend Configuration
"""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings."""
    
    model_config = {"extra": "ignore", "env_file": ".env", "env_file_encoding": "utf-8"}

    # Go blockchain server URL
    GO_SERVER_URL: str = "http://localhost:8333"
    
    # API settings
    API_TITLE: str = "Earthion Blockchain API"
    API_VERSION: str = "1.0.0"
    
    # Server settings
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # Request timeout (seconds)
    REQUEST_TIMEOUT: int = 30
    
    # Validation
    MAX_TX_AMOUNT: int = 1000000000  # 1 billion max
    
    # CORS
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://localhost:5173"


settings = Settings()
